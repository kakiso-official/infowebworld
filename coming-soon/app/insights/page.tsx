import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/insights`

const topics = [
  { name: 'AI Search Trends', description: 'How Perplexity, ChatGPT Search, Claude, and Google AI Overviews are changing what ranks and what it means for business discovery.' },
  { name: 'Category Reports', description: 'Quarterly looks at the fastest-growing categories on the platform, what buyers are searching for, and where the money is moving.' },
  { name: 'Playbooks', description: 'Tactical guides for listing owners — how to write profiles that convert, collect real reviews, and measure what matters.' },
]

const faqs = [
  {
    q: 'What does InfoWebWorld Insights cover?',
    a: 'Data-driven research on business discovery in the AI era — AI search trends across Perplexity, ChatGPT Search, Claude, and Google AI Overviews; quarterly category growth reports; and tactical playbooks for listing owners.',
  },
  {
    q: 'How often does InfoWebWorld Insights publish?',
    a: 'Weekly posts on the blog while the dedicated Insights hub is being built. Quarterly category reports drop at the start of each quarter. Subscribe via the blog to be notified.',
  },
  {
    q: 'Can I get Insights data for my own research or journalism?',
    a: 'Yes. Contact the press team via the contact page with [INSIGHTS] in the subject line. We share anonymized aggregate data for journalism and academic research.',
  },
  {
    q: 'Does InfoWebWorld have a podcast or newsletter for Insights?',
    a: 'A weekly Insights newsletter is in development. For now, the blog publishes the same content with full search and RSS support.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Insights — AI Search, Category Reports, and Listing Playbooks',
  description:
    'Data-driven insights on business discovery, AI search, SEO, and category trends from the InfoWebWorld research team.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Insights',
  wordCount: 400,
  about: ['Business discovery research', 'AI search trends', 'Category reports', 'Listing playbooks'],
  keywords: ['AI search insights', 'category growth reports', 'directory playbooks', 'AEO research'],
})

const topicsList = itemListNode(topics, `${URL}#topics`, 'Topics covered by InfoWebWorld Insights')

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Insights - AI Search · Category Reports · Playbooks | InfoWebWorld',
  description:
    'Research, analysis, and commentary on the changing landscape of business discovery — AI search trends across Perplexity, ChatGPT Search, Claude, and Google AI Overviews; quarterly category reports; and tactical playbooks for listing owners.',
  keywords: [
    'AI search insights B2B',
    'business discovery research',
    'category growth report SaaS',
    'directory playbooks',
    'AEO research 2026',
    'GEO research 2026',
    'Perplexity ranking analysis',
    'ChatGPT search rankings',
    'Google AI Overviews analysis',
    'Claude search citations',
    'directory economics commentary',
    'B2B buyer behavior research',
    'how AI is changing SEO',
    'AI search vs traditional SEO',
    'fastest growing SaaS categories 2026',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Insights - InfoWebWorld',
    description: 'AI search trends, category reports, and listing playbooks.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Insights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights - InfoWebWorld',
    description: 'AI search trends, category reports, and listing playbooks.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function InsightsPage() {
  return (
    <InfoPageShell
      kicker="Ideas"
      title="Insights"
      subtitle="Research, analysis, and commentary on the changing landscape of business discovery — AI search, SEO, directory economics, and the buyer-seller relationship."
      variant="coming-soon"
      webPageType={['WebPage', 'CollectionPage', 'FAQPage']}
      about={[
        'Business discovery research',
        'AI search trends',
        'Category growth reports',
        'Listing playbooks',
        'AEO and GEO research',
      ]}
      mentions={['Perplexity', 'ChatGPT Search', 'Claude', 'Google AI Overviews', 'Gemini', 'SEO trends']}
      schemaKeywords={['insights', 'AI search', 'category reports', 'playbooks']}
      extraGraph={[articleJsonLd, topicsList, faqJsonLd]}
      cta={{
        label: 'Read the Blog',
        href: '/blog',
        description: 'Our first insights pieces are landing on the blog. Subscribe for weekly drops.',
      }}
    >
      <IPSection title="What Insights Will Cover">
        <IPCardGrid cols={3}>
          <IPCard icon="🔍" title="AI Search Trends">
            How Perplexity, ChatGPT Search, Claude, and Google AI Overviews are changing
            what ranks — and what it means for business discovery.
          </IPCard>
          <IPCard icon="📈" title="Category Reports">
            Quarterly looks at the fastest-growing categories on the platform,
            what buyers are searching for, and where the money&apos;s moving.
          </IPCard>
          <IPCard icon="🧠" title="Playbooks">
            Tactical guides for listing owners — how to write profiles that convert,
            collect real reviews, and measure what matters.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Meanwhile, On the Blog">
        <p>
          While the dedicated Insights hub is being built, our <a href="/blog">blog</a>
          is where our first pieces are published. Check in for data drops, product
          updates, and the occasional founder-letter.
        </p>
      </IPSection>

      <IPSection title="Insights FAQ">
        {faqs.map(({ q, a }) => (
          <details key={q} className="ip-faq">
            <summary>{q}</summary>
            <div className="ip-faq-body">{a}</div>
          </details>
        ))}
      </IPSection>
    </InfoPageShell>
  )
}
