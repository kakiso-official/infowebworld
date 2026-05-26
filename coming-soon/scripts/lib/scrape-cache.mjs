/**
 * Per-job step cache.
 *
 * When a scrape session fails partway, the next attempt should NOT pay
 * for crawl steps and extract passes that already succeeded. We cache the
 * data output of every cacheable step in a file at
 *
 *   <project root>/.scrape-cache/<jobId>/<step-name>.json
 *
 * Each entry: { ts, data }. TTL defaults to 24h — after that the data is
 * considered stale and re-fetched. Caller can override TTL per get.
 *
 * Cacheable steps:
 *   crawl-home / crawl-about / crawl-pricing / crawl-features / crawl-faq
 *   extract-base / extract-pricing / extract-features / extract-faqs / extract-classify
 *
 * Non-cacheable (always re-run):
 *   screenshot-*  — cheap, want fresh
 *   self-critique — depends on freshly assembled extracted JSON
 *   validate-citations / save-session — bookkeeping
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000

function cacheRoot(cwd = process.cwd()) {
  return resolve(cwd, '.scrape-cache')
}
function jobDir(jobId, cwd = process.cwd()) {
  return join(cacheRoot(cwd), String(jobId))
}
function stepPath(jobId, stepName, cwd = process.cwd()) {
  return join(jobDir(jobId, cwd), `${stepName}.json`)
}

/** Returns the cached data or null on miss / expired / unreadable. */
export function getCached(jobId, stepName, ttlMs = DEFAULT_TTL_MS, cwd = process.cwd()) {
  const path = stepPath(jobId, stepName, cwd)
  if (!existsSync(path)) return null
  try {
    const entry = JSON.parse(readFileSync(path, 'utf8'))
    if (!entry || typeof entry.ts !== 'number') return null
    if (Date.now() - entry.ts > ttlMs) return null
    return entry.data ?? null
  } catch {
    return null
  }
}

/** Persist data under (jobId, stepName). Silent on IO errors. */
export function setCached(jobId, stepName, data, cwd = process.cwd()) {
  try {
    mkdirSync(jobDir(jobId, cwd), { recursive: true })
    writeFileSync(stepPath(jobId, stepName, cwd), JSON.stringify({ ts: Date.now(), data }))
    return true
  } catch (err) {
    console.warn(`[cache] could not write ${jobId}/${stepName}: ${err.message}`)
    return false
  }
}

/** Wipe everything cached for a job. Called by "Re-scrape (fresh)". */
export function clearJobCache(jobId, cwd = process.cwd()) {
  try {
    rmSync(jobDir(jobId, cwd), { recursive: true, force: true })
    return true
  } catch {
    return false
  }
}

/** Cache summary — used by UI to show "x steps cached" badge. */
export function summarizeJobCache(jobId, cwd = process.cwd()) {
  try {
    const dir = jobDir(jobId, cwd)
    if (!existsSync(dir)) return { count: 0, steps: [] }
    const files = readdirSync(dir).filter(f => f.endsWith('.json'))
    const steps = files.map(f => f.replace(/\.json$/, ''))
    return { count: files.length, steps }
  } catch {
    return { count: 0, steps: [] }
  }
}
