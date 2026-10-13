'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons'
import type { SessionSummary } from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import { fmtDateTime, fmtDuration, fmtNumber } from '../../_lib/format'
import { sessionHref } from '../../_lib/links'
import { useAnalyticsQuery } from '../../_lib/state'
import { CountryFlag, DeviceIcon, EventIcon, SourceIcon } from '../Icons'
import { Badge, LiveDot } from '../Badges'
import { InfoTip } from '../InfoTip'
import { FLAG_EVENTS, placeText } from './util'

/* Small building blocks shared by the Visitors list, one visit, one visitor
   and Signups: conversion icons, a compact visit list, stat tiles and a
   label/value list. */

/** The key things a visit did, as icons with names (empty when none). */
export function ConversionIcons({ flags, keyEvents, compact }: {
  flags: SessionSummary['flags']
  keyEvents?: number
  compact?: boolean
}) {
  const on = FLAG_EVENTS.filter(f => flags[f.flag] && (f.flag !== 'login' || !compact))
  if (!on.length) {
    return keyEvents ? (
      <span className="an-conv" title={`${keyEvents} key action${keyEvents === 1 ? '' : 's'}`}>
        <span className="an-conv-ico an-conv-ico--key"><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span>
        <span className="an-sr">{keyEvents} key actions</span>
      </span>
    ) : <span className="an-muted" aria-label="No key actions">–</span>
  }
  return (
    <span className="an-conv">
      {on.map(f => (
        <span key={f.flag} className={`an-conv-ico an-conv-ico--${f.flag}`} title={f.label}>
          <EventIcon name={f.event} titled={false} />
          <span className="an-sr">{f.label}</span>
        </span>
      ))}
    </span>
  )
}

/** Label + value tile with an explanation (for counts that are not METRICS, e.g. a visitor's totals). */
export function StatTile({ label, value, info, sub, tone }: {
  label: string
  value: ReactNode
  info?: string
  sub?: ReactNode
  tone?: 'good' | 'bad'
}) {
  return (
    <div className={'an-kpi an-stat' + (tone ? ` an-stat--${tone}` : '')}>
      <div className="an-kpi-label">
        <span>{label}</span>
        {info && <InfoTip title={label} text={info} />}
      </div>
      <div className="an-kpi-value">{value}</div>
      {sub != null && <div className="an-kpi-foot"><span className="an-kpi-hint">{sub}</span></div>}
    </div>
  )
}

/** Definition list of label / value pairs (meta grids). Rows with an empty value are skipped. */
export function MetaList({ items }: { items: { label: string; value: ReactNode; info?: string }[] }) {
  const shown = items.filter(i => i.value != null && i.value !== '' && i.value !== false)
  return (
    <dl className="an-meta">
      {shown.map(i => (
        <div key={i.label} className="an-meta-row">
          <dt>
            {i.label}
            {i.info && <InfoTip title={i.label} text={i.info} />}
          </dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * A compact list of visits (one visitor's other visits, a visitor's history):
 * when, where from, landing page -> exit page, pages, time engaged, what
 * they did. Each row opens that visit's timeline.
 */
export function VisitList({ sessions, empty }: { sessions: SessionSummary[]; empty?: ReactNode }) {
  const q = useAnalyticsQuery()
  if (!sessions.length) return <>{empty ?? null}</>
  return (
    <ol className="an-visits">
      {sessions.map(s => (
        <li key={s.id}>
          <Link href={q.href(sessionHref(s.id))} className="an-visit">
            <span className="an-visit-when">
              <span className="an-visit-date">{fmtDateTime(s.startedAt, q.tz)}</span>
              {s.isLive && <LiveDot label="Live" />}
            </span>
            <span className="an-visit-src" title={sourceLabel(s.source)}>
              <SourceIcon source={s.source} channel={s.channel} titled={false} />
              <span className="an-visit-src-name">{sourceLabel(s.source)}</span>
            </span>
            <span className="an-visit-path">
              <span className="an-mono">{s.entryPath}</span>
              {s.exitPath !== s.entryPath && (
                <>
                  <FontAwesomeIcon icon={faArrowRight} className="an-visit-arrow" aria-hidden="true" />
                  <span className="an-sr"> then left from </span>
                  <span className="an-mono">{s.exitPath}</span>
                </>
              )}
            </span>
            <span className="an-visit-stats">
              <span title="Pages viewed">{fmtNumber(s.pageviews)} {s.pageviews === 1 ? 'page' : 'pages'}</span>
              <span title="Time engaged">{fmtDuration(s.engagedMs)}</span>
            </span>
            <span className="an-visit-env" title={`${placeText(s.city, s.region, s.country)} · ${s.deviceType}`}>
              <CountryFlag code={s.country} decorative />
              <DeviceIcon device={s.deviceType} titled={false} />
            </span>
            <span className="an-visit-conv">
              {(s.keyEvents > 0 || FLAG_EVENTS.some(f => f.flag !== 'login' && s.flags[f.flag])) && (
                <ConversionIcons flags={s.flags} keyEvents={s.keyEvents} compact />
              )}
              {!s.isEngaged && <Badge tone="neutral" title="One page, under 10 seconds of active time, no key action">Bounced</Badge>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
