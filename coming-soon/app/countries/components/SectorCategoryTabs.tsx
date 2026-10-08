'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { SECTOR_UI } from './sector-ui'

/* ═══════════════════════════════════════════════════════════════════════
   Country hub "Browse {Country} Businesses by Sector" - the homepage's
   "Top Featured Businesses" pattern (dark .tlp-firms band, one tab per
   sector, white cards, CTA) with the sector's top categories in this
   country as the cards:

     tab    one per sector with listings here, biggest first, with its count
     cards  the sector's top categories here → the category page filtered
            to this country (?country=)
     CTA    the sector's page in this country

   Every panel is in the server HTML (inactive ones carry `hidden`), so all
   category and sector links stay crawlable; the tabs only switch which
   panel shows. Keyboard: arrow keys / Home / End move between tabs.
   ═══════════════════════════════════════════════════════════════════════ */

export type SectorTabCategory = { id: number; name: string; listings: number; href: string }

export type SectorTab = {
  sector: string
  /** Tab label - the official sector name ('Professional Services'). */
  label: string
  listings: number
  /** The sector's page in this country. */
  href: string
  cta: string
  categories: SectorTabCategory[]
  /** Shown instead of the cards when the sector has none to show. */
  emptyText: string
}

function listingsLabel(n: number): string {
  return `${n.toLocaleString('en-US')} listing${n === 1 ? '' : 's'}`
}

export default function SectorCategoryTabs({
  id, title, sub, tabs,
}: {
  id: string
  title: string
  sub: string
  tabs: SectorTab[]
}) {
  const [active, setActive] = useState(tabs[0]?.sector ?? '')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (tabs.length === 0) return null

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1
    const next =
      e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1
    if (next < 0) return
    e.preventDefault()
    setActive(tabs[next].sector)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id={id} className="tlp-firms cdir-tabs" aria-labelledby={`${id}-h`}>
      <div className="tlp-firms-inner">
        <header className="tlp-firms-head">
          <h2 id={`${id}-h`} className="tlp-firms-title">{title}</h2>
          <p className="tlp-firms-sub">{sub}</p>
        </header>

        <div className="tlp-firms-tabs" role="tablist" aria-label="Sectors">
          {tabs.map((t, i) => {
            const on = active === t.sector
            return (
              <button
                key={t.sector}
                ref={el => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`${id}-tab-${t.sector}`}
                aria-selected={on}
                aria-controls={`${id}-panel-${t.sector}`}
                tabIndex={on ? 0 : -1}
                className={'tlp-firms-tab cdir-tab' + (on ? ' is-on' : '')}
                onClick={() => setActive(t.sector)}
                onKeyDown={e => onKeyDown(e, i)}
              >
                <span>{t.label}</span>
                <span className="cdir-tab-n">
                  {t.listings.toLocaleString('en-US')}
                  <span className="cdir-sr"> {t.listings === 1 ? 'listing' : 'listings'}</span>
                </span>
              </button>
            )
          })}
        </div>

        {tabs.map(t => {
          const ui = SECTOR_UI[t.sector]
          return (
            <div
              key={t.sector}
              id={`${id}-panel-${t.sector}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${t.sector}`}
              hidden={active !== t.sector}
            >
              {t.categories.length > 0 ? (
                <ul className={'tlp-firms-grid cdir-tabs-grid' + (t.categories.length < 3 ? ' cdir-tabs-grid--few' : '')}>
                  {t.categories.map(c => (
                    <li key={c.id} className="cdir-tabs-li">
                      <Link href={c.href} className="cdir-tabs-card">
                        {ui && (
                          <span
                            className="cdir-tabs-ico"
                            style={{ background: `${ui.accent}1F`, color: ui.accent }}
                            aria-hidden="true"
                          >
                            <FontAwesomeIcon icon={ui.icon} />
                          </span>
                        )}
                        <span className="cdir-tabs-body">
                          <h3 className="cdir-tabs-name">{c.name}</h3>
                          <span className="cdir-tabs-count">{listingsLabel(c.listings)}</span>
                        </span>
                        <span className="cdir-tabs-arrow" aria-hidden="true">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tlp-firms-empty">{t.emptyText}</p>
              )}

              <div className="tlp-firms-cta">
                <Link href={t.href} className="tlp-firms-cta-btn cdir-tabs-cta">
                  <span>{t.cta}</span>
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
