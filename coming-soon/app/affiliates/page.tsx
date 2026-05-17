import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, serviceNode, howToNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/affiliates`

const faqs = [
  {
    q: 'How much do InfoWebWorld affiliates earn per referral?',
    a: 'Affiliates earn 30% on the first payment of any plan (Starter, Yearly, or Lifetime) and 15% recurring on every Yearly plan renewal for as long as the customer stays subscribed. Payouts are monthly with a $50 minimum threshold.',
  },
  {
    q: 'How long is the InfoWebWorld affiliate cookie window?',
    a: 'The InfoWebWorld affiliate tracking cookie lasts 90 days from the first click — longer than most directory and SaaS affiliate programs in the same space.',
  },
  {
    q: 'When and how do InfoWebWorld affiliates get paid?',
    a: 'Payouts run monthly via PayPal, Wise, or direct bank transfer, with a $50 minimum threshold. Every click, conversion, and commission is visible in real time inside the affiliate dashboard.',
  },
  {
    q: 'Who is the InfoWebWorld affiliate program designed for?',
    a: 'It is built for newsletter writers, YouTube creators, SEO bloggers, LinkedIn creators, small-business consultants, and founders with audiences of business owners, marketers, or operators.',
  },
  {
    q: 'How fast are affiliate applications reviewed?',
    a: 'Most applicants are approved within 48 hours of submitting the contact form. Established partners with proven audiences are fast-tracked the same business day.',
  },
  {
    q: 'Are there exclusive promo codes or affiliate-only deals?',
    a: 'Yes. Approved affiliates receive promo codes that give their audience a small discount and unlock affiliate-only content briefs, banners, and demo videos.',
  },
]

const serviceJsonLd = serviceNode({
  id: `${URL}#affiliate-program`,
  name: 'InfoWebWorld Affiliate Program',
  description:
    'Refer businesses to InfoWebWorld and earn 30% on first payment plus 15% recurring commissions with a 90-day cookie window. Monthly payouts via PayPal, Wise, or bank transfer.',
  serviceType: 'Affiliate marketing program',
  audience: [
    'Newsletter writers',
    'YouTube creators',
    'SEO bloggers',
    'LinkedIn creators',
    'Small-business consultants',
    'B2B founders',
  ],
  offers: [
    {
      name: 'First-payment commission',
      description:
        '30% of the first year of any Yearly plan, or the full one-time Starter / Lifetime payment.',
    },
    {
      name: 'Recurring commission',
      description:
        '15% recurring on every Yearly plan renewal, paid for the lifetime of the customer subscription.',
    },
  ],
})

const howToJsonLd = howToNode({
  id: `${URL}#apply`,
  name: 'How to apply to the InfoWebWorld Affiliate Program',
  description:
    'Three steps to apply to the InfoWebWorld affiliate program for SEO bloggers, newsletter writers, YouTubers, and founders with B2B audiences.',
  totalTime: 'PT5M',
  steps: [
    {
      name: 'Describe your audience',
      text: 'List your newsletter subscribers, YouTube subs, or other audience size and demographics — who you would promote InfoWebWorld to.',
    },
    {
      name: 'Share your content format',
      text: 'Tell us how you typically promote: reviews, comparisons, tutorials, list articles, livestreams.',
    },
    {
      name: 'Link 1–2 sample pieces',
      text: 'Include 1–2 past pieces so the team can hear your voice. Most applicants are approved within 48 hours.',
      url: `${BASE_URL}/contact`,
    },
  ],
})

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Affiliate Program — 30% First Payment + 15% Recurring | InfoWebWorld',
  description:
    'Earn 30% on first payment and 15% recurring on every Yearly renewal by referring businesses to InfoWebWorld. 90-day cookie, monthly payouts via PayPal/Wise/bank, transparent dashboard. Apply in 48 hours.',
  keywords: [
    'InfoWebWorld affiliate program',
    'B2B affiliate program',
    'SaaS affiliate program 2026',
    'SEO affiliate program',
    'business directory affiliate',
    'recurring affiliate commission',
    '30 percent affiliate commission',
    'high paying SaaS affiliate program',
    'affiliate program for newsletter writers',
    'affiliate program for YouTubers',
    'affiliate program for SEO bloggers',
    'lifetime recurring affiliate revenue',
    '90 day cookie affiliate program',
    'best affiliate programs for B2B founders',
    'directory affiliate commission structure',
    'affiliate dashboard with monthly PayPal payouts',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Earn With InfoWebWorld — 30% First Payment, 15% Recurring',
    description:
      'Refer businesses to InfoWebWorld and earn 30% on first payment + 15% on every renewal. 90-day cookie. Monthly payouts.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [
      { url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Affiliate Program' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn With InfoWebWorld — 30% + 15% Recurring',
    description: 'Refer businesses, earn 30% on first payment + 15% recurring. 90-day cookie. Monthly payouts.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'og:see_also': `${BASE_URL}/agencies`,
    'article:publisher': BASE_URL,
  },
}

export default function AffiliatesPage() {
  return (
    <InfoPageShell
      kicker="Affiliates"
      title="Earn With InfoWebWorld"
      subtitle="Refer businesses to InfoWebWorld and earn recurring commissions. Transparent rates, monthly payouts, and real support — whether you run a newsletter, YouTube channel, or audience of entrepreneurs."
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Affiliate marketing',
        'B2B affiliate program',
        'Directory affiliate program',
        'SaaS affiliate commission',
        'Recurring affiliate revenue',
      ]}
      mentions={[
        'PayPal',
        'Wise',
        'YouTube creator economy',
        'Newsletter monetization',
        '90-day cookie window',
        'Dofollow backlink',
      ]}
      schemaKeywords={[
        'affiliate program',
        '30% commission',
        '15% recurring',
        '90-day cookie',
        'B2B affiliate',
        'SEO affiliate',
        'newsletter affiliate',
      ]}
      extraGraph={[serviceJsonLd, howToJsonLd, faqJsonLd]}
      cta={{
        label: 'Apply to the Affiliate Program',
        href: '/contact',
        description: 'Share your audience + channels. We review applications within 48 hours.',
      }}
    >
      <IPSection title="Commission Structure">
        <IPCardGrid cols={3}>
          <IPCard icon="💰" title="30% of first payment">
            Earn 30% commission on the first year of any Yearly plan, or on the full
            one-time Starter / Lifetime payment.
          </IPCard>
          <IPCard icon="🔁" title="15% recurring">
            Earn 15% recurring on every Yearly plan renewal — for as long as the
            customer stays subscribed.
          </IPCard>
          <IPCard icon="⏱️" title="90-day cookie">
            Your referrals count for 90 days after their first click. Longer than most
            programs in this space.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Who This Is For">
        <p>
          <strong>Newsletter writers, YouTubers, founders with audiences, SEO bloggers,
          small-business consultants, LinkedIn creators</strong> — anyone with an audience
          of business owners, marketers, or founders.
        </p>
        <p>
          We care about <em>quality, not just traffic</em>. Our best affiliates explain
          what InfoWebWorld actually does, who it&apos;s for, and who it isn&apos;t for. Honest
          reviews convert — and retain — far better than salesy content.
        </p>
      </IPSection>

      <IPSection title="What You Get">
        <ul>
          <li><strong>Personal dashboard</strong> with click, conversion, and payout data.</li>
          <li><strong>Creative assets</strong> — banners, email templates, demo videos.</li>
          <li><strong>Monthly payouts</strong> via PayPal, Wise, or bank transfer ($50 minimum).</li>
          <li><strong>Transparent ledger</strong> — every referral, every conversion, every commission visible.</li>
          <li><strong>Affiliate-only updates</strong> — new features, promo windows, and content briefs shared early.</li>
        </ul>
      </IPSection>

      <IPSection title="How to Apply">
        <p>
          Send us a quick note via the <a href="/contact">contact page</a> with
          <em>[AFFILIATE]</em> in the subject line. Include:
        </p>
        <ol>
          <li>The audience you&apos;d promote to (newsletter subscribers, YouTube subs, etc.)</li>
          <li>Your typical content format (reviews, comparisons, tutorials, list articles)</li>
          <li>1–2 example pieces we can read to get a feel for your voice</li>
        </ol>
        <p>
          We approve most applicants within 48 hours. Serious partners get fast-tracked.
        </p>
      </IPSection>

      <IPSection title="Affiliate Program FAQ">
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
