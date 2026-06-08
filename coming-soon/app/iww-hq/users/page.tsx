'use client'
import { useState, useEffect, useMemo } from 'react'

/* Admin → Users. Read-only roster of everyone who signed up (business_users),
   with per-user listing + review counts. Same visual language as the Waitlist
   page (inline styles + --h-* / --tp-* CSS vars from dashboard-shell.css). */

type AdminUser = {
  id: number
  uuid: string
  email: string
  name: string | null
  avatar_url: string | null
  provider: string
  email_verified: number
  created_at: string
  listing_count: number
  review_count: number
}

type Stats = { total?: number; google?: number; email?: number; verified?: number; new_7d?: number }

const provMeta: Record<string, { bg: string; fg: string; label: string }> = {
  google: { bg: 'rgba(66,133,244,.12)', fg: '#1A73E8', label: 'Google' },
  email: { bg: 'rgba(232,85,61,.12)', fg: '#C2410C', label: 'Email' },
}
const provFallback = { bg: 'rgba(107,114,128,.12)', fg: '#6B7280' }

function fmtDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/* Show a readable name even when the user never entered one at sign-up:
   derive it from the email local-part (john.doe@x.com → "John Doe"). */
function displayName(u: { name: string | null; email: string }): string {
  if (u.name && u.name.trim()) return u.name.trim()
  const local = (u.email || '').split('@')[0] || ''
  if (!local) return '—'
  const words = local
    .replace(/[._\-+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w && !/^\d+$/.test(w))
    .map(w => w.replace(/\d+$/, ''))
    .filter(Boolean)
  if (!words.length) return local
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<Stats>({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/users', { credentials: 'same-origin', cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        if (cancelled) return
        if (j?.ok) { setUsers(j.users || []); setStats(j.stats || {}) }
        setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.email || '').toLowerCase().includes(q) ||
      displayName(u).toLowerCase().includes(q)
    )
  }, [users, search])

  const exportCSV = () => {
    const rows = [
      'ID,Name,Email,Provider,EmailVerified,Listings,Reviews,Joined',
      ...filtered.map(u => [
        u.id,
        `"${displayName(u).replace(/"/g, '""')}"`,
        u.email,
        u.provider,
        u.email_verified ? 'yes' : 'no',
        u.listing_count,
        u.review_count,
        u.created_at,
      ].join(',')),
    ].join('\n')
    const blob = new Blob([rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'infowebworld-users.csv'; a.click()
  }

  const statCards = [
    { l: 'Total Users', v: stats.total || 0, c: '#E8553D' },
    { l: 'Verified Email', v: stats.verified || 0, c: '#0E8F6E' },
    { l: 'Google Sign-ups', v: stats.google || 0, c: '#1A73E8' },
    { l: 'Email Sign-ups', v: stats.email || 0, c: '#C2410C' },
    { l: 'New (7 days)', v: stats.new_7d || 0, c: '#7C3AED' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.65rem', marginBottom: '.85rem' }}>
        {statCards.map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <p style={{ fontSize: '.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.2rem' }}>{s.l}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-nunito)', color: 'var(--h-heading)', lineHeight: 1 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: 'var(--font-nunito)' }} />
        <button onClick={exportCSV} style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: 'var(--font-nunito)' }}>Export CSV</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>Loading users…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {users.length === 0 ? 'No users have signed up yet. New accounts will appear here.' : 'No users match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  {['User', 'Provider', 'Email Verified', 'Listings', 'Reviews', 'Joined'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const pm = provMeta[u.provider] || { ...provFallback, label: u.provider || 'unknown' }
                  const initial = (displayName(u) || u.email || '?').trim().charAt(0).toUpperCase()
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                      <td style={{ padding: '.6rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" width={30} height={30} style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }} />
                          ) : (
                            <span style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'rgba(232,85,61,.12)', color: '#C2410C', fontSize: '.7rem', fontWeight: 800 }}>{initial}</span>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--h-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{displayName(u)}</div>
                            <div style={{ fontSize: '.66rem', color: 'var(--h-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '.6rem 1rem' }}>
                        <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: pm.bg, color: pm.fg, textTransform: 'capitalize' }}>{pm.label}</span>
                      </td>
                      <td style={{ padding: '.6rem 1rem' }}>
                        {u.email_verified ? (
                          <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: 'rgba(14,143,110,.12)', color: '#0E8F6E' }}>Verified</span>
                        ) : (
                          <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: 'rgba(107,114,128,.1)', color: '#9CA3AF' }}>No</span>
                        )}
                      </td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.74rem', fontWeight: 700, color: u.listing_count ? 'var(--h-heading)' : 'var(--h-muted)' }}>{u.listing_count}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.74rem', fontWeight: 700, color: u.review_count ? 'var(--h-heading)' : 'var(--h-muted)' }}>{u.review_count}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.68rem', color: 'var(--h-muted)', whiteSpace: 'nowrap' }}>{fmtDate(u.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '.75rem 1rem', fontSize: '.62rem', fontWeight: 600, color: 'var(--h-muted)', borderTop: '1px solid var(--h-border-light)' }}>
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  )
}
