import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   Source note, the last block of every page (spec 3.0): two plain
   sentences on where the data comes from and how it was checked, the MIT
   attribution on free-API pages, and a corrections link.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvSourceNoteProps {
  /** Two plain sentences on source and method. */
  children: ReactNode
  /** Add the public-apis MIT attribution (every free-API page). */
  mit?: boolean
  className?: string
}

export default function DvSourceNote({ children, mit = false, className }: DvSourceNoteProps) {
  return (
    <aside className={`dv-source${className ? ` ${className}` : ''}`} aria-label="About this data">
      <div className="dv-source-inner">
        <FontAwesomeIcon icon={faCircleInfo} className="dv-source-icon" aria-hidden="true" />
        <div className="dv-source-text">
          <p>{children}</p>
          {mit && (
            <p>
              Base list from{' '}
              <DvExternalLink href="https://github.com/public-apis/public-apis">public-apis/public-apis</DvExternalLink>
              {' '}on GitHub, MIT License, Copyright (c) 2022 public-apis.
            </p>
          )}
          <p>
            Spotted a mistake? <a href="/contact">Tell us</a>.
          </p>
        </div>
      </div>
    </aside>
  )
}
