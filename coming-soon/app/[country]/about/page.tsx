import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'About InfoWebWorld — The Global Business Discovery Platform',
  description:
    'InfoWebWorld is a global growth platform helping buyers discover verified businesses across AI, SaaS, IT services, startups, and professional services worldwide.',
  alternates: { canonical: 'https://infowebworld.com/about' },
}

export default function AboutPage() {
  return (
    <InfoPageShell
      kicker="Company"
      title="About InfoWebWorld"
      subtitle="We're building the most trusted discovery platform for businesses in the AI era — where buyers find verified companies, real reviews, and the signals they need to decide with confidence."
      cta={{
        label: 'List Your Business',
        href: '/business',
        description: 'Join thousands of forward-thinking companies already claiming their place.',
      }}
    >
      <IPSection title="Our Mission">
        <p>
          Business discovery online is broken. Search results are cluttered with ads,
          ranking is pay-to-play, and reviews can't always be trusted. We think buyers
          deserve better — and so do the quality businesses hidden beneath the noise.
        </p>
        <p>
          InfoWebWorld is the <strong>global growth platform</strong> where verified
          businesses across 80+ industries can be discovered, compared, and reviewed
          on merit. Our mission is simple: help real buyers find real businesses, faster.
        </p>
      </IPSection>

      <IPSection title="What Makes Us Different">
        <IPCardGrid cols={3}>
          <IPCard icon="✓" title="Verified listings only">
            Every listing is human-curated. We reject spam, duplicates, and low-quality
            entries before they ever reach the buyer.
          </IPCard>
          <IPCard icon="★" title="Real reviews, no pay-to-play">
            Reviews come from verified users. Ranking is based on merit, engagement, and
            trust signals — never on ad spend.
          </IPCard>
          <IPCard icon="🌐" title="Global + local at once">
            Listings surface at both country and city level. A business in Bengaluru can
            reach the world or stay local — the platform flexes either way.
          </IPCard>
          <IPCard icon="🔗" title="Dofollow backlinks">
            Every paid listing includes a permanent dofollow link. Real SEO value for
            your website, not rented rankings.
          </IPCard>
          <IPCard icon="🤖" title="AI-powered discovery">
            AI-assisted search surfaces alternatives, compares features, and helps buyers
            cut through category noise in seconds.
          </IPCard>
          <IPCard icon="🧭" title="Built for the AI era">
            Structured, crawlable, citation-friendly — optimized for Google, Perplexity,
            and every AI engine shaping the next decade of discovery.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Built by Brain Stream Australia">
        <p>
          InfoWebWorld is a product of <strong>Brain Stream Australia Pty Ltd</strong>,
          an Australian technology company headquartered in Parramatta, NSW. We've been
          building at the intersection of SEO, content, and directory products for over
          two decades.
        </p>
        <p>
          Have a question, a partnership idea, or a problem worth solving? We read every
          message. <a href="/contact">Get in touch →</a>
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
