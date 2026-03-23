'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { fetchAllPosts, apiDeletePost, apiSavePost } from '../data/blog-storage'
import type { BlogPost } from '../data/blog-types'

const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)
const Btn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
  <button {...p} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", transition: 'all .25s', textDecoration: 'none', ...p.style }}>{children}</button>
)

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const reload = async () => { setPosts(await fetchAllPosts()) }
  useEffect(() => { reload() }, [])

  const filtered = useMemo(() => posts.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    const matchF = filter === 'all' || p.status === filter
    return matchQ && matchF
  }), [posts, search, filter])

  const remove = async (id: string) => { if (!confirm('Delete this post?')) return; await apiDeletePost(id); await reload() }
  const togglePublish = async (post: BlogPost) => {
    await apiSavePost({ ...post, status: post.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString(), publishedAt: post.status === 'draft' ? new Date().toISOString() : post.publishedAt })
    await reload()
  }

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.75rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total Posts', v: posts.length, c: '#E8553D' },
          { l: 'Published', v: published, c: '#2FAE6A' },
          { l: 'Drafts', v: drafts, c: '#F59E0B' },
          { l: 'Total Posts', v: posts.length, c: '#3B82F6' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1rem 1.15rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <p style={{ fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.25rem' }}>{s.l}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />
        <div style={{ display: 'flex', gap: '.35rem' }}>
          {['all', 'published', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', fontFamily: "var(--font-nunito)", background: filter === f ? '#E8553D' : '#fff', color: filter === f ? '#fff' : 'var(--h-muted)', borderColor: filter === f ? '#E8553D' : 'var(--h-border)', transition: 'all .25s', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
        <Link href="/iww-hq/blog/new" style={{ padding: '.4rem 1rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "var(--font-nunito)", background: '#E8553D', color: '#fff', textDecoration: 'none', transition: 'all .25s' }}>New Post</Link>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {posts.length === 0 ? 'No blog posts yet. Create your first one!' : 'No posts match.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
              <thead>
                <tr>
                  {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => {
                  return (
                    <tr key={post.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                      <td style={{ padding: '.65rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                          {post.featured && <span style={{ fontSize: '.48rem', fontWeight: 700, padding: '.1rem .35rem', borderRadius: 999, background: '#E8553D15', color: '#E8553D' }}>Featured</span>}
                        </div>
                        <span style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--h-heading)', marginTop: post.featured ? '.15rem' : 0 }}>{post.title || 'Untitled'}</span>
                        <span style={{ fontSize: '.55rem', color: 'var(--h-muted)' }}>{post.readTime} min read</span>
                      </td>
                      <td style={{ padding: '.65rem 1rem' }}><Pill color="#4361EE">{post.category}</Pill></td>
                      <td style={{ padding: '.65rem 1rem' }}><Pill color={post.status === 'published' ? '#2FAE6A' : '#F59E0B'}>{post.status}</Pill></td>
                      <td style={{ padding: '.65rem 1rem' }}>
                        <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: "var(--font-nunito)" }}>—</span>
                      </td>
                      <td style={{ padding: '.65rem 1rem', fontSize: '.68rem', color: 'var(--h-muted)' }}>{post.updatedAt.slice(0, 10)}</td>
                      <td style={{ padding: '.65rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                          <Link href={`/iww-hq/blog/edit?id=${post.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>Edit</Link>
                          <Link href={`/iww-hq/blog/seo?id=${post.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>SEO</Link>
                          <Link href={`/iww-hq/blog/preview?id=${post.id}`} style={{ padding: '.2rem .5rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontFamily: "var(--font-nunito)", textDecoration: 'none' }}>Preview</Link>
                          <Btn onClick={() => togglePublish(post)} style={{ background: post.status === 'published' ? '#F59E0B15' : '#2FAE6A15', color: post.status === 'published' ? '#D97706' : '#2FAE6A', borderColor: 'transparent' }}>{post.status === 'published' ? 'Unpublish' : 'Publish'}</Btn>
                          <Btn onClick={() => remove(post.id)} style={{ color: '#E8553D', borderColor: 'rgba(232,85,61,.2)' }}>Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
