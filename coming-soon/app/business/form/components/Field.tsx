import type { ReactNode } from 'react'

type Props = {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export default function Field({ label, required, error, hint, children }: Props) {
  return (
    <div className={`lf2-field${error ? ' lf2-field--err' : ''}`}>
      <label className="lf2-field-label">
        {label}{required && <span className="lf2-field-req">*</span>}
      </label>
      {children}
      {hint && !error && <div className="lf2-field-hint">{hint}</div>}
      {error && <div className="lf2-field-error">{error}</div>}
    </div>
  )
}
