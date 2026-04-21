'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from '../../components/CountryLink'
import { fetchLaunchedCategories, mapRow } from '../../iww-hq/data/category-storage'
import type { Category } from '../../iww-hq/data/category-storage'
import HIcon from '../sector/components/HIcon'

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

export default function SectorAllBrowse({ sectorSlug, initialCategories }: { sectorSlug: string; initialCategories?: Record<string, unknown>[] }) {
  const initCats = useMemo(() => initialCategories?.map(r => mapRow(r)) ?? [], [initialCategories])
  const [categories, setCategories] = useState<Category[]>(initCats)
  const [loading, setLoading] = useState(!initialCategories?.length)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (initialCategories?.length) { setLoading(false); return }
    fetchLaunchedCategories().then(setCategories).finally(() => setLoading(false))
  }, [initialCategories])

  /* Find the L1 sector in the tree */
  const tree = useMemo(() => buildTree(categories), [categories])
  const sector = useMemo(() => tree.find(s => s.slug === sectorSlug) || null, [tree, sectorSlug])
  const meta = useMemo(() => sector ? sectorMeta(sector.name) : { icon: 'layers', color: '#E8553D', pastel: '#FECACA' }, [sector])

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

  if (loading) return <section className="cb"><div className="cb-wrap cb-loading">Loading categories&hellip;</div></section>
  if (!sector) return <section className="cb"><div className="cb-wrap cb-loading">Sector not found</div></section>

  const isSearching = !!search.trim()

  return (
    <section className="cb">
      <div className="cb-shapes" aria-hidden="true">
        <div className="cb-shape cb-shape--1" style={{ background: meta.color }} />
        <div className="cb-shape cb-shape--2" />
        <div className="cb-shape cb-shape--3" style={{ background: meta.color, opacity: .2 }} />
        <div className="cb-shape cb-shape--4" />
        <div className="cb-shape cb-shape--5" style={{ background: meta.color }} />
        <div className="cb-shape cb-shape--6" />
        <div className="cb-shape cb-shape--7" />
      </div>
      <div className="cb-wrap">

        {/* ── Hero ── */}
        <div className="cb-hero">
          <div className="cb-hero-top">
            {/* Breadcrumb */}
            <nav className="cb-breadcrumb">
              <Link href="/" aria-label="Home">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </Link>
              <span className="cb-breadcrumb-sep">/</span>
              <span>{sector.name}</span>
            </nav>

            <h1 className="cb-title">
              <HIcon name={meta.icon} size={36} color={meta.color} sw={1.5} />
              {' '}
              <em style={{ color: meta.color }}>{sector.name}</em>
            </h1>
            {sector.description && (
              <p className="cb-desc">{sector.description}</p>
            )}
            <p className="cb-desc">
              <strong>{stats.l2} categories</strong> and <strong>{stats.l3} subcategories</strong> to explore.
            </p>
            <div className="cb-hero-pills">
              {[
                { n: stats.l2, l: 'Categories', c: meta.color },
                { n: stats.l3, l: 'Subcategories', c: '#8B5CF6' },
                { n: stats.listings, l: 'Listings', c: '#2FAE6A' },
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
              placeholder={`Search within ${sector.name}`}
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
                        <Link key={cat.id} href={`/${sectorSlug}/${cat.slug}`} className="cb-dropdown-row">
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
           L2 Category cards — main content
           ══════════════════════════════════════ */}
        <h2 className="cb-section-heading">All <em>Categories</em> in {sector.name}</h2>
        <div className="cb-sectors">
          {l2Cards.map(l2 => (
            <div
              key={l2.id}
              className="cb-sector"
              style={{ '--sc-pastel': meta.pastel, '--sc': meta.color } as React.CSSProperties}
            >
              <Link href={`/${sectorSlug}/${l2.slug}`} className="cb-sector-hd">
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
                      {l3.name}
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
