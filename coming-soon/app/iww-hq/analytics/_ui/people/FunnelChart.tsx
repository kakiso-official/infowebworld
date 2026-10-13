'use client'
import { Fragment } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faClock, faFileLines, faHandPointer, faLayerGroup, faSitemap } from '@fortawesome/free-solid-svg-icons'
import type { FunnelStepDef, FunnelStepResult } from '@/lib/analytics/types'
import { fmtDuration, fmtNumber, fmtPercent } from '../../_lib/format'
import { eventHref, pageDetailHref } from '../../_lib/links'
import { useAnalyticsQuery } from '../../_lib/state'
import { eventLabel, pageTypeLabel } from '../../_lib/labels'
import { SrTable } from '../charts/chart-utils'

/* ═══════════════════════════════════════════════════════════════════════════
   FunnelChart - one horizontal bar per step, all in one hue (a funnel is
   one series; the order is in the position, not the color). The pale track
   behind each bar is the step-1 total, so the missing part of the track IS
   the cumulative drop-off. Between steps a connector states the drop in
   words: "1,204 didn't continue (62%) · median 3m 20s to the next step".
   Every number is also in a hidden table for screen readers.
   ═══════════════════════════════════════════════════════════════════════════ */

const KIND_ICON = {
  page: faFileLines,
  page_prefix: faLayerGroup,
  page_type: faSitemap,
  event: faHandPointer,
} as const

/** One-line description of what a step matches ("Any page starting with /business"). */
export function describeStep(def: FunnelStepDef): string {
  switch (def.kind) {
    case 'page': return `Viewed the page ${def.value}`
    case 'page_prefix': return `Viewed any page starting with ${def.value}`
    case 'page_type': return `Viewed any ${pageTypeLabel(def.value).toLowerCase()}`
    case 'event': return `Did "${eventLabel(def.value)}"`
  }
}

export function FunnelChart({ steps, unit }: {
  steps: FunnelStepResult[]
  /** "visits" or "visitors". */
  unit: string
}) {
  const q = useAnalyticsQuery()
  const first = steps[0]?.count ?? 0

  return (
    <figure className="an-fun" aria-label={`Funnel with ${steps.length} steps`}>
      <ol className="an-fun-list">
        {steps.map((s, i) => {
          const pct = first > 0 ? (s.count / first) * 100 : 0
          const href = s.def.kind === 'page' ? pageDetailHref(s.def.value) : s.def.kind === 'event' ? eventHref(s.def.value) : null
          const next = steps[i + 1]
          return (
            <Fragment key={i}>
              <li className="an-fun-step">
                <div className="an-fun-head">
                  <span className="an-fun-num" aria-hidden="true">{i + 1}</span>
                  <span className="an-fun-titles">
                    <span className="an-fun-label">
                      {s.label}
                      {href && (
                        <Link href={q.href(href)} className="an-fun-link" title={s.def.kind === 'event' ? 'Open this event' : 'Open page details'}>
                          <FontAwesomeIcon icon={KIND_ICON[s.def.kind]} aria-hidden="true" />
                          <span className="an-sr">{s.def.kind === 'event' ? 'Open this event' : 'Open page details'}</span>
                        </Link>
                      )}
                    </span>
                    <span className="an-fun-desc">{describeStep(s.def)}</span>
                  </span>
                  <span className="an-fun-nums">
                    <b className="an-fun-count">{fmtNumber(s.count)}</b>
                    <span className="an-fun-rate">{i === 0 ? unit : `${fmtPercent(s.rateFromStart)} of step 1`}</span>
                  </span>
                </div>
                <div className="an-fun-track" aria-hidden="true">
                  <span className="an-fun-bar" style={{ width: `${Math.max(pct, s.count > 0 ? 0.6 : 0)}%` }} />
                </div>
              </li>
              {next && (
                <li className="an-fun-drop" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowDown} className="an-fun-drop-icon" />
                  <span>
                    <b>{fmtNumber(next.dropoff)}</b> didn&apos;t continue
                    {s.count > 0 && <> ({fmtPercent(next.dropoff / s.count, 0)})</>}
                    {' · '}
                    <span className="an-fun-keep">{fmtPercent(next.rateFromPrev, 0)} went on</span>
                  </span>
                  {next.medianMsFromPrev != null && (
                    <span className="an-fun-time" title="Median time between the two steps, for those who made it">
                      <FontAwesomeIcon icon={faClock} /> median {fmtDuration(next.medianMsFromPrev)}
                    </span>
                  )}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
      <SrTable
        caption="Funnel steps"
        headers={['Step', unit[0].toUpperCase() + unit.slice(1), 'Of step 1', 'Of previous step', 'Dropped', 'Median time from previous']}
        rows={steps.map((s, i) => [
          `${i + 1}. ${s.label}`,
          fmtNumber(s.count),
          fmtPercent(s.rateFromStart),
          i === 0 ? '–' : fmtPercent(s.rateFromPrev),
          i === 0 ? '–' : fmtNumber(s.dropoff),
          s.medianMsFromPrev == null ? '–' : fmtDuration(s.medianMsFromPrev),
        ])}
      />
    </figure>
  )
}
