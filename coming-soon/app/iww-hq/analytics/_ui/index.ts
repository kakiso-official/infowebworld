/* ═══════════════════════════════════════════════════════════════════════════
   InfoWebWorld Analytics - UI kit. Import everything from here:

     import { useReport, useAnalyticsQuery, Panel, KpiCard, ... } from '../_ui'

   Styles: app/styles/analytics.css (loaded by analytics/layout.tsx); every
   class is `an-*`; tokens (--an-text, --an-border, --an-s1..s8...) live on
   .an-root. Page-specific CSS goes in your own stylesheet and should reuse
   the tokens. Light theme only (the admin has no dark mode).

   DATA + STATE (re-exported from ../_lib)
     useAnalyticsQuery()   URL state: range/compare/filters/tz + set(), setFilter(),
                           removeFilter(), clearFilters(), param(), href(path, extra).
                           The URL is the state - page params (tab, group, sort...)
                           go through q.set({ ... }) too.
     useReport<T>(report, extra?, opts?)
                           GET /api/admin/analytics/{report} with range+filters+tz.
                           -> { data, error, loading, refreshing, needsMigration, reload }.
                           60 s cache, shared between components, keeps previous data
                           while refreshing. opts: { poll, ignoreRange, ignoreFilters, enabled }.
     postAnalytics(action, body)   POST /api/admin/analytics/{action} (e.g. 'exclude').
     analyticsHref / pageDetailHref / sessionHref / visitorHref / eventHref / livePageHref
                           Links. Always wrap with q.href(...) so range + filters travel.
     fmtNumber, fmtCompact, fmtPercent, fmtDuration, fmtDecimal, fmtMetric, fmtAxis,
     fmtDate, fmtDateShort, fmtTime, fmtTimeSec, fmtDateTime, fmtRelative, fmtRange,
     deltaInfo, countryName, languageName, todayInTz
                           Formatting - pass q.tz to every date/time formatter.
     channelLabel, pageTypeLabel, eventLabel, deviceLabel, FILTER_LABELS,
     filterValueLabel, humanize, NONE_VALUE
                           Human labels for raw keys.
     SERIES, CHANNEL_COLOR, channelColor, foldChannels, pageTypeColor, OTHER_COLOR,
     PREVIOUS_COLOR, seqColor
                           Chart colors (CSS tokens). Color follows the entity:
                           use channelColor(ch) / SERIES[i] in a FIXED order.
     downloadCsv, toCsv    CSV export (DataTable already has a CSV button).
     ANALYTICS_NAV, sectionFor   Sub-nav sections with their one-line subtitles.
     useElementWidth, useDismiss, useNow, usePrefersReducedMotion   DOM hooks.
     setAnalyticsTimeZone, getTimeZoneOverride, useViewerTimeZone   Settings tz.

   LAYOUT
     PageHeader     H1 + one-line answer + meta/actions (+ optional back link). One per page.
     Panel          Card with title, InfoTip, tabs slot, actions, "View all →" footer.
     PanelGrid      2-column (1 under ~1100px) or 3-column grid of panels.
     Tabs           Underline tabs inside a panel (Channels / Sources / ...).
     Segmented      Pill toggle for a view mode (All / Landing / Exit).
     MenuSelect     Dropdown of options with a check (generic single choice).
     SearchInput    Debounced search box with clear button.

   NUMBERS
     KpiCard        Stat tile: value, delta vs previous (green/red by METRICS.better),
                    sparkline, InfoTip; selectable (drives a chart) or a link.
     KpiStrip       Responsive row of KpiCards.
     Delta / MetricDelta   "+12%" / "-3.1 pts" with arrow and good/bad color.
     InfoTip        ⓘ definition: metric= | channel= | pageType= | event= | vital= | title+text.

   LISTS + TABLES
     BarList        Plausible-style ranked rows (bar ∝ value, icon, value, share,
                    click row = filter, hover = filter hint + details/↗ links).
     DimensionList  BarList for BreakdownRow[] of a dimension (channel, source,
                    country, device...) with the right icons + click-to-filter.
     PageList       BarList for PageRow[] (title over path, details + live links).
     DataTable      Sortable (client or server), sticky header, inline bar on the
                    primary metric, paging (client or server), row click, CSV.
     PathCell       Table cell for a page: title over mono path, type dot, ⓘ, ↗.
     LiveFeed       Live activity rows -> session timeline.
     InsightList    "What stands out" sentences with tone icons + "Show me" links.

   CHARTS (hand-built SVG, dataviz-skill specs; all have hover/focus tooltips
   and a hidden table for screen readers)
     TimeSeriesChart   Line + soft area, previous period dashed, crosshair tooltip
                       with current vs previous + delta, partialLast for "today".
     StackedBars / StackedArea   Part-to-whole over time (channel mix); legend
                       toggles series; pass foldChannels(...) output for channels.
     BarChart       Vertical bars for ordered categories (per minute, scroll depth,
                    frequency); highlightKey for the emphasis form.
     Heatmap        Matrix on one blue ramp (hour-of-week, retention cohorts).
     Sparkline      Tiny trend for tiles/cells (decorative; pair with a number).
     Legend, ChartTooltip, TooltipRow, SrTable, niceTicks   Building blocks for new charts.

   ICONS + BADGES (Font Awesome only)
     SourceIcon (brand or channel icon), ChannelIcon, DeviceIcon, BrowserIcon, OsIcon,
     CountryFlag (flagcdn img with alt), EventIcon, PageviewIcon,
     Badge (neutral/accent/info/good/warn/bad), ChannelBadge, PageTypeDot,
     PageTypeBadge, LiveDot.

   STATES
     ReportView     <ReportView state={r} skeleton={...}>{data => ...}</ReportView>
                    handles loading -> skeleton, error -> ErrorState(retry),
                    503 -> MigrationNotice, refresh -> dimmed previous render.
     Skeleton       variant block | chart | list | kpis | table | text.
     EmptyState     Say what will appear and why it is empty now.
     ErrorState, MigrationNotice.

   CHROME (used by analytics/layout.tsx; exported for completeness)
     SubNav, ControlBar, DateRangePicker, CompareSelect, FilterChips,
     RefreshControl, LivePill.

   Rules of thumb: "Visits" not "Sessions" in labels; every metric/column gets
   an InfoTip; every list click filters; every path links to page details;
   never import lib/analytics/query.ts or db.ts here (server-only MySQL).
   ═══════════════════════════════════════════════════════════════════════════ */

export * from '../_lib'

export { InfoTip, type InfoTipProps, type MetricKey, type VitalKey } from './InfoTip'
export { Delta, MetricDelta, type DeltaProps } from './Delta'
export { Badge, ChannelBadge, PageTypeDot, PageTypeBadge, LiveDot, type BadgeTone } from './Badges'
export {
  SourceIcon, ChannelIcon, DeviceIcon, BrowserIcon, OsIcon, CountryFlag, EventIcon, PageviewIcon,
} from './Icons'
export {
  Skeleton, EmptyState, ErrorState, MigrationNotice, ReportView,
  type SkeletonProps, type ReportViewProps,
} from './States'
export {
  PageHeader, Panel, PanelGrid, Tabs, Segmented, SearchInput,
  type PanelProps, type TabItem,
} from './Layout'
export { KpiCard, KpiStrip, type KpiCardProps } from './Kpi'
export { BarList, type BarListRow, type BarListProps } from './BarList'
export {
  DimensionList, PageList, PathCell, dimensionIcon, DIMENSION_FILTER, applyDimensionFilter, placeRowId,
  type Dimension, type DimensionListProps, type PageListProps,
} from './Lists'
export { DataTable, type Column, type DataTableProps } from './DataTable'
export { LiveFeed, InsightList, feedKey } from './Feed'
export {
  MenuSelect, DateRangePicker, CompareSelect, FilterChips, RefreshControl, LivePill, SubNav, ControlBar,
  type MenuOption,
} from './Controls'

export { TimeSeriesChart, type TimeSeriesChartProps, type SeriesDatum } from './charts/TimeSeriesChart'
export { StackedBars, StackedArea, type StackedChartProps, type StackSeries } from './charts/StackedBars'
export { BarChart, type BarChartProps, type BarDatum } from './charts/BarChart'
export { Heatmap, type HeatmapProps } from './charts/Heatmap'
export { Sparkline } from './charts/Sparkline'
export {
  Legend, ChartTooltip, TooltipRow, SrTable, niceTicks, labelIndices, axisLabel, linePath, areaPath,
  roundedTopRect, textWidth, type LegendItem,
} from './charts/chart-utils'
