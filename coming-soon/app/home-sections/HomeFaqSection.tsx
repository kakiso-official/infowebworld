import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { HOME_FAQS, type HomeFaq } from './home-faq-data'

/* ═══════════════════════════════════════════════════════════════════════
   Homepage FAQ section - native <details>/<summary> accordion (no client
   JS needed). Renders straight from HOME_FAQS so the visible copy and the
   FAQPage JSON-LD (built from the same array in home-faq-data.ts) can
   never drift apart.

   Server Component. Import once into app/page.tsx:
     import HomeFaqSection from './home-sections/HomeFaqSection'
     import { buildHomeFaqJsonLd } from './home-sections/home-faq-data'
   ═══════════════════════════════════════════════════════════════════════ */

/* Splits an answer string on the first occurrence of each link's `text`,
   rendering that occurrence as a <Link> while leaving the rest of the
   string - and every other occurrence of the same words - as plain text.
   The visible concatenation stays byte-identical to `answer`, which is the
   same string handed to buildHomeFaqJsonLd(). */
function renderAnswer(answer: string, links?: HomeFaq['links']): ReactNode[] {
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

  return segments.map((seg, i) =>
    seg.href ? (
      <Link key={i} href={seg.href}>{seg.text}</Link>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  )
}

export default function HomeFaqSection() {
  return (
    <section className="hm-faq" aria-labelledby="hm-faq-h">
      <div className="hm-faq-inner">
        <div className="hm-faq-head">
          <h2 id="hm-faq-h" className="hm-faq-title">FAQs</h2>
        </div>

        <div className="hm-faq-list">
          {HOME_FAQS.map((faq, i) => (
            <details key={faq.q} className="hm-faq-item" open={i === 0}>
              <summary className="hm-faq-q">
                <h3 className="hm-faq-q-text">{faq.q}</h3>
                <span className="hm-faq-chev" aria-hidden="true">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </summary>
              <div className="hm-faq-a">
                <p>{renderAnswer(faq.a, faq.links)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
