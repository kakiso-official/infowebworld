'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchAdminListingTypes, apiSaveListingType, apiDeleteListingType } from '../data/listing-type-storage'
import type { ListingType } from '../data/listing-type-storage'
import { fetchAllCategories } from '../data/category-storage'
import type { Category } from '../data/category-storage'

const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)

export default function ListingTypesPage() {
  const [types, setTypes] = useState<ListingType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addCatId, setAddCatId] = useState('')

  const reload = async () => { setTypes(await fetchAdminListingTypes()) }
  useEffect(() => {
    reload()
    fetchAllCategories().then(setCategories)
  }, [])

  const l3Cats = useMemo(() => categories.filter(c => c.level === 3), [categories])

  const filtered = useMemo(() => types.filter(t => {
    const q = search.toLowerCase()
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    if (!matchQ) return false
    if (catFilter && t.categoryId !== catFilter) return false
    return true
  }), [types, search, catFilter])

  const remove = async (id: string) => {
    if (!confirm('Delete this listing type?')) return
    await apiDeleteListingType(id)
    await reload()
  }

  const add = async () => {
    if (!addName.trim() || !addCatId) return
    const slug = addName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await apiSaveListingType({ name: addName.trim(), slug, categoryId: addCatId, sortOrder: 0 })
    setAddName('')
    setAddCatId('')
    setShowAdd(false)
    await reload()
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.75rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total Types', v: types.length, c: '#E8553D' },
          { l: 'L3 Categories', v: l3Cats.length, c: '#3B82F6' },
          { l: 'Showing', v: filtered.length, c: '#2FAE6A' },
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
        <input type="text" placeholder="Search listing types..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, border: '1.5px solid var(--h-border)', fontFamily: "var(--font-nunito)", background: '#fff', color: 'var(--h-heading)', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Categories</option>
          {l3Cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ padding: '.4rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', transition: 'all .25s' }}>
          {showAdd ? 'Cancel' : 'Add Listing Type'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid var(--h-border)', padding: '1rem', marginBottom: '.85rem', display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, color: 'var(--h-muted)', marginBottom: '.25rem', textTransform: 'uppercase' }}>Name</label>
            <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g., Conversational AI: Multi-Modal Chat AI"
              style={{ width: '100%', height: 36, padding: '0 .7rem', borderRadius: 10, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.78rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }}
              onKeyDown={e => { if (e.key === 'Enter') add() }} />
          </div>
          <div style={{ minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, color: 'var(--h-muted)', marginBottom: '.25rem', textTransform: 'uppercase' }}>L3 Category</label>
            <select value={addCatId} onChange={e => setAddCatId(e.target.value)}
              style={{ height: 36, padding: '0 .7rem', borderRadius: 10, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.78rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)", cursor: 'pointer' }}>
              <option value="">Select category...</option>
              {l3Cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button onClick={add} disabled={!addName.trim() || !addCatId}
            style={{ padding: '.45rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "var(--font-nunito)", background: addName.trim() && addCatId ? '#2FAE6A' : '#ccc', color: '#fff', transition: 'all .25s' }}>
            Save
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {types.length === 0 ? 'No listing types yet.' : 'No matches.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  {['Listing Type', 'Category', 'Slug', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(lt => (
                  <tr key={lt.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                    <td style={{ padding: '.55rem 1rem' }}>
                      <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--h-heading)' }}>{lt.name}</span>
                    </td>
                    <td style={{ padding: '.55rem 1rem' }}>
                      <Pill color="#3B82F6">{lt.categoryName || lt.categoryId}</Pill>
                    </td>
                    <td style={{ padding: '.55rem 1rem' }}>
                      <span style={{ fontSize: '.66rem', color: 'var(--h-muted)', fontFamily: 'monospace' }}>{lt.slug}</span>
                    </td>
                    <td style={{ padding: '.55rem 1rem' }}>
                      <button onClick={() => remove(lt.id)}
                        style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid #EF444430', background: '#EF444410', color: '#EF4444', fontFamily: "var(--font-nunito)" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 100 && (
              <div style={{ padding: '.75rem 1rem', textAlign: 'center', fontSize: '.72rem', color: 'var(--h-muted)', borderTop: '1px solid var(--h-border-light)' }}>
                Showing first 100 of {filtered.length} results. Use search or category filter to narrow down.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
