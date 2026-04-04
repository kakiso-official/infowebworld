import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

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

  // ── 1. Rich Description ──
  const descPrompt = `You are an expert SEO content writer for a business directory platform (InfoWebWorld.com).

Write a comprehensive, unique description for this business category page. This will be the main content on the page.

${ctx}

Requirements:
- 500-700 words, well-structured with natural paragraphs
- Write in an authoritative, helpful tone (like G2 or Capterra would)
- Include what this category encompasses, who uses it, key benefits, common use cases
- Naturally mention related terms and synonyms for SEO
- Do NOT use markdown headers (no # or ##). Just plain paragraphs.
- Do NOT mention "InfoWebWorld" in the text body
- Write as editorial content, not marketing copy
- Include 2-3 natural internal link suggestions as [LINK:category-slug:Display Text] format

Return ONLY the description text, nothing else.`

  const richDescription = await callGemini(descPrompt)

  // ── 2. Buyer's Guide ──
  const guidePrompt = `You are an expert business technology advisor.

${ctx}

Generate a buyer's guide for someone evaluating ${catName} solutions. Return valid JSON only, no markdown:

{
  "features": [
    { "title": "Feature Name", "description": "Why this matters and what to look for (1-2 sentences)" }
  ],
  "questions": ["Question to ask vendors..."],
  "pitfalls": ["Common mistake to avoid..."],
  "pricing_info": "Brief overview of typical pricing models and ranges for ${catName} (2-3 sentences)"
}

Include exactly 6 features, 5 questions, 4 pitfalls. Be specific to ${catName}, not generic.`

  const guideRaw = await callGemini(guidePrompt)
  const buyersGuide = JSON.parse(cleanJson(guideRaw))

  // ── 3. Use Cases ──
  const useCasePrompt = `${ctx}

Generate 5 specific use cases for ${catName}. Return valid JSON only:

[
  { "title": "Use Case Title (e.g. '${catName} for Healthcare')", "description": "2-3 sentence description of how this industry/role uses ${catName}", "icon": "one of: building, heart, graduation, cart, code, briefcase, users, globe, chart, shield" }
]

Make each use case target a different industry or business size. Be specific, not generic.`

  const useCaseRaw = await callGemini(useCasePrompt)
  const useCases = JSON.parse(cleanJson(useCaseRaw))

  // ── 4. Comparisons ──
  const siblingNames = (siblings as Array<Record<string, unknown>>).slice(0, 4).map(s => `${s.name} (slug: ${s.slug})`)
  const compPrompt = `${ctx}

Generate comparison summaries between "${catName}" and these related categories:
${siblingNames.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Return valid JSON only:
[
  { "vs_name": "Other Category Name", "vs_slug": "other-category-slug", "summary": "2-3 sentence comparison explaining key differences", "differences": ["Difference 1", "Difference 2", "Difference 3"] }
]

${siblingNames.length === 0 ? 'If no siblings available, generate 2 comparisons with commonly compared alternatives in this space.' : ''}`

  const compRaw = await callGemini(compPrompt)
  const comparisons = JSON.parse(cleanJson(compRaw))

  // ── 5. Long-tail Keywords ──
  const kwPrompt = `Generate long-tail keyword phrases for a "${catName}" category page on a business directory. Return valid JSON only:

{
  "by_industry": ["Best ${catName} for Healthcare", "Best ${catName} for Finance", "Best ${catName} for Education", "Best ${catName} for E-commerce", "Best ${catName} for Real Estate", "Best ${catName} for Manufacturing"],
  "by_size": ["Best ${catName} for Startups", "Best ${catName} for Small Business", "Best ${catName} for Enterprise", "Best ${catName} for Agencies", "Best ${catName} for Freelancers", "Best ${catName} for Mid-Market"],
  "by_need": ["Free ${catName} Tools", "Open Source ${catName}", "Best ${catName} with API", "Best ${catName} for Teams", "${catName} with Free Trial", "Affordable ${catName} Solutions", "Best ${catName} ${new Date().getFullYear()}", "${catName} Reviews & Ratings"]
}

Make keywords specific and natural-sounding. Each should be a real search query someone would type.`

  const kwRaw = await callGemini(kwPrompt)
  const longTailKeywords = JSON.parse(cleanJson(kwRaw))

  // ── 6. Complementary Categories ──
  const compCatPrompt = `${ctx}

What 4-5 other business software/service categories would complement "${catName}"? These are categories that a business using ${catName} would also likely need.

Return valid JSON array of category descriptions only:
["Category Name 1", "Category Name 2", "Category Name 3", "Category Name 4"]

Be specific. For example, if the category is "CRM Software", complementary would be "Email Marketing", "Sales Analytics", "Customer Support", "Marketing Automation".`

  const compCatRaw = await callGemini(compCatPrompt)
  const complementaryCategories = JSON.parse(cleanJson(compCatRaw))

  // ── 7. Extended FAQ ──
  const faqPrompt = `${ctx}

Generate 12 frequently asked questions and detailed answers about "${catName}" for a business directory page. Return valid JSON only:

[
  { "q": "Question?", "a": "Detailed answer (2-4 sentences)" }
]

Include questions about:
- What ${catName} is and how it works
- Pricing and cost
- Key features to look for
- Best options for different business sizes
- Implementation and migration
- ROI and benefits
- Comparisons with alternatives
- Integration capabilities
- Security and compliance
- Free vs paid options
- Trends in ${catName}
- How to evaluate vendors

Make answers informative and specific to ${catName}. Each answer should be 2-4 sentences.`

  const faqRaw = await callGemini(faqPrompt)
  const extendedFaq = JSON.parse(cleanJson(faqRaw))

  // ── Save to DB ──
  const existing = await queryOne('SELECT id FROM category_seo_content WHERE category_id = ?', [categoryId])

  if (existing) {
    await execute(
      `UPDATE category_seo_content SET
        rich_description = ?, buyers_guide = ?, use_cases = ?, comparisons = ?,
        long_tail_keywords = ?, complementary_categories = ?, extended_faq = ?,
        generated_at = NOW(), model_version = 'gemini-2.0-flash'
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
