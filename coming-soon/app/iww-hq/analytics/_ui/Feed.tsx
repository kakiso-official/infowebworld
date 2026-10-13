'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faArrowTrendUp, faArrowRight, faLightbulb, faTowerBroadcast, faUser } from '@fortawesome/free-solid-svg-icons'
import type { FeedItem, Insight } from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import { countryName, fmtRelative, fmtTimeSec } from '../_lib/format'
import { deviceLabel, eventLabel } from '../_lib/labels'
import { useAnalyticsQuery } from '../_lib/state'
import { sessionHref } from '../_lib/links'
import { useNow } from '../_lib/hooks'
import { CountryFlag, DeviceIcon, EventIcon, PageviewIcon, SourceIcon } from './Icons'
import { Badge } from './Badges'
import { EmptyState } from './States'

/** Stable React key for a feed item (the API has no id for the union). */
export function feedKey(f: FeedItem): string {
  return `${f.kind}|${f.ts}|${f.sessionId}|${f.name ?? ''}|${f.path ?? ''}|${f.target ?? ''}`
}

/**
 * Live activity list: time, flag, device, source and what happened (a page
 * view with its title, or an event such as "Website visit → acme.com").
 * Each item opens that visit's timeline. New items fade in (no motion under
 * prefers-reduced-motion).
 */
export function LiveFeed({ items, limit, compact, empty }: {
  items: FeedItem[]
  limit?: number
  /** Denser rows without the source column (Overview's "Right now"). */
  compact?: boolean
  empty?: ReactNode
}) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const list = limit ? items.slice(0, limit) : items
  if (!list.length) {
    return <>{empty ?? <EmptyState compact icon={faTowerBroadcast} title="Quiet right now" text="Page views and clicks appear here within seconds of happening." />}</>
  }
  // Two events can share every key field (e.g. two script errors in the same millisecond): suffix repeats.
  const seen = new Map<string, number>()
  return (
    <ol className={'an-feed' + (compact ? ' an-feed--compact' : '')} aria-label="Latest activity">
      {list.map(f => {
        const base = feedKey(f)
        const dup = seen.get(base) ?? 0
        seen.set(base, dup + 1)
        const isEvent = f.kind === 'event'
        const place = [f.city, countryName(f.country)].filter(Boolean).join(', ')
        const what = isEvent ? eventLabel(f.name) : (f.title || f.path || 'Page view')
        return (
          <li key={dup ? `${base}#${dup}` : base} className="an-feed-li">
            <Link href={q.href(sessionHref(f.sessionId))} className={'an-feed-item' + (isEvent ? ' an-feed-item--event' : '')}>
              <time className="an-feed-time" dateTime={f.ts} title={fmtTimeSec(f.ts, q.tz)}>
                {now ? fmtRelative(f.ts, now, q.tz) : fmtTimeSec(f.ts, q.tz)}
              </time>
              <span className="an-feed-who" title={`${place} · ${deviceLabel(f.deviceType)} · ${sourceLabel(f.source)}`}>
                <CountryFlag code={f.country} decorative />
                <DeviceIcon device={f.deviceType} />
                {!compact && <SourceIcon source={f.source} channel={f.channel} />}
              </span>
              <span className="an-feed-what">
                {isEvent ? <EventIcon name={f.name} /> : <PageviewIcon />}
                <span className="an-feed-text">
                  <span className="an-feed-main">{what}</span>
                  {isEvent
                    ? f.target && <span className="an-feed-sub">{f.target}</span>
                    : f.title && f.path && <span className="an-feed-sub an-mono">{f.path}</span>}
                </span>
              </span>
              <span className="an-feed-tags">
                {f.isNewVisitor && <Badge tone="info">New</Badge>}
                {f.userId != null && <Badge tone="accent" icon={faUser}>Account</Badge>}
              </span>
              <span className="an-sr">{` - ${place}, ${deviceLabel(f.deviceType)}, from ${sourceLabel(f.source)}. Open this visit.`}</span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * "What stands out" - the report's plain-English findings, each with a tone
 * icon (trend up = good, trend down = bad, bulb = neutral) and a "Show me"
 * link that keeps the current range + filters.
 */
export function InsightList({ insights, empty }: { insights: Insight[]; empty?: ReactNode }) {
  const q = useAnalyticsQuery()
  if (!insights.length) {
    return <>{empty ?? <p className="an-muted an-ins-empty">Nothing unusual stands out in this period.</p>}</>
  }
  return (
    <ul className="an-ins-list">
      {insights.map(i => (
        <li key={i.id} className={`an-ins an-ins--${i.tone}`}>
          <span className="an-ins-icon" aria-hidden="true">
            <FontAwesomeIcon icon={i.tone === 'good' ? faArrowTrendUp : i.tone === 'bad' ? faArrowTrendDown : faLightbulb} />
          </span>
          <span className="an-ins-text">
            <span className="an-sr">{i.tone === 'good' ? 'Good news: ' : i.tone === 'bad' ? 'Needs attention: ' : 'Note: '}</span>
            {i.text}
          </span>
          {i.href && (
            <Link href={q.href(i.href)} className="an-ins-link">
              Show me <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
