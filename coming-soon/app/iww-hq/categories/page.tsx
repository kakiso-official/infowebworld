'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { fetchAllCategories, apiDeleteCategory, apiToggleLaunch, apiBulkLaunch } from '../data/category-storage'
import type { Category } from '../data/category-storage'

const PAGE_SIZE = 50
type SortOption = 'name-az' | 'name-za' | 'level-asc' | 'level-desc' | 'most-listings' | 'least-listings'

const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)
const Btn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
  <button {...p} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", transition: 'all .25s', textDecoration: 'none', ...p.style }}>{children}</button>
)

const levelLabels: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }

const btnBase: React.CSSProperties = { borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', fontFamily: 'var(--font-nunito)', whiteSpace: 'nowrap' }
const selectStyle: React.CSSProperties = { padding: '.4rem .6rem', borderRadius: 8, border: '1.5px solid var(--h-border)', fontSize: '.72rem', fontWeight: 600, fontFamily: 'var(--font-nunito)', background: 'var(--h-bg)', cursor: 'pointer', outline: 'none' }
const filterPill = (active: boolean): React.CSSProperties => ({
  padding: '.35rem .75rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer',
  border: '1.5px solid', fontFamily: 'var(--font-nunito)', transition: 'all .25s', textTransform: 'capitalize',
  background: active ? '#E8553D' : '#fff', color: active ? '#fff' : 'var(--h-muted)',
  borderColor: active ? '#E8553D' : 'var(--h-border)',
})

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('name-az')
  const [currentPage, setCurrentPage] = useState(1)

  const reload = async () => { setCategories(await fetchAllCategories()) }
  useEffect(() => { reload() }, [])

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1) }, [search, statusFilter, sectorFilter, levelFilter, sortBy])

  const sectors = useMemo(() => categories.filter(c => c.level === 1), [categories])

  // Get sector slug for any category
  const getSectorSlug = (cat: Category): string => {
    if (cat.level === 1) return cat.name
    return cat.parentName || ''
  }

  // Filtered + sorted
  const filtered = useMemo(() => {
    let cats = categories

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      cats = cats.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || (c.parentName || '').toLowerCase().includes(q))
    }

    // Status filter
    if (statusFilter === 'launched') cats = cats.filter(c => c.isLaunched)
    else if (statusFilter === 'unlaunched') cats = cats.filter(c => !c.isLaunched)
    else if (statusFilter === 'with-listings') cats = cats.filter(c => c.listingCount > 0)

    // Sector filter
    if (sectorFilter !== 'all') {
      cats = cats.filter(c => c.name === sectorFilter || c.parentName === sectorFilter || getSectorSlug(c) === sectorFilter)
    }

    // Level filter
    if (levelFilter !== 'all') cats = cats.filter(c => c.level === Number(levelFilter))

    // Sort
    cats = [...cats].sort((a, b) => {
      switch (sortBy) {
        case 'name-az': return a.name.localeCompare(b.name)
        case 'name-za': return b.name.localeCompare(a.name)
        case 'level-asc': return a.level - b.level || a.name.localeCompare(b.name)
        case 'level-desc': return b.level - a.level || a.name.localeCompare(b.name)
        case 'most-listings': return b.listingCount - a.listingCount || a.name.localeCompare(b.name)
        case 'least-listings': return a.listingCount - b.listingCount || a.name.localeCompare(b.name)
        default: return 0
      }
    })

    return cats
  }, [categories, search, statusFilter, sectorFilter, levelFilter, sortBy])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, filtered.length)
  const paginated = filtered.slice(startIdx, endIdx)

  // Page number range
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = []
    if (safePage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...'); pages.push(totalPages)
    } else if (safePage >= totalPages - 3) {
      pages.push(1); pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1); pages.push('...')
      for (let i = safePage - 1; i <= safePage + 1; i++) pages.push(i)
      pages.push('...'); pages.push(totalPages)
    }
    return pages
  }

  const remove = async (id: string) => { if (!confirm('Delete this category? This cannot be undone.')) return; await apiDeleteCategory(id); await reload() }
  const toggleLaunch = async (cat: Category) => { await apiToggleLaunch(cat.id, !cat.isLaunched); await reload() }

  const launched = categories.filter(c => c.isLaunched).length
  const unlaunched = categories.filter(c => !c.isLaunched).length
  const withListings = categories.filter(c => c.listingCount > 0).length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.75rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total Categories', v: categories.length, c: '#E8553D' },
          { l: 'Launched', v: launched, c: '#2FAE6A' },
          { l: 'Unlaunched', v: unlaunched, c: '#F59E0B' },
          { l: 'With Listings', v: withListings, c: '#3B82F6' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1rem 1.15rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <p style={{ fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.25rem' }}>{s.l}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* ── Filters bar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center', marginBottom: '.85rem', padding: '.75rem 1rem', background: '#fff', borderRadius: 14, border: '1.5px solid var(--h-border)' }}>
        <input type="text" placeholder="Search name, slug, description..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, height: 38, padding: '0 .75rem', borderRadius: 10, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.75rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />

        {/* Status pills */}
        {['all', 'launched', 'unlaunched', 'with-listings'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} style={filterPill(statusFilter === f)}>
            {f === 'with-listings' ? 'With Listings' : f}
          </button>
        ))}

        <span style={{ width: 1, height: 20, background: 'var(--h-border)' }} />

        {/* Level filter */}
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Levels</option>
          <option value="1">L1 — Sectors</option>
          <option value="2">L2 — Categories</option>
          <option value="3">L3 — Subcategories</option>
        </select>

        {/* Sector filter */}
        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Sectors</option>
          {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} style={selectStyle}>
          <option value="name-az">Name A → Z</option>
          <option value="name-za">Name Z → A</option>
          <option value="level-asc">Level 1 → 3</option>
          <option value="level-desc">Level 3 → 1</option>
          <option value="most-listings">Most Listings</option>
          <option value="least-listings">Least Listings</option>
        </select>

        <Link href="/iww-hq/categories/edit" style={{ padding: '.35rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', textDecoration: 'none', transition: 'all .25s', whiteSpace: 'nowrap' }}>+ Add Category</Link>
      </div>

      {/* ── Bulk Actions ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center', marginBottom: '.85rem', padding: '.6rem 1rem', background: '#fff', borderRadius: 14, border: '1.5px solid var(--h-border)' }}>
        <span style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--h-muted)', fontFamily: "var(--font-nunito)", textTransform: 'uppercase', letterSpacing: '.05em', marginRight: '.15rem' }}>Bulk:</span>
        <Btn onClick={async () => { if (!confirm('Launch ALL categories?')) return; await apiBulkLaunch(true); await reload() }} style={{ background: '#2FAE6A15', color: '#2FAE6A', borderColor: 'transparent' }}>Launch All</Btn>
        <Btn onClick={async () => { if (!confirm('Unlaunch ALL?')) return; await apiBulkLaunch(false); await reload() }} style={{ background: '#F59E0B15', color: '#D97706', borderColor: 'transparent' }}>Unlaunch All</Btn>
        <span style={{ width: 1, height: 16, background: 'var(--h-border)' }} />
        {[{ l: 1, n: 'L1' }, { l: 2, n: 'L2' }, { l: 3, n: 'L3' }].map(lv => (
          <Btn key={lv.l} onClick={async () => { await apiBulkLaunch(true, lv.l); await reload() }} style={{ background: '#3B82F615', color: '#3B82F6', borderColor: 'transparent', fontSize: '.5rem' }}>Launch {lv.n}</Btn>
        ))}
        {sectors.length > 0 && (
          <>
            <span style={{ width: 1, height: 16, background: 'var(--h-border)' }} />
            <select
              onChange={async (e) => { const sid = e.target.value; if (!sid) return; await apiBulkLaunch(true, undefined, sid); await reload(); e.target.value = '' }}
              style={{ ...selectStyle, fontSize: '.6rem', padding: '.25rem .45rem' }}
            >
              <option value="">Launch sector...</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </>
        )}
      </div>

      {/* ── Status summary ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem', padding: '0 .25rem' }}>
        <span style={{ fontSize: '.72rem', color: 'var(--h-muted)', fontWeight: 600 }}>
          Showing {filtered.length > 0 ? startIdx + 1 : 0}–{endIdx} of {filtered.length} categories
        </span>
        <span style={{ fontSize: '.68rem', color: 'var(--h-muted)', fontWeight: 600 }}>
          Page {safePage} of {totalPages}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {paginated.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {categories.length === 0 ? 'No categories yet. Create your first one!' : 'No categories match the current filters.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
              <thead>
                <tr>
                  {['Category', 'Sector', 'Listings', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        {cat.icon && (
                          <span style={{ width: 28, height: 28, borderRadius: 8, background: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.68rem', fontWeight: 800, flexShrink: 0 }}>
                            {cat.icon.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                            {cat.isFeatured && <span style={{ fontSize: '.48rem', fontWeight: 700, padding: '.1rem .35rem', borderRadius: 999, background: '#E8553D15', color: '#E8553D' }}>Featured</span>}
                            <Pill color="#6B7280">{levelLabels[cat.level] || 'Category'}</Pill>
                          </div>
                          <span style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--h-heading)', marginTop: '.15rem' }}>{cat.name || 'Untitled'}</span>
                          <span style={{ fontSize: '.55rem', color: 'var(--h-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.description || 'No description'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <Pill color="#4361EE">{cat.parentName || (cat.level === 1 ? 'Root' : '--')}</Pill>
                    </td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: "var(--font-nunito)" }}>{cat.listingCount}</span>
                    </td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <Pill color={cat.isLaunched ? '#2FAE6A' : '#F59E0B'}>{cat.isLaunched ? 'Launched' : 'Unlaunched'}</Pill>
                    </td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                        <Link href={`/iww-hq/categories/edit?id=${cat.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>Edit</Link>
                        <Link href={`/iww-hq/categories/seo?id=${cat.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>SEO</Link>
                        <Link href={`/iww-hq/seo-content/edit?id=${cat.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-accent)', background: '#fff', color: 'var(--h-accent)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>Content</Link>
                        <Btn onClick={() => toggleLaunch(cat)} style={{ background: cat.isLaunched ? '#2FAE6A15' : '#F59E0B15', color: cat.isLaunched ? '#2FAE6A' : '#D97706', borderColor: 'transparent' }}>{cat.isLaunched ? 'Launched' : 'Launch'}</Btn>
                        <Btn onClick={() => remove(cat.id)} style={{ color: '#E8553D', borderColor: 'rgba(232,85,61,.2)' }}>Delete</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.35rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            style={{
              ...btnBase, padding: '.4rem .75rem', fontSize: '.72rem',
              background: safePage <= 1 ? '#f5f5f5' : '#fff',
              color: safePage <= 1 ? '#ccc' : 'var(--h-heading)',
              border: '1.5px solid var(--h-border)',
              cursor: safePage <= 1 ? 'default' : 'pointer',
            }}
          >Previous</button>

          {getPageNumbers().map((pg, i) =>
            pg === '...' ? (
              <span key={`e-${i}`} style={{ fontSize: '.72rem', color: 'var(--h-muted)', padding: '0 .2rem' }}>...</span>
            ) : (
              <button key={pg} onClick={() => setCurrentPage(pg)}
                style={{
                  ...btnBase, width: 30, height: 30, padding: 0, fontSize: '.72rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: safePage === pg ? '#1a1a1a' : '#fff',
                  color: safePage === pg ? '#fff' : 'var(--h-heading)',
                  border: safePage === pg ? '2px solid #1a1a1a' : '1.5px solid var(--h-border)',
                  borderRadius: 8,
                }}
              >{pg}</button>
            )
          )}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            style={{
              ...btnBase, padding: '.4rem .75rem', fontSize: '.72rem',
              background: safePage >= totalPages ? '#f5f5f5' : '#fff',
              color: safePage >= totalPages ? '#ccc' : 'var(--h-heading)',
              border: '1.5px solid var(--h-border)',
              cursor: safePage >= totalPages ? 'default' : 'pointer',
            }}
          >Next</button>
        </div>
      )}
    </div>
  )
}
