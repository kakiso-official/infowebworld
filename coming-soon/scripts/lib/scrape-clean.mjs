/**
 * HTML cleanup utilities — strip junk before sending to Gemini.
 *
 * Token cost is the binding constraint for the scraper budget. A typical
 * SaaS landing page is 80-200KB of HTML but maybe 5-15KB of real content.
 * Stripping scripts / styles / SVGs / comments / hidden elements cuts
 * 60-80% of bytes before the LLM ever sees the page, which keeps per-pass
 * cost in the cents range instead of dimes.
 */

const MAX_HTML_LEN = 60_000

/**
 * Aggressively cleans HTML for LLM ingestion.
 * Removes scripts, styles, SVGs, comments, inline data URLs, repeated
 * whitespace, and hard-caps to MAX_HTML_LEN. Preserves text content,
 * headings, links, tables — the stuff that matters for extraction.
 */
export function cleanHtml(rawHtml, maxLen = MAX_HTML_LEN) {
  if (!rawHtml) return ''
  let h = String(rawHtml)

  /* Preserve structured-data scripts before stripping the rest. Modern
     React apps (Next.js, Nuxt, Astro) ship serialized props inside
     <script type="application/json"> and most SaaS landing pages embed
     org/product info in <script type="application/ld+json">. Both are
     gold for the extractor and would otherwise get nuked by the general
     <script> strip below. We pull them out, then weave them back in as
     plain JSON islands the LLM can read. */
  const jsonIslands = []
  h = h.replace(
    /<script\b[^>]*\btype\s*=\s*["'](application\/(?:ld\+json|json))["'][^>]*>([\s\S]*?)<\/script>/gi,
    (_, mime, body) => {
      const trimmed = String(body).trim()
      if (trimmed && trimmed.length < 20_000) {
        jsonIslands.push(`<!-- ${mime} -->\n${trimmed}`)
      }
      return ''
    }
  )

  // Strip noise tags
  h = h.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  h = h.replace(/<style\b[\s\S]*?<\/style>/gi, '')
  h = h.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
  h = h.replace(/<svg\b[\s\S]*?<\/svg>/gi, '<svg/>')
  h = h.replace(/<!--[\s\S]*?-->/g, '')

  // Strip inline event handlers and data URLs (they're huge for embedded fonts/images)
  h = h.replace(/\s+on\w+="[^"]*"/gi, '')
  h = h.replace(/\s+on\w+='[^']*'/gi, '')
  h = h.replace(/\s+(?:src|href|srcset|style)\s*=\s*"data:[^"]*"/gi, '')
  h = h.replace(/\s+(?:src|href|srcset|style)\s*=\s*'data:[^']*'/gi, '')

  // Strip Tailwind class spam
  h = h.replace(/\s+class="[^"]{120,}"/gi, ' class=""')
  h = h.replace(/\s+class='[^']{120,}'/gi, " class=''")

  // Strip aria-* / data-* attributes (chatty, low signal)
  h = h.replace(/\s+(?:aria|data)-[\w-]+="[^"]*"/gi, '')
  h = h.replace(/\s+(?:aria|data)-[\w-]+='[^']*'/gi, '')

  // Collapse repeated whitespace
  h = h.replace(/\s{2,}/g, ' ')
  h = h.replace(/>\s+</g, '><')

  /* Append preserved JSON-LD / application/json blobs after the cleaned
     markup. They count against the budget but the LLM extracts
     drastically better data from them than from class-spammed divs. */
  if (jsonIslands.length) {
    h = `${h.trim()}\n\n${jsonIslands.join('\n\n')}`
  }

  // Truncate if still huge (rare after cleanup, but a safety net)
  if (h.length > maxLen) h = h.slice(0, maxLen) + '\n<!-- truncated for token budget -->'

  return h.trim()
}

/**
 * Slug-ify a company name into a URL-safe slug.
 * Falls back to a random suffix if everything strips.
 */
export function slugifyName(name) {
  const s = String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
  if (s) return s
  return 'co-' + Math.random().toString(36).slice(2, 8)
}

/**
 * Canonicalise a URL for dedup: drop protocol, www, trailing slash, query,
 * fragment. So `https://www.notion.so/` and `http://notion.so` both
 * resolve to the same string for uniqueness checks.
 */
export function canonicalUrl(url) {
  try {
    const u = new URL(String(url).trim())
    let host = u.hostname.toLowerCase().replace(/^www\./, '')
    let path = u.pathname.replace(/\/+$/, '')
    return `${host}${path}`
  } catch {
    return String(url || '').toLowerCase().trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '')
  }
}
