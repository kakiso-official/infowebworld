'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import '@/app/styles/scraper.css'
import SessionTimeline from './SessionTimeline'
import AddCompaniesModal from './AddCompaniesModal'

interface Job {
  id: number
  slug: string
  company_name: string | null
  website: string
  category_l1: string
  category_slug: string | null
  status: string
  total_sessions: number
  total_cost_usd: number
  last_session_id: number | null
  queued_at: string
  applied_at: string | null
  has_screenshot_home: boolean
  has_screenshot_secondary: boolean
}

interface Session {
  id: number
  status: string
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  total_steps: number
  failed_steps: number
  total_input_tokens: number
  total_output_tokens: number
  total_cost_usd: number
  pages_fetched: number
  llm_provider: string | null
  model_version: string | null
  applied_at: string | null
  error_summary: string | null
}

interface JobDetail {
  job: Job & {
    extracted: Record<string, unknown> | null
    citations: Record<string, unknown> | null
    screenshot_home_url: string | null
    screenshot_secondary_url: string | null
  }
  sessions: Session[]
}

interface Stats {
  status: Record<string, number>
  l1: Record<string, Record<string, number>>
  sevenDay: { cost: number; sessions: number }
  workerLikelyOnline: boolean
  lastActivityAt: string | null
}

const STATUS_ORDER = ['queued', 'running', 'review', 'applied', 'failed', 'skipped'] as const
const L1_OPTIONS = [
  { value: '', label: 'All sectors' },
  { value: 'ai-and-ml', label: 'AI & ML' },
  { value: 'software-and-saas', label: 'Software & SaaS' },
  { value: 'it-services-and-agencies', label: 'IT Services & Agencies' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'startups', label: 'Startups' },
  { value: 'local-businesses', label: 'Local Businesses' },
]

export default function ScraperShell() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState({ l1: '', status: '', q: '' })
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters.l1) params.set('l1', filters.l1)
    if (filters.status) params.set('status', filters.status)
    if (filters.q) params.set('q', filters.q)

    try {
      const [statsRes, jobsRes] = await Promise.all([
        fetch('/api/admin/scrape/stats', { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/admin/scrape/jobs?' + params.toString(), { cache: 'no-store' }).then(r => r.json()),
      ])
      if (statsRes.ok) setStats(statsRes)
      if (jobsRes.ok) setJobs(jobsRes.jobs)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 4000)
    return () => clearInterval(id)
  }, [refresh])

  const selected = useMemo(() => jobs.find(j => j.id === selectedJobId) ?? null, [jobs, selectedJobId])

  return (
    <div className="scrp">
      {/* ─── Top bar ─────────────────────────────────────────── */}
      <header className="scrp-top">
        <div className="scrp-top-left">
          <h1 className="scrp-title">Scraper</h1>
          <div className="scrp-pills">
            {STATUS_ORDER.map(s => {
              const count = stats?.status?.[s] ?? 0
              return (
                <button
                  key={s}
                  type="button"
                  className={`scrp-pill scrp-pill--${s} ${filters.status === s ? 'is-active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, status: f.status === s ? '' : s }))}
                >
                  <span className="scrp-pill-dot" /> {s} <span className="scrp-pill-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="scrp-top-right">
          <div className="scrp-worker">
            <span className={`scrp-worker-dot ${stats?.workerLikelyOnline ? 'is-online' : 'is-offline'}`} />
            <span>Worker {stats?.workerLikelyOnline ? 'online' : 'offline'}</span>
            {!stats?.workerLikelyOnline && (
              <code className="scrp-worker-hint">npm run scrape:worker</code>
            )}
          </div>
          <div className="scrp-spend">
            7d: <strong>${(stats?.sevenDay.cost ?? 0).toFixed(2)}</strong>
            <span className="scrp-spend-sub">{stats?.sevenDay.sessions ?? 0} sessions</span>
          </div>
          <DeployButton />
          <button type="button" className="scrp-add-btn" onClick={() => setAddOpen(true)}>
            + Add Companies
          </button>
        </div>
      </header>

      {/* ─── Filter strip ───────────────────────────────────── */}
      <div className="scrp-filters">
        <select
          className="scrp-select"
          value={filters.l1}
          onChange={e => setFilters(f => ({ ...f, l1: e.target.value }))}
          aria-label="Filter by sector"
        >
          {L1_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input
          type="search"
          className="scrp-search"
          placeholder="Search slug, name, website…"
          value={filters.q}
          onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
        />
        <div className="scrp-filter-stat">
          {loading ? 'loading…' : `${jobs.length} listing${jobs.length === 1 ? '' : 's'}`}
        </div>
      </div>

      {/* ─── Two-pane body ──────────────────────────────────── */}
      <div className="scrp-body">
        <aside className="scrp-list" aria-label="Jobs">
          {!loading && jobs.length === 0 && (
            <div className="scrp-empty-list">
              No matching jobs. Try clearing filters or click <strong>Add Companies</strong>.
            </div>
          )}
          {jobs.map(j => (
            <JobRow
              key={j.id}
              job={j}
              selected={j.id === selectedJobId}
              onClick={() => setSelectedJobId(j.id)}
            />
          ))}
        </aside>

        <main className="scrp-detail">
          {selected ? (
            <JobDetailView jobId={selected.id} onChanged={refresh} />
          ) : (
            <div className="scrp-empty-detail">
              <h2>Select a listing</h2>
              <p>Pick a row on the left to see its scrape sessions, citations, and screenshots.</p>
            </div>
          )}
        </main>
      </div>

      {addOpen && (
        <AddCompaniesModal
          onClose={() => setAddOpen(false)}
          onAdded={() => { setAddOpen(false); refresh() }}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Job row (left list)
// ─────────────────────────────────────────────────────────────
function JobRow({ job, selected, onClick }: { job: Job; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`scrp-row ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      <div className="scrp-row-main">
        <div className="scrp-row-name">{job.company_name || job.slug}</div>
        <div className="scrp-row-meta">
          <span>{job.category_l1}</span>
          {job.category_slug && <><span className="scrp-dot" /><span>{job.category_slug}</span></>}
          {job.total_sessions > 0 && <><span className="scrp-dot" /><span>{job.total_sessions} session{job.total_sessions === 1 ? '' : 's'}</span></>}
        </div>
      </div>
      <div className="scrp-row-side">
        <span className={`scrp-pill scrp-pill--${job.status} scrp-pill--sm`}>
          <span className="scrp-pill-dot" />{job.status}
        </span>
        {job.total_cost_usd > 0 && (
          <span className="scrp-row-cost">${job.total_cost_usd.toFixed(3)}</span>
        )}
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Job detail (right pane)
// ─────────────────────────────────────────────────────────────
function JobDetailView({ jobId, onChanged }: { jobId: number; onChanged: () => void }) {
  const [data, setData] = useState<JobDetail | null>(null)
  const [openSessionId, setOpenSessionId] = useState<number | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [scrapeMenuOpen, setScrapeMenuOpen] = useState(false)

  const reload = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/scrape/jobs/${jobId}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.ok) {
        setData(json)
        if (json.sessions.length && openSessionId == null) setOpenSessionId(json.sessions[0].id)
      }
    } catch (err) {
      console.error(err)
    }
  }, [jobId, openSessionId])

  useEffect(() => {
    setOpenSessionId(null); setData(null)
    reload()
    const id = setInterval(reload, 3500)
    return () => clearInterval(id)
  }, [jobId])  // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return <div className="scrp-empty-detail">Loading…</div>

  const { job, sessions } = data
  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400) }

  const action = async (label: string, run: () => Promise<Response>) => {
    setBusy(label); setError(null)
    try {
      const res = await run()
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      flash(`${label} ✓`)
      onChanged()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="scrp-detail-inner">
      {/* Hero */}
      <header className="scrp-hero">
        <div className="scrp-hero-id">
          <div className="scrp-hero-name">{job.company_name || job.slug}</div>
          <div className="scrp-hero-meta">
            <a href={job.website} target="_blank" rel="noopener noreferrer" className="scrp-hero-link">{job.website} ↗</a>
            <span className="scrp-dot" />
            <span>{job.category_l1}</span>
            {job.category_slug && <><span className="scrp-dot" /><span>{job.category_slug}</span></>}
          </div>
        </div>
        <div className="scrp-hero-actions">
          <span className={`scrp-pill scrp-pill--${job.status}`}>
            <span className="scrp-pill-dot" />{job.status}
          </span>
          <div className="scrp-btn-group">
            <button
              type="button"
              className="scrp-btn"
              disabled={busy != null}
              onClick={() => action(
                'Scrape (cached retry)',
                () => fetch(`/api/admin/scrape/jobs/${jobId}/requeue`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sections: [] }),
                })
              )}
              title="Re-queue; cached steps replay free, only failed step burns tokens"
            >
              {job.status === 'running' ? 'Re-queue' : 'Scrape now'}
            </button>
            <button
              type="button"
              className="scrp-btn scrp-btn--chev"
              disabled={busy != null}
              onClick={() => setScrapeMenuOpen(o => !o)}
              aria-label="Scrape section options"
              aria-expanded={scrapeMenuOpen}
            >
              ▾
            </button>
            {scrapeMenuOpen && (
              <SectionMenu
                jobId={jobId}
                busy={busy != null}
                onClose={() => setScrapeMenuOpen(false)}
                onScrape={(section, label) => {
                  setScrapeMenuOpen(false)
                  action(`Scrape ${label}`, () => fetch(`/api/admin/scrape/jobs/${jobId}/requeue`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sections: [section] }),
                  }))
                }}
              />
            )}
          </div>
          {job.last_session_id && (
            <button
              type="button"
              className="scrp-btn scrp-btn--primary"
              disabled={busy != null || job.status === 'applied'}
              onClick={() => action('Apply to DB', () => fetch(`/api/admin/scrape/jobs/${jobId}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: job.last_session_id }) }))}
            >
              Apply latest to DB
            </button>
          )}
        </div>
      </header>

      {error && <div className="scrp-error">{error}</div>}
      {toast && <div className="scrp-toast">{toast}</div>}

      {/* Screenshots */}
      {(job.screenshot_home_url || job.screenshot_secondary_url) && (
        <section className="scrp-screens">
          {job.screenshot_home_url && (
            <a href={job.screenshot_home_url} target="_blank" rel="noopener noreferrer" className="scrp-screen">
              <span className="scrp-screen-label">Home</span>
              <ScreenshotBadge url={job.screenshot_home_url} />
              <img src={job.screenshot_home_url} alt="Home page screenshot" />
            </a>
          )}
          {job.screenshot_secondary_url && (
            <a href={job.screenshot_secondary_url} target="_blank" rel="noopener noreferrer" className="scrp-screen">
              <span className="scrp-screen-label">Secondary</span>
              <ScreenshotBadge url={job.screenshot_secondary_url} />
              <img src={job.screenshot_secondary_url} alt="Secondary page screenshot" />
            </a>
          )}
        </section>
      )}

      {/* Sessions */}
      <section className="scrp-sessions">
        <h3 className="scrp-section-title">Sessions <span className="scrp-section-sub">{sessions.length}</span></h3>
        {sessions.length === 0 && (
          <div className="scrp-empty-sessions">
            No sessions yet. Click <strong>Scrape now</strong> above, then run <code>npm run scrape:worker</code> in your terminal.
          </div>
        )}
        {sessions.map(s => (
          <div
            key={s.id}
            className={`scrp-session ${openSessionId === s.id ? 'is-open' : ''} scrp-session--${s.status}`}
          >
            <button
              type="button"
              className="scrp-session-head"
              onClick={() => setOpenSessionId(openSessionId === s.id ? null : s.id)}
            >
              <span className={`scrp-pill scrp-pill--${s.status} scrp-pill--sm`}>
                <span className="scrp-pill-dot" />{s.status}
              </span>
              <span className="scrp-session-id">#{s.id}</span>
              <span className="scrp-session-when">{relTime(s.started_at)}</span>
              <span className="scrp-session-meta">
                {s.duration_ms != null && <span>{(s.duration_ms / 1000).toFixed(1)}s</span>}
                <span>{s.total_steps} steps{s.failed_steps > 0 ? ` (${s.failed_steps} failed)` : ''}</span>
                <span>${Number(s.total_cost_usd || 0).toFixed(4)}</span>
                <span>{s.total_input_tokens}+{s.total_output_tokens} tok</span>
                {s.model_version && <span>{s.model_version}</span>}
              </span>
              <span className="scrp-session-chev">{openSessionId === s.id ? '▾' : '▸'}</span>
            </button>
            {openSessionId === s.id && (
              <div className="scrp-session-body">
                {s.error_summary && (
                  <div className="scrp-error">Error: {s.error_summary}</div>
                )}
                <SessionTimeline sessionId={s.id} live={s.status === 'running'} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Extracted JSON preview */}
      {job.extracted && (
        <section className="scrp-extracted">
          <h3 className="scrp-section-title">Latest extraction</h3>
          <details className="scrp-json-details">
            <summary>Show raw JSON</summary>
            <pre className="scrp-json">{JSON.stringify(job.extracted, null, 2)}</pre>
          </details>
        </section>
      )}
    </div>
  )
}

/**
 * Fires the existing /api/admin/deploy endpoint, which POSTs to the
 * Vercel Deploy Hook URL (VERCEL_DEPLOY_HOOK_URL). Without a deploy,
 * applied changes (incl. updated screenshot URLs) won't be visible on
 * infowebworld.com — the page is static, baked at the last deploy time.
 */
function DeployButton() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const click = async () => {
    if (!confirm('Trigger a Vercel production deploy?\n\nThis rebuilds every /company/<slug> page with the latest DB data. Takes ~1-2 minutes. Required after Apply for changes to show on infowebworld.com.')) return
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/deploy', { method: 'POST' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setMsg(`✗ ${json.error || `HTTP ${res.status}`}`)
      } else {
        setMsg('✓ Deploy started — infowebworld.com will refresh in ~1–2 min')
      }
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(null), 8000)
    }
  }

  return (
    <div className="scrp-deploy">
      <button type="button" className="scrp-btn scrp-btn--deploy" onClick={click} disabled={busy}>
        {busy ? 'Deploying…' : 'Deploy to Vercel'}
      </button>
      {msg && <span className={`scrp-deploy-msg ${msg.startsWith('✓') ? 'is-ok' : 'is-err'}`}>{msg}</span>}
    </div>
  )
}

/**
 * Visual indicator for screenshot URL provenance.
 * /api/file/...        → uploaded to cPanel, works in production ✓
 * /scrape-screenshots/ → local only — Vercel won't have the file ✗
 *                       (means the worker's /api/upload call failed; usually
 *                        the dev server wasn't running. Re-scrape screenshots
 *                        with the dev server up.)
 */
function ScreenshotBadge({ url }: { url: string | null }) {
  if (!url) return null
  const isCpanel = url.startsWith('/api/file/') || url.includes('infowebworld.com')
  const isLocal  = url.startsWith('/scrape-screenshots/')
  if (isCpanel) return <span className="scrp-screen-badge scrp-screen-badge--ok">on cPanel — prod-safe</span>
  if (isLocal)  return <span className="scrp-screen-badge scrp-screen-badge--err">LOCAL ONLY — won&apos;t load on infowebworld.com</span>
  return <span className="scrp-screen-badge">{url.slice(0, 40)}…</span>
}

function relTime(iso: string): string {
  const t = new Date(iso).getTime()
  const diff = Date.now() - t
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} h ago`
  return `${Math.floor(diff / 86_400_000)} d ago`
}

/* ─────────────────────────────────────────────────────────────────────
   Section-specific scrape dropdown.
   Each option clears only the cache for its section, so the worker
   re-extracts ONLY that section and replays the rest from cache (free).
   "Full scrape" wipes the whole job cache.
   ───────────────────────────────────────────────────────────────────── */
function SectionMenu({
  jobId, busy, onClose, onScrape,
}: {
  jobId: number
  busy: boolean
  onClose: () => void
  onScrape: (section: string, label: string) => void
}) {
  // Close on outside click + Escape
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.scrp-menu') && !target.closest('.scrp-btn--chev')) onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const opts: { section: string; label: string; sub: string }[] = [
    { section: 'all',           label: 'all sections',           sub: 'Full fresh scrape (clears cache) — ~$0.05' },
    { section: 'screenshots',   label: 'screenshots only',       sub: 'Re-capture + re-upload home + secondary — $0 LLM' },
    { section: 'base',          label: 'description',            sub: 'Tagline + description + founded/HQ/team — ~$0.005' },
    { section: 'pricing',       label: 'pricing',                sub: 'Pricing tiers + starting price + free tier — ~$0.008' },
    { section: 'features',      label: 'features + integrations', sub: 'Key features + features + integrations + apps — ~$0.012' },
    { section: 'integrations',  label: 'integrations only',      sub: 'Subset of features pass — ~$0.012' },
    { section: 'faqs',          label: 'FAQs',                   sub: 'Refreshes the 8 FAQs — ~$0.006' },
    { section: 'classify',      label: 'classification',         sub: 'Pros/cons/use cases/industries — ~$0.004' },
  ]

  return (
    <div className="scrp-menu" role="menu">
      <div className="scrp-menu-head">Re-scrape just one section — keeps everything else cached</div>
      {opts.map(o => (
        <button
          key={o.section}
          type="button"
          role="menuitem"
          className="scrp-menu-item"
          disabled={busy}
          onClick={() => onScrape(o.section, o.label)}
        >
          <span className="scrp-menu-label">{o.label}</span>
          <span className="scrp-menu-sub">{o.sub}</span>
        </button>
      ))}
    </div>
  )
}
