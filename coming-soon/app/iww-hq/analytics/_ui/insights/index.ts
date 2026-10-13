/* ═══════════════════════════════════════════════════════════════════════════
   Insight-page components (Traffic sources, Pages, Audience, Performance,
   Errors, Events). Built only on the analytics kit (../index.ts); styles in
   app/styles/analytics-insights.css (classes .an-ix-*), which every insight
   page imports.
   ═══════════════════════════════════════════════════════════════════════════ */

export * from './util'
export { FactTile, type FactTileProps } from './FactTile'
export { ProportionBar, type ProportionSegment } from './ProportionBar'
export { BreakdownTable, type BreakdownTableProps } from './BreakdownTable'
export { RatingBadge, RatingIcon, RATING_COLOR, VitalCard, VitalDistribution, VitalValue } from './Vitals'
export { VitalTrendChart, type VitalTrendPoint } from './VitalTrendChart'
export { CameFromWentNext } from './CameFromWentNext'
export { HourOfWeekHeatmap, hourOfWeekSummary } from './HourOfWeek'
export { RetentionPanel } from './RetentionPanel'
export { EventDetailPanel } from './EventDetail'
