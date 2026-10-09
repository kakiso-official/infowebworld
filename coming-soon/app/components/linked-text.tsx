import type { ReactNode } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════
   Plain-text copy with inline links, for content that is also emitted as
   JSON-LD (FAQ answers, glossary definitions).

   The copy stays ONE plain string - the exact text that goes into
   FAQPage / DefinedTerm structured data - and each link names the words
   it wraps. renderLinkedText() links the first occurrence of each link's
   `text` and leaves the rest as text, so the visible words are
   byte-identical to the string in the JSON-LD. Same approach as the
   homepage FAQ (app/home-sections/HomeFaqSection.tsx).

   Internal paths render as next/link; http(s), mailto: and tel: links as
   plain anchors (external ones open in a new tab).
   ═══════════════════════════════════════════════════════════════════════ */

export type TextLink = { text: string; href: string }

export type LinkedCopy = { text: string; links?: TextLink[] }

function isInternal(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

export function renderLinkedText(text: string, links?: TextLink[]): ReactNode[] {
  type Segment = { text: string; href?: string }
  const segments: Segment[] = [{ text }]

  for (const link of links ?? []) {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      if (seg.href) continue
      const idx = seg.text.indexOf(link.text)
      if (idx === -1) continue
      const parts: Segment[] = []
      if (idx > 0) parts.push({ text: seg.text.slice(0, idx) })
      parts.push({ text: link.text, href: link.href })
      const rest = seg.text.slice(idx + link.text.length)
      if (rest) parts.push({ text: rest })
      segments.splice(i, 1, ...parts)
      break
    }
  }

  return segments.map((seg, i) => {
    if (!seg.href) return <span key={i}>{seg.text}</span>
    if (isInternal(seg.href)) return <Link key={i} href={seg.href}>{seg.text}</Link>
    const external = /^https?:/.test(seg.href)
    return (
      <a
        key={i}
        href={seg.href}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      >
        {seg.text}
      </a>
    )
  })
}
