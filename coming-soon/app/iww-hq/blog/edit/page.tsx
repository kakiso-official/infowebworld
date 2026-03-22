'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BlogEditor from '../../components/BlogEditor'
import { getPostById, savePost, generateSlug } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

export default function EditPost() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    if (id) { const p = getPostById(id); if (p) setPost(p); else router.replace('/iww-hq/blog') }
  }, [id, router])

  if (!post) return null

  const handleSave = (status: 'draft' | 'published') => {
    const now = new Date().toISOString()
    const slug = post.slug || generateSlug(post.title || 'untitled')
    const final: BlogPost = {
      ...post, slug, status, updatedAt: now,
      publishedAt: status === 'published' ? (post.publishedAt || now) : post.publishedAt,
    }
    savePost(final)
    router.push('/iww-hq/blog')
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '1.25rem' }}>Edit Post</h2>
        <BlogEditor post={post} onChange={setPost} onSave={handleSave} onCancel={() => router.push('/iww-hq/blog')} />
      </div>
    </div>
  )
}
