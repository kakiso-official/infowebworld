'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { BASE } from '../config/base-path'
import GlobalSearch from './GlobalSearch'
import UserMenu from './auth/UserMenu'
import { useAuth } from '@/lib/use-auth'
import SignupModal from './auth/SignupModal'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'

/* ════════════════════════════════════════════════════════════════════
   InfoWebWorld site header — single-row, GoodFirms-style.

   Layout:
     Logo  ─  Find by Services ▾  Find by Solutions ▾  Resources ▾  ─  🔍  Write a Review  Sign in  [Get Listed]

   Mega-menus:
     Services  →  full-width: left list of 6 sectors + right 2-col tile grid of L2 categories
     Solutions →  full-width: single 2-col tile grid of curated outcomes
     Resources →  narrow dropdown anchored under the link

   Search icon expands inline (replacing the nav cluster) when clicked; X to close.

   Props (kept for back-compat with existing pages):
     sectorSlug — accepted but unused in this redesign
     hideSearch — when true, the search icon is removed
   ════════════════════════════════════════════════════════════════════ */

/* ── L1 sectors with their human header. Slugs match app/config/categories-data.ts. ── */
const SECTORS: { slug: string; label: string; color: string }[] = [
  { slug: 'software-saas',            label: 'Software & SaaS',       color: '#3B82F6' },
  { slug: 'ai-ml',                    label: 'AI & ML',               color: '#8B5CF6' },
  { slug: 'it-services-agencies',     label: 'IT Services & Agencies', color: '#14B8A6' },
  { slug: 'startups-innovation',      label: 'Startups & Innovation', color: '#E8553D' },
  { slug: 'local-businesses',         label: 'Local Businesses',      color: '#F59E0B' },
  { slug: 'professional-services',    label: 'Professional Services', color: '#2FAE6A' },
]

/* Solutions = curated outcomes (not categories). Each tile points at a
   meaningful destination in our app, with a short subtitle for context. */
type Soln = {
  label: string; href: string; sub: string; iconKey: SolnIconKey
  comingSoon?: boolean
}
type SolnIconKey = 'saas' | 'ai' | 'agency' | 'local' | 'compare' | 'news' | 'review' | 'startup'
const SOLUTIONS: Soln[] = [
  { label: 'Write a Review', href: '/write-review', sub: 'Share your experience with a company',   iconKey: 'review' },
  { label: 'Compare Tools',  href: '/compare',      sub: 'Side-by-side product comparisons',       iconKey: 'compare' },
  { label: 'Industry News',  href: '/news',         sub: 'Daily headlines from global publishers', iconKey: 'news' },
]

const RESOURCES: { label: string; href: string }[] = [
  { label: 'Insights',  href: '/insights'  },
  { label: 'Blog',      href: '/blog'      },
  { label: 'News',      href: '/news'      },
  { label: 'FAQs',      href: '/faqs'      },
  { label: 'Glossary',  href: '/glossary'  },
  { label: 'Help',      href: '/help'      },
  { label: 'About',     href: '/about'     },
]

/* ── L2 children of a sector, drawn synchronously from the static taxonomy.
   Returns the top N L2 categories so the tile grid stays focused. ── */
function l2sOfSector(slug: string, limit = 10): { name: string; slug: string; color: string }[] {
  const l1 = STATIC_CATEGORIES.find(c => c.slug === slug && c.level === 1)
  if (!l1) return []
  return STATIC_CATEGORIES
    .filter(c => c.parent_id === l1.id && c.level === 2)
    .slice(0, limit)
    .map(c => ({ name: c.name, slug: c.slug, color: c.color || '#6B7280' }))
}

/* ── Chevrons + arrows ──────────────────────────────────────────────── */
const ChevDown = () => (
  <svg className="iw-chev-d" width="11" height="11" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const ChevRight = () => (
  <svg className="iw-chev-r" width="11" height="11" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 6 15 12 9 18" />
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconHamburger = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

/* Solution-tile icons — kept tiny and inline so this file stays single. */
function SolnIcon({ k }: { k: SolnIconKey }) {
  const props = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none',
                  stroke: 'currentColor', strokeWidth: 1.8,
                  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
                  'aria-hidden': true }
  switch (k) {
    case 'saas':   return <svg {...props}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>
    case 'ai':     return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
    case 'agency': return <svg {...props}><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/></svg>
    case 'local':  return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
    case 'compare':return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    case 'news':   return <svg {...props}><path d="M4 22h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3v3l-2-2-2 2V4H4a2 2 0 0 0-2 2v14a2 2 0 0 1-2 2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
    case 'review': return <svg {...props}><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
    case 'startup':return <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
  }
}

/* ── Category icon set — semantic icons mapped from L2 category names.
   Keyword-driven so taxonomy can grow without re-mapping every entry.
   Each icon stays minimal-stroke (1.7px) so they read well at the
   32x32 size used in the Services tile. ── */
type CatIconKey =
  | 'code' | 'cube' | 'palette' | 'megaphone' | 'chart' | 'shield' | 'lightning' | 'cart'
  | 'dollar' | 'users' | 'heart' | 'brain' | 'book' | 'briefcase' | 'building' | 'message'
  | 'headphones' | 'cloud' | 'globe' | 'search' | 'layers' | 'image' | 'video' | 'mic'
  | 'rocket' | 'leaf' | 'scale' | 'key' | 'camera' | 'calendar' | 'map' | 'terminal'
  | 'hammer' | 'wrench' | 'car' | 'coffee' | 'utensils' | 'bed' | 'pen' | 'graduation'
  | 'gamepad' | 'paw' | 'scissors' | 'spark' | 'grid' | 'flask' | 'shopping-bag'

function CatIcon({ k }: { k: CatIconKey }) {
  const p = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none',
              stroke: 'currentColor', strokeWidth: 1.7,
              strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
              'aria-hidden': true }
  switch (k) {
    case 'code':       return <svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    case 'cube':       return <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    case 'palette':    return <svg {...p}><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9-10-9z"/></svg>
    case 'megaphone':  return <svg {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
    case 'chart':      return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'shield':     return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'lightning':  return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    case 'cart':       return <svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    case 'dollar':     return <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    case 'users':      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'heart':      return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case 'brain':      return <svg {...p}><path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18zM12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18z"/></svg>
    case 'book':       return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case 'briefcase':  return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    case 'building':   return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
    case 'message':    return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    case 'headphones': return <svg {...p}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    case 'cloud':      return <svg {...p}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
    case 'globe':      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>
    case 'search':     return <svg {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    case 'layers':     return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    case 'image':      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    case 'video':      return <svg {...p}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    case 'mic':        return <svg {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
    case 'rocket':     return <svg {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12l-3-3"/></svg>
    case 'leaf':       return <svg {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1 7.95.13 11.27-3.7 14.7C13 19.36 11 20 11 20zM2 21c0-3 1.85-5.36 5.08-6"/></svg>
    case 'scale':      return <svg {...p}><path d="M16 16l3-8 3 8c-2 1-4 1-6 0M2 16l3-8 3 8c-2 1-4 1-6 0M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
    case 'key':        return <svg {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
    case 'camera':     return <svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
    case 'calendar':   return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    case 'map':        return <svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    case 'terminal':   return <svg {...p}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
    case 'hammer':     return <svg {...p}><path d="M14 8l-7 7-3-3 7-7 3 3zm0 0l5 5-3 3-5-5 3-3zm0 0l5-5h4v4l-5 5"/></svg>
    case 'wrench':     return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    case 'car':        return <svg {...p}><path d="M5 17h14v-5l-2-5H7l-2 5v5z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
    case 'coffee':     return <svg {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
    case 'utensils':   return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
    case 'bed':        return <svg {...p}><path d="M2 22V12h20v10M2 18h20M2 12v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M6 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
    case 'pen':        return <svg {...p}><path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
    case 'graduation': return <svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    case 'gamepad':    return <svg {...p}><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15" y2="13"/><line x1="18" y1="11" x2="18" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/></svg>
    case 'paw':        return <svg {...p}><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="7" cy="14" r="2"/><path d="M11 22a7 7 0 0 1-6.5-9.5L7 9c.8-1.4 2.2-2 4-2s3.2.6 4 2l2.5 3.5a7 7 0 0 1-6.5 9.5z"/></svg>
    case 'scissors':   return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
    case 'spark':      return <svg {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>
    case 'grid':       return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    case 'flask':      return <svg {...p}><path d="M10 2v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V2M8 2h8"/></svg>
    case 'shopping-bag': return <svg {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
  }
}

/* Map an L2 category name → icon key. Keyword-driven, ordered by
   specificity (first match wins). Falls back to a sector-appropriate
   default so unmatched names still get a sensible glyph. */
function iconForCategory(name: string, sectorSlug: string): CatIconKey {
  const n = name.toLowerCase()

  /* Specific keyword maps — ordered by priority. */
  if (/\bcrm\b|sales\b/.test(n))                            return 'users'
  if (/marketing|growth|advertis|pr\b|communications/.test(n)) return 'megaphone'
  if (/ecommerce|e-commerce|retail|shop|boutique/.test(n))  return 'cart'
  if (/hr\b|workforce|people|talent|recruit|staffing/.test(n)) return 'users'
  if (/financ|account|tax|payment|wealth|invest|funding|venture|capital|angel|fintech/.test(n)) return 'dollar'
  if (/developer|engineering tool|devops|code|software development|web design|web app|mobile app|api/.test(n)) return 'code'
  if (/project|task management|work management/.test(n))    return 'briefcase'
  if (/customer service|support/.test(n))                   return 'headphones'
  if (/communication|collab|chat|messaging/.test(n))        return 'message'
  if (/health|medical|medtech|doctor|specialist|mental/.test(n)) return 'heart'
  if (/security|cyber|privacy|risk|compliance|audit/.test(n)) return 'shield'
  if (/data\b|analytic|bi\b|business intelligence/.test(n))   return 'chart'
  if (/design|creative|brand|asset|ux|ui\b|architecture|architect/.test(n)) return 'palette'
  if (/education|academic|learning|tutor|test prep|school|edtech|coaching|training|l&d/.test(n)) return 'graduation'
  if (/legal|law/.test(n))                                  return 'scale'
  if (/erp|business operations/.test(n))                    return 'building'
  if (/ai\b|machine learning|generative|ml\b/.test(n))      return 'spark'
  if (/writing|text|content|editing|translation|research/.test(n)) return 'pen'
  if (/image|photo|graphic/.test(n))                        return 'image'
  if (/video|film/.test(n))                                 return 'video'
  if (/audio|music|sound|podcast/.test(n))                  return 'mic'
  if (/no.code|builder|app builder/.test(n))                return 'grid'
  if (/agent|framework|infrastructure|cloud|hosting/.test(n)) return 'cloud'
  if (/seo|search optim/.test(n))                           return 'search'
  if (/social media/.test(n))                               return 'megaphone'
  if (/it staffing|managed it|msp/.test(n))                 return 'terminal'
  if (/photography/.test(n))                                return 'camera'
  if (/web3|crypto|blockchain|nft/.test(n))                 return 'cube'
  if (/robotics|hardware|deeptech/.test(n))                 return 'cube'
  if (/climate|energy|sustainability|esg|environment/.test(n)) return 'leaf'
  if (/gaming|esports/.test(n))                             return 'gamepad'
  if (/restaurant|cuisine|food/.test(n))                    return 'utensils'
  if (/beauty|spa|hair|salon/.test(n))                      return 'scissors'
  if (/home.*(repair|improve)|repair|construction/.test(n)) return 'hammer'
  if (/automotive|auto|car/.test(n))                        return 'car'
  if (/active life|recreation|sport|fitness/.test(n))       return 'lightning'
  if (/pet/.test(n))                                        return 'paw'
  if (/wedding|event/.test(n))                              return 'calendar'
  if (/coffee|tea|beverage|bar|nightlife/.test(n))          return 'coffee'
  if (/cleaning|restoration|pest/.test(n))                  return 'flask'
  if (/hotel|lodging|travel/.test(n))                       return 'bed'
  if (/religious|community|civic|center/.test(n))           return 'building'
  if (/real estate|property/.test(n))                       return 'key'
  if (/strategy|management consult|puzzle/.test(n))         return 'briefcase'
  if (/engineering firm|wrench/.test(n))                    return 'wrench'
  if (/accelerator|incubator|program/.test(n))              return 'rocket'
  if (/ecosystem|city|region|map/.test(n))                  return 'map'
  if (/vertical|industries|sector/.test(n))                 return 'layers'
  if (/business model/.test(n))                             return 'grid'
  if (/professional development|coaching/.test(n))          return 'briefcase'

  /* Sector fallbacks — every sector has a sensible default glyph. */
  switch (sectorSlug) {
    case 'ai-ml':                 return 'spark'
    case 'software-saas':         return 'code'
    case 'it-services-agencies':  return 'briefcase'
    case 'startups-innovation':   return 'rocket'
    case 'local-businesses':      return 'shopping-bag'
    case 'professional-services': return 'briefcase'
    default:                      return 'grid'
  }
}

type ActiveDD = 'services' | 'solutions' | 'resources' | null

export default function Navbar(
  // Accept (and ignore) prior props for back-compat.
  { hideSearch }: { sectorSlug?: string; hideSearch?: boolean } = {}
) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeDD, setActiveDD] = useState<ActiveDD>(null)
  const [activeSector, setActiveSector] = useState<string>(SECTORS[0].slug)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobOpen, setMobOpen] = useState<'services' | 'solutions' | 'resources' | null>(null)
  const [mobAuthOpen, setMobAuthOpen] = useState(false)

  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const { user, logout } = useAuth()

  /* Scroll behaviour — RAF-throttled. */
  useEffect(() => {
    let ticking = false
    const fn = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 4)
        setHidden(y > lastY.current && y > 80)
        lastY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Body scroll lock for mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Esc closes anything open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (searchOpen) setSearchOpen(false)
      else if (activeDD) setActiveDD(null)
      else if (menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, activeDD, menuOpen])

  /* Click-outside the header closes any open dropdown. */
  useEffect(() => {
    if (!activeDD) return
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDD(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [activeDD])

  const toggleDD = useCallback((key: NonNullable<ActiveDD>) => {
    setActiveDD(prev => prev === key ? null : key)
  }, [])
  const closeDD = useCallback(() => setActiveDD(null), [])

  const headerCls = [
    'iw-head',
    scrolled && 'iw-head--scrolled',
    hidden && !menuOpen && !activeDD && !searchOpen && 'iw-head--hidden',
  ].filter(Boolean).join(' ')

  const activeL2s = l2sOfSector(activeSector, 10)

  return (
    <>
      <header className={headerCls} ref={headerRef}>
        <div className="iw-head-inner">
          {/* ── Mobile burger / X toggle — sits before the logo on
                 mobile (per the GoodFirms reference). Hidden via CSS on
                 desktop. Toggles between hamburger and X when the
                 sheet is open. */}
          <button
            type="button"
            className="iw-burger"
            onClick={() => { setMenuOpen(o => !o); setActiveDD(null); setSearchOpen(false) }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconX /> : <IconHamburger />}
          </button>

          {/* ── Logo ── */}
          <Link href="/" className="iw-logo" onClick={() => { closeDD(); setMenuOpen(false) }}>
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          {/* ── Center nav (hidden while search is expanded) ── */}
          {!searchOpen && (
            <nav className="iw-nav" aria-label="Primary">
              <div className="iw-nav-item">
                <button type="button"
                  className={'iw-nav-link' + (activeDD === 'services' ? ' iw-nav-link--active' : '')}
                  onClick={() => toggleDD('services')}
                  aria-expanded={activeDD === 'services'}>
                  Find by Services <ChevDown />
                </button>
              </div>
              <div className="iw-nav-item">
                <button type="button"
                  className={'iw-nav-link' + (activeDD === 'solutions' ? ' iw-nav-link--active' : '')}
                  onClick={() => toggleDD('solutions')}
                  aria-expanded={activeDD === 'solutions'}>
                  Find by Solutions <ChevDown />
                </button>
              </div>
              <div className="iw-nav-item">
                <button type="button"
                  className={'iw-nav-link' + (activeDD === 'resources' ? ' iw-nav-link--active' : '')}
                  onClick={() => toggleDD('resources')}
                  aria-expanded={activeDD === 'resources'}>
                  Resources <ChevDown />
                </button>
              </div>
            </nav>
          )}

          {/* ── Expanded search — direct child of .iw-head-inner so its
                 flex:1 actually wins the row (sibling of .iw-right, not
                 buried inside it). Hidden by default; replaces .iw-nav. */}
          {!hideSearch && searchOpen && (
            <div className="iw-search-expanded">
              <GlobalSearch placeholder="Search businesses, tools, categories" autoFocus />
              <button type="button" className="iw-search-close"
                onClick={() => setSearchOpen(false)} aria-label="Close search">
                <IconX />
              </button>
            </div>
          )}

          {/* ── Right cluster ──
              Desktop order: Write a Review · UserMenu · Get Listed · Search
              Mobile order (via CSS `order`): Get Listed · Search
              Write a Review + UserMenu are hidden on mobile and surface
              inside the sheet's bottom dock instead. */}
          <div className="iw-right">
            <Link href="/write-review" className="iw-link-text">Write a Review</Link>
            <UserMenu />
            <Link href="/business" className="iw-cta">Get Listed</Link>
            {!hideSearch && !searchOpen && (
              <button
                type="button"
                className="iw-search-btn"
                onClick={() => { setSearchOpen(true); setActiveDD(null); setMenuOpen(false) }}
                aria-label="Open search"
              >
                <IconSearch />
              </button>
            )}
          </div>
        </div>

        {/* ═══ Full-width mega-menu surface (Services & Solutions) ═══ */}
        <div
          className={'iw-mega' + ((activeDD === 'services' || activeDD === 'solutions') ? ' iw-mega--open' : '')}
        >
          {activeDD === 'services' && (
            <div className="iw-mega-inner iw-mega-inner--svc">
              <div className="iw-svc-left">
                {SECTORS.map(s => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className={'iw-svc-row' + (activeSector === s.slug ? ' iw-svc-row--on' : '')}
                    onMouseEnter={() => setActiveSector(s.slug)}
                    onClick={closeDD}
                  >
                    <span>{s.label}</span>
                    <ChevRight />
                  </Link>
                ))}
              </div>
              <div className="iw-svc-right">
                <div className="iw-svc-grid">
                  {activeL2s.map(c => (
                    <Link
                      key={c.slug}
                      href={`/${activeSector}/${c.slug}`}
                      className="iw-tile"
                      onClick={closeDD}
                    >
                      <span className="iw-tile-ico"><CatIcon k={iconForCategory(c.name, activeSector)} /></span>
                      <span className="iw-tile-name">{c.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="iw-svc-foot">
                  <Link
                    href={`/${activeSector}/view-all-sub-categories-${activeSector}`}
                    className="iw-cta iw-cta--mega"
                    onClick={closeDD}
                  >
                    Explore all categories
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeDD === 'solutions' && (
            <div className="iw-mega-inner iw-mega-inner--soln">
              <div className="iw-soln-grid">
                {SOLUTIONS.map(s => (
                  <Link
                    key={s.label}
                    href={s.comingSoon ? '#' : s.href}
                    className={'iw-soln' + (s.comingSoon ? ' iw-soln--soon' : '')}
                    onClick={(e) => { if (s.comingSoon) e.preventDefault(); closeDD() }}
                  >
                    <span className="iw-soln-ico"><SolnIcon k={s.iconKey} /></span>
                    <span className="iw-soln-text">
                      <span className="iw-soln-name">
                        {s.label}
                        {s.comingSoon && <span className="iw-soln-badge">Coming soon</span>}
                      </span>
                      <span className="iw-soln-sub">{s.sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ Narrow Resources dropdown, anchored under the Resources link ═══ */}
        <div
          className={'iw-rsrc' + (activeDD === 'resources' ? ' iw-rsrc--open' : '')}
        >
          <ul className="iw-rsrc-list">
            {RESOURCES.map(r => (
              <li key={r.href}>
                <Link href={r.href} className="iw-rsrc-item" onClick={closeDD}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Spacer to offset fixed header — height matches .iw-head */}
      <div className="iw-head-spacer" />

      {/* ═══════ Mobile sheet — drops below the header. ═══════
          Layout (per the GoodFirms reference):
            - No own top bar (the main header stays put; burger toggles to X).
            - 3 flat accordions separated by hairlines: Services, Solutions, Resources.
            - Sub-content:
                · Services  = 6 L1 sector nav-links
                · Solutions = 3 tile cards (icon + name + sub-text)
                · Resources = plain text nav-links
            - Bottom dock: "Write a Review" link + "Sign in" outlined button
              (or "Open dashboard" + "Sign out" when authed). */}
      <div className={'iw-mob' + (menuOpen ? ' iw-mob--open' : '')} aria-hidden={!menuOpen}>
        <nav className="iw-mob-nav" aria-label="Mobile navigation">
          {/* ── Services accordion ── */}
          <div className="iw-mob-row">
            <button
              type="button"
              className={'iw-mob-acc' + (mobOpen === 'services' ? ' iw-mob-acc--on' : '')}
              onClick={() => setMobOpen(o => o === 'services' ? null : 'services')}
              aria-expanded={mobOpen === 'services'}
            >
              <span>Find by Services</span>
              <ChevDown />
            </button>
            <div className={'iw-mob-sub-wrap' + (mobOpen === 'services' ? ' iw-mob-sub-wrap--on' : '')}>
              <ul className="iw-mob-sub">
                {SECTORS.map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} onClick={() => setMenuOpen(false)}>
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Solutions accordion (tile cards) ── */}
          <div className="iw-mob-row">
            <button
              type="button"
              className={'iw-mob-acc' + (mobOpen === 'solutions' ? ' iw-mob-acc--on' : '')}
              onClick={() => setMobOpen(o => o === 'solutions' ? null : 'solutions')}
              aria-expanded={mobOpen === 'solutions'}
            >
              <span>Find by Solutions</span>
              <ChevDown />
            </button>
            <div className={'iw-mob-sub-wrap' + (mobOpen === 'solutions' ? ' iw-mob-sub-wrap--on' : '')}>
              <div className="iw-mob-tiles">
                {SOLUTIONS.map(s => (
                  <Link
                    key={s.label}
                    href={s.comingSoon ? '#' : s.href}
                    className={'iw-mob-tile' + (s.comingSoon ? ' iw-mob-tile--soon' : '')}
                    onClick={(e) => { if (s.comingSoon) e.preventDefault(); else setMenuOpen(false) }}
                  >
                    <span className="iw-mob-tile-ico"><SolnIcon k={s.iconKey} /></span>
                    <span className="iw-mob-tile-text">
                      <span className="iw-mob-tile-name">
                        {s.label}
                        {s.comingSoon && <span className="iw-soln-badge">Coming soon</span>}
                      </span>
                      <span className="iw-mob-tile-sub">{s.sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Resources accordion ── */}
          <div className="iw-mob-row">
            <button
              type="button"
              className={'iw-mob-acc' + (mobOpen === 'resources' ? ' iw-mob-acc--on' : '')}
              onClick={() => setMobOpen(o => o === 'resources' ? null : 'resources')}
              aria-expanded={mobOpen === 'resources'}
            >
              <span>Resources</span>
              <ChevDown />
            </button>
            <div className={'iw-mob-sub-wrap' + (mobOpen === 'resources' ? ' iw-mob-sub-wrap--on' : '')}>
              <ul className="iw-mob-sub">
                {RESOURCES.map(r => (
                  <li key={r.href}>
                    <Link href={r.href} onClick={() => setMenuOpen(false)}>
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* ── Bottom dock ── */}
        <div className="iw-mob-foot">
          <Link href="/write-review" className="iw-mob-foot-link" onClick={() => setMenuOpen(false)}>
            Write a Review
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="iw-mob-foot-btn"
                onClick={() => setMenuOpen(false)}
              >
                Open dashboard
              </Link>
              <button
                type="button"
                className="iw-mob-foot-signout"
                onClick={async () => {
                  await logout()
                  setMenuOpen(false)
                  window.location.href = '/'
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="iw-mob-foot-btn"
              onClick={() => { setMenuOpen(false); setMobAuthOpen(true) }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      <SignupModal
        open={mobAuthOpen}
        onClose={() => setMobAuthOpen(false)}
        initialMode="login"
      />

    </>
  )
}
