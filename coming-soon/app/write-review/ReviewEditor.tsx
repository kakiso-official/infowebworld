'use client'

import { useState, useRef, useEffect } from 'react'

type Draft = { rating: number; title: string; body: string; language?: string }

interface Props {
  initial: Draft
  /** True when the draft came from voice transcription — surfaces the
   *  "Generated from your recording" notice and a slightly different
   *  CTA copy. */
  generated: boolean
  submitting: boolean
  submitError: string
  onBack: () => void
  onSubmit: (payload: { rating: number; title: string; body: string }) => void
  isAuthed: boolean
  onRequestLogin: () => void
}

const TITLE_MAX = 120
const BODY_MAX = 4000
const RATING_LABELS = ['', 'Bad', 'Poor', 'Average', 'Good', 'Excellent']

export default function ReviewEditor({
  initial, generated, submitting, submitError, onBack, onSubmit,
  isAuthed, onRequestLogin,
}: Props) {
  const [rating, setRating] = useState(initial.rating || 0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState(initial.title || '')
  const [body, setBody] = useState(initial.body || '')
  const [localError, setLocalError] = useState('')
  const titleRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  /* Re-seed if the parent passes a different draft (e.g. user re-recorded). */
  useEffect(() => {
    setRating(initial.rating || 0)
    setTitle(initial.title || '')
    setBody(initial.body || '')
  }, [initial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) { setLocalError('Pick a rating from 1 to 5.'); return }
    if (!title.trim()) { setLocalError('Add a short title.'); return }
    if (!body.trim())  { setLocalError("Tell others what you think."); return }
    if (!isAuthed) { onRequestLogin(); return }
    setLocalError('')
    onSubmit({ rating, title: title.trim(), body: body.trim() })
  }

  return (
    <form className="wr-edit" onSubmit={handleSubmit}>
      {generated && (
        <div className="wr-edit-notice">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
               strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <div>
            <strong>Generated from your recording</strong>
            <span> — edit anything before publishing. We picked the rating based on tone, but you can override it.</span>
          </div>
        </div>
      )}

      <fieldset className="wr-edit-field wr-edit-stars" role="radiogroup" aria-label="Rating">
        <legend className="wr-edit-label">Rating</legend>
        <div className="wr-edit-stars-row">
          {[1, 2, 3, 4, 5].map(n => {
            const on = (hover || rating) >= n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                className={'wr-edit-star' + (on ? ' is-on' : '')}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                disabled={submitting}
              >
                <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
                  <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
                        fill={on ? '#F59E0B' : '#E5E7EB'} />
                </svg>
              </button>
            )
          })}
          <span className="wr-edit-stars-label">
            {rating > 0 ? `${RATING_LABELS[rating]} · ${rating}/5` : 'Tap to rate'}
          </span>
        </div>
      </fieldset>

      <div className="wr-edit-field">
        <label className="wr-edit-label" htmlFor="wr-title">Title</label>
        <input
          id="wr-title"
          ref={titleRef}
          className="wr-edit-input"
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, TITLE_MAX))}
          maxLength={TITLE_MAX}
          placeholder="One-line summary"
          disabled={submitting}
        />
        <span className="wr-edit-counter">{title.length}/{TITLE_MAX}</span>
      </div>

      <div className="wr-edit-field">
        <label className="wr-edit-label" htmlFor="wr-body">Your review</label>
        <textarea
          id="wr-body"
          className="wr-edit-textarea"
          value={body}
          onChange={e => setBody(e.target.value.slice(0, BODY_MAX))}
          maxLength={BODY_MAX}
          rows={8}
          placeholder="What was the experience like? Pros, cons, would you recommend?"
          disabled={submitting}
        />
        <span className="wr-edit-counter">{body.length}/{BODY_MAX}</span>
      </div>

      {localError && <p className="wr-edit-error" role="alert">{localError}</p>}
      {submitError && <p className="wr-edit-error" role="alert">{submitError}</p>}

      <div className="wr-edit-foot">
        <button type="button" className="wr-btn wr-btn--ghost" onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button type="submit" className="wr-btn wr-btn--primary" disabled={submitting}>
          {submitting ? 'Publishing…' : generated ? 'Confirm & publish' : 'Publish review'}
        </button>
      </div>
    </form>
  )
}
