/* ─────────────────────────────────────────────────────────────
   Free RSS-based news fetcher for /news.

   Zero API keys, zero paid tiers — pulls directly from the public
   RSS feeds of major international English-language publishers
   (BBC, The Guardian, Al Jazeera, NPR, Deutsche Welle, TechCrunch,
   The Verge, Variety, ESPN, etc.). RSS is XML; we parse with regex
   (avoids adding a dependency).

   Each feed is fetched server-side with Next's revalidate-1h cache,
   so a single render uses one network call per feed and is reused
   across all visitors for an hour.
   ───────────────────────────────────────────────────────────── */

export type NewsArticle = {
  title: string
  description: string | null
  url: string
  image: string | null
  publishedAt: string
  source: { name: string; url: string | null }
}

export type NewsCategory =
  | 'general' | 'world' | 'business' | 'technology'
  | 'entertainment' | 'sports' | 'science' | 'health'

const CACHE_TTL = 60 * 60 // 1 hour

/* ── Public RSS feed map ─────────────────────────────────── */

type Feed = { url: string; source: string; sourceUrl?: string }

const FEEDS: Record<NewsCategory, Feed[]> = {
  general: [
    { url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC News', sourceUrl: 'https://www.bbc.com/news' },
    { url: 'https://www.theguardian.com/international/rss', source: 'The Guardian', sourceUrl: 'https://www.theguardian.com/international' },
    { url: 'https://feeds.npr.org/1001/rss.xml', source: 'NPR', sourceUrl: 'https://www.npr.org' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', sourceUrl: 'https://www.aljazeera.com' },
  ],
  business: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business', sourceUrl: 'https://www.bbc.com/news/business' },
    { url: 'https://www.theguardian.com/uk/business/rss', source: 'The Guardian', sourceUrl: 'https://www.theguardian.com/business' },
    { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', source: 'CNBC', sourceUrl: 'https://www.cnbc.com' },
  ],
  technology: [
    { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC Tech', sourceUrl: 'https://www.bbc.com/news/technology' },
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', sourceUrl: 'https://techcrunch.com' },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', sourceUrl: 'https://www.theverge.com' },
    { url: 'https://www.wired.com/feed/rss', source: 'Wired', sourceUrl: 'https://www.wired.com' },
  ],
  entertainment: [
    { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source: 'BBC Arts', sourceUrl: 'https://www.bbc.com/news/entertainment_and_arts' },
    { url: 'https://variety.com/feed/', source: 'Variety', sourceUrl: 'https://variety.com' },
    { url: 'https://www.hollywoodreporter.com/feed/', source: 'The Hollywood Reporter', sourceUrl: 'https://www.hollywoodreporter.com' },
  ],
  sports: [
    { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', sourceUrl: 'https://www.bbc.com/sport' },
    { url: 'https://www.espn.com/espn/rss/news', source: 'ESPN', sourceUrl: 'https://www.espn.com' },
    { url: 'https://www.theguardian.com/uk/sport/rss', source: 'The Guardian Sport', sourceUrl: 'https://www.theguardian.com/sport' },
  ],
  world: [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News', sourceUrl: 'https://www.bbc.com/news/world' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian', sourceUrl: 'https://www.theguardian.com/world' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', sourceUrl: 'https://www.aljazeera.com' },
    { url: 'https://rss.dw.com/rdf/rss-en-all', source: 'Deutsche Welle', sourceUrl: 'https://www.dw.com/en' },
  ],
  science: [
    { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', source: 'BBC Science', sourceUrl: 'https://www.bbc.com/news/science_and_environment' },
    { url: 'https://www.theguardian.com/science/rss', source: 'The Guardian', sourceUrl: 'https://www.theguardian.com/science' },
  ],
  health: [
    { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', source: 'BBC Health', sourceUrl: 'https://www.bbc.com/news/health' },
    { url: 'https://www.theguardian.com/society/health/rss', source: 'The Guardian', sourceUrl: 'https://www.theguardian.com/society/health' },
  ],
}

/* ── RSS XML parsing (regex-based, no dependency) ───────── */

function unescapeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function extractTag(itemXml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`)
  const m = itemXml.match(re)
  return m ? unescapeXml(m[1]).trim() : ''
}

function extractImageUrl(itemXml: string, description: string): string | null {
  // Try every common RSS image pattern. Order matters: media:content
  // > enclosure > content:encoded inline img > description inline img
  // > itunes:image > image>url. Each regex accepts both " and '.

  // 1. <media:content url="..."> | <media:thumbnail url="..."> | <media:group>
  const m1 = itemXml.match(/<media:(?:content|thumbnail|group)[\s\S]*?url=["']([^"']+)["']/i)
  if (m1) return m1[1]

  // 2. <enclosure ... url="..."> — accept any order of attributes
  const m2 = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/i)
  if (m2) return m2[1]

  // 3. <content:encoded> CDATA — many feeds bundle full HTML w/ images here
  const contentEnc = itemXml.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)
  if (contentEnc) {
    const inContent = contentEnc[1].match(/<img[^>]+src=["']([^"']+)["']/i)
    if (inContent) return inContent[1]
  }

  // 4. <description>'s inline <img>
  const m4 = description.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (m4) return m4[1]

  // 5. <itunes:image href="..."> | <content:image>
  const m5 = itemXml.match(/<(?:itunes:image|content:image)[^>]*(?:href|url)=["']([^"']+)["']/i)
  if (m5) return m5[1]

  // 6. <image><url>...</url></image>
  const m6 = itemXml.match(/<image>[\s\S]*?<url>([\s\S]*?)<\/url>/i)
  if (m6) return unescapeXml(m6[1]).trim()

  return null
}

function parseRss(xml: string, source: string, sourceUrl?: string): NewsArticle[] {
  const items: NewsArticle[] = []
  const itemRe = /<item[\s\S]*?<\/item>/g
  const matches = xml.match(itemRe) || []

  for (const item of matches) {
    const rawTitle = extractTag(item, 'title')
    const rawLink  = extractTag(item, 'link')
    const rawDesc  = extractTag(item, 'description')
    const rawDate  = extractTag(item, 'pubDate') || extractTag(item, 'dc:date')

    if (!rawTitle || !rawLink) continue

    const image = extractImageUrl(item, rawDesc)
    const cleanDesc = rawDesc ? stripHtml(unescapeXml(rawDesc)) : ''

    let publishedAt: string
    try {
      publishedAt = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString()
    } catch { publishedAt = new Date().toISOString() }

    items.push({
      title: rawTitle,
      description: cleanDesc.length > 0 ? cleanDesc.slice(0, 280) : null,
      url: rawLink,
      image,
      publishedAt,
      source: { name: source, url: sourceUrl || null },
    })
  }

  return items
}

/* ── Fetch one feed (cached) ─────────────────────────────── */

async function fetchOneFeed(feed: Feed): Promise<NewsArticle[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: CACHE_TTL },
      headers: {
        // Some RSS hosts 403 generic Node UA. Pose as a normal aggregator.
        'User-Agent': 'Mozilla/5.0 InfoWebWorld News Aggregator',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseRss(xml, feed.source, feed.sourceUrl)
  } catch {
    return []
  }
}

/** Fetch all feeds for a category in parallel, interleave the results
    so multiple publishers show up rather than one dominating, and cap
    at `max`. */
export async function fetchNews(
  category: NewsCategory,
  max: number = 10
): Promise<NewsArticle[]> {
  const feeds = FEEDS[category] || []
  if (feeds.length === 0) return []

  const sets = await Promise.all(feeds.map(fetchOneFeed))

  // Interleave round-robin so the first slot from each publisher shows
  // before the second slot from any single publisher.
  const out: NewsArticle[] = []
  const seenUrls = new Set<string>()
  const maxLen = Math.max(...sets.map(s => s.length), 0)
  for (let i = 0; i < maxLen && out.length < max; i++) {
    for (const set of sets) {
      if (i < set.length && out.length < max) {
        const a = set[i]
        if (!seenUrls.has(a.url)) {
          seenUrls.add(a.url)
          out.push(a)
        }
      }
    }
  }
  return out
}

/** Append InfoWebWorld UTM params to outbound article URLs so the
    publisher's analytics attribute the traffic back to us (and we
    quietly build referrer brand recognition over time). Preserves any
    existing query params and never clobbers UTMs the original URL
    already sets. */
export function withNewsUtm(url: string): string {
  try {
    const u = new URL(url)
    if (!u.searchParams.has('utm_source'))   u.searchParams.set('utm_source', 'infowebworld.com')
    if (!u.searchParams.has('utm_medium'))   u.searchParams.set('utm_medium', 'news_aggregator')
    if (!u.searchParams.has('utm_campaign')) u.searchParams.set('utm_campaign', 'infowebworld_news')
    return u.toString()
  } catch {
    return url
  }
}

/** Relative timestamp ("2h ago", "yesterday", "Apr 12"). Server-safe. */
export function relativeNewsTime(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const min = Math.floor(diffMs / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day === 1) return 'yesterday'
  if (day < 7) return `${day}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
