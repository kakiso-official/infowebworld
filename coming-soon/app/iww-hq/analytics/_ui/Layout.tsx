'use client'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAnalyticsQuery } from '../_lib/state'

/* ── PageHeader ─────────────────────────────────────────────────────────── */

/**
 * The page's H1 + one plain-English line saying what the page answers.
 * `meta` sits under the subtitle (e.g. "Tracking since 13 Oct 2026"),
 * `actions` on the right (buttons, toggles).
 */
export function PageHeader({ title, subtitle, meta, actions, back }: {
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  /** Optional "← Pages" link above the title (detail pages). Keeps range + filters. */
  back?: { href: string; label: string }
}) {
  const q = useAnalyticsQuery()
  return (
    <header className="an-ph">
      <div className="an-ph-main">
        {back && (
          <Link href={q.href(back.href)} className="an-ph-back">
            <span aria-hidden="true">←</span> {back.label}
          </Link>
        )}
        <h1 className="an-ph-title">{title}</h1>
        {subtitle && <p className="an-ph-sub">{subtitle}</p>}
        {meta && <div className="an-ph-meta">{meta}</div>}
      </div>
      {actions && <div className="an-ph-actions">{actions}</div>}
    </header>
  )
}

/* ── Panel ──────────────────────────────────────────────────────────────── */

export interface PanelProps {
  /** Heading text (rendered as h2). */
  title: ReactNode
  /** An <InfoTip /> next to the title. */
  info?: ReactNode
  /** Tabs/Segmented control for the panel (right of the title; wraps under on small screens). */
  tabs?: ReactNode
  /** Small buttons on the right (CSV, toggles). */
  actions?: ReactNode
  /** "View all →" footer link (href is passed through q.href, so range + filters stay). */
  viewAll?: { href: string; label?: string }
  /** Muted line under the title. */
  subtitle?: ReactNode
  footer?: ReactNode
  /** No inner padding (tables that bleed to the card edge). */
  flush?: boolean
  className?: string
  id?: string
  children: ReactNode
}

/** The card every block of content sits in: 12px radius, 1px border, title row, optional tabs/footer. */
export function Panel({ title, info, tabs, actions, viewAll, subtitle, footer, flush, className, id, children }: PanelProps) {
  const q = useAnalyticsQuery()
  return (
    <section className={'an-panel ' + (className ?? '')} id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="an-panel-head">
        <div className="an-panel-titles">
          <h2 className="an-panel-title" id={id ? `${id}-title` : undefined}>
            {title}
            {info}
          </h2>
          {subtitle && <div className="an-panel-sub">{subtitle}</div>}
        </div>
        {(tabs || actions) && (
          <div className="an-panel-tools">
            {tabs}
            {actions}
          </div>
        )}
      </div>
      <div className={'an-panel-body' + (flush ? ' an-panel-body--flush' : '')}>{children}</div>
      {(viewAll || footer) && (
        <div className="an-panel-foot">
          {footer}
          {viewAll && (
            <Link href={q.href(viewAll.href)} className="an-viewall">
              {viewAll.label ?? 'View all'} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

/** Responsive grid for panels: 2 columns on wide screens, 1 under ~1100px. `cols={3}` for small tiles. */
export function PanelGrid({ cols = 2, children, className }: { cols?: 1 | 2 | 3; children: ReactNode; className?: string }) {
  return <div className={`an-grid an-grid--${cols} ${className ?? ''}`}>{children}</div>
}

/* ── Tabs / Segmented ───────────────────────────────────────────────────── */

export interface TabItem<K extends string = string> {
  key: K
  label: ReactNode
  icon?: IconDefinition
  /** Small count shown after the label. */
  count?: number
  disabled?: boolean
}

function useRovingKeys<K extends string>(items: TabItem<K>[], value: K, onChange: (k: K) => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const enabled = items.filter(i => !i.disabled)
    const i = enabled.findIndex(t => t.key === value)
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % enabled.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    if (next < 0) return
    e.preventDefault()
    onChange(enabled[next].key)
    const el = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-key="${CSS.escape(enabled[next].key)}"]`)
    el?.focus()
  }
}

/**
 * Text tabs with an underline (panel tabs: Channels / Sources / AI...).
 * Arrow keys move between tabs (WAI-ARIA tabs pattern).
 */
export function Tabs<K extends string>({ items, value, onChange, ariaLabel, size = 'sm' }: {
  items: TabItem<K>[]
  value: K
  onChange: (key: K) => void
  ariaLabel: string
  size?: 'sm' | 'md'
}) {
  const onKey = useRovingKeys(items, value, onChange)
  return (
    <div className={`an-tabs an-tabs--${size}`} role="tablist" aria-label={ariaLabel} onKeyDown={onKey}>
      {items.map(t => (
        <button
          key={t.key}
          type="button"
          role="tab"
          data-key={t.key}
          aria-selected={t.key === value}
          tabIndex={t.key === value ? 0 : -1}
          disabled={t.disabled}
          className={'an-tab' + (t.key === value ? ' an-tab--on' : '')}
          onClick={() => onChange(t.key)}
        >
          {t.icon && <FontAwesomeIcon icon={t.icon} aria-hidden="true" />}
          {t.label}
          {t.count != null && <span className="an-tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/** Pill segmented control for switching a view mode (All / Landing / Exit; Day / Week). */
export function Segmented<K extends string>({ items, value, onChange, ariaLabel, size = 'md' }: {
  items: TabItem<K>[]
  value: K
  onChange: (key: K) => void
  ariaLabel: string
  size?: 'sm' | 'md'
}) {
  const onKey = useRovingKeys(items, value, onChange)
  return (
    <div className={`an-seg an-seg--${size}`} role="radiogroup" aria-label={ariaLabel} onKeyDown={onKey}>
      {items.map(t => (
        <button
          key={t.key}
          type="button"
          role="radio"
          data-key={t.key}
          aria-checked={t.key === value}
          tabIndex={t.key === value ? 0 : -1}
          disabled={t.disabled}
          className={'an-seg-btn' + (t.key === value ? ' an-seg-btn--on' : '')}
          onClick={() => onChange(t.key)}
        >
          {t.icon && <FontAwesomeIcon icon={t.icon} aria-hidden="true" />}
          {t.label}
          {t.count != null && <span className="an-tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ── SearchInput ────────────────────────────────────────────────────────── */

/**
 * Search box with a magnifier and a clear button. Calls onChange after
 * `debounce` ms of no typing (default 250) - wire it to a URL param with
 * `q.set({ q: v }, { replace: true })` so typing doesn't spam history.
 */
export function SearchInput({ value, onChange, placeholder = 'Search', debounce = 250, ariaLabel, autoFocus }: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounce?: number
  ariaLabel?: string
  autoFocus?: boolean
}) {
  const [text, setText] = useState(value)
  const [synced, setSynced] = useState(value)
  // Follow outside changes (back button, "clear filters") without clobbering typing.
  if (value !== synced) { setSynced(value); setText(value) }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cb = useRef(onChange)
  useEffect(() => { cb.current = onChange })
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const update = (v: string, immediate = false) => {
    setText(v)
    if (timer.current) clearTimeout(timer.current)
    if (immediate) cb.current(v)
    else timer.current = setTimeout(() => cb.current(v), debounce)
  }

  return (
    <div className="an-search">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="an-search-icon" aria-hidden="true" />
      <input
        type="search"
        className="an-input"
        value={text}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoFocus={autoFocus}
        onChange={e => update(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') update(text, true)
          if (e.key === 'Escape' && text) { e.preventDefault(); update('', true) }
        }}
      />
      {text && (
        <button type="button" className="an-search-clear" aria-label="Clear search" onClick={() => update('', true)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  )
}
