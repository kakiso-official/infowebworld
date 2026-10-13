'use client'
import { useId, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faPlay, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { EVENTS, PAGE_TYPES, PAGE_TYPE_META, type FunnelStepDef } from '@/lib/analytics/types'
import { eventLabel } from '../../_lib/labels'
import { PathInput } from './PathInput'

/* ═══════════════════════════════════════════════════════════════════════════
   FunnelBuilder - edit a custom funnel: 2-8 steps, each "viewed a page
   type", "viewed an exact page", "viewed any page starting with..." or
   "did an event", with an optional name. Steps can be reordered and
   removed. Nothing is requested until "Show funnel" is pressed (each run
   is a real database query).
   ═══════════════════════════════════════════════════════════════════════════ */

const MIN_STEPS = 2
const MAX_STEPS = 8

const KIND_OPTIONS: { value: FunnelStepDef['kind']; label: string }[] = [
  { value: 'page_type', label: 'Viewed a page type' },
  { value: 'page', label: 'Viewed an exact page' },
  { value: 'page_prefix', label: 'Viewed a page starting with' },
  { value: 'event', label: 'Did an action' },
]

const EVENT_NAMES = Object.keys(EVENTS) as (keyof typeof EVENTS)[]
const KEY_EVENTS = EVENT_NAMES.filter(n => EVENTS[n].isKey)
const OTHER_EVENTS = EVENT_NAMES.filter(n => !EVENTS[n].isKey)

interface Draft extends FunnelStepDef { uid: number }

const DEFAULT_STEPS: FunnelStepDef[] = [
  { kind: 'page_type', value: 'category' },
  { kind: 'event', value: 'website_click' },
]

let uidSeq = 0
const withUid = (s: FunnelStepDef): Draft => ({ ...s, uid: ++uidSeq })

function defaultValue(kind: FunnelStepDef['kind']): string {
  switch (kind) {
    case 'page_type': return 'category'
    case 'event': return 'website_click'
    default: return '/'
  }
}

export function FunnelBuilder({ initial, suggestions, onApply, onCancel }: {
  initial: FunnelStepDef[]
  suggestions: { path: string; title: string | null }[]
  onApply: (steps: FunnelStepDef[]) => void
  onCancel: () => void
}) {
  const baseId = useId()
  const [steps, setSteps] = useState<Draft[]>(() =>
    (initial.length >= MIN_STEPS ? initial : DEFAULT_STEPS).slice(0, MAX_STEPS).map(withUid))

  const update = (uid: number, patch: Partial<FunnelStepDef>) =>
    setSteps(list => list.map(s => (s.uid === uid ? { ...s, ...patch } : s)))
  const move = (i: number, d: -1 | 1) =>
    setSteps(list => {
      const j = i + d
      if (j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  const remove = (uid: number) => setSteps(list => list.filter(s => s.uid !== uid))
  const add = () => setSteps(list => (list.length >= MAX_STEPS ? list : [...list, withUid({ kind: 'page_type', value: 'profile' })]))

  const valid = steps.length >= MIN_STEPS && steps.every(s => s.value.trim())
  const apply = () => {
    if (!valid) return
    onApply(steps.map(({ kind, value, label }) => {
      const l = label?.trim()
      return l ? { kind, value: value.trim(), label: l.slice(0, 100) } : { kind, value: value.trim() }
    }))
  }

  return (
    <div className="an-fb" role="group" aria-label="Custom funnel steps">
      <ol className="an-fb-list">
        {steps.map((s, i) => {
          const id = `${baseId}-${s.uid}`
          return (
            <li key={s.uid} className="an-fb-step">
              <span className="an-fb-num" aria-hidden="true">{i + 1}</span>
              <div className="an-fb-fields">
                <label className="an-fb-field">
                  <span className="an-fb-lbl">Step {i + 1}</span>
                  <select
                    className="an-select"
                    value={s.kind}
                    onChange={e => {
                      const kind = e.target.value as FunnelStepDef['kind']
                      // Keep a typed path when switching between the two path kinds.
                      const keep = (kind === 'page' || kind === 'page_prefix') && (s.kind === 'page' || s.kind === 'page_prefix')
                      update(s.uid, { kind, value: keep ? s.value : defaultValue(kind) })
                    }}
                  >
                    {KIND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <div className="an-fb-field an-fb-field--grow">
                  <label className="an-fb-lbl" htmlFor={`${id}-v`}>
                    {s.kind === 'event' ? 'Action' : s.kind === 'page_type' ? 'Page type' : s.kind === 'page' ? 'Page path' : 'Path starts with'}
                  </label>
                  {s.kind === 'page_type' && (
                    <select id={`${id}-v`} className="an-select" value={s.value} onChange={e => update(s.uid, { value: e.target.value })}>
                      {PAGE_TYPES.map(t => <option key={t} value={t}>{PAGE_TYPE_META[t].label}</option>)}
                    </select>
                  )}
                  {s.kind === 'event' && (
                    <select id={`${id}-v`} className="an-select" value={s.value} onChange={e => update(s.uid, { value: e.target.value })}>
                      {!EVENT_NAMES.includes(s.value as keyof typeof EVENTS) && <option value={s.value}>{eventLabel(s.value)}</option>}
                      <optgroup label="Key actions (conversions)">
                        {KEY_EVENTS.map(n => <option key={n} value={n}>{EVENTS[n].label}</option>)}
                      </optgroup>
                      <optgroup label="Other actions">
                        {OTHER_EVENTS.map(n => <option key={n} value={n}>{EVENTS[n].label}</option>)}
                      </optgroup>
                    </select>
                  )}
                  {(s.kind === 'page' || s.kind === 'page_prefix') && (
                    <PathInput
                      id={`${id}-v`}
                      value={s.value}
                      label={s.kind === 'page' ? `Step ${i + 1} page path` : `Step ${i + 1} path prefix`}
                      placeholder={s.kind === 'page' ? '/business' : '/dashboard'}
                      suggestions={suggestions}
                      onCommit={v => update(s.uid, { value: v })}
                    />
                  )}
                </div>
                <label className="an-fb-field an-fb-field--name">
                  <span className="an-fb-lbl">Name (optional)</span>
                  <input
                    type="text"
                    className="an-input"
                    value={s.label ?? ''}
                    maxLength={100}
                    placeholder="e.g. Opened a profile"
                    onChange={e => update(s.uid, { label: e.target.value })}
                  />
                </label>
              </div>
              <div className="an-fb-acts">
                <button type="button" className="an-btn an-btn--sm an-btn--icon an-btn--ghost" aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button type="button" className="an-btn an-btn--sm an-btn--icon an-btn--ghost" aria-label={`Move step ${i + 1} down`} disabled={i === steps.length - 1} onClick={() => move(i, 1)}>
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
                <button type="button" className="an-btn an-btn--sm an-btn--icon an-btn--ghost" aria-label={`Remove step ${i + 1}`} disabled={steps.length <= MIN_STEPS} onClick={() => remove(s.uid)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="an-fb-foot">
        <button type="button" className="an-btn an-btn--sm" onClick={add} disabled={steps.length >= MAX_STEPS}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" /> Add step
        </button>
        <span className="an-fb-note">{steps.length} of {MAX_STEPS} steps · each step must happen after the previous one</span>
        <span className="an-bar-spacer" />
        <button type="button" className="an-btn an-btn--sm an-btn--ghost" onClick={onCancel}>
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Cancel
        </button>
        <button type="button" className="an-btn an-btn--sm an-btn--primary" onClick={apply} disabled={!valid}>
          <FontAwesomeIcon icon={faPlay} aria-hidden="true" /> Show funnel
        </button>
      </div>
    </div>
  )
}
