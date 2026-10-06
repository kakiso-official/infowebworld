import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faUserCheck, faRobot, faArrowRight } from '@fortawesome/free-solid-svg-icons'
/* Font Awesome's own sizing CSS. FA only injects it at runtime when a client
   component renders an icon, so a page whose icons are all server-rendered
   (e.g. no reviewed listings in its client sections) showed them unsized. */
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/test-category-1-page.css'
import '../styles/test-landing-page.css'
import '../styles/home.css'
import '../styles/ai-directory.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearch from '../sector-landing/HeroSearch'
import CategoriesSection from '../test-landing-page/CategoriesSection'
import PopularSubcategoriesSection from '../home-sections/PopularSubcategoriesSection'
import TopFirmsSection from '../test-category-1-page/TopFirmsSection'
import NewLaunchesSection from '../test-category-1-page/NewLaunchesSection'
import CountriesSection from '../home-sections/CountriesSection'
import ComparisonTableSection from '../home-sections/ComparisonTableSection'
import NewReviewsSection from '../test-landing-page/NewReviewsSection'
import PopularToolsSection from '../test-landing-page/PopularSection'
import LatestBlogSection from '../home-sections/LatestBlogSection'
import HomeFaqSection from '../home-sections/HomeFaqSection'
import FinalCtaSection from '../test-landing-page/FinalCtaSection'
import { getCuratedSubcategories } from '../home-sections/popular-subcategories-data'
import { getSectorCountryListingCounts } from '../home-sections/countries-data'
import { getTopicBlogPosts } from '../home-sections/latest-blog-data'
import { buildFaqPageJsonLd } from '../home-sections/home-faq-data'
import { AI_FAQS } from './ai-faq-data'
import {
  AI_SECTOR, AI_CATEGORY_ITEMS, AI_SUBCATEGORY_TOTAL, AI_POPULAR_PICKS, AI_POPULAR_ICONS, AI_ACCENT,
} from './ai-categories'
import {
  getAiListingTotal, getAiFeaturedByL2, getAiLaunches, getAiReviews, getAiPopularTools,
} from './ai-directory-data'
import { aiMl } from '@/lib/sector-landings/ai-ml'
import { sectorLandingPath, sectorViewAllPath } from '@/lib/sector-paths'

/* ════════════════════════════════════════════════════════════════════════
   AI tools directory — the AI & ML sector landing (SEO-spec rebuild,
   Oct 2026). Lives at /ai-si-directory, with the AI category pages under
   it (/ai-si-directory/{slug}); /ai-ml and /ai-ml/... 308 here
   (next.config.ts).

   Section order (inside <main className="tlp tcat1 tcat-ai-ml aid">):
     1  Hero (H1, AI-scoped search, stat badges, CTAs)
     2  Browse the AI Tools Directory by Category - every AI L2
     3  Popular SI & AI Tools Sub-Categories - the brief's 12 picks
     4  Featured AI Tool Listings - L2 tabs, featured-plan listings first
     5  Just Reviewed, Verified, and Added - newest AI listings
     6  Explore SI & AI Tools Around the World - countries with AI listings
     7  Why Use InfoWebWorld - comparison table
     8  Trusted by Users, Reviewed by Buyers - reviews
     9  Most popular AI tools (kept, as on the homepage)
     10 Latest AI & SI Tool Blogs and Guides
     11 FAQs (the same array feeds the FAQPage node)
     12 Final CTA
   Headings and copy are verbatim from the brief. Shared .tlp-/.tcat- and
   hm- sections only receive copy through opt-in props; the lavender
   theme comes from ./styles/ai-directory.css (--hm-c-* tokens).

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s).
   ════════════════════════════════════════════════════════════════════════ */
export const revalidate = 600

const SITE = 'https://www.infowebworld.com'
const PAGE_URL = `${SITE}${sectorLandingPath(AI_SECTOR)}`
const VIEW_ALL_PATH = sectorViewAllPath(AI_SECTOR)
const OG_IMAGE = `${SITE}/api/og/${AI_SECTOR}`

/* Exact SEO-specified meta title + description — reused verbatim by the
   <title>/meta description, Open Graph, Twitter card and CollectionPage. */
const META_TITLE = '#1 Rated AI Tools Directory: List Your AI & SI Tools'
const META_DESCRIPTION = 'Browse InfoWebWorld AI tools directory: list your AI & SI tool, compare verified, and add or read reviews from real users. Explore categories to list your tool.'

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: [
    'ai tools directory', 'ai directory', 'ai tools list', 'list of ai tools',
    'best ai tools', 'ai tools by category', 'submit ai tool', 'list your ai tool',
    'ai & si tools', 'ai tool reviews', 'compare ai tools', 'InfoWebWorld',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-US': PAGE_URL, 'x-default': PAGE_URL },
  },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'InfoWebWorld',
    locale: 'en_US',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'InfoWebWorld AI Tools Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
    site: '@infowebworld',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

/* "1,000+" style floor: never claims more than the real number. */
function floorLabel(n: number): string {
  const step = n >= 1000 ? 1000 : n >= 100 ? 100 : 1
  return `${(Math.floor(n / step) * step).toLocaleString('en-US')}+`
}

/* ── JSON-LD @graph: Organization + WebSite (same @ids as the homepage),
   BreadcrumbList, the CollectionPage whose mainEntity is the ItemList of
   AI categories shown in section 2, and the FAQPage built from the same
   AI_FAQS array the accordion renders. Only visible content is marked up. */
function buildJsonLd() {
  const categoriesId = `${PAGE_URL}#categories`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}#org`,
        name: 'InfoWebWorld',
        url: SITE,
        logo: `${SITE}/logo/infowebworldlogo-logoforlightbackgrounds.png`,
        sameAs: [
          'https://x.com/infowebworld_x',
          'https://www.linkedin.com/company/infowebworld/',
          'https://www.instagram.com/infowebworld',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}#website`,
        url: SITE,
        name: 'InfoWebWorld',
        publisher: { '@id': `${SITE}#org` },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'AI Tools Directory', item: PAGE_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#page`,
        url: PAGE_URL,
        name: META_TITLE,
        description: META_DESCRIPTION,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE}#website` },
        publisher: { '@id': `${SITE}#org` },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        about: { '@type': 'Thing', name: 'AI tools' },
        mainEntity: { '@id': categoriesId },
        primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'ItemList',
        '@id': categoriesId,
        name: 'AI tool categories',
        numberOfItems: AI_CATEGORY_ITEMS.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: AI_CATEGORY_ITEMS.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          url: `${SITE}${c.href}`,
        })),
      },
      buildFaqPageJsonLd(AI_FAQS, PAGE_URL),
    ],
  }
}

export default async function AiToolsDirectoryPage() {
  /* One parallel round. Every fetcher is cached and never throws: a DB
     failure empties its section (or hides a count) instead of 500ing. */
  const [listingTotal, popularSubcats, featured, launches, countries, reviews, popularTools, blogPosts] =
    await Promise.all([
      getAiListingTotal(),
      getCuratedSubcategories(AI_SECTOR, AI_POPULAR_PICKS),
      getAiFeaturedByL2(),
      getAiLaunches(),
      getSectorCountryListingCounts(AI_SECTOR),
      getAiReviews(8),
      getAiPopularTools(),
      getTopicBlogPosts('ai', 3),
    ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Navbar sectorSlug={AI_SECTOR} />
      <main className={`tlp tcat1 ${aiMl.scopeClass} aid`}>
        <HeroSearch
          sectorSlug={AI_SECTOR}
          title="#1 Rated AI Tools Directory to Find, Compare, and List AI & SI Tools"
          sub="Browse AI tools by category, country, and use case, then compare real buyer reviews worldwide."
          placeholder={aiMl.heroPlaceholder}
          titleClassName="hm-hero-title"
          hideMeta
        >
          <ul className="hm-hero-badges">
            <li className="hm-hero-badge">
              <span className="hm-hero-badge-ico" aria-hidden="true">
                <FontAwesomeIcon icon={faLayerGroup} />
              </span>
              <span>{floorLabel(AI_SUBCATEGORY_TOTAL)} AI Categories</span>
            </li>
            <li className="hm-hero-badge">
              <span className="hm-hero-badge-ico" aria-hidden="true">
                <FontAwesomeIcon icon={faUserCheck} />
              </span>
              <span>100% Manually Verified</span>
            </li>
            {listingTotal > 0 && (
              <li className="hm-hero-badge">
                <span className="hm-hero-badge-ico" aria-hidden="true">
                  <FontAwesomeIcon icon={faRobot} />
                </span>
                <span>{listingTotal.toLocaleString('en-US')}+ Total Listings for AI Tools</span>
              </li>
            )}
          </ul>

          <div className="hm-hero-cta-row">
            <Link href={VIEW_ALL_PATH} className="hm-btn hm-btn-primary">
              <span>Browse AI Tools</span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
            <Link href="/business" className="hm-btn hm-btn-secondary">
              List Your AI Tool
            </Link>
          </div>
        </HeroSearch>

        <CategoriesSection
          heading="Browse the AI Tools Directory by Category"
          sub="Every category lists AI tools with their features, pricing, and real reviews, so you can shortlist quickly."
          items={AI_CATEGORY_ITEMS}
          gridClassName="hm-cats-grid--center"
        />

        <PopularSubcategoriesSection
          items={popularSubcats}
          heading="Popular SI & AI Tools Sub-Categories: Every Type of AI in One Place"
          sub="Jump straight to the AI tool types visitors explore most."
          pill={`${AI_SUBCATEGORY_TOTAL.toLocaleString('en-US')} AI & SI sub-categories`}
          ctaLabel="Explore AI & SI Categories"
          ctaHref={VIEW_ALL_PATH}
          icons={AI_POPULAR_ICONS}
          accent={AI_ACCENT}
        />

        <TopFirmsSection
          cats={featured}
          sectorSlug={AI_SECTOR}
          title="Featured AI Tool Listings, Verified Worldwide"
          sub="Hand-picked AI and SI tools from companies that chose featured placement on InfoWebWorld."
          tabsLabel={aiMl.sections.topFirmsTabsLabel}
          emptyNoun={aiMl.sections.topFirmsEmptyNoun}
        />

        <NewLaunchesSection
          launches={launches}
          sectorSlug={AI_SECTOR}
          title="Just Reviewed, Verified, and Added in the AI Tools Directory"
          sub="Our team reviews every submission before it goes live. Discover the newest SI and AI tools listed recently."
          cta={aiMl.sections.newLaunchesCta}
        />

        <CountriesSection
          countries={countries}
          heading="Explore SI & AI Tools Around the World"
          sub="Looking for a local AI tool vendor? Pick a country and see the tools listed there."
          pillTemplate="Verified AI tool listings from {n} countries"
        />

        <ComparisonTableSection
          heading="Why Use InfoWebWorld to Find SI and AI Tools?"
          sub="Buyers get trusted comparisons. AI companies get free exposure to people who are ready to evaluate SI and AI tools."
          caption="InfoWebWorld compared with a typical free AI tools directory"
        />

        <NewReviewsSection
          reviews={reviews}
          title="Trusted by Users, Reviewed by Buyers"
          subtitle="Read what customers say before you choose, and add your own review to help others."
        />

        <PopularToolsSection firms={popularTools} sectorSlug={AI_SECTOR} />

        <LatestBlogSection
          posts={blogPosts}
          heading="Latest AI & SI Tool Blogs and Guides"
          sub="Practical guides, comparisons, and news to help you choose and use AI tools with confidence."
          ctaLabel="Read All Articles"
        />

        <HomeFaqSection faqs={AI_FAQS} />

        <FinalCtaSection
          title={'Don’t Let Your AI Tool Stay Hidden'}
          subtitle="List your AI tool on InfoWebWorld, and let buyers worldwide find, compare, and review it."
          ctaLabel="Submit Your AI Tool"
          ctaHref="/business"
        />
      </main>
      <Footer />
    </>
  )
}
