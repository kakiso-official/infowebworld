#!/usr/bin/env node
/**
 * Generator: database/seed-pro-services-200.sql
 *
 * ~200 real, web-verified professional-services COMPANY listings
 * (listing_mode='company') for the Clutch-style /profile/[slug] UI, spread
 * across the 19 Professional Services L2 fields, global mix of countries.
 *
 * Clone of gen-it-companies-200-sql.mjs. Factual fields come from research
 * (scripts/pro-services-200.data.mjs, merged from scripts/research-ps/g*.json).
 * Presentation sections (tagline, service mix, focus split, pricing band,
 * languages, timezone, FAQs, clients summary) are DERIVED here so every
 * profile renders complete. Pricing is a regional estimate the owner refines.
 *
 * SEEDED NOT LIVE: status='pending', user_id=NULL (claimable), payment='unpaid'.
 * Review in /iww-hq/submissions, then run the GO-LIVE block + redeploy.
 *
 * Re-runnable: deletes its own slugs first. Logos = Google favicon API.
 * Regenerate:  node scripts/gen-pro-services-200-sql.mjs
 */
import { writeFileSync } from 'node:fs'
import { COMPANIES_RAW } from './pro-services-200.data.mjs'
import { ENRICH_RAW } from './pro-services-200.enrich.mjs'

/* Enrichment overlay (awards / videos / clients), keyed by normalised domain. */
const ENRICH = new Map(
  (ENRICH_RAW || []).map((e) => [String(e.domain || '').toLowerCase().replace(/^www\./, ''), e]),
)

/* ── SQL value helpers ── */
const s = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)
const n = (v) => (v == null || v === '' ? 'NULL' : String(Number(v)))
const j = (v) => (v == null ? 'NULL' : `'${JSON.stringify(v).replace(/'/g, "''")}'`)
const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`

/* ── Country reference: name, dial code, languages, timezone, pricing tier ── */
const COUNTRY = {
  US: { name: 'United States', ph: '+1', langs: ['English'], tz: 'GMT-05:00 (Eastern)', tier: 'C' },
  CA: { name: 'Canada', ph: '+1', langs: ['English', 'French'], tz: 'GMT-05:00 (Eastern)', tier: 'C' },
  GB: { name: 'United Kingdom', ph: '+44', langs: ['English'], tz: 'GMT+00:00 (GMT)', tier: 'C' },
  IE: { name: 'Ireland', ph: '+353', langs: ['English'], tz: 'GMT+00:00 (GMT)', tier: 'C' },
  DE: { name: 'Germany', ph: '+49', langs: ['English', 'German'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  AT: { name: 'Austria', ph: '+43', langs: ['English', 'German'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  NL: { name: 'Netherlands', ph: '+31', langs: ['English', 'Dutch'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  SE: { name: 'Sweden', ph: '+46', langs: ['English', 'Swedish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  DK: { name: 'Denmark', ph: '+45', langs: ['English', 'Danish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  NO: { name: 'Norway', ph: '+47', langs: ['English', 'Norwegian'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  FI: { name: 'Finland', ph: '+358', langs: ['English', 'Finnish'], tz: 'GMT+02:00 (EET)', tier: 'C' },
  ES: { name: 'Spain', ph: '+34', langs: ['English', 'Spanish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  PT: { name: 'Portugal', ph: '+351', langs: ['English', 'Portuguese'], tz: 'GMT+00:00 (WET)', tier: 'C' },
  FR: { name: 'France', ph: '+33', langs: ['English', 'French'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  CH: { name: 'Switzerland', ph: '+41', langs: ['English', 'German', 'French'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  AU: { name: 'Australia', ph: '+61', langs: ['English'], tz: 'GMT+10:00 (AEST)', tier: 'C' },
  NZ: { name: 'New Zealand', ph: '+64', langs: ['English'], tz: 'GMT+12:00 (NZST)', tier: 'C' },
  SG: { name: 'Singapore', ph: '+65', langs: ['English'], tz: 'GMT+08:00 (SGT)', tier: 'C' },
  HK: { name: 'Hong Kong', ph: '+852', langs: ['English', 'Chinese'], tz: 'GMT+08:00 (HKT)', tier: 'C' },
  AE: { name: 'United Arab Emirates', ph: '+971', langs: ['English', 'Arabic'], tz: 'GMT+04:00 (GST)', tier: 'C' },
  IL: { name: 'Israel', ph: '+972', langs: ['English', 'Hebrew'], tz: 'GMT+02:00 (IST)', tier: 'C' },
  ZA: { name: 'South Africa', ph: '+27', langs: ['English'], tz: 'GMT+02:00 (SAST)', tier: 'B' },
  IN: { name: 'India', ph: '+91', langs: ['English', 'Hindi'], tz: 'GMT+05:30 (IST)', tier: 'A' },
  UA: { name: 'Ukraine', ph: '+380', langs: ['English', 'Ukrainian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  PL: { name: 'Poland', ph: '+48', langs: ['English', 'Polish'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  RO: { name: 'Romania', ph: '+40', langs: ['English', 'Romanian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  BG: { name: 'Bulgaria', ph: '+359', langs: ['English', 'Bulgarian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  CZ: { name: 'Czechia', ph: '+420', langs: ['English', 'Czech'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  EE: { name: 'Estonia', ph: '+372', langs: ['English', 'Estonian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  LV: { name: 'Latvia', ph: '+371', langs: ['English', 'Latvian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  HR: { name: 'Croatia', ph: '+385', langs: ['English', 'Croatian'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  AR: { name: 'Argentina', ph: '+54', langs: ['English', 'Spanish'], tz: 'GMT-03:00 (ART)', tier: 'B' },
}
const DEFAULT_COUNTRY = { name: '', ph: null, langs: ['English'], tz: null, tier: 'C' }
const PRICE = {
  A: { hourly: '$25 - $49 / hr', min: '$5,000+' },
  B: { hourly: '$50 - $99 / hr', min: '$10,000+' },
  C: { hourly: '$100 - $149 / hr', min: '$10,000+' },
}

/* ── derivations ── */
function slugify(str) {
  return String(str).toLowerCase()
    .replace(/&/g, ' and ').replace(/[.'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)
}
/* Abbreviation-safe first sentence.

   The old regex /^.*?[.!?](\s|$)/ stopped at the first period followed by
   whitespace, so any leading abbreviation truncated the whole description:
     "C.H. Robinson is a logistics company."   -> "C.H."
     "Arthur J. Gallagher & Co. is a broker."  -> "Arthur J."
     "Robert W. Baird & Co. is an ..."         -> "Robert W."
   That shipped 64 such fragments into production `tagline`/`description`
   columns. Now a period only ends the sentence when it is NOT part of a
   known abbreviation or a single-letter initial, and the result must be
   long enough to be a real sentence. */
const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'st', 'mt', 'jr', 'sr',
  'inc', 'llc', 'llp', 'ltd', 'plc', 'co', 'corp', 'pte', 'pty', 'gmbh', 'bv', 'nv', 'sa', 'ag', 'srl', 'spa', 'oy', 'ab', 'as',
  'no', 'vs', 'etc', 'eg', 'ie', 'approx', 'est', 'dept', 'univ', 'assn', 'bros',
  'us', 'usa', 'uk', 'eu', 'ny', 'ca', 'dc',
])
function firstSentence(desc) {
  const text = String(desc == null ? '' : desc).replace(/\s+/g, ' ').trim()
  if (!text) return text

  const re = /[.!?](\s|$)/g
  let m
  while ((m = re.exec(text)) !== null) {
    const end = m.index + 1
    /* The token immediately before this period. */
    const word = (text.slice(0, m.index).match(/([A-Za-z.]+)$/) || [, ''])[1]
    const bare = word.replace(/\./g, '').toLowerCase()
    const isInitial = /^[A-Za-z]$/.test(bare)                 // "J." / "W."
    const isDotted = /^(?:[A-Za-z]\.){1,}$/.test(word + '.')  // "C.H." / "P.N."
    const isAbbrev = ABBREVIATIONS.has(bare)
    if (isInitial || isDotted || isAbbrev) continue           // not a real sentence end
    /* A "sentence" shorter than this is a truncation artefact, not prose. */
    if (end < 30) continue
    let t = text.slice(0, end).trim()
    if (t.length > 240) t = t.slice(0, 237).trim() + '…'
    return t
  }
  let t = text
  if (t.length > 240) t = t.slice(0, 237).trim() + '…'
  return t
}
const DIST = { 1: [100], 2: [60, 40], 3: [45, 30, 25], 4: [35, 27, 22, 16], 5: [30, 25, 20, 15, 10], 6: [26, 22, 18, 14, 12, 8] }
function serviceLines(tags) {
  const t = (tags || []).filter(Boolean).slice(0, 6)
  if (!t.length) return null
  const d = [...(DIST[t.length] || DIST[5])]
  const sum = d.reduce((a, b) => a + b, 0)
  if (sum !== 100) d[0] += 100 - sum
  return t.map((name, i) => ({ name, percentage: d[i] }))
}
function focusBreakdown(team) {
  const big = team === '5000+' || team === '1001-5000'
  const mid = team === '501-1000' || team === '201-500'
  if (big) return [{ name: 'Enterprise (>$1B)', percentage: 45 }, { name: 'Midmarket ($10M - $1B)', percentage: 40 }, { name: 'Small Business (<$10M)', percentage: 15 }]
  if (mid) return [{ name: 'Midmarket ($10M - $1B)', percentage: 45 }, { name: 'Small Business (<$10M)', percentage: 30 }, { name: 'Enterprise (>$1B)', percentage: 25 }]
  return [{ name: 'Small Business (<$10M)', percentage: 50 }, { name: 'Midmarket ($10M - $1B)', percentage: 35 }, { name: 'Enterprise (>$1B)', percentage: 15 }]
}
function normAwards(aw) {
  if (!Array.isArray(aw) || !aw.length) return null
  const out = aw.map((a) => (typeof a === 'string' ? { name: a, year: null } : { name: a.name, year: a.year ?? null })).filter((a) => a.name)
  return out.length ? out.slice(0, 10) : null
}
function clientLogos(clients) {
  if (!Array.isArray(clients) || !clients.length) return null
  const out = clients.map((cl) => {
    if (typeof cl === 'string') return { name: cl, url: null }
    const dom = cl && cl.domain ? String(cl.domain).trim().toLowerCase().replace(/^www\./, '') : null
    return { name: cl && cl.name, url: dom ? `https://${dom}` : null }
  }).filter((c) => c.name)
  return out.length ? out : null
}
function clientsSummary(c, names) {
  if (Array.isArray(names) && names.length) {
    return `${c.company_name} has delivered work for clients including ${names.slice(0, 6).join(', ')}.`
  }
  const inds = (c.industries_served || []).slice(0, 3).join(', ').toLowerCase()
  return `${c.company_name} works with ${inds || 'clients across multiple industries'}${c.city ? `, delivering from ${c.city}` : ''}.`
}
function faqs(c, hq) {
  const out = [
    { question: `What does ${c.company_name} do?`, answer: c.description },
    { question: `Where is ${c.company_name} located?`, answer: `${c.company_name} is headquartered in ${hq}${c.founded_year ? `, and was founded in ${c.founded_year}` : ''}.` },
  ]
  if (Array.isArray(c.industries_served) && c.industries_served.length) {
    out.push({ question: `Which industries does ${c.company_name} serve?`, answer: `${c.company_name} works with clients across ${c.industries_served.join(', ')}.` })
  }
  out.push({ question: `How do I get in touch with ${c.company_name}?`, answer: `Visit ${c.company_name}'s website or claim this profile on InfoWebWorld to connect, request a proposal, or learn more about their services.` })
  return out
}

/* ── dedupe by domain + slug, cap at 200 ── */
const seenDom = new Set()
const seenSlug = new Set()
const COMPANIES = []
for (const c of COMPANIES_RAW) {
  const dom = String(c.domain || '').toLowerCase().replace(/^www\./, '')
  if (!dom || seenDom.has(dom)) continue
  let slug = slugify(c.company_name)
  if (seenSlug.has(slug)) slug = `${slug}-${dom.split('.')[0]}`
  if (!slug || seenSlug.has(slug)) continue
  seenDom.add(dom); seenSlug.add(slug)
  COMPANIES.push({ ...c, _slug: slug, _dom: dom })
  if (COMPANIES.length >= 200) break
}

/* ── emit ── */
const cols = [
  'uuid', 'company_name', 'slug', 'contact_name', 'email', 'phone_code', 'phone', 'website',
  'category_id', 'country_id', 'city', 'state', 'hq_location',
  'tagline', 'description', 'logo_url', 'founded_year', 'team_size',
  'linkedin', 'twitter', 'facebook', 'listing_mode', 'is_hiring',
  'header_tags', 'industries_served', 'languages', 'awards', 'faqs',
  'min_project_size', 'hourly_rate', 'common_project_size', 'intro_video_url',
  'timezones', 'service_lines', 'focus_breakdown', 'client_logos', 'clients_summary',
  'status', 'payment_status', 'plan_id', 'user_id',
  'created_at', 'updated_at',
]

function insert(c) {
  const ctry = COUNTRY[c.country_code] || DEFAULT_COUNTRY
  const price = PRICE[ctry.tier] || PRICE.C
  const hq = [c.city, c.state, ctry.name].filter(Boolean).join(', ')
  const en = ENRICH.get(c._dom) || {}
  const video = en.intro_video_url || c.intro_video_url || null
  const awards = (Array.isArray(en.awards) && en.awards.length) ? en.awards : c.awards
  const clients = (Array.isArray(en.notable_clients) && en.notable_clients.length) ? en.notable_clients : c.notable_clients
  const clientNames = (Array.isArray(clients) ? clients : []).map((x) => (typeof x === 'string' ? x : x && x.name)).filter(Boolean)
  const email = c.email || `info@${c._dom}`
  const vals = [
    'UUID()', s(c.company_name), s(c._slug), s(`${c.company_name} Team`), s(email), s(ctry.ph), 'NULL', s(c.website),
    `COALESCE((SELECT id FROM categories WHERE slug='${c.category_slug}' LIMIT 1), @ps_sector)`,
    `COALESCE((SELECT id FROM countries WHERE code='${c.country_code}' LIMIT 1), @fallback_country)`,
    s(c.city), s(c.state), s(hq),
    s(firstSentence(c.description)), s(c.description), s(favicon(c._dom)), n(c.founded_year), s(c.team_size),
    s(c.linkedin), 'NULL', 'NULL', `'company'`, '0',
    j(c.header_tags), j(c.industries_served), j(ctry.langs), j(normAwards(awards)), j(faqs(c, hq)),
    s(price.min), s(price.hourly), 'NULL', s(video),
    j(ctry.tz ? [ctry.tz] : null), j(serviceLines(c.header_tags)), j(focusBreakdown(c.team_size)), j(clientLogos(clients)), s(clientsSummary(c, clientNames)),
    `'pending'`, `'unpaid'`, '@free_plan', 'NULL',
    'NOW()', 'NOW()',
  ]
  return `-- ${c.company_name} (${c.country_code} · ${c.category_slug})\nINSERT INTO submissions (\n  ${cols.join(', ')}\n)\nSELECT\n  ${vals.join(',\n  ')};\n`
}

const slugs = COMPANIES.map((c) => `'${c._slug}'`).join(', ')
const out = `-- ============================================================
-- InfoWebWorld - Professional Services COMPANY listings seed (${COMPANIES.length})
--
-- ${COMPANIES.length} real, web-verified professional-services firms as
-- listing_mode='company' rows that render the Clutch-style /profile/[slug] UI.
-- Global mix of countries, spread across the 19 Professional Services fields.
-- Researched for outreach + claim. Awards/clients are only included where
-- verified; pricing bands are regional estimates the owner refines on claim.
--
-- SEEDED NOT LIVE:
--   status='pending'  -> NOT shown on /profile/[slug] (only 'active'/'paid' are)
--   user_id=NULL      -> unowned, so the "Claim Now" button works
-- Review in /iww-hq/submissions, then run the GO-LIVE block at the bottom +
-- redeploy to publish.
--
-- Logos = Google favicon API. Re-runnable: deletes its own slugs first.
-- Run in phpMyAdmin -> SQL tab.
-- Generated by scripts/gen-pro-services-200-sql.mjs - do not edit by hand.
-- ============================================================

SET @free_plan        := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);
SET @ps_sector        := (SELECT id FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1);

DELETE FROM submissions WHERE slug IN (${slugs}) AND listing_mode = 'company';

${COMPANIES.map(insert).join('\n')}
-- ============================================================
-- GO LIVE (run after you've reviewed them, then redeploy).
-- These are UNCLAIMED, FREE listings: keep payment_status='unpaid' (nobody has
-- paid) and user_id NULL (claimable). We ONLY flip status so /profile renders;
-- payment_status becomes 'completed' only when a company actually claims & pays.
--   UPDATE submissions SET status='active', activated_at=NOW()
--    WHERE slug IN (${slugs})
--      AND listing_mode='company' AND user_id IS NULL;
-- ============================================================
`

writeFileSync(new URL('../database/seed-pro-services-200.sql', import.meta.url), out)

/* Companion: targeted email UPDATEs for the ALREADY-LIVE rows (real emails only). */
const emailUpdates = COMPANIES
  .filter((c) => c.email)
  .map((c) => `UPDATE submissions SET email='${String(c.email).replace(/'/g, "''")}' WHERE slug='${c._slug}' AND listing_mode='company';`)
const emailSql = `-- Real, web-verified contact emails for the live Professional Services company listings.
-- Replaces the info@<domain> placeholder for the ${emailUpdates.length} companies where a real
-- published email was found; the rest keep info@<domain>.
-- Safe to run in phpMyAdmin; NO redeploy needed (outreach reads email live from the DB).
-- Generated by scripts/gen-pro-services-200-sql.mjs — do not edit by hand.

${emailUpdates.join('\n')}
`
writeFileSync(new URL('../database/update-pro-services-emails.sql', import.meta.url), emailSql)

/* Companion: one-shot APPROVE / GO-LIVE script for the seeded rows. */
const goliveSql = `-- ============================================================
-- APPROVE / GO-LIVE — Professional Services company listings (${COMPANIES.length})
--
-- Flips status 'pending' -> 'active' so they render on /profile/[slug].
-- Run this in phpMyAdmin -> SQL AFTER you've loaded seed-pro-services-200.sql.
-- Then REDEPLOY (profiles are SSG, built at deploy time).
--
-- Scoped to THIS seed's exact slugs + unclaimed company rows, so it can never
-- touch a real user's listing. They stay UNCLAIMED + FREE (payment stays
-- 'unpaid', user_id stays NULL) — that's correct; nobody has paid yet.
-- Re-runnable (already-active rows just stay active).
-- Generated by scripts/gen-pro-services-200-sql.mjs — do not edit by hand.
-- ============================================================

UPDATE submissions
   SET status = 'active', activated_at = NOW()
 WHERE listing_mode = 'company'
   AND user_id IS NULL
   AND status = 'pending'
   AND slug IN (${slugs});

-- Sanity check (optional): should return ${COMPANIES.length}
-- SELECT COUNT(*) FROM submissions WHERE listing_mode='company' AND status='active' AND slug IN (${slugs});
`
writeFileSync(new URL('../database/golive-pro-services-200.sql', import.meta.url), goliveSql)

/* ── console summary ── */
const byCountry = {}, byCat = {}
let withVideo = 0, withAwards = 0, withClients = 0
for (const c of COMPANIES) {
  byCountry[c.country_code] = (byCountry[c.country_code] || 0) + 1
  byCat[c.category_slug] = (byCat[c.category_slug] || 0) + 1
  const en = ENRICH.get(c._dom) || {}
  if (en.intro_video_url || c.intro_video_url) withVideo++
  if ((Array.isArray(en.awards) && en.awards.length) || (Array.isArray(c.awards) && c.awards.length)) withAwards++
  if ((Array.isArray(en.notable_clients) && en.notable_clients.length) || (Array.isArray(c.notable_clients) && c.notable_clients.length)) withClients++
}
console.log(`Wrote ${COMPANIES.length} company listings -> database/seed-pro-services-200.sql (${out.length} bytes)`)
console.log(`Raw input: ${COMPANIES_RAW.length}, after dedupe+cap: ${COMPANIES.length}`)
console.log('Categories covered:', Object.keys(byCat).length, '/19')
console.log('By country:', JSON.stringify(byCountry))
console.log(`Enrichment -> video: ${withVideo}, awards: ${withAwards}, clients: ${withClients} (of ${COMPANIES.length})`)
console.log(`Real emails: ${emailUpdates.length}/${COMPANIES.length} -> database/update-pro-services-emails.sql`)
