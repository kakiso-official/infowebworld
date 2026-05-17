import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, serviceNode, howToNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/agencies`

const faqs = [
  {
    q: 'Who is the InfoWebWorld Agency Partner Program for?',
    a: 'SEO agencies, PR firms, growth studios, local-marketing consultancies, and venture studios managing 5 or more client businesses or portfolio companies. Accelerators and incubators listing portfolio companies at scale are also a great fit.',
  },
  {
    q: 'How does revenue share work for partner agencies?',
    a: 'Agencies earn a recurring percentage on every paid client listing they bring to InfoWebWorld. Revenue share is paid monthly with a transparent ledger, no clawbacks on renewals.',
  },
  {
    q: 'Can agencies bulk-import client listings?',
    a: 'Yes. Approved partner agencies get CSV bulk upload, a guided import wizard, batch edits, and scheduled publishing — built for managing 5 to 500 client listings from a single dashboard.',
  },
  {
    q: 'Do agency clients get the same dofollow backlinks as direct listings?',
    a: 'Yes. Every paid client listing through the agency program includes a permanent dofollow backlink — a real SEO asset for your clients, not a rented ranking.',
  },
  {
    q: 'Is white-label reporting included?',
    a: 'Yes. Branded monthly PDF reports per client — traffic, leads, reviews, ranking signals — using your agency logo and narrative on top of InfoWebWorld data.',
  },
  {
    q: 'How long is the onboarding process for new agency partners?',
    a: 'Onboarding takes 48 hours from application: 30-minute kickoff call with your dedicated account lead, bulk import of your client catalog, then launch. First 10 client listings are free for the first month.',
  },
]

const serviceJsonLd = serviceNode({
  id: `${URL}#agency-program`,
  name: 'InfoWebWorld Agency Partner Program',
  description:
    'White-label business directory program for SEO agencies, PR firms, growth studios, and venture studios. Bulk listing tools, revenue share, dedicated account lead, dofollow backlinks at scale.',
  serviceType: 'Agency partner program',
  audience: [
    'SEO agencies',
    'PR firms',
    'Growth studios',
    'Local-marketing consultancies',
    'Accelerators',
    'Incubators',
    'Venture studios',
  ],
  offers: [
    { name: 'Bulk listing tools', description: 'Submit and manage 5–500 client listings from a single agency dashboard with CSV upload and batch edits.' },
    { name: 'Revenue share', description: 'Recurring percentage on every paid listing, paid monthly, no clawbacks on renewals.' },
    { name: 'White-label reporting', description: 'Branded monthly PDFs per client with traffic, leads, reviews, and ranking data.' },
    { name: 'Dedicated account lead', description: 'Single point of contact for onboarding, escalations, and feature requests. Slack channel for larger partners.' },
    { name: 'First month free', description: 'Up to 10 client listings onboarded at no cost for the first month.' },
  ],
})

const howToJsonLd = howToNode({
  id: `${URL}#how-it-works`,
  name: 'How agencies partner with InfoWebWorld',
  description:
    'Five steps to becoming an InfoWebWorld agency partner — apply, onboard, bulk-import client catalog, launch listings, and start earning revenue share.',
  totalTime: 'PT2D',
  steps: [
    { name: 'Apply', text: 'Submit the contact form with your agency name, client count, and typical industries.' },
    { name: 'Onboarding call', text: '30-minute kickoff with your dedicated account lead.' },
    { name: 'Bulk-import client catalog', text: 'Use CSV upload or the guided wizard to import your existing client list.' },
    { name: 'Launch listings', text: 'Publish listings and start tracking results within 48 hours.' },
    { name: 'Earn revenue share', text: 'Recurring rev-share is paid monthly to your preferred account.' },
  ],
})

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Agency Partner Program — Bulk Listings + Revenue Share | InfoWebWorld',
  description:
    'White-label business directory partner program for SEO agencies, PR firms, growth studios, and venture studios. CSV bulk upload, revenue share, dofollow backlinks at scale, dedicated account lead, branded monthly reports. First 10 listings free for 30 days.',
  keywords: [
    'agency partner program',
    'directory partner program for SEO agencies',
    'white label directory reporting',
    'bulk business listing tool for agencies',
    'agency rev share program SaaS',
    'SEO agency client management tool',
    'PR firm directory partner',
    'venture studio portfolio listing tool',
    'accelerator portfolio directory',
    'bulk CSV business listing upload',
    'multi-client SEO dashboard',
    'agency dofollow backlink program',
    'white label client reporting PDF',
    'SEO agency monthly recurring commission',
    'partner program for growth studios',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Built for Agencies — Bulk Listings, Rev Share, White-Label Reporting',
    description:
      'Manage 5–500 client listings from one dashboard. Revenue share, dofollow at scale, branded reports. First 10 listings free for 30 days.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Agency Partner Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agency Partner Program — Bulk Listings + Revenue Share',
    description: 'CSV upload, revenue share, dofollow at scale, white-label reports. First 10 listings free.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true,
      'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1,
    },
  },
  other: {
    'og:see_also': `${BASE_URL}/affiliates`,
  },
}

export default function AgenciesPage() {
  return (
    <InfoPageShell
      kicker="Partner Program"
      title="Built for Agencies"
      subtitle="If you manage SEO, PR, or digital growth for clients — we give you a single dashboard to list, verify, and grow their businesses on InfoWebWorld. With revenue share and client-safe reporting."
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Agency partner program',
        'White-label business directory',
        'Bulk business listing management',
        'SEO agency tooling',
        'Multi-client SEO dashboard',
      ]}
      mentions={[
        'CSV bulk upload',
        'Dofollow backlink',
        'White-label reporting',
        'Revenue share',
        'Accelerator',
        'Venture studio',
        'PR firm',
      ]}
      schemaKeywords={[
        'agency partner program',
        'bulk listing tool',
        'white-label reporting',
        'revenue share',
        'multi-client dashboard',
      ]}
      extraGraph={[serviceJsonLd, howToJsonLd, faqJsonLd]}
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

      <IPSection title="Agency Partner FAQ">
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
