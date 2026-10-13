'use client'
import { use } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faHandPointer, faStar, faUser, faUserSecret, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { TimelineItem, VisitorReport } from '@/lib/analytics/types'
import '../../../../styles/analytics-people.css'
import {
  BarList, ChannelBadge, CountryFlag, DeviceIcon, EmptyState, ErrorState, EventIcon, InfoTip, KpiStrip,
  MigrationNotice, PageHeader, PageTypeDot, Panel, PanelGrid, Skeleton, SourceIcon,
  countryName, deviceLabel, fmtDate, fmtDateTime, fmtDuration, fmtNumber, fmtRelative, livePageHref,
  pageDetailHref, sessionHref, useAnalyticsQuery, useNow, useReport,
} from '../../_ui'
import { MetaList, StatTile, VisitList, firstTouchPhrase, isHttpUrl, plural } from '../../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - one visitor (a browser, identified by its anonymous cookie).
   Leads with the story of how they found the site ("First came from
   Google, landed on /saas-directory on 13 Oct 10:42"), then the business
   account it is linked to (if any), lifetime totals, every visit, the
   pages they keep coming back to and their key actions. Not limited by
   the date range or filters.
   ════════════════════════════════════════════════════════════════════════ */

type EventItem = Extract<TimelineItem, { kind: 'event' }>

export default function VisitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const validId = /^\d{1,15}$/.test(id)
  const r = useReport<VisitorReport>('visitor', { id }, { ignoreRange: true, ignoreFilters: true, enabled: validId })
  const back = { href: 'sessions', label: 'Visitors' }

  if (!validId) {
    return (
      <>
        <PageHeader title="Visitor not found" back={back} />
        <EmptyState icon={faUsers} title="This link does not point to a visitor" text="Visitor links look like /iww-hq/analytics/visitors/1234. Open one from a visit or the Visitors list." />
      </>
    )
  }
  if (r.needsMigration) return <><PageHeader title="Visitor" back={back} /><MigrationNotice missingTables={r.missingTables} /></>
  const data = r.data && r.data.visitor.id === Number(id) ? r.data : undefined
  if (!data) {
    if (r.error) {
      return (
        <>
          <PageHeader title="Visitor" back={back} />
          <ErrorState message={<>{r.error} Check the link, or retry.</>} onRetry={r.reload} />
        </>
      )
    }
    return (
      <>
        <PageHeader title="Visitor" back={back} />
        <Skeleton variant="block" height={140} />
        <Skeleton variant="kpis" rows={5} />
        <Skeleton variant="block" height={360} />
      </>
    )
  }
  return <VisitorBody data={data} refreshing={r.refreshing} />
}

function VisitorBody({ data, refreshing }: { data: VisitorReport; refreshing: boolean }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const v = data.visitor
  const ft = v.firstTouch
  const firstVisit = data.sessions.length ? data.sessions[data.sessions.length - 1] : null
  const keyCount = data.keyEvents.length
  const daysToSignup = v.signedUpAt ? Math.max(0, Math.floor((Date.parse(v.signedUpAt) - Date.parse(v.firstSeenAt)) / 86_400_000)) : null
  const title = v.user?.email ?? `Visitor #${v.id}`

  return (
    <div className={'an-rv' + (refreshing ? ' an-rv--refreshing' : '')}>
      <PageHeader
        back={{ href: 'sessions', label: 'Visitors' }}
        title={<span className="an-pp-title">{title}</span>}
        subtitle={(
          <>
            {plural(v.sessions, 'visit')} since {fmtDate(v.firstSeenAt, q.tz)} · last seen {now ? fmtRelative(v.lastSeenAt, now, q.tz) : fmtDateTime(v.lastSeenAt, q.tz)}
          </>
        )}
        meta={(
          <>
            <span className="an-pp-inline"><CountryFlag code={v.country} decorative />{countryName(v.country)}</span>
            {v.deviceType && <span className="an-pp-inline"><DeviceIcon device={v.deviceType} titled={false} />{deviceLabel(v.deviceType)}</span>}
            <span>Visitor #{v.id}</span>
          </>
        )}
      />

      <div className="an-pp-story-grid">
        <section className="an-pp-story" aria-labelledby="vp-first">
          <h2 id="vp-first" className="an-pp-story-h">
            <SourceIcon source={ft.source} channel={ft.channel} titled={false} /> First visit
            <InfoTip title="First touch" text="How this browser found InfoWebWorld the very first time: the source and the first page it landed on. Later visits may come from elsewhere." />
          </h2>
          <p className="an-pp-story-text">
            First came from <b>{firstTouchPhrase(ft)}</b>
            {ft.landing && <>, landed on <Link href={q.href(pageDetailHref(ft.landing))} className="an-mono an-pp-link">{ft.landing}</Link></>}
            {' '}on <b>{fmtDateTime(v.firstSeenAt, q.tz)}</b>.
          </p>
          <div className="an-pp-story-meta">
            {ft.channel && <ChannelBadge channel={ft.channel} />}
            {ft.medium && <span>Medium: {ft.medium}</span>}
            {ft.campaign && <span>Campaign: {ft.campaign}</span>}
            {ft.referrer && (isHttpUrl(ft.referrer)
              ? <a href={ft.referrer} target="_blank" rel="noopener noreferrer nofollow" className="an-mono an-pp-link">{ft.referrer}</a>
              : <span className="an-mono">{ft.referrer}</span>)}
            {firstVisit && data.sessions.length === v.sessions && <Link href={q.href(sessionHref(firstVisit.id))} className="an-pp-link">Replay the first visit →</Link>}
          </div>
        </section>

        <section className={'an-pp-story' + (v.user ? ' an-pp-story--account' : '')} aria-labelledby="vp-acct">
          <h2 id="vp-acct" className="an-pp-story-h">
            <FontAwesomeIcon icon={v.user ? faUser : faUserSecret} aria-hidden="true" /> {v.user ? 'Business account' : 'Anonymous'}
            <InfoTip title="Business account" text="A browser is linked to a business account when someone signs up or logs in on it. One account can be linked to several browsers (phone, laptop)." />
          </h2>
          {v.user ? (
            <>
              <p className="an-pp-story-text">
                <b>{v.user.name ?? v.user.email}</b>{v.user.name && <> · {v.user.email}</>}
              </p>
              <MetaList items={[
                { label: 'Account created', value: v.user.createdAt ? fmtDateTime(v.user.createdAt, q.tz) : null },
                { label: 'Signed up from this browser', value: v.signedUpAt ? `${fmtDate(v.signedUpAt, q.tz)}${daysToSignup != null ? ` · ${daysToSignup === 0 ? 'on the first day' : `${plural(daysToSignup, 'day')} after the first visit`}` : ''}` : null },
                { label: 'Listings submitted', value: fmtNumber(v.user.listings) },
              ]} />
            </>
          ) : (
            <p className="an-pp-story-text an-muted">
              Not linked to a business account. Visitors are linked automatically when they sign up or log in on this browser.
            </p>
          )}
        </section>
      </div>

      <KpiStrip ariaLabel="This visitor's totals" className="an-pp-kpis">
        <StatTile label="Visits" value={fmtNumber(v.sessions)} info="All visits by this browser. A visit ends after 30 minutes without activity." />
        <StatTile label="Pages viewed" value={fmtNumber(v.pageviews)} sub={v.sessions > 0 ? `${(v.pageviews / v.sessions).toFixed(1)} per visit` : undefined} info="Pages viewed across all visits." />
        <StatTile label="Time engaged" value={fmtDuration(v.engagedMs)} sub={v.sessions > 0 ? `${fmtDuration(v.engagedMs / v.sessions)} per visit` : undefined} info="Active time across all visits - only while the tab was visible and in use." />
        <StatTile label="Key actions" value={keyCount >= 100 ? '100+' : fmtNumber(keyCount)} info="Signups, listings, inquiries, and clicks through to business websites, emails and phones." />
        <StatTile label="Last seen" value={now ? fmtRelative(v.lastSeenAt, now, q.tz) : fmtDate(v.lastSeenAt, q.tz)} sub={fmtDateTime(v.lastSeenAt, q.tz)} info="The most recent activity of this browser." />
      </KpiStrip>

      <PanelGrid className="an-pp-split">
        <Panel
          title="Visits"
          info={<InfoTip title="Visits" text="Every visit of this browser, newest first (the latest 100). Click one to replay it page by page." />}
          subtitle={data.sessions.length < v.sessions ? `Latest ${data.sessions.length} of ${fmtNumber(v.sessions)}` : undefined}
        >
          <VisitList
            sessions={data.sessions}
            empty={<EmptyState compact icon={faUsers} title="No visits kept" text="This visitor's visits are older than the retention period (about two years) and were removed." />}
          />
        </Panel>

        <div className="an-pp-side">
          <Panel
            title="Pages they viewed most"
            info={<InfoTip title="Top pages" text="The pages this visitor viewed most, across all visits." />}
          >
            <BarList
              rows={data.topPages.map(p => {
                const title = typeof p.extra?.title === 'string' ? p.extra.title : null
                const pageType = typeof p.extra?.pageType === 'string' ? p.extra.pageType : null
                return {
                  key: p.key,
                  label: title ?? <span className="an-mono">{p.key}</span>,
                  text: title ? `${title} (${p.key})` : p.key,
                  sub: title ? <span className="an-mono">{p.key}</span> : null,
                  icon: <PageTypeDot pageType={pageType} />,
                  value: p.pageviews ?? 0,
                  share: p.share,
                  href: pageDetailHref(p.key),
                  external: livePageHref(p.key),
                }
              })}
              labelHeader="Page"
              valueHeader="Views"
              limit={12}
              empty={<EmptyState compact icon={faFileLines} title="No pages kept" text="Page-level detail is kept for 400 days." />}
            />
          </Panel>

          <Panel
            title="Key actions"
            info={<InfoTip metric="keyEvents" />}
          >
            <KeyActionList events={data.keyEvents} />
          </Panel>
        </div>
      </PanelGrid>
    </div>
  )
}

function KeyActionList({ events }: { events: TimelineItem[] }) {
  const q = useAnalyticsQuery()
  const list = events.filter((e): e is EventItem => e.kind === 'event')
  if (!list.length) {
    return <EmptyState compact icon={faHandPointer} title="No key actions yet" text="Signups, listings submitted, inquiries and clicks through to business websites will be listed here." />
  }
  return (
    <ol className="an-pp-actions">
      {list.slice(0, 50).map(e => (
        <li key={e.id} className="an-pp-action">
          <span className="an-pp-action-icon"><EventIcon name={e.name} titled={false} /></span>
          <span className="an-pp-action-body">
            <span className="an-pp-action-label">
              {e.label} <FontAwesomeIcon icon={faStar} className="an-pp-star" aria-hidden="true" />
            </span>
            {(e.target || e.path) && (
              <span className="an-pp-action-sub an-mono">{e.target ?? e.path}</span>
            )}
          </span>
          <time className="an-pp-action-time" dateTime={e.ts}>{fmtDateTime(e.ts, q.tz)}</time>
        </li>
      ))}
    </ol>
  )
}
