import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import {
  getAllPosts, getPostBySlug, savePost, deletePost,
  slugify, calcReadTime, type BlogPost,
} from '@/lib/blog'

/* DB-backed blog admin API (table: blog_posts).

   Works in EVERY environment — including the live admin panel — because it
   writes to MySQL, not the local filesystem. (The previous version wrote
   markdown files under content/blog/, which Vercel's read-only serverless FS
   rejects, hence the "only works on your local machine" 500.)

   The request/response contract is unchanged, so the admin UI and
   app/iww-hq/data/blog-storage.ts need no edits. */
export const dynamic = 'force-dynamic'

/** GET — list all posts, or ?slug=<slug> for one full post. */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const slug = request.nextUrl.searchParams.get('slug')
  try {
    if (slug) {
      const post = await getPostBySlug(slug)
      if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 })
      return Response.json({ ok: true, post })
    }
    return Response.json({ ok: true, posts: await getAllPosts() })
  } catch (err) {
    console.error('blog admin GET error:', err)
    return Response.json({ ok: false, error: 'Could not read posts' }, { status: 500 })
  }
}

/** POST — create or update a post from a full payload. */
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

    /* Slug changed while editing → savePost removes the old row so we don't
       orphan it. */
    const prevSlug = b.prevSlug ? slugify(b.prevSlug) : ''
    await savePost(post, prevSlug && prevSlug !== slug ? prevSlug : undefined)

    return Response.json({ ok: true, slug, post })
  } catch (err) {
    console.error('blog admin POST error:', err)
    return Response.json({ ok: false, error: 'Save failed.' }, { status: 500 })
  }
}

/** DELETE — ?slug=<slug> removes the post. */
export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const slug = slugify(request.nextUrl.searchParams.get('slug') || '')
  if (!slug) return Response.json({ ok: false, error: 'slug required' }, { status: 400 })
  try {
    await deletePost(slug)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('blog admin DELETE error:', err)
    return Response.json({ ok: false, error: 'Could not delete' }, { status: 500 })
  }
}
