import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { unlinkSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

/**
 * POST /api/admin/scrape/jobs/[id]/requeue
 * Body (all optional):
 *   { sections?: string[] }
 *
 * Sets status='queued' so the worker picks it up. Optionally clears the
 * file-system cache for a subset of sections so only those passes get
 * re-extracted; everything else reuses the cached result from the
 * previous session (no LLM cost, no network fetch).
 *
 * Valid section keys:
 *   'all'         clear EVERYTHING — full fresh scrape
 *   'base'        crawl-home, crawl-about, extract-base
 *   'pricing'     crawl-pricing, extract-pricing
 *   'features'    crawl-features, crawl-integrations, extract-features
 *   'integrations' crawl-integrations, extract-features  (subset of features)
 *   'faqs'        crawl-faq, extract-faqs
 *   'classify'    extract-classify
 *
 * If sections is missing or empty, treats as a re-queue WITHOUT clearing
 * any cache (cheapest possible retry — only the failed step burns tokens).
 */

const SECTION_TO_STEPS: Record<string, string[]> = {
  all:           ['crawl-home','crawl-about','crawl-pricing','crawl-features',
                  'crawl-faq','crawl-integrations','screenshot-home','screenshot-secondary',
                  'extract-base','extract-pricing','extract-features','extract-faqs',
                  'extract-classify'],
  base:          ['crawl-home','crawl-about','extract-base'],
  pricing:       ['crawl-pricing','extract-pricing'],
  features:      ['crawl-features','crawl-integrations','extract-features'],
  integrations:  ['crawl-integrations','extract-features'],
  faqs:          ['crawl-faq','extract-faqs'],
  classify:      ['extract-classify'],
  /* Screenshots are cached (the URL is the cached value). Clearing the
     screenshot-* cache forces the pipeline to re-capture via Playwright
     and re-upload to cPanel. Everything else (extract, crawl, critique)
     stays cached so the LLM cost stays at $0. */
  screenshots:   ['screenshot-home','screenshot-secondary'],
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const jobId = Number(id)
    if (!Number.isFinite(jobId)) {
      return Response.json({ ok: false, error: 'Invalid job id' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({})) as { sections?: string[] }
    const sections = Array.isArray(body.sections) ? body.sections : []

    const existing = await queryOne<{ status: string }>(`SELECT status FROM scrape_jobs WHERE id = ?`, [jobId])
    if (!existing) return Response.json({ ok: false, error: 'Job not found' }, { status: 404 })
    if (existing.status === 'running') {
      return Response.json({ ok: false, error: 'Job is already running' }, { status: 409 })
    }

    /* Invalidate caches for the selected sections. */
    const cleared: string[] = []
    const jobCacheDir = join(process.cwd(), '.scrape-cache', String(jobId))

    if (sections.includes('all')) {
      if (existsSync(jobCacheDir)) {
        try {
          rmSync(jobCacheDir, { recursive: true, force: true })
          cleared.push('(entire job cache)')
        } catch (err) {
          console.warn('requeue: failed to clear job cache:', err)
        }
      }
    } else {
      const stepsToClear = new Set<string>()
      for (const sec of sections) {
        const steps = SECTION_TO_STEPS[sec]
        if (steps) steps.forEach(s => stepsToClear.add(s))
      }
      for (const step of stepsToClear) {
        const path = join(jobCacheDir, `${step}.json`)
        if (existsSync(path)) {
          try {
            unlinkSync(path)
            cleared.push(step)
          } catch (err) {
            console.warn(`requeue: failed to clear ${step}:`, err)
          }
        }
      }
    }

    await execute(`UPDATE scrape_jobs SET status = 'queued' WHERE id = ?`, [jobId])

    return Response.json({
      ok: true,
      sectionsRequested: sections,
      stepsCleared: cleared,
    })
  } catch (err) {
    console.error('POST /scrape/jobs/[id]/requeue:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
