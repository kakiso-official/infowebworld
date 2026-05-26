#!/usr/bin/env node
/**
 * Bootstrap scrape_jobs with the listings already enriched.
 *
 * Imports every submissions row that has rich JSON populated
 * (pricing_tiers IS NOT NULL) as a scrape_jobs row at status='applied'.
 * The system therefore knows day-1 that these companies are "done" and
 * Add Companies won't re-queue them.
 *
 * Walks the categories tree to find the L1 ancestor slug — same approach
 * the listing page uses for sector landings. Falls back to the listing's
 * existing category slug if the walk fails.
 *
 * Idempotent: ON DUPLICATE KEY UPDATE refreshes the cached JSON for any
 * slug that already exists in scrape_jobs.
 *
 * Usage:
 *   node scripts/seed-applied-jobs.mjs              # all enriched listings
 *   node scripts/seed-applied-jobs.mjs --dry-run    # show what would be inserted
 */
import { loadEnv, requireEnv } from './lib/scrape-env.mjs'
import { closeDb, q, exec } from './lib/scrape-db.mjs'

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...rest] = a.slice(2).split('=')
      return [k, rest.length ? rest.join('=') : true]
    })
)
const dryRun = !!args['dry-run']

const env = loadEnv()
requireEnv(env, ['DATABASE_HOST', 'DATABASE_USER'])

console.log(`Seeding scrape_jobs from existing enriched submissions ${dryRun ? '(DRY RUN)' : ''}`)

// Build a flat lookup of category id → L1 slug. Walk parent_id at most
// 5 levels (taxonomy max depth).
const allCats = await q(env, `SELECT id, slug, level, parent_id FROM categories`)
const byId = new Map(allCats.map(c => [c.id, c]))
const l1ByCatId = new Map()
for (const cat of allCats) {
  let cur = cat
  let depth = 0
  while (cur && cur.level > 1 && depth < 6) {
    cur = byId.get(cur.parent_id)
    depth++
  }
  if (cur) l1ByCatId.set(cat.id, cur.slug)
}

// Select enriched listings.
const listings = await q(env, `
  SELECT s.id, s.slug, s.company_name, s.website, s.category_id,
         c.slug AS category_slug,
         s.tagline, s.description, s.founded_year, s.team_size,
         s.header_tags, s.industries_served, s.use_cases, s.target_company_sizes,
         s.key_features, s.features, s.pricing_model, s.pricing_tiers,
         s.integrations, s.support_channels, s.training_options, s.languages,
         s.compliance, s.faqs, s.pros, s.cons,
         s.starting_price, s.starting_price_period,
         s.has_free_trial, s.has_free_version, s.has_ios_app, s.has_android_app,
         s.updated_at
    FROM submissions s
    LEFT JOIN categories c ON c.id = s.category_id
   WHERE s.pricing_tiers IS NOT NULL
     AND s.status = 'active'
   ORDER BY s.id ASC
`)

console.log(`Found ${listings.length} enriched listing(s)`)

let inserted = 0
let updated = 0
let skipped = 0

for (const row of listings) {
  const l1 = l1ByCatId.get(row.category_id) ?? row.category_slug ?? null
  if (!l1) {
    console.warn(`  skip ${row.slug} — could not resolve L1`)
    skipped++
    continue
  }
  if (!row.website) {
    console.warn(`  skip ${row.slug} — no website`)
    skipped++
    continue
  }

  const extracted = {
    tagline: row.tagline,
    description: row.description,
    founded_year: row.founded_year,
    team_size: row.team_size,
    header_tags: jsonOr(row.header_tags, []),
    industries_served: jsonOr(row.industries_served, []),
    use_cases: jsonOr(row.use_cases, []),
    target_company_sizes: jsonOr(row.target_company_sizes, []),
    key_features: jsonOr(row.key_features, []),
    features: jsonOr(row.features, []),
    pricing_model: row.pricing_model,
    pricing_tiers: jsonOr(row.pricing_tiers, []),
    integrations: jsonOr(row.integrations, []),
    support_channels: jsonOr(row.support_channels, []),
    training_options: jsonOr(row.training_options, []),
    languages: jsonOr(row.languages, []),
    compliance: jsonOr(row.compliance, []),
    faqs: jsonOr(row.faqs, []),
    pros: jsonOr(row.pros, []),
    cons: jsonOr(row.cons, []),
    starting_price: row.starting_price,
    starting_price_period: row.starting_price_period,
    has_free_trial: row.has_free_trial == null ? null : !!row.has_free_trial,
    has_free_version: row.has_free_version == null ? null : !!row.has_free_version,
    has_ios_app: row.has_ios_app == null ? null : !!row.has_ios_app,
    has_android_app: row.has_android_app == null ? null : !!row.has_android_app,
    _seeded_from_submissions: true,
  }

  if (dryRun) {
    console.log(`  [dry] ${row.slug}  L1=${l1}  cat=${row.category_slug}`)
    inserted++
    continue
  }

  const result = await exec(env, `
    INSERT INTO scrape_jobs
      (slug, company_name, website, category_l1, category_slug,
       status, applied_at, current_extracted_json)
    VALUES (?, ?, ?, ?, ?, 'applied', ?, ?)
    ON DUPLICATE KEY UPDATE
      company_name = VALUES(company_name),
      website = VALUES(website),
      category_l1 = VALUES(category_l1),
      category_slug = VALUES(category_slug),
      status = 'applied',
      applied_at = VALUES(applied_at),
      current_extracted_json = VALUES(current_extracted_json)
  `, [
    row.slug,
    row.company_name,
    row.website,
    l1,
    row.category_slug,
    row.updated_at,
    JSON.stringify(extracted),
  ])

  if (result.affectedRows === 1) inserted++
  else if (result.affectedRows === 2) updated++
  else skipped++
}

console.log(`Done.  inserted=${inserted}  updated=${updated}  skipped=${skipped}`)

await closeDb()

function jsonOr(value, fallback) {
  if (value == null) return fallback
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return fallback }
  }
  return value
}
