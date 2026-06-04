import { NextRequest } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { requireAdmin } from '@/lib/auth'
import {
  BLOG_DIR, getAllPosts, getPostBySlug, serializePost,
  slugify, calcReadTime, type BlogPost,
} from '@/lib/blog'

/* Filesystem-backed blog admin API.

   Posts are markdown files in content/blog/. Authoring is a LOCAL workflow:
   run the dev server, write a post here, then commit + push — Vercel builds
   the static pages. Reads work everywhere; writes only work where the repo
   is writable (i.e. your machine). */
export const dynamic = 'force-dynamic'

function ensureDir() {
  try { fs.mkdirSync(BLOG_DIR, { recursive: true }) } catch { /* ignore */ }
}

/** GET — list all posts, or ?slug=<slug> for one full post. */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const slug = request.nextUrl.searchParams.get('slug')
  try {
    if (slug) {
      const post = getPostBySlug(slug)
      if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 })
      return Response.json({ ok: true, post })
    }
    /* Full posts (incl. body) so the list's publish-toggle never wipes content. */
    return Response.json({ ok: true, posts: getAllPosts() })
  } catch (err) {
    console.error('blog files GET error:', err)
    return Response.json({ ok: false, error: 'Could not read posts' }, { status: 500 })
  }
}

/** POST — create or update content/blog/<slug>.md from a full post payload. */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const b = (await request.json()) as Partial<BlogPost> & { prevSlug?: string }
    const title = String(b.title || '').trim()
    if (!title) return Response.json({ ok: false, error: 'A title is required.' }, { status: 400 })

    const slug = slugify(b.slug || title)
    if (!slug) return Response.json({ ok: false, error: 'Could not build a URL slug from the title.' }, { status: 400 })

    const nowIso = new Date().toISOString()
    const bodyText = String(b.body || '')
    const seo: Partial<BlogPost['seo']> = b.seo || {}
    const post: BlogPost = {
      id: slug,
      slug,
      title,
      excerpt: String(b.excerpt || ''),
      body: bodyText,
      coverImage: String(b.coverImage || ''),
      author: String(b.author || 'InfoWebWorld Team'),
      category: String(b.category || 'Business Tips'),
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      status: b.status === 'published' ? 'published' : 'draft',
      featured: Boolean(b.featured),
      readTime: Number(b.readTime) || calcReadTime(bodyText),
      createdAt: b.createdAt || nowIso,
      updatedAt: nowIso,
      publishedAt: b.status === 'published' ? (b.publishedAt || nowIso) : (b.publishedAt || null),
      seo: {
        metaTitle: String(seo.metaTitle || title),
        metaDescription: String(seo.metaDescription || b.excerpt || ''),
        keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String) : [],
        ogImage: String(seo.ogImage || b.coverImage || ''),
        canonicalUrl: String(seo.canonicalUrl || ''),
        noIndex: Boolean(seo.noIndex),
      },
    }

    ensureDir()
    /* Slug changed while editing → remove the old file so we don't orphan it. */
    const prevSlug = b.prevSlug ? slugify(b.prevSlug) : ''
    if (prevSlug && prevSlug !== slug) {
      try { fs.unlinkSync(path.join(BLOG_DIR, `${prevSlug}.md`)) } catch { /* already gone */ }
    }

    try {
      fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), serializePost(post), 'utf8')
    } catch {
      return Response.json({
        ok: false, readonly: true,
        error: 'Could not write the post file. Blog authoring only works on your local machine — run the dev server, save, then commit & push.',
      }, { status: 500 })
    }

    return Response.json({ ok: true, slug, post })
  } catch (err) {
    console.error('blog files POST error:', err)
    return Response.json({ ok: false, error: 'Save failed.' }, { status: 500 })
  }
}

/** DELETE — ?slug=<slug> removes the markdown file. */
export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const slug = slugify(request.nextUrl.searchParams.get('slug') || '')
  if (!slug) return Response.json({ ok: false, error: 'slug required' }, { status: 400 })
  try {
    fs.unlinkSync(path.join(BLOG_DIR, `${slug}.md`))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Could not delete (already removed?)' }, { status: 200 })
  }
}
