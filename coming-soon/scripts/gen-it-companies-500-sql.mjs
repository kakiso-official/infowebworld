#!/usr/bin/env node
/**
 * Generator: database/seed-it-companies-500.sql
 *
 * Second wave of real, web-verified IT-services & digital-agency COMPANY
 * listings (listing_mode='company') for the Clutch-style /profile/[slug] UI —
 * the follow-up to the 200-company seed. Global mix, spread across the IT
 * sub-categories. Reads the deduped research output in
 * scripts/research-500/_combined.json (compiled by the research agents +
 * scripts/research-500/_merge.mjs). Currently a PARTIAL batch; re-run after more
 * research waves land and it regenerates the same file with the full set.
 *
 * Factual fields + enrichment (awards, own-channel intro video, named clients
 * with domains, contact email) come from the research records. Presentation
 * sections (tagline, service mix, focus split, pricing band, languages,
 * timezone, FAQs, clients summary) are DERIVED here so every profile renders
 * complete. Pricing is a regional estimate the owner refines on claim.
 *
 * SEEDED NOT LIVE:  status='pending', user_id=NULL (claimable), payment='unpaid'.
 * Review in /iww-hq/submissions, then run the GO-LIVE block + redeploy.
 *
 * Re-runnable: deletes its own slugs first. Run the .sql in phpMyAdmin -> SQL.
 * Regenerate:  node scripts/gen-it-companies-500-sql.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { COMPANIES_RAW as EXISTING_200 } from './it-companies-200.data.mjs'

const COMBINED = JSON.parse(readFileSync(new URL('./research-500/_combined.json', import.meta.url), 'utf8'))
const AVOID = readFileSync(new URL('./research-500/AVOID-DOMAINS.txt', import.meta.url), 'utf8')
  .split(/\r?\n/).map((d) => d.toLowerCase().replace(/^www\./, '').trim()).filter(Boolean)

/* ── SQL value helpers (escape backslash THEN quote for MySQL default mode) ── */
const s = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`)
const n = (v) => (v == null || v === '' ? 'NULL' : String(Number(v)))
const j = (v) => (v == null ? 'NULL' : `'${JSON.stringify(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`)
const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`

/* ── Country reference: name, dial code, languages, timezone, pricing tier ── */
const COUNTRY = {
  US: { name: 'United States', ph: '+1', langs: ['English'], tz: 'GMT-05:00 (Eastern)', tier: 'C' },
  CA: { name: 'Canada', ph: '+1', langs: ['English', 'French'], tz: 'GMT-05:00 (Eastern)', tier: 'C' },
  GB: { name: 'United Kingdom', ph: '+44', langs: ['English'], tz: 'GMT+00:00 (GMT)', tier: 'C' },
  IE: { name: 'Ireland', ph: '+353', langs: ['English'], tz: 'GMT+00:00 (GMT)', tier: 'C' },
  DE: { name: 'Germany', ph: '+49', langs: ['English', 'German'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  AT: { name: 'Austria', ph: '+43', langs: ['English', 'German'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  CH: { name: 'Switzerland', ph: '+41', langs: ['English', 'German', 'French'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  NL: { name: 'Netherlands', ph: '+31', langs: ['English', 'Dutch'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  BE: { name: 'Belgium', ph: '+32', langs: ['English', 'Dutch', 'French'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  SE: { name: 'Sweden', ph: '+46', langs: ['English', 'Swedish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  DK: { name: 'Denmark', ph: '+45', langs: ['English', 'Danish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  NO: { name: 'Norway', ph: '+47', langs: ['English', 'Norwegian'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  FI: { name: 'Finland', ph: '+358', langs: ['English', 'Finnish'], tz: 'GMT+02:00 (EET)', tier: 'C' },
  ES: { name: 'Spain', ph: '+34', langs: ['English', 'Spanish'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  PT: { name: 'Portugal', ph: '+351', langs: ['English', 'Portuguese'], tz: 'GMT+00:00 (WET)', tier: 'C' },
  FR: { name: 'France', ph: '+33', langs: ['English', 'French'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  IT: { name: 'Italy', ph: '+39', langs: ['English', 'Italian'], tz: 'GMT+01:00 (CET)', tier: 'C' },
  GR: { name: 'Greece', ph: '+30', langs: ['English', 'Greek'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  AU: { name: 'Australia', ph: '+61', langs: ['English'], tz: 'GMT+10:00 (AEST)', tier: 'C' },
  NZ: { name: 'New Zealand', ph: '+64', langs: ['English'], tz: 'GMT+12:00 (NZST)', tier: 'C' },
  AE: { name: 'United Arab Emirates', ph: '+971', langs: ['English', 'Arabic'], tz: 'GMT+04:00 (GST)', tier: 'C' },
  SA: { name: 'Saudi Arabia', ph: '+966', langs: ['English', 'Arabic'], tz: 'GMT+03:00 (AST)', tier: 'C' },
  IL: { name: 'Israel', ph: '+972', langs: ['English', 'Hebrew'], tz: 'GMT+02:00 (IST)', tier: 'C' },
  TR: { name: 'Turkey', ph: '+90', langs: ['English', 'Turkish'], tz: 'GMT+03:00 (TRT)', tier: 'B' },
  EG: { name: 'Egypt', ph: '+20', langs: ['English', 'Arabic'], tz: 'GMT+02:00 (EET)', tier: 'A' },
  ZA: { name: 'South Africa', ph: '+27', langs: ['English'], tz: 'GMT+02:00 (SAST)', tier: 'B' },
  NG: { name: 'Nigeria', ph: '+234', langs: ['English'], tz: 'GMT+01:00 (WAT)', tier: 'A' },
  GH: { name: 'Ghana', ph: '+233', langs: ['English'], tz: 'GMT+00:00 (GMT)', tier: 'A' },
  KE: { name: 'Kenya', ph: '+254', langs: ['English', 'Swahili'], tz: 'GMT+03:00 (EAT)', tier: 'A' },
  IN: { name: 'India', ph: '+91', langs: ['English', 'Hindi'], tz: 'GMT+05:30 (IST)', tier: 'A' },
  PK: { name: 'Pakistan', ph: '+92', langs: ['English', 'Urdu'], tz: 'GMT+05:00 (PKT)', tier: 'A' },
  BD: { name: 'Bangladesh', ph: '+880', langs: ['English', 'Bengali'], tz: 'GMT+06:00 (BST)', tier: 'A' },
  LK: { name: 'Sri Lanka', ph: '+94', langs: ['English', 'Sinhala', 'Tamil'], tz: 'GMT+05:30 (IST)', tier: 'A' },
  NP: { name: 'Nepal', ph: '+977', langs: ['English', 'Nepali'], tz: 'GMT+05:45 (NPT)', tier: 'A' },
  VN: { name: 'Vietnam', ph: '+84', langs: ['English', 'Vietnamese'], tz: 'GMT+07:00 (ICT)', tier: 'A' },
  PH: { name: 'Philippines', ph: '+63', langs: ['English', 'Filipino'], tz: 'GMT+08:00 (PHT)', tier: 'A' },
  ID: { name: 'Indonesia', ph: '+62', langs: ['English', 'Indonesian'], tz: 'GMT+07:00 (WIB)', tier: 'A' },
  TH: { name: 'Thailand', ph: '+66', langs: ['English', 'Thai'], tz: 'GMT+07:00 (ICT)', tier: 'B' },
  MY: { name: 'Malaysia', ph: '+60', langs: ['English', 'Malay'], tz: 'GMT+08:00 (MYT)', tier: 'B' },
  SG: { name: 'Singapore', ph: '+65', langs: ['English'], tz: 'GMT+08:00 (SGT)', tier: 'C' },
  HK: { name: 'Hong Kong', ph: '+852', langs: ['English', 'Chinese'], tz: 'GMT+08:00 (HKT)', tier: 'C' },
  JP: { name: 'Japan', ph: '+81', langs: ['English', 'Japanese'], tz: 'GMT+09:00 (JST)', tier: 'C' },
  UA: { name: 'Ukraine', ph: '+380', langs: ['English', 'Ukrainian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  PL: { name: 'Poland', ph: '+48', langs: ['English', 'Polish'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  RO: { name: 'Romania', ph: '+40', langs: ['English', 'Romanian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  BG: { name: 'Bulgaria', ph: '+359', langs: ['English', 'Bulgarian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  CZ: { name: 'Czechia', ph: '+420', langs: ['English', 'Czech'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  RS: { name: 'Serbia', ph: '+381', langs: ['English', 'Serbian'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  HU: { name: 'Hungary', ph: '+36', langs: ['English', 'Hungarian'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  SK: { name: 'Slovakia', ph: '+421', langs: ['English', 'Slovak'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  SI: { name: 'Slovenia', ph: '+386', langs: ['English', 'Slovenian'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  HR: { name: 'Croatia', ph: '+385', langs: ['English', 'Croatian'], tz: 'GMT+01:00 (CET)', tier: 'B' },
  EE: { name: 'Estonia', ph: '+372', langs: ['English', 'Estonian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  LV: { name: 'Latvia', ph: '+371', langs: ['English', 'Latvian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  LT: { name: 'Lithuania', ph: '+370', langs: ['English', 'Lithuanian'], tz: 'GMT+02:00 (EET)', tier: 'B' },
  BR: { name: 'Brazil', ph: '+55', langs: ['English', 'Portuguese'], tz: 'GMT-03:00 (BRT)', tier: 'B' },
  MX: { name: 'Mexico', ph: '+52', langs: ['English', 'Spanish'], tz: 'GMT-06:00 (CST)', tier: 'B' },
  AR: { name: 'Argentina', ph: '+54', langs: ['English', 'Spanish'], tz: 'GMT-03:00 (ART)', tier: 'B' },
  CO: { name: 'Colombia', ph: '+57', langs: ['English', 'Spanish'], tz: 'GMT-05:00 (COT)', tier: 'B' },
  CL: { name: 'Chile', ph: '+56', langs: ['English', 'Spanish'], tz: 'GMT-04:00 (CLT)', tier: 'B' },
  PE: { name: 'Peru', ph: '+51', langs: ['English', 'Spanish'], tz: 'GMT-05:00 (PET)', tier: 'B' },
  UY: { name: 'Uruguay', ph: '+598', langs: ['English', 'Spanish'], tz: 'GMT-03:00 (UYT)', tier: 'B' },
  CR: { name: 'Costa Rica', ph: '+506', langs: ['English', 'Spanish'], tz: 'GMT-06:00 (CST)', tier: 'B' },
}
const DEFAULT_COUNTRY = { name: '', ph: null, langs: ['English'], tz: null, tier: 'C' }
const PRICE = {
  A: { hourly: '$25 - $49 / hr', min: '$5,000+' },
  B: { hourly: '$25 - $49 / hr', min: '$10,000+' },
  C: { hourly: '$100 - $149 / hr', min: '$10,000+' },
}

/* ── derivations (parity with gen-it-companies-200-sql.mjs) ── */
function slugify(str) {
  return String(str).toLowerCase()
    .replace(/&/g, ' and ').replace(/[.'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)
}
function firstSentence(desc) {
  const m = String(desc).match(/^.*?[.!?](\s|$)/)
  let t = (m ? m[0] : String(desc)).trim()
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

/* ── dedupe by domain + slug; pre-seed with the existing 209 so new slugs never
      collide with already-live listings ── */
const seenDom = new Set(AVOID)
const seenSlug = new Set([
  // the 9-firm seed's explicit slugs
  'dynacons-systems-solutions', 'dev-information-technology', 'mindteck-india-ltd', 'intense-technologies',
  'securekloud-technologies', 'fidel-softech', 'kellton-tech-solutions', 'allied-digital-services', 'silver-touch-technologies',
  // the 200-firm seed's derived slugs
  ...EXISTING_200.map((c) => slugify(c.company_name)),
])
const COMPANIES = []
for (const c of COMBINED) {
  const dom = String(c.domain || '').toLowerCase().replace(/^www\./, '')
  if (!dom || seenDom.has(dom)) continue
  let slug = slugify(c.company_name)
  if (seenSlug.has(slug)) slug = `${slug}-${dom.split('.')[0]}`
  if (!slug || seenSlug.has(slug)) continue
  seenDom.add(dom); seenSlug.add(slug)
  COMPANIES.push({ ...c, _slug: slug, _dom: dom })
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
  const clients = Array.isArray(c.notable_clients) ? c.notable_clients : []
  const clientNames = clients.map((x) => (typeof x === 'string' ? x : x && x.name)).filter(Boolean)
  const vals = [
    'UUID()', s(c.company_name), s(c._slug), s(`${c.company_name} Team`), s(c.email || `info@${c._dom}`), s(ctry.ph), 'NULL', s(c.website),
    `COALESCE((SELECT id FROM categories WHERE slug='${c.category_slug}' LIMIT 1), @it_sector)`,
    `COALESCE((SELECT id FROM countries WHERE code='${c.country_code}' LIMIT 1), @fallback_country)`,
    s(c.city), s(c.state), s(hq),
    s(firstSentence(c.description)), s(c.description), s(favicon(c._dom)), n(c.founded_year), s(c.team_size),
    s(c.linkedin), 'NULL', 'NULL', `'company'`, '0',
    j(c.header_tags), j(c.industries_served), j(ctry.langs), j(normAwards(c.awards)), j(faqs(c, hq)),
    s(price.min), s(price.hourly), 'NULL', s(c.intro_video_url),
    j(ctry.tz ? [ctry.tz] : null), j(serviceLines(c.header_tags)), j(focusBreakdown(c.team_size)), j(clientLogos(clients)), s(clientsSummary(c, clientNames)),
    `'pending'`, `'unpaid'`, '@free_plan', 'NULL',
    'NOW()', 'NOW()',
  ]
  return `-- ${c.company_name} (${c.country_code} · ${c.category_slug})\nINSERT INTO submissions (\n  ${cols.join(', ')}\n)\nSELECT\n  ${vals.join(',\n  ')};\n`
}

const slugs = COMPANIES.map((c) => `'${c._slug}'`).join(', ')
const out = `-- ============================================================
-- InfoWebWorld - IT Services & Agencies COMPANY listings seed (wave 2)
--
-- ${COMPANIES.length} real, web-verified IT-services firms & digital agencies as
-- listing_mode='company' rows that render the Clutch-style /profile/[slug] UI.
-- Global mix of countries, spread across the IT sub-categories. The follow-up to
-- the 200-company seed; researched for outreach + claim. Awards/clients/videos
-- only included where verified; pricing bands are regional estimates the owner
-- refines on claim.
--
-- SEEDED NOT LIVE:
--   status='pending'  -> NOT shown on /profile/[slug] (only 'active'/'paid' are)
--   user_id=NULL      -> unowned, so the "Claim Now" button works
-- Review in /iww-hq/submissions, then run the GO-LIVE block at the bottom +
-- redeploy to publish.
--
-- Logos = Google favicon API. Re-runnable: deletes its own slugs first.
-- Run in phpMyAdmin -> SQL tab.
-- Generated by scripts/gen-it-companies-500-sql.mjs - do not edit by hand.
-- ============================================================

SET @free_plan        := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);
SET @it_sector        := (SELECT id FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1);

DELETE FROM submissions WHERE slug IN (${slugs});

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

writeFileSync(new URL('../database/seed-it-companies-500.sql', import.meta.url), out)

/* ── companion: standalone GO-LIVE script ── */
const goLive = `-- ============================================================
-- InfoWebWorld - GO LIVE the wave-2 (500) company listings
--
-- Run this AFTER you've loaded database/seed-it-companies-500.sql and reviewed
-- the rows in /iww-hq/submissions. It makes all ${COMPANIES.length} of them appear on
-- /profile/[slug]. Then REDEPLOY (profiles are SSG — a build generates the pages).
--
-- These are UNCLAIMED, FREE listings, so we ONLY flip status='active':
-- payment_status stays 'unpaid' (nobody has paid) and user_id stays NULL (so the
-- "Claim Now" button keeps working). Safe + re-runnable.
-- Generated by scripts/gen-it-companies-500-sql.mjs - do not edit by hand.
-- ============================================================

UPDATE submissions
   SET status = 'active', activated_at = NOW()
 WHERE slug IN (${slugs})
   AND listing_mode = 'company'
   AND user_id IS NULL;

-- Sanity check (should report ${COMPANIES.length}):
-- SELECT COUNT(*) AS live_now FROM submissions
--  WHERE status='active' AND listing_mode='company'
--    AND slug IN (${slugs});

-- To UNDO (revert to not-live) if needed:
-- UPDATE submissions SET status='pending', activated_at=NULL
--  WHERE slug IN (${slugs}) AND listing_mode='company' AND user_id IS NULL;
`
writeFileSync(new URL('../database/go-live-it-companies-500.sql', import.meta.url), goLive)

/* ── console summary ── */
const byCountry = {}, byCat = {}
let withVideo = 0, withAwards = 0, withClients = 0, withEmail = 0
for (const c of COMPANIES) {
  byCountry[c.country_code] = (byCountry[c.country_code] || 0) + 1
  byCat[c.category_slug] = (byCat[c.category_slug] || 0) + 1
  if (c.intro_video_url) withVideo++
  if (Array.isArray(c.awards) && c.awards.length) withAwards++
  if (Array.isArray(c.notable_clients) && c.notable_clients.length) withClients++
  if (c.email) withEmail++
}
const N = COMPANIES.length
console.log(`Wrote ${N} company listings -> database/seed-it-companies-500.sql (${out.length} bytes)`)
console.log(`Input: ${COMBINED.length} combined, ${N} after dedupe vs existing 209 + within`)
console.log('By country:', JSON.stringify(byCountry))
console.log('Categories covered:', Object.keys(byCat).length)
console.log(`Coverage -> video ${withVideo}/${N}, awards ${withAwards}/${N}, clients ${withClients}/${N}, email ${withEmail}/${N}`)
