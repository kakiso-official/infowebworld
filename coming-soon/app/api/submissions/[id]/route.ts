import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build dynamic SET clause from allowed fields
    const allowed: Record<string, string> = {
      faqs: 'faqs', seoTitle: 'seo_title', seoDescription: 'seo_description',
      seoKeywords: 'seo_keywords', ogImage: 'og_image',
    }
    const sets: string[] = []
    const values: unknown[] = []

    for (const [key, col] of Object.entries(allowed)) {
      if (body[key] !== undefined) {
        sets.push(`${col} = ?`)
        values.push(typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key])
      }
    }

    if (sets.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    values.push(id)
    await execute(`UPDATE submissions SET ${sets.join(', ')} WHERE id = ?`, values)

    return Response.json({ ok: true })
  } catch (err) {
    console.error('PATCH /api/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

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
