'use client'
import { useId, useState } from 'react'
import type { PagesReport } from '@/lib/analytics/types'
import { useReport } from '../../_lib/report'

/* Path picker used by Journeys (anchor page) and the funnel builder (page
   steps): a text input with the 50 most viewed paths of the period as
   native suggestions (<datalist> - keyboard, screen-reader and mobile
   friendly for free). The value is committed on Enter, on blur, or as soon
   as a suggestion is picked, never on every keystroke - each commit can
   start a report request. */

/** The most viewed paths in the current range + filters (shared, cached request). */
export function usePathSuggestions(enabled = true): { path: string; title: string | null }[] {
  const r = useReport<PagesReport>('pages', { group: 'path', limit: 50, sort: 'views', dir: 'desc' }, { enabled })
  return (r.data?.rows ?? []).map(row => ({ path: row.path, title: row.title }))
}

export function PathInput({ value, onCommit, label, placeholder = '/saas-directory', suggestions, className, id }: {
  value: string
  onCommit: (path: string) => void
  /** Accessible name. */
  label: string
  placeholder?: string
  suggestions: { path: string; title: string | null }[]
  className?: string
  id?: string
}) {
  const listId = useId()
  const [text, setText] = useState(value)
  const [synced, setSynced] = useState(value)
  // Follow outside changes (back button, clicking a node) without clobbering typing.
  if (value !== synced) { setSynced(value); setText(value) }

  const commit = (v: string) => {
    let p = v.trim()
    if (!p) { setText(value); return }
    // Accept a pasted full URL: keep only its path.
    if (/^https?:\/\//i.test(p)) {
      try { p = new URL(p).pathname } catch { /* keep as typed */ }
    }
    if (!p.startsWith('/')) p = '/' + p
    p = p.replace(/[?#].*$/, '').replace(/\/{2,}/g, '/')
    if (p.length > 1) p = p.replace(/\/+$/, '')
    setText(p)
    if (p !== value) onCommit(p)
  }

  return (
    <>
      <input
        id={id}
        type="text"
        className={'an-input an-pathinput ' + (className ?? '')}
        value={text}
        list={listId}
        placeholder={placeholder}
        aria-label={label}
        spellCheck={false}
        autoComplete="off"
        onChange={e => {
          const v = e.target.value
          setText(v)
          /* Picking a suggestion fires a change with the exact option value and
             no typing inputType (Chrome/Firefox: insertReplacementText, Safari:
             none). Typed text that happens to equal a path ("/") must not commit. */
          const kind = (e.nativeEvent as InputEvent).inputType
          if ((!kind || kind === 'insertReplacementText') && suggestions.some(s => s.path === v)) commit(v)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(text) }
          if (e.key === 'Escape') setText(value)
        }}
        onBlur={() => commit(text)}
      />
      <datalist id={listId}>
        {suggestions.map(s => (
          <option key={s.path} value={s.path}>{s.title ?? s.path}</option>
        ))}
      </datalist>
    </>
  )
}
