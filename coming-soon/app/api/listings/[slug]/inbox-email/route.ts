import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { notifyOwnerOnInboxLead } from '@/lib/notify-owner'
import { getUserFromRequest } from '@/lib/user-auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Anything beyond these is silently coerced to 'send_info' so a typo on the
   client can't smuggle bogus values into reporting. */
const ALLOWED_SOURCES = new Set(['send_info', 'quote_request'])

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

  let body: {
    email?: unknown; name?: unknown; phone?: unknown
    message?: unknown; source?: unknown
  }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !EMAIL_RE.test(email) || email.length > 255) {
    return Response.json({ ok: false, error: 'Valid email required' }, { status: 400 })
  }

  /* Truncate-on-write so a malicious or buggy client can't blow past the
     column widths and cause an INSERT to error out. */
  const name    = typeof body.name === 'string'    ? body.name.trim().slice(0, 120)     : null
  const phone   = typeof body.phone === 'string'   ? body.phone.trim().slice(0, 40)     : null
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : null
  const sourceRaw = typeof body.source === 'string' ? body.source.trim() : 'send_info'
  const source = ALLOWED_SOURCES.has(sourceRaw) ? sourceRaw : 'send_info'

  /* The richer "Get a Quote" form requires a name to be useful to the owner.
     The simple "Send me info" form does not — only an email is required. */
  if (source === 'quote_request' && (!name || name.length < 1)) {
    return Response.json({ ok: false, error: 'Name required' }, { status: 400 })
  }

  /* If the visitor is logged in, link the lead to their account so the owner
     can see who it came from in the dashboard. Anon visitors get user_id=NULL. */
  const user = await getUserFromRequest(request)
  const userId = user?.id ?? null
  const userAgent = (request.headers.get('user-agent') || '').slice(0, 500) || null

  try {
    await execute(
      `INSERT INTO listing_inbox_emails
         (listing_id, email, name, phone, message, source, user_id, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [listingId, email, name, phone, message, source, userId, userAgent, ip]
    )
    /* Every lead is high-signal — always notify the owner. The notify helper
       handles owner email lookup, source-aware subject lines, and never throws. */
    await notifyOwnerOnInboxLead({
      listingId, leadEmail: email,
      leadName: name, leadPhone: phone, leadMessage: message, source,
    })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[slug]/inbox-email error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
