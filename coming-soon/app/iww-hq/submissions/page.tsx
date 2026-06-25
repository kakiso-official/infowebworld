'use client'

import { useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from 'react'
import './submissions.css'
import {
  fetchAllSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  type RealSubmission,
  type FaqItem,
} from '../data/submissions-storage'
import CategoryReassign from './CategoryReassign'
import DesignModeToggle from './DesignModeToggle'

/* ───────────────────────────────────────────────────────────────────
   /iww-hq/submissions
   Moderation console. Full-width filter toolbar (search · status ·
   mode · category · country · plan · sort) over a two-pane master/detail
   with bulk select + bulk actions. Fills the admin content area exactly
   (no 100vh overflow). Top bar carries the manual Vercel Deploy button.
   ─────────────────────────────────────────────────────────────────── */

type Status = RealSubmission['status']

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pending', confirmed: 'Confirmed', paid: 'Paid',
  active: 'Active', rejected: 'Rejected', suspended: 'Suspended',
}

const STATUS_TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'pending',   label: 'Pending'   },
  { key: 'active',    label: 'Active'    },
  { key: 'paid',      label: 'Paid'      },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'rejected',  label: 'Rejected'  },
  { key: 'all',       label: 'All'       },
]

const SORTS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'az',     label: 'Name A–Z' },
  { key: 'za',     label: 'Name Z–A' },
  { key: 'status', label: 'By status' },
] as const
type SortKey = (typeof SORTS)[number]['key']

/* Preview overlay viewport presets. width 0 = fill the stage (true desktop);
   fixed widths drive the page's real responsive breakpoints inside the iframe. */
const DEVICES = [
  { key: 'desktop', label: 'Desktop', w: 0 },
  { key: 'tablet',  label: 'Tablet',  w: 834 },
  { key: 'mobile',  label: 'Mobile',  w: 390 },
] as const
type DeviceKey = (typeof DEVICES)[number]['key']

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

/* Run async work in bounded-concurrency chunks so a bulk action over hundreds
   of rows never fires hundreds of simultaneous requests. */
async function runChunked<T>(items: T[], size: number, fn: (t: T) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn))
  }
}

export default function SubmissionsPage() {
  const [subs, setSubs] = useState<RealSubmission[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('pending')
  const [modeFilter, setModeFilter] = useState<'all' | 'product' | 'company'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [previewSub, setPreviewSub] = useState<RealSubmission | null>(null)

  const flash = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg })
    window.setTimeout(() => setToast(null), 2400)
  }

  const reload = async () => {
    try {
      setSubs(await fetchAllSubmissions())
    } catch (err) {
      console.error(err)
      flash('err', 'Could not load submissions.')
    }
  }

  useEffect(() => { reload() }, [])

  /* Global totals for the top bar — derived from the loaded set (no 2nd fetch). */
  const stats = useMemo(() => ({
    total: subs.length,
    pending: subs.filter(s => s.status === 'pending').length,
    active: subs.filter(s => s.status === 'active').length,
    paid: subs.filter(s => s.status === 'paid').length,
  }), [subs])

  /* Distinct filter option lists (with counts), built once from the full set so
     every value is reachable regardless of the current filter. */
  const catOptions = useMemo(() => tally(subs, s => s.category), [subs])
  const countryOptions = useMemo(() => tally(subs, s => s.country), [subs])
  const planOptions = useMemo(() => tally(subs, s => planShort(s.planName, s.plan)), [subs])

  /* Everything EXCEPT the status filter — so the status tab badges reflect the
     other active filters (e.g. "Pending (12)" when Mode = Companies). */
  const base = useMemo(() => {
    const q = search.trim().toLowerCase()
    return subs.filter(s =>
      (modeFilter === 'all' || s.listingMode === modeFilter) &&
      (categoryFilter === 'all' || s.category === categoryFilter) &&
      (countryFilter === 'all' || s.country === countryFilter) &&
      (planFilter === 'all' || planShort(s.planName, s.plan) === planFilter) &&
      (!q
        || s.companyName.toLowerCase().includes(q)
        || s.email.toLowerCase().includes(q)
        || s.contactName.toLowerCase().includes(q)
        || s.category.toLowerCase().includes(q)
        || s.country.toLowerCase().includes(q)
        || s.slug.toLowerCase().includes(q)),
    )
  }, [subs, modeFilter, categoryFilter, countryFilter, planFilter, search])

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: base.length }
    for (const s of base) out[s.status] = (out[s.status] || 0) + 1
    return out
  }, [base])

  const filtered = useMemo(() => {
    /* While searching, look across every status so a query like "siren" always
       surfaces the listing no matter which status tab is active. */
    const searching = search.trim().length > 0
    const out = (searching || statusFilter === 'all') ? [...base] : base.filter(s => s.status === statusFilter)
    out.sort((a, b) => {
      const ta = new Date(a.submittedAt).getTime() || 0
      const tb = new Date(b.submittedAt).getTime() || 0
      switch (sort) {
        case 'oldest': return ta - tb
        case 'az':     return a.companyName.localeCompare(b.companyName)
        case 'za':     return b.companyName.localeCompare(a.companyName)
        case 'status': return a.status.localeCompare(b.status) || tb - ta
        default:       return tb - ta
      }
    })
    return out
  }, [base, statusFilter, sort, search])

  const selected = useMemo(
    () => filtered.find(s => s.id === selectedId) || subs.find(s => s.id === selectedId) || null,
    [filtered, subs, selectedId],
  )

  /* Keep the detail pane populated as the filtered set changes. */
  useEffect(() => {
    if (filtered.length === 0) { setSelectedId(null); return }
    if (!selectedId || !filtered.find(f => f.id === selectedId)) setSelectedId(filtered[0].id)
  }, [filtered, selectedId])

  const filtersDirty =
    !!search || statusFilter !== 'pending' || modeFilter !== 'all' ||
    categoryFilter !== 'all' || countryFilter !== 'all' || planFilter !== 'all' || sort !== 'newest'

  const clearFilters = () => {
    setSearch(''); setStatusFilter('pending'); setModeFilter('all')
    setCategoryFilter('all'); setCountryFilter('all'); setPlanFilter('all'); setSort('newest')
  }

  /* ── selection (bulk) ── */
  const filteredIds = useMemo(() => filtered.map(f => f.id), [filtered])
  const allChecked = filteredIds.length > 0 && filteredIds.every(id => checked.has(id))
  const toggleOne = (id: string) =>
    setChecked(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const toggleAll = () =>
    setChecked(prev => {
      const n = new Set(prev)
      if (filteredIds.every(id => n.has(id))) filteredIds.forEach(id => n.delete(id))
      else filteredIds.forEach(id => n.add(id))
      return n
    })
  const clearChecked = () => setChecked(new Set())

  const setStatus = async (id: string, status: Status) => {
    setBusy(true)
    try {
      await updateSubmissionStatus(id, status)
      flash('ok', `Marked ${STATUS_LABEL[status].toLowerCase()}.`)
      await reload()
    } catch { flash('err', 'Status change failed.') } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Permanently delete this submission?')) return
    setBusy(true)
    try {
      await deleteSubmission(id)
      flash('ok', 'Deleted.')
      if (selectedId === id) setSelectedId(null)
      await reload()
    } catch { flash('err', 'Delete failed.') } finally { setBusy(false) }
  }

  const bulkStatus = async (status: Status) => {
    const ids = [...checked]
    if (!ids.length) return
    if (!confirm(`Mark ${ids.length} listing${ids.length > 1 ? 's' : ''} as ${STATUS_LABEL[status].toLowerCase()}?`)) return
    setBusy(true)
    try {
      await runChunked(ids, 6, id => updateSubmissionStatus(id, status))
      flash('ok', `${ids.length} listing${ids.length > 1 ? 's' : ''} marked ${STATUS_LABEL[status].toLowerCase()}.`)
      clearChecked(); await reload()
    } catch { flash('err', 'Bulk update failed.') } finally { setBusy(false) }
  }

  const bulkDelete = async () => {
    const ids = [...checked]
    if (!ids.length) return
    if (!confirm(`Permanently delete ${ids.length} listing${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBusy(true)
    try {
      await runChunked(ids, 6, id => deleteSubmission(id))
      flash('ok', `${ids.length} deleted.`)
      clearChecked(); await reload()
    } catch { flash('err', 'Bulk delete failed.') } finally { setBusy(false) }
  }

  const saveFaqs = async (id: string, faqs: FaqItem[]) => {
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
      setSubs(prev => prev.map(s => s.id === id ? { ...s, faqs } : s))
    } catch { flash('err', 'Could not save FAQs.') } finally { setBusy(false) }
  }

  return (
    <div className="sub-scope">
      {/* ─── Top bar ─────────────────────────── */}
      <header className="sub-top">
        <h1>Submissions</h1>
        <div className="sub-stats">
          <span className="sub-stat"><strong>{stats.total}</strong> total</span>
          <span className="sub-stat sub-stat--amber"><strong>{stats.pending}</strong> pending</span>
          <span className="sub-stat sub-stat--teal"><strong>{stats.active}</strong> active</span>
          <span className="sub-stat sub-stat--green"><strong>{stats.paid}</strong> paid</span>
        </div>
        <div className="sub-top-spacer" />
        <ExportButton />
        <DeployButton />
      </header>

      {/* ─── Filter toolbar ──────────────────── */}
      <div className="sub-toolbar">
        <div className="sub-tb-search">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search company, contact, email, country, slug…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="sub-seg" role="group" aria-label="Status">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              className={`sub-seg-btn ${statusFilter === t.key ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(t.key)}
            >
              {t.label}
              <span className="sub-seg-count">{counts[t.key] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="sub-tb-filters">
          <FilterSelect title="Listing mode" value={modeFilter} onChange={v => setModeFilter(v as typeof modeFilter)}>
            <option value="all">All types</option>
            <option value="company">Companies</option>
            <option value="product">Products</option>
          </FilterSelect>

          <FilterSelect title="Category" value={categoryFilter} onChange={setCategoryFilter}>
            <option value="all">All categories</option>
            {catOptions.map(([name, n]) => <option key={name} value={name}>{name} ({n})</option>)}
          </FilterSelect>

          <FilterSelect title="Country" value={countryFilter} onChange={setCountryFilter}>
            <option value="all">All countries</option>
            {countryOptions.map(([name, n]) => <option key={name} value={name}>{name} ({n})</option>)}
          </FilterSelect>

          <FilterSelect title="Plan" value={planFilter} onChange={setPlanFilter}>
            <option value="all">All plans</option>
            {planOptions.map(([name, n]) => <option key={name} value={name}>{name} ({n})</option>)}
          </FilterSelect>

          <FilterSelect title="Sort" value={sort} onChange={v => setSort(v as SortKey)}>
            {SORTS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </FilterSelect>

          {filtersDirty && (
            <button className="sub-clear" onClick={clearFilters} title="Reset all filters">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ─── Two-pane ────────────────────────── */}
      <div className="sub-layout">
        <aside className="sub-list">
          {/* List header / bulk bar */}
          {checked.size > 0 ? (
            <div className="sub-bulkbar">
              <span className="sub-bulk-n">{checked.size} selected</span>
              <div className="sub-bulk-actions">
                <button className="sub-bulk-btn sub-bulk-btn--go" disabled={busy} onClick={() => bulkStatus('active')}>Activate</button>
                <button className="sub-bulk-btn" disabled={busy} onClick={() => bulkStatus('rejected')}>Reject</button>
                <button className="sub-bulk-btn sub-bulk-btn--del" disabled={busy} onClick={bulkDelete}>Delete</button>
              </div>
              <button className="sub-bulk-x" onClick={clearChecked} title="Clear selection">✕</button>
            </div>
          ) : (
            <div className="sub-list-head">
              <label className="sub-check" title="Select all">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </label>
              <span className="sub-list-count">
                {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>
          )}

          <div className="sub-rows">
            {filtered.length === 0 ? (
              <div className="sub-empty">
                {statusFilter === 'pending' && !filtersDirty
                  ? 'Inbox zero — no pending submissions.'
                  : 'No listings match these filters.'}
              </div>
            ) : filtered.map(s => {
              const isActive = s.id === selectedId
              const isChecked = checked.has(s.id)
              return (
                <div key={s.id} className={`sub-row ${isActive ? 'is-active' : ''} ${isChecked ? 'is-checked' : ''}`}>
                  <label className="sub-check" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(s.id)}
                      aria-label={`Select ${s.companyName}`}
                    />
                  </label>
                  <button className="sub-row-main" onClick={() => setSelectedId(s.id)}>
                    <span className="sub-row-logo">
                      {s.logoUrl
                        ? <img src={s.logoUrl} alt="" />
                        : <span>{(s.companyName || '?').slice(0, 1).toUpperCase()}</span>}
                    </span>
                    <span className="sub-row-text">
                      <span className="sub-row-name">
                        {s.companyName}
                        {s.verified && <span className="sub-row-verified" title="Verified">✓</span>}
                      </span>
                      <span className="sub-row-meta">
                        <span className={`sub-tag sub-tag--${s.listingMode}`}>{s.listingMode === 'company' ? 'Company' : 'Product'}</span>
                        <span className="sub-dot">·</span>
                        <span className="sub-row-cat">{s.category || '—'}</span>
                        {s.country && <><span className="sub-dot">·</span><span>{s.country}</span></>}
                        <span className="sub-dot">·</span>
                        <span>{relativeAge(s.submittedAt)}</span>
                      </span>
                    </span>
                    <span className="sub-row-aside">
                      <span className={`sub-pill sub-pill--${s.status}`}>{STATUS_LABEL[s.status]}</span>
                      <span className={`sub-plan ${planClass(s.plan)}`}>{planShort(s.planName, s.plan)}</span>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </aside>

        <section className="sub-detail">
          {selected ? (
            <SubmissionDetail
              key={selected.id}
              sub={selected}
              busy={busy}
              onSetStatus={setStatus}
              onDelete={remove}
              onSaveFaqs={saveFaqs}
              onPreview={setPreviewSub}
              onEnriched={reload}
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

      {previewSub && (
        <PreviewOverlay
          sub={previewSub}
          busy={busy}
          onClose={() => setPreviewSub(null)}
          onSetStatus={setStatus}
        />
      )}

      {toast && (
        <div className={`sub-toast ${toast.kind === 'ok' ? 'is-success' : 'is-error'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

/* Distinct values + counts, sorted alphabetically, blanks dropped. */
function tally(subs: RealSubmission[], pick: (s: RealSubmission) => string): [string, number][] {
  const m = new Map<string, number>()
  for (const s of subs) {
    const v = (pick(s) || '').trim()
    if (v) m.set(v, (m.get(v) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

/* Styled native select with a chevron. */
function FilterSelect({
  value, onChange, title, children,
}: { value: string; onChange: (v: string) => void; title: string; children: ReactNode }) {
  return (
    <div className="sub-select">
      <select value={value} onChange={e => onChange(e.target.value)} aria-label={title} title={title}>
        {children}
      </select>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
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
  onPreview: (sub: RealSubmission) => void
  onEnriched: () => void | Promise<void>
  flash: (kind: 'ok' | 'err', msg: string) => void
}

function SubmissionDetail({ sub, busy, onSetStatus, onDelete, onSaveFaqs, onPreview, onEnriched, flash }: DetailProps) {
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
            <span className={`sub-tag sub-tag--${sub.listingMode}`}>{sub.listingMode === 'company' ? 'Company' : 'Product'}</span>
            <span className={`sub-plan ${planClass(sub.plan)}`}>{planShort(sub.planName, sub.plan)}</span>
            {sub.category && <><span className="sub-dot">·</span><span style={{ fontSize: 12, color: 'var(--mute)' }}>{sub.category}</span></>}
            <span className="sub-dot">·</span>
            <span style={{ fontSize: 12, color: 'var(--mute)' }}>Submitted {relativeAge(sub.submittedAt)}</span>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sub-actions">
        <button
          className="sub-btn sub-btn--preview"
          onClick={() => onPreview(sub)}
          title="Open the exact public page this submission will render after approval"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview as published
        </button>

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
        <GeminiEnrichButton id={sub.id} hasWebsite={!!sub.website} flash={flash} onDone={onEnriched} />
        <a className="sub-btn sub-btn--ink" href={`/iww-hq/submissions/${sub.id}/edit`}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
          Edit listing
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

      {/* Category & hierarchy — admin reassignment (L1 sector → deepest level) */}
      <CategoryReassign
        submissionId={sub.id}
        currentSlug={sub.categorySlug}
        currentName={sub.category}
        isLive={isLive}
        busy={busy}
        onSaved={onEnriched}
        flash={flash}
      />

      <DesignModeToggle
        submissionId={sub.id}
        categorySlug={sub.categorySlug}
        current={sub.lbDesignMode}
        busy={busy}
        onSaved={onEnriched}
        flash={flash}
      />

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

      {/* FAQ editor — keyed by id so it re-inits per submission (no reset effect). */}
      <FaqEditor key={sub.id} sub={sub} onSave={onSaveFaqs} busy={busy} />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Preview overlay — full-screen, isolated render of the live public page.
   ───────────────────────────────────────────────────────────────────── */
function PreviewOverlay({
  sub, busy, onClose, onSetStatus,
}: {
  sub: RealSubmission
  busy: boolean
  onClose: () => void
  onSetStatus: (id: string, status: Status) => void | Promise<void>
}) {
  const [device, setDevice] = useState<DeviceKey>('desktop')
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  const pushData = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'iww-sub-preview-data', sub },
      window.location.origin,
    )
  }, [sub])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if ((e.data as { type?: string } | null)?.type === 'iww-sub-preview-ready') pushData()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [pushData])

  useEffect(() => { pushData() }, [pushData])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isPending = sub.status === 'pending'
  const isLive = sub.status === 'active' || sub.status === 'paid'
  const publicPath = sub.listingMode === 'company' ? `/profile/${sub.slug}` : `/listing/${sub.slug}`
  const deviceW = DEVICES.find(d => d.key === device)?.w ?? 0

  return (
    <div className="sub-pv" role="dialog" aria-modal="true" aria-label={`Preview of ${sub.companyName}`}>
      <div className="sub-pv-bar">
        <div className="sub-pv-bar-l">
          <span className="sub-pv-logo">
            {sub.logoUrl
              ? <img src={sub.logoUrl} alt="" />
              : <span>{(sub.companyName || '?').slice(0, 1).toUpperCase()}</span>}
          </span>
          <span className="sub-pv-titles">
            <span className="sub-pv-name">{sub.companyName}</span>
            <span className="sub-pv-sub">
              {sub.listingMode === 'company' ? 'Company profile' : 'Product listing'}
              {' · exactly how the public page renders'}
            </span>
          </span>
          <span className={`sub-pill sub-pill--${sub.status}`}>{STATUS_LABEL[sub.status]}</span>
        </div>

        <div className="sub-pv-devices" role="group" aria-label="Preview width">
          {DEVICES.map(d => (
            <button
              key={d.key}
              type="button"
              className={`sub-pv-device ${device === d.key ? 'is-active' : ''}`}
              onClick={() => setDevice(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="sub-pv-bar-r">
          {isPending && (
            <>
              <button className="sub-btn sub-btn--primary" disabled={busy}
                onClick={async () => { await onSetStatus(sub.id, 'active'); onClose() }}>
                Approve &amp; activate
              </button>
              <button className="sub-btn sub-btn--danger" disabled={busy}
                onClick={async () => { await onSetStatus(sub.id, 'rejected'); onClose() }}>
                Reject
              </button>
            </>
          )}
          {isLive && sub.slug && (
            <a className="sub-btn sub-btn--ghost" href={publicPath} target="_blank" rel="noopener noreferrer">
              Open live ↗
            </a>
          )}
          <button className="sub-pv-close" onClick={onClose} aria-label="Close preview" title="Close (Esc)">✕</button>
        </div>
      </div>

      <div className="sub-pv-stage">
        <div
          className={`sub-pv-screen sub-pv-screen--${device}`}
          style={deviceW ? { width: deviceW } : undefined}
        >
          <iframe
            ref={frameRef}
            className="sub-pv-frame"
            src="/preview/submission"
            title={`Preview of ${sub.companyName}`}
            onLoad={pushData}
          />
        </div>
      </div>
    </div>
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

/* ── Status switcher (non-pending listings) ────────────────────────── */
function StatusSwitcher({
  status, disabled, onChange,
}: { status: Status; disabled: boolean; onChange: (s: Status) => void }) {
  return (
    <div className="sub-switch">
      {(['pending', 'confirmed', 'paid', 'active', 'rejected'] as Status[]).map(s => {
        const active = s === status
        return (
          <button
            key={s}
            disabled={disabled || active}
            onClick={() => onChange(s)}
            className={`sub-switch-btn ${active ? 'is-active' : ''}`}
          >{s}</button>
        )
      })}
    </div>
  )
}

/* ── Rebuild button — /api/admin/listings/[slug]/revalidate ────────── */
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
    } catch { flash('err', 'Network error.') } finally { setBusy(false) }
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

/* ── Gemini enrich — reads the company's own website and fills ONLY the
   empty fields with real info found there (never overwrites, never invents). ── */
function GeminiEnrichButton({
  id, hasWebsite, flash, onDone,
}: { id: string; hasWebsite: boolean; flash: (k: 'ok' | 'err', m: string) => void; onDone: () => void | Promise<void> }) {
  const [busy, setBusy] = useState(false)

  const click = async () => {
    if (busy) return
    if (!hasWebsite) { flash('err', 'No website on this listing for Gemini to read.'); return }
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/submissions/${id}/ai-enrich`, { method: 'POST', credentials: 'same-origin' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) { flash('err', j?.error || 'Gemini enrich failed.'); return }
      const filled = (j.filled || []) as { field: string; value: string }[]
      if (!filled.length) { flash('ok', j.message || 'Gemini found nothing new to add.'); return }
      flash('ok', `Gemini filled ${filled.length} field${filled.length > 1 ? 's' : ''}: ${filled.map(f => f.field).join(', ')}`)
      await onDone()
    } catch { flash('err', 'Network error.') } finally { setBusy(false) }
  }

  return (
    <button
      className="sub-btn sub-btn--ink"
      onClick={click}
      disabled={busy}
      title="Gemini reads this company's website and fills ONLY the empty fields with real info found there — it never overwrites existing data and never invents."
    >
      {busy ? 'Asking Gemini…' : '✨ Gemini fill'}
    </button>
  )
}

/* ── Deploy button — fires the Vercel deploy hook ──────────────────── */
/* ── Export live listings → CSV (opens in Excel) ───────────────────────
   Hits the admin export endpoint, which returns a UTF-8 CSV of every live
   listing — companies AND products (the Mode column distinguishes them) —
   with name, website, email, sector, plan, review stats, … We fetch-then-
   blob (rather than a bare <a href>) so the admin cookie is sent, the row
   count can flash on success, and errors surface inline. */
function ExportButton() {
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState('')
  const [error, setError] = useState('')

  const click = async () => {
    if (busy) return
    setBusy(true); setError(''); setFlash('')
    try {
      const res = await fetch('/api/admin/submissions/export?mode=all&status=live', { credentials: 'same-origin' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || `Export failed (${res.status}).`)
        return
      }
      const count = res.headers.get('X-Export-Count') || ''
      const cd = res.headers.get('Content-Disposition') || ''
      const filename = cd.match(/filename="([^"]+)"/)?.[1] || 'infowebworld-live-listings.csv'
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename; a.click()
      URL.revokeObjectURL(url)
      setFlash(count ? `✓ ${Number(count).toLocaleString()} rows` : '✓ Downloaded')
      window.setTimeout(() => setFlash(''), 4000)
    } catch { setError('Network error.') } finally { setBusy(false) }
  }

  return (
    <>
      {error && (
        <span style={{ fontSize: 11.5, color: 'var(--red)', fontWeight: 600 }}>
          {error}
        </span>
      )}
      <button
        className="sub-export"
        onClick={click}
        disabled={busy}
        title="Download a CSV (opens in Excel) of every live listing — companies and products — with name, website, email, sector, plan, reviews and more."
      >
        {busy ? 'Exporting…' : flash || 'Export listings'}
      </button>
    </>
  )
}

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
    } catch { setError('Network error.') } finally { setBusy(false) }
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

/* ── FAQ editor ────────────────────────────────────────────────────── */
function FaqEditor({
  sub, busy, onSave,
}: { sub: RealSubmission; busy: boolean; onSave: (id: string, faqs: FaqItem[]) => void | Promise<void> }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(
    sub.faqs?.length > 0 ? sub.faqs : [{ question: '', answer: '' }]
  )
  const [dirty, setDirty] = useState(false)

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
