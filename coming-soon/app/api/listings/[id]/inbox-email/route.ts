import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* POST: capture an email subscriber for the "Send info to my inbox" form. */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const ip = await getClientIp()
  const limited = await checkRateLimit(ip, 'inbox-email', 5, 600)
  if (!limited) {
    return Response.json({ ok: false, error: 'Too many requests.' }, { status: 429 })
  }

  const { id } = await ctx.params
  const listingId = Number(id)
  if (!Number.isFinite(listingId) || listingId <= 0) {
    return Response.json({ ok: false, error: 'Invalid listing id' }, { status: 400 })
  }

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
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[id]/inbox-email error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
