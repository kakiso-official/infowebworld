import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faChartLine, faTowerBroadcast, faArrowRightToBracket, faFileLines, faRoute, faFilter,
  faUsers, faUserPlus, faHandPointer, faEarthAmericas, faGaugeHigh, faTriangleExclamation, faGear,
} from '@fortawesome/free-solid-svg-icons'

/* The analytics sub-nav, in order. `route` is the folder under
   app/iww-hq/analytics ('' = Overview). `subtitle` is the one-line
   plain-English answer each page's <PageHeader> can lead with. */
export interface AnalyticsSection {
  route: string
  label: string
  icon: IconDefinition
  subtitle: string
  /** The page ignores the date range - the control bar hides range + compare. */
  live?: boolean
}

export const ANALYTICS_NAV: AnalyticsSection[] = [
  { route: '', label: 'Overview', icon: faChartLine, subtitle: 'How many people visited, where they came from and what they did.' },
  { route: 'realtime', label: 'Realtime', icon: faTowerBroadcast, subtitle: 'Who is on the site right now and what they are looking at.', live: true },
  { route: 'acquisition', label: 'Traffic sources', icon: faArrowRightToBracket, subtitle: 'Where your visitors come from.' },
  { route: 'pages', label: 'Pages', icon: faFileLines, subtitle: 'Which pages people view, land on and leave from.' },
  { route: 'journeys', label: 'Journeys', icon: faRoute, subtitle: 'The paths visitors take from page to page.' },
  { route: 'funnels', label: 'Funnels', icon: faFilter, subtitle: 'How many visitors make it through each step, and where they drop off.' },
  { route: 'sessions', label: 'Visitors', icon: faUsers, subtitle: 'Every visit, one row each. Open one to replay it.' },
  { route: 'signups', label: 'Signups', icon: faUserPlus, subtitle: 'New business accounts and the journey that led to each one.' },
  { route: 'events', label: 'Events', icon: faHandPointer, subtitle: 'Clicks, searches, signups and every other action visitors take.' },
  { route: 'audience', label: 'Audience', icon: faEarthAmericas, subtitle: 'Who your visitors are: countries, devices, languages and loyalty.' },
  { route: 'performance', label: 'Performance', icon: faGaugeHigh, subtitle: 'How fast pages load and respond for real visitors.' },
  { route: 'errors', label: 'Errors', icon: faTriangleExclamation, subtitle: 'Broken links (404s) and script errors visitors run into.' },
  { route: 'settings', label: 'Settings', icon: faGear, subtitle: 'Tracking health, privacy, timezone and excluding your own visits.', live: true },
]

/** The section for a route segment (falls back to Overview). */
export function sectionFor(route: string): AnalyticsSection {
  return ANALYTICS_NAV.find(s => s.route === route) ?? ANALYTICS_NAV[0]
}
