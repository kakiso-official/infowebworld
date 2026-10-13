'use client'
import { faUsersViewfinder } from '@fortawesome/free-solid-svg-icons'
import type { RetentionReport } from '@/lib/analytics/types'
import {
  EmptyState, Heatmap, InfoTip, Panel, ReportView, Segmented, Skeleton, fmtNumber, fmtPercent,
  useAnalyticsQuery, useReport,
} from '..'
import { plural } from './util'

const WEEK_OPTIONS = ['4', '8', '12'] as const
type Weeks = (typeof WEEK_OPTIONS)[number]

/**
 * Weighted week-1 / week-4 return rates over every cohort that has reached
 * that week - the one-line answer above the heatmap.
 */
function retentionSummary(data: RetentionReport): string | null {
  const rate = (k: number) => {
    let size = 0
    let back = 0
    for (const c of data.cohorts) {
      if (c.returned.length >= k && c.size > 0) { size += c.size; back += c.returned[k - 1] }
    }
    return size > 0 ? back / size : null
  }
  const w1 = rate(1)
  if (w1 == null) return null
  const w4 = data.weeks >= 4 ? rate(4) : null
  return `${fmtPercent(w1)} of new visitors came back the week after their first visit`
    + (w4 != null ? `, and ${fmtPercent(w4)} were still coming back in week 4.` : '.')
}

/**
 * Retention cohorts (report `retention`): each row is the visitors whose
 * first visit fell in that week; each cell the share of them who visited
 * again k weeks later. Hatched cells are weeks that haven't happened yet.
 * Filters apply to the first visit ("visitors who first came from Google").
 */
export function RetentionPanel() {
  const q = useAnalyticsQuery()
  const raw = q.param('weeks')
  const weeks: Weeks = (WEEK_OPTIONS as readonly string[]).includes(raw ?? '') ? raw as Weeks : '8'
  const r = useReport<RetentionReport>('retention', { weeks })

  return (
    <Panel
      title="Do visitors come back?"
      info={(
        <InfoTip
          title="Retention cohorts"
          text="Visitors are grouped by the week of their very first visit (rows). Each cell shows the share of that group who visited again 1, 2, 3... weeks later. Darker = more came back. Hatched cells are weeks that haven't happened yet. Filters apply to the first visit."
        />
      )}
      tabs={(
        <Segmented<Weeks>
          size="sm"
          ariaLabel="Weeks to follow"
          value={weeks}
          onChange={v => q.set({ weeks: v === '8' ? null : v }, { replace: true })}
          items={WEEK_OPTIONS.map(w => ({ key: w, label: `${w} weeks` }))}
        />
      )}
      className="an-ix-retention"
    >
      <ReportView state={r} compact skeleton={<Skeleton variant="block" height={260} />}>
        {data => {
          const hasData = data.cohorts.some(c => c.size > 0)
          if (!hasData) {
            return (
              <EmptyState
                compact
                icon={faUsersViewfinder}
                title="No new visitors in this period"
                text="Each week of first-time visitors becomes a row here, and the following weeks show how many of them came back. Choose a longer date range to see more cohorts."
              />
            )
          }
          const summary = retentionSummary(data)
          const cols = Array.from({ length: data.weeks }, (_, i) => ({
            key: String(i + 1),
            label: `W${i + 1}`,
            title: `Week ${i + 1} after the first visit`,
          }))
          const values = data.cohorts.map(c => cols.map((_, k) => (
            k < c.returned.length && c.size > 0 ? c.returned[k] / c.size : null
          )))
          return (
            <>
              {summary && <p className="an-ix-lede">{summary}</p>}
              <Heatmap
                ariaLabel="Share of each week's new visitors who came back in later weeks"
                rowHeader="First visit"
                metaHeader="Visitors"
                rows={data.cohorts.map(c => ({ key: c.cohort, label: `w/c ${c.label}`, text: `Week of ${c.label}`, meta: fmtNumber(c.size) }))}
                cols={cols}
                values={values}
                format="percent"
                display={v => fmtPercent(v, 0)}
                showValues
                minCellWidth={46}
                legendLabels={['Fewer came back', 'More came back']}
                tooltip={(v, ri, ci) => {
                  const c = data.cohorts[ri]
                  if (v == null) {
                    return (
                      <>
                        <div className="an-tt-head">Week of {c.label} · week {ci + 1}</div>
                        <div>{c.size === 0 ? 'No new visitors that week' : 'This week has not happened yet'}</div>
                      </>
                    )
                  }
                  const back = c.returned[ci]
                  return (
                    <>
                      <div className="an-tt-head">First visit in the week of {c.label}</div>
                      <div>
                        <b className="an-tt-val">{fmtPercent(v)}</b> came back in week {ci + 1}
                      </div>
                      <div className="an-tt-foot">{fmtNumber(back)} of {fmtNumber(c.size)} {plural(c.size, 'visitor')}</div>
                    </>
                  )
                }}
              />
            </>
          )
        }}
      </ReportView>
    </Panel>
  )
}
