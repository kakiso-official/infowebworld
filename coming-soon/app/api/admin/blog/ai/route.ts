import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { CATEGORIES, type StaticCategoryRow } from '@/app/config/categories-data'
import { getPublishedPosts } from '@/lib/blog'
import { groqChat } from '@/lib/ai'

/* ════════════════════════════════════════════════════════════════════════
   Blog AI assist (Gemini 2.5 Flash). Two modes:

   • beautify        — adds markdown formatting (**, ##, lists, >, ---) WITHOUT
                       changing any words.
   • internal-links  — inserts internal links using ONLY real pages of the site.
                       Every link Gemini returns is validated against the verified
                       URL set; anything not on the allow-list is unwrapped, so a
                       link can NEVER 404.
   ════════════════════════════════════════════════════════════════════════ */
export const dynamic = 'force-dynamic'

/* Backed by Groq (Llama 3.3 70B). Thin wrapper so the call sites below read
   unchanged — provider swapped from Gemini. */
async function callAI(prompt: string, temperature = 0.3): Promise<string> {
  return groqChat({ prompt, temperature, maxTokens: 8192 })
}

function stripFences(s: string): string {
  return s.trim().replace(/^```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
}

/* ── Verified, real internal pages ─────────────────────────────────────── */
const SECTORS: Array<{ slug: string; name: string }> = [
  { slug: 'ai-ml', name: 'AI & ML' },
  { slug: 'software-saas', name: 'Software & SaaS' },
  { slug: 'it-services-agencies', name: 'IT Services & Agencies' },
  { slug: 'startups-innovation', name: 'Startups & Innovation' },
  { slug: 'local-businesses', name: 'Local Businesses' },
  { slug: 'professional-services', name: 'Professional Services' },
]
const STATIC_PAGES: Array<{ url: string; name: string }> = [
  { url: '/categories', name: 'All Categories' },
  { url: '/business', name: 'List Your Business' },
  { url: '/business/plans', name: 'Pricing & Plans' },
  { url: '/write-review', name: 'Write a Review' },
  { url: '/about', name: 'About InfoWebWorld' },
  { url: '/faqs', name: 'FAQs' },
  { url: '/glossary', name: 'Glossary' },
  { url: '/help', name: 'Help Center' },
]
const STOP = new Set(['the', 'and', 'for', 'with', 'your', 'you', 'best', 'top', 'are', 'how', 'what', 'why', 'this', 'that', 'from', 'into', 'about', 'using', 'use', 'can', 'will', 'has', 'have', 'they', 'their', 'more', 'most', 'when', 'where', 'which', 'who', 'all', 'any', 'one', 'two', 'get', 'got', 'out', 'not', 'but', 'our', 'its', 'was', 'were', 'been', 'than', 'then', 'them', 'these', 'those', 'some', 'such', 'over', 'also', 'just', 'like', 'make', 'made', 'need', 'want', 'tools', 'tool', 'software', 'services', 'service', 'companies', 'company', 'business', 'businesses'])

const norm = (u: string) => u.trim().split(/[#?]/)[0].replace(/\/+$/, '') || '/'

type Cand = { url: string; name: string }

function buildCandidates(content: string, pubPosts: Array<{ slug: string; title: string }>): Cand[] {
  const list: Cand[] = []
  for (const s of SECTORS) list.push({ url: `/${s.slug}`, name: s.name })
  for (const p of STATIC_PAGES) list.push(p)
  for (const p of pubPosts) list.push({ url: `/blog/${p.slug}`, name: p.title })

  const text = content.toLowerCase()
  const tokens = new Set(text.split(/[^a-z0-9]+/).filter(w => w.length > 3 && !STOP.has(w)))
  const scored: Array<{ c: StaticCategoryRow; score: number }> = []
  for (const c of CATEGORIES) {
    if (c.level < 2 || c.level > 3 || !c.sector_slug) continue
    const nameTokens = c.name.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2)
    let score = 0
    for (const t of nameTokens) if (tokens.has(t)) score++
    if (score && text.includes(c.name.toLowerCase())) score += 3
    if (score > 0) scored.push({ c, score })
  }
  scored.sort((a, b) => b.score - a.score || (Number(b.c.listing_count) || 0) - (Number(a.c.listing_count) || 0))
  for (const { c } of scored.slice(0, 45)) list.push({ url: `/${c.sector_slug}/${c.slug}`, name: c.name })

  const seen = new Set<string>()
  return list.filter(c => { const k = norm(c.url); if (seen.has(k)) return false; seen.add(k); return true })
}

/** Strip any internal link not on the allow-list (external links untouched). */
function validateLinks(md: string, allowed: Set<string>): { out: string; kept: number; stripped: number } {
  let kept = 0, stripped = 0
  // (?<!!) so image syntax ![alt](url) is never touched.
  const out = md.replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, url: string) => {
    if (/^(https?:|mailto:|tel:|#)/i.test(url.trim())) return `[${text}](${url})` // external/anchor — leave
    if (allowed.has(norm(url))) { kept++; return `[${text}](${norm(url)})` }
    stripped++; return text // internal but unverified → unwrap (no 404 possible)
  })
  return { out, kept, stripped }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { mode, content } = (await request.json()) as { mode?: string; content?: string }
    const body = String(content || '').trim()
    if (!body) return Response.json({ ok: false, error: 'No content provided.' }, { status: 400 })

    if (mode === 'beautify') {
      const prompt = `You are a markdown formatter for a blog article. Add ONLY markdown formatting to make the text below beautiful, scannable and well structured.

STRICT RULES — follow exactly:
- Do NOT change, add, remove, reorder, translate, or rephrase ANY word. Every word stays exactly as written, in the same order.
- Only ADD markdown symbols around the existing words:
  - **bold** for key terms and standout phrases
  - ## / ### headings for lines that act as section titles (turn an existing line into a heading — never invent a new title)
  - - or 1. for lists that already read as lists
  - > blockquotes for one or two standout existing sentences
  - --- horizontal dividers between major sections
  - \`inline code\` for product, brand or technical names where natural
- Keep every existing link and image exactly as-is.
- Return ONLY the formatted markdown. No commentary, no code fences.

ARTICLE:
${body}`
      const out = stripFences(await callAI(prompt, 0.2))
      return Response.json({ ok: true, content: out || body })
    }

    if (mode === 'internal-links') {
      const pub = await getPublishedPosts().catch(() => [])
      const cands = buildCandidates(body, pub)
      const allowed = new Set(cands.map(c => norm(c.url)))
      const listText = cands.map(c => `- ${c.name} → ${c.url}`).join('\n')
      const prompt = `You are an internal-linking assistant for the InfoWebWorld blog. Insert natural, helpful internal links into the article using ONLY the real pages listed below.

STRICT RULES:
- Use ONLY the exact URLs from the ALLOWED PAGES list. NEVER invent, guess or modify a URL. NEVER add external (http) links.
- Add between 4 and 10 links total, only where genuinely relevant to the surrounding sentence.
- Wrap an existing phrase as the anchor — [existing phrase](/url). Prefer phrases already in the text. Do not change wording otherwise.
- At most one link per paragraph. Never link the same URL twice. Don't link in headings.
- Keep all existing markdown, links and images intact.
- Return ONLY the full article markdown with the links added. No commentary, no code fences.

ALLOWED PAGES (name → url):
${listText}

ARTICLE:
${body}`
      const raw = stripFences(await callAI(prompt, 0.3))
      const { out, kept, stripped } = validateLinks(raw || body, allowed)
      return Response.json({ ok: true, content: out, kept, stripped })
    }

    if (mode === 'toc') {
      const prompt = `You are structuring a blog article so it has a clean table of contents.

STRICT RULES:
- Insert 3 to 7 \`## \` section headings at the natural section breaks of the article.
- Each heading is a short, descriptive label (2 to 6 words) for the section that follows it.
- Do NOT change, remove, rephrase or reorder any of the existing body sentences. You may ONLY add new \`## \` heading lines (keep any headings that already exist; refine their wording only if clearly needed).
- Keep all existing markdown, links and images intact.
- Return ONLY the full article markdown with the headings added. No commentary, no code fences.

ARTICLE:
${body}`
      const out = stripFences(await callAI(prompt, 0.3))
      return Response.json({ ok: true, content: out || body })
    }

    return Response.json({ ok: false, error: 'Unknown mode.' }, { status: 400 })
  } catch (err) {
    console.error('blog ai error:', err)
    const msg = err instanceof Error ? err.message : 'AI request failed'
    return Response.json({ ok: false, error: msg.includes('GROQ_API_KEY') ? 'AI is not configured on the server.' : 'AI request failed. Try again.' }, { status: 500 })
  }
}
