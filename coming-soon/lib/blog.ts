/* ════════════════════════════════════════════════════════════════════════
   Blog content layer — DB-backed (MySQL `blog_posts`).

   Authoring (admin) and reads (public) both go through this module against
   the `blog_posts` table, so a post written in the LIVE admin panel appears
   on the site immediately. The previous flow wrote markdown files to
   content/blog/ — that only works where the repo is writable (your machine),
   never on Vercel's read-only serverless filesystem, which is why live
   authoring 500'd.

   The BlogPost shape is preserved from the file era so every consumer
   (public pages, sitemap, AI route) keeps working unchanged — the only
   difference for callers is that the readers are now async: await them.

   SAFE on the server only — imports lib/db. Never import from a client
   component (the public pages are server components, which is fine).
   ════════════════════════════════════════════════════════════════════════ */
import { query, queryOne, execute } from './db'

export type BlogSeo = {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImage: string
  canonicalUrl: string
  noIndex: boolean
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featured: boolean
  readTime: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  seo: BlogSeo
}

/** Metadata-only view (everything except the markdown body). */
export type BlogMeta = Omit<BlogPost, 'body'>

export const BLOG_CATEGORIES = [
  'Business Tips', 'Industry News', 'SEO & Marketing', 'Startup Guide',
  'Product Updates', 'Case Studies', 'How-To Guides', 'Trends & Insights',
] as const

/* ── pure helpers (unchanged from the file era) ── */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function calcReadTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/* ── row → BlogPost mapping ── */
interface BlogRow {
  slug: string
  title: string
  excerpt: string | null
  body: string | null
  cover_image: string | null
  author: string | null
  category: string | null
  tags: unknown
  status: 'draft' | 'published' | 'archived'
  is_featured: number
  read_time: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: unknown
  seo_og_image: string | null
  seo_canonical: string | null
  seo_no_index: number
  published_at: Date | string | null
  created_at: Date | string | null
  updated_at: Date | string | null
}

/** DATETIME → ISO string (mysql2 returns DATETIME as a JS Date by default). */
function toIso(v: unknown): string {
  if (!v) return ''
  if (v instanceof Date) return v.toISOString()
  const d = new Date(v as string)
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString()
}

/** JSON column (tags / seo_keywords) → string[]. Tolerates already-parsed
 *  arrays, JSON strings, and legacy comma strings. */
function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(x => String(x))
  if (typeof v === 'string' && v.trim()) {
    try {
      const p = JSON.parse(v)
      return Array.isArray(p) ? p.map(String) : []
    } catch {
      return v.split(',').map(s => s.trim()).filter(Boolean)
    }
  }
  return []
}

function rowToPost(r: BlogRow): BlogPost {
  const title = r.title || ''
  const excerpt = r.excerpt || ''
  const cover = r.cover_image || ''
  const body = r.body || ''
  return {
    /* id mirrors slug — it's only ever used as a React key, and keeping
       id === slug preserves the exact contract callers relied on before. */
    id: r.slug,
    slug: r.slug,
    title,
    excerpt,
    body,
    coverImage: cover,
    author: r.author || 'InfoWebWorld Team',
    category: r.category || 'Business Tips',
    tags: asStringArray(r.tags),
    status: r.status === 'published' ? 'published' : 'draft',
    featured: Boolean(r.is_featured),
    readTime: Number(r.read_time) || calcReadTime(body),
    createdAt: toIso(r.created_at),
    updatedAt: toIso(r.updated_at),
    publishedAt: r.published_at ? toIso(r.published_at) : null,
    seo: {
      metaTitle: r.seo_title || title,
      metaDescription: r.seo_description || excerpt,
      keywords: asStringArray(r.seo_keywords),
      ogImage: r.seo_og_image || cover,
      canonicalUrl: r.seo_canonical || '',
      noIndex: Boolean(r.seo_no_index),
    },
  }
}

const SELECT_COLS = `slug, title, excerpt, body, cover_image, author, category, tags,
  status, is_featured, read_time, seo_title, seo_description, seo_keywords,
  seo_og_image, seo_canonical, seo_no_index, published_at, created_at, updated_at`

/* ── readers (now async) ── */

/** Every post (draft + published), newest-updated first. Admin list. */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogRow>(
      `SELECT ${SELECT_COLS} FROM blog_posts ORDER BY updated_at DESC`
    )
    return rows.map(rowToPost)
  } catch (err) {
    console.error('[blog] getAllPosts failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/** Published posts only, newest-published first. Public list. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogRow>(
      `SELECT ${SELECT_COLS} FROM blog_posts
        WHERE status = 'published'
        ORDER BY COALESCE(published_at, created_at) DESC`
    )
    return rows.map(rowToPost)
  } catch (err) {
    console.error('[blog] getPublishedPosts failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/** Any post by slug (any status). Admin edit load. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const row = await queryOne<BlogRow>(
      `SELECT ${SELECT_COLS} FROM blog_posts WHERE slug = ? LIMIT 1`,
      [slug]
    )
    return row ? rowToPost(row) : null
  } catch (err) {
    console.error('[blog] getPostBySlug failed:', err instanceof Error ? err.message : err)
    return null
  }
}

/** Published post for the public page (null if draft / missing). */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const row = await queryOne<BlogRow>(
      `SELECT ${SELECT_COLS} FROM blog_posts
        WHERE slug = ? AND status = 'published' LIMIT 1`,
      [slug]
    )
    return row ? rowToPost(row) : null
  } catch (err) {
    console.error('[blog] getPublishedPostBySlug failed:', err instanceof Error ? err.message : err)
    return null
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const rows = await query<{ slug: string }>(
      `SELECT slug FROM blog_posts WHERE status = 'published'`
    )
    return rows.map(r => r.slug)
  } catch (err) {
    console.error('[blog] getAllPublishedSlugs failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/** Related posts: same category first, topped up with the newest other posts
 *  so the "Recommended" row is never sparse. Published, excludes `slug`. */
export async function getRelatedPosts(slug: string, category: string, limit = 3): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogRow>(
      `SELECT ${SELECT_COLS} FROM blog_posts
        WHERE status = 'published' AND slug <> ?
        ORDER BY (category = ?) DESC, COALESCE(published_at, created_at) DESC
        LIMIT ?`,
      [slug, category, limit]
    )
    return rows.map(rowToPost)
  } catch (err) {
    console.error('[blog] getRelatedPosts failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/* ── writers (admin authoring) ── */

/**
 * Create or update a post (keyed on the UNIQUE slug). When `prevSlug` differs
 * from the new slug the old row is removed first, so renaming a post never
 * orphans a duplicate. `published_at` is stamped the first time a post goes
 * live and preserved thereafter.
 */
export async function savePost(post: BlogPost, prevSlug?: string): Promise<void> {
  if (prevSlug && prevSlug !== post.slug) {
    await execute(`DELETE FROM blog_posts WHERE slug = ?`, [prevSlug])
  }
  const isPublished = post.status === 'published'
  /* Interpolated, not a placeholder — `isPublished` is a server-side boolean,
     never user input — which sidesteps DATETIME string-format quirks. */
  const pubExpr = isPublished ? 'NOW()' : 'NULL'

  await execute(
    `INSERT INTO blog_posts
       (slug, title, excerpt, body, body_html, cover_image, author, category, tags,
        status, is_featured, read_time, seo_title, seo_description, seo_keywords,
        seo_og_image, seo_canonical, seo_no_index, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${pubExpr}, NOW(), NOW())
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), excerpt = VALUES(excerpt), body = VALUES(body),
       cover_image = VALUES(cover_image), author = VALUES(author),
       category = VALUES(category), tags = VALUES(tags), status = VALUES(status),
       is_featured = VALUES(is_featured), read_time = VALUES(read_time),
       seo_title = VALUES(seo_title), seo_description = VALUES(seo_description),
       seo_keywords = VALUES(seo_keywords), seo_og_image = VALUES(seo_og_image),
       seo_canonical = VALUES(seo_canonical), seo_no_index = VALUES(seo_no_index),
       published_at = COALESCE(published_at, ${pubExpr}),
       updated_at = NOW()`,
    [
      post.slug, post.title, post.excerpt, post.body, post.coverImage,
      post.author, post.category, JSON.stringify(post.tags || []),
      isPublished ? 'published' : 'draft', post.featured ? 1 : 0, post.readTime,
      post.seo.metaTitle || null, post.seo.metaDescription || null,
      JSON.stringify(post.seo.keywords || []), post.seo.ogImage || null,
      post.seo.canonicalUrl || null, post.seo.noIndex ? 1 : 0,
    ]
  )
}

export async function deletePost(slug: string): Promise<void> {
  await execute(`DELETE FROM blog_posts WHERE slug = ?`, [slug])
}
