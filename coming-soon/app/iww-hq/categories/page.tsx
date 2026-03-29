'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { fetchAllCategories, apiDeleteCategory, apiToggleLaunch, apiBulkLaunch } from '../data/category-storage'
import type { Category } from '../data/category-storage'

const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)
const Btn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
  <button {...p} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", transition: 'all .25s', textDecoration: 'none', ...p.style }}>{children}</button>
)

const levelLabels: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const reload = async () => { setCategories(await fetchAllCategories()) }
  useEffect(() => { reload() }, [])

  const sectors = useMemo(() => {
    const s = new Set<string>()
    categories.forEach(c => { if (c.level === 1) s.add(c.name) })
    return Array.from(s)
  }, [categories])

  const filtered = useMemo(() => categories.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    if (!matchQ) return false
    if (filter === 'all') return true
    if (filter === 'launched') return c.isLaunched
    if (filter === 'unlaunched') return !c.isLaunched
    // filter by sector name
    return c.parentName === filter || c.name === filter
  }), [categories, search, filter])

  const remove = async (id: string) => { if (!confirm('Delete this category? This cannot be undone.')) return; await apiDeleteCategory(id); await reload() }

  const toggleLaunch = async (cat: Category) => {
    await apiToggleLaunch(cat.id, !cat.isLaunched)
    await reload()
  }

  const launched = categories.filter(c => c.isLaunched).length
  const unlaunched = categories.filter(c => !c.isLaunched).length
  const withListings = categories.filter(c => c.listingCount > 0).length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
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

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />
        <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
          {['all', 'launched', 'unlaunched'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', fontFamily: "var(--font-nunito)", background: filter === f ? '#E8553D' : '#fff', color: filter === f ? '#fff' : 'var(--h-muted)', borderColor: filter === f ? '#E8553D' : 'var(--h-border)', transition: 'all .25s', textTransform: 'capitalize' }}>{f}</button>
          ))}
          {sectors.length > 0 && (
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', fontFamily: "var(--font-nunito)", background: !['all', 'launched', 'unlaunched'].includes(filter) ? '#E8553D' : '#fff', color: !['all', 'launched', 'unlaunched'].includes(filter) ? '#fff' : 'var(--h-muted)', borderColor: !['all', 'launched', 'unlaunched'].includes(filter) ? '#E8553D' : 'var(--h-border)', transition: 'all .25s', outline: 'none', appearance: 'auto' }}
            >
              <option value="all">By Sector</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
        <Link href="/iww-hq/categories/edit" style={{ padding: '.4rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', textDecoration: 'none', transition: 'all .25s' }}>Add Category</Link>
      </div>

      {/* Bulk Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center', marginBottom: '.85rem', padding: '.75rem 1rem', background: '#fff', borderRadius: 14, border: '1.5px solid var(--h-border)' }}>
        <span style={{ fontSize: '.62rem', fontWeight: 700, color: 'var(--h-muted)', fontFamily: "var(--font-nunito)", textTransform: 'uppercase', letterSpacing: '.05em', marginRight: '.25rem' }}>Bulk Actions:</span>
        <Btn onClick={async () => { if (!confirm('Launch ALL categories? This will make all 865 categories visible to visitors.')) return; await apiBulkLaunch(true); await reload() }} style={{ background: '#2FAE6A15', color: '#2FAE6A', borderColor: 'transparent' }}>Launch All</Btn>
        <Btn onClick={async () => { if (!confirm('Unlaunch ALL categories?')) return; await apiBulkLaunch(false); await reload() }} style={{ background: '#F59E0B15', color: '#D97706', borderColor: 'transparent' }}>Unlaunch All</Btn>
        <span style={{ width: 1, height: 16, background: 'var(--h-border)' }} />
        <span style={{ fontSize: '.58rem', fontWeight: 600, color: 'var(--h-muted)', fontFamily: "var(--font-nunito)" }}>By Level:</span>
        {[{l:1,n:'Sectors'},{l:2,n:'Categories'},{l:3,n:'Subcategories'}].map(lv => (
          <Btn key={lv.l} onClick={async () => { await apiBulkLaunch(true, lv.l); await reload() }} style={{ background: '#3B82F615', color: '#3B82F6', borderColor: 'transparent', fontSize: '.5rem' }}>Launch L{lv.l} {lv.n}</Btn>
        ))}
        {sectors.length > 0 && (
          <>
            <span style={{ width: 1, height: 16, background: 'var(--h-border)' }} />
            <span style={{ fontSize: '.58rem', fontWeight: 600, color: 'var(--h-muted)', fontFamily: "var(--font-nunito)" }}>By Sector:</span>
            <select
              onChange={async (e) => { const sid = e.target.value; if (!sid) return; await apiBulkLaunch(true, undefined, sid); await reload(); e.target.value = '' }}
              style={{ padding: '.25rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', fontFamily: "var(--font-nunito)", background: '#fff', color: 'var(--h-heading)', cursor: 'pointer', outline: 'none' }}
            >
              <option value="">Launch a sector...</option>
              {categories.filter(c => c.level === 1).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {categories.length === 0 ? 'No categories yet. Create your first one!' : 'No categories match.'}
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
                {filtered.map(cat => {
                  return (
                    <tr key={cat.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                      {/* Category: icon + name + description */}
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
                      {/* Sector */}
                      <td style={{ padding: '.65rem 1rem' }}>
                        <Pill color="#4361EE">{cat.parentName || (cat.level === 1 ? 'Root' : '--')}</Pill>
                      </td>
                      {/* Listings */}
                      <td style={{ padding: '.65rem 1rem' }}>
                        <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: "var(--font-nunito)" }}>{cat.listingCount}</span>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '.65rem 1rem' }}>
                        <Pill color={cat.isLaunched ? '#2FAE6A' : '#F59E0B'}>{cat.isLaunched ? 'Launched' : 'Unlaunched'}</Pill>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '.65rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                          <Link href={`/iww-hq/categories/edit?id=${cat.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>Edit</Link>
                          <Link href={`/iww-hq/categories/seo?id=${cat.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>SEO</Link>
                          <Btn onClick={() => toggleLaunch(cat)} style={{ background: cat.isLaunched ? '#2FAE6A15' : '#F59E0B15', color: cat.isLaunched ? '#2FAE6A' : '#D97706', borderColor: 'transparent' }}>{cat.isLaunched ? 'Launched' : 'Launch'}</Btn>
                          <Btn onClick={() => remove(cat.id)} style={{ color: '#E8553D', borderColor: 'rgba(232,85,61,.2)' }}>Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
