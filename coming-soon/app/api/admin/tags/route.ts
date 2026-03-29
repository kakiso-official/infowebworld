import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const groups = await query(
      `SELECT tg.*,
              (SELECT COUNT(*) FROM tags t WHERE t.tag_group_id = tg.id) AS tag_count
       FROM tag_groups tg
       ORDER BY tg.sort_order`
    )

    return Response.json({ ok: true, data: groups })
  } catch (err) {
    console.error('Admin tags GET error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, slug, description, icon, color, sort_order } = body

    if (id) {
      await execute(
        `UPDATE tag_groups SET
           name = ?, slug = ?, description = ?, icon = ?, color = ?,
           sort_order = ?, updated_at = NOW()
         WHERE id = ?`,
        [name, slug, description ?? null, icon ?? null, color ?? '#6B7280', sort_order ?? 0, id]
      )

      return Response.json({ ok: true, id })
    } else {
      const result = await execute(
        `INSERT INTO tag_groups (name, slug, description, icon, color, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [name, slug, description ?? null, icon ?? null, color ?? '#6B7280', sort_order ?? 0]
      )

      return Response.json({ ok: true, id: result.insertId })
    }
  } catch (err) {
    console.error('Admin tags POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
