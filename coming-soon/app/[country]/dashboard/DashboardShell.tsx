'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BASE } from '../../config/base-path'
import { countryHref } from '../../config/countries'
import { I, ic, type IconKey } from '../../components/icons'
import { SECTIONS, FEATURES, unlockedBySection } from './features'
import type { UserPlan } from '@/lib/user-plan-types'

interface ShellUser {
  uuid: string; email: string; name: string | null
  avatarUrl: string | null; provider: string
}

interface Props {
  country: string
  user: ShellUser
  plan: UserPlan
  children: React.ReactNode
}

const PLAN_CHIP_CLASS: Record<string, string> = {
  lifetime: 'ds-plan-chip--lifetime',
  yearly:   'ds-plan-chip--yearly',
  starter:  'ds-plan-chip--starter',
  free:     'ds-plan-chip--free',
}

const SECTION_ICON: Record<string, IconKey> = {
  listing:   'building',
  discovery: 'search',
  leads:     'messageCircle',
  reviews:   'star',
  community: 'users',
  analytics: 'barChart',
  support:   'helpCircle',
}

type NavRow = {
  key: string
  href: string
  label: string
  icon: IconKey
  sectionKey?: string  // when set, "active" matches any feature in that section
  locked?: boolean     // when true, render faded with a lock glyph
}

type NavGroup = { label: string; rows: NavRow[] }

/**
 * Dashboard sidebar — flat list modeled after the admin AdminShell:
 *   logo → single vertical nav (icon + label on each row) → logout.
 *   No grouping labels, no pills. Active row is a soft coral pill.
 *   Light theme; locked feature sections show a lock on the right.
 */
export default function DashboardShell({ country, user, plan, children }: Props) {
  const pathname = usePathname() || ''
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const base = countryHref(country, '/dashboard')
  const homeHref = countryHref(country)
  const unlocked = useMemo(() => unlockedBySection(plan.tier), [plan.tier])

  /** Grouped nav: Overview / Features / Account, each with a header. */
  const navGroups: NavGroup[] = useMemo(() => {
    const overview: NavRow[] = [
      { key: 'dashboard', href: base,              label: 'Dashboard',   icon: 'grid'   },
      { key: 'listings',  href: `${base}/listings`, label: 'My Listings', icon: 'layers' },
      { key: 'new',       href: `${base}/new`,      label: 'New Listing', icon: 'plus'   },
    ]
    const features: NavRow[] = SECTIONS.map(sec => {
      const stat = unlocked[sec.key] || { unlocked: 0, total: 0 }
      return {
        key: `sec-${sec.key}`,
        href: `${base}/section/${sec.key}`,
        label: sec.title,
        icon: SECTION_ICON[sec.key] || 'grid',
        sectionKey: sec.key,
        locked: stat.unlocked === 0 && stat.total > 0,
      }
    })
    const account: NavRow[] = [
      { key: 'settings', href: `${base}/settings`, label: 'Settings',    icon: 'sliders'      },
      { key: 'browse',   href: homeHref,           label: 'Browse Site', icon: 'externalLink' },
    ]
    return [
      { label: 'Overview', rows: overview },
      { label: 'Features', rows: features },
      { label: 'Account',  rows: account  },
    ]
  }, [base, homeHref, unlocked])

  const isActive = (row: NavRow): boolean => {
    if (row.sectionKey) {
      // Active on the section page itself OR on any feature detail page
      // whose feature belongs to this section.
      if (pathname === `${base}/section/${row.sectionKey}`) return true
      return FEATURES.some(
        f => f.sectionKey === row.sectionKey && pathname === `${base}/feature/${f.slug}`
      )
    }
    if (row.href === base) return pathname === base
    // Treat /{country} as active for Browse Site only when exactly at root,
    // otherwise routes like /{country}/dashboard/* shouldn't light it up.
    if (row.key === 'browse') return pathname === row.href
    return pathname === row.href || pathname.startsWith(row.href + '/')
  }

  const logout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(homeHref)
    router.refresh()
  }

  return (
    <div className="ds-root">
      {/* Mobile top bar */}
      <div className="ds-mobile-bar">
        <Link href={homeHref} className="ds-mobile-logo">
          <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
        </Link>
        <button
          className="ds-burger"
          onClick={() => setDrawerOpen(v => !v)}
          aria-label="Menu" aria-expanded={drawerOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {drawerOpen && <div className="ds-overlay" onClick={() => setDrawerOpen(false)} />}

      <aside className={`ds-sidebar${drawerOpen ? ' ds-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="ds-brand">
          <Link href={homeHref} className="ds-brand-logo" onClick={() => setDrawerOpen(false)}>
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>
          <div className={`ds-plan-chip ${PLAN_CHIP_CLASS[plan.tier] || ''}`}>
            {plan.label}
            {plan.tier !== 'lifetime' && (
              <Link
                href={countryHref(country, '/business/plans')}
                className="ds-plan-upgrade"
                onClick={() => setDrawerOpen(false)}
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Grouped nav */}
        <nav className="ds-nav" aria-label="Dashboard navigation">
          {navGroups.map(group => (
            <div key={group.label} className="ds-group">
              <div className="ds-group-label">{group.label}</div>
              {group.rows.map(row => {
                const active = isActive(row)
                return (
                  <Link
                    key={row.key}
                    href={row.href}
                    onClick={() => setDrawerOpen(false)}
                    className={
                      'ds-nav-item' +
                      (active ? ' ds-nav-item--active' : '') +
                      (row.locked ? ' ds-nav-item--locked' : '')
                    }
                    title={row.label}
                  >
                    <span className="ds-nav-icon" aria-hidden="true">
                      <I d={ic[row.icon]} size={18} sw={1.8} />
                    </span>
                    <span className="ds-nav-label">{row.label}</span>
                    {row.locked && (
                      <span className="ds-nav-lock" aria-label="Locked">
                        <I d={ic.lock} size={11} sw={2.2} />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Log out pinned to bottom */}
        <div className="ds-foot">
          <button
            type="button"
            className="ds-nav-item ds-nav-item--logout"
            onClick={logout}
            disabled={loggingOut}
          >
            <span className="ds-nav-icon" aria-hidden="true">
              <I d={ic.power} size={18} sw={1.8} />
            </span>
            <span className="ds-nav-label">{loggingOut ? 'Signing out…' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      <main className="ds-main">{children}</main>
    </div>
  )
}
