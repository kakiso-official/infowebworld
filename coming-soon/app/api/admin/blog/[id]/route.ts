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
        { ok: false, error: 'Invalid post ID.' },
        { status: 400 }
      )
    }

    await execute('DELETE FROM blog_posts WHERE id = ?', [id])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Admin blog DELETE error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
