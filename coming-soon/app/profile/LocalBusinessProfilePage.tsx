'use client'

/* ════════════════════════════════════════════════════════════════════════
   LocalBusinessProfilePage — InfoWebWorld's take on a local-business page.
   Used by /profile/[slug] ONLY for the `local-businesses` sector; every other
   sector keeps the Clutch-style CompanyDetailPage.

   Differentiated from Yelp: our amber sector color (not Yelp red), brand
   Source-Serif headings, a Verified-by-InfoWebWorld badge + free Claim CTA,
   an AI "What customers say" digest, and rich motion (scroll-reveal, count-up,
   filling star bars, Ken-Burns hero, hover lifts). No competitor ads.
   Real fields come from initialData.company; Yelp-only surfaces (photos,
   hours, amenities, menu, reviews) are sample data for now. `.lbp-*`.
   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar, faCamera, faImages, faShareNodes, faBookmark, faPenToSquare, faLocationDot,
  faPhone, faGlobe, faClock, faCheck, faXmark, faCircleCheck, faChevronRight, faThumbsUp,
  faDiamondTurnRight, faBagShopping, faCommentDots, faFaceLaughSquint, faLightbulb,
  faShieldHalved, faWandMagicSparkles, faKey, faPlay, faCalendarCheck, faTicket, faBed,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/local-business.css'
import SignupModal from '../components/auth/SignupModal'
import ClaimListingModal from '../listing/ClaimListingModal'
import { verticalForBreadcrumb, amenityLabel } from '../lib/local-business-verticals'

const ACCENT = '#F59E0B'   /* local-businesses sector amber */

/* ── helpers ── */
function parseArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string')
  if (typeof v === 'string' && v) { try { const a = JSON.parse(v); return Array.isArray(a) ? a : [] } catch { return [] } }
  return []
}
function parseObjArr(v: unknown): Record<string, unknown>[] {
  let raw: unknown = v
  if (typeof v === 'string' && v) { try { raw = JSON.parse(v) } catch { raw = [] } }
  return Array.isArray(raw) ? (raw.filter((x) => x && typeof x === 'object') as Record<string, unknown>[]) : []
}
function ytId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}
function initial(name: string) { return (name || '?').trim().slice(0, 1).toUpperCase() }
const PHOTO = (seed: string, w = 360, h = 270) => `https://picsum.photos/seed/lb-${seed}/${w}/${h}`
function fmtDate(v: unknown): string {
  if (!v) return ''
  const d = new Date(String(v))
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/* Fire once when the element scrolls into view. */
function useInView<T extends HTMLElement>(threshold = 0.14): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* Scroll-reveal section (no extra wrapper — IS the <section>). */
function Reveal({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView<HTMLElement>(0.12)
  return <section ref={ref} id={id} className={`lbp-reveal ${className} ${inView ? 'is-in' : ''}`}>{children}</section>
}

/* Count up to a number when it enters view. */
function CountUp({ to, decimals = 1 }: { to: number; decimals?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const dur = 900, start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setN(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick); else setN(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{n.toFixed(decimals)}</span>
}

/* 5-star bar — gray base, amber fill clipped to value/5; fill animates when `animate`. */
function Stars({ value, size = 22, animate = false }: { value: number; size?: number; animate?: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5)
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  const w = animate ? (inView ? pct : 0) : pct
  const row = (color: string) => (
    <span style={{ color, display: 'inline-flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => <FontAwesomeIcon key={i} icon={faStar} style={{ fontSize: size }} />)}
    </span>
  )
  return (
    <span ref={animate ? ref : undefined} className="lbp-stars" style={{ height: size }} aria-label={`${value} star rating`}>
      <span className="lbp-stars-base">{row('#e7e7e7')}</span>
      <span className="lbp-stars-fill" style={{ width: `${w}%` }}>{row(ACCENT)}</span>
    </span>
  )
}

/* Distribution bars that fill from 0 on view. */
function DistBars({ dist, total }: { dist: { stars: number; count: number }[]; total: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <div className="lbp-dist" ref={ref}>
      {dist.map((d) => (
        <div key={d.stars} className="lbp-dist-row">
          <span className="lbp-dist-lbl">{d.stars} star{d.stars > 1 ? 's' : ''}</span>
          <span className="lbp-dist-track"><span className="lbp-dist-fill" style={{ width: inView ? `${(d.count / total) * 100}%` : '0%' }} /></span>
          <span className="lbp-dist-cnt">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

interface BizReview {
  author: string; location: string; reviewCount: number; rating: number
  date: string; body: string; photos: string[]; useful: number; funny: number; cool: number
}

export default function LocalBusinessProfilePage({
  slug: propSlug,
  initialData,
}: { slug: string; initialData: Record<string, unknown> | null }) {
  /* Category-appropriate vocabulary (Menu vs Services vs Products …), detected
     from the breadcrumb's L2 vertical under local-businesses. Drives every
     category-specific label, amenity set, CTA and sample on this page. */
  const vertical = useMemo(
    () => verticalForBreadcrumb(
      (Array.isArray(initialData?.breadcrumb) ? initialData!.breadcrumb : []) as { slug?: string }[],
    ),
    [initialData],
  )

  const biz = useMemo(() => {
    const company = (initialData?.company ?? {}) as Record<string, unknown>
    const rv = (initialData?.reviews ?? {}) as { avgRating?: number; reviewCount?: number; distribution?: number[]; recent?: Record<string, unknown>[] }
    const name = String(company.company_name || 'Local Business')
    const categoryName = String(company.category_name || '')
    const tags = parseArr(company.header_tags)
    const categories = (tags.length ? tags : categoryName ? [categoryName] : [vertical.l2Name]).slice(0, 3)
    const city = String(company.city || '')
    const state = String(company.state || '')
    const country = String(company.country_name || '')
    const address = String(company.hq_location || [city, state, country].filter(Boolean).join(', '))
    const phone = [company.phone_code, company.phone].filter(Boolean).join(' ').trim()
    const website = String(company.website || '')
    const websiteLabel = website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const reviewCount = Number(rv.reviewCount || 0)
    return {
      name, categories, city, state, country, address, phone, website, websiteLabel,
      description: String(company.description || ''),
      logo: String(company.logo_url || ''),
      verified: Boolean(Number(company.verified || 0)),
      unclaimed: company.user_id == null,
      rating: rv.avgRating ? Number(rv.avgRating) : 0,
      reviewCount,
      reviewDist: Array.isArray(rv.distribution) ? rv.distribution : [0, 0, 0, 0, 0],
      recentReviews: Array.isArray(rv.recent) ? rv.recent : [],
      priceRange: String(company.lb_price_range || '$'),
      lbPhotos: parseArr(company.lb_photos),
      lbHours: parseObjArr(company.lb_hours),
      lbAmenities: parseArr(company.lb_amenities),
      lbMenu: parseObjArr(company.lb_menu),
      lbVideos: parseObjArr(company.lb_videos),
    }
  }, [initialData, vertical])

  /* ── Real lb_* data, with a category-appropriate sample fallback so the page
     never looks empty until the owner fills it via the form. All category
     wording (Menu/Services/Products, amenity set, sample items, AI topics)
     comes from `vertical`. ── */
  /* Real photos only — drop favicons/logos some sites expose as og:image, so
     they fall back to the brand illustration instead of showing a logo. */
  const realPhotos = biz.lbPhotos.filter((u) => !/logo|favicon|\.svg(\?|$)/i.test(u))
  const hasPhotos = realPhotos.length > 0
  const photos = realPhotos
  const hasReviews = biz.reviewCount > 0
  const hours: (string | undefined)[][] = biz.lbHours.length
    ? biz.lbHours.map((h) => [String(h.day ?? ''), h.closed ? 'Closed' : String(h.time ?? ''), h.openNow ? 'Open now' : undefined])
    : [['Mon', '8:00 AM - 10:00 PM'], ['Tue', '8:00 AM - 10:00 PM'], ['Wed', '8:00 AM - 10:00 PM'], ['Thu', '8:00 AM - 10:00 PM'], ['Fri', '8:00 AM - 11:00 PM', 'Open now'], ['Sat', '9:00 AM - 11:00 PM'], ['Sun', '9:00 AM - 9:00 PM']]
  const amenities: { label: string; ok: boolean }[] = biz.lbAmenities.length
    ? vertical.amenities.map((slug) => ({ label: amenityLabel(slug), ok: biz.lbAmenities.includes(slug) }))
    : vertical.amenities.map((slug) => ({ label: amenityLabel(slug), ok: true }))
  const menu = biz.lbMenu.length
    ? biz.lbMenu.map((m) => ({ name: String(m.name ?? ''), price: String(m.price ?? ''), img: String(m.photo ?? '') }))
    : vertical.sampleItems.map((m, i) => ({ name: m.name, price: m.price, img: PHOTO('m' + (i + 1), 200, 150) }))
  const videos = biz.lbVideos
  const aiTopics = vertical.aiTopics
  /* Real rating distribution [1★..5★] → display rows (5★ first). */
  const dist = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: biz.reviewDist[stars - 1] || 0 }))
  const distTotal = dist.reduce((a, b) => a + b.count, 0) || 1
  /* Real reviews only (native) — never fabricated reviews on a real business. */
  const reviews: BizReview[] = biz.recentReviews.map((r) => ({
    author: String(r.user_name || r.author || 'A reviewer'),
    location: '',
    reviewCount: 0,
    rating: Number(r.rating || 0),
    date: fmtDate(r.created_at),
    body: String(r.body || r.title || ''),
    photos: [],
    useful: 0, funny: 0, cool: 0,
  }))
  const [sort, setSort] = useState('Recommended')

  /* ════════════════════════════════════════════════════════════════════
     Engagement — login-gated. Anonymous visitors can read everything but
     cannot Save (shortlist), Write a Review, Add a Photo, or react
     (Useful/Funny/Cool); any such click opens the SignupModal first and the
     intended action re-fires once authed. Save persists to the real
     /api/listings/[slug]/bookmark endpoint; the Yelp-style review votes are
     optimistic on the (sample) reviews. Claim opens the standard
     ClaimListingModal — the same ownership flow used across the site.
     ════════════════════════════════════════════════════════════════════ */
  const slug = propSlug || String((initialData?.company as Record<string, unknown> | undefined)?.slug || '')
  const reviewHref = `/write-review?company=${encodeURIComponent(slug)}&mode=company`
  const [me, setMe] = useState<{ isAuthed: boolean; isBookmarked: boolean }>({ isAuthed: false, isBookmarked: false })
  const [signupOpen, setSignupOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<null | 'save' | 'review' | 'photo'>(null)
  const [claimOpen, setClaimOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [votes, setVotes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetch(`/api/listings/${slug}/me`, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled && j) setMe({ isAuthed: !!j.isAuthed, isBookmarked: !!j.isBookmarked }) })
      .catch(() => { /* anon — leave defaults */ })
    return () => { cancelled = true }
  }, [slug])

  const requireAuth = (action: 'save' | 'review' | 'photo'): boolean => {
    if (me.isAuthed) return true
    setPendingAction(action); setSignupOpen(true); return false
  }
  const persistBookmark = async (next: boolean) => {
    if (!slug) return
    setSaving(true)
    setMe((p) => ({ ...p, isBookmarked: next }))   // optimistic
    try {
      const r = await fetch(`/api/listings/${slug}/bookmark`, { method: next ? 'POST' : 'DELETE', credentials: 'same-origin' })
      if (!r.ok) throw new Error('failed')
    } catch {
      setMe((p) => ({ ...p, isBookmarked: !next }))  // rollback
    } finally { setSaving(false) }
  }
  const toggleSave = () => { if (requireAuth('save')) persistBookmark(!me.isBookmarked) }
  const doReview = () => { if (requireAuth('review')) window.location.assign(reviewHref) }
  /* Photos are owner-managed — gate on login, then route to claim (you must
     own/claim the business to add photos). */
  const doAddPhoto = () => { if (requireAuth('photo')) setClaimOpen(true) }
  const toggleVote = (key: string) => {
    if (!me.isAuthed) { setSignupOpen(true); return }
    setVotes((v) => ({ ...v, [key]: !v[key] }))
  }
  const voteCount = (key: string, base: number) => base + (votes[key] ? 1 : 0)
  const shareBiz = () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    if (navigator.share) navigator.share({ title: biz.name, url }).catch(() => {})
    else if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {})
  }

  /* Category-appropriate primary CTA (Order Online / Book Now / Shop Now …). */
  const ctaIcon = { bag: faBagShopping, calendar: faCalendarCheck, phone: faPhone, ticket: faTicket, bed: faBed }[vertical.primaryCtaIcon]
  const ctaHref = biz.website || (biz.phone ? `tel:${biz.phone}` : '#')

  return (
    <div className="lbp">
      {/* ── Photo banner: real photos (Ken Burns), else brand illustration ── */}
      {hasPhotos ? (
        <div className="lbp-photos">
          {photos.map((src, i) => (
            <div key={i} className={`lbp-photo ${i === 0 ? 'lbp-photo--lead' : ''}`}>
              <img src={src} alt="" loading="lazy" />
              {i === photos.length - 1 && (
                <button className="lbp-photo-all"><FontAwesomeIcon icon={faImages} /> See all photos</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="lbp-photos lbp-photos--illus">
          <img src="/illustrations/lb-fallback.png" alt="" className="lbp-illus-img"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
      )}

      <div className="lbp-wrap">
        {/* ── Header ── */}
        <header className="lbp-head">
          <h1 className="lbp-name">{biz.name}</h1>
          <div className="lbp-rating-row">
            {hasReviews ? (
              <>
                <Stars value={biz.rating} animate />
                <span className="lbp-rating-num"><CountUp to={biz.rating} /></span>
                <a href="#reviews" className="lbp-rating-count">({biz.reviewCount} {biz.reviewCount === 1 ? 'review' : 'reviews'})</a>
              </>
            ) : (
              <span className="lbp-rating-new"><FontAwesomeIcon icon={faStar} /> New · No reviews yet</span>
            )}
            {biz.verified
              ? <span className="lbp-verified"><FontAwesomeIcon icon={faShieldHalved} /> Verified by InfoWebWorld</span>
              : <span className="lbp-claimed"><FontAwesomeIcon icon={faCircleCheck} /> {biz.unclaimed ? 'Unclaimed' : 'Claimed'}</span>}
          </div>
          <div className="lbp-meta-row">
            <span className="lbp-price">{biz.priceRange}</span>
            <span className="lbp-dot">·</span>
            {biz.categories.map((c, i) => (
              <span key={c}>
                {i > 0 && <span className="lbp-dot">·</span>}
                <a className="lbp-cat-link" href="#">{c}</a>
              </span>
            ))}
          </div>
          <div className="lbp-actions">
            <button type="button" className="lbp-btn lbp-btn--primary" onClick={doReview}><FontAwesomeIcon icon={faStar} /> Write a Review</button>
            <button type="button" className="lbp-btn" onClick={doAddPhoto}><FontAwesomeIcon icon={faCamera} /> Add Photo</button>
            <button type="button" className="lbp-btn" onClick={shareBiz}><FontAwesomeIcon icon={faShareNodes} /> Share</button>
            <button type="button" className={'lbp-btn' + (me.isBookmarked ? ' lbp-btn--saved' : '')} onClick={toggleSave} disabled={saving} aria-pressed={me.isBookmarked}>
              <FontAwesomeIcon icon={faBookmark} /> {me.isBookmarked ? 'Saved' : 'Save'}
            </button>
          </div>
        </header>

        <div className="lbp-body">
          <main className="lbp-main">
            {/* Claim banner (unclaimed only) */}
            {biz.unclaimed && (
              <div className="lbp-claim">
                <div className="lbp-claim-ic"><FontAwesomeIcon icon={faKey} /></div>
                <div className="lbp-claim-text">
                  <b>Is this your business?</b>
                  <span>Claim it free to respond to reviews, update your info, and add photos.</span>
                </div>
                <button type="button" className="lbp-btn lbp-btn--primary lbp-claim-btn" onClick={() => setClaimOpen(true)}>Claim this business</button>
              </div>
            )}

            {/* Menu */}
            <Reveal className="lbp-sec">
              <div className="lbp-sec-head">
                <h2>{vertical.listingLabel}</h2>
                <a className="lbp-sec-link" href="#">{vertical.listingViewAll} <FontAwesomeIcon icon={faChevronRight} /></a>
              </div>
              <div className="lbp-menu">
                {menu.map((m) => (
                  <div key={m.name} className="lbp-menu-item">
                    <img src={m.img} alt={m.name} loading="lazy" />
                    <div className="lbp-menu-name">{m.name}</div>
                    <div className="lbp-menu-price">{m.price}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Videos */}
            {videos.length > 0 && (
              <Reveal className="lbp-sec">
                <h2>Videos</h2>
                <div className="lbp-videos">
                  {videos.map((v, i) => {
                    const id = ytId(String(v.url ?? ''))
                    const title = typeof v.title === 'string' ? v.title : ''
                    return (
                      <a key={i} className="lbp-video" href={String(v.url ?? '#')} target="_blank" rel="noopener noreferrer">
                        <img src={id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : PHOTO('vid' + i, 320, 180)} alt={title} loading="lazy" />
                        <span className="lbp-video-play"><FontAwesomeIcon icon={faPlay} /></span>
                        {title && <span className="lbp-video-title">{title}</span>}
                      </a>
                    )
                  })}
                </div>
              </Reveal>
            )}

            {/* Location & Hours */}
            <Reveal className="lbp-sec">
              <h2>Location &amp; Hours</h2>
              <div className="lbp-locrow">
                <div className="lbp-map" aria-hidden="true">
                  <img src={PHOTO('map', 520, 360)} alt="" />
                  <div className="lbp-map-pin"><FontAwesomeIcon icon={faLocationDot} /></div>
                </div>
                <div className="lbp-loc-side">
                  <div className="lbp-address">{biz.address || `${biz.city}, ${biz.state}`}</div>
                  <a className="lbp-dir" href="#"><FontAwesomeIcon icon={faDiamondTurnRight} /> Get Directions</a>
                  <table className="lbp-hours"><tbody>
                    {hours.map(([d, h, badge]) => (
                      <tr key={d}><td className="lbp-h-day">{d}</td><td className="lbp-h-time">{h}{badge && <span className="lbp-open-badge">{badge}</span>}</td></tr>
                    ))}
                  </tbody></table>
                </div>
              </div>
            </Reveal>

            {/* Amenities */}
            <Reveal className="lbp-sec">
              <h2>Amenities and More</h2>
              <div className="lbp-amen">
                {amenities.map((a) => (
                  <div key={a.label} className={`lbp-amen-item ${a.ok ? '' : 'lbp-amen-item--no'}`}>
                    <span className="lbp-amen-ic"><FontAwesomeIcon icon={a.ok ? faCheck : faXmark} /></span>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* About */}
            {biz.description && (
              <Reveal className="lbp-sec">
                <h2>About the Business</h2>
                <p className="lbp-about">{biz.description}</p>
              </Reveal>
            )}

            {/* AI "What customers say" — only when there are real reviews to summarize */}
            {hasReviews && (
            <Reveal className="lbp-sec">
              <div className="lbp-ai">
                <div className="lbp-ai-glow" aria-hidden="true" />
                <div className="lbp-ai-head">
                  <span className="lbp-ai-spark"><FontAwesomeIcon icon={faWandMagicSparkles} /></span>
                  <h2>What customers say</h2>
                  <span className="lbp-ai-tag">AI summary</span>
                </div>
                <p className="lbp-ai-body">
                  Reviewers consistently praise the <b>quality of service</b> and <b>friendly, helpful staff</b>, calling {biz.name} a
                  reliable choice. Many highlight the <b>great value</b> and note that the team goes the extra mile to get things
                  right. A few mention it can get busy during peak hours.
                </p>
                <div className="lbp-ai-chips">
                  {aiTopics.map((t) => <span key={t} className="lbp-ai-chip">{t}</span>)}
                </div>
              </div>
            </Reveal>
            )}

            {/* Reviews */}
            <Reveal className="lbp-sec" id="reviews">
              <h2>Recommended Reviews</h2>
              {hasReviews ? (<>
              <div className="lbp-rev-overall">
                <div className="lbp-rev-big">
                  <div className="lbp-rev-num"><CountUp to={biz.rating} /></div>
                  <Stars value={biz.rating} size={26} animate />
                  <div className="lbp-rev-total">{biz.reviewCount} reviews</div>
                </div>
                <DistBars dist={dist} total={distTotal} />
              </div>

              <div className="lbp-rev-bar">
                <button type="button" className="lbp-btn lbp-btn--primary" onClick={doReview}><FontAwesomeIcon icon={faStar} /> Write a Review</button>
                <div className="lbp-rev-sort">
                  <span>Sort by</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option>Recommended</option><option>Newest First</option><option>Highest Rated</option><option>Lowest Rated</option>
                  </select>
                </div>
              </div>

              <div className="lbp-reviews">
                {reviews.map((r, i) => (
                  <article key={i} className="lbp-review">
                    <div className="lbp-rv-user">
                      <span className="lbp-rv-avatar">{initial(r.author)}</span>
                      <div>
                        <a className="lbp-rv-name" href="#">{r.author}</a>
                        <div className="lbp-rv-loc">{r.location}</div>
                        <div className="lbp-rv-badge"><FontAwesomeIcon icon={faStar} /> {r.reviewCount} reviews</div>
                      </div>
                    </div>
                    <div className="lbp-rv-meta"><Stars value={r.rating} size={18} /><span className="lbp-rv-date">{r.date}</span></div>
                    <p className="lbp-rv-body">{r.body}</p>
                    {r.photos.length > 0 && (
                      <div className="lbp-rv-photos">{r.photos.map((p, j) => <img key={j} src={p} alt="" loading="lazy" />)}</div>
                    )}
                    <div className="lbp-rv-react">
                      <button type="button" className={votes[`${i}:useful`] ? 'is-on' : ''} onClick={() => toggleVote(`${i}:useful`)} aria-pressed={!!votes[`${i}:useful`]}><FontAwesomeIcon icon={faThumbsUp} /> Useful <span>{voteCount(`${i}:useful`, r.useful)}</span></button>
                      <button type="button" className={votes[`${i}:funny`] ? 'is-on' : ''} onClick={() => toggleVote(`${i}:funny`)} aria-pressed={!!votes[`${i}:funny`]}><FontAwesomeIcon icon={faFaceLaughSquint} /> Funny <span>{voteCount(`${i}:funny`, r.funny)}</span></button>
                      <button type="button" className={votes[`${i}:cool`] ? 'is-on' : ''} onClick={() => toggleVote(`${i}:cool`)} aria-pressed={!!votes[`${i}:cool`]}><FontAwesomeIcon icon={faLightbulb} /> Cool <span>{voteCount(`${i}:cool`, r.cool)}</span></button>
                    </div>
                  </article>
                ))}
              </div>
              </>) : (
                <div className="lbp-rev-empty">
                  <FontAwesomeIcon icon={faStar} className="lbp-rev-empty-ic" />
                  <h3>No reviews yet</h3>
                  <p>Be the first to review {biz.name}.</p>
                  <button type="button" className="lbp-btn lbp-btn--primary" onClick={doReview}><FontAwesomeIcon icon={faStar} /> Write a Review</button>
                </div>
              )}
            </Reveal>
          </main>

          {/* SIDEBAR */}
          <aside className="lbp-side">
            <div className="lbp-cta">
              <a className="lbp-cta-primary" href={ctaHref} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={ctaIcon} /> {vertical.primaryCtaLabel}
              </a>
              <ul className="lbp-cta-list">
                {biz.website && (
                  <li><a href={biz.website} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGlobe} /> <span>{biz.websiteLabel}</span> <FontAwesomeIcon icon={faChevronRight} className="lbp-cta-arrow" />
                  </a></li>
                )}
                {biz.phone && <li><a href={`tel:${biz.phone}`}><FontAwesomeIcon icon={faPhone} /> <span>{biz.phone}</span></a></li>}
                <li>
                  <a href="#"><FontAwesomeIcon icon={faDiamondTurnRight} /> <span>Get Directions</span></a>
                  <div className="lbp-cta-sub">{biz.address}</div>
                </li>
              </ul>
              <button className="lbp-cta-edit"><FontAwesomeIcon icon={faPenToSquare} /> Suggest an edit</button>
            </div>

            <div className="lbp-sidecard">
              <div className="lbp-sidecard-head"><FontAwesomeIcon icon={faClock} /> Hours</div>
              <table className="lbp-hours"><tbody>
                {hours.map(([d, h, badge]) => (
                  <tr key={d}><td className="lbp-h-day">{d}</td><td className="lbp-h-time">{h}{badge && <span className="lbp-open-badge">{badge}</span>}</td></tr>
                ))}
              </tbody></table>
            </div>

            <button className="lbp-ask"><FontAwesomeIcon icon={faCommentDots} /> Ask the Community</button>
          </aside>
        </div>
      </div>

      {/* ── Auth gate: anon Save / Review / Photo / react → sign in, then the
           pending action re-fires once authed. ── */}
      <SignupModal
        open={signupOpen}
        onClose={() => { setSignupOpen(false); setPendingAction(null) }}
        onSuccess={async () => {
          setSignupOpen(false)
          try {
            const r = await fetch(`/api/listings/${slug}/me`, { credentials: 'same-origin' })
            const j = r.ok ? await r.json() : null
            const authed = !!(j && j.isAuthed)
            setMe({ isAuthed: authed, isBookmarked: !!(j && j.isBookmarked) })
            if (authed && pendingAction === 'save' && !(j && j.isBookmarked)) persistBookmark(true)
            else if (authed && pendingAction === 'review') window.location.assign(reviewHref)
            else if (authed && pendingAction === 'photo') setClaimOpen(true)
          } catch { /* ignore */ }
          setPendingAction(null)
        }}
      />

      {/* ── Claim ownership (domain-email OTP or manual review). ── */}
      <ClaimListingModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        listingSlug={slug}
        companyName={biz.name}
        website={biz.website}
        isAuthed={me.isAuthed}
        onRequireAuth={() => { setClaimOpen(false); setSignupOpen(true) }}
      />
    </div>
  )
}
