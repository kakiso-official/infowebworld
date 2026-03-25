import type { MetadataRoute } from 'next'
import { query } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://infowebworld.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/get-listed`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await query<{ slug: string; updated_at: string }>(
      "SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC"
    )
    blogPages = posts.map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch { /* DB not available during build */ }

  // Categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const cats = await query<{ slug: string; updated_at: string }>(
      'SELECT slug, updated_at FROM categories WHERE is_launched = 1 AND is_active = 1 ORDER BY sort_order'
    )
    categoryPages = cats.map(c => ({
      url: `${base}/category/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch { /* DB not available during build */ }

  // Active listings
  let listingPages: MetadataRoute.Sitemap = []
  try {
    const listings = await query<{ slug: string; created_at: string }>(
      "SELECT slug FROM submissions WHERE status IN ('active','paid') AND slug IS NOT NULL ORDER BY created_at DESC"
    )
    listingPages = listings.map(l => ({
      url: `${base}/listing/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  } catch { /* DB not available during build */ }

  return [...staticPages, ...blogPages, ...categoryPages, ...listingPages]
}
