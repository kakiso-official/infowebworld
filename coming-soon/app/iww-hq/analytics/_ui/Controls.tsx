'use client'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRotateRight, faCalendarDays, faCheck, faChevronDown, faCodeCompare, faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { MAX_RANGE_DAYS, type RealtimeReport } from '@/lib/analytics/types'
import { addDaysIso, fmtCompact, fmtTime, todayInTz } from '../_lib/format'
import { FILTER_LABELS, filterValueLabel } from '../_lib/labels'
import { COMPARE_OPTIONS, RANGE_OPTIONS, isActiveRoute, useAnalyticsQuery } from '../_lib/state'
import { invalidateReports, useAnyReportLoading, useReport, useReportsUpdatedAt } from '../_lib/report'
import { useDismiss } from '../_lib/hooks'
import { ANALYTICS_NAV } from '../_lib/nav'
import { sectionHref } from '../_lib/links'
import { LiveDot } from './Badges'

/* ── MenuSelect: button + popover list (single choice) ──────────────────── */

export interface MenuOption<K extends string> {
  value: K
  label: ReactNode
  /** Muted second line. */
  description?: ReactNode
}

/**
 * A compact dropdown: a button showing the current choice, and a popover of
 * rows with a check on the selected one (presets as rows - nobody fights a
 * calendar grid for "last 30 days"). Arrow keys move, Enter picks, Escape
 * closes and returns focus. `footer` renders under the rows (custom range).
 */
export function MenuSelect<K extends string>({ value, options, onChange, buttonLabel, icon, ariaLabel, footer, align = 'left', className }: {
  value: K | null
  options: MenuOption<K>[]
  onChange: (value: K) => void
  /** Text on the button (defaults to the selected option's label). */
  buttonLabel?: ReactNode
  icon?: IconDefinition
  ariaLabel: string
  footer?: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const listId = useId()
  const close = useCallback(() => setOpen(false), [])
  const closeAndFocus = useCallback(() => { setOpen(false); btnRef.current?.focus() }, [])
  useDismiss(wrapRef, open, close)

  // When the popover closes and focus fell to <body> (its focused row/input
  // was removed), give focus back to the trigger so keyboard users stay put.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open && (!document.activeElement || document.activeElement === document.body)) {
      btnRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  // Focus the selected row when the menu opens.
  useEffect(() => {
    if (!open) return
    const el = wrapRef.current?.querySelector<HTMLElement>('[aria-checked="true"]') ?? wrapRef.current?.querySelector<HTMLElement>('[role="menuitemradio"]')
    el?.focus()
  }, [open])

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Keys inside the footer form (date inputs) belong to those inputs.
    if (!(e.target as HTMLElement).matches('[role="menuitemradio"]')) {
      if (e.key === 'Escape') { e.preventDefault(); closeAndFocus() }
      return
    }
    const items = [...(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus() }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus() }
    else if (e.key === 'Escape') { e.preventDefault(); closeAndFocus() }
    else if (e.key === 'Tab') close()
  }

  const selected = options.find(o => o.value === value)
  return (
    <div className={'an-menu ' + (className ?? '')} ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className={'an-ctl' + (open ? ' an-ctl--open' : '')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true) } }}
      >
        {icon && <FontAwesomeIcon icon={icon} className="an-ctl-icon" aria-hidden="true" />}
        <span className="an-ctl-text">{buttonLabel ?? selected?.label ?? 'Choose'}</span>
        <FontAwesomeIcon icon={faChevronDown} className="an-ctl-caret" aria-hidden="true" />
      </button>
      {open && (
        <div className={'an-pop an-pop--' + align} role="menu" id={listId} aria-label={ariaLabel} onKeyDown={onMenuKey}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              role="menuitemradio"
              aria-checked={o.value === value}
              className={'an-pop-item' + (o.value === value ? ' an-pop-item--on' : '')}
              onClick={() => { onChange(o.value); closeAndFocus() }}
            >
              <span className="an-pop-check" aria-hidden="true">{o.value === value && <FontAwesomeIcon icon={faCheck} />}</span>
              <span className="an-pop-text">
                <span>{o.label}</span>
                {o.description && <span className="an-pop-desc">{o.description}</span>}
              </span>
            </button>
          ))}
          {footer && <div className="an-pop-foot">{footer(close)}</div>}
        </div>
      )}
    </div>
  )
}

/* ── Date range ─────────────────────────────────────────────────────────── */

/** Custom from/to form shown under the presets. */
function CustomRange({ close }: { close: () => void }) {
  const q = useAnalyticsQuery()
  const today = todayInTz(q.tz)
  const minDay = addDaysIso(today, -(MAX_RANGE_DAYS - 1))
  const [from, setFrom] = useState(q.from ?? addDaysIso(today, -27))
  const [to, setTo] = useState(q.to ?? today)
  const valid = !!from && !!to && from <= to && from >= minDay && to <= today
  return (
    <form
      className="an-custom"
      onSubmit={e => {
        e.preventDefault()
        if (!valid) return
        q.set({ from, to, range: null })
        close()
      }}
    >
      <div className="an-custom-title">Custom range</div>
      <div className="an-custom-row">
        <label className="an-field">
          <span>From</span>
          <input type="date" className="an-input" value={from} min={minDay} max={today} onChange={e => setFrom(e.target.value)} required />
        </label>
        <label className="an-field">
          <span>To</span>
          <input type="date" className="an-input" value={to} min={minDay} max={today} onChange={e => setTo(e.target.value)} required />
        </label>
      </div>
      {!valid && from && to && <div className="an-custom-err">Pick a start on or before the end, within the last {MAX_RANGE_DAYS} days.</div>}
      <button type="submit" className="an-btn an-btn--primary an-btn--sm" disabled={!valid}>Apply</button>
    </form>
  )
}

/** Preset date ranges + a custom from/to. Writes ?range= or ?from=&to= to the URL. */
export function DateRangePicker() {
  const q = useAnalyticsQuery()
  return (
    <MenuSelect
      value={q.range === 'custom' ? null : q.range}
      options={RANGE_OPTIONS.map(o => ({ value: o.value, label: o.label, description: o.value === 'all' ? `Up to ${MAX_RANGE_DAYS} days` : undefined }))}
      onChange={v => q.set({ range: v, from: null, to: null })}
      buttonLabel={q.rangeLabel}
      icon={faCalendarDays}
      ariaLabel={`Date range: ${q.rangeLabel}`}
      footer={close => <CustomRange close={close} />}
      className="an-menu--range"
    />
  )
}

/** Comparison period: previous period / same period last year / none. */
export function CompareSelect() {
  const q = useAnalyticsQuery()
  const cur = COMPARE_OPTIONS.find(o => o.value === q.compare) ?? COMPARE_OPTIONS[0]
  return (
    <MenuSelect
      value={q.compare}
      options={COMPARE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
      onChange={v => q.set({ compare: v === 'previous' ? null : v })}
      buttonLabel={cur.short}
      icon={faCodeCompare}
      ariaLabel={`Comparison: ${cur.label}`}
    />
  )
}

/* ── Filter chips ───────────────────────────────────────────────────────── */

/** Active filters as removable chips ("Channel: Organic search ×") + "Clear all". */
export function FilterChips() {
  const q = useAnalyticsQuery()
  if (!q.filterList.length) return null
  return (
    <div className="an-chips" role="list" aria-label="Active filters">
      {q.filterList.map(f => {
        const text = `${FILTER_LABELS[f.key]}: ${filterValueLabel(f.key, f.value)}`
        return (
          <span key={f.key} role="listitem" className="an-chip" title={text}>
            <span className="an-chip-key">{FILTER_LABELS[f.key]}</span>
            <span className="an-chip-val">{filterValueLabel(f.key, f.value)}</span>
            <button type="button" className="an-chip-x" aria-label={`Remove filter ${text}`} onClick={() => q.removeFilter(f.key)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </span>
        )
      })}
      {q.filterList.length > 1 && (
        <button type="button" className="an-chip-clear" onClick={q.clearFilters}>Clear all</button>
      )}
    </div>
  )
}

/* ── Refresh + live pill ────────────────────────────────────────────────── */

/** "Updated 12:04 · ⟳" - re-fetches every report on the page (bypassing the 60 s cache). */
export function RefreshControl() {
  const q = useAnalyticsQuery()
  const updatedAt = useReportsUpdatedAt()
  const loading = useAnyReportLoading()
  return (
    <div className="an-refresh">
      {updatedAt > 0 && <span className="an-refresh-at">Updated {fmtTime(updatedAt, q.tz)}</span>}
      <button
        type="button"
        className={'an-btn an-btn--icon an-btn--ghost' + (loading ? ' an-spin' : '')}
        onClick={invalidateReports}
        aria-label="Refresh all numbers"
        title="Refresh"
      >
        <FontAwesomeIcon icon={faArrowRotateRight} />
      </button>
    </div>
  )
}

/** "● 7 online" - site-wide visitors active in the last 5 minutes; polls every 30 s; links to Realtime. */
export function LivePill() {
  const q = useAnalyticsQuery()
  const r = useReport<RealtimeReport>('realtime', undefined, { ignoreRange: true, ignoreFilters: true, poll: 30_000 })
  if (r.needsMigration || (r.error && !r.data)) return null
  const n = r.data?.activeNow
  return (
    <Link href={q.href(sectionHref('realtime'))} className="an-livepill" title="Visitors active in the last 5 minutes - open Realtime">
      <LiveDot />
      <b>{n == null ? '…' : fmtCompact(n)}</b> online
    </Link>
  )
}

/* ── Sub-nav + control bar (the layout's chrome) ────────────────────────── */

/** The analytics section tabs. Scrolls sideways on phones; keeps range + filters on every link. */
export function SubNav() {
  const q = useAnalyticsQuery()
  const pathname = usePathname() || ''
  const navRef = useRef<HTMLElement | null>(null)
  // Bring the active tab into view on phones, where the bar scrolls sideways.
  useEffect(() => {
    const el = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')
    const nav = navRef.current
    if (el && nav && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = el.offsetLeft - nav.clientWidth / 2 + el.offsetWidth / 2
    }
  }, [pathname])
  return (
    <nav className="an-subnav" aria-label="Analytics sections" ref={navRef}>
      {ANALYTICS_NAV.map(s => {
        // Visitor profiles (/visitors/[id]) live under the Visitors tab.
        const on = isActiveRoute(pathname, s.route) || (s.route === 'sessions' && isActiveRoute(pathname, 'visitors'))
        return (
          <Link
            key={s.route || 'overview'}
            href={q.href(sectionHref(s.route))}
            className={'an-subnav-item' + (on ? ' an-subnav-item--on' : '')}
            aria-current={on ? 'page' : undefined}
          >
            <FontAwesomeIcon icon={s.icon} aria-hidden="true" />
            <span>{s.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Sticky bar under the sub-nav: range + comparison (hidden on live pages
 * such as Realtime/Settings), refresh, live pill, then the filter chips.
 */
export function ControlBar({ route }: { route: string }) {
  const q = useAnalyticsQuery()
  const live = !!ANALYTICS_NAV.find(s => s.route === route)?.live
  return (
    <div className="an-bar" role="region" aria-label="Report controls">
      <div className="an-bar-row">
        {!live ? (
          <>
            <DateRangePicker />
            <CompareSelect />
          </>
        ) : (
          <span className="an-bar-note">
            {route === 'realtime' ? 'Live - the last 30 minutes, ignoring the date range' : 'Settings apply to every analytics page'}
          </span>
        )}
        <div className="an-bar-spacer" />
        <RefreshControl />
        {route !== 'realtime' && <LivePill />}
      </div>
      {q.filterList.length > 0 && <FilterChips />}
    </div>
  )
}
