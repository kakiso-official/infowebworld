import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Insights — InfoWebWorld',
  description: 'Data-driven insights on business discovery, AI search, SEO, and category trends from the InfoWebWorld team.',
  alternates: { canonical: 'https://infowebworld.com/insights' },
}

export default function InsightsPage() {
  return (
    <InfoPageShell
      kicker="Ideas"
      title="Insights"
      subtitle="Research, analysis, and commentary on the changing landscape of business discovery — AI search, SEO, directory economics, and the buyer-seller relationship."
      variant="coming-soon"
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
            what buyers are searching for, and where the money's moving.
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
    </InfoPageShell>
  )
}
