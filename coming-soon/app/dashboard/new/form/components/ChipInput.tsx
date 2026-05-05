'use client'
import { useState } from 'react'

type Props = {
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  max?: number
  maxLen?: number
}

/**
 * Free-text chip list. Press Enter (or click Add) to add a chip. Click X to remove.
 * Used for header tags, integrations, features list, languages, etc.
 */
export default function ChipInput({
  values, onChange, placeholder = 'Type and press Enter…', max, maxLen = 60,
}: Props) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (!v) return
    if (values.includes(v)) { setInput(''); return }
    if (max != null && values.length >= max) return
    onChange([...values, v])
    setInput('')
  }
  const remove = (i: number) => onChange(values.filter((_, j) => j !== i))

  return (
    <div className="df-chip-wrap">
      <div className="df-chip-input-row">
        <input
          type="text"
          className="df-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={max != null ? `${placeholder} (${values.length}/${max})` : placeholder}
          maxLength={maxLen}
          disabled={max != null && values.length >= max}
        />
        <button
          type="button"
          className="df-btn df-btn--outline"
          onClick={add}
          disabled={!input.trim() || (max != null && values.length >= max)}
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="df-chip-row">
          {values.map((v, i) => (
            <span key={v + i} className="df-chip">
              {v}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove ${v}`}>
                <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
