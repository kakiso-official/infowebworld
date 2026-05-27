'use client'

import { useEffect, useMemo, useState } from 'react'
import './submissions.css'
import {
  fetchAllSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  fetchSubmissionStats,
  type RealSubmission,
  type FaqItem,
} from '../data/submissions-storage'

/* ───────────────────────────────────────────────────────────────────
   /iww-hq/submissions
   Two-pane moderation UI styled to match the public listing page.
   Left: filterable list. Right: detail panel with action bar +
   sectioned content. Top bar has the manual Vercel Deploy button.
   ─────────────────────────────────────────────────────────────────── */

type Status = RealSubmission['status']

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pending', confirmed: 'Confirmed', paid: 'Paid',
  active: 'Active', rejected: 'Rejected', suspended: 'Suspended',
}

const STATUS_TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'pending',   label: 'Pending'   },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'paid',      label: 'Paid'      },
  { key: 'active',    label: 'Active'    },
  { key: 'rejected',  label: 'Rejected'  },
  { key: 'all',       label: 'All'       },
]

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function relativeAge(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.floor(day / 30)
  return `${mo}mo ago`
}

/* Plan slugs we know about → CSS modifier. Anything else falls through to
   the neutral "free"-style chip so unknown plans still render. */
function planClass(plan: string): string {
  const p = (plan || '').toLowerCase()
  if (p.includes('founding')) return 'sub-plan--founding'
  if (p.includes('early'))    return 'sub-plan--early'
  if (p.includes('starter'))  return 'sub-plan--starter'
  return 'sub-plan--free'
}

function planShort(name: string, slug: string): string {
  if (name && name.trim()) return name.trim()
  const s = (slug || '').toLowerCase()
  if (s.includes('founding')) return 'Elite Founding'
  if (s.includes('early'))    return 'Early Adopter'
  if (s.includes('starter'))  return 'Starter'
  return 'Free'
}

export default function SubmissionsPage() {
  const [subs, setSubs] = useState<RealSubmission[]>([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Status | 'all'>('pending')
  /* Listing-mode filter — independent from the status tabs. Lets admins
     focus the queue on Companies vs Products without losing the status
     bucket. Defaults to 'all' so behavior matches the pre-feature page. */
  const [modeFilter, setModeFilter] = useState<'all' | 'product' | 'company'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, paid: 0 })
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  const flash = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg })
    window.setTimeout(() => setToast(null), 2400)
  }

  const reload = async () => {
    try {
      const [s, st] = await Promise.all([fetchAllSubmissions(), fetchSubmissionStats()])
      setSubs(s); setStats(st)
    } catch (err) {
      console.error(err)
      flash('err', 'Could not load submissions.')
    }
  }

  useEffect(() => { reload() }, [])

  /* Counts per status — drives the tab badges. */
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: subs.length }
    for (const s of subs) out[s.status] = (out[s.status] || 0) + 1
    return out
  }, [subs])

  const modeCounts = useMemo(() => {
    let companies = 0, products = 0
    for (const s of subs) {
      if (s.listingMode === 'company') companies++
      else products++
    }
    return { all: subs.length, product: products, company: companies }
  }, [subs])

  /* Filter + search. Keeps the most recent submission first. */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return subs
      .filter(s => tab === 'all' ? true : s.status === tab)
      .filter(s => modeFilter === 'all' ? true : s.listingMode === modeFilter)
      .filter(s => !q
        || s.companyName.toLowerCase().includes(q)
        || s.email.toLowerCase().includes(q)
        || s.contactName.toLowerCase().includes(q)
        || s.category.toLowerCase().includes(q)
        || s.slug.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [subs, tab, modeFilter, search])

  const selected = useMemo(
    () => filtered.find(s => s.id === selectedId) || subs.find(s => s.id === selectedId) || null,
    [filtered, subs, selectedId]
  )

  /* When switching tabs, auto-select the first row in that bucket so the
     detail pane never goes blank for too long. */
  useEffect(() => {
    if (filtered.length === 0) { setSelectedId(null); return }
    if (!selectedId || !filtered.find(f => f.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId])

  const setStatus = async (id: string, status: Status) => {
    setBusy(true)
    try {
      await updateSubmissionStatus(id, status)
      flash('ok', `Marked ${STATUS_LABEL[status].toLowerCase()}.`)
      await reload()
    } catch {
      flash('err', 'Status change failed.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Permanently delete this submission?')) return
    setBusy(true)
    try {
      await deleteSubmission(id)
      flash('ok', 'Deleted.')
      if (selectedId === id) setSelectedId(null)
      await reload()
    } catch {
      flash('err', 'Delete failed.')
    } finally {
      setBusy(false)
    }
  }

  const saveFaqs = async (id: string, faqs: FaqItem[]) => {
    /* PUT /api/submissions/[id] handles full updates, including FAQs. */
    setBusy(true)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs }),
      })
      if (!res.ok) throw new Error()
      flash('ok', 'FAQs saved.')
      /* Optimistically merge into local state so the panel updates immediately. */
      setSubs(prev => prev.map(s => s.id === id ? { ...s, faqs } : s))
    } catch {
      flash('err', 'Could not save FAQs.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sub-scope">
      <header className="sub-top">
        <h1>Submissions</h1>
        <div className="sub-stats">
          <span className="sub-stat"><strong>{stats.total}</strong> total</span>
          <span className="sub-stat"><strong>{stats.pending}</strong> pending</span>
          <span className="sub-stat"><strong>{stats.paid}</strong> paid</span>
        </div>
        <div className="sub-top-spacer" />
        <DeployButton />
      </header>

      <div className="sub-layout">
        {/* ─── List pane ───────────────────────── */}
        <aside className="sub-list">
          <div className="sub-search">
            <input
              type="search"
              placeholder="Search company, contact, email, slug…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="sub-tabs">
            {STATUS_TABS.map(t => {
              const n = counts[t.key] ?? 0
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  className={`sub-tab ${active ? 'is-active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  <span className="sub-tab-count">{n}</span>
                </button>
              )
            })}
          </div>

          {/* Listing-mode filter — orthogonal to the status tabs above. */}
          <div className="sub-mode-filter" role="group" aria-label="Listing mode filter">
            {(['all', 'product', 'company'] as const).map(m => {
              const active = modeFilter === m
              const label = m === 'all' ? 'All' : m === 'product' ? 'Products' : 'Companies'
              return (
                <button
                  key={m}
                  type="button"
                  className={`sub-mode-chip ${active ? 'is-active' : ''}`}
                  onClick={() => setModeFilter(m)}
                >
                  {label}
                  <span className="sub-mode-chip-count">{modeCounts[m]}</span>
                </button>
              )
            })}
          </div>

          <div className="sub-rows">
            {filtered.length === 0 ? (
              <div className="sub-empty">
                {tab === 'pending'
                  ? 'Inbox zero — no pending submissions.'
                  : 'No matches.'}
              </div>
            ) : filtered.map(s => {
              const isActive = s.id === selectedId
              return (
                <button
                  key={s.id}
                  className={`sub-row ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="sub-row-logo">
                    {s.logoUrl
                      ? <img src={s.logoUrl} alt="" />
                      : <span>{(s.companyName || '?').slice(0, 1).toUpperCase()}</span>}
                  </span>
                  <span className="sub-row-text">
                    <span className="sub-row-name">{s.companyName}</span>
                    <span className="sub-row-meta">
                      <span className={`sub-plan ${planClass(s.plan)}`}>
                        {planShort(s.planName, s.plan)}
                      </span>
                      <span className="sub-dot">·</span>
                      <span>{s.category || '—'}</span>
                      <span className="sub-dot">·</span>
                      <span>{relativeAge(s.submittedAt)}</span>
                    </span>
                  </span>
                  <span className="sub-row-aside">
                    <span className={`sub-pill sub-pill--${s.status}`}>{STATUS_LABEL[s.status]}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* ─── Detail pane ─────────────────────── */}
        <section className="sub-detail">
          {selected ? (
            <SubmissionDetail
              key={selected.id}
              sub={selected}
              busy={busy}
              onSetStatus={setStatus}
              onDelete={remove}
              onSaveFaqs={saveFaqs}
              flash={flash}
            />
          ) : (
            <div className="sub-detail-empty">
              <div className="sub-detail-empty-title">Select a submission</div>
              <div>Pick one from the list to start moderating.</div>
            </div>
          )}
        </section>
      </div>

      {toast && (
        <div className={`sub-toast ${toast.kind === 'ok' ? 'is-success' : 'is-error'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Detail panel — hero + sticky action bar + sectioned content
   ───────────────────────────────────────────────────────────────────── */

interface DetailProps {
  sub: RealSubmission
  busy: boolean
  onSetStatus: (id: string, status: Status) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onSaveFaqs: (id: string, faqs: FaqItem[]) => void | Promise<void>
  flash: (kind: 'ok' | 'err', msg: string) => void
}

function SubmissionDetail({ sub, busy, onSetStatus, onDelete, onSaveFaqs, flash }: DetailProps) {
  const isLive = sub.status === 'active' || sub.status === 'paid'
  const isPending = sub.status === 'pending'

  return (
    <>
      {/* Hero */}
      <div className="sub-hero">
        <div className="sub-hero-logo">
          {sub.logoUrl
            ? <img src={sub.logoUrl} alt={sub.companyName} />
            : <span>{(sub.companyName || '?').slice(0, 1).toUpperCase()}</span>}
        </div>
        <div>
          <h2 className="sub-hero-name">{sub.companyName}</h2>
          {sub.tagline && <p className="sub-hero-tagline">{sub.tagline}</p>}
          <div className="sub-hero-meta">
            <span className={`sub-pill sub-pill--${sub.status}`}>{STATUS_LABEL[sub.status]}</span>
            <span className={`sub-plan ${planClass(sub.plan)}`}>{planShort(sub.planName, sub.plan)}</span>
            {sub.category && <><span className="sub-dot">·</span><span style={{ fontSize: 12, color: 'var(--mute)' }}>{sub.category}</span></>}
            <span className="sub-dot">·</span>
            <span style={{ fontSize: 12, color: 'var(--mute)' }}>Submitted {relativeAge(sub.submittedAt)}</span>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sub-actions">
        {isPending && (
          <>
            <button className="sub-btn sub-btn--primary" disabled={busy}
              onClick={() => onSetStatus(sub.id, 'active')}>
              Approve & activate
            </button>
            <button className="sub-btn sub-btn--ghost" disabled={busy}
              onClick={() => onSetStatus(sub.id, 'confirmed')}>
              Mark confirmed
            </button>
            <button className="sub-btn sub-btn--danger" disabled={busy}
              onClick={() => onSetStatus(sub.id, 'rejected')}>
              Reject
            </button>
          </>
        )}
        {!isPending && (
          <StatusSwitcher status={sub.status} disabled={busy}
            onChange={s => onSetStatus(sub.id, s)} />
        )}

        {isLive && sub.slug && (
          <RebuildButton slug={sub.slug} flash={flash} />
        )}

        <div className="sub-actions-spacer" />

        {isLive && sub.slug && (
          <a
            className="sub-btn sub-btn--ghost"
            href={sub.listingMode === 'company' ? `/profile/${sub.slug}` : `/listing/${sub.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View live ↗
          </a>
        )}
        <a className="sub-btn sub-btn--ghost" href={`/dashboard/listings/${sub.id}/edit`} target="_blank" rel="noopener noreferrer">
          Edit ↗
        </a>
        <button className="sub-btn sub-btn--danger" disabled={busy}
          onClick={() => onDelete(sub.id)}>
          Delete
        </button>
      </div>

      {/* Business info */}
      <section className="sub-sec">
        <header className="sub-sec-h">
          <h3 className="sub-sec-title">Business info</h3>
          <span className="sub-sec-sub">id {sub.id}</span>
        </header>
        <dl className="sub-grid">
          <KV label="Contact"  value={sub.contactName} />
          <KV label="Email"    value={sub.email} link={sub.email ? `mailto:${sub.email}` : ''} />
          <KV label="Phone"    value={sub.phone ? `${sub.phoneCode || ''} ${sub.phone}`.trim() : ''} />
          <KV label="Website"  value={sub.website} link={sub.website} external />
          <KV label="Slug"     value={sub.slug ? (sub.listingMode === 'company' ? `/profile/${sub.slug}` : `/listing/${sub.slug}`) : ''} />
          <KV label="Listing type" value={sub.listingType} />
        </dl>
      </section>

      {/* Listing details */}
      <section className="sub-sec">
        <header className="sub-sec-h">
          <h3 className="sub-sec-title">Listing details</h3>
        </header>
        <dl className="sub-grid">
          <KV label="Category" value={sub.category} />
          <KV label="Country"  value={sub.country} />
          <KV label="State"    value={sub.state} />
          <KV label="City"     value={sub.city} />
          <KV label="Founded"  value={sub.founded} />
          <KV label="Team size" value={sub.employees} />
          <KV label="Funding"  value={sub.funding} />
          <KV label="HQ"       value={sub.hqLocation} />
          <KV label="LinkedIn" value={sub.linkedin} link={sub.linkedin} external />
          <KV label="Twitter"  value={sub.twitter} link={sub.twitter} external />
          <KV label="Facebook" value={sub.facebook} link={sub.facebook} external />
        </dl>
        {sub.description && (
          <>
            <header className="sub-sec-h" style={{ marginTop: 18 }}>
              <h3 className="sub-sec-title">Description</h3>
            </header>
            <p className="sub-desc">{sub.description}</p>
          </>
        )}
      </section>

      {/* Highlights — features + integrations */}
      {(sub.features?.length > 0 || sub.integrations?.length > 0) && (
        <section className="sub-sec">
          <header className="sub-sec-h">
            <h3 className="sub-sec-title">Features & integrations</h3>
          </header>
          {sub.features?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div className="sub-sec-sub" style={{ marginBottom: 8 }}>Features</div>
              <div className="sub-chips">
                {sub.features.map((f, i) => <span key={i} className="sub-chip">{f}</span>)}
              </div>
            </div>
          )}
          {sub.integrations?.length > 0 && (
            <div>
              <div className="sub-sec-sub" style={{ marginBottom: 8 }}>Integrations</div>
              <div className="sub-chips">
                {sub.integrations.map((it, i) => (
                  <span key={i} className="sub-chip">{typeof it === 'string' ? it : it.name}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Plan + status */}
      <section className="sub-sec">
        <header className="sub-sec-h">
          <h3 className="sub-sec-title">Plan & status</h3>
        </header>
        <dl className="sub-grid">
          <KV label="Plan"   value={planShort(sub.planName, sub.plan)} />
          <KV label="Status" value={STATUS_LABEL[sub.status]} />
          <KV label="Submitted" value={formatDate(sub.submittedAt)} />
          <KV label="Approved at" value={sub.approvedAt ? formatDate(sub.approvedAt) : '—'} />
        </dl>
      </section>

      {/* FAQ editor */}
      <FaqEditor sub={sub} onSave={onSaveFaqs} busy={busy} />
    </>
  )
}

/* ── Key-value row ─────────────────────────────────────────────────── */
function KV({
  label, value, link, external, full,
}: { label: string; value: string; link?: string; external?: boolean; full?: boolean }) {
  if (!value) return null
  return (
    <div className={`sub-row-kv ${full ? 'sub-row-kv--full' : ''}`}>
      <dt>{label}</dt>
      <dd>
        {link
          ? <a href={link} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{value}{external ? ' ↗' : ''}</a>
          : value}
      </dd>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Status switcher (used for non-pending listings to flip between states)
   ───────────────────────────────────────────────────────────────────── */
function StatusSwitcher({
  status, disabled, onChange,
}: { status: Status; disabled: boolean; onChange: (s: Status) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 3, border: '1px solid var(--border)', borderRadius: 6, background: '#fff' }}>
      {(['pending', 'confirmed', 'paid', 'active', 'rejected'] as Status[]).map(s => {
        const active = s === status
        return (
          <button
            key={s}
            disabled={disabled || active}
            onClick={() => onChange(s)}
            style={{
              padding: '4px 10px',
              border: 0, borderRadius: 4,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? '#fff' : 'var(--body)',
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '.04em',
              cursor: active ? 'default' : 'pointer',
              opacity: disabled && !active ? .5 : 1,
            }}
          >{s}</button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Rebuild button — calls /api/admin/listings/[slug]/revalidate
   ───────────────────────────────────────────────────────────────────── */
function RebuildButton({ slug, flash }: { slug: string; flash: (k: 'ok' | 'err', m: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const click = async () => {
    if (busy) return
    setBusy(true); setDone(false)
    try {
      const res = await fetch(`/api/admin/listings/${encodeURIComponent(slug)}/revalidate`, {
        method: 'POST', credentials: 'same-origin',
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) {
        flash('err', j?.error || 'Rebuild failed.')
      } else {
        setDone(true)
        flash('ok', 'Static page rebuilt.')
        window.setTimeout(() => setDone(false), 2400)
      }
    } catch {
      flash('err', 'Network error.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      className={`sub-btn sub-btn--ink ${done ? 'is-success' : ''}`}
      onClick={click}
      disabled={busy}
      title="Force-rebuild this listing's static page right now (skips the 48h auto-refresh)."
    >
      {busy ? 'Rebuilding…' : done ? '✓ Rebuilt' : 'Rebuild static'}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Deploy button — fires the Vercel deploy hook (manual, not on every approve).
   Lets pending-approved listings go live whenever the admin decides.
   ───────────────────────────────────────────────────────────────────── */
function DeployButton() {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const click = async () => {
    if (busy) return
    if (!confirm('Trigger a Vercel production deploy now? Pending-approved listings will go live after the build finishes (~1-2 min).')) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/deploy', { method: 'POST', credentials: 'same-origin' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) {
        setError(j?.error || 'Deploy failed.')
      } else {
        setDone(true)
        window.setTimeout(() => setDone(false), 4000)
      }
    } catch {
      setError('Network error.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {error && (
        <span style={{ fontSize: 11.5, color: 'var(--red)', fontWeight: 600 }}>
          {error}
        </span>
      )}
      <button
        className={`sub-deploy ${done ? 'is-success' : ''}`}
        onClick={click}
        disabled={busy}
        title="Triggers the Vercel deploy hook. Build runs ~1-2 min; new approved listings go live after."
      >
        {busy ? 'Deploying…' : done ? '✓ Build queued' : 'Deploy'}
      </button>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   FAQ editor — inline rows of question / answer pairs.
   ───────────────────────────────────────────────────────────────────── */
function FaqEditor({
  sub, busy, onSave,
}: { sub: RealSubmission; busy: boolean; onSave: (id: string, faqs: FaqItem[]) => void | Promise<void> }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(
    sub.faqs?.length > 0 ? sub.faqs : [{ question: '', answer: '' }]
  )
  const [dirty, setDirty] = useState(false)

  /* Reset whenever the selected submission changes. */
  useEffect(() => {
    setFaqs(sub.faqs?.length > 0 ? sub.faqs : [{ question: '', answer: '' }])
    setDirty(false)
  }, [sub.id, sub.faqs])

  const update = (idx: number, key: keyof FaqItem, val: string) => {
    setFaqs(prev => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f))
    setDirty(true)
  }
  const add = () => {
    if (faqs.length >= 12) return
    setFaqs(prev => [...prev, { question: '', answer: '' }])
    setDirty(true)
  }
  const remove = (idx: number) => {
    setFaqs(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)
    setDirty(true)
  }
  const save = () => {
    const cleaned = faqs.filter(f => f.question.trim() && f.answer.trim())
    onSave(sub.id, cleaned)
    setDirty(false)
  }

  return (
    <section className="sub-sec">
      <header className="sub-sec-h">
        <h3 className="sub-sec-title">FAQs</h3>
        <span className="sub-sec-sub">{faqs.filter(f => f.question.trim() && f.answer.trim()).length} populated</span>
      </header>
      <div className="sub-faqs">
        {faqs.map((f, i) => (
          <div key={i} className="sub-faq">
            <input
              type="text"
              placeholder="Question"
              value={f.question}
              onChange={e => update(i, 'question', e.target.value)}
            />
            <textarea
              placeholder="Answer"
              value={f.answer}
              onChange={e => update(i, 'answer', e.target.value)}
            />
            <div className="sub-faq-actions">
              <button className="sub-faq-icon-btn" title="Remove" onClick={() => remove(i)}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1.5 14a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        <button className="sub-faq-add" onClick={add} disabled={faqs.length >= 12}>+ Add FAQ</button>
        <div style={{ flex: 1 }} />
        {dirty && (
          <button className="sub-btn sub-btn--ink" onClick={save} disabled={busy}>
            Save FAQs
          </button>
        )}
      </div>
    </section>
  )
}
