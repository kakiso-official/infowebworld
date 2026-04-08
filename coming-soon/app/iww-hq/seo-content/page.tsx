'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

type Category = { id: number; name: string; slug: string; level: number; parentName?: string }
type SectionMap = Record<number, { sections: Record<string, boolean>; generatedAt: string }>
type StatusInfo = { total: number; generated: number; sectionMap: SectionMap }

const SECTIONS = [
  { key: 'ai_summary', label: 'AI Summary', icon: '✦', color: '#7C3AED' },
  { key: 'rich_description', label: 'About / Description', icon: '📝', color: '#3B82F6' },
  { key: 'buyers_guide', label: "Buyer's Guide", icon: '🔍', color: '#14B8A6' },
  { key: 'use_cases', label: 'Use Cases', icon: '💼', color: '#F59E0B' },
  { key: 'comparisons', label: 'Alternatives', icon: '⚖️', color: '#8B5CF6' },
  { key: 'long_tail_keywords', label: 'Keywords', icon: '🏷️', color: '#E8553D' },
  { key: 'complementary_categories', label: 'Related', icon: '🔗', color: '#2FAE6A' },
  { key: 'extended_faq', label: 'FAQ', icon: '❓', color: '#6366F1' },
] as const

export default function SeoContentAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [expandedCat, setExpandedCat] = useState<number | null>(null)
  const [generatingKey, setGeneratingKey] = useState<string | null>(null) // "catId" or "catId:section"
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchSection, setBatchSection] = useState<string>('all')
  const stopRef = useRef(false)
  const [batchDone, setBatchDone] = useState(0)
  const [batchTotal, setBatchTotal] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((msg: string) => {
    setLog(l => { const n = [...l, msg]; if (n.length > 500) n.splice(0, n.length - 500); return n })
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50)
  }, [])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => {
      const cats = (d.data || []).filter((c: any) => Number(c.level) >= 2)
      setCategories(cats.map((c: any) => ({
        id: Number(c.id), name: String(c.name), slug: String(c.slug),
        level: Number(c.level), parentName: c.parent_name ? String(c.parent_name) : undefined,
      })))
    })
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    fetch('/api/admin/generate-seo-content').then(r => r.json()).then(setStatus).catch(() => {})
  }

  /* ── Generate single section ── */
  const genSection = async (catId: number, catName: string, section: string) => {
    const key = `${catId}:${section}`
    setGeneratingKey(key)
    addLog(`⏳ ${catName} → ${SECTIONS.find(s => s.key === section)?.label || section}...`)
    try {
      const res = await fetch('/api/admin/generate-seo-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, section }),
      })
      const data = await res.json()
      addLog(data.ok ? `  ✓ Done` : `  ✗ ${data.error}`)
    } catch (err) { addLog(`  ✗ ${err}`) }
    setGeneratingKey(null)
    refreshStatus()
  }

  /* ── Generate all sections for one category ── */
  const genAllForCat = async (catId: number, catName: string) => {
    setGeneratingKey(String(catId))
    addLog(`\n━━ ${catName} — all sections ━━`)
    for (const sec of SECTIONS) {
      if (stopRef.current) { addLog('  ⛔ Stopped'); break }
      setGeneratingKey(`${catId}:${sec.key}`)
      addLog(`  ⏳ ${sec.label}...`)
      try {
        const res = await fetch('/api/admin/generate-seo-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: catId, section: sec.key }),
        })
        const data = await res.json()
        addLog(data.ok ? `     ✓` : `     ✗ ${data.error}`)
      } catch (err) { addLog(`     ✗ ${err}`) }
    }
    setGeneratingKey(null)
    refreshStatus()
  }

  /* ── Batch: generate chosen section(s) for all categories ── */
  const startBatch = async () => {
    stopRef.current = false
    setBatchRunning(true)
    setBatchDone(0)
    const secs = batchSection === 'all' ? SECTIONS.map(s => s.key) : [batchSection]
    const total = categories.length * secs.length
    setBatchTotal(total)
    addLog(`\n════ Batch: ${batchSection === 'all' ? 'All sections' : SECTIONS.find(s => s.key === batchSection)?.label} for ${categories.length} categories ════`)

    let done = 0
    for (const cat of categories) {
      if (stopRef.current) { addLog(`\n⛔ Stopped at ${done}/${total}`); break }
      for (const sec of secs) {
        if (stopRef.current) break
        setGeneratingKey(`${cat.id}:${sec}`)
        addLog(`[${done + 1}/${total}] ${cat.name} → ${SECTIONS.find(s => s.key === sec)?.label}`)
        try {
          const res = await fetch('/api/admin/generate-seo-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: cat.id, section: sec }),
          })
          const data = await res.json()
          addLog(data.ok ? `  ✓` : `  ✗ ${data.error}`)
        } catch (err) { addLog(`  ✗ ${err}`) }
        done++
        setBatchDone(done)
      }
    }
    setGeneratingKey(null)
    setBatchRunning(false)
    addLog(`\n════ Batch ${stopRef.current ? 'stopped' : 'complete'}: ${done}/${total} ════`)
    refreshStatus()
  }

  const stopBatch = () => { stopRef.current = true; addLog('⏸ Stopping after current...') }

  const isGenerating = (catId: number, section?: string) => {
    if (!generatingKey) return false
    if (section) return generatingKey === `${catId}:${section}`
    return generatingKey.startsWith(`${catId}`)
  }

  const catSections = (catId: number) => status?.sectionMap?.[catId]?.sections || {}
  const sectionCount = (catId: number) => {
    const s = catSections(catId)
    return Object.values(s).filter(Boolean).length
  }

  const pct = status ? Math.round((status.generated / (status.total || 1)) * 100) : 0
  const batchPct = batchTotal > 0 ? Math.round((batchDone / batchTotal) * 100) : 0

  return (
    <div style={{ fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.25rem' }}>SEO Content Generator</h1>
      <p style={{ color: '#666', fontSize: '.82rem', marginBottom: '1.5rem' }}>Generate Gemini-powered content per section. Stop anytime — completed work is saved.</p>

      {/* ── Status cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem', marginBottom: '1.25rem' }}>
        {[
          { val: status?.generated || 0, label: 'Categories with Content', color: 'var(--h-accent, #E8553D)' },
          { val: status?.total || 0, label: 'Total L2/L3', color: '#333' },
          { val: `${pct}%`, label: 'Coverage', color: '#2FAE6A' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.7rem', color: '#888', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Batch controls ── */}
      <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#333' }}>Batch Generate:</span>
          <select
            value={batchSection}
            onChange={e => setBatchSection(e.target.value)}
            disabled={batchRunning}
            style={{ padding: '.4rem .6rem', borderRadius: 8, border: '1.5px solid rgba(0,0,0,.1)', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit', background: '#fafafa' }}
          >
            <option value="all">All Sections</option>
            {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
          </select>
          {!batchRunning ? (
            <button onClick={startBatch} disabled={!!generatingKey}
              style={{ padding: '.45rem 1rem', borderRadius: 8, border: 'none', background: generatingKey ? '#ccc' : 'var(--h-accent, #E8553D)', color: '#fff', fontWeight: 700, fontSize: '.78rem', cursor: generatingKey ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              Start Batch
            </button>
          ) : (
            <button onClick={stopBatch}
              style={{ padding: '.45rem 1rem', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              ⏹ Stop
            </button>
          )}
          {batchRunning && (
            <span style={{ fontSize: '.75rem', color: '#666' }}>
              {batchDone}/{batchTotal} ({batchPct}%)
            </span>
          )}
        </div>
        {batchRunning && (
          <div style={{ marginTop: '.6rem', height: 4, borderRadius: 2, background: 'rgba(0,0,0,.06)', overflow: 'hidden' }}>
            <div style={{ width: `${batchPct}%`, height: '100%', background: 'var(--h-accent, #E8553D)', borderRadius: 2, transition: 'width 300ms' }} />
          </div>
        )}
      </div>

      {/* ── Log console ── */}
      {log.length > 0 && (
        <div ref={logRef} style={{
          background: '#0f0f0f', color: '#ccc', fontFamily: 'monospace', fontSize: '.72rem',
          padding: '.75rem 1rem', borderRadius: 12, maxHeight: 180, overflowY: 'auto', marginBottom: '1rem',
          lineHeight: 1.6, whiteSpace: 'pre-wrap', border: '1.5px solid rgba(255,255,255,.06)',
        }}>
          {log.map((l, i) => (
            <div key={i} style={{ color: l.includes('✓') ? '#4ADE80' : l.includes('✗') ? '#F87171' : l.includes('⛔') || l.includes('⏸') ? '#FBBF24' : '#ccc' }}>{l}</div>
          ))}
        </div>
      )}

      {/* ── Category list ── */}
      <h2 style={{ fontSize: '.95rem', fontWeight: 700, margin: '1.25rem 0 .5rem', color: '#333' }}>Categories ({categories.length})</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {categories.map(cat => {
          const secs = catSections(cat.id)
          const filled = sectionCount(cat.id)
          const isExpanded = expandedCat === cat.id
          const active = isGenerating(cat.id)

          return (
            <div key={cat.id} style={{
              background: '#fff', border: `1.5px solid ${active ? 'var(--h-accent, #E8553D)' : 'rgba(0,0,0,.08)'}`,
              borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)',
              transition: 'border-color .2s',
            }}>
              {/* Header row */}
              <div
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.65rem .9rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{
                  width: 28, height: 18, borderRadius: 4, fontSize: '.6rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: cat.level === 2 ? '#3B82F615' : '#8B5CF615',
                  color: cat.level === 2 ? '#3B82F6' : '#8B5CF6',
                }}>L{cat.level}</span>
                <span style={{ flex: 1, fontSize: '.8rem', fontWeight: 600, color: '#111' }}>
                  {cat.name}
                  {cat.parentName && <span style={{ color: '#999', fontWeight: 500 }}> — {cat.parentName}</span>}
                </span>
                {/* Section dots */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {SECTIONS.map(s => (
                    <span key={s.key} title={s.label} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: secs[s.key] ? s.color : 'rgba(0,0,0,.08)',
                      transition: 'background .2s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '.65rem', fontWeight: 700, color: filled === 8 ? '#2FAE6A' : '#999', minWidth: 28, textAlign: 'right' }}>{filled}/8</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded: per-section controls */}
              {isExpanded && (
                <div style={{ padding: '0 .9rem .75rem', borderTop: '1px solid rgba(0,0,0,.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.5rem', marginTop: '.65rem' }}>
                    {SECTIONS.map(sec => {
                      const has = secs[sec.key]
                      const loading = isGenerating(cat.id, sec.key)
                      return (
                        <div key={sec.key} style={{
                          display: 'flex', alignItems: 'center', gap: '.5rem',
                          padding: '.5rem .65rem', borderRadius: 8,
                          background: has ? `${sec.color}08` : '#fafafa',
                          border: `1px solid ${has ? `${sec.color}20` : 'rgba(0,0,0,.06)'}`,
                        }}>
                          <span style={{ fontSize: '.85rem', lineHeight: 1 }}>{sec.icon}</span>
                          <span style={{ flex: 1, fontSize: '.72rem', fontWeight: 600, color: has ? '#333' : '#999' }}>{sec.label}</span>
                          {has && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2FAE6A', flexShrink: 0 }} />}
                          <button
                            onClick={e => { e.stopPropagation(); genSection(cat.id, cat.name, sec.key) }}
                            disabled={!!generatingKey}
                            style={{
                              padding: '3px 8px', borderRadius: 6, border: 'none', fontSize: '.65rem', fontWeight: 700,
                              background: loading ? '#ddd' : has ? '#f5f5f5' : sec.color,
                              color: loading ? '#999' : has ? '#555' : '#fff',
                              cursor: generatingKey ? 'default' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                            }}
                          >
                            {loading ? '...' : has ? 'Redo' : 'Gen'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  {/* Generate all for this category */}
                  <button
                    onClick={() => genAllForCat(cat.id, cat.name)}
                    disabled={!!generatingKey}
                    style={{
                      marginTop: '.65rem', padding: '.4rem .85rem', borderRadius: 8, border: 'none',
                      background: generatingKey ? '#eee' : '#1a1a1a', color: generatingKey ? '#999' : '#fff',
                      fontWeight: 700, fontSize: '.72rem', cursor: generatingKey ? 'default' : 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {active ? 'Generating...' : filled === 8 ? 'Regenerate All Sections' : 'Generate All Sections'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
