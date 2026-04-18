import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { id } = await params

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { ok: false, error: 'Invalid listing type ID.' },
        { status: 400 }
      )
    }

    await execute('DELETE FROM listing_types WHERE id = ?', [id])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Admin listing-type DELETE error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
