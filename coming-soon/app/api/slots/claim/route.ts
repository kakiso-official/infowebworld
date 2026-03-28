import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const plan = body.plan as string

    if (plan !== 'lifetime' && plan !== 'yearly') {
      return Response.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const claimedKey = plan === 'lifetime' ? 'lifetimeSlotsClaimed' : 'yearlySlotsClaimed'
    const totalKey = plan === 'lifetime' ? 'lifetimeSlotsTotal' : 'yearlySlotsTotal'
    const defaultTotal = plan === 'lifetime' ? 199 : 999

    // Read current values
    const rows = await query<{ key_name: string; value: string }>(
      'SELECT key_name, value FROM settings WHERE key_name IN (?, ?)',
      [claimedKey, totalKey]
    )

    const settings: Record<string, number> = {}
    for (const row of rows) {
      settings[row.key_name] = Number(row.value) || 0
    }

    const claimed = settings[claimedKey] || 0
    const total = settings[totalKey] || defaultTotal

    if (claimed >= total) {
      return Response.json({ ok: false, error: 'No slots remaining', remaining: 0 })
    }

    // Increment claimed count (upsert)
    await execute(
      `INSERT INTO settings (key_name, value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value = CAST(CAST(value AS UNSIGNED) + 1 AS CHAR)`,
      [claimedKey, String(claimed + 1)]
    )

    const newClaimed = claimed + 1
    return Response.json({
      ok: true,
      claimed: newClaimed,
      total,
      remaining: total - newClaimed,
    })
  } catch (err) {
    console.error('POST /api/slots/claim error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
