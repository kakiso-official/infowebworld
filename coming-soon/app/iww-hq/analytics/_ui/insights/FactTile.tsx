'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import type { MetricFormat } from '@/lib/analytics/types'
import { Delta, InfoTip, useAnalyticsQuery, type InfoTipProps } from '..'

export interface FactTileProps {
  label: string
  /** The ⓘ definition (metric= / title+text / vital= ...). Every tile gets one. */
  tip: InfoTipProps
  /** The answer, already formatted ("Organic search", "54%", "2.1 s"). */
  value: ReactNode
  /** Full text of the value when `value` is shortened (title attribute). */
  title?: string
  /** Muted line under the value ("54% of visitors"). */
  sub?: ReactNode
  /** Change vs the comparison period (green/red by `better`). */
  delta?: { value: number; previous: number | null | undefined; format?: MetricFormat; better?: 'up' | 'down'; periodLabel?: string }
  /** Make the whole tile a button (e.g. "filter by this channel")... */
  onClick?: () => void
  /** ...or a link (range + filters are kept). */
  href?: string
  /** Accessible name of the click target ("Show only organic search"). */
  actionLabel?: string
  /** Long text values (a page title, a channel name) get a smaller font. */
  textValue?: boolean
}

/**
 * A stat tile for answers that are not a plain METRICS number - "biggest
 * channel", "busiest hour", "404 views caused by our own links". Same look
 * as the kit's KpiCard (it reuses the .an-kpi classes) so a row can mix both.
 */
export function FactTile({ label, tip, value, title, sub, delta, onClick, href, actionLabel, textValue }: FactTileProps) {
  const q = useAnalyticsQuery()
  const interactive = !!onClick || !!href
  const name = actionLabel ?? label
  return (
    <div className={'an-kpi an-ix-fact' + (interactive ? ' an-kpi--click' : '')}>
      {onClick ? (
        <button type="button" className="an-kpi-hit" aria-label={name} onClick={onClick} />
      ) : href ? (
        <Link className="an-kpi-hit" href={q.href(href)} aria-label={name} />
      ) : null}
      <div className="an-kpi-label">
        <span>{label}</span>
        <InfoTip title={label} {...tip} />
      </div>
      <div className={'an-kpi-value' + (textValue ? ' an-ix-fact-text' : '')} title={title}>{value}</div>
      {(delta || sub) && (
        <div className="an-kpi-foot">
          {delta && (
            <Delta
              value={delta.value}
              previous={delta.previous}
              format={delta.format}
              better={delta.better}
              periodLabel={delta.periodLabel}
            />
          )}
          {sub && <span className="an-kpi-hint">{sub}</span>}
        </div>
      )}
    </div>
  )
}
