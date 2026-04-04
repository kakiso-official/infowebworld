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
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
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
CRITICAL WRITING RULES — your output MUST pass AI detection tools with <10% AI score:
- Write like a seasoned industry journalist, NOT an AI assistant
- Use contractions naturally (don't, won't, it's, they're, you'll)
- Vary sentence length dramatically: mix 5-word punches with 25-word complex sentences
- Start paragraphs differently each time — NEVER start with "In today's", "In the realm of", "When it comes to", "It's important to", "Whether you're"
- Use specific numbers and data points (even approximate ones like "roughly 60% of mid-size companies")
- Include occasional informal phrasing ("here's the thing", "the bottom line", "let's be honest")
- Reference real-world context (market shifts, buyer behavior, industry pain points)
- Avoid AI giveaway patterns: no bullet-point-like paragraphs, no "Furthermore/Moreover/Additionally" transitions
- Use active voice predominantly. Passive voice sparingly for variety.
- NO generic filler. Every sentence must add specific value.
- Do NOT use the word "landscape" or "leverage" or "navigate" or "robust" or "comprehensive" or "delve" or "crucial"
`

  // ── 1. Rich Description ──
  const descPrompt = `You're a senior tech editor writing a category overview for a business directory.

${ctx}

RELATED CATEGORIES TO LINK (use [LINK:slug:Display Text] format):
Siblings: ${siblingList || 'none'}
Cousins in sector: ${cousinList || 'none'}
Subcategories: ${subcatList || 'none'}

${styleGuide}

Write a 600-800 word overview of "${catName}" for people researching solutions in this space. Structure:
- Opening paragraph: what this category actually is, in plain terms (3-4 sentences)
- Who buys these solutions and why — specific roles, company types, pain points (4-5 sentences)
- The current state of the market — what's changed recently, what buyers should know (3-4 sentences)
- Key capabilities that separate good solutions from great ones (4-5 sentences)
- Where this fits in the bigger picture — how it connects to adjacent categories (3-4 sentences, use [LINK:slug:Text] here)
- Closing paragraph: practical advice for someone starting their search (3-4 sentences)

Include 6-10 internal links as [LINK:slug:Display Text] spread naturally throughout. Link to siblings, cousins, and subcategories where they fit the context.

No markdown. No headers. No bullet points. Just flowing editorial paragraphs.
Return ONLY the description text.`

  const richDescription = await callGemini(descPrompt)

  // ── 2. Buyer's Guide ──
  const guidePrompt = `You're a procurement consultant advising a VP of Operations.

${ctx}
${styleGuide}

Create a practical buyer's guide for evaluating ${catName} vendors. Return valid JSON only, no markdown:

{
  "features": [
    { "title": "Feature Name", "description": "One sharp sentence on why this matters, written like advice from a colleague who's been through 50 vendor evaluations" }
  ],
  "questions": ["Direct, specific question to ask a vendor — not generic fluff"],
  "pitfalls": ["Real mistake buyers make, described in one blunt sentence"],
  "pricing_info": "2-3 sentences about how ${catName} is typically priced — mention actual models (per seat, usage-based, flat fee) and rough ranges where possible"
}

Exactly 6 features, 5 questions, 4 pitfalls. Every item must be specific to ${catName} — nothing that could apply to any software category.`

  const guideRaw = await callGemini(guidePrompt)
  const buyersGuide = JSON.parse(cleanJson(guideRaw))

  // ── 3. Use Cases ──
  const useCasePrompt = `${ctx}
${styleGuide}

Generate 5 real-world use cases for ${catName}. Each targets a different industry or team type. Return valid JSON only:

[
  { "title": "Specific Title (e.g., '${catName} for D2C E-commerce Brands')", "description": "2-3 sentences describing the actual problem this industry faces and how ${catName} solves it. Be specific — mention workflows, metrics, or outcomes.", "icon": "one of: building, heart, graduation, cart, code, briefcase, users, globe, chart, shield" }
]

Don't use generic titles like "For Small Business". Be specific: "For Series-A SaaS Startups" or "For Hospital IT Departments".`

  const useCaseRaw = await callGemini(useCasePrompt)
  const useCases = JSON.parse(cleanJson(useCaseRaw))

  // ── 4. Comparisons ──
  const siblingNames = (siblings as Array<Record<string, unknown>>).slice(0, 4).map(s => `${s.name} (slug: ${s.slug})`)
  const compPrompt = `${ctx}
${styleGuide}

Write comparison blurbs between "${catName}" and these related categories:
${siblingNames.map((s, i) => `${i + 1}. ${s}`).join('\n')}
${siblingNames.length === 0 ? 'Generate 3 comparisons with commonly confused or compared alternatives in this space. Use realistic category names and slugs.' : ''}

Return valid JSON only:
[
  { "vs_name": "Other Category Name", "vs_slug": "other-category-slug", "summary": "2-3 sentence comparison that a real buyer would find useful. What's the actual decision point between these two?", "differences": ["Sharp difference 1", "Sharp difference 2", "Sharp difference 3"] }
]

Write differences as decisive statements, not vague observations.`

  const compRaw = await callGemini(compPrompt)
  const comparisons = JSON.parse(cleanJson(compRaw))

  // ── 5. Long-tail Keywords ──
  const year = new Date().getFullYear()
  const kwPrompt = `Generate realistic long-tail search queries that real buyers type when looking for ${catName} solutions. Return valid JSON only:

{
  "by_industry": ["Best ${catName} for Healthcare", "Best ${catName} for Financial Services", "Best ${catName} for Education", "Best ${catName} for E-commerce", "Best ${catName} for Real Estate", "Best ${catName} for Manufacturing", "Best ${catName} for Logistics", "Best ${catName} for SaaS Companies"],
  "by_size": ["Best ${catName} for Startups", "Best ${catName} for Small Business", "Best ${catName} for Enterprise", "Best ${catName} for Agencies", "Best ${catName} for Freelancers", "Best ${catName} for Mid-Market", "Best ${catName} for Solopreneurs", "Best ${catName} for Remote Teams"],
  "by_need": ["Free ${catName} Tools ${year}", "Open Source ${catName} Alternatives", "Best ${catName} with API Integration", "Best ${catName} for Teams Under 50", "${catName} with Free Trial", "Affordable ${catName} for Bootstrapped Startups", "Top Rated ${catName} ${year}", "${catName} Comparison & Reviews", "Best ${catName} with Mobile App", "Enterprise-Grade ${catName} Platforms"]
}

Make every keyword something a real person would Google. No AI-sounding phrases.`

  const kwRaw = await callGemini(kwPrompt)
  const longTailKeywords = JSON.parse(cleanJson(kwRaw))

  // ── 6. Complementary Categories ──
  const compCatPrompt = `A company just bought a ${catName} solution. What 5 other categories of tools/services would they typically need next? Think about the actual workflow — what comes before, after, or alongside ${catName}?

Return valid JSON array of category names only:
["Category Name 1", "Category Name 2", "Category Name 3", "Category Name 4", "Category Name 5"]

Be specific and practical. These should be categories that genuinely appear together in a company's tech stack or service vendor list.`

  const compCatRaw = await callGemini(compCatPrompt)
  const complementaryCategories = JSON.parse(cleanJson(compCatRaw))

  // ── 7. Extended FAQ ──
  const faqPrompt = `${ctx}
${styleGuide}

Write 12 FAQ entries about "${catName}" that real buyers actually search for. Return valid JSON only:

[
  { "q": "Question phrased exactly how someone would Google it?", "a": "3-4 sentence answer that's genuinely helpful. Include a specific fact, number, or recommendation. Don't hedge with 'it depends' — give a real answer first, then add nuance." }
]

Topics to cover (one question each):
1. What ${catName} actually does (plain English)
2. Typical cost / pricing ranges
3. Must-have features
4. Best option for small teams (<20 people)
5. Best option for enterprise
6. How long implementation takes
7. ${catName} vs the most common alternative
8. Integration requirements
9. Security / compliance standards
10. Free or open-source options
11. How to evaluate vendors (red flags)
12. Current trends shaping ${catName} in ${year}

Write answers like a knowledgeable friend giving advice, not a corporate FAQ page.`

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
