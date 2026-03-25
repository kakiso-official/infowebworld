import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await execute('DELETE FROM submissions WHERE id = ?', [id])

    return Response.json({ ok: true, message: 'Submission deleted' })
  } catch (err) {
    console.error('DELETE /api/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
