import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WriteReviewClient from './WriteReviewClient'
import WriteReviewContent from './WriteReviewContent'
import {
  BASE_URL, ID_ORG, ID_WEBSITE, organizationNode, websiteNode,
  breadcrumbNode, faqNode, howToNode,
} from '../components/seo-schema'
import { WR_TITLE, WR_INTRO, WR_STEPS, WR_FAQS } from './write-review-data'

export const dynamic = 'force-dynamic'

const URL = `${BASE_URL}/write-review`
const TITLE = 'Write a Company Review: Verified Reviews | InfoWebWorld'
const DESCRIPTION =
  'Share a verified review of any company on InfoWebWorld. Search the business, rate it, then write or speak about your experience. Honest, moderated, never paid.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
    siteName: 'InfoWebWorld',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Write a review on InfoWebWorld' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.png`],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationNode,
    websiteNode,
    breadcrumbNode(
      [
        { name: 'Home', url: BASE_URL },
        { name: 'Write a Review', url: URL },
      ],
      `${URL}#breadcrumb`,
    ),
    {
      '@type': 'WebPage',
      '@id': `${URL}#webpage`,
      url: URL,
      name: TITLE,
      headline: WR_TITLE,
      description: DESCRIPTION,
      inLanguage: 'en-US',
      isPartOf: { '@id': ID_WEBSITE },
      breadcrumb: { '@id': `${URL}#breadcrumb` },
      publisher: { '@id': ID_ORG },
      potentialAction: {
        '@type': 'ReviewAction',
        name: 'Write a review',
        target: URL,
      },
    },
    howToNode({
      id: `${URL}#howto`,
      name: 'How to Write a Review on InfoWebWorld',
      description: WR_INTRO,
      steps: WR_STEPS.map(s => ({ name: s.title.replace(/\.$/, ''), text: s.text })),
    }),
    faqNode(WR_FAQS, `${URL}#faq`, `${URL}#webpage`),
  ],
}

export default async function WriteReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  /* /write-review?company=<slug> (the "Write a review" buttons on listing
     and profile pages) opens straight on the review flow, so the guide
     and its JSON-LD only ship with the plain URL. The H1 + intro and the
     guide are rendered here, around the client flow rather than inside
     it, so they are plain server HTML in reading order; write-review.css
     hides them once the visitor leaves the company search. */
  const { company } = await searchParams
  const isLanding = !company

  return (
    <>
      {isLanding && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Navbar />
      <main className="wr-main">
        <header className="wr-land-head">
          <h1 className="wr-land-title">{WR_TITLE}</h1>
          <p className="wr-land-sub">{WR_INTRO}</p>
        </header>
        <Suspense fallback={null}>
          <WriteReviewClient />
        </Suspense>
        {isLanding && <WriteReviewContent />}
      </main>
      <Footer />
    </>
  )
}
