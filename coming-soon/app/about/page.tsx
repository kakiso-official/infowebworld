import type { Metadata } from 'next'
import Link from 'next/link'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faCircleCheck, faMagnifyingGlass, faStore, faHandshake,
  faUserCheck, faStar, faScaleBalanced, faRobot, faCodeCompare, faGift,
  faBriefcase, faBuilding, faRocket, faBullhorn, faLocationDot,
  faNewspaper, faChevronDown, faLifeRing,
} from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { renderLinkedText } from '../components/linked-text'
import { SECTOR_LINKS } from '../components/sector-links'
import { websiteNode, breadcrumbNode, faqNode, itemListNode } from '../components/seo-schema'
import { subcategoryTotal } from '../sector-directory/taxonomy'
import { getTopicBlogPosts } from '../home-sections/latest-blog-data'
import BlogCoverImage from '../home-sections/BlogCoverImage'
import {
  ABOUT_TITLE, ABOUT_TAGLINE, ABOUT_TRUST, WHAT_IS, MISSION, HOW_IT_WORKS,
  DIFFERENTIATORS, CATEGORY_INTRO, DIRECTORY_NAMES, DIRECTORY_DESCS,
  VERIFY_STEPS, VERIFY_FOOTNOTE, STORY, AUDIENCES, ABOUT_FAQS, CLOSING,
} from './about-data'

/* ISR, like the homepage: the page is static apart from the "Resources,
   Guides and Insights" posts, which refresh with the blog cache. */
export const revalidate = 600

/* ──────────────────────────────────────────────
   Canonical IDs — every schema cross-references
   these so Google reads one connected graph
   ──────────────────────────────────────────── */
const URL_PAGE        = 'https://www.infowebworld.com/about'
const ID_BREADCRUMB   = `${URL_PAGE}#breadcrumb`
const ID_WEBPAGE      = `${URL_PAGE}#webpage`
const ID_FAQ          = `${URL_PAGE}#faq`
const ID_DIFF_LIST    = `${URL_PAGE}#differentiators`
const ID_DIRECTORIES  = `${URL_PAGE}#directories`
const ID_SERVICE      = `${URL_PAGE}#service`
const ID_ORGANIZATION = 'https://www.infowebworld.com/#organization'
const ID_ADDRESS      = 'https://www.infowebworld.com/#address'

/* The About copy says InfoWebWorld launched in 2004 (also the year
   Brain Stream Australia, the legal entity, started trading). */
const FOUNDING_YEAR  = '2004'
const PAGE_PUBLISHED = '2026-05-02'
const PAGE_MODIFIED  = '2026-10-09'

const META_TITLE = 'About InfoWebWorld | Free Global Business Directory'
const META_DESCRIPTION =
  'Learn how InfoWebWorld, the free global business directory, helps buyers find verified companies and businesses earn real reviews. Meet us and list for free.'

const OG_IMAGE = 'https://www.infowebworld.com/og-image.png'
const MAP_URL  = 'https://www.google.com/maps/place/Parramatta+NSW+2150,+Australia'

/* ──────────────────────────────────────────────
   Metadata (Next.js generates <head> tags)
   ──────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.infowebworld.com'),
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: [
    'About InfoWebWorld', 'global business directory', 'free business directory',
    'online business directory', 'verified business listings', 'real business reviews',
    'free business listing', 'business discovery', 'Brain Stream Australia', 'Parramatta NSW',
  ],
  alternates: {
    canonical: URL_PAGE,
    languages: { 'en-US': URL_PAGE, 'x-default': URL_PAGE },
  },
  openGraph: {
    type: 'website',
    url: URL_PAGE,
    siteName: 'InfoWebWorld',
    title: META_TITLE,
    description: META_DESCRIPTION,
    locale: 'en_US',
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: 'InfoWebWorld - Free Global Business Directory', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@infowebworld_x',
    creator: '@infowebworld_x',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true, follow: true, nocache: false,
    googleBot: {
      index: true, follow: true, noimageindex: false,
      'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1,
    },
  },
  authors: [{ name: 'InfoWebWorld', url: 'https://www.infowebworld.com' }],
  creator: 'InfoWebWorld',
  publisher: 'Brain Stream Australia Pty Ltd',
  category: 'Business',
  applicationName: 'InfoWebWorld',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    'geo.region':    'AU-NSW',
    'geo.placename': 'Parramatta',
    'geo.position':  '-33.8136;151.0034',
    'ICBM':          '-33.8136, 151.0034',
    'rating':        'general',
    'distribution':  'global',
    'dc.creator':    'Brain Stream Australia Pty Ltd',
    'dc.publisher':  'Brain Stream Australia Pty Ltd',
    'dc.language':   'en-US',
    'dc.subject':    'Global business directory, verified business listings, business reviews',
    'dc.coverage':   'Worldwide',
  },
}

/* Decorative icons, one per item, in the copy's order. */
const HOW_ICONS  = [faMagnifyingGlass, faStore, faHandshake]
const DIFF_ICONS = [faUserCheck, faStar, faScaleBalanced, faRobot, faCodeCompare, faGift]
const WHO_ICONS  = [faBriefcase, faBuilding, faRocket, faBullhorn, faLocationDot]

const DIRECTORIES = SECTOR_LINKS.map(s => ({
  ...s,
  name: DIRECTORY_NAMES[s.slug],
  desc: DIRECTORY_DESCS[s.slug],
  subcategories: subcategoryTotal(s.slug),
}))

/* ──────────────────────────────────────────────
   Organization node (referenced by @id elsewhere)
   ──────────────────────────────────────────── */
const ORG_NODE = {
  '@type': 'Organization',
  '@id': ID_ORGANIZATION,
  name: 'InfoWebWorld',
  alternateName: ['Info Web World', 'iWW'],
  legalName: 'Brain Stream Australia Pty Ltd',
  url: 'https://www.infowebworld.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
    width: 1000, height: 270, caption: 'InfoWebWorld logo',
  },
  image: OG_IMAGE,
  description:
    'InfoWebWorld is a free global business directory where buyers find, compare and review verified companies, software, AI tools and agencies across 80+ industries in six main categories.',
  slogan: ABOUT_TAGLINE,
  foundingDate: FOUNDING_YEAR,
  foundingLocation: {
    '@type': 'Place',
    name: 'Parramatta, NSW, Australia',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Parramatta',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
  },
  address: {
    '@type': 'PostalAddress',
    '@id': ID_ADDRESS,
    streetAddress: 'Parramatta',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
  location: {
    '@type': 'Place',
    address: { '@id': ID_ADDRESS },
    geo: { '@type': 'GeoCoordinates', latitude: -33.8136, longitude: 151.0034 },
    hasMap: MAP_URL,
  },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  knowsAbout: [
    'Business directories',
    'Business discovery',
    'Verified business listings',
    'Verified business reviews',
    'Search engine optimization (SEO)',
    'Answer engine optimization (AEO)',
    'Structured data and Schema.org',
    'Dofollow backlinks',
    'Lead generation for businesses',
  ],
  knowsLanguage: [{ '@type': 'Language', name: 'English', alternateName: 'en' }],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'iww@brainstream.com.au',
      url: 'https://www.infowebworld.com/contact',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
  ],
  potentialAction: [
    {
      '@type': 'ContactAction',
      name: 'Contact InfoWebWorld',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://www.infowebworld.com/contact' },
    },
  ],
  sameAs: [
    'https://x.com/infowebworld_x',
    'https://www.linkedin.com/company/infowebworld/',
    'https://www.instagram.com/infowebworld',
  ],
}

/* ──────────────────────────────────────────────
   JSON-LD @graph - built from the same copy the
   page renders (about-data.ts)
   ──────────────────────────────────────────── */
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    websiteNode,
    ORG_NODE,
    breadcrumbNode(
      [
        { name: 'Home', url: 'https://www.infowebworld.com' },
        { name: 'About', url: URL_PAGE },
      ],
      ID_BREADCRUMB,
    ),
    {
      '@type': 'AboutPage',
      '@id': ID_WEBPAGE,
      url: URL_PAGE,
      name: META_TITLE,
      headline: ABOUT_TITLE,
      alternativeHeadline: ABOUT_TAGLINE,
      description: META_DESCRIPTION,
      inLanguage: 'en-US',
      isPartOf: { '@id': 'https://www.infowebworld.com/#website' },
      breadcrumb: { '@id': ID_BREADCRUMB },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
      image: OG_IMAGE,
      datePublished: PAGE_PUBLISHED,
      dateModified: PAGE_MODIFIED,
      publisher: { '@id': ID_ORGANIZATION },
      about: { '@id': ID_ORGANIZATION },
      mainEntity: { '@id': ID_ORGANIZATION },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.ab-title', '.ab-tagline', '#what-is p', '#mission p'],
      },
      mentions: [
        { '@type': 'Organization', name: 'Brain Stream Australia Pty Ltd', url: 'https://www.brainstream.com.au/' },
        { '@type': 'Organization', name: 'Google' },
        { '@type': 'Organization', name: 'OpenAI', alternateName: 'ChatGPT' },
        { '@type': 'Organization', name: 'Perplexity AI' },
      ],
      hasPart: [{ '@id': ID_FAQ }, { '@id': ID_DIFF_LIST }, { '@id': ID_DIRECTORIES }],
    },
    faqNode(ABOUT_FAQS, ID_FAQ, ID_WEBPAGE),
    itemListNode(
      DIFFERENTIATORS.map(d => ({ name: d.title.replace(/:$/, ''), description: d.text })),
      ID_DIFF_LIST,
      'What Makes InfoWebWorld Different',
    ),
    itemListNode(
      DIRECTORIES.map(d => ({ name: d.name, url: `https://www.infowebworld.com${d.href}`, description: d.desc })),
      ID_DIRECTORIES,
      'Explore the Business Directory by Category',
    ),
    {
      '@type': 'Service',
      '@id': ID_SERVICE,
      name: 'InfoWebWorld Global Business Directory',
      serviceType: 'Global business directory',
      provider: { '@id': ID_ORGANIZATION },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      termsOfService: 'https://www.infowebworld.com/terms',
      category: 'Business directory',
      offers: { '@type': 'AggregateOffer', url: 'https://www.infowebworld.com/business/plans', priceCurrency: 'USD', lowPrice: '0', highPrice: '239' },
    },
  ],
}

const postDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function formatPostDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : postDate.format(d)
}

/* ──────────────────────────────────────────────
   Page
   ──────────────────────────────────────────── */
export default async function AboutPage() {
  const posts = await getTopicBlogPosts('about', 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className="ab" id="top">
        {/* ── Hero ── */}
        <header className="ab-hero">
          <div className="ab-hero-inner">
            <nav className="ab-crumb" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">About</li>
              </ol>
            </nav>
            <div className="ab-hero-copy">
              <h1 className="ab-title">{ABOUT_TITLE}</h1>
              <p className="ab-tagline">{ABOUT_TAGLINE}</p>
              <ul className="ab-trust" aria-label="Highlights">
                {ABOUT_TRUST.map(item => (
                  <li key={item}>
                    <FontAwesomeIcon icon={faCircleCheck} className="ab-trust-ico" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="ab-cta-row">
                <Link href="/business/plans" className="ab-btn ab-btn--primary">
                  List Your Business Free <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </Link>
                <Link href="/categories" className="ab-btn ab-btn--ghost">Browse All Categories</Link>
              </div>
            </div>
          </div>
        </header>

        {/* ── What is + mission ── */}
        <div className="ab-band">
          <div className="ab-inner ab-split">
            <section id="what-is" aria-labelledby="ab-what-h">
              <h2 id="ab-what-h" className="ab-h2">What Is InfoWebWorld?</h2>
              {WHAT_IS.map(p => (
                <p key={p.text}>{renderLinkedText(p.text, p.links)}</p>
              ))}
            </section>
            <section id="mission" className="ab-mission" aria-labelledby="ab-mission-h">
              <h2 id="ab-mission-h" className="ab-h2">Our Mission: Helping Real Buyers Find Real Businesses</h2>
              {MISSION.map(p => <p key={p}>{p}</p>)}
            </section>
          </div>
        </div>

        {/* ── How it works ── */}
        <section className="ab-band ab-band--tint" id="how-it-works" aria-labelledby="ab-how-h">
          <div className="ab-inner">
            <h2 id="ab-how-h" className="ab-h2">How InfoWebWorld Works</h2>
            <div className="ab-cards">
              {HOW_IT_WORKS.map((card, i) => (
                <div key={card.title} className="ab-card">
                  <span className="ab-card-ico" aria-hidden="true"><FontAwesomeIcon icon={HOW_ICONS[i]} /></span>
                  <h3 className="ab-h3">{card.title}</h3>
                  <p>{renderLinkedText(card.text, card.links)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Differentiators ── */}
        <section className="ab-band" id="differentiators" aria-labelledby="ab-diff-h">
          <div className="ab-inner ab-diff-wrap">
            <div>
              <h2 id="ab-diff-h" className="ab-h2">What Makes InfoWebWorld Different</h2>
              <ul className="ab-diff">
                {DIFFERENTIATORS.map((d, i) => (
                  <li key={d.title}>
                    <span className="ab-diff-ico" aria-hidden="true"><FontAwesomeIcon icon={DIFF_ICONS[i]} /></span>
                    <p><strong>{d.title}</strong> {d.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="ab-poster">
              <img
                src="/illustrations/why-trust-infowebworld.png"
                alt="Why Trust InfoWebWorld? 1. Leads Generation — Turn Your Listing into a Lead Generation Engine. 2. Customer-First Approach — Your goals are our priority, we listen and understand your needs. 3. Verified Reviews — Build Trust That Converts; turn customer feedback into your strongest growth asset. 4. Search and AI Visibility — Powerful SEO-optimized asset that ranks across search engines and AI platforms."
                width={1080}
                height={1350}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        {/* ── Directory by category ── */}
        <section className="ab-band ab-band--tint" id="directories" aria-labelledby="ab-dir-h">
          <div className="ab-inner">
            <h2 id="ab-dir-h" className="ab-h2">Explore the Business Directory by Category</h2>
            <p className="ab-lead">{renderLinkedText(CATEGORY_INTRO.text, CATEGORY_INTRO.links)}</p>
            <div className="ab-dirs">
              {DIRECTORIES.map(d => (
                <div key={d.slug} className="ab-dir" style={{ '--ab-dir': d.accent } as React.CSSProperties}>
                  <span className="ab-dir-ico" aria-hidden="true"><FontAwesomeIcon icon={d.icon} /></span>
                  <h3 className="ab-dir-name">
                    <Link href={d.href} className="ab-dir-link">{d.name}</Link>
                  </h3>
                  <p className="ab-dir-desc">{d.desc}</p>
                  <span className="ab-dir-count">
                    {d.subcategories.toLocaleString('en-US')} subcategories
                    <FontAwesomeIcon icon={faArrowRight} className="ab-dir-arrow" aria-hidden="true" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Verification ── */}
        <section className="ab-band" id="verification" aria-labelledby="ab-verify-h">
          <div className="ab-inner ab-verify">
            <h2 id="ab-verify-h" className="ab-h2">How We Verify Listings and Keep Reviews Real</h2>
            <ol className="ab-steps">
              {VERIFY_STEPS.map((step, i) => (
                <li key={step.title} className="ab-step">
                  <span className="ab-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <p><strong>{step.title}</strong> {renderLinkedText(step.text, step.links)}</p>
                </li>
              ))}
            </ol>
            <p className="ab-note">
              <FontAwesomeIcon icon={faLifeRing} className="ab-note-ico" aria-hidden="true" />
              <span>{renderLinkedText(VERIFY_FOOTNOTE.text, VERIFY_FOOTNOTE.links)}</span>
            </p>
          </div>
        </section>

        {/* ── Our story ── */}
        <section className="ab-band ab-band--tint" id="story" aria-labelledby="ab-story-h">
          <div className="ab-inner ab-story">
            <div>
              <h2 id="ab-story-h" className="ab-h2">Our Story: Built by Brain Stream Australia</h2>
              <p>{renderLinkedText(STORY.text, STORY.links)}</p>
            </div>
            <figure className="ab-map">
              <iframe
                src="https://maps.google.com/maps?q=Parramatta+NSW+2150+Australia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                title="Map of Brain Stream Australia headquarters - Parramatta, NSW 2150, Australia"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <figcaption>
                <address className="ab-map-addr">
                  <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /> Parramatta, NSW 2150, Australia
                </address>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="ab-map-link">
                  Open in Google Maps
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── Who uses it ── */}
        <section className="ab-band" id="who-uses" aria-labelledby="ab-who-h">
          <div className="ab-inner">
            <h2 id="ab-who-h" className="ab-h2">Who Uses InfoWebWorld?</h2>
            <ul className="ab-who">
              {AUDIENCES.map((a, i) => (
                <li key={a.title} className="ab-who-item">
                  <span className="ab-who-ico" aria-hidden="true"><FontAwesomeIcon icon={WHO_ICONS[i]} /></span>
                  <p><strong>{a.title}</strong> {renderLinkedText(a.text, a.links)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Resources (relevant blog posts, newest fill in) ── */}
        <section className="ab-band ab-band--tint" id="resources" aria-labelledby="ab-res-h">
          <div className="ab-inner">
            <div className="ab-sec-head">
              <h2 id="ab-res-h" className="ab-h2">Resources, Guides and Insights</h2>
              <Link href="/blog" className="ab-more">
                All articles <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            </div>
            {posts.length > 0 ? (
              <div className="ab-posts">
                {posts.map(post => {
                  const date = formatPostDate(post.publishedAt)
                  return (
                    <article key={post.slug} className="ab-post">
                      <div className="ab-post-media">
                        <div className="ab-post-ph" aria-hidden="true"><FontAwesomeIcon icon={faNewspaper} /></div>
                        {post.coverImage ? <BlogCoverImage src={post.coverImage} alt={post.title} /> : null}
                      </div>
                      <div className="ab-post-body">
                        {post.category ? <span className="ab-post-cat">{post.category}</span> : null}
                        <h3 className="ab-post-title">
                          <Link href={`/blog/${post.slug}`} className="ab-post-link">{post.title}</Link>
                        </h3>
                        {post.excerpt ? <p className="ab-post-excerpt">{post.excerpt}</p> : null}
                        <p className="ab-post-meta">
                          {date ? `${date} · ` : ''}{post.readTime} min read
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p>
                Read our latest guides on the <Link href="/blog">InfoWebWorld blog</Link>.
              </p>
            )}
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="ab-band" id="faq" aria-labelledby="ab-faq-h">
          <div className="ab-inner ab-inner--narrow">
            <h2 id="ab-faq-h" className="ab-h2">FAQs</h2>
            <div className="ab-faqs">
              {ABOUT_FAQS.map((faq, i) => (
                <details key={faq.q} className="ab-faq" open={i === 0}>
                  <summary>
                    <h3 className="ab-faq-q">{faq.q}</h3>
                    <FontAwesomeIcon icon={faChevronDown} className="ab-faq-chev" aria-hidden="true" />
                  </summary>
                  <p className="ab-faq-a">{renderLinkedText(faq.a, faq.links)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="ab-final" aria-labelledby="ab-final-h">
          <div className="ab-final-inner">
            <h2 id="ab-final-h" className="ab-final-title">Get in Touch or List Your Business Today</h2>
            <p className="ab-final-sub">{CLOSING}</p>
            <div className="ab-cta-row">
              <Link href="/business/plans" className="ab-btn ab-btn--light">
                List Your Business Free <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ab-btn ab-btn--outline">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
