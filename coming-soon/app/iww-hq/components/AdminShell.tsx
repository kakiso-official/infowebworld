'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearSession } from '../utils/hash'

const nav = [
  { href: '/iww-hq/dashboard', label: 'Dashboard', icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
  { href: '/iww-hq/submissions', label: 'Submissions', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /></> },
  { href: '/iww-hq/blog', label: 'Blog', icon: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></> },
  { href: '/iww-hq/categories', label: 'Categories', icon: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></> },
  { href: '/iww-hq/tags', label: 'Tags', icon: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></> },
  { href: '/iww-hq/listing-types', label: 'Listing Types', icon: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></> },
  { href: '/iww-hq/seo-content', label: 'SEO Content', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></> },
  { href: '/iww-hq/analytics', label: 'Analytics', icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></> },
  { href: '/iww-hq/waitlist', label: 'Waitlist', icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { href: '/iww-hq/settings', label: 'Settings', icon: <><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></> },
]

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

export default function AdminShell({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const title = nav.find(n => path.startsWith(n.href))?.label || 'Admin'

  return (
    <div className="adm-scope" style={{ display: 'flex', minHeight: '100vh', background: 'var(--h-bg)' }}>
      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 40 }} />}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100%', width: 240, zIndex: 50,
        background: '#1A1A1A', display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{ padding: '1.25rem 1.25rem .75rem' }}>
          <img src="/logo/infowebworldlogo-logoforlightbackgrounds.png" alt="IWW" style={{ height: 28 }} />
        </div>

        <nav style={{ flex: 1, padding: '.5rem .65rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {nav.map(n => {
            const active = path.startsWith(n.href)
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.65rem',
                  padding: '.6rem .85rem', borderRadius: 12,
                  fontSize: '.78rem', fontWeight: 600, textDecoration: 'none',
                  fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                  color: active ? '#E8553D' : 'rgba(255,255,255,.4)',
                  background: active ? 'rgba(232,85,61,.12)' : 'transparent',
                  transition: 'all .2s',
                }}>
                <Icon>{n.icon}</Icon>
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '.65rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={async () => {
            try { await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }) } catch {}
            clearSession()
            onLogout()
          }} style={{
            display: 'flex', alignItems: 'center', gap: '.65rem', width: '100%',
            padding: '.6rem .85rem', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.35)', background: 'transparent',
            fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'color .2s',
          }}>
            <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop sidebar spacer */}
      <div className="adm-spacer" style={{ width: 240, flexShrink: 0 }} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', gap: '.75rem',
          padding: '0 1.25rem', height: 56, background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--h-border)',
        }}>
          <button className="adm-burger" onClick={() => setOpen(!open)} style={{
            display: 'none', padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent',
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>

          <h2 style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", letterSpacing: '-.01em' }}>{title}</h2>

          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.25rem .65rem', borderRadius: 999, background: 'rgba(47,174,106,.1)', color: '#2FAE6A' }}>Session Active</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.25rem' }}>
          {children}
        </main>
      </div>

      {/* Responsive CSS for sidebar */}
      <style>{`
        @media (max-width: 1023px) {
          .adm-spacer { display: none !important; }
          .adm-burger { display: block !important; }
        }
        @media (min-width: 1024px) {
          aside { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  )
}
