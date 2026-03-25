'use client'
import { useRef, useEffect } from 'react'

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const Ck = () => (
  <svg viewBox="0 0 24 24" className="ben-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const benefits = [
  {
    title: 'Dofollow Backlinks',
    desc: 'Every listing includes a permanent dofollow backlink from a DA 72+ domain — the kind of link that moves the needle on your rankings.',
    extra: 'Most directories offer nofollow links that do nothing for SEO. We give you a real, crawlable dofollow link that passes authority directly to your site.',
    num: 'DA 72+',
    pastel: 'ben--coral',
    highlights: ['Permanent link — never expires or gets removed', 'Indexed by Google within 48 hours', 'Boosts your domain authority & rankings', 'White-hat, editorial-quality backlink', 'Anchor text you choose yourself'],
    icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
  },
  {
    title: 'Verified Reviews',
    desc: 'Build unshakeable trust with authentic, verified customer reviews. Our AI anti-fraud system ensures zero fakes — only genuine feedback that converts.',
    extra: '98% of consumers read reviews before buying. Our verified badge on each review tells customers this is real — dramatically increasing conversion rates.',
    num: '98%',
    pastel: 'ben--emerald',
    highlights: ['AI-powered anti-fake detection system', 'Photo, video & detailed text reviews', 'Owner response & engagement tools', 'Review widgets for your own website', 'Verified purchase badges on reviews'],
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></>,
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
  },
  {
    title: 'Lead Generation',
    desc: 'Turn profile visitors into paying customers. Receive qualified leads directly — customers can contact you, request quotes, and book appointments without leaving the platform.',
    extra: 'Average listed businesses receive 40+ qualified leads per month. Every lead comes with contact details, intent signal, and the service they need.',
    num: '40+/mo',
    pastel: 'ben--azure',
    highlights: ['Direct contact forms on your listing', 'Instant quote request notifications', 'Built-in appointment booking system', 'Lead quality scoring & filtering', 'Email & SMS lead alerts'],
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Know exactly how your listing performs. Track views, clicks, leads, and review sentiment with a real-time dashboard built specifically for business owners — not marketers.',
    extra: 'See which keywords bring visitors, which pages convert best, and how you stack up against competitors — all in one clean, simple dashboard.',
    num: 'Real-time',
    pastel: 'ben--plum',
    highlights: ['Real-time view & click tracking', 'Lead conversion rate analytics', 'Review sentiment trend analysis', 'Competitor benchmark insights', 'Weekly performance email reports'],
    icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>,
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    title: 'Global Reach',
    desc: 'Get discovered by customers across the world. Your listing is visible in 12 countries with multi-language support, helping you tap into markets you never thought possible.',
    extra: 'Your listing is auto-translated and optimized for local search in every region. One listing, twelve countries, zero extra work from your side.',
    num: '12 Countries',
    pastel: 'ben--teal',
    highlights: ['Live in 12 countries from day one', 'Auto-translated into 8 languages', '80+ industry categories covered', 'Local SEO boost per region', 'Region-specific customer targeting'],
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80',
  },
  {
    title: 'Daily Business News',
    desc: 'Stay ahead of your industry with Inshorts-style daily news digests. Get featured in category-specific feeds and position yourself as the go-to expert in your space.',
    extra: 'Contribute articles, share insights, and get your name in front of thousands of potential customers reading their daily industry digest every morning.',
    num: 'Daily',
    pastel: 'ben--amber',
    highlights: ['Personalized category-specific digests', 'Get featured as an industry expert', 'Real-time industry trend alerts', 'Share insights to build authority', 'Morning digest email to your inbox'],
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80',
  },
]

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* Mobile uses bento grid — no scroll-stack JS needed */
    if (window.innerWidth <= 768) return

    const section = sectionRef.current
    const sticky = stickyRef.current
    const area = areaRef.current
    if (!section || !sticky || !area) return

    const cards = Array.from(area.querySelectorAll<HTMLElement>('.stack-card'))
    const n = cards.length
    if (!n) return

    const PEEK = 14
    const TAPER = 1.5
    const SCALE_STEP = 0.025

    cards.forEach((c, i) => {
      c.style.zIndex = `${i + 1}`
    })

    const calcHeight = () => {
      const vh = window.innerHeight
      const perCard = Math.max(250, vh * 0.35)
      section.style.height = `${(n - 1) * perCard + vh}px`
    }
    calcHeight()

    let raf = 0

    const update = () => {
      const vh = window.innerHeight
      const sectionRect = section.getBoundingClientRect()
      const sectionH = section.offsetHeight
      const scrolled = Math.max(0, -sectionRect.top)
      const maxScroll = sectionH - vh

      if (sectionRect.top >= 0) {
        sticky.style.position = 'absolute'
        sticky.style.top = '0px'
        sticky.style.bottom = 'auto'
      } else if (scrolled < maxScroll) {
        sticky.style.position = 'fixed'
        sticky.style.top = '0px'
        sticky.style.bottom = 'auto'
      } else {
        sticky.style.position = 'absolute'
        sticky.style.top = 'auto'
        sticky.style.bottom = '0px'
      }

      if (maxScroll <= 0) return
      const progress = clamp(scrolled / maxScroll, 0, 1)
      const areaH = area.clientHeight

      const SPAN = n - 1.25 /* last card finishes exactly at progress 1.0 */

      cards.forEach((card, i) => {
        /* Shift by -1 so first card is already present when section locks */
        const enterStart = (i - 1) / SPAN
        const enterEnd = (i - 1 + 0.75) / SPAN
        const ep = clamp((progress - enterStart) / (enterEnd - enterStart), 0, 1)

        let depth = 0
        for (let j = i + 1; j < n; j++) {
          const jStart = (j - 1) / SPAN
          const jEnd = (j - 1 + 0.75) / SPAN
          depth += clamp((progress - jStart) / (jEnd - jStart), 0, 1)
        }

        const enterY = (1 - easeOut(ep)) * (areaH + 40)
        const stackY = -(PEEK * depth - TAPER * depth * (depth - 1) / 2)
        const scale = ep > 0 ? Math.max(1 - depth * SCALE_STEP, 0.84) : 1

        card.style.transform = `translateY(${enterY + stackY}px) scale(${scale})`
        card.style.opacity = ep > 0.01 ? '1' : '0'
      })
    }

    const onResize = () => {
      calcHeight()
    }

    /* rAF loop — polls every frame instead of relying on scroll events.
       Scroll events can be unreliable on mobile browsers. */
    const tick = () => {
      update()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* ════════ DESKTOP: Scroll-stack ════════ */}
      <section ref={sectionRef} className="ben-scroll-section ben-desktop" id="benefits">
        <div ref={stickyRef} className="ben-sticky">
          <div className="container">
            <div className="section-header ben-sticky-header">
              <div className="section-tag">Why List With Us</div>
              <h2 className="ben-heading">
                Everything Your Business <em>Needs</em>
              </h2>
              <p className="section-desc">
                More than a directory — a complete business growth platform with
                tools that actually drive results.
              </p>
            </div>
          </div>

          <div ref={areaRef} className="ben-card-area">
            {benefits.map(b => (
              <div key={b.title} className={`stack-card ${b.pastel}`}>
                <div className="stack-card-inner">
                  <div className="stack-card-top">
                    <div className="ben-card-icon">
                      <svg viewBox="0 0 24 24">{b.icon}</svg>
                    </div>
                    <span className="ben-card-num">{b.num}</span>
                  </div>

                  <div className="stack-card-content">
                    <div className="stack-card-left">
                      <h3 className="ben-card-title">{b.title}</h3>
                      <p className="ben-card-desc">{b.desc}</p>
                      <p className="ben-card-extra">{b.extra}</p>
                      <ul className="ben-highlights">
                        {b.highlights.map(h => (
                          <li key={h}><Ck />{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="stack-card-right">
                      <img src={b.img} alt={b.title} className="ben-card-img" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ MOBILE: Bento grid ════════ */}
      <section className="ben-bento-section" id="benefits-mobile">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Why List With Us</div>
            <h2 className="ben-heading">
              Everything Your Business <em>Needs</em>
            </h2>
            <p className="section-desc">
              More than a directory — a complete business growth platform with
              tools that actually drive results.
            </p>
          </div>

          <div className="ben-bento-grid">
            {benefits.map(b => (
              <div key={b.title} className={`bento-card ${b.pastel}`}>
                <div className="bento-card-top">
                  <div className="ben-card-icon">
                    <svg viewBox="0 0 24 24">{b.icon}</svg>
                  </div>
                  <span className="ben-card-num">{b.num}</span>
                </div>
                <div className="bento-card-title">{b.title}</div>
                <div className="bento-card-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
