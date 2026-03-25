'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchPostById, apiSavePost } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

const inputStyle: React.CSSProperties = { width: '100%', height: 44, padding: '0 .85rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.82rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }

/* ── SEO Score Engine ── */
type Check = { label: string; pass: boolean; weight: number; tip: string }

function computeSeoChecks(post: BlogPost): Check[] {
  const s = post.seo
  const title = s.metaTitle || post.title
  const desc = s.metaDescription || post.excerpt
  const kw = s.keywords[0] || ''
  const words = (post.body || '').split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const kwLower = kw.toLowerCase()

  return [
    { label: 'Meta title length', pass: title.length >= 30 && title.length <= 60, weight: 15, tip: `${title.length}/60 chars — ideal is 30-60` },
    { label: 'Meta description length', pass: desc.length >= 80 && desc.length <= 160, weight: 15, tip: `${desc.length}/160 chars — ideal is 80-160` },
    { label: 'Has focus keyword', pass: !!kw, weight: 10, tip: kw ? `"${kw}"` : 'Add at least one keyword' },
    { label: 'Keyword in title', pass: !!kwLower && title.toLowerCase().includes(kwLower), weight: 15, tip: kwLower ? (title.toLowerCase().includes(kwLower) ? 'Found' : `"${kw}" not in title`) : 'Set a keyword first' },
    { label: 'Keyword in description', pass: !!kwLower && desc.toLowerCase().includes(kwLower), weight: 10, tip: kwLower ? (desc.toLowerCase().includes(kwLower) ? 'Found' : `"${kw}" not in description`) : 'Set a keyword first' },
    { label: 'Has OG image', pass: !!(s.ogImage || post.coverImage), weight: 10, tip: (s.ogImage || post.coverImage) ? 'Set' : 'Add an OG image for social sharing' },
    { label: 'Keyword in slug', pass: !!kwLower && post.slug.includes(kwLower.replace(/\s+/g, '-')), weight: 5, tip: post.slug ? `/${post.slug}` : 'Generate a slug' },
    { label: 'Has canonical URL', pass: !!s.canonicalUrl, weight: 5, tip: s.canonicalUrl || 'Set a canonical URL' },
    { label: 'Body > 300 words', pass: wordCount >= 300, weight: 10, tip: `${wordCount} words — ${wordCount >= 300 ? 'good' : 'aim for 300+'}` },
    { label: 'Has cover image', pass: !!post.coverImage, weight: 5, tip: post.coverImage ? 'Set' : 'Add a cover image' },
  ]
}

function getKeywordDensity(body: string, keywords: string[]): { keyword: string; count: number; density: number }[] {
  if (!body || !keywords.length) return []
  const words = body.toLowerCase().split(/\s+/).filter(Boolean)
  const total = words.length
  if (!total) return []
  return keywords.slice(0, 5).map(kw => {
    const kwL = kw.toLowerCase()
    const count = words.filter(w => w.includes(kwL)).length
    return { keyword: kw, count, density: Math.round((count / total) * 1000) / 10 }
  })
}

function getReadability(body: string): { level: string; color: string; score: number } {
  if (!body) return { level: 'N/A', color: 'var(--h-muted)', score: 0 }
  const sentences = body.split(/[.!?]+/).filter(s => s.trim().length > 3)
  const words = body.split(/\s+/).filter(Boolean)
  if (!sentences.length || !words.length) return { level: 'N/A', color: 'var(--h-muted)', score: 0 }
  const avgWordsPerSentence = words.length / sentences.length
  // Simplified Flesch approximation
  const score = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 10))
  if (score >= 60) return { level: 'Easy', color: '#2FAE6A', score: Math.round(score) }
  if (score >= 40) return { level: 'Medium', color: '#F59E0B', score: Math.round(score) }
  return { level: 'Hard', color: '#EF4444', score: Math.round(score) }
}

/* ── Score Ring ── */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#2FAE6A' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--h-border)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: size * 0.28, fontWeight: 800, fontFamily: "var(--font-nunito)", fill: color }}>{score}</text>
    </svg>
  )
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.25rem', marginBottom: '.75rem' }}>
    <h3 style={{ fontSize: '.78rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '.85rem' }}>{title}</h3>
    {children}
  </div>
)

export default function SeoEditor() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => { if (id) { fetchPostById(id).then(p => { if (p) setPost(p); else router.replace('/iww-hq/blog') }) } }, [id, router])

  // Debounced analysis — only recalculate 500ms after last edit
  const [analysis, setAnalysis] = useState<{ checks: Check[]; score: number; kwDensity: ReturnType<typeof getKeywordDensity>; readability: ReturnType<typeof getReadability> }>({ checks: [], score: 0, kwDensity: [], readability: { level: 'N/A', color: 'var(--h-muted)', score: 0 } })
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!post) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const checks = computeSeoChecks(post)
      setAnalysis({
        checks,
        score: checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0),
        kwDensity: getKeywordDensity(post.body, post.seo.keywords),
        readability: getReadability(post.body),
      })
    }, 500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [post])

  const { checks, score, kwDensity, readability } = analysis

  if (!post) return null

  const seo = post.seo
  const setSeo = (k: string, v: string | boolean | string[]) => setPost({ ...post, seo: { ...seo, [k]: v } })

  const save = async () => { await apiSavePost({ ...post, updatedAt: new Date().toISOString() }); router.push('/iww-hq/blog') }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* ── SEO Score ── */}
      <Card title="SEO Score">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <ScoreRing score={score} />
          <div style={{ flex: 1 }}>
            {checks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.25rem 0', fontSize: '.65rem' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.5rem', fontWeight: 800, background: c.pass ? 'rgba(47,174,106,.1)' : 'rgba(239,68,68,.1)', color: c.pass ? '#2FAE6A' : '#EF4444', flexShrink: 0 }}>{c.pass ? '✓' : '!'}</span>
                <span style={{ fontWeight: 600, color: 'var(--h-heading)' }}>{c.label}</span>
                <span style={{ color: 'var(--h-muted)', marginLeft: 'auto', fontSize: '.58rem' }}>{c.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Keyword Density ── */}
      {kwDensity.length > 0 && (
        <Card title="Keyword Density">
          {kwDensity.map(k => (
            <div key={k.keyword} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.35rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--h-heading)', flex: 1 }}>{k.keyword}</span>
              <span style={{ fontSize: '.65rem', fontWeight: 600, color: 'var(--h-muted)' }}>{k.count}x</span>
              <span style={{ fontSize: '.62rem', fontWeight: 700, padding: '.15rem .45rem', borderRadius: 999, background: k.density >= 0.5 && k.density <= 3 ? 'rgba(47,174,106,.1)' : 'rgba(239,68,68,.1)', color: k.density >= 0.5 && k.density <= 3 ? '#2FAE6A' : '#EF4444' }}>{k.density}%</span>
            </div>
          ))}
          <p style={{ fontSize: '.55rem', color: 'var(--h-muted)', marginTop: '.5rem' }}>Ideal density: 0.5% – 3%. Over 3% may flag as keyword stuffing.</p>
        </Card>
      )}

      {/* ── Readability ── */}
      <Card title="Readability">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: readability.color }}>{readability.level}</span>
          <div>
            <p style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--h-heading)' }}>Reading ease score: {readability.score}/100</p>
            <p style={{ fontSize: '.6rem', color: 'var(--h-muted)' }}>Aim for "Easy" (60+) for broader audience reach.</p>
          </div>
        </div>
      </Card>

      {/* ── Meta Fields ── */}
      <Card title="Meta Tags">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Meta Title <span style={{ fontWeight: 500, color: (seo.metaTitle || post.title).length > 60 ? '#EF4444' : 'var(--h-muted)' }}>({(seo.metaTitle || post.title).length}/60)</span></label>
            <input style={inputStyle} value={seo.metaTitle} onChange={e => setSeo('metaTitle', e.target.value)} placeholder={post.title} maxLength={70} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Meta Description <span style={{ fontWeight: 500, color: (seo.metaDescription || post.excerpt).length > 160 ? '#EF4444' : 'var(--h-muted)' }}>({(seo.metaDescription || post.excerpt).length}/160)</span></label>
            <textarea style={{ ...inputStyle, height: 'auto', padding: '.65rem .85rem', minHeight: 72, resize: 'vertical', lineHeight: 1.6 }} value={seo.metaDescription} onChange={e => setSeo('metaDescription', e.target.value)} placeholder={post.excerpt} maxLength={170} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Focus Keywords (comma separated)</label>
            <input style={inputStyle} value={seo.keywords.join(', ')} onChange={e => setSeo('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} placeholder="seo, business, directory" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>OG Image URL</label>
            <input style={inputStyle} value={seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} placeholder={post.coverImage || 'https://...'} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Canonical URL</label>
            <input style={inputStyle} value={seo.canonicalUrl} onChange={e => setSeo('canonicalUrl', e.target.value)} placeholder={`https://infowebworld.com/blog/${post.slug}`} onFocus={focus} onBlur={blur} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={seo.noIndex} onChange={e => setSeo('noIndex', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#E8553D' }} />
            <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--h-heading)' }}>noindex (hide from search engines)</span>
          </label>
        </div>
      </Card>

      {/* ── Google Preview ── */}
      <Card title="Google Search Preview">
        <div style={{ padding: '1rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: '#fff' }}>
          <p style={{ fontSize: '.82rem', fontWeight: 600, color: '#1A0DAB', marginBottom: '.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seo.metaTitle || post.title || 'Page Title'}</p>
          <p style={{ fontSize: '.62rem', color: '#006621', marginBottom: '.25rem' }}>infowebworld.com &rsaquo; blog &rsaquo; {post.slug || '...'}</p>
          <p style={{ fontSize: '.68rem', color: '#545454', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{seo.metaDescription || post.excerpt || 'Meta description will appear here...'}</p>
        </div>
      </Card>

      {/* ── Social Preview ── */}
      <Card title="Social Media Preview">
        <div style={{ borderRadius: 12, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
          {(seo.ogImage || post.coverImage) && (
            <img src={seo.ogImage || post.coverImage} alt="" style={{ width: '100%', aspectRatio: '1.91/1', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ padding: '.85rem' }}>
            <p style={{ fontSize: '.55rem', fontWeight: 600, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.2rem' }}>infowebworld.com</p>
            <p style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.2rem', lineHeight: 1.3 }}>{seo.metaTitle || post.title}</p>
            <p style={{ fontSize: '.65rem', color: 'var(--h-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{seo.metaDescription || post.excerpt}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem' }}>
        <button onClick={() => router.push('/iww-hq/blog')} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Cancel</button>
        <div style={{ flex: 1 }} />
        <button onClick={save} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Save SEO Settings</button>
      </div>
    </div>
  )
}
