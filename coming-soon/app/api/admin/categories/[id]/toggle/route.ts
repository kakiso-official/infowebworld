import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { ok: false, error: 'Invalid category ID.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { launched } = body

    await execute(
      'UPDATE categories SET is_launched = ? WHERE id = ?',
      [launched ? 1 : 0, id]
    )

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Admin category toggle error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
