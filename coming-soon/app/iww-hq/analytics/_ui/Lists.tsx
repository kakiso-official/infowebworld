'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faLanguage, faMagnifyingGlassChart, faTag } from '@fortawesome/free-solid-svg-icons'
import type { BreakdownRow, FilterKey, PageRow } from '@/lib/analytics/types'
import { sourceForHost } from '@/lib/analytics/sources'
import { countryName } from '../_lib/format'
import { NONE_VALUE } from '../_lib/labels'
import { useAnalyticsQuery } from '../_lib/state'
import { livePageHref, pageDetailHref } from '../_lib/links'
import { BarList, type BarListRow } from './BarList'
import { BrowserIcon, ChannelIcon, CountryFlag, DeviceIcon, OsIcon, SourceIcon } from './Icons'
import { PageTypeDot } from './Badges'

/** Which dimension a BreakdownRow list shows - decides icon, filter and wording. */
export type Dimension =
  | 'channel' | 'source' | 'ai' | 'referrer' | 'campaign' | 'medium'
  | 'country' | 'region' | 'city' | 'device' | 'browser' | 'os'
  | 'entry' | 'exit' | 'page' | 'pageType' | 'language' | 'screen'

/** Filter key a click on a row of this dimension sets (null = not filterable). */
export const DIMENSION_FILTER: Record<Dimension, FilterKey | null> = {
  channel: 'channel', source: 'source', ai: 'source', referrer: 'referrer', campaign: 'campaign', medium: 'medium',
  country: 'country', region: 'region', city: 'city', device: 'device', browser: 'browser', os: 'os',
  entry: 'entry', exit: 'exit', page: 'page', pageType: 'pageType', language: null, screen: null,
}

const DIMENSION_NOUN: Record<Dimension, string> = {
  channel: 'channel', source: 'source', ai: 'AI assistant', referrer: 'referrer', campaign: 'campaign', medium: 'medium',
  country: 'country', region: 'region', city: 'city', device: 'device', browser: 'browser', os: 'operating system',
  entry: 'landing page', exit: 'exit page', page: 'page', pageType: 'page type', language: 'language', screen: 'screen size',
}

const str = (v: string | number | null | undefined): string | null => (v == null || v === '' ? null : String(v))

/** The icon a row of `dim` gets (brand / channel / flag / device...). */
export function dimensionIcon(dim: Dimension, row: Pick<BreakdownRow, 'key' | 'extra'>): ReactNode {
  const x = row.extra ?? {}
  switch (dim) {
    case 'channel': return <ChannelIcon channel={row.key} />
    case 'source': case 'ai': return <SourceIcon source={row.key} channel={str(x.channel)} />
    case 'referrer': return <SourceIcon source={sourceForHost(row.key)?.key ?? null} channel="referral" />
    case 'campaign': case 'medium': return <span className="an-ico" aria-hidden="true"><FontAwesomeIcon icon={faTag} /></span>
    case 'country': return <CountryFlag code={row.key} decorative />
    case 'region': case 'city': return <CountryFlag code={str(x.country)} decorative />
    case 'device': return <DeviceIcon device={row.key} />
    case 'browser': return <BrowserIcon browser={row.key} />
    case 'os': return <OsIcon os={row.key} />
    case 'entry': case 'exit': case 'page': return <PageTypeDot pageType={str(x.pageType) ?? str(x.page_type)} />
    case 'pageType': return <PageTypeDot pageType={row.key} />
    case 'language': return <span className="an-ico" aria-hidden="true"><FontAwesomeIcon icon={faLanguage} /></span>
    default: return null
  }
}

/** Muted second text for a row of `dim` (the country of a city, source/medium of a campaign). */
function dimensionSub(dim: Dimension, row: BreakdownRow): ReactNode {
  const x = row.extra ?? {}
  if ((dim === 'city' || dim === 'region') && str(x.country)) return countryName(String(x.country))
  if (dim === 'campaign' && (str(x.source) || str(x.medium))) return [str(x.source), str(x.medium)].filter(Boolean).join(' / ')
  if ((dim === 'entry' || dim === 'exit' || dim === 'page') && row.label !== row.key) return <span className="an-mono">{row.key}</span>
  return null
}

/** Unique row id: city / region rows are keyed by name only, which repeats across countries. */
export function placeRowId(dim: Dimension, row: Pick<BreakdownRow, 'key' | 'extra'>): string {
  if (dim !== 'city' && dim !== 'region') return row.key
  const x = row.extra ?? {}
  return [str(x.country), dim === 'city' ? str(x.region) : null, row.key].filter(v => v != null).join('|')
}

/**
 * Add a row's dimension filter. A city / region row also pins its country
 * (and a city its region), so the filtered numbers match the row clicked -
 * "(not set)" under United States must not become "unknown city, anywhere".
 */
export function applyDimensionFilter(
  q: Pick<ReturnType<typeof useAnalyticsQuery>, 'set' | 'setFilter'>,
  dim: Dimension,
  filterKey: FilterKey,
  row: Pick<BreakdownRow, 'key' | 'extra'>,
): void {
  if (dim !== 'city' && dim !== 'region') { q.setFilter(filterKey, row.key); return }
  const x = row.extra ?? {}
  if (!('country' in x)) { q.setFilter(filterKey, row.key); return }
  q.set({
    [`f.${filterKey}`]: row.key,
    // The reports send country null for "unknown country" ('(none)' as a filter value).
    'f.country': str(x.country) ?? NONE_VALUE,
    ...(dim === 'city' && str(x.region) ? { 'f.region': str(x.region) } : {}),
  })
}

export interface DimensionListProps {
  dim: Dimension
  rows: BreakdownRow[]
  /** Which number the bar and value show. Default 'visitors'. */
  metric?: 'visitors' | 'sessions' | 'pageviews'
  /** Value column header ("Visitors"). */
  valueHeader?: ReactNode
  /** Label column header (defaults to the dimension name). */
  labelHeader?: ReactNode
  limit?: number
  /** Extra cell per row (e.g. <Delta/> or a bounce rate). */
  secondary?: (row: BreakdownRow) => ReactNode
  secondaryHeader?: ReactNode
  /** Override what a click does (default: add the dimension filter). */
  onRowClick?: (row: BreakdownRow) => void
  /** Internal details link per row. Pages get page details automatically. */
  detailsHref?: (row: BreakdownRow) => string | undefined
  empty?: ReactNode
  showShare?: boolean
}

/**
 * A BarList for any "breakdown by X" report rows, with the right icon per
 * dimension and click-to-filter wired to the URL. Use this for channels,
 * sources, countries, devices, browsers... - one line per panel tab.
 *
 *   <DimensionList dim="country" rows={data.countries} limit={8} />
 */
export function DimensionList({
  dim, rows, metric = 'visitors', valueHeader, labelHeader, limit, secondary, secondaryHeader, onRowClick,
  detailsHref, empty, showShare,
}: DimensionListProps) {
  const q = useAnalyticsQuery()
  const filterKey = DIMENSION_FILTER[dim]
  const isPage = dim === 'entry' || dim === 'exit' || dim === 'page'
  // City / region keys repeat across countries ("London", or '(none)' per country): make row ids unique.
  const rowId = (r: BreakdownRow) => placeRowId(dim, r)
  const byKey = new Map(rows.map(r => [rowId(r), r]))
  const barRows: BarListRow[] = rows.map(r => ({
    key: rowId(r),
    label: isPage && r.label === r.key ? <span className="an-mono">{r.label}</span> : r.label,
    text: r.label,
    sub: dimensionSub(dim, r),
    icon: dimensionIcon(dim, r),
    value: (metric === 'pageviews' ? r.pageviews : metric === 'sessions' ? r.sessions : r.visitors) ?? 0,
    share: metric === 'visitors' ? r.share : null,
    secondary: secondary?.(r),
    href: detailsHref ? detailsHref(r) : isPage && r.key.startsWith('/') ? pageDetailHref(r.key) : undefined,
    external: isPage && r.key.startsWith('/') ? livePageHref(r.key) : undefined,
  }))
  const click = onRowClick
    ? (row: BarListRow) => { const r = byKey.get(row.key); if (r) onRowClick(r) }
    : filterKey
      ? (row: BarListRow) => { const r = byKey.get(row.key); if (r) applyDimensionFilter(q, dim, filterKey, r) }
      : undefined
  const noun = DIMENSION_NOUN[dim]
  return (
    <BarList
      rows={barRows}
      limit={limit}
      labelHeader={labelHeader ?? noun[0].toUpperCase() + noun.slice(1)}
      valueHeader={valueHeader ?? (metric === 'pageviews' ? 'Pageviews' : metric === 'sessions' ? 'Visits' : 'Visitors')}
      secondaryHeader={secondaryHeader}
      onRowClick={click}
      clickHint={`Show only this ${noun}`}
      empty={empty}
      showShare={showShare ?? metric === 'visitors'}
    />
  )
}

export interface PageListProps {
  rows: PageRow[]
  /** Which number to rank by. Default 'views'. */
  metric?: 'views' | 'visitors' | 'entries' | 'exits'
  /** Filter a row click sets: 'page' (visited), 'entry' (landed on), 'exit'. Default 'page'. */
  filterKey?: 'page' | 'entry' | 'exit'
  limit?: number
  secondary?: (row: PageRow) => ReactNode
  secondaryHeader?: ReactNode
  empty?: ReactNode
}

/** BarList for PageRow[]: title over path, page-type dot, details + live-page links, click to filter. */
export function PageList({ rows, metric = 'views', filterKey = 'page', limit, secondary, secondaryHeader, empty }: PageListProps) {
  const q = useAnalyticsQuery()
  const header = metric === 'views' ? 'Views' : metric === 'visitors' ? 'Visitors' : metric === 'entries' ? 'Entrances' : 'Exits'
  const barRows: BarListRow[] = rows.map(r => ({
    key: r.path,
    label: r.title ? r.title : <span className="an-mono">{r.path}</span>,
    text: r.title ? `${r.title} (${r.path})` : r.path,
    sub: r.title ? <span className="an-mono">{r.path}</span> : null,
    icon: <PageTypeDot pageType={r.pageType} />,
    value: r[metric],
    share: metric === 'views' ? r.share : null,
    secondary: secondary?.(r),
    href: pageDetailHref(r.path),
    external: livePageHref(r.path),
  }))
  return (
    <BarList
      rows={barRows}
      limit={limit}
      labelHeader={filterKey === 'entry' ? 'Landing page' : filterKey === 'exit' ? 'Exit page' : 'Page'}
      valueHeader={header}
      secondaryHeader={secondaryHeader}
      onRowClick={row => q.setFilter(filterKey, row.key)}
      clickHint={filterKey === 'entry' ? 'Show only visits that landed here' : filterKey === 'exit' ? 'Show only visits that left from here' : 'Show only visits that saw this page'}
      empty={empty}
      showShare={metric === 'views'}
    />
  )
}

/**
 * Page cell for tables: title over the monospace path, page-type dot, ⓘ to
 * page details and ↗ to the live page. With `onFilter`, clicking the text
 * filters instead of opening details.
 */
export function PathCell({ path, title, pageType, details = true, live = true, onFilter }: {
  path: string
  title?: string | null
  pageType?: string | null
  details?: boolean
  live?: boolean
  onFilter?: () => void
}) {
  const q = useAnalyticsQuery()
  const special = !path.startsWith('/')  // '(entrance)', '(exit)', '(other)'
  const main = (
    <>
      {title ? <span className="an-pc-title">{title}</span> : null}
      <span className={'an-pc-path' + (title ? '' : ' an-pc-path--main')}>{path}</span>
    </>
  )
  return (
    <span className="an-pc">
      {pageType !== undefined && <PageTypeDot pageType={pageType} />}
      {onFilter && !special ? (
        <button type="button" className="an-pc-text an-pc-btn" onClick={e => { e.stopPropagation(); onFilter() }} title="Filter by this page">{main}</button>
      ) : details && !special ? (
        <Link className="an-pc-text an-pc-link" href={q.href(pageDetailHref(path))} onClick={e => e.stopPropagation()} title="Page details">{main}</Link>
      ) : (
        <span className="an-pc-text">{main}</span>
      )}
      {!special && (
        <span className="an-pc-acts">
          {details && onFilter && (
            <Link href={q.href(pageDetailHref(path))} className="an-bl-act" title="Page details" aria-label={`Details for ${path}`} onClick={e => e.stopPropagation()}>
              <FontAwesomeIcon icon={faMagnifyingGlassChart} />
            </Link>
          )}
          {live && (
            <a href={livePageHref(path)} target="_blank" rel="noopener noreferrer" className="an-bl-act" title="Open the live page" aria-label={`Open ${path} in a new tab`} onClick={e => e.stopPropagation()}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          )}
        </span>
      )}
    </span>
  )
}
