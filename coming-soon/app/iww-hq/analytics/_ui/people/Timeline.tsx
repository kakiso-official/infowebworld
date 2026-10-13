'use client'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRotateLeft, faArrowRotateRight, faArrowUpRightFromSquare, faFlagCheckered, faMagnifyingGlassChart,
  faServer, faStar, faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { VITAL_THRESHOLDS, type SessionDetailReport, type TimelineItem } from '@/lib/analytics/types'
import { fmtDuration, fmtNumber, fmtRelative, fmtTimeSec } from '../../_lib/format'
import { livePageHref, pageDetailHref } from '../../_lib/links'
import { useAnalyticsQuery } from '../../_lib/state'
import { useNow } from '../../_lib/hooks'
import { Badge, LiveDot, PageTypeBadge } from '../Badges'
import { EventIcon } from '../Icons'
import { InfoTip } from '../InfoTip'
import { fmtGap, fmtVital, isHttpUrl, vitalRating } from './util'

/* ═══════════════════════════════════════════════════════════════════════════
   SessionTimeline - one visit replayed top to bottom.

   Each page is a card on a vertical rail: when it was opened (and how long
   after the previous page), its title and path, page type, how long the
   visitor actively spent on it vs. how long the tab stayed on it, how far
   they scrolled, 404 / reload / back-button markers and its Web Vitals.
   What the visitor did on that page (clicks, searches, signups...) is
   nested under the card, with the seconds since the page opened. The rail
   ends with "still here" (live) or "left the site".
   ═══════════════════════════════════════════════════════════════════════════ */

type PageviewItem = Extract<TimelineItem, { kind: 'pageview' }>
type EventItem = Extract<TimelineItem, { kind: 'event' }>

interface Group { pv: PageviewItem | null; events: EventItem[] }

/** Events stay right after their pageview (the report already orders them that way). */
function groupItems(items: TimelineItem[]): Group[] {
  const groups: Group[] = []
  let cur: Group = { pv: null, events: [] }
  for (const it of items) {
    if (it.kind === 'pageview') {
      if (cur.pv || cur.events.length) groups.push(cur)
      cur = { pv: it, events: [] }
    } else {
      cur.events.push(it)
    }
  }
  if (cur.pv || cur.events.length) groups.push(cur)
  return groups
}

const NAV_LABEL: Record<string, { text: string; icon: typeof faArrowRotateLeft; tip: string }> = {
  reload: { text: 'Reloaded', icon: faArrowRotateRight, tip: 'The visitor reloaded this page.' },
  back_forward: { text: 'Back / forward', icon: faArrowRotateLeft, tip: 'Opened with the browser back or forward button.' },
  traverse: { text: 'Back / forward', icon: faArrowRotateLeft, tip: 'Opened with the browser back or forward button.' },
}

/** Props worth showing on an event chip (the ones not already shown elsewhere). */
function propChips(ev: EventItem): string[] {
  const p = ev.props
  if (!p) return []
  const out: string[] = []
  for (const [k, v] of Object.entries(p)) {
    if (v == null || v === '' || typeof v === 'object') continue
    if (k === 'results' && ev.name === 'search') continue
    if (k === 'listing' && ev.target === v) continue
    out.push(`${k.replace(/_/g, ' ')}: ${String(v)}`)
    if (out.length >= 4) break
  }
  return out
}

export function SessionTimeline({ items, session }: {
  items: TimelineItem[]
  session: SessionDetailReport['session']
}) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const groups = groupItems(items)
  const pvs = groups.map(g => g.pv).filter((p): p is PageviewItem => !!p)
  const lastSeenMs = Date.parse(session.lastSeenAt)

  return (
    <ol className="an-tl" aria-label="Pages and actions in this visit, oldest first">
      {groups.map((g, gi) => {
        if (!g.pv) {
          return (
            <li key={`lead-${gi}`} className="an-tl-item an-tl-item--lead">
              <span className="an-tl-dot an-tl-dot--event" aria-hidden="true" />
              <div className="an-tl-lead">
                <div className="an-tl-lead-note">Before the first recorded page</div>
                <EventList events={g.events} baseMs={null} />
              </div>
            </li>
          )
        }
        const pv = g.pv
        const idx = pvs.indexOf(pv)
        const startMs = Date.parse(pv.ts)
        const prev = idx > 0 ? pvs[idx - 1] : null
        const next = pvs[idx + 1] ?? null
        const gapMs = prev ? startMs - Date.parse(prev.ts) : null
        // Wall-clock time on the page: until the next page, or (last page) until the visit's last activity.
        const onPageMs = next ? Date.parse(next.ts) - startMs : Math.max(0, lastSeenMs - startMs)
        const is404 = pv.status === 404 || pv.pageType === 'not_found'
        const nav = pv.navType ? NAV_LABEL[pv.navType] : undefined
        const engagedShare = onPageMs > 0 ? Math.min(1, pv.engagedMs / onPageMs) : 0

        return (
          <li key={pv.id} className={'an-tl-item' + (is404 ? ' an-tl-item--404' : '')}>
            <span className="an-tl-dot" aria-hidden="true">{pv.seq || idx + 1}</span>
            <article className="an-tl-card" aria-label={`Page ${pv.seq || idx + 1}: ${pv.title || pv.path}`}>
              <header className="an-tl-head">
                <time className="an-tl-time" dateTime={pv.ts}>{fmtTimeSec(pv.ts, q.tz)}</time>
                {gapMs != null && fmtGap(gapMs) && <span className="an-tl-gap" title="Time since the previous page was opened">{fmtGap(gapMs)}</span>}
                {idx === 0 && <Badge tone="info">Landing page</Badge>}
                {idx === pvs.length - 1 && pvs.length > 1 && !session.isLive && <Badge tone="neutral">Exit page</Badge>}
                {is404
                  ? <Badge tone="bad" icon={faTriangleExclamation}>404 not found</Badge>
                  : <PageTypeBadge pageType={pv.pageType} />}
                {nav && <Badge tone="neutral" icon={nav.icon} title={nav.tip}>{nav.text}</Badge>}
              </header>

              <div className="an-tl-page">
                <Link href={q.href(pageDetailHref(pv.path))} className="an-tl-title" title="Page details">
                  {pv.title || <span className="an-mono">{pv.path}</span>}
                </Link>
                <div className="an-tl-path">
                  {pv.title && <span className="an-mono">{pv.path}</span>}
                  {pv.query && <span className="an-tl-query an-mono" title="Query string (only useful keys are kept)">?{pv.query}</span>}
                  <span className="an-tl-acts">
                    <Link href={q.href(pageDetailHref(pv.path))} className="an-bl-act" aria-label={`Details for ${pv.path}`} title="Page details">
                      <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                    </Link>
                    <a href={livePageHref(pv.path)} target="_blank" rel="noopener noreferrer" className="an-bl-act" aria-label={`Open ${pv.path} in a new tab`} title="Open the live page">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  </span>
                </div>
              </div>

              <div className="an-tl-stats">
                <span className="an-tl-stat">
                  <span className="an-tl-stat-k">Engaged <InfoTip title="Engaged time" text="Time the page was visible, focused and in use (no idle tabs). Counts towards the visit's time engaged." /></span>
                  <b>{fmtDuration(pv.engagedMs)}</b>
                  {onPageMs > 0 && (
                    <span className="an-tl-meter" title={`${Math.round(engagedShare * 100)}% of the time on the page was active`} aria-hidden="true">
                      <i style={{ width: `${engagedShare * 100}%` }} />
                    </span>
                  )}
                </span>
                <span className="an-tl-stat">
                  <span className="an-tl-stat-k">On page <InfoTip title="Time on page" text="Clock time from opening this page to opening the next one (or, on the last page, to the visit's last activity). Includes idle time and other tabs." /></span>
                  <b>{next || !session.isLive ? fmtDuration(onPageMs) : `${fmtDuration(onPageMs)}+`}</b>
                </span>
                <span className="an-tl-stat">
                  <span className="an-tl-stat-k">Scrolled <InfoTip metric="avgScrollPct" title="Scroll depth" text="How far down this page the visitor scrolled (100% = the bottom)." /></span>
                  <b>{pv.scrollPct}%</b>
                  <span className="an-tl-meter" aria-hidden="true"><i style={{ width: `${Math.min(100, pv.scrollPct)}%` }} /></span>
                </span>
                {pv.vitals && <VitalChips vitals={pv.vitals} />}
              </div>

              {g.events.length > 0 && <EventList events={g.events} baseMs={startMs} />}
            </article>
          </li>
        )
      })}

      <li className={'an-tl-item an-tl-item--end' + (session.isLive ? ' an-tl-item--live' : '')}>
        <span className="an-tl-dot an-tl-dot--end" aria-hidden="true">
          {!session.isLive && <FontAwesomeIcon icon={faFlagCheckered} />}
        </span>
        <div className="an-tl-endtext">
          {session.isLive ? (
            <>
              <LiveDot label="Still on the site" />
              <span className="an-muted"> · last activity {now ? fmtRelative(session.lastSeenAt, now, q.tz) : fmtTimeSec(session.lastSeenAt, q.tz)}</span>
            </>
          ) : (
            <>
              <b>Left the site</b>
              <span className="an-muted"> · last activity {fmtTimeSec(session.lastSeenAt, q.tz)}, {fmtDuration(session.durationMs)} after arriving</span>
            </>
          )}
        </div>
      </li>
    </ol>
  )
}

function VitalChips({ vitals }: { vitals: NonNullable<PageviewItem['vitals']> }) {
  const list = (['lcp', 'inp', 'cls'] as const).filter(k => vitals[k] != null)
  if (!list.length) return null
  return (
    <span className="an-tl-stat an-tl-vitals">
      <span className="an-tl-stat-k">Speed <InfoTip title="Web Vitals for this page load" text="Measured in this visitor's browser. LCP = main content visible, INP = response to taps and clicks, CLS = layout jumping. Green is good, amber needs improvement, red is poor (Google's thresholds)." /></span>
      <span className="an-vchips">
        {list.map(k => {
          const v = vitals[k]!
          const rating = vitalRating(k, v)
          const word = rating === 'good' ? 'good' : rating === 'poor' ? 'poor' : 'needs improvement'
          return (
            <span key={k} className={`an-vchip an-vchip--${rating}`} title={`${VITAL_THRESHOLDS[k].label}: ${fmtVital(k, v)} (${word})`}>
              <span className="an-vchip-k">{VITAL_THRESHOLDS[k].short}</span> {fmtVital(k, v)}
              <span className="an-sr"> ({word})</span>
            </span>
          )
        })}
      </span>
    </span>
  )
}

function EventList({ events, baseMs }: { events: EventItem[]; baseMs: number | null }) {
  const q = useAnalyticsQuery()
  return (
    <ul className="an-tl-events" aria-label="Actions on this page">
      {events.map(ev => {
        const offset = baseMs != null ? Date.parse(ev.ts) - baseMs : null
        const chips = propChips(ev)
        const isUrl = isHttpUrl(ev.target)
        return (
          <li key={ev.id} className={`an-tl-ev an-tl-ev--${ev.category}` + (ev.isKey ? ' an-tl-ev--key' : '')}>
            <span className="an-tl-ev-icon" aria-hidden="true"><EventIcon name={ev.name} titled={false} /></span>
            <div className="an-tl-ev-body">
              <div className="an-tl-ev-line">
                <b className="an-tl-ev-label">{ev.label}</b>
                {ev.isKey && (
                  <span className="an-tl-ev-star" title="Key action - counts as a conversion">
                    <FontAwesomeIcon icon={faStar} aria-hidden="true" /><span className="an-sr">Key action</span>
                  </span>
                )}
                <InfoTip event={ev.name} />
                {ev.origin === 'server' && (
                  <Badge tone="neutral" icon={faServer} title="Recorded by the server when the action succeeded (cannot be faked from the browser).">Confirmed</Badge>
                )}
                <span className="an-tl-ev-time" title={fmtTimeSec(ev.ts, q.tz)}>
                  {offset != null && offset >= 500 ? `${fmtGap(offset)} on page` : fmtTimeSec(ev.ts, q.tz)}
                </span>
              </div>
              {(ev.target || ev.text || ev.value != null || chips.length > 0) && (
                <div className="an-tl-ev-detail">
                  {ev.target && (isUrl
                    ? <a href={ev.target} target="_blank" rel="noopener noreferrer nofollow" className="an-tl-ev-target an-mono">{ev.target}</a>
                    : <span className="an-tl-ev-target an-mono">{ev.name === 'search' ? `"${ev.target}"` : ev.target}</span>)}
                  {ev.text && ev.text !== ev.target && <span className="an-tl-ev-text">“{ev.text}”</span>}
                  {ev.value != null && (
                    <span className="an-tl-ev-chip">
                      {ev.name === 'search' ? `${fmtNumber(ev.value)} results` : ev.name === 'review_submitted' ? `${ev.value} stars` : ev.name === 'purchase' ? `amount ${ev.value.toFixed(2)}` : `value ${fmtNumber(ev.value)}`}
                    </span>
                  )}
                  {chips.map(c => <span key={c} className="an-tl-ev-chip">{c}</span>)}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
