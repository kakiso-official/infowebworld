import type { ReactNode } from 'react'
import { tokenizeLines, type HighlightLang } from '@/lib/developers/highlight'
import CopyButton from './CopyButton'
import CodeTabs from './CodeTabs'

/* ═══════════════════════════════════════════════════════════════════════
   Code blocks (spec 4.10), highlighted on the server.

     <CodeBlock code="git clone https://github.com/stripe/stripe-node.git" lang="shell" />
     <SnippetTabs snippets={buildSnippets(sample, check)} label="Quick start request" />

   The strip shows a language label and a Copy button that copies the raw
   `copy` text (never DOM text). Shell lines get a '$' prompt that is
   aria-hidden and unselectable. The <pre> is focusable so keyboard users
   can scroll long lines; on phones lines wrap instead.
   ═══════════════════════════════════════════════════════════════════════ */

const DEFAULT_LABEL: Record<HighlightLang, string> = {
  shell: 'bash',
  js: 'JavaScript',
  python: 'Python',
  json: 'JSON',
}

/* A shell line that is a command (not a comment, not blank, not the
   continuation of a previous line ending in '\'). */
function promptLines(code: string): boolean[] {
  const lines = code.split('\n')
  return lines.map((line, i) => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return false
    const prev = i > 0 ? lines[i - 1].trimEnd() : ''
    return !prev.endsWith('\\')
  })
}

export interface CodeLinesProps {
  code: string
  lang: HighlightLang
  /** '$' before each command line (shell only; default true for shell). */
  prompt?: boolean
}

/** Highlighted token spans for `code`, line by line (put inside <pre><code>). */
export function CodeLines({ code, lang, prompt }: CodeLinesProps) {
  const lines = tokenizeLines(code, lang)
  const withPrompt = (prompt ?? lang === 'shell') && lang === 'shell' ? promptLines(code) : null
  return (
    <>
      {lines.map((tokens, i) => (
        <span key={i} className="dv-code-line">
          {i > 0 && '\n'}
          {withPrompt?.[i] && <span className="dv-prompt" aria-hidden="true">$</span>}
          {tokens.map((t, j) => (t.cls ? <span key={j} className={t.cls}>{t.text}</span> : t.text))}
        </span>
      ))}
    </>
  )
}

export interface CodeBlockProps {
  code: string
  lang: HighlightLang
  /** Strip label ('bash', 'build.gradle.kts'); defaults by language. */
  label?: string
  /** Text the Copy button copies (defaults to `code`). */
  copy?: string
  /** '$' prompt on shell command lines (default true for shell). */
  prompt?: boolean
  /** Muted line under the code. */
  note?: ReactNode
  /** Hide the copy button (static recorded output). */
  copyable?: boolean
  compact?: boolean
  className?: string
}

export default function CodeBlock({
  code, lang, label, copy, prompt, note, copyable = true, compact = false, className,
}: CodeBlockProps) {
  const name = label ?? DEFAULT_LABEL[lang]
  return (
    <figure className={`dv-code${compact ? ' dv-code--compact' : ''}${className ? ` ${className}` : ''}`}>
      <figcaption className="dv-code-bar">
        <span className="dv-code-label">{name}</span>
        {copyable && <CopyButton text={copy ?? code} tone="dark" srLabel={`Copy the ${name} code`} />}
      </figcaption>
      <pre className="dv-code-pre" tabIndex={0} role="region" aria-label={`Code: ${name}`}>
        <code><CodeLines code={code} lang={lang} prompt={prompt} /></code>
      </pre>
      {note && <div className="dv-code-note">{note}</div>}
    </figure>
  )
}

export interface SnippetTabsProps {
  /** Snippets from lib/developers/snippets.ts buildSnippets() (or any
   *  {id, label, lang, code} list). Renders nothing when empty. */
  snippets: ReadonlyArray<{ id: string; label: string; lang: HighlightLang; code: string }>
  /** Accessible name of the tab list. */
  label: string
  note?: ReactNode
  /** Share the chosen language via localStorage 'dv:lang' (default true). */
  shared?: boolean
  className?: string
}

/** Server wrapper: highlights every snippet here, then hands the ready
 *  panels to the CodeTabs client island. */
export function SnippetTabs({ snippets, label, note, shared = true, className }: SnippetTabsProps) {
  if (!snippets.length) return null
  if (snippets.length === 1) {
    const s = snippets[0]
    return <CodeBlock code={s.code} lang={s.lang} label={s.label} note={note} className={className} />
  }
  return (
    <CodeTabs
      label={label}
      note={note}
      shared={shared}
      className={className}
      tabs={snippets.map(s => ({
        id: s.id,
        label: s.label,
        copy: s.code,
        content: <CodeLines code={s.code} lang={s.lang} />,
      }))}
    />
  )
}
