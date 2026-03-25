import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const rows = await query<{ key_name: string; value: string }>(
      'SELECT key_name, value FROM settings ORDER BY key_name'
    )

    const settings: Record<string, string> = {}
    for (const row of rows) {
      settings[row.key_name] = row.value
    }

    return Response.json({ ok: true, settings })
  } catch (err) {
    console.error('Admin settings GET error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return Response.json(
        { ok: false, error: 'Invalid settings data.' },
        { status: 400 }
      )
    }

    const entries = Object.entries(body)

    for (const [key, value] of entries) {
      await execute(
        `INSERT INTO settings (key_name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)`,
        [key, String(value)]
      )
    }

    return Response.json({ ok: true, updated: entries.length })
  } catch (err) {
    console.error('Admin settings POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
