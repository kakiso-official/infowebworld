'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPostById, savePost } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

const inputStyle: React.CSSProperties = { width: '100%', height: 44, padding: '0 .85rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.82rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }

export default function SeoEditor() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => { if (id) { const p = getPostById(id); if (p) setPost(p); else router.replace('/iww-hq/blog') } }, [id, router])
  if (!post) return null

  const seo = post.seo
  const setSeo = (k: string, v: string | boolean | string[]) => setPost({ ...post, seo: { ...seo, [k]: v } })

  const save = () => { savePost({ ...post, updatedAt: new Date().toISOString() }); router.push('/iww-hq/blog') }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '.25rem' }}>SEO Settings</h2>
        <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', marginBottom: '1.5rem' }}>{post.title}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Meta Title */}
          <div>
            <label style={labelStyle}>Meta Title <span style={{ fontWeight: 500, color: 'var(--h-muted)' }}>({(seo.metaTitle || post.title).length}/60)</span></label>
            <input style={inputStyle} value={seo.metaTitle} onChange={e => setSeo('metaTitle', e.target.value)} placeholder={post.title} maxLength={60} onFocus={focus} onBlur={blur} />
          </div>

          {/* Meta Description */}
          <div>
            <label style={labelStyle}>Meta Description <span style={{ fontWeight: 500, color: 'var(--h-muted)' }}>({(seo.metaDescription || post.excerpt).length}/160)</span></label>
            <textarea style={{ ...inputStyle, height: 'auto', padding: '.65rem .85rem', minHeight: 72, resize: 'vertical', lineHeight: 1.6 }} value={seo.metaDescription} onChange={e => setSeo('metaDescription', e.target.value)} placeholder={post.excerpt} maxLength={160} onFocus={focus} onBlur={blur} />
          </div>

          {/* Keywords */}
          <div>
            <label style={labelStyle}>Keywords (comma separated)</label>
            <input style={inputStyle} value={seo.keywords.join(', ')} onChange={e => setSeo('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} placeholder="seo, business, directory" onFocus={focus} onBlur={blur} />
          </div>

          {/* OG Image */}
          <div>
            <label style={labelStyle}>OG Image URL</label>
            <input style={inputStyle} value={seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} placeholder={post.coverImage || 'https://...'} onFocus={focus} onBlur={blur} />
          </div>

          {/* Canonical */}
          <div>
            <label style={labelStyle}>Canonical URL</label>
            <input style={inputStyle} value={seo.canonicalUrl} onChange={e => setSeo('canonicalUrl', e.target.value)} placeholder={`https://infowebworld.com/blog/post?slug=${post.slug}`} onFocus={focus} onBlur={blur} />
          </div>

          {/* noIndex */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={seo.noIndex} onChange={e => setSeo('noIndex', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#E8553D' }} />
            <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--h-heading)' }}>noindex (hide from search engines)</span>
          </label>

          {/* Google Preview */}
          <div style={{ marginTop: '.5rem' }}>
            <label style={labelStyle}>Search Preview</label>
            <div style={{ padding: '1rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>
              <p style={{ fontSize: '.78rem', fontWeight: 600, color: '#1A0DAB', marginBottom: '.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seo.metaTitle || post.title || 'Page Title'}</p>
              <p style={{ fontSize: '.62rem', color: '#006621', marginBottom: '.25rem' }}>infowebworld.com/blog/post?slug={post.slug || '...'}</p>
              <p style={{ fontSize: '.68rem', color: '#545454', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{seo.metaDescription || post.excerpt || 'Meta description will appear here...'}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '.65rem', paddingTop: '.75rem', borderTop: '1px solid var(--h-border-light)' }}>
            <button onClick={() => router.push('/iww-hq/blog')} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Cancel</button>
            <div style={{ flex: 1 }} />
            <button onClick={save} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Save SEO</button>
          </div>
        </div>
      </div>
    </div>
  )
}
