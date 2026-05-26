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
} from './scrape-crawler.mjs'
import { captureScreenshot } from './scrape-screenshot.mjs'
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

export async function scrapeListing({
  env,
  jobId,
  model = 'gemini-2.5-pro',
  publicScreenshotBase = '/scrape-screenshots',
  screenshotOutDir,
  log = console,
  costCapUsd = 0.50,
  dryRun = false,
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
    env, sessionId, jobId: job.id, model, log, costCapUsd,
    stepIndex: 0, totalCost: 0, totalIn: 0, totalOut: 0, pages: 0, failedSteps: 0,
  }

  let homePage = null
  let aboutPage = null
  let pricingPage = null
  let featuresPage = null
  let faqPage = null
  let homeShotUrl = null
  let secondaryShotUrl = null
  let extracted = null
  let citationIssues = []
  let critiqueResult = null

  try {
    // ─── Crawl phase (cached per job — retries don't re-fetch) ─────────
    homePage = await cachedStep(ctx, 'crawl-home', 'crawl',
      { input_url: job.website },
      async () => {
        const res = await fetchPage(job.website)
        ctx.pages++
        return {
          output_status_code: res.status,
          output_bytes: res.bytes,
          output_excerpt: (res.title || '').slice(0, 200),
          _data: res,
        }
      })

    aboutPage = await cachedStepOptional(ctx, 'crawl-about', 'crawl', null, async () => {
      const res = await fetchWithFallback(job.website, ABOUT_FALLBACKS)
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

    pricingPage = await cachedStepOptional(ctx, 'crawl-pricing', 'crawl', null, async () => {
      const res = await fetchWithFallback(job.website, PRICING_FALLBACKS)
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

    featuresPage = await cachedStepOptional(ctx, 'crawl-features', 'crawl', null, async () => {
      const res = await fetchWithFallback(job.website, FEATURES_FALLBACKS)
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

    faqPage = await cachedStepOptional(ctx, 'crawl-faq', 'crawl', null, async () => {
      const res = await fetchWithFallback(job.website, FAQ_FALLBACKS)
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

    // ─── Screenshots ───────────────────────────────────────────────────
    if (!screenshotOutDir) screenshotOutDir = join(process.cwd(), 'public', 'scrape-screenshots')
    mkdirSync(screenshotOutDir, { recursive: true })

    await step(ctx, 'screenshot-home', 'screenshot', { input_url: job.website }, async () => {
      const file = join(screenshotOutDir, `${job.slug}-home.jpg`)
      await captureScreenshot(job.website, file)
      homeShotUrl = `${publicScreenshotBase}/${job.slug}-home.jpg`
      return { output_excerpt: homeShotUrl }
    })

    const secondaryCandidate = pricingPage?._data ?? featuresPage?._data ?? aboutPage?._data ?? null
    if (secondaryCandidate) {
      await stepOptional(ctx, 'screenshot-secondary', 'screenshot',
        { input_url: secondaryCandidate.finalUrl },
        async () => {
          const file = join(screenshotOutDir, `${job.slug}-secondary.jpg`)
          await captureScreenshot(secondaryCandidate.finalUrl, file)
          secondaryShotUrl = `${publicScreenshotBase}/${job.slug}-secondary.jpg`
          return { output_excerpt: secondaryShotUrl }
        })
    }

    // ─── Extract passes ────────────────────────────────────────────────
    const baseInfo = await extractPass(ctx, 'extract-base', baseInfoSchema, () => buildBasePrompt(job, homePage._data, aboutPage?._data))
    const pricingInfo = await extractPass(ctx, 'extract-pricing', pricingSchema, () => buildPricingPrompt(job, pricingPage?._data, homePage._data))
    const featuresInfo = await extractPass(ctx, 'extract-features', featuresSchema, () => buildFeaturesPrompt(job, featuresPage?._data, homePage._data))
    const faqsInfo = await extractPass(ctx, 'extract-faqs', faqsSchema, () => buildFaqsPrompt(job, faqPage?._data, pricingPage?._data, featuresPage?._data))
    const classification = await extractPass(ctx, 'extract-classify', classificationSchema, () => buildClassifyPrompt(job, baseInfo, pricingInfo, featuresInfo, faqsInfo))

    extracted = assembleListing({ baseInfo, pricingInfo, featuresInfo, faqsInfo, classification })

    // ─── Self-critique ─────────────────────────────────────────────────
    critiqueResult = await step(ctx, 'self-critique', 'critique', {}, async () => {
      const prompt = buildCritiquePrompt(job, extracted)
      const out = await callGemini({
        apiKey: ctx.env.GEMINI_API_KEY, model: ctx.model,
        system: SYSTEM_CRITIQUE, prompt, responseSchema: critiqueSchema,
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

    // ─── Save session ──────────────────────────────────────────────────
    const finalStatus = (critiqueResult?.flagged_fields?.length ?? 0) > 0 || citationIssues.length > 0
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
    log.error?.(`✗ [job ${job.id}] failed: ${err.message}`)
    await exec(ctx.env,
      `UPDATE scrape_sessions SET
         status = 'failed', error_summary = ?,
         total_steps = ?, failed_steps = ?,
         total_input_tokens = ?, total_output_tokens = ?, total_cost_usd = ?,
         pages_fetched = ?,
         finished_at = NOW(),
         duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
       WHERE id = ?`,
      [String(err.message).slice(0, 1000),
       ctx.stepIndex, ctx.failedSteps + 1,
       ctx.totalIn, ctx.totalOut, round4(ctx.totalCost),
       ctx.pages,
       sessionId]
    )
    await exec(ctx.env,
      `UPDATE scrape_jobs SET status = 'failed', last_session_id = ? WHERE id = ?`,
      [sessionId, ctx.jobId]
    )
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Step helpers
// ─────────────────────────────────────────────────────────────────────────

async function step(ctx, name, type, init = {}, fn) {
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

/** cachedStep but swallows errors so the pipeline continues. */
async function cachedStepOptional(ctx, name, type, init, fn) {
  try {
    return await cachedStep(ctx, name, type, init || {}, fn)
  } catch (err) {
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

function buildFeaturesPrompt(job, features, home) {
  const featuresHtml = features ? cleanHtml(features.html, 28000) : ''
  const homeHtml = cleanHtml(home?.html ?? '', features ? 12000 : 32000)
  return [
    `Extract features + integrations + apps for: ${job.company_name || job.slug}`,
    `Website: ${job.website}`,
    ``,
    features
      ? `=== FEATURES PAGE HTML (${features.finalUrl}) ===\n${featuresHtml}\n\n=== HOME PAGE (for context) ===\n${homeHtml}`
      : `=== HOME PAGE (no dedicated features page) ===\n${homeHtml}`,
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
    `integrations: at least 5 if any are visible. Each = name (the integration target),`,
    `  website (canonical URL — e.g. https://www.salesforce.com), description (1`,
    `  sentence explaining what the integration does or what it enables).`,
    `  Pull from "Integrations" sections, logo walls, "Works with X" mentions.`,
    `  If NO integrations are visible anywhere, return [] rather than inventing.`,
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

  for (const [field, srcKey] of [
    ['tagline', 'tagline'],
    ['description', 'description'],
    ['founded_year', 'founded_year'],
    ['hq_city', 'hq'],
    ['team_size', 'team_size'],
  ]) {
    if (extracted[field] != null && !(s[srcKey]?.url && s[srcKey]?.quote)) {
      issues.push({ field, reason: 'missing source url + quote' })
    }
  }

  if ((extracted.pricing_tiers?.length ?? 0) > 0 && !s.pricing?.url) {
    issues.push({ field: 'pricing_tiers', reason: 'missing source url' })
  }
  if ((extracted.compliance?.length ?? 0) > 0 && !(s.compliance?.url && s.compliance?.quote)) {
    issues.push({ field: 'compliance', reason: 'compliance claim without quotable source — REJECT by default' })
  }
  if ((extracted.faqs?.length ?? 0) > 0) {
    const unsourced = (s.faqs ?? []).filter(c => !c.url).length
    if (unsourced > 0) issues.push({ field: 'faqs', reason: `${unsourced} FAQ(s) without source` })
  }

  return issues
}

function round4(n) { return Math.round(Number(n) * 10000) / 10000 }
