'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'

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
   SVG icon helper + icon paths
   ═══════════════════════════════════════════ */

const Ico = ({ d, size = 20, color = 'currentColor', fill, sw = 1.5 }: {
  d: string; size?: number; color?: string; fill?: boolean; sw?: number
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d.split('|').map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ico = {
  zap:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  code:   'M16 18l6-6-6-6|M8 6l-6 6 6 6',
  globe:  'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10|M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10',
  trend:  'M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6',
  home:   'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  brief:  'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z|M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  arrow:  'M5 12h14|M12 5l7 7-7 7',
  chevR:  'M9 18l6-6-6-6',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  x:      'M18 6L6 18|M6 6l12 12',
}

/* ═══════════════════════════════════════════
   Sector metadata (icon + color per L1)
   ═══════════════════════════════════════════ */

function sectorMeta(name: string) {
  const n = name.toLowerCase()
  if (n.includes('artificial') || n.includes('machine learning')) return { icon: ico.zap, color: '#8B5CF6', fill: true }
  if (n.includes('software') || n.includes('saas'))               return { icon: ico.code, color: '#3B82F6', fill: false }
  if (n.includes('it service') || n.includes('agencies'))         return { icon: ico.globe, color: '#14B8A6', fill: false }
  if (n.includes('startup') || n.includes('innovation'))          return { icon: ico.trend, color: '#E8553D', fill: false }
  if (n.includes('local'))                                        return { icon: ico.home, color: '#F59E0B', fill: false }
  if (n.includes('professional'))                                 return { icon: ico.brief, color: '#2FAE6A', fill: false }
  return { icon: ico.layers, color: '#E8553D', fill: false }
}

/* ═══════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════ */

export default function CategoriesBrowse() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeSector, setActiveSector] = useState('all')
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLaunchedCategories().then(setCategories).finally(() => setLoading(false))
  }, [])

  const tree = useMemo(() => buildTree(categories), [categories])

  /* All L2 enriched with parent sector info */
  const allL2 = useMemo(() => {
    const out: (CatNode & { sectorName: string; sectorSlug: string; sectorColor: string })[] = []
    tree.forEach(sector => {
      const color = sector.color || sectorMeta(sector.name).color
      sector.children.forEach(l2 => out.push({ ...l2, sectorName: sector.name, sectorSlug: sector.slug, sectorColor: color }))
    })
    return out
  }, [tree])

  /* Filtered L2 */
  const filteredL2 = useMemo(() => {
    if (activeSector === 'all') return allL2
    return allL2.filter(c => c.sectorSlug === activeSector)
  }, [allL2, activeSector])

  /* Search across all levels */
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

  if (loading) return <section className="cb"><div className="cb-wrap cb-loading">Loading categories&hellip;</div></section>

  const isSearching = !!search.trim()

  return (
    <section className="cb">
      <div className="cb-wrap">

        {/* ── Hero ── */}
        <div className="cb-hero">
          <div className="cb-tag"><Ico d={ico.layers} size={13} /> BROWSE DIRECTORY</div>
          <h1 className="cb-title">Explore <em>Categories</em></h1>
          <p className="cb-desc">
            Discover businesses across {(stats.l2 + stats.l3).toLocaleString()} categories in {stats.sectors} industry sectors.
          </p>

          {/* Search */}
          <div className="cb-search">
            <span className="cb-search-ico"><Ico d={ico.search} size={18} /></span>
            <input
              type="text"
              placeholder="Search across all categories\u2026"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="cb-search-x" onClick={() => setSearch('')} aria-label="Clear search">
                <Ico d={ico.x} size={14} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="cb-stats">
            {[
              { n: stats.sectors, l: 'Sectors', c: '#E8553D' },
              { n: stats.l2, l: 'Categories', c: '#3B82F6' },
              { n: stats.l3, l: 'Subcategories', c: '#8B5CF6' },
            ].map(s => (
              <div key={s.l} className="cb-stat">
                <span className="cb-stat-dot" style={{ background: s.c }} />
                <span className="cb-stat-n">{s.n}</span>
                <span className="cb-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
           Search mode — flat results
           ══════════════════════════════════════ */}
        {isSearching ? (
          <div className="cb-results">
            <p className="cb-results-count">
              {searchResults?.length || 0} result{searchResults?.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>

            {searchResults && searchResults.length > 0 ? (
              <div className="cb-grid cb-grid--3">
                {searchResults.map(cat => {
                  const parent = categories.find(c => c.id === cat.parentId)
                  const gp = parent ? categories.find(c => c.id === parent.parentId) : null
                  const lvlLabel: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }
                  const lvlColor: Record<number, string> = { 1: '#E8553D', 2: '#3B82F6', 3: '#8B5CF6' }
                  const trail = [gp?.name, parent?.name].filter(Boolean).join(' \u203A ')

                  return (
                    <Link href={`/category/${cat.slug}`} key={cat.id} className="cb-res">
                      <div className="cb-res-top">
                        <span className="cb-res-lvl" style={{ background: `${lvlColor[cat.level]}14`, color: lvlColor[cat.level] }}>
                          {lvlLabel[cat.level] || `L${cat.level}`}
                        </span>
                        {trail && <span className="cb-res-path">{trail}</span>}
                      </div>
                      <h3 className="cb-res-name">{cat.name}</h3>
                      {cat.description && <p className="cb-res-desc">{cat.description}</p>}
                      <span className="cb-res-arrow"><Ico d={ico.arrow} size={14} /></span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="cb-empty">
                <Ico d={ico.search} size={48} color="var(--h-muted)" />
                <p>No categories match &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════
               L1 Sector showcase cards
               ══════════════════════════════════════ */}
            <div className="cb-sectors">
              {tree.map(sector => {
                const meta = sectorMeta(sector.name)
                const color = sector.color || meta.color
                const l2Count = sector.children.length
                const l3Count = countByLevel(sector, 3)
                const preview = sector.children.slice(0, 5)

                return (
                  <Link
                    href={`/category/${sector.slug}`}
                    key={sector.id}
                    className="cb-sector"
                    style={{ '--sc': color, '--sc-light': `${color}0C`, '--sc-med': `${color}18` } as React.CSSProperties}
                  >
                    <div className="cb-sector-ico">
                      <Ico d={meta.icon} size={24} color={color} fill={meta.fill} sw={meta.fill ? 0 : 1.8} />
                    </div>
                    <h2 className="cb-sector-name">{sector.name}</h2>
                    <p className="cb-sector-count">{l2Count} categories &middot; {l3Count} subcategories</p>
                    <div className="cb-sector-list">
                      {preview.map(c => (
                        <span key={c.id} className="cb-sector-child">{c.name}</span>
                      ))}
                      {l2Count > 5 && <span className="cb-sector-more">+{l2Count - 5} more</span>}
                    </div>
                    <div className="cb-sector-foot">
                      <span className="cb-sector-cta">Explore <Ico d={ico.chevR} size={12} /></span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* ══════════════════════════════════════
               Browse All L2 — filter pills + grid
               ══════════════════════════════════════ */}
            <div className="cb-browse" ref={gridRef}>
              <h2 className="cb-browse-title">Browse All Categories</h2>

              {/* Filter pills */}
              <div className="cb-filters">
                <button
                  className={`cb-pill ${activeSector === 'all' ? 'cb-pill--on' : ''}`}
                  onClick={() => setActiveSector('all')}
                >
                  All <span className="cb-pill-n">{allL2.length}</span>
                </button>
                {tree.map(s => {
                  const c = s.color || sectorMeta(s.name).color
                  const on = activeSector === s.slug
                  return (
                    <button
                      key={s.id}
                      className={`cb-pill ${on ? 'cb-pill--on' : ''}`}
                      style={on ? { background: c, borderColor: c } : { '--pc': c } as React.CSSProperties}
                      onClick={() => setActiveSector(on ? 'all' : s.slug)}
                    >
                      <span className="cb-pill-dot" style={{ background: on ? '#fff' : c }} />
                      {s.name}
                      <span className="cb-pill-n">{s.children.length}</span>
                    </button>
                  )
                })}
              </div>

              {/* L2 grid */}
              <div className="cb-grid">
                {filteredL2.map(cat => {
                  const l3 = cat.children?.length || 0
                  return (
                    <Link
                      href={`/category/${cat.slug}`}
                      key={cat.id}
                      className="cb-card"
                      style={{ '--cc': cat.sectorColor } as React.CSSProperties}
                    >
                      <div className="cb-card-head">
                        <span className="cb-card-dot" style={{ background: cat.sectorColor }} />
                        <span className="cb-card-sector">{cat.sectorName.split(' & ')[0]}</span>
                      </div>
                      <h3 className="cb-card-name">{cat.name}</h3>
                      {cat.description && <p className="cb-card-desc">{cat.description}</p>}
                      <div className="cb-card-foot">
                        {l3 > 0 && <span className="cb-card-count">{l3} subcategories</span>}
                        <span className="cb-card-arrow"><Ico d={ico.arrow} size={14} /></span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
