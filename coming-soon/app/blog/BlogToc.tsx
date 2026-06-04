'use client'
import { useState, useEffect } from 'react'

export type TocItem = { id: string; text: string; level: number }

/* Sticky table-of-contents with scroll-spy. Highlights the section currently
   in view and smooth-scrolls on click. Headings get their ids server-side in
   the post page (buildToc). */
export default function BlogToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id || '')

  useEffect(() => {
    if (!items.length) return
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-84px 0px -68% 0px', threshold: 0 },
    )
    items.forEach(i => { const el = document.getElementById(i.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [items])

  if (items.length < 2) return null

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    /* Scroll the page so the section lands just below the sticky navbar.
       window.scrollTo gives reliable offset control (scrollIntoView ignores it). */
    const top = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  return (
    <nav className="bp-toc" aria-label="Table of contents">
      <span className="bp-toc-title">Table of Contents</span>
      <ul className="bp-toc-list">
        {items.map(i => (
          <li key={i.id} className={`bp-toc-item bp-toc-l${i.level}${active === i.id ? ' bp-toc-item--on' : ''}`}>
            <a href={`#${i.id}`} onClick={e => go(e, i.id)}>{i.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
