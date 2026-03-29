'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchAdminTagGroups, apiSaveTagGroup, apiDeleteTagGroup, apiAddTag } from '../data/tag-storage'
import type { TagGroup } from '../data/tag-storage'

const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)
const Btn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
  <button {...p} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", transition: 'all .25s', textDecoration: 'none', ...p.style }}>{children}</button>
)

const PRESET_COLORS = ['#E8553D', '#3B82F6', '#2FAE6A', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6']

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function TagManagement() {
  const [groups, setGroups] = useState<TagGroup[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [addingTagFor, setAddingTagFor] = useState<string | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [saving, setSaving] = useState(false)

  // New group form state
  const [gfName, setGfName] = useState('')
  const [gfSlug, setGfSlug] = useState('')
  const [gfDesc, setGfDesc] = useState('')
  const [gfIcon, setGfIcon] = useState('tag')
  const [gfColor, setGfColor] = useState('#E8553D')
  const [slugEdited, setSlugEdited] = useState(false)

  const reload = async () => { setGroups(await fetchAdminTagGroups()) }
  useEffect(() => { reload() }, [])

  const totalTags = useMemo(() => groups.reduce((sum, g) => sum + g.tags.length, 0), [groups])
  const activeGroups = useMemo(() => groups.filter(g => g.isActive).length, [groups])

  const resetGroupForm = () => {
    setGfName(''); setGfSlug(''); setGfDesc(''); setGfIcon('tag'); setGfColor('#E8553D')
    setSlugEdited(false); setShowAddGroup(false)
  }

  const handleSaveGroup = async () => {
    if (!gfName.trim()) return
    setSaving(true)
    try {
      await apiSaveTagGroup({
        name: gfName.trim(),
        slug: (gfSlug || slugify(gfName)).trim(),
        description: gfDesc.trim(),
        icon: gfIcon.trim() || 'tag',
        color: gfColor,
        sortOrder: groups.length,
        isActive: true,
      })
      resetGroupForm()
      await reload()
    } finally { setSaving(false) }
  }

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Delete this tag group and all its tags? This cannot be undone.')) return
    await apiDeleteTagGroup(id)
    if (expandedId === id) setExpandedId(null)
    await reload()
  }

  const handleAddTag = async (groupId: string) => {
    if (!newTagName.trim()) return
    setSaving(true)
    try {
      await apiAddTag(groupId, newTagName.trim(), slugify(newTagName))
      setNewTagName('')
      setAddingTagFor(null)
      await reload()
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.75rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total Groups', v: groups.length, c: '#E8553D' },
          { l: 'Total Tags', v: totalTags, c: '#3B82F6' },
          { l: 'Active Groups', v: activeGroups, c: '#2FAE6A' },
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
        <button onClick={() => setShowAddGroup(!showAddGroup)} style={{
          padding: '.4rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer',
          border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff',
          transition: 'all .25s', marginLeft: 'auto',
        }}>
          {showAddGroup ? 'Cancel' : 'Add Tag Group'}
        </button>
      </div>

      {/* Add Group Form */}
      {showAddGroup && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.25rem', marginBottom: '.85rem' }}>
          <h3 style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: "var(--font-bricolage)", marginBottom: '.85rem' }}>New Tag Group</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.3rem' }}>Name</label>
              <input type="text" value={gfName} onChange={e => { setGfName(e.target.value); if (!slugEdited) setGfSlug(slugify(e.target.value)) }} placeholder="e.g. Pricing Model"
                style={{ width: '100%', height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)", boxSizing: 'border-box' }} />
            </div>
            {/* Slug */}
            <div>
              <label style={{ display: 'block', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.3rem' }}>Slug</label>
              <input type="text" value={gfSlug} onChange={e => { setGfSlug(e.target.value); setSlugEdited(true) }} placeholder="auto-generated"
                style={{ width: '100%', height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)", boxSizing: 'border-box' }} />
            </div>
            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.3rem' }}>Description</label>
              <input type="text" value={gfDesc} onChange={e => setGfDesc(e.target.value)} placeholder="Brief description of this tag group"
                style={{ width: '100%', height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)", boxSizing: 'border-box' }} />
            </div>
            {/* Icon */}
            <div>
              <label style={{ display: 'block', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.3rem' }}>Icon</label>
              <input type="text" value={gfIcon} onChange={e => setGfIcon(e.target.value)} placeholder="tag"
                style={{ width: '100%', height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)", boxSizing: 'border-box' }} />
            </div>
            {/* Color */}
            <div>
              <label style={{ display: 'block', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.3rem' }}>Color</label>
              <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => setGfColor(c)} style={{
                    width: 24, height: 24, borderRadius: 8, background: c, border: gfColor === c ? '2.5px solid var(--h-heading)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
                  }} />
                ))}
                <input type="color" value={gfColor} onChange={e => setGfColor(e.target.value)}
                  style={{ width: 24, height: 24, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 8 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.5rem', marginTop: '1rem' }}>
            <Btn onClick={resetGroupForm} style={{ padding: '.4rem 1rem' }}>Cancel</Btn>
            <button onClick={handleSaveGroup} disabled={saving || !gfName.trim()} style={{
              padding: '.4rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
              border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', transition: 'all .25s',
              opacity: saving || !gfName.trim() ? 0.5 : 1,
            }}>
              {saving ? 'Saving...' : 'Save Group'}
            </button>
          </div>
        </div>
      )}

      {/* Tag Groups List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
        {groups.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            No tag groups yet. Create your first one!
          </div>
        ) : (
          groups.map(group => {
            const expanded = expandedId === group.id
            return (
              <div key={group.id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden', transition: 'all .2s' }}>
                {/* Group header */}
                <div
                  onClick={() => setExpandedId(expanded ? null : group.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background .15s' }}
                >
                  {/* Color dot */}
                  <span style={{
                    width: 32, height: 32, borderRadius: 10, background: `${group.color}15`, color: group.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {group.icon.slice(0, 2).toUpperCase()}
                  </span>

                  {/* Name + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--h-heading)', fontFamily: "var(--font-nunito)" }}>{group.name}</span>
                      <Pill color={group.color}>{group.tags.length} tag{group.tags.length !== 1 ? 's' : ''}</Pill>
                      {!group.isActive && <Pill color="#F59E0B">Inactive</Pill>}
                    </div>
                    {group.description && (
                      <p style={{ fontSize: '.6rem', color: 'var(--h-muted)', marginTop: '.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '.3rem', alignItems: 'center', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <Btn onClick={() => handleDeleteGroup(group.id)} style={{ color: '#E8553D', borderColor: 'rgba(232,85,61,.2)' }}>Delete</Btn>
                  </div>

                  {/* Expand chevron */}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--h-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--h-border)' }}>
                    {/* Tags as pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', paddingTop: '1rem' }}>
                      {group.tags.length === 0 ? (
                        <span style={{ fontSize: '.65rem', color: 'var(--h-muted)', fontStyle: 'italic' }}>No tags in this group yet.</span>
                      ) : (
                        group.tags.map(tag => (
                          <span key={tag.id} style={{
                            fontSize: '.65rem', fontWeight: 600, padding: '.3rem .75rem', borderRadius: 999,
                            background: `${group.color}10`, color: group.color, border: `1px solid ${group.color}30`,
                            fontFamily: "var(--font-nunito)",
                          }}>
                            {tag.name}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Add Tag inline form */}
                    <div style={{ marginTop: '.85rem' }}>
                      {addingTagFor === group.id ? (
                        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                          <input
                            type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)}
                            placeholder="Tag name..." autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleAddTag(group.id); if (e.key === 'Escape') { setAddingTagFor(null); setNewTagName('') } }}
                            style={{
                              height: 34, padding: '0 .75rem', borderRadius: 10, border: '1.5px solid var(--h-border)',
                              background: '#fff', fontSize: '.75rem', color: 'var(--h-heading)', outline: 'none',
                              fontFamily: "var(--font-nunito)", width: 200,
                            }}
                          />
                          <button onClick={() => handleAddTag(group.id)} disabled={saving || !newTagName.trim()} style={{
                            padding: '.35rem .75rem', borderRadius: 999, fontSize: '.6rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                            border: 'none', fontFamily: "var(--font-nunito)", background: group.color, color: '#fff', transition: 'all .25s',
                            opacity: saving || !newTagName.trim() ? 0.5 : 1,
                          }}>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <Btn onClick={() => { setAddingTagFor(null); setNewTagName('') }}>Cancel</Btn>
                        </div>
                      ) : (
                        <Btn onClick={() => { setAddingTagFor(group.id); setNewTagName('') }} style={{ background: `${group.color}10`, color: group.color, borderColor: `${group.color}30` }}>
                          + Add Tag
                        </Btn>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
