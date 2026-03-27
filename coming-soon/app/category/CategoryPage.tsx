'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fetchCategoryBySlug, fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { fetchCategoryListings } from '../iww-hq/data/submissions-storage'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'

/* ── SVG Icon helper ── */
const I = ({ d, size = 18, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)

const ic = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  chevron: 'M9 18l6-6-6-6',
  grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  building: 'M4 2h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z|M9 22v-4h6v4|M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01',
  plus: 'M12 5v14|M5 12h14',
  arrow: 'M5 12h14|M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5|M12 19l-7-7 7-7',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  trophy: 'M6 9H4.5a2.5 2.5 0 010-5H6|M18 9h1.5a2.5 2.5 0 000-5H18|M4 22h16|M10 22V8|M14 22V8|M8 2h8v7a4 4 0 01-8 0V2z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 3a4 4 0 100 8 4 4 0 000-8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  barChart: 'M12 20V10|M18 20V4|M6 20v-4',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6v6l4 2',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z|M7 7h.01',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z|M12 15l-3-3a22 22 0 015-10.06A22 22 0 0124 7a22 22 0 01-10.06 5z',
  award: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6a6 6 0 100 12 6 6 0 000-12z|M12 10a2 2 0 100 4 2 2 0 000-4z',
  sparkle: 'M12 3v2|M12 19v2|M5.64 5.64l1.41 1.41|M16.95 16.95l1.41 1.41|M3 12h2|M19 12h2|M5.64 18.36l1.41-1.41|M16.95 7.05l1.41-1.41',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  compare: 'M9 3H5a2 2 0 00-2 2v4|M9 3v18|M21 15v4a2 2 0 01-2 2h-4|M15 3h4a2 2 0 012 2v4|M15 21V3|M3 15v4a2 2 0 002 2h4',
  thumbsUp: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z|M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3',
  cloud: 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
  code: 'M16 18l6-6-6-6|M8 6l-6 6 6 6',
  cpu: 'M4 4h16v16H4z|M9 9h6v6H9z|M9 1v3|M15 1v3|M9 20v3|M15 20v3|M20 9h3|M20 14h3|M1 9h3|M1 14h3',
  pieChart: 'M21.21 15.89A10 10 0 118 2.83|M22 12A10 10 0 0012 2v10z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z|M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  trendingUp: 'M23 6l-9.5 9.5-5-5L1 18',
  monitor: 'M2 3h20v14H2z|M8 21h8|M12 17v4',
}

/* ── Star renderer ── */
const Stars = ({ filled, size = 12 }: { filled: number; size?: number }) => (
  <span style={{ display: 'inline-flex', gap: 1 }}>
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < filled ? '#E5A100' : '#E8E3DE'} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
    ))}
  </span>
)

/* ── Satisfaction ring ── */
const SatRing = ({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) => (
  <div className="cd-sat-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--h-border-light)" strokeWidth="2.8" />
      <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.8" strokeDasharray={`${pct} 100`} strokeDashoffset="25" strokeLinecap="round" />
    </svg>
    <span>{pct}</span>
  </div>
)

/* ── Sample listings for platform preview ── */
const sampleListings = [
  {
    name: 'CloudSync Pro', tagline: 'Enterprise cloud storage and real-time sync for distributed teams',
    logoIcon: 'cloud', logoColor: '#3B82F6', sat: 92, satColor: '#2FAE6A',
    award: 'Leader 2026', awardType: 'leader',
    score: '4.6', stars: 4, reviews: '234', rec: '92',
    bars: [{ l: 'Ease of Use', w: 88, c: '#2FAE6A' }, { l: 'Setup', w: 82, c: '#3B82F6' }, { l: 'Support', w: 90, c: '#E8553D' }],
    quote: '"Seamless sync across all devices. Team collaboration is a game-changer for remote work."',
    cat: 'Cloud Storage', verified: true, price: 'From $29/mo', votes: 247,
  },
  {
    name: 'NovaByte Analytics', tagline: 'AI-powered business intelligence and data visualization',
    logoIcon: 'pieChart', logoColor: '#8B5CF6', sat: 95, satColor: '#2FAE6A',
    award: 'Leader 2026', awardType: 'leader',
    score: '4.8', stars: 5, reviews: '189', rec: '95',
    bars: [{ l: 'Ease of Use', w: 91, c: '#2FAE6A' }, { l: 'Setup', w: 85, c: '#3B82F6' }, { l: 'Support', w: 93, c: '#E8553D' }],
    quote: '"AI insights saved our team 20+ hours a week. Dashboards are beautiful and intuitive."',
    cat: 'Data Analytics', verified: true, price: 'From $79/mo', votes: 312,
  },
  {
    name: 'CodeForge IDE', tagline: 'Cloud-based IDE with AI code completion and collaboration',
    logoIcon: 'code', logoColor: '#14B8A6', sat: 96, satColor: '#2FAE6A',
    award: 'Leader 2026', awardType: 'leader',
    score: '4.9', stars: 5, reviews: '421', rec: '96',
    bars: [{ l: 'Ease of Use', w: 94, c: '#2FAE6A' }, { l: 'Setup', w: 92, c: '#3B82F6' }, { l: 'Support', w: 95, c: '#E8553D' }],
    quote: '"Best IDE I\'ve ever used. AI copilot feels like pair-programming with a senior dev."',
    cat: 'DevOps', verified: true, price: 'Free tier', votes: 421,
  },
  {
    name: 'ShieldVault Security', tagline: 'Enterprise-grade cybersecurity with zero-trust architecture',
    logoIcon: 'shield', logoColor: '#2FAE6A', sat: 89, satColor: '#2FAE6A',
    award: 'High Performer', awardType: 'highperf',
    score: '4.5', stars: 4, reviews: '312', rec: '89',
    bars: [{ l: 'Ease of Use', w: 78, c: '#2FAE6A' }, { l: 'Setup', w: 72, c: '#3B82F6' }, { l: 'Support', w: 91, c: '#E8553D' }],
    quote: '"Best-in-class security posture. Zero-trust was seamless to deploy across our org."',
    cat: 'Cybersecurity', verified: true, price: 'Custom', votes: 189,
  },
]

/* ── Sidebar preview data ── */
const satOverview = [
  { label: 'Ease of Use', w: 87, color: '#2FAE6A' },
  { label: 'Ease of Setup', w: 83, color: '#3B82F6' },
  { label: 'Quality of Support', w: 89, color: '#E8553D' },
  { label: 'Meets Requirements', w: 91, color: '#8B5CF6' },
  { label: 'Product Direction', w: 85, color: '#14B8A6' },
]

const topRated = [
  { rank: 1, name: 'CodeForge IDE', score: '4.9' },
  { rank: 2, name: 'NovaByte Analytics', score: '4.8' },
  { rank: 3, name: 'FlowStack', score: '4.7' },
  { rank: 4, name: 'CloudSync Pro', score: '4.6' },
  { rank: 5, name: 'ShieldVault', score: '4.5' },
]

const gridDots = [
  { x: 78, y: 85, letter: 'C', title: 'CodeForge IDE' },
  { x: 72, y: 80, letter: 'N', title: 'NovaByte Analytics' },
  { x: 68, y: 72, letter: 'S', title: 'CloudSync Pro' },
  { x: 35, y: 78, letter: 'F', title: 'FlowStack' },
  { x: 30, y: 68, letter: 'V', title: 'ShieldVault' },
  { x: 60, y: 58, letter: 'P', title: 'PipelineHQ' },
  { x: 25, y: 52, letter: 'M', title: 'Metrik PM' },
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function CategoryPage({ slug: slugProp }: { slug?: string }) {
  const params = useSearchParams()
  const slug = slugProp || params.get('slug') || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(infowebworld\/)?category\//, '').replace(/\/$/, '') || null : null)

  const [category, setCategory] = useState<Category | null>(null)
  const [related, setRelated] = useState<Category[]>([])
  const [notFound, setNotFound] = useState(false)
  const [listings, setListings] = useState<RealSubmission[]>([])

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

  /* ── JSON-LD Structured Data (BreadcrumbList + FAQPage) ── */
  useEffect(() => {
    if (!category) return

    const breadcrumbItems: { '@type': string; position: number; name: string; item?: string }[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://infowebworld.com/categories' },
    ]
    let pos = 3
    if (category.parentName && category.parentSlug) {
      breadcrumbItems.push({ '@type': 'ListItem', position: pos++, name: category.parentName, item: `https://infowebworld.com/category/${category.parentSlug}` })
    }
    breadcrumbItems.push({ '@type': 'ListItem', position: pos, name: category.name })

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    }

    const catName = category.name
    const catDesc = category.seoDescription || category.description || `Explore top ${catName} businesses on InfoWebWorld.`
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is ${catName}?`,
          acceptedAnswer: { '@type': 'Answer', text: catDesc },
        },
        {
          '@type': 'Question',
          name: `How to find the best ${catName} companies?`,
          acceptedAnswer: { '@type': 'Answer', text: `Browse verified ${catName} companies on InfoWebWorld, compare services, read reviews, and connect directly.` },
        },
        {
          '@type': 'Question',
          name: `Is it free to list my ${catName} business?`,
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility.' },
        },
      ],
    }

    const scriptBreadcrumb = document.createElement('script')
    scriptBreadcrumb.type = 'application/ld+json'
    scriptBreadcrumb.id = 'schema-category-breadcrumb'
    scriptBreadcrumb.text = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(scriptBreadcrumb)

    const scriptFaq = document.createElement('script')
    scriptFaq.type = 'application/ld+json'
    scriptFaq.id = 'schema-category-faq'
    scriptFaq.text = JSON.stringify(faqSchema)
    document.head.appendChild(scriptFaq)

    return () => {
      document.getElementById('schema-category-breadcrumb')?.remove()
      document.getElementById('schema-category-faq')?.remove()
    }
  }, [category])

  /* ── Always fetch real listings (listingCount may be stale) ── */
  useEffect(() => {
    if (!category) return
    fetchCategoryListings(category.id).then(res => {
      setListings(res.data)
    })
  }, [category])

  /* ── Not Found ── */
  if (notFound) {
    return (
      <section className="category-detail">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#E8553D0A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <I d={ic.search} size={28} color="#E8553D" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '.5rem' }}>Category Not Found</h1>
          <p style={{ color: 'var(--h-body)', fontFamily: 'var(--font-nunito)', fontSize: '.88rem', maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>This category doesn&apos;t exist or hasn&apos;t been launched yet.</p>
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
  const hasListings = c.listingCount > 0 || listings.length > 0

  const benefits = [
    { icon: 'eye', title: 'Priority Visibility', desc: `Early listings in ${c.name} get premium placement and maximum exposure to buyers.` },
    { icon: 'link', title: 'Dofollow Backlink', desc: 'Get a permanent DA 72+ dofollow backlink to boost your search rankings.' },
    { icon: 'shield', title: 'Verified Badge', desc: 'Stand out with a verified business badge that builds instant trust with visitors.' },
    { icon: 'barChart', title: 'Analytics Dashboard', desc: 'Track views, clicks, and leads with your dedicated business analytics panel.' },
    { icon: 'users', title: 'Lead Generation', desc: 'Receive direct inquiries from businesses and professionals searching this category.' },
    { icon: 'globe', title: 'Global Reach', desc: 'Get discovered by professionals across 12+ countries searching for solutions.' },
  ]

  const features = [
    { icon: 'filter', title: 'Smart Filters', desc: 'Filter by subcategory, rating, pricing, company size, and deployment type to find exactly what you need.' },
    { icon: 'compare', title: 'Side-by-Side Comparison', desc: 'Compare up to 4 businesses side by side with detailed satisfaction metrics and feature breakdowns.' },
    { icon: 'thumbsUp', title: 'Verified Reviews', desc: 'Every review is verified by our team. No fake testimonials, no paid reviews — real user experiences only.' },
    { icon: 'target', title: 'Satisfaction Scores', desc: 'See real satisfaction data powered by verified reviews — ease of use, setup, support quality, and more.' },
    { icon: 'trendingUp', title: 'Grid Reports', desc: 'Quadrant analysis showing leaders, high performers, and contenders based on satisfaction and market presence.' },
    { icon: 'monitor', title: 'Analytics Dashboard', desc: 'Every listed business gets a real-time dashboard tracking views, clicks, leads, and conversion metrics.' },
  ]

  return (
    <section className="category-detail">
      <div className="container">

        {/* ═══════════════════════════════════════════════
            1. HERO CARD
            ═══════════════════════════════════════════════ */}
        <div className="cd-hero">
          {/* Gradient banner */}
          <div className="cd-hero-banner" style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}08 50%, var(--h-bg) 100%)` }}>
            {/* Dot pattern */}
            <div className="cd-hero-dots" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)` }} />
            {/* Floating shapes */}
            <div className="cd-hero-shape cd-hero-shape--1" style={{ background: color }} />
            <div className="cd-hero-shape cd-hero-shape--2" style={{ background: color }} />

            {/* Breadcrumb */}
            <nav className="cd-breadcrumb">
              <Link href="/" className="cd-breadcrumb-link"><I d={ic.home} size={11} sw={2} /> Home</Link>
              <span className="cd-breadcrumb-sep">/</span>
              <Link href="/categories" className="cd-breadcrumb-link">Categories</Link>
              {c.parentName && (
                <>
                  <span className="cd-breadcrumb-sep">/</span>
                  <span className="cd-breadcrumb-pill" style={{ color, background: `${color}10` }}>{c.parentName}</span>
                </>
              )}
              <span className="cd-breadcrumb-sep">/</span>
              <span className="cd-breadcrumb-current">{c.name}</span>
            </nav>

            {/* Floating icon */}
            <div className="cd-hero-icon" style={{ borderColor: `${color}15` }}>
              <I d={ic[c.icon as keyof typeof ic] || ic.grid} size={32} color={color} />
            </div>
          </div>

          {/* Content */}
          <div className="cd-hero-content">
            {/* Badges */}
            <div className="cd-hero-badges">
              {c.parentName && <span className="cd-badge" style={{ color, background: `${color}08` }}>{c.parentName}</span>}
              {c.level === 1 && <span className="cd-badge" style={{ color, background: `${color}08` }}>Sector</span>}
              {!hasListings && (
                <span className="cd-badge cd-badge--green">
                  <I d={ic.zap} size={10} color="#2FAE6A" sw={2} />
                  Accepting First Listings
                </span>
              )}
              <span className="cd-badge cd-badge--gold">
                <svg width={10} height={10} viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                Best of 2026
              </span>
            </div>

            <h1 className="cd-hero-title">{c.name}</h1>

            <p className="cd-hero-desc">
              {c.description || `Discover and compare the best ${c.name} businesses and software. Read verified reviews, compare features, and find the right solution for your needs.`}
            </p>

            {/* Stats row */}
            <div className="cd-hero-stats">
              {[
                { icon: 'building', label: hasListings ? `${c.listingCount} Listed` : 'No Listings Yet', color: color },
                { icon: 'layers', label: `${subcats.length} Subcategories`, color: '#8B5CF6' },
                { icon: 'target', label: `${totalSpots - c.listingCount} Spots Left`, color: '#2FAE6A' },
                { icon: 'zap', label: 'Early Access Open', color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="cd-stat">
                  <div className="cd-stat-icon" style={{ background: `${s.color}08` }}>
                    <I d={ic[s.icon as keyof typeof ic]} size={13} color={s.color} sw={1.8} />
                  </div>
                  <span className="cd-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            2. SUBCATEGORY CHIPS
            ═══════════════════════════════════════════════ */}
        {subcats.length > 0 && (
          <div className="cd-subcats-section">
            <h3 className="cd-section-label">Subcategories</h3>
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

        {/* ═══════════════════════════════════════════════
            3. PLATFORM PREVIEW
            ═══════════════════════════════════════════════ */}
        {!hasListings && (
          <>
            <div className="cd-preview">
              {/* Header */}
              <div className="cd-preview-header">
                <div className="cd-preview-badge">
                  <I d={ic.eye} size={12} color={color} sw={2} />
                  Platform Preview
                </div>
                <h2 className="cd-preview-title">What listings in <em style={{ fontStyle: 'normal', color }}>{c.name}</em> will look like</h2>
                <p className="cd-preview-subtitle">This is a preview of the full InfoWebWorld experience. Real listings with verified reviews, satisfaction scores, and comparison tools.</p>
              </div>

              {/* Toolbar preview */}
              <div className="cd-toolbar">
                <div className="cd-toolbar-left">
                  <span className="cd-toolbar-icon"><I d={ic.filter} size={13} color="var(--h-muted)" sw={2} /></span>
                  <span className="cd-toolbar-count">Showing <strong>1–12</strong> of <strong>284</strong> results</span>
                </div>
                <div className="cd-toolbar-right">
                  <div className="cd-toolbar-sort">
                    <span>Relevance</span>
                    <I d="M6 9l6 6 6-6" size={12} color="var(--h-muted)" sw={2} />
                  </div>
                  <div className="cd-toolbar-views">
                    <button className="cd-view-btn cd-view-btn--active"><I d={ic.grid} size={13} /></button>
                    <button className="cd-view-btn"><I d="M8 6h13|M8 12h13|M8 18h13|M3 6h.01|M3 12h.01|M3 18h.01" size={13} /></button>
                  </div>
                </div>
              </div>

              {/* Main layout: Listings + Sidebar */}
              <div className="cd-preview-layout">
                {/* Listing cards */}
                <div className="cd-preview-listings">
                  {sampleListings.map((item, idx) => (
                    <div key={idx} className="cd-card">
                      {/* Top: Logo + Name + Sat ring */}
                      <div className="cd-card-top">
                        <div className="cd-card-logo" style={{ background: `${item.logoColor}10` }}>
                          <I d={ic[item.logoIcon as keyof typeof ic]} size={22} color={item.logoColor} />
                        </div>
                        <div className="cd-card-info">
                          <div className="cd-card-name">{item.name}</div>
                          <div className="cd-card-tagline">{item.tagline}</div>
                        </div>
                        <SatRing pct={item.sat} color={item.satColor} size={46} />
                      </div>

                      {/* Award badge */}
                      {item.award && (
                        <div className={`cd-card-award cd-card-award--${item.awardType}`}>
                          {item.awardType === 'leader' ? (
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          ) : (
                            <I d={ic.zap} size={11} color="currentColor" sw={2} />
                          )}
                          {item.award}
                        </div>
                      )}

                      {/* Rating */}
                      <div className="cd-card-rating">
                        <Stars filled={item.stars} />
                        <span className="cd-card-score">{item.score}</span>
                        <span className="cd-card-reviews">({item.reviews})</span>
                        <span className="cd-card-rec">{item.rec}% recommend</span>
                      </div>

                      {/* Bars */}
                      <div className="cd-card-bars">
                        {item.bars.map(b => (
                          <div key={b.l} className="cd-bar">
                            <span className="cd-bar-label">{b.l}</span>
                            <div className="cd-bar-track">
                              <div className="cd-bar-fill" style={{ width: `${b.w}%`, background: b.c }} />
                            </div>
                            <span className="cd-bar-val">{(b.w / 10).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="cd-card-quote">{item.quote}</div>

                      {/* Meta badges */}
                      <div className="cd-card-meta">
                        <span className="cd-meta-badge cd-meta-badge--cat">{item.cat}</span>
                        {item.verified && (
                          <span className="cd-meta-badge cd-meta-badge--verified">
                            <I d={ic.check} size={10} color="#2FAE6A" sw={2.5} />
                            Verified
                          </span>
                        )}
                        <span className="cd-meta-badge cd-meta-badge--price">{item.price}</span>
                      </div>

                      {/* Actions */}
                      <div className="cd-card-actions">
                        <span className="cd-card-vote">
                          <I d="M12 19V5|M5 12l7-7 7 7" size={13} color="currentColor" sw={2} />
                          <span>{item.votes}</span>
                        </span>
                        <span className="cd-card-cmp">
                          <I d={ic.compare} size={12} color="currentColor" sw={1.5} />
                          Compare
                        </span>
                        <span className="cd-card-details-btn">View Details</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="cd-preview-sidebar">
                  {/* Grid Report */}
                  <div className="cd-side-card">
                    <div className="cd-side-title">
                      <I d={ic.grid} size={14} color={color} sw={2} />
                      Grid Report — {c.name}
                    </div>
                    <div className="cd-grid-report">
                      <div className="cd-grid-axis-y"><span>Satisfaction</span></div>
                      <div className="cd-grid-chart">
                        <div className="cd-grid-q cd-grid-q--tl"><span>High Performers</span></div>
                        <div className="cd-grid-q cd-grid-q--tr"><span>Leaders</span></div>
                        <div className="cd-grid-q cd-grid-q--bl"><span>Niche</span></div>
                        <div className="cd-grid-q cd-grid-q--br"><span>Contenders</span></div>
                        {gridDots.map(d => (
                          <div key={d.letter} className="cd-grid-dot" style={{ left: `${d.x}%`, bottom: `${d.y}%` }} title={d.title}>{d.letter}</div>
                        ))}
                      </div>
                      <div className="cd-grid-axis-x"><span>Market Presence</span></div>
                    </div>
                  </div>

                  {/* Satisfaction Overview */}
                  <div className="cd-side-card">
                    <div className="cd-side-title">
                      <I d={ic.thumbsUp} size={14} color={color} sw={2} />
                      Satisfaction Overview
                    </div>
                    <div className="cd-sat-overview">
                      {satOverview.map(s => (
                        <div key={s.label} className="cd-sat-row">
                          <span className="cd-sat-label">{s.label}</span>
                          <div className="cd-sat-track">
                            <div className="cd-sat-fill" style={{ width: `${s.w}%`, background: s.color }} />
                          </div>
                          <span className="cd-sat-val">{(s.w / 10).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Rated */}
                  <div className="cd-side-card">
                    <div className="cd-side-title">
                      <I d={ic.trophy} size={14} color={color} sw={2} />
                      Top Rated
                    </div>
                    <div className="cd-top-list">
                      {topRated.map(t => (
                        <div key={t.rank} className="cd-top-item">
                          <span className={`cd-top-rank cd-top-rank--${t.rank <= 3 ? t.rank : 'n'}`}>{t.rank}</span>
                          <span className="cd-top-name">{t.name}</span>
                          <span className="cd-top-score">
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            {t.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA sidebar */}
                  <div className="cd-side-cta" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
                    <div className="cd-side-cta-title">List Your Business</div>
                    <div className="cd-side-cta-desc">Join the founding members of InfoWebWorld. Get premium placement, verified badge, and lifetime visibility.</div>
                    <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-side-cta-btn">
                      Get Listed
                      <I d={ic.arrow} size={14} color={color} sw={2.5} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fade overlay with CTA */}
              <div className="cd-preview-fade">
                <div className="cd-preview-fade-inner">
                  <p className="cd-preview-fade-text">This is a preview of what <strong>{c.name}</strong> will look like on InfoWebWorld</p>
                  <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-preview-fade-btn" style={{ background: color, borderColor: color, boxShadow: `0 6px 24px ${color}30` }}>
                    <I d={ic.plus} size={15} color="#fff" sw={2.5} />
                    Be the First to List Here
                  </Link>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                4. FOUNDING MEMBER CTA
                ═══════════════════════════════════════════════ */}
            <div className="cd-cta-card">
              <div className="cd-cta-bg" style={{ background: `radial-gradient(circle at 20% 30%, ${color}12, transparent 50%), radial-gradient(circle at 80% 70%, ${color}08, transparent 50%)` }} />
              <div className="cd-cta-inner">
                <div className="cd-cta-icon" style={{ background: `${color}08`, borderColor: `${color}12` }}>
                  <I d={ic.rocket} size={36} color={color} />
                </div>
                <h2 className="cd-cta-title">Be the First in {c.name}</h2>
                <p className="cd-cta-desc">No businesses have claimed a listing in {c.name} yet. Be the founding member — get priority placement, a verified badge, and lifetime visibility.</p>
                <div className="cd-cta-buttons">
                  <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-btn-primary" style={{ background: color, borderColor: color, boxShadow: `0 6px 24px ${color}30` }}>
                    <I d={ic.plus} size={16} color="#fff" sw={2.5} />
                    Get Listed — $239 Lifetime
                  </Link>
                  <Link href="/categories" className="cd-btn-secondary">
                    <I d={ic.grid} size={16} color="var(--h-muted)" sw={2} />
                    Browse Categories
                  </Link>
                </div>
                <div className="cd-cta-progress">
                  <div className="cd-cta-progress-row">
                    <span>{c.listingCount} of {totalSpots} founding spots claimed</span>
                    <span style={{ color, fontWeight: 800 }}>{totalSpots - c.listingCount} left</span>
                  </div>
                  <div className="cd-cta-progress-track">
                    <div className="cd-cta-progress-fill" style={{ width: `${Math.max((c.listingCount / totalSpots) * 100, 1)}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                5. FEATURES SHOWCASE
                ═══════════════════════════════════════════════ */}
            <div className="cd-features-section">
              <div className="cd-section-center">
                <span className="cd-section-tag" style={{ color, background: `${color}08` }}>What Makes Us Different</span>
                <h3 className="cd-section-heading">Powerful tools for every listed business</h3>
              </div>
              <div className="cd-features-grid">
                {features.map((f, i) => (
                  <div key={i} className="cd-feature-card">
                    <div className="cd-feature-icon" style={{ background: `${color}08` }}>
                      <I d={ic[f.icon as keyof typeof ic]} size={20} color={color} />
                    </div>
                    <h4 className="cd-feature-title">{f.title}</h4>
                    <p className="cd-feature-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                6. BENEFITS GRID
                ═══════════════════════════════════════════════ */}
            <div className="cd-benefits-section">
              <div className="cd-section-center">
                <span className="cd-section-tag" style={{ color, background: `${color}08` }}>Why List in {c.name}</span>
                <h3 className="cd-section-heading">Everything you get as a founding member</h3>
              </div>
              <div className="cd-benefits-grid">
                {benefits.map((b, i) => (
                  <div key={i} className="cd-benefit-card">
                    <div className="cd-benefit-icon" style={{ background: `${color}08` }}>
                      <I d={ic[b.icon as keyof typeof ic]} size={20} color={color} />
                    </div>
                    <h4 className="cd-benefit-title">{b.title}</h4>
                    <p className="cd-benefit-desc">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                7. HOW IT WORKS
                ═══════════════════════════════════════════════ */}
            <div className="cd-steps-card">
              <div className="cd-section-center">
                <h3 className="cd-section-heading">Get listed in 3 simple steps</h3>
              </div>
              <div className="cd-steps-grid">
                {[
                  { step: 1, title: 'Submit Your Business', desc: 'Fill out a quick form with your company details, tagline, and category.', icon: 'tag' },
                  { step: 2, title: 'Get Verified', desc: 'Our team reviews and verifies your listing within 24 hours.', icon: 'shield' },
                  { step: 3, title: 'Go Live', desc: 'Your verified listing goes live with a dofollow backlink and analytics dashboard.', icon: 'zap' },
                ].map(s => (
                  <div key={s.step} className="cd-step">
                    <div className="cd-step-icon" style={{ background: `${color}08`, borderColor: `${color}15` }}>
                      <I d={ic[s.icon as keyof typeof ic]} size={22} color={color} />
                      <span className="cd-step-num" style={{ background: color }}>{s.step}</span>
                    </div>
                    <h4 className="cd-step-title">{s.title}</h4>
                    <p className="cd-step-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                8. FINAL CTA STRIP
                ═══════════════════════════════════════════════ */}
            <div className="cd-final-cta" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
              <div>
                <h3 className="cd-final-cta-title">Ready to claim your spot?</h3>
                <p className="cd-final-cta-desc">Founding members get lifetime listing — pay once, stay forever.</p>
              </div>
              <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-final-cta-btn">
                Get Listed Now
                <I d={ic.arrow} size={15} color={color} sw={2.5} />
              </Link>
            </div>
          </>
        )}

        {/* ═══ Listings (when they exist) ═══ */}
        {hasListings && (
          <>
            {/* Toolbar */}
            <div className="cd-toolbar" style={{ marginTop: '1.5rem' }}>
              <div className="cd-toolbar-left">
                <span className="cd-toolbar-icon"><I d={ic.building} size={13} color={color} sw={2} /></span>
                <span className="cd-toolbar-count">Showing <strong>{listings.length}</strong> of <strong>{c.listingCount}</strong> {c.listingCount === 1 ? 'business' : 'businesses'}</span>
              </div>
            </div>

            {/* Listing cards grid */}
            <div className="cd-preview-listings" style={{ marginBottom: '1.5rem' }}>
              {listings.map(item => {
                const initial = item.companyName.charAt(0).toUpperCase()
                const itemColor = item.categoryColor || color
                return (
                  <div key={item.id} className="cd-card">
                    {/* Top: Logo + Name */}
                    <div className="cd-card-top">
                      {item.logoUrl ? (
                        <div className="cd-card-logo" style={{ padding: 0, overflow: 'hidden' }}>
                          <img src={item.logoUrl} alt={item.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                        </div>
                      ) : (
                        <div className="cd-card-logo" style={{ background: `${itemColor}14` }}>
                          <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '1.2rem', color: itemColor }}>{initial}</span>
                        </div>
                      )}
                      <div className="cd-card-info">
                        <div className="cd-card-name">{item.companyName}</div>
                        <div className="cd-card-tagline">{item.tagline}</div>
                      </div>
                    </div>

                    {/* Meta badges */}
                    <div className="cd-card-meta">
                      <span className="cd-meta-badge cd-meta-badge--cat">{item.category}</span>
                      {item.status === 'active' && (
                        <span className="cd-meta-badge cd-meta-badge--verified">
                          <I d={ic.check} size={10} color="#2FAE6A" sw={2.5} />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Features list */}
                    {item.features.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginBottom: '.75rem' }}>
                        {item.features.slice(0, 3).map((feat, fi) => (
                          <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', fontFamily: 'var(--font-nunito)', fontSize: '.78rem', color: 'var(--h-body)' }}>
                            <I d={ic.check} size={11} color="#2FAE6A" sw={2.5} />
                            {feat}
                          </div>
                        ))}
                        {item.features.length > 3 && (
                          <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', color: 'var(--h-muted)', marginLeft: '1.3rem' }}>+{item.features.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="cd-card-actions">
                      {item.website && (
                        <a href={item.website} target="_blank" rel="noopener noreferrer" className="cd-card-cmp" style={{ textDecoration: 'none' }}>
                          <I d={ic.globe} size={12} color="currentColor" sw={1.5} />
                          Website
                        </a>
                      )}
                      <Link href={`/company/${item.slug}`} className="cd-card-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA to get listed */}
            <div className="cd-final-cta" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
              <div>
                <h3 className="cd-final-cta-title">Join {c.listingCount} {c.listingCount === 1 ? 'business' : 'businesses'} in {c.name}</h3>
                <p className="cd-final-cta-desc">{totalSpots - c.listingCount} founding spots remaining. Get lifetime listing today.</p>
              </div>
              <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-final-cta-btn">
                Get Listed Now
                <I d={ic.arrow} size={15} color={color} sw={2.5} />
              </Link>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════
            9. RELATED CATEGORIES
            ═══════════════════════════════════════════════ */}
        {related.length > 0 && (
          <div className="cd-related">
            <div className="cd-related-header">
              <h3 className="cd-related-title">Related in {c.parentName || 'this sector'}</h3>
              <Link href="/categories" className="cd-related-link" style={{ color }}>
                View all <I d={ic.arrow} size={12} color={color} sw={2.5} />
              </Link>
            </div>
            <div className="cd-related-grid">
              {related.map(rc => {
                const rcColor = rc.color || '#E8553D'
                return (
                  <Link key={rc.id} href={`/category/${rc.slug}`} className="category-card">
                    <div className="category-card-icon-wrap" style={{ background: `${rcColor}12`, color: rcColor }}>
                      <I d={ic[rc.icon as keyof typeof ic] || ic.grid} size={22} color={rcColor} />
                    </div>
                    <h3 className="category-card-name">{rc.name}</h3>
                    <p className="category-card-desc">{rc.description}</p>
                    <div className="category-card-meta">
                      <span className="category-card-count">{rc.listingCount > 0 ? `${rc.listingCount} listings` : 'No listings yet'}</span>
                      <span className="category-card-arrow"><I d={ic.arrow} size={14} /></span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <Link href="/categories" className="cd-back-link" style={{ color }}>
          <I d={ic.arrowLeft} size={14} color={color} sw={2} />
          Back to Categories
        </Link>
      </div>
    </section>
  )
}
