import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, results: { categories: [], listings: [], blog: [] }, total: 0 })
  }

  const like = `%${q}%`

  const [categories, listings, blog] = await Promise.all([
    /* Categories — search name + description, navigable only */
    query<{
      id: number; name: string; slug: string; level: number;
      color: string; icon: string; description: string;
      parent_name: string | null; parent_slug: string | null;
      listing_count: number
    }>(
      `SELECT c.id, c.name, c.slug, c.level, c.color, c.icon, c.description,
              c.listing_count,
              p.name AS parent_name, p.slug AS parent_slug
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       WHERE c.is_launched = 1 AND c.is_navigation = 1
         AND (c.name LIKE ? OR c.description LIKE ?)
       ORDER BY
         CASE WHEN c.name LIKE ? THEN 0 ELSE 1 END,
         c.level ASC, c.name ASC
       LIMIT 8`,
      [like, like, `${q}%`]
    ),

    /* Listings — search company name, tagline, description */
    query<{
      id: number; slug: string; company_name: string; tagline: string;
      logo_url: string; website: string;
      category_name: string; category_slug: string; category_color: string
    }>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.status IN ('active', 'paid')
         AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ?)
       ORDER BY
         CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END,
         s.approved_at DESC
       LIMIT 6`,
      [like, like, like, `${q}%`]
    ),

    /* Blog — use FULLTEXT if available, fallback to LIKE */
    query<{
      id: number; slug: string; title: string; excerpt: string;
      cover_image: string; author: string; category: string
    }>(
      `SELECT id, slug, title, excerpt, cover_image, author, category
       FROM blog_posts
       WHERE status = 'published'
         AND (title LIKE ? OR excerpt LIKE ?)
       ORDER BY
         CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
         published_at DESC
       LIMIT 4`,
      [like, like, `${q}%`]
    ),
  ])

  const total = categories.length + listings.length + blog.length

  return NextResponse.json(
    { ok: true, results: { categories, listings, blog }, total },
    { headers: { 'Cache-Control': 'public, max-age=60' } }
  )
}
