'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchAllCategories, fetchCategoryById, apiSaveCategory, generateCategorySlug } from '../../data/category-storage'
import type { Category } from '../../data/category-storage'

/* -- Shared styles (outside component = never recreated) -- */
const inp: React.CSSProperties = { width: '100%', height: 44, padding: '0 .85rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.82rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const lbl: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }
const req = { color: '#E8553D' }
const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }
const btnActive: React.CSSProperties = { padding: '.25rem .65rem', borderRadius: 999, border: '1.5px solid #E8553D', fontSize: '.62rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', transition: 'all .2s' }
const btnInactive: React.CSSProperties = { ...btnActive, background: '#fff', color: 'var(--h-muted)', borderColor: 'var(--h-border)' }

const selectStyle: React.CSSProperties = { ...inp, appearance: 'none', cursor: 'pointer', paddingRight: '2rem', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A9590' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right .75rem center' }

const levelOptions = [
  { value: 1, label: 'Sector (top-level)' },
  { value: 2, label: 'Category' },
  { value: 3, label: 'Subcategory' },
]

function createEmptyCategory(): Category {
  return {
    id: '', slug: '', name: '', description: '', icon: '', color: '#E8553D',
    coverImage: '', parentId: null, level: 2, sortOrder: 0, listingCount: 0,
    isLaunched: false, isFeatured: false, isNavigation: true,
    seoTitle: '', seoDescription: '', seoKeywords: [], seoOgImage: '', seoCanonical: '', seoNoIndex: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }
}

export default function CategoryEditor() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const isEditing = !!id

  const [cat, setCat] = useState<Category>(createEmptyCategory())
  const [sectors, setSectors] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAllCategories().then(all => {
      setSectors(all.filter(c => c.level === 1))
      if (id) {
        const found = all.find(c => c.id === id)
        if (found) setCat(found)
        else router.replace('/iww-hq/categories')
      }
    })
  }, [id, router])

  const set = useCallback(<K extends keyof Category>(k: K, v: Category[K]) => {
    setCat(prev => ({ ...prev, [k]: v }))
  }, [])

  const slugPreview = cat.slug || (cat.name ? generateCategorySlug(cat.name) : 'your-category-slug')

  const save = async () => {
    if (!cat.name) return
    setSaving(true)
    const slug = cat.slug || generateCategorySlug(cat.name)
    const now = new Date().toISOString()
    const final: Category = {
      ...cat,
      slug,
      updatedAt: now,
      createdAt: cat.createdAt || now,
    }
    await apiSaveCategory(final)
    setSaving(false)
    router.push('/iww-hq/categories')
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '1.25rem' }}>
          {isEditing ? 'Edit Category' : 'Create Category'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* -- Name -- */}
          <div>
            <label style={lbl}>Name <span style={req}>*</span></label>
            <input style={{ ...inp, height: 52, fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif" }} placeholder="Category name..." value={cat.name} onChange={e => set('name', e.target.value)} onFocus={fo} onBlur={bl} />
          </div>

          {/* -- Slug -- */}
          <div>
            <label style={lbl}>Slug (URL)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span style={{ height: 44, padding: '0 .75rem', display: 'flex', alignItems: 'center', borderRadius: '12px 0 0 12px', border: '1.5px solid var(--h-border)', borderRight: 'none', background: 'var(--h-bg)', fontSize: '.72rem', fontWeight: 600, color: 'var(--h-muted)', whiteSpace: 'nowrap' }}>/category/</span>
              <input style={{ ...inp, borderRadius: '0 12px 12px 0', flex: 1 }} placeholder={slugPreview} value={cat.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))} onFocus={fo} onBlur={bl} />
              <button type="button" onClick={() => set('slug', generateCategorySlug(cat.name || 'untitled'))} style={{ ...btnInactive, height: 44, padding: '0 .85rem', marginLeft: '.4rem', whiteSpace: 'nowrap', fontSize: '.6rem' }}>Auto</button>
            </div>
          </div>

          {/* -- Level + Parent Sector -- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div>
              <label style={lbl}>Level</label>
              <select style={selectStyle} value={cat.level} onChange={e => set('level', Number(e.target.value) as 1 | 2 | 3)} onFocus={fo as never} onBlur={bl as never}>
                {levelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Parent Sector</label>
              <select style={selectStyle} value={cat.parentId || ''} onChange={e => set('parentId', e.target.value || null)} onFocus={fo as never} onBlur={bl as never}>
                <option value="">None (root)</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* -- Icon + Color -- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div>
              <label style={lbl}>Icon Name</label>
              <input style={inp} placeholder="e.g. briefcase, code, store" value={cat.icon} onChange={e => set('icon', e.target.value)} onFocus={fo} onBlur={bl} />
            </div>
            <div>
              <label style={lbl}>Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <input style={{ ...inp, flex: 1 }} placeholder="#E8553D" value={cat.color} onChange={e => set('color', e.target.value)} onFocus={fo} onBlur={bl} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: cat.color || '#E8553D', border: '1.5px solid var(--h-border)', flexShrink: 0 }} />
              </div>
            </div>
          </div>

          {/* -- Description -- */}
          <div>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp, height: 'auto', padding: '.65rem .85rem', resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} placeholder="Describe this category..." rows={4} value={cat.description} onChange={e => set('description', e.target.value)} onFocus={fo} onBlur={bl} />
          </div>

          {/* -- Cover Image -- */}
          <div>
            <label style={lbl}>Cover Image URL</label>
            <input style={inp} placeholder="https://..." value={cat.coverImage} onChange={e => set('coverImage', e.target.value)} onFocus={fo} onBlur={bl} />
            {cat.coverImage && (
              <div style={{ marginTop: '.5rem', position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--h-border)' }}>
                <img src={cat.coverImage} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                <button type="button" onClick={() => set('coverImage', '')} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
              </div>
            )}
          </div>

          {/* -- Sort Order -- */}
          <div>
            <label style={lbl}>Sort Order</label>
            <input type="number" style={{ ...inp, maxWidth: 140 }} placeholder="0" value={cat.sortOrder} onChange={e => set('sortOrder', Number(e.target.value) || 0)} onFocus={fo} onBlur={bl} />
          </div>

          {/* -- Toggles -- */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', padding: '.5rem .75rem', borderRadius: 12, border: `1.5px solid ${cat.isLaunched ? '#2FAE6A' : 'var(--h-border)'}`, background: cat.isLaunched ? 'rgba(47,174,106,.06)' : '#fff', transition: 'all .2s', height: 44 }}>
              <input type="checkbox" checked={cat.isLaunched} onChange={e => set('isLaunched', e.target.checked)} style={{ width: 14, height: 14, accentColor: '#2FAE6A' }} />
              <span style={{ fontSize: '.68rem', fontWeight: 700, color: cat.isLaunched ? '#2FAE6A' : 'var(--h-muted)', whiteSpace: 'nowrap' }}>Launched</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', padding: '.5rem .75rem', borderRadius: 12, border: `1.5px solid ${cat.isFeatured ? '#E8553D' : 'var(--h-border)'}`, background: cat.isFeatured ? 'rgba(232,85,61,.06)' : '#fff', transition: 'all .2s', height: 44 }}>
              <input type="checkbox" checked={cat.isFeatured} onChange={e => set('isFeatured', e.target.checked)} style={{ width: 14, height: 14, accentColor: '#E8553D' }} />
              <span style={{ fontSize: '.68rem', fontWeight: 700, color: cat.isFeatured ? '#E8553D' : 'var(--h-muted)', whiteSpace: 'nowrap' }}>Featured</span>
            </label>
          </div>

          {/* -- Actions -- */}
          <div style={{ display: 'flex', gap: '.65rem', paddingTop: '1rem', borderTop: '1px solid var(--h-border-light)', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => router.push('/iww-hq/categories')} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>Cancel</button>
            <div style={{ flex: 1 }} />
            <button type="button" onClick={save} disabled={!cat.name || saving}
              style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: cat.name && !saving ? 'pointer' : 'not-allowed', opacity: cat.name && !saving ? 1 : .4, fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>
              {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
