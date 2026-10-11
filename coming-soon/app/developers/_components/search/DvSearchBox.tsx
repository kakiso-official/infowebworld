'use client'

import {
  useCallback, useEffect, useId, useRef, useState,
  type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight, faArrowUpRightFromSquare, faCodeBranch, faCubes, faLayerGroup, faMagnifyingGlass, faPlug, faTag, faXmark,
} from '@fortawesome/free-solid-svg-icons'
import type { SearchHit, SearchKind, SearchResponse } from '@/lib/developers/types'
import OrgAvatar from '../ui/OrgAvatar'
import DvSkeleton from '../ui/DvSkeleton'
import SearchSheet from './SearchSheet'

/* ═══════════════════════════════════════════════════════════════════════
   Developer hub search box (spec 4.12).

     size="hero"   56px field with a Search button (hubs, search page, 404)
     size="bar"    36px field in the sub-nav; <= 768 a 44x44 button that
                   opens the full-screen SearchSheet
     size="sheet"  the field inside that sheet (results listed inline)

   Without JS it is a plain GET form to /developers/search?q=, so Enter
   always works. With JS it is an ARIA 1.2 combobox: suggestions from
   /api/developers/search?q=&limit=5 (SearchResponse), 200ms debounce, a
   minimum of 2 characters, in-flight requests aborted, grouped results
   (Free APIs, Companies, Repositories, SDKs, Categories and languages, 5
   each) and a last "See all results" option.

   Keys: "/" focuses the most relevant box on the page when focus is not in
   a field (never Ctrl/Cmd+K, which belongs to the header search). Up/Down
   move, Home/End jump while a suggestion is active, Enter opens it (or
   submits), Esc closes and blurs. A click outside closes.
   ═══════════════════════════════════════════════════════════════════════ */

export type DvSearchSize = 'hero' | 'bar' | 'sheet'

export interface DvSearchBoxProps {
  size?: DvSearchSize
  /** Prefill (the search page passes its query). */
  defaultValue?: string
  placeholder?: string
  /** Accessible name of the input. */
  label?: string
  /** Focus the input on mount (the sheet). */
  autoFocus?: boolean
  /** Called after a suggestion is picked or the form submits (the sheet closes itself). */
  onNavigate?: () => void
  className?: string
}

/* Mirrors app/api/developers/search/route.ts (WP5). Until that route
   exists the box shows its error state and the form still submits. */
const SEARCH_API = '/api/developers/search'
const MIN_CHARS = 2
const MAX_CHARS = 64
const DEBOUNCE_MS = 200
const PER_GROUP = 5

const GROUPS: ReadonlyArray<{ key: keyof SearchResponse['groups']; label: string }> = [
  { key: 'apis', label: 'Free APIs' },
  { key: 'companies', label: 'Companies' },
  { key: 'repos', label: 'Repositories' },
  { key: 'sdks', label: 'SDKs' },
  { key: 'other', label: 'Categories and languages' },
]

const KIND_ICON: Record<SearchKind, IconDefinition> = {
  api: faPlug,
  company: faLayerGroup,
  repo: faCodeBranch,
  sdk: faCubes,
  category: faLayerGroup,
  language: faCodeBranch,
  topic: faTag,
}

const DEFAULT_PLACEHOLDER: Record<DvSearchSize, string> = {
  hero: 'Search APIs, SDKs, companies or repos...',
  bar: 'Search APIs, repos, companies...',
  sheet: 'Search APIs, SDKs, companies or repos...',
}

const EMPTY_TEXT = 'No matches. Try weather, payments or a language like go.'
const ERROR_TEXT = 'Search is unavailable right now. Press Enter for the full results page.'

type Status = 'idle' | 'loading' | 'results' | 'empty' | 'error'

/* ── Response guard + a small session cache ──────────────────────────── */

function isHit(value: unknown): value is SearchHit {
  const h = value as SearchHit | null
  return !!h && typeof h === 'object' && typeof h.label === 'string' && typeof h.href === 'string' && typeof h.kind === 'string'
}

/* This build ships 6 pages (hub, open-source hub, company, free-apis hub,
   category, API detail) out of the full section's URL map. The search
   index covers the whole map, so repo/language/topic hits would point at
   pages that do not exist here; they are dropped before anything renders. */
const UNBUILT_KINDS = new Set<SearchKind>(['repo', 'language', 'topic'])
function isBuiltHit(hit: SearchHit): boolean {
  return !UNBUILT_KINDS.has(hit.kind)
}

/* The endpoint is ours, but a bad deploy must not crash the island. */
function readResponse(json: unknown): SearchResponse | null {
  const r = json as Partial<SearchResponse> | null
  if (!r || typeof r !== 'object' || !r.groups || typeof r.groups !== 'object') return null
  const groups = {} as SearchResponse['groups']
  let total = 0
  for (const { key } of GROUPS) {
    const list = Array.isArray(r.groups[key]) ? (r.groups[key] as unknown[]).filter(isHit).filter(isBuiltHit).slice(0, PER_GROUP) : []
    groups[key] = list
    total += list.length
  }
  return { q: typeof r.q === 'string' ? r.q : '', tookMs: Number(r.tookMs) || 0, total, groups }
}

const cache = new Map<string, SearchResponse>()
function remember(term: string, data: SearchResponse) {
  cache.set(term, data)
  if (cache.size > 30) cache.delete(cache.keys().next().value as string)
}

/* ── "/" shortcut: one window listener for every box on the page ─────── */

interface BoxEntry {
  size: DvSearchSize
  root: () => HTMLElement | null
  /** Focus the box (or open its sheet); false when it cannot right now. */
  activate: () => boolean
}

const boxes = new Set<BoxEntry>()

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el || typeof el.closest !== 'function') return false
  return el.isContentEditable || !!el.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
}

function inViewport(el: HTMLElement | null): boolean {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight
}

function onSlash(e: globalThis.KeyboardEvent) {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented || e.isComposing) return
  if (isTyping(e.target)) return
  /* A modal (filter sheet, search sheet) owns the keyboard while open. */
  if (document.querySelector('dialog[open]')) return
  const list = [...boxes]
  /* The nearest box: a hero box on screen first, then the sub-nav box. */
  const ordered = [
    ...list.filter(b => b.size === 'hero' && inViewport(b.root())),
    ...list.filter(b => b.size === 'bar'),
    ...list.filter(b => b.size === 'hero' && !inViewport(b.root())),
  ]
  for (const box of ordered) {
    if (box.activate()) {
      e.preventDefault()
      return
    }
  }
}

function register(entry: BoxEntry): () => void {
  if (boxes.size === 0) window.addEventListener('keydown', onSlash)
  boxes.add(entry)
  return () => {
    boxes.delete(entry)
    if (boxes.size === 0) window.removeEventListener('keydown', onSlash)
  }
}

/* ── Label highlighting (plain indexOf: no RegExp from user input) ───── */

function highlight(text: string, query: string): ReactNode {
  const q = query.trim().toLowerCase()
  if (q.length < MIN_CHARS) return text
  const at = text.toLowerCase().indexOf(q)
  if (at === -1) return text
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  )
}

function OptionMedia({ hit }: { hit: SearchHit }) {
  if (hit.kind === 'company' || (hit.kind === 'repo' && hit.avatar)) {
    return <OrgAvatar src={hit.avatar ?? null} name={hit.kind === 'repo' ? hit.label.split('/')[0] : hit.label} size={28} />
  }
  if (hit.kind === 'language' && hit.color !== undefined) {
    return (
      <span className="dv-search-opt-media" aria-hidden="true">
        <span className="dv-lang-dot" style={{ ['--lang' as string]: hit.color || '#9CA3AF' }} />
      </span>
    )
  }
  return (
    <span className="dv-search-opt-media" aria-hidden="true">
      <FontAwesomeIcon icon={KIND_ICON[hit.kind] ?? faMagnifyingGlass} />
    </span>
  )
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function DvSearchBox({
  size = 'hero', defaultValue = '', placeholder, label = 'Search free APIs, SDKs, companies and repositories',
  autoFocus = false, onNavigate, className,
}: DvSearchBoxProps) {
  const uid = useId()
  const inputId = `${uid}-q`
  const listId = `${uid}-list`
  const optionId = (i: number) => `${uid}-opt-${i}`

  const [value, setValue] = useState(defaultValue)
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<SearchResponse | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const inflight = useRef<AbortController | null>(null)
  const latest = useRef('')

  const term = value.trim()
  const shownGroups = data ? GROUPS.map(g => ({ ...g, hits: data.groups[g.key] })).filter(g => g.hits.length > 0) : []
  /* Each group's first option index in the flat (keyboard) order. */
  const groups = shownGroups.map((g, gi) => ({
    ...g,
    start: shownGroups.slice(0, gi).reduce((n, prev) => n + prev.hits.length, 0),
  }))
  const hits = groups.flatMap(g => g.hits)
  /* Every suggestion plus the trailing "See all results" option. */
  const optionCount = hits.length > 0 ? hits.length + 1 : 0
  const listShown = open && optionCount > 0
  const panelShown = size === 'sheet'
    ? term.length >= MIN_CHARS && status !== 'idle'
    : open && term.length >= MIN_CHARS && status !== 'idle'

  /* "/" focuses this box when it is the nearest one. */
  useEffect(() => register({
    size,
    root: () => rootRef.current,
    activate: () => {
      const input = inputRef.current
      if (size === 'bar') {
        const form = formRef.current
        /* <= 768 the form is hidden and the trigger opens the sheet. */
        if (form && form.offsetParent === null) {
          if (!triggerRef.current || triggerRef.current.offsetParent === null) return false
          setSheetOpen(true)
          return true
        }
      }
      if (!input || input.offsetParent === null) return false
      input.focus()
      input.select()
      return true
    },
  }), [size])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  /* Cancel timers and requests on unmount. */
  useEffect(() => () => {
    window.clearTimeout(timer.current)
    inflight.current?.abort()
  }, [])

  /* A click or tap outside closes the suggestions. */
  useEffect(() => {
    if (!open || size === 'sheet') return
    function onPointer(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActive(-1)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, size])

  /* Keep the active suggestion visible inside the scrolling list. */
  useEffect(() => {
    if (active >= 0) document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, uid])

  const run = useCallback(async (q: string) => {
    inflight.current?.abort()
    const ctrl = new AbortController()
    inflight.current = ctrl
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(q)}&limit=${PER_GROUP}`, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`Search answered ${res.status}`)
      const parsed = readResponse(await res.json())
      if (!parsed) throw new Error('Unexpected search response')
      remember(q.toLowerCase(), parsed)
      if (latest.current !== q) return
      setData(parsed)
      setStatus(parsed.total > 0 ? 'results' : 'empty')
    } catch {
      if (ctrl.signal.aborted || latest.current !== q) return
      setData(null)
      setStatus('error')
    } finally {
      if (inflight.current === ctrl) inflight.current = null
    }
  }, [])

  /* Debounced lookup for the current text (cached answers show at once). */
  const lookup = useCallback((raw: string) => {
    const q = raw.trim().slice(0, MAX_CHARS)
    latest.current = q
    window.clearTimeout(timer.current)
    setActive(-1)
    if (q.length < MIN_CHARS) {
      inflight.current?.abort()
      setStatus('idle')
      setData(null)
      setOpen(false)
      return
    }
    setOpen(true)
    const hit = cache.get(q.toLowerCase())
    if (hit) {
      inflight.current?.abort()
      setData(hit)
      setStatus(hit.total > 0 ? 'results' : 'empty')
      return
    }
    /* Keep the previous suggestions on screen while the next ones load. */
    setStatus('loading')
    timer.current = window.setTimeout(() => { void run(q) }, DEBOUNCE_MS)
  }, [run])

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    lookup(e.target.value)
  }

  function close(blur = false) {
    setOpen(false)
    setActive(-1)
    if (blur) inputRef.current?.blur()
  }

  function clear() {
    setValue('')
    lookup('')
    inputRef.current?.focus()
  }

  function picked() {
    close()
    onNavigate?.()
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        if (!listShown) {
          if (term.length >= MIN_CHARS) {
            e.preventDefault()
            if (data) setOpen(true)
            else lookup(value)
          }
          return
        }
        e.preventDefault()
        const step = e.key === 'ArrowDown' ? 1 : -1
        setActive(i => (i < 0 ? (step === 1 ? 0 : optionCount - 1) : (i + step + optionCount) % optionCount))
        return
      }
      case 'Home':
      case 'End':
        if (!listShown || active < 0) return
        e.preventDefault()
        setActive(e.key === 'Home' ? 0 : optionCount - 1)
        return
      case 'Enter':
        if (listShown && active >= 0) {
          e.preventDefault()
          document.getElementById(optionId(active))?.click()
        }
        return
      case 'Escape':
        /* In the sheet, Esc belongs to the dialog (it closes the sheet). */
        if (size === 'sheet') return
        if (open || document.activeElement === inputRef.current) {
          e.preventDefault()
          close(true)
        }
        return
      case 'Tab':
        if (open) close()
        return
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (!term) {
      e.preventDefault()
      inputRef.current?.focus()
      return
    }
    window.clearTimeout(timer.current)
    inflight.current?.abort()
    picked()
  }

  function onFocus() {
    if (term.length >= MIN_CHARS && data && latest.current === term) setOpen(true)
  }

  /* What the polite live region announces. */
  const announcement = status === 'results' && listShown
    ? `${hits.length} ${hits.length === 1 ? 'suggestion' : 'suggestions'}. Use the up and down arrow keys to browse.`
    : status === 'empty' && panelShown ? EMPTY_TEXT
      : status === 'error' && panelShown ? ERROR_TEXT : ''

  const field = (
    <form
      ref={formRef}
      className="dv-search-form"
      action="/search"
      method="get"
      role="search"
      aria-label={size === 'bar' ? 'Developer hub' : 'Developer hub search'}
      onSubmit={onSubmit}
    >
      <div className="dv-search-field">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="dv-search-icon" aria-hidden="true" />
        <label htmlFor={inputId} className="sr-only">{label}</label>
        <input
          ref={inputRef}
          id={inputId}
          className="dv-search-input"
          type="search"
          name="q"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder ?? DEFAULT_PLACEHOLDER[size]}
          maxLength={MAX_CHARS}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={listShown}
          aria-controls={listId}
          aria-activedescendant={listShown && active >= 0 ? optionId(active) : undefined}
          aria-keyshortcuts={size === 'sheet' ? undefined : '/'}
        />
        {value ? (
          <button type="button" className="dv-search-clear" onClick={clear} aria-label="Clear search">
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        ) : size !== 'sheet' ? (
          <span className="dv-search-hint" aria-hidden="true"><kbd>/</kbd></span>
        ) : null}
        <button type="submit" className="dv-search-submit">Search</button>
      </div>

      <div className={`dv-search-list${panelShown ? '' : ' dv-search-list--closed'}`} hidden={!panelShown}>
        {status === 'loading' && !data && (
          <div className="dv-search-loading" aria-hidden="true"><DvSkeleton variant="rows" count={3} /></div>
        )}
        {status === 'empty' && <p className="dv-search-status">{EMPTY_TEXT}</p>}
        {status === 'error' && <p className="dv-search-status dv-search-status--error">{ERROR_TEXT}</p>}
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          aria-busy={status === 'loading' ? true : undefined}
          className={`dv-search-groups${status === 'loading' ? ' dv-search-groups--busy' : ''}`}
          hidden={!(hits.length > 0 && (status === 'results' || status === 'loading'))}
        >
          {groups.map(g => {
            const gid = `${uid}-g-${g.key}`
            return (
              <div key={g.key} role="group" aria-labelledby={gid} className="dv-search-group">
                <span id={gid} className="dv-label dv-search-group-label">{g.label}</span>
                {g.hits.map((hit, hi) => {
                  const i = g.start + hi
                  return (
                    <a
                      key={`${hit.kind}:${hit.href}`}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      tabIndex={-1}
                      href={hit.href}
                      className="dv-search-option"
                      {...(hit.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onMouseMove={() => { if (i !== active) setActive(i) }}
                      onClick={picked}
                    >
                      <OptionMedia hit={hit} />
                      <span className="dv-search-opt-text">
                        <span className="dv-search-opt-label">
                          {hit.mono ? <code>{highlight(hit.label, term)}</code> : highlight(hit.label, term)}
                          {hit.external && (
                            <>
                              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dv-search-opt-ext" aria-hidden="true" />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </>
                          )}
                        </span>
                        {hit.sub && <span className="dv-search-opt-sub">{hit.sub}</span>}
                      </span>
                      {hit.meta && <span className="dv-search-opt-meta">{hit.meta}</span>}
                    </a>
                  )
                })}
              </div>
            )
          })}
          {hits.length > 0 && (
            <div className="dv-search-all" role="none">
              <a
                id={optionId(hits.length)}
                role="option"
                aria-selected={active === hits.length}
                tabIndex={-1}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="dv-search-option"
                onMouseMove={() => { if (active !== hits.length) setActive(hits.length) }}
                onClick={picked}
              >
                <span className="dv-search-opt-media" aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></span>
                <span className="dv-search-opt-text">
                  <span className="dv-search-opt-label">See all results for &ldquo;{term}&rdquo;</span>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    </form>
  )

  return (
    <div ref={rootRef} className={`dv-search dv-search--${size}${className ? ` ${className}` : ''}`}>
      {field}
      {size === 'bar' && (
        <>
          <button
            ref={triggerRef}
            type="button"
            className="dv-search-trigger"
            aria-label="Search the developer hub"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
          </button>
          <SearchSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            returnFocusRef={triggerRef}
            tip="Try a company, a repository, an API or a language like go."
          >
            <DvSearchBox size="sheet" onNavigate={() => setSheetOpen(false)} />
          </SearchSheet>
        </>
      )}
    </div>
  )
}
