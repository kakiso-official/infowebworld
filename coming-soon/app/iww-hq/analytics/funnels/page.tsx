'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPenToSquare, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import type { FunnelReport, FunnelStepDef } from '@/lib/analytics/types'
import '../../../styles/analytics-people.css'
import {
  ChannelBadge, DataTable, EmptyState, InfoTip, KpiStrip, MenuSelect, PageHeader, Panel, ReportView, Segmented,
  Skeleton, fmtNumber, fmtPercent, fmtRange, sectionFor, useAnalyticsQuery, useReport,
  type Column,
} from '../_ui'
import { FunnelBuilder, FunnelChart, StatTile, usePathSuggestions } from '../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Funnels. How many visits (or visitors) make it through a
   sequence of steps, where they drop off, and how long each step takes.
   Ready-made funnels for the site's key journeys, or a custom one built
   from page types, exact pages, path prefixes and actions. A by-channel
   table shows which traffic sources convert best through the funnel.
   URL params: preset | steps (JSON), scope.
   ════════════════════════════════════════════════════════════════════════ */

type Scope = FunnelReport['scope']
const CUSTOM = '__custom'

/** Parse ?steps= (JSON FunnelStepDef[]), null when absent or unusable. */
function parseSteps(raw: string | null): FunnelStepDef[] | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) && v.length >= 2 ? (v as FunnelStepDef[]) : null
  } catch {
    return null
  }
}

export default function FunnelsPage() {
  const q = useAnalyticsQuery()
  const scope: Scope = q.param('scope') === 'visitor' ? 'visitor' : 'session'
  const stepsRaw = q.param('steps')
  const custom = parseSteps(stepsRaw)
  const preset = custom ? null : q.param('preset')
  const [editing, setEditing] = useState(false)
  const suggestions = usePathSuggestions(editing)

  const r = useReport<FunnelReport>('funnels', {
    preset,
    steps: custom ? stepsRaw : null,
    scope: scope === 'visitor' ? 'visitor' : null,
  })

  const presets = r.data?.presets ?? []
  const current = custom ? CUSTOM : preset && presets.some(p => p.id === preset) ? preset : presets[0]?.id ?? ''
  const currentPreset = presets.find(p => p.id === current)
  const range = r.data?.range

  const applyCustom = (steps: FunnelStepDef[]) => {
    q.set({ steps: JSON.stringify(steps), preset: null })
    setEditing(false)
  }

  return (
    <>
      <PageHeader
        title="Funnels"
        subtitle={sectionFor('funnels').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)} · {scope === 'session' ? 'all steps in the same visit' : 'steps may span several visits of the same visitor'}</span>}
      />

      <div className="an-pp-controls" role="group" aria-label="Funnel options">
        <div className="an-pp-control an-pp-control--grow">
          <span className="an-pp-control-label">Funnel</span>
          <MenuSelect<string>
            ariaLabel="Choose a funnel"
            icon={faFilter}
            value={current || null}
            buttonLabel={current === CUSTOM ? 'Custom funnel' : currentPreset?.name ?? 'Loading funnels…'}
            options={[
              ...presets.map(p => ({ value: p.id, label: p.name, description: p.description })),
              { value: CUSTOM, label: 'Custom funnel…', description: 'Build your own steps from pages and actions' },
            ]}
            onChange={v => {
              if (v === CUSTOM) { setEditing(true); return }
              setEditing(false)
              q.set({ preset: v === presets[0]?.id ? null : v, steps: null })
            }}
          />
          <button type="button" className="an-btn an-btn--sm" onClick={() => setEditing(e => !e)} aria-expanded={editing}>
            <FontAwesomeIcon icon={custom ? faPenToSquare : faWandMagicSparkles} aria-hidden="true" />
            {custom ? 'Edit steps' : 'Customize'}
          </button>
        </div>
        <div className="an-pp-control">
          <span className="an-pp-control-label">
            Count
            <InfoTip title="Same visit or same visitor" text="Same visit: every step must happen within one visit. Same visitor: the steps may happen across several visits of the same browser (e.g. reads a blog post today, signs up next week) - only visits that started in the selected dates are used." />
          </span>
          <Segmented<Scope>
            ariaLabel="Count steps within"
            size="sm"
            items={[{ key: 'session', label: 'Same visit' }, { key: 'visitor', label: 'Same visitor' }]}
            value={scope}
            onChange={s => q.set({ scope: s === 'visitor' ? 'visitor' : null })}
          />
        </div>
      </div>

      {editing && (
        <Panel title={custom ? 'Edit custom funnel' : 'Build a custom funnel'} subtitle="Each step must happen after the previous one. Pick up to 8 steps, then press Show funnel.">
          <FunnelBuilder
            key={stepsRaw ?? current}
            initial={custom ?? r.data?.steps.map(s => s.def) ?? []}
            suggestions={suggestions}
            onApply={applyCustom}
            onCancel={() => setEditing(false)}
          />
        </Panel>
      )}

      <ReportView state={r} skeleton={<FunnelSkeleton />}>
        {data => <FunnelBody data={data} description={custom ? null : currentPreset?.description ?? null} />}
      </ReportView>
    </>
  )
}

function FunnelSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <Skeleton variant="block" height={380} />
    </>
  )
}

function FunnelBody({ data, description }: { data: FunnelReport; description: string | null }) {
  const q = useAnalyticsQuery()
  const unit = data.scope === 'visitor' ? 'visitors' : 'visits'
  const steps = data.steps
  const first = steps[0]?.count ?? 0
  const last = steps[steps.length - 1]?.count ?? 0
  const overall = first > 0 ? last / first : 0

  // The step that loses the largest share of those who reached the step before it.
  let worst: { i: number; loss: number } | null = null
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1].count
    if (prev <= 0) continue
    const loss = 1 - steps[i].count / prev
    if (!worst || loss > worst.loss) worst = { i, loss }
  }

  return (
    <>
      <KpiStrip ariaLabel="Funnel totals" className="an-pp-kpis">
        <StatTile
          label={data.scope === 'visitor' ? 'Visitors who started' : 'Visits that started'}
          value={fmtNumber(first)}
          info={`${data.scope === 'visitor' ? 'Visitors' : 'Visits'} that did step 1 ("${steps[0]?.label ?? ''}") in the selected dates.`}
        />
        <StatTile
          label="Completed"
          value={fmtNumber(last)}
          info={`${data.scope === 'visitor' ? 'Visitors' : 'Visits'} that did every step, in order.`}
        />
        <StatTile
          label="Conversion"
          value={first > 0 ? fmtPercent(overall) : '–'}
          info="Completed divided by started: the share that made it from the first to the last step."
        />
        <StatTile
          label="Biggest drop-off"
          value={worst ? fmtPercent(worst.loss, 0) : '–'}
          sub={worst ? `between step ${worst.i} and ${worst.i + 1}` : 'no drop-off yet'}
          info="The step that loses the largest share of the people who reached the step before it - usually the best place to improve."
          tone={worst && worst.loss >= 0.7 ? 'bad' : undefined}
        />
      </KpiStrip>

      <Panel
        title="Step by step"
        info={<InfoTip title="How the funnel is counted" text={`Each ${unit === 'visits' ? 'visit' : 'visitor'} must do the steps in this order; a step only counts after the previous one happened. Bars are relative to step 1. Between steps: how many didn't continue, and the median time it took those who did.`} />}
        subtitle={description ?? undefined}
      >
        {first === 0 ? (
          <EmptyState
            icon={faFilter}
            title={`No ${unit} did step 1 in this period`}
            text={`Nobody did "${steps[0]?.label ?? 'the first step'}" in the selected dates${q.filterList.length ? ' with these filters' : ''}. Try a longer range, the "Same visitor" option, or a different first step.`}
            action={q.filterList.length ? <button type="button" className="an-btn an-btn--sm" onClick={q.clearFilters}>Clear filters</button> : undefined}
          />
        ) : (
          <FunnelChart steps={steps} unit={unit} />
        )}
        {data.sampled && <p className="an-pp-note">Very busy period: counts use the most recent 200,000 matches per step.</p>}
      </Panel>

      {first > 0 && <ChannelTable data={data} unit={unit} />}
    </>
  )
}

type ChannelRow = FunnelReport['byChannel'][number]

function ChannelTable({ data, unit }: { data: FunnelReport; unit: string }) {
  const q = useAnalyticsQuery()
  const n = data.steps.length
  const conv = (r: ChannelRow) => (r.counts[0] > 0 ? r.counts[n - 1] / r.counts[0] : 0)

  const columns: Column<ChannelRow>[] = [
    {
      key: 'channel',
      header: 'Channel',
      value: r => r.label,
      render: r => <ChannelBadge channel={r.key} label={r.label} />,
      sticky: true,
      tip: <InfoTip title="Channel" text={data.scope === 'visitor' ? 'How the visitor first found the site (first-touch channel).' : 'Where the visit came from.'} />,
    },
    {
      key: 'started',
      header: 'Started',
      value: r => r.counts[0],
      format: 'number',
      tip: <InfoTip title="Started" text={`${unit[0].toUpperCase() + unit.slice(1)} that did step 1.`} />,
    },
    ...data.steps.slice(1, -1).map((s, j): Column<ChannelRow> => ({
      key: `s${j + 1}`,
      header: `Step ${j + 2}`,
      value: r => r.counts[j + 1],
      format: 'number',
      tip: <InfoTip title={`Step ${j + 2}`} text={s.label} />,
      render: r => (
        <span className="an-pp-cellpair">
          {fmtNumber(r.counts[j + 1])}
          <span className="an-muted">{r.counts[0] > 0 ? fmtPercent(r.counts[j + 1] / r.counts[0], 0) : ''}</span>
        </span>
      ),
    })),
    {
      key: 'completed',
      header: 'Completed',
      value: r => r.counts[n - 1],
      format: 'number',
      tip: <InfoTip title="Completed" text={`${unit[0].toUpperCase() + unit.slice(1)} that did every step.`} />,
    },
    {
      key: 'conv',
      header: 'Conversion',
      value: conv,
      format: 'percent',
      bar: true,
      tip: <InfoTip title="Conversion" text="Completed divided by started, for this channel." />,
    },
  ]

  return (
    <Panel
      title="Which channels convert"
      info={<InfoTip title="By channel" text="The same funnel split by traffic channel. Click a row to look at only that channel everywhere in Analytics." />}
      flush
    >
      <DataTable
        caption="Funnel by channel"
        rows={data.byChannel}
        columns={columns}
        rowKey={r => r.key}
        defaultSort={{ key: 'started', dir: 'desc' }}
        onRowClick={r => q.setFilter('channel', r.key)}
        csvName="funnel-by-channel"
        pageSize={0}
      />
    </Panel>
  )
}
