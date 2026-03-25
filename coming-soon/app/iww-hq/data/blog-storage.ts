/**
 * Blog storage — reads/writes from MySQL via api.php
 */
import type { BlogPost } from './blog-types'

const API = '/api'

/** Map DB snake_case row to BlogPost */
function mapRow(r: Record<string, unknown>): BlogPost {
  const tags = typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (r.tags ?? [])
  const seoKw = typeof r.seo_keywords === 'string' ? JSON.parse(r.seo_keywords || '[]') : (r.seo_keywords ?? [])

  return {
    id: String(r.id ?? ''),
    slug: String(r.slug ?? ''),
    title: String(r.title ?? ''),
    excerpt: String(r.excerpt ?? ''),
    body: String(r.body ?? ''),
    coverImage: String(r.cover_image ?? ''),
    author: String(r.author ?? 'InfoWebWorld Team'),
    category: String(r.category ?? 'Business Tips'),
    tags: Array.isArray(tags) ? tags : [],
    status: (r.status as 'draft' | 'published') || 'draft',
    featured: !!(r.is_featured ?? false),
    readTime: Number(r.read_time ?? 1),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
    publishedAt: r.published_at ? String(r.published_at) : null,
    seo: {
      metaTitle: String(r.seo_title ?? ''),
      metaDescription: String(r.seo_description ?? ''),
      keywords: Array.isArray(seoKw) ? seoKw : [],
      ogImage: String(r.seo_og_image ?? ''),
      canonicalUrl: String(r.seo_canonical ?? ''),
      noIndex: !!(r.seo_no_index ?? false),
    },
  }
}

/** Map BlogPost to API payload for saving */
function toPayload(p: BlogPost): Record<string, unknown> {
  return {
    id: p.id && !p.id.includes('-') ? Number(p.id) : undefined, // numeric DB id only
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    bodyHtml: '',
    coverImage: p.coverImage,
    author: p.author,
    category: p.category,
    tags: p.tags,
    status: p.status,
    featured: p.featured ? 1 : 0,
    readTime: p.readTime,
    seoTitle: p.seo.metaTitle,
    seoDescription: p.seo.metaDescription,
    seoKeywords: p.seo.keywords,
    seoOgImage: p.seo.ogImage,
    seoCanonical: p.seo.canonicalUrl,
    seoNoIndex: p.seo.noIndex ? 1 : 0,
  }
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/admin/blog`)
    if (!res.ok) throw new Error('API error')
    const rows: Record<string, unknown>[] = await res.json()
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blog`)
    if (!res.ok) throw new Error('API error')
    const rows: Record<string, unknown>[] = await res.json()
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  const posts = await fetchAllPosts()
  return posts.find(p => p.id === id) || null
}

/** Fetch a single published post by slug (includes body) */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blog/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    return mapRow(data)
  } catch { return null }
}

export async function apiSavePost(post: BlogPost): Promise<string> {
  const res = await fetch(`${API}/admin/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPayload(post)),
  })
  const data = await res.json()
  return String(data.id ?? post.id)
}

export async function apiDeletePost(id: string): Promise<void> {
  await fetch(`${API}/admin/blog/${id}`, {
    method: 'DELETE',
  })
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

export function createEmptyPost(): BlogPost {
  return {
    id: '', slug: '', title: '', excerpt: '', body: '', coverImage: '',
    author: 'InfoWebWorld Team', category: 'Business Tips', tags: [], featured: false, readTime: 1,
    status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), publishedAt: null,
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '', noIndex: false },
  }
}

// ── Sync wrappers for backwards compatibility (used by public blog page) ──
export function getAllPosts(): BlogPost[] { return [] }
export function getPublishedPosts(): BlogPost[] { return [] }
export function getPostById(_id: string): BlogPost | null { return null }
export function getPostBySlug(_slug: string): BlogPost | null { return null }
export function savePost(_post: BlogPost) {}
export function deletePost(_id: string) {}
