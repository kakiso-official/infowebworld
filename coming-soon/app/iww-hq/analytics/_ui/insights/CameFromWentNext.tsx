'use client'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faDoorOpen, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import type { BreakdownRow, PageDetailReport } from '@/lib/analytics/types'
import {
  BarList, ChannelIcon, InfoTip, PageTypeBadge, channelLabel, fmtDuration, fmtNumber, fmtPercent, livePageHref,
  pageDetailHref, useAnalyticsQuery, type BarListRow,
} from '..'

const ENTRANCE = '(entrance)'
const EXIT = '(exit)'

/** Previous / next page rows -> BarList rows. Special rows (entrance, exit) are not links. */
function toRows(rows: BreakdownRow[], side: 'prev' | 'next'): BarListRow[] {
  return rows.map(r => {
    if (r.key === ENTRANCE) {
      const ch = typeof r.extra?.channel === 'string' ? r.extra.channel : null
      return {
        key: r.key,
        label: <b>Entered the site here</b>,
        text: 'Entered the site here',
        sub: ch ? `mostly ${channelLabel(ch).toLowerCase()}` : undefined,
        icon: ch ? <ChannelIcon channel={ch} /> : <span className="an-ico" aria-hidden="true"><FontAwesomeIcon icon={faDoorOpen} /></span>,
        value: r.pageviews ?? r.sessions,
        share: r.share,
        clickable: false,
      }
    }
    if (r.key === EXIT) {
      return {
        key: r.key,
        label: <b>Left the site</b>,
        text: 'Left the site',
        icon: <span className="an-ico" aria-hidden="true"><FontAwesomeIcon icon={faRightFromBracket} /></span>,
        value: r.pageviews ?? r.sessions,
        share: r.share,
        clickable: false,
      }
    }
    return {
      key: r.key,
      label: <span className="an-mono">{r.label}</span>,
      text: `${side === 'prev' ? 'From' : 'To'} ${r.key}`,
      value: r.pageviews ?? r.sessions,
      share: r.share,
      href: pageDetailHref(r.key),
      external: livePageHref(r.key),
    }
  })
}

/**
 * The page's place in visitors' journeys, read left to right: where the
 * views came from (the previous page of the visit, or "entered the site
 * here" with the main channel) -> this page -> where people went next (or
 * "left the site"). Clicking a page opens that page's details, so you can
 * walk a journey hop by hop.
 */
export function CameFromWentNext({ data }: { data: PageDetailReport }) {
  const q = useAnalyticsQuery()
  const router = useRouter()
  const open = (row: BarListRow) => router.push(q.href(pageDetailHref(row.key)))
  const k = data.kpis

  return (
    <div className="an-ix-flow">
      <div className="an-ix-flow-col">
        <h3 className="an-ix-flow-title">
          Came from
          <InfoTip title="Came from" text="For every view of this page: the page the visitor saw just before it in the same visit, or 'Entered the site here' when this was the first page of the visit (with the channel that brought most of those visits)." />
        </h3>
        <BarList
          rows={toRows(data.previousPages, 'prev')}
          labelHeader="Previous page"
          valueHeader="Views"
          onRowClick={open}
          clickHint="Open that page's details"
          empty={<div className="an-bl-empty">No views of this page in this period.</div>}
        />
      </div>

      <div className="an-ix-flow-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></div>

      <div className="an-ix-flow-mid">
        <div className="an-ix-flow-mid-card">
          <PageTypeBadge pageType={data.pageType} />
          <div className="an-ix-flow-mid-title" title={data.path}>{data.title || data.path}</div>
          <dl className="an-ix-flow-stats">
            <div><dt>Views</dt><dd>{fmtNumber(k.views.value)}</dd></div>
            <div><dt>Avg. time</dt><dd>{fmtDuration(k.avgEngagedMs.value)}</dd></div>
            <div><dt>Left from here</dt><dd>{fmtPercent(k.exitRate.value, 0)}</dd></div>
          </dl>
        </div>
      </div>

      <div className="an-ix-flow-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></div>

      <div className="an-ix-flow-col">
        <h3 className="an-ix-flow-title">
          Went next
          <InfoTip title="Went next" text="The page visitors opened right after this one in the same visit, or 'Left the site' when this was their last page. Shares are of everything that happened next." />
        </h3>
        <BarList
          rows={toRows(data.nextPages, 'next')}
          labelHeader="Next page"
          valueHeader="Views"
          onRowClick={open}
          clickHint="Open that page's details"
          empty={<div className="an-bl-empty">Nobody went anywhere from this page in this period.</div>}
        />
      </div>
    </div>
  )
}
