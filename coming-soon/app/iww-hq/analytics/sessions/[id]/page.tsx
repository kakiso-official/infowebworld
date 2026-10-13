'use client'
import { use, type ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faClockRotateLeft, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { SessionDetailReport } from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import '../../../../styles/analytics-people.css'
import {
  Badge, BrowserIcon, ChannelBadge, CountryFlag, DeviceIcon, EmptyState, ErrorState, InfoTip, LiveDot,
  MigrationNotice, OsIcon, PageHeader, Panel, PanelGrid, Skeleton, SourceIcon,
  countryName, deviceLabel, fmtDate, fmtDateTime, fmtDuration, fmtNumber, fmtRelative, fmtTimeSec, languageName,
  useAnalyticsQuery, useNow, useReport, visitorHref,
} from '../../_ui'
import {
  ConversionIcons, MetaList, SessionTimeline, VisitList, firstTouchPhrase, isHttpUrl, plural, sourceText,
} from '../../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - one visit, replayed. Header answers "who, from where, what
   happened" in one sentence; then the facts (source, location, device,
   visit totals), the page-by-page timeline with every action nested under
   the page it happened on, and the visitor's other visits.
   Shown in full regardless of the date range and filters (a timeline cut
   at the range edge would mislead), so the report ignores both.
   Live visits refresh every 15 seconds.
   ════════════════════════════════════════════════════════════════════════ */

const LIVE_POLL_MS = 15_000

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const validId = /^\d{1,15}$/.test(id)
  const r = useReport<SessionDetailReport>('session', { id }, {
    ignoreRange: true,
    ignoreFilters: true,
    enabled: validId,
  })
  // Poll only while the visit is live; the hook re-reads the flag every answer.
  const live = !!r.data?.session.isLive && r.data.session.id === Number(id)
  useReport<SessionDetailReport>('session', { id }, { ignoreRange: true, ignoreFilters: true, enabled: validId && live, poll: LIVE_POLL_MS })

  const back = { href: 'sessions', label: 'Visitors' }

  if (!validId) {
    return (
      <>
        <PageHeader title="Visit not found" back={back} />
        <EmptyState icon={faUsers} title="This link does not point to a visit" text="Visit links look like /iww-hq/analytics/sessions/1234. Open one from the Visitors list." />
      </>
    )
  }
  if (r.needsMigration) return <><PageHeader title="Visit" back={back} /><MigrationNotice missingTables={r.missingTables} /></>
  const data = r.data && r.data.session.id === Number(id) ? r.data : undefined
  if (!data) {
    if (r.error) {
      return (
        <>
          <PageHeader title="Visit" back={back} />
          <ErrorState
            message={<>{r.error} If the visit is older than about two years it has been removed by the retention clean-up; otherwise retry.</>}
            onRetry={r.reload}
          />
        </>
      )
    }
    return (
      <>
        <PageHeader title="Visit" back={back} />
        <Skeleton variant="block" height={150} />
        <Skeleton variant="block" height={420} />
      </>
    )
  }
  // Live polling refreshes quietly; only a real reload dims the page.
  return <SessionBody data={data} refreshing={r.refreshing && !live} />
}

function SessionBody({ data, refreshing }: { data: SessionDetailReport; refreshing: boolean }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const s = data.session
  const v = data.visitor
  const pageviews = data.items.filter(i => i.kind === 'pageview').length
  const keyActions = data.items.filter(i => i.kind === 'event' && i.isKey)

  // One or two sentences that tell the whole visit.
  const who = s.userEmail ? s.userEmail : s.isNew ? 'A new visitor' : 'A returning visitor'
  const did = [...new Set(keyActions.map(k => (k.kind === 'event' ? k.label : '')))].filter(Boolean)
  const story = (
    <>
      {who} from <b>{sourceText(s.channel, s.source)}</b> landed on <span className="an-mono">{s.entryPath}</span> and
      {' '}viewed {plural(s.pageviews || pageviews, 'page')} in {fmtDuration(s.durationMs)}.
      {did.length > 0 && <> Key actions: <b>{did.slice(0, 4).join(', ')}</b>.</>}
      {did.length === 0 && !s.isEngaged && <> Left quickly (bounced).</>}
    </>
  )

  return (
    <div className={'an-rv' + (refreshing ? ' an-rv--refreshing' : '')}>
      <PageHeader
        back={{ href: 'sessions', label: 'Visitors' }}
        title={(
          <span className="an-pp-title">
            Visit on {fmtDateTime(s.startedAt, q.tz)}
            {s.isLive && <LiveDot label="Live" />}
          </span>
        )}
        subtitle={story}
        meta={(
          <>
            <span>Visit #{s.id}</span>
            <span>{s.isLive ? `Last activity ${now ? fmtRelative(s.lastSeenAt, now, q.tz) : fmtTimeSec(s.lastSeenAt, q.tz)}` : `Ended ${fmtTimeSec(s.lastSeenAt, q.tz)}`}</span>
          </>
        )}
        actions={(
          <Link href={q.href(visitorHref(s.visitorId))} className="an-btn">
            <FontAwesomeIcon icon={faUser} aria-hidden="true" />
            {s.userEmail ? 'Account holder' : `Visitor #${s.visitorId}`}
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        )}
      />

      <div className="an-pp-facts">
        <Panel title="Where they came from" info={<InfoTip title="Source" text="How this visit reached the site: the channel, the exact source, and the campaign tags or referring page when there were any." />}>
          <MetaList items={[
            { label: 'Channel', value: <ChannelBadge channel={s.channel} />, info: undefined },
            { label: 'Source', value: <span className="an-pp-inline"><SourceIcon source={s.source} channel={s.channel} titled={false} />{sourceLabel(s.source)}</span> },
            { label: 'Medium', value: s.medium },
            { label: 'Campaign', value: s.campaign },
            { label: 'Term', value: s.term },
            { label: 'Content', value: s.content },
            { label: 'Ad click', value: s.clickId ? <Badge tone="info">{s.clickId}</Badge> : null, info: 'The visit carried an ad click id (we store only its type, never the value).' },
            {
              label: 'Referring page',
              value: s.referrer
                ? isHttpUrl(s.referrer)
                  ? <a href={s.referrer} target="_blank" rel="noopener noreferrer nofollow" className="an-mono an-pp-link">{s.referrer}</a>
                  : <span className="an-mono">{s.referrer}</span>
                : null,
              info: 'The page that linked here (query string removed for privacy).',
            },
          ]} />
        </Panel>

        <Panel title="Where they were" info={<InfoTip title="Location" text="Country and city come from Cloudflare at the time of the visit - no IP addresses are stored." />}>
          <MetaList items={[
            { label: 'Country', value: <span className="an-pp-inline"><CountryFlag code={s.country} decorative />{countryName(s.country)}</span> },
            { label: 'Region', value: s.region },
            { label: 'City', value: s.city },
            { label: 'Timezone', value: s.timezone },
            { label: 'Language', value: s.language ? `${languageName(s.language)} (${s.language})` : null },
          ]} />
        </Panel>

        <Panel title="What they used" info={<InfoTip title="Device" text="Read from the browser itself (user agent and client hints), never from fingerprinting." />}>
          <MetaList items={[
            { label: 'Device', value: <span className="an-pp-inline"><DeviceIcon device={s.deviceType} titled={false} />{deviceLabel(s.deviceType)}</span> },
            { label: 'Browser', value: s.browser ? <span className="an-pp-inline"><BrowserIcon browser={s.browser} titled={false} />{s.browser}{s.browserVersion ? ` ${s.browserVersion}` : ''}</span> : 'Unknown' },
            { label: 'System', value: s.os ? <span className="an-pp-inline"><OsIcon os={s.os} titled={false} />{s.os}{s.osVersion ? ` ${s.osVersion}` : ''}</span> : 'Unknown' },
            { label: 'Screen', value: s.screen ? s.screen.replace('x', ' × ') : null },
          ]} />
        </Panel>

        <Panel title="The visit" info={<InfoTip title="This visit" text="Totals for this visit. A visit ends after 30 minutes without activity." />}>
          <MetaList items={[
            { label: 'Pages', value: fmtNumber(s.pageviews) },
            { label: 'Time engaged', value: fmtDuration(s.engagedMs), info: 'Active time - only while the tab was visible and in use.' },
            { label: 'Visit length', value: fmtDuration(s.durationMs), info: 'Clock time from the first to the last activity (includes idle time).' },
            { label: 'Actions', value: `${fmtNumber(s.events)} (${fmtNumber(s.keyEvents)} key)`, info: 'Everything the visitor did (clicks, searches...); key actions are the conversions.' },
            { label: 'Outcome', value: <span className="an-pp-inline"><ConversionIcons flags={s.flags} keyEvents={s.keyEvents} />{s.isEngaged ? <Badge tone="good">Engaged</Badge> : <Badge tone="neutral">Bounced</Badge>}</span>, info: 'Engaged = 10+ seconds of active time, 2+ pages, or a key action. Otherwise the visit bounced.' },
          ]} />
        </Panel>
      </div>

      <PanelGrid className="an-pp-split">
        <Panel
          title="Page by page"
          info={<InfoTip title="Timeline" text="Every page of the visit in order, with the time it was opened, how long it was used and how far it was scrolled. Actions are listed under the page they happened on. Times are in your analytics timezone." />}
          subtitle={`${plural(pageviews, 'page')} · ${plural(data.items.length - pageviews, 'action')}`}
          className="an-pp-timeline-panel"
        >
          {data.items.length === 0
            ? <EmptyState compact icon={faClockRotateLeft} title="No pages recorded" text="The pages of this visit were removed by the retention clean-up (page-level detail is kept for 400 days)." />
            : <SessionTimeline items={data.items} session={s} />}
        </Panel>

        <div className="an-pp-side">
          <Panel
            title={s.userEmail ? 'The account holder' : 'The visitor'}
            info={<InfoTip title="Visitor" text="The browser behind this visit, across all its visits. The same person on another device counts as another visitor until they log in there." />}
            viewAll={{ href: visitorHref(v.id), label: 'Full profile' }}
          >
            <VisitorCard data={data} />
          </Panel>
          <Panel
            title="Other visits"
            info={<InfoTip title="Other visits" text="This visitor's other visits, newest first (up to 20)." />}
            subtitle={data.otherSessions.length ? undefined : 'This was the only visit.'}
          >
            <VisitList sessions={data.otherSessions} />
          </Panel>
        </div>
      </PanelGrid>
    </div>
  )
}

function VisitorCard({ data }: { data: SessionDetailReport }) {
  const q = useAnalyticsQuery()
  const v = data.visitor
  const rows: { label: string; value: ReactNode; info?: string }[] = [
    { label: 'First seen', value: fmtDateTime(v.firstSeenAt, q.tz) },
    { label: 'First came from', value: firstTouchPhrase(v.firstTouch) },
    { label: 'First landing page', value: v.firstTouch.landing ? <span className="an-mono">{v.firstTouch.landing}</span> : null },
    { label: 'Visits', value: fmtNumber(v.sessions) },
    { label: 'Pages viewed', value: fmtNumber(v.pageviews) },
    { label: 'Time engaged', value: fmtDuration(v.engagedMs) },
  ]
  if (v.user) {
    rows.unshift(
      { label: 'Account', value: <span className="an-pp-inline"><FontAwesomeIcon icon={faUser} aria-hidden="true" />{v.user.email}</span> },
      { label: 'Signed up', value: v.user.createdAt ? fmtDate(v.user.createdAt, q.tz) : null },
      { label: 'Listings', value: fmtNumber(v.user.listings) },
    )
  }
  return <MetaList items={rows} />
}
