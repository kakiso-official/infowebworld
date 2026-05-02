'use client'
import { useState } from 'react'
import { I, ic } from './icons'

type Faq = { q: string; a: string }

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  return (
    <div className="cd-faq">
      <h3 className="cd-faq-title">Frequently Asked Questions</h3>
      <div>
        {faqs.map((faq, i) => {
          const isOpen = open.has(i)
          return (
            <div key={i} className={`cd-faq-item${isOpen ? ' cd-faq-item--open' : ''}`}>
              <button
                className="cd-faq-q"
                onClick={() => toggle(i)}
              >
                <span>{faq.q}</span>
                <span className="cd-faq-toggle">
                  <I d={isOpen ? ic.minus : ic.plus} size={16} color="var(--h-muted)" sw={2} />
                </span>
              </button>
              {isOpen && (
                <div className="cd-faq-a">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
