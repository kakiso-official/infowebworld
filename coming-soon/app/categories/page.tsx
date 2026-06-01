import type { Metadata } from 'next'
import { Suspense } from 'react'

/* Fully static — taxonomy comes from app/config/categories-data.ts (generated
   by scripts/export-categories.mjs). No DB queries, no ISR, no force-dynamic.
   Pages are pre-rendered at deploy time and served from the CDN for free. */
export const dynamic = 'force-static'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AiDisclaimer from '../components/AiDisclaimer'
import CategoriesBrowse from './CategoriesBrowse'
import { CATEGORIES } from '../config/categories-data'
import {
  BASE_URL, ID_ORG, ID_WEBSITE, ID_LOGO,
  organizationNode, brandNode, websiteNode,
  breadcrumbNode, faqNode, howToNode, itemListNode,
} from '../components/seo-schema'
import HIcon from '../sector/components/HIcon'

const URL_CAT = `${BASE_URL}/categories`

/* ── Hand-curated sector copy for SEO/AEO. Names match what the L1 rows
      look like in categories-data.ts; slug + Hugeicon name + brand color + description. ── */
const SECTOR_COPY: Record<string, { slug: string; icon: string; color: string; short: string; long: string }> = {
  'ai-ml': {
    slug: 'ai-ml',
    icon: 'cpu',
    color: '#4361EE',
    short: 'AI & Machine Learning',
    long: 'Browse AI chatbots, AI writing tools, AI image and video generation, AI code copilots, AI agent frameworks, AI productivity, AI marketing, and applied AI across every vertical — from sales to finance to design.',
  },
  'software-saas': {
    slug: 'software-saas',
    icon: 'code',
    color: '#3B82F6',
    short: 'Software & SaaS',
    long: 'Compare sales CRM, marketing automation, HR and payroll software, developer tools, project management, communication platforms, cybersecurity, analytics, BI, and ERP. Real reviews, real features, side-by-side comparison.',
  },
  'it-services-agencies': {
    slug: 'it-services-agencies',
    icon: 'globe',
    color: '#14B8A6',
    short: 'IT Services & Agencies',
    long: 'Discover custom software development firms, web and mobile app agencies, SEO agencies, cloud migration consultants, UX/UI studios, cybersecurity consultants, and AI/ML dev shops across 12+ countries.',
  },
  'startups-innovation': {
    slug: 'startups-innovation',
    icon: 'trendingUp',
    color: '#8B5CF6',
    short: 'Startups & Innovation',
    long: 'Explore FinTech, HealthTech, EdTech, climate tech, AI-native startups, Web3 and blockchain projects, VCs, accelerators, incubators, and the people building and funding the future.',
  },
  'local-businesses': {
    slug: 'local-businesses',
    icon: 'home',
    color: '#F59E0B',
    short: 'Local Businesses',
    long: 'Find restaurants, beauty and spa, home repair, automotive, doctors, pet services, retail, wedding vendors, schools, and hospitality businesses — verified, reviewed, and rankable by city.',
  },
  'professional-services': {
    slug: 'professional-services',
    icon: 'briefcase',
    color: '#E8553D',
    short: 'Professional Services',
    long: 'Browse law firms, accountants, financial advisors, management consulting, engineering firms, architects, real estate, HR consulting, coaching, and corporate training providers worldwide.',
  },
}

const SECTOR_ORDER = ['ai-ml', 'software-saas', 'it-services-agencies', 'startups-innovation', 'local-businesses', 'professional-services'] as const

const faqs = [
  {
    q: 'How many business categories does InfoWebWorld cover?',
    a: 'InfoWebWorld covers 6 top-level sectors, 211 Level-2 categories, and 13,843 Level-3 subcategories across 80+ industries and 12+ countries — for a total of 14,060 categorized business areas. The taxonomy is human-curated and updated as new markets emerge.',
  },
  {
    q: 'What are the 6 main business sectors on InfoWebWorld?',
    a: 'The six sectors are: AI & Machine Learning, Software & SaaS, IT Services & Agencies, Startups & Innovation, Local Businesses, and Professional Services. Each sector contains dozens of categories and hundreds to thousands of subcategories.',
  },
  {
    q: 'How is the InfoWebWorld category taxonomy organized?',
    a: 'Three levels: Sector (L1) is the broad industry grouping like "AI & ML". Category (L2) is a specific market inside a sector, like "AI Chatbots". Subcategory (L3) is the precise niche, like "Customer Support Chatbots". Buyers can search broad or narrow.',
  },
  {
    q: 'How do I find a business by category on InfoWebWorld?',
    a: 'Use the search bar on the categories page to type any keyword — it searches across all 14,060 categories instantly. Or browse by clicking a sector to expand its categories and subcategories, then click any subcategory to see all verified businesses listed under it.',
  },
  {
    q: 'What is the difference between a sector, a category, and a subcategory?',
    a: 'A sector is the top-level industry grouping (6 total on InfoWebWorld). A category is a specific market inside a sector (211 total). A subcategory is the precise niche where buyers compare alternatives side by side (13,843 total). Listings are tagged to one primary subcategory plus up to two secondary subcategories.',
  },
  {
    q: 'Can a business list in more than one category?',
    a: 'Yes. Each listing has one primary subcategory (Level 3) plus up to two secondary subcategories. This is useful when a product spans multiple markets — for example, a CRM with built-in AI features lists primarily under Sales CRM with AI Chatbots as a secondary tag.',
  },
  {
    q: 'Which business categories are growing fastest in 2026?',
    a: 'On InfoWebWorld, AI & Machine Learning subcategories are the fastest-growing — AI agent frameworks, AI code copilots, AI customer support, and AI sales tools in particular. FinTech, HealthTech, and AI-native startups are the fastest-growing inside Startups & Innovation.',
  },
  {
    q: 'Are InfoWebWorld business categories country-specific?',
    a: 'The taxonomy is global — the same 14,060 categories apply across every country. Listings themselves can be filtered by country and city for local discovery.',
  },
  {
    q: 'How often is the InfoWebWorld category taxonomy updated?',
    a: 'New categories and subcategories are added as new markets emerge. The taxonomy is reviewed quarterly. Significant changes — like splitting a category or adding a new sector — happen when sufficient buyer demand and listing supply justify it.',
  },
  {
    q: 'Is browsing the InfoWebWorld categories page free?',
    a: 'Yes. Browsing every sector, category, subcategory, and listing on InfoWebWorld is completely free for buyers. Only businesses pay — to be listed (free or paid plans available).',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear()
  const title = `Business Categories ${year} — 6 Sectors · 211 Categories · 13,843 Subcategories | InfoWebWorld`
  const description = `Browse the complete InfoWebWorld business directory taxonomy: 6 sectors, 211 categories, 13,843 subcategories across AI & ML, SaaS, IT Services, Startups, Local Businesses, and Professional Services. Verified companies, real reviews, side-by-side comparison.`

  return {
    title,
    description,
    keywords: [
      'business categories',
      'business directory categories',
      'list of business categories',
      'complete business taxonomy',
      'industry classification list',
      'B2B business categories list',
      'SaaS categories list',
      'AI tools categories',
      'IT services categories',
      'local business categories',
      'professional services categories',
      'startup categories list',
      'browse business categories by sector',
      'find business by category',
      'business directory taxonomy 2026',
      '14000 business subcategories',
      'AI ML company directory',
      'SaaS company directory by category',
      'AI agent frameworks directory',
      'AI code copilot directory',
      'AI chatbot category',
      'fintech category list',
      'healthtech category list',
      'edtech category list',
      'developer tools category',
      'cybersecurity category directory',
      'directory of CRM tools',
      'directory of marketing automation',
      'directory of project management software',
      'verified business listings by industry',
      'compare business by category',
      'sector category subcategory hierarchy',
      'comprehensive industry directory',
      'all business categories one page',
      'business niche directory',
    ],
    alternates: { canonical: URL_CAT },
    openGraph: {
      title: `Business Categories — 14,060 Categories Across 6 Sectors`,
      description: `Browse 6 sectors, 211 categories, and 13,843 subcategories of verified businesses. AI, SaaS, IT, Startups, Local, Professional Services.`,
      url: URL_CAT,
      siteName: 'InfoWebWorld',
      type: 'website',
      locale: 'en_US',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Business Categories' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Business Categories — 14,060 Categories Across 6 Sectors`,
      description: `6 sectors · 211 categories · 13,843 subcategories. AI, SaaS, IT, Startups, Local, Pro Services.`,
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      /* Article-style social preview enrichment (LinkedIn/Facebook). */
      'article:section': 'Business Directory',
      'article:tag': 'business categories,industry taxonomy,SaaS directory,AI directory,business listings',
      'article:published_time': '2026-04-24T11:11:04Z',
      'article:modified_time': new Date().toISOString(),
      /* Dublin Core — niche but parsed by academic + some news crawlers. */
      'DC.title': `Business Categories — InfoWebWorld`,
      'DC.description': `6 sectors, 211 categories, 13,843 subcategories of verified businesses.`,
      'DC.creator': 'Brain Stream Australia Pty Ltd',
      'DC.publisher': 'InfoWebWorld',
      'DC.subject': 'business directory, industry taxonomy, SaaS, AI tools, IT services',
      'DC.language': 'en-US',
      'DC.coverage': 'Worldwide',
      'DC.type': 'Collection',
      /* Geo — Australian local SEO signal. */
      'geo.region': 'AU-NSW',
      'geo.placename': 'Parramatta',
      'geo.position': '-33.8136;151.0034',
      ICBM: '-33.8136, 151.0034',
      /* Brand color hint for browsers + Slack/Discord embeds. */
      'theme-color': '#E8553D',
      'og:see_also': `${BASE_URL}/category-guides`,
    },
  }
}

export default async function CategoriesPage() {
  /* Stats come from the static file — used for the SEO skeleton below. The
     actual tree is imported directly inside <CategoriesBrowse> (client),
     so the 14K rows never get serialized into the HTML hydration payload. */
  const l1Rows = CATEGORIES.filter(r => r.level === 1)
  const sectors = l1Rows.length
  const l2Count = CATEGORIES.filter(r => r.level === 2).length
  const l3Count = CATEGORIES.filter(r => r.level === 3).length
  const totalListings = CATEGORIES.reduce((s, r) => s + (r.listing_count || 0), 0)

  /* Map L1 slug -> live data so the sector list reflects the actual taxonomy. */
  const sectorList = SECTOR_ORDER
    .map(slug => {
      const row = l1Rows.find(r => r.slug === slug || r.sector_slug === slug)
      const copy = SECTOR_COPY[slug]
      if (!copy) return null
      return {
        name: row?.name ?? copy.short,
        slug: copy.slug,
        icon: copy.icon,
        color: copy.color,
        short: copy.short,
        long: copy.long,
        l2Children: CATEGORIES.filter(r => r.level === 2 && r.sector_slug === slug).length,
        l3Children: CATEGORIES.filter(r => r.level === 3 && r.sector_slug === slug).length,
      }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)

  const year = new Date().getFullYear()
  const title = `Business Categories ${year} — 6 Sectors · 211 Categories · 13,843 Subcategories | InfoWebWorld`
  const description = `Browse the complete InfoWebWorld business directory taxonomy: 6 sectors, 211 categories, 13,843 subcategories across AI & ML, SaaS, IT Services, Startups, Local Businesses, and Professional Services. Verified companies, real reviews, side-by-side comparison.`

  /* ── Schema graph ── */
  const ID_BREADCRUMB = `${URL_CAT}#breadcrumb`
  const ID_WEBPAGE    = `${URL_CAT}#webpage`
  const ID_ITEMLIST   = `${URL_CAT}#sectorlist`
  const ID_FAQ        = `${URL_CAT}#faq`
  const ID_HOWTO      = `${URL_CAT}#howto`
  const ID_TERMSET    = `${URL_CAT}#hierarchy`

  const webPageNode = {
    '@type': ['WebPage', 'CollectionPage'],
    '@id': ID_WEBPAGE,
    url: URL_CAT,
    name: title,
    headline: 'Business Categories',
    description,
    inLanguage: 'en-US',
    isPartOf: { '@id': ID_WEBSITE },
    breadcrumb: { '@id': ID_BREADCRUMB },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
      width: 1200, height: 630,
      caption: 'InfoWebWorld Business Categories',
    },
    publisher: { '@id': ID_ORG },
    about: [
      { '@type': 'Thing', name: 'Business categories' },
      { '@type': 'Thing', name: 'Industry taxonomy' },
      { '@type': 'Thing', name: 'Business directory' },
      { '@type': 'Thing', name: 'B2B discovery' },
      { '@type': 'Thing', name: 'Sector category subcategory hierarchy' },
      { '@type': 'Thing', name: 'AI tools directory' },
      { '@type': 'Thing', name: 'SaaS directory' },
      { '@type': 'Thing', name: 'Verified business listings' },
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Business buyers, founders, marketers, technology evaluators, SEO professionals',
    },
    accessibilityFeature: ['highContrastDisplay', 'readingOrder', 'structuralNavigation', 'tableOfContents', 'alternativeText'],
    accessibilityHazard: 'none',
    mentions: [
      { '@type': 'Thing', name: 'AI agent frameworks' },
      { '@type': 'Thing', name: 'AI code copilots' },
      { '@type': 'Thing', name: 'ChatGPT' },
      { '@type': 'Thing', name: 'Claude' },
      { '@type': 'Thing', name: 'Perplexity' },
      { '@type': 'Thing', name: 'Gemini' },
      { '@type': 'Thing', name: 'Google AI Overviews' },
      { '@type': 'Thing', name: 'Sales CRM' },
      { '@type': 'Thing', name: 'Marketing automation' },
      { '@type': 'Thing', name: 'Cybersecurity' },
      { '@type': 'Thing', name: 'FinTech' },
      { '@type': 'Thing', name: 'HealthTech' },
      { '@type': 'Thing', name: 'EdTech' },
      { '@type': 'Thing', name: 'Local SEO' },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.cd-server-h1', '.cd-server-desc', '.cd-server-h2'],
    },
    significantLink: sectorList.map(s => `${BASE_URL}/${s.slug}`),
    mainEntity: { '@id': ID_ITEMLIST },
    mainEntityOfPage: URL_CAT,
    numberOfItems: CATEGORIES.length,
    datePublished: '2026-04-24',
    dateCreated: '2026-04-24',
    dateModified: new Date().toISOString().split('T')[0],
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { '@id': ID_ORG },
    license: `${BASE_URL}/terms`,
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    keywords: [
      'business categories',
      'business directory',
      'industry taxonomy',
      'AI tools directory',
      'SaaS directory',
      'verified business listings',
      'browse by sector',
    ].join(', '),
  }

  const sectorItemList = {
    '@type': 'ItemList',
    '@id': ID_ITEMLIST,
    name: 'InfoWebWorld business sectors',
    description: 'Top-level industry sectors on InfoWebWorld, each containing dozens of categories and hundreds to thousands of subcategories.',
    numberOfItems: sectorList.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: sectorList.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/${s.slug}`,
      name: s.name,
      description: s.long,
      item: {
        '@type': 'Thing',
        '@id': `${BASE_URL}/${s.slug}#sector`,
        name: s.name,
        description: s.long,
        url: `${BASE_URL}/${s.slug}`,
      },
    })),
  }

  /* The full 14,060-row taxonomy is itself a curated Dataset. Google Dataset
     Search + LLM citation engines treat Dataset entities as high-trust sources. */
  const datasetNode = {
    '@type': 'Dataset',
    '@id': `${URL_CAT}#dataset`,
    name: 'InfoWebWorld global business directory taxonomy',
    alternateName: 'InfoWebWorld category dataset',
    description: `Human-curated 3-level taxonomy of ${CATEGORIES.length.toLocaleString()} business categories across 6 sectors, 211 categories, and 13,843 subcategories. Updated as new markets emerge. Used to classify every verified business listing on InfoWebWorld.`,
    url: URL_CAT,
    sameAs: URL_CAT,
    creator: { '@id': ID_ORG },
    publisher: { '@id': ID_ORG },
    license: `${BASE_URL}/terms`,
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    keywords: 'business categories, industry taxonomy, business directory, SaaS categories, AI tools categories, IT services categories, professional services, local businesses, startups',
    datePublished: '2026-04-24',
    dateModified: new Date().toISOString().split('T')[0],
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Sectors', value: sectors },
      { '@type': 'PropertyValue', name: 'Categories (Level 2)', value: l2Count },
      { '@type': 'PropertyValue', name: 'Subcategories (Level 3)', value: l3Count },
      { '@type': 'PropertyValue', name: 'Total taxonomy rows', value: CATEGORIES.length },
    ],
    spatialCoverage: { '@type': 'Place', name: 'Worldwide' },
    temporalCoverage: '2026/..',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: URL_CAT,
    },
  }

  const definedTermSet = {
    '@type': 'DefinedTermSet',
    '@id': ID_TERMSET,
    name: 'InfoWebWorld category hierarchy terms',
    inLanguage: 'en-US',
    hasDefinedTerm: [
      {
        '@type': 'DefinedTerm',
        '@id': `${URL_CAT}#term-sector`,
        name: 'Sector',
        alternateName: 'L1',
        description: 'The top-level industry grouping on InfoWebWorld. There are 6 sectors: AI & ML, Software & SaaS, IT Services & Agencies, Startups & Innovation, Local Businesses, Professional Services.',
        inDefinedTermSet: { '@id': ID_TERMSET },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${URL_CAT}#term-category`,
        name: 'Category',
        alternateName: 'L2',
        description: 'A specific market inside a sector. Example: "AI Chatbots" sits inside the "AI & ML" sector. InfoWebWorld has 211 categories.',
        inDefinedTermSet: { '@id': ID_TERMSET },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${URL_CAT}#term-subcategory`,
        name: 'Subcategory',
        alternateName: 'L3',
        description: 'A precise niche inside a category. Example: "Customer Support Chatbots" sits inside "AI Chatbots". InfoWebWorld has 13,843 subcategories.',
        inDefinedTermSet: { '@id': ID_TERMSET },
      },
    ],
  }

  const howToBrowse = howToNode({
    id: ID_HOWTO,
    name: 'How to find a business by category on InfoWebWorld',
    description: 'Four steps to find verified businesses by industry category on InfoWebWorld — search by keyword, browse by sector, drill into a subcategory, and compare alternatives.',
    totalTime: 'PT2M',
    steps: [
      { name: 'Open the categories page', text: 'Go to the InfoWebWorld categories page to see all 6 sectors and 14,000+ subcategories.', url: URL_CAT },
      { name: 'Search by keyword', text: 'Type a product, problem, or industry keyword in the search bar — for example "AI chatbot", "CRM", or "cybersecurity consultant". The search matches across all 14,060 categories instantly.' },
      { name: 'Or browse by sector', text: 'Click any of the 6 sector cards to expand its categories and subcategories. Pick the subcategory closest to what you need.' },
      { name: 'Compare verified businesses', text: 'On the subcategory page, see all verified businesses listed there. Filter by location, plan tier, and rating; click any listing for the full profile, reviews, and direct contact.' },
    ],
  })

  const faqJsonLd = faqNode(faqs, ID_FAQ, ID_WEBPAGE)

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      brandNode,
      websiteNode,
      breadcrumbNode(
        [
          { name: 'Home', url: BASE_URL },
          { name: 'Business Categories', url: URL_CAT },
        ],
        ID_BREADCRUMB,
      ),
      webPageNode,
      sectorItemList,
      datasetNode,
      definedTermSet,
      howToBrowse,
      faqJsonLd,
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <Navbar />

      {/* sr-only — H1 + breadcrumb only, so the page has a clear top-of-document
          heading and breadcrumb for screen readers + early-render crawlers. Rich
          content is in the VISIBLE section below the interactive browser. */}
      <div className="cd-server-skeleton">
        <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> / Business Categories
        </nav>
        <h1 className="cd-server-h1">
          Business Categories — {sectors} Sectors, {l2Count.toLocaleString()} Categories, {l3Count.toLocaleString()} Subcategories
        </h1>
        <p className="cd-server-desc">
          The complete InfoWebWorld business directory taxonomy. Browse {sectors} sectors,
          {' '}{l2Count.toLocaleString()} categories, and {l3Count.toLocaleString()} subcategories.
        </p>
      </div>

      <Suspense fallback={null}>
        <CategoriesBrowse />
      </Suspense>

      {/* Visible SEO/AEO section — same content the schema describes, fully crawlable
          AND user-facing. No risk of "hidden text" interpretation. */}
      <section className="cat-seo" aria-label="Browse, hierarchy, and FAQ">
        {/* TL;DR — answer-first paragraph for AI engines and featured snippets */}
        <div className="cat-seo-wrap cat-seo-tldr">
          <div className="cat-seo-tldr-card">
            <span className="cat-seo-tldr-label">What is this page</span>
            <p className="cat-seo-tldr-body">
              <strong>InfoWebWorld&apos;s complete business directory taxonomy.</strong> {sectors} top-level
              sectors, {l2Count.toLocaleString()} categories, and {l3Count.toLocaleString()} subcategories
              ({CATEGORIES.length.toLocaleString()} total rows) covering AI &amp; ML, Software &amp; SaaS,
              IT Services &amp; Agencies, Startups &amp; Innovation, Local Businesses, and Professional
              Services. Every listing is human-verified, every review is identity-checked, every ranking
              is merit-based.
            </p>
            <p className="cat-seo-tldr-meta">
              <span>Updated <time dateTime={new Date().toISOString().split('T')[0]}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></span>
              <span aria-hidden="true">·</span>
              <span>Human-curated</span>
              <span aria-hidden="true">·</span>
              <span>Free to browse</span>
            </p>
          </div>
        </div>

        <div className="cat-seo-wrap">
          <header className="cat-seo-head">
            <h2 className="cat-seo-h2">Browse by Sector</h2>
            <p className="cat-seo-section-desc">
              Six top-level industry sectors. Each contains dozens of categories and hundreds to
              thousands of subcategories. Click a sector to see every category and every verified
              business listed under it.
            </p>
          </header>
          <div className="cat-seo-grid" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="numberOfItems" content={String(sectorList.length)} />
            {sectorList.map((s, i) => (
              <a key={s.slug} href={`/${s.slug}`} className="cat-seo-sector"
                 itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`${BASE_URL}/${s.slug}`} />
                <span className="cat-seo-sector-icon" aria-hidden="true" style={{ background: `${s.color}14`, color: s.color }}>
                  <HIcon name={s.icon} size={18} color={s.color} sw={1.7} />
                </span>
                <h3 className="cat-seo-sector-name" itemProp="name">{s.short}</h3>
                <p className="cat-seo-sector-meta">
                  {s.l2Children} categories · {s.l3Children.toLocaleString()} subcategories
                </p>
                <p className="cat-seo-sector-desc" itemProp="description">{s.long}</p>
                <span className="cat-seo-sector-link">Browse {s.short} →</span>
              </a>
            ))}
          </div>
        </div>

        <div className="cat-seo-wrap">
          <header className="cat-seo-head">
            <h2 className="cat-seo-h2">How the Hierarchy Works</h2>
            <p className="cat-seo-section-desc">
              InfoWebWorld uses a 3-level taxonomy so buyers can search broad or narrow without
              losing relevance.
            </p>
          </header>
          <div className="cat-seo-hierarchy">
            <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
              <span className="cat-seo-hier-level">Level 1</span>
              <h3 itemProp="name">Sector</h3>
              <p itemProp="description">
                The broad industry grouping. <strong>6 total</strong>: AI &amp; ML, Software &amp;
                SaaS, IT Services &amp; Agencies, Startups &amp; Innovation, Local Businesses,
                Professional Services.
              </p>
            </article>
            <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
              <span className="cat-seo-hier-level">Level 2</span>
              <h3 itemProp="name">Category</h3>
              <p itemProp="description">
                A specific market inside a sector. <strong>{l2Count} total</strong>. Examples: AI
                Chatbots, Sales CRM, Web App Development, FinTech, Restaurants.
              </p>
            </article>
            <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
              <span className="cat-seo-hier-level">Level 3</span>
              <h3 itemProp="name">Subcategory</h3>
              <p itemProp="description">
                The precise niche where buyers compare alternatives.{' '}
                <strong>{l3Count.toLocaleString()} total</strong>. Examples: Customer Support
                Chatbots, AI Code Copilots, AI Auto-Cut Video Editors.
              </p>
            </article>
          </div>
        </div>

        <div className="cat-seo-wrap">
          <header className="cat-seo-head">
            <h2 className="cat-seo-h2">How to Find a Business by Category</h2>
          </header>
          <ol className="cat-seo-steps">
            <li>
              <strong>Search by keyword.</strong> Type a product, problem, or industry keyword in
              the search bar above; it matches across all {CATEGORIES.length.toLocaleString()}{' '}
              categories instantly.
            </li>
            <li>
              <strong>Or browse by sector.</strong> Click any of the 6 sector cards to expand its
              categories and subcategories. Pick the subcategory closest to what you need.
            </li>
            <li>
              <strong>Open the subcategory.</strong> See every verified business listed there,
              filterable by location, plan tier, and rating.
            </li>
            <li>
              <strong>Compare and contact.</strong> Open any listing for the full profile, real
              reviews, side-by-side comparison with alternatives, and direct contact.
            </li>
          </ol>
        </div>

        <div className="cat-seo-wrap">
          <header className="cat-seo-head">
            <h2 className="cat-seo-h2">Frequently Asked Questions</h2>
            <p className="cat-seo-section-desc">
              Everything buyers ask about navigating the InfoWebWorld business directory taxonomy.
            </p>
          </header>
          <div className="cat-seo-faq">
            {faqs.map(({ q, a }) => (
              <details key={q} className="cat-seo-faq-item" itemScope itemType="https://schema.org/Question">
                <summary itemProp="name">{q}</summary>
                <div className="cat-seo-faq-body" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p itemProp="text">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AiDisclaimer />
      <Footer />
    </>
  )
}
