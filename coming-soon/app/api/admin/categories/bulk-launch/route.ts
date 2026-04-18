import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const { launched, level, parent_id } = body

    const launchedValue = launched ? 1 : 0
    let result: any

    if (level !== undefined && level !== null && parent_id !== undefined && parent_id !== null) {
      // Both level AND parent_id specified
      result = await execute(
        'UPDATE categories SET is_launched = ? WHERE level = ? AND parent_id = ?',
        [launchedValue, level, parent_id]
      )
    } else if (level !== undefined && level !== null) {
      // Only level specified
      result = await execute(
        'UPDATE categories SET is_launched = ? WHERE level = ?',
        [launchedValue, level]
      )
    } else if (parent_id !== undefined && parent_id !== null) {
      // Only parent_id specified — update children AND the parent itself
      await execute(
        'UPDATE categories SET is_launched = ? WHERE id = ?',
        [launchedValue, parent_id]
      )
      result = await execute(
        'UPDATE categories SET is_launched = ? WHERE parent_id = ?',
        [launchedValue, parent_id]
      )
    } else {
      // Neither — update all categories
      result = await execute(
        'UPDATE categories SET is_launched = ?',
        [launchedValue]
      )
    }

    return Response.json({
      ok: true,
      affected: (result as any)?.affectedRows ?? 0,
    })
  } catch (err) {
    console.error('Admin categories bulk-launch error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
