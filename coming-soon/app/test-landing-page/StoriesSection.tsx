'use client'

import { useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   Stories of trust & success — testimonials carousel.

   Reference: GoodFirms "Stories of trust & success" — left column has the
   heading + sub + two arrow buttons; right area shows 2 quote cards at a
   time, arrows page through.

   Real testimonials don't exist yet — using realistic placeholder content
   so the section reads complete. Real entries can be swapped in later
   without changing the component.

   Avatar source: randomuser.me — free portrait photos for placeholders.
   ═══════════════════════════════════════════════════════════════════════ */

type Story = {
  quote: string
  name: string
  role: string
  avatar: string
}

const STORIES: Story[] = [
  {
    quote:
      "InfoWebWorld surfaced our AI tool to exactly the buyers we'd been struggling to reach through ads. Within two months we had a steady pipeline of qualified leads — most of them came in already knowing what we did because they'd read our verified reviews first.",
    name: 'Sarah Chen',
    role: 'Founder, LumenIQ Labs',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote:
      "What sold us on InfoWebWorld is that the reviews are actually verified. We've been listed on three other directories and the difference is night and day — here the buyers reaching out are serious, not just window-shopping.",
    name: 'Marcus Reyes',
    role: 'Head of Marketing, Brightline CRM',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote:
      "The voice-recorded review feature is genuinely brilliant. Our clients hate filling out long forms, but speaking for 30 seconds? They'll do that. We've collected more reviews in two weeks than we did all year on other platforms.",
    name: 'Priya Sharma',
    role: 'Growth Lead, OptiWeb Studio',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    quote:
      "InfoWebWorld's category targeting is sharp. We're a niche analytics product and were worried about getting lost in the noise. Instead, they put us in front of the buyers who actually needed us — our trial signups doubled in the first month.",
    name: 'Daniel Kowalski',
    role: 'Co-Founder, Northbeam Analytics',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
  {
    quote:
      "Honest, verified, and never paid-for — that's what every directory claims but few deliver. InfoWebWorld is the rare one that actually means it. Our prospects mention seeing us there in nearly every sales call.",
    name: 'Aisha Patel',
    role: 'CMO, TideRise Agency',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    quote:
      "We listed on InfoWebWorld within minutes — the voice-review system meant our existing customers could leave feedback during their lunch break. The simple pricing and clean dashboard sealed it for us.",
    name: 'Jamal Ahmed',
    role: 'VP Product, Helix Cloud',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
  },
]

const PAGE_SIZE = 2
/* Pre-chunk the stories into pages of two so the slider can translate
   a fixed-width track instead of swapping content on every arrow click.
   The track gets a smooth CSS transform transition for the slide effect. */
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}
const PAGES: Story[][] = chunk(STORIES, PAGE_SIZE)

export default function StoriesSection() {
  const [page, setPage] = useState(0)

  const prev = useCallback(() => setPage(p => (p - 1 + PAGES.length) % PAGES.length), [])
  const next = useCallback(() => setPage(p => (p + 1) % PAGES.length), [])

  return (
    <section className="tlp-stories" aria-labelledby="tlp-stories-h">
      <div className="tlp-stories-inner">
        {/* Left column — heading + sub + arrows pushed to the bottom */}
        <div className="tlp-stories-left">
          <h2 id="tlp-stories-h" className="tlp-stories-title">
            Stories of trust &amp; success
          </h2>
          <p className="tlp-stories-sub">
            Hear from businesses who found their ideal partners on InfoWebWorld.
          </p>
          <div className="tlp-stories-nav" role="group" aria-label="Stories navigation">
            <button
              type="button"
              className="tlp-stories-arrow"
              onClick={prev}
              aria-label="Previous stories"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button
              type="button"
              className="tlp-stories-arrow"
              onClick={next}
              aria-label="Next stories"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right area — viewport clips a horizontal track of pages. Each
            page is a 2-up grid of equal-height cards. Arrows update the
            page index → track translates → cards slide. */}
        <div
          className="tlp-stories-viewport"
          aria-live="polite"
          aria-roledescription="carousel"
        >
          <div
            className="tlp-stories-track"
            style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
          >
            {PAGES.map((pageStories, pi) => (
              <div
                key={pi}
                className="tlp-stories-page"
                aria-hidden={pi !== page}
              >
                {pageStories.map(s => (
                  <article key={s.name} className="tlp-story">
                    <p className="tlp-story-quote">&ldquo;{s.quote}&rdquo;</p>
                    <footer className="tlp-story-author">
                      <img className="tlp-story-avatar" src={s.avatar} alt="" loading="lazy" />
                      <div className="tlp-story-meta">
                        <div className="tlp-story-name">{s.name}</div>
                        <div className="tlp-story-role">{s.role}</div>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
