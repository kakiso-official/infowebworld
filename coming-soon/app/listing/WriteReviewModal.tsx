'use client'
import { useEffect, useRef, useState } from 'react'

interface SavedReview {
  rating: number
  title: string
  body: string
  existed: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  listingSlug: string
  companyName: string
  companyLogo?: string
  hasExistingReview: boolean
  isAuthed: boolean
  isPreview?: boolean
  /** Called after a successful create/update so the parent can refresh local state without a full reload. */
  onSuccess?: (review: SavedReview) => void
  /** Called after a successful delete (edit mode only). */
  onDelete?: () => void
  /** Reviewer identity — rendered in a pill at the top so the user knows the review is attached to their account. */
  currentUserName?: string | null
  currentUserAvatar?: string | null
}

const TITLE_MAX = 120
const BODY_MAX = 4000
const RATING_LABELS = ['', 'Bad', 'Poor', 'Average', 'Good', 'Excellent']

/**
 * Star rating + title + body modal styled to match the listing page (Inter,
 * teal/amber accents, white card with branded header strip). Edit mode prefills
 * via GET /reviews/me. Delete is a confirm step inside the same modal.
 */
export default function WriteReviewModal({
  isOpen, onClose, listingSlug, companyName, companyLogo,
  hasExistingReview, isAuthed, isPreview,
  onSuccess, onDelete,
  currentUserName, currentUserAvatar,
}: Props) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<'created' | 'updated' | 'deleted' | null>(null)
  const [didExist, setDidExist] = useState(false)
  const titleRef = useRef<HTMLInputElement | null>(null)

  /* Reset on every open */
  useEffect(() => {
    if (!isOpen) return
    setRating(0); setHover(0); setTitle(''); setBody('')
    setSubmitting(false); setDeleting(false); setConfirmingDelete(false)
    setError(''); setSuccess(null); setDidExist(false); setLoadingExisting(false)
  }, [isOpen])

  /* Prefill in edit mode by hitting /reviews/me. Skips when previewing. */
  useEffect(() => {
    if (!isOpen || isPreview || !isAuthed || !hasExistingReview) return
    let abort = false
    setLoadingExisting(true)
    fetch(`/api/listings/${encodeURIComponent(listingSlug)}/reviews/me`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (abort || !json?.review) return
        setRating(Number(json.review.rating) || 0)
        setTitle(String(json.review.title || ''))
        setBody(String(json.review.body || ''))
        setDidExist(true)
      })
      .catch(() => {})
      .finally(() => { if (!abort) setLoadingExisting(false) })
    return () => { abort = true }
  }, [isOpen, isPreview, isAuthed, hasExistingReview, listingSlug])

  /* Body scroll lock */
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Esc to close — but not while a request is in flight */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting && !deleting) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, submitting, deleting])

  /* Autofocus title once any prefill settles */
  useEffect(() => {
    if (!isOpen || loadingExisting || success || confirmingDelete) return
    const t = setTimeout(() => titleRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [isOpen, loadingExisting, success, confirmingDelete])

  if (!isOpen) return null

  const editing = didExist || hasExistingReview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) { setError('Pick a rating from 1 to 5.'); return }
    if (!title.trim()) { setError('Add a short title.'); return }
    if (!body.trim()) { setError("Tell others what you think."); return }

    const payload: SavedReview = { rating, title: title.trim(), body: body.trim(), existed: editing }

    if (isPreview) {
      setSuccess(editing ? 'updated' : 'created')
      onSuccess?.(payload)
      return
    }

    setSubmitting(true); setError('')
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingSlug)}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: payload.rating, title: payload.title, body: payload.body }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not save your review.')
      } else {
        setSuccess(editing ? 'updated' : 'created')
        onSuccess?.(payload)
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (isPreview) {
      setSuccess('deleted')
      onDelete?.()
      return
    }
    setDeleting(true); setError('')
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingSlug)}/reviews/me`, {
        method: 'DELETE',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not delete your review.')
      } else {
        setSuccess('deleted')
        onDelete?.()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  /* Initials fallback for the reviewer pill avatar. */
  const initials = (currentUserName || 'You')
    .trim().split(/\s+/).map(s => s[0] || '').filter(Boolean).slice(0, 2).join('').toUpperCase() || 'YOU'

  const eyebrow =
    success === 'deleted' ? 'Review deleted'
    : success ? 'Submitted'
    : confirmingDelete ? 'Confirm delete'
    : editing ? 'Editing review' : 'Write a review'

  return (
    <div className="wrm-overlay" onClick={() => !submitting && !deleting && onClose()}>
      <div className="wrm-card" role="dialog" aria-modal="true" aria-labelledby="wrm-title-h" onClick={e => e.stopPropagation()}>
        <header className="wrm-head">
          <div className="wrm-head-id">
            {companyLogo
              ? <img className="wrm-head-logo" src={companyLogo} alt="" />
              : <span className="wrm-head-logo wrm-head-logo--ph">{(companyName || 'IW').slice(0, 2).toUpperCase()}</span>}
            <div className="wrm-head-text">
              <div className="wrm-head-eyebrow">{eyebrow}</div>
              <div className="wrm-head-name">{companyName}</div>
            </div>
          </div>
          <button type="button" className="wrm-close" onClick={onClose}
            aria-label="Close" disabled={submitting || deleting}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {success ? (
          <div className="wrm-success">
            <div className={`wrm-success-icon ${success === 'deleted' ? 'wrm-success-icon--neutral' : ''}`} aria-hidden="true">
              {success === 'deleted' ? (
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1.5 14a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5 6"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <h3 className="wrm-success-title">
              {success === 'updated' ? 'Review updated'
                : success === 'deleted' ? 'Review removed'
                : 'Thanks for your review'}
            </h3>
            <p className="wrm-success-desc">
              {success === 'deleted'
                ? `Your review of ${companyName} is no longer visible.`
                : `It's live on ${companyName}'s page.`}
            </p>
            <button type="button" className="wrm-btn wrm-btn--primary" onClick={onClose}>Done</button>
          </div>
        ) : confirmingDelete ? (
          <div className="wrm-confirm">
            <p className="wrm-confirm-body">
              This will permanently remove your {companyName} review. You can write a new one anytime.
            </p>
            {error && <p className="wrm-error" role="alert">{error}</p>}
            <div className="wrm-foot">
              <span />
              <div className="wrm-foot-end">
                <button type="button" className="wrm-btn wrm-btn--ghost"
                  onClick={() => { setConfirmingDelete(false); setError('') }}
                  disabled={deleting}>Cancel</button>
                <button type="button" className="wrm-btn wrm-btn--danger"
                  onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Removing…' : 'Yes, delete'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h3 id="wrm-title-h" className="wrm-title">
              {editing ? `Edit your ${companyName} review` : `Review ${companyName}`}
            </h3>
            <p className="wrm-sub">Help others understand what&apos;s good — and what to watch for.</p>

            {(currentUserName || currentUserAvatar) && (
              <div className="wrm-reviewer">
                {currentUserAvatar
                  ? <img className="wrm-reviewer-avatar" src={currentUserAvatar} alt="" />
                  : <span className="wrm-reviewer-avatar wrm-reviewer-avatar--initials">{initials}</span>}
                <div>
                  <div className="wrm-reviewer-eyebrow">Reviewing as</div>
                  <div className="wrm-reviewer-name">{currentUserName || 'You'}</div>
                </div>
              </div>
            )}

            <form className="wrm-form" onSubmit={handleSubmit}>
              <div className="wrm-stars" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n === 1 ? '' : 's'}`}
                    className={`wrm-star ${(hover || rating) >= n ? 'is-on' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    disabled={submitting || loadingExisting}
                  >
                    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                      <path
                        fill={(hover || rating) >= n ? '#FFA91C' : '#E5E7EB'}
                        d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
                      />
                    </svg>
                  </button>
                ))}
                <span className="wrm-stars-label">
                  {rating > 0 ? `${RATING_LABELS[rating]} · ${rating}/5` : 'Tap to rate'}
                </span>
              </div>

              <div className="wrm-field">
                <label className="wrm-label" htmlFor="wrm-title">Title</label>
                <input
                  id="wrm-title"
                  ref={titleRef}
                  className="wrm-input"
                  value={title}
                  onChange={e => setTitle(e.target.value.slice(0, TITLE_MAX))}
                  maxLength={TITLE_MAX}
                  placeholder="One-line summary"
                  disabled={submitting || loadingExisting}
                />
                <span className="wrm-counter">{title.length}/{TITLE_MAX}</span>
              </div>

              <div className="wrm-field">
                <label className="wrm-label" htmlFor="wrm-body">Your review</label>
                <textarea
                  id="wrm-body"
                  className="wrm-textarea"
                  value={body}
                  onChange={e => setBody(e.target.value.slice(0, BODY_MAX))}
                  maxLength={BODY_MAX}
                  rows={6}
                  placeholder="What's the experience been like? Pros, cons, would you recommend?"
                  disabled={submitting || loadingExisting}
                />
                <span className="wrm-counter">{body.length}/{BODY_MAX}</span>
              </div>

              {!isAuthed && !isPreview && (
                <p className="wrm-error" role="alert">Sign in first — your review needs to be tied to an account.</p>
              )}
              {error && <p className="wrm-error" role="alert">{error}</p>}

              <div className="wrm-foot">
                {editing && !isPreview ? (
                  <button type="button" className="wrm-btn wrm-btn--danger-ghost"
                    onClick={() => setConfirmingDelete(true)}
                    disabled={submitting || loadingExisting}>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1.5 14a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5 6"
                        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Delete
                  </button>
                ) : <span />}
                <div className="wrm-foot-end">
                  <button type="button" className="wrm-btn wrm-btn--ghost" onClick={onClose} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="wrm-btn wrm-btn--primary"
                    disabled={submitting || loadingExisting || (!isAuthed && !isPreview)}>
                    {submitting ? 'Saving…' : editing ? 'Update review' : 'Publish review'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
