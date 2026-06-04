import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ──────────────────────────────────────────────
   Canonical IDs — every schema cross-references
   these so Google reads one connected graph
   ──────────────────────────────────────────── */
const URL_PAGE         = 'https://www.infowebworld.com/about'
const ID_BREADCRUMB    = `${URL_PAGE}#breadcrumb`
const ID_WEBPAGE       = `${URL_PAGE}#webpage`
const ID_FAQ           = `${URL_PAGE}#faq`
const ID_DIFF_LIST     = `${URL_PAGE}#differentiators`
const ID_SERVICE       = `${URL_PAGE}#service`
const ID_GLOSSARY      = `${URL_PAGE}#glossary`
const ID_QUOTE_MISSION = `${URL_PAGE}#quote-mission`
const ID_QUOTE_TRUST   = `${URL_PAGE}#quote-trust`
const ID_WEBSITE       = 'https://www.infowebworld.com/#website'
const ID_ORGANIZATION  = 'https://www.infowebworld.com/#organization'
const ID_ADDRESS       = 'https://www.infowebworld.com/#address'

const FOUNDING_YEAR    = '2026'
const FOUNDED_ISO      = '2026-01-01'

/* ──────────────────────────────────────────────
   Metadata (Next.js generates <head> tags)
   ──────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.infowebworld.com'),
  title: 'About InfoWebWorld — Our Story, Mission & Global Business Discovery Platform',
  description:
    'InfoWebWorld is the global business discovery platform for verified listings, real reviews, dofollow backlinks, and AI-era visibility — built by Brain Stream Australia (Parramatta, NSW), covering 80+ industries across 12+ countries.',
  keywords: [
    'InfoWebWorld', 'business discovery platform', 'verified business reviews',
    'global business directory', 'AI search visibility', 'AEO',
    'answer engine optimization', 'generative engine optimization', 'GEO',
    'SEO backlinks', 'dofollow backlinks', 'lead generation platform',
    'Brain Stream Australia', 'Parramatta NSW', 'business listing AU',
  ],
  alternates: {
    canonical: URL_PAGE,
    languages: { 'en-US': URL_PAGE, 'x-default': URL_PAGE },
  },
  openGraph: {
    type: 'website',
    url: URL_PAGE,
    siteName: 'InfoWebWorld',
    title: 'About InfoWebWorld — Global Business Discovery Platform',
    description:
      'The story behind InfoWebWorld — a global growth platform where verified businesses get discovered by buyers and AI engines alike.',
    locale: 'en_US',
    images: [
      { url: 'https://www.infowebworld.com/og-image.png', width: 1200, height: 630, alt: 'InfoWebWorld — Global Growth Platform', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@infowebworld_x',
    creator: '@infowebworld_x',
    title: 'About InfoWebWorld',
    description: 'The global growth platform for verified business discovery.',
    images: ['https://www.infowebworld.com/og-image.png'],
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
    'revisit-after': '7 days',
    'dc.creator':    'Brain Stream Australia Pty Ltd',
    'dc.publisher':  'Brain Stream Australia Pty Ltd',
    'dc.language':   'en-US',
    'dc.subject':    'Business discovery platform, AI search visibility',
    'dc.coverage':   'Worldwide',
  },
}

const DIFFERENTIATORS = [
  { t: 'Verified listings only',    d: 'Human-curated. Spam and duplicates rejected.' },
  { t: 'Real reviews',              d: 'Verified users. Merit-based ranking, never ad spend.' },
  { t: 'Global and local',          d: 'Country and city level discovery — your call.' },
  { t: 'Permanent dofollow links',  d: 'Lasting SEO value, not rented rankings.' },
  { t: 'AI-powered discovery',      d: 'Surfaces alternatives and compares in seconds.' },
  { t: 'Built for the AI era',      d: 'Structured, crawlable, citation-friendly.' },
]

/* ──────────────────────────────────────────────
   Expanded FAQ — 14 entries for AEO surface area
   ──────────────────────────────────────────── */
const FAQ = [
  { q: 'What is InfoWebWorld?',
    a: 'InfoWebWorld is a global business discovery platform where verified businesses get listed, reviewed, and discovered by buyers and AI engines across 80+ industries, 13,000+ categories, and 12+ countries.' },
  { q: 'Who runs InfoWebWorld?',
    a: 'InfoWebWorld is a product of Brain Stream Australia Pty Ltd — an Australian technology company with over two decades of experience building SEO, content, and directory products.' },
  { q: 'Where is InfoWebWorld headquartered?',
    a: 'InfoWebWorld is headquartered in Parramatta, New South Wales 2150, Australia (latitude -33.8136, longitude 151.0034).' },
  { q: 'When was InfoWebWorld founded?',
    a: 'InfoWebWorld was founded in 2026 by Brain Stream Australia Pty Ltd.' },
  { q: 'How is InfoWebWorld different from other business directories?',
    a: 'InfoWebWorld is human-curated (no spam), uses verified reviews only (no pay-to-play ranking), provides permanent dofollow backlinks for real SEO value, and is structured for AI answer engines like Google, Perplexity, ChatGPT, Gemini, and Claude.' },
  { q: 'What industries does InfoWebWorld cover?',
    a: 'InfoWebWorld covers 80+ industries including AI & Machine Learning, Software & SaaS, IT Services, Startups, Local Businesses, Professional Services, Healthcare, Fintech, E-commerce, EdTech, Marketing, and Cybersecurity.' },
  { q: 'Is InfoWebWorld free?',
    a: 'Yes. InfoWebWorld is free for buyers to search and compare businesses. Businesses can submit free listings; paid plans add dofollow backlinks, enhanced visibility, lead generation, and AI-era optimisation.' },
  { q: 'How does InfoWebWorld verify reviews?',
    a: 'Every review comes from a verified user. Ranking is based on merit, engagement, and trust signals — never ad spend or pay-to-play placement.' },
  { q: 'What is AEO (Answer Engine Optimization)?',
    a: 'AEO is the practice of optimising content for AI answer engines like ChatGPT, Perplexity, Gemini, and Claude. InfoWebWorld listings are structured with schema.org markup, semantic HTML, and citation-ready content so AI engines can extract and cite them accurately.' },
  { q: 'What is a dofollow backlink and why does it matter?',
    a: 'A dofollow backlink is a hyperlink that passes SEO authority from the linking page to the destination. InfoWebWorld provides permanent dofollow backlinks on paid listings — adding real, lasting domain authority to your website (unlike nofollow links from most directories).' },
  { q: 'How does InfoWebWorld rank businesses?',
    a: 'Ranking is based on verified review quality, engagement signals, completeness of the listing, and trust factors. There is no pay-to-rank: paid plans add visibility features but never buy higher ranking positions.' },
  { q: 'Can businesses from any country list on InfoWebWorld?',
    a: 'Yes. InfoWebWorld is a global platform serving businesses worldwide. The interface is currently English, with multi-country search at country and city level. The platform actively covers 12+ countries with continuous expansion.' },
  { q: 'How is InfoWebWorld different from Google Business Profile, Yelp, or G2?',
    a: 'Google Business Profile focuses on local map-pack listings. Yelp focuses on consumer reviews of local businesses. G2 focuses on software reviews. InfoWebWorld combines cross-industry coverage (80+ sectors, not just local or software), verified reviews, permanent dofollow backlinks, and explicit AI-era optimisation across both classic search engines and AI answer engines.' },
  { q: 'How does InfoWebWorld optimise for AI search engines?',
    a: 'Every listing includes schema.org structured data (Organization, LocalBusiness, Service, FAQPage where applicable), semantic HTML5 markup, Speakable annotations for voice assistants, geo coordinates for local intent, and citation-ready prose for AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.' },
]

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
  image: 'https://www.infowebworld.com/og-image.png',
  description:
    'Global business discovery platform with verified reviews, dofollow backlinks, lead generation, and AI-era visibility across 80+ industries and 12+ countries.',
  slogan: 'Global Growth Platform',
  foundingDate: FOUNDED_ISO,
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
    hasMap: 'https://www.google.com/maps/place/Parramatta+NSW+2150,+Australia',
  },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  knowsAbout: [
    'Business discovery',
    'Online business directories',
    'Verified business reviews',
    'Search engine optimization (SEO)',
    'Answer engine optimization (AEO)',
    'Generative engine optimization (GEO)',
    'Dofollow backlinks',
    'Lead generation for businesses',
    'AI-powered search and discovery',
    'Structured data and Schema.org',
    'Citation-ready content for AI engines',
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
   JSON-LD @graph — 10 cross-linked schemas
   ──────────────────────────────────────────── */
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    /* 1 — WebSite (with SearchAction for sitelinks search box) */
    {
      '@type': 'WebSite',
      '@id': ID_WEBSITE,
      url: 'https://www.infowebworld.com',
      name: 'InfoWebWorld',
      alternateName: 'Info Web World',
      description: 'The global business discovery platform — verified listings, real reviews, and AI-era visibility.',
      inLanguage: 'en-US',
      publisher: { '@id': ID_ORGANIZATION },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://www.infowebworld.com/search?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },

    /* 2 — Organization */
    ORG_NODE,

    /* 3 — BreadcrumbList */
    {
      '@type': 'BreadcrumbList',
      '@id': ID_BREADCRUMB,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://www.infowebworld.com' },
        { '@type': 'ListItem', position: 2, name: 'About', item: URL_PAGE },
      ],
    },

    /* 4 — AboutPage + Article (multi-type for max AI-engine extraction) */
    {
      '@type': ['AboutPage', 'Article'],
      '@id': ID_WEBPAGE,
      url: URL_PAGE,
      name: 'About InfoWebWorld — Global Business Discovery Platform',
      alternateName: 'About InfoWebWorld',
      headline: 'About InfoWebWorld — Built for the AI era of business discovery',
      alternativeHeadline: 'About InfoWebWorld — our story, mission, and the team behind the platform',
      description: 'InfoWebWorld is the global growth platform for verified business discovery, built by Brain Stream Australia for the AI era of search.',
      inLanguage: 'en-US',
      isPartOf: { '@id': ID_WEBSITE },
      breadcrumb: { '@id': ID_BREADCRUMB },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.infowebworld.com/og-image.png',
        width: 1200, height: 630,
      },
      image: 'https://www.infowebworld.com/og-image.png',
      datePublished: FOUNDED_ISO,
      dateModified:  FOUNDED_ISO,
      author:    { '@id': ID_ORGANIZATION },
      publisher: { '@id': ID_ORGANIZATION },
      mainEntity: { '@id': ID_ORGANIZATION },
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Businesses seeking AI-era visibility, verified reviews, dofollow backlinks, and lead generation across 80+ industries',
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.ab-title', '.ab-lede', '.ab-h2', '#mission p'],
      },
      about: [
        { '@type': 'Thing', name: 'Business discovery platform' },
        { '@type': 'Thing', name: 'AI-powered search and discovery' },
        { '@type': 'Thing', name: 'Verified business reviews' },
        { '@type': 'Thing', name: 'Lead generation for businesses' },
        { '@type': 'Thing', name: 'Search engine and AI visibility (SEO, AEO, GEO)' },
        { '@type': 'Thing', name: 'Brain Stream Australia Pty Ltd' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'Google' },
        { '@type': 'Organization', name: 'Perplexity AI' },
        { '@type': 'Organization', name: 'OpenAI', alternateName: 'ChatGPT' },
        { '@type': 'Organization', name: 'Anthropic', alternateName: 'Claude' },
        { '@type': 'Organization', name: 'Google DeepMind', alternateName: 'Gemini' },
      ],
      hasPart: [
        { '@id': ID_FAQ },
        { '@id': ID_DIFF_LIST },
        { '@id': ID_SERVICE },
        { '@id': ID_GLOSSARY },
      ],
      keywords: 'business discovery, verified reviews, dofollow backlinks, AI visibility, AEO, GEO, business directory, global growth platform, InfoWebWorld, Brain Stream Australia',
      wordCount: 380,
      articleSection: 'About',
    },

    /* 5 — FAQPage (14 Q&A pairs — AEO gold) */
    {
      '@type': 'FAQPage',
      '@id': ID_FAQ,
      isPartOf: { '@id': ID_WEBPAGE },
      inLanguage: 'en-US',
      mainEntity: FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a, inLanguage: 'en-US' },
      })),
    },

    /* 6 — ItemList for differentiators (potential carousel rich result) */
    {
      '@type': 'ItemList',
      '@id': ID_DIFF_LIST,
      name: 'What makes InfoWebWorld different',
      description: 'Six factors that distinguish InfoWebWorld from typical business directories.',
      numberOfItems: DIFFERENTIATORS.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: DIFFERENTIATORS.map((d, i) => ({
        '@type': 'ListItem', position: i + 1, name: d.t, description: d.d,
      })),
    },

    /* 7 — Service (what InfoWebWorld provides) */
    {
      '@type': 'Service',
      '@id': ID_SERVICE,
      name: 'InfoWebWorld Business Discovery Platform',
      serviceType: 'Business directory and discovery platform',
      provider: { '@id': ID_ORGANIZATION },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Businesses across 80+ industries seeking AI-era visibility, verified reviews, and lead generation',
      },
      termsOfService: 'https://www.infowebworld.com/terms',
      category: 'Business directory',
      offers: { '@type': 'AggregateOffer', url: 'https://www.infowebworld.com/business/plans', priceCurrency: 'USD', lowPrice: '0', highPrice: '239' },
    },

    /* 8 — DefinedTermSet (glossary — entity-clarifying for AI engines) */
    {
      '@type': 'DefinedTermSet',
      '@id': ID_GLOSSARY,
      name: 'InfoWebWorld glossary',
      hasDefinedTerm: [
        {
          '@type': 'DefinedTerm',
          name: 'Global growth platform',
          description: "InfoWebWorld's positioning: a global discovery platform combining verified listings, real reviews, and AI-era visibility into a single growth surface for businesses.",
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'Verified listing',
          description: 'A business listing that has been human-reviewed and confirmed against the platform\u2019s content guidelines before publication.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'Verified review',
          description: 'A review submitted only by a user whose identity and platform use have been confirmed; the basis for InfoWebWorld\u2019s merit-based ranking.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'Dofollow backlink',
          description: 'A hyperlink that passes SEO authority from the linking page to the destination. InfoWebWorld provides permanent dofollow backlinks on paid listings.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'AEO',
          description: 'Answer Engine Optimization \u2014 the practice of structuring content so AI answer engines (ChatGPT, Perplexity, Gemini, Claude) can extract and cite it accurately.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'GEO',
          description: 'Generative Engine Optimization \u2014 a superset of AEO that includes optimisation for generative AI surfaces such as Google AI Overviews, ChatGPT Search, and Perplexity.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
        {
          '@type': 'DefinedTerm',
          name: 'Pay-to-play ranking',
          description: 'The anti-pattern of allowing advertisers to buy higher ranking positions. InfoWebWorld explicitly rejects this model.',
          inDefinedTermSet: { '@id': ID_GLOSSARY },
        },
      ],
    },

    /* 9 — Quotation (mission statement, citation-ready) */
    {
      '@type': 'Quotation',
      '@id': ID_QUOTE_MISSION,
      text: 'Mission: help real buyers find real businesses, faster.',
      creator: { '@id': ID_ORGANIZATION },
      creditText: 'InfoWebWorld',
      dateCreated: FOUNDED_ISO,
      inLanguage: 'en-US',
      about: { '@id': ID_ORGANIZATION },
    },

    /* 10 — Quotation (trust statement) */
    {
      '@type': 'Quotation',
      '@id': ID_QUOTE_TRUST,
      text: 'Every listing is human-curated; every review is verified; every ranking is earned on merit, never bought.',
      creator: { '@id': ID_ORGANIZATION },
      creditText: 'InfoWebWorld',
      dateCreated: FOUNDED_ISO,
      inLanguage: 'en-US',
      about: { '@id': ID_ORGANIZATION },
    },
  ],
}

/* ──────────────────────────────────────────────
   Page
   ──────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className="ab" id="top" role="main">
        <article className="ab-wrap" itemScope itemType="https://schema.org/AboutPage">
          <meta itemProp="inLanguage"     content="en-US" />
          <meta itemProp="datePublished"  content={FOUNDED_ISO} />
          <meta itemProp="dateModified"   content={FOUNDED_ISO} />
          <meta itemProp="url"            content={URL_PAGE} />
          <meta itemProp="image"          content="https://www.infowebworld.com/og-image.png" />

          <header className="ab-header">
            <nav className="ab-crumb" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href="/" itemProp="item"><span itemProp="name">Home</span></a>
                <meta itemProp="position" content="1" />
              </span>
              <span aria-hidden="true">/</span>
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">About</span>
                <meta itemProp="position" content="2" />
              </span>
            </nav>
            <div className="ab-head-row">
              <div className="ab-head-titles">
                <span className="ab-kicker">About <cite>InfoWebWorld</cite></span>
                <h1 className="ab-title" itemProp="headline">
                  The <dfn title="A growth platform combining verified listings, real reviews, dofollow backlinks, and AI-era visibility">global growth platform</dfn> for verified business discovery.
                </h1>
              </div>
              <p className="ab-lede" itemProp="description">
                We help buyers find verified companies, real reviews, and the signals they need to decide — across <mark>80+ industries</mark> and <mark>12+ countries</mark>.
              </p>
            </div>
          </header>

          <div className="ab-grid">
            {/* ── Mission ── */}
            <section className="ab-col" id="mission" aria-labelledby="h-mission">
              <h2 className="ab-h2" id="h-mission">Our mission</h2>
              <p>
                Business discovery online is broken — search results cluttered with ads, ranking pay-to-play, reviews not always trusted. We think buyers deserve better.
              </p>
              <p>
                <strong><cite>InfoWebWorld</cite></strong> is the global growth platform where verified businesses get discovered on merit. <mark>Mission: help real buyers find real businesses, faster.</mark>
              </p>
            </section>

            {/* ── Differentiators (ItemList) ── */}
            <section
              className="ab-col"
              id="differentiators"
              aria-labelledby="h-diff"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="name" content="What makes InfoWebWorld different" />
              <meta itemProp="numberOfItems" content={String(DIFFERENTIATORS.length)} />
              <h2 className="ab-h2" id="h-diff">What makes us different</h2>
              <ol className="ab-diff">
                {DIFFERENTIATORS.map((d, i) => (
                  <li
                    key={d.t}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={String(i + 1)} />
                    <strong itemProp="name">{d.t}.</strong>{' '}
                    <span itemProp="description">{d.d}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Built by Brain Stream Australia (Organization microdata) ── */}
            <section
              className="ab-col"
              id="company"
              aria-labelledby="h-company"
              itemScope
              itemType="https://schema.org/Organization"
              itemID={ID_ORGANIZATION}
            >
              <meta itemProp="legalName"    content="Brain Stream Australia Pty Ltd" />
              <meta itemProp="foundingDate" content={FOUNDED_ISO} />
              <meta itemProp="url"          content="https://www.infowebworld.com" />
              <h2 className="ab-h2" id="h-company">
                Built by <span itemProp="name"><cite>Brain Stream Australia</cite></span>
              </h2>
              <p>
                A product of{' '}
                <strong><cite>Brain Stream Australia Pty Ltd</cite></strong>, headquartered in{' '}
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressLocality">Parramatta</span>,{' '}
                  <abbr title="New South Wales"><span itemProp="addressRegion">NSW</span></abbr>
                </span>
                . Founded <time dateTime={FOUNDED_ISO}>{FOUNDING_YEAR}</time>. Two decades of building{' '}
                <abbr title="Search Engine Optimization">SEO</abbr>, content, and directory products.{' '}
                <a href="/contact">Get in touch &rarr;</a>
              </p>
              <figure className="ab-map">
                <iframe
                  src="https://maps.google.com/maps?q=Parramatta+NSW+2150+Australia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  title="Map of Brain Stream Australia headquarters — Parramatta, NSW 2150, Australia"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption>
                  <address className="ab-map-addr">Parramatta, NSW 2150</address>
                  <a
                    href="https://www.google.com/maps/place/Parramatta+NSW+2150,+Australia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-map-link"
                    itemProp="hasMap"
                  >
                    Open &rarr;
                  </a>
                </figcaption>
              </figure>
            </section>

            {/* ── Why trust (poster image) ── */}
            <aside
              className="ab-col ab-col-poster"
              id="why-trust"
              aria-labelledby="h-trust"
            >
              <h2 className="ab-h2" id="h-trust">Why trust <cite>InfoWebWorld</cite>?</h2>
              <figure className="ab-poster">
                <img
                  src="/illustrations/why-trust-infowebworld.png"
                  alt="Why Trust InfoWebWorld? 1. Leads Generation — Turn Your Listing into a Lead Generation Engine. 2. Customer-First Approach — Your goals are our priority, we listen and understand your needs. 3. Verified Reviews — Build Trust That Converts; turn customer feedback into your strongest growth asset. 4. Search and AI Visibility — Powerful SEO-optimized asset that ranks across search engines and AI platforms."
                  width={1080}
                  height={1350}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
                <figcaption className="ab-sr-only">
                  Four reasons to trust InfoWebWorld: Leads Generation, Customer-First Approach, Verified Reviews, and Search and AI Visibility.
                </figcaption>
              </figure>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
