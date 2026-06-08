import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET  /api/admin/email-templates  → list templates (newest edited first)
 * POST /api/admin/email-templates  → create a template { name, subject, bodyHtml }
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const templates = await query(
      `SELECT id, name, subject, body_html, created_at, updated_at
         FROM email_templates ORDER BY updated_at DESC LIMIT 500`
    )
    return Response.json({ ok: true, templates })
  } catch (err) {
    console.error('GET /api/admin/email-templates error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const b = await request.json().catch(() => ({} as Record<string, unknown>))
    const name = String(b.name || '').trim().slice(0, 160)
    const subject = String(b.subject || '').trim().slice(0, 255)
    const bodyHtml = String(b.bodyHtml || '')
    if (!name || !subject || !bodyHtml) {
      return Response.json({ ok: false, error: 'Name, subject and body are required.' }, { status: 400 })
    }
    const r = await execute(
      `INSERT INTO email_templates (name, subject, body_html) VALUES (?, ?, ?)`,
      [name, subject, bodyHtml]
    )
    return Response.json({ ok: true, id: r.insertId })
  } catch (err) {
    console.error('POST /api/admin/email-templates error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
