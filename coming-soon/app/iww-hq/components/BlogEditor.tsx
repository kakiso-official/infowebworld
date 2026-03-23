'use client'
import { useState, useRef, useCallback, useMemo } from 'react'
import type { BlogPost } from '../data/blog-types'
import { blogCategories, stockCovers } from '../data/blog-types'
import { generateSlug } from '../data/blog-storage'

/* ── Shared styles (outside component = never recreated) ── */
const inp: React.CSSProperties = { width: '100%', height: 44, padding: '0 .85rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.82rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const lbl: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }
const req = { color: '#E8553D' }
const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }
const btnActive: React.CSSProperties = { padding: '.25rem .65rem', borderRadius: 999, border: '1.5px solid #E8553D', fontSize: '.62rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', transition: 'all .2s' }
const btnInactive: React.CSSProperties = { ...btnActive, background: '#fff', color: 'var(--h-muted)', borderColor: 'var(--h-border)' }
const toolbarBtnStyle: React.CSSProperties = { padding: '.2rem .5rem', borderRadius: 8, border: '1.5px solid var(--h-border)', fontSize: '.6rem', fontWeight: 700, cursor: 'pointer', background: '#fff', color: 'var(--h-heading)', fontFamily: 'monospace', transition: 'all .15s' }

const toolbar = [
  { l: 'H2', md: '\n## ', w: false }, { l: 'H3', md: '\n### ', w: false },
  { l: 'B', md: '**', w: true }, { l: 'I', md: '_', w: true },
  { l: 'Link', md: '[text](url)', w: false }, { l: 'Img', md: '![alt](url)', w: false },
  { l: 'UL', md: '\n- ', w: false }, { l: 'OL', md: '\n1. ', w: false },
  { l: 'Quote', md: '\n> ', w: false }, { l: 'Code', md: '```\n', w: true },
  { l: '---', md: '\n---\n', w: false },
]

type Props = { post: BlogPost; onChange: (p: BlogPost) => void; onSave: (status: 'draft' | 'published') => void; onCancel: () => void }

export default function BlogEditor({ post, onChange, onSave, onCancel }: Props) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [showCovers, setShowCovers] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  // Use functional setState pattern — no dependency on `post`
  const set = useCallback(<K extends keyof BlogPost>(k: K, v: BlogPost[K]) => {
    onChange(Object.assign({}, post, { [k]: v, readTime: k === 'body' ? Math.max(1, Math.ceil(((v as string)?.split(/\s+/).length || 0) / 200)) : post.readTime }))
  }, [onChange, post])

  const insertMd = useCallback((md: string, wrap: boolean) => {
    const ta = bodyRef.current; if (!ta) return
    const { selectionStart: s, selectionEnd: e, value } = ta
    const sel = value.slice(s, e)
    const ins = wrap ? `${md}${sel || 'text'}${md}` : `${md}${sel}`
    set('body', value.slice(0, s) + ins + value.slice(e))
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + ins.length }, 0)
  }, [set])

  const wordCount = useMemo(() => post.body?.split(/\s+/).filter(Boolean).length || 0, [post.body])
  const charCount = post.body?.length || 0
  const slugPreview = post.slug || (post.title ? generateSlug(post.title) : 'your-post-slug')

  // Only parse markdown when preview tab is active
  const html = useMemo(() => {
    if (tab !== 'preview') return ''
    const { marked } = require('marked')
    return marked.parse(post.body || '', { async: false }) as string
  }, [tab === 'preview' ? post.body : ''])

  const canPublish = !!(post.title && post.excerpt && post.body)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* ── Title ── */}
      <div>
        <label style={lbl}>Title <span style={req}>*</span></label>
        <input style={{ ...inp, height: 52, fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif" }} placeholder="Your blog post title..." value={post.title} onChange={e => set('title', e.target.value)} onFocus={fo} onBlur={bl} />
      </div>

      {/* ── Slug ── */}
      <div>
        <label style={lbl}>Slug (URL)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ height: 44, padding: '0 .75rem', display: 'flex', alignItems: 'center', borderRadius: '12px 0 0 12px', border: '1.5px solid var(--h-border)', borderRight: 'none', background: 'var(--h-bg)', fontSize: '.72rem', fontWeight: 600, color: 'var(--h-muted)', whiteSpace: 'nowrap' }}>/blog/</span>
          <input style={{ ...inp, borderRadius: '0 12px 12px 0', flex: 1 }} placeholder={slugPreview} value={post.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))} onFocus={fo} onBlur={bl} />
          <button type="button" onClick={() => set('slug', generateSlug(post.title || 'untitled'))} style={{ ...btnInactive, height: 44, padding: '0 .85rem', marginLeft: '.4rem', whiteSpace: 'nowrap', fontSize: '.6rem' }}>Auto</button>
        </div>
      </div>

      {/* ── Category + Author + Featured ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '.75rem', alignItems: 'end' }}>
        <div>
          <label style={lbl}>Category</label>
          <select style={{ ...inp, appearance: 'none', cursor: 'pointer', paddingRight: '2rem', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A9590' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right .75rem center' }} value={post.category} onChange={e => set('category', e.target.value)} onFocus={fo as never} onBlur={bl as never}>
            {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Author</label>
          <input style={inp} value={post.author} onChange={e => set('author', e.target.value)} onFocus={fo} onBlur={bl} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', padding: '.5rem .75rem', borderRadius: 12, border: `1.5px solid ${post.featured ? '#E8553D' : 'var(--h-border)'}`, background: post.featured ? 'rgba(232,85,61,.06)' : '#fff', transition: 'all .2s', height: 44 }}>
          <input type="checkbox" checked={post.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 14, height: 14, accentColor: '#E8553D' }} />
          <span style={{ fontSize: '.68rem', fontWeight: 700, color: post.featured ? '#E8553D' : 'var(--h-muted)', whiteSpace: 'nowrap' }}>Featured</span>
        </label>
      </div>

      {/* ── Cover Image ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Cover Image</label>
          <button type="button" onClick={() => setShowCovers(!showCovers)} style={showCovers ? btnActive : btnInactive}>
            {showCovers ? 'Hide Gallery' : 'Pick from Gallery'}
          </button>
        </div>
        {showCovers && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '.4rem', marginBottom: '.65rem', padding: '.65rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>
            {stockCovers.map(c => (
              <button key={c.url} type="button" onClick={() => { set('coverImage', c.url); setShowCovers(false) }}
                style={{ padding: 0, border: post.coverImage === c.url ? '2px solid #E8553D' : '2px solid transparent', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: 'none', transition: 'border-color .2s', position: 'relative' }}>
                <img src={c.url} alt={c.label} loading="lazy" style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '.2rem', fontSize: '.5rem', fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.5)', textAlign: 'center' }}>{c.label}</span>
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <input style={{ ...inp, flex: 1 }} placeholder="Or paste a custom image URL..." value={customUrl} onChange={e => setCustomUrl(e.target.value)} onFocus={fo} onBlur={bl} />
          <button type="button" onClick={() => { if (customUrl) { set('coverImage', customUrl); setCustomUrl('') } }} style={{ ...(customUrl ? btnActive : btnInactive), height: 44, padding: '0 1rem' }} disabled={!customUrl}>Apply</button>
        </div>
        {post.coverImage && (
          <div style={{ marginTop: '.5rem', position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--h-border)' }}>
            <img src={post.coverImage} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
            <button type="button" onClick={() => set('coverImage', '')} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
          </div>
        )}
      </div>

      {/* ── Excerpt ── */}
      <div>
        <label style={lbl}>Excerpt <span style={req}>*</span> <span style={{ fontWeight: 500, color: 'var(--h-muted)' }}>({post.excerpt.length}/200)</span></label>
        <textarea style={{ ...inp, height: 'auto', padding: '.65rem .85rem', resize: 'vertical', minHeight: 64, lineHeight: 1.6 }} placeholder="A brief summary (1-2 sentences)..." rows={2} maxLength={200} value={post.excerpt} onChange={e => set('excerpt', e.target.value)} onFocus={fo} onBlur={bl} />
      </div>

      {/* ── Tags ── */}
      <div>
        <label style={lbl}>Tags</label>
        <input style={inp} placeholder="seo, backlinks, growth (comma separated)" value={post.tags.join(', ')} onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} onFocus={fo} onBlur={bl} />
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem', marginTop: '.35rem' }}>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: '.55rem', fontWeight: 700, padding: '.15rem .4rem', borderRadius: 999, background: 'var(--h-bg)', color: 'var(--h-muted)', border: '1px solid var(--h-border)' }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Content body ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Content <span style={req}>*</span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
            <span style={{ fontSize: '.58rem', color: 'var(--h-muted)', fontWeight: 600 }}>{wordCount} words &middot; {post.readTime} min &middot; {charCount} chars</span>
            <div style={{ display: 'flex', gap: '.25rem' }}>
              <button type="button" onClick={() => setTab('write')} style={tab === 'write' ? btnActive : btnInactive}>Write</button>
              <button type="button" onClick={() => setTab('preview')} style={tab === 'preview' ? btnActive : btnInactive}>Preview</button>
            </div>
          </div>
        </div>

        {tab === 'write' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem', marginBottom: '.4rem' }}>
            {toolbar.map(t => (
              <button key={t.l} type="button" onClick={() => insertMd(t.md, t.w)} style={toolbarBtnStyle}>{t.l}</button>
            ))}
          </div>
        )}

        {tab === 'write' ? (
          <textarea ref={bodyRef} style={{ ...inp, height: 'auto', padding: '.85rem', resize: 'vertical', minHeight: 360, lineHeight: 1.7, fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace", fontSize: '.8rem' }} placeholder={'Write in Markdown...\n\n## Getting Started\n\nContent here...'} value={post.body} onChange={e => set('body', e.target.value)} onFocus={fo} onBlur={bl} />
        ) : (
          <div style={{ minHeight: 360, padding: '1.5rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', overflowWrap: 'break-word' }}>
            {post.body ? <div className="blog-body" dangerouslySetInnerHTML={{ __html: html }} /> : <p style={{ color: 'var(--h-muted)', fontStyle: 'italic', fontSize: '.85rem' }}>Nothing to preview yet.</p>}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: '.65rem', paddingTop: '1rem', borderTop: '1px solid var(--h-border-light)', flexWrap: 'wrap' }}>
        <button type="button" onClick={onCancel} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>Cancel</button>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={() => onSave('draft')} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>Save Draft</button>
        <button type="button" onClick={() => onSave('published')} disabled={!canPublish}
          style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: canPublish ? 'pointer' : 'not-allowed', opacity: canPublish ? 1 : .4, fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>Publish</button>
      </div>
    </div>
  )
}
