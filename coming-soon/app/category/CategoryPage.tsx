'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fetchCategoryBySlug, fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'

/* ── SVG Icon helper (Lucide-style, no emoji) ── */
const I = ({ d, size = 18, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)

const icons = {
  home:      'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  chevron:   'M9 18l6-6-6-6',
  grid:      'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  building:  'M4 2h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z|M9 22v-4h6v4|M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01',
  plus:      'M12 5v14|M5 12h14',
  arrow:     'M5 12h14|M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5|M12 19l-7-7 7-7',
  check:     'M20 6L9 17l-5-5',
  star:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  shield:    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  zap:       'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  trophy:    'M6 9H4.5a2.5 2.5 0 010-5H6|M18 9h1.5a2.5 2.5 0 000-5H18|M4 22h16|M10 22V8|M14 22V8|M8 2h8v7a4 4 0 01-8 0V2z',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z',
  users:     'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 3a4 4 0 100 8 4 4 0 000-8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75',
  link:      'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  barChart:  'M12 20V10|M18 20V4|M6 20v-4',
  clock:     'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6v6l4 2',
  tag:       'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z|M7 7h.01',
  search:    'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  globe:     'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z',
  rocket:    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z|M12 15l-3-3a22 22 0 015-10.06A22 22 0 0124 7a22 22 0 01-10.06 5z',
  award:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  layers:    'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  target:    'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6a6 6 0 100 12 6 6 0 000-12z|M12 10a2 2 0 100 4 2 2 0 000-4z',
  sparkle:   'M12 3v2|M12 19v2|M5.64 5.64l1.41 1.41|M16.95 16.95l1.41 1.41|M3 12h2|M19 12h2|M5.64 18.36l1.41-1.41|M16.95 7.05l1.41-1.41',
}

export default function CategoryPage() {
  const params = useSearchParams()
  const slug = params.get('slug') || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/infowebworld\/category\//, '').replace(/\/$/, '') || null : null)

  const [category, setCategory] = useState<Category | null>(null)
  const [related, setRelated] = useState<Category[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); return }
    Promise.all([
      fetchCategoryBySlug(slug),
      fetchLaunchedCategories(),
    ]).then(([cat, allCats]) => {
      if (cat) {
        setCategory(cat)
        setRelated(allCats.filter(c =>
          c.id !== cat.id && ((cat.parentId && c.parentId === cat.parentId) || (!cat.parentId && c.level === cat.level))
        ).slice(0, 6))
      } else { setNotFound(true) }
    })
  }, [slug])

  useEffect(() => {
    if (!category) return
    document.title = `${category.seoTitle || category.name} | InfoWebWorld`
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    setMeta('description', category.seoDescription || category.description)
    if (category.seoKeywords.length) setMeta('keywords', category.seoKeywords.join(', '))
    setMeta('og:title', category.seoTitle || category.name)
    setMeta('og:description', category.seoDescription || category.description)
    if (category.seoOgImage || category.coverImage) setMeta('og:image', category.seoOgImage || category.coverImage)
  }, [category])

  if (notFound) {
    return (
      <section className="category-detail">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#E8553D0A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <I d={icons.search} size={28} color="#E8553D" />
          </div>
          <h1 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.5rem' }}>Category Not Found</h1>
          <p style={{ color: 'var(--h-body)', fontFamily: "var(--font-nunito)", fontSize: '.88rem', maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>This category doesn&apos;t exist or hasn&apos;t been launched yet.</p>
          <Link href="/categories" className="category-empty-cta-primary">Browse Categories</Link>
        </div>
      </section>
    )
  }

  if (!category) return null

  const c = category
  const color = c.color || '#E8553D'
  const subcats = c.subcategories || []
  const totalSpots = 200
  const hasListings = c.listingCount > 0

  // Benefits of listing in this category
  const benefits = [
    { icon: 'eye', title: 'Priority Visibility', desc: `Early listings in ${c.name} get premium placement and maximum exposure to buyers.` },
    { icon: 'link', title: 'Dofollow Backlink', desc: 'Get a permanent DA 72+ dofollow backlink to boost your search rankings.' },
    { icon: 'shield', title: 'Verified Badge', desc: 'Stand out with a verified business badge that builds instant trust with visitors.' },
    { icon: 'barChart', title: 'Analytics Dashboard', desc: 'Track views, clicks, and leads with your dedicated business analytics panel.' },
    { icon: 'users', title: 'Lead Generation', desc: 'Receive direct inquiries from businesses and professionals searching this category.' },
    { icon: 'globe', title: 'Global Reach', desc: 'Get discovered by professionals across 12+ countries searching for solutions.' },
  ]

  return (
    <section className="category-detail">
      <div className="container">

        {/* ═══ Hero Header Card ═══ */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', overflow: 'hidden', marginBottom: '1.5rem' }}>
          {/* Gradient banner */}
          <div style={{ height: 'clamp(100px, 15vw, 140px)', background: `linear-gradient(135deg, ${color}15 0%, ${color}06 60%, var(--h-bg) 100%)`, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 clamp(1.25rem, 3vw, 2rem)' }}>
            {/* Decorative pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
            {/* Breadcrumb inside banner */}
            <nav style={{ position: 'absolute', top: 'clamp(.75rem, 2vw, 1.15rem)', left: 'clamp(1.25rem, 3vw, 2rem)', right: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', alignItems: 'center', gap: '.3rem', flexWrap: 'wrap', zIndex: 3 }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem', fontSize: '.65rem', fontWeight: 600, fontFamily: "var(--font-nunito)", color: 'var(--h-muted)', textDecoration: 'none', padding: '.2rem .5rem', borderRadius: 999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', transition: 'color .2s' }}>
                <I d={icons.home} size={11} color="var(--h-muted)" sw={2} />
                Home
              </Link>
              <span style={{ fontSize: '.6rem', color: 'var(--h-border)' }}>/</span>
              <Link href="/categories" style={{ fontSize: '.65rem', fontWeight: 600, fontFamily: "var(--font-nunito)", color: 'var(--h-muted)', textDecoration: 'none', padding: '.2rem .5rem', borderRadius: 999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', transition: 'color .2s' }}>
                Categories
              </Link>
              {c.parentName && (
                <>
                  <span style={{ fontSize: '.6rem', color: 'var(--h-border)' }}>/</span>
                  <span style={{ fontSize: '.65rem', fontWeight: 700, fontFamily: "var(--font-nunito)", color, padding: '.2rem .5rem', borderRadius: 999, background: `${color}10` }}>
                    {c.parentName}
                  </span>
                </>
              )}
              <span style={{ fontSize: '.6rem', color: 'var(--h-border)' }}>/</span>
              <span style={{ fontSize: '.65rem', fontWeight: 700, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', padding: '.2rem .5rem', borderRadius: 999, background: 'rgba(255,255,255,0.85)' }}>
                {c.name}
              </span>
            </nav>
            {/* Floating icon */}
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#fff', border: `2.5px solid ${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: -36, boxShadow: '0 8px 28px rgba(0,0,0,0.07)', position: 'relative', zIndex: 2 }}>
              <I d={icons[c.icon as keyof typeof icons] || icons.grid} size={32} color={color} />
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: 'calc(36px + 1.25rem) clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
              {c.parentName && (
                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '.18rem .6rem', borderRadius: 999, background: `${color}08`, color, fontFamily: "var(--font-nunito)", letterSpacing: '.01em' }}>{c.parentName}</span>
              )}
              {c.level === 1 && (
                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '.18rem .6rem', borderRadius: 999, background: `${color}08`, color, fontFamily: "var(--font-nunito)" }}>Sector</span>
              )}
              {!hasListings && (
                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '.18rem .6rem', borderRadius: 999, background: '#2FAE6A10', color: '#2FAE6A', fontFamily: "var(--font-nunito)", display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                  <I d={icons.zap} size={10} color="#2FAE6A" sw={2} />
                  Accepting First Listings
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, color: 'var(--h-heading)', lineHeight: 1.12, letterSpacing: '-.025em', marginBottom: '.6rem' }}>
              {c.name}
            </h1>

            <p style={{ fontFamily: "var(--font-nunito)", fontSize: 'clamp(.84rem, 1.8vw, .95rem)', color: 'var(--h-body)', lineHeight: 1.65, maxWidth: 640, marginBottom: '1.25rem' }}>
              {c.description || `Discover and compare the best ${c.name} businesses and software. Read verified reviews, compare features, and find the right solution for your needs.`}
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 'clamp(.75rem, 2vw, 1.5rem)', flexWrap: 'wrap' }}>
              {[
                { icon: 'building', label: hasListings ? `${c.listingCount} Listed` : 'No Listings Yet', val: hasListings },
                { icon: 'layers', label: `${subcats.length} Subcategories`, val: subcats.length > 0 },
                { icon: 'target', label: `${totalSpots - c.listingCount} Spots Left`, val: true },
                { icon: 'zap', label: 'Early Access Open', val: !hasListings },
              ].filter(s => s.val).map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I d={icons[s.icon as keyof typeof icons]} size={13} color={color} sw={1.8} />
                  </div>
                  <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.72rem', fontWeight: 700, color: 'var(--h-heading)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Subcategory Chips ═══ */}
        {subcats.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: "var(--font-bricolage)", fontSize: '.82rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.65rem' }}>Subcategories</h3>
            <div className="category-subcats">
              {subcats.map(sc => (
                <Link key={sc.id} href={`/category/${sc.slug}`} className="category-subcat-chip">
                  {sc.name}
                  {sc.listingCount > 0 && <span style={{ opacity: .5, marginLeft: '.3rem' }}>({sc.listingCount})</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Main Content: Empty State (Pre-Launch) ═══ */}
        {!hasListings && (
          <>
            {/* Be the First — Hero CTA */}
            <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              {/* Background pattern */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.03, background: `radial-gradient(circle at 20% 30%, ${color}, transparent 50%), radial-gradient(circle at 80% 70%, ${color}, transparent 50%)` }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 80, height: 80, borderRadius: 22, background: `${color}08`, border: `2px solid ${color}12`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <I d={icons.rocket} size={36} color={color} />
                </div>

                <h2 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--h-heading)', lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: '.65rem' }}>
                  Be the First in {c.name}
                </h2>

                <p style={{ fontFamily: "var(--font-nunito)", fontSize: 'clamp(.84rem, 1.8vw, 1rem)', color: 'var(--h-body)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 1.75rem' }}>
                  No businesses have claimed a listing in {c.name} yet. Be the founding member — get priority placement, a verified badge, and lifetime visibility.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <Link href={`/get-listed?category=${encodeURIComponent(c.name)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.85rem 2rem', borderRadius: 999, background: color, color: '#fff', fontFamily: "var(--font-nunito)", fontSize: '.9rem', fontWeight: 700, textDecoration: 'none', border: `1.5px solid ${color}`, transition: 'all .35s cubic-bezier(.16,1,.3,1)', boxShadow: `0 6px 24px ${color}30` }}>
                    <I d={icons.plus} size={16} color="#fff" sw={2.5} />
                    Get Listed — $240 Lifetime
                  </Link>
                  <Link href="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.85rem 1.75rem', borderRadius: 999, background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", fontSize: '.9rem', fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--h-border)', transition: 'all .35s cubic-bezier(.16,1,.3,1)' }}>
                    <I d={icons.grid} size={16} color="var(--h-muted)" sw={2} />
                    Browse Categories
                  </Link>
                </div>

                {/* Progress */}
                <div style={{ maxWidth: 340, margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.66rem', fontWeight: 700, color: 'var(--h-muted)' }}>{c.listingCount} of {totalSpots} founding spots claimed</span>
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.66rem', fontWeight: 800, color }}>{totalSpots - c.listingCount} left</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: 'var(--h-border-light)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}, ${color}AA)`, width: `${Math.max((c.listingCount / totalSpots) * 100, 1)}%`, transition: 'width .6s cubic-bezier(.16,1,.3,1)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ Why List Here — Benefits Grid ═══ */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontFamily: "var(--font-nunito)", fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color, padding: '.25rem .65rem', borderRadius: 999, background: `${color}08` }}>Why List in {c.name}</span>
                <h3 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 800, color: 'var(--h-heading)', marginTop: '.65rem', letterSpacing: '-.01em' }}>Everything you get as a founding member</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.35rem', transition: 'transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.85rem' }}>
                      <I d={icons[b.icon as keyof typeof icons]} size={20} color={color} />
                    </div>
                    <h4 style={{ fontFamily: "var(--font-bricolage)", fontSize: '.88rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.3rem' }}>{b.title}</h4>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: '.75rem', color: 'var(--h-body)', lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ How It Works ═══ */}
            <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 800, color: 'var(--h-heading)' }}>Get listed in 3 simple steps</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
                {[
                  { step: 1, title: 'Submit Your Business', desc: 'Fill out a quick form with your company details, tagline, and category.', icon: 'tag' },
                  { step: 2, title: 'Get Verified', desc: 'Our team reviews and verifies your listing within 24 hours.', icon: 'shield' },
                  { step: 3, title: 'Go Live', desc: 'Your verified listing goes live with a dofollow backlink and analytics dashboard.', icon: 'zap' },
                ].map(s => (
                  <div key={s.step} style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}08`, border: `1.5px solid ${color}15`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.85rem', position: 'relative' }}>
                      <I d={icons[s.icon as keyof typeof icons]} size={22} color={color} />
                      <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 999, background: color, color: '#fff', fontSize: '.56rem', fontWeight: 800, fontFamily: "var(--font-nunito)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.step}</span>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-bricolage)", fontSize: '.85rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.3rem' }}>{s.title}</h4>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: '.74rem', color: 'var(--h-body)', lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ Final CTA Strip ═══ */}
            <div style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-bricolage)", fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 800, color: '#fff', marginBottom: '.3rem' }}>Ready to claim your spot?</h3>
                <p style={{ fontFamily: "var(--font-nunito)", fontSize: '.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>Founding members get lifetime listing — pay once, stay forever.</p>
              </div>
              <Link href={`/get-listed?category=${encodeURIComponent(c.name)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', padding: '.75rem 1.75rem', borderRadius: 999, background: '#fff', color, fontFamily: "var(--font-nunito)", fontSize: '.85rem', fontWeight: 800, textDecoration: 'none', transition: 'transform .3s cubic-bezier(.16,1,.3,1)', flexShrink: 0 }}>
                Get Listed Now
                <I d={icons.arrow} size={15} color={color} sw={2.5} />
              </Link>
            </div>
          </>
        )}

        {/* ═══ Listings (when they exist) ═══ */}
        {hasListings && (
          <div style={{ background: '#fff', border: '1.5px solid var(--h-border)', borderRadius: 20, padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: '.88rem', color: 'var(--h-body)' }}>
              {c.listingCount} {c.listingCount === 1 ? 'business' : 'businesses'} listed in {c.name}. Listing cards coming soon.
            </p>
          </div>
        )}

        {/* ═══ Related Categories ═══ */}
        {related.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '2rem', borderTop: '1.5px solid var(--h-border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontFamily: "var(--font-bricolage)", fontSize: '1.05rem', fontWeight: 800, color: 'var(--h-heading)' }}>
                Related in {c.parentName || 'this sector'}
              </h3>
              <Link href="/categories" style={{ fontFamily: "var(--font-nunito)", fontSize: '.72rem', fontWeight: 700, color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                View all <I d={icons.arrow} size={12} color={color} sw={2.5} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {related.map(rc => {
                const rcColor = rc.color || '#E8553D'
                return (
                  <Link key={rc.id} href={`/category/${rc.slug}`} className="category-card">
                    <div className="category-card-icon-wrap" style={{ background: `${rcColor}12`, color: rcColor }}>
                      <I d={icons[rc.icon as keyof typeof icons] || icons.grid} size={22} color={rcColor} />
                    </div>
                    <h3 className="category-card-name">{rc.name}</h3>
                    <p className="category-card-desc">{rc.description}</p>
                    <div className="category-card-meta">
                      <span className="category-card-count">
                        {rc.listingCount > 0 ? `${rc.listingCount} listings` : 'No listings yet'}
                      </span>
                      <span className="category-card-arrow">
                        <I d={icons.arrow} size={14} color="currentColor" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back link */}
        <Link href="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontFamily: "var(--font-nunito)", fontSize: '.75rem', fontWeight: 700, color, marginTop: '2rem', textDecoration: 'none' }}>
          <I d={icons.arrowLeft} size={14} color={color} sw={2} />
          Back to Categories
        </Link>
      </div>
    </section>
  )
}
