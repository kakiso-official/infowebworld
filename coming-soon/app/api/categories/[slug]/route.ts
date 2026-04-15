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

    // Get listing types — L3: direct, L2: child L3s, L1: all descendant L3s
    let listingTypes: unknown[] = []
    const level = Number(category.level)
    if (level === 3) {
      listingTypes = await query(
        `SELECT id, name, slug, sort_order FROM listing_types WHERE category_id = ? ORDER BY sort_order`,
        [category.id]
      )
    } else if (level === 2) {
      listingTypes = await query(
        `SELECT lt.id, lt.name, lt.slug, lt.sort_order
         FROM listing_types lt
         JOIN categories c ON c.id = lt.category_id
         WHERE c.parent_id = ? AND c.is_active = 1          ORDER BY lt.sort_order`,
        [category.id]
      )
    } else if (level === 1) {
      listingTypes = await query(
        `SELECT lt.id, lt.name, lt.slug, lt.sort_order
         FROM listing_types lt
         JOIN categories c3 ON c3.id = lt.category_id
         JOIN categories c2 ON c2.id = c3.parent_id
         WHERE c2.parent_id = ? AND c3.is_active = 1          ORDER BY lt.sort_order
         LIMIT 200`,
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

    // Count active listings across this category + all descendants (single query)
    const cid = Number(category.id)
    const countRow = await queryOne(
      `SELECT COUNT(*) as count FROM submissions s
       WHERE s.status IN ('active','paid')
       AND s.category_id IN (
         SELECT id FROM categories WHERE id = ? AND is_active = 1
         UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
         UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
       )`,
      [cid, cid, cid]
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
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/categories/[slug] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
