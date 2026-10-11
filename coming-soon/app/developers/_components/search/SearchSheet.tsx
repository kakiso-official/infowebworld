'use client'

import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Full-screen search sheet for phones (spec 4.12): a real modal <dialog>
   opened by the sub-nav's 44x44 search button at <= 768px.

   - showModal() makes the page behind it inert; Esc (the dialog's own
     cancel) and the 44px close button close it.
   - The search input is focused on open; on close focus returns to the
     trigger and the page scroll lock is released.
   - The search box arrives as `children` (DvSearchBox size="sheet"), so
     this file does not import the search box (no module cycle). It is
     mounted only while open, so every opening starts fresh.
   ═══════════════════════════════════════════════════════════════════════ */

export interface SearchSheetProps {
  open: boolean
  onClose: () => void
  /** Element that opened the sheet; focus returns to it on close. */
  returnFocusRef?: RefObject<HTMLElement | null>
  title?: string
  /** Muted line under the search box. */
  tip?: ReactNode
  children: ReactNode
}

export default function SearchSheet({
  open, onClose, returnFocusRef, title = 'Search the developer hub', tip, children,
}: SearchSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const prevOverflow = useRef<string | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      /* The page behind must not scroll under the sheet (iOS ignores the
         modal's inertness for scrolling). */
      prevOverflow.current = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      /* showModal() focuses the first focusable element (the close
         button); the search input is what the visitor wants. */
      dialog.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  /* Never leave the page locked if the sheet unmounts while open. */
  useEffect(() => () => {
    if (prevOverflow.current !== null) document.documentElement.style.overflow = prevOverflow.current
  }, [])

  function handleClose() {
    if (prevOverflow.current !== null) {
      document.documentElement.style.overflow = prevOverflow.current
      prevOverflow.current = null
    }
    onClose()
    returnFocusRef?.current?.focus()
  }

  return (
    <dialog ref={ref} className="dv-search-sheet" aria-labelledby={titleId} onClose={handleClose}>
      <div className="dv-search-sheet-head">
        <h2 id={titleId} className="dv-search-sheet-title">{title}</h2>
        <button type="button" className="dv-sheet-close" aria-label="Close search" onClick={() => ref.current?.close()}>
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </button>
      </div>
      <div className="dv-search-sheet-body">
        {open && children}
        {tip && <p className="dv-search-sheet-tip">{tip}</p>}
      </div>
    </dialog>
  )
}
