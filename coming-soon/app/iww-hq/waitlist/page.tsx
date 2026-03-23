'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchAllWaitlist, deleteWaitlistEntry, fetchWaitlistStats, type WaitlistEntry } from '../data/waitlist-storage'

const srcColors: Record<string, string> = { hero: '#E8553D', footer: '#3B82F6', cta: '#2FAE6A' }

export default function Waitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<Record<string, number>>({ total: 0 })

  const reload = async () => {
    const [w, s] = await Promise.all([fetchAllWaitlist(), fetchWaitlistStats()])
    setEntries(w); setStats(s)
  }
  useEffect(() => { reload() }, [])

  const filtered = useMemo(() => entries.filter(w => !search || w.email.toLowerCase().includes(search.toLowerCase())), [entries, search])

  const handleDelete = (id: string) => {
    if (!confirm('Remove this email from the waitlist?')) return
    deleteWaitlistEntry(id); reload()
  }

  const exportCSV = () => {
    const csv = 'ID,Email,Source,Date\n' + filtered.map(w => `${w.id},${w.email},${w.source},${w.subscribedAt}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'waitlist.csv'; a.click()
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.65rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total Signups', v: stats.total || 0, c: '#E8553D' },
          { l: 'From Hero', v: stats.hero || 0, c: srcColors.hero },
          { l: 'From Footer', v: stats.footer || 0, c: srcColors.footer },
          { l: 'From CTA', v: stats.cta || 0, c: srcColors.cta },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <p style={{ fontSize: '.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.2rem' }}>{s.l}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <input type="text" placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />
        <button onClick={exportCSV} style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", transition: 'all .25s' }}>Export CSV</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {entries.length === 0 ? 'No waitlist signups yet. They will appear here when users enter their email on the landing page.' : 'No entries match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  {['#', 'Email', 'Source', 'Date', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => (
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                    <td style={{ padding: '.6rem 1rem', fontSize: '.62rem', fontWeight: 700, color: 'var(--h-muted)' }}>{w.id}</td>
                    <td style={{ padding: '.6rem 1rem', fontSize: '.78rem', fontWeight: 600, color: 'var(--h-heading)' }}>{w.email}</td>
                    <td style={{ padding: '.6rem 1rem' }}>
                      <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${srcColors[w.source] || '#6B7280'}15`, color: srcColors[w.source] || '#6B7280', textTransform: 'capitalize' }}>{w.source}</span>
                    </td>
                    <td style={{ padding: '.6rem 1rem', fontSize: '.68rem', color: 'var(--h-muted)' }}>{new Date(w.subscribedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ padding: '.6rem 1rem' }}>
                      <button onClick={() => handleDelete(w.id)} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgba(239,68,68,.2)', background: '#fff', color: '#EF4444', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '.75rem 1rem', fontSize: '.62rem', fontWeight: 600, color: 'var(--h-muted)', borderTop: '1px solid var(--h-border-light)' }}>
          Showing {filtered.length} of {entries.length} entries
        </div>
      </div>
    </div>
  )
}
