'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faGaugeHigh, faChartLine, faInbox, faStar, faShieldHalved, faUsers,
  faNewspaper, faSitemap, faTags, faList, faMagnifyingGlassChart, faGear,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import { clearSession } from '../utils/hash'

/* ════════════════════════════════════════════════════════════════════════
   Admin shell — same white/coral compact sidebar as the user dashboard
   (.tp-* + dashboard-shell.css), now with Font Awesome icons throughout.
   Nothing functional changed: same 12 destinations, same logout flow,
   .adm-scope kept so admin-forms.css still styles inputs.
   ════════════════════════════════════════════════════════════════════════ */
type NavItem = { href: string; label: string; icon: IconDefinition; isLogout?: boolean }
type NavGroup = { title: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  { title: 'Overview', items: [
    { href: '/iww-hq/dashboard', label: 'Dashboard', icon: faGaugeHigh },
    { href: '/iww-hq/analytics', label: 'Analytics', icon: faChartLine },
  ] },
  { title: 'Moderation', items: [
    { href: '/iww-hq/submissions', label: 'Submissions', icon: faInbox },
    { href: '/iww-hq/reviews', label: 'Reviews', icon: faStar },
    { href: '/iww-hq/verifications', label: 'Verifications', icon: faShieldHalved },
    { href: '/iww-hq/waitlist', label: 'Waitlist', icon: faUsers },
  ] },
  { title: 'Content', items: [
    { href: '/iww-hq/blog', label: 'Blog', icon: faNewspaper },
    { href: '/iww-hq/categories', label: 'Categories', icon: faSitemap },
    { href: '/iww-hq/tags', label: 'Tags', icon: faTags },
    { href: '/iww-hq/listing-types', label: 'Listing Types', icon: faList },
    { href: '/iww-hq/seo-content', label: 'SEO Content', icon: faMagnifyingGlassChart },
  ] },
  { title: 'System', items: [
    { href: '/iww-hq/settings', label: 'Settings', icon: faGear },
    { href: '#', label: 'Logout', isLogout: true, icon: faRightFromBracket },
  ] },
]

const LINKS: NavItem[] = GROUPS.flatMap(g => g.items).filter(i => !i.isLogout)

export default function AdminShell({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const path = usePathname() || ''
  const [open, setOpen] = useState(false)
  const title = LINKS.find(n => path === n.href || path.startsWith(n.href + '/'))?.label
    || (path.startsWith('/iww-hq') ? LINKS.find(n => path.startsWith(n.href))?.label : null)
    || 'Admin'

  const handleLogout = async () => {
    setOpen(false)
    try { await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }) } catch { /* ignore */ }
    clearSession()
    onLogout()
  }

  const renderItem = (item: NavItem) => {
    const active = !item.isLogout && (path === item.href || path.startsWith(item.href + '/'))
    const className = 'tp-nav-item' + (active ? ' tp-nav-item--active' : '')
    const inner = (
      <>
        <span className="tp-nav-icon" aria-hidden="true"><FontAwesomeIcon icon={item.icon} /></span>
        <span className="tp-nav-label">{item.label}</span>
      </>
    )
    if (item.isLogout) {
      return (
        <button key="logout" type="button" className={className} onClick={handleLogout} title="Logout">
          {inner}
        </button>
      )
    }
    return (
      <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={className} title={item.label}>
        {inner}
      </Link>
    )
  }

  return (
    /* `adm-scope` retained so admin-forms.css keeps styling inputs/selects. */
    <div className="tp-root adm-scope">
      {/* Mobile top bar */}
      <div className="tp-mobile-bar">
        <Link href="/iww-hq/dashboard" className="tp-mobile-logo" onClick={() => setOpen(false)}>
          <img src="/logo/infowebworldlogo-logoforlightbackgrounds.png" alt="InfoWebWorld Admin" />
        </Link>
        <button className="tp-burger" onClick={() => setOpen(v => !v)} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </div>

      {open && <div className="tp-overlay" onClick={() => setOpen(false)} />}

      {/* ── Sidebar — white column, coral accent (matches /dashboard) ── */}
      <aside className={'tp-sidebar' + (open ? ' tp-sidebar--open' : '')}>
        <div className="tp-brand">
          <Link href="/iww-hq/dashboard" className="tp-brand-logo" onClick={() => setOpen(false)}>
            <img src="/logo/infowebworldlogo-logoforlightbackgrounds.png" alt="InfoWebWorld Admin" />
          </Link>
        </div>

        <nav className="tp-nav" aria-label="Admin navigation">
          {GROUPS.map((group, gi) => (
            <div key={group.title} className={'tp-nav-group' + (gi > 0 ? ' tp-nav-group--bordered' : '')}>
              <div className="tp-nav-group-head">{group.title}</div>
              {group.items.map(renderItem)}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main column — slim topbar (title + session) over scrolling content ── */}
      <main className="tp-main">
        <header
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: '.75rem',
            height: 54, padding: '0 clamp(1.5rem, 3.2vw, 2.75rem)',
            borderBottom: '1px solid var(--tp-line)', background: '#FFFFFF',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--tp-text)' }}>
            {title}
          </h2>
          <span
            style={{
              marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
              padding: '.3rem .6rem', borderRadius: 999,
              background: 'rgba(14, 143, 110, .12)', color: '#0E8F6E',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#0E8F6E', display: 'inline-block' }} />
            Session active
          </span>
        </header>

        <div className="tp-content">{children}</div>
      </main>
    </div>
  )
}
