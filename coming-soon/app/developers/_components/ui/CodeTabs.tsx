'use client'

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import CopyButton from './CopyButton'

/* ═══════════════════════════════════════════════════════════════════════
   Code tabs (spec 4.8, 4.10): cURL / JavaScript / Python for the Quick
   start, inside one dark code frame with a single Copy button for the
   active tab.

   The highlighted code arrives pre-rendered from the server (`content`),
   so no highlighter ships to the browser; use <SnippetTabs> from
   CodeBlock.tsx, which builds the tabs from lib/developers/snippets.ts.

   All panels are in the server HTML. Inactive ones carry `hidden`; with
   JS off a <noscript> style shows every panel under its own caption.
   The chosen language is shared with SdkTabs through localStorage
   'dv:lang' and a same-page 'dv:lang' event (useSharedLang below).
   ═══════════════════════════════════════════════════════════════════════ */

export const DV_LANG_KEY = 'dv:lang'
const DV_LANG_EVENT = 'dv:lang'

function readStoredLang(): string | null {
  try {
    return window.localStorage.getItem(DV_LANG_KEY)
  } catch {
    return null
  }
}

function storeLang(id: string) {
  try {
    window.localStorage.setItem(DV_LANG_KEY, id)
  } catch {
    /* private mode or blocked storage: the choice just is not remembered */
  }
  window.dispatchEvent(new CustomEvent<string>(DV_LANG_EVENT, { detail: id }))
}

/** Selected tab id shared across CodeTabs/SdkTabs on the page and across
 *  visits. Starts at `fallback` (so server and first client render
 *  match), then adopts the stored choice when it is one of `ids`. */
export function useSharedLang(ids: readonly string[], fallback: string): [string, (id: string) => void] {
  const [selected, setSelected] = useState(fallback)
  const idsKey = ids.join('|')

  useEffect(() => {
    const known = idsKey.split('|')
    const stored = readStoredLang()
    /* Adopt the remembered language once, after hydration (localStorage
       is not readable during the server render). */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && known.includes(stored)) setSelected(stored)
    function onLang(e: Event) {
      const id = (e as CustomEvent<string>).detail
      if (known.includes(id)) setSelected(id)
    }
    window.addEventListener(DV_LANG_EVENT, onLang)
    return () => window.removeEventListener(DV_LANG_EVENT, onLang)
  }, [idsKey])

  const choose = useCallback((id: string) => {
    setSelected(id)
    storeLang(id)
  }, [])

  return [selected, choose]
}

export interface CodeTab {
  /** Stable id; also the shared language key ('curl', 'javascript', 'python'). */
  id: string
  label: string
  /** Exact text the Copy button copies for this tab. */
  copy: string
  /** Highlighted lines, rendered on the server. */
  content: ReactNode
}

export interface CodeTabsProps {
  tabs: readonly CodeTab[]
  /** Accessible name of the tab list ('Quick start request'). */
  label: string
  /** Share the selection via localStorage 'dv:lang' (default true). */
  shared?: boolean
  /** Muted line under the code (e.g. the sample description). */
  note?: ReactNode
  className?: string
}

const NOSCRIPT_CSS =
  '.dv .dv-codetabs-panel[hidden]{display:block}.dv .dv-codetabs-caption{display:block}' +
  '.dv .dv-codetabs-list,.dv .dv-copy{display:none}'

export default function CodeTabs({ tabs, label, shared = true, note, className }: CodeTabsProps) {
  const base = useId()
  const ids = tabs.map(t => t.id)
  const [sharedSel, chooseShared] = useSharedLang(ids, ids[0] ?? '')
  const [localSel, setLocalSel] = useState(ids[0] ?? '')
  const selected = shared ? sharedSel : localSel
  const choose = shared ? chooseShared : setLocalSel
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  if (!tabs.length) return null
  const active = tabs.find(t => t.id === selected) ?? tabs[0]

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    choose(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <figure className={`dv-code dv-codetabs${className ? ` ${className}` : ''}`}>
      <noscript><style>{NOSCRIPT_CSS}</style></noscript>
      <figcaption className="dv-code-bar">
        <div className="dv-codetabs-list" role="tablist" aria-label={label}>
          {tabs.map((t, i) => {
            const isActive = t.id === active.id
            return (
              <button
                key={t.id}
                ref={el => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`${base}-tab-${t.id}`}
                aria-selected={isActive}
                aria-controls={`${base}-panel-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                className="dv-codetab"
                onClick={() => choose(t.id)}
                onKeyDown={e => onKeyDown(e, i)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
        <CopyButton text={active.copy} tone="dark" srLabel={`Copy the ${active.label} code`} />
      </figcaption>
      {tabs.map(t => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          className="dv-codetabs-panel"
          hidden={t.id !== active.id}
        >
          <div className="dv-codetabs-caption" aria-hidden="true">{t.label}</div>
          <pre className="dv-code-pre" tabIndex={0} role="region" aria-label={`Code: ${t.label}`}>
            <code>{t.content}</code>
          </pre>
        </div>
      ))}
      {note && <div className="dv-code-note">{note}</div>}
    </figure>
  )
}
