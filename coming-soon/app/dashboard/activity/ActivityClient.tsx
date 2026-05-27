'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export interface ActivityListing {
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  category: { name: string | null; slug: string | null; color: string | null }
  actedAt: string
  /* Only populated on the reviewed bucket */
  reviewRating?: number | null
  reviewTitle?: string | null
}

interface Props {
  saved: ActivityListing[]
  liked: ActivityListing[]
  disliked: ActivityListing[]
  reviewed: ActivityListing[]
}

type Tab = 'saved' | 'liked' | 'reviewed' | 'disliked'

const TABS: Array<{ key: Tab; label: string; emptyHint: string }> = [
  { key: 'saved',    label: 'Saved',    emptyHint: 'Save a listing from any category page or the listing detail page and it shows up here.' },
  { key: 'liked',    label: 'Liked',    emptyHint: 'Like a listing on its detail page and it shows up here.' },
  { key: 'reviewed', label: 'Reviewed', emptyHint: 'Write a review on a listing\u2019s detail page and it shows up here.' },
  { key: 'disliked', label: 'Disliked', emptyHint: 'Dislike a listing on its detail page and it shows up here.' },
]

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  if (!t) return ''
  const diff = Date.now() - t
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="act-stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={n <= rating ? '#F59E0B' : '#E5E7EB'} />
        </svg>
      ))}
    </span>
  )
}

/**
 * Activity dashboard — tabbed view across the user's Saved / Liked /
 * Reviewed / Disliked listings. Server hands us all four buckets in one
 * payload so tab switches are instant. Unsave / unlike actions hit the
 * same engagement endpoints used elsewhere; the row collapses out of view
 * on success via the local override list.
 */
export default function ActivityClient({ saved, liked, disliked, reviewed }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('saved')

  /* Per-bucket "removed" sets — when the user clicks "Remove" we drop the
     slug locally and the row disappears, no full page refresh. */
  const [removed, setRemoved] = useState<Record<Tab, Set<string>>>({
    saved: new Set(), liked: new Set(), reviewed: new Set(), disliked: new Set(),
  })

  const counts = useMemo(() => ({
    saved:    saved.length    - removed.saved.size,
    liked:    liked.length    - removed.liked.size,
    reviewed: reviewed.length - removed.reviewed.size,
    disliked: disliked.length - removed.disliked.size,
  }), [saved.length, liked.length, reviewed.length, disliked.length, removed])

  const list = useMemo(() => {
    const src =
      tab === 'saved'    ? saved    :
      tab === 'liked'    ? liked    :
      tab === 'reviewed' ? reviewed : disliked
    return src.filter(item => !removed[tab].has(item.slug))
  }, [tab, saved, liked, reviewed, disliked, removed])

  const markRemoved = (bucket: Tab, slug: string) => {
    setRemoved(prev => {
      const next = new Set(prev[bucket])
      next.add(slug)
      return { ...prev, [bucket]: next }
    })
  }

  const undoRemove = async (slug: string) => {
    /* For Saved → POST to re-bookmark; for Liked/Disliked → re-POST the
       reaction; reviewed is not undoable from the activity page (users
       edit reviews in the review modal on the listing page). */
    if (tab === 'saved') {
      await fetch(`/api/listings/${slug}/bookmark`, { method: 'DELETE' })
    } else if (tab === 'liked' || tab === 'disliked') {
      await fetch(`/api/listings/${slug}/reactions`, { method: 'DELETE' })
    }
    /* Refresh the server data so the row reappears with fresh timestamps. */
    router.refresh()
  }

  const removeItem = async (slug: string) => {
    if (tab === 'saved') {
      await fetch(`/api/listings/${slug}/bookmark`, { method: 'DELETE' })
    } else if (tab === 'liked' || tab === 'disliked') {
      await fetch(`/api/listings/${slug}/reactions`, { method: 'DELETE' })
    } else {
      /* Reviewed — surface a redirect to the listing detail page where the
         review modal lives. Don't auto-delete reviews from a side channel. */
      router.push(`/listing/${slug}#review`)
      return
    }
    markRemoved(tab, slug)
  }

  return (
    <>
      {/* Tabs */}
      <div className="act-tabs" role="tablist" aria-label="Activity buckets">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={'act-tab' + (tab === t.key ? ' act-tab--active' : '')}
            onClick={() => setTab(t.key)}
          >
            <span className="act-tab-label">{t.label}</span>
            <span className="act-tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="act-empty">
          <div className="act-empty-icon" aria-hidden="true">
            {tab === 'saved'    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}
            {tab === 'liked'    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>}
            {tab === 'disliked' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>}
            {tab === 'reviewed' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
          </div>
          <h3 className="act-empty-title">No {tab} listings yet</h3>
          <p className="act-empty-hint">{TABS.find(t => t.key === tab)?.emptyHint}</p>
          <Link href="/categories" className="act-empty-cta">Explore listings</Link>
        </div>
      ) : (
        <div className="act-list">
          {list.map(item => {
            const initial = item.companyName.charAt(0).toUpperCase()
            const accent = item.category.color || '#E8553D'
            return (
              <article key={item.slug} className="act-card">
                <Link href={`/listing/${item.slug}`} className="act-card-logo" aria-label={item.companyName}>
                  {item.logoUrl
                    ? <img src={item.logoUrl} alt="" />
                    : <span style={{ background: `${accent}14`, color: accent }}>{initial}</span>}
                </Link>
                <div className="act-card-body">
                  <Link href={`/listing/${item.slug}`} className="act-card-name">{item.companyName}</Link>
                  {item.tagline && <p className="act-card-tag">{item.tagline}</p>}
                  <div className="act-card-meta">
                    {item.category.name && (
                      <span className="act-card-chip" style={{ background: `${accent}14`, color: accent }}>
                        {item.category.name}
                      </span>
                    )}
                    <span className="act-card-time">{timeAgo(item.actedAt)}</span>
                    {tab === 'reviewed' && item.reviewRating != null && (
                      <span className="act-card-review">
                        <StarRow rating={item.reviewRating} />
                        {item.reviewTitle && <span className="act-card-review-title">&ldquo;{item.reviewTitle}&rdquo;</span>}
                      </span>
                    )}
                  </div>
                </div>
                <div className="act-card-actions">
                  <Link href={`/listing/${item.slug}`} className="act-card-btn act-card-btn--ghost">
                    View
                  </Link>
                  <button
                    type="button"
                    className="act-card-btn act-card-btn--danger"
                    onClick={() => removeItem(item.slug)}
                  >
                    {tab === 'saved'    && 'Unsave'}
                    {tab === 'liked'    && 'Unlike'}
                    {tab === 'disliked' && 'Undo'}
                    {tab === 'reviewed' && 'Edit'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Hint at undo if a row was just removed in this session */}
      {removed[tab].size > 0 && (
        <div className="act-undo-bar" role="status">
          <span>Removed {removed[tab].size} {removed[tab].size === 1 ? 'listing' : 'listings'}.</span>
          <button
            type="button"
            className="act-undo-btn"
            onClick={() => {
              const lastSlug = [...removed[tab]].pop()
              if (lastSlug) undoRemove(lastSlug)
            }}
          >
            Undo last
          </button>
        </div>
      )}
    </>
  )
}
