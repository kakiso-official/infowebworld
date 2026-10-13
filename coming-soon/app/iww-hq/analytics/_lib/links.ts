import { ANALYTICS_BASE } from './state'

/* ═══════════════════════════════════════════════════════════════════════════
   Where things live in the analytics UI. These return bare paths (+ their own
   params); pass them through `useAnalyticsQuery().href(...)` (or
   analyticsHref) so the link keeps the current range and filters.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Page details for one path: /iww-hq/analytics/pages/detail?path=/x */
export function pageDetailHref(path: string): string {
  return `${ANALYTICS_BASE}/pages/detail?path=${encodeURIComponent(path)}`
}

/** One visit's timeline. */
export function sessionHref(id: number | string): string {
  return `${ANALYTICS_BASE}/sessions/${encodeURIComponent(String(id))}`
}

/** One visitor's profile. */
export function visitorHref(id: number | string): string {
  return `${ANALYTICS_BASE}/visitors/${encodeURIComponent(String(id))}`
}

/** Events page focused on one event. */
export function eventHref(name: string): string {
  return `${ANALYTICS_BASE}/events?name=${encodeURIComponent(name)}`
}

/** The live public page (opened in a new tab). Same origin as the admin. */
export function livePageHref(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/** A section of the analytics UI by route segment ('' = Overview). */
export function sectionHref(route: string): string {
  return route ? `${ANALYTICS_BASE}/${route}` : ANALYTICS_BASE
}
