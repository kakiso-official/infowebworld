'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

type Category = { id: number; name: string; slug: string; level: number; parentId: number | null; parentName?: string }
type SectionMap = Record<number, { sections: Record<string, boolean>; generatedAt: string }>
type StatusInfo = { total: number; generated: number; sectionMap: SectionMap }

const SECTIONS = [
  { key: 'ai_summary', label: 'AI Summary', icon: '✦', color: '#7C3AED' },
  { key: 'rich_description', label: 'About', icon: '📝', color: '#3B82F6' },
  { key: 'buyers_guide', label: "Buyer's Guide", icon: '🔍', color: '#14B8A6' },
  { key: 'use_cases', label: 'Use Cases', icon: '💼', color: '#F59E0B' },
  { key: 'comparisons', label: 'Alternatives', icon: '⚖️', color: '#8B5CF6' },
  { key: 'long_tail_keywords', label: 'Keywords', icon: '🏷️', color: '#E8553D' },
  { key: 'complementary_categories', label: 'Related', icon: '🔗', color: '#2FAE6A' },
  { key: 'extended_faq', label: 'FAQ', icon: '❓', color: '#6366F1' },
] as const

const SECTOR_COLORS: Record<string, string> = {
  'ai-ml': '#8B5CF6',
  'software-saas': '#3B82F6',
  'it-services-agencies': '#14B8A6',
  'startups-innovation': '#E8553D',
  'local-business': '#F59E0B',
  'professional-services': '#2FAE6A',
}

const PAGE_SIZE = 50

type SortOption = 'name-az' | 'name-za' | 'most-complete' | 'least-complete' | 'recent-first'
type GenStatusFilter = 'all' | 'complete' | 'partial' | 'none' | 'missing-faq' | 'missing-about' | 'missing-ai-summary'

function relativeTime(dateStr: string): string {
  if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const now = Date.now()
  const diff = now - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function SeoContentAdmin() {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [expandedCat, setExpandedCat] = useState<number | null>(null)
  const [generatingKey, setGeneratingKey] = useState<string | null>(null)
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchSection, setBatchSection] = useState<string>('all')
  const [batchCurrentCat, setBatchCurrentCat] = useState<string>('')
  const [batchCurrentSec, setBatchCurrentSec] = useState<string>('')
  const stopRef = useRef(false)
  const [batchDone, setBatchDone] = useState(0)
  const [batchTotal, setBatchTotal] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [genStatusFilter, setGenStatusFilter] = useState<GenStatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name-az')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  const addLog = useCallback((msg: string) => {
    setLog(l => { const n = [...l, msg]; if (n.length > 500) n.splice(0, n.length - 500); return n })
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50)
  }, [])

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => {
      const cats = (d.categories || []).map((c: any) => ({
        id: Number(c.id), name: String(c.name), slug: String(c.slug),
        level: Number(c.level), parentId: c.parent_id ? Number(c.parent_id) : null,
        parentName: c.parent_name ? String(c.parent_name) : undefined,
      }))
      setAllCategories(cats)
    })
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    fetch('/api/admin/generate-seo-content').then(r => r.json()).then(setStatus).catch(() => {})
  }

  // Derive L1 sectors
  const sectors = useMemo(() => allCategories.filter(c => c.level === 1), [allCategories])

  // Build L1/L2/L3 for display (L1 sectors now eligible for Gemini content)
  const l2l3 = useMemo(() => allCategories.filter(c => c.level >= 1), [allCategories])

  // Find sector for any category
  const getSectorSlug = useCallback((cat: Category): string => {
    if (cat.level === 1) return cat.slug
    if (cat.level === 2) {
      const parent = allCategories.find(c => c.id === cat.parentId)
      return parent?.slug || ''
    }
    // L3: parent is L2, grandparent is L1
    const parent = allCategories.find(c => c.id === cat.parentId)
    if (!parent) return ''
    const gp = allCategories.find(c => c.id === parent.parentId)
    return gp?.slug || ''
  }, [allCategories])

  const catSections = useCallback((catId: number) => status?.sectionMap?.[catId]?.sections || {}, [status])
  const sectionCount = useCallback((catId: number) => Object.values(catSections(catId)).filter(Boolean).length, [catSections])

  // Filtered categories (BEFORE pagination)
  const filteredCats = useMemo(() => {
    let cats = l2l3
    if (sectorFilter !== 'all') cats = cats.filter(c => getSectorSlug(c) === sectorFilter)
    if (levelFilter !== 'all') cats = cats.filter(c => c.level === Number(levelFilter))
    if (search.trim()) {
      const q = search.toLowerCase()
      cats = cats.filter(c => c.name.toLowerCase().includes(q) || (c.parentName || '').toLowerCase().includes(q))
    }
    // Generation status filter
    if (genStatusFilter !== 'all') {
      cats = cats.filter(c => {
        const count = sectionCount(c.id)
        const secs = catSections(c.id)
        switch (genStatusFilter) {
          case 'complete': return count === 8
          case 'partial': return count >= 1 && count <= 7
          case 'none': return count === 0
          case 'missing-faq': return !secs['extended_faq']
          case 'missing-about': return !secs['rich_description']
          case 'missing-ai-summary': return !secs['ai_summary']
          default: return true
        }
      })
    }
    // Sorting
    cats = [...cats].sort((a, b) => {
      switch (sortBy) {
        case 'name-az': return a.name.localeCompare(b.name)
        case 'name-za': return b.name.localeCompare(a.name)
        case 'most-complete': return sectionCount(b.id) - sectionCount(a.id) || a.name.localeCompare(b.name)
        case 'least-complete': return sectionCount(a.id) - sectionCount(b.id) || a.name.localeCompare(b.name)
        case 'recent-first': {
          const aTime = status?.sectionMap?.[a.id]?.generatedAt || ''
          const bTime = status?.sectionMap?.[b.id]?.generatedAt || ''
          if (!aTime && !bTime) return a.name.localeCompare(b.name)
          if (!aTime) return 1
          if (!bTime) return -1
          return new Date(bTime).getTime() - new Date(aTime).getTime()
        }
        default: return 0
      }
    })
    return cats
  }, [l2l3, sectorFilter, levelFilter, search, getSectorSlug, genStatusFilter, sortBy, sectionCount, catSections, status])

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [search, sectorFilter, levelFilter, genStatusFilter, sortBy])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCats.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, filteredCats.length)
  const paginatedCats = filteredCats.slice(startIdx, endIdx)

  // Sector stats
  const sectorStats = useMemo(() => {
    const map: Record<string, { total: number; generated: number }> = {}
    for (const c of l2l3) {
      const ss = getSectorSlug(c)
      if (!map[ss]) map[ss] = { total: 0, generated: 0 }
      map[ss].total++
      const secs = status?.sectionMap?.[c.id]?.sections
      if (secs && Object.values(secs).some(Boolean)) map[ss].generated++
    }
    return map
  }, [l2l3, status, getSectorSlug])

  /* -- Generate single section -- */
  const genSection = async (catId: number, catName: string, section: string) => {
    const key = `${catId}:${section}`
    setGeneratingKey(key)
    addLog(`... ${catName} -> ${SECTIONS.find(s => s.key === section)?.label || section}...`)
    try {
      const res = await fetch('/api/admin/generate-seo-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, section }),
      })
      const data = await res.json()
      addLog(data.ok ? `  Done` : `  FAIL: ${data.error}`)
    } catch (err) { addLog(`  FAIL: ${err}`) }
    setGeneratingKey(null)
    refreshStatus()
  }

  /* -- Generate all sections for one category -- */
  const genAllForCat = async (catId: number, catName: string) => {
    setGeneratingKey(String(catId))
    addLog(`\n== ${catName} -- all sections ==`)
    for (const sec of SECTIONS) {
      if (stopRef.current) { addLog('  Stopped'); break }
      setGeneratingKey(`${catId}:${sec.key}`)
      addLog(`  ... ${sec.label}...`)
      try {
        const res = await fetch('/api/admin/generate-seo-content', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: catId, section: sec.key }),
        })
        const data = await res.json()
        addLog(data.ok ? `     OK` : `     FAIL: ${data.error}`)
      } catch (err) { addLog(`     FAIL: ${err}`) }
    }
    setGeneratingKey(null)
    refreshStatus()
  }

  /* -- Batch -- */
  const startBatch = async (scope: 'page' | 'all') => {
    stopRef.current = false
    setBatchRunning(true)
    setBatchDone(0)
    setBatchCurrentCat('')
    setBatchCurrentSec('')
    const secs = batchSection === 'all' ? SECTIONS.map(s => s.key) : [batchSection]
    const cats = scope === 'page' ? paginatedCats : filteredCats
    const total = cats.length * secs.length
    setBatchTotal(total)
    const scopeLabel = scope === 'page' ? `this page (${cats.length})` : `all ${cats.length} filtered`
    const secLabel = batchSection === 'all' ? 'All sections' : (SECTIONS.find(s => s.key === batchSection)?.label || batchSection)
    addLog(`\n==== Batch: ${secLabel} for ${scopeLabel} ====`)
    let done = 0
    for (const cat of cats) {
      if (stopRef.current) { addLog(`\nStopped at ${done}/${total}`); break }
      for (const sec of secs) {
        if (stopRef.current) break
        const secLabel2 = SECTIONS.find(s => s.key === sec)?.label || sec
        setGeneratingKey(`${cat.id}:${sec}`)
        setBatchCurrentCat(cat.name)
        setBatchCurrentSec(secLabel2)
        addLog(`[${done + 1}/${total}] ${cat.name} -> ${secLabel2}`)
        try {
          const res = await fetch('/api/admin/generate-seo-content', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: cat.id, section: sec }),
          })
          const data = await res.json()
          addLog(data.ok ? `  OK` : `  FAIL: ${data.error}`)
        } catch (err) { addLog(`  FAIL: ${err}`) }
        done++
        setBatchDone(done)
      }
    }
    setGeneratingKey(null)
    setBatchRunning(false)
    setBatchCurrentCat('')
    setBatchCurrentSec('')
    addLog(`\n==== ${stopRef.current ? 'Stopped' : 'Complete'}: ${done}/${total} ====`)
    refreshStatus()
  }

  const stopBatch = () => { stopRef.current = true; addLog('Stopping after current...') }

  const isGenerating = (catId: number, section?: string) => {
    if (!generatingKey) return false
    if (section) return generatingKey === `${catId}:${section}`
    return generatingKey.startsWith(`${catId}`)
  }

  const pct = status ? Math.round((status.generated / (status.total || 1)) * 100) : 0
  const batchPct = batchTotal > 0 ? Math.round((batchDone / batchTotal) * 100) : 0

  // Page number range for pagination
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = []
    if (safePage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (safePage >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = safePage - 1; i <= safePage + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const S: React.CSSProperties = { fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 1020, margin: '0 auto', padding: '1.5rem' }
  const card: React.CSSProperties = { background: '#fff', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }
  const selectStyle: React.CSSProperties = { padding: '.4rem .6rem', borderRadius: 8, border: '1.5px solid rgba(0,0,0,.1)', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit', background: '#fafafa', cursor: 'pointer' }
  const btnBase: React.CSSProperties = { borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }

  return (
    <div style={S}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.25rem' }}>SEO Content Generator</h1>
      <p style={{ color: '#666', fontSize: '.82rem', marginBottom: '1.25rem' }}>Generate Gemini-powered content per section. Stop anytime -- completed work is saved.</p>

      {/* -- Global stats -- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem', marginBottom: '1rem' }}>
        {[
          { val: status?.generated || 0, label: 'With Content', color: 'var(--h-accent, #E8553D)' },
          { val: status?.total || 0, label: 'Total Categories', color: '#333' },
          { val: `${pct}%`, label: 'Coverage', color: '#2FAE6A' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: '#888', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* -- Sector navigation pills -- */}
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => setSectorFilter('all')}
          style={{
            padding: '.4rem .85rem', borderRadius: 999, border: sectorFilter === 'all' ? '2px solid #333' : '1.5px solid rgba(0,0,0,.1)',
            background: sectorFilter === 'all' ? '#1a1a1a' : '#fff', color: sectorFilter === 'all' ? '#fff' : '#333',
            fontWeight: 700, fontSize: '.72rem', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >All Sectors ({l2l3.length})</button>
        {sectors.map(s => {
          const sc = SECTOR_COLORS[s.slug] || '#888'
          const st = sectorStats[s.slug]
          const active = sectorFilter === s.slug
          return (
            <button key={s.slug} onClick={() => setSectorFilter(s.slug)}
              style={{
                padding: '.4rem .85rem', borderRadius: 999,
                border: active ? `2px solid ${sc}` : '1.5px solid rgba(0,0,0,.1)',
                background: active ? sc : '#fff', color: active ? '#fff' : '#333',
                fontWeight: 700, fontSize: '.72rem', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {s.name.replace(' &', ',')} ({st?.total || 0})
              {st && st.generated > 0 && (
                <span style={{ marginLeft: 4, padding: '1px 5px', borderRadius: 4, fontSize: '.6rem', fontWeight: 800, background: active ? 'rgba(255,255,255,.25)' : `${sc}15`, color: active ? '#fff' : sc }}>
                  {st.generated}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* -- Filters row: Search + Level + Gen Status + Sort -- */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search categories..."
          style={{ flex: '1 1 160px', padding: '.45rem .75rem', borderRadius: 8, border: '1.5px solid rgba(0,0,0,.1)', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit', background: '#fafafa', outline: 'none', minWidth: 120 }}
        />
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Levels</option>
          <option value="1">L1 Only</option>
          <option value="2">L2 Only</option>
          <option value="3">L3 Only</option>
        </select>
        <select value={genStatusFilter} onChange={e => setGenStatusFilter(e.target.value as GenStatusFilter)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="complete">Complete (8/8)</option>
          <option value="partial">Partial (1-7)</option>
          <option value="none">None (0/8)</option>
          <option value="missing-faq">Missing FAQ</option>
          <option value="missing-about">Missing About</option>
          <option value="missing-ai-summary">Missing AI Summary</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} style={selectStyle}>
          <option value="name-az">Name A-Z</option>
          <option value="name-za">Name Z-A</option>
          <option value="most-complete">Most Complete</option>
          <option value="least-complete">Least Complete</option>
          <option value="recent-first">Recently Generated</option>
        </select>
      </div>

      {/* -- Batch controls row -- */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#888', letterSpacing: '.03em', textTransform: 'uppercase' }}>Batch</span>
        <select value={batchSection} onChange={e => setBatchSection(e.target.value)} disabled={batchRunning} style={selectStyle}>
          <option value="all">All Sections</option>
          {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
        </select>
        {!batchRunning ? (
          <>
            <button onClick={() => startBatch('page')} disabled={!!generatingKey || paginatedCats.length === 0}
              style={{ ...btnBase, padding: '.45rem .85rem', background: generatingKey ? '#ccc' : '#1a1a1a', color: '#fff', cursor: generatingKey ? 'default' : 'pointer' }}>
              This page ({paginatedCats.length})
            </button>
            <button onClick={() => startBatch('all')} disabled={!!generatingKey || filteredCats.length === 0}
              style={{ ...btnBase, padding: '.45rem .85rem', background: generatingKey ? '#ccc' : 'var(--h-accent, #E8553D)', color: '#fff', cursor: generatingKey ? 'default' : 'pointer' }}>
              All {filteredCats.length} filtered
            </button>
          </>
        ) : (
          <button onClick={stopBatch}
            style={{ ...btnBase, padding: '.45rem 1rem', background: '#DC2626', color: '#fff' }}>
            Stop
          </button>
        )}
        {batchRunning && (
          <span style={{ fontSize: '.72rem', color: '#666', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
            <span style={{
              display: 'inline-block', width: 10, height: 10, border: '2px solid #E8553D',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'iww-spin 0.8s linear infinite',
            }} />
            {batchDone}/{batchTotal} ({batchPct}%)
            {batchCurrentCat && (
              <span style={{ color: '#999' }}>
                {' '}{batchCurrentCat} / {batchCurrentSec}
              </span>
            )}
          </span>
        )}
      </div>

      {batchRunning && (
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,.06)', overflow: 'hidden', marginBottom: '.75rem' }}>
          <div style={{ width: `${batchPct}%`, height: '100%', background: 'var(--h-accent, #E8553D)', borderRadius: 2, transition: 'width 300ms' }} />
        </div>
      )}

      {/* -- Log console -- */}
      {log.length > 0 && (
        <div ref={logRef} style={{
          background: '#0f0f0f', color: '#ccc', fontFamily: 'monospace', fontSize: '.72rem',
          padding: '.75rem 1rem', borderRadius: 12, maxHeight: 160, overflowY: 'auto', marginBottom: '1rem',
          lineHeight: 1.6, whiteSpace: 'pre-wrap', border: '1.5px solid rgba(255,255,255,.06)',
        }}>
          {log.map((l, i) => (
            <div key={i} style={{ color: l.includes('OK') || l.includes('Done') ? '#4ADE80' : l.includes('FAIL') ? '#F87171' : l.includes('Stopped') || l.includes('Stopping') ? '#FBBF24' : '#ccc' }}>{l}</div>
          ))}
        </div>
      )}

      {/* -- Status summary + pagination header -- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem', flexWrap: 'wrap', gap: '.3rem' }}>
        <div style={{ fontSize: '.78rem', fontWeight: 600, color: '#888' }}>
          Showing {filteredCats.length > 0 ? startIdx + 1 : 0}–{endIdx} of {filteredCats.length} categories
          {sectorFilter !== 'all' && ` in ${sectors.find(s => s.slug === sectorFilter)?.name || sectorFilter}`}
          {levelFilter !== 'all' && ` (L${levelFilter} only)`}
          {genStatusFilter !== 'all' && ` [${genStatusFilter}]`}
          {search && ` matching "${search}"`}
        </div>
        <div style={{ fontSize: '.72rem', fontWeight: 600, color: '#aaa' }}>
          Page {safePage} of {totalPages}
        </div>
      </div>

      {/* -- Category list -- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        {paginatedCats.map(cat => {
          const secs = catSections(cat.id)
          const filled = sectionCount(cat.id)
          const isExpanded = expandedCat === cat.id
          const active = isGenerating(cat.id)
          const sc = SECTOR_COLORS[getSectorSlug(cat)] || '#888'
          const genAt = status?.sectionMap?.[cat.id]?.generatedAt || ''
          const timeAgo = relativeTime(genAt)
          const singleLoading = !batchRunning && active

          return (
            <div key={cat.id} style={{
              background: '#fff', border: `1.5px solid ${active ? sc : 'rgba(0,0,0,.08)'}`,
              borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)',
              transition: 'border-color .2s',
            }}>
              {/* Header row */}
              <div onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.55rem .85rem', cursor: 'pointer', userSelect: 'none' }}>
                {/* Level badge */}
                <span style={{
                  width: 26, height: 17, borderRadius: 4, fontSize: '.58rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: `${sc}15`, color: sc,
                }}>L{cat.level}</span>
                {/* Name + parent breadcrumb */}
                <span style={{ flex: 1, fontSize: '.78rem', fontWeight: 600, color: '#111', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.parentName && <span style={{ color: '#aaa', fontWeight: 500 }}>{cat.parentName} &rsaquo; </span>}
                    {cat.name}
                  </span>
                  {/* Single-section spinner (non-batch) */}
                  {singleLoading && (
                    <span style={{
                      display: 'inline-block', width: 10, height: 10, border: '2px solid #E8553D',
                      borderTopColor: 'transparent', borderRadius: '50%', flexShrink: 0,
                      animation: 'iww-spin 0.8s linear infinite',
                    }} />
                  )}
                </span>
                {/* Timestamp */}
                {timeAgo && (
                  <span style={{ fontSize: '.6rem', fontWeight: 500, color: '#bbb', flexShrink: 0, minWidth: 40, textAlign: 'right' }}>{timeAgo}</span>
                )}
                {/* Section dots */}
                <div style={{ display: 'flex', gap: 2.5, flexShrink: 0 }}>
                  {SECTIONS.map(s => (
                    <span key={s.key} title={s.label} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: secs[s.key] ? s.color : 'rgba(0,0,0,.08)',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '.62rem', fontWeight: 700, color: filled === 8 ? '#2FAE6A' : '#bbb', minWidth: 24, textAlign: 'right', flexShrink: 0 }}>{filled}/8</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded: per-section controls */}
              {isExpanded && (
                <div style={{ padding: '0 .85rem .7rem', borderTop: '1px solid rgba(0,0,0,.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '.4rem', marginTop: '.6rem' }}>
                    {SECTIONS.map(sec => {
                      const has = secs[sec.key]
                      const loading = isGenerating(cat.id, sec.key)
                      return (
                        <div key={sec.key} style={{
                          display: 'flex', alignItems: 'center', gap: '.4rem',
                          padding: '.4rem .6rem', borderRadius: 8,
                          background: has ? `${sec.color}08` : '#fafafa',
                          border: `1px solid ${has ? `${sec.color}20` : 'rgba(0,0,0,.06)'}`,
                        }}>
                          <span style={{ fontSize: '.8rem', lineHeight: 1 }}>{sec.icon}</span>
                          <span style={{ flex: 1, fontSize: '.7rem', fontWeight: 600, color: has ? '#333' : '#999' }}>{sec.label}</span>
                          {has && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2FAE6A', flexShrink: 0 }} />}
                          <button
                            onClick={e => { e.stopPropagation(); genSection(cat.id, cat.name, sec.key) }}
                            disabled={!!generatingKey}
                            style={{
                              padding: '2px 7px', borderRadius: 5, border: 'none', fontSize: '.62rem', fontWeight: 700,
                              background: loading ? '#ddd' : has ? '#f0f0f0' : sec.color,
                              color: loading ? '#999' : has ? '#555' : '#fff',
                              cursor: generatingKey ? 'default' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                              display: 'flex', alignItems: 'center', gap: 3,
                            }}
                          >
                            {loading && (
                              <span style={{
                                display: 'inline-block', width: 8, height: 8, border: '1.5px solid #999',
                                borderTopColor: 'transparent', borderRadius: '50%',
                                animation: 'iww-spin 0.8s linear infinite',
                              }} />
                            )}
                            {loading ? '' : has ? 'Redo' : 'Gen'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => genAllForCat(cat.id, cat.name)}
                    disabled={!!generatingKey}
                    style={{
                      marginTop: '.55rem', padding: '.35rem .75rem', borderRadius: 8, border: 'none',
                      background: generatingKey ? '#eee' : '#1a1a1a', color: generatingKey ? '#999' : '#fff',
                      fontWeight: 700, fontSize: '.7rem', cursor: generatingKey ? 'default' : 'pointer', fontFamily: 'inherit',
                    }}
                  >{active ? 'Generating...' : filled === 8 ? 'Regenerate All' : 'Generate All'}</button>
                  <a
                    href={`/iww-hq/seo-content/edit?id=${cat.id}`}
                    style={{
                      display: 'inline-block', marginTop: '.55rem', marginLeft: '.5rem', padding: '.35rem .75rem',
                      borderRadius: 8, border: '1.5px solid var(--h-accent)', background: '#fff', color: 'var(--h-accent)',
                      fontWeight: 700, fontSize: '.7rem', textDecoration: 'none', fontFamily: 'inherit',
                    }}
                  >✏️ Edit Content</a>
                </div>
              )}
            </div>
          )
        })}

        {filteredCats.length === 0 && (
          <div style={{ ...card, textAlign: 'center', padding: '2rem', color: '#999', fontSize: '.82rem' }}>
            No categories match the current filters.
          </div>
        )}
      </div>

      {/* -- Pagination controls -- */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.35rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            style={{
              ...btnBase,
              padding: '.4rem .75rem', fontSize: '.72rem',
              background: safePage <= 1 ? '#f5f5f5' : '#fff',
              color: safePage <= 1 ? '#ccc' : '#333',
              border: '1.5px solid rgba(0,0,0,.1)',
              cursor: safePage <= 1 ? 'default' : 'pointer',
            }}
          >Previous</button>

          {getPageNumbers().map((pg, i) =>
            pg === '...' ? (
              <span key={`ellipsis-${i}`} style={{ fontSize: '.72rem', color: '#bbb', padding: '0 .2rem' }}>...</span>
            ) : (
              <button key={pg} onClick={() => setCurrentPage(pg)}
                style={{
                  ...btnBase,
                  width: 30, height: 30, padding: 0, fontSize: '.72rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: safePage === pg ? '#1a1a1a' : '#fff',
                  color: safePage === pg ? '#fff' : '#333',
                  border: safePage === pg ? '2px solid #1a1a1a' : '1.5px solid rgba(0,0,0,.1)',
                  borderRadius: 8,
                }}
              >{pg}</button>
            )
          )}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            style={{
              ...btnBase,
              padding: '.4rem .75rem', fontSize: '.72rem',
              background: safePage >= totalPages ? '#f5f5f5' : '#fff',
              color: safePage >= totalPages ? '#ccc' : '#333',
              border: '1.5px solid rgba(0,0,0,.1)',
              cursor: safePage >= totalPages ? 'default' : 'pointer',
            }}
          >Next</button>
        </div>
      )}

      {/* Inline keyframes for spinner */}
      <style>{`
        @keyframes iww-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
