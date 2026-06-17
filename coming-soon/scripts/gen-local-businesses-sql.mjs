/* ════════════════════════════════════════════════════════════════════════
   gen-local-businesses-sql.mjs — REAL local-business seed from OpenStreetMap.

   Pulls real businesses (name, website, phone, address, coords, cuisine,
   amenities, opening hours) from the OSM Overpass API for a configured set of
   cities × categories, enriches each with its own favicon (logo) and og:image
   (real background photo where the site has one), and emits a curated
   re-runnable SQL seed → database/seed-local-businesses.sql.

   Conventions match database/seed-test-local-business.sql:
     listing_mode='company', status='pending', user_id NULL (claimable),
     payment 'unpaid', free plan. GO-LIVE block (commented) at the bottom.

   ALL DATA IS REAL. Nothing is invented — unknown fields are left empty/NULL
   and filled later by the owner via the claim → edit flow.

   Source: © OpenStreetMap contributors (ODbL). Attribution required on-site.

   One-time generator (your gen-*.mjs pattern). Network required.
   Run:  node scripts/gen-local-businesses-sql.mjs
   ════════════════════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs'

const UA = 'InfoWebWorld-LocalBiz-Seed/1.0 (kakisotech@gmail.com)'
const OVERPASS = 'https://overpass-api.de/api/interpreter'
const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse'
const OUT = new URL('../database/seed-local-businesses.sql', import.meta.url)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ── Config ──────────────────────────────────────────────────────────────
   PILOT: New York + restaurants. Uncomment cities/categories to scale.
   bbox order is [south, west, north, east]. PER = max kept per city×category. */
const PER = 25
const CITIES = [
  { name: 'New York', region: 'NY', country: 'United States', cc: 'US', bbox: [40.70, -74.02, 40.82, -73.93] },
  // { name: 'London',    region: 'England', country: 'United Kingdom', cc: 'GB', bbox: [51.47, -0.18, 51.55, 0.00] },
  // { name: 'Toronto',   region: 'ON', country: 'Canada',         cc: 'CA', bbox: [43.63, -79.43, 43.71, -79.34] },
  // { name: 'Sydney',    region: 'NSW', country: 'Australia',     cc: 'AU', bbox: [-33.90, 151.19, -33.85, 151.25] },
  // { name: 'Dubai',     region: 'Dubai', country: 'United Arab Emirates', cc: 'AE', bbox: [25.10, 55.13, 25.27, 55.34] },
  // { name: 'Singapore', region: '', country: 'Singapore',        cc: 'SG', bbox: [1.27, 103.80, 1.36, 103.88] },
  // { name: 'Mumbai',    region: 'MH', country: 'India',          cc: 'IN', bbox: [18.91, 72.80, 19.10, 72.92] },
  // { name: 'Paris',     region: 'Île-de-France', country: 'France', cc: 'FR', bbox: [48.83, 2.28, 48.89, 2.40] },
  // { name: 'Berlin',    region: 'Berlin', country: 'Germany',    cc: 'DE', bbox: [52.49, 13.34, 52.54, 13.43] },
  // { name: 'Tokyo',     region: 'Tokyo', country: 'Japan',       cc: 'JP', bbox: [35.65, 139.69, 35.71, 139.77] },
  // { name: 'São Paulo', region: 'SP', country: 'Brazil',        cc: 'BR', bbox: [-23.58, -46.68, -23.53, -46.62] },
  // { name: 'Cape Town', region: 'Western Cape', country: 'South Africa', cc: 'ZA', bbox: [-33.94, 18.39, -33.89, 18.46] },
]
const CATEGORIES = [
  { key: 'restaurants', filter: '["amenity"="restaurant"]["name"]', l2: 'restaurants-food-drink', l3: 'restaurants-by-cuisine', label: 'Restaurant' },
  // { key: 'cafes',   filter: '["amenity"="cafe"]["name"]',          l2: 'restaurants-food-drink', l3: 'cafes-coffee',          label: 'Café' },
  // { key: 'salons',  filter: '["shop"="hairdresser"]["name"]',      l2: 'beauty-personal-care',   l3: 'hair-salons',           label: 'Hair Salon' },
  // { key: 'gyms',    filter: '["leisure"="fitness_centre"]["name"]', l2: 'active-life-fitness',    l3: 'gyms-fitness-centers',  label: 'Gym' },
]

/* OSM cuisine token → our restaurants L4 slug (richer category where known). */
const CUISINE_TO_SLUG = {
  american: 'american-restaurants', mexican: 'mexican-restaurants', italian: 'italian-restaurants',
  pizza: 'italian-restaurants', chinese: 'chinese-restaurants', shanghai: 'chinese-restaurants',
  japanese: 'japanese-restaurants', sushi: 'japanese-restaurants', ramen: 'japanese-restaurants',
  thai: 'thai-restaurants', indian: 'indian-restaurants', vietnamese: 'vietnamese-restaurants',
  korean: 'korean-restaurants', mediterranean: 'mediterranean-restaurants', greek: 'greek-restaurants',
  middle_eastern: 'middle-eastern-restaurants', lebanese: 'middle-eastern-restaurants',
  french: 'french-restaurants', spanish: 'spanish-tapas-restaurants', tapas: 'spanish-tapas-restaurants',
  latin_american: 'latin-american-restaurants', caribbean: 'caribbean-restaurants',
  filipino: 'filipino-restaurants', ethiopian: 'ethiopian-african-restaurants', african: 'ethiopian-african-restaurants',
  turkish: 'turkish-restaurants', german: 'german-restaurants', brazilian: 'brazilian-steakhouses',
}

/* ── Helpers ─────────────────────────────────────────────────────────────*/
const DAYNAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const OSMDAY = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 }
const titleCase = (s) => s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}
function to12h(hhmm) {
  let [h, m] = hhmm.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12; if (h === 0) h = 12
  return `${h}:${String(m).padStart(2, '0')} ${ap}`
}
/* Parse a subset of OSM opening_hours into our 7-day [{day,time,closed}].
   Conservative: returns null if nothing parseable (we never guess). */
function osmHours(oh) {
  if (!oh) return null
  if (/24\s*\/\s*7/.test(oh)) return DAYNAMES.map((d) => ({ day: d, time: 'Open 24 hours', closed: false }))
  const days = Array(7).fill(null)
  let any = false
  for (const clause of oh.split(';')) {
    const m = clause.trim().match(/^([A-Za-z]{2})(?:\s*-\s*([A-Za-z]{2}))?\s+(.+)$/)
    if (!m) continue
    const d1 = OSMDAY[m[1]]; const d2 = m[2] !== undefined ? OSMDAY[m[2]] : d1
    if (d1 === undefined || d2 === undefined) continue
    const spec = m[3].trim()
    let val
    if (/^(off|closed)$/i.test(spec)) { val = 'closed' }
    else {
      const tm = spec.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/)
      if (!tm) continue
      val = `${to12h(tm[1])} - ${to12h(tm[2])}`
    }
    let i = d1
    for (let guard = 0; guard < 7; guard++) { days[i] = val; any = true; if (i === d2) break; i = (i + 1) % 7 }
  }
  if (!any) return null
  // Only include days OSM actually specified — never assert "Closed" for a day
  // that simply wasn't tagged (incomplete OSM data must not read as "closed").
  return DAYNAMES.map((d, i) => ({ d, v: days[i] }))
    .filter((x) => x.v !== null)
    .map((x) => x.v === 'closed' ? { day: x.d, time: '', closed: true } : { day: x.d, time: x.v, closed: false })
}
function mapAmenities(t) {
  const yes = (v) => v === 'yes' || v === 'only' || v === 'required' || v === 'customers'
  const out = []
  if (yes(t.takeaway)) out.push('takeout')
  if (yes(t.delivery)) out.push('delivery')
  if (yes(t.outdoor_seating)) out.push('outdoor_seating')
  if (yes(t.wheelchair)) out.push('wheelchair')
  if (t.internet_access === 'wlan' || yes(t.internet_access)) out.push('wifi')
  if (yes(t['diet:vegetarian']) || yes(t['diet:vegan'])) out.push('vegetarian')
  if (yes(t.reservation)) out.push('reservations')
  if (yes(t['payment:credit_cards']) || yes(t['payment:cards']) || yes(t['payment:visa'])) out.push('credit_cards')
  return [...new Set(out)]
}
function domainOf(url) { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' } }

async function overpass(filter, bbox) {
  const [s, w, n, e] = bbox
  const q = `[out:json][timeout:60];(node${filter}(${s},${w},${n},${e});way${filter}(${s},${w},${n},${e}););out center tags 80;`
  const res = await fetch(`${OVERPASS}?data=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error('Overpass ' + res.status)
  const j = await res.json()
  return j.elements || []
}
async function ogImage(url) {
  if (!url) return null
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 7000)
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfoWebWorldBot/1.0)' }, signal: ctrl.signal, redirect: 'follow' })
    clearTimeout(t)
    if (!res.ok) return null
    const html = await res.text()
    let m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    let img = m ? m[1] : null
    if (img && img.startsWith('//')) img = 'https:' + img
    if (img && img.startsWith('/')) { try { img = new URL(url).origin + img } catch { /* skip */ } }
    return img && /^https?:\/\//.test(img) ? img : null
  } catch { return null }
}
let nomCalls = 0
async function reverseAddr(lat, lon) {
  if (nomCalls >= 40) return ''      // cap Nominatim calls per run
  nomCalls++
  try {
    await sleep(1100)                // Nominatim policy: ≤1 req/sec
    const res = await fetch(`${NOMINATIM}?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, { headers: { 'User-Agent': UA } })
    if (!res.ok) return ''
    const a = (await res.json()).address || {}
    return [a.house_number, a.road].filter(Boolean).join(' ')
  } catch { return '' }
}
async function pool(items, n, fn) {
  const ret = []; let i = 0
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; ret[idx] = await fn(items[idx], idx) }
  }))
  return ret
}

/* ── Main ────────────────────────────────────────────────────────────────*/
const records = []
const seenSlugs = new Set()

for (const city of CITIES) {
  for (const cat of CATEGORIES) {
    process.stderr.write(`\n→ ${city.name} / ${cat.key} … `)
    let els
    try { els = await overpass(cat.filter, city.bbox) } catch (e) { process.stderr.write('FETCH ERR ' + e.message); continue }
    // Keep named places; prefer those with a website, then an address.
    const named = els.filter((el) => el.tags && el.tags.name)
    named.sort((a, b) => (
      (b.tags.website || b.tags['contact:website'] ? 1 : 0) - (a.tags.website || a.tags['contact:website'] ? 1 : 0)
      || ((b.tags['addr:street'] ? 1 : 0) - (a.tags['addr:street'] ? 1 : 0))
    ))
    const picked = named.slice(0, PER)
    process.stderr.write(`${els.length} found, keeping ${picked.length}`)

    for (const el of picked) {
      const t = el.tags
      const lat = el.lat ?? el.center?.lat
      const lon = el.lon ?? el.center?.lon
      if (lat == null || lon == null) continue

      const name = t.name.trim()
      let slug = slugify(`${name} ${city.name}`)
      if (!slug) continue
      if (seenSlugs.has(slug)) slug = `${slug}-${el.id}`
      seenSlugs.add(slug)

      const website = (t.website || t['contact:website'] || '').trim().replace(/\s/g, '') || null
      const domain = website ? domainOf(website) : ''
      const phone = (t.phone || t['contact:phone'] || '').trim() || null

      let address = [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' ')
      if (!address) address = await reverseAddr(lat, lon)
      const hqLocation = [address, city.name, city.region].filter(Boolean).join(', ')

      const cuisineTok = (t.cuisine || '').split(/[;,]/)[0].trim().toLowerCase().replace(/\s+/g, '_')
      const l4 = cat.key === 'restaurants' ? (CUISINE_TO_SLUG[cuisineTok] || null) : null
      const catSlugs = [l4, cat.l3, cat.l2].filter(Boolean)
      const cuisineName = cuisineTok ? titleCase(cuisineTok) : ''
      const headerTags = cat.key === 'restaurants'
        ? [cuisineName, cat.label].filter(Boolean)
        : [cat.label]
      const tagline = cat.key === 'restaurants'
        ? `${cuisineName ? cuisineName + ' restaurant' : 'Restaurant'} in ${city.name}`
        : `${cat.label} in ${city.name}`

      records.push({
        name, slug, website, phone, hqLocation,
        city: city.name, region: city.region, cc: city.cc, catSlugs,
        lat: Number(lat).toFixed(7), lng: Number(lon).toFixed(7),
        logo: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256` : null,
        headerTags, tagline,
        hours: osmHours(t.opening_hours),
        amenities: mapAmenities(t),
        website_for_og: website,
      })
    }
  }
}

process.stderr.write(`\n\n→ Fetching og:image for ${records.length} sites …\n`)
const ogs = await pool(records.filter((r) => r.website_for_og), 6, (r) => ogImage(r.website_for_og))
let i = 0
for (const r of records) { if (r.website_for_og) { r.photo = ogs[i++] || null } }

/* ── Emit SQL ────────────────────────────────────────────────────────────*/
const q = (v) => (v == null || v === '') ? 'NULL' : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
const jarr = (a) => (Array.isArray(a) && a.length) ? q(JSON.stringify(a)) : 'NULL'
const num = (v) => (v == null || v === '') ? 'NULL' : Number(v)

const ccs = [...new Set(records.map((r) => r.cc))]
const slugList = records.map((r) => `'${r.slug.replace(/'/g, "''")}'`).join(', ')

let sql = `-- ============================================================
-- InfoWebWorld - REAL local businesses (OpenStreetMap)
-- Generated by scripts/gen-local-businesses-sql.mjs  —  ${records.length} businesses
-- Source: © OpenStreetMap contributors (ODbL). Show attribution on-site.
--
-- All data real (name/website/phone/address/coords/hours/amenities from OSM).
-- Unknown fields left empty — owners complete them via the claim → edit flow.
-- listing_mode='company', status='pending' (NOT live), user_id NULL (claimable).
-- Review in /iww-hq/submissions, then run the GO-LIVE block at the bottom.
-- Re-runnable: the DELETE below clears any prior run of this seed.
-- ============================================================

SET @free_plan := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @lb_sector := (SELECT id FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1);
${ccs.map((cc) => `SET @co_${cc} := (SELECT id FROM countries WHERE code = '${cc}' LIMIT 1);`).join('\n')}

DELETE FROM submissions WHERE listing_mode = 'company' AND slug IN (${slugList});

`

sql += records.map((r) => {
  const catExpr = 'COALESCE(' + r.catSlugs
    .map((s) => `(SELECT id FROM categories WHERE slug = ${q(s)} LIMIT 1)`)
    .concat('@lb_sector').join(', ') + ')'
  return `INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, state, hq_location,
  tagline, description, logo_url, founded_year, team_size,
  listing_mode, is_hiring, header_tags, verified, verified_at,
  lb_price_range, lb_hours, lb_amenities, lb_menu, lb_photos, lb_videos, lb_lat, lb_lng,
  status, payment_status, plan_id, user_id, created_at, updated_at
) SELECT
  UUID(), ${q(r.name)}, ${q(r.slug)}, '', '', '', ${q(r.phone)}, ${q(r.website)},
  ${catExpr}, @co_${r.cc}, ${q(r.city)}, ${q(r.region)}, ${q(r.hqLocation)},
  ${q(r.tagline)}, NULL, ${q(r.logo)}, NULL, NULL,
  'company', 0, ${jarr(r.headerTags)}, 0, NULL,
  NULL, ${jarr(r.hours)}, ${jarr(r.amenities)}, NULL, ${r.photo ? jarr([r.photo]) : 'NULL'}, NULL, ${num(r.lat)}, ${num(r.lng)},
  'pending', 'unpaid', @free_plan, NULL, NOW(), NOW();`
}).join('\n\n')

sql += `

-- ── GO LIVE (review in /iww-hq/submissions first, then run this) ──
-- UPDATE submissions SET status = 'active', activated_at = NOW()
--  WHERE listing_mode = 'company' AND status = 'pending' AND slug IN (${slugList});
`

writeFileSync(OUT, sql)
console.error(`\n✓ Wrote ${records.length} real businesses → database/seed-local-businesses.sql`)
console.log(`Generated ${records.length} real local businesses (${records.filter((r) => r.photo).length} with a real photo, ${records.filter((r) => r.hours).length} with hours).`)
