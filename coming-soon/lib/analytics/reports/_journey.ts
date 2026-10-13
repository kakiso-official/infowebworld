import type { FlowLink, FlowNode } from '../types'

/* ═══════════════════════════════════════════════════════════════════════════
   Pure journey algorithms behind the Journeys (flow) and Funnels reports.

   The SQL side only fetches compact rows - (session, seq, key) for flows,
   (entity, timestamp) per step for funnels - and everything that defines
   the numbers happens here, in plain JS. Keeping it pure (type-only
   imports, no DB) means the exact semantics can be read in one place and
   unit-checked without a database.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Same normalisation the collector applies to stored paths (for anchors / funnel steps typed by the admin). */
export function normalizePath(raw: string): string {
  let p = raw.trim().replace(/[?#].*$/, '').replace(/\/{2,}/g, '/')
  if (!p.startsWith('/')) p = '/' + p
  if (p.length > 1) p = p.replace(/\/+$/, '') || '/'
  return p.slice(0, 500)
}

/* ── Flow (Sankey) ──────────────────────────────────────────────────────── */

export const FLOW_EXIT = '(exit)'
export const FLOW_ENTRANCE = '(entrance)'
export const FLOW_OTHER = '(other)'

/** One column position of one visit in the diagram. */
export interface TrailToken { step: number; key: string }

/** Merge consecutive repeats: [a, a, b, a] -> [a, b, a]. */
export function collapseRepeats(keys: string[]): string[] {
  const out: string[] = []
  for (const k of keys) if (out[out.length - 1] !== k) out.push(k)
  return out
}

/**
 * Trail for "starting pages" / "after a page": keys start at the entry page
 * (or the anchor occurrence) and run forward.
 *
 * `complete` = we fetched the visit up to its last page, so when it has
 * fewer pages than columns we know it ENDED there and add an (exit) node.
 * When the fetch was cut short we only know it went on beyond what we
 * hold, so no exit is invented.
 */
export function forwardTrail(keys: string[], complete: boolean, steps: number, collapse: boolean): TrailToken[] {
  const list = (collapse ? collapseRepeats(keys) : keys).slice(0, steps)
  const trail: TrailToken[] = list.map((key, step) => ({ step, key }))
  if (list.length > 0 && list.length < steps && complete) trail.push({ step: list.length, key: FLOW_EXIT })
  return trail
}

/**
 * Trail for "before a page": keys end at the FIRST occurrence of the anchor
 * (the anchor is the last key). Columns are right-aligned so the anchor is
 * always the last column (step = steps - 1).
 *
 * `reachesEntry` = the first key is the visit's landing page (seq 1). When
 * the visit has fewer pages before the anchor than there are columns, it
 * gets an (entrance) node right before its landing page.
 */
export function backwardTrail(keys: string[], reachesEntry: boolean, steps: number, collapse: boolean): TrailToken[] {
  const all = collapse ? collapseRepeats(keys) : keys
  const list = all.slice(Math.max(0, all.length - steps))
  const tokens = all.length > 0 && all.length < steps && reachesEntry ? [FLOW_ENTRANCE, ...list] : list
  const offset = steps - tokens.length
  return tokens.map((key, i) => ({ step: offset + i, key }))
}

const SPECIAL = new Set([FLOW_EXIT, FLOW_ENTRANCE, FLOW_OTHER])

function kindOf(key: string): FlowNode['kind'] {
  if (key === FLOW_EXIT) return 'exit'
  if (key === FLOW_ENTRANCE) return 'entrance'
  if (key === FLOW_OTHER) return 'other'
  return 'page'
}

const KIND_ORDER: Record<FlowNode['kind'], number> = { page: 0, other: 1, entrance: 2, exit: 3 }

/**
 * Turn per-visit trails into Sankey nodes + links.
 * - Per column, the `width` keys with the most visits stay; the rest of that
 *   column becomes one (other) node (a visit in (other) still continues to
 *   its real next page in the next column).
 * - Node `sessions` = visits passing through it; link `sessions` = visits
 *   going from one node to the next column's node.
 */
export function buildFlowGraph(
  trails: TrailToken[][],
  width: number,
  label: (key: string, kind: FlowNode['kind']) => string,
): { nodes: FlowNode[]; links: FlowLink[] } {
  // 1. Visits per raw key per column.
  const perStep = new Map<number, Map<string, number>>()
  for (const trail of trails) {
    for (const t of trail) {
      if (SPECIAL.has(t.key)) continue
      let m = perStep.get(t.step)
      if (!m) { m = new Map(); perStep.set(t.step, m) }
      m.set(t.key, (m.get(t.key) ?? 0) + 1)
    }
  }

  // 2. Top `width` keys per column (ties broken by key, so output is stable).
  const kept = new Map<number, Set<string>>()
  for (const [step, counts] of perStep) {
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .slice(0, width)
      .map(([k]) => k)
    kept.set(step, new Set(top))
  }

  // 3. Count nodes and links.
  const nodes = new Map<string, FlowNode>()
  const links = new Map<string, FlowLink>()
  for (const trail of trails) {
    let prevId: string | null = null
    for (const t of trail) {
      const key = SPECIAL.has(t.key) || kept.get(t.step)?.has(t.key) ? t.key : FLOW_OTHER
      const id = `${t.step}|${key}`
      const node = nodes.get(id)
      if (node) node.sessions++
      else {
        const kind = kindOf(key)
        nodes.set(id, { id, step: t.step, key, label: label(key, kind), kind, sessions: 1 })
      }
      if (prevId) {
        const lid = `${prevId}\u0000${id}`
        const link = links.get(lid)
        if (link) link.sessions++
        else links.set(lid, { source: prevId, target: id, sessions: 1 })
      }
      prevId = id
    }
  }

  const nodeList = [...nodes.values()].sort((a, b) =>
    a.step - b.step || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || b.sessions - a.sessions || (a.key < b.key ? -1 : 1))
  const stepOf = (id: string) => nodes.get(id)?.step ?? 0
  const linkList = [...links.values()].sort((a, b) =>
    stepOf(a.source) - stepOf(b.source) || b.sessions - a.sessions || (a.source + a.target < b.source + b.target ? -1 : 1))
  return { nodes: nodeList, links: linkList }
}

/* ── Funnels ────────────────────────────────────────────────────────────── */

export interface FunnelMatch {
  /** How many steps this entity completed, in order (0 = never hit step 1). */
  reached: number
  /** deltas[k] = ms from step k-1's matched time to step k's (index 0 unused). */
  deltas: number[]
}

/** First value in an ascending array that is strictly greater than `t`, else null. */
export function firstAfter(sorted: number[], t: number): number | null {
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (sorted[mid] <= t) lo = mid + 1
    else hi = mid
  }
  return lo < sorted.length ? sorted[lo] : null
}

/**
 * Ordered funnel matching for one entity (a visit or a visitor).
 * `times[k]` = ascending epoch-ms timestamps at which the entity matched
 * step k (undefined/empty = never). Step 1 matches at its earliest time;
 * every later step at its earliest time STRICTLY after the previous step's
 * matched time. Taking the earliest match at every step is optimal: if any
 * ordered completion exists, this greedy walk finds it.
 */
export function matchFunnel(times: (number[] | undefined)[]): FunnelMatch {
  const deltas: number[] = [0]
  const first = times[0]
  if (!first || first.length === 0) return { reached: 0, deltas }
  let t = first[0]
  let reached = 1
  for (let k = 1; k < times.length; k++) {
    const list = times[k]
    const next = list && list.length ? firstAfter(list, t) : null
    if (next == null) break
    deltas.push(next - t)
    t = next
    reached++
  }
  return { reached, deltas }
}

/** Median of a list of numbers (null when empty); averages the middle pair. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const s = [...values].sort((a, b) => a - b)
  const mid = s.length >> 1
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}
