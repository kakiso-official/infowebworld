'use client'
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket, faEllipsis, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import type { FlowLink, FlowNode, FlowReport } from '@/lib/analytics/types'
import { useElementWidth } from '../../_lib/hooks'
import { fmtNumber, fmtPercent } from '../../_lib/format'
import { OTHER_COLOR, SERIES, pageTypeColor } from '../../_lib/colors'
import { SrTable } from '../charts/chart-utils'
import { truncate } from './util'

/* ═══════════════════════════════════════════════════════════════════════════
   FlowDiagram - the Journeys Sankey.

   Columns are steps of a visit (landing page, 2nd page...; or the pages
   after / before an anchor page). Each node is a bar whose height is the
   number of visits passing through it; curved bands between columns carry
   the visits that went from one node to the next.

   Readability rules this component guarantees:
   - labels never overlap: every node gets a slot at least LABEL_MIN tall
     (small nodes are centred in their slot), and the vertical scale is
     solved so the tallest column still fits the chosen height;
   - order is stable and meaningful: pages by visits (largest first), then
     "Other pages", then the entrance node, then "Left the site" at the
     bottom - the same place in every column;
   - bands leave a node in the vertical order of their targets (and arrive
     in the order of their sources), so bands from one node never cross
     each other at the node;
   - exits, entrances and the folded "other" bucket look different from
     pages (outlined red / outlined gray / gray), and say so in words;
   - hover or focus a node: its incoming and outgoing bands light up, the
     rest dims, and a tooltip gives visits, share of all visits and the
     top places visitors came from / went next. Hover a band for its count.

   Labels are HTML (buttons) over the SVG so they can truncate cleanly,
   carry icons, take keyboard focus and be big touch targets. On touch, the
   first tap shows the tooltip and the second tap follows the node.
   ═══════════════════════════════════════════════════════════════════════════ */

const BAR_W = 12
const GAP = 10            // vertical space between node slots
const LABEL_MIN = 36      // minimum slot height: two label lines
const MIN_COL_W = 176     // below this the diagram scrolls sideways inside its card
const LABEL_PAD = 7       // between a bar and its label
const TOP = 4

const KIND_RANK: Record<FlowNode['kind'], number> = { page: 0, other: 1, entrance: 2, exit: 3 }

interface LaidNode extends FlowNode {
  x: number
  /** bar top / height (proportional) */
  y: number
  h: number
  /** slot (bar + label room) */
  slotY: number
  slotH: number
  color: string
}
interface LaidLink extends FlowLink {
  i: number
  sy: number    // band centre at the source
  ty: number    // band centre at the target
  w: number     // band thickness
  x0: number
  x1: number
  color: string
}

export interface FlowDiagramProps {
  report: FlowReport
  /** Column heading for a step index ("Landing page", "2nd page"...). */
  columnTitle: (step: number) => string
  /** Click/Enter on a page node (not exit/entrance/other). */
  onNodeClick?: (node: FlowNode) => void
  /** Short verb phrase for the click hint ("see where visitors went after this page"). */
  clickHint?: string
}

function nodeColor(n: FlowNode, group: FlowReport['group']): string {
  if (n.kind === 'exit') return 'var(--an-bad)'
  if (n.kind === 'entrance') return 'var(--an-text-3)'
  if (n.kind === 'other') return OTHER_COLOR
  return group === 'page_type' ? pageTypeColor(n.key) : SERIES[0]
}

/**
 * Scale (px per visit) so that column `nodes` fits in `height`, given that
 * any node smaller than LABEL_MIN still takes LABEL_MIN. Small nodes are
 * moved to the fixed set until the solution is stable.
 */
function columnScale(values: number[], height: number): number {
  const gaps = Math.max(0, values.length - 1) * GAP
  const fixed = new Set<number>()
  let k = Infinity
  for (let iter = 0; iter <= values.length; iter++) {
    let big = 0
    values.forEach((v, i) => { if (!fixed.has(i)) big += v })
    if (big <= 0) return Infinity
    k = (height - gaps - fixed.size * LABEL_MIN) / big
    let changed = false
    values.forEach((v, i) => {
      if (!fixed.has(i) && v * k < LABEL_MIN) { fixed.add(i); changed = true }
    })
    if (!changed) break
  }
  return Math.max(k, 0.01)
}

function layout(report: FlowReport, width: number) {
  const steps = Math.max(1, report.steps)
  const colW = width / steps
  const byStep = new Map<number, FlowNode[]>()
  for (const n of report.nodes) {
    const list = byStep.get(n.step)
    if (list) list.push(n)
    else byStep.set(n.step, [n])
  }
  const columns = [...byStep.entries()].map(([step, list]) => ({
    step,
    nodes: [...list].sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind] || b.sessions - a.sessions || (a.key < b.key ? -1 : 1)),
  }))

  const maxNodes = Math.max(1, ...columns.map(c => c.nodes.length))
  const plotH = Math.min(680, Math.max(320, maxNodes * (LABEL_MIN + GAP) + 80))
  let scale = Math.min(...columns.map(c => columnScale(c.nodes.map(n => n.sessions), plotH)))
  // Every column made of label-sized nodes only: fall back to a plain proportional fit.
  if (!Number.isFinite(scale)) {
    scale = Math.min(...columns.map(c => {
      const sum = c.nodes.reduce((a, n) => a + n.sessions, 0)
      return sum > 0 ? Math.max(0.01, (plotH - (c.nodes.length - 1) * GAP) / sum) : Infinity
    }))
    if (!Number.isFinite(scale)) scale = 1
  }

  const laid = new Map<string, LaidNode>()
  let height = 0
  for (const c of columns) {
    let y = TOP
    for (const n of c.nodes) {
      const h = Math.max(2, n.sessions * scale)
      const slotH = Math.max(h, LABEL_MIN)
      laid.set(n.id, {
        ...n,
        x: Math.round(n.step * colW),
        y: y + (slotH - h) / 2,
        h,
        slotY: y,
        slotH,
        color: nodeColor(n, report.group),
      })
      y += slotH + GAP
    }
    height = Math.max(height, y - GAP + TOP)
  }

  // Band offsets: outgoing bands in target order, incoming in source order.
  const outs = new Map<string, FlowLink[]>()
  const ins = new Map<string, FlowLink[]>()
  for (const l of report.links) {
    if (!laid.has(l.source) || !laid.has(l.target)) continue
    ;(outs.get(l.source) ?? outs.set(l.source, []).get(l.source)!).push(l)
    ;(ins.get(l.target) ?? ins.set(l.target, []).get(l.target)!).push(l)
  }
  const sy = new Map<FlowLink, number>()
  const ty = new Map<FlowLink, number>()
  for (const [id, list] of outs) {
    const n = laid.get(id)!
    let off = n.y
    for (const l of [...list].sort((a, b) => laid.get(a.target)!.y - laid.get(b.target)!.y)) {
      const w = Math.max(1, l.sessions * scale)
      sy.set(l, off + w / 2)
      off += w
    }
  }
  for (const [id, list] of ins) {
    const n = laid.get(id)!
    let off = n.y
    for (const l of [...list].sort((a, b) => laid.get(a.source)!.y - laid.get(b.source)!.y)) {
      const w = Math.max(1, l.sessions * scale)
      ty.set(l, off + w / 2)
      off += w
    }
  }

  const links: LaidLink[] = []
  report.links.forEach((l, i) => {
    const s = laid.get(l.source)
    const t = laid.get(l.target)
    if (!s || !t) return
    links.push({
      ...l,
      i,
      sy: sy.get(l)!,
      ty: ty.get(l)!,
      w: Math.max(1, l.sessions * scale),
      x0: s.x + BAR_W,
      x1: t.x,
      color: t.kind === 'exit' ? 'var(--an-bad)' : s.kind === 'entrance' ? 'var(--an-text-3)' : s.color,
    })
  })
  // Thick bands first so thin ones stay visible (and hoverable) on top.
  links.sort((a, b) => b.w - a.w)

  return { nodes: [...laid.values()], links, height, colW, columns }
}

type Hover = { kind: 'node'; id: string } | { kind: 'link'; i: number } | null

export function FlowDiagram({ report, columnTitle, onNodeClick, clickHint = 'follow visits from this page' }: FlowDiagramProps) {
  const [ref, measured] = useElementWidth<HTMLDivElement>()
  const [hover, setHover] = useState<Hover>(null)
  const lastPointer = useRef<string>('mouse')
  // Touch: the node that was tapped once (tooltip shown); a second tap on it follows it.
  const armed = useRef<string | null>(null)
  const width = Math.max(measured, report.steps * MIN_COL_W)
  const total = report.totalSessions

  const lay = useMemo(() => (measured > 0 ? layout(report, width) : null), [report, width, measured])

  const nodeById = useMemo(() => new Map((lay?.nodes ?? []).map(n => [n.id, n])), [lay])
  const linksByNode = useMemo(() => {
    const m = new Map<string, { ins: LaidLink[]; outs: LaidLink[] }>()
    for (const l of lay?.links ?? []) {
      ;(m.get(l.source) ?? m.set(l.source, { ins: [], outs: [] }).get(l.source)!).outs.push(l)
      ;(m.get(l.target) ?? m.set(l.target, { ins: [], outs: [] }).get(l.target)!).ins.push(l)
    }
    return m
  }, [lay])

  const activeNode = hover?.kind === 'node' ? nodeById.get(hover.id) ?? null : null
  const activeLink = hover?.kind === 'link' ? lay?.links.find(l => l.i === hover.i) ?? null : null
  const isLit = (l: LaidLink) =>
    activeLink ? l === activeLink : activeNode ? l.source === activeNode.id || l.target === activeNode.id : false
  const nodeLit = (n: LaidNode) => {
    if (activeNode) return n.id === activeNode.id || linksByNode.get(activeNode.id)?.ins.some(l => l.source === n.id) || linksByNode.get(activeNode.id)?.outs.some(l => l.target === n.id)
    if (activeLink) return n.id === activeLink.source || n.id === activeLink.target
    return true
  }
  const anyHover = !!(activeNode || activeLink)

  const share = (v: number) => (total > 0 ? fmtPercent(v / total, v / total < 0.1 ? 1 : 0) : '–')
  const clickable = (n: FlowNode) => n.kind === 'page' && !!onNodeClick

  const ttW = Math.max(200, Math.min(280, measured - 16))
  const labelW = lay ? Math.max(60, lay.colW - BAR_W - LABEL_PAD - 10) : 0
  const charsFit = (mono: boolean) => Math.max(8, Math.floor(labelW / (mono ? 7.3 : 6.9)) - 1)
  const isPath = (n: FlowNode) => n.kind === 'page' && report.group === 'path'

  const onNodeActivate = (n: LaidNode) => {
    if (!clickable(n)) { setHover({ kind: 'node', id: n.id }); return }
    // Touch: first tap explains (tooltip), second tap follows.
    if (lastPointer.current === 'touch' && armed.current !== n.id) {
      armed.current = n.id
      setHover({ kind: 'node', id: n.id })
      return
    }
    armed.current = null
    onNodeClick!(n)
  }

  return (
    <figure className="an-flow" aria-label={`Visit flow diagram, ${report.steps} steps, ${fmtNumber(total)} visits`}>
      <div
        className={'an-flow-scroll' + (measured > 0 && width > measured ? ' an-flow-scroll--x' : '')}
        onPointerDown={(e: ReactPointerEvent) => { lastPointer.current = e.pointerType }}
      >
        {/* Zero-height block: its width is the scroller's content width, whatever the canvas does. */}
        <div ref={ref} className="an-flow-sizer" aria-hidden="true" />
        {lay && (
          <div className="an-flow-canvas" style={{ width }}>
            <div className="an-flow-heads" aria-hidden="true">
              {Array.from({ length: report.steps }, (_, step) => {
                const col = lay.columns.find(c => c.step === step)
                const here = col ? col.nodes.filter(n => n.kind === 'page' || n.kind === 'other').reduce((a, n) => a + n.sessions, 0) : 0
                return (
                  <div key={step} className="an-flow-head" style={{ left: step * lay.colW, width: lay.colW }}>
                    <span className="an-flow-head-title">{columnTitle(step)}</span>
                    <span className="an-flow-head-sub">{here > 0 ? `${fmtNumber(here)} visits` : 'no visits'}</span>
                  </div>
                )
              })}
            </div>

            <div className="an-flow-plot" style={{ height: lay.height }} onPointerLeave={e => { if (e.pointerType === 'mouse') setHover(null) }}>
              <svg width={width} height={lay.height} className="an-svg an-flow-svg" aria-hidden="true">
                <g className={'an-flow-links' + (anyHover ? ' an-flow-links--dim' : '')}>
                  {lay.links.map(l => {
                    const xm = (l.x0 + l.x1) / 2
                    return (
                      <path
                        key={l.i}
                        d={`M${l.x0},${l.sy}C${xm},${l.sy} ${xm},${l.ty} ${l.x1},${l.ty}`}
                        className={'an-flow-link' + (l.color === 'var(--an-bad)' ? ' an-flow-link--exit' : '') + (isLit(l) ? ' an-flow-link--on' : '')}
                        style={{ stroke: l.color, strokeWidth: l.w }}
                        onPointerEnter={() => setHover({ kind: 'link', i: l.i })}
                        onPointerDown={() => setHover({ kind: 'link', i: l.i })}
                      />
                    )
                  })}
                </g>
                {lay.nodes.map(n => (
                  <rect
                    key={n.id}
                    x={n.x}
                    y={n.y}
                    width={BAR_W}
                    height={n.h}
                    rx={Math.min(3, n.h / 2)}
                    className={`an-flow-bar an-flow-bar--${n.kind}` + (anyHover && !nodeLit(n) ? ' an-flow-bar--dim' : '')}
                    style={{ ['--c' as string]: n.color } as CSSProperties}
                    onPointerEnter={() => setHover({ kind: 'node', id: n.id })}
                    onClick={() => onNodeActivate(n)}
                  />
                ))}
              </svg>

              {lay.nodes.map(n => {
                const mono = isPath(n)
                const shown = n.kind === 'page' ? truncate(n.label, charsFit(mono), mono) : n.label
                const pct = share(n.sessions)
                const style: CSSProperties = {
                  left: n.x + BAR_W + LABEL_PAD,
                  top: n.slotY + n.slotH / 2,
                  maxWidth: labelW,
                }
                const icon = n.kind === 'exit' ? faRightFromBracket : n.kind === 'entrance' ? faArrowRightToBracket : n.kind === 'other' ? faEllipsis : null
                const verb = n.kind === 'exit' ? 'ended here' : n.kind === 'entrance' ? 'started here' : 'visits'
                const aria = `${columnTitle(n.step)}: ${n.label}. ${fmtNumber(n.sessions)} ${verb}, ${pct} of all.` + (clickable(n) ? ` Press Enter to ${clickHint}.` : '')
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={`an-flow-label an-flow-label--${n.kind}` + (clickable(n) ? ' an-flow-label--click' : '') + (anyHover && !nodeLit(n) ? ' an-flow-label--dim' : '') + (activeNode?.id === n.id ? ' an-flow-label--on' : '')}
                    style={style}
                    aria-label={aria}
                    aria-disabled={!clickable(n) || undefined}
                    onPointerEnter={() => setHover({ kind: 'node', id: n.id })}
                    onFocus={() => setHover({ kind: 'node', id: n.id })}
                    onBlur={() => setHover(null)}
                    onClick={() => onNodeActivate(n)}
                  >
                    <span className={'an-flow-label-name' + (mono ? ' an-mono' : '')}>
                      {icon && <FontAwesomeIcon icon={icon} className="an-flow-label-icon" aria-hidden="true" />}
                      {shown}
                    </span>
                    <span className="an-flow-label-num">
                      <b>{fmtNumber(n.sessions)}</b> · {pct}
                    </span>
                  </button>
                )
              })}

              {activeNode && (
                <NodeTooltip
                  node={activeNode}
                  ttW={ttW}
                  lay={lay}
                  width={width}
                  labelW={labelW}
                  links={linksByNode.get(activeNode.id) ?? { ins: [], outs: [] }}
                  nodeById={nodeById}
                  total={total}
                  hint={clickable(activeNode) ? `Click to ${clickHint}` : null}
                />
              )}
              {activeLink && (
                <LinkTooltip link={activeLink} ttW={ttW} nodeById={nodeById} width={width} height={lay.height} total={total} />
              )}
            </div>
          </div>
        )}
        {!lay && <div style={{ height: 360 }} />}
      </div>
      <SrTable
        caption="Visits moving between steps"
        headers={['From', 'To', 'Visits', 'Share of the "from" step']}
        rows={(lay?.links ?? []).slice().sort((a, b) => (nodeById.get(a.source)?.step ?? 0) - (nodeById.get(b.source)?.step ?? 0) || b.sessions - a.sessions).map(l => {
          const s = nodeById.get(l.source)
          const t = nodeById.get(l.target)
          return [
            `${columnTitle(s?.step ?? 0)}: ${s?.label ?? l.source}`,
            `${columnTitle(t?.step ?? 0)}: ${t?.label ?? l.target}`,
            fmtNumber(l.sessions),
            s && s.sessions ? fmtPercent(l.sessions / s.sessions) : '–',
          ]
        })}
      />
    </figure>
  )
}

/* ── Tooltips ───────────────────────────────────────────────────────────── */

/**
 * Place a tooltip beside x (flipping to the left near the right edge),
 * vertically centred on y but kept inside the plot. `estH` is an estimate
 * of the tooltip's height from its row count, so no measuring pass (and no
 * flicker) is needed.
 */
function ttStyle(xRight: number, xLeft: number, y: number, width: number, height: number, ttW: number, estH: number): CSSProperties {
  const right = xRight + 10 + ttW <= width
  const left = right ? xRight + 10 : Math.max(0, xLeft - 10 - ttW)
  const top = Math.max(0, Math.min(y - estH / 2, height - estH))
  return { width: ttW, left, top }
}

function NodeTooltip({ node, ttW, lay, width, labelW, links, nodeById, total, hint }: {
  node: LaidNode
  ttW: number
  lay: { height: number }
  width: number
  labelW: number
  links: { ins: LaidLink[]; outs: LaidLink[] }
  nodeById: Map<string, LaidNode>
  total: number
  hint: string | null
}) {
  const pctOf = (v: number, of: number) => (of > 0 ? fmtPercent(v / of, 0) : '–')
  const top = (list: LaidLink[], end: 'source' | 'target') =>
    [...list].sort((a, b) => b.sessions - a.sessions).slice(0, 4).map(l => ({ l, n: nodeById.get(l[end]) }))
  const ins = top(links.ins, 'source')
  const outs = top(links.outs, 'target')
  const outSum = links.outs.reduce((a, l) => a + l.sessions, 0)
  // Visits we know continue past the last column we fetched (no exit was invented for them).
  const continuing = node.kind === 'page' || node.kind === 'other' ? node.sessions - outSum : 0
  const label = node.kind === 'exit' ? 'Left the site here' : node.kind === 'entrance' ? 'Entered the site here' : node.label
  const estH = 56 + (ins.length ? 24 + ins.length * 19 : 0) + (outs.length ? 24 + outs.length * 19 : 0) + (continuing > 0 && outs.length ? 22 : 0) + (hint ? 30 : 0)

  return (
    <div
      className="an-tt an-flow-tt"
      style={ttStyle(node.x + BAR_W + LABEL_PAD + labelW, node.x, node.slotY + node.slotH / 2, width, lay.height, ttW, estH)}
      aria-hidden="true"
    >
      <div className={'an-flow-tt-title' + (node.kind === 'page' && node.label.startsWith('/') ? ' an-mono' : '')}>{label}</div>
      <div className="an-flow-tt-main">
        <b>{fmtNumber(node.sessions)}</b> {node.sessions === 1 ? 'visit' : 'visits'}
        {total > 0 && <> · {fmtPercent(node.sessions / total)} of all</>}
      </div>
      {ins.length > 0 && (
        <div className="an-flow-tt-sec">
          <div className="an-flow-tt-h">Came from</div>
          {ins.map(({ l, n }) => (
            <div key={l.i} className="an-flow-tt-row">
              <span className="an-flow-tt-key">{n?.kind === 'entrance' ? 'Entered the site' : n?.label ?? l.source}</span>
              <span className="an-flow-tt-val">{pctOf(l.sessions, node.sessions)}</span>
            </div>
          ))}
        </div>
      )}
      {outs.length > 0 && (
        <div className="an-flow-tt-sec">
          <div className="an-flow-tt-h">Went next</div>
          {outs.map(({ l, n }) => (
            <div key={l.i} className={'an-flow-tt-row' + (n?.kind === 'exit' ? ' an-flow-tt-row--exit' : '')}>
              <span className="an-flow-tt-key">{n?.kind === 'exit' ? 'Left the site' : n?.label ?? l.target}</span>
              <span className="an-flow-tt-val">{pctOf(l.sessions, node.sessions)}</span>
            </div>
          ))}
        </div>
      )}
      {continuing > 0 && outs.length > 0 && (
        <div className="an-flow-tt-note">{pctOf(continuing, node.sessions)} kept browsing beyond this diagram.</div>
      )}
      {hint && <div className="an-tt-foot">{hint}</div>}
    </div>
  )
}

function LinkTooltip({ link, ttW, nodeById, width, height, total }: {
  link: LaidLink
  ttW: number
  nodeById: Map<string, LaidNode>
  width: number
  height: number
  total: number
}) {
  const s = nodeById.get(link.source)
  const t = nodeById.get(link.target)
  const xm = (link.x0 + link.x1) / 2
  const name = (n: LaidNode | undefined, id: string) =>
    !n ? id : n.kind === 'exit' ? 'Left the site' : n.kind === 'entrance' ? 'Entered the site' : n.label
  return (
    <div className="an-tt an-flow-tt" style={ttStyle(xm, xm, (link.sy + link.ty) / 2, width, height, ttW, 96)} aria-hidden="true">
      <div className="an-flow-tt-path">
        <span className="an-flow-tt-key">{name(s, link.source)}</span>
        <span className="an-flow-tt-arrow" aria-hidden="true">→</span>
        <span className="an-flow-tt-key">{name(t, link.target)}</span>
      </div>
      <div className="an-flow-tt-main">
        <b>{fmtNumber(link.sessions)}</b> {link.sessions === 1 ? 'visit' : 'visits'}
        {s && s.sessions > 0 && <> · {fmtPercent(link.sessions / s.sessions)} of {s.kind === 'entrance' ? 'those' : 'that step'}</>}
      </div>
      {total > 0 && <div className="an-flow-tt-note">{fmtPercent(link.sessions / total)} of all visits in the diagram</div>}
    </div>
  )
}
