import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
