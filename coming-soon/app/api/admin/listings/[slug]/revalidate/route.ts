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

  /* Resolve the row's listing_mode so we revalidate the right path. */
  let row: { id: number; status: string; listing_mode: string } | null = null
  try {
    row = await queryOne<{ id: number; status: string; listing_mode: string }>(
      `SELECT id, status, COALESCE(listing_mode, 'product') AS listing_mode
         FROM submissions WHERE slug = ? LIMIT 1`,
      [slug]
    )
  } catch (err) {
    /* Pre-migration fallback — no listing_mode column yet. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*listing_mode/.test(msg)) {
      const legacy = await queryOne<{ id: number; status: string }>(
        'SELECT id, status FROM submissions WHERE slug = ? LIMIT 1',
        [slug]
      )
      row = legacy ? { ...legacy, listing_mode: 'product' } : null
    } else {
      throw err
    }
  }
  if (!row) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  const path = row.listing_mode === 'company' ? `/profile/${slug}` : `/company/${slug}`

  try {
    revalidatePath(path)
    return Response.json({
      ok: true,
      slug,
      path,
      listingId: row.id,
      listingStatus: row.status,
      listingMode: row.listing_mode,
    })
  } catch (err) {
    console.error('POST /api/admin/listings/[slug]/revalidate error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
