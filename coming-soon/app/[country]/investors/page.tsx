import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Investor Relations — InfoWebWorld',
  description: 'Investor relations at InfoWebWorld — company overview, vision, and how to get in touch with our founders for strategic partnerships and investment discussions.',
  alternates: { canonical: 'https://infowebworld.com/investors' },
  robots: { index: false, follow: false },
}

export default function InvestorsPage() {
  return (
    <InfoPageShell
      kicker="For Investors"
      title="Investor Relations"
      subtitle="InfoWebWorld is a privately-held product of Brain Stream Australia Pty Ltd. We work with a small group of strategic partners who share our long-term view of global business discovery."
      cta={{
        label: 'Contact the Founders',
        href: '/contact',
        description: 'Serious conversations only — please include your fund, stage focus, and thesis.',
      }}
    >
      <IPSection title="At a Glance">
        <IPCardGrid cols={3}>
          <IPCard icon="🌍" title="Global TAM">
            $300B+ digital advertising + SEO + B2B lead-gen market, actively migrating
            toward AI-native discovery surfaces.
          </IPCard>
          <IPCard icon="📈" title="Growth model">
            Evergreen: dofollow backlinks, verified reviews, and recurring listing
            subscriptions across 80+ industries and 12+ countries.
          </IPCard>
          <IPCard icon="🧠" title="Defensibility">
            Structured, human-curated catalog. Every verified listing compounds our
            trust, ranking, and citation surface over time.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Thesis in One Paragraph">
        <p>
          As AI engines (Google AI Overviews, Perplexity, ChatGPT Search, Claude) take
          over the buyer-discovery layer, the winning business directory won't be the
          loudest — it will be the <em>most cited</em>. That means: structured data
          quality, real reviews, and real buyer signals. InfoWebWorld is built
          AI-first with that citation surface as its north star.
        </p>
      </IPSection>

      <IPSection title="Get In Touch">
        <p>
          If you're a fund or strategic operator interested in long-term partnership,
          please <a href="/contact">message us</a> with <em>[INVESTOR]</em> in the
          subject line. We'll schedule an intro call if there's a thesis fit.
        </p>
        <p>
          <strong>What to include:</strong> your fund, check size, typical stage,
          portfolio overlap, and why you think directory + discovery is the right
          layer to own in the AI-search era.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
