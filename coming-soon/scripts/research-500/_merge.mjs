#!/usr/bin/env node
/* Validate + dedupe the research fragments (gNN.json) into _combined.json.
   Re-run after every research wave:  node scripts/research-500/_merge.mjs   */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const DIR = new URL('.', import.meta.url)
const p = (f) => new URL(f, DIR)

const VALID_SLUGS = new Set([
  // Web
  'custom-web-development','javascript-frameworks','php-frameworks','python-frameworks','ruby-on-rails','microsoft-net','net','java','cms-development','web-hosting-devops',
  // Mobile
  'native-ios-development','native-android-development','cross-platform-development','specialized-mobile','game-development-services',
  // Software
  'custom-software-development','outsourced-offshore','quality-assurance-testing','devops-sre','salesforce-crm','erp-implementation',
  // eCommerce
  'ecommerce-platforms-services','ecommerce-specializations','subscription-recurring-commerce',
  // Design
  'web-design','ui-ux-design','branding-identity','graphic-print-design','product-design-services','digital-creative',
  // Marketing
  'search-engine-optimization-seo','paid-advertising-ppc','social-media-marketing-services','content-marketing-services','email-marketing-automation','conversion-growth','mobile-app-marketing','full-service-digital','specialized-marketing',
  // AI / Emerging
  'artificial-intelligence','machine-learning-data-science','chatbots-conversational-ai','blockchain','ar-vr-metaverse','internet-of-things-iot','rpa-automation','low-code-no-code',
  // IT
  'managed-it-services','cloud-consulting','cybersecurity-services','data-analytics','it-consulting-strategy','system-database','voip-telecom','microsoft-ecosystem',
  // Creative
  'video-production','animation-motion-graphics','audio-podcast-production','photography-services','writing-translation',
  // BPO
  'call-centers-customer-support','business-process-outsourcing','human-resources','accounting-finance','business-consulting','legal-services','logistics-supply-chain','real-estate-services','engineering-manufacturing',
])
const TEAM = new Set(['11-50','51-200','201-500','501-1000','1001-5000','5000+'])
const norm = (d) => String(d || '').toLowerCase().replace(/^www\./, '').replace(/\/.*$/, '').trim()

const avoid = new Set(
  readFileSync(p('AVOID-DOMAINS.txt'), 'utf8').split(/\r?\n/).map(norm).filter(Boolean),
)

const files = readdirSync(DIR).filter((f) => /^g\d+\.json$/.test(f)).sort()
const seen = new Map()           // domain -> {file, name}
const out = []
const warnings = []
const collisions = []
let raw = 0

for (const f of files) {
  let arr
  try { arr = JSON.parse(readFileSync(p(f), 'utf8')) }
  catch (e) { warnings.push(`${f}: INVALID JSON — ${e.message}`); continue }
  if (!Array.isArray(arr)) { warnings.push(`${f}: not a JSON array`); continue }
  let kept = 0
  for (const c of arr) {
    raw++
    const dom = norm(c.domain)
    const where = `${f}:${c.company_name || '??'}`
    if (!c.company_name || !dom || !c.website || !c.category_slug || !c.country_code || !c.team_size || !c.description) {
      warnings.push(`${where}: missing required field`); continue
    }
    if (!VALID_SLUGS.has(c.category_slug)) warnings.push(`${where}: invalid slug '${c.category_slug}'`)
    if (!TEAM.has(c.team_size)) warnings.push(`${where}: invalid team_size '${c.team_size}'`)
    if (avoid.has(dom)) { collisions.push(`${where}: domain ${dom} is in AVOID-DOMAINS`); continue }
    if (seen.has(dom)) { collisions.push(`${where}: dup of ${seen.get(dom).file} (${dom})`); continue }
    seen.set(dom, { file: f, name: c.company_name })
    out.push({ ...c, domain: dom, _group: f.replace('.json', '') })
    kept++
  }
  console.log(`  ${f}: ${arr.length} raw → ${kept} kept`)
}

writeFileSync(p('_combined.json'), JSON.stringify(out, null, 0))

// Growing skip-list for later waves: the canonical 209 + everything collected so far.
const skip = new Set([...avoid, ...out.map((c) => c.domain)])
writeFileSync(p('SKIP-DOMAINS.txt'), [...skip].sort().join('\n') + '\n')

// coverage + distributions
const cov = { video: 0, awards: 0, clients: 0, email: 0 }
const byCountry = {}, byCat = {}, byGroup = {}
for (const c of out) {
  if (c.intro_video_url) cov.video++
  if (Array.isArray(c.awards) && c.awards.length) cov.awards++
  if (Array.isArray(c.notable_clients) && c.notable_clients.length) cov.clients++
  if (c.email) cov.email++
  byCountry[c.country_code] = (byCountry[c.country_code] || 0) + 1
  byCat[c.category_slug] = (byCat[c.category_slug] || 0) + 1
  byGroup[c._group] = (byGroup[c._group] || 0) + 1
}
const pct = (k) => `${k}/${out.length} (${Math.round((k / out.length) * 100)}%)`

console.log('\n══════════════════════════════════════════')
console.log(`FILES: ${files.length}   RAW: ${raw}   UNIQUE KEPT: ${out.length}   → target 500`)
console.log(`Coverage → video ${pct(cov.video)} · awards ${pct(cov.awards)} · clients ${pct(cov.clients)} · email ${pct(cov.email)}`)
console.log(`Countries (${Object.keys(byCountry).length}):`, JSON.stringify(byCountry))
console.log(`Categories (${Object.keys(byCat).length}/69):`, Object.keys(byCat).sort().join(', '))
if (collisions.length) { console.log(`\nDROPPED (${collisions.length} dup/avoid):`); collisions.forEach((c) => console.log('  - ' + c)) }
if (warnings.length) { console.log(`\nWARNINGS (${warnings.length}):`); warnings.slice(0, 40).forEach((w) => console.log('  ! ' + w)) }
console.log('\nWrote _combined.json')
