'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Copy button (spec 4.10). Copies the exact `text` prop - never DOM text,
   so a '$' prompt or highlighting spans can never end up on the
   clipboard. Clipboard API first, then a hidden-textarea fallback for
   older browsers and non-secure contexts.

   States: idle ("Copy") -> copied ("Copied", 1.6s) -> idle; on failure
   it asks for Ctrl+C. A polite live region announces the result.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CopyButtonProps {
  /** Exact text to copy. */
  text: string
  /** Visible label (default 'Copy'). */
  label?: string
  /** 'dark' on code strips and navy, 'light' on white. */
  tone?: 'dark' | 'light'
  /** Icon only, with `srLabel` as its accessible name. */
  iconOnly?: boolean
  /** What is being copied, for screen readers ('Copy install command'). */
  srLabel?: string
  className?: string
}

type CopyState = 'idle' | 'copied' | 'error'

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the textarea fallback */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function CopyButton({
  text, label = 'Copy', tone = 'dark', iconOnly = false, srLabel, className,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  async function onClick() {
    const ok = await writeClipboard(text)
    setState(ok ? 'copied' : 'error')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), ok ? 1600 : 4000)
  }

  const visible = state === 'copied' ? 'Copied' : state === 'error' ? 'Press Ctrl+C' : label
  const name = srLabel ?? label

  return (
    <>
      <button
        type="button"
        className={`dv-copy dv-copy--${tone}${iconOnly ? ' dv-copy--icon' : ''}${className ? ` ${className}` : ''}`}
        data-state={state}
        onClick={onClick}
        aria-label={iconOnly || srLabel ? name : undefined}
        title={iconOnly ? name : undefined}
      >
        <FontAwesomeIcon icon={state === 'copied' ? faCheck : faCopy} aria-hidden="true" />
        {!iconOnly && <span aria-hidden={srLabel ? true : undefined}>{visible}</span>}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied' ? 'Copied to clipboard' : state === 'error' ? 'Could not copy. Select the text and press Ctrl+C.' : ''}
      </span>
    </>
  )
}
