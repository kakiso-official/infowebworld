import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT key_name, value FROM settings ORDER BY key_name') as Array<{ key_name: string; value: string }>

    const settings: Record<string, string> = {}
    for (const row of rows) {
      settings[row.key_name] = row.value
    }

    return Response.json(
      { ok: true, data: settings },
      { headers: { 'Cache-Control': 'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/settings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
