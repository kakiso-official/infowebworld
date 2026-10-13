'use client'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { VITAL_THRESHOLDS, type VitalStat } from '@/lib/analytics/types'
import { InfoTip, fmtNumber } from '..'
import { ProportionBar } from './ProportionBar'
import { RATING_LABEL, fmtVital, vitalRating, vitalThresholdText, type VitalKey, type VitalRating } from './util'

/* ═══════════════════════════════════════════════════════════════════════════
   Core Web Vitals building blocks. Ratings use Google's status colors
   (good / needs improvement / poor), always paired with an icon and words -
   color is never the only signal. Tokens: --an-ix-good / -ni / -poor
   (app/styles/analytics-insights.css).
   ═══════════════════════════════════════════════════════════════════════════ */

const RATING_ICON = { good: faCircleCheck, ni: faCircleExclamation, poor: faCircleXmark } as const
export const RATING_COLOR: Record<VitalRating, string> = {
  good: 'var(--an-ix-good)',
  ni: 'var(--an-ix-ni)',
  poor: 'var(--an-ix-poor)',
}

/** Icon for a rating (check / exclamation / cross) in its status color, with the rating as text for screen readers. */
export function RatingIcon({ rating }: { rating: VitalRating }) {
  return (
    <span className={`an-ix-rating-ico an-ix-rating-ico--${rating}`} title={RATING_LABEL[rating]}>
      <FontAwesomeIcon icon={RATING_ICON[rating]} aria-hidden="true" />
      <span className="an-sr">{RATING_LABEL[rating]}</span>
    </span>
  )
}

/** "Good" / "Needs improvement" / "Poor" pill with its icon. */
export function RatingBadge({ rating, children }: { rating: VitalRating; children?: ReactNode }) {
  return (
    <span className={`an-ix-rating an-ix-rating--${rating}`}>
      <FontAwesomeIcon icon={RATING_ICON[rating]} aria-hidden="true" />
      {children ?? RATING_LABEL[rating]}
    </span>
  )
}

/** A p75 value with its rating icon - for table cells. `–` when there are no samples. */
export function VitalValue({ vital, stat }: { vital: VitalKey; stat: VitalStat | null | undefined }) {
  if (!stat) return <span className="an-muted">–</span>
  const r = vitalRating(vital, stat.p75)
  return (
    <span className="an-ix-vv">
      <span className="an-num">{fmtVital(vital, stat.p75)}</span>
      <RatingIcon rating={r} />
    </span>
  )
}

/** Good / needs improvement / poor split of the samples as one bar with a legend. */
export function VitalDistribution({ vital, stat, legend = true }: { vital: VitalKey; stat: VitalStat; legend?: boolean }) {
  const th = VITAL_THRESHOLDS[vital]
  return (
    <ProportionBar
      ariaLabel={`${th.short} page loads by rating`}
      legend={legend}
      segments={[
        { key: 'good', label: RATING_LABEL.good, value: stat.good, color: RATING_COLOR.good, icon: <RatingIcon rating="good" />, detail: `≤ ${fmtVital(vital, th.good)}` },
        { key: 'ni', label: 'Needs work', value: stat.needsImprovement, color: RATING_COLOR.ni, icon: <RatingIcon rating="ni" />, detail: `${fmtVital(vital, th.good)} – ${fmtVital(vital, th.poor)}` },
        { key: 'poor', label: RATING_LABEL.poor, value: stat.poor, color: RATING_COLOR.poor, icon: <RatingIcon rating="poor" />, detail: `> ${fmtVital(vital, th.poor)}` },
      ]}
    />
  )
}

/**
 * One vital: name + ⓘ, the 75th-percentile value with its rating, the
 * good / needs-work / poor split of every sample, and the thresholds in
 * words. `core` marks the three metrics Google scores pages on.
 */
export function VitalCard({ vital, stat, samples, core, compact }: {
  vital: VitalKey
  stat: VitalStat | null
  /** Page loads with any vital measured - an upper bound on this metric's sample size. */
  samples?: number
  core?: boolean
  compact?: boolean
}) {
  const th = VITAL_THRESHOLDS[vital]
  const rating = stat ? vitalRating(vital, stat.p75) : null
  return (
    <section className={'an-ix-vital' + (compact ? ' an-ix-vital--compact' : '') + (rating ? ` an-ix-vital--${rating}` : '')} aria-label={th.label}>
      <div className="an-ix-vital-head">
        <span className="an-ix-vital-short">{th.short}</span>
        <span className="an-ix-vital-name">{th.label}</span>
        <InfoTip vital={vital} />
        {core && !compact && <span className="an-ix-vital-core" title="One of the three Core Web Vitals Google uses in search ranking">Core</span>}
      </div>
      {stat && rating ? (
        <>
          <div className="an-ix-vital-value">
            <span className="an-ix-vital-num">{fmtVital(vital, stat.p75)}</span>
            <RatingBadge rating={rating} />
          </div>
          <VitalDistribution vital={vital} stat={stat} legend={!compact} />
          {!compact && (
            <p className="an-ix-vital-foot">
              {th.description} {vitalThresholdText(vital)}.
              {/* samples = page loads with any vital; a metric can have fewer (INP needs an interaction). */}
              {samples != null && <> Measured on up to {fmtNumber(samples)} {samples === 1 ? 'page load' : 'page loads'}.</>}
            </p>
          )}
        </>
      ) : (
        <p className="an-ix-vital-none">
          No measurements yet.{' '}
          {vital === 'inp'
            ? 'INP is only recorded when a visitor taps, clicks or types on a page.'
            : 'Recorded on the first page of each visit (a full page load).'}
        </p>
      )}
    </section>
  )
}
