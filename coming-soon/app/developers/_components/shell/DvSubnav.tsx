'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { devHubPath, freeApisPath, ossHubPath } from '@/lib/developers/paths'
import DvSearchBox from '../search/DvSearchBox'

/* ═══════════════════════════════════════════════════════════════════════
   Section sub-navigation (spec 2.5), rendered once by the layout:

   [</> Developers] Overview  Open Source  Free APIs          [ Search / ]

   Demo build: only the pages that actually exist are linked (the full
   section also has companies/languages/good-first-issues/collections/sdk
   index pages per the design spec; they are not built here, so they are
   left out of the nav rather than 404ing). Re-add them once those pages
   ship.

   - 52px, sticky at top 0 with z-index 40: under the site header (z 60),
     so it shows when the header slides away and is covered when it comes
     back. No gap, no double bar.
   - Plain <a> links. The current item is the longest-prefix match of the
     pathname: aria-current="page" on its own page, "true" on a page inside
     its section (both get the 2px brand underline).
   - First link: "Skip to content" (#dv-content, the <main> after this nav).
   - <= 979 the links scroll sideways inside themselves with fade masks on
     the side that has more; the current item is scrolled into view on
     mount. <= 768 the search box becomes a 44x44 button that opens the
     full-screen search sheet.
   ═══════════════════════════════════════════════════════════════════════ */

interface SubnavLink {
  label: string
  href: string
  /** Match only the exact path, never as a prefix (the hub itself). */
  exact?: boolean
}

const GROUPS: ReadonlyArray<readonly SubnavLink[]> = [
  [
    { label: 'Overview', href: devHubPath(), exact: true },
    { label: 'Open Source', href: ossHubPath() },
    { label: 'Free APIs', href: freeApisPath() },
  ],
]

type Current = { href: string; kind: 'page' | 'true' } | null

/* Longest-prefix match: an exact path beats any prefix, a longer prefix
   beats a shorter one, and prefixes only match on a '/' boundary. */
function currentLink(pathname: string): Current {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  let best: Current = null
  let bestScore = -1
  for (const group of GROUPS) {
    for (const link of group) {
      let score = -1
      if (path === link.href) score = 10000
      else if (!link.exact && path.startsWith(`${link.href}/`)) score = link.href.length
      if (score > bestScore) {
        bestScore = score
        best = { href: link.href, kind: score === 10000 ? 'page' : 'true' }
      }
    }
  }
  return bestScore >= 0 ? best : null
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function DvSubnav() {
  const pathname = usePathname() || devHubPath()
  const current = currentLink(pathname)
  const scrollRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  /* Fade masks only on the side that has more links (CSS reads data-fade). */
  useEffect(() => {
    const list = listRef.current
    const wrap = scrollRef.current
    if (!list || !wrap) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = list.scrollWidth - list.clientWidth
      const fade = [list.scrollLeft > 2 ? 'l' : '', list.scrollLeft < max - 2 ? 'r' : ''].filter(Boolean).join(' ')
      if (wrap.getAttribute('data-fade') !== fade) wrap.setAttribute('data-fade', fade)
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    list.addEventListener('scroll', schedule, { passive: true })
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null
    ro?.observe(list)
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      list.removeEventListener('scroll', schedule)
      ro?.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [])

  /* Bring the current item into view when the links scroll (phones).
     Scrolls only the link strip, never the page. */
  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector<HTMLElement>('[aria-current]')
    if (!list || !item || list.scrollWidth <= list.clientWidth) return
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
  }, [pathname])

  return (
    <nav className="dv-subnav" aria-label="Developers">
      <a className="dv-skip" href="#dv-content">Skip to content</a>
      <div className="dv-subnav-inner">
        <a className="dv-subnav-brand" href={devHubPath()} aria-label="InfoWebWorld for Developers">
          <span className="dv-subnav-mark" aria-hidden="true"><FontAwesomeIcon icon={faCode} /></span>
          <span className="dv-subnav-brand-text">Developers</span>
        </a>
        <div className="dv-subnav-scroll" ref={scrollRef}>
          <ul className="dv-subnav-links" ref={listRef}>
            {GROUPS.map((group, gi) => [
              gi > 0 && <li key={`sep-${gi}`} className="dv-subnav-sep" aria-hidden="true" />,
              ...group.map(link => (
                <li key={link.href}>
                  <a
                    className="dv-subnav-link"
                    href={link.href}
                    aria-current={current?.href === link.href ? current.kind : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              )),
            ])}
          </ul>
        </div>
        <div className="dv-subnav-search">
          <DvSearchBox size="bar" label="Search the developer hub" />
        </div>
      </div>
    </nav>
  )
}
