'use client'
import { useEffect, useState } from 'react'

type TocItem = { id: string; num: number; label: string }

export default function TermsTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const sections = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [items])

  return (
    <aside className="tm-toc" aria-label="Contents">
      <span className="tm-toc-label">On this page</span>
      <ol className="tm-toc-list">
        {items.map(i => (
          <li
            key={i.id}
            className={`tm-toc-item ${activeId === i.id ? 'tm-toc-item--active' : ''}`}
          >
            <a href={`#${i.id}`}>
              <span className="tm-toc-num">{String(i.num).padStart(2, '0')}</span>
              <span className="tm-toc-text">{i.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}
