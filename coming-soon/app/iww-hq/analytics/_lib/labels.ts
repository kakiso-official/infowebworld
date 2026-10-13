import {
  CHANNEL_META, EVENTS, PAGE_TYPE_META,
  type Channel, type EventName, type FilterKey, type PageType,
} from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import { countryName } from './format'

/* ═══════════════════════════════════════════════════════════════════════════
   Human labels for stored values (channels, page types, events, filters).
   The reports already send labels for rows; these are for the places the UI
   only has a raw key - filter chips, URL params, feed items.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Filter value meaning "no value recorded" (mirrors NONE_VALUE in lib/analytics/query.ts,
    which the UI must not import - it pulls in the database driver). */
export const NONE_VALUE = '(none)'

export const isNone = (v: string | null | undefined): boolean => !v || v === NONE_VALUE

/** "file_download" -> "File download". */
export function humanize(s: string): string {
  const t = s.replace(/[_-]+/g, ' ').trim()
  return t ? t[0].toUpperCase() + t.slice(1) : s
}

export function channelLabel(ch: string | null | undefined): string {
  if (isNone(ch)) return '(not set)'
  return CHANNEL_META[ch as Channel]?.label ?? humanize(ch!)
}

export function pageTypeLabel(pt: string | null | undefined): string {
  if (isNone(pt)) return '(not set)'
  return PAGE_TYPE_META[pt as PageType]?.label ?? humanize(pt!)
}

/** Known event -> its label; custom data-track names are humanized. */
export function eventLabel(name: string | null | undefined): string {
  if (!name) return 'Event'
  return (EVENTS as Record<string, { label: string }>)[name]?.label ?? humanize(name)
}

export function isKnownEvent(name: string): name is EventName {
  return Object.prototype.hasOwnProperty.call(EVENTS, name)
}

const DEVICE_LABELS: Record<string, string> = { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' }
export function deviceLabel(d: string | null | undefined): string {
  if (isNone(d)) return 'Unknown'
  return DEVICE_LABELS[d!] ?? humanize(d!)
}

/** Name of each filter as shown on a chip ("Channel: Organic search"). */
export const FILTER_LABELS: Record<FilterKey, string> = {
  channel: 'Channel',
  source: 'Source',
  medium: 'Medium',
  campaign: 'Campaign',
  referrer: 'Referrer',
  country: 'Country',
  region: 'Region',
  city: 'City',
  device: 'Device',
  browser: 'Browser',
  os: 'OS',
  entry: 'Landing page',
  exit: 'Exit page',
  page: 'Visited page',
  pageType: 'Visited page type',
  visitor: 'Visitor',
  user: 'Account',
  converted: 'Did',
}

const CONVERTED_LABELS: Record<string, string> = {
  any: 'Any key action',
  signup: 'Signed up',
  listing: 'Submitted a listing',
  lead: 'Contacted a business',
  outbound: 'Visited a business website',
}

/** Human text for a filter value ("organic_search" -> "Organic search", "US" -> "United States"). */
export function filterValueLabel(key: FilterKey, value: string): string {
  if (value === NONE_VALUE) return key === 'country' ? 'Unknown' : '(not set)'
  switch (key) {
    case 'channel': return channelLabel(value)
    case 'source': return sourceLabel(value)
    case 'country': return countryName(value)
    case 'device': return deviceLabel(value)
    case 'pageType': return pageTypeLabel(value)
    case 'visitor': return value === 'new' ? 'New' : value === 'returning' ? 'Returning' : value
    case 'user': return value === 'linked' ? 'Has a business account' : value
    case 'converted': return CONVERTED_LABELS[value] ?? value
    default: return value
  }
}
