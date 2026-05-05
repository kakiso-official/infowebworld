import type { ReactNode } from 'react'

type Props = {
  label: string
  required?: boolean
  error?: string
  hint?: string
  /** Set when the field is plan-gated; renders an inline "Upgrade to {tier}" pill instead of the input. */
  lockedReason?: string | null
  children: ReactNode
}

export default function Field({ label, required, error, hint, lockedReason, children }: Props) {
  return (
    <div className={'df-field' + (error ? ' df-field--err' : '') + (lockedReason ? ' df-field--locked' : '')}>
      <label className="df-label">
        <span>{label}</span>
        {required && <span className="df-req" aria-label="required">*</span>}
        {lockedReason && (
          <span className="df-lock-badge">
            <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {lockedReason}
          </span>
        )}
      </label>
      <div className="df-control">{children}</div>
      {hint && !error && <div className="df-hint">{hint}</div>}
      {error && <div className="df-err">{error}</div>}
    </div>
  )
}
