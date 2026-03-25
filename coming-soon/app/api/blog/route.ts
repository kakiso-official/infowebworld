import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT id, slug, title, excerpt, cover_image, author, category, tags, read_time, published_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
      LIMIT 50
    `)

    return Response.json({ ok: true, data: rows })
  } catch (err) {
    console.error('GET /api/blog error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
