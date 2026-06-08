import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * PUT    /api/admin/email-templates/[id]  → update { name, subject, bodyHtml }
 * DELETE /api/admin/email-templates/[id]  → delete
 */
function parseId(id: string): number | null {
  const n = Number.parseInt(id, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { id } = await ctx.params
    const tid = parseId(id)
    if (!tid) return Response.json({ ok: false, error: 'Invalid id' }, { status: 400 })

    const b = await request.json().catch(() => ({} as Record<string, unknown>))
    const name = String(b.name || '').trim().slice(0, 160)
    const subject = String(b.subject || '').trim().slice(0, 255)
    const bodyHtml = String(b.bodyHtml || '')
    if (!name || !subject || !bodyHtml) {
      return Response.json({ ok: false, error: 'Name, subject and body are required.' }, { status: 400 })
    }
    await execute(
      `UPDATE email_templates SET name = ?, subject = ?, body_html = ? WHERE id = ?`,
      [name, subject, bodyHtml, tid]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/admin/email-templates/[id] error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { id } = await ctx.params
    const tid = parseId(id)
    if (!tid) return Response.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    await execute(`DELETE FROM email_templates WHERE id = ?`, [tid])
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/admin/email-templates/[id] error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
