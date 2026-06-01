'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mapRow } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { CATEGORIES as STATIC_CATS } from '../config/categories-data'

/* Folder icons — same closed-folder glyph used on /categories and on
   /listing's Related Categories list; open-folder variant for the
   subcategory rows (the level inside a parent → contents visible). */
function ClosedFolderIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M6 14h12l3 4h21v22H6z" />
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" opacity=".55"
        d="M6 14l3 4h12l3 4h18" />
    </svg>
  )
}
function OpenFolderIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M6 16h12l3 4h21v6" />
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M3 22l4 18h30l5-18z" />
    </svg>
  )
}

/* ═══════════════════════════════════════════
   Types & tree builder (shared with CategoriesBrowse)
   ═══════════════════════════════════════════ */

type CatNode = Category & { children: CatNode[] }

function buildTree(cats: Category[]): CatNode[] {
  const map = new Map<string, CatNode>()
  const roots: CatNode[] = []
  cats.forEach(c => map.set(c.id, { ...c, children: [] }))
  cats.forEach(c => {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) map.get(c.parentId)!.children.push(node)
    else if (c.level === 1) roots.push(node)
  })
  const sort = (ns: CatNode[]) => {
    ns.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
    ns.forEach(n => sort(n.children))
  }
  sort(roots)
  return roots
}

/* ═══════════════════════════════════════════
   Sector metadata — accent + pastel bg + short display label
   ═══════════════════════════════════════════ */

/* Short, clean display labels — keep heading short and search-friendly
   ("AI & ML Directory" reads better than "Artificial Intelligence & ML
   Directory"). Sector.name from the static taxonomy still appears in body
   copy for long-tail SEO. */
const SHORT_NAMES: Record<string, string> = {
  'ai-ml': 'AI & ML',
  'software-saas': 'Software & SaaS',
  'it-services-agencies': 'IT Services & Agencies',
  'startups-innovation': 'Startups & Innovation',
  'local-businesses': 'Local Businesses',
  'professional-services': 'Professional Services',
}

function sectorMeta(name: string) {
  const n = name.toLowerCase()
  if (n.includes('artificial') || n.includes('machine learning')) return { color: '#8B5CF6', pastel: '#DDD6FE' }
  if (n.includes('software') || n.includes('saas'))               return { color: '#3B82F6', pastel: '#BFDBFE' }
  if (n.includes('it service') || n.includes('agencies'))         return { color: '#14B8A6', pastel: '#99F6E4' }
  if (n.includes('startup') || n.includes('innovation'))          return { color: '#E8553D', pastel: '#FECACA' }
  if (n.includes('local'))                                        return { color: '#F59E0B', pastel: '#FDE68A' }
  if (n.includes('professional'))                                 return { color: '#2FAE6A', pastel: '#BBF7D0' }
  return { color: '#E8553D', pastel: '#FECACA' }
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

/* Reads the taxonomy straight from the client bundle — no prop serialization,
   no network fetch. Same static import as CategoriesBrowse, so the browser
   only downloads the gzipped chunk once across the whole site. */
export default function SectorAllBrowse({ sectorSlug }: { sectorSlug: string }) {
  const router = useRouter()
  const categories = useMemo<Category[]>(
    () => STATIC_CATS.map(r => mapRow(r as unknown as Record<string, unknown>)),
    []
  )
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const loading = false

  /* Find the L1 sector in the tree */
  const tree = useMemo(() => buildTree(categories), [categories])
  const sector = useMemo(() => tree.find(s => s.slug === sectorSlug) || null, [tree, sectorSlug])
  const meta = useMemo(() => sector ? sectorMeta(sector.name) : { color: '#E8553D', pastel: '#FECACA' }, [sector])
  /* Short label for the hero heading — falls back to sector.name. */
  const shortName = SHORT_NAMES[sectorSlug] || sector?.name || ''

  /* All categories within this sector (L2 + L3) */
  const sectorCats = useMemo(() => {
    if (!sector) return []
    const ids = new Set<string>()
    const collect = (node: CatNode) => {
      ids.add(node.id)
      node.children.forEach(collect)
    }
    collect(sector)
    return categories.filter(c => ids.has(c.id) && c.level > 1)
  }, [sector, categories])

  /* Search within this sector */
  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return sectorCats
      .filter(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
  }, [sectorCats, search])

  /* L2 categories with their L3 children */
  const l2Cards = useMemo(() => {
    if (!sector) return []
    return sector.children.map(l2 => ({
      ...l2,
      l3Count: l2.children.length,
      totalListings: l2.children.reduce((s, c) => s + c.listingCount, 0) + l2.listingCount,
    }))
  }, [sector])

  const stats = useMemo(() => ({
    l2: sector?.children.length ?? 0,
    l3: sector?.children.reduce((s, l2) => s + l2.children.length, 0) ?? 0,
    listings: sectorCats.reduce((s, c) => s + c.listingCount, 0),
  }), [sector, sectorCats])

  /* Click outside closes dropdown — same UX as sector landing HeroSearch. */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  /* Esc clears focus, Cmd/Ctrl+K refocuses. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        const el = inputRef.current
        if (el) { el.focus(); el.select() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onChange = (v: string) => {
    setSearch(v)
    setOpen(v.trim().length >= 1)
  }

  const clear = () => { setSearch(''); setOpen(false); inputRef.current?.focus() }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = search.trim()
    if (!term) { inputRef.current?.focus(); return }
    router.push(`/search?q=${encodeURIComponent(term)}&sector=${encodeURIComponent(sectorSlug)}`)
  }

  if (loading) return <section className="cb"><div className="cb-wrap cb-loading">Loading categories&hellip;</div></section>
  if (!sector) return <section className="cb"><div className="cb-wrap cb-loading">Sector not found</div></section>

  const isSearching = !!search.trim() && open
  const hasResults = searchResults && searchResults.length > 0
  const noResults = searchResults && !hasResults

  return (
    <section className="cb">
      <div className="cb-wrap">

        {/* ── Hero — mirrors the L2-L4 .cd-hero look + /categories enhancements:
            brand watermark, breadcrumb, leaner title, desc, stat pills, byline
            meta row. No border-bottom between meta and search. ── */}
        <header className="cb-hero cb-hero--v2">
          {/* Brand watermark — InfoWebWorld's 4-quadrant window mark */}
          <svg
            className="cb-hero-watermark"
            viewBox="0 0 250 250"
            aria-hidden="true"
            focusable="false"
          >
            <polygon fill="#FEB801" points="117.62 76.04 76.04 76.04 76.04 125 49.89 125 49.89 49.89 117.62 49.89 117.62 76.04" />
            <polygon fill="#F25022" points="173.96 117.62 173.96 76.04 132.38 76.04 132.38 49.89 200.11 49.89 200.11 117.62 173.96 117.62" />
            <polygon fill="#01A4EF" points="76.04 125 76.04 173.96 125 173.96 125 200.11 49.89 200.11 49.89 125 76.04 125" />
            <polygon fill="#7FBA00" points="125 173.96 173.96 173.96 173.96 132.38 200.11 132.38 200.11 200.11 125 200.11 125 173.96" />
          </svg>

          {/* Breadcrumb — Home / {Sector} Categories */}
          <nav className="cb-hero-bc" aria-label="Breadcrumb">
            <Link href="/" className="cb-hero-bc-link">Home</Link>
            <span className="cb-hero-bc-sep" aria-hidden="true">/</span>
            <span className="cb-hero-bc-current">{shortName} Categories</span>
          </nav>

          {/* H2 title — short, catchy "{Sector} Categories" framing.
              Sector.name (the canonical taxonomy long-form, e.g. "Artificial
              Intelligence & ML") still appears in body copy below for
              long-tail SEO. H1 lives sr-only in the page route. */}
          <h2 className="cb-title">
            <em style={{ color: meta.color, borderBottomColor: meta.color }}>{shortName}</em> Categories
          </h2>

          {/* Description — full canonical sector name in body for SEO */}
          {sector.description && (
            <p className="cb-desc">{sector.description}</p>
          )}
          <p className="cb-desc">
            Every <strong>{sector.name}</strong> category on InfoWebWorld: <strong>{stats.l2} categories</strong>, <strong>{stats.l3.toLocaleString()} subcategories</strong>, every verified company. Search, compare, connect.
          </p>

          {/* Stat pills */}
          <div className="cb-hero-pills">
            {[
              { n: stats.l2, l: 'Categories', c: meta.color },
              { n: stats.l3, l: 'Subcategories', c: '#8B5CF6' },
              { n: stats.listings, l: 'Listings', c: '#2FAE6A' },
            ].map(s => (
              <span key={s.l} className="cb-hero-pill" style={{ '--pc': s.c } as React.CSSProperties}>
                <strong>{s.n.toLocaleString()}</strong> {s.l}
              </span>
            ))}
          </div>

          {/* Meta row — byline + updated. E-E-A-T signal. */}
          <div className="cb-hero-meta">
            <span className="cb-hero-byline">
              By <strong>InfoWebWorld Editorial</strong> · Curated worldwide
            </span>
            <span className="cb-hero-meta-sep" aria-hidden="true">·</span>
            <span className="cb-hero-updated">
              Updated{' '}
              <time dateTime={new Date().toISOString()}>
                {new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </span>
          </div>
        </header>

        {/* ── Search — same .tlp-hsr structure as the sector-landing hero ── */}
        <div className="tlp-hero-search cb-hero-search-wrap" ref={wrapRef}>
          <form
            className={'tlp-hsr' + ((focused || open) ? ' tlp-hsr--on' : '')}
            onSubmit={onSubmit}
            role="search"
          >
            <span className="tlp-hsr-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              className="tlp-hsr-input"
              placeholder={`Search within ${sector.name}`}
              value={search}
              onChange={e => onChange(e.target.value)}
              onFocus={() => { setFocused(true); if (search.trim()) setOpen(true) }}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={`Search within ${sector.name}`}
            />
            {search && (
              <button type="button" className="tlp-hsr-clear" onClick={clear} aria-label="Clear">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className="tlp-hsr-go" aria-label="Search">
              <span>Search</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {isSearching && (hasResults || noResults) && (
            <div className="tlp-hsr-pop" role="listbox">
              {hasResults && (
                <div className="tlp-hsr-sec">
                  <div className="tlp-hsr-sec-lbl">CATEGORIES</div>
                  {searchResults!.slice(0, 8).map(cat => {
                    const parent = categories.find(c => c.id === cat.parentId)
                    const trail = parent ? parent.name : ''
                    return (
                      <Link
                        key={cat.id}
                        href={`/${sectorSlug}/${cat.slug}`}
                        className="tlp-hsr-row"
                        onClick={() => setOpen(false)}
                      >
                        <span className="tlp-hsr-row-dot" style={{ background: cat.color || meta.color }} />
                        <span className="tlp-hsr-row-text">
                          <span className="tlp-hsr-row-name">{cat.name}</span>
                          {trail && <span className="tlp-hsr-row-sub">in {trail}</span>}
                        </span>
                        <span className="tlp-hsr-row-tag tlp-hsr-row-tag--soft">
                          L{cat.level}
                        </span>
                      </Link>
                    )
                  })}
                  {searchResults!.length > 8 && (
                    <div className="tlp-hsr-sec-lbl" style={{ paddingTop: 6, opacity: .65 }}>
                      +{searchResults!.length - 8} more results — press Enter to see all
                    </div>
                  )}
                </div>
              )}

              {noResults && (
                <div className="tlp-hsr-empty">
                  No results for <strong>&ldquo;{search}&rdquo;</strong>
                  <span>Press Enter to search across the full directory.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
           L2 Category cards — main content
           ══════════════════════════════════════ */}
        <h2 className="cb-section-heading">Browse <em>Categories</em> in {shortName}</h2>
        <div className="cb-sectors">
          {l2Cards.map(l2 => (
            <div
              key={l2.id}
              className="cb-sector"
              style={{ '--sc-pastel': meta.pastel, '--sc': meta.color } as React.CSSProperties}
            >
              <Link href={`/${sectorSlug}/${l2.slug}`} className="cb-sector-hd">
                <span className="cb-sector-folder" aria-hidden="true">
                  <ClosedFolderIcon size={32} />
                </span>
                <h2 className="cb-sector-name">
                  {l2.name}
                  {l2.l3Count > 0 && (
                    <span className="cb-sector-count">{l2.l3Count}</span>
                  )}
                </h2>
              </Link>

              {l2.children.length > 0 && (
                <div className="cb-sector-body">
                  {l2.children.map(l3 => (
                    <Link
                      key={l3.id}
                      href={`/${sectorSlug}/${l3.slug}`}
                      className="cb-sector-row"
                    >
                      <span className="cb-sector-row-ico" aria-hidden="true">
                        <OpenFolderIcon size={20} />
                      </span>
                      <span className="cb-sector-row-name">{l3.name}</span>
                      {l3.listingCount > 0 && (
                        <span className="cb-sector-row-count">{l3.listingCount}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
