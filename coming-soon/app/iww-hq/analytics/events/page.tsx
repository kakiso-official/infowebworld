'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, faHandPointer, faMagnifyingGlass, faMagnifyingGlassMinus, faStar,
} from '@fortawesome/free-solid-svg-icons'
import type { EventCategory, EventsReport, EventSummaryRow, SearchTermRow } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  Badge, DataTable, Delta, EmptyState, EventIcon, InfoTip, PageHeader, Panel, ReportView, Segmented, Skeleton,
  Tabs, fmtDateTime, fmtDecimal, fmtNumber, fmtPercent, fmtRange, fmtRelative, sectionFor, todayInTz,
  useAnalyticsQuery, useNow, useReport, type Column,
} from '../_ui'
import { EventDetailPanel, FactTile, comparisonLabel, sum, type FactTileProps } from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Events. Every action visitors take - key actions first
   (signups, listings, inquiries, clicks through to business websites),
   then engagement (searches, shares, chat) and errors. Pick an event to
   see its trend and what was clicked, where. The "Site search" tab lists
   what people searched for and the searches that found nothing - the
   content the directory is missing.
   ════════════════════════════════════════════════════════════════════════ */

type Tab = 'events' | 'search'
type Cat = 'all' | 'key' | EventCategory
const CATS: Cat[] = ['all', 'key', 'engagement', 'navigation', 'error']
const NAME_RE = /^[a-z][a-z0-9_]{1,47}$/

const CATEGORY_LABEL: Record<EventCategory, string> = {
  conversion: 'Conversion',
  engagement: 'Engagement',
  navigation: 'Navigation',
  error: 'Error',
}

export default function EventsPage() {
  const q = useAnalyticsQuery()
  const tab: Tab = q.param('tab') === 'search' ? 'search' : 'events'
  const rawName = q.param('name')
  const name = rawName && NAME_RE.test(rawName) ? rawName : null
  const r = useReport<EventsReport>('events', { name })
  const range = r.data?.range

  return (
    <>
      <PageHeader
        title="Events"
        subtitle={sectionFor('events').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}{range.prev ? ` · compared with ${fmtRange(range.prev.from, range.prev.to)}` : ''}</span>}
      />
      <Tabs<Tab>
        size="md"
        ariaLabel="Events view"
        value={tab}
        onChange={t => q.set({ tab: t === 'events' ? null : t }, { replace: true })}
        items={[
          { key: 'events', label: 'All events', icon: faHandPointer },
          { key: 'search', label: 'Site search', icon: faMagnifyingGlass },
        ]}
      />
      <ReportView state={r} skeleton={<EventsSkeleton />}>
        {data => (tab === 'search'
          ? <SearchView data={data} />
          : <EventsView data={data} name={name} detailLoading={r.loading && data.detail?.name !== name} />)}
      </ReportView>
    </>
  )
}

function EventsSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <Skeleton variant="table" rows={10} />
    </>
  )
}

/* ── All events ─────────────────────────────────────────────────────────── */

const countOf = (rows: EventSummaryRow[], names: string[]) => sum(rows.filter(r => names.includes(r.name)).map(r => r.count))
const prevOf = (rows: EventSummaryRow[], names: string[]) =>
  rows.some(r => r.previousCount != null) ? sum(rows.filter(r => names.includes(r.name)).map(r => r.previousCount ?? 0)) : null

function EventsView({ data, name, detailLoading }: { data: EventsReport; name: string | null; detailLoading: boolean }) {
  const q = useAnalyticsQuery()
  const periodLabel = comparisonLabel(data.range)
  const rawCat = q.param('cat') as Cat | null
  const cat: Cat = rawCat && CATS.includes(rawCat) ? rawCat : 'all'
  const rows = data.events.filter(e => (cat === 'all' ? true : cat === 'key' ? e.isKey : e.category === cat))
  const keyNames = data.events.filter(e => e.isKey).map(e => e.name)
  const select = (n: string | null) => q.set({ name: n }, { replace: true })
  const selected = name ? data.events.find(e => e.name === name) ?? null : null

  const leadNames = ['lead_sent', 'email_click', 'phone_click']
  const tile = (label: string, names: string[], tip: FactTileProps['tip'], open?: string) => (
    <FactTile
      label={label}
      tip={tip}
      value={fmtNumber(countOf(data.events, names))}
      delta={{ value: countOf(data.events, names), previous: prevOf(data.events, names), periodLabel }}
      onClick={open ? () => select(open) : undefined}
      actionLabel={open ? `Open ${label}` : undefined}
    />
  )

  const columns: Column<EventSummaryRow>[] = [
    {
      key: 'label', header: 'Event', sticky: true, minWidth: 200,
      value: r => r.label,
      render: r => (
        <span className="an-ix-name">
          <span className="an-ix-name-icon"><EventIcon name={r.name} /></span>
          <span className="an-ix-name-text">
            <span className="an-ix-name-main">{r.label}</span>
            <span className="an-ix-name-sub an-mono">{r.name}</span>
          </span>
          {r.isKey && <span className="an-ix-star" title="Key action - counts as a conversion"><FontAwesomeIcon icon={faStar} aria-hidden="true" /><span className="an-sr">Key action</span></span>}
          <InfoTip event={r.name} />
        </span>
      ),
      csv: r => r.label,
    },
    {
      key: 'category', header: 'Type', value: r => r.category,
      render: r => <Badge tone={r.category === 'conversion' ? 'accent' : r.category === 'error' ? 'bad' : 'neutral'}>{CATEGORY_LABEL[r.category]}</Badge>,
    },
    { key: 'count', header: 'Count', tip: <InfoTip title="Count" text="How many times the event happened." />, value: r => r.count, format: 'number', bar: true },
    {
      key: 'change', header: 'Change', align: 'right',
      tip: <InfoTip title="Change" text={`Count compared with ${periodLabel}.`} />,
      value: r => (r.previousCount ? (r.count - r.previousCount) / r.previousCount : null),
      csv: r => r.previousCount,
      csvHeader: 'Count (previous period)',
      render: r => (r.previousCount != null ? <Delta value={r.count} previous={r.previousCount} variant="text" periodLabel={periodLabel} /> : '–'),
    },
    { key: 'visitors', header: 'Visitors', tip: <InfoTip title="Visitors" text="Different visitors who did it at least once." />, value: r => r.visitors, format: 'number' },
    { key: 'sessions', header: 'Visits', tip: <InfoTip title="Visits" text="Separate visits in which it happened at least once." />, value: r => r.sessions, format: 'number' },
  ]
  if (!data.events.some(e => e.previousCount != null)) columns.splice(3, 1)

  return (
    <>
      <div className="an-kpis an-ix-facts" role="group" aria-label="Headline answers">
        {tile('Key actions', keyNames, { metric: 'keyEvents' })}
        {tile('Website visits sent', ['website_click'], { metric: 'websiteClicks' }, 'website_click')}
        {tile('Leads to businesses', leadNames, { metric: 'leads' })}
        {tile('Signups', ['signup_completed'], { metric: 'signups' }, 'signup_completed')}
      </div>

      <div className={'an-ix-evsplit' + (name ? ' an-ix-evsplit--open' : '')}>
        <Panel
          title="All events"
          info={<InfoTip title="Events" text="Every action recorded in this period. Starred rows are key actions - they count as conversions. Choose a row to see its trend, what was clicked and on which pages." />}
          tabs={(
            <Segmented<Cat>
              size="sm"
              ariaLabel="Event type"
              value={cat}
              onChange={c => q.set({ cat: c === 'all' ? null : c }, { replace: true })}
              items={[
                { key: 'all', label: 'All' },
                { key: 'key', label: 'Key actions', icon: faStar },
                { key: 'engagement', label: 'Engagement' },
                { key: 'navigation', label: 'Navigation' },
                { key: 'error', label: 'Errors' },
              ]}
            />
          )}
          flush
        >
          <DataTable
            rows={rows}
            columns={columns}
            rowKey={r => r.name}
            onRowClick={r => select(r.name === name ? null : r.name)}
            selectedKey={name}
            defaultSort={{ key: 'count', dir: 'desc' }}
            pageSize={30}
            csvName="events"
            caption="Events"
            empty={(
              <EmptyState
                compact
                icon={faHandPointer}
                title={cat === 'all' ? 'No events in this period' : 'No events of this type in this period'}
                text="Signups, listing submissions, inquiries, clicks to business websites, searches, shares and other actions appear here as visitors take them."
              />
            )}
          />
        </Panel>

        {name ? (
          <EventDetailPanel
            key={name}
            summary={selected}
            detail={data.detail?.name === name ? data.detail : null}
            loading={detailLoading}
            periodLabel={periodLabel}
            partialLast={data.range.to === todayInTz(data.range.tz)}
            onClose={() => select(null)}
          />
        ) : (
          <div className="an-ix-evhint">
            <FontAwesomeIcon icon={faHandPointer} aria-hidden="true" />
            <p>Choose an event to see its trend, what was clicked or searched, and on which pages.</p>
          </div>
        )}
      </div>
    </>
  )
}

/* ── Site search ────────────────────────────────────────────────────────── */

function SearchView({ data }: { data: EventsReport }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  const periodLabel = comparisonLabel(data.range)
  const searchRow = data.events.find(e => e.name === 'search')
  const zeroSearches = sum(data.zeroResultTerms.map(t => t.zeroResults))
  const total = searchRow?.count ?? 0

  const lastCol: Column<SearchTermRow> = {
    key: 'lastSearched', header: 'Last searched', align: 'right', firstDir: 'desc',
    value: r => r.lastSearched,
    render: r => <span title={fmtDateTime(r.lastSearched, q.tz)}>{now ? fmtRelative(r.lastSearched, now, q.tz) : fmtDateTime(r.lastSearched, q.tz)}</span>,
    csv: r => r.lastSearched,
  }
  const termCol: Column<SearchTermRow> = {
    key: 'query', header: 'Search term', sticky: true, minWidth: 200,
    value: r => r.query,
    render: r => (
      <span className="an-ix-name">
        <span className="an-ix-term">{r.query}</span>
        <a
          href={`/search?q=${encodeURIComponent(r.query)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="an-bl-act"
          title="Run this search on the live site"
          aria-label={`Search the live site for ${r.query}`}
          onClick={e => e.stopPropagation()}
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </span>
    ),
  }
  const termColumns: Column<SearchTermRow>[] = [
    termCol,
    { key: 'searches', header: 'Searches', tip: <InfoTip title="Searches" text="Times this term was searched." />, value: r => r.searches, format: 'number', bar: true },
    { key: 'visitors', header: 'Visitors', tip: <InfoTip title="Visitors" text="Different visitors who searched it." />, value: r => r.visitors, format: 'number' },
    { key: 'avgResults', header: 'Avg. results', tip: <InfoTip title="Average results" text="How many results the search page showed, on average. Empty when the page did not report a count." />, value: r => r.avgResults, format: 'decimal', render: r => (r.avgResults == null ? '–' : fmtDecimal(r.avgResults, 1)) },
    { key: 'zeroResults', header: 'No results', tip: <InfoTip title="No results" text="Searches for this term that found nothing." />, value: r => r.zeroResults, format: 'number' },
    lastCol,
  ]
  const gapColumns: Column<SearchTermRow>[] = [
    termCol,
    { key: 'zeroResults', header: 'Searches with no results', tip: <InfoTip title="No results" text="Times this term was searched and nothing was found." />, value: r => r.zeroResults, format: 'number', bar: true },
    { key: 'visitors', header: 'Visitors', tip: <InfoTip title="Visitors" text="Different visitors who searched it." />, value: r => r.visitors, format: 'number' },
    lastCol,
  ]

  return (
    <>
      <div className="an-kpis an-ix-facts" role="group" aria-label="Site search in numbers">
        <FactTile
          label="Searches"
          tip={{ event: 'search', title: 'Searches' }}
          value={fmtNumber(total)}
          delta={searchRow ? { value: searchRow.count, previous: searchRow.previousCount, periodLabel } : undefined}
        />
        <FactTile
          label="People who searched"
          tip={{ text: 'Different visitors who used the site search at least once.' }}
          value={fmtNumber(searchRow?.visitors ?? 0)}
          sub={searchRow && searchRow.sessions ? `${fmtDecimal(searchRow.count / searchRow.sessions, 1)} searches per searching visit` : undefined}
        />
        <FactTile
          label="Different terms"
          tip={{ text: 'Distinct search terms (lower-cased and trimmed). The tables list the top 100.' }}
          value={data.searchTerms.length >= 100 ? '100+' : fmtNumber(data.searchTerms.length)}
          sub={data.searchTerms[0] ? `top: "${data.searchTerms[0].query}"` : undefined}
          title={data.searchTerms[0]?.query}
        />
        <FactTile
          label="Found nothing"
          tip={{ text: 'Searches that returned no results (among the top 100 such terms). Each one is something a visitor wanted that the directory did not show.' }}
          value={fmtNumber(zeroSearches)}
          sub={total ? `${fmtPercent(Math.min(1, zeroSearches / total), 0)} of searches` : undefined}
        />
      </div>

      <Panel
        title="Searches with no results"
        info={<InfoTip title="Content gaps" text="What visitors searched for and did not find. Popular ones are the listings, categories or articles worth adding next - or synonyms the search should understand." />}
        subtitle="Content gaps - what visitors wanted and didn't find"
        flush
        className="an-ix-gaps"
      >
        <DataTable
          rows={data.zeroResultTerms}
          columns={gapColumns}
          rowKey={r => r.query}
          defaultSort={{ key: 'zeroResults', dir: 'desc' }}
          pageSize={15}
          csvName="search-no-results"
          caption="Searches with no results"
          empty={(
            <EmptyState
              compact
              icon={faMagnifyingGlassMinus}
              title={total ? 'Every search found something' : 'No searches in this period'}
              text="Search terms that return no results are listed here - each one is content visitors wanted."
            />
          )}
        />
      </Panel>

      <Panel
        title="What people search for"
        info={<InfoTip title="Search terms" text="The top 100 terms typed into the site search, with how many results they found on average. Use the arrow to run a search on the live site." />}
        flush
      >
        <DataTable
          rows={data.searchTerms}
          columns={termColumns}
          rowKey={r => r.query}
          defaultSort={{ key: 'searches', dir: 'desc' }}
          pageSize={25}
          csvName="search-terms"
          caption="Search terms"
          empty={<EmptyState compact icon={faMagnifyingGlass} title="No searches in this period" text="Everything visitors type into the site search appears here, with how many results each term found." />}
        />
      </Panel>
    </>
  )
}
