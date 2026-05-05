'use client'

type Props = {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  max?: number
  /** Allow free-add via input + Enter (text chips that aren't in `options`). */
  allowCustom?: boolean
  customPlaceholder?: string
}

/**
 * Multi-select via a row of toggleable pills. Selected = filled pill, unselected
 * = outline pill. No glow, no gradient — pure colour swap. Optionally allows
 * user to add their own values via a small input below the pill row.
 */
export default function PillToggle({
  options, selected, onChange, max, allowCustom, customPlaceholder = 'Add your own…',
}: Props) {
  const all = Array.from(new Set([...options, ...selected]))
  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter(s => s !== v))
    else if (max == null || selected.length < max) onChange([...selected, v])
  }
  const onAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const v = (e.currentTarget.value || '').trim()
    if (!v) return
    if (selected.includes(v)) { e.currentTarget.value = ''; return }
    if (max != null && selected.length >= max) return
    onChange([...selected, v])
    e.currentTarget.value = ''
  }

  return (
    <div className="df-pillset">
      <div className="df-pillset-row">
        {all.map(v => {
          const on = selected.includes(v)
          return (
            <button
              key={v}
              type="button"
              className={'df-pill' + (on ? ' df-pill--on' : '')}
              onClick={() => toggle(v)}
              disabled={!on && max != null && selected.length >= max}
            >
              {v}
              {on && (
                <svg viewBox="0 0 24 24" width="11" height="11" className="df-pill-x" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
      {allowCustom && (
        <input
          type="text"
          className="df-pillset-add"
          placeholder={max != null ? `${customPlaceholder} (${selected.length}/${max})` : customPlaceholder}
          onKeyDown={onAdd}
          maxLength={60}
          disabled={max != null && selected.length >= max}
        />
      )}
    </div>
  )
}
