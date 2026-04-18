import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_RETRIES = 4
const RETRY_CODES = new Set([429, 500, 503])

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    })

    if (res.ok) {
      const json = await res.json()
      return json.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    // Retry on 429/500/503 with exponential backoff
    if (RETRY_CODES.has(res.status) && attempt < MAX_RETRIES) {
      const wait = Math.min(2000 * Math.pow(2, attempt), 30000) // 2s, 4s, 8s, 16s
      console.log(`Gemini ${res.status} — retrying in ${wait / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})`)
      await new Promise(r => setTimeout(r, wait))
      continue
    }

    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  throw new Error('Gemini API: max retries exceeded')
}

function cleanJson(raw: string): string {
  // Strip markdown code fences if present
  return raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
}

/* ── Build context string for a category ── */
function buildContext(cat: Record<string, unknown>, parent: Record<string, unknown> | null, sector: Record<string, unknown> | null, subcats: Array<Record<string, unknown>>, listingTypes: Array<Record<string, unknown>>) {
  const level = Number(cat.level)
  const parts: string[] = []
  parts.push(`Category: ${cat.name}`)
  parts.push(`Level: ${level === 1 ? 'L1 Sector (top-level industry vertical)' : level === 2 ? 'L2 Category' : 'L3 Subcategory'}`)
  if (parent) parts.push(`Parent Category: ${parent.name}`)
  if (sector) parts.push(`Industry Sector: ${sector.name}`)
  if (cat.description) parts.push(`Current Description: ${cat.description}`)
  if (subcats.length) parts.push(`${level === 1 ? 'L2 Categories' : 'Subcategories'}: ${subcats.map(s => s.name).join(', ')}`)
  if (listingTypes.length) parts.push(`Listing Types: ${listingTypes.slice(0, 20).map(lt => lt.name).join(', ')}`)
  parts.push(`Platform: InfoWebWorld.com — a global business discovery and listing platform`)
  if (level === 1) parts.push(`NOTE: This is a TOP-LEVEL SECTOR page. Content should be broad, authoritative, and cover the entire vertical — not just one niche. Think "State of the Industry" editorial, not a product comparison.`)
  return parts.join('\n')
}

/* ── Generate all content types for a category ── */
async function generateForCategory(categoryId: number) {
  // Fetch category + context
  const cat = await queryOne('SELECT * FROM categories WHERE id = ?', [categoryId])
  if (!cat) throw new Error(`Category ${categoryId} not found`)

  const parent = cat.parent_id ? await queryOne('SELECT id, name, slug, level, parent_id FROM categories WHERE id = ?', [cat.parent_id]) : null

  // Find L1 sector
  let sector = null
  const level = Number(cat.level)
  if (level === 1) sector = cat // L1 IS the sector
  else if (level === 2 && parent) sector = parent
  else if (level === 3 && parent) {
    sector = parent.parent_id ? await queryOne('SELECT id, name, slug FROM categories WHERE id = ?', [parent.parent_id]) : parent
  }

  const subcats = await query('SELECT name, slug FROM categories WHERE parent_id = ? AND is_active = 1 AND is_navigation = 1 ORDER BY sort_order', [categoryId])
  const listingTypes = await query(
    'SELECT name, slug FROM listing_types WHERE category_id = ? ORDER BY sort_order LIMIT 30',
    [categoryId]
  )

  // Get sibling categories for comparisons
  const siblings = cat.parent_id
    ? await query('SELECT name, slug FROM categories WHERE parent_id = ? AND id != ? AND is_active = 1 AND is_navigation = 1 ORDER BY sort_order LIMIT 10', [cat.parent_id, categoryId])
    : []

  const ctx = buildContext(cat, parent, sector, subcats as Array<Record<string, unknown>>, listingTypes as Array<Record<string, unknown>>)
  const catName = String(cat.name)
  const sectorName = sector ? String(sector.name) : ''

  // Fetch cousin categories (same L1, different L2) for more internal links
  const sectorId = sector ? Number(sector.id) : (parent ? Number(parent.id) : 0)
  const cousins = sectorId ? await query(
    `SELECT c.name, c.slug FROM categories c WHERE c.parent_id IN (SELECT id FROM categories WHERE parent_id = ? AND is_active = 1) AND c.id != ? AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY RAND() LIMIT 12`,
    [sectorId, categoryId]
  ) : []

  const siblingList = (siblings as Array<Record<string, unknown>>).map(s => `${s.name} (slug: ${s.slug})`).join(', ')
  const cousinList = (cousins as Array<Record<string, unknown>>).map(c => `${c.name} (slug: ${c.slug})`).join(', ')
  const subcatList = (subcats as Array<Record<string, unknown>>).map(s => `${s.name} (slug: ${s.slug})`).join(', ')

  // ── ANTI-AI STYLE GUIDE (shared across all prompts) ──
  const styleGuide = `
YOUR OUTPUT MUST SCORE <10% ON AI DETECTION TOOLS (Originality.ai, GPTZero, Copyleaks). Follow every rule below strictly.

═══ VOICE & TONE ═══
- You are a sharp, opinionated industry analyst who's been covering this space for 10+ years
- You have strong takes. You disagree with conventional wisdom sometimes. You call out bad practices bluntly
- You write like you're explaining something at a dinner party to a smart friend — not writing a Wikipedia article
- Use first person sparingly but naturally ("I've seen teams waste months on...", "what most buyers miss is...")

═══ SENTENCE STRUCTURE (this is what AI detectors catch most) ═══
- BURSTINESS IS CRITICAL: alternate between very short (3-6 words) and very long (20-30 words) sentences. Never write 3+ sentences of similar length in a row
- Use sentence fragments intentionally. "Not even close." "Worth it? Depends." "The short answer: no."
- Start some sentences with "And" or "But" — real writers do this constantly
- Use em dashes mid-sentence — like this — to break up structure
- Throw in a rhetorical question every 2-3 paragraphs ("So why do 40% of buyers still pick the wrong vendor?")
- Use parenthetical asides (the kind that add color but aren't strictly necessary)
- Occasionally end a paragraph with a single punchy sentence. Just one.

═══ PARAGRAPH VARIATION ═══
- Vary paragraph length aggressively: some paragraphs should be 2 sentences, others 5-6
- NEVER follow the same paragraph structure twice in a row
- Don't start consecutive paragraphs with similar syntax
- Break away from the intro→evidence→conclusion pattern — start some paragraphs with evidence, others with a bold claim, others with a question

═══ WORD CHOICE ═══
- Use contractions everywhere (don't, won't, it's, they're, you'll, isn't, can't, shouldn't)
- Prefer short Anglo-Saxon words over Latinate ones ("use" not "utilize", "help" not "facilitate", "show" not "demonstrate", "start" not "commence", "enough" not "sufficient")
- BANNED WORDS — using any of these will flag as AI: landscape, leverage, navigate, robust, comprehensive, delve, crucial, streamline, empower, revolutionize, cutting-edge, seamless, holistic, foster, facilitate, utilize, moreover, furthermore, additionally, notably, significantly, essentially, ultimately, accordingly, subsequently, harnessing, plethora, myriad, pivotal, paramount, intricate, multifaceted, realm, paradigm, ecosystem (when not literal)
- BANNED OPENINGS — never start a sentence with: "It's important to note", "It's worth noting", "In today's", "In the realm of", "When it comes to", "Whether you're", "As the [noun] continues to", "One of the key", "This is where", "This means that"
- BANNED TRANSITIONS — never use: "Furthermore", "Moreover", "Additionally", "In addition", "Not only...but also", "That being said", "With that in mind", "It goes without saying"

═══ SPECIFICITY (kills the generic AI feel) ═══
- Name real numbers: "$47/seat/month", "3-6 week implementation", "roughly 60% of mid-market buyers"
- Reference real phenomena: "the post-ChatGPT wave", "after the Salesforce acquisition spree", "since remote work became default"
- Mention actual job titles making decisions: "your VP of Engineering", "the CFO who signs off", "a solo founder wearing 5 hats"
- Include at least one slightly controversial or unexpected opinion per section

═══ GEOGRAPHY RULE — ABSOLUTELY CRITICAL ═══
- Do NOT mention any country, state, city, region, or geographic location
- Do NOT say "globally", "worldwide", "across the globe", "around the world", "international", "local", "regional"
- Write as if geography doesn't exist. The content applies to any buyer anywhere
`

  // ── 1. Rich Description ──
  const descPrompt = `You're a senior technology analyst writing a definitive category overview for InfoWebWorld, a business discovery platform.

${ctx}

INTERNAL LINKS — you MUST weave these into the text using [LINK:slug:Display Text] format:
Sibling categories (same level): ${siblingList || 'none'}
Related subcategories (children): ${subcatList || 'none'}
Cousin categories (same sector, different parent): ${cousinList || 'none'}

${styleGuide}

Write a 700-900 word editorial overview of "${catName}" — the kind of piece a buyer reads before starting vendor evaluation. This is NOT a sales page. It's an authoritative, opinionated guide.

Structure (use flowing paragraphs, NOT these as headers):
1. Open with a crisp definition of what ${catName} actually means in practice. Not a dictionary definition — explain what problems these tools/services solve and for whom. (3-4 sentences)
2. Explain who actually buys ${catName} solutions — name specific roles (CTOs, ops managers, marketing directors, etc.), company stages, and the trigger events that make someone start searching. (4-5 sentences)
3. Describe how this market has shifted recently. What used to be acceptable that isn't anymore? What capabilities went from "nice to have" to table stakes? Reference pricing model shifts, consolidation, AI integration, or whatever's real for this category. (4-5 sentences)
4. Lay out the 4-5 capabilities that actually separate top-tier ${catName} providers from the rest. Be specific and opinionated — don't just list features, explain WHY each matters. (5-6 sentences)
5. Map how ${catName} connects to adjacent categories. A buyer evaluating ${catName} is probably also looking at [LINK to siblings/cousins]. Explain the relationship — does one replace the other? Do they complement? Is there overlap? Use at LEAST 4-5 [LINK:slug:Text] references here. (4-5 sentences)
6. Close with actionable advice: what to prioritize, what to watch out for, and where to start comparing. Mention browsing subcategories if they exist. (3-4 sentences)

LINKING RULES:
- Include 10-15 internal links total, spread across ALL paragraphs (not clustered in one section)
- Every sibling category should be linked at least once
- Link subcategories when mentioning specific niches or specializations
- Link cousins when drawing cross-category comparisons
- Make link text read naturally: "[LINK:ai-writing-tools:AI writing tools]" not "[LINK:ai-writing-tools:AI Writing Tools category]"

No markdown. No headers. No bullet points. No numbered lists. Just flowing editorial paragraphs.
Return ONLY the description text.`

  const richDescription = await callGemini(descPrompt)

  // ── 2. Buyer's Guide ──
  const guidePrompt = `You're a procurement consultant who's evaluated 100+ ${catName} vendors. A VP just asked you: "What should I actually look for?"

${ctx}
${styleGuide}

Create a brutally practical buyer's guide for ${catName}. No fluff — only things that matter during a real evaluation. Return valid JSON only, no markdown:

{
  "features": [
    { "title": "Specific Feature Name", "description": "One sharp sentence explaining why this feature makes or breaks a ${catName} deployment. Reference a real scenario or consequence." }
  ],
  "questions": ["A pointed question to ask vendors during a demo — the kind that separates serious providers from pretenders"],
  "pitfalls": ["A specific mistake you've seen buyers make with ${catName} — describe the mistake AND the consequence in one blunt sentence"],
  "pricing_info": "2-3 sentences about how ${catName} is typically priced. Name actual pricing models (per seat, per API call, usage tiers, flat fee, revenue share). Give approximate ranges where realistic (e.g., '$50-200/seat/month for mid-market'). Mention hidden costs buyers miss."
}

Exactly 6 features, 5 questions, 4 pitfalls.
EVERY item must be deeply specific to ${catName}. Test each item: if you could swap in a different category name and it still makes sense, rewrite it. Generic = useless.`

  const guideRaw = await callGemini(guidePrompt)
  const buyersGuide = JSON.parse(cleanJson(guideRaw))

  // ── 3. Use Cases ──
  const useCasePrompt = `${ctx}
${styleGuide}

Generate 5 real-world use cases showing how different types of organizations use ${catName}. Each must target a completely different industry vertical or team function. Return valid JSON only:

[
  { "title": "Specific Title (e.g., '${catName} for D2C E-commerce Brands')", "description": "2-3 sentences: name the specific pain point this buyer type faces, how ${catName} addresses it, and what measurable outcome they get. Mention a workflow, metric, or before/after.", "icon": "one of: building, heart, graduation, cart, code, briefcase, users, globe, chart, shield" }
]

RULES:
- No generic titles like "For Small Business" or "For Enterprises" — be specific: "For Series-A SaaS Startups", "For Hospital IT Departments", "For D2C Brands Scaling Past $5M ARR"
- Each description must mention a SPECIFIC workflow, pain point, or outcome unique to that buyer type
- Do NOT mention any country, city, or region
- Cover a diverse spread: at least one startup, one enterprise, one non-tech industry`

  const useCaseRaw = await callGemini(useCasePrompt)
  const useCases = JSON.parse(cleanJson(useCaseRaw))

  // ── 4. Comparisons ──
  // Do NOT use sibling categories — they're in the same taxonomy branch (e.g., all AI subcategories).
  // Instead, ask Gemini for ALTERNATIVE APPROACHES to the same buyer problem.

  const compPrompt = `You're a technology analyst writing "vs" comparisons for a buyer research page.

The category is: "${catName}"
${parent ? `Parent category: ${parent.name}` : ''}
${sector ? `Industry sector: ${sector.name}` : ''}

A buyer considering "${catName}" is trying to solve a specific problem. Your job: identify 3-4 FUNDAMENTALLY DIFFERENT types of solutions that solve the SAME problem or serve the SAME buyer need — but with a completely different approach.

${styleGuide}

EXAMPLE of what GOOD comparisons look like:
- "AI Chatbots" vs "Live Chat Software" (AI automation vs human agents)
- "AI Chatbots" vs "Knowledge Base Platforms" (conversational vs self-serve)
- "AI Chatbots" vs "Helpdesk & Ticketing Systems" (proactive vs reactive)
- "Project Management Tools" vs "Spreadsheets & Manual Tracking" (purpose-built vs general)

EXAMPLE of what BAD comparisons look like (DO NOT DO THIS):
- "AI Chatbots" vs "AI Writing Tools" (both are AI — different problem entirely)
- "AI Chatbots" vs "AI Image Generation" (completely unrelated buyer need)
- "CRM Software" vs "ERP Software" (different departments, different problem)

THE KEY TEST: Would a real buyer actually be torn between these two options? Would they Google "${catName} vs [Alternative]"? If not, it's a bad comparison.

Generate 3-4 comparisons. Return valid JSON only:
[
  { "vs_name": "Alternative Solution Category", "vs_slug": "url-friendly-slug", "summary": "2-3 sentences explaining the core tradeoff from a buyer's perspective. When does ${catName} win? When does the alternative win? Be decisive — don't say both are good.", "differences": ["Key difference 1: ${catName} does X while Alternative does Y", "Key difference 2: specific tradeoff about cost, speed, or capability", "Key difference 3: who should pick which — name the buyer type"] }
]

CRITICAL RULES:
- The alternative must solve the SAME buyer problem with a DIFFERENT approach
- NEVER compare against another subcategory from the same sector (no "AI vs AI", no "SaaS vs SaaS")
- NEVER use "${catName}" or variations of it as the alternative
- The "vs_slug" must NOT be "${String(cat.slug)}"
- Think: what would the buyer use if "${catName}" didn't exist? THAT is the real alternative
- Write differences as decisive recommendations, not vague observations`

  const compRaw = await callGemini(compPrompt)
  const comparisons = JSON.parse(cleanJson(compRaw))

  // ── 5. Long-tail Keywords ──
  const year = new Date().getFullYear()
  const kwPrompt = `Generate realistic long-tail search queries that real buyers type into Google when evaluating ${catName} solutions. These must be GLOBAL keywords — no country, city, or region names.

Return valid JSON only:

{
  "by_industry": ["Best ${catName} for Healthcare", "Best ${catName} for Financial Services", "Best ${catName} for Education", "Best ${catName} for E-commerce", "Best ${catName} for Real Estate", "Best ${catName} for Manufacturing", "Best ${catName} for Logistics", "Best ${catName} for SaaS Companies"],
  "by_size": ["Best ${catName} for Startups", "Best ${catName} for Small Business", "Best ${catName} for Enterprise", "Best ${catName} for Agencies", "Best ${catName} for Freelancers", "Best ${catName} for Mid-Market", "Best ${catName} for Solopreneurs", "Best ${catName} for Remote Teams"],
  "by_need": ["Free ${catName} Tools ${year}", "Open Source ${catName} Alternatives", "Best ${catName} with API Integration", "${catName} vs [Top Competitor Category]", "${catName} with Free Trial", "Affordable ${catName} for Bootstrapped Startups", "Top Rated ${catName} ${year}", "${catName} Comparison & Reviews ${year}", "Best ${catName} with Mobile App", "Enterprise-Grade ${catName} Platforms"]
}

RULES:
- Every keyword must be something a real person would actually Google
- NO country/city/region names in any keyword
- Replace the "[Top Competitor Category]" placeholder with a real competing category name
- Include the year "${year}" in at least 3 keywords across all groups
- Focus on buyer-intent keywords (comparison, pricing, alternatives, reviews) not informational`

  const kwRaw = await callGemini(kwPrompt)
  const longTailKeywords = JSON.parse(cleanJson(kwRaw))

  // ── 6. Complementary Categories ──
  const compCatPrompt = `A company just purchased a ${catName} solution. What 5 other categories of tools or services do they typically evaluate next?

Think about the real workflow:
- What feeds data INTO ${catName}? (upstream tools)
- What consumes output FROM ${catName}? (downstream tools)
- What runs alongside ${catName} in the same team's stack?

${ctx}

Return valid JSON array of category names only:
["Category Name 1", "Category Name 2", "Category Name 3", "Category Name 4", "Category Name 5"]

RULES:
- Be specific: "Marketing Automation" not "Marketing Tools"
- These must be DIFFERENT categories, not variations of ${catName}
- Think real tech stack / vendor list pairings — what would you see together on a G2 or Gartner comparison
- No geographic references`

  const compCatRaw = await callGemini(compCatPrompt)
  const complementaryCategories = JSON.parse(cleanJson(compCatRaw))

  // ── 7. Extended FAQ ──
  const faqPrompt = `${ctx}
${styleGuide}

Write 12 FAQ entries about "${catName}" — the questions real buyers Google before making a purchase decision. Return valid JSON only:

[
  { "q": "Question phrased exactly how someone would type it into Google", "a": "3-4 sentence answer that gives a DIRECT, opinionated recommendation first, then adds nuance. Include a specific number, price range, or timeframe wherever possible. No hedging." }
]

Topics (one question each):
1. What ${catName} actually does — explain it like the buyer has never heard of it
2. How much does ${catName} cost? — give actual price ranges and pricing models
3. What are the must-have features? — name 3-4 non-negotiable capabilities
4. What's the best ${catName} for small teams? — recommend a type/approach, not a brand
5. What's the best ${catName} for enterprise? — different requirements than #4
6. How long does ${catName} implementation take? — give a realistic timeline range
7. ${catName} vs [name the most commonly confused alternative category] — decisive comparison
8. What integrations should ${catName} support? — name specific systems/protocols
9. What security/compliance standards matter? — name actual standards (SOC 2, GDPR, HIPAA, etc.)
10. Are there free or open-source ${catName} options? — honest assessment of viability
11. Red flags when evaluating ${catName} vendors — specific warning signs from real evaluations
12. What's changing in ${catName} right now? — actual ${year} trends, not buzzwords

RULES:
- Write each answer like a knowledgeable consultant giving frank advice over coffee
- NO geographic references (no countries, cities, regions)
- Every answer must contain at least one specific number, price, timeframe, or named standard
- The "vs" question (#7) must compare against a DIFFERENT category, not ${catName} itself`

  const faqRaw = await callGemini(faqPrompt)
  const extendedFaq = JSON.parse(cleanJson(faqRaw))

  // ── Save to DB ──
  const existing = await queryOne('SELECT id FROM category_seo_content WHERE category_id = ?', [categoryId])

  if (existing) {
    await execute(
      `UPDATE category_seo_content SET
        rich_description = ?, buyers_guide = ?, use_cases = ?, comparisons = ?,
        long_tail_keywords = ?, complementary_categories = ?, extended_faq = ?,
        generated_at = NOW(), model_version = 'gemini-2.5-flash'
       WHERE category_id = ?`,
      [
        richDescription,
        JSON.stringify(buyersGuide),
        JSON.stringify(useCases),
        JSON.stringify(comparisons),
        JSON.stringify(longTailKeywords),
        JSON.stringify(complementaryCategories),
        JSON.stringify(extendedFaq),
        categoryId,
      ]
    )
  } else {
    await execute(
      `INSERT INTO category_seo_content
        (category_id, rich_description, buyers_guide, use_cases, comparisons, long_tail_keywords, complementary_categories, extended_faq, generated_at, model_version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'gemini-2.5-flash')`,
      [
        categoryId,
        richDescription,
        JSON.stringify(buyersGuide),
        JSON.stringify(useCases),
        JSON.stringify(comparisons),
        JSON.stringify(longTailKeywords),
        JSON.stringify(complementaryCategories),
        JSON.stringify(extendedFaq),
      ]
    )
  }

  return { categoryId, name: catName, success: true }
}

/* ── Generate a SINGLE section for a category ── */
async function generateSection(categoryId: number, section: string) {
  const cat = await queryOne('SELECT * FROM categories WHERE id = ?', [categoryId])
  if (!cat) throw new Error(`Category ${categoryId} not found`)

  const parent = cat.parent_id ? await queryOne('SELECT id, name, slug, level, parent_id FROM categories WHERE id = ?', [cat.parent_id]) : null
  let sector = null
  const level = Number(cat.level)
  if (level === 1) sector = cat
  else if (level === 2 && parent) sector = parent
  else if (level === 3 && parent) {
    sector = parent.parent_id ? await queryOne('SELECT id, name, slug FROM categories WHERE id = ?', [parent.parent_id]) : parent
  }
  const subcats = await query('SELECT name, slug FROM categories WHERE parent_id = ? AND is_active = 1 AND is_navigation = 1 ORDER BY sort_order', [categoryId])
  const listingTypes = await query('SELECT name, slug FROM listing_types WHERE category_id = ? ORDER BY sort_order LIMIT 30', [categoryId])

  // For L1 sectors, get sample listing types from descendant L3 categories
  let effectiveListingTypes = listingTypes
  if (level === 1 && (listingTypes as any[]).length === 0) {
    effectiveListingTypes = await query(
      `SELECT lt.name, lt.slug FROM listing_types lt
       JOIN categories c3 ON lt.category_id = c3.id
       JOIN categories c2 ON c3.parent_id = c2.id
       WHERE c2.parent_id = ? ORDER BY RAND() LIMIT 30`,
      [categoryId]
    )
  }

  const siblings = cat.parent_id
    ? await query('SELECT name, slug FROM categories WHERE parent_id = ? AND id != ? AND is_active = 1 AND is_navigation = 1 ORDER BY sort_order LIMIT 10', [cat.parent_id, categoryId])
    : []
  const ctx = buildContext(cat, parent, sector, subcats as Array<Record<string, unknown>>, effectiveListingTypes as Array<Record<string, unknown>>)
  const catName = String(cat.name)
  const sectorId = sector ? Number(sector.id) : (parent ? Number(parent.id) : 0)
  const cousins = sectorId ? await query(
    `SELECT c.name, c.slug FROM categories c WHERE c.parent_id IN (SELECT id FROM categories WHERE parent_id = ? AND is_active = 1) AND c.id != ? AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY RAND() LIMIT 12`,
    [sectorId, categoryId]
  ) : []
  const siblingList = (siblings as Array<Record<string, unknown>>).map(s => `${s.name} (slug: ${s.slug})`).join(', ')
  const cousinList = (cousins as Array<Record<string, unknown>>).map(c => `${c.name} (slug: ${c.slug})`).join(', ')
  const subcatList = (subcats as Array<Record<string, unknown>>).map(s => `${s.name} (slug: ${s.slug})`).join(', ')

  const styleGuideShort = `Write like a sharp, opinionated industry analyst. Use contractions, vary sentence lengths, be specific with numbers. NO geographic references. NO AI-flagged words (landscape, leverage, robust, comprehensive, etc.).`

  let column = ''
  let value: string

  if (section === 'ai_summary') {
    column = 'ai_summary'
    const prompt = `${ctx}\n\n${styleGuideShort}\n\nWrite a 2-3 sentence AI overview summary for "${catName}". This appears at the top of the category page as a quick snapshot for buyers. Be concise, specific, and actionable. Mention what the category covers, who it's for, and one key differentiator or trend. No markdown, no bullet points — just flowing text. Return ONLY the summary text.`
    value = await callGemini(prompt)
  } else if (section === 'rich_description') {
    column = 'rich_description'
    const prompt = `You're a senior technology analyst writing a definitive category overview for InfoWebWorld.\n\n${ctx}\n\nINTERNAL LINKS — weave these using [LINK:slug:Display Text] format:\nSiblings: ${siblingList || 'none'}\nSubcategories: ${subcatList || 'none'}\nCousins: ${cousinList || 'none'}\n\n${styleGuideShort}\n\nWrite a 700-900 word editorial overview of "${catName}". Flowing paragraphs, 10-15 internal links, no headers/bullets. Return ONLY the text.`
    value = await callGemini(prompt)
  } else if (section === 'buyers_guide') {
    column = 'buyers_guide'
    const prompt = `${ctx}\n${styleGuideShort}\n\nCreate a buyer's guide for ${catName}. Return valid JSON only:\n{"features":[{"title":"...","description":"..."}],"questions":["..."],"pitfalls":["..."],"pricing_info":"..."}\n6 features, 5 questions, 4 pitfalls. Every item specific to ${catName}.`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else if (section === 'use_cases') {
    column = 'use_cases'
    const prompt = `${ctx}\n${styleGuideShort}\n\nGenerate 5 real-world use cases for ${catName}. Return valid JSON array:\n[{"title":"...","description":"2-3 sentences","icon":"building|heart|graduation|cart|code|briefcase|users|globe|chart|shield"}]\nDiverse industries, specific workflows.`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else if (section === 'comparisons') {
    column = 'comparisons'
    const prompt = `The category is: "${catName}"\n${parent ? `Parent: ${parent.name}` : ''}\n${sector ? `Sector: ${sector.name}` : ''}\n\n${styleGuideShort}\n\nGenerate 3-4 "${catName} vs [Alternative]" comparisons. Alternatives must be FUNDAMENTALLY DIFFERENT approaches to the same buyer problem. Return valid JSON:\n[{"vs_name":"...","vs_slug":"...","summary":"2-3 sentences","differences":["..."]}]\nNever compare against same-sector subcategories.`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else if (section === 'long_tail_keywords') {
    column = 'long_tail_keywords'
    const year = new Date().getFullYear()
    const prompt = `Generate long-tail keywords for ${catName}. Return valid JSON:\n{"by_industry":["8 keywords"],"by_size":["8 keywords"],"by_need":["10 keywords"]}\nNo geographic references. Include year ${year} in 3+ keywords.`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else if (section === 'complementary_categories') {
    column = 'complementary_categories'
    const prompt = `A company just purchased ${catName}. What 5 other categories do they typically evaluate next? Return JSON array of names only:\n["Category 1","Category 2","Category 3","Category 4","Category 5"]`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else if (section === 'extended_faq') {
    column = 'extended_faq'
    const prompt = `${ctx}\n${styleGuideShort}\n\nWrite 12 FAQ entries for "${catName}". Return valid JSON:\n[{"q":"Question as someone would Google it","a":"3-4 sentence direct answer with specific numbers/prices/timeframes"}]\nTopics: definition, pricing, must-have features, best for small teams, best for enterprise, implementation time, vs alternative, integrations, compliance, free/open-source options, red flags, trends.`
    value = JSON.stringify(JSON.parse(cleanJson(await callGemini(prompt))))
  } else {
    throw new Error(`Unknown section: ${section}`)
  }

  // Upsert just this column
  const existing = await queryOne('SELECT id FROM category_seo_content WHERE category_id = ?', [categoryId])
  if (existing) {
    await execute(`UPDATE category_seo_content SET ${column} = ?, generated_at = NOW(), model_version = 'gemini-2.5-flash' WHERE category_id = ?`, [value, categoryId])
  } else {
    await execute(`INSERT INTO category_seo_content (category_id, ${column}, generated_at, model_version) VALUES (?, ?, NOW(), 'gemini-2.5-flash')`, [categoryId, value])
  }

  return { categoryId, name: catName, section, success: true }
}

/* ── POST: Generate for single category, single section, or batch ── */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const { categoryId, section } = body

    // Single section for a category
    if (categoryId && section) {
      const result = await generateSection(Number(categoryId), section)
      return Response.json({ ok: true, ...result })
    }

    // All sections for a single category
    if (categoryId) {
      const result = await generateForCategory(Number(categoryId))
      return Response.json({ ok: true, ...result })
    }

    return Response.json({ error: 'Provide categoryId (and optional section)' }, { status: 400 })
  } catch (err) {
    console.error('generate-seo-content error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

const SECTION_COLS = ['ai_summary','rich_description','buyers_guide','use_cases','comparisons','long_tail_keywords','complementary_categories','extended_faq'] as const

/* ── GET: Check generation status with per-category section breakdown ── */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const total = await queryOne('SELECT COUNT(*) as cnt FROM categories WHERE level IN (1, 2, 3)')
    const generated = await queryOne('SELECT COUNT(*) as cnt FROM category_seo_content WHERE rich_description IS NOT NULL')

    // Per-category section status
    const rows = await query(
      `SELECT sc.category_id,
              sc.ai_summary IS NOT NULL AND sc.ai_summary != '' as has_ai_summary,
              sc.rich_description IS NOT NULL AND sc.rich_description != '' as has_rich_description,
              sc.buyers_guide IS NOT NULL AND sc.buyers_guide != '' as has_buyers_guide,
              sc.use_cases IS NOT NULL AND sc.use_cases != '' as has_use_cases,
              sc.comparisons IS NOT NULL AND sc.comparisons != '' as has_comparisons,
              sc.long_tail_keywords IS NOT NULL AND sc.long_tail_keywords != '' as has_long_tail_keywords,
              sc.complementary_categories IS NOT NULL AND sc.complementary_categories != '' as has_complementary_categories,
              sc.extended_faq IS NOT NULL AND sc.extended_faq != '' as has_extended_faq,
              sc.generated_at, sc.model_version
       FROM category_seo_content sc`
    )

    // Build a map: categoryId → { sections, generatedAt }
    const sectionMap: Record<number, { sections: Record<string, boolean>; generatedAt: string }> = {}
    for (const r of rows as Array<Record<string, unknown>>) {
      const cid = Number(r.category_id)
      const sections: Record<string, boolean> = {}
      for (const col of SECTION_COLS) sections[col] = Number(r[`has_${col}`]) === 1
      sectionMap[cid] = { sections, generatedAt: String(r.generated_at || '') }
    }

    return Response.json({
      ok: true,
      total: Number(total?.cnt ?? 0),
      generated: Number(generated?.cnt ?? 0),
      sectionMap,
    })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
