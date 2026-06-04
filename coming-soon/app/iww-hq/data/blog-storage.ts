/* Client-side blog storage — talks to the filesystem-backed admin API
   (/api/admin/blog/files). Posts now live as markdown files in content/blog/;
   `git push` builds them into static pages. (Previously MySQL via api.php.)

   BlogPost is imported type-only from the admin types module (no node:fs), so
   this stays safe to import from client components. */
import type { BlogPost } from './blog-types'

const API = '/api/admin/blog/files'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function createEmptyPost(): BlogPost {
  return {
    id: '', slug: '', title: '', excerpt: '', body: '', coverImage: '',
    author: 'InfoWebWorld Team', category: 'Business Tips', tags: [], featured: false, readTime: 1,
    status: 'draft', createdAt: '', updatedAt: '', publishedAt: null,
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '', noIndex: false },
  }
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(API, { cache: 'no-store', credentials: 'same-origin' })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.posts) ? json.posts : []
  } catch { return [] }
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  return (await fetchAllPosts()).filter(p => p.status === 'published')
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  if (!id) return null
  try {
    const res = await fetch(`${API}?slug=${encodeURIComponent(id)}`, { cache: 'no-store', credentials: 'same-origin' })
    if (!res.ok) return null
    const json = await res.json()
    return json.post || null
  } catch { return null }
}

/** In the file model the slug IS the id — alias kept for existing callers. */
export const fetchPostBySlug = fetchPostById

export async function apiSavePost(
  post: BlogPost,
): Promise<{ ok: boolean; slug?: string; post?: BlogPost; error?: string; readonly?: boolean }> {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      /* prevSlug lets the API clean up the old file after a slug rename. */
      body: JSON.stringify({ ...post, prevSlug: post.id || post.slug }),
    })
    return await res.json()
  } catch {
    return { ok: false, error: 'Network error while saving.' }
  }
}

export async function apiDeletePost(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}?slug=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'same-origin' })
    const json = await res.json()
    return !!json.ok
  } catch { return false }
}

/* ── Legacy sync stubs (kept so any stray importer still compiles). ── */
export function getAllPosts(): BlogPost[] { return [] }
export function getPublishedPosts(): BlogPost[] { return [] }
export function getPostById(_id: string): BlogPost | null { return null }
export function getPostBySlug(_slug: string): BlogPost | null { return null }
export function savePost(_post: BlogPost) {}
export function deletePost(_id: string) {}
