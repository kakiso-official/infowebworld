import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * PATCH /api/admin/submissions/[id]/category — admin-only category reassignment.
 *
 * Updates ONLY submissions.category_id. The listing's full hierarchy (L1 sector
 * → deepest level) is the ancestry of this one category, derived via parent_id
 * on read — so setting the deepest correct category fixes the whole path.
 *
 * Unlike the full admin PUT, this touches nothing else on the row and PRESERVES
 * status (no forced re-moderation). When a LIVE listing moves category,
 * listing_count is shifted from the old category to the new one so public counts
 * stay accurate — same bookkeeping as the full PUT.
 *
 * `id` may be the numeric pk or the uuid. Body: { categoryId: number }.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id: pathId } = await params
    const isUuid = /^[0-9a-f]{8}-/i.test(pathId)
    const row = await queryOne<{ id: number; status: string; category_id: number | null }>(
      isUuid
        ? 'SELECT id, status, category_id FROM submissions WHERE uuid = ? LIMIT 1'
        : 'SELECT id, status, category_id FROM submissions WHERE id = ? LIMIT 1',
      [pathId]
    )
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json().catch(() => ({}))
    const categoryId = Number(body.categoryId)
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return Response.json({ error: 'A valid categoryId is required' }, { status: 400 })
    }

    /* Validate the target category exists; read its name + slug back for the UI. */
    const cat = await queryOne<{ id: number; name: string; slug: string }>(
      'SELECT id, name, slug FROM categories WHERE id = ? LIMIT 1',
      [categoryId]
    )
    if (!cat) return Response.json({ error: 'Category not found' }, { status: 400 })

    if (categoryId === row.category_id) {
      return Response.json({ ok: true, unchanged: true, categoryId, categoryName: cat.name, categorySlug: cat.slug })
    }

    await execute(
      'UPDATE submissions SET category_id = ?, updated_at = NOW() WHERE id = ?',
      [categoryId, row.id]
    )

    /* Keep category listing_count accurate when a LIVE listing moves. */
    const isLive = row.status === 'active' || row.status === 'paid'
    if (isLive) {
      if (row.category_id) {
        await execute('UPDATE categories SET listing_count = GREATEST(listing_count - 1, 0) WHERE id = ?', [row.category_id])
      }
      await execute('UPDATE categories SET listing_count = listing_count + 1 WHERE id = ?', [categoryId])
    }

    return Response.json({ ok: true, categoryId, categoryName: cat.name, categorySlug: cat.slug })
  } catch (err) {
    console.error('PATCH /api/admin/submissions/[id]/category error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
