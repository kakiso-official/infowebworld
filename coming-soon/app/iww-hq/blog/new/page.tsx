'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlogEditor from '../../components/BlogEditor'
import { createEmptyPost, savePost, generateSlug } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

export default function NewPost() {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost>(createEmptyPost())

  const handleSave = (status: 'draft' | 'published') => {
    const slug = generateSlug(post.title || 'untitled')
    const now = new Date().toISOString()
    const final: BlogPost = {
      ...post, slug, status, updatedAt: now,
      publishedAt: status === 'published' ? now : null,
      seo: { ...post.seo, metaTitle: post.seo.metaTitle || post.title, metaDescription: post.seo.metaDescription || post.excerpt },
    }
    savePost(final)
    router.push('/iww-hq/blog')
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '1.25rem' }}>Create New Post</h2>
        <BlogEditor post={post} onChange={setPost} onSave={handleSave} onCancel={() => router.push('/iww-hq/blog')} />
      </div>
    </div>
  )
}
