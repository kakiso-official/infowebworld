/* Shared lightweight SVG icon system — replaces @hugeicons (44MB) with ~3KB of path data */

export const I = ({ d, size = 18, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)

export const ic = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  chevronDown: 'M6 9l6 6 6-6',
  grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  building: 'M4 2h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z|M9 22v-4h6v4|M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01',
  plus: 'M12 5v14|M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14|M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5|M12 19l-7-7 7-7',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 3a4 4 0 100 8 4 4 0 000-8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75',
  barChart: 'M12 20V10|M18 20V4|M6 20v-4',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z|M12 15l-3-3a22 22 0 015-10.06A22 22 0 0124 7a22 22 0 01-10.06 5z',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  x: 'M18 6L6 18|M6 6l12 12',
  cloud: 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
  code: 'M16 18l6-6-6-6|M8 6l-6 6 6 6',
  pieChart: 'M21.21 15.89A10 10 0 118 2.83|M22 12A10 10 0 0012 2v10z',
  trendingUp: 'M23 6l-9.5 9.5-5-5L1 18',
  monitor: 'M2 3h20v14H2z|M8 21h8|M12 17v4',
  messageCircle: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  externalLink: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6|M15 3h6v6|M10 14L21 3',
  sliders: 'M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M1 14h6|M9 8h6|M17 16h6',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z|M12 7a3 3 0 100 6 3 3 0 000-6z',
  /* ── Additional icons (previously from Hugeicons) ── */
  award: 'M12 15a7 7 0 100-14 7 7 0 000 14z|M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6v6l4 2',
  cpu: 'M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z|M9 9h6v6H9z|M9 1v3|M15 1v3|M9 20v3|M15 20v3|M20 9h3|M20 14h3|M1 9h3|M1 14h3',
  fire: 'M12 12c-2-2.67-4-4-4-6a4 4 0 018 0c0 2-2 3.33-4 6z|M12 22c4 0 7-2.69 7-6.2 0-3.5-3-6.3-7-10.8-4 4.5-7 7.3-7 10.8C5 19.31 8 22 12 22z',
  sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z|M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  compass: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z|M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H8',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z|M7 7h.01',
  helpCircle: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3|M12 17h.01',
} as const

/* Name alias map — resolves Hugeicons naming to our icon keys */
export const ICON_ALIAS: Record<string, keyof typeof ic> = {
  /* Direct matches */
  search: 'search', search01: 'search', search02: 'search', searchVisual: 'search', globalSearch: 'search',
  star: 'star', rocket: 'rocket', rocket01: 'rocket',
  home: 'home', shield: 'shield', code: 'code', eye: 'eye',
  users: 'users', barChart: 'barChart', chartColumn: 'barChart',
  globe: 'globe', globe02: 'globe', cloud: 'cloud',
  zap: 'zap', flash: 'zap',
  grid: 'grid', layers: 'layers', filter: 'filter',
  building: 'building', building02: 'building',
  messageCircle: 'messageCircle', message: 'messageCircle',
  mapPin: 'mapPin', check: 'check', plus: 'plus',
  arrow: 'arrow', arrowLeft: 'arrowLeft',
  briefcase: 'briefcase', pieChart: 'pieChart',
  fire: 'fire', award: 'award', clock: 'clock',
  cpu: 'cpu', trendingUp: 'trendingUp', analyticsUp: 'trendingUp',
  sparkles: 'sparkles', favourite: 'heart', heart: 'heart',
  verified: 'check', compass: 'compass',
  sliders: 'sliders', cancel: 'x', x: 'x',
  externalLink: 'externalLink', monitor: 'monitor',
  chevronDown: 'chevronDown',
}

/** Resolve any icon name (including Hugeicons aliases) to an SVG path string */
export function getIconPath(name: string): string {
  const key = ICON_ALIAS[name] || (name as keyof typeof ic)
  return ic[key as keyof typeof ic] || ic.grid
}

export type IconKey = keyof typeof ic
