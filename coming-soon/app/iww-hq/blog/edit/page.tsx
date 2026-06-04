'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BlogStudio from '../BlogStudio'
import { fetchPostById } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

export default function EditPostPage() {
  const router = useRouter()
  const id = useSearchParams().get('id')
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!id) { router.replace('/iww-hq/blog'); return }
    fetchPostById(id).then(p => {
      if (cancelled) return
      if (p) setPost(p); else router.replace('/iww-hq/blog')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [id, router])

  if (loading || !post) {
    return <div style={{ padding: '2.5rem 1rem', color: '#6B7280', fontSize: '.85rem' }}>Loading post…</div>
  }
  return <BlogStudio initial={post} isNew={false} />
}
