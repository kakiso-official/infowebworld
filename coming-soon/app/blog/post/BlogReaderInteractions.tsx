'use client'
import { useState, useEffect, useRef } from 'react'
import { trackBlogView } from '../../iww-hq/data/visitor-tracking'

/* Client-only chrome for a (statically rendered) blog post:
   - top reading-progress bar
   - share buttons (X / LinkedIn / copy link)
   - view + read-time + share tracking
   The article body itself is server-rendered static HTML in the parent. */
export default function BlogReaderInteractions({ slug, title }: { slug: string; title: string }) {
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const start = useRef(Date.now())

  /* View on mount; read-time on unmount. */
  useEffect(() => {
    trackBlogView(slug)
    const startedAt = start.current
    return () => {
      const secs = Math.round((Date.now() - startedAt) / 1000)
      if (secs > 5) trackBlogView(slug, secs)
    }
  }, [slug])

  /* Reading progress (document scroll). */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.infowebworld.com/blog/${slug}`
  const btn = (active = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '.4rem',
    padding: '.5rem .9rem', borderRadius: 999,
    border: '1.5px solid var(--bl-line, #ECE6E0)',
    background: active ? 'rgba(47,174,106,.1)' : '#fff',
    fontSize: '.74rem', fontWeight: 650,
    color: active ? '#1F9D63' : 'var(--bl-body, #4D4742)',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
  })

  const onCopy = () => { navigator.clipboard.writeText(shareUrl); trackBlogView(slug, undefined, true); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const onTwitter = () => { trackBlogView(slug, undefined, true); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank') }
  const onLinkedIn = () => { trackBlogView(slug, undefined, true); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank') }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: 'var(--h-border)' }}>
        <div style={{ height: '100%', background: '#E8553D', transition: 'width .1s', width: `${progress}%` }} />
      </div>

      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={onTwitter} style={btn()}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
          Share on X
        </button>
        <button onClick={onLinkedIn} style={btn()}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          LinkedIn
        </button>
        <button onClick={onCopy} style={btn(copied)}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </>
  )
}
