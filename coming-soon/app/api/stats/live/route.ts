import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const waitlistRow = await queryOne('SELECT COUNT(*) as count FROM waitlist')
    const submissionRow = await queryOne('SELECT COUNT(*) as count FROM submissions')
    const paidRow = await queryOne("SELECT COUNT(*) as count FROM submissions WHERE payment_status = 'completed'")

    return Response.json(
      {
        ok: true,
        data: {
          waitlistCount: waitlistRow?.count ?? 0,
          submissionCount: submissionRow?.count ?? 0,
          paidCount: paidRow?.count ?? 0,
        },
      },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/stats/live error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
