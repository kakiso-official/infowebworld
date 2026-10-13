'use client'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, faBug, faCircleCheck, faGlobe, faLinkSlash, faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons'
import type { ErrorsReport } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  DataTable, EmptyState, InfoTip, PageHeader, Panel, ReportView, SERIES, Skeleton, StackedBars, fmtDateTime,
  fmtNumber, fmtRange, fmtRelative, livePageHref, pageDetailHref, sectionFor, useAnalyticsQuery, useNow,
  useReport, type Column,
} from '../_ui'
import { FactTile, plural, sum } from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Errors. What breaks for visitors: "page not found" (404)
   views grouped by address, with WHERE the broken link is (one of our own
   pages = fixable now; another website = ask them or add a redirect;
   nothing = typed / bookmarked), and JavaScript errors grouped by message.
   Opens with the list of broken links on our own pages - the fix-first
   answer - then the trend and the full tables.
   ════════════════════════════════════════════════════════════════════════ */

type NotFoundRow = ErrorsReport['notFound'][number]
type JsRow = ErrorsReport['jsErrors'][number]

/** A broken link that sits on one of our own pages (fix it there). */
interface InternalLink { from: string; to: string; hits: number; external: boolean }

const BUCKET_WORD = { hour: 'per hour', day: 'per day', week: 'per week', month: 'per month' } as const

export default function ErrorsPage() {
  const r = useReport<ErrorsReport>('errors')
  const range = r.data?.range
  return (
    <>
      <PageHeader
        title="Errors"
        subtitle={sectionFor('errors').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}</span>}
      />
      <ReportView state={r} skeleton={<ErrorsSkeleton />}>
        {data => <ErrorsBody data={data} />}
      </ReportView>
    </>
  )
}

function ErrorsSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <Skeleton variant="block" height={200} />
      <Skeleton variant="chart" height={240} />
    </>
  )
}

/** Our own pages that link to a broken address, most-hit first. */
function internalLinks(rows: NotFoundRow[]): InternalLink[] {
  const out: InternalLink[] = []
  for (const r of rows) {
    for (const ref of r.referrers) {
      // key is a path of ours ('/x') or our own host for landing views from an old tab / subdomain.
      if (ref.internal) out.push({ from: ref.key, to: r.path, hits: ref.hits, external: !ref.key.startsWith('/') })
    }
  }
  return out.sort((a, b) => b.hits - a.hits)
}

function ErrorsBody({ data }: { data: ErrorsReport }) {
  const notFoundHits = sum(data.notFound.map(r => r.hits))
  const jsHits = sum(data.jsErrors.map(r => r.hits))
  // Visitors are distinct per address; one visitor hitting two addresses counts twice - hence "up to".
  const nfVisitors = sum(data.notFound.map(r => r.visitors))
  const links = internalLinks(data.notFound)
  const internalHits = sum(links.map(l => l.hits))
  const anySeries = data.series.some(p => p.notFound > 0 || p.jsErrors > 0)
  const bucket = data.range.bucket

  return (
    <>
      <div className="an-kpis an-ix-facts" role="group" aria-label="Headline answers">
        <FactTile
          label="Broken addresses"
          tip={{ text: 'Different addresses on infowebworld.com that showed the "page not found" screen in this period.' }}
          value={data.notFound.length >= 100 ? '100+' : fmtNumber(data.notFound.length)}
          sub={data.notFound[0] ? <>top: <span className="an-mono">{data.notFound[0].path}</span></> : 'none - nice'}
          title={data.notFound[0]?.path}
        />
        <FactTile
          label="404 views"
          tip={{ text: 'Times a visitor landed on a "page not found" screen. Each one is a visitor who did not get what they came for.' }}
          value={fmtNumber(notFoundHits)}
          sub={notFoundHits ? `up to ${fmtNumber(nfVisitors)} ${plural(nfVisitors, 'visitor')} affected` : 'none in this period'}
        />
        <FactTile
          label="Caused by our own links"
          tip={{ text: 'Of the 404 views, how many came from clicking a link on one of our own pages. These can be fixed right away by correcting the link (or adding a redirect).' }}
          value={fmtNumber(internalHits)}
          sub={links.length ? `${fmtNumber(links.length)} ${plural(links.length, 'broken link')} to fix` : 'no broken internal links'}
        />
        <FactTile
          label="JavaScript errors"
          tip={{ text: 'Script errors in visitors\' browsers (at most 3 per page and 5 of the same message per visit are recorded, so one broken page cannot flood this).' }}
          value={fmtNumber(jsHits)}
          sub={data.jsErrors.length ? `${fmtNumber(data.jsErrors.length)} different ${plural(data.jsErrors.length, 'message')}` : 'none recorded'}
        />
      </div>

      <FixFirstPanel links={links} />

      <Panel
        title="Errors over time"
        info={<InfoTip title="Errors over time" text="404 views and JavaScript errors in each period, stacked. A sudden jump usually follows a release or a changed URL." />}
        subtitle={`Count ${BUCKET_WORD[bucket]}`}
      >
        {anySeries ? (
          <StackedBars
            labels={data.series.map(p => ({ t: p.t, label: p.label }))}
            series={[
              { key: 'nf', label: '404 views', color: SERIES[0], values: data.series.map(p => p.notFound) },
              { key: 'js', label: 'JavaScript errors', color: SERIES[1], values: data.series.map(p => p.jsErrors) },
            ]}
            totalLabel="Errors"
            height={230}
            ariaLabel={`404 views and JavaScript errors ${BUCKET_WORD[bucket]}`}
          />
        ) : (
          <EmptyState compact icon={faCircleCheck} title="No errors in this period" text="404 views and script errors would show up here over time." />
        )}
      </Panel>

      <NotFoundPanel rows={data.notFound} />
      <JsErrorsPanel rows={data.jsErrors} />
    </>
  )
}

/* ── Fix first ──────────────────────────────────────────────────────────── */

function FixFirstPanel({ links }: { links: InternalLink[] }) {
  const q = useAnalyticsQuery()
  return (
    <Panel
      title="Fix these first: broken links on our own pages"
      info={<InfoTip title="Broken internal links" text="A visitor on the page on the left clicked a link that led to a 404. Fix the link on that page (or redirect the broken address) and these errors stop." />}
      className="an-ix-fixfirst"
    >
      {links.length === 0 ? (
        <EmptyState compact icon={faCircleCheck} title="No broken links found on our own pages" text="When a link on one of our pages leads to a missing page, it is listed here with the page to fix." />
      ) : (
        <ul className="an-ix-fixlist">
          {links.slice(0, 12).map(l => (
            <li key={`${l.from}→${l.to}`} className="an-ix-fix">
              <span className="an-ix-fix-icon" aria-hidden="true"><FontAwesomeIcon icon={faScrewdriverWrench} /></span>
              <span className="an-ix-fix-text">
                {l.external ? <>An old link on <b>{l.from}</b></> : (
                  <>
                    The page{' '}
                    <Link href={q.href(pageDetailHref(l.from))} className="an-ix-fix-page">{l.from}</Link>
                  </>
                )}
                {' '}links to <span className="an-mono an-ix-fix-broken">{l.to}</span>, which does not exist.
              </span>
              <span className="an-ix-fix-hits an-num">{fmtNumber(l.hits)} {plural(l.hits, 'view')}</span>
              {!l.external && (
                <a
                  href={livePageHref(l.from)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="an-bl-act"
                  title="Open the page with the broken link"
                  aria-label={`Open ${l.from} in a new tab`}
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

/* ── 404 table ──────────────────────────────────────────────────────────── */

function RefChips({ refs }: { refs: NotFoundRow['referrers'] }) {
  const q = useAnalyticsQuery()
  if (!refs.length) return <span className="an-muted">–</span>
  return (
    <span className="an-ix-chips">
      {refs.map(ref => {
        const isPage = ref.internal && ref.key.startsWith('/')
        const cls = `an-ix-refchip an-ix-refchip--${ref.internal ? 'internal' : ref.key === '(direct)' ? 'direct' : 'external'}`
        const text = ref.internal
          ? (isPage ? <>Our link on <span className="an-mono">{ref.label}</span> - fix it</> : <>Old link on {ref.label}</>)
          : ref.key === '(direct)' ? 'Typed / bookmarked' : <>Link on {ref.label}</>
        const icon = ref.internal ? faLinkSlash : ref.key === '(direct)' ? null : faGlobe
        const body = (
          <>
            {icon && <FontAwesomeIcon icon={icon} aria-hidden="true" />}
            <span>{text}</span>
            <b className="an-num">{fmtNumber(ref.hits)}</b>
          </>
        )
        return isPage ? (
          <Link key={ref.key} href={q.href(pageDetailHref(ref.key))} className={cls} onClick={e => e.stopPropagation()} title="Open that page's details">
            {body}
          </Link>
        ) : (
          <span key={ref.key} className={cls}>{body}</span>
        )
      })}
    </span>
  )
}

function NotFoundPanel({ rows }: { rows: NotFoundRow[] }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const columns: Column<NotFoundRow>[] = [
    {
      key: 'path', header: 'Missing address', sticky: true, minWidth: 220,
      value: r => r.path,
      render: r => (
        <span className="an-ix-name">
          <span className="an-mono an-ix-broken-path">{r.path}</span>
          <a href={livePageHref(r.path)} target="_blank" rel="noopener noreferrer" className="an-bl-act" title="Open it (shows the 404 page)" aria-label={`Open ${r.path} in a new tab`} onClick={e => e.stopPropagation()}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </span>
      ),
    },
    { key: 'hits', header: 'Views', tip: <InfoTip title="404 views" text="Times this missing address was opened." />, value: r => r.hits, format: 'number', bar: true },
    { key: 'visitors', header: 'Visitors', tip: <InfoTip metric="visitors" />, value: r => r.visitors, format: 'number' },
    {
      key: 'lastSeen', header: 'Last seen', align: 'right', firstDir: 'desc',
      value: r => r.lastSeen,
      render: r => <span title={fmtDateTime(r.lastSeen, q.tz)}>{now ? fmtRelative(r.lastSeen, now, q.tz) : fmtDateTime(r.lastSeen, q.tz)}</span>,
      csv: r => r.lastSeen,
    },
    {
      key: 'referrers', header: 'Where the broken link is', sortable: false, minWidth: 320,
      tip: <InfoTip title="Where the broken link is" text="'Our link on ... - fix it': a link on one of our own pages leads here - correct it on that page. 'Link on <website>': another site links to the missing address - add a redirect or ask them to update it. 'Typed / bookmarked': no link to fix; add a redirect if it is popular." />,
      render: r => <RefChips refs={r.referrers} />,
      csv: r => r.referrers.map(x => `${x.internal ? 'internal' : 'external'}:${x.key} (${x.hits})`).join('; '),
    },
  ]
  return (
    <Panel
      title="Pages not found (404)"
      info={<InfoTip title="404 pages" text="Every address that showed the 'page not found' screen, with how often and where the visitors came from. Click a row to see only visits that hit it." />}
      flush
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.path}
        onRowClick={r => q.setFilter('page', r.path)}
        defaultSort={{ key: 'hits', dir: 'desc' }}
        pageSize={20}
        csvName="404-pages"
        caption="Pages not found"
        empty={<EmptyState compact icon={faCircleCheck} title="No 404s in this period" text="Every address that shows the 'page not found' screen is listed here, with the link that led to it." />}
      />
    </Panel>
  )
}

/* ── JavaScript errors ──────────────────────────────────────────────────── */

function JsErrorsPanel({ rows }: { rows: JsRow[] }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const columns: Column<JsRow>[] = [
    {
      key: 'message', header: 'Error message', sticky: true, minWidth: 260,
      value: r => r.message,
      render: r => <span className="an-mono an-ix-errmsg" title={r.message}>{r.message}</span>,
    },
    { key: 'hits', header: 'Times', tip: <InfoTip title="Times" text="How many times this error was recorded." />, value: r => r.hits, format: 'number', bar: true },
    { key: 'sessions', header: 'Visits', tip: <InfoTip title="Visits affected" text="Separate visits in which this error happened at least once." />, value: r => r.sessions, format: 'number' },
    {
      key: 'pages', header: 'On pages', sortable: false, minWidth: 220,
      render: r => (
        <span className="an-ix-chips">
          {r.pages.slice(0, 3).map(p => (
            <Link key={p} href={q.href(pageDetailHref(p))} className="an-ix-refchip an-ix-refchip--direct an-mono" onClick={e => e.stopPropagation()}>{p}</Link>
          ))}
          {r.pages.length > 3 && <span className="an-muted">+{r.pages.length - 3}</span>}
        </span>
      ),
      csv: r => r.pages.join('; '),
    },
    { key: 'browsers', header: 'Browsers', sortable: false, render: r => r.browsers.join(', ') || '–', csv: r => r.browsers.join('; ') },
    {
      key: 'lastSeen', header: 'Last seen', align: 'right', firstDir: 'desc',
      value: r => r.lastSeen,
      render: r => <span title={fmtDateTime(r.lastSeen, q.tz)}>{now ? fmtRelative(r.lastSeen, now, q.tz) : fmtDateTime(r.lastSeen, q.tz)}</span>,
      csv: r => r.lastSeen,
    },
  ]
  return (
    <Panel
      title="JavaScript errors"
      info={<InfoTip title="JavaScript errors" text="Script errors that happened in visitors' browsers, grouped by message, with the pages and browsers they happened on. Errors from browser extensions can appear here too." />}
      flush
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.message}
        defaultSort={{ key: 'hits', dir: 'desc' }}
        pageSize={20}
        csvName="javascript-errors"
        caption="JavaScript errors"
        empty={<EmptyState compact icon={faBug} title="No script errors recorded" text="If a page's JavaScript breaks in a visitor's browser, the message, page and browser are listed here." />}
      />
    </Panel>
  )
}
