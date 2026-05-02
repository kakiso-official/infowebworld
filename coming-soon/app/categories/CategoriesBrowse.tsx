'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { mapRow } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { CATEGORIES as STATIC_CATS } from '../config/categories-data'
import HIcon from '../sector/components/HIcon'

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
  const categories = useMemo<Category[]>(
    () => STATIC_CATS.map(r => mapRow(r as unknown as Record<string, unknown>)),
    []
  )
  const [search, setSearch] = useState('')
  const loading = false

  const tree = useMemo(() => buildTree(categories), [categories])

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
      <div className="cb-shapes" aria-hidden="true">
        <div className="cb-shape cb-shape--1" />
        <div className="cb-shape cb-shape--2" />
        <div className="cb-shape cb-shape--3" />
        <div className="cb-shape cb-shape--4" />
        <div className="cb-shape cb-shape--5" />
        <div className="cb-shape cb-shape--6" />
        <div className="cb-shape cb-shape--7" />
      </div>
      <div className="cb-wrap">

        {/* ── Hero ── */}
        <div className="cb-hero">
          <div className="cb-hero-top">
            <h2 className="cb-title">Explore <em>Categories</em></h2>
            <p className="cb-desc">
              <strong>{(stats.l2 + stats.l3).toLocaleString()} categories</strong> across <strong>{stats.sectors} industry sectors</strong>. Find, compare, and connect with the best tools, services, and solutions.
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
            <span className="cb-search-ico"><HIcon name="globalSearch" size={24} /></span>
            <input
              type="text"
              placeholder="Search AI, SaaS, Marketing, CRM"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setSearch(''), 200)}
            />
            {search && (
              <button className="cb-search-x" onClick={() => setSearch('')} aria-label="Clear">
                <HIcon name="cancel" size={14} />
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
                        <Link key={cat.id} href={cat.sectorSlug ? `/${cat.sectorSlug}/${cat.slug}` : `/${cat.slug}`} className="cb-dropdown-row">
                          <HIcon name="externalLink" size={14} />
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
                  <Link href={`/${sector.slug}`} className="cb-sector-hd">
                    <HIcon name={meta.icon} size={32} color="#000" sw={1.2} />
                    <h2 className="cb-sector-name">{sector.name}</h2>
                  </Link>

                  {/* Subcategory list */}
                  <div className="cb-sector-body">
                    {sector.children.map(child => (
                      <Link
                        key={child.id}
                        href={`/${sector.slug}/${child.slug}`}
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

        </>
      </div>
    </section>
  )
}
