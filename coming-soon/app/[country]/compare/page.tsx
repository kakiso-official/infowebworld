import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Compare Businesses — InfoWebWorld',
  description: 'Side-by-side comparison of business, tools, and service providers across 80+ industries. Features, pricing, pros, cons — all in one view.',
  alternates: { canonical: 'https://infowebworld.com/compare' },
}

export default function ComparePage() {
  return (
    <InfoPageShell
      kicker="Tool"
      title="Side-by-Side Comparisons"
      subtitle="Compare any two or three businesses head-to-head — features, pricing, reviews, pros and cons — in one clean view. Stop juggling tabs."
      variant="coming-soon"
      cta={{
        label: 'Browse Categories Instead',
        href: '/categories',
        description: "While we ship the dedicated compare tool, you can already browse category pages where side-by-side is surfaced naturally.",
      }}
    >
      <IPSection title="What's Being Built">
        <IPCardGrid cols={3}>
          <IPCard icon="🧮" title="Feature matrix">
            Pick any 2 or 3 businesses in a category. Every feature, pricing tier, and
            integration lined up row by row — instantly scannable.
          </IPCard>
          <IPCard icon="💰" title="Pricing breakdown">
            Apples-to-apples pricing for plans that often hide behind different
            structures. See monthly, yearly, per-seat, per-use — all normalized.
          </IPCard>
          <IPCard icon="⚖️" title="Pros & cons summary">
            AI-summarized pros and cons from verified reviews. Not our opinion — the
            collective voice of real users, structured for fast decision-making.
          </IPCard>
          <IPCard icon="📊" title="Reviewer sentiment">
            What do buyers say after 3 months, 6 months, a year? Tracked over time so
            you see trajectory, not just snapshot sentiment.
          </IPCard>
          <IPCard icon="🔗" title="Alternatives suggested">
            Picked two competitors? We'll suggest a third alternative you might not have
            considered — based on buyers who evaluated the same set.
          </IPCard>
          <IPCard icon="📤" title="Shareable + embeddable">
            Export comparison tables as PDF or embed on your own site. Perfect for
            agencies, consultants, and internal buying committees.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Get Notified">
        <p>
          We're shipping the compare tool in phases. First release: Feature matrix for
          AI & SaaS categories. Want to be first in line? Follow us on
          <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" rel="noopener noreferrer"> LinkedIn </a>
          or check back in a few weeks.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
