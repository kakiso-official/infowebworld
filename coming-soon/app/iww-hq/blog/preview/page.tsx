'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { marked } from 'marked'
import Link from 'next/link'
import { fetchPostById, apiSavePost } from '../../data/blog-storage'
import type { BlogPost } from '../../data/blog-types'

export default function PreviewPost() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => { if (id) { fetchPostById(id).then(p => { if (p) setPost(p); else router.replace('/iww-hq/blog') }) } }, [id, router])
  if (!post) return null

  const html = marked.parse(post.body || '', { async: false }) as string
  const readTime = Math.max(1, Math.ceil((post.body?.split(/\s+/).length || 0) / 200))

  const publish = async () => {
    await apiSavePost({ ...post, status: 'published', publishedAt: post.publishedAt || new Date().toISOString(), updatedAt: new Date().toISOString() })
    router.push('/iww-hq/blog')
  }

  return (
    <>
      {/* Admin bar */}
      <div style={{ position: 'sticky', top: 56, zIndex: 20, display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.5rem 1.25rem', background: 'rgba(26,26,26,.95)', backdropFilter: 'blur(8px)', borderRadius: 14, marginBottom: '1.25rem', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: post.status === 'published' ? 'rgba(47,174,106,.15)' : 'rgba(245,158,11,.15)', color: post.status === 'published' ? '#2FAE6A' : '#F59E0B', textTransform: 'capitalize' }}>{post.status}</span>
        <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>Admin Preview</span>
        <div style={{ flex: 1 }} />
        <Link href={`/iww-hq/blog/edit?id=${post.id}`} style={{ fontSize: '.62rem', fontWeight: 700, color: 'rgba(255,255,255,.5)', textDecoration: 'none', padding: '.3rem .7rem', borderRadius: 999, border: '1px solid rgba(255,255,255,.15)', transition: 'all .2s' }}>Edit</Link>
        {post.status === 'draft' && (
          <button onClick={publish} style={{ fontSize: '.62rem', fontWeight: 700, color: '#fff', background: '#E8553D', border: 'none', padding: '.3rem .7rem', borderRadius: 999, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>Publish</button>
        )}
      </div>

      {/* Blog post preview — same layout as public */}
      <article style={{ maxWidth: 720, margin: '0 auto' }}>
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 20, marginBottom: '1.5rem', border: '1.5px solid var(--h-border)' }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.18rem .55rem', borderRadius: 999, background: 'rgba(67,97,238,.1)', color: '#4361EE' }}>{post.category}</span>
          <span style={{ fontSize: '.62rem', color: 'var(--h-muted)' }}>{readTime} min read</span>
        </div>

        <h1 style={{ fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--h-heading)', lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: '.65rem' }}>{post.title}</h1>

        <p style={{ fontSize: '.78rem', color: 'var(--h-muted)', marginBottom: '2rem' }}>
          By <strong style={{ color: 'var(--h-heading)' }}>{post.author}</strong> &middot; {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="blog-body" style={{ fontSize: '.92rem', lineHeight: 1.85, color: 'var(--h-body)', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: html }} />

        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--h-border-light)' }}>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: '.58rem', fontWeight: 700, padding: '.2rem .55rem', borderRadius: 999, background: 'var(--h-bg)', color: 'var(--h-muted)', border: '1px solid var(--h-border)' }}>{t}</span>
            ))}
          </div>
        )}
      </article>
    </>
  )
}
