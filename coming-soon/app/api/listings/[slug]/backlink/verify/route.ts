import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getBacklinkBySlug, runBacklinkCheck } from '@/lib/backlink'

export const dynamic = 'force-dynamic'

/* GET  -> current backlink status for the owner's listing.
   POST -> crawl the listing's website for our badge link and persist the
           result. Owner-only; lightly rate-limited so the crawl can't be
           hammered. */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireUser(req)
  if (auth instanceof Response) return auth

  const { slug } = await params
  const row = await getBacklinkBySlug(slug)
  if (!row) return Response.json({ error: 'not_found' }, { status: 404 })
  if (row.user_id !== auth.id) return Response.json({ error: 'forbidden' }, { status: 403 })

  return Response.json({
    status: row.backlink_status,
    url: row.backlink_url,
    verifiedAt: row.backlink_verified_at,
    checkedAt: row.backlink_checked_at,
    website: row.website,
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireUser(req)
  if (auth instanceof Response) return auth

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (!(await checkRateLimit(ip, 'backlink-verify', 12, 600))) {
    return Response.json({ error: 'rate_limited', message: 'Too many checks — try again in a few minutes.' }, { status: 429 })
  }

  const { slug } = await params
  const row = await getBacklinkBySlug(slug)
  if (!row) return Response.json({ error: 'not_found' }, { status: 404 })
  if (row.user_id !== auth.id) return Response.json({ error: 'forbidden' }, { status: 403 })
  if (!row.website) {
    return Response.json(
      { error: 'no_website', message: 'Add your website URL to this listing first — we verify by checking your homepage.' },
      { status: 400 },
    )
  }

  const updated = await runBacklinkCheck(row, 'crawl')
  return Response.json({
    status: updated.backlink_status,
    url: updated.backlink_url,
    found: updated.backlink_status === 'verified',
  })
}
