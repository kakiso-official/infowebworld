'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* ═══════════════════════════════════════════════════════════════════════
   Tabs (spec 4.8): WAI-ARIA tabs with a roving tabindex (Left/Right/Home/
   End move and select). Every panel is rendered on the server, so all the
   content is in the HTML; inactive panels carry `hidden` (no layout shift
   on hydration). Without JS a <noscript> style shows every panel under
   its own caption and hides the tab row.

     tone="light"  underline tabs on white or wash bands
     tone="navy"   pills on the navy band (selected = white pill)

   Server components pass the panels as `content` (any JSX).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvTab {
  /** Stable id, unique within this tab set ('typescript'). */
  id: string
  label: string
  /** Small number after the label (omitted when 0 or missing). */
  count?: number
  icon?: IconDefinition
  content: ReactNode
}

export interface DvTabsProps {
  tabs: readonly DvTab[]
  /** Accessible name of the tab list ('Most-starred projects by language'). */
  label: string
  tone?: 'light' | 'navy'
  /** Id of the tab selected first (default: the first tab). */
  defaultTab?: string
  className?: string
}

const NOSCRIPT_CSS =
  '.dv .dv-tabs .dv-tabpanel[hidden]{display:block}.dv .dv-tabs .dv-tabpanel-caption{display:block}' +
  '.dv .dv-tabs .dv-tablist{display:none}.dv .dv-tabs .dv-tabpanel+.dv-tabpanel{margin-top:32px}'

export default function DvTabs({ tabs, label, tone = 'light', defaultTab, className }: DvTabsProps) {
  const base = useId()
  const first = tabs.find(t => t.id === defaultTab)?.id ?? tabs[0]?.id ?? ''
  const [selected, setSelected] = useState(first)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  if (!tabs.length) return null
  const activeId = tabs.some(t => t.id === selected) ? selected : tabs[0].id

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    setSelected(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className={`dv-tabs dv-tabs--${tone}${className ? ` ${className}` : ''}`}>
      <noscript><style>{NOSCRIPT_CSS}</style></noscript>
      <div className="dv-tablist" role="tablist" aria-label={label}>
        {tabs.map((t, i) => {
          const isActive = t.id === activeId
          return (
            <button
              key={t.id}
              ref={el => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={isActive ? 0 : -1}
              className="dv-tab"
              onClick={() => setSelected(t.id)}
              onKeyDown={e => onKeyDown(e, i)}
            >
              {t.icon && <FontAwesomeIcon icon={t.icon} aria-hidden="true" />}
              {t.label}
              {!!t.count && <span className="dv-tab-count">{t.count.toLocaleString('en-US')}</span>}
            </button>
          )
        })}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          tabIndex={0}
          className="dv-tabpanel"
          hidden={t.id !== activeId}
        >
          <h3 className="dv-tabpanel-caption dv-h3">{t.label}</h3>
          {t.content}
        </div>
      ))}
    </div>
  )
}
