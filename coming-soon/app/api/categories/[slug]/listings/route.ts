import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'

async function getDescendantCategoryIds(categoryId: number): Promise<number[]> {
  // Single query: get self + all children up to 3 levels deep (L1→L2→L3)
  const rows = await query(
    `SELECT id FROM categories WHERE id = ? AND is_active = 1
     UNION
     SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
     UNION
     SELECT c3.id FROM categories c3
       JOIN categories c2 ON c2.id = c3.parent_id
       WHERE c2.parent_id = ? AND c3.is_active = 1`,
    [categoryId, categoryId, categoryId]
  ) as Array<{ id: number }>
  return rows.map(r => r.id)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: categoryIdParam } = await params
    const categoryId = parseInt(categoryIdParam, 10)

    if (isNaN(categoryId)) {
      return Response.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = 20
    const offset = (page - 1) * perPage

    // Optional filters
    const tagSlugs = request.nextUrl.searchParams.get('tags')?.split(',').filter(Boolean) || []
    const listingTypeSlug = request.nextUrl.searchParams.get('listing_type') || ''

    // Walk the category tree to include descendants
    const categoryIds = await getDescendantCategoryIds(categoryId)
    const catPlaceholders = categoryIds.map(() => '?').join(',')

    // Build dynamic WHERE + JOINs
    let joins = ''
    let where = `s.category_id IN (${catPlaceholders}) AND s.status IN ('active','paid')`
    const queryParams: (string | number)[] = [...categoryIds]

    // Filter by listing type
    if (listingTypeSlug) {
      where += ' AND lt.slug = ?'
      joins += ' LEFT JOIN listing_types lt ON lt.id = s.listing_type_id'
      queryParams.push(listingTypeSlug)
    }

    // Filter by tags (must match ALL provided tags)
    if (tagSlugs.length > 0) {
      joins += ' INNER JOIN submission_tags st ON st.submission_id = s.id INNER JOIN tags t ON t.id = st.tag_id'
      const tagPlaceholders = tagSlugs.map(() => '?').join(',')
      where += ` AND t.slug IN (${tagPlaceholders})`
      queryParams.push(...tagSlugs)
    }

    // Get total count
    let countSql = `SELECT COUNT(DISTINCT s.id) as count FROM submissions s${joins} WHERE ${where}`
    const countRow = await queryOne(countSql, queryParams)
    const total = Number(countRow?.count ?? 0)

    // Get paginated listings
    const listingSql = `
      SELECT DISTINCT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
             ltype.name as listing_type_name, ltype.slug as listing_type_slug, p.slug as plan_slug
      FROM submissions s
      LEFT JOIN categories c ON c.id = s.category_id
      LEFT JOIN listing_types ltype ON ltype.id = s.listing_type_id
      LEFT JOIN plans p ON p.id = s.plan_id
      ${joins.includes('submission_tags') ? 'INNER JOIN submission_tags st2 ON st2.submission_id = s.id INNER JOIN tags t2 ON t2.id = st2.tag_id' : ''}
      WHERE s.category_id IN (${catPlaceholders}) AND s.status IN ('active','paid')
      ${listingTypeSlug ? 'AND ltype.slug = ?' : ''}
      ${tagSlugs.length > 0 ? `AND t2.slug IN (${tagSlugs.map(() => '?').join(',')})` : ''}
      ORDER BY s.approved_at DESC, s.created_at DESC
      LIMIT ? OFFSET ?`

    const listingParams: (string | number)[] = [...categoryIds]
    if (listingTypeSlug) listingParams.push(listingTypeSlug)
    if (tagSlugs.length > 0) listingParams.push(...tagSlugs)
    listingParams.push(perPage, offset)

    const listings = await query(listingSql, listingParams)

    return Response.json(
      {
        ok: true,
        data: listings,
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      },
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/categories/[slug]/listings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
