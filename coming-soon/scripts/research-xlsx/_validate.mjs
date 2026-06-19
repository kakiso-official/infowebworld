/** Validate the 7 research JSON files before SQL generation. */
import { readFileSync } from 'node:fs'

const DIR = 'scripts/research-xlsx/'
const FILES = {
  'aiml-a.json': 'product', 'aiml-b.json': 'product',
  'saas.json': 'saas', 'it-services.json': 'agency',
  'startups.json': 'startup', 'local.json': 'local', 'pro-services.json': 'agency',
}

const EXPECT_CAT = {
  quillbot:'ai-humanizers', bardeen:'ai-browser-automation', thoughtspot:'ai-business-intelligence',
  teachable:'ai-course-builders', 'be-my-eyes':'ai-for-accessibility', tidio:'ai-chatbot-builders',
  botpress:'ai-chatbot-builders', flutterflow:'ai-app-builders', lindy:'autonomous-agents', magicschool:'ai-course-builders',
  'bill-com':'accounts-payable-software', sisense:'business-intelligence-software', brandfolder:'digital-asset-management-dam',
  aircall:'voip-software', pendo:'data-analysis-software', nutshell:'crm-software', paylocity:'hr-software-hris',
  jumpcloud:'identity-management-software-iam', 'sage-intacct':'accounting-software', tipalti:'accounts-payable-software',
  concentrix:'bpo-companies', door3:'custom-web-development-companies', 'mutual-mobile':'android-app-development-companies',
  cprime:'cloud-consulting-companies', closeloop:'custom-software-development-companies', brainhub:'custom-software-development-companies',
  mindk:'custom-software-development-companies', trio:'offshore-software-development-companies', arkenea:'iphone-app-development-companies',
  'dom-and-tom':'custom-web-development-companies',
  outschool:'k-12-edtech-startups', watershed:'climate-tech-startups', 'solana-labs':'layer-1-blockchain-startups',
  rivian:'electric-vehicle-startups', 'khan-academy':'k-12-edtech-startups', 'lucid-motors':'electric-vehicle-startups',
  maven:'k-12-edtech-startups', pachama:'climate-tech-startups', aptos:'layer-1-blockchain-startups', polestar:'electric-vehicle-startups',
  'olive-garden':'american-restaurants', 'roto-rooter':'plumbers', 'mr-electric':'electricians', midas:'auto-repair-shops',
  carmax:'car-dealerships', 'great-clips':'hair-salons-2', gap:'clothing-stores', 'planet-fitness':'gyms',
  'corepower-yoga':'yoga-studios', 'the-cheesecake-factory':'american-restaurants',
  hok:'architects-2', indinero:'bookkeepers', 'perkins-and-will':'architects-2', stantec:'civil-engineering-firms',
  wsp:'civil-engineering-firms', 'robert-walters':'hr-consultants', 'willis-towers-watson':'employee-benefits-consultants',
  'perella-weinberg':'boutique-investment-banks', marcum:'audit-firms', cliftonlarsonallen:'audit-firms',
}
const TEAM_SIZES = ['Solo / Freelancer','2-10','11-50','51-200','201-500','500+']
const VERT_AMEN = {
  food:['takeout','delivery','credit_cards','wifi','vegetarian','outdoor_seating','reservations','parking','wheelchair'],
  'home-services':['free_estimates','licensed_insured','emergency_service','financing','warranty','eco_friendly','credit_cards'],
  automotive:['free_estimates','credit_cards','financing','warranty','loaner_cars','wheelchair'],
  beauty:['by_appointment','walk_ins','credit_cards','wifi','parking','wheelchair','gift_cards'],
  retail:['in_store_pickup','curbside','returns_accepted','credit_cards','wifi','parking','wheelchair','gift_cards'],
  fitness:['free_trial','personal_training','showers','lockers','parking','wheelchair','credit_cards'],
}

let errors = 0, warns = 0
const allSlugs = []
const sum = (arr) => (arr||[]).reduce((a,x)=>a+(+x.percentage||0),0)
const err = (m) => { console.log('  ❌ ' + m); errors++ }
const warn = (m) => { console.log('  ⚠️  ' + m); warns++ }

for (const [file, kind] of Object.entries(FILES)) {
  console.log('\n=== ' + file + ' (' + kind + ') ===')
  let rows
  try { rows = JSON.parse(readFileSync(DIR + file, 'utf8')) }
  catch (e) { err('JSON parse failed: ' + e.message); continue }
  if (!Array.isArray(rows)) { err('not an array'); continue }
  console.log('  rows: ' + rows.length)
  for (const r of rows) {
    const tag = (r.slug || r.name || '?')
    allSlugs.push(r.slug)
    // required COMMON
    for (const f of ['name','slug','category_slug','website','description','team_size'])
      if (!r[f]) err(`${tag}: missing ${f}`)
    // category correctness
    if (EXPECT_CAT[r.slug] && r.category_slug !== EXPECT_CAT[r.slug])
      err(`${tag}: category_slug "${r.category_slug}" != expected "${EXPECT_CAT[r.slug]}"`)
    if (!EXPECT_CAT[r.slug]) warn(`${tag}: slug not in expected map (renamed?)`)
    // team size
    if (r.team_size && !TEAM_SIZES.includes(r.team_size)) warn(`${tag}: team_size "${r.team_size}" not a standard band`)
    // em-dash check
    for (const f of ['tagline','description'])
      if (typeof r[f]==='string' && r[f].includes('—')) err(`${tag}: em-dash in ${f}`)
    // website https
    if (r.website && !/^https?:\/\//.test(r.website)) warn(`${tag}: website not absolute: ${r.website}`)
    // kind-specific
    if (kind==='product') {
      if (!Array.isArray(r.pricing_tiers) || r.pricing_tiers.length===0) warn(`${tag}: no pricing_tiers`)
      if (!Array.isArray(r.key_features) || r.key_features.length<4) warn(`${tag}: <4 key_features`)
      if (!Array.isArray(r.faqs) || r.faqs.length<3) warn(`${tag}: <3 faqs`)
    }
    if (kind==='agency') {
      const sl=sum(r.service_lines), fb=sum(r.focus_breakdown)
      if (Math.abs(sl-100)>1) err(`${tag}: service_lines sum ${sl} != 100`)
      if (Math.abs(fb-100)>1) err(`${tag}: focus_breakdown sum ${fb} != 100`)
      if (!r.hourly_rate) warn(`${tag}: agency missing hourly_rate`)
    }
    if (kind==='saas') {
      const sl=sum(r.service_lines)
      if (r.service_lines && Math.abs(sl-100)>1) warn(`${tag}: service_lines sum ${sl} != 100`)
      if (r.hourly_rate) warn(`${tag}: SaaS should not have hourly_rate (${r.hourly_rate})`)
    }
    if (kind==='startup') {
      if (r.hourly_rate) warn(`${tag}: startup should not have hourly_rate`)
      if (r.service_lines && sum(r.service_lines)>0) warn(`${tag}: startup has service_lines (policy: omit)`)
    }
    if (kind==='local') {
      const v = r.vertical
      if (!VERT_AMEN[v]) { err(`${tag}: unknown vertical "${v}"`) }
      else {
        for (const a of (r.lb_amenities||[]))
          if (!VERT_AMEN[v].includes(a)) err(`${tag}: amenity "${a}" not valid for vertical ${v}`)
      }
      if (!Array.isArray(r.lb_hours) || r.lb_hours.length===0) warn(`${tag}: no lb_hours`)
      if (r.lb_lat!=null || r.lb_lng!=null) warn(`${tag}: lb_lat/lng should be null for chains`)
      if ((r.lb_photos||[]).length) warn(`${tag}: lb_photos should be []`)
    }
  }
}

// global slug uniqueness
const dupes = allSlugs.filter((s,i)=>allSlugs.indexOf(s)!==i)
console.log('\n=== GLOBAL ===')
console.log('  total rows: ' + allSlugs.length + ' (expect 60)')
if (dupes.length) err('duplicate slugs: ' + [...new Set(dupes)].join(', '))
else console.log('  ✅ all slugs unique')
console.log(`\n=== ${errors} errors, ${warns} warnings ===`)
