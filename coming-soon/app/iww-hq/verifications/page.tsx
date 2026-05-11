'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Admin moderation queue for listing verification requests.
 *
 * Visual language matches /iww-hq/reviews — same TabsRow, same neutral list
 * cards, same coral accent. Each row exposes the listing strip, applicant
 * card, and full evidence inline so admins can decide without opening a
 * sub-page. Approve flips submissions.verified=1, fires the owner email,
 * and revalidates the public /company/[slug] page on the server.
 *
 * Approving / rejecting can include an admin note (sent to the owner in
 * the email). For pending → approved the note is optional; for pending
 * → rejected we strongly suggest one (it tells the owner what to fix).
 */

type Status = 'pending' | 'approved' | 'rejected'

interface RequestRow {
  id: number
  status: Status
  created_at: string
  updated_at: string | null
  reviewed_at: string | null
  legal_name: string | null
  business_email: string | null
  business_phone: string | null
  registration_number: string | null
  owner_role: string | null
  document_url: string | null
  social_proof: string | null
  applicant_notes: string | null
  admin_notes: string | null
  reviewed_by_admin_id: number | null
  user_id: number | null
  user_name: string | null
  user_email: string | null
  user_avatar_url: string | null
  listing_id: number
  listing_slug: string
  listing_mode?: 'product' | 'company' | string
  listing_uuid: string
  listing_name: string
  listing_tagline: string | null
  listing_logo_url: string | null
  listing_website: string | null
  listing_verified: number
}

const TABS: { key: Status; label: string }[] = [
  { key: 'pending',  label: 'Pending'  },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

function formatDate(iso: string | null): string {
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

function domainOf(url: string | null): string {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch { return '' }
}

function emailDomain(email: string | null): string {
  if (!email) return ''
  const m = email.match(/@([^@\s]+)$/)
  return m ? m[1].toLowerCase() : ''
}

function parseSocial(raw: string | null): Record<string, string> {
  if (!raw) return {}
  try {
    const p = JSON.parse(raw)
    if (p && typeof p === 'object' && !Array.isArray(p)) return p as Record<string, string>
  } catch { /* ignore */ }
  return {}
}

export default function AdminVerificationsPage() {
  const [status, setStatus] = useState<Status>('pending')
  const [rows, setRows] = useState<RequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set())
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())
  const [notes, setNotes] = useState<Record<number, string>>({})

  const startBusy = (id: number) => setBusyIds(prev => { const n = new Set(prev); n.add(id); return n })
  const endBusy   = (id: number) => setBusyIds(prev => { const n = new Set(prev); n.delete(id); return n })

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    fetch(`/api/admin/verifications?status=${status}`, { credentials: 'same-origin', cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        if (cancelled) return
        if (!j?.ok) { setError(j?.error || 'Failed to load verification requests.'); return }
        setRows((j.requests || []) as RequestRow[])
        /* Reset transient form state when switching tabs. */
        setNotes({}); setOpenIds(new Set())
      })
      .catch(() => { if (!cancelled) setError('Network error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [status])

  const counts = useMemo(() => ({ count: rows.length }), [rows])

  const moderate = async (id: number, action: 'approve' | 'reject') => {
    if (busyIds.has(id)) return
    if (action === 'reject' && !(notes[id] || '').trim()) {
      const ok = window.confirm(
        'No reason note included. The applicant will get a rejection email without specifics.\n\n' +
        'Reject anyway?'
      )
      if (!ok) return
    }
    startBusy(id)
    try {
      const res = await fetch(`/api/admin/verifications/${id}/${action}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: (notes[id] || '').trim() || null }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) {
        alert(j?.error || `Couldn't ${action} the request.`)
        return
      }
      setRows(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('Network error.')
    } finally {
      endBusy(id)
    }
  }

  const toggleOpen = (id: number) => setOpenIds(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  return (
    <div className="adm-scope" style={{ padding: '1.5rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h1 style={{
          fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
          fontSize: '1.6rem', fontWeight: 800, color: 'var(--h-heading)', margin: 0,
        }}>Verification queue</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--h-muted)', fontSize: '.85rem' }}>
          Owner-submitted applications to verify their listing. Approving flips
          the public Verified-by-InfoWebWorld badge live (with a manual rebuild
          of /company/&lt;slug&gt;) and emails the owner.
        </p>
      </header>

      {/* Tabs */}
      <div role="tablist" style={{
        display: 'inline-flex', gap: 4,
        background: '#FFFFFF',
        border: '1px solid var(--h-border)',
        borderRadius: 999, padding: 4,
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
                border: 'none', borderRadius: 999,
                background: active ? '#1A1A1A' : 'transparent',
                color: active ? '#FFFFFF' : '#4B5563',
                fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
                letterSpacing: '-.005em',
              }}
            >{t.label}</button>
          )
        })}
        <span style={{
          alignSelf: 'center', marginLeft: 6, padding: '0 10px',
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
          {status === 'pending' ? 'Inbox zero — no verification requests pending review.' :
           status === 'approved' ? 'No approved verifications yet.' :
           'No rejected verifications.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => {
          const busy = busyIds.has(r.id)
          const open = openIds.has(r.id)
          const social = parseSocial(r.social_proof)
          const wDomain = domainOf(r.listing_website)
          const eDomain = emailDomain(r.business_email)
          const domainOk = !!(wDomain && eDomain && (eDomain === wDomain || eDomain.endsWith('.' + wDomain)))
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  {r.listing_logo_url ? (
                    <img src={r.listing_logo_url} alt="" style={{
                      width: 28, height: 28, borderRadius: 6, objectFit: 'contain',
                      border: '1px solid var(--h-border-light)', background: '#fff',
                    }} />
                  ) : (
                    <span style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: '#1A1A1A', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.7rem', fontWeight: 800,
                    }}>{(r.listing_name || '?').slice(0, 1).toUpperCase()}</span>
                  )}
                  <a href={(r.listing_mode === 'company' ? '/profile/' : '/company/') + r.listing_slug} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '.92rem', fontWeight: 800, color: '#1A1A1A', textDecoration: 'none',
                  }}>{r.listing_name}</a>
                  {Number(r.listing_verified) === 1 && (
                    <span style={{
                      fontSize: '.62rem', fontWeight: 800, padding: '2px 7px', borderRadius: 999,
                      background: 'rgba(14,143,110,.12)', color: '#0E8F6E',
                      textTransform: 'uppercase', letterSpacing: '.06em',
                    }}>Already verified</span>
                  )}
                  {wDomain && (
                    <span style={{ color: 'var(--h-muted)', fontSize: '.72rem' }}>· {wDomain}</span>
                  )}
                  <span style={{ color: 'var(--h-muted)', fontSize: '.72rem', marginLeft: 'auto' }}>
                    Submitted {formatDate(r.created_at)}
                  </span>
                </div>

                {/* Applicant card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  {r.user_avatar_url ? (
                    <img src={r.user_avatar_url} alt="" style={{
                      width: 30, height: 30, borderRadius: 999, objectFit: 'cover',
                    }} />
                  ) : (
                    <span style={{
                      width: 30, height: 30, borderRadius: 999,
                      background: '#1A1A1A', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.78rem', fontWeight: 800,
                    }}>{initials(r.user_name, r.user_email)}</span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#1A1A1A' }}>
                      {r.user_name || r.user_email || 'Anonymous'}
                      {r.owner_role ? <span style={{ color: 'var(--h-muted)', fontWeight: 500, marginLeft: 6 }}>· {r.owner_role}</span> : null}
                    </div>
                    {r.user_email && (
                      <div style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>
                        {r.user_email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Evidence summary — collapsed by default to keep the queue scannable */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '6px 14px',
                  fontSize: '.82rem', marginBottom: 8,
                }}>
                  <KV label="Legal name"  value={r.legal_name} />
                  <KV
                    label="Business email"
                    value={r.business_email}
                    flag={
                      r.business_email
                        ? (domainOk
                            ? { tone: 'ok',   label: 'Domain match' }
                            : (wDomain ? { tone: 'warn', label: 'Domain mismatch' } : null))
                        : null
                    }
                  />
                  <KV label="Phone"       value={r.business_phone} mono />
                  <KV label="Reg. number" value={r.registration_number} mono />
                </div>

                {/* Toggle for the rest */}
                <button
                  type="button"
                  onClick={() => toggleOpen(r.id)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: 0, color: 'var(--h-accent, #E8553D)',
                    fontSize: '.78rem', fontWeight: 700,
                  }}
                >{open ? 'Hide details' : 'Show all evidence'} ↓</button>

                {open && (
                  <div style={{
                    marginTop: 10, padding: '12px 14px',
                    background: '#FAFAF8', border: '1px solid #F0EDEA', borderRadius: 10,
                    display: 'grid', gap: 8, fontSize: '.85rem',
                  }}>
                    {social.linkedin && <KV2 label="LinkedIn" value={social.linkedin} link />}
                    {social.twitter  && <KV2 label="Twitter / X" value={social.twitter}  link />}
                    {social.github   && <KV2 label="GitHub"   value={social.github}    link />}
                    {social.other    && <KV2 label="Other"    value={social.other}     link />}
                    {r.document_url  && <KV2 label="Document URL" value={r.document_url} link />}
                    {r.applicant_notes && (
                      <div>
                        <div style={{
                          fontSize: '.7rem', fontWeight: 800, color: '#6B7280',
                          textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4,
                        }}>Applicant notes</div>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#1A1A1A', lineHeight: 1.55 }}>{r.applicant_notes}</p>
                      </div>
                    )}
                    {!social.linkedin && !social.twitter && !social.github && !social.other && !r.document_url && !r.applicant_notes && (
                      <p style={{ margin: 0, color: 'var(--h-muted)', fontStyle: 'italic' }}>No additional evidence provided.</p>
                    )}
                  </div>
                )}

                {/* Admin response area — only on pending. Shows admin's prior note on approved/rejected. */}
                {status === 'pending' ? (
                  <div style={{ marginTop: 10 }}>
                    <label style={{
                      display: 'block', fontSize: '.7rem', fontWeight: 800,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em',
                      marginBottom: 4,
                    }}>
                      Note for the owner (optional on approve, recommended on reject)
                    </label>
                    <textarea
                      value={notes[r.id] || ''}
                      onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))}
                      placeholder="Why this passes / what's missing — included in the email."
                      rows={2}
                      style={{
                        width: '100%', padding: '8px 10px',
                        background: '#FFF', border: '1px solid var(--h-border)', borderRadius: 8,
                        fontFamily: 'inherit', fontSize: '.85rem', color: '#1A1A1A',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                ) : r.admin_notes ? (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: '#FAFAF8', border: '1px solid #F0EDEA', borderRadius: 8 }}>
                    <div style={{
                      fontSize: '.7rem', fontWeight: 800, color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4,
                    }}>Note sent to owner</div>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#1A1A1A', fontSize: '.85rem', lineHeight: 1.5 }}>{r.admin_notes}</p>
                    {r.reviewed_at && (
                      <p style={{ margin: '4px 0 0', color: 'var(--h-muted)', fontSize: '.72rem' }}>
                        {formatDate(r.reviewed_at)}
                      </p>
                    )}
                  </div>
                ) : null}
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
                <a
                  href={`/dashboard/listings/${r.listing_uuid}/verify`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    fontSize: '.68rem', color: 'var(--h-muted)',
                    textDecoration: 'none', marginTop: 2,
                  }}
                >Owner view ↗</a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Tiny KV display helpers — self-contained so the page file stays one
   route component without yet another module on disk.                    */

function KV({ label, value, mono, flag }: {
  label: string
  value: string | null
  mono?: boolean
  flag?: { tone: 'ok' | 'warn'; label: string } | null
}) {
  if (!value) return (
    <div>
      <div style={{
        fontSize: '.62rem', fontWeight: 800, color: '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: '.06em',
      }}>{label}</div>
      <div style={{ color: 'var(--h-muted)', fontStyle: 'italic', fontSize: '.78rem' }}>—</div>
    </div>
  )
  return (
    <div>
      <div style={{
        fontSize: '.62rem', fontWeight: 800, color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: '.06em',
      }}>{label}</div>
      <div style={{
        fontFamily: mono ? 'var(--font-inter, ui-monospace), monospace' : 'inherit',
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        color: '#1A1A1A', fontWeight: 600, fontSize: '.85rem', wordBreak: 'break-word',
      }}>
        {value}
        {flag && (
          <span style={{
            display: 'inline-block', marginLeft: 8,
            fontSize: '.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: 999,
            background: flag.tone === 'ok' ? 'rgba(14,143,110,.12)' : 'rgba(180,83,9,.12)',
            color:      flag.tone === 'ok' ? '#0E8F6E' : '#9A3412',
            textTransform: 'uppercase', letterSpacing: '.06em',
          }}>{flag.label}</span>
        )}
      </div>
    </div>
  )
}

function KV2({ label, value, link }: { label: string; value: string; link?: boolean }) {
  if (!value) return null
  return (
    <div>
      <div style={{
        fontSize: '.7rem', fontWeight: 800, color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2,
      }}>{label}</div>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" style={{
          color: 'var(--h-accent, #E8553D)', fontWeight: 600, wordBreak: 'break-all',
        }}>{value}</a>
      ) : (
        <span style={{ color: '#1A1A1A', fontWeight: 600 }}>{value}</span>
      )}
    </div>
  )
}
