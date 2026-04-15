import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'

interface BreadcrumbItem {
  name: string
  slug: string
}

async function buildBreadcrumb(categoryId: number | null): Promise<BreadcrumbItem[]> {
  const crumbs: BreadcrumbItem[] = []
  let currentId = categoryId

  while (currentId) {
    const cat = await queryOne(
      'SELECT id, name, slug, parent_id FROM categories WHERE id = ?',
      [currentId]
    ) as { id: number; name: string; slug: string; parent_id: number | null } | null

    if (!cat) break
    crumbs.unshift({ name: cat.name, slug: cat.slug })
    currentId = cat.parent_id
  }

  return crumbs
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const listing = await queryOne(
      `SELECT s.*, p.name as plan_name, p.slug as plan_slug,
              c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
              co.name as country_name
       FROM submissions s
       LEFT JOIN plans p ON p.id = s.plan_id
       LEFT JOIN categories c ON c.id = s.category_id
       LEFT JOIN countries co ON co.id = s.country_id
       WHERE s.slug = ? AND s.status IN ('active','paid')
       LIMIT 1`,
      [slug]
    )

    if (!listing) {
      return Response.json({ error: 'Listing not found' }, { status: 404 })
    }

    const catId = listing.category_id as number | null
    const listingId = listing.id as number

    // Build breadcrumb from category chain
    const breadcrumb = await buildBreadcrumb(catId)

    // Get related listings from the same category
    const related = await query(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
              c.name as category_name, c.color as category_color
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.category_id = ? AND s.id != ? AND s.status IN ('active','paid')
       ORDER BY s.created_at DESC LIMIT 4`,
      [catId, listingId]
    )

    return Response.json(
      { listing, breadcrumb, related },
      { headers: { 'Cache-Control': 'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/listings/[slug] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
