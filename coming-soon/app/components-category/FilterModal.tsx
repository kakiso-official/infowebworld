'use client'
import { useEffect, useRef } from 'react'
import { I, ic } from './icons'

type Item = { slug: string; name: string; count?: number; group?: string }

type Props = {
  title: string
  items: Item[]
  selected: Set<string>
  onToggle: (slug: string) => void
  onClose: () => void
  color: string
}

export default function FilterModal({ title, items, selected, onToggle, onClose, color }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  // If items have group field, group by that; otherwise group alphabetically by first letter
  const hasGroups = items.some(i => i.group)
  const grouped = new Map<string, Item[]>()
  for (const item of items) {
    const key = hasGroups
      ? (item.group || 'Other')
      : (() => { const l = item.name.charAt(0).toUpperCase(); return /[A-Z]/.test(l) ? l : '#' })()
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }
  const sortedKeys = hasGroups
    ? Array.from(grouped.keys()) // preserve insertion order for L4 groups
    : Array.from(grouped.keys()).sort((a, b) => a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b))

  return (
    <div className="cd-fm-overlay" ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }}>
      <div className="cd-fm-panel">
        {/* Header */}
        <div className="cd-fm-header">
          <h3 className="cd-fm-title">{title}</h3>
          <button className="cd-fm-close" onClick={onClose} aria-label="Close">
            <I d={ic.x} size={20} color="var(--h-heading)" sw={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="cd-fm-body">
          {sortedKeys.map(letter => (
            <div key={letter}>
              <div className="cd-fm-letter-bar">
                <span className="cd-fm-letter" style={{ color }}>{letter}</span>
              </div>
              <div className="cd-fm-grid">
                {grouped.get(letter)!.map(item => {
                  const checked = selected.has(item.slug)
                  return (
                    <label key={item.slug} className="cd-fm-checkbox">
                      <input type="checkbox" checked={checked} onChange={() => onToggle(item.slug)} />
                      <span className="cd-fm-box" style={checked ? { background: color, borderColor: color } : undefined}>
                        {checked && <I d={ic.check} size={10} color="#fff" sw={2.5} />}
                      </span>
                      <span className="cd-fm-label">{item.name}</span>
                      {item.count !== undefined && <span className="cd-fm-count">({item.count})</span>}
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
