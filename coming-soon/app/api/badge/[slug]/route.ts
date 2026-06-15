import { queryOne } from '@/lib/db'

/* Dynamic "Verified on InfoWebWorld" badge, served as SVG so businesses can
   embed it on their own site. Every render is a hit on our domain (an
   impression) and the <a> wrapping it (built in the dashboard snippet) is the
   backlink we earn. Cached at the edge — the rating refreshes hourly. */

interface BadgeRow {
  company_name: string
  status: string
  avg_rating: number | null
  review_count: number
}

function esc(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string),
  )
}

function renderSvg(name: string, rating: number, reviews: number, variant: string): string {
  const dark = variant === 'dark'
  const bg = dark ? '#1A1A1A' : '#FFFFFF'
  const border = dark ? '#333333' : '#E5E2DD'
  const fg = dark ? '#FFFFFF' : '#1A1A1A'
  const sub = dark ? '#B8B8B8' : '#6B6B6B'
  const accent = '#E8553D'
  const line3 = reviews > 0 ? `★ ${rating.toFixed(1)} · ${reviews} review${reviews === 1 ? '' : 's'}` : 'Verified Listing'
  const safe = esc(name.length > 22 ? name.slice(0, 21) + '…' : name)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64" role="img" aria-label="${safe} — Verified on InfoWebWorld">
  <rect x="0.5" y="0.5" width="219" height="63" rx="10" fill="${bg}" stroke="${border}"/>
  <circle cx="34" cy="32" r="16" fill="${accent}"/>
  <path d="M27 32.5l4 4 8-8.5" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="60" y="25" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="700" letter-spacing="0.8" fill="${sub}">VERIFIED ON</text>
  <text x="60" y="41" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" fill="${fg}">InfoWebWorld</text>
  <text x="60" y="55" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="${accent}">${esc(line3)}</text>
</svg>`
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: raw } = await params
  const slug = raw.replace(/\.svg$/i, '')
  const variant = new URL(req.url).searchParams.get('variant') || 'light'

  let row: BadgeRow | null = null
  try {
    row = await queryOne<BadgeRow>(
      `SELECT s.company_name, s.status,
              (SELECT AVG(rating) FROM reviews r WHERE r.listing_id = s.id AND r.status='approved') AS avg_rating,
              (SELECT COUNT(*)    FROM reviews r WHERE r.listing_id = s.id AND r.status='approved') AS review_count
         FROM submissions s
        WHERE s.slug = ? AND s.status IN ('active','paid')
        LIMIT 1`,
      [slug],
    )
  } catch {
    /* reviews/table edge — fall through to a generic badge */
  }

  const name = row?.company_name || 'This business'
  const rating = row?.avg_rating ? Number(row.avg_rating) : 0
  const reviews = Number(row?.review_count || 0)
  const svg = renderSvg(name, rating, reviews, variant)

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
