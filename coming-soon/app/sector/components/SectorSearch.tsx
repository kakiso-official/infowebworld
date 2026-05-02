'use client'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { I, ic, getIconPath } from '../../components/icons'
import HIcon from './HIcon'
import Stars from '../../components-category/Stars'
import type { Category } from '../../iww-hq/data/category-storage'
import type { SectorDemo } from '../sector-demo-data'

type Props = { sectorName: string; shortName: string; color: string; sectorSlug: string; l2Cats: Category[]; l3Cats: Category[]; demos: SectorDemo[] }
type ResultGroup = { label: string; iconKey: string; items: ResultItem[] }
type ResultItem = { type: 'category' | 'subcategory' | 'listing'; name: string; href: string; meta?: string; score?: number; reviews?: number; icon?: string; color?: string; badges?: string[] }

export default function SectorSearch({ sectorName, shortName, color, sectorSlug, l2Cats, l3Cats, demos }: Props) {
  const router = useRouter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const results = useMemo<ResultGroup[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []
    const groups: ResultGroup[] = []

    const catMatches = l2Cats.filter(c => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)).slice(0, 4)
    if (catMatches.length) groups.push({ label: 'Categories', iconKey: 'grid', items: catMatches.map(c => ({ type: 'category', name: c.name, href: `/${sectorSlug}/${c.slug}`, meta: `${l3Cats.filter(l3 => l3.parentId === c.id).length} subcategories`, icon: c.icon || 'grid', color })) })

    const subMatches = l3Cats.filter(c => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)).slice(0, 5)
    if (subMatches.length) groups.push({ label: 'Subcategories', iconKey: 'layers', items: subMatches.map(c => { const p = l2Cats.find(x => x.id === c.parentId); return { type: 'subcategory', name: c.name, href: `/${sectorSlug}/${c.slug}`, meta: p ? p.name : sectorName, icon: c.icon || 'layers', color } }) })

    const listMatches = demos.filter(d => d.name.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)).slice(0, 6)
    if (listMatches.length) groups.push({ label: 'Listings', iconKey: 'star', items: listMatches.map(d => ({ type: 'listing', name: d.name, href: '/business', meta: d.tagline, score: d.score, reviews: d.reviews, icon: d.icon, color: d.color, badges: d.badges })) })

    return groups
  }, [query, l2Cats, l3Cats, demos, color, sectorName, sectorSlug])

  const flatItems = useMemo(() => results.flatMap(g => g.items), [results])
  const totalResults = flatItems.length

  useEffect(() => {
    function h(e: MouseEvent) { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return }
    if (!open || !totalResults) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(p => (p + 1) % totalResults) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(p => (p - 1 + totalResults) % totalResults) }
    else if (e.key === 'Enter' && activeIdx >= 0 && activeIdx < totalResults) { e.preventDefault(); router.push(flatItems[activeIdx].href); setOpen(false); setQuery('') }
  }, [open, totalResults, activeIdx, flatItems, router])

  useEffect(() => { setActiveIdx(-1) }, [query])

  const showDropdown = open && results.length > 0
  let flatIdx = -1

  return (
    <div className="sl-search" ref={wrapRef}>
      <div className={`sl-search-bar${showDropdown ? ' sl-search-bar--open' : ''}`}>
        <I d={ic.search} size={18} color="var(--h-muted)" sw={2} />
        <input ref={inputRef} type="text" className="sl-search-input" placeholder={`Search ${shortName} categories, tools and services...`} value={query} onChange={e => { setQuery(e.target.value); setOpen(true) }} onFocus={() => { if (query.trim().length >= 2) setOpen(true) }} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} />
        {query && <button className="sl-search-clear" onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }} type="button" aria-label="Clear"><I d={ic.x} size={16} color="var(--h-muted)" sw={2} /></button>}
      </div>

      {showDropdown && (
        <div className="sl-search-dropdown">
          {results.map(group => (
            <div key={group.label} className="sl-search-group">
              <div className="sl-search-group-label"><I d={getIconPath(group.iconKey)} size={14} color={color} sw={2} />{group.label}<span className="sl-search-group-count">{group.items.length}</span></div>
              {group.items.map(item => {
                flatIdx++
                const idx = flatIdx
                return (
                  <Link key={`${item.type}-${item.name}-${idx}`} href={item.href} className={`sl-search-item${idx === activeIdx ? ' sl-search-item--active' : ''}`} onClick={() => { setOpen(false); setQuery('') }} onMouseEnter={() => setActiveIdx(idx)}>
                    <div className="sl-search-item-icon" style={{ background: `${item.color || color}14` }}>
                      {item.type === 'listing' ? <HIcon name={item.icon || 'grid'} size={18} color={item.color || color} sw={1.5} /> : <I d={getIconPath(item.type === 'category' ? 'grid' : 'layers')} size={16} color={color} sw={2} />}
                    </div>
                    <div className="sl-search-item-body">
                      <span className="sl-search-item-name">{highlight(item.name, query)}</span>
                      {item.type === 'listing' && item.score ? (
                        <span className="sl-search-item-meta"><span className="sl-search-item-score">{item.score.toFixed(1)}</span><Stars rating={Math.round(item.score)} size={11} /><span className="sl-search-item-reviews">({item.reviews})</span>{item.badges?.includes('verified') && <span className="sl-search-item-badge"><I d={ic.check} size={9} color="#2FAE6A" sw={3} /> Verified</span>}</span>
                      ) : <span className="sl-search-item-meta">{item.meta}</span>}
                    </div>
                    <I d={ic.arrow} size={14} color="var(--h-muted)" sw={2} />
                  </Link>
                )
              })}
            </div>
          ))}
          <div className="sl-search-footer"><span>{totalResults} result{totalResults !== 1 ? 's' : ''} in {sectorName}</span></div>
        </div>
      )}

      {open && query.trim().length >= 2 && !results.length && (
        <div className="sl-search-dropdown">
          <div className="sl-search-empty"><I d={ic.search} size={24} color="var(--h-muted)" sw={1.5} /><p>No results for &ldquo;{query}&rdquo; in {shortName}</p><span>Try a different keyword or browse categories below</span></div>
        </div>
      )}
    </div>
  )
}

function highlight(text: string, query: string) {
  const q = query.trim().toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return <>{text.slice(0, idx)}<mark className="sl-search-mark">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>
}
