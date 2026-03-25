import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'

async function getDescendantCategoryIds(categoryId: number): Promise<number[]> {
  const ids: number[] = [categoryId]
  const queue: number[] = [categoryId]

  while (queue.length > 0) {
    const parentId = queue.shift()!
    const children = await query(
      'SELECT id FROM categories WHERE parent_id = ? AND is_active = 1',
      [parentId]
    ) as Array<{ id: number }>

    for (const child of children) {
      ids.push(child.id)
      queue.push(child.id)
    }
  }

  return ids
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

    // Walk the category tree to include descendants
    const categoryIds = await getDescendantCategoryIds(categoryId)
    const placeholders = categoryIds.map(() => '?').join(',')

    // Get total count
    const countRow = await queryOne(
      `SELECT COUNT(*) as count FROM submissions WHERE category_id IN (${placeholders}) AND status IN ('active','paid')`,
      categoryIds
    )
    const total = Number(countRow?.count ?? 0)

    // Get paginated listings
    const listings = await query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.category_id IN (${placeholders}) AND s.status IN ('active','paid')
       ORDER BY s.is_featured DESC, s.approved_at DESC
       LIMIT ? OFFSET ?`,
      [...categoryIds, perPage, offset]
    )

    return Response.json({
      ok: true,
      data: listings,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (err) {
    console.error('GET /api/categories/[slug]/listings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
