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
  /** When set, renders a "Preview" pill that opens the live preview in a new tab.
   *  Disabled until the user has typed at least a company name so the preview
   *  surface doesn't open empty. */
  previewHref?: string
  previewEnabled?: boolean
}

export default function Footer({
  step, total, onBack, onNext, isLast, submitting,
  submitLabel = 'Submit listing',
  submittingLabel = 'Submitting…',
  previewHref,
  previewEnabled,
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

      <div className="df-footer-center">
        <span className="df-footer-counter">Step {step + 1} of {total}</span>
        {previewHref && (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className={'df-btn df-btn--outline df-footer-preview' + (previewEnabled ? '' : ' is-disabled')}
            aria-disabled={!previewEnabled}
            onClick={e => { if (!previewEnabled) e.preventDefault() }}
            title={previewEnabled
              ? 'Open a live preview of your listing in a new tab'
              : 'Enter at least your company name to enable preview'}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            Preview
          </a>
        )}
      </div>

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
