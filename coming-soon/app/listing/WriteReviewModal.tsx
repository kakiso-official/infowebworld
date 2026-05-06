'use client'
import { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  listingSlug: string
  companyName: string
  hasExistingReview: boolean
  isAuthed: boolean
  isPreview?: boolean
}

/**
 * Star rating + title + body. POSTs to /api/listings/[id]/reviews.
 * Closes on success, re-opens with same content if API fails.
 * Anonymous visitors are redirected to /business to sign in before
 * the modal mounts (parent gates this).
 */
export default function WriteReviewModal({
  isOpen, onClose, listingSlug, companyName, hasExistingReview, isAuthed, isPreview,
}: Props) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setRating(0); setHover(0); setTitle(''); setBody('')
    setSubmitting(false); setError(''); setSuccess(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) { setError('Pick a rating from 1 to 5.'); return }
    if (!title.trim()) { setError('Add a short title.'); return }
    if (!body.trim()) { setError('Tell others what you think.'); return }

    if (isPreview) { setSuccess(true); return }

    setSubmitting(true); setError('')
    try {
      const res = await fetch(`/api/listings/${listingSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title: title.trim(), body: body.trim() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not save your review.')
      } else {
        setSuccess(true)
        /* Refresh on close so the new review is visible. */
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (success && typeof window !== 'undefined') {
      window.location.reload()
      return
    }
    onClose()
  }

  return (
    <div className="wrm-overlay" onClick={handleClose}>
      <div className="wrm-card" onClick={e => e.stopPropagation()}>
        <button className="wrm-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div className="wrm-success">
            <div className="wrm-success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="wrm-success-title">Thanks for your review</h3>
            <p className="wrm-success-desc">It&apos;s live on {companyName}&apos;s page.</p>
            <button type="button" className="wrm-btn wrm-btn--primary" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <>
            <h3 className="wrm-title">
              {hasExistingReview ? `Edit your ${companyName} review` : `Review ${companyName}`}
            </h3>
            <p className="wrm-sub">Help others understand what&apos;s good — and what to watch for.</p>

            <form className="wrm-form" onSubmit={handleSubmit}>
              <div className="wrm-stars" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    className={`wrm-star ${(hover || rating) >= n ? 'is-on' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
                      <path
                        fill={(hover || rating) >= n ? '#FFA91C' : '#E5E7EB'}
                        d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
                      />
                    </svg>
                  </button>
                ))}
                <span className="wrm-stars-label">{rating > 0 ? `${rating} of 5` : 'Tap to rate'}</span>
              </div>

              <label className="wrm-label" htmlFor="wrm-title">Title</label>
              <input
                id="wrm-title"
                className="wrm-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
                placeholder="One-line summary"
                disabled={submitting}
              />

              <label className="wrm-label" htmlFor="wrm-body">Your review</label>
              <textarea
                id="wrm-body"
                className="wrm-textarea"
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={4000}
                rows={6}
                placeholder="What's the experience been like? Pros, cons, would you recommend?"
                disabled={submitting}
              />

              {!isAuthed && !isPreview && (
                <p className="wrm-error">Sign in first — your review needs to be tied to an account.</p>
              )}
              {error && <p className="wrm-error">{error}</p>}

              <div className="wrm-foot">
                <button type="button" className="wrm-btn wrm-btn--ghost" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="wrm-btn wrm-btn--primary" disabled={submitting}>
                  {submitting ? 'Saving…' : hasExistingReview ? 'Update review' : 'Publish review'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
