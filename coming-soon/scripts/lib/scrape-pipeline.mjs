/**
 * The scraper pipeline. End-to-end:
 *
 *   crawl-home  → crawl-about → crawl-pricing → crawl-features → crawl-faq
 *   screenshot-home → screenshot-secondary
 *   extract-base → extract-pricing → extract-features → extract-faqs → extract-classify
 *   self-critique → validate-citations → save-session
 *
 * Each step gets its own row in scrape_session_steps so the UI timeline
 * can render the full Gantt. Step status is updated transactionally:
 * running on insert, ok / error on completion.
 *
 * Failures in one step do not necessarily kill the run — crawl misses for
 * /pricing or /faq just mean those extract passes work from less context.
 * Hard failures (no home page at all, API key invalid) abort with the
 * session marked failed.
 *
 * "Real info only" is enforced by:
 *   1. Every extracted field's schema requires _source_url + _source_quote
 *   2. The validate-citations step refuses non-null values with empty source
 *   3. The self-critique step asks Gemini to flag fields it cannot verify
 *
 * Output is written to scrape_sessions (final JSON, citations, screenshots,
 * cost, duration, status) and cached onto scrape_jobs (current_* columns)
 * so the listing detail view doesn't need to join sessions.
 */
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'

import { q, q1, exec } from './scrape-db.mjs'
import { callGemini, computeCost } from './scrape-gemini.mjs'
import {
  fetchPage,
  fetchWithFallback,
  PRICING_FALLBACKS,
  FEATURES_FALLBACKS,
  FAQ_FALLBACKS,
  ABOUT_FALLBACKS,
  INTEGRATIONS_FALLBACKS,
} from './scrape-crawler.mjs'
import { captureScreenshot, uploadScreenshot } from './scrape-screenshot.mjs'
import { cleanHtml } from './scrape-clean.mjs'
import { getCached, setCached } from './scrape-cache.mjs'
import {
  baseInfoSchema,
  pricingSchema,
  featuresSchema,
  faqsSchema,
  classificationSchema,
  critiqueSchema,
} from './scrape-schemas.mjs'

const REQUIRED_FIELDS_WITH_SOURCE = [
  ['tagline', 'tagline_source_url', 'tagline_source_quote'],
  ['description', 'description_source_url', 'description_source_quote'],
  ['founded_year', 'founded_year_source_url', 'founded_year_source_quote'],
  ['hq_city', 'hq_source_url', 'hq_source_quote'],
  ['team_size', 'team_size_source_url', 'team_size_source_quote'],
]

/**
 * CancelledError marks a clean admin-cancel exit (not a real failure).
 * The outer catch maps this to scrape_sessions.status='cancelled' so the
 * UI's filter pills count it separately from worker-failed runs.
 */
class CancelledError extends Error {
  constructor(msg = 'cancelled') {
    super(msg)
    this.name = 'AbortError'
  }
}

export async function scrapeListing({
  env,
  jobId,
  model = 'gemini-2.5-flash',
  publicScreenshotBase = '/scrape-screenshots',
  screenshotOutDir,
  log = console,
  costCapUsd = 0.50,
  dryRun = false,
  signal,
}) {
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing')

  const job = await q1(env, 'SELECT * FROM scrape_jobs WHERE id = ?', [jobId])
  if (!job) throw new Error(`scrape_jobs ${jobId} not found`)

  log.info?.(`▶ [job ${job.id}] ${job.slug} (${job.category_l1}) — ${job.website}`)

  const sessionInsert = await exec(env,
    `INSERT INTO scrape_sessions
       (scrape_job_id, status, llm_provider, model_version, started_at)
     VALUES (?, 'running', ?, ?, NOW())`,
    [job.id, model, model]
  )
  const sessionId = sessionInsert.insertId

  await exec(env,
    `UPDATE scrape_jobs SET status='running', total_sessions = total_sessions + 1 WHERE id = ?`,
    [job.id]
  )

  const ctx = {
    env, sessionId, jobId: job.id, model, log, costCapUsd, signal,
    stepIndex: 0, totalCost: 0, totalIn: 0, totalOut: 0, pages: 0, failedSteps: 0, degraded: 0,
  }

  let homePage = null
  let aboutPage = null
  let pricingPage = null
  let featuresPage = null
  let faqPage = null
  let integrationsPage = null
  let homeShotUrl = null
  let secondaryShotUrl = null
  let extracted = null
  let citationIssues = []
  let critiqueResult = null

  try {
    // ─── Crawl phase (parallel; cached per job so retries don't re-fetch) ──
    // All six fetches now run CONCURRENTLY on the shared browser instead of
    // one after another — sequential crawling (especially probing fallback
    // paths for a missing /pricing, /faq, …) was the single biggest time
    // sink. crawl-home is required (a reject aborts the run); the five section
    // crawls are optional (swallow → null) and probe a capped set of fallback
    // paths on shorter timeouts.
    const optionalCrawl = (name, fallbacks) =>
      cachedStepOptional(ctx, name, 'crawl', null, async () => {
        const res = await fetchWithFallback(job.website, fallbacks)
        if (!res) return null
        ctx.pages++
        return {
          input_url: res.attemptedUrl,
          output_status_code: res.status,
          output_bytes: res.bytes,
          output_excerpt: (res.title || '').slice(0, 200),
          _data: res,
        }
      })

    const crawlResults = await Promise.all([
      cachedStep(ctx, 'crawl-home', 'crawl', { input_url: job.website }, async () => {
        const res = await fetchPage(job.website)
        ctx.pages++
        return {
          output_status_code: res.status,
          output_bytes: res.bytes,
          output_excerpt: (res.title || '').slice(0, 200),
          _data: res,
        }
      }),
      optionalCrawl('crawl-about', ABOUT_FALLBACKS),
      optionalCrawl('crawl-pricing', PRICING_FALLBACKS),
      optionalCrawl('crawl-features', FEATURES_FALLBACKS),
      optionalCrawl('crawl-faq', FAQ_FALLBACKS),
      optionalCrawl('crawl-integrations', INTEGRATIONS_FALLBACKS),
    ])
    homePage = crawlResults[0]
    aboutPage = crawlResults[1]
    pricingPage = crawlResults[2]
    featuresPage = crawlResults[3]
    faqPage = crawlResults[4]
    integrationsPage = crawlResults[5]

    // ─── Screenshots (fire now, run CONCURRENTLY with the extract passes) ──
    // Both shots are optional — a capture/upload failure must NOT kill the
    // listing (the extracted data is the valuable part). We kick them off here
    // and await the promise just before saving, so the slow browser capture +
    // cPanel upload overlaps the LLM passes instead of adding to them serially.
    if (!screenshotOutDir) screenshotOutDir = join(process.cwd(), 'public', 'scrape-screenshots')
    mkdirSync(screenshotOutDir, { recursive: true })
    const secondaryCandidate = pricingPage?._data ?? featuresPage?._data ?? aboutPage?._data ?? null
    const screenshotsPromise = Promise.all([
      cachedStepOptional(ctx, 'screenshot-home', 'screenshot', { input_url: job.website }, () =>
        captureAndUpload(ctx, job.website, join(screenshotOutDir, `${job.slug}-home.jpg`), `${job.slug}-home.jpg`, publicScreenshotBase)),
      secondaryCandidate
        ? cachedStepOptional(ctx, 'screenshot-secondary', 'screenshot', { input_url: secondaryCandidate.finalUrl }, () =>
            captureAndUpload(ctx, secondaryCandidate.finalUrl, join(screenshotOutDir, `${job.slug}-secondary.jpg`), `${job.slug}-secondary.jpg`, publicScreenshotBase))
        : Promise.resolve(null),
    ]).then(([home, secondary]) => {
      homeShotUrl = home?._data ?? null
      secondaryShotUrl = secondary?._data ?? null
    }).catch(() => { /* screenshots are best-effort; never fail the run */ })

    // ─── Extract passes ────────────────────────────────────────────────
    // The four content passes are independent (they read the crawled pages,
    // not each other's output) so they run CONCURRENTLY; classify depends on
    // all four so it runs after. safeExtract makes each pass resilient — a
    // hard failure retries once, then degrades to an empty section so one
    // flaky pass can't abort the whole listing.
    const [baseInfo, pricingInfo, featuresInfo, faqsInfo] = await Promise.all([
      safeExtract(ctx, 'extract-base', baseInfoSchema, () => buildBasePrompt(job, homePage._data, aboutPage?._data)),
      safeExtract(ctx, 'extract-pricing', pricingSchema, () => buildPricingPrompt(job, pricingPage?._data, homePage._data)),
      safeExtract(ctx, 'extract-features', featuresSchema, () => buildFeaturesPrompt(job, featuresPage?._data, homePage._data, integrationsPage?._data)),
      safeExtract(ctx, 'extract-faqs', faqsSchema, () => buildFaqsPrompt(job, faqPage?._data, pricingPage?._data, featuresPage?._data)),
    ])
    const classification = await safeExtract(ctx, 'extract-classify', classificationSchema, () => buildClassifyPrompt(job, baseInfo, pricingInfo, featuresInfo, faqsInfo))

    extracted = assembleListing({ baseInfo, pricingInfo, featuresInfo, faqsInfo, classification })

    // ─── Self-critique ─────────────────────────────────────────────────
    critiqueResult = await step(ctx, 'self-critique', 'critique', {}, async () => {
      const prompt = buildCritiquePrompt(job, extracted)
      const out = await callGemini({
        apiKey: ctx.env.GEMINI_API_KEY, model: ctx.model,
        system: SYSTEM_CRITIQUE, prompt, responseSchema: critiqueSchema,
        thinkingBudget: 0,
      })
      ctx.totalCost += out.costUsd
      ctx.totalIn += out.inputTokens
      ctx.totalOut += out.outputTokens
      /* Dedup the flagged_fields array — Gemini sometimes lists the same
         field twice (once per concern). Counting duplicates inflated both
         the review badge ("3 issues!") and the DB row, making the human
         reviewer chase phantom problems. */
      if (out.json && Array.isArray(out.json.flagged_fields)) {
        out.json.flagged_fields = [...new Set(out.json.flagged_fields.filter(Boolean))]
      }
      return {
        input_prompt_preview: prompt.slice(0, 500),
        input_tokens: out.inputTokens,
        output_tokens: out.outputTokens,
        cost_usd: out.costUsd,
        output_excerpt: JSON.stringify(out.json).slice(0, 500),
        _data: out.json,
      }
    }).then(s => s._data)

    // ─── Validate citations (client-side, free) ────────────────────────
    await step(ctx, 'validate-citations', 'validate', {}, async () => {
      citationIssues = validateCitations(extracted)
      return {
        output_excerpt: citationIssues.length
          ? `${citationIssues.length} citation issues: ${citationIssues.slice(0, 3).map(i => i.field).join(', ')}…`
          : 'all sources present',
      }
    })

    // Wait for the concurrently-running screenshots before saving their URLs.
    await screenshotsPromise

    // ─── Save session ──────────────────────────────────────────────────
    // 'review' if the critique flagged anything, citations are missing, OR a
    // section degraded (a pass failed and came back empty) — so a partial
    // listing always lands in the human queue rather than silently as success.
    const finalStatus = (critiqueResult?.flagged_fields?.length ?? 0) > 0 || citationIssues.length > 0 || (ctx.degraded ?? 0) > 0
      ? 'review'
      : 'success'

    if (dryRun) {
      log.info?.(`[dry-run] would set session ${sessionId} status=${finalStatus}`)
      return { sessionId, extracted, critique: critiqueResult, citationIssues, cost: ctx.totalCost }
    }

    await step(ctx, 'save-session', 'save', {}, async () => {
      await exec(ctx.env,
        `UPDATE scrape_sessions SET
           status = ?,
           total_steps = ?, failed_steps = ?,
           total_input_tokens = ?, total_output_tokens = ?, total_cost_usd = ?,
           pages_fetched = ?,
           extracted_json = ?, source_citations = ?, critique_flags = ?,
           screenshot_home_url = ?, screenshot_secondary_url = ?,
           finished_at = NOW(),
           duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
         WHERE id = ?`,
        [
          finalStatus,
          ctx.stepIndex, ctx.failedSteps,
          ctx.totalIn, ctx.totalOut, round4(ctx.totalCost),
          ctx.pages,
          JSON.stringify(extracted),
          JSON.stringify(extractCitations(extracted)),
          JSON.stringify(critiqueResult ?? {}),
          homeShotUrl, secondaryShotUrl,
          sessionId,
        ]
      )

      // Cache latest session output onto the job row for quick UI reads.
      await exec(ctx.env,
        `UPDATE scrape_jobs SET
           status = ?,
           last_session_id = ?,
           total_cost_usd = total_cost_usd + ?,
           current_extracted_json = ?, current_source_citations = ?,
           current_screenshot_home_url = ?, current_screenshot_secondary_url = ?
         WHERE id = ?`,
        [
          finalStatus,
          sessionId,
          round4(ctx.totalCost),
          JSON.stringify(extracted),
          JSON.stringify(extractCitations(extracted)),
          homeShotUrl, secondaryShotUrl,
          ctx.jobId,
        ]
      )
      return { output_excerpt: `session ${sessionId} → ${finalStatus}` }
    })

    log.info?.(`✓ [job ${job.id}] ${job.slug} → ${finalStatus} in $${ctx.totalCost.toFixed(4)} (${ctx.totalIn}+${ctx.totalOut} tok, ${ctx.pages} pages)`)
    return { sessionId, extracted, critique: critiqueResult, citationIssues, cost: ctx.totalCost, status: finalStatus }
  } catch (err) {
    const wasCancelled = err?.name === 'AbortError'
    const finalStatus  = wasCancelled ? 'cancelled' : 'failed'
    const summary      = wasCancelled
      ? '[CANCELLED by admin]'
      : String(err.message).slice(0, 1000)

    log.error?.(`${wasCancelled ? '⊘' : '✗'} [job ${job.id}] ${finalStatus}: ${err.message}`)

    await exec(ctx.env,
      `UPDATE scrape_sessions SET
         status = ?, error_summary = ?,
         total_steps = ?, failed_steps = ?,
         total_input_tokens = ?, total_output_tokens = ?, total_cost_usd = ?,
         pages_fetched = ?,
         finished_at = NOW(),
         duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
       WHERE id = ?`,
      [finalStatus, summary,
       ctx.stepIndex, ctx.failedSteps + (wasCancelled ? 0 : 1),
       ctx.totalIn, ctx.totalOut, round4(ctx.totalCost),
       ctx.pages,
       sessionId]
    )
    await exec(ctx.env,
      `UPDATE scrape_jobs SET status = ?, last_session_id = ? WHERE id = ?`,
      [finalStatus, sessionId, ctx.jobId]
    )
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Step helpers
// ─────────────────────────────────────────────────────────────────────────

async function step(ctx, name, type, init = {}, fn) {
  /* Honor the admin-cancel signal at every step boundary. The signal
     is set by the worker when scrape_jobs.status flips to 'cancelled'
     (admin clicked Cancel). Throwing here short-circuits the rest of
     the pipeline; the outer catch maps AbortError → status='cancelled'. */
  if (ctx.signal?.aborted) throw new CancelledError('Job cancelled by admin')

  const stepIndex = ctx.stepIndex++
  const ins = await exec(ctx.env,
    `INSERT INTO scrape_session_steps
       (session_id, step_name, step_index, step_type, status, input_url, input_prompt_preview, started_at)
     VALUES (?, ?, ?, ?, 'running', ?, ?, NOW())`,
    [ctx.sessionId, name, stepIndex, type, init.input_url ?? null, init.input_prompt_preview ?? null]
  )
  const stepId = ins.insertId
  try {
    const result = await fn()
    if (result === null || result === undefined) {
      // Skipped path — mark as skipped, no error
      await exec(ctx.env,
        `UPDATE scrape_session_steps SET status='skipped', finished_at=NOW(),
           duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
         WHERE id = ?`,
        [stepId]
      )
      return null
    }
    await exec(ctx.env,
      `UPDATE scrape_session_steps SET
         status='ok',
         output_status_code = ?, output_bytes = ?, output_excerpt = ?,
         input_tokens = ?, output_tokens = ?, cost_usd = ?,
         finished_at = NOW(),
         duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
       WHERE id = ?`,
      [
        result.output_status_code ?? null,
        result.output_bytes ?? null,
        result.output_excerpt ?? null,
        result.input_tokens ?? null,
        result.output_tokens ?? null,
        result.cost_usd != null ? round4(result.cost_usd) : null,
        stepId,
      ]
    )

    // Cost cap circuit breaker
    if (ctx.totalCost > ctx.costCapUsd) {
      throw new Error(`Cost cap exceeded: $${ctx.totalCost.toFixed(4)} > $${ctx.costCapUsd}`)
    }

    return result
  } catch (err) {
    ctx.failedSteps++
    await exec(ctx.env,
      `UPDATE scrape_session_steps SET
         status='error', error_message = ?,
         finished_at = NOW(),
         duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
       WHERE id = ?`,
      [String(err.message).slice(0, 1000), stepId]
    )
    throw err
  }
}

/** Like step() but a return of null is "skipped" without raising. */
async function stepOptional(ctx, name, type, init, fn) {
  try {
    return await step(ctx, name, type, init || {}, fn)
  } catch (err) {
    // Optional steps swallow their error after logging — pipeline continues
    ctx.log?.warn?.(`step ${name} failed (optional): ${err.message}`)
    return null
  }
}

async function extractPass(ctx, name, schema, buildPrompt) {
  // Cache hit: short-circuit, no LLM call.
  const cached = getCached(ctx.jobId, name)
  if (cached) {
    const stepIndex = ctx.stepIndex++
    await exec(ctx.env,
      `INSERT INTO scrape_session_steps
         (session_id, step_name, step_index, step_type, status, output_excerpt, started_at, finished_at, duration_ms)
       VALUES (?, ?, ?, ?, 'ok', 'cached (no LLM call, $0)', NOW(), NOW(), 0)`,
      [ctx.sessionId, name, stepIndex, 'extract']
    )
    ctx.log?.info?.(`  [cache] ${name} — reused previous extraction`)
    return cached
  }

  // Cache miss: run normally and persist.
  const result = await step(ctx, name, 'extract', {}, async () => {
    const prompt = buildPrompt()
    const out = await callGemini({
      apiKey: ctx.env.GEMINI_API_KEY, model: ctx.model,
      system: SYSTEM_EXTRACT, prompt, responseSchema: schema,
      thinkingBudget: 0,
    })
    ctx.totalCost += out.costUsd
    ctx.totalIn += out.inputTokens
    ctx.totalOut += out.outputTokens
    return {
      input_prompt_preview: prompt.slice(0, 500),
      input_tokens: out.inputTokens,
      output_tokens: out.outputTokens,
      cost_usd: out.costUsd,
      output_excerpt: JSON.stringify(out.json).slice(0, 500),
      _data: out.json,
    }
  })
  const extracted = result?._data ?? {}
  setCached(ctx.jobId, name, extracted)
  return extracted
}

/**
 * extractPass wrapped so a hard failure never aborts the whole session.
 * callGemini already retries 429/5xx + malformed JSON; this adds one more
 * full-pass retry, and if it STILL fails marks the run degraded and returns
 * {} so the section comes back empty and the listing saves as 'review'.
 * Admin-cancel (AbortError) still propagates. Used for the parallel extract
 * round so one flaky pass can't kill the other three.
 */
async function safeExtract(ctx, name, schema, buildPrompt) {
  for (let tryNum = 0; tryNum < 2; tryNum++) {
    try {
      return await extractPass(ctx, name, schema, buildPrompt)
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      if (tryNum === 0) {
        ctx.log?.warn?.(`  extract ${name} failed, retrying once: ${err.message}`)
        continue
      }
      ctx.degraded = (ctx.degraded ?? 0) + 1
      ctx.log?.warn?.(`  extract ${name} degraded to empty after retry: ${err.message}`)
      return {}
    }
  }
  return {}
}

/**
 * Capture one screenshot and upload it to cPanel. On UPLOAD failure (not
 * capture failure) returns the local dev path flagged in the excerpt rather
 * than throwing — matching the previous behaviour. A capture failure throws
 * and is swallowed by the optional step wrapper, so the run still continues.
 */
async function captureAndUpload(ctx, url, file, filename, publicBase) {
  await captureScreenshot(url, file)
  const siteBase = ctx.env.SITE_BASE || 'http://localhost:3000'
  ctx.log?.info?.(`  uploading ${filename} → ${siteBase}/api/upload`)
  try {
    const uploaded = await uploadScreenshot(file, filename, siteBase)
    return { output_excerpt: uploaded, _data: uploaded }
  } catch (err) {
    const local = `${publicBase}/${filename}`
    return {
      output_excerpt: `[UPLOAD FAILED — dev-only path] ${local} :: ${err.message?.slice(0, 120)}`,
      _data: local,
    }
  }
}

/**
 * Cached version of step(). Use for steps where re-running on retry is
 * wasteful (network fetch, LLM call). On cache hit we still write a step
 * row so the UI timeline reflects the cached work.
 */
async function cachedStep(ctx, name, type, init, fn) {
  const cached = getCached(ctx.jobId, name)
  if (cached !== null) {
    const stepIndex = ctx.stepIndex++
    await exec(ctx.env,
      `INSERT INTO scrape_session_steps
         (session_id, step_name, step_index, step_type, status, output_excerpt, started_at, finished_at, duration_ms)
       VALUES (?, ?, ?, ?, 'ok', 'cached (from previous session)', NOW(), NOW(), 0)`,
      [ctx.sessionId, name, stepIndex, type]
    )
    ctx.log?.info?.(`  [cache] ${name}`)
    return { _data: cached, cached: true }
  }
  const result = await step(ctx, name, type, init, fn)
  if (result?._data !== undefined && result?._data !== null) {
    setCached(ctx.jobId, name, result._data)
  }
  return result
}

/** cachedStep but swallows errors so the pipeline continues. Admin-cancel
 *  (AbortError) is the one error that must still propagate — otherwise a
 *  cancel landing during a swallowed (crawl/screenshot) step would be eaten
 *  and the run would keep going. */
async function cachedStepOptional(ctx, name, type, init, fn) {
  try {
    return await cachedStep(ctx, name, type, init || {}, fn)
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    ctx.log?.warn?.(`step ${name} failed (optional): ${err.message}`)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Prompts
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM_EXTRACT = `You extract structured listing data for a B2B directory.

Hard rules — non-negotiable:
1. REAL INFO ONLY. If a fact is not present in the supplied HTML or text, set the value to null. Do NOT infer pricing, compliance certifications (SOC 2, HIPAA, GDPR, ISO 27001), integrations, features, or claims from prior knowledge of the company.
2. Every non-null field MUST have a paired _source_url and _source_quote citing the exact location and a verbatim snippet from the page.
3. _source_quote must be a VERBATIM substring of the cleaned HTML / text, max 200 chars. If you cannot quote it, the value MUST be null.
4. Write content for SEO + AEO + GEO: clear, factual, keyword-aware, answer-shaped. No hype, no marketing fluff, no generic filler.
5. Output valid JSON conforming to the supplied responseSchema. No prose outside the JSON.`

const SYSTEM_CRITIQUE = `You are auditing extracted listing data for hallucinations.

For each non-null field in the supplied JSON, ask: is this claim plausibly grounded in the listed company's reality, given typical patterns? Flag any field that:
- Asserts a compliance certification (SOC 2, HIPAA, ISO, GDPR) without strong evidence
- Has suspiciously generic pricing (e.g. "$10/$20/$50" for unknown products)
- Claims features that contradict the description
- Reuses boilerplate phrasings ("industry-leading", "best-in-class") suggesting padding

Return overall_quality + flagged_fields array. Be conservative — only flag concrete suspicions, not stylistic preferences.`

function buildBasePrompt(job, home, about) {
  const homeHtml = cleanHtml(home?.html ?? '', 32000)
  const aboutHtml = about ? cleanHtml(about.html, 16000) : ''
  return [
    `Extract base information for: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    `=== HOME PAGE HTML (${home?.finalUrl}) ===`,
    homeHtml,
    aboutHtml ? `\n\n=== ABOUT PAGE HTML (${about.finalUrl}) ===\n${aboutHtml}` : '',
    ``,
    `=== EXTRACTION RULES ===`,
    `tagline: one sharp sentence, max 110 chars, paraphrase or direct quote from the hero.`,
    ``,
    `description: MUST be 200-350 words, written in proper paragraphs separated by`,
    `  blank lines (\\n\\n between paragraphs). Structure:`,
    `    - Paragraph 1 (3-4 sentences): what the product IS — its core value proposition,`,
    `      who it serves, and what category it falls into. Open with the company name.`,
    `    - Paragraph 2 (3-4 sentences): WHAT IT DOES — primary capabilities, the workflows`,
    `      or problems it solves, and notable differentiators.`,
    `    - Paragraph 3 (2-3 sentences): credibility / scale — funding, customers, founding`,
    `      story, ecosystem position. Only include facts grounded in the supplied HTML.`,
    `  Real, factual, SEO + AEO friendly. NO marketing hype ("revolutionary",`,
    `  "best-in-class", "game-changing"). NO filler. Every claim must be supported by`,
    `  the page content.`,
    ``,
    `founded_year, hq_city, hq_country_code, team_size: extract only if explicitly stated.`,
    `  null otherwise. team_size in canonical bands ('1-10', '11-50', '51-200', '201-500',`,
    `  '501-1000', '1000+').`,
    ``,
    `linkedin_url, twitter_url: pull from social icons / footer. Full URLs only.`,
    ``,
    `Every non-null field needs _source_url + _source_quote (verbatim from HTML).`,
  ].join('\n')
}

function buildPricingPrompt(job, pricing, home) {
  const pricingHtml = pricing ? cleanHtml(pricing.html, 32000) : ''
  const homeHtml = pricing ? '' : cleanHtml(home?.html ?? '', 24000)
  return [
    `Extract pricing for: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    pricing
      ? `=== PRICING PAGE HTML (${pricing.finalUrl}) ===\n${pricingHtml}`
      : `=== NO DEDICATED PRICING PAGE — using home as fallback ===\n${homeHtml}`,
    ``,
    `Real prices only. If a tier is "Contact us", set price=null period='custom'. Currency in starting_price_currency (USD/EUR/GBP/JPY/INR/etc.). Each non-null field needs source.`,
  ].join('\n')
}

function buildFeaturesPrompt(job, features, home, integrations) {
  /* Token budget per pass is shared across the available pages. When we
     have a dedicated integrations page, give it real space (28k tokens)
     so the LLM can read the whole directory. Trim the others to fit. */
  const hasIntegrations = !!integrations
  const hasFeatures = !!features
  const featuresHtml      = hasFeatures      ? cleanHtml(features.html,     hasIntegrations ? 18000 : 28000) : ''
  const integrationsHtml  = hasIntegrations  ? cleanHtml(integrations.html, 28000) : ''
  const homeHtml          = cleanHtml(home?.html ?? '', hasFeatures || hasIntegrations ? 10000 : 32000)

  const sections = []
  if (hasFeatures) sections.push(`=== FEATURES PAGE HTML (${features.finalUrl}) ===\n${featuresHtml}`)
  if (hasIntegrations) sections.push(`=== INTEGRATIONS PAGE HTML (${integrations.finalUrl}) ===\n${integrationsHtml}`)
  sections.push(`=== HOME PAGE HTML (${home?.finalUrl}) ===\n${homeHtml}`)

  return [
    `Extract features + integrations + apps for: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    sections.join('\n\n'),
    ``,
    `=== EXTRACTION RULES ===`,
    ``,
    `key_features: 10-15 RICH feature objects. Each object MUST have:`,
    `  - name: short headline (3-7 words, no period). Distinct, concrete, action-bearing`,
    `    (NOT marketing categories like "Powerful AI" — instead "Real-time transcription`,
    `    of Zoom meetings"). These are the headline capabilities the company itself`,
    `    promotes hardest.`,
    `  - description: 1-2 sentences (25-60 words) explaining what the feature does and`,
    `    why it matters. Grounded in the page — paraphrase or extend an on-page claim.`,
    `  - source_quote: a verbatim snippet from the HTML that establishes the feature.`,
    ``,
    `features: 15-25 broader capabilities as plain strings (3-10 words each). This is`,
    `  the COMPREHENSIVE "all features" list — should include everything from`,
    `  key_features plus more granular items (integrations stubs, format support,`,
    `  export options, etc.). Real things mentioned on the page, no padding.`,
    ``,
    `integrations: AT LEAST 8 if any are visible, up to 30. This is one of the`,
    `  most important fields for the listing — work HARD to find them.`,
    `  Sources to search across all supplied HTML:`,
    `    - dedicated integrations / apps / partners / marketplace pages`,
    `    - logo walls ("Trusted by", "Works with", "Connects with")`,
    `    - alt-text + image filenames + brand names in <img> tags`,
    `    - feature copy that mentions specific products ("syncs with Slack",`,
    `      "exports to Notion", "connects to Salesforce")`,
    `    - pricing-tier feature lists that name specific tools`,
    `  Each integration = {`,
    `    name: the integration target as a brand (e.g. "Slack", "Microsoft Teams"),`,
    `    website: canonical URL of the integration target (e.g. https://slack.com),`,
    `    description: 1 sentence explaining what the integration does — be specific`,
    `      ("Send recorded videos directly to a Slack channel" not "Connects with Slack")`,
    `  }`,
    `  Do NOT invent integrations — only list brands genuinely named on the supplied`,
    `  HTML. If absolutely none visible after a hard search, return [].`,
    ``,
    `languages: spoken/output languages supported (English, Spanish, etc.). Not`,
    `  programming languages.`,
    ``,
    `compliance: ONLY certifications EXPLICITLY visible on the page — e.g. "SOC 2`,
    `  Type II", "HIPAA", "GDPR", "ISO 27001". Do NOT assume from "enterprise" or`,
    `  "secure" language. Return [] if none visible. compliance_source_quote must`,
    `  contain the literal certification name.`,
    ``,
    `has_ios_app / has_android_app: true only if app store links / "Download on the`,
    `  App Store" / "Get it on Google Play" buttons are present. null if uncertain.`,
  ].join('\n')
}

function buildFaqsPrompt(job, faq, pricing, features) {
  const parts = []
  if (faq)      parts.push(`=== FAQ PAGE (${faq.finalUrl}) ===\n${cleanHtml(faq.html, 24000)}`)
  if (pricing)  parts.push(`=== PRICING PAGE (${pricing.finalUrl}) ===\n${cleanHtml(pricing.html, 12000)}`)
  if (features) parts.push(`=== FEATURES PAGE (${features.finalUrl}) ===\n${cleanHtml(features.html, 8000)}`)
  return [
    `Build 8 high-value FAQs for: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    parts.length ? parts.join('\n\n') : '=== NO RELEVANT PAGES FOUND ===',
    ``,
    `=== FAQ RULES ===`,
    ``,
    `Generate exactly 8 FAQs targeting Google "People Also Ask", AI Overview, and`,
    `ChatGPT / Perplexity citations. Mix of:`,
    `  - 2 pricing / billing questions (cost, free tier, refund, trial)`,
    `  - 2 capability / feature questions ("Does X support Y?", "Can I do Z with X?")`,
    `  - 2 comparison / category questions ("What is X?", "Who is X best for?")`,
    `  - 2 logistics questions (integrations, security, languages, deployment)`,
    ``,
    `Each question MUST start with: How / What / Does / Is / Can / Why / Who.`,
    `Each answer: 40-90 words, factual, grounded in the supplied pages. Direct answer`,
    `in the first sentence (AEO best practice). No hedging language ("might be","could be").`,
    `Real info only. If you can't answer from the pages, pick a different question.`,
    ``,
    `Each FAQ object also gets source_url + source_quote citing where in the HTML the`,
    `answer is grounded.`,
  ].join('\n')
}

function buildClassifyPrompt(job, baseInfo, pricingInfo, featuresInfo, faqsInfo) {
  const topFeatures = (featuresInfo.key_features ?? []).slice(0, 8).map(kf => {
    if (typeof kf === 'string') return kf
    return kf.name || ''
  }).filter(Boolean).join('; ')

  return [
    `Classify and label: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    `Already extracted (use these to inform classification):`,
    `Tagline: ${baseInfo.tagline ?? '(unknown)'}`,
    `Description: ${baseInfo.description ?? '(unknown)'}`,
    `Pricing model: ${pricingInfo.pricing_model ?? '(unknown)'}`,
    `Top key features: ${topFeatures || '(none)'}`,
    `FAQ topics: ${(faqsInfo.faqs ?? []).slice(0, 4).map(f => f.question).join(' | ')}`,
    ``,
    `=== OUTPUT RULES ===`,
    ``,
    `header_tags: exactly 3 short distinctive tags (1-3 words each). Industry / model /`,
    `  positioning hints. e.g. ["Open-weight models", "European AI", "Codestral"].`,
    ``,
    `industries_served: 6-10 industries this product serves. Concrete sectors`,
    `  (SaaS & Software, E-commerce, Financial Services, Healthcare…), not buyer`,
    `  archetypes ("growing companies"). Include only what the page evidence supports;`,
    `  err on broader inclusion when product is horizontal.`,
    ``,
    `use_cases: 8-10 concrete use cases. Format: "Use case name" (3-7 words). Specific`,
    `  workflows or jobs-to-be-done, not features ("Onboard new hires", "Triage`,
    `  customer tickets", "Search across docs"). Derive from features + FAQs.`,
    ``,
    `target_company_sizes: subset of [Freelancers, Small businesses, Midsize companies,`,
    `  Enterprises]. Use pricing tiers as signal — free / starter tier = SMB-included;`,
    `  custom / enterprise tier = Enterprise-included.`,
    ``,
    `pros: exactly 8 distinctive strengths. Concrete, specific, no clichés. Derived`,
    `  from extracted features + pricing + integrations. Examples of bad pros to AVOID:`,
    `  "Easy to use", "Reliable", "Great support". Good examples: "Free tier handles`,
    `  unlimited messages with no token cap", "Native VS Code + JetBrains plugins"`,
    ``,
    `cons: exactly 5 honest weaknesses. Balanced — no padding ("Subscription required"`,
    `  is filler unless the listing distinguishes on that). Real tradeoffs, e.g.`,
    `  "Browser-only — no desktop app", "Pricing scales with seats".`,
    ``,
    `support_channels: 3-6 channels. Derive from extracted evidence ("Email support",`,
    `  "Live chat", "Help center", "Community forum", "Dedicated CSM"). Be conservative —`,
    `  if only a contact form exists, just list "Email support".`,
    ``,
    `training_options: 3-6 channels. ("Documentation", "Video tutorials", "Webinars",`,
    `  "Knowledge base"). Skip "Onboarding workshops" unless visible.`,
    ``,
    `No citations required for classification — these are derived labels, not extracted facts.`,
  ].join('\n')
}

function buildCritiquePrompt(job, extracted) {
  return [
    `Audit this extracted JSON for hallucinations and weak claims.`,
    `Company: ${job.company_name || job.slug}`,
    ``,
    `Extracted data:`,
    JSON.stringify(extracted, null, 2).slice(0, 30000),
    ``,
    `Be conservative — flag only concrete suspicions. Return JSON per schema.`,
  ].join('\n')
}

// ─────────────────────────────────────────────────────────────────────────
// Assembly + citation extraction
// ─────────────────────────────────────────────────────────────────────────

function assembleListing({ baseInfo, pricingInfo, featuresInfo, faqsInfo, classification }) {
  return {
    tagline: baseInfo.tagline ?? null,
    description: baseInfo.description ?? null,
    founded_year: baseInfo.founded_year ?? null,
    hq_city: baseInfo.hq_city ?? null,
    hq_country_code: baseInfo.hq_country_code ?? null,
    team_size: baseInfo.team_size ?? null,
    logo_url: baseInfo.logo_url ?? null,
    linkedin_url: baseInfo.linkedin_url ?? null,
    twitter_url: baseInfo.twitter_url ?? null,

    pricing_model: pricingInfo.pricing_model ?? null,
    pricing_tiers: pricingInfo.pricing_tiers ?? [],
    starting_price: pricingInfo.starting_price ?? null,
    starting_price_period: pricingInfo.starting_price_period ?? null,
    starting_price_currency: pricingInfo.starting_price_currency ?? null,
    has_free_trial: pricingInfo.has_free_trial ?? null,
    has_free_version: pricingInfo.has_free_version ?? null,

    /* key_features is now an array of {name, description} objects so the
       listing page can render headline + paragraph per feature. features
       is the broader "all features" list as plain strings. */
    key_features: normalizeKeyFeatures(featuresInfo.key_features),
    features: Array.isArray(featuresInfo.features) ? featuresInfo.features : [],
    integrations: featuresInfo.integrations ?? [],
    languages: featuresInfo.languages ?? [],
    compliance: featuresInfo.compliance ?? [],
    has_ios_app: featuresInfo.has_ios_app ?? null,
    has_android_app: featuresInfo.has_android_app ?? null,

    faqs: faqsInfo.faqs ?? [],

    header_tags: classification.header_tags ?? [],
    industries_served: classification.industries_served ?? [],
    use_cases: classification.use_cases ?? [],
    target_company_sizes: classification.target_company_sizes ?? [],
    pros: classification.pros ?? [],
    cons: classification.cons ?? [],
    support_channels: classification.support_channels ?? [],
    training_options: classification.training_options ?? [],

    // Carry sources separately for the review UI
    _sources: {
      tagline:        { url: baseInfo.tagline_source_url ?? null,      quote: baseInfo.tagline_source_quote ?? null },
      description:    { url: baseInfo.description_source_url ?? null,  quote: baseInfo.description_source_quote ?? null },
      founded_year:   { url: baseInfo.founded_year_source_url ?? null, quote: baseInfo.founded_year_source_quote ?? null },
      hq:             { url: baseInfo.hq_source_url ?? null,           quote: baseInfo.hq_source_quote ?? null },
      team_size:      { url: baseInfo.team_size_source_url ?? null,    quote: baseInfo.team_size_source_quote ?? null },
      pricing:        { url: pricingInfo.pricing_source_url ?? null,   quote: pricingInfo.pricing_source_quote ?? null },
      free_tier:      { url: pricingInfo.free_tier_source_url ?? null, quote: pricingInfo.free_tier_source_quote ?? null },
      key_features:   { url: featuresInfo.key_features_source_url ?? null },
      integrations:   { url: featuresInfo.integrations_source_url ?? null },
      compliance:     { url: featuresInfo.compliance_source_url ?? null, quote: featuresInfo.compliance_source_quote ?? null },
      apps:           { url: featuresInfo.apps_source_url ?? null,     quote: featuresInfo.apps_source_quote ?? null },
      faqs:           (faqsInfo.faqs ?? []).map(f => ({ url: f.source_url ?? null, quote: f.source_quote ?? null })),
    },
  }
}

function extractCitations(extracted) {
  return extracted._sources ?? {}
}

/**
 * Coerce key_features into the shape the listing page expects:
 * [{ name, description }]. Tolerates the older string[] shape (early
 * scrape sessions and the manually-written AI/ML 26 enrichments).
 */
function normalizeKeyFeatures(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(item => {
    if (typeof item === 'string') return { name: item, description: '' }
    if (item && typeof item === 'object') {
      return {
        name: String(item.name ?? '').trim(),
        description: String(item.description ?? '').trim(),
      }
    }
    return { name: '', description: '' }
  }).filter(it => it.name)
}

/**
 * Verify every non-null user-visible field has a paired source. Returns an
 * array of issues (empty = perfect). Used both by the validate step and the
 * UI review panel.
 */
export function validateCitations(extracted) {
  const issues = []
  const s = extracted._sources ?? {}

  /* Source URLs must be real http(s):// URLs — Gemini occasionally
     returns the page label ("Pricing page") or the slug ("pricing") and
     the field appears citation-pass. Tightening the check here means a
     malformed source actually shows up as a citation issue and the
     session lands in 'review' instead of 'success'. */
  const goodUrl = (u) => typeof u === 'string' && /^https?:\/\/\S+/i.test(u.trim())
  const goodQuote = (q) => typeof q === 'string' && q.trim().length >= 6

  for (const [field, srcKey] of [
    ['tagline', 'tagline'],
    ['description', 'description'],
    ['founded_year', 'founded_year'],
    ['hq_city', 'hq'],
    ['team_size', 'team_size'],
  ]) {
    if (extracted[field] != null) {
      if (!goodUrl(s[srcKey]?.url) || !goodQuote(s[srcKey]?.quote)) {
        issues.push({ field, reason: 'missing or malformed source url + quote' })
      }
    }
  }

  if ((extracted.pricing_tiers?.length ?? 0) > 0 && !goodUrl(s.pricing?.url)) {
    issues.push({ field: 'pricing_tiers', reason: 'missing or malformed source url' })
  }
  if ((extracted.compliance?.length ?? 0) > 0 && !(goodUrl(s.compliance?.url) && goodQuote(s.compliance?.quote))) {
    issues.push({ field: 'compliance', reason: 'compliance claim without quotable source — REJECT by default' })
  }
  if ((extracted.faqs?.length ?? 0) > 0) {
    const unsourced = (s.faqs ?? []).filter(c => !goodUrl(c?.url)).length
    if (unsourced > 0) issues.push({ field: 'faqs', reason: `${unsourced} FAQ(s) without valid source url` })
  }

  return issues
}

function round4(n) { return Math.round(Number(n) * 10000) / 10000 }
