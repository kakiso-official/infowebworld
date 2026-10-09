/* ════════════════════════════════════════════════════════════════════════
   Homepage "Latest from the blog" data layer.

   Thin, JSON-safe projection over lib/blog.ts's getPublishedPosts() — the
   exact same reader /blog uses, so "published" here means exactly what
   /blog shows. No raw SQL; no Date objects cross the unstable_cache
   boundary (it JSON-serialises its return value).

   SAFE on the server only — imports lib/blog, which imports lib/db. Never
   import from a client component.
   ════════════════════════════════════════════════════════════════════════ */
import { unstable_cache } from 'next/cache'
import { getPublishedPosts } from '@/lib/blog'

export type HomeBlogPost = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  readTime: number
  publishedAt: string
}

/** Named HTML entities seen in blog bodies. `&amp;` is intentionally absent
 *  here and decoded as a final pass in decodeEntities() so a body
 *  containing e.g. `&amp;rsquo;` doesn't double-decode into `’`. */
const NAMED_ENTITIES: Record<string, string> = {
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
}

/** Decodes the common named/numeric HTML entities that show up in blog
 *  bodies (e.g. `&rsquo;`) back to their literal characters. Safe to run on
 *  text that is rendered as a React text node (never dangerouslySetInnerHTML)
 *  since a decoded `<`/`>` cannot inject markup. `&amp;` is decoded last so
 *  it never re-triggers the other replacements (no double-decode cascade). */
function decodeEntities(s: string): string {
  let out = s.replace(/&(?:rsquo|lsquo|rdquo|ldquo|mdash|ndash|hellip|nbsp|quot|apos|#39|lt|gt);/g, m => NAMED_ENTITIES[m] ?? m)

  out = out.replace(/&#(\d+);/g, (m, dec) => {
    try {
      return String.fromCodePoint(parseInt(dec, 10))
    } catch {
      return m
    }
  })

  out = out.replace(/&#x([0-9a-f]+);/gi, (m, hex) => {
    try {
      return String.fromCodePoint(parseInt(hex, 16))
    } catch {
      return m
    }
  })

  // Decode &amp; last so it can never re-create another entity above.
  out = out.replace(/&amp;/g, '&')

  return out
}

/** Derives a plain-text excerpt from a post's markdown body when the DB
 *  `excerpt` column is empty, so a card never shows a blank gap between its
 *  title and date. Strips code fences, images, links/headers/list
 *  markers/emphasis and any raw HTML tags, decodes HTML entities, collapses
 *  whitespace, and truncates at the last whole word before `max` chars with
 *  an ellipsis. */
function deriveExcerpt(body: string, max = 160): string {
  if (!body) return ''

  let plain = body
    .replace(/```[\s\S]*?```/g, ' ')        // fenced code blocks
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')    // non-content blocks
    .replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ')  // HTML headings + their text ("Introduction" must not glue onto the first sentence)
    .replace(/<[^>]*>/g, ' ')                // raw HTML tags (before char-stripping eats the '>')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')   // images
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1') // links -> label text
    .replace(/^#{1,6}\s+.*$/gm, ' ')         // headers (marker + text, so it can't merge into the next line)
    .replace(/^\s*[-*+]\s+/gm, '')           // unordered list markers
    .replace(/^\s*\d+\.\s+/gm, '')           // ordered list markers
    .replace(/[*_~`>#]/g, '')                // emphasis/blockquote/heading chars
    .trim()

  plain = decodeEntities(plain)
    .replace(/\s+/g, ' ')
    .trim()

  if (!plain) return ''
  if (plain.length <= max) return plain

  const cut = plain.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

type PublishedPost = Awaited<ReturnType<typeof getPublishedPosts>>[number]

function postTime(p: PublishedPost): number {
  return new Date(p.publishedAt || p.createdAt).getTime()
}

function toHomeBlogPost(p: PublishedPost): HomeBlogPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: (p.excerpt && p.excerpt.trim()) || deriveExcerpt(p.body || ''),
    coverImage: p.coverImage || '',
    category: p.category || '',
    readTime: Number(p.readTime) || 1,
    publishedAt: p.publishedAt || p.createdAt || '',
  }
}

/** Latest N published posts, newest first (publishedAt desc, falling back
 *  to createdAt for rows where publishedAt is somehow null). Defensive:
 *  any failure degrades to an empty list rather than throwing into the
 *  homepage render. */
async function fetchLatestBlogPosts(limit = 3): Promise<HomeBlogPost[]> {
  try {
    const posts = await getPublishedPosts()
    return posts
      .slice()
      .sort((a, b) => postTime(b) - postTime(a))
      .slice(0, limit)
      .map(toHomeBlogPost)
  } catch (err) {
    console.error('[home] latest blog fetch failed:', err instanceof Error ? err.message : err)
    return []
  }
}

export const getLatestBlogPosts = unstable_cache(
  fetchLatestBlogPosts,
  ['home-blog-v5'],
  { revalidate: 600 }
)

/* ── Topic-relevant posts (the sector directories' blog sections) ───────
   Tier 1 = posts about the topic itself, tier 2 = adjacent guides;
   anything else only fills slots that are still empty. Newest first
   within a tier. Matched on title, tags, category and excerpt - never the
   body, where "AI" gets a passing mention in almost every post. */
const TOPIC_TIERS = {
  ai: [
    /\b(ai|artificial intelligence|machine learning|ml|generative|genai|llms?|gpt|chatgpt|chatbots?|copilots?|agentic|neural|deep learning)\b/i,
    /\b(software|saas|tools?|toolkit|tech stack|automation|apps?)\b/i,
  ],
  saas: [
    /\b(saas|business software|tech stack|toolkit)\b/i,
    /\b(software|tools?|apps?|automation)\b/i,
  ],
  /* Case-sensitive on purpose: "IT" the acronym, not the pronoun "it". */
  it: [
    /\b(IT|[Ii]n-[Hh]ouse|[Oo]utsourc\w*|it services)\b/,
    /\b(agenc(?:y|ies)|vendors?|hiring|software|saas|tech stack)\b/i,
  ],
  professional: [
    /\b(professional services?|consult\w*|accountants?|lawyers?|vendors?|hiring|outsourc\w*)\b/i,
    /\b(agenc(?:y|ies)|professionals|reviews?)\b/i,
  ],
  local: [
    /\b(local|small business(?:es)?|reviews?|ratings?|customers?|near me)\b/i,
    /\b(vendors?|hiring|agenc(?:y|ies)|professionals)\b/i,
  ],
  startups: [
    /\b(startups?|founders?|funding|venture)\b/i,
    /\b(saas|software|tools?|tech stack|small business(?:es)?)\b/i,
  ],
  /* /about "Resources, Guides and Insights": trust and reviews first, then
     buyer guides (vetting, choosing, buying). */
  about: [
    /\b(reviews?|verified|ratings?|director(?:y|ies))\b/i,
    /\b(vet|vetting|buy|buying|choose|choosing|hiring|vendors?|agenc(?:y|ies))\b/i,
  ],
} satisfies Record<string, RegExp[]>

export type BlogTopic = keyof typeof TOPIC_TIERS

async function fetchTopicBlogPosts(topic: BlogTopic, limit = 3): Promise<HomeBlogPost[]> {
  try {
    const tiers = TOPIC_TIERS[topic]
    const tierOf = (p: PublishedPost) => {
      const haystack = [p.title, p.category, p.excerpt, ...(p.tags || [])].join(' ')
      const i = tiers.findIndex(re => re.test(haystack))
      return i === -1 ? tiers.length : i
    }
    const posts = await getPublishedPosts()
    return posts
      .map(p => ({ p, tier: tierOf(p) }))
      .sort((a, b) => a.tier - b.tier || postTime(b.p) - postTime(a.p))
      .slice(0, limit)
      .map(({ p }) => toHomeBlogPost(p))
  } catch (err) {
    console.error(`[blog] ${topic} posts fetch failed:`, err instanceof Error ? err.message : err)
    return []
  }
}

export const getTopicBlogPosts = unstable_cache(
  fetchTopicBlogPosts,
  ['topic-blog-v1'],
  { revalidate: 600 }
)
