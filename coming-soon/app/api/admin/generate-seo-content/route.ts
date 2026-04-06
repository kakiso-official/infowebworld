import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')

  const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function cleanJson(raw: string): string {
  // Strip markdown code fences if present
  return raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
}

/* ── Build context string for a category ── */
function buildContext(cat: Record<string, unknown>, parent: Record<string, unknown> | null, sector: Record<string, unknown> | null, subcats: Array<Record<string, unknown>>, listingTypes: Array<Record<string, unknown>>) {
  const parts: string[] = []
  parts.push(`Category: ${cat.name}`)
  parts.push(`Level: ${cat.level === 2 ? 'L2 Category' : 'L3 Subcategory'}`)
  if (parent) parts.push(`Parent Category: ${parent.name}`)
  if (sector) parts.push(`Industry Sector: ${sector.name}`)
  if (cat.description) parts.push(`Current Description: ${cat.description}`)
  if (subcats.length) parts.push(`Subcategories: ${subcats.map(s => s.name).join(', ')}`)
  if (listingTypes.length) parts.push(`Listing Types: ${listingTypes.slice(0, 20).map(lt => lt.name).join(', ')}`)
  parts.push(`Platform: InfoWebWorld.com — a global business discovery and listing platform`)
  return parts.join('\n')
}

/* ── Generate all content types for a category ── */
async function generateForCategory(categoryId: number) {
  // Fetch category + context
  const cat = await queryOne('SELECT * FROM categories WHERE id = ?', [categoryId])
  if (!cat) throw new Error(`Category ${categoryId} not found`)

  const parent = cat.parent_id ? await queryOne('SELECT id, name, slug, level FROM categories WHERE id = ?', [cat.parent_id]) : null

  // Find L1 sector
  let sector = null
  if (Number(cat.level) === 2 && parent) sector = parent
  else if (Number(cat.level) === 3 && parent) {
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'gemini-2.0-flash')`,
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

/* ── POST: Generate for single category or batch ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, batch } = body

    // Single category
    if (categoryId) {
      const result = await generateForCategory(Number(categoryId))
      return Response.json({ ok: true, ...result })
    }

    // Batch: generate for all L2/L3 categories
    if (batch) {
      const cats = await query(
        'SELECT id, name FROM categories WHERE level IN (2, 3) AND is_active = 1 AND is_navigation = 1 ORDER BY level, sort_order'
      ) as Array<{ id: number; name: string }>

      const results: { id: number; name: string; success: boolean; error?: string }[] = []

      // Process sequentially to avoid rate limits
      for (const cat of cats) {
        try {
          await generateForCategory(cat.id)
          results.push({ id: cat.id, name: cat.name, success: true })
        } catch (err) {
          results.push({ id: cat.id, name: cat.name, success: false, error: String(err) })
        }
        // Small delay between API calls to respect rate limits
        await new Promise(r => setTimeout(r, 500))
      }

      const succeeded = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      return Response.json({ ok: true, total: cats.length, succeeded, failed, results })
    }

    return Response.json({ error: 'Provide categoryId or batch: true' }, { status: 400 })
  } catch (err) {
    console.error('generate-seo-content error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

/* ── GET: Check generation status ── */
export async function GET() {
  try {
    const total = await queryOne('SELECT COUNT(*) as cnt FROM categories WHERE level IN (2, 3) AND is_active = 1 AND is_navigation = 1')
    const generated = await queryOne('SELECT COUNT(*) as cnt FROM category_seo_content WHERE rich_description IS NOT NULL')
    const recent = await query(
      'SELECT sc.category_id, c.name, c.slug, sc.generated_at, sc.model_version FROM category_seo_content sc JOIN categories c ON c.id = sc.category_id ORDER BY sc.generated_at DESC LIMIT 10'
    )
    return Response.json({
      ok: true,
      total: Number(total?.cnt ?? 0),
      generated: Number(generated?.cnt ?? 0),
      recent,
    })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
