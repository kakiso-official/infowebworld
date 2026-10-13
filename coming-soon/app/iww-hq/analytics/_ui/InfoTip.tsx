'use client'
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {
  CHANNEL_META, EVENTS, METRICS, PAGE_TYPE_META, VITAL_THRESHOLDS,
  type Channel, type PageType,
} from '@/lib/analytics/types'
import { useIsoLayoutEffect } from '../_lib/hooks'
import { humanize } from '../_lib/labels'

/** Any key of METRICS (visitors, sessions, bounceRate, views, exitRate...). */
export type MetricKey = keyof typeof METRICS
export type VitalKey = keyof typeof VITAL_THRESHOLDS

export interface InfoTipProps {
  /** Definition from METRICS. */
  metric?: MetricKey
  /** Definition from CHANNEL_META. */
  channel?: Channel | string
  /** Definition from PAGE_TYPE_META. */
  pageType?: PageType | string
  /** Definition from EVENTS. */
  event?: string
  /** Definition + good/poor thresholds from VITAL_THRESHOLDS. */
  vital?: VitalKey
  /** Free-form title/text (used when no key above is given, or to override). */
  title?: ReactNode
  text?: ReactNode
  /** Accessible name of the trigger; defaults to "About <title>". */
  label?: string
}

function fmtThreshold(v: number, unit: string): string {
  if (!unit) return String(v)
  return v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, '')} s` : `${v} ms`
}

/** Resolve the tooltip's title + body from whichever key was passed. */
function resolve(p: InfoTipProps): { title: ReactNode; text: ReactNode } {
  if (p.metric && METRICS[p.metric]) {
    const m = METRICS[p.metric]
    return { title: p.title ?? m.label, text: p.text ?? m.description }
  }
  if (p.channel) {
    const c = CHANNEL_META[p.channel as Channel]
    return { title: p.title ?? c?.label ?? humanize(p.channel), text: p.text ?? c?.description ?? 'A traffic channel.' }
  }
  if (p.pageType) {
    const t = PAGE_TYPE_META[p.pageType as PageType]
    return { title: p.title ?? t?.label ?? humanize(p.pageType), text: p.text ?? t?.description ?? 'A kind of page.' }
  }
  if (p.event) {
    const e = (EVENTS as Record<string, { label: string; description: string; isKey: boolean }>)[p.event]
    return {
      title: p.title ?? e?.label ?? humanize(p.event),
      text: p.text ?? (e
        ? <>{e.description}{e.isKey ? <><br /><b>Key action</b> - counts as a conversion.</> : null}</>
        : 'A custom event sent from a data-track attribute or track().'),
    }
  }
  if (p.vital) {
    const v = VITAL_THRESHOLDS[p.vital]
    return {
      title: p.title ?? `${v.label} (${v.short})`,
      text: p.text ?? (
        <>
          {v.description}<br />
          Good: under {fmtThreshold(v.good, v.unit)} · Poor: over {fmtThreshold(v.poor, v.unit)}.
          Scored at the 75th percentile - 3 of 4 visits were at least this fast.
        </>
      ),
    }
  }
  return { title: p.title ?? '', text: p.text ?? '' }
}

/**
 * A small ⓘ button that explains a metric, channel, page type, event or web
 * vital in plain English. Opens on hover, keyboard focus and tap; Escape
 * closes. Positioned `fixed`, so it is never clipped by scrolling tables.
 *
 *   <InfoTip metric="bounceRate" />
 *   <InfoTip title="How we decide the source" text="..." />
 */
export function InfoTip(props: InfoTipProps) {
  const { title, text } = resolve(props)
  const id = useId()
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const popRef = useRef<HTMLSpanElement | null>(null)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setOpen(true)
  }, [])
  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { setOpen(false); setPinned(false) }, 80)
  }, [])

  // Place below the trigger (above when there is no room), clamped to the viewport.
  useIsoLayoutEffect(() => {
    if (!open) { setPos(null); return }
    const b = btnRef.current?.getBoundingClientRect()
    const pop = popRef.current
    if (!b || !pop) return
    const w = pop.offsetWidth
    const h = pop.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = b.left + b.width / 2 - w / 2
    left = Math.max(8, Math.min(left, vw - w - 8))
    const above = b.bottom + 8 + h > vh - 8 && b.top - 8 - h > 8
    const top = above ? b.top - 8 - h : b.bottom + 8
    setPos({ top, left, above })
  }, [open])

  // A fixed popover would drift on scroll - close it instead.
  useEffect(() => {
    if (!open) return
    const close = () => { setOpen(false); setPinned(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onDown = (e: PointerEvent) => {
      if (!btnRef.current?.contains(e.target as Node) && !popRef.current?.contains(e.target as Node)) close()
    }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])

  if (!text && !title) return null
  const aria = props.label ?? (typeof title === 'string' && title ? `About ${title}` : 'More information')

  return (
    <span className="an-tip">
      <button
        ref={btnRef}
        type="button"
        className="an-tip-btn"
        aria-label={aria}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={() => { if (!pinned) hide() }}
        onFocus={show}
        onBlur={hide}
        onClick={e => {
          // Inside clickable rows/cards the tip must not trigger the row.
          e.stopPropagation()
          e.preventDefault()
          if (open && pinned) { setOpen(false); setPinned(false) } else { setPinned(true); show() }
        }}
      >
        <FontAwesomeIcon icon={faCircleInfo} />
      </button>
      {open && (
        <span
          ref={popRef}
          role="tooltip"
          id={id}
          className={'an-tip-pop' + (pos?.above ? ' an-tip-pop--above' : '')}
          style={pos ? { top: pos.top, left: pos.left } : { top: -9999, left: -9999 }}
          onMouseEnter={show}
          onMouseLeave={() => { if (!pinned) hide() }}
        >
          {title ? <span className="an-tip-title">{title}</span> : null}
          {text ? <span className="an-tip-text">{text}</span> : null}
        </span>
      )}
    </span>
  )
}
