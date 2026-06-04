'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faPenToSquare, faTrashCan, faEye, faPaperPlane, faBan,
  faNewspaper, faCircleCheck, faPenRuler, faFolderOpen, faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { fetchAllPosts, apiDeletePost, apiSavePost } from '../data/blog-storage'
import type { BlogPost } from '../data/blog-types'

const ACT: React.CSSProperties = {
  width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 8, fontSize: '.8rem', cursor: 'pointer', border: '1.5px solid var(--h-border, #E8E3DE)',
  background: '#fff', color: 'var(--h-heading, #1A1A1A)', textDecoration: 'none',
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)

  const reload = async () => { setPosts(await fetchAllPosts()); setLoading(false) }
  useEffect(() => { reload() }, [])

  const filtered = useMemo(() => posts.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    return matchQ && (filter === 'all' || p.status === filter)
  }), [posts, search, filter])

  const remove = async (id: string) => { if (!confirm('Delete this post? This removes its markdown file.')) return; await apiDeletePost(id); await reload() }
  const togglePublish = async (post: BlogPost) => {
    const now = new Date().toISOString()
    await apiSavePost({
      ...post,
      status: post.status === 'published' ? 'draft' : 'published',
      publishedAt: post.status === 'draft' ? (post.publishedAt || now) : post.publishedAt,
    })
    await reload()
  }

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length
  const cards = [
    { l: 'Total Posts', v: posts.length, c: '#E8553D', icon: faNewspaper },
    { l: 'Published', v: published, c: '#2FAE6A', icon: faCircleCheck },
    { l: 'Drafts', v: drafts, c: '#F59E0B', icon: faPenRuler },
    { l: 'Categories', v: new Set(posts.map(p => p.category).filter(Boolean)).size, c: '#3B82F6', icon: faFolderOpen },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '.7rem', marginBottom: '.85rem' }}>
        {cards.map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', display: 'flex', alignItems: 'center', gap: '.7rem' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `${s.c}15`, color: s.c, fontSize: '.85rem', flexShrink: 0 }}>
              <FontAwesomeIcon icon={s.icon} />
            </span>
            <div>
              <p style={{ fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', margin: 0 }}>{s.l}</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--h-heading)', lineHeight: 1.1, margin: 0 }}>{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--h-muted)', fontSize: '.78rem' }} />
          <input type="text" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: 32 }} />
        </div>
        <div style={{ display: 'flex', gap: '.35rem' }}>
          {(['all', 'published', 'draft'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '.45rem .85rem', borderRadius: 999, fontSize: '.66rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid', textTransform: 'capitalize', background: filter === f ? '#E8553D' : '#fff', color: filter === f ? '#fff' : 'var(--h-muted)', borderColor: filter === f ? '#E8553D' : 'var(--h-border)' }}>{f}</button>
          ))}
        </div>
        <Link href="/iww-hq/blog/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '.5rem 1rem', borderRadius: 999, fontSize: '.7rem', fontWeight: 700, background: '#E8553D', color: '#fff', textDecoration: 'none' }}>
          <FontAwesomeIcon icon={faPlus} /> New Post
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {posts.length === 0 ? 'No posts yet. Click “New Post” to write your first one.' : 'No posts match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  {['Title', 'Category', 'Status', 'Updated', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id || post.slug} style={{ borderBottom: '1px solid var(--h-border-light, #F0ECE8)' }}>
                    <td style={{ padding: '.6rem 1rem' }}>
                      {post.featured && <span style={{ fontSize: '.46rem', fontWeight: 700, padding: '.1rem .35rem', borderRadius: 999, background: '#E8553D15', color: '#E8553D', textTransform: 'uppercase', letterSpacing: '.04em' }}>Featured</span>}
                      <span style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, color: 'var(--h-heading)', marginTop: post.featured ? '.15rem' : 0 }}>{post.title || 'Untitled'}</span>
                      <span style={{ fontSize: '.56rem', color: 'var(--h-muted)' }}>/blog/{post.slug} · {post.readTime} min</span>
                    </td>
                    <td style={{ padding: '.6rem 1rem' }}><span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.18rem .5rem', borderRadius: 999, background: '#4361EE15', color: '#4361EE' }}>{post.category}</span></td>
                    <td style={{ padding: '.6rem 1rem' }}><span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.18rem .5rem', borderRadius: 999, textTransform: 'capitalize', background: post.status === 'published' ? '#2FAE6A15' : '#F59E0B15', color: post.status === 'published' ? '#1F9D63' : '#B45309' }}>{post.status}</span></td>
                    <td style={{ padding: '.6rem 1rem', fontSize: '.66rem', color: 'var(--h-muted)' }}>{(post.updatedAt || post.publishedAt || post.createdAt || '').slice(0, 10) || '—'}</td>
                    <td style={{ padding: '.6rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '.3rem' }}>
                        <Link href={`/iww-hq/blog/edit?id=${encodeURIComponent(post.id || post.slug)}`} title="Edit" style={ACT}><FontAwesomeIcon icon={faPenToSquare} /></Link>
                        {post.status === 'published' && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" title="View live" style={ACT}><FontAwesomeIcon icon={faEye} /></a>
                        )}
                        <button onClick={() => togglePublish(post)} title={post.status === 'published' ? 'Unpublish' : 'Publish'} style={{ ...ACT, color: post.status === 'published' ? '#B45309' : '#1F9D63', borderColor: post.status === 'published' ? '#F59E0B40' : '#2FAE6A40' }}><FontAwesomeIcon icon={post.status === 'published' ? faBan : faPaperPlane} /></button>
                        <button onClick={() => remove(post.id || post.slug)} title="Delete" style={{ ...ACT, color: '#E8553D', borderColor: 'rgba(232,85,61,.25)' }}><FontAwesomeIcon icon={faTrashCan} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
