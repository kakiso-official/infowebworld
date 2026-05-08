import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/listings/[slug]/revalidate
 *
 * Manual on-demand rebuild of a single /company/<slug> page. Bypasses the
 * 48h auto-revalidation window — use this when an admin has just approved
 * a review, an owner edited their listing, or a moderation decision needs
 * to go live now.
 *
 * Verifies the slug exists in `submissions` so a typo can't poison the
 * cache or trigger a 404 rebuild loop. Admin-guarded.
 */
export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const { slug } = await ctx.params
  if (!slug || typeof slug !== 'string' || slug.length > 200) {
    return Response.json({ ok: false, error: 'Invalid slug' }, { status: 400 })
  }

  const row = await queryOne<{ id: number; status: string }>(
    'SELECT id, status FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  if (!row) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    revalidatePath(`/company/${slug}`)
    return Response.json({
      ok: true,
      slug,
      path: `/company/${slug}`,
      listingId: row.id,
      listingStatus: row.status,
    })
  } catch (err) {
    console.error('POST /api/admin/listings/[slug]/revalidate error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
