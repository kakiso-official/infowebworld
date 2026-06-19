/**
 * One-off: resolve each company's Excel category path → real taxonomy slug.
 * Reads the xlsx (via a tiny CSV dump passed in) is overkill; instead we hardcode
 * the 60 rows parsed from the sheet and verify against app/config/categories-data.ts.
 */
import { readFileSync } from 'node:fs'

// ---- Parse categories-data.ts rows (regex over the generated literal) ----
const src = readFileSync('app/config/categories-data.ts', 'utf8')
const rows = []
const re = /\{\s*id:(\d+),\s*parent_id:(\d+|null),\s*level:(\d+),\s*name:"((?:[^"\\]|\\.)*)",\s*slug:"((?:[^"\\]|\\.)*)"[^}]*?sector_slug:(?:"((?:[^"\\]|\\.)*)"|null)[^}]*?\}/g
let m
while ((m = re.exec(src))) {
  rows.push({
    id: +m[1],
    parent_id: m[2] === 'null' ? null : +m[2],
    level: +m[3],
    name: m[4].replace(/\\"/g, '"'),
    slug: m[5],
    sector_slug: m[6] ?? null,
  })
}
const byId = new Map(rows.map((r) => [r.id, r]))
console.log('parsed categories rows:', rows.length)

// ---- The 60 companies from the xlsx (deepest level + full path + sector) ----
const SECTORS = {
  'Artificial Intelligence & ML': 'ai-ml',
  'Software & SaaS': 'software-saas',
  'IT Services & Agencies': 'it-services-agencies',
  'Startups & Innovation': 'startups-innovation',
  'Local Businesses': 'local-businesses',
  'Professional Services': 'professional-services',
}

// [company, L1, L2, L3, L4(optional)]
const DATA = [
  ['QuillBot','Artificial Intelligence & ML','AI Core & Models','AI Detection & Anti-Detection','AI Humanizers'],
  ['Bardeen','Artificial Intelligence & ML','Productivity & Workflow','Automation & Integration','AI Browser Automation'],
  ['ThoughtSpot','Artificial Intelligence & ML','Business & Marketing','Analytics & BI','AI Business Intelligence'],
  ['Teachable','Artificial Intelligence & ML','Education & Research','Course Creation','AI Course Builders'],
  ['Be My Eyes','Artificial Intelligence & ML','Life & Personal','Accessibility & Assistive Tech','AI for Accessibility'],
  ['Tidio','Artificial Intelligence & ML','Customer & Support','Chatbots & Conversational','AI Chatbot Builders'],
  ['Botpress','Artificial Intelligence & ML','Customer & Support','Chatbots & Conversational','AI Chatbot Builders'],
  ['FlutterFlow','Artificial Intelligence & ML','Development & Technical','App & Site Builders','AI App Builders'],
  ['Lindy','Artificial Intelligence & ML','AI Core & Models','AI Agents','Autonomous Agents'],
  ['MagicSchool','Artificial Intelligence & ML','Education & Research','Course Creation','AI Course Builders'],
  ['Bill.com','Software & SaaS','Accounting & Finance Software','AP & AR Automation','Accounts Payable Software'],
  ['Sisense','Software & SaaS','Data & Analytics Software','Business Intelligence (BI)','Business Intelligence Software'],
  ['Brandfolder','Software & SaaS','Content Management Software','Digital Asset Management','Digital Asset Management (DAM)'],
  ['Aircall','Software & SaaS','Communication Software','Business Phone & VoIP','VoIP Software'],
  ['Pendo','Software & SaaS','Data & Analytics Software','Data Analysis & Visualization','Data Analysis Software'],
  ['Nutshell','Software & SaaS','CRM & Sales Software','CRM Platforms','CRM Software'],
  ['Paylocity','Software & SaaS','HR & People Management Software','Core HR & HRIS','HR Software (HRIS)'],
  ['JumpCloud','Software & SaaS','Cybersecurity Software','Identity & Access Management','Identity Management Software (IAM)'],
  ['Sage Intacct','Software & SaaS','Accounting & Finance Software','Accounting & Bookkeeping','Accounting Software'],
  ['Tipalti','Software & SaaS','Accounting & Finance Software','AP & AR Automation','Accounts Payable Software'],
  ['Concentrix','IT Services & Agencies','Business Services & BPO','Business Process Outsourcing','BPO Companies'],
  ['DOOR3','IT Services & Agencies','Web Development Services','Custom Web Development','Custom Web Development Companies'],
  ['Mutual Mobile','IT Services & Agencies','Mobile App Development Services','Native Android Development','Android App Development Companies'],
  ['Cprime','IT Services & Agencies','IT Services & Consulting','Cloud Consulting','Cloud Consulting Companies'],
  ['Closeloop','IT Services & Agencies','Software Development Services','Custom Software Development','Custom Software Development Companies'],
  ['Brainhub','IT Services & Agencies','Software Development Services','Custom Software Development','Custom Software Development Companies'],
  ['MindK','IT Services & Agencies','Software Development Services','Custom Software Development','Custom Software Development Companies'],
  ['Trio','IT Services & Agencies','Software Development Services','Outsourced & Offshore','Offshore Software Development Companies'],
  ['Arkenea','IT Services & Agencies','Mobile App Development Services','Native iOS Development','iPhone App Development Companies'],
  ['Dom & Tom','IT Services & Agencies','Web Development Services','Custom Web Development','Custom Web Development Companies'],
  ['Outschool','Startups & Innovation','EdTech & Learning Startups','K-12 EdTech Startups'],
  ['Watershed','Startups & Innovation','Climate, Energy & Sustainability Startups','Climate Tech Startups'],
  ['Solana Labs','Startups & Innovation','Web3, Crypto & Blockchain Startups','Layer 1 Blockchain Startups'],
  ['Rivian','Startups & Innovation','Mobility, Transportation & Auto Tech Startups','Electric Vehicle Startups'],
  ['Khan Academy','Startups & Innovation','EdTech & Learning Startups','K-12 EdTech Startups'],
  ['Lucid Motors','Startups & Innovation','Mobility, Transportation & Auto Tech Startups','Electric Vehicle Startups'],
  ['Maven','Startups & Innovation','EdTech & Learning Startups','K-12 EdTech Startups'],
  ['Pachama','Startups & Innovation','Climate, Energy & Sustainability Startups','Climate Tech Startups'],
  ['Aptos','Startups & Innovation','Web3, Crypto & Blockchain Startups','Layer 1 Blockchain Startups'],
  ['Polestar','Startups & Innovation','Mobility, Transportation & Auto Tech Startups','Electric Vehicle Startups'],
  ['Olive Garden','Local Businesses','Restaurants, Food & Drink','Restaurants by Cuisine','American Restaurants'],
  ['Roto-Rooter','Local Businesses','Home Services & Contractors','Plumbing','Plumbers'],
  ['Mr. Electric','Local Businesses','Home Services & Contractors','Electrical','Electricians'],
  ['Midas','Local Businesses','Automotive','Auto Repair','Auto Repair Shops'],
  ['CarMax','Local Businesses','Automotive','Car Dealers','Car Dealerships'],
  ['Great Clips','Local Businesses','Beauty & Personal Care','Hair Salons','Hair Salons'],
  ['Gap','Local Businesses','Shopping & Retail','Apparel & Accessories','Clothing Stores'],
  ['Planet Fitness','Local Businesses','Active Life & Fitness','Gyms & Fitness Centers','Gyms'],
  ['CorePower Yoga','Local Businesses','Active Life & Fitness','Studios & Classes','Yoga Studios'],
  ['The Cheesecake Factory','Local Businesses','Restaurants, Food & Drink','Restaurants by Cuisine','American Restaurants'],
  ['HOK','Professional Services','Architecture, Engineering & Design','Architects','Architects'],
  ['inDinero','Professional Services','Accounting & Tax Services','Bookkeeping','Bookkeepers'],
  ['Perkins and Will','Professional Services','Architecture, Engineering & Design','Architects','Architects'],
  ['Stantec','Professional Services','Architecture, Engineering & Design','Civil Engineering','Civil Engineering Firms'],
  ['WSP','Professional Services','Architecture, Engineering & Design','Civil Engineering','Civil Engineering Firms'],
  ['Robert Walters','Professional Services','Business Consulting','HR & People Consulting','HR Consultants'],
  ['Willis Towers Watson','Professional Services','Insurance Professional Services','Insurance Brokers & Agents','Employee Benefits Consultants'],
  ['Perella Weinberg','Professional Services','Investment Banking & Capital Markets','Investment Banking Boutiques','Boutique Investment Banks'],
  ['Marcum','Professional Services','Accounting & Tax Services','Audit & Assurance','Audit Firms'],
  ['CliftonLarsonAllen','Professional Services','Accounting & Tax Services','Audit & Assurance','Audit Firms'],
]

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

function chainNames(cat) {
  const names = []
  let c = cat
  while (c) {
    names.unshift(c.name)
    c = c.parent_id ? byId.get(c.parent_id) : null
  }
  return names
}

let ok = 0, miss = 0, amb = 0
const results = []
for (const d of DATA) {
  const [co, l1, ...rest] = d
  const sector = SECTORS[l1]
  const deepest = rest[rest.length - 1]
  // candidates: rows whose name matches the deepest level AND sector matches
  let cands = rows.filter((r) => norm(r.name) === norm(deepest) && r.sector_slug === sector)
  // disambiguate by verifying the parent-chain leaf names match the Excel path
  const wantPath = rest.map(norm)
  let chosen = null
  if (cands.length > 1) {
    const exact = cands.filter((r) => {
      const ch = chainNames(r).slice(1).map(norm) // drop L1
      // match the tail of the chain to the Excel L2..Ln
      return wantPath.every((w, i) => ch[i] === w)
    })
    if (exact.length >= 1) { chosen = exact[0]; }
  } else if (cands.length === 1) {
    chosen = cands[0]
  }
  if (!chosen && cands.length === 0) {
    // fallback: try matching by name ignoring sector (taxonomy drift)
    const loose = rows.filter((r) => norm(r.name) === norm(deepest))
    results.push({ co, status: 'MISS', deepest, sector, looseSlugs: loose.map((r) => `${r.slug}[${r.sector_slug}/L${r.level}]`) })
    miss++
    continue
  }
  if (!chosen) { chosen = cands[0]; amb++ }
  results.push({ co, status: chosen ? 'OK' : 'AMB', slug: chosen.slug, id: chosen.id, level: chosen.level, path: chainNames(chosen).join(' > ') })
  if (chosen) ok++
}

console.log(`\n=== RESULTS: ${ok} ok, ${amb} ambiguous, ${miss} miss ===\n`)
for (const r of results) {
  if (r.status === 'MISS') console.log(`❌ MISS  ${r.co.padEnd(24)} deepest="${r.deepest}" sector=${r.sector}  loose=[${r.looseSlugs.join(', ')}]`)
  else console.log(`✅ ${r.co.padEnd(24)} → ${r.slug} (id ${r.id}, L${r.level})`)
}
