'use client'
import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faFloppyDisk, faPaperPlane, faTrashCan, faPenToSquare, faChartLine,
  faEye, faLink, faImage, faUpload, faXmark, faStar, faTag, faPlus, faBold, faItalic,
  faHeading, faListUl, faListOl, faQuoteRight, faCode, faMinus, faTableCells,
  faCheck, faCircleExclamation, faClock, faSpinner, faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
import { apiSavePost, apiDeletePost, generateSlug } from '../data/blog-storage'
import { blogCategories, stockCovers } from '../data/blog-types'
import type { BlogPost } from '../data/blog-types'

type Tab = 'content' | 'seo' | 'preview'
type Msg = { type: 'ok' | 'err'; text: string } | null

/* Vercel rejects serverless request bodies over ~4.5 MB with a 413 — which is
   what broke image uploads. Downscale + recompress large raster images in the
   browser (to WebP, max 1920px on the long edge) so they land well under the
   limit. SVG/GIF and already-small files pass through untouched. Bonus: smaller
   images mean faster pages. */
async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.size < 1_000_000) return file
  try {
    const bitmap = await createImageBitmap(file)
    const MAX = 1920
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', 0.85))
    if (!blob || blob.size >= file.size) return file
    const base = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${base}.webp`, { type: 'image/webp' })
  } catch {
    return file
  }
}

async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
  const upload = await compressImage(file)
  const fd = new FormData()
  fd.append('file', upload)
  fd.append('type', 'blog')
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
    const json = await res.json().catch(() => ({} as { url?: string; error?: string }))
    if (json.url) return { url: json.url }
    if (res.status === 413) return { error: 'Image is too large even after compression — use one under ~4 MB.' }
    return { error: json.error || `Upload failed (HTTP ${res.status}).` }
  } catch {
    return { error: 'Network error — could not reach the upload server.' }
  }
}

export default function BlogStudio({ initial, isNew }: { initial: BlogPost; isNew: boolean }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost>(initial)
  const [tab, setTab] = useState<Tab>('content')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)
  const [tagDraft, setTagDraft] = useState('')
  const [kwDraft, setKwDraft] = useState('')
  const [uploading, setUploading] = useState<'cover' | 'inline' | 'og' | null>(null)
  const [showStock, setShowStock] = useState(false)
  const [aiBusy, setAiBusy] = useState<'beautify' | 'links' | 'toc' | null>(null)
  const [aiUndo, setAiUndo] = useState<string | null>(null)

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const inlineFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const ogFileRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<BlogPost>) => setPost(p => ({ ...p, ...patch }))
  const updateSeo = (patch: Partial<BlogPost['seo']>) => setPost(p => ({ ...p, seo: { ...p.seo, ...patch } }))

  /* live stats */
  const stats = useMemo(() => {
    const words = post.body.trim().split(/\s+/).filter(Boolean).length
    return { words, chars: post.body.length, read: Math.max(1, Math.ceil(words / 200)) }
  }, [post.body])

  const previewHtml = useMemo(
    () => (tab === 'preview' ? (marked.parse(post.body || '_Nothing to preview yet._', { async: false }) as string) : ''),
    [tab, post.body],
  )

  /* ── markdown toolbar ── */
  const applyMd = (kind: string) => {
    const ta = bodyRef.current
    if (!ta) return
    const start = ta.selectionStart, end = ta.selectionEnd
    const val = post.body, sel = val.slice(start, end)
    let ins = sel
    switch (kind) {
      case 'bold': ins = `**${sel || 'bold text'}**`; break
      case 'italic': ins = `*${sel || 'italic text'}*`; break
      case 'h2': ins = `\n## ${sel || 'Heading'}\n`; break
      case 'h3': ins = `\n### ${sel || 'Subheading'}\n`; break
      case 'link': ins = `[${sel || 'link text'}](https://)`; break
      case 'ul': ins = `\n- ${sel || 'List item'}\n`; break
      case 'ol': ins = `\n1. ${sel || 'List item'}\n`; break
      case 'quote': ins = `\n> ${sel || 'Quote'}\n`; break
      case 'code': ins = sel.includes('\n') ? `\n\`\`\`\n${sel || 'code'}\n\`\`\`\n` : `\`${sel || 'code'}\``; break
      case 'hr': ins = `\n\n---\n\n`; break
      case 'table': ins = `\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n`; break
    }
    update({ body: val.slice(0, start) + ins + val.slice(end) })
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + ins.length })
  }

  const onInlineImage = async (file: File) => {
    setUploading('inline')
    const r = await uploadImage(file)
    setUploading(null)
    if (!r.url) { setMsg({ type: 'err', text: r.error || 'Image upload failed.' }); return }
    const ta = bodyRef.current
    const at = ta ? ta.selectionStart : post.body.length
    const md = `\n![${file.name.replace(/\.[^.]+$/, '')}](${r.url})\n`
    update({ body: post.body.slice(0, at) + md + post.body.slice(at) })
  }

  const onCover = async (file: File, which: 'cover' | 'og') => {
    setUploading(which)
    const r = await uploadImage(file)
    setUploading(null)
    if (!r.url) { setMsg({ type: 'err', text: r.error || 'Image upload failed.' }); return }
    if (which === 'cover') update({ coverImage: r.url }); else updateSeo({ ogImage: r.url })
  }

  /* ── tags / keywords ── */
  const addTag = () => { const t = tagDraft.trim(); if (t && !post.tags.includes(t)) update({ tags: [...post.tags, t] }); setTagDraft('') }
  const addKw = () => { const k = kwDraft.trim(); if (k && !post.seo.keywords.includes(k)) updateSeo({ keywords: [...post.seo.keywords, k] }); setKwDraft('') }

  /* ── save / delete ── */
  const save = async (status: 'draft' | 'published') => {
    if (!post.title.trim()) { setMsg({ type: 'err', text: 'Add a title before saving.' }); setTab('content'); return }
    setSaving(true); setMsg(null)
    const res = await apiSavePost({
      ...post,
      slug: post.slug || generateSlug(post.title),
      status,
      readTime: stats.read,
      seo: {
        ...post.seo,
        metaTitle: post.seo.metaTitle || post.title,
        metaDescription: post.seo.metaDescription || post.excerpt,
      },
    })
    setSaving(false)
    if (res.ok) router.push('/iww-hq/blog')
    else setMsg({ type: 'err', text: res.error || 'Save failed.' })
  }

  const del = async () => {
    if (!confirm('Delete this post? This removes its markdown file.')) return
    await apiDeletePost(post.id || post.slug)
    router.push('/iww-hq/blog')
  }

  /* ── AI assist (Gemini) — keeps wording, adds formatting / real internal links ── */
  const runAI = async (mode: 'beautify' | 'internal-links' | 'toc') => {
    if (!post.body.trim()) { setMsg({ type: 'err', text: 'Write some content first.' }); return }
    setAiBusy(mode === 'beautify' ? 'beautify' : mode === 'toc' ? 'toc' : 'links'); setMsg(null)
    try {
      const res = await fetch('/api/admin/blog/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        body: JSON.stringify({ mode, content: post.body }),
      })
      const json = await res.json()
      if (json.ok && typeof json.content === 'string') {
        setAiUndo(post.body)
        update({ body: json.content })
        setMsg({
          type: 'ok',
          text: mode === 'beautify'
            ? 'Formatting applied — your words are unchanged.'
            : mode === 'toc'
              ? 'Section headings added — your table of contents is ready.'
              : `Added ${json.kept} internal link${json.kept === 1 ? '' : 's'}${json.stripped ? ` (skipped ${json.stripped} unverified)` : ''}.`,
        })
      } else {
        setMsg({ type: 'err', text: json.error || 'AI request failed.' })
      }
    } catch {
      setMsg({ type: 'err', text: 'AI request failed.' })
    }
    setAiBusy(null)
  }
  const undoAI = () => { if (aiUndo !== null) { update({ body: aiUndo }); setAiUndo(null); setMsg(null) } }

  /* ── SEO checklist ── */
  const checks = [
    { ok: (post.seo.metaTitle || post.title).length > 0 && (post.seo.metaTitle || post.title).length <= 60, label: 'Meta title ≤ 60 chars' },
    { ok: (post.seo.metaDescription || post.excerpt).length >= 50 && (post.seo.metaDescription || post.excerpt).length <= 160, label: 'Meta description 50–160 chars' },
    { ok: post.seo.keywords.length > 0, label: 'At least one keyword' },
    { ok: !!post.coverImage, label: 'Cover image set' },
    { ok: !!(post.slug || post.title), label: 'URL slug present' },
    { ok: post.excerpt.trim().length > 0, label: 'Excerpt written' },
  ]
  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100)

  const slugValue = post.slug || (post.title ? generateSlug(post.title) : '')
  const tab_btn = (t: Tab, icon: typeof faPenToSquare, label: string) => (
    <button className={'bs-tab' + (tab === t ? ' bs-tab--on' : '')} onClick={() => setTab(t)} type="button">
      <FontAwesomeIcon icon={icon} /> {label}
    </button>
  )

  return (
    <div className="bs">
      {/* hidden file inputs */}
      <input ref={inlineFileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onInlineImage(f); e.target.value = '' }} />
      <input ref={coverFileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onCover(f, 'cover'); e.target.value = '' }} />
      <input ref={ogFileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onCover(f, 'og'); e.target.value = '' }} />

      {/* ── Top bar ── */}
      <div className="bs-bar">
        <button className="bs-icbtn" type="button" onClick={() => router.push('/iww-hq/blog')} title="Back to posts">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input
          className="bs-title-input"
          placeholder="Post title…"
          value={post.title}
          onChange={e => update({ title: e.target.value })}
        />
        <span className={'bs-status ' + (post.status === 'published' ? 'bs-status--pub' : 'bs-status--draft')}>
          {post.status}
        </span>
        <div className="bs-bar-actions">
          {!isNew && (
            <button className="bs-btn bs-btn--ghost-danger" type="button" onClick={del} title="Delete post">
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          )}
          <button className="bs-btn bs-btn--ghost" type="button" disabled={saving} onClick={() => save('draft')}>
            <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} spin={saving} /> Save draft
          </button>
          <button className="bs-btn bs-btn--primary" type="button" disabled={saving} onClick={() => save('published')}>
            <FontAwesomeIcon icon={saving ? faSpinner : faPaperPlane} spin={saving} /> Publish
          </button>
        </div>
      </div>

      {msg && (
        <div className={'bs-msg ' + (msg.type === 'ok' ? 'bs-msg--ok' : 'bs-msg--err')}>
          <FontAwesomeIcon icon={msg.type === 'ok' ? faCheck : faCircleExclamation} /> {msg.text}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="bs-tabs">
        {tab_btn('content', faPenToSquare, 'Content')}
        {tab_btn('seo', faChartLine, 'SEO')}
        {tab_btn('preview', faEye, 'Preview')}
        <span className="bs-tabs-spacer" />
        <span className="bs-stat"><FontAwesomeIcon icon={faClock} /> {stats.read} min</span>
        <span className="bs-stat">{stats.words} words</span>
        {tab === 'seo' && <span className="bs-stat bs-stat--score">SEO {score}%</span>}
      </div>

      {/* ════ CONTENT ════ */}
      {tab === 'content' && (
        <div className="bs-grid">
          <div className="bs-main">
            <label className="bs-field">
              <span className="bs-label"><FontAwesomeIcon icon={faLink} /> URL slug</span>
              <div className="bs-slug">
                <span className="bs-slug-prefix">/blog/</span>
                <input value={slugValue} onChange={e => update({ slug: generateSlug(e.target.value) })} placeholder="auto-from-title" />
              </div>
            </label>

            <label className="bs-field">
              <span className="bs-label">Excerpt <em>{post.excerpt.length}/200</em></span>
              <textarea rows={2} maxLength={200} value={post.excerpt} onChange={e => update({ excerpt: e.target.value })}
                placeholder="One or two lines that sell the post (also the default meta description)." />
            </label>

            <div className="bs-field">
              <span className="bs-label">Content</span>
              <div className="bs-ai">
                <span className="bs-ai-lead"><FontAwesomeIcon icon={faWandMagicSparkles} /> AI assist</span>
                <button type="button" className="bs-ai-btn" disabled={!!aiBusy} onClick={() => runAI('beautify')}>
                  <FontAwesomeIcon icon={aiBusy === 'beautify' ? faSpinner : faWandMagicSparkles} spin={aiBusy === 'beautify'} /> Beautify
                </button>
                <button type="button" className="bs-ai-btn" disabled={!!aiBusy} onClick={() => runAI('internal-links')}>
                  <FontAwesomeIcon icon={aiBusy === 'links' ? faSpinner : faLink} spin={aiBusy === 'links'} /> Add internal links
                </button>
                <button type="button" className="bs-ai-btn" disabled={!!aiBusy} onClick={() => runAI('toc')}>
                  <FontAwesomeIcon icon={aiBusy === 'toc' ? faSpinner : faListUl} spin={aiBusy === 'toc'} /> Table of contents
                </button>
                {aiUndo !== null && <button type="button" className="bs-ai-undo" onClick={undoAI}>Undo</button>}
                <span className="bs-ai-hint">Gemini keeps your words — adds formatting &amp; real links only</span>
              </div>
              <div className="bs-toolbar">
                {[
                  { i: faBold, k: 'bold', t: 'Bold' }, { i: faItalic, k: 'italic', t: 'Italic' },
                  { i: faHeading, k: 'h2', t: 'Heading' }, { i: faHeading, k: 'h3', t: 'Subheading', sm: true },
                  { i: faLink, k: 'link', t: 'Link' }, { i: faListUl, k: 'ul', t: 'Bullet list' },
                  { i: faListOl, k: 'ol', t: 'Numbered list' }, { i: faQuoteRight, k: 'quote', t: 'Quote' },
                  { i: faCode, k: 'code', t: 'Code' }, { i: faTableCells, k: 'table', t: 'Table' },
                  { i: faMinus, k: 'hr', t: 'Divider' },
                ].map((b, idx) => (
                  <button key={idx} type="button" className="bs-tb" title={b.t} onClick={() => applyMd(b.k)}>
                    <FontAwesomeIcon icon={b.i} style={b.sm ? { fontSize: '.72em' } : undefined} />
                  </button>
                ))}
                <span className="bs-tb-sep" />
                <button type="button" className="bs-tb" title="Insert image (upload)" disabled={uploading === 'inline'} onClick={() => inlineFileRef.current?.click()}>
                  <FontAwesomeIcon icon={uploading === 'inline' ? faSpinner : faImage} spin={uploading === 'inline'} />
                </button>
              </div>
              <textarea ref={bodyRef} className="bs-body" rows={18} value={post.body}
                onChange={e => update({ body: e.target.value })}
                placeholder="Write in Markdown — use the toolbar above. Headings, lists, links, images, tables and code all supported." />
              <div className="bs-substat">{stats.chars} characters · {stats.words} words · {stats.read} min read</div>
            </div>
          </div>

          {/* settings rail */}
          <div className="bs-side">
            <div className="bs-card">
              <div className="bs-card-h">Post settings</div>
              <label className="bs-field">
                <span className="bs-label">Category</span>
                <select value={post.category} onChange={e => update({ category: e.target.value })}>
                  {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="bs-field">
                <span className="bs-label">Author</span>
                <input value={post.author} onChange={e => update({ author: e.target.value })} />
              </label>
              <label className="bs-field">
                <span className="bs-label">Status</span>
                <select value={post.status} onChange={e => update({ status: e.target.value as 'draft' | 'published' })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <button type="button" className={'bs-toggle' + (post.featured ? ' bs-toggle--on' : '')} onClick={() => update({ featured: !post.featured })}>
                <FontAwesomeIcon icon={faStar} /> {post.featured ? 'Featured' : 'Mark as featured'}
              </button>
            </div>

            <div className="bs-card">
              <div className="bs-card-h"><FontAwesomeIcon icon={faImage} /> Cover image</div>
              {post.coverImage ? (
                <div className="bs-cover">
                  <img src={post.coverImage} alt="cover" />
                  <button type="button" className="bs-cover-x" onClick={() => update({ coverImage: '' })} title="Remove"><FontAwesomeIcon icon={faXmark} /></button>
                </div>
              ) : (
                <div className="bs-cover bs-cover--empty"><FontAwesomeIcon icon={faImage} /></div>
              )}
              <div className="bs-cover-actions">
                <button type="button" className="bs-btn bs-btn--ghost bs-btn--sm" disabled={uploading === 'cover'} onClick={() => coverFileRef.current?.click()}>
                  <FontAwesomeIcon icon={uploading === 'cover' ? faSpinner : faUpload} spin={uploading === 'cover'} /> Upload
                </button>
                <button type="button" className="bs-btn bs-btn--ghost bs-btn--sm" onClick={() => setShowStock(s => !s)}>Stock</button>
              </div>
              <input className="bs-url" placeholder="…or paste an image URL" value={post.coverImage} onChange={e => update({ coverImage: e.target.value })} />
              {showStock && (
                <div className="bs-stock">
                  {stockCovers.map(s => (
                    <button key={s.url} type="button" title={s.label} onClick={() => { update({ coverImage: s.url }); setShowStock(false) }}>
                      <img src={s.url} alt={s.label} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bs-card">
              <div className="bs-card-h"><FontAwesomeIcon icon={faTag} /> Tags</div>
              <div className="bs-taginput">
                <input value={tagDraft} onChange={e => setTagDraft(e.target.value)} placeholder="Add a tag"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
                <button type="button" className="bs-icbtn bs-icbtn--sm" onClick={addTag}><FontAwesomeIcon icon={faPlus} /></button>
              </div>
              {post.tags.length > 0 && (
                <div className="bs-pills">
                  {post.tags.map(t => (
                    <span key={t} className="bs-pill">{t}<button type="button" onClick={() => update({ tags: post.tags.filter(x => x !== t) })}><FontAwesomeIcon icon={faXmark} /></button></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════ SEO ════ */}
      {tab === 'seo' && (
        <div className="bs-grid">
          <div className="bs-main">
            <label className="bs-field">
              <span className="bs-label">Meta title <em>{(post.seo.metaTitle || post.title).length}/60</em></span>
              <input value={post.seo.metaTitle} onChange={e => updateSeo({ metaTitle: e.target.value })} placeholder={post.title || 'Defaults to the post title'} />
            </label>
            <label className="bs-field">
              <span className="bs-label">Meta description <em>{(post.seo.metaDescription || post.excerpt).length}/160</em></span>
              <textarea rows={3} value={post.seo.metaDescription} onChange={e => updateSeo({ metaDescription: e.target.value })} placeholder={post.excerpt || 'Defaults to the excerpt'} />
            </label>
            <div className="bs-field">
              <span className="bs-label">Focus keywords</span>
              <div className="bs-taginput">
                <input value={kwDraft} onChange={e => setKwDraft(e.target.value)} placeholder="Add a keyword"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKw() } }} />
                <button type="button" className="bs-icbtn bs-icbtn--sm" onClick={addKw}><FontAwesomeIcon icon={faPlus} /></button>
              </div>
              {post.seo.keywords.length > 0 && (
                <div className="bs-pills">
                  {post.seo.keywords.map(k => (
                    <span key={k} className="bs-pill">{k}<button type="button" onClick={() => updateSeo({ keywords: post.seo.keywords.filter(x => x !== k) })}><FontAwesomeIcon icon={faXmark} /></button></span>
                  ))}
                </div>
              )}
            </div>
            <div className="bs-row2">
              <label className="bs-field">
                <span className="bs-label">Canonical URL</span>
                <input value={post.seo.canonicalUrl} onChange={e => updateSeo({ canonicalUrl: e.target.value })} placeholder="(optional)" />
              </label>
              <div className="bs-field">
                <span className="bs-label">OG image</span>
                <div className="bs-taginput">
                  <input className="bs-url" value={post.seo.ogImage} onChange={e => updateSeo({ ogImage: e.target.value })} placeholder="Defaults to cover" />
                  <button type="button" className="bs-icbtn bs-icbtn--sm" disabled={uploading === 'og'} onClick={() => ogFileRef.current?.click()}><FontAwesomeIcon icon={uploading === 'og' ? faSpinner : faUpload} spin={uploading === 'og'} /></button>
                </div>
              </div>
            </div>
            <button type="button" className={'bs-toggle' + (post.seo.noIndex ? ' bs-toggle--on' : '')} onClick={() => updateSeo({ noIndex: !post.seo.noIndex })}>
              <FontAwesomeIcon icon={faEye} /> {post.seo.noIndex ? 'Hidden from search (noindex)' : 'Visible to search engines'}
            </button>
          </div>

          <div className="bs-side">
            <div className="bs-card">
              <div className="bs-card-h">SEO checklist <span className="bs-score">{score}%</span></div>
              <ul className="bs-checks">
                {checks.map(c => (
                  <li key={c.label} className={c.ok ? 'bs-ok' : 'bs-no'}>
                    <FontAwesomeIcon icon={c.ok ? faCheck : faCircleExclamation} /> {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bs-card">
              <div className="bs-card-h">Google preview</div>
              <div className="bs-serp">
                <div className="bs-serp-url">infowebworld.com › blog › {slugValue || 'your-post'}</div>
                <div className="bs-serp-title">{post.seo.metaTitle || post.title || 'Post title'}</div>
                <div className="bs-serp-desc">{post.seo.metaDescription || post.excerpt || 'Your meta description preview shows up here.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ PREVIEW ════ */}
      {tab === 'preview' && (
        <div className="bs-preview">
          {post.coverImage && <div className="bs-preview-cover"><img src={post.coverImage} alt={post.title} /></div>}
          <div className="bs-preview-meta">{post.category} · {stats.read} min read</div>
          <h1 className="bs-preview-title">{post.title || 'Untitled post'}</h1>
          <p className="bs-preview-author">By {post.author}</p>
          <div className="blog-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}
    </div>
  )
}
