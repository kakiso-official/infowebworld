'use client'
import { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { I } from '../icons'
import type { SelectOpt } from '../types'

type Props = {
  value: string
  onChange: (v: string) => void
  options: SelectOpt[]
  placeholder: string
  disabled?: boolean
  searchable?: boolean
}

/**
 * Portal-based custom select. Popup renders into document.body so it
 * never clips inside scroll containers (slide-in panel, overflow: auto parents, etc.).
 */
export default function CustomSelect({ value, onChange, options, placeholder, disabled, searchable }: Props) {
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
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
      <button type="button" ref={btnRef}
        className={`lf2-cs-btn${disabled ? ' lf2-cs-btn--disabled' : ''}${open ? ' lf2-cs-btn--open' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}>
        {selected ? (
          <span className="lf2-cs-selected">
            {selected.icon}
            {selected.color && <span className="lf2-cs-dot" style={{ background: selected.color }} />}
            <span className="lf2-cs-sel-text">{selected.label}</span>
          </span>
        ) : (
          <span className="lf2-cs-placeholder">{placeholder}</span>
        )}
        <span className={`lf2-cs-chev${open ? ' lf2-cs-chev--open' : ''}`}>{I.chevron}</span>
      </button>

      {open && pos && typeof document !== 'undefined' && createPortal(
        <div ref={popRef} className="lf2-cs-pop"
          style={{ top: pos.top, left: pos.left, width: pos.width }}>
          {searchable && (
            <div className="lf2-cs-search">
              <span className="lf2-cs-search-icon">{I.search}</span>
              <input ref={searchRef} type="text" className="lf2-cs-search-input"
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Type to search…" />
            </div>
          )}
          <div className="lf2-cs-list">
            {filtered.length === 0 && <div className="lf2-cs-empty">No matches</div>}
            {filtered.map(o => (
              <button key={o.value} type="button"
                className={`lf2-cs-opt${o.value === value ? ' lf2-cs-opt--on' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false); setQ('') }}>
                {o.icon}
                {o.color && <span className="lf2-cs-dot" style={{ background: o.color }} />}
                <span className="lf2-cs-opt-text">{o.label}</span>
                {o.value === value && <span className="lf2-cs-opt-check">{I.check}</span>}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
