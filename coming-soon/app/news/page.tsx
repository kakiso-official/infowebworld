import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'News & Industry Updates — InfoWebWorld',
  description: 'Curated business news across AI, SaaS, IT services, startups, and more. Daily updates, funding rounds, product launches, and expert analysis.',
  alternates: { canonical: 'https://infowebworld.com/news' },
}

export default function NewsPage() {
  return (
    <InfoPageShell
      kicker="News"
      title="Industry News & Updates"
      subtitle="Curated business news, product launches, funding rounds, and expert analysis — across every sector on InfoWebWorld. Updated daily once we launch."
      variant="coming-soon"
      cta={{
        label: 'Read the Blog',
        href: '/blog',
        description: 'Our first editorial pieces are live on the blog. News hub arrives after.',
      }}
    >
      <IPSection title="What You'll Get Here">
        <IPCardGrid cols={3}>
          <IPCard icon="📰" title="Daily digest">
            The top stories across AI, SaaS, IT, startups, and professional services —
            curated and summarized for busy readers.
          </IPCard>
          <IPCard icon="💸" title="Funding tracker">
            Every week's major rounds, valuations, and notable acquisitions — filtered
            to the sectors InfoWebWorld covers.
          </IPCard>
          <IPCard icon="🚀" title="Product launches">
            New tools, features, and platforms crossing our radar. If it's in a
            category we cover, it shows up here.
          </IPCard>
          <IPCard icon="🎯" title="Category spotlights">
            Weekly deep-dives into one specific category — what's happening, who's
            leading, and which trends are worth watching.
          </IPCard>
          <IPCard icon="🗣️" title="Expert commentary">
            Occasional takes from our team and guest operators — on what the news means
            for buyers, founders, and the broader market.
          </IPCard>
          <IPCard icon="📬" title="Weekly newsletter">
            All of the above delivered to your inbox every Tuesday. One email, zero noise.
            Sign-up opens with the news hub launch.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="In the Meantime">
        <p>
          Our <a href="/blog">blog</a> is where early content lives. For real-time updates,
          follow us on
          <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" rel="noopener noreferrer"> LinkedIn </a>
          or
          <a href="https://x.com/infowebworld_x" target="_blank" rel="noopener noreferrer"> X</a>.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
