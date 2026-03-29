'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'

/* ── SVG icons ── */
const I = ({ d, size = 14, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)
const ic = {
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  grid:   'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  chevR:  'M9 18l6-6-6-6',
  chevD:  'M6 9l6 6 6-6',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  folder: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  arrow:  'M5 12h14|M12 5l7 7-7 7',
}

/* Tree node type */
type CatNode = Category & { children: CatNode[] }

/* Build tree from flat list */
function buildTree(categories: Category[]): CatNode[] {
  const map = new Map<string, CatNode>()
  const roots: CatNode[] = []

  categories.forEach(c => map.set(c.id, { ...c, children: [] }))

  categories.forEach(c => {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node)
    } else if (c.level === 1) {
      roots.push(node)
    }
  })

  const sortNodes = (nodes: CatNode[]) => {
    nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
    nodes.forEach(n => sortNodes(n.children))
  }
  sortNodes(roots)

  return roots
}

/* Level labels */
const levelTag: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }

/* Sector section component */
function SectorSection({ sector, searchQuery }: { sector: CatNode; searchQuery: string }) {
  const [expanded, setExpanded] = useState(true)
  const color = sector.color || '#E8553D'

  // If searching, auto-expand
  useEffect(() => { if (searchQuery) setExpanded(true) }, [searchQuery])

  const childCount = countAll(sector)

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Sector header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'center', gap: '.6rem', width: '100%', padding: '.85rem 1.15rem', background: '#fff', border: '1.5px solid var(--h-border)', borderRadius: 16, cursor: 'pointer', transition: 'all .3s cubic-bezier(.16,1,.3,1)', boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.04)' : 'none' }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}0C`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I d={ic.folder} size={18} color={color} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <span style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(.88rem, 2vw, 1.05rem)', fontWeight: 800, color: 'var(--h-heading)' }}>{sector.name}</span>
          <span style={{ marginLeft: '.5rem', fontSize: '.56rem', fontWeight: 700, padding: '.12rem .45rem', borderRadius: 999, background: `${color}0A`, color, fontFamily: "var(--font-nunito)" }}>{childCount} categories</span>
        </div>
        <Link href={`/category/${sector.slug}`} onClick={e => e.stopPropagation()} style={{ fontSize: '.6rem', fontWeight: 700, fontFamily: "var(--font-nunito)", color, textDecoration: 'none', padding: '.25rem .6rem', borderRadius: 999, background: `${color}08`, transition: 'background .2s', marginRight: '.5rem' }}>
          View
        </Link>
        <div style={{ transition: 'transform .3s', transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <I d={ic.chevD} size={16} color="var(--h-muted)" sw={2} />
        </div>
      </button>

      {/* Children pills */}
      {expanded && (sector as CatNode).children.length > 0 && (
        <div style={{ padding: '.85rem 0 0 0' }}>
          <CategoryPills categories={(sector as CatNode).children} depth={0} searchQuery={searchQuery} />
        </div>
      )}
    </div>
  )
}

/* Recursive pill renderer */
function CategoryPills({ categories, depth, searchQuery }: { categories: (CatNode)[]; depth: number; searchQuery: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Auto-expand all when searching
  useEffect(() => {
    if (searchQuery) {
      setExpandedIds(new Set(categories.filter(c => c.children && c.children.length > 0).map(c => c.id)))
    }
  }, [searchQuery, categories])

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Indent styles per depth
  const indent = depth * 20
  const dotColors = ['var(--h-accent)', '#3B82F6', '#8B5CF6', '#14B8A6', '#F59E0B']
  const dotColor = dotColors[depth % dotColors.length]

  return (
    <div style={{ paddingLeft: indent > 0 ? indent : 0, position: 'relative' }}>
      {/* Vertical connector line */}
      {depth > 0 && (
        <div style={{ position: 'absolute', left: indent - 12, top: 0, bottom: 0, width: 1.5, background: 'var(--h-border-light)' }} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.35rem' }}>
        {categories.map(cat => {
          const hasChildren = cat.children && cat.children.length > 0
          const isExpanded = expandedIds.has(cat.id)
          const catColor = cat.color || dotColor

          return (
            <div key={cat.id} style={{ display: 'inline-flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                {/* The pill — always links to category page */}
                <Link
                  href={`/category/${cat.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                    padding: '.35rem .75rem', borderRadius: 999,
                    background: '#fff', border: '1.5px solid var(--h-border)',
                    fontFamily: "var(--font-nunito)", fontSize: depth === 0 ? '.72rem' : '.66rem',
                    fontWeight: depth === 0 ? 700 : 600,
                    color: 'var(--h-heading)', textDecoration: 'none',
                    transition: 'all .25s cubic-bezier(.16,1,.3,1)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = catColor; e.currentTarget.style.color = catColor; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${catColor}15` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--h-border)'; e.currentTarget.style.color = 'var(--h-heading)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Color dot */}
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: catColor, flexShrink: 0 }} />
                  {cat.name}
                  {cat.listingCount > 0 && (
                    <span style={{ fontSize: '.5rem', fontWeight: 800, padding: '.08rem .3rem', borderRadius: 999, background: '#2FAE6A15', color: '#2FAE6A' }}>{cat.listingCount}</span>
                  )}
                </Link>

                {/* Expand toggle if has children */}
                {hasChildren && (
                  <button
                    onClick={() => toggle(cat.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 999, border: '1px solid var(--h-border-light)', background: isExpanded ? `${catColor}08` : 'transparent', cursor: 'pointer', marginLeft: '.15rem', transition: 'all .2s', flexShrink: 0 }}
                    title={isExpanded ? 'Collapse' : `Show ${cat.children!.length} subcategories`}
                  >
                    <span style={{ transition: 'transform .25s', transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)', display: 'flex' }}>
                      <I d={ic.chevD} size={10} color={isExpanded ? catColor : 'var(--h-muted)'} sw={2.5} />
                    </span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Render expanded children */}
      {categories.map(cat => {
        const hasChildren = cat.children && cat.children.length > 0
        const isExpanded = expandedIds.has(cat.id)
        if (!hasChildren || !isExpanded) return null
        return (
          <div key={`children-${cat.id}`} style={{ marginTop: '.35rem', marginBottom: '.5rem' }}>
            <CategoryPills categories={cat.children!} depth={depth + 1} searchQuery={searchQuery} />
          </div>
        )
      })}
    </div>
  )
}

/* Count all descendants */
function countAll(cat: CatNode): number {
  if (!cat.children) return 0
  return cat.children.reduce((sum, c) => sum + 1 + countAll(c as CatNode), 0)
}

export default function CategoriesBrowse() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLaunchedCategories().then(setCategories).finally(() => setLoading(false))
  }, [])

  /* Build hierarchical tree */
  const tree = useMemo(() => buildTree(categories), [categories])

  /* Filter tree by search */
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return tree
    const q = searchQuery.toLowerCase()

    // Find all matching category IDs + their ancestor IDs
    const matchIds = new Set<string>()
    const findMatches = (cats: Category[]) => {
      cats.forEach(c => {
        if (c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))) {
          // Add this + all ancestors
          matchIds.add(c.id)
          let pid = c.parentId
          while (pid) {
            matchIds.add(pid)
            const parent = categories.find(x => x.id === pid)
            pid = parent?.parentId || null
          }
        }
      })
    }
    findMatches(categories)

    if (matchIds.size === 0) return []

    // Prune tree to only show matched branches
    const prune = (nodes: (CatNode)[]): (CatNode)[] => {
      return nodes
        .filter(n => matchIds.has(n.id))
        .map(n => ({ ...n, children: prune(n.children) }))
    }
    return prune(tree)
  }, [tree, searchQuery, categories])

  const totalCount = categories.length

  return (
    <section className="categories-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <I d={ic.layers} size={12} color="currentColor" />
            BROWSE DIRECTORY
          </div>
          <h1 className="categories-heading">Explore <em>Categories</em></h1>
          <p className="section-desc">
            {totalCount.toLocaleString()} categories across {tree.length} sectors. Every category has its own page — click any pill to explore.
          </p>
        </div>

        {/* Search */}
        <div className="categories-search">
          <span className="categories-search-icon">
            <I d={ic.search} size={16} color="currentColor" />
          </span>
          <input
            type="text"
            placeholder="Search across all categories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(.75rem, 2vw, 1.5rem)', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { n: tree.length, l: 'Sectors', c: '#E8553D' },
            { n: categories.filter(c => c.level === 2).length, l: 'Categories', c: '#3B82F6' },
            { n: categories.filter(c => c.level === 3).length, l: 'Subcategories', c: '#8B5CF6' },
          ].map(s => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: s.c }} />
              <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.7rem', fontWeight: 800, color: 'var(--h-heading)' }}>{s.n}</span>
              <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.66rem', fontWeight: 600, color: 'var(--h-muted)' }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Category tree */}
        {loading ? null : filteredTree.length === 0 ? (
          <div className="categories-browse-empty">
            <div className="categories-browse-empty-icon">
              <I d={ic.search} size={48} color="var(--h-muted)" />
            </div>
            <p className="categories-browse-empty-title">No categories found</p>
            <p className="categories-browse-empty-desc">
              {searchQuery ? `No results for "${searchQuery}". Try a different search.` : 'Categories are being set up. Check back soon.'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {(filteredTree as (CatNode)[]).map(sector => (
              <SectorSection key={sector.id} sector={sector} searchQuery={searchQuery} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
