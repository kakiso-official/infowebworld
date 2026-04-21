import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'For Agencies — InfoWebWorld Partner Program',
  description: 'Digital agencies and SEO consultancies: manage multiple client listings at scale on InfoWebWorld with white-label reporting, bulk tools, and revenue share.',
  alternates: { canonical: 'https://infowebworld.com/agencies' },
}

export default function AgenciesPage() {
  return (
    <InfoPageShell
      kicker="Partner Program"
      title="Built for Agencies"
      subtitle="If you manage SEO, PR, or digital growth for clients — we give you a single dashboard to list, verify, and grow their businesses on InfoWebWorld. With revenue share and client-safe reporting."
      cta={{
        label: 'Apply to the Agency Program',
        href: '/contact',
        description: 'Tell us your agency name, client count, and typical industries. We approve agencies weekly.',
      }}
    >
      <IPSection title="Why Agencies Partner With Us">
        <IPCardGrid cols={3}>
          <IPCard icon="⚡" title="Bulk listing tools">
            Submit and manage 5–500 client listings from a single agency dashboard. CSV
            upload, batch edits, scheduled publishing — no per-listing drudgework.
          </IPCard>
          <IPCard icon="🏷️" title="Revenue share">
            Earn a recurring percentage on every paid listing you bring. Paid monthly,
            transparent ledger, no clawbacks on renewals.
          </IPCard>
          <IPCard icon="📊" title="White-label reporting">
            Branded monthly PDFs for each client — traffic, leads, reviews, rankings.
            Your logo, your narrative, our data.
          </IPCard>
          <IPCard icon="🔗" title="Dofollow at scale">
            Every paid listing comes with a permanent dofollow backlink — a real SEO
            asset for your clients, not a rented ranking.
          </IPCard>
          <IPCard icon="🧑‍💼" title="Dedicated account lead">
            A single point of contact at InfoWebWorld for onboarding, escalations, and
            feature requests. Slack channel available for larger partners.
          </IPCard>
          <IPCard icon="🎁" title="First month free">
            Onboard up to 10 client listings at no cost for the first month. Prove it
            works, then scale with confidence.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="How It Works">
        <ol>
          <li><strong>Apply</strong> via the contact form with your agency details.</li>
          <li><strong>Onboarding call</strong> with your dedicated account lead (30 min).</li>
          <li><strong>Bulk-import</strong> your client catalog via CSV or our guided wizard.</li>
          <li><strong>Launch</strong> listings and start tracking results within 48 hours.</li>
          <li><strong>Rev-share</strong> paid monthly to your preferred account.</li>
        </ol>
      </IPSection>

      <IPSection title="Who This Is For">
        <p>
          <strong>SEO agencies, PR firms, growth studios, and local-marketing consultancies</strong>
          managing 5 or more client businesses. We also work with accelerators, incubators,
          and venture studios listing their portfolio companies at scale.
        </p>
        <p>
          Not a great fit: one-off listings for a single business (just use our <a href="/business">standard plans</a>),
          or agencies with clients violating our <a href="/content-guidelines">content guidelines</a>.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
