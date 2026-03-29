import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get category by slug
    const category = await queryOne(
      `SELECT c.*, p.name as parent_name, p.slug as parent_slug
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       WHERE c.slug = ?
       LIMIT 1`,
      [slug]
    )

    if (!category) {
      return Response.json({ error: 'Category not found' }, { status: 404 })
    }

    // Get subcategories (only navigable ones)
    const subcategories = await query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM submissions s WHERE s.category_id = c.id AND s.status IN ('active','paid')) as listing_count
       FROM categories c
       WHERE c.parent_id = ? AND c.is_active = 1 AND c.is_navigation = 1
       ORDER BY c.sort_order`,
      [category.id]
    )

    // Get listing types if this is an L3 category
    let listingTypes: unknown[] = []
    if (Number(category.level) === 3) {
      listingTypes = await query(
        `SELECT id, name, slug, sort_order FROM listing_types WHERE category_id = ? AND is_active = 1 ORDER BY sort_order`,
        [category.id]
      )
    }

    // Get parent if exists
    let parent = null
    if (category.parent_id) {
      parent = await queryOne(
        'SELECT id, name, slug, icon, color FROM categories WHERE id = ?',
        [category.parent_id]
      )
    }

    // Count active listings
    const countRow = await queryOne(
      "SELECT COUNT(*) as count FROM submissions WHERE category_id = ? AND status IN ('active','paid')",
      [category.id]
    )

    return Response.json(
      {
        ok: true,
        data: {
          ...category,
          subcategories,
          listingTypes,
          parent,
          activeListings: countRow?.count ?? 0,
        },
      },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    )
  } catch (err) {
    console.error('GET /api/categories/[slug] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
