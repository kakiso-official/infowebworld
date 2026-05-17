import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../../components/InfoPageShell'
import { articleNode, BASE_URL } from '../../components/seo-schema'

const URL = `${BASE_URL}/team/past`

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Team Alumni — Past Contributors to InfoWebWorld',
  description:
    'Recognition wall for past contributors to InfoWebWorld — the operators, builders, designers, and writers who shaped the product in its early chapters and moved on to their next.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'People',
  wordCount: 250,
  about: ['InfoWebWorld alumni', 'Team alumni', 'Past contributors'],
  keywords: ['InfoWebWorld alumni', 'team alumni wall', 'past contributors directory'],
})

const collectionPageJsonLd = {
  '@type': ['WebPage', 'CollectionPage'],
  '@id': `${URL}#collection`,
  name: 'InfoWebWorld Team Alumni',
  description: 'Past contributors to InfoWebWorld.',
  url: URL,
  inLanguage: 'en-US',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Team alumni',
    itemListElement: [], // Empty for now — populated as alumni list grows
  },
}

export const metadata: Metadata = {
  title: 'Team Alumni — Past Contributors | InfoWebWorld',
  description:
    'The people who helped shape InfoWebWorld in its early chapters — alumni wall recognizing past contributors, their projects, and the next chapter they moved on to.',
  keywords: [
    'InfoWebWorld alumni',
    'team alumni page',
    'past team members',
    'startup alumni wall',
    'former employees InfoWebWorld',
    'directory team alumni',
    'past contributors recognition',
    'team alumni former roles',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Team Alumni — InfoWebWorld',
    description: 'Recognition for past contributors who shaped InfoWebWorld.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Team Alumni' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Alumni — InfoWebWorld',
    description: 'Recognition for past contributors who shaped InfoWebWorld.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function PastTeamPage() {
  return (
    <InfoPageShell
      kicker="Alumni"
      title="Team Alumni"
      subtitle="Great products are shaped by the people who pass through them. We recognize the builders who helped InfoWebWorld become what it is today."
      webPageType={['WebPage', 'CollectionPage']}
      about={['InfoWebWorld alumni', 'Team alumni wall', 'Past contributors']}
      mentions={['Founding team', 'Early contributors']}
      schemaKeywords={['team alumni', 'past contributors', 'alumni wall']}
      extraGraph={[articleJsonLd, collectionPageJsonLd]}
      cta={{
        label: 'Back to Current Team',
        href: '/team',
      }}
    >
      <IPSection title="A Thank You">
        <p>
          Every early contributor — whether they wrote code, shaped the brand, refined a
          category taxonomy, or closed our first listings — leaves a fingerprint on
          InfoWebWorld. As team members move on to their next chapters, we recognize
          their work here.
        </p>
      </IPSection>

      <IPSection title="Alumni Wall">
        <p>
          This page will grow over time as our team does. For now, we&apos;re a young product
          with most of the founding team still building. Watch this space.
        </p>
        <blockquote>
          &quot;Once an iWW teammate, always an iWW teammate. We&apos;re a small club — proud to
          be in it.&quot;
        </blockquote>
      </IPSection>

      <IPSection title="Stay Connected">
        <p>
          If you&apos;re a former contributor and would like your profile listed here, please
          <a href="/contact"> send us a note </a> with your role dates and a short bio —
          we&apos;d love to include you.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
