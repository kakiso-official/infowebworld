'use client'
/**
 * Portal-based custom select. Popup renders into document.body so it never
 * clips inside scroll containers. Same behaviour as the legacy CustomSelect
 * but styled with .df-* / no-glow design language.
 */
import { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import type { SelectOpt } from '../types'

type Props = {
  value: string
  onChange: (v: string) => void
  options: SelectOpt[]
  placeholder: string
  disabled?: boolean
  searchable?: boolean
}

export default function Select({ value, onChange, options, placeholder, disabled, searchable }: Props) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.value === value)

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    const popH = 320
    const openDown = r.bottom + popH + 8 < window.innerHeight
    const top = openDown ? r.bottom + 6 : Math.max(8, r.top - popH - 6)
    setPos({ top, left: r.left, width: r.width })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const h = () => updatePosition()
    window.addEventListener('scroll', h, true)
    window.addEventListener('resize', h)
    return () => {
      window.removeEventListener('scroll', h, true)
      window.removeEventListener('resize', h)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t)) return
      if (popRef.current?.contains(t)) return
      setOpen(false); setQ('')
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setQ('') } }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 10)
  }, [open, searchable])

  const filtered = useMemo(() => {
    if (!q) return options
    const needle = q.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(needle))
  }, [q, options])

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        className={'df-sel-btn' + (disabled ? ' df-sel-btn--off' : '') + (open ? ' df-sel-btn--open' : '')}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
      >
        {selected ? (
          <span className="df-sel-val">
            {selected.icon}
            {selected.color && <span className="df-sel-dot" style={{ background: selected.color }} />}
            <span className="df-sel-text">{selected.label}</span>
          </span>
        ) : (
          <span className="df-sel-placeholder">{placeholder}</span>
        )}
        <svg
          className={'df-sel-chev' + (open ? ' df-sel-chev--open' : '')}
          viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && pos && typeof document !== 'undefined' && createPortal(
        <div ref={popRef} className="df-sel-pop" style={{ top: pos.top, left: pos.left, width: pos.width }}>
          {searchable && (
            <div className="df-sel-search">
              <svg viewBox="0 0 24 24" width="14" height="14" className="df-sel-search-ico" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                className="df-sel-search-input"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Type to search…"
              />
            </div>
          )}
          <div className="df-sel-list">
            {filtered.length === 0 && <div className="df-sel-empty">No matches</div>}
            {filtered.map(o => (
              <button
                key={o.value}
                type="button"
                className={'df-sel-opt' + (o.value === value ? ' df-sel-opt--on' : '')}
                onClick={() => { onChange(o.value); setOpen(false); setQ('') }}
              >
                {o.icon}
                {o.color && <span className="df-sel-dot" style={{ background: o.color }} />}
                <span className="df-sel-opt-text">{o.label}</span>
                {o.value === value && (
                  <svg viewBox="0 0 24 24" width="14" height="14" className="df-sel-opt-check" aria-hidden="true">
                    <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
