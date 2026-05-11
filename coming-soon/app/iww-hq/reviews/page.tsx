'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Admin moderation page for reviews. Lists pending submissions by default;
 * tabs flip to approved / rejected for spot-checking. Approve fires the
 * owner email + flips status. Reject just flips status (reviewer can resubmit).
 *
 * The /company/<slug> page is statically cached — newly approved reviews
 * become publicly visible on the next 48h auto-revalidate or when an admin
 * clicks the per-listing "Rebuild" button on /iww-hq/submissions.
 */

type Status = 'pending' | 'approved' | 'rejected'

interface ReviewRow {
  id: number
  rating: number
  title: string
  body: string
  status: Status
  created_at: string
  updated_at: string | null
  user_id: number | null
  user_name: string | null
  user_email: string | null
  user_avatar_url: string | null
  listing_id: number
  listing_slug: string
  listing_mode?: 'product' | 'company' | string
  listing_uuid: string
  listing_name: string
  listing_logo_url: string | null
}

const TABS: { key: Status; label: string }[] = [
  { key: 'pending',  label: 'Pending'  },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function initials(name: string | null, email: string | null): string {
  const base = (name || email || '').trim()
  if (!base) return '?'
  const parts = base.split(/[\s@]+/).filter(Boolean)
  return (parts[0]?.[0] || '?').toUpperCase()
}

const Star = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      fill={filled ? '#FFA91C' : '#E5E7EB'}
      d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
    />
  </svg>
)

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<Status>('pending')
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set())

  const startBusy = (id: number) => setBusyIds(prev => { const n = new Set(prev); n.add(id); return n })
  const endBusy   = (id: number) => setBusyIds(prev => { const n = new Set(prev); n.delete(id); return n })

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    fetch(`/api/admin/reviews?status=${status}`, { credentials: 'same-origin', cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        if (cancelled) return
        if (!j?.ok) { setError(j?.error || 'Failed to load reviews.'); return }
        setRows((j.reviews || []) as ReviewRow[])
      })
      .catch(() => { if (!cancelled) setError('Network error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [status])

  const counts = useMemo(() => ({ count: rows.length }), [rows])

  const moderate = async (id: number, action: 'approve' | 'reject') => {
    if (busyIds.has(id)) return
    startBusy(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}/${action}`, {
        method: 'POST', credentials: 'same-origin',
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) {
        alert(j?.error || `Couldn't ${action} the review.`)
        return
      }
      /* Drop from current view — moves it to the other tab. */
      setRows(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('Network error.')
    } finally {
      endBusy(id)
    }
  }

  return (
    <div className="adm-scope" style={{ padding: '1.5rem 1.5rem 3rem', maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h1 style={{
          fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
          fontSize: '1.6rem', fontWeight: 800, color: 'var(--h-heading)', margin: 0,
        }}>Review moderation</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--h-muted)', fontSize: '.85rem' }}>
          Approve or reject submitted reviews. Approved reviews go public on the
          next /company/[slug] rebuild (48h auto, or use Rebuild on the
          submission row).
        </p>
      </header>

      {/* Tabs */}
      <div role="tablist" style={{
        display: 'inline-flex', gap: 4,
        background: '#FFFFFF',
        border: '1px solid var(--h-border)',
        borderRadius: 999,
        padding: 4,
        marginBottom: '1rem',
      }}>
        {TABS.map(t => {
          const active = t.key === status
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setStatus(t.key)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: 999,
                background: active ? '#1A1A1A' : 'transparent',
                color: active ? '#FFFFFF' : '#4B5563',
                fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
                letterSpacing: '-.005em',
              }}
            >
              {t.label}
            </button>
          )
        })}
        <span style={{
          alignSelf: 'center',
          marginLeft: 6, padding: '0 10px',
          fontSize: '.72rem', color: 'var(--h-muted)', fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {loading ? '…' : `${counts.count} item${counts.count === 1 ? '' : 's'}`}
        </span>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: 14,
          background: '#FCEEEA', border: '1px solid #F1B7AA', borderRadius: 8,
          color: '#B22A14', fontSize: '.85rem',
        }}>{error}</div>
      )}

      {!loading && rows.length === 0 && !error && (
        <div style={{
          padding: '36px 18px', textAlign: 'center',
          background: '#FFFFFF', border: '1px solid var(--h-border)', borderRadius: 12,
          color: 'var(--h-muted)', fontSize: '.9rem',
        }}>
          {status === 'pending' ? 'Inbox zero — no pending reviews right now.' :
           status === 'approved' ? 'No approved reviews yet.' :
           'No rejected reviews.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => {
          const busy = busyIds.has(r.id)
          return (
            <article key={r.id} style={{
              background: '#FFFFFF',
              border: '1px solid var(--h-border)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 14,
            }}>
              <div style={{ minWidth: 0 }}>
                {/* Listing strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {r.listing_logo_url ? (
                    <img src={r.listing_logo_url} alt="" style={{
                      width: 22, height: 22, borderRadius: 5, objectFit: 'contain',
                      border: '1px solid var(--h-border-light)', background: '#fff',
                    }} />
                  ) : (
                    <span style={{
                      width: 22, height: 22, borderRadius: 5,
                      background: '#1A1A1A', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.62rem', fontWeight: 800,
                    }}>{(r.listing_name || '?').slice(0, 1).toUpperCase()}</span>
                  )}
                  <a href={(r.listing_mode === 'company' ? '/profile/' : '/company/') + r.listing_slug} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '.78rem', fontWeight: 700, color: '#1A1A1A',
                    textDecoration: 'none',
                  }}>{r.listing_name}</a>
                  <span style={{ color: 'var(--h-muted)', fontSize: '.72rem' }}>·</span>
                  <span style={{ color: 'var(--h-muted)', fontSize: '.72rem' }}>
                    {formatDate(r.created_at)}
                  </span>
                </div>

                {/* Reviewer + rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {r.user_avatar_url ? (
                    <img src={r.user_avatar_url} alt="" style={{
                      width: 26, height: 26, borderRadius: 999, objectFit: 'cover',
                    }} />
                  ) : (
                    <span style={{
                      width: 26, height: 26, borderRadius: 999,
                      background: '#1A1A1A', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.7rem', fontWeight: 800,
                    }}>{initials(r.user_name, r.user_email)}</span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#1A1A1A' }}>
                      {r.user_name || r.user_email || 'Anonymous'}
                    </div>
                    {r.user_email && r.user_name && (
                      <div style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>
                        {r.user_email}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 1, marginLeft: 6 }}>
                    {[1,2,3,4,5].map(n => <Star key={n} filled={n <= r.rating} />)}
                    <span style={{
                      marginLeft: 6, fontSize: '.72rem', fontWeight: 700, color: '#4B5563',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{r.rating}/5</span>
                  </div>
                </div>

                {/* Review text */}
                <div style={{
                  fontSize: '.95rem', fontWeight: 700, color: '#1A1A1A',
                  marginBottom: 4, letterSpacing: '-.01em',
                }}>{r.title}</div>
                <p style={{
                  margin: 0,
                  fontSize: '.85rem', color: '#374151', lineHeight: 1.55,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>{r.body}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                {status !== 'approved' && (
                  <button
                    onClick={() => moderate(r.id, 'approve')}
                    disabled={busy}
                    style={{
                      height: 32, padding: '0 14px',
                      border: '1.5px solid #16A34A',
                      background: '#16A34A', color: '#FFFFFF',
                      borderRadius: 6,
                      fontSize: '.7rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.04em',
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy ? .55 : 1,
                    }}
                  >Approve</button>
                )}
                {status !== 'rejected' && (
                  <button
                    onClick={() => moderate(r.id, 'reject')}
                    disabled={busy}
                    style={{
                      height: 32, padding: '0 14px',
                      border: '1.5px solid #B22A14',
                      background: '#FFFFFF', color: '#B22A14',
                      borderRadius: 6,
                      fontSize: '.7rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.04em',
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy ? .55 : 1,
                    }}
                  >Reject</button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
