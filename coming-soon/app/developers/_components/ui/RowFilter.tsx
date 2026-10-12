'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faFilter, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import DvEmpty from '../shell/DvEmpty'

/* ═══════════════════════════════════════════════════════════════════════
   RowFilter - the generic filter/sort engine every *FilterBar is built on
   (spec 4.8).

   The rows themselves are SERVER-RENDERED (crawlable, complete without
   JS). This island only reads their data-* attributes and:
     - toggles `hidden` on rows (and on [data-row-group] wrappers whose
       rows are all hidden),
     - re-sorts rows inside their own parent by a data-* value (falling
       back to the original server order),
     - announces "Showing 12 of 43 APIs" in a polite live region,
     - mirrors the state to the query string with history.replaceState so
       a view can be shared (the server never reads it; canonicals never
       include it).

   Markup contract for the list it controls:
     <tbody id={target}>            any element; rows are its [data-row] descendants
       <tr data-row data-auth="none" data-https="1" data-sdk="python go" data-stars="44112" ...>
   Multi-value attributes are space-separated slugs. Toggle values default
   to '1'. Text search reads data-search (lowercase) or the row text.

   <= 768 the controls collapse into a "Filters (n)" button that opens a
   bottom-sheet <dialog> (Esc closes, focus returns to the button).
   ═══════════════════════════════════════════════════════════════════════ */

export interface RowFilterOption {
  value: string
  label: string
  count?: number
}

export type RowFilterControl =
  | {
      kind: 'toggle'
      /** Query-string key. */
      key: string
      label: string
      /** data-* attribute name without 'data-' ('gfi', 'archived'). */
      attr: string
      /** Value that matches (default '1'). */
      value?: string
      /** 'require': keep rows that match; 'exclude': hide rows that match. */
      mode?: 'require' | 'exclude'
      defaultOn?: boolean
      icon?: IconDefinition
    }
  | {
      /** A <select> with an "all" option (industry, country, category). */
      kind: 'select'
      key: string
      label: string
      attr: string
      allLabel: string
      options: readonly RowFilterOption[]
    }
  | {
      /** A row of single-choice chips: Auth (Any)(No key)(API key)(OAuth). */
      kind: 'segment'
      key: string
      label: string
      attr: string
      allLabel: string
      options: readonly RowFilterOption[]
    }

export interface RowSortOption {
  /** Query-string value. */
  key: string
  label: string
  /** data-* attribute to sort by; omit for the original server order. */
  attr?: string
  type?: 'number' | 'string'
  dir?: 'asc' | 'desc'
}

export interface RowFilterProps {
  /** id of the element that contains the rows. */
  target: string
  /** Noun for the count line: { one: 'API', many: 'APIs' }. */
  noun: { one: string; many: string }
  controls?: readonly RowFilterControl[]
  /** Sort choices; the first one is the default. */
  sorts?: readonly RowSortOption[]
  /** Free-text filter box. */
  search?: { label: string; placeholder: string }
  /** Stick under the sub-nav while the list is in view (>= 769px). */
  sticky?: boolean
  /** Accessible name of the filter region ('Filter weather APIs'). */
  label: string
  emptyTitle?: string
  emptyText?: string
  className?: string
}

type FilterState = Record<string, string>

const SEARCH_KEY = 'find'
const SORT_KEY = 'sort'

/* Stable empty defaults. The effects below depend on `controls` and
   `sorts` by reference; a fresh [] on every render would re-run them after
   each setCounts() and loop until React stops it ("Maximum update depth
   exceeded"). Callers should still pass stable arrays (module constants or
   useMemo). */
const NO_CONTROLS: readonly RowFilterControl[] = []
const NO_SORTS: readonly RowSortOption[] = []

function defaultsOf(controls: readonly RowFilterControl[], sorts: readonly RowSortOption[]): FilterState {
  const state: FilterState = {}
  for (const c of controls) state[c.key] = c.kind === 'toggle' ? (c.defaultOn ? '1' : '0') : ''
  state[SORT_KEY] = sorts[0]?.key ?? ''
  state[SEARCH_KEY] = ''
  return state
}

function tokens(el: Element, attr: string): string[] {
  const raw = el.getAttribute(`data-${attr}`)
  return raw ? raw.trim().split(/\s+/) : []
}

function words(text: string): string[] {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/\s+/).filter(Boolean)
}

export default function RowFilter({
  target, noun, controls = NO_CONTROLS, sorts = NO_SORTS, search, sticky = false, label,
  emptyTitle, emptyText, className,
}: RowFilterProps) {
  const uid = useId()
  const defaults = useMemo(() => defaultsOf(controls, sorts), [controls, sorts])
  const [state, setState] = useState<FilterState>(defaults)
  const [counts, setCounts] = useState<{ shown: number; total: number } | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const order = useRef<WeakMap<Element, number>>(new WeakMap())
  const ready = useRef(false)
  const sheetRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  /* Read a shared view from the query string once, after hydration (the
     guard keeps a parent re-render from resetting the visitor's choices). */
  useEffect(() => {
    if (ready.current) return
    const params = new URLSearchParams(window.location.search)
    const next: FilterState = { ...defaults }
    for (const c of controls) {
      const v = params.get(c.key)
      if (v === null) continue
      if (c.kind === 'toggle') next[c.key] = v === '1' ? '1' : '0'
      else if (c.options.some(o => o.value === v)) next[c.key] = v
    }
    const s = params.get(SORT_KEY)
    if (s && sorts.some(o => o.key === s)) next[SORT_KEY] = s
    if (search) next[SEARCH_KEY] = (params.get(SEARCH_KEY) ?? '').slice(0, 80)
    ready.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next)
  }, [controls, sorts, search, defaults])

  /* Apply the state to the server-rendered rows. */
  useEffect(() => {
    const root = document.getElementById(target)
    if (!root) return
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-row]'))
    rows.forEach((row, i) => {
      if (!order.current.has(row)) order.current.set(row, i)
    })

    const query = words(state[SEARCH_KEY] ?? '')
    let shown = 0
    for (const row of rows) {
      let visible = true
      for (const c of controls) {
        const v = state[c.key]
        if (c.kind === 'toggle') {
          if (v !== '1') continue
          const has = tokens(row, c.attr).includes(c.value ?? '1')
          if ((c.mode ?? 'require') === 'require' ? !has : has) { visible = false; break }
        } else if (v && !tokens(row, c.attr).includes(v)) {
          visible = false
          break
        }
      }
      if (visible && query.length) {
        const hay = (row.getAttribute('data-search') ?? row.textContent ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
        visible = query.every(w => hay.includes(w))
      }
      row.hidden = !visible
      if (visible) shown++
    }

    root.querySelectorAll<HTMLElement>('[data-row-group]').forEach(group => {
      group.hidden = !group.querySelector('[data-row]:not([hidden])')
    })

    /* Sort inside each parent; ties keep the server order. */
    const sort = sorts.find(o => o.key === state[SORT_KEY]) ?? sorts[0]
    const byParent = new Map<Element, HTMLElement[]>()
    for (const row of rows) {
      const p = row.parentElement
      if (!p) continue
      const list = byParent.get(p)
      if (list) list.push(row)
      else byParent.set(p, [row])
    }
    const base = (el: Element) => order.current.get(el) ?? 0
    for (const [parent, list] of byParent) {
      const sorted = [...list].sort((a, b) => {
        if (sort?.attr) {
          const av = a.getAttribute(`data-${sort.attr}`) ?? ''
          const bv = b.getAttribute(`data-${sort.attr}`) ?? ''
          let cmp: number
          if ((sort.type ?? 'number') === 'number') {
            const an = av === '' ? Number.NEGATIVE_INFINITY : Number(av)
            const bn = bv === '' ? Number.NEGATIVE_INFINITY : Number(bv)
            cmp = an === bn ? 0 : an < bn ? -1 : 1
          } else {
            cmp = av.localeCompare(bv, 'en', { sensitivity: 'base', numeric: true })
          }
          if (cmp !== 0) return (sort.dir ?? 'desc') === 'desc' ? -cmp : cmp
        }
        return base(a) - base(b)
      })
      /* Only touch the DOM when the order actually changed. */
      if (sorted.some((el, i) => el !== list[i])) {
        for (const el of sorted) parent.appendChild(el)
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCounts({ shown, total: rows.length })

    if (ready.current) {
      const params = new URLSearchParams(window.location.search)
      for (const [k, v] of Object.entries(state)) {
        if (k === SEARCH_KEY && !search) continue
        if (v === defaults[k]) params.delete(k)
        else params.set(k, v)
      }
      const qs = params.toString()
      const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
      if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.replaceState(window.history.state, '', url)
      }
    }
  }, [state, target, controls, sorts, search, defaults])

  const active = controls.filter(c => state[c.key] !== defaults[c.key]).length
  const dirty = active > 0 || (state[SEARCH_KEY] ?? '') !== ''

  const set = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])
  const clear = useCallback(() => setState({ ...defaults }), [defaults])

  function openSheet() {
    setSheetOpen(true)
    sheetRef.current?.showModal()
  }
  function closeSheet() {
    sheetRef.current?.close()
  }

  const countText = counts
    ? `Showing ${counts.shown.toLocaleString('en-US')} of ${counts.total.toLocaleString('en-US')} ${counts.total === 1 ? noun.one : noun.many}`
    : ''

  function renderSearch(prefix: string) {
    if (!search) return null
    return (
      <div className="dv-filter-search">
        <label htmlFor={`${uid}-${prefix}-q`} className="sr-only">{search.label}</label>
        <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
        <input
          id={`${uid}-${prefix}-q`}
          className="dv-filter-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={search.placeholder}
          value={state[SEARCH_KEY] ?? ''}
          onChange={e => set(SEARCH_KEY, e.target.value.slice(0, 80))}
        />
      </div>
    )
  }

  function renderControls(prefix: string) {
    const toggles = controls.filter(c => c.kind === 'toggle')
    return (
      <>
        {controls.map(c => {
          if (c.kind === 'select') {
            const id = `${uid}-${prefix}-${c.key}`
            return (
              <div key={c.key} className="dv-filter-field">
                <label htmlFor={id} className="dv-label">{c.label}</label>
                <select id={id} className="dv-filter-select" value={state[c.key] ?? ''} onChange={e => set(c.key, e.target.value)}>
                  <option value="">{c.allLabel}</option>
                  {c.options.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}{typeof o.count === 'number' ? ` (${o.count.toLocaleString('en-US')})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          if (c.kind === 'segment') {
            const labelId = `${uid}-${prefix}-${c.key}-l`
            const all = [{ value: '', label: c.allLabel }, ...c.options]
            return (
              <div key={c.key} className="dv-filter-field">
                <span id={labelId} className="dv-label">{c.label}</span>
                <div className="dv-filter-seg" role="group" aria-labelledby={labelId}>
                  {all.map(o => {
                    const on = (state[c.key] ?? '') === o.value
                    return (
                      <button
                        key={o.value || 'all'}
                        type="button"
                        className="dv-chip"
                        aria-pressed={on}
                        onClick={() => set(c.key, o.value)}
                      >
                        {o.label}
                        {'count' in o && typeof o.count === 'number' && <span className="dv-chip-count">{o.count.toLocaleString('en-US')}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          }
          return null
        })}
        {toggles.length > 0 && (
          <div className="dv-filter-toggles" role="group" aria-label="Show only">
            {toggles.map(c => {
              if (c.kind !== 'toggle') return null
              const on = state[c.key] === '1'
              return (
                <button
                  key={c.key}
                  type="button"
                  className="dv-chip"
                  aria-pressed={on}
                  onClick={() => set(c.key, on ? '0' : '1')}
                >
                  {on ? <FontAwesomeIcon icon={faCheck} aria-hidden="true" /> : c.icon && <FontAwesomeIcon icon={c.icon} aria-hidden="true" />}
                  {c.label}
                </button>
              )
            })}
          </div>
        )}
      </>
    )
  }

  function renderSort(prefix: string) {
    if (sorts.length < 2) return null
    const id = `${uid}-${prefix}-sort`
    return (
      <div className="dv-filter-field">
        <label htmlFor={id} className="dv-label">Sort</label>
        <select id={id} className="dv-filter-select" value={state[SORT_KEY]} onChange={e => set(SORT_KEY, e.target.value)}>
          {sorts.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
    )
  }

  const hasControls = controls.length > 0 || sorts.length > 1

  return (
    <div className={`dv-filter${sticky ? ' dv-filter--sticky' : ''}${className ? ` ${className}` : ''}`} role="region" aria-label={label}>
      <div className="dv-filter-bar dv-filter-bar--desktop">
        {renderSearch('d')}
        {renderControls('d')}
        <div className="dv-filter-end">{renderSort('d')}</div>
      </div>

      <div className="dv-filter-mobile">
        {renderSearch('m')}
        {hasControls && (
          <button
            ref={openerRef}
            type="button"
            className="dv-btn dv-btn--secondary dv-btn--sm dv-filter-open"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={openSheet}
          >
            <FontAwesomeIcon icon={faFilter} aria-hidden="true" />
            Filters{active > 0 ? ` (${active})` : ''}
          </button>
        )}
      </div>

      <div className="dv-filter-meta">
        <p className="dv-filter-count" role="status" aria-live="polite">{countText}</p>
        {dirty && (
          <button type="button" className="dv-filter-clear" onClick={clear}>
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {counts && counts.total > 0 && counts.shown === 0 && (
        <div className="dv-filter-empty">
          <DvEmpty
            icon={faFilter}
            title={emptyTitle ?? `No ${noun.many} match these filters.`}
            text={emptyText ?? 'Try fewer filters or a shorter search.'}
            action={<button type="button" className="dv-btn dv-btn--secondary dv-btn--sm" onClick={clear}>Clear filters</button>}
          />
        </div>
      )}

      {hasControls && (
        <dialog
          ref={sheetRef}
          className="dv-filter-sheet"
          aria-labelledby={`${uid}-sheet-title`}
          onClose={() => {
            setSheetOpen(false)
            openerRef.current?.focus()
          }}
          onClick={e => {
            /* A click on the backdrop (the dialog box itself) closes it. */
            if (e.target === e.currentTarget) closeSheet()
          }}
        >
          <div className="dv-sheet-head">
            <h2 id={`${uid}-sheet-title`} className="dv-sheet-title">Filters</h2>
            <button type="button" className="dv-sheet-close" aria-label="Close filters" onClick={closeSheet}>
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
          </div>
          <div className="dv-sheet-body">
            {renderControls('m')}
            {renderSort('m')}
          </div>
          <div className="dv-sheet-foot">
            <button type="button" className="dv-btn dv-btn--secondary dv-btn--sm" onClick={clear} disabled={!dirty}>
              Clear
            </button>
            <button type="button" className="dv-btn dv-btn--primary dv-btn--sm" onClick={closeSheet}>
              {counts ? `Show ${counts.shown.toLocaleString('en-US')} ${counts.shown === 1 ? noun.one : noun.many}` : 'Done'}
            </button>
          </div>
        </dialog>
      )}
    </div>
  )
}
