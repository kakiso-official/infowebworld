import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await queryOne(
      'SELECT * FROM blog_posts WHERE slug = ? AND status = ? LIMIT 1',
      [slug, 'published']
    )

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }

    return Response.json({ ok: true, data: post })
  } catch (err) {
    console.error('GET /api/blog/[slug] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
