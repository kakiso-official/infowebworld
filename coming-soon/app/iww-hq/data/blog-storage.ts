import type { BlogPost } from './blog-types'

const KEY = 'iww_blog_posts'

function read(): BlogPost[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function write(posts: BlogPost[]) {
  localStorage.setItem(KEY, JSON.stringify(posts))
}

export function getAllPosts(): BlogPost[] {
  return read().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getPublishedPosts(): BlogPost[] {
  return read().filter(p => p.status === 'published').sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
}

export function getPostById(id: string): BlogPost | null {
  return read().find(p => p.id === id) || null
}

export function getPostBySlug(slug: string): BlogPost | null {
  return read().find(p => p.slug === slug && p.status === 'published') || null
}

export function savePost(post: BlogPost) {
  const posts = read()
  const idx = posts.findIndex(p => p.id === post.id)
  if (idx >= 0) posts[idx] = post; else posts.push(post)
  write(posts)
}

export function deletePost(id: string) {
  write(read().filter(p => p.id !== id))
}

export function generateSlug(title: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  const existing = read().map(p => p.slug)
  let slug = base; let i = 1
  while (existing.includes(slug)) { slug = `${base}-${i}`; i++ }
  return slug
}

export function createEmptyPost(): BlogPost {
  return {
    id: crypto.randomUUID(), slug: '', title: '', excerpt: '', body: '', coverImage: '',
    author: 'InfoWebWorld Team', category: 'Business Tips', tags: [], featured: false, readTime: 1,
    status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), publishedAt: null,
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '', noIndex: false },
  }
}
