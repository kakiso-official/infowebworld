'use client'

type Props = {
  step: number
  total: number
  onBack: () => void
  onNext: () => void
  isLast: boolean
  submitting: boolean
  submitLabel?: string
  submittingLabel?: string
}

export default function Footer({
  step, total, onBack, onNext, isLast, submitting,
  submitLabel = 'Submit listing',
  submittingLabel = 'Submitting…',
}: Props) {
  return (
    <div className="df-footer">
      {step > 0 ? (
        <button type="button" className="df-btn df-btn--outline df-footer-back" onClick={onBack} disabled={submitting}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      ) : <span className="df-footer-spacer" />}

      <span className="df-footer-counter">Step {step + 1} of {total}</span>

      <button
        type="button"
        className="df-btn df-btn--primary df-footer-next"
        onClick={onNext}
        disabled={submitting}
      >
        {submitting ? submittingLabel : isLast ? submitLabel : 'Continue'}
        {!submitting && (
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
