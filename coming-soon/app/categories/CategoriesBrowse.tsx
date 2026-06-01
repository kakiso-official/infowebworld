'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mapRow } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { CATEGORIES as STATIC_CATS } from '../config/categories-data'

/* Folder icons — same closed-folder glyph used on /listing's Related
   Categories and L2-L4 SubcategoryList; open-folder variant for the
   subcategory rows (level inside a sector → contents visible). */
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
function OpenFolderIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      {/* Back of folder */}
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M6 16h12l3 4h21v6" />
      {/* Open front flap — angled outward at the top showing contents */}
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M3 22l4 18h30l5-18z" />
    </svg>
  )
}

/* ═══════════════════════════════════════════
   Types & tree builder
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

function countByLevel(node: CatNode, lvl: number): number {
  return node.children.reduce((s, c) => s + (c.level === lvl ? 1 : 0) + countByLevel(c, lvl), 0)
}


/* ═══════════════════════════════════════════
   Sector metadata — icon, accent, pastel bg
   ═══════════════════════════════════════════ */

function sectorMeta(name: string) {
  const n = name.toLowerCase()
  if (n.includes('artificial') || n.includes('machine learning')) return { icon: 'cpu',        color: '#8B5CF6', pastel: '#DDD6FE' }
  if (n.includes('software') || n.includes('saas'))               return { icon: 'code',       color: '#3B82F6', pastel: '#BFDBFE' }
  if (n.includes('it service') || n.includes('agencies'))         return { icon: 'globe',      color: '#14B8A6', pastel: '#99F6E4' }
  if (n.includes('startup') || n.includes('innovation'))          return { icon: 'trendingUp', color: '#E8553D', pastel: '#FECACA' }
  if (n.includes('local'))                                        return { icon: 'home',       color: '#F59E0B', pastel: '#FDE68A' }
  if (n.includes('professional'))                                 return { icon: 'briefcase',  color: '#2FAE6A', pastel: '#BBF7D0' }
  return { icon: 'layers', color: '#E8553D', pastel: '#FECACA' }
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

/* Reads the taxonomy straight from the client bundle — no API, no hydration
   payload from the server. STATIC_CATS is imported here (client file), so the
   data lives in the JS chunk (hashed filename = cached forever) instead of
   being serialized into every page's HTML. */
export default function CategoriesBrowse() {
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

  const tree = useMemo(() => buildTree(categories), [categories])

  /* Search across all levels — purely client-side over the static taxonomy. */
  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return categories
      .filter(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
  }, [categories, search])

  const stats = useMemo(() => ({
    sectors: tree.length,
    l2: categories.filter(c => c.level === 2).length,
    l3: categories.filter(c => c.level === 3).length,
  }), [tree, categories])

  /* Click outside closes the dropdown — same UX as sector landing HeroSearch. */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  /* Esc clears focus, Cmd/Ctrl+K refocuses — global keyboard shortcuts. */
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
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  if (loading) return <section className="cb"><div className="cb-wrap cb-loading">Loading categories&hellip;</div></section>

  const isSearching = !!search.trim() && open
  const hasResults = searchResults && searchResults.length > 0
  const noResults = searchResults && !hasResults

  return (
    <section className="cb">
      <div className="cb-wrap">

        {/* ── Hero — mirrors the L2-L4 .cd-hero look: brand watermark behind,
            breadcrumb on top, sized-down title, lighter desc, byline + updated
            meta row underneath. ── */}
        <header className="cb-hero cb-hero--v2">
          {/* Brand watermark — InfoWebWorld's 4-quadrant window mark in its
              signature colors (mustard / coral / sky / lime). Decorative only,
              hidden from screen readers, sits behind content. */}
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

          {/* Breadcrumb — Home / Business Categories */}
          <nav className="cb-hero-bc" aria-label="Breadcrumb">
            <Link href="/" className="cb-hero-bc-link">Home</Link>
            <span className="cb-hero-bc-sep" aria-hidden="true">/</span>
            <span className="cb-hero-bc-current">Business Categories</span>
          </nav>

          {/* H2 title — H1 already sits sr-only in the page route */}
          <h2 className="cb-title">Explore <em>Categories</em></h2>

          {/* Description */}
          <p className="cb-desc">
            <strong>{(stats.l2 + stats.l3).toLocaleString()} categories</strong> across <strong>{stats.sectors} industry sectors</strong>. Find, compare, and connect with the best tools, services, and solutions.
          </p>

          {/* Stat pills */}
          <div className="cb-hero-pills">
            {[
              { n: stats.sectors, l: 'Sectors', c: '#E8553D' },
              { n: stats.l2, l: 'Categories', c: '#3B82F6' },
              { n: stats.l3, l: 'Subcategories', c: '#8B5CF6' },
            ].map(s => (
              <span key={s.l} className="cb-hero-pill" style={{ '--pc': s.c } as React.CSSProperties}>
                <strong>{s.n}</strong> {s.l}
              </span>
            ))}
          </div>

          {/* Meta row — byline + updated. E-E-A-T signal for Google + LLMs;
              <time dateTime> keeps freshness machine-readable. */}
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

        {/* ── Search — same .tlp-hsr structure as the sector landing hero
            search bar, so styles in test-landing-page.css (rounded white card
            with green focus glow, icon + input + Search button) apply
            verbatim. ── */}
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
              placeholder="Search 14,000+ categories — AI, SaaS, Marketing, CRM"
              value={search}
              onChange={e => onChange(e.target.value)}
              onFocus={() => { setFocused(true); if (search.trim()) setOpen(true) }}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Search categories"
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
                        href={cat.sectorSlug ? `/${cat.sectorSlug}/${cat.slug}` : `/${cat.slug}`}
                        className="tlp-hsr-row"
                        onClick={() => setOpen(false)}
                      >
                        <span className="tlp-hsr-row-dot" style={{ background: cat.color || '#003B2A' }} />
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
           Sector cards — always visible
           ══════════════════════════════════════ */}
        <>
          <h2 className="cb-section-heading">All <em>Sectors</em></h2>
          <div className="cb-sectors">
            {tree.map(sector => {
              const meta = sectorMeta(sector.name)

              return (
                <div
                  key={sector.id}
                  className="cb-sector"
                  style={{ '--sc-pastel': meta.pastel, '--sc': meta.color } as React.CSSProperties}
                >
                  {/* Colored header with closed-folder icon + name */}
                  <Link href={`/${sector.slug}`} className="cb-sector-hd">
                    <span className="cb-sector-folder" aria-hidden="true">
                      <ClosedFolderIcon size={32} />
                    </span>
                    <h2 className="cb-sector-name">{sector.name}</h2>
                  </Link>

                  {/* Subcategory list — each row prefixed with an open-folder
                      icon so the visual hierarchy reads as: sector folder
                      (closed, big) → contents (open, small). */}
                  <div className="cb-sector-body">
                    {sector.children.map(child => (
                      <Link
                        key={child.id}
                        href={`/${sector.slug}/${child.slug}`}
                        className="cb-sector-row"
                      >
                        <span className="cb-sector-row-ico" aria-hidden="true">
                          <OpenFolderIcon size={20} />
                        </span>
                        <span className="cb-sector-row-name">{child.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </>
      </div>
    </section>
  )
}
