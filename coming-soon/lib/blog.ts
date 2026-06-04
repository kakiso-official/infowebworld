/* ════════════════════════════════════════════════════════════════════════
   Blog content layer — STATIC, file-backed.

   Posts live as markdown files at  content/blog/<slug>.md  with a JSON
   front-matter block, e.g.

     ---
     { "title": "…", "slug": "…", "status": "published", … }
     ---

     # Markdown body …

   JSON front-matter (not YAML) is deliberate: JSON.parse is built in and
   handles arrays / nested objects / escaping with zero extra dependencies,
   so parsing is 100% reliable.

   The admin editor writes these files locally; `git push` builds them into
   static pages (see app/blog/[slug]/page.tsx generateStaticParams). No DB,
   no runtime fetch on the public side.

   SERVER-ONLY: imports node:fs. Never import this from a client component.
   ════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs'
import path from 'node:path'

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

/** Metadata persisted to the file (everything except the markdown body). */
export type BlogMeta = Omit<BlogPost, 'body'>

export const BLOG_CATEGORIES = [
  'Business Tips', 'Industry News', 'SEO & Marketing', 'Startup Guide',
  'Product Updates', 'Case Studies', 'How-To Guides', 'Trends & Insights',
] as const

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

/* ── helpers ── */
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

const FENCE = '---'

function normalize(meta: Record<string, unknown>, body: string, fallbackSlug: string): BlogPost {
  const seo = (meta.seo ?? {}) as Record<string, unknown>
  const title = String(meta.title ?? '')
  const excerpt = String(meta.excerpt ?? '')
  const cover = String(meta.coverImage ?? '')
  return {
    id: String(meta.id ?? meta.slug ?? fallbackSlug),
    slug: String(meta.slug ?? fallbackSlug),
    title,
    excerpt,
    body,
    coverImage: cover,
    author: String(meta.author ?? 'InfoWebWorld Team'),
    category: String(meta.category ?? 'Business Tips'),
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    status: meta.status === 'published' ? 'published' : 'draft',
    featured: Boolean(meta.featured),
    readTime: Number(meta.readTime) || calcReadTime(body),
    createdAt: String(meta.createdAt ?? ''),
    updatedAt: String(meta.updatedAt ?? ''),
    publishedAt: meta.publishedAt ? String(meta.publishedAt) : null,
    seo: {
      metaTitle: String(seo.metaTitle ?? title),
      metaDescription: String(seo.metaDescription ?? excerpt),
      keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String) : [],
      ogImage: String(seo.ogImage ?? cover),
      canonicalUrl: String(seo.canonicalUrl ?? ''),
      noIndex: Boolean(seo.noIndex),
    },
  }
}

/** Parse a raw .md file (JSON front-matter + body) into a BlogPost. */
export function parsePost(raw: string, fallbackSlug = ''): BlogPost | null {
  const text = raw.replace(/^﻿/, '') // strip BOM
  const lines = text.split(/\r?\n/)
  if ((lines[0] ?? '').trim() !== FENCE) return null

  const metaLines: string[] = []
  let i = 1
  for (; i < lines.length; i++) {
    if (lines[i].trim() === FENCE) break
    metaLines.push(lines[i])
  }
  if (i >= lines.length) return null // no closing fence

  let meta: Record<string, unknown>
  try { meta = JSON.parse(metaLines.join('\n')) }
  catch { return null }

  const body = lines.slice(i + 1).join('\n').replace(/^\n+/, '')
  return normalize(meta, body, fallbackSlug)
}

/** Serialise a BlogPost back to .md file contents (used by the save API). */
export function serializePost(post: BlogPost): string {
  const meta: BlogMeta = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    author: post.author,
    category: post.category,
    tags: post.tags,
    status: post.status,
    featured: post.featured,
    readTime: post.readTime,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    seo: post.seo,
  }
  return `${FENCE}\n${JSON.stringify(meta, null, 2)}\n${FENCE}\n\n${post.body.trim()}\n`
}

/* ── readers (build-time / server) ── */
function dateVal(p: BlogPost): number {
  const d = p.publishedAt || p.updatedAt || p.createdAt
  const t = d ? Date.parse(d) : 0
  return Number.isNaN(t) ? 0 : t
}

/** Every post (draft + published), newest first. */
export function getAllPosts(): BlogPost[] {
  let files: string[]
  try { files = fs.readdirSync(BLOG_DIR) }
  catch { return [] } // dir missing → no posts yet
  const posts: BlogPost[] = []
  for (const f of files) {
    if (!f.endsWith('.md')) continue
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
      const p = parsePost(raw, f.replace(/\.md$/, ''))
      if (p && p.slug) posts.push(p)
    } catch { /* skip unreadable file */ }
  }
  posts.sort((a, b) => dateVal(b) - dateVal(a))
  return posts
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter(p => p.status === 'published')
}

export function getPostBySlug(slug: string): BlogPost | null {
  // fast path: direct filename match
  try {
    const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8')
    const p = parsePost(raw, slug)
    if (p && p.slug === slug) return p
  } catch { /* fall through to scan */ }
  return getAllPosts().find(p => p.slug === slug) || null
}

/** Published post for the public page (or null if it's a draft / missing). */
export function getPublishedPostBySlug(slug: string): BlogPost | null {
  const p = getPostBySlug(slug)
  return p && p.status === 'published' ? p : null
}

export function getAllPublishedSlugs(): string[] {
  return getPublishedPosts().map(p => p.slug)
}

/** Related posts: same category first, topped up with the newest other posts
 *  so the "Recommended" row is never sparse. Published, excludes `slug`. */
export function getRelatedPosts(slug: string, category: string, limit = 3): BlogPost[] {
  const pub = getPublishedPosts().filter(p => p.slug !== slug)
  const result = pub.filter(p => p.category === category)
  for (const p of pub) {
    if (result.length >= limit) break
    if (!result.some(r => r.slug === p.slug)) result.push(p)
  }
  return result.slice(0, limit)
}
