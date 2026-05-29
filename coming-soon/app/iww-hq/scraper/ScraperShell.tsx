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
  workerHeartbeatAt: string | null
  workerStopRequested: boolean
  lastActivityAt: string | null
  staleRunning: number
  l1Filter: string | null
}

const STATUS_ORDER = ['queued', 'running', 'review', 'applied', 'failed', 'skipped', 'cancelled'] as const
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
          <div className="scrp-worker" title={workerLabel(stats).tip}>
            <span className={`scrp-worker-dot ${workerLabel(stats).dotClass}`} />
            <span>{workerLabel(stats).text}</span>
            {workerLabel(stats).showHint && (
              <code className="scrp-worker-hint">npm run scrape:worker</code>
            )}
          </div>
          {(stats?.staleRunning ?? 0) > 0 && (
            <ResetStaleButton count={stats!.staleRunning} onDone={refresh} />
          )}
          <L1FocusDropdown current={stats?.l1Filter ?? null} onChange={refresh} />
          {stats?.workerLikelyOnline && (
            <StopWorkerButton stopRequested={stats.workerStopRequested} />
          )}
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

      {/* ─── Offline banner — clearest possible signal that nothing
           runs without the worker process. Shown ONLY when no heartbeat
           in the last 30s and the user hasn't just clicked Stop. ─── */}
      {stats && !stats.workerLikelyOnline && !stats.workerStopRequested && (
        <WorkerOfflineBanner queuedCount={stats.status.queued ?? 0} l1Filter={stats.l1Filter} />
      )}

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

  /* `summary=1` polls skip the 100KB+ current_extracted_json /
     current_source_citations blobs so the 3.5s tick doesn't drag
     megabytes per minute over the wire. The first load is full so the
     "Latest extraction" section has data; subsequent polls keep that
     blob in state without re-fetching it. */
  const reload = useCallback(async (full = false) => {
    try {
      const url = `/api/admin/scrape/jobs/${jobId}${full ? '' : '?summary=1'}`
      const res = await fetch(url, { cache: 'no-store' })
      const json = await res.json()
      if (json.ok) {
        setData(prev => {
          if (json.summary && prev?.job) {
            return {
              ...json,
              job: {
                ...json.job,
                extracted: prev.job.extracted,
                citations: prev.job.citations,
              },
            }
          }
          return json
        })
        if (json.sessions.length && openSessionId == null) setOpenSessionId(json.sessions[0].id)
      }
    } catch (err) {
      console.error(err)
    }
  }, [jobId, openSessionId])

  useEffect(() => {
    setOpenSessionId(null); setData(null)
    reload(true)                                                  // initial full
    const id = setInterval(() => reload(false), 3500)             // polls summary
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
      /* Force a full reload after a write action — Apply / Requeue change
         extracted_json on the server, so we want the next render to show
         the new blob, not the cached one from the summary poll. */
      reload(true)
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
            {job.applied_at && (
              <>
                <span className="scrp-dot" />
                <a
                  href={`/listing/${job.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="scrp-hero-link"
                  title={`Applied to DB at ${new Date(job.applied_at).toLocaleString()}`}
                >
                  ✓ live since {relTime(job.applied_at)} → /listing/{job.slug} ↗
                </a>
              </>
            )}
          </div>
        </div>
        <div className="scrp-hero-actions">
          <span className={`scrp-pill scrp-pill--${job.status}`}>
            <span className="scrp-pill-dot" />{job.status}
          </span>
          {(job.status === 'running' || job.status === 'queued') && (
            <button
              type="button"
              className="scrp-btn scrp-btn--danger"
              disabled={busy != null}
              title={job.status === 'running'
                ? 'Abort the in-flight scrape at the next step boundary.'
                : 'Remove from the queue without scraping.'}
              onClick={() => {
                if (!confirm(`Cancel "${job.slug}"?\n\n${job.status === 'running'
                  ? 'Worker will abort within ~10s. Partial extraction will be discarded.'
                  : 'Job will be removed from the queue.'}`)) return
                action('Cancel', () => fetch(`/api/admin/scrape/jobs/${jobId}/cancel`, {
                  method: 'POST',
                }))
              }}
            >
              Cancel
            </button>
          )}
          <div className="scrp-btn-group">
            <button
              type="button"
              className="scrp-btn"
              disabled={busy != null || job.status === 'running'}
              onClick={() => action(
                'Queued',
                () => fetch(`/api/admin/scrape/jobs/${jobId}/requeue`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sections: [] }),
                })
              )}
              title={job.status === 'running'
                ? 'Already running — cancel first if you want to re-queue.'
                : 'Set status=queued. Worker claims it within ~10s. Cached steps replay free; only failed step burns tokens.'}
            >
              {job.status === 'running' ? 'Running…' : 'Scrape now'}
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
              disabled={busy != null || job.status === 'applied' || job.status === 'running'}
              title={
                job.status === 'running'
                  ? 'Wait for the current scrape to finish before applying.'
                  : job.status === 'applied'
                    ? 'Already applied to DB.'
                    : 'Write extracted data into the submissions table (makes the listing live).'
              }
              onClick={() => {
                /* Pre-check: don't fire Apply against a still-running
                   session — the extracted_json column will be NULL and
                   the API will reject it; surface that as a clearer
                   message than the toast-after-spinner pattern. */
                const latest = sessions[0]
                if (latest && latest.status === 'running') {
                  setError('Latest session is still running — wait for it to finish, then Apply.')
                  return
                }
                if (latest && latest.status === 'failed') {
                  if (!confirm('Latest session failed. Apply will use the last successful session if any. Continue?')) return
                }
                action('Apply to DB', () => fetch(`/api/admin/scrape/jobs/${jobId}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: job.last_session_id }) }))
              }}
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
            No sessions yet. Click <strong>Scrape now</strong> above to queue this listing. The worker will pick it up within ~10s — make sure <code>npm run scrape:worker</code> is running in a terminal.
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
    if (!confirm('Trigger a Vercel production deploy?\n\nThis rebuilds every /listing/<slug> page with the latest DB data. Takes ~1-2 minutes. Required after Apply for changes to show on infowebworld.com.')) return
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
 * Loud banner when the worker isn't running. The Scrape Now / Apply /
 * Add Companies buttons all just write to MySQL — they don't START the
 * pipeline. The pipeline only runs when a worker process is alive to
 * claim queued rows. Without this banner users (rightly) think the
 * buttons are broken when nothing happens after clicking them.
 */
function WorkerOfflineBanner({ queuedCount, l1Filter }: { queuedCount: number; l1Filter: string | null }) {
  const [copied, setCopied] = useState(false)
  const cmd = 'npm run scrape:worker'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  return (
    <div className="scrp-banner scrp-banner--warn" role="alert">
      <div className="scrp-banner-icon">⚠️</div>
      <div className="scrp-banner-body">
        <div className="scrp-banner-title">
          Worker is offline — nothing will run until you start it.
          {queuedCount > 0 && (
            <span className="scrp-banner-pill"> {queuedCount} job{queuedCount === 1 ? '' : 's'} waiting</span>
          )}
        </div>
        <div className="scrp-banner-detail">
          Open a terminal in your <code>coming-soon</code> folder and run:
          <button type="button" className="scrp-banner-cmd" onClick={copy} title="Click to copy">
            {cmd}
            <span className="scrp-banner-cmd-copy">{copied ? '✓ copied' : '📋'}</span>
          </button>
          The worker stays running until you press <kbd>Ctrl-C</kbd>. {l1Filter
            ? <>Currently focused on <strong>{l1Filter}</strong> — change the dropdown above to switch categories.</>
            : <>It claims queued jobs from any L1; use the <strong>Focus</strong> dropdown above to restrict it.</>}
        </div>
      </div>
    </div>
  )
}

/**
 * Recovers orphaned scrape_jobs.status='running' rows whose worker died
 * without finishing them. Calls POST /api/admin/scrape/cleanup-stale,
 * which runs the same recovery logic the worker does on boot. Surfaced
 * only when stats.staleRunning > 0 so it doesn't clutter the bar.
 */
function ResetStaleButton({ count, onDone }: { count: number; onDone: () => void }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const click = async () => {
    if (!confirm(`Reset ${count} stale running job${count === 1 ? '' : 's'}?\n\nThese are jobs marked 'running' but no worker is actually processing them. They'll be re-queued or synced to whatever their last session landed on.`)) return
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/scrape/cleanup-stale', { method: 'POST' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setMsg(`✗ ${json.error || `HTTP ${res.status}`}`)
      } else {
        setMsg(`✓ ${json.recovered} recovered`)
        onDone()
      }
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(null), 6000)
    }
  }

  return (
    <div className="scrp-deploy">
      <button
        type="button"
        className="scrp-btn scrp-btn--warn"
        onClick={click}
        disabled={busy}
        title={`${count} job(s) marked 'running' with no live worker. Click to recover.`}
      >
        {busy ? 'Resetting…' : `Reset stale (${count})`}
      </button>
      {msg && <span className={`scrp-deploy-msg ${msg.startsWith('✓') ? 'is-ok' : 'is-err'}`}>{msg}</span>}
    </div>
  )
}

/**
 * L1 focus dropdown. Writes scraper_runtime_config.l1_filter; the worker
 * picks it up on the next poll iteration (~10s) without restarting. Empty
 * value = no filter = claim from any L1. Optimistic UI: update + refresh
 * stats so the new value reflects immediately.
 */
function L1FocusDropdown({ current, onChange }: { current: string | null; onChange: () => void }) {
  const [busy, setBusy] = useState(false)

  const choose = async (next: string) => {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/scrape/worker/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ l1_filter: next || null }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        alert(`Failed to set L1 filter: ${json.error || `HTTP ${res.status}`}`)
      }
      onChange()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="scrp-l1-focus" title="Restrict the worker to a single L1 category. Empty = any category.">
      <span className="scrp-l1-focus-label">Focus:</span>
      <select
        className="scrp-select scrp-l1-focus-select"
        value={current ?? ''}
        onChange={e => choose(e.target.value)}
        disabled={busy}
        aria-label="Worker focus L1 category"
      >
        <option value="">any L1</option>
        <option value="ai-and-ml">AI & ML</option>
        <option value="software-and-saas">Software & SaaS</option>
        <option value="it-services-and-agencies">IT Services</option>
        <option value="professional-services">Professional Services</option>
        <option value="startups">Startups</option>
        <option value="local-businesses">Local Businesses</option>
      </select>
    </div>
  )
}

/**
 * Stops the local scrape-worker process by writing a sentinel file
 * (.scrape-worker.stop) that the worker polls between iterations.
 * Worker exits gracefully — finishes in-flight jobs, releases DB
 * + browser, then dies. Picked up within one poll (~10s).
 */
function StopWorkerButton({ stopRequested }: { stopRequested: boolean }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const click = async () => {
    if (!confirm('Stop the scraper worker?\n\nIn-flight jobs will be allowed to finish (~30-60s each). The worker will then exit. You can restart it with `npm run scrape:worker` in the terminal.')) return
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/scrape/worker/stop', { method: 'POST' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setMsg(`✗ ${json.error || `HTTP ${res.status}`}`)
      } else {
        setMsg(json.message || '✓ Stop requested')
      }
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(null), 6000)
    }
  }

  return (
    <div className="scrp-deploy">
      <button
        type="button"
        className="scrp-btn scrp-btn--danger"
        onClick={click}
        disabled={busy || stopRequested}
        title="Send graceful stop signal to the worker"
      >
        {busy ? 'Sending…' : stopRequested ? 'Stopping…' : 'Stop worker'}
      </button>
      {msg && <span className={`scrp-deploy-msg ${msg.startsWith('✓') || msg.startsWith('Stop requested') ? 'is-ok' : 'is-err'}`}>{msg}</span>}
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

/* Worker label resolves the three-way state cleanly:
   - dot = process liveness from heartbeat
   - text = what it's doing (online / stopping / offline)
   The old logic could show a green dot AND "stopping…" because
   workerStopRequested was checked independently of workerLikelyOnline. */
function workerLabel(stats: Stats | null): {
  text: string
  dotClass: 'is-online' | 'is-offline' | 'is-paused'
  showHint: boolean
  tip: string
} {
  if (!stats) return { text: 'Worker —', dotClass: 'is-offline', showHint: false, tip: 'loading…' }
  const beatAt = stats.workerHeartbeatAt ? new Date(stats.workerHeartbeatAt).getTime() : 0
  const beatAgo = beatAt ? Date.now() - beatAt : Infinity
  if (!stats.workerLikelyOnline) {
    return {
      text: 'Worker offline',
      dotClass: 'is-offline',
      showHint: !stats.workerStopRequested,
      tip: stats.workerStopRequested
        ? 'Stop file present but no heartbeat — worker already exited.'
        : 'No heartbeat in the last 30s.',
    }
  }
  if (stats.workerStopRequested) {
    return {
      text: 'Worker stopping…',
      dotClass: 'is-paused',
      showHint: false,
      tip: `Stop signal sent ${Math.floor(beatAgo / 1000)}s ago of heartbeat. Will exit after in-flight jobs finish.`,
    }
  }
  return {
    text: 'Worker online',
    dotClass: 'is-online',
    showHint: false,
    tip: `Heartbeat ${Math.floor(beatAgo / 1000)}s ago.`,
  }
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
  // Close on outside click, Escape, or scroll. Scroll-close matters
  // because the menu's CSS position is anchored to the trigger; if the
  // detail pane scrolls, the menu would visually detach from its button.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.scrp-menu') && !target.closest('.scrp-btn--chev')) onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const onScroll = () => onClose()
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    /* capture=true so we catch scroll on any nested scrollable container,
       not just window — the detail pane is its own scroll context. */
    document.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('scroll', onScroll, true)
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
