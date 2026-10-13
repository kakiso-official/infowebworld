'use client'
import { useRouter } from 'next/navigation'
import { faArrowRightFromBracket, faFileLines, faLayerGroup, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import type { PageRow, PagesReport } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  DataTable, Delta, EmptyState, InfoTip, PageHeader, PageTypeBadge, Panel, PathCell, ReportView, SearchInput,
  Segmented, Skeleton, fmtNumber, fmtPercent, fmtRange, pageDetailHref, pageTypeLabel, sectionFor,
  useAnalyticsQuery, useReport, type Column,
} from '../_ui'
import { comparisonLabel } from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Pages. Every page with its views, visitors, entrances,
   bounce, exit rate, time and scroll; switch between all pages, landing
   pages, exit pages and page types. Sorting, search and paging run on the
   server (report `pages`), so it works the same for 10 pages or 10,000.
   Clicking a page opens its details (where visitors came from and went).
   ════════════════════════════════════════════════════════════════════════ */

type Group = 'path' | 'entry' | 'exit' | 'page_type'
const GROUPS: Group[] = ['path', 'entry', 'exit', 'page_type']
const PAGE_SIZE = 50
/** The server's default order per view (pages.ts / _shared.ts pageRowsRaw). */
const DEFAULT_SORT: Record<Group, string> = { path: 'views', entry: 'entries', exit: 'exits', page_type: 'views' }
const SORT_KEYS = ['path', 'views', 'visitors', 'entries', 'exits', 'exitRate', 'bounceRate', 'avgEngagedMs', 'avgScrollPct']

const GROUP_TEXT: Record<Group, { noun: string; caption: string; empty: string }> = {
  path: { noun: 'pages', caption: 'All pages', empty: 'Every page that was viewed in this period appears here with how people used it.' },
  entry: { noun: 'landing pages', caption: 'Landing pages', empty: 'Pages where visits started appear here - usually the ones found in search or shared.' },
  exit: { noun: 'exit pages', caption: 'Exit pages', empty: 'The last page of each visit appears here - where people left the site.' },
  page_type: { noun: 'page types', caption: 'Page types', empty: 'Views grouped by kind of page (category, company profile, blog post...) appear here.' },
}

export default function PagesPage() {
  const q = useAnalyticsQuery()
  const rawGroup = q.param('group') as Group | null
  const group: Group = rawGroup && GROUPS.includes(rawGroup) ? rawGroup : 'path'
  const rawSort = q.param('sort')
  const sort = rawSort && SORT_KEYS.includes(rawSort) ? rawSort : DEFAULT_SORT[group]
  const dir: 'asc' | 'desc' = q.param('dir') === 'asc' ? 'asc' : 'desc'
  const search = q.param('q') ?? ''
  const offset = Math.max(0, Number.parseInt(q.param('offset') ?? '0', 10) || 0)

  const r = useReport<PagesReport>('pages', {
    group: group === 'path' ? null : group,
    sort: rawSort ? sort : null,
    dir: q.param('dir') ? dir : null,
    q: search || null,
    limit: PAGE_SIZE,
    offset: offset || null,
  })
  const range = r.data?.range

  return (
    <>
      <PageHeader
        title="Pages"
        subtitle={sectionFor('pages').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}</span>}
      />
      <Panel
        title={GROUP_TEXT[group].caption}
        info={<InfoTip title="Pages" text="All pages: every page viewed. Landing pages: where visits started. Exit pages: where visits ended. By page type: the same numbers for each kind of page. Click a column to sort; click a page to open its details." />}
        tabs={(
          <Segmented<Group>
            ariaLabel="Which pages"
            value={group}
            onChange={g => q.set({ group: g === 'path' ? null : g, sort: null, dir: null, offset: null })}
            items={[
              { key: 'path', label: 'All pages', icon: faFileLines },
              { key: 'entry', label: 'Landing', icon: faRightToBracket },
              { key: 'exit', label: 'Exit', icon: faArrowRightFromBracket },
              { key: 'page_type', label: 'By type', icon: faLayerGroup },
            ]}
          />
        )}
        flush
        className="an-ix-flushstates"
      >
        <ReportView state={r} compact skeleton={<Skeleton variant="table" rows={12} />}>
          {data => (
            <PagesTable
              data={data}
              group={group}
              sort={sort}
              dir={dir}
              search={search}
              offset={offset}
              loading={r.refreshing}
            />
          )}
        </ReportView>
      </Panel>
    </>
  )
}

function PagesTable({ data, group, sort, dir, search, offset, loading }: {
  data: PagesReport
  group: Group
  sort: string
  dir: 'asc' | 'desc'
  search: string
  offset: number
  loading: boolean
}) {
  const q = useAnalyticsQuery()
  const router = useRouter()
  const byType = group === 'page_type'
  const periodLabel = comparisonLabel(data.range)
  const withChange = data.rows.some(r => r.previousViews != null)
  const totalViewsShare = data.rows.reduce((s, r) => s + r.share, 0)

  const columns: Column<PageRow>[] = [
    byType
      ? {
          key: 'path', header: 'Page type', sticky: true, minWidth: 200,
          value: r => r.title ?? r.path,
          render: r => (
            <span className="an-ix-name">
              <PageTypeBadge pageType={r.path} />
              <InfoTip pageType={r.path} />
            </span>
          ),
          csv: r => pageTypeLabel(r.path),
        }
      : {
          key: 'path', header: 'Page', sticky: true, minWidth: 240,
          value: r => r.path,
          render: r => <PathCell path={r.path} title={r.title} pageType={r.pageType} />,
          csv: r => r.path,
        },
    { key: 'views', header: 'Views', tip: <InfoTip metric="views" />, value: r => r.views, format: 'number', bar: group === 'path' || byType },
  ]
  if (withChange) {
    columns.push({
      key: 'change', header: 'Change', sortable: false, align: 'right',
      tip: <InfoTip title="Change" text={`Views compared with ${periodLabel}.`} />,
      value: r => r.previousViews ?? null,
      csvHeader: 'Views (previous period)',
      render: r => (r.previousViews != null ? <Delta value={r.views} previous={r.previousViews} variant="text" periodLabel={periodLabel} /> : '–'),
    })
  }
  columns.push(
    { key: 'visitors', header: 'Visitors', tip: <InfoTip metric="visitors" text="Unique visitors who viewed this page." />, value: r => r.visitors, format: 'number' },
    { key: 'entries', header: 'Entrances', tip: <InfoTip metric="entries" />, value: r => r.entries, format: 'number', bar: group === 'entry' },
    {
      key: 'bounceRate', header: 'Bounce rate', format: 'percent',
      tip: <InfoTip metric="bounceRate" text="Of the visits that started on this page: the share that left quickly (one page, under 10 seconds of active time, no key action). Empty when no visit started here." />,
      value: r => r.bounceRate,
    },
    { key: 'exits', header: 'Exits', tip: <InfoTip metric="exits" />, value: r => r.exits, format: 'number', bar: group === 'exit' },
    { key: 'exitRate', header: 'Exit rate', tip: <InfoTip metric="exitRate" />, value: r => r.exitRate, format: 'percent' },
    { key: 'avgEngagedMs', header: 'Avg. time', tip: <InfoTip title="Avg. time on page" text="Average active time per view - only while the tab was visible and in use." />, value: r => r.avgEngagedMs, format: 'duration' },
    { key: 'avgScrollPct', header: 'Scroll', tip: <InfoTip metric="avgScrollPct" />, value: r => r.avgScrollPct / 100, format: 'percent', csv: r => r.avgScrollPct },
  )

  const open = (r: PageRow) => {
    if (byType) q.setFilter('pageType', r.path)
    else router.push(q.href(pageDetailHref(r.path)))
  }

  // The headline answer, only when the view is in its natural order (top first, page 1, no search).
  const top = data.rows[0]
  const natural = !search && offset === 0 && sort === DEFAULT_SORT[group] && dir === 'desc' && !!top
  const lede = natural ? ledeFor(group, data, top) : null

  return (
    <>
      {lede && <p className="an-ix-lede an-ix-lede--panel">{lede}</p>}
      <DataTable
        rows={data.rows}
        columns={columns}
        rowKey={r => r.path}
        onRowClick={open}
        sort={{ key: sort, dir }}
        onSortChange={(key, d) => q.set({ sort: key === DEFAULT_SORT[group] && d === 'desc' ? null : key, dir: d === 'desc' ? null : d, offset: null }, { replace: true })}
        server={{ total: data.total, offset, limit: PAGE_SIZE, onPageChange: o => q.set({ offset: o || null }) }}
        csvName={`pages-${group}`}
        caption={GROUP_TEXT[group].caption}
        loading={loading}
        toolbar={(
          <>
            <SearchInput
              value={search}
              onChange={v => q.set({ q: v.trim() || null, offset: null }, { replace: true })}
              placeholder={byType ? 'Find a page type' : 'Find a page (path contains...)'}
              ariaLabel="Search pages"
            />
            <span className="an-ix-count">
              {fmtNumber(data.total)} {data.total === 1 ? GROUP_TEXT[group].noun.replace(/s$/, '') : GROUP_TEXT[group].noun}
              {!byType && totalViewsShare > 0 && totalViewsShare < 0.995 && offset === 0 && !search
                ? ` · top ${fmtNumber(data.rows.length)} = ${fmtPercent(totalViewsShare, 0)} of views`
                : ''}
            </span>
          </>
        )}
        empty={(
          <EmptyState
            compact
            icon={faFileLines}
            title={search ? `Nothing matches "${search}"` : `No ${GROUP_TEXT[group].noun} in this period`}
            text={search ? 'Search looks for the text anywhere in the page address. Try a shorter piece of the path.' : GROUP_TEXT[group].empty}
            action={search ? <button type="button" className="an-btn an-btn--sm" onClick={() => q.set({ q: null, offset: null })}>Clear search</button> : undefined}
          />
        )}
      />
    </>
  )
}

/** One sentence that answers the view's main question with the top row. */
function ledeFor(group: Group, data: PagesReport, top: PageRow): string {
  const name = group === 'page_type' ? pageTypeLabel(top.path) : (top.title ? `"${top.title}" (${top.path})` : top.path)
  switch (group) {
    case 'path':
      return `${fmtNumber(data.total)} different ${data.total === 1 ? 'page was' : 'pages were'} viewed. The most viewed is ${name} with ${fmtPercent(top.share, 0)} of all views.`
    case 'entry':
      return `Visits started on ${fmtNumber(data.total)} different ${data.total === 1 ? 'page' : 'pages'}. The top landing page is ${name}: ${fmtNumber(top.entries)} entrances`
        + (top.bounceRate != null ? `, ${fmtPercent(top.bounceRate, 0)} of them bounced.` : '.')
    case 'exit':
      return `The page people most often leave from is ${name}: ${fmtNumber(top.exits)} visits ended there (${fmtPercent(top.exitRate, 0)} of its views).`
    case 'page_type':
      return `${name} pages get the most views: ${fmtPercent(top.share, 0)} of all views. Click a type to see only visits that viewed one.`
  }
}
