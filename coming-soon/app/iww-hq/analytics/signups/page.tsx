'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import type { SignupRow, SignupsReport } from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import '../../../styles/analytics-people.css'
import {
  BarChart, ChannelBadge, DataTable, DimensionList, EmptyState, InfoTip, KpiStrip, PageHeader, Panel, PanelGrid,
  ReportView, Skeleton, SourceIcon,
  channelLabel, fmtDate, fmtDecimal, fmtNumber, fmtPercent, fmtRange, sectionFor, sessionHref,
  useAnalyticsQuery, useReport, visitorHref,
  type Column,
} from '../_ui'
import { StatTile, medianOf } from '../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Signups. New business accounts in the date range and, for
   each one, how that person found the site: first source, first landing
   page, the visit in which they signed up, how many visits and pages it
   took and how many days passed. Accounts created on a browser we never
   tracked (before tracking started, or with the tracker blocked) are
   counted but have no journey ("no tracking data").
   This report counts accounts, not visits, so the visit filters don't
   apply; clicking a channel or landing page narrows the table instead.
   ════════════════════════════════════════════════════════════════════════ */

type RowPick = { kind: 'channel' | 'landing'; key: string; label: string } | null

const METHOD_LABELS: Record<string, string> = {
  email: 'Email code',
  password: 'Password',
  google: 'Google',
  google_one_tap: 'Google One Tap',
  linkedin: 'LinkedIn',
  microsoft: 'Microsoft',
  github: 'GitHub',
  facebook: 'Facebook',
  apple: 'Apple',
}
const methodLabel = (m: string | null) => (m ? METHOD_LABELS[m] ?? m.replace(/_/g, ' ') : '–')

export default function SignupsPage() {
  const q = useAnalyticsQuery()
  const r = useReport<SignupsReport>('signups', undefined, { ignoreFilters: true })
  const range = r.data?.range

  return (
    <>
      <PageHeader
        title="Signups"
        subtitle={sectionFor('signups').subtitle}
        meta={range && (
          <>
            <span>{fmtRange(range.from, range.to)}</span>
            {q.filterList.length > 0 && <span>Visit filters don&apos;t apply here - this page counts accounts, not visits.</span>}
          </>
        )}
      />
      <ReportView state={r} skeleton={<SignupsSkeleton />}>
        {data => <SignupsBody data={data} />}
      </ReportView>
    </>
  )
}

function SignupsSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <Skeleton variant="chart" height={220} />
      <Skeleton variant="table" rows={8} />
    </>
  )
}

function SignupsBody({ data }: { data: SignupsReport }) {
  const [pick, setPick] = useState<RowPick>(null)
  const attributedRows = data.rows.filter(r => r.visitorId != null)
  const days = attributedRows.map(r => r.daysToSignup).filter((d): d is number => d != null)
  const visits = attributedRows.map(r => r.sessionsBeforeSignup).filter((d): d is number => d != null)
  const medDays = medianOf(days)
  const medVisits = medianOf(visits)
  const withListing = data.rows.filter(r => r.listings > 0).length

  if (data.total === 0) {
    return (
      <EmptyState
        icon={faUserPlus}
        title="No new business accounts in this period"
        text="Every business account created in the selected dates is listed here with the journey that led to it. Try a longer date range."
      />
    )
  }

  const rows = pick
    ? data.rows.filter(r => r.visitorId != null && (pick.kind === 'channel'
      ? (r.firstTouch?.channel ?? '(none)') === pick.key
      : (r.firstTouch?.landing ?? '(none)') === pick.key))
    : data.rows

  return (
    <>
      <KpiStrip ariaLabel="Signup totals" className="an-pp-kpis">
        <StatTile label="New accounts" value={fmtNumber(data.total)} info="Business accounts created in the selected dates." />
        <StatTile
          label="With tracking data"
          value={fmtPercent(data.total ? data.attributed / data.total : 0, 0)}
          sub={`${fmtNumber(data.attributed)} of ${fmtNumber(data.total)}`}
          info="Accounts we can tie to a tracked browser, so we know their first source and journey. Accounts made before tracking started, or by browsers that block it, have no journey."
        />
        <StatTile
          label="Typical time to sign up"
          value={medDays == null ? '–' : medDays < 1 ? 'Same day' : `${fmtDecimal(medDays, 1)} days`}
          sub="median, from first visit"
          info="Median number of days between a person's first visit and their signup (accounts with tracking data)."
        />
        <StatTile
          label="Visits before signing up"
          value={medVisits == null ? '–' : fmtDecimal(medVisits, 1)}
          sub="median, incl. the signup visit"
          info="Median number of visits a person made up to and including the one in which they signed up."
        />
        <StatTile
          label="Went on to list"
          value={fmtPercent(data.rows.length ? withListing / data.rows.length : 0, 0)}
          sub={`${fmtNumber(withListing)} accounts with a listing`}
          info="Share of these new accounts that have submitted at least one listing so far."
        />
      </KpiStrip>

      <Panel
        title="Signups over time"
        info={<InfoTip metric="signups" />}
        subtitle={fmtRange(data.range.from, data.range.to)}
      >
        <BarChart
          bars={data.series.map(p => ({ key: p.t, label: p.label, value: p.signups }))}
          valueLabel="Signups"
          height={200}
          ariaLabel="New business accounts per period"
        />
      </Panel>

      <PanelGrid>
        <Panel
          title="How they first found us"
          info={<InfoTip title="First channel" text="The channel of each new account's very first visit (first touch). Click a row to list only those signups below." />}
          subtitle={data.attributed < data.total ? `${fmtNumber(data.attributed)} accounts with tracking data` : undefined}
        >
          <DimensionList
            dim="channel"
            rows={data.byChannel}
            valueHeader="Signups"
            limit={10}
            onRowClick={row => setPick({ kind: 'channel', key: row.key, label: row.label })}
            empty={<EmptyState compact icon={faUserPlus} title="No tracking data yet" text="Once tracked visitors sign up, their first source appears here." />}
          />
        </Panel>
        <Panel
          title="First landing page"
          info={<InfoTip title="First landing page" text="The first page each new account ever landed on - the pages that bring in business owners. Click a row to list only those signups below." />}
        >
          <DimensionList
            dim="entry"
            rows={data.byLanding}
            valueHeader="Signups"
            limit={10}
            onRowClick={row => setPick({ kind: 'landing', key: row.key, label: row.label })}
            empty={<EmptyState compact icon={faUserPlus} title="No tracking data yet" text="Once tracked visitors sign up, the page they first landed on appears here." />}
          />
        </Panel>
      </PanelGrid>

      <Panel
        title="Every new account"
        info={<InfoTip title="New accounts" text="Newest first. Click a row to open that person's visitor profile (when we have tracking data for them)." />}
        flush
      >
        <SignupTable rows={rows} pick={pick} onClearPick={() => setPick(null)} />
      </Panel>
    </>
  )
}

function SignupTable({ rows, pick, onClearPick }: { rows: SignupRow[]; pick: RowPick; onClearPick: () => void }) {
  const q = useAnalyticsQuery()
  const router = useRouter()

  const columns: Column<SignupRow>[] = [
    {
      key: 'user',
      header: 'Account',
      value: r => r.email,
      sticky: true,
      render: r => (
        <span className="an-su-user">
          <span className="an-su-email">{r.email}</span>
          {r.name && <span className="an-su-name">{r.name}</span>}
        </span>
      ),
    },
    {
      key: 'signedUpAt',
      header: 'Signed up',
      value: r => r.signedUpAt,
      firstDir: 'desc',
      render: r => fmtDate(r.signedUpAt, q.tz),
    },
    {
      key: 'method',
      header: 'Method',
      value: r => methodLabel(r.method),
      tip: <InfoTip title="Signup method" text="How the account was created: email code, Google, or another sign-in provider." />,
    },
    {
      key: 'source',
      header: 'First source',
      value: r => (r.firstTouch ? sourceLabel(r.firstTouch.source) : null),
      tip: <InfoTip title="First source" text="Where this person came from on their very first visit." />,
      render: r => r.firstTouch ? (
        <span className="an-pp-inline">
          <SourceIcon source={r.firstTouch.source} channel={r.firstTouch.channel} titled={false} />
          <span>{r.firstTouch.source ? sourceLabel(r.firstTouch.source) : channelLabel(r.firstTouch.channel)}</span>
        </span>
      ) : <span className="an-muted">No tracking data</span>,
    },
    {
      key: 'landing',
      header: 'First landing page',
      value: r => r.firstTouch?.landing ?? null,
      render: r => r.firstTouch?.landing ? <span className="an-mono">{r.firstTouch.landing}</span> : <span className="an-muted">–</span>,
    },
    {
      key: 'signupVisit',
      header: 'Signup visit',
      value: r => (r.signupSession ? sourceLabel(r.signupSession.source) : null),
      tip: <InfoTip title="Signup visit" text="The visit in which the account was created, by its source. Click to replay it." />,
      render: r => r.signupSession ? (
        <Link href={q.href(sessionHref(r.signupSession.id))} className="an-su-visit" onClick={e => e.stopPropagation()} title="Replay the signup visit">
          <ChannelBadge channel={r.signupSession.channel} label={sourceLabel(r.signupSession.source)} />
        </Link>
      ) : <span className="an-muted">–</span>,
    },
    {
      key: 'visits',
      header: 'Visits before',
      value: r => r.sessionsBeforeSignup,
      format: 'number',
      tip: <InfoTip title="Visits before signup" text="Visits up to and including the one in which they signed up." />,
    },
    {
      key: 'pages',
      header: 'Pages before',
      value: r => r.pageviewsBeforeSignup,
      format: 'number',
      tip: <InfoTip title="Pages before signup" text="Pages viewed before the account was created, across those visits." />,
    },
    {
      key: 'days',
      header: 'Days to sign up',
      value: r => r.daysToSignup,
      format: 'number',
      tip: <InfoTip title="Days to sign up" text="Days between the first visit and the signup (0 = the same day)." />,
    },
    {
      key: 'listings',
      header: 'Listings',
      value: r => r.listings,
      format: 'number',
      tip: <InfoTip title="Listings" text="Listings this account has submitted so far." />,
    },
  ]

  return (
    <DataTable
      caption="New business accounts"
      rows={rows}
      columns={columns}
      rowKey={r => String(r.userId)}
      defaultSort={{ key: 'signedUpAt', dir: 'desc' }}
      onRowClick={r => { if (r.visitorId != null) router.push(q.href(visitorHref(r.visitorId))) }}
      csvName="signups"
      pageSize={25}
      toolbar={pick ? (
        <span className="an-chip an-pp-pick">
          <span className="an-chip-key">{pick.kind === 'channel' ? 'First channel' : 'First landing page'}</span>
          <span className="an-chip-val">{pick.label}</span>
          <button type="button" className="an-chip-x" aria-label="Show all signups" onClick={onClearPick}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </span>
      ) : <span className="an-muted an-pp-toolnote">{fmtNumber(rows.length)} accounts</span>}
      empty={<EmptyState compact icon={faUserPlus} title="No signups match" text="Clear the selection above to see every new account." />}
    />
  )
}
