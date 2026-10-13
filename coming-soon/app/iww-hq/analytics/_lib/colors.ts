import type { Channel, PageType } from '@/lib/analytics/types'

/* ═══════════════════════════════════════════════════════════════════════════
   Chart colors. Values live as CSS tokens on .an-root (app/styles/analytics.css);
   code only ever references the tokens, so a palette change is one CSS edit.

   The 8 series slots are the dataviz reference palette, validated on the white
   admin surface (#ffffff): adjacent CVD ΔE >= 9.1, normal-vision ΔE >= 19.6.
   Slots 3/4/5 are under 3:1 contrast on white, so every chart that uses them
   also has a legend + tooltip + table/list view (the "relief rule").

   Rules: colors follow the entity, never its rank (a channel keeps its color
   whatever else is on screen); a 9th series folds into "Other" (gray).
   ═══════════════════════════════════════════════════════════════════════════ */

/** Categorical slots in validated order. Use SERIES[i] for "the i-th distinct thing". */
export const SERIES = [
  'var(--an-s1)', 'var(--an-s2)', 'var(--an-s3)', 'var(--an-s4)',
  'var(--an-s5)', 'var(--an-s6)', 'var(--an-s7)', 'var(--an-s8)',
] as const

/** Neutral for "Other" / folded tails / de-emphasised context. */
export const OTHER_COLOR = 'var(--an-s-other)'
/** Comparison-period line (dashed, recessive). */
export const PREVIOUS_COLOR = 'var(--an-prev)'

/**
 * Fixed channel -> slot map. The three rare campaign channels (display,
 * affiliate, other_campaign) share the "Other" gray - fold them with
 * foldChannels() before stacking so a legend never shows two grays.
 */
export const CHANNEL_COLOR: Record<Channel, string> = {
  organic_search: SERIES[0],
  direct: SERIES[1],
  ai_assistant: SERIES[2],
  social: SERIES[3],
  referral: SERIES[4],
  email: SERIES[5],
  paid_search: SERIES[6],
  paid_social: SERIES[7],
  display: OTHER_COLOR,
  affiliate: OTHER_COLOR,
  other_campaign: OTHER_COLOR,
}

/** Stack order for channel charts (bottom -> top) - follows the slot order so neighbours stay CVD-safe. */
export const CHANNEL_STACK_ORDER: Channel[] = [
  'organic_search', 'direct', 'ai_assistant', 'social', 'referral', 'email', 'paid_search', 'paid_social',
  'display', 'affiliate', 'other_campaign',
]

const FOLDED: Channel[] = ['display', 'affiliate', 'other_campaign']

export function channelColor(ch: string | null | undefined): string {
  return (ch && CHANNEL_COLOR[ch as Channel]) || OTHER_COLOR
}

/**
 * Channel series -> stack series for <StackedBars>: fixed order, fixed colors,
 * the rare campaign channels folded into one "Other campaigns" series, and
 * all-zero series dropped.
 */
export function foldChannels(
  series: { channel: Channel; sessions: number[] }[],
  labelOf: (ch: Channel) => string,
): { key: string; label: string; color: string; values: number[] }[] {
  const by = new Map(series.map(s => [s.channel, s.sessions]))
  const len = series[0]?.sessions.length ?? 0
  const out: { key: string; label: string; color: string; values: number[] }[] = []
  for (const ch of CHANNEL_STACK_ORDER) {
    if (FOLDED.includes(ch)) continue
    const v = by.get(ch)
    if (v && v.some(x => x > 0)) out.push({ key: ch, label: labelOf(ch), color: CHANNEL_COLOR[ch], values: v })
  }
  const other = new Array(len).fill(0) as number[]
  let any = false
  for (const ch of FOLDED) {
    const v = by.get(ch)
    if (!v) continue
    v.forEach((x, i) => { other[i] += x; if (x > 0) any = true })
  }
  if (any) out.push({ key: 'other_campaign', label: 'Other campaigns', color: OTHER_COLOR, values: other })
  return out
}

/**
 * Page types grouped into 6 families (18 types can't each get a hue):
 * discovery = blue, business pages = orange, entity pages = aqua,
 * home = green, content = violet, 404 = critical red, rest = gray.
 */
export function pageTypeColor(pt: PageType | string | null | undefined): string {
  switch (pt) {
    case 'sector': case 'category_index': case 'category': case 'categories': case 'country': case 'search':
      return SERIES[0]
    case 'business': case 'dashboard':
      return SERIES[1]
    case 'listing': case 'profile': case 'compare':
      return SERIES[2]
    case 'home':
      return SERIES[5]
    case 'blog': case 'blog_post': case 'info': case 'developers':
      return SERIES[6]
    case 'not_found':
      return 'var(--an-bad)'
    default:
      return OTHER_COLOR
  }
}

/**
 * Sequential blue ramp (light -> dark) for heatmaps. Index 0 is "near zero"
 * and may recede toward the surface; cells with exactly 0 use --an-surface-3.
 */
export const SEQ_RAMP = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#1c5cab', '#104281'] as const

/** Ramp color for value/max (0..1). Returns the text color that clears contrast on it too. */
export function seqColor(ratio: number): { bg: string; fg: string } {
  const r = Math.max(0, Math.min(1, ratio))
  const i = Math.min(SEQ_RAMP.length - 1, Math.floor(r * SEQ_RAMP.length))
  return { bg: SEQ_RAMP[i], fg: i >= 3 ? '#ffffff' : '#0b2a52' }
}
