'use client'
import { createContext, useContext, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BASE } from '../config/base-path'
import { I, ic, type IconKey } from '../components/icons'
import { SECTIONS, FEATURES, findFeature, type Feature } from './features'
import { TIER_LABEL, type PlanTier, type UserPlan } from '@/lib/user-plan-types'

/** Order tiers cheap → expensive so groups stack predictably in the sub-nav. */
const TIER_ORDER: PlanTier[] = ['free', 'starter', 'yearly', 'lifetime']

interface ShellUser {
  uuid: string; email: string; name: string | null
  avatarUrl: string | null; provider: string
}

interface Props {
  user: ShellUser
  plan: UserPlan
  children: React.ReactNode
}

/** Context exposed to in-page DashboardHeader so it can render the avatar inline. */
export interface DashboardCtxValue {
  user: ShellUser
  plan: UserPlan
  logout: () => Promise<void>
  loggingOut: boolean
}

const DashboardCtx = createContext<DashboardCtxValue | null>(null)
export function useDashboardCtx(): DashboardCtxValue {
  const v = useContext(DashboardCtx)
  if (!v) throw new Error('useDashboardCtx must be used inside <DashboardShell>')
  return v
}

const SECTION_ICON: Record<string, IconKey> = {
  listing:   'building',
  discovery: 'search',
  leads:     'messageCircle',
  reviews:   'star',
  community: 'users',
  analytics: 'pieChart',
  support:   'helpCircle',
}

type NavRow = {
  key: string
  href: string
  label: string
  icon: IconKey
  /** When set, treat this row as expandable — sub-nav panel shows on its routes. */
  sectionKey?: string
  /** Optional pill on the right (e.g. "New", "BETA"). */
  badge?: string
}

/**
 * Trustpilot-style sidebar — entire sidebar is one dark green zone:
 *
 *   ┌──────────────────────┐
 *   │ Account chip          │  edge-to-edge, white text
 *   │                       │
 *   │ Logo                  │  white wordmark on dark green
 *   │                       │
 *   │ Home                  │  nav, white icons + labels
 *   │ My Listings           │
 *   │ ▣ Section (active)    │  cream-filled pill + chevron
 *   │ Settings              │
 *   │                       │
 *   │ ┌──────────────┐      │
 *   │ │ Try free     │      │  promo card on darker green
 *   │ └──────────────┘      │
 *   └──────────────────────┘
 *
 * Sub-nav panel slides out beside it with a saturated mint background
 * when on a /dashboard/section/<key> or /dashboard/feature/<slug> route.
 */
export default function DashboardShell({ user, plan, children }: Props) {
  const pathname = usePathname() || ''
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const base = '/dashboard'

  const topNav: NavRow[] = useMemo(() => [
    { key: 'dashboard', href: base,              label: 'Home',         icon: 'home'   },
    { key: 'listings',  href: `${base}/listings`, label: 'My Listings', icon: 'layers' },
    { key: 'new',       href: `${base}/new`,      label: 'New Listing', icon: 'plus', badge: 'New' },
  ], [])

  const featureNav: NavRow[] = useMemo(() =>
    SECTIONS.map(sec => ({
      key: `sec-${sec.key}`,
      href: `${base}/section/${sec.key}`,
      label: sec.title,
      icon: SECTION_ICON[sec.key] || 'grid',
      sectionKey: sec.key,
    })),
  [])

  const accountNav: NavRow[] = useMemo(() => [
    { key: 'settings', href: `${base}/settings`, label: 'Settings',    icon: 'sliders'      },
    { key: 'browse',   href: '/',                label: 'Browse Site', icon: 'externalLink' },
  ], [])

  // Which section's sub-nav (if any) should be visible right now
  const activeSectionKey: string | null = useMemo(() => {
    const m = pathname.match(/^\/dashboard\/section\/([^/]+)/)
    if (m) return m[1]
    const fm = pathname.match(/^\/dashboard\/feature\/([^/]+)/)
    if (fm) {
      const f = findFeature(fm[1])
      if (f) return f.sectionKey
    }
    return null
  }, [pathname])

  const activeSection = activeSectionKey
    ? SECTIONS.find(s => s.key === activeSectionKey) || null
    : null

  // Features for the active section, grouped by required tier so the
  // sub-nav can show collapsible "Free / Starter / Early Adopter / Lifetime"
  // groups (mirrors the Trustpilot-style sub-nav with chevron-toggles).
  const subNavGroups = useMemo(() => {
    if (!activeSectionKey) return [] as Array<{ tier: PlanTier; label: string; items: Feature[] }>
    const sectionFeats = FEATURES.filter(f => f.sectionKey === activeSectionKey)
    return TIER_ORDER
      .map(tier => ({
        tier,
        label: TIER_LABEL[tier],
        items: sectionFeats.filter(f => f.requiredTier === tier),
      }))
      .filter(g => g.items.length > 0)
  }, [activeSectionKey])

  // Collapsed sub-nav groups, keyed by `${sectionKey}:${tier}`.
  // Default = empty Set => every group is open.
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const isPrimaryActive = (row: NavRow): boolean => {
    if (row.sectionKey) return activeSectionKey === row.sectionKey
    if (row.href === base) return pathname === base
    if (row.key === 'browse') return false
    return pathname === row.href || pathname.startsWith(row.href + '/')
  }

  const logout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const renderNavRow = (row: NavRow) => {
    const active = isPrimaryActive(row)
    return (
      <Link
        key={row.key}
        href={row.href}
        onClick={() => setDrawerOpen(false)}
        className={'tp-nav-item' + (active ? ' tp-nav-item--active' : '')}
        title={row.label}
      >
        <span className="tp-nav-icon" aria-hidden="true">
          <I d={ic[row.icon]} size={20} sw={1.5} />
        </span>
        <span className="tp-nav-label">{row.label}</span>
        {row.badge && !active && (
          <span className="tp-nav-badge" aria-label={row.badge}>{row.badge}</span>
        )}
        {active && (
          <span className="tp-nav-arrow" aria-hidden="true">
            <I d={ic.arrow} size={16} sw={1.6} />
          </span>
        )}
      </Link>
    )
  }

  return (
    <DashboardCtx.Provider value={{ user, plan, logout, loggingOut }}>
      <div className={'tp-root' + (activeSection ? ' tp-root--with-subnav' : '')}>
        {/* Mobile top bar */}
        <div className="tp-mobile-bar">
          <Link href="/" className="tp-mobile-logo">
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>
          <button
            className="tp-burger"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Menu" aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {drawerOpen && <div className="tp-overlay" onClick={() => setDrawerOpen(false)} />}

        {/* ── Sidebar — single dark green zone ── */}
        <aside className={'tp-sidebar' + (drawerOpen ? ' tp-sidebar--open' : '')}>
          {/* Brand wordmark — sits at the top */}
          <div className="tp-brand">
            <Link href="/" className="tp-brand-logo" onClick={() => setDrawerOpen(false)}>
              <img src={`${BASE}/logo/infowebworld-logofordarkbackgrounds.png`} alt="InfoWebWorld" />
            </Link>
          </div>

          {/* Nav — flat list, no group labels */}
          <nav className="tp-nav" aria-label="Dashboard navigation">
            {topNav.map(renderNavRow)}
            {featureNav.map(renderNavRow)}
            {accountNav.map(renderNavRow)}
          </nav>

          {/* Promo card pinned to bottom (hidden on lifetime) */}
          {plan.tier !== 'lifetime' && (
            <Link href="/business/plans" className="tp-promo" onClick={() => setDrawerOpen(false)}>
              <div className="tp-promo-row">
                <span className="tp-promo-icon" aria-hidden="true">
                  <I d={ic.gift} size={18} sw={1.6} />
                </span>
                <span className="tp-promo-title">Upgrade your plan</span>
              </div>
              <p className="tp-promo-body">
                You&rsquo;re on the {plan.label} plan. Unlock dofollow backlinks, leads &amp; reviews.
              </p>
              <span className="tp-promo-link">See plans</span>
            </Link>
          )}
        </aside>

        {/* ── Sub-nav panel — features grouped by tier, collapsible ── */}
        {activeSection && (
          <aside className="tp-subnav" aria-label={`${activeSection.title} sub-navigation`}>
            <div className="tp-subnav-head">{activeSection.title}</div>
            {subNavGroups.map(group => {
              const groupKey = `${activeSection.key}:${group.tier}`
              const collapsed = collapsedGroups.has(groupKey)
              const groupId = `tp-subnav-group-${groupKey.replace(':', '-')}`
              return (
                <div key={group.tier} className="tp-subnav-group">
                  <button
                    type="button"
                    className="tp-subnav-group-head"
                    onClick={() => toggleGroup(groupKey)}
                    aria-expanded={!collapsed}
                    aria-controls={groupId}
                  >
                    <span className="tp-subnav-group-label">
                      {group.label} <span className="tp-subnav-group-count">({group.items.length})</span>
                    </span>
                    <span className="tp-subnav-group-chev" aria-hidden="true">
                      <I d={collapsed ? ic.chevronDown : ic.chevronUp} size={16} sw={1.8} />
                    </span>
                  </button>
                  {!collapsed && (
                    <ul className="tp-subnav-list" id={groupId}>
                      {group.items.map(f => {
                        const href = `${base}/feature/${f.slug}`
                        const active = pathname === href
                        return (
                          <li key={f.slug}>
                            <Link
                              href={href}
                              className={'tp-subnav-item' + (active ? ' tp-subnav-item--active' : '')}
                            >
                              {f.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </aside>
        )}

        {/* ── Main column — DashboardHeader handles the topbar ── */}
        <main className="tp-main">
          <div className="tp-content">{children}</div>
        </main>
      </div>
    </DashboardCtx.Provider>
  )
}
