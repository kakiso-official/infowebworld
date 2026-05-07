import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { notifyOwnerOnInboxLead } from '@/lib/notify-owner'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function resolveListingId(slug: string): Promise<number | null> {
  const row = await queryOne<{ id: number }>(
    'SELECT id FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  return row ? Number(row.id) : null
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const ip = await getClientIp()
  const limited = await checkRateLimit(ip, 'inbox-email', 5, 600)
  if (!limited) {
    return Response.json({ ok: false, error: 'Too many requests.' }, { status: 429 })
  }

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  let body: { email?: unknown }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !EMAIL_RE.test(email) || email.length > 255) {
    return Response.json({ ok: false, error: 'Valid email required' }, { status: 400 })
  }

  try {
    await execute(
      'INSERT INTO listing_inbox_emails (listing_id, email, ip_address) VALUES (?, ?, ?)',
      [listingId, email, ip]
    )
    /* Every inbox lead is high-signal — always notify the owner so they can
       reach out. Anonymous submitter, so there is no self-action concern. */
    await notifyOwnerOnInboxLead({ listingId, leadEmail: email })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[slug]/inbox-email error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
