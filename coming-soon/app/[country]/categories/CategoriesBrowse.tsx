'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from '../../components/CountryLink'
import { fetchLaunchedCategories } from '../../iww-hq/data/category-storage'
import type { Category } from '../../iww-hq/data/category-storage'

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
   SVG icon helper
   ═══════════════════════════════════════════ */

const Ico = ({ d, size = 20, color = 'currentColor', sw = 1.5 }: {
  d: string; size?: number; color?: string; sw?: number
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d.split('|').map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ico = {
  cpu:    'M4 4h16v16H4z|M9 1v3|M15 1v3|M9 20v3|M15 20v3|M1 9h3|M1 15h3|M20 9h3|M20 15h3',
  code:   'M16 18l6-6-6-6|M8 6l-6 6 6 6',
  globe:  'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10|M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10',
  trend:  'M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6',
  home:   'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  brief:  'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z|M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  arrow:  'M5 12h14|M12 5l7 7-7 7',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  x:      'M18 6L6 18|M6 6l12 12',
}

/* ═══════════════════════════════════════════
   Sector metadata — icon, accent, pastel bg
   ═══════════════════════════════════════════ */

function sectorMeta(name: string) {
  const n = name.toLowerCase()
  if (n.includes('artificial') || n.includes('machine learning')) return { icon: ico.cpu,   color: '#8B5CF6', pastel: '#DDD6FE' }
  if (n.includes('software') || n.includes('saas'))               return { icon: ico.code,  color: '#3B82F6', pastel: '#BFDBFE' }
  if (n.includes('it service') || n.includes('agencies'))         return { icon: ico.globe, color: '#14B8A6', pastel: '#99F6E4' }
  if (n.includes('startup') || n.includes('innovation'))          return { icon: ico.trend, color: '#E8553D', pastel: '#FECACA' }
  if (n.includes('local'))                                        return { icon: ico.home,  color: '#F59E0B', pastel: '#FDE68A' }
  if (n.includes('professional'))                                 return { icon: ico.brief, color: '#2FAE6A', pastel: '#BBF7D0' }
  return { icon: ico.layers, color: '#E8553D', pastel: '#FECACA' }
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export default function CategoriesBrowse() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLaunchedCategories().then(setCategories).finally(() => setLoading(false))
  }, [])

  const tree = useMemo(() => buildTree(categories), [categories])

  /* Search across all levels */
  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return categories
      .filter(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
  }, [categories, search])

  /* All L2 nodes enriched with parent sector meta */
  const allL2 = useMemo(() => {
    const out: (CatNode & { parentMeta: ReturnType<typeof sectorMeta> })[] = []
    tree.forEach(sector => {
      const meta = sectorMeta(sector.name)
      sector.children.forEach(l2 => out.push({ ...l2, parentMeta: meta }))
    })
    return out
  }, [tree])

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
          <div className="cb-hero-top">
            <h1 className="cb-title">Explore <em>Categories</em></h1>
            <p className="cb-desc">
              Discover businesses across {(stats.l2 + stats.l3).toLocaleString()} categories in {stats.sectors} industry sectors. Find the right tools, services, and solutions for your needs.
            </p>
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
          </div>

          <div className="cb-search">
            <span className="cb-search-ico"><Ico d={ico.search} size={18} /></span>
            <input
              type="text"
              placeholder="Search across all categories\u2026"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setSearch(''), 200)}
            />
            {search && (
              <button className="cb-search-x" onClick={() => setSearch('')} aria-label="Clear">
                <Ico d={ico.x} size={14} />
              </button>
            )}

            {/* Dropdown results */}
            {isSearching && (
              <div className="cb-dropdown">
                {searchResults && searchResults.length > 0 ? (
                  <>
                    <div className="cb-dropdown-label">CATEGORIES</div>
                    {searchResults.slice(0, 8).map(cat => {
                      const parent = categories.find(c => c.id === cat.parentId)
                      const trail = parent ? parent.name : ''
                      return (
                        <Link key={cat.id} href={`/category/${cat.slug}`} className="cb-dropdown-row">
                          <Ico d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6|M15 3h6v6|M10 14L21 3" size={14} />
                          <span className="cb-dropdown-name">{cat.name}</span>
                          {trail && <span className="cb-dropdown-trail">{trail}</span>}
                        </Link>
                      )
                    })}
                    {searchResults.length > 8 && (
                      <div className="cb-dropdown-more">+{searchResults.length - 8} more results</div>
                    )}
                  </>
                ) : (
                  <div className="cb-dropdown-empty">No results for &ldquo;{search}&rdquo;</div>
                )}
              </div>
            )}
          </div>
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
                  {/* Colored header with icon + name */}
                  <Link href={`/category/${sector.slug}`} className="cb-sector-hd">
                    <Ico d={meta.icon} size={32} color="var(--h-heading)" sw={1.2} />
                    <h2 className="cb-sector-name">{sector.name}</h2>
                  </Link>

                  {/* Subcategory list */}
                  <div className="cb-sector-body">
                    {sector.children.map(child => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        className="cb-sector-row"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ══════════════════════════════════════
             L2 Category cards — same card style
             ══════════════════════════════════════ */}
          <h2 className="cb-section-heading">All <em>Categories</em></h2>
          <div className="cb-cats">
            {allL2.map(cat => (
              <div
                key={cat.id}
                className="cb-cat"
                style={{ '--sc-pastel': cat.parentMeta.pastel, '--sc': cat.parentMeta.color } as React.CSSProperties}
              >
                <Link href={`/category/${cat.slug}`} className="cb-cat-hd">
                  <h3 className="cb-cat-name">{cat.name}</h3>
                </Link>

                {cat.children.length > 0 && (
                  <div className="cb-cat-body">
                    {cat.children.map(child => (
                      <Link key={child.id} href={`/category/${child.slug}`} className="cb-cat-row">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          </>
      </div>
    </section>
  )
}
