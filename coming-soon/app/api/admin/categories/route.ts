import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const categories = await query(
      `SELECT c.*, p.name as parent_name,
              COALESCE(lc.cnt, 0) as listing_count
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       LEFT JOIN (
           SELECT category_id, COUNT(*) as cnt
           FROM submissions
           WHERE status IN ('active','paid','confirmed','pending')
           GROUP BY category_id
       ) lc ON lc.category_id = c.id
       ORDER BY c.level, c.sort_order`
    )

    return Response.json({ ok: true, categories })
  } catch (err) {
    console.error('Admin categories GET error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const {
      id,
      name,
      slug,
      icon,
      color,
      description,
      cover_image,
      parent_id,
      level,
      sort_order,
      is_active,
      is_launched,
      is_featured,
      is_navigation,
      seo_title,
      seo_description,
      seo_keywords,
      seo_og_image,
      seo_canonical,
      seo_no_index,
    } = body

    const seoKeywordsJson = seo_keywords ? JSON.stringify(seo_keywords) : null
    const isActive = is_active ? 1 : 0
    const isLaunched = is_launched ? 1 : 0
    const isFeatured = is_featured ? 1 : 0
    const isNavigation = is_navigation !== undefined ? (is_navigation ? 1 : 0) : 1
    const isNoIndex = seo_no_index ? 1 : 0

    if (id) {
      // Update existing category
      await execute(
        `UPDATE categories SET
           name = ?, slug = ?, icon = ?, color = ?, description = ?,
           cover_image = ?, parent_id = ?, level = ?, sort_order = ?,
           is_active = ?, is_launched = ?, is_featured = ?, is_navigation = ?,
           seo_title = ?, seo_description = ?, seo_keywords = ?,
           seo_og_image = ?, seo_canonical = ?, seo_no_index = ?,
           updated_at = NOW()
         WHERE id = ?`,
        [
          name, slug, icon, color, description,
          cover_image, parent_id || null, level, sort_order,
          isActive, isLaunched, isFeatured, isNavigation,
          seo_title, seo_description, seoKeywordsJson,
          seo_og_image, seo_canonical, isNoIndex,
          id,
        ]
      )

      return Response.json({ ok: true, id })
    } else {
      // Create new category
      const result = await execute(
        `INSERT INTO categories (
           name, slug, icon, color, description,
           cover_image, parent_id, level, sort_order,
           is_active, is_launched, is_featured, is_navigation,
           seo_title, seo_description, seo_keywords,
           seo_og_image, seo_canonical, seo_no_index,
           created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          name, slug, icon, color, description,
          cover_image, parent_id || null, level, sort_order,
          isActive, isLaunched, isFeatured, isNavigation,
          seo_title, seo_description, seoKeywordsJson,
          seo_og_image, seo_canonical, isNoIndex,
        ]
      )

      return Response.json({ ok: true, id: (result as any).insertId })
    }
  } catch (err) {
    console.error('Admin categories POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
