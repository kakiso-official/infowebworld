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
        { ok: false, error: 'Invalid tag group ID.' },
        { status: 400 }
      )
    }

    await execute('DELETE FROM tag_groups WHERE id = ?', [id])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Admin tag group DELETE error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, sort_order } = body

    const tagGroupId = Number(id)
    if (!tagGroupId || isNaN(tagGroupId)) {
      return Response.json(
        { ok: false, error: 'Invalid tag group ID.' },
        { status: 400 }
      )
    }

    const result = await execute(
      `INSERT INTO tags (tag_group_id, name, slug, sort_order, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [tagGroupId, name, slug, sort_order ?? 0]
    )

    return Response.json({ ok: true, id: result.insertId })
  } catch (err) {
    console.error('Admin tag POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
