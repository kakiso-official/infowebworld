import { ImageResponse } from 'next/og'
import { query } from '@/lib/db'

// Node runtime required: lib/db uses mysql2 (Node-only). Edge runtime
// breaks the build at "collect page data". CDN cache (s-maxage=86400)
// makes Edge perf irrelevant here.

/* Dynamic Open Graph image route — renders a 1200×630 social card per
   category. URL: /api/og/{sectorSlug}/{categorySlug} or /api/og/{sectorSlug}.
   Image shows: sector name + category name + listing count + InfoWebWorld
   brand mark on a sector-colored gradient.

   Used by generateMetadata's openGraph.images + twitter.images. Replaces
   the static /og-image.png fallback so every category gets its own card
   in social shares and Google Discover. */

const SECTOR_PALETTES: Record<string, { bg1: string; bg2: string; accent: string; name: string }> = {
  'ai-ml':                  { bg1: '#E8E4F8', bg2: '#7C6DD4', accent: '#5B4DBE', name: 'AI & ML' },
  'software-saas':          { bg1: '#DDF0FB', bg2: '#3F8FD4', accent: '#2B6FB5', name: 'Software & SaaS' },
  'it-services-agencies':   { bg1: '#D8F5EE', bg2: '#1D9E75', accent: '#156B50', name: 'IT Services & Agencies' },
  'startups-innovation':    { bg1: '#FAEEE3', bg2: '#D96236', accent: '#B14820', name: 'Startups & Innovation' },
  'local-businesses':       { bg1: '#EEF7DE', bg2: '#659A22', accent: '#487014', name: 'Local Businesses' },
  'professional-services':  { bg1: '#FAEEF4', bg2: '#C85580', accent: '#A93D63', name: 'Professional Services' },
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const segments = slug || []
  const sectorSlug = segments[0] || 'ai-ml'
  const categorySlug = segments[1] || ''
  const palette = SECTOR_PALETTES[sectorSlug] || SECTOR_PALETTES['ai-ml']

  /* Resolve category name + listing count from DB. Falls back to sector-only
     card if no category was requested. */
  let categoryName = ''
  let listingCount = 0
  if (categorySlug) {
    try {
      const row = await query<{ name: string; tree_count: number }>(
        `SELECT c.name,
                (SELECT COUNT(*) FROM submissions s
                  LEFT JOIN categories sc    ON sc.id    = s.category_id
                  LEFT JOIN categories scp   ON scp.id   = sc.parent_id
                  LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
                  LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
                  LEFT JOIN categories scgggp ON scgggp.id = scggp.parent_id
                 WHERE s.status IN ('active','paid')
                   AND (sc.id = c.id OR scp.id = c.id OR scgp.id = c.id OR scggp.id = c.id OR scgggp.id = c.id)
                ) AS tree_count
           FROM categories c
          WHERE c.slug = ? AND c.is_active = 1
          LIMIT 1`,
        [categorySlug]
      )
      if (row.length > 0) {
        categoryName = String(row[0].name || '')
        listingCount = Number(row[0].tree_count || 0)
      }
    } catch { /* fall back to sector-only */ }
  }

  const title = categoryName ? `Top ${categoryName}` : `Top ${palette.name}`
  const subtitle = categoryName
    ? `${listingCount > 0 ? `${listingCount}+ verified ` : ''}${palette.name} companies`
    : 'Verified businesses, tools & services'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${palette.bg1} 0%, #FFFFFF 60%, ${palette.bg1} 100%)`,
          padding: '72px 80px',
          fontFamily: '"Inter", system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Watermark accent circle, bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-180px',
            right: '-180px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: palette.bg2,
            opacity: 0.18,
          }}
        />
        {/* Sector eyebrow chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 18px',
            background: palette.bg2,
            color: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            alignSelf: 'flex-start',
            marginBottom: '32px',
          }}
        >
          {palette.name.toUpperCase()}
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '88px',
            fontWeight: 800,
            color: '#0A1B33',
            letterSpacing: '-0.028em',
            lineHeight: 1.05,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '34px',
            color: '#475569',
            fontWeight: 400,
            lineHeight: 1.3,
            maxWidth: '900px',
          }}
        >
          {subtitle}
        </div>

        {/* Footer bar — brand mark + InfoWebWorld */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '40px',
          }}
        >
          {/* Brand mark — 4-quadrant window glyph in brand colors */}
          <svg width="56" height="56" viewBox="0 0 250 250">
            <polygon fill="#FEB801" points="117.62 76.04 76.04 76.04 76.04 125 49.89 125 49.89 49.89 117.62 49.89 117.62 76.04" />
            <polygon fill="#F25022" points="173.96 117.62 173.96 76.04 132.38 76.04 132.38 49.89 200.11 49.89 200.11 117.62 173.96 117.62" />
            <polygon fill="#01A4EF" points="76.04 125 76.04 173.96 125 173.96 125 200.11 49.89 200.11 49.89 125 76.04 125" />
            <polygon fill="#7FBA00" points="125 173.96 173.96 173.96 173.96 132.38 200.11 132.38 200.11 200.11 125 200.11 125 173.96" />
          </svg>
          <div
            style={{
              marginLeft: '20px',
              fontSize: '34px',
              fontWeight: 700,
              color: '#0A1B33',
              letterSpacing: '-0.012em',
            }}
          >
            InfoWebWorld
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '22px',
              color: '#64748B',
              fontWeight: 500,
            }}
          >
            infowebworld.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    }
  )
}
