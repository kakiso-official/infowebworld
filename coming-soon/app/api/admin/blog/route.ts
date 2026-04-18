import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const posts = await query(
      `SELECT p.*,
              COALESCE(SUM(bv.views), 0) as total_views,
              COALESCE(SUM(bv.unique_views), 0) as total_unique_views,
              COALESCE(SUM(bv.shares), 0) as total_shares
       FROM blog_posts p
       LEFT JOIN blog_analytics_daily bv ON bv.post_id = p.id
       GROUP BY p.id
       ORDER BY p.updated_at DESC`
    )

    return Response.json({ ok: true, posts })
  } catch (err) {
    console.error('Admin blog GET error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const {
      id,
      slug,
      title,
      excerpt,
      body: postBody,
      bodyHtml,
      coverImage,
      author,
      category,
      tags,
      status,
      featured,
      readTime,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoOgImage,
      seoCanonical,
      seoNoIndex,
    } = body

    const tagsJson = tags ? JSON.stringify(tags) : null
    const seoKeywordsJson = seoKeywords ? JSON.stringify(seoKeywords) : null
    const isFeatured = featured ? 1 : 0
    const isNoIndex = seoNoIndex ? 1 : 0

    if (id) {
      // Update existing post
      // Check if we need to set published_at
      let publishedAtClause = ''
      const existing = await queryOne<{ status: string; published_at: string | null }>(
        'SELECT status, published_at FROM blog_posts WHERE id = ?',
        [id]
      )

      if (status === 'published' && existing && !existing.published_at) {
        publishedAtClause = ', published_at = NOW()'
      }

      await execute(
        `UPDATE blog_posts SET
           slug = ?, title = ?, excerpt = ?, body = ?, body_html = ?,
           cover_image = ?, author = ?, category = ?, tags = ?,
           status = ?, featured = ?, read_time = ?,
           seo_title = ?, seo_description = ?, seo_keywords = ?,
           seo_og_image = ?, seo_canonical = ?, seo_no_index = ?,
           updated_at = NOW()${publishedAtClause}
         WHERE id = ?`,
        [
          slug, title, excerpt, postBody, bodyHtml,
          coverImage, author, category, tagsJson,
          status, isFeatured, readTime,
          seoTitle, seoDescription, seoKeywordsJson,
          seoOgImage, seoCanonical, isNoIndex,
          id,
        ]
      )

      return Response.json({ ok: true, id })
    } else {
      // Create new post
      const publishedAt = status === 'published' ? 'NOW()' : null
      const publishedAtValue = status === 'published' ? undefined : null

      const sql = `INSERT INTO blog_posts (
          slug, title, excerpt, body, body_html,
          cover_image, author, category, tags,
          status, featured, read_time,
          seo_title, seo_description, seo_keywords,
          seo_og_image, seo_canonical, seo_no_index,
          published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${status === 'published' ? 'NOW()' : '?'}, NOW(), NOW())`

      const params = [
        slug, title, excerpt, postBody, bodyHtml,
        coverImage, author, category, tagsJson,
        status, isFeatured, readTime,
        seoTitle, seoDescription, seoKeywordsJson,
        seoOgImage, seoCanonical, isNoIndex,
      ]

      if (status !== 'published') {
        params.push(publishedAtValue as any)
      }

      const result = await execute(sql, params)

      return Response.json({ ok: true, id: (result as any).insertId })
    }
  } catch (err) {
    console.error('Admin blog POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
