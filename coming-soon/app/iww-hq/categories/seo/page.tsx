'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchCategoryById, apiSaveCategory } from '../../data/category-storage'
import type { Category } from '../../data/category-storage'

/* -- Shared styles (outside component = never recreated) -- */
const inputStyle: React.CSSProperties = { width: '100%', height: 44, padding: '0 .85rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.82rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }

/* -- SEO Score Engine -- */
type Check = { label: string; pass: boolean; weight: number; tip: string }

function computeSeoChecks(cat: Category): Check[] {
  const title = cat.seoTitle || cat.name
  const desc = cat.seoDescription || cat.description
  const kw = (cat.seoKeywords && cat.seoKeywords[0]) || ''
  const words = (cat.description || '').split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const kwLower = kw.toLowerCase()
  const slugFriendly = /^[a-z0-9-]+$/.test(cat.slug) && cat.slug.length > 0

  return [
    { label: 'Meta title length', pass: title.length >= 30 && title.length <= 60, weight: 15, tip: `${title.length}/60 chars -- ideal is 30-60` },
    { label: 'Meta description length', pass: desc.length >= 80 && desc.length <= 160, weight: 15, tip: `${desc.length}/160 chars -- ideal is 80-160` },
    { label: 'Description (50+ words)', pass: wordCount >= 50, weight: 10, tip: `${wordCount} words -- ${wordCount >= 50 ? 'good' : 'aim for 50+'}` },
    { label: 'Has cover / OG image', pass: !!(cat.seoOgImage || cat.coverImage), weight: 10, tip: (cat.seoOgImage || cat.coverImage) ? 'Set' : 'Add an OG image for social sharing' },
    { label: 'Slug is URL-friendly', pass: slugFriendly, weight: 5, tip: slugFriendly ? `/${cat.slug}` : 'Slug contains invalid characters' },
    { label: 'Has at least 1 keyword', pass: !!kw, weight: 10, tip: kw ? `"${kw}"` : 'Add at least one keyword' },
    { label: 'Keyword in title', pass: !!kwLower && title.toLowerCase().includes(kwLower), weight: 15, tip: kwLower ? (title.toLowerCase().includes(kwLower) ? 'Found' : `"${kw}" not in title`) : 'Set a keyword first' },
    { label: 'Keyword in description', pass: !!kwLower && desc.toLowerCase().includes(kwLower), weight: 10, tip: kwLower ? (desc.toLowerCase().includes(kwLower) ? 'Found' : `"${kw}" not in description`) : 'Set a keyword first' },
    { label: 'Has canonical URL', pass: !!cat.seoCanonical, weight: 5, tip: cat.seoCanonical || 'Set a canonical URL' },
    { label: 'Category is launched', pass: cat.isLaunched, weight: 5, tip: cat.isLaunched ? 'Yes' : 'Category is not launched yet' },
  ]
}

/* -- Score Ring -- */
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

export default function CategorySeoEditor() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const [cat, setCat] = useState<Category | null>(null)

  useEffect(() => { if (id) { fetchCategoryById(id).then(c => { if (c) setCat(c); else router.replace('/iww-hq/categories') }) } }, [id, router])

  // Debounced analysis -- only recalculate 500ms after last edit
  const [analysis, setAnalysis] = useState<{ checks: Check[]; score: number }>({ checks: [], score: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!cat) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const checks = computeSeoChecks(cat)
      setAnalysis({
        checks,
        score: checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0),
      })
    }, 500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [cat])

  const { checks, score } = analysis

  if (!cat) return null

  const setSeo = (k: keyof Category, v: string | boolean | string[]) => setCat({ ...cat, [k]: v })

  const save = async () => { await apiSaveCategory({ ...cat, updatedAt: new Date().toISOString() }); router.push('/iww-hq/categories') }

  const displayTitle = cat.seoTitle || cat.name
  const displayDesc = cat.seoDescription || cat.description

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* -- SEO Score -- */}
      <Card title="SEO Score">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <ScoreRing score={score} />
          <div style={{ flex: 1 }}>
            {checks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.25rem 0', fontSize: '.65rem' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.5rem', fontWeight: 800, background: c.pass ? 'rgba(47,174,106,.1)' : 'rgba(239,68,68,.1)', color: c.pass ? '#2FAE6A' : '#EF4444', flexShrink: 0 }}>
                  {c.pass ? (
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 4v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="8" cy="12" r="1.2" fill="currentColor" /></svg>
                  )}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--h-heading)' }}>{c.label}</span>
                <span style={{ color: 'var(--h-muted)', marginLeft: 'auto', fontSize: '.58rem' }}>{c.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* -- Meta Fields -- */}
      <Card title="Meta Tags">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Meta Title <span style={{ fontWeight: 500, color: displayTitle.length > 60 ? '#EF4444' : 'var(--h-muted)' }}>({displayTitle.length}/60)</span></label>
            <input style={inputStyle} value={cat.seoTitle} onChange={e => setSeo('seoTitle', e.target.value)} placeholder={cat.name} maxLength={70} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Meta Description <span style={{ fontWeight: 500, color: displayDesc.length > 160 ? '#EF4444' : 'var(--h-muted)' }}>({displayDesc.length}/160)</span></label>
            <textarea style={{ ...inputStyle, height: 'auto', padding: '.65rem .85rem', minHeight: 72, resize: 'vertical', lineHeight: 1.6 }} value={cat.seoDescription} onChange={e => setSeo('seoDescription', e.target.value)} placeholder={cat.description} maxLength={170} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Focus Keywords (comma separated)</label>
            <input style={inputStyle} value={cat.seoKeywords.join(', ')} onChange={e => setSeo('seoKeywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} placeholder="business directory, listings, local" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>OG Image URL</label>
            <input style={inputStyle} value={cat.seoOgImage} onChange={e => setSeo('seoOgImage', e.target.value)} placeholder={cat.coverImage || 'https://...'} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Canonical URL</label>
            <input style={inputStyle} value={cat.seoCanonical} onChange={e => setSeo('seoCanonical', e.target.value)} placeholder={`https://infowebworld.com/${cat.slug}`} onFocus={focus} onBlur={blur} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={cat.seoNoIndex} onChange={e => setSeo('seoNoIndex', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#E8553D' }} />
            <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--h-heading)' }}>noindex (hide from search engines)</span>
          </label>
        </div>
      </Card>

      {/* -- Google Preview -- */}
      <Card title="Google Search Preview">
        <div style={{ padding: '1rem', borderRadius: 12, border: '1.5px solid var(--h-border)', background: '#fff' }}>
          <p style={{ fontSize: '.82rem', fontWeight: 600, color: '#1A0DAB', marginBottom: '.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle || 'Page Title'}</p>
          <p style={{ fontSize: '.62rem', color: '#006621', marginBottom: '.25rem' }}>infowebworld.com &rsaquo; category &rsaquo; {cat.slug || '...'}</p>
          <p style={{ fontSize: '.68rem', color: '#545454', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{displayDesc || 'Meta description will appear here...'}</p>
        </div>
      </Card>

      {/* -- Social Preview -- */}
      <Card title="Social Media Preview">
        <div style={{ borderRadius: 12, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
          {(cat.seoOgImage || cat.coverImage) && (
            <img src={cat.seoOgImage || cat.coverImage} alt="" style={{ width: '100%', aspectRatio: '1.91/1', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ padding: '.85rem' }}>
            <p style={{ fontSize: '.55rem', fontWeight: 600, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.2rem' }}>infowebworld.com</p>
            <p style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.2rem', lineHeight: 1.3 }}>{displayTitle}</p>
            <p style={{ fontSize: '.65rem', color: 'var(--h-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{displayDesc}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem' }}>
        <button onClick={() => router.push('/iww-hq/categories')} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Cancel</button>
        <div style={{ flex: 1 }} />
        <button onClick={save} style={{ padding: '.55rem 1.25rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Save SEO Settings</button>
      </div>
    </div>
  )
}
