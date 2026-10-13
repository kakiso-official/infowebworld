'use client'
import { useMemo, type ReactNode } from 'react'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { PAGE_TYPES, PAGE_TYPE_META, type FlowNode, type FlowReport, type PageType } from '@/lib/analytics/types'
import { classifyPage } from '@/lib/analytics/classify'
import '../../../styles/analytics-people.css'
import {
  DataTable, EmptyState, InfoTip, MenuSelect, PageHeader, Panel, ReportView, Segmented, Skeleton,
  fmtNumber, fmtPercent, fmtRange, pageTypeLabel, sectionFor, useAnalyticsQuery, useReport,
  type Column,
} from '../_ui'
import { FlowDiagram, PathInput, ordinal, usePathSuggestions } from '../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Journeys. How visitors move through the site, as a Sankey:
   - Starting pages: where visits land and where they go from there;
   - After a page: everything that happened after visitors saw a page;
   - Before a page: the routes that led visitors to a page.
   Nodes are page types (readable overview) or exact pages. Clicking a page
   node re-anchors the diagram on it ("after this page"). Under the diagram
   a plain-English summary states the headline numbers, and the same data
   is available as a sortable, exportable table.
   URL params: mode, anchor, group, steps, width, collapse.
   ════════════════════════════════════════════════════════════════════════ */

type Mode = FlowReport['mode']
type Group = FlowReport['group']

const MODES: { key: Mode; label: string }[] = [
  { key: 'entries', label: 'Starting pages' },
  { key: 'from', label: 'After a page' },
  { key: 'to', label: 'Before a page' },
]
const STEP_OPTIONS = ['3', '4', '5', '6'] as const
const WIDTH_OPTIONS = ['4', '6', '8', '10'] as const

function isPageType(v: string | null): v is PageType {
  return !!v && (PAGE_TYPES as readonly string[]).includes(v)
}

export default function JourneysPage() {
  const q = useAnalyticsQuery()
  const modeRaw = q.param('mode')
  const mode: Mode = modeRaw === 'from' || modeRaw === 'to' ? modeRaw : 'entries'
  const group: Group = q.param('group') === 'path' ? 'path' : 'page_type'
  const steps = STEP_OPTIONS.includes(q.param('steps') as typeof STEP_OPTIONS[number]) ? Number(q.param('steps')) : 4
  const width = WIDTH_OPTIONS.includes(q.param('width') as typeof WIDTH_OPTIONS[number]) ? Number(q.param('width')) : 6
  // Merging repeats is on by default in page-type view: "category -> category -> category" says nothing.
  const collapse = group === 'page_type' && q.param('collapse') !== '0'

  // A sensible anchor is always set, so "after/before a page" never opens empty.
  const anchorRaw = q.param('anchor')
  const anchor = mode === 'entries'
    ? null
    : group === 'page_type'
      ? (isPageType(anchorRaw) ? anchorRaw : 'home')
      : (anchorRaw && anchorRaw.startsWith('/') ? anchorRaw : '/')

  const r = useReport<FlowReport>('flow', {
    mode,
    anchor,
    group,
    steps,
    width,
    collapse: collapse ? 1 : null,
  })
  const suggestions = usePathSuggestions(group === 'path')

  const setMode = (m: Mode) => q.set({ mode: m === 'entries' ? null : m, anchor: m === 'entries' ? null : anchor ?? (group === 'path' ? '/' : 'home') })
  const setGroup = (g: Group) => {
    // Carry the anchor across: an exact page becomes its page type; a page type has no single page, so start at '/'.
    let next: string | null = null
    if (mode !== 'entries' && anchor) next = g === 'page_type' ? classifyPage(anchor).pageType : '/'
    q.set({ group: g === 'page_type' ? null : g, anchor: next, collapse: null })
  }

  const range = r.data?.range
  return (
    <>
      <PageHeader
        title="Journeys"
        subtitle={sectionFor('journeys').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}{r.data?.sampled ? ' · based on the 20,000 most recent visits' : ''}</span>}
      />

      <div className="an-pp-controls" role="group" aria-label="Journey options">
        <div className="an-pp-control">
          <span className="an-pp-control-label">Show</span>
          <Segmented<Mode> ariaLabel="Which journeys to show" items={MODES} value={mode} onChange={setMode} />
        </div>
        {mode !== 'entries' && (
          <div className="an-pp-control an-pp-control--grow">
            <span className="an-pp-control-label">{mode === 'from' ? 'After' : 'Before'}</span>
            {group === 'page_type' ? (
              <select
                className="an-select"
                aria-label={mode === 'from' ? 'Page type to start from' : 'Page type to end at'}
                value={anchor ?? 'home'}
                onChange={e => q.set({ anchor: e.target.value })}
              >
                {PAGE_TYPES.map(t => <option key={t} value={t}>{PAGE_TYPE_META[t].label}</option>)}
              </select>
            ) : (
              <PathInput
                value={anchor ?? '/'}
                label={mode === 'from' ? 'Page to start from' : 'Page to end at'}
                suggestions={suggestions}
                onCommit={p => q.set({ anchor: p })}
              />
            )}
          </div>
        )}
        <div className="an-pp-control">
          <span className="an-pp-control-label">Group by</span>
          <Segmented<Group>
            ariaLabel="What each box stands for"
            size="sm"
            items={[{ key: 'page_type', label: 'Page type' }, { key: 'path', label: 'Exact page' }]}
            value={group}
            onChange={setGroup}
          />
        </div>
        <div className="an-pp-control">
          <span className="an-pp-control-label">Steps</span>
          <Segmented<string>
            ariaLabel="Number of steps"
            size="sm"
            items={STEP_OPTIONS.map(s => ({ key: s, label: s }))}
            value={String(steps)}
            onChange={s => q.set({ steps: s === '4' ? null : s })}
          />
        </div>
        <div className="an-pp-control">
          <MenuSelect<string>
            ariaLabel="Boxes per step"
            value={String(width)}
            buttonLabel={`Top ${width} per step`}
            options={WIDTH_OPTIONS.map(w => ({ value: w, label: `Top ${w} per step`, description: 'The rest are grouped as "Other"' }))}
            onChange={w => q.set({ width: w === '6' ? null : w })}
          />
        </div>
        {group === 'page_type' && (
          <label className="an-pp-check">
            <input type="checkbox" checked={collapse} onChange={e => q.set({ collapse: e.target.checked ? null : '0' })} />
            <span>Merge repeats</span>
            <InfoTip title="Merge repeats" text="Counts several pages of the same type in a row as one step (category → category → product becomes category → product), so the diagram shows real moves between kinds of pages." />
          </label>
        )}
      </div>

      <ReportView state={r} skeleton={<Skeleton variant="chart" height={460} />}>
        {data => <JourneyBody data={data} collapsed={collapse} />}
      </ReportView>
    </>
  )
}

/* ── Column headings ─────────────────────────────────────────────────── */

function columnTitleFor(data: FlowReport): (step: number) => string {
  const anchorName = data.anchor ? (data.group === 'page_type' ? pageTypeLabel(data.anchor) : data.anchor) : ''
  return step => {
    if (data.mode === 'entries') return step === 0 ? 'Landing page' : `${ordinal(step + 1)} page`
    if (data.mode === 'from') return step === 0 ? `Viewed ${anchorName}` : step === 1 ? 'Next page' : `${step} pages later`
    const back = data.steps - 1 - step
    return back === 0 ? `Reached ${anchorName}` : back === 1 ? 'Page before' : `${back} pages before`
  }
}

/* ── Body ────────────────────────────────────────────────────────────── */

function JourneyBody({ data, collapsed }: { data: FlowReport; collapsed: boolean }) {
  const q = useAnalyticsQuery()
  const columnTitle = useMemo(() => columnTitleFor(data), [data])
  const anchorName = data.anchor ? (data.group === 'page_type' ? pageTypeLabel(data.anchor) : data.anchor) : ''

  if (data.totalSessions === 0) {
    return (
      <Panel title="Visit flow">
        <EmptyState
          icon={faRoute}
          title={data.mode === 'entries' ? 'No visits in this period' : `No visit ${data.mode === 'from' ? 'viewed' : 'reached'} ${anchorName} in this period`}
          text={data.mode === 'entries'
            ? `Journeys appear once visits are recorded${q.filterList.length ? ' that match these filters' : ''}. Try a longer date range.`
            : `Pick another page, switch to "Page type", or widen the date range${q.filterList.length ? ' / clear the filters' : ''}.`}
          action={q.filterList.length ? <button type="button" className="an-btn an-btn--sm" onClick={q.clearFilters}>Clear filters</button> : undefined}
        />
      </Panel>
    )
  }

  const onNodeClick = (n: FlowNode) => {
    // Re-anchor: "what happened after this page". In page-type view the key is a type, in exact view a path.
    q.set({ mode: 'from', anchor: n.key, group: data.group === 'page_type' ? null : 'path' })
  }

  return (
    <>
      <Panel
        title="Visit flow"
        info={<InfoTip title="How to read this" text="Each column is a step of a visit; each box is a page (or page type) and its height is the number of visits there. Bands show how many visits went from one box to the next. Red boxes are visits that left the site; gray 'Other' boxes group the less common pages. Hover a box for details, click a page to see what happened after it." />}
        subtitle={<FlowSubtitle data={data} anchorName={anchorName} />}
        flush
      >
        <FlowDiagram
          report={data}
          columnTitle={columnTitle}
          onNodeClick={onNodeClick}
          clickHint="see what visitors did after this page"
        />
        <FlowLegend />
      </Panel>

      <Panel
        title="In plain words"
        info={<InfoTip title="Summary" text="The headline numbers of the diagram above, worked out for you." />}
      >
        <FlowSummary data={data} anchorName={anchorName} collapsed={collapsed} />
      </Panel>

      <FlowTable data={data} columnTitle={columnTitle} />
    </>
  )
}

function FlowSubtitle({ data, anchorName }: { data: FlowReport; anchorName: string }) {
  const n = fmtNumber(data.totalSessions)
  if (data.mode === 'entries') return <>{n} visits, their first {data.steps} pages</>
  if (data.mode === 'from') return <>{n} visits that viewed <b>{anchorName}</b>, and the {data.steps - 1} pages after it</>
  return <>{n} visits that reached <b>{anchorName}</b>, and the {data.steps - 1} pages before it</>
}

function FlowLegend() {
  return (
    <div className="an-flow-legend" aria-hidden="true">
      <span><i className="an-flow-key an-flow-key--page" /> Page</span>
      <span><i className="an-flow-key an-flow-key--other" /> Other pages (grouped)</span>
      <span><i className="an-flow-key an-flow-key--entrance" /> Entered the site</span>
      <span><i className="an-flow-key an-flow-key--exit" /> Left the site</span>
    </div>
  )
}

/* ── Plain-English summary ───────────────────────────────────────────── */

/* With "merge repeats" on, a column is a run of same-type pages, so the
   sentences talk about steps (kinds of page), not single pages. */
function FlowSummary({ data, anchorName, collapsed }: { data: FlowReport; anchorName: string; collapsed: boolean }) {
  const total = data.totalSessions
  const pct = (v: number, of = total) => fmtPercent(of > 0 ? v / of : 0, 0)
  const byStep = (step: number) => data.nodes.filter(n => n.step === step)
  const outsOf = (id: string) => data.links.filter(l => l.source === id).sort((a, b) => b.sessions - a.sessions)
  const nodeById = new Map(data.nodes.map(n => [n.id, n]))
  const name = (id: string) => {
    const n = nodeById.get(id)
    return n ? (n.kind === 'page' && data.group === 'page_type' ? `a ${n.label.toLowerCase()}` : n.label) : id
  }

  const lines: ReactNode[] = []

  /* Where visitors went right after a node: top page destination + exits. */
  const nextSentence = (node: FlowNode, lead: ReactNode) => {
    const outs = outsOf(node.id)
    const exit = outs.find(l => nodeById.get(l.target)?.kind === 'exit')
    const topPage = outs.find(l => nodeById.get(l.target)?.kind === 'page')
    const parts: ReactNode[] = []
    if (topPage) parts.push(<span key="p"><b>{pct(topPage.sessions, node.sessions)}</b> went to <b>{name(topPage.target)}</b> next</span>)
    if (exit) parts.push(<span key="e"><b>{pct(exit.sessions, node.sessions)}</b> left the site</span>)
    if (!parts.length) return null
    return <>{lead}, {parts.reduce<ReactNode[]>((acc, p, i) => (i ? [...acc, ' and ', p] : [p]), [])}.</>
  }

  if (data.mode === 'entries') {
    const first = byStep(0).filter(n => n.kind === 'page').sort((a, b) => b.sessions - a.sessions)
    const top = first[0]
    if (top) {
      lines.push(<>Most visits started on <b>{name(top.id)}</b>: <b>{fmtNumber(top.sessions)}</b> of {fmtNumber(total)} ({pct(top.sessions)}).</>)
      const s = nextSentence(top, <>Of the {fmtNumber(top.sessions)} visits that started there</>)
      if (s) lines.push(s)
    }
    const bounced = byStep(1).filter(n => n.kind === 'exit').reduce((a, n) => a + n.sessions, 0)
    if (data.steps > 1) {
      lines.push(collapsed
        ? <><b>{pct(bounced)}</b> of all visits left without moving on to another kind of page.</>
        : <><b>{pct(bounced)}</b> of all visits left after their first page.</>)
    }
  } else {
    const anchorStep = data.mode === 'from' ? 0 : data.steps - 1
    const anchorNode = byStep(anchorStep).find(n => n.kind === 'page')
    if (data.mode === 'from' && anchorNode) {
      const s = nextSentence(anchorNode, <>Of the {fmtNumber(total)} visits that viewed <b>{anchorName}</b></>)
      if (s) lines.push(s)
    }
    if (data.mode === 'to') {
      const before = byStep(anchorStep - 1)
      const entered = before.filter(n => n.kind === 'entrance').reduce((a, n) => a + n.sessions, 0)
      const topPrev = before.filter(n => n.kind === 'page').sort((a, b) => b.sessions - a.sessions)[0]
      if (topPrev) lines.push(<>Of the {fmtNumber(total)} visits that reached <b>{anchorName}</b>, <b>{pct(topPrev.sessions)}</b> came straight from <b>{name(topPrev.id)}</b>.</>)
      if (entered > 0) lines.push(<><b>{pct(entered)}</b> landed on {anchorName} directly - it was the first page of their visit.</>)
    }
  }

  // How many were still browsing at the last column (not exits).
  if (data.mode !== 'to') {
    const lastStep = data.steps - 1
    const still = byStep(lastStep).filter(n => n.kind === 'page' || n.kind === 'other').reduce((a, n) => a + n.sessions, 0)
    const unit = collapsed ? 'step' : 'page'
    const when = data.mode === 'entries' ? `at their ${ordinal(data.steps)} ${unit}` : lastStep === 1 ? `one ${unit} later` : `${lastStep} ${unit}s later`
    lines.push(<><b>{pct(still)}</b> were still browsing {when}.</>)
  }

  if (data.sampled) lines.push(<span className="an-muted">Based on the 20,000 most recent matching visits in this period.</span>)

  return (
    <ul className="an-pp-summary">
      {lines.map((l, i) => <li key={i}>{l}</li>)}
    </ul>
  )
}

/* ── Table view (also the CSV export) ────────────────────────────────── */

interface FlowRow { id: string; fromStep: number; from: string; to: string; visits: number; ofFrom: number; ofAll: number }

function FlowTable({ data, columnTitle }: { data: FlowReport; columnTitle: (s: number) => string }) {
  const nodeById = new Map(data.nodes.map(n => [n.id, n]))
  const label = (n: FlowNode | undefined, id: string) =>
    !n ? id : n.kind === 'exit' ? 'Left the site' : n.kind === 'entrance' ? 'Entered the site' : n.label
  const rows: FlowRow[] = data.links.map(l => {
    const s = nodeById.get(l.source)
    const t = nodeById.get(l.target)
    return {
      id: `${l.source}>${l.target}`,
      fromStep: s?.step ?? 0,
      from: label(s, l.source),
      to: label(t, l.target),
      visits: l.sessions,
      ofFrom: s && s.sessions ? l.sessions / s.sessions : 0,
      ofAll: data.totalSessions ? l.sessions / data.totalSessions : 0,
    }
  })
  const columns: Column<FlowRow>[] = [
    { key: 'step', header: 'Step', value: r => r.fromStep, render: r => `${columnTitle(r.fromStep)} → ${columnTitle(r.fromStep + 1)}`, csv: r => `${columnTitle(r.fromStep)} -> ${columnTitle(r.fromStep + 1)}`, firstDir: 'asc' },
    { key: 'from', header: 'From', value: r => r.from, render: r => <span className={r.from.startsWith('/') ? 'an-mono' : undefined}>{r.from}</span> },
    { key: 'to', header: 'To', value: r => r.to, render: r => <span className={r.to.startsWith('/') ? 'an-mono' : r.to === 'Left the site' ? 'an-pp-exit' : undefined}>{r.to}</span> },
    { key: 'visits', header: 'Visits', value: r => r.visits, format: 'number', bar: true, tip: <InfoTip title="Visits" text="Visits that went from the first box to the second one." /> },
    { key: 'ofFrom', header: 'Of "from"', value: r => r.ofFrom, format: 'percent', tip: <InfoTip title='Share of "from"' text="Of the visits in the first box, the share that went to the second one." /> },
    { key: 'ofAll', header: 'Of all', value: r => r.ofAll, format: 'percent', tip: <InfoTip title="Share of all" text="Share of all visits in the diagram that made this move." /> },
  ]
  return (
    <Panel
      title="All moves"
      info={<InfoTip title="All moves" text="Every band of the diagram as a row: which step, from where, to where, and how many visits. Sort any column or download it as CSV." />}
      flush
    >
      <DataTable
        caption="Moves between steps"
        rows={rows}
        columns={columns}
        rowKey={r => r.id}
        defaultSort={{ key: 'step', dir: 'asc' }}
        pageSize={15}
        csvName="journeys"
      />
    </Panel>
  )
}
