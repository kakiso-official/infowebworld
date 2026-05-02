import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Help & Support — InfoWebWorld',
  description: 'Get help with your InfoWebWorld listing, account, payments, reviews, and more. Support articles, FAQs, and direct access to our team.',
  alternates: { canonical: 'https://infowebworld.com/help' },
}

export default function HelpPage() {
  return (
    <InfoPageShell
      kicker="Support"
      title="Help & Support Center"
      subtitle="Fast answers to the most common questions, a growing library of how-to guides, and direct email support when you need a human."
      cta={{
        label: 'Contact Support',
        href: '/contact',
        description: 'Most support requests are answered within 24 hours on business days.',
      }}
    >
      <IPSection title="Browse by Topic">
        <IPCardGrid cols={3}>
          <IPCard icon="📝" title="Listings & Profiles">
            Submit a listing, edit your profile, add media, change categories, manage
            verification, and handle duplicates.
          </IPCard>
          <IPCard icon="💳" title="Plans & Billing">
            Understand plan differences, upgrade or downgrade, manage invoices, request
            refunds within the 14-day window, and update payment methods.
          </IPCard>
          <IPCard icon="⭐" title="Reviews & Reputation">
            Collect reviews, respond to reviews, flag fake or abusive content, and
            understand how reviews affect your ranking.
          </IPCard>
          <IPCard icon="📊" title="Analytics & Leads">
            Read your dashboard metrics, connect notifications, export leads, and
            benchmark against your category.
          </IPCard>
          <IPCard icon="🔐" title="Account & Security">
            Password reset, two-factor, connected Google account, team members, and
            closing or downloading your data.
          </IPCard>
          <IPCard icon="⚖️" title="Policies & Removals">
            Content guidelines, takedown requests, copyright claims, and appeals.
            See also <a href="/content-guidelines" className="ip-card-link">Content Guidelines</a>
            and <a href="/removals" className="ip-card-link">Removals</a>.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Quick Links">
        <ul>
          <li><a href="/faqs">Frequently Asked Questions</a></li>
          <li><a href="/business/plans">Plans & Pricing</a></li>
          <li><a href="/content-guidelines">Content Guidelines</a></li>
          <li><a href="/removals">Request a Listing Removal</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Use</a></li>
        </ul>
      </IPSection>

      <IPSection title="Still Stuck?">
        <p>
          Most questions have an answer in our <a href="/faqs">FAQs</a>. If yours doesn't,
          email us via the <a href="/contact">contact page</a> — we read every message
          and reply within 24 hours on business days.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
