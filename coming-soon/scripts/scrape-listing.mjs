#!/usr/bin/env node
/**
 * Single-shot scrape: run the pipeline against one job by slug or job id.
 *
 * Usage:
 *   node scripts/scrape-listing.mjs --slug=cursor
 *   node scripts/scrape-listing.mjs --job-id=12
 *   node scripts/scrape-listing.mjs --slug=cursor --model=gemini-2.5-flash
 *   node scripts/scrape-listing.mjs --slug=cursor --dry-run
 *
 * Prints the cost + status to stdout. Exits non-zero on failure.
 */
import { loadEnv, requireEnv } from './lib/scrape-env.mjs'
import { closeDb, q1, exec } from './lib/scrape-db.mjs'
import { scrapeListing } from './lib/scrape-pipeline.mjs'
import { closeCrawler } from './lib/scrape-crawler.mjs'

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...rest] = a.slice(2).split('=')
      return [k, rest.length ? rest.join('=') : true]
    })
)

const env = loadEnv()
requireEnv(env, ['DATABASE_HOST', 'DATABASE_USER', 'GEMINI_API_KEY'])

let job
if (args['job-id']) {
  job = await q1(env, 'SELECT * FROM scrape_jobs WHERE id = ?', [Number(args['job-id'])])
} else if (args.slug) {
  job = await q1(env, 'SELECT * FROM scrape_jobs WHERE slug = ?', [String(args.slug)])
  if (!job && args.website && args['category-l1']) {
    // Auto-create job from CLI args
    const ins = await exec(env,
      `INSERT INTO scrape_jobs (slug, website, category_l1, status) VALUES (?, ?, ?, 'queued')`,
      [String(args.slug), String(args.website), String(args['category-l1'])]
    )
    job = await q1(env, 'SELECT * FROM scrape_jobs WHERE id = ?', [ins.insertId])
    console.log(`Created scrape_jobs.id=${job.id} for slug=${job.slug}`)
  }
} else {
  console.error('Required: --slug=<slug>  OR  --job-id=<n>')
  process.exit(2)
}

if (!job) {
  console.error(`No matching job. Add --website + --category-l1 to auto-create.`)
  process.exit(3)
}

const model = String(args.model || 'gemini-2.5-flash')
const dryRun = !!args['dry-run']

const startTime = Date.now()
try {
  const result = await scrapeListing({
    env,
    jobId: job.id,
    model,
    dryRun,
    log: console,
  })
  console.log(JSON.stringify({
    ok: true,
    sessionId: result.sessionId,
    status: result.status,
    cost: Number(result.cost?.toFixed?.(4) ?? result.cost),
    citationIssues: result.citationIssues?.length ?? 0,
    flaggedFields: result.critique?.flagged_fields?.length ?? 0,
    durationMs: Date.now() - startTime,
  }, null, 2))
} catch (err) {
  console.error(JSON.stringify({
    ok: false,
    error: err.message,
    durationMs: Date.now() - startTime,
  }, null, 2))
  process.exitCode = 1
} finally {
  await closeCrawler().catch(() => {})
  await closeDb().catch(() => {})
}
