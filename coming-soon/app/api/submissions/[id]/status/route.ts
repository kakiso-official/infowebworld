import { NextRequest } from 'next/server'
import { queryOne, execute } from '@/lib/db'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return Response.json({ error: 'status is required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'active', 'rejected', 'suspended', 'paid']
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get current submission
    const submission = await queryOne<{
      id: number; status: string; category_id: number | null; company_name: string; slug: string | null
    }>(
      'SELECT id, status, category_id, company_name, slug FROM submissions WHERE id = ?',
      [id]
    )

    if (!submission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    const oldStatus = submission.status
    const categoryId = submission.category_id

    // If becoming active, set approved_at and generate slug if missing
    if (status === 'active' && oldStatus !== 'active') {
      let slug = submission.slug
      if (!slug && submission.company_name) {
        slug = slugify(submission.company_name) + '-' + crypto.randomUUID().slice(0, 8)
      }

      await execute(
        'UPDATE submissions SET status = ?, approved_at = NOW(), slug = ? WHERE id = ?',
        [status, slug, id]
      )

      // Increment listing_count for the category
      if (categoryId) {
        await execute(
          'UPDATE categories SET listing_count = listing_count + 1 WHERE id = ?',
          [categoryId]
        )
      }
    } else {
      await execute(
        'UPDATE submissions SET status = ? WHERE id = ?',
        [status, id]
      )

      // If was active and now not active, decrement listing_count
      if (oldStatus === 'active' && status !== 'active' && categoryId) {
        await execute(
          'UPDATE categories SET listing_count = GREATEST(listing_count - 1, 0) WHERE id = ?',
          [categoryId]
        )
      }
    }

    return Response.json({ ok: true, message: `Status updated to ${status}` })
  } catch (err) {
    console.error('PATCH /api/submissions/[id]/status error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
