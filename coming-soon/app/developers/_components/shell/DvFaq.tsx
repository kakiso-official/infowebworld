import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { slugify } from '@/lib/developers/paths'
import DvBand from './DvBand'

/* ═══════════════════════════════════════════════════════════════════════
   FAQ band (spec 4.13): native <details>/<summary> (no client JS), first
   item open, question as <h3>. It copies the homepage FAQ look but
   imports none of its CSS.

   Answers are plain strings - the SAME strings the page hands to
   faqNode() for FAQPage JSON-LD - and `links` turns the first occurrence
   of each phrase into a link, so the visible text and the structured data
   stay byte-identical (same splitting as HomeFaqSection, copied here).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvFaqItem {
  q: string
  a: string
  links?: ReadonlyArray<{ text: string; href: string }>
}

export interface DvFaqProps {
  heading: string
  faqs: readonly DvFaqItem[]
  /** Section id; defaults to a slug of the heading (unique per page). */
  id?: string
  sub?: ReactNode
  tone?: 'white' | 'wash'
}

function renderAnswer(answer: string, links?: DvFaqItem['links']): ReactNode[] {
  type Segment = { text: string; href?: string }
  const segments: Segment[] = [{ text: answer }]

  for (const link of links ?? []) {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      if (seg.href) continue
      const idx = seg.text.indexOf(link.text)
      if (idx === -1) continue
      const before = seg.text.slice(0, idx)
      const after = seg.text.slice(idx + link.text.length)
      const replacement: Segment[] = []
      if (before) replacement.push({ text: before })
      replacement.push({ text: link.text, href: link.href })
      if (after) replacement.push({ text: after })
      segments.splice(i, 1, ...replacement)
      break
    }
  }

  return segments.map((seg, i) => (seg.href ? <a key={i} href={seg.href}>{seg.text}</a> : <span key={i}>{seg.text}</span>))
}

export default function DvFaq({ heading, faqs, id, sub, tone = 'white' }: DvFaqProps) {
  if (!faqs.length) return null
  const sectionId = id ?? `faq-${slugify(heading)}`

  return (
    <DvBand tone={tone} id={sectionId} title={heading} sub={sub} align="center" width="default">
      <div className="dv-faq-list">
        {faqs.map((faq, i) => (
          <details key={faq.q} className="dv-faq-item" open={i === 0}>
            <summary className="dv-faq-q">
              <h3 className="dv-faq-q-text">{faq.q}</h3>
              <span className="dv-faq-chev" aria-hidden="true">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </summary>
            <div className="dv-faq-a">
              <p>{renderAnswer(faq.a, faq.links)}</p>
            </div>
          </details>
        ))}
      </div>
    </DvBand>
  )
}
