import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/email-campaigns
 * → send history + live recipient counts per audience (for the compose UI).
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  /* Audience counts come from business_users + waitlist (always present). Each
     lives in its own try so neither a count error nor the not-yet-created
     email_campaigns table below can ever blank out the recipient numbers. */
  const audienceCounts = { all_users: 0, verified_users: 0, waitlist: 0 }
  try {
    const u = await queryOne<{ all_users: number; verified_users: number }>(
      `SELECT COUNT(*) AS all_users,
              COALESCE(SUM(COALESCE(email_verified, 0) = 1), 0) AS verified_users
         FROM business_users WHERE email IS NOT NULL AND email <> ''`
    )
    audienceCounts.all_users = Number(u?.all_users || 0)
    audienceCounts.verified_users = Number(u?.verified_users || 0)
  } catch (e) { console.error('[email-campaigns] users count failed:', e) }

  try {
    const w = await queryOne<{ waitlist: number }>(
      `SELECT COUNT(*) AS waitlist FROM waitlist WHERE email IS NOT NULL AND email <> ''`
    )
    audienceCounts.waitlist = Number(w?.waitlist || 0)
  } catch (e) { console.error('[email-campaigns] waitlist count failed:', e) }

  /* History — degrade to empty if the table isn't there yet (migration unrun). */
  let campaigns: unknown[] = []
  try {
    campaigns = await query(
      `SELECT id, subject, audience, recipient_count, sent_count, failed_count, status, created_at
         FROM email_campaigns ORDER BY created_at DESC LIMIT 200`
    )
  } catch (e) { console.error('[email-campaigns] history failed (table may be missing):', e) }

  return Response.json({ ok: true, campaigns, audienceCounts })
}
