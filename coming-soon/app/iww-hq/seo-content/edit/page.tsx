'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

/* ── Types ── */
type Feature = { title: string; description: string }
type UseCase = { title: string; description: string; icon: string }
type Comparison = { vs_name: string; vs_slug: string; summary: string; differences: string[] }
type BuyersGuide = { features: Feature[]; questions: string[]; pitfalls: string[]; pricing_info: string }
type LongTailKw = { by_industry: string[]; by_size: string[]; by_need: string[] }
type FaqItem = { q: string; a: string }

type SeoData = {
  ai_summary: string
  rich_description: string
  buyers_guide: BuyersGuide | null
  use_cases: UseCase[] | null
  comparisons: Comparison[] | null
  long_tail_keywords: LongTailKw | null
  complementary_categories: string[] | null
  extended_faq: FaqItem[] | null
}

type CategoryMeta = { id: number; name: string; slug: string; level: number; description: string; parentName: string; parentSlug: string; sectorSlug: string }
type CatOption = { id: number; name: string; slug: string; level: number; parentName?: string }

const EMPTY: SeoData = {
  ai_summary: '', rich_description: '',
  buyers_guide: { features: [{ title: '', description: '' }], questions: [''], pitfalls: [''], pricing_info: '' },
  use_cases: [{ title: '', description: '', icon: 'building' }],
  comparisons: [{ vs_name: '', vs_slug: '', summary: '', differences: [''] }],
  long_tail_keywords: { by_industry: [], by_size: [], by_need: [] },
  complementary_categories: [],
  extended_faq: [{ q: '', a: '' }],
}

const SECTIONS = [
  { key: 'ai_summary', label: 'AI Summary', icon: '✦', color: '#7C3AED', desc: '2-3 sentence snapshot for the top of the page' },
  { key: 'rich_description', label: 'About', icon: '📝', color: '#3B82F6', desc: '700-900 word editorial overview with internal links' },
  { key: 'buyers_guide', label: "Buyer's Guide", icon: '🔍', color: '#14B8A6', desc: 'Features, questions, pitfalls & pricing info' },
  { key: 'use_cases', label: 'Use Cases', icon: '💼', color: '#F59E0B', desc: '5 industry-specific use cases with icons' },
  { key: 'comparisons', label: 'Alternatives', icon: '⚖️', color: '#8B5CF6', desc: '3-4 alternative approaches with tradeoffs' },
  { key: 'long_tail_keywords', label: 'Keywords', icon: '🏷️', color: '#E8553D', desc: 'Long-tail keywords by industry, size & need' },
  { key: 'complementary_categories', label: 'Related', icon: '🔗', color: '#2FAE6A', desc: '5 categories buyers typically evaluate next' },
  { key: 'extended_faq', label: 'FAQ', icon: '❓', color: '#6366F1', desc: '12 Q&A pairs phrased as Google search queries' },
] as const

type SectionKey = typeof SECTIONS[number]['key']

const ICON_OPTIONS = ['building', 'heart', 'graduation', 'cart', 'code', 'briefcase', 'users', 'globe', 'chart', 'shield']

/* ── Shared inline styles (same pattern as BlogEditor) ── */
const btnPrimary: React.CSSProperties = { padding: '.3rem .7rem', borderRadius: 999, border: '1.5px solid #E8553D', fontSize: '.62rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', transition: 'all .2s' }
const btnGhost: React.CSSProperties = { ...btnPrimary, background: '#fff', color: 'var(--h-heading)', borderColor: 'var(--h-border)' }
const btnSmall: React.CSSProperties = { ...btnGhost, padding: '.2rem .5rem', fontSize: '.58rem' }

/* ── Helper: slug from name ── */
function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

/* ── Internal link regex ── */
function countLinks(text: string) { return (text.match(/\[LINK:[^\]]+\]/g) || []).length }
function parseInternalLinksPreview(text: string) {
  return text.replace(/\[LINK:([^:]+):([^\]]+)\]/g, '<a class="seo-inline-link" style="color:var(--h-accent);text-decoration:underline;cursor:default">$2</a>')
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function SeoContentEditor() {
  const params = useSearchParams()
  const router = useRouter()
  const catId = Number(params.get('id'))

  const [meta, setMeta] = useState<CategoryMeta | null>(null)
  const [data, setData] = useState<SeoData>({ ...EMPTY })
  const [original, setOriginal] = useState<SeoData>({ ...EMPTY })
  const [activeTab, setActiveTab] = useState<SectionKey>('ai_summary')
  const [allCats, setAllCats] = useState<CatOption[]>([])
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const descRef = useRef<HTMLTextAreaElement>(null)

  // ── Load data ──
  useEffect(() => {
    if (!catId) return
    Promise.all([
      fetch(`/api/admin/seo-content/${catId}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([seoRes, catRes]) => {
      if (seoRes.ok) {
        setMeta(seoRes.category)
        const c = seoRes.content || {}
        const d: SeoData = {
          ai_summary: c.ai_summary || '',
          rich_description: c.rich_description || '',
          buyers_guide: c.buyers_guide || EMPTY.buyers_guide,
          use_cases: c.use_cases && c.use_cases.length ? c.use_cases : EMPTY.use_cases,
          comparisons: c.comparisons && c.comparisons.length ? c.comparisons : EMPTY.comparisons,
          long_tail_keywords: c.long_tail_keywords || EMPTY.long_tail_keywords,
          complementary_categories: c.complementary_categories || [],
          extended_faq: c.extended_faq && c.extended_faq.length ? c.extended_faq : EMPTY.extended_faq,
        }
        setData(d)
        setOriginal(JSON.parse(JSON.stringify(d)))
      }
      if (Array.isArray(catRes)) {
        setAllCats(catRes.map((c: Record<string, unknown>) => ({ id: Number(c.id), name: String(c.name), slug: String(c.slug), level: Number(c.level), parentName: String(c.parent_name || '') })))
      } else if (catRes.data) {
        setAllCats(catRes.data.map((c: Record<string, unknown>) => ({ id: Number(c.id), name: String(c.name), slug: String(c.slug), level: Number(c.level), parentName: String(c.parent_name || '') })))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [catId])

  // ── Dirty detection ──
  const isDirty = useCallback((key: SectionKey) => {
    return JSON.stringify((data as Record<string, unknown>)[key]) !== JSON.stringify((original as Record<string, unknown>)[key])
  }, [data, original])

  const anyDirty = useMemo(() => SECTIONS.some(s => isDirty(s.key)), [isDirty])

  // ── Warn on leave ──
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (anyDirty) { e.preventDefault() } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [anyDirty])

  // ── Save section ──
  const saveSection = useCallback(async (key: SectionKey) => {
    setSaving(s => ({ ...s, [key]: true }))
    try {
      const val = (data as Record<string, unknown>)[key]
      const res = await fetch(`/api/admin/seo-content/${catId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: key, value: val }),
      })
      if (res.ok) {
        setOriginal(o => ({ ...o, [key]: JSON.parse(JSON.stringify(val)) }))
        setSavedFlash(f => ({ ...f, [key]: true }))
        setTimeout(() => setSavedFlash(f => ({ ...f, [key]: false })), 2000)
      }
    } finally { setSaving(s => ({ ...s, [key]: false })) }
  }, [data, catId])

  // ── Save all dirty ──
  const saveAll = useCallback(async () => {
    const dirty: Record<string, unknown> = {}
    for (const s of SECTIONS) { if (isDirty(s.key)) dirty[s.key] = (data as Record<string, unknown>)[s.key] }
    if (!Object.keys(dirty).length) return
    setSaving(s => ({ ...s, _all: true }))
    try {
      const res = await fetch(`/api/admin/seo-content/${catId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: dirty }),
      })
      if (res.ok) {
        setOriginal(JSON.parse(JSON.stringify(data)))
        setSavedFlash(f => ({ ...f, _all: true }))
        setTimeout(() => setSavedFlash(f => ({ ...f, _all: false })), 2000)
      }
    } finally { setSaving(s => ({ ...s, _all: false })) }
  }, [data, catId, isDirty])

  // ── Generate with AI ──
  const generateSection = useCallback(async (key: SectionKey | 'all') => {
    const gKey = key === 'all' ? '_all' : key
    setGenerating(g => ({ ...g, [gKey]: true }))
    try {
      const body: Record<string, unknown> = { categoryId: catId }
      if (key !== 'all') body.section = key
      await fetch('/api/admin/generate-seo-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      // Refetch content
      const res = await fetch(`/api/admin/seo-content/${catId}`).then(r => r.json())
      if (res.ok && res.content) {
        const c = res.content
        const d: SeoData = {
          ai_summary: c.ai_summary || '',
          rich_description: c.rich_description || '',
          buyers_guide: c.buyers_guide || EMPTY.buyers_guide,
          use_cases: c.use_cases && c.use_cases.length ? c.use_cases : EMPTY.use_cases,
          comparisons: c.comparisons && c.comparisons.length ? c.comparisons : EMPTY.comparisons,
          long_tail_keywords: c.long_tail_keywords || EMPTY.long_tail_keywords,
          complementary_categories: c.complementary_categories || [],
          extended_faq: c.extended_faq && c.extended_faq.length ? c.extended_faq : EMPTY.extended_faq,
        }
        setData(d)
        setOriginal(JSON.parse(JSON.stringify(d)))
      }
    } finally { setGenerating(g => ({ ...g, [gKey]: false })) }
  }, [catId])

  // ── Updaters ──
  const setText = useCallback((key: 'ai_summary' | 'rich_description', val: string) => {
    setData(d => ({ ...d, [key]: val }))
  }, [])

  const setBg = useCallback((fn: (bg: BuyersGuide) => BuyersGuide) => {
    setData(d => ({ ...d, buyers_guide: fn(d.buyers_guide || EMPTY.buyers_guide!) }))
  }, [])

  const setUseCases = useCallback((fn: (uc: UseCase[]) => UseCase[]) => {
    setData(d => ({ ...d, use_cases: fn(d.use_cases || []) }))
  }, [])

  const setComps = useCallback((fn: (c: Comparison[]) => Comparison[]) => {
    setData(d => ({ ...d, comparisons: fn(d.comparisons || []) }))
  }, [])

  const setKw = useCallback((fn: (kw: LongTailKw) => LongTailKw) => {
    setData(d => ({ ...d, long_tail_keywords: fn(d.long_tail_keywords || EMPTY.long_tail_keywords!) }))
  }, [])

  const setCompCats = useCallback((fn: (cc: string[]) => string[]) => {
    setData(d => ({ ...d, complementary_categories: fn(d.complementary_categories || []) }))
  }, [])

  const setFaq = useCallback((fn: (f: FaqItem[]) => FaqItem[]) => {
    setData(d => ({ ...d, extended_faq: fn(d.extended_faq || []) }))
  }, [])

  // ── Insert link helper for rich_description ──
  const [showLinkPicker, setShowLinkPicker] = useState(false)
  const [linkSearch, setLinkSearch] = useState('')
  const linkFiltered = useMemo(() => {
    if (!linkSearch.trim()) return allCats.slice(0, 15)
    const q = linkSearch.toLowerCase()
    return allCats.filter(c => c.name.toLowerCase().includes(q)).slice(0, 15)
  }, [allCats, linkSearch])

  const insertLink = useCallback((cat: CatOption) => {
    const ta = descRef.current
    if (!ta) return
    const link = `[LINK:${cat.slug}:${cat.name}]`
    const { selectionStart: s, selectionEnd: e, value } = ta
    setText('rich_description', value.slice(0, s) + link + value.slice(e))
    setShowLinkPicker(false)
    setLinkSearch('')
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + link.length }, 0)
  }, [setText])

  // ── FAQ expand state ──
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set([0]))

  // ── Render ──
  if (!catId) return <div className="sede-loading">No category ID provided. Go back and select a category.</div>
  if (loading) return <div className="sede-loading"><span className="sede-spin" /> Loading SEO content...</div>
  if (!meta) return <div className="sede-loading">Category not found.</div>

  const sec = SECTIONS.find(s => s.key === activeTab)!
  const hasContent = (key: SectionKey) => {
    const v = (data as Record<string, unknown>)[key]
    if (!v) return false
    if (typeof v === 'string') return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0 && JSON.stringify(v) !== JSON.stringify(EMPTY[key as keyof SeoData])
    if (typeof v === 'object') return JSON.stringify(v) !== JSON.stringify(EMPTY[key as keyof SeoData])
    return false
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1rem' }}>
      {/* ── Top bar ── */}
      <div className="sede-top">
        <button className="sede-back" onClick={() => router.push('/iww-hq/seo-content')}>← Back</button>
        <h1 className="sede-cat-name">{meta.name}</h1>
        <span className="sede-level-badge">L{meta.level}</span>
        {meta.parentName && <span className="sede-parent">in {meta.parentName}</span>}
        <div className="sede-actions">
          {anyDirty && (
            <button style={btnPrimary} onClick={saveAll} disabled={saving._all}>
              {saving._all ? 'Saving...' : 'Save All'}
            </button>
          )}
          {savedFlash._all && <span className="sede-saved">✓ Saved</span>}
          <button style={btnGhost} onClick={() => generateSection('all')} disabled={generating._all}>
            {generating._all ? 'Generating...' : '✦ Generate All'}
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="sede-tabs">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`sede-tab${activeTab === s.key ? ' sede-tab--active' : ''}`}
            onClick={() => setActiveTab(s.key)}
            style={activeTab === s.key ? { '--tab-color': s.color } as React.CSSProperties : undefined}
          >
            <span className="sede-tab-dot" style={{ background: hasContent(s.key) ? s.color : 'var(--h-border)' }} />
            <span className="sede-tab-icon">{s.icon}</span>
            {s.label}
            {isDirty(s.key) && <span style={{ color: '#F59E0B', fontSize: '.5rem' }}>●</span>}
          </button>
        ))}
      </div>

      {/* ── Columns ── */}
      <div className="sede-columns">
        {/* ── LEFT: Editor ── */}
        <div className="sede-editor">
          <div className="sede-editor-header">
            <div>
              <div className="sede-section-title" style={{ color: sec.color }}>{sec.icon} {sec.label}</div>
              <div className="sede-section-desc">{sec.desc}</div>
            </div>
          </div>

          {/* ── AI SUMMARY ── */}
          {activeTab === 'ai_summary' && (
            <div>
              <textarea
                className="sede-textarea sede-textarea--med"
                value={data.ai_summary}
                onChange={e => setText('ai_summary', e.target.value)}
                placeholder="2-3 sentence snapshot of this category..."
              />
              <div className="sede-counter">
                <span className={data.ai_summary.length > 300 ? 'sede-counter-bad' : data.ai_summary.length > 200 ? 'sede-counter-warn' : ''}>{data.ai_summary.length}/300 chars</span>
                <span>{data.ai_summary.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* ── RICH DESCRIPTION ── */}
          {activeTab === 'rich_description' && (
            <div>
              <div className="sede-toolbar">
                <div className="sede-link-wrap">
                  <button className="sede-toolbar-btn" onClick={() => setShowLinkPicker(!showLinkPicker)}>🔗 Insert Link</button>
                  {showLinkPicker && (
                    <div className="sede-link-dropdown">
                      <input className="sede-link-search" placeholder="Search categories..." value={linkSearch} onChange={e => setLinkSearch(e.target.value)} autoFocus />
                      {linkFiltered.map(c => (
                        <div key={c.id} className="sede-link-row" onClick={() => insertLink(c)}>
                          <span className="sede-link-level">L{c.level}</span>
                          <span>{c.name}</span>
                          {c.parentName && <span style={{ color: 'var(--h-muted)', fontSize: '.55rem' }}>in {c.parentName}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '.58rem', color: 'var(--h-muted)' }}>
                  {data.rich_description.split(/\s+/).filter(Boolean).length} words · {data.rich_description.split('\n\n').filter(Boolean).length} paragraphs · {countLinks(data.rich_description)} links
                </span>
              </div>
              <textarea
                ref={descRef}
                className="sede-textarea sede-textarea--tall"
                value={data.rich_description}
                onChange={e => setText('rich_description', e.target.value)}
                placeholder="700-900 word editorial overview. Use [LINK:slug:Display Text] for internal links..."
              />
              <div className="sede-counter">
                {(() => {
                  const wc = data.rich_description.split(/\s+/).filter(Boolean).length
                  const cls = wc >= 700 && wc <= 900 ? 'sede-counter-ok' : wc >= 500 ? 'sede-counter-warn' : 'sede-counter-bad'
                  return <span className={cls}>{wc} words (target: 700-900)</span>
                })()}
                {(() => {
                  const lc = countLinks(data.rich_description)
                  const cls = lc >= 10 ? 'sede-counter-ok' : lc >= 5 ? 'sede-counter-warn' : 'sede-counter-bad'
                  return <span className={cls}>{lc} internal links (target: 10-15)</span>
                })()}
              </div>
            </div>
          )}

          {/* ── BUYER'S GUIDE ── */}
          {activeTab === 'buyers_guide' && (() => {
            const bg = data.buyers_guide || EMPTY.buyers_guide!
            return (
              <div className="sede-form-list">
                <div>
                  <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.4rem', display: 'block' }}>Features ({bg.features.length})</label>
                  {bg.features.map((f, i) => (
                    <div key={i} className="sede-form-item">
                      <div className="sede-form-item-header">
                        <span className="sede-form-item-num">{i + 1}</span>
                        <input className="sede-form-input" placeholder="Feature title" value={f.title} onChange={e => setBg(bg => ({ ...bg, features: bg.features.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} />
                        <button className="sede-rm-btn" onClick={() => setBg(bg => ({ ...bg, features: bg.features.filter((_, j) => j !== i) }))}>×</button>
                      </div>
                      <textarea className="sede-form-textarea" placeholder="Why this feature matters..." value={f.description} onChange={e => setBg(bg => ({ ...bg, features: bg.features.map((x, j) => j === i ? { ...x, description: e.target.value } : x) }))} />
                    </div>
                  ))}
                  <button className="sede-add-btn" onClick={() => setBg(bg => ({ ...bg, features: [...bg.features, { title: '', description: '' }] }))}>+ Add Feature</button>
                </div>

                <div>
                  <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.4rem', display: 'block' }}>Questions to Ask Vendors ({bg.questions.length})</label>
                  {bg.questions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.4rem', marginBottom: '.35rem', alignItems: 'center' }}>
                      <span className="sede-form-item-num">{i + 1}</span>
                      <input className="sede-form-input" placeholder="Question..." value={q} onChange={e => setBg(bg => ({ ...bg, questions: bg.questions.map((x, j) => j === i ? e.target.value : x) }))} />
                      <button className="sede-rm-btn" onClick={() => setBg(bg => ({ ...bg, questions: bg.questions.filter((_, j) => j !== i) }))}>×</button>
                    </div>
                  ))}
                  <button className="sede-add-btn" onClick={() => setBg(bg => ({ ...bg, questions: [...bg.questions, ''] }))}>+ Add Question</button>
                </div>

                <div>
                  <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.4rem', display: 'block' }}>Common Pitfalls ({bg.pitfalls.length})</label>
                  {bg.pitfalls.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.4rem', marginBottom: '.35rem', alignItems: 'center' }}>
                      <span className="sede-form-item-num">{i + 1}</span>
                      <input className="sede-form-input" placeholder="Buying mistake..." value={p} onChange={e => setBg(bg => ({ ...bg, pitfalls: bg.pitfalls.map((x, j) => j === i ? e.target.value : x) }))} />
                      <button className="sede-rm-btn" onClick={() => setBg(bg => ({ ...bg, pitfalls: bg.pitfalls.filter((_, j) => j !== i) }))}>×</button>
                    </div>
                  ))}
                  <button className="sede-add-btn" onClick={() => setBg(bg => ({ ...bg, pitfalls: [...bg.pitfalls, ''] }))}>+ Add Pitfall</button>
                </div>

                <div>
                  <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.4rem', display: 'block' }}>Pricing Info</label>
                  <textarea className="sede-form-textarea" placeholder="How is this category typically priced?" value={bg.pricing_info} onChange={e => setBg(bg => ({ ...bg, pricing_info: e.target.value }))} />
                </div>
              </div>
            )
          })()}

          {/* ── USE CASES ── */}
          {activeTab === 'use_cases' && (
            <div className="sede-form-list">
              {(data.use_cases || []).map((uc, i) => (
                <div key={i} className="sede-form-item">
                  <div className="sede-form-item-header">
                    <span className="sede-form-item-num">{i + 1}</span>
                    <input className="sede-form-input" placeholder="Use case title (be specific)" value={uc.title} onChange={e => setUseCases(ucs => ucs.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} style={{ flex: 1 }} />
                    <select className="sede-form-select" value={uc.icon} onChange={e => setUseCases(ucs => ucs.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}>
                      {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                    <button className="sede-rm-btn" onClick={() => setUseCases(ucs => ucs.filter((_, j) => j !== i))}>×</button>
                  </div>
                  <textarea className="sede-form-textarea" placeholder="2-3 sentences: specific pain point, workflow, before/after metric..." value={uc.description} onChange={e => setUseCases(ucs => ucs.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                </div>
              ))}
              <button className="sede-add-btn" onClick={() => setUseCases(ucs => [...ucs, { title: '', description: '', icon: 'building' }])}>+ Add Use Case</button>
            </div>
          )}

          {/* ── COMPARISONS ── */}
          {activeTab === 'comparisons' && (
            <div className="sede-form-list">
              {(data.comparisons || []).map((comp, i) => (
                <div key={i} className="sede-form-item">
                  <div className="sede-form-item-header">
                    <span className="sede-form-item-num">{i + 1}</span>
                    <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--h-heading)' }}>{meta.name} vs</span>
                    <input className="sede-form-input" placeholder="Alternative name" value={comp.vs_name} onChange={e => setComps(cs => cs.map((x, j) => j === i ? { ...x, vs_name: e.target.value, vs_slug: toSlug(e.target.value) } : x))} style={{ flex: 1 }} />
                    <button className="sede-rm-btn" onClick={() => setComps(cs => cs.filter((_, j) => j !== i))}>×</button>
                  </div>
                  <div style={{ marginBottom: '.35rem' }}>
                    <input className="sede-form-input" placeholder="Slug (auto-generated)" value={comp.vs_slug} onChange={e => setComps(cs => cs.map((x, j) => j === i ? { ...x, vs_slug: e.target.value } : x))} style={{ fontSize: '.6rem', height: 30 }} />
                  </div>
                  <textarea className="sede-form-textarea" placeholder="Summary of the comparison..." value={comp.summary} onChange={e => setComps(cs => cs.map((x, j) => j === i ? { ...x, summary: e.target.value } : x))} />
                  <label style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--h-muted)', margin: '.4rem 0 .2rem' }}>Key Differences</label>
                  {comp.differences.map((d, di) => (
                    <div key={di} style={{ display: 'flex', gap: '.35rem', marginBottom: '.25rem', alignItems: 'center' }}>
                      <input className="sede-form-input" placeholder="Difference..." value={d} onChange={e => setComps(cs => cs.map((x, j) => j === i ? { ...x, differences: x.differences.map((dd, dj) => dj === di ? e.target.value : dd) } : x))} />
                      <button className="sede-rm-btn" onClick={() => setComps(cs => cs.map((x, j) => j === i ? { ...x, differences: x.differences.filter((_, dj) => dj !== di) } : x))}>×</button>
                    </div>
                  ))}
                  <button className="sede-add-btn" onClick={() => setComps(cs => cs.map((x, j) => j === i ? { ...x, differences: [...x.differences, ''] } : x))}>+ Add Difference</button>
                </div>
              ))}
              <button className="sede-add-btn" onClick={() => setComps(cs => [...cs, { vs_name: '', vs_slug: '', summary: '', differences: [''] }])}>+ Add Comparison</button>
            </div>
          )}

          {/* ── LONG-TAIL KEYWORDS ── */}
          {activeTab === 'long_tail_keywords' && (() => {
            const kw = data.long_tail_keywords || EMPTY.long_tail_keywords!
            return (
              <div className="sede-form-list">
                {(['by_industry', 'by_size', 'by_need'] as const).map(group => (
                  <div key={group}>
                    <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.3rem', display: 'block', textTransform: 'capitalize' }}>
                      {group.replace('by_', 'By ')} ({kw[group].length})
                    </label>
                    <TagInput
                      tags={kw[group]}
                      onChange={tags => setKw(k => ({ ...k, [group]: tags }))}
                      placeholder={`Add ${group.replace('by_', '')} keyword...`}
                    />
                  </div>
                ))}
              </div>
            )
          })()}

          {/* ── COMPLEMENTARY CATEGORIES ── */}
          {activeTab === 'complementary_categories' && (
            <div>
              <label style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.3rem', display: 'block' }}>
                Related Categories ({(data.complementary_categories || []).length})
              </label>
              <TagInput
                tags={data.complementary_categories || []}
                onChange={tags => setCompCats(() => tags)}
                placeholder="Add category name..."
                suggestions={allCats.map(c => c.name)}
              />
            </div>
          )}

          {/* ── EXTENDED FAQ ── */}
          {activeTab === 'extended_faq' && (
            <div className="sede-form-list">
              {(data.extended_faq || []).map((item, i) => (
                <div key={i} className="sede-faq-item">
                  <button className="sede-faq-header" onClick={() => setFaqOpen(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })}>
                    <span className="sede-faq-num">Q{i + 1}</span>
                    <span className={`sede-faq-chevron${faqOpen.has(i) ? ' sede-faq-chevron--open' : ''}`}>▸</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.q || '(empty question)'}</span>
                    <span className="sede-rm-btn" role="button" tabIndex={0} onClick={e => { e.stopPropagation(); setFaq(f => f.filter((_, j) => j !== i)) }} onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); setFaq(f => f.filter((_, j) => j !== i)) } }}>×</span>
                  </button>
                  {faqOpen.has(i) && (
                    <div className="sede-faq-body">
                      <input className="sede-form-input" placeholder="Question (phrased as Google search query)" value={item.q} onChange={e => setFaq(f => f.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} />
                      <textarea className="sede-form-textarea" placeholder="Answer (3-4 sentences, include at least 1 specific number/price/timeframe)" value={item.a} onChange={e => setFaq(f => f.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} />
                    </div>
                  )}
                </div>
              ))}
              <button className="sede-add-btn" onClick={() => { setFaq(f => [...f, { q: '', a: '' }]); setFaqOpen(s => { const n = new Set(s); n.add((data.extended_faq || []).length); return n }) }}>+ Add FAQ</button>
            </div>
          )}

          {/* ── Action bar ── */}
          <div className="sede-action-bar">
            <button style={btnPrimary} onClick={() => saveSection(activeTab)} disabled={saving[activeTab] || !isDirty(activeTab)}>
              {saving[activeTab] ? 'Saving...' : 'Save Section'}
            </button>
            <button style={btnGhost} onClick={() => generateSection(activeTab)} disabled={generating[activeTab]}>
              {generating[activeTab] ? 'Generating...' : `✦ Generate ${sec.label}`}
            </button>
            {isDirty(activeTab) && <span className="sede-dirty">● Unsaved changes</span>}
            {savedFlash[activeTab] && <span className="sede-saved">✓ Saved</span>}
          </div>
        </div>

        {/* ── RIGHT: Preview + Quality ── */}
        <div className="sede-preview">
          <div className="sede-preview-title">
            Live Preview
            <span className="sede-preview-badge">as seen on public page</span>
          </div>

          {!hasContent(activeTab) ? (
            <div className="sede-preview-empty">
              No content yet. Type in the editor or click &quot;Generate with AI&quot; to create content.
            </div>
          ) : (
            <div className="seo-sections" style={{ fontSize: '.82rem' }}>
              {/* Preview renders same HTML structure as SeoSections.tsx */}
              {activeTab === 'ai_summary' && data.ai_summary && (
                <p style={{ fontSize: '.78rem', color: 'var(--h-body)', lineHeight: 1.7, fontStyle: 'italic' }}>{data.ai_summary}</p>
              )}

              {activeTab === 'rich_description' && data.rich_description && (() => {
                const paras = data.rich_description.split('\n\n').filter(Boolean)
                return (
                  <section className="seo-section seo-description">
                    <h2 className="seo-h2">About {meta.name}</h2>
                    <div className="seo-about-body">
                      {paras.map((p, i) => (
                        <p key={i} className={`seo-para${i === 0 ? ' seo-para--lead' : ''}`} dangerouslySetInnerHTML={{ __html: parseInternalLinksPreview(p) }} />
                      ))}
                    </div>
                  </section>
                )
              })()}

              {activeTab === 'buyers_guide' && data.buyers_guide && (() => {
                const bg = data.buyers_guide
                return (
                  <section className="seo-section seo-guide">
                    <h2 className="seo-h2">{meta.name} Buyer&apos;s Guide</h2>
                    {bg.features.length > 0 && bg.features[0].title && (
                      <div className="seo-guide-grid" role="list">
                        {bg.features.filter(f => f.title).map((f, i) => (
                          <div key={i} className="seo-guide-card" role="listitem">
                            <h3 className="seo-h3">{f.title}</h3>
                            <p>{f.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {bg.questions.filter(Boolean).length > 0 && (
                      <div className="seo-guide-questions"><h3 className="seo-h3">Questions to Ask Vendors</h3><ol>{bg.questions.filter(Boolean).map((q, i) => <li key={i}>{q}</li>)}</ol></div>
                    )}
                    {bg.pitfalls.filter(Boolean).length > 0 && (
                      <div className="seo-guide-pitfalls"><h3 className="seo-h3">Common Buying Mistakes</h3><ul>{bg.pitfalls.filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul></div>
                    )}
                    {bg.pricing_info && <div className="seo-pricing-note"><h3 className="seo-h3">Typical Pricing</h3><p>{bg.pricing_info}</p></div>}
                  </section>
                )
              })()}

              {activeTab === 'use_cases' && data.use_cases && data.use_cases.filter(uc => uc.title).length > 0 && (
                <section className="seo-section seo-use-cases">
                  <h2 className="seo-h2">{meta.name} Use Cases</h2>
                  <div className="seo-uc-grid">
                    {data.use_cases.filter(uc => uc.title).map((uc, i) => (
                      <div key={i} className="seo-uc-card">
                        <h3 className="seo-h3">{uc.title}</h3>
                        <p>{uc.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'comparisons' && data.comparisons && data.comparisons.filter(c => c.vs_name).length > 0 && (
                <section className="seo-section seo-comparisons">
                  <h2 className="seo-h2">Alternatives to {meta.name}</h2>
                  {data.comparisons.filter(c => c.vs_name).map((c, i) => (
                    <div key={i} className="seo-comp-card">
                      <h3 className="seo-h3">{meta.name} vs {c.vs_name}</h3>
                      <p>{c.summary}</p>
                      {c.differences.filter(Boolean).length > 0 && <ul>{c.differences.filter(Boolean).map((d, di) => <li key={di}>{d}</li>)}</ul>}
                    </div>
                  ))}
                </section>
              )}

              {activeTab === 'long_tail_keywords' && data.long_tail_keywords && (
                <section className="seo-section seo-keywords">
                  <h2 className="seo-h2">Keywords</h2>
                  {(['by_industry', 'by_size', 'by_need'] as const).map(group => {
                    const tags = data.long_tail_keywords![group]
                    if (!tags.length) return null
                    return (
                      <div key={group} style={{ marginBottom: '.6rem' }}>
                        <h3 className="seo-h3" style={{ textTransform: 'capitalize' }}>{group.replace('by_', 'By ')}</h3>
                        <div className="seo-kw-group">{tags.map((t, i) => <span key={i} className="seo-kw-pill">{t}</span>)}</div>
                      </div>
                    )
                  })}
                </section>
              )}

              {activeTab === 'complementary_categories' && (data.complementary_categories || []).length > 0 && (
                <section className="seo-section seo-complementary">
                  <h2 className="seo-h2">Explore Related Categories</h2>
                  <div className="seo-explore-grid">
                    {(data.complementary_categories || []).map((name, i) => (
                      <span key={i} className="seo-explore-pill">{name}</span>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'extended_faq' && data.extended_faq && data.extended_faq.filter(f => f.q).length > 0 && (
                <section className="seo-section seo-faq">
                  <h2 className="seo-h2">Frequently Asked Questions</h2>
                  {data.extended_faq.filter(f => f.q).map((f, i) => (
                    <details key={i} className="seo-faq-item">
                      <summary className="seo-faq-q">{f.q}</summary>
                      <div className="seo-faq-a"><p>{f.a}</p></div>
                    </details>
                  ))}
                </section>
              )}
            </div>
          )}

          {/* ── SEO Quality ── */}
          <div className="sede-quality">
            <div className="sede-quality-title">SEO Quality</div>
            <QualityChecks section={activeTab} data={data} name={meta.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS (defined in same file per codebase pattern)
   ══════════════════════════════════════════════════════════ */

/* ── Tag Input (pills + text input) ── */
function TagInput({ tags, onChange, placeholder, suggestions }: {
  tags: string[]; onChange: (t: string[]) => void; placeholder?: string; suggestions?: string[]
}) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const filtered = useMemo(() => {
    if (!suggestions || !input.trim()) return []
    const q = input.toLowerCase()
    return suggestions.filter(s => s.toLowerCase().includes(q) && !tags.includes(s)).slice(0, 8)
  }, [suggestions, input, tags])

  const add = (val: string) => {
    const v = val.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
    setShowSuggestions(false)
  }

  return (
    <div className="sede-ac-wrap">
      <div className="sede-tags" onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
        {tags.map((t, i) => (
          <span key={i} className="sede-tag">{t}<span className="sede-tag-x" onClick={() => onChange(tags.filter((_, j) => j !== i))}>×</span></span>
        ))}
        <input
          className="sede-tag-input"
          placeholder={tags.length ? '' : placeholder}
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true) }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) } if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1)) }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="sede-ac-list">
          {filtered.map((s, i) => <div key={i} className="sede-ac-item" onMouseDown={() => add(s)}>{s}</div>)}
        </div>
      )}
    </div>
  )
}

/* ── Quality Checks per section ── */
function QualityChecks({ section, data, name }: { section: SectionKey; data: SeoData; name: string }) {
  const checks: { label: string; pass: boolean; warn?: boolean }[] = []

  if (section === 'ai_summary') {
    const len = data.ai_summary.length
    checks.push({ label: 'Has content', pass: len > 0 })
    checks.push({ label: '100-300 characters', pass: len >= 100 && len <= 300, warn: len > 0 && (len < 100 || len > 300) })
    checks.push({ label: `Mentions "${name}"`, pass: data.ai_summary.toLowerCase().includes(name.toLowerCase()) })
  }

  if (section === 'rich_description') {
    const wc = data.rich_description.split(/\s+/).filter(Boolean).length
    const pc = data.rich_description.split('\n\n').filter(Boolean).length
    const lc = countLinks(data.rich_description)
    checks.push({ label: 'Has content', pass: wc > 0 })
    checks.push({ label: '700-900 words', pass: wc >= 700 && wc <= 900, warn: wc > 0 && (wc < 700 || wc > 900) })
    checks.push({ label: '5-7 paragraphs', pass: pc >= 5 && pc <= 7, warn: pc > 0 && (pc < 5 || pc > 7) })
    checks.push({ label: '10-15 internal links', pass: lc >= 10 && lc <= 15, warn: lc > 0 && (lc < 10 || lc > 15) })
    checks.push({ label: `Mentions "${name}"`, pass: data.rich_description.toLowerCase().includes(name.toLowerCase()) })
  }

  if (section === 'buyers_guide') {
    const bg = data.buyers_guide
    checks.push({ label: 'Has features', pass: !!(bg && bg.features.filter(f => f.title).length > 0) })
    checks.push({ label: '6 features', pass: !!(bg && bg.features.filter(f => f.title).length >= 6), warn: !!(bg && bg.features.filter(f => f.title).length > 0 && bg.features.filter(f => f.title).length < 6) })
    checks.push({ label: '5 questions', pass: !!(bg && bg.questions.filter(Boolean).length >= 5), warn: !!(bg && bg.questions.filter(Boolean).length > 0 && bg.questions.filter(Boolean).length < 5) })
    checks.push({ label: '4 pitfalls', pass: !!(bg && bg.pitfalls.filter(Boolean).length >= 4), warn: !!(bg && bg.pitfalls.filter(Boolean).length > 0 && bg.pitfalls.filter(Boolean).length < 4) })
    checks.push({ label: 'Pricing info', pass: !!(bg && bg.pricing_info.trim()) })
  }

  if (section === 'use_cases') {
    const uc = data.use_cases || []
    checks.push({ label: 'Has use cases', pass: uc.filter(u => u.title).length > 0 })
    checks.push({ label: '5 use cases', pass: uc.filter(u => u.title).length >= 5, warn: uc.filter(u => u.title).length > 0 && uc.filter(u => u.title).length < 5 })
    checks.push({ label: 'Unique icons', pass: new Set(uc.map(u => u.icon)).size === uc.length })
  }

  if (section === 'comparisons') {
    const cs = data.comparisons || []
    checks.push({ label: 'Has comparisons', pass: cs.filter(c => c.vs_name).length > 0 })
    checks.push({ label: '3-4 comparisons', pass: cs.filter(c => c.vs_name).length >= 3, warn: cs.filter(c => c.vs_name).length > 0 && cs.filter(c => c.vs_name).length < 3 })
    checks.push({ label: 'All have differences', pass: cs.every(c => c.differences.filter(Boolean).length >= 2) })
  }

  if (section === 'long_tail_keywords') {
    const kw = data.long_tail_keywords
    checks.push({ label: '8+ industry keywords', pass: !!(kw && kw.by_industry.length >= 8), warn: !!(kw && kw.by_industry.length > 0 && kw.by_industry.length < 8) })
    checks.push({ label: '8+ size keywords', pass: !!(kw && kw.by_size.length >= 8), warn: !!(kw && kw.by_size.length > 0 && kw.by_size.length < 8) })
    checks.push({ label: '10+ need keywords', pass: !!(kw && kw.by_need.length >= 10), warn: !!(kw && kw.by_need.length > 0 && kw.by_need.length < 10) })
  }

  if (section === 'complementary_categories') {
    const cc = data.complementary_categories || []
    checks.push({ label: 'Has related categories', pass: cc.length > 0 })
    checks.push({ label: '5 categories', pass: cc.length >= 5, warn: cc.length > 0 && cc.length < 5 })
  }

  if (section === 'extended_faq') {
    const faq = data.extended_faq || []
    const filled = faq.filter(f => f.q && f.a)
    checks.push({ label: 'Has FAQ entries', pass: filled.length > 0 })
    checks.push({ label: '12 Q&A pairs', pass: filled.length >= 12, warn: filled.length > 0 && filled.length < 12 })
    checks.push({ label: 'Answers 50+ words avg', pass: filled.length > 0 && filled.reduce((s, f) => s + f.a.split(/\s+/).length, 0) / filled.length >= 50 })
  }

  return (
    <>
      {checks.map((c, i) => (
        <div key={i} className="sede-quality-row">
          <span className={`sede-quality-icon ${c.pass ? 'sede-quality-pass' : c.warn ? 'sede-quality-warn' : 'sede-quality-fail'}`}>
            {c.pass ? '✓' : c.warn ? '⚠' : '✗'}
          </span>
          {c.label}
        </div>
      ))}
    </>
  )
}
