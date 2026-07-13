'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar, faStarHalfStroke, faLocationDot,
  faArrowUpRightFromSquare, faBookmark,
} from '@fortawesome/free-solid-svg-icons'
import SignupModal from '../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'
import { withInfoWebWorldUtm } from '../lib/utm'
import { trackWebsiteClick } from '../lib/track-website-click'
import { listingOutboundRel } from '@/lib/user-plan-types'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'
import './local-business-card.css'

/* ════════════════════════════════════════════════════════════════════════
   LocalBusinessCard — Yelp-style row card shown on category pages within the
   `local-businesses` sector ONLY (branched in CategoryPage by sectorSlug, so
   no other sector is touched). Photo · rating · price · open-now · location.
   Save is auth-gated (anon → SignupModal), same model as ListingCard's
   bookmark. Amber accent to match the local-business profile page.
   ════════════════════════════════════════════════════════════════════════ */

function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="lbc-stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        if (i < full) return <FontAwesomeIcon key={i} icon={faStar} className="lbc-star lbc-star--on" />
        if (i === full && half) return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className="lbc-star lbc-star--on" />
        return <FontAwesomeIcon key={i} icon={faStar} className="lbc-star lbc-star--off" />
      })}
    </span>
  )
}

/* Save — auth-gated; anon click opens the signup modal, then saves on success. */
function SaveButton({ slug }: { slug: string }) {
  const { user, refresh } = useAuth()
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const persist = async (next: boolean) => {
    if (!slug) return
    setPending(true)
    try {
      const res = await fetch(`/api/listings/${slug}/bookmark`, {
        method: next ? 'POST' : 'DELETE', credentials: 'same-origin',
      })
      if (res.ok) setSaved(next)
    } finally { setPending(false) }
  }

  const handle = () => {
    if (!user) { setAuthOpen(true); return }
    persist(!saved)
  }

  return (
    <>
      <button
        type="button"
        className={'lbc-save' + (saved ? ' lbc-save--on' : '')}
        onClick={handle}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? 'Saved' : 'Save business'}
      >
        <FontAwesomeIcon icon={faBookmark} />
        {saved ? 'Saved' : 'Save'}
      </button>
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => { setAuthOpen(false); refresh(); persist(true) }}
      />
    </>
  )
}

export default function LocalBusinessCard({ item }: { item: RealSubmission }) {
  /* Local businesses are companies → /profile/ surface. */
  const profileHref = '/profile/' + item.slug
  const rating = item.reviewAvg > 0 ? item.reviewAvg : 0
  /* Real photo only (skip favicons/logos); else the brand illustration. */
  const realPhoto = (item.lbPhotos.find((u) => !/logo|favicon|\.svg(\?|$)/i.test(u)) || '').replace(/^http:\/\//, 'https://')
  const photo = realPhoto || '/illustrations/lb-fallback.svg'
  const openNow = item.lbHours.some(h => h.openNow)
  const price = item.lbPriceRange || ''
  const locationParts = [item.city, item.state].filter(Boolean)
  const blurb = item.tagline || item.description || ''
  const initial = item.companyName.charAt(0).toUpperCase()
  const hasMetaAfterPrice = Boolean(item.category) || locationParts.length > 0

  return (
    <article className="lbc">
      <Link href={profileHref} className="lbc-photo" aria-label={item.companyName}>
        {photo
          ? <img src={photo} alt={`${item.companyName} — ${item.category || 'local business'} on InfoWebWorld`} loading="lazy" />
          : <span className="lbc-photo-ph">{initial}</span>}
        {openNow && <span className="lbc-open"><span className="lbc-open-dot" />Open now</span>}
      </Link>

      <div className="lbc-body">
        <div className="lbc-top">
          <h3 className="lbc-name"><Link href={profileHref}>{item.companyName}</Link></h3>
          <SaveButton slug={item.slug} />
        </div>

        <div className="lbc-rate">
          <Stars value={rating} />
          <span className="lbc-rate-num">{rating.toFixed(1)}</span>
          <Link href={`${profileHref}#reviews`} className="lbc-rate-count">
            ({item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'})
          </Link>
        </div>

        <div className="lbc-meta">
          {price && <span className="lbc-price">{price}</span>}
          {price && hasMetaAfterPrice && <span className="lbc-dot">·</span>}
          {item.category && <span className="lbc-cat">{item.category}</span>}
          {locationParts.length > 0 && (
            <>
              {item.category && <span className="lbc-dot">·</span>}
              <span className="lbc-loc"><FontAwesomeIcon icon={faLocationDot} className="lbc-loc-ic" />{locationParts.join(', ')}</span>
            </>
          )}
        </div>

        {blurb && <p className="lbc-blurb">{blurb}</p>}

        <div className="lbc-actions">
          <Link href={profileHref} className="lbc-btn lbc-btn--outline">View Profile</Link>
          {item.website && (
            <a
              href={withInfoWebWorldUtm(item.website, item.slug, 'category-card')}
              target="_blank"
              rel={listingOutboundRel(item.plan)}
              className="lbc-btn lbc-btn--solid"
              onClick={() => trackWebsiteClick(item.slug, 'category-card')}
            >
              Visit Website
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="lbc-btn-ic" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
