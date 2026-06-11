import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/help`

const faqs = [
  {
    q: 'How do I get help with my InfoWebWorld listing?',
    a: 'Browse the Help Center topics on this page (Listings, Plans & Billing, Reviews, Analytics, Account, Policies), check the FAQs, or contact support via the contact page. Most support requests are answered within 24 hours on business days.',
  },
  {
    q: 'How fast is InfoWebWorld customer support?',
    a: 'Email support responds within 24 hours on business days. Paid plan customers (Starter, Yearly, Lifetime) are prioritized. Urgent legal, PII, or DMCA requests are handled within 72 business hours regardless of plan.',
  },
  {
    q: 'Can I reset my InfoWebWorld password?',
    a: 'Yes. From any sign-in screen, click "Forgot password" and enter the email on your account. You will receive a reset link within 1 minute. If you signed in originally with Google, just use Continue with Google again — no password needed.',
  },
  {
    q: 'How do I request a refund within the 14-day window?',
    a: 'Contact support via the contact page with [REFUND] in the subject line and the email on your purchase. Refunds within the 14-day window for Starter, Yearly initial year, and Lifetime are processed within 5 business days back to your original payment method.',
  },
  {
    q: 'Where do I see my listing analytics and leads?',
    a: 'Sign in to your dashboard at /dashboard. Each listing has its own analytics tab covering views, click-through rate, lead form submissions, and review counts. Lead data can be exported as CSV at any time.',
  },
]

const topicsList = itemListNode(
  [
    { name: 'Listings & Profiles', url: `${BASE_URL}/help#listings`, description: 'Submit a listing, edit your profile, add media, change categories, manage verification, and handle duplicates.' },
    { name: 'Plans & Billing', url: `${BASE_URL}/business/plans`, description: 'Understand plan differences, upgrade or downgrade, manage invoices, request refunds within the 14-day window.' },
    { name: 'Reviews & Reputation', url: `${BASE_URL}/help#reviews`, description: 'Collect reviews, respond to reviews, flag fake or abusive content, and understand how reviews affect ranking.' },
    { name: 'Analytics & Leads', url: `${BASE_URL}/help#analytics`, description: 'Read dashboard metrics, connect notifications, export leads, benchmark against your category.' },
    { name: 'Account & Security', url: `${BASE_URL}/help#account`, description: 'Password reset, two-factor authentication, connected Google account, team members, account data download.' },
    { name: 'Policies & Removals', url: `${BASE_URL}/removals`, description: 'Content guidelines, takedown requests, copyright claims, appeals.' },
  ],
  `${URL}#topics`,
  'InfoWebWorld Help Center topics',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Help & Support Center - InfoWebWorld',
  description:
    'Help center for InfoWebWorld — listings, plans, billing, reviews, analytics, account security, and policies. FAQs and direct support within 24 hours on business days.',
  keywords: [
    'InfoWebWorld help center',
    'InfoWebWorld support',
    'business listing help',
    'directory listing support',
    'how to edit business listing',
    'how to reset password directory',
    'how to request refund InfoWebWorld',
    'business listing analytics help',
    'how to flag fake review',
    'two factor authentication setup',
    'directory account security',
    'business listing onboarding help',
    'InfoWebWorld customer service',
    'directory billing support',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Help & Support Center - InfoWebWorld',
    description: 'Listings, billing, reviews, analytics, security, policies — FAQs + 24-hour email support.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Help Center' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help & Support - InfoWebWorld',
    description: 'Browse topics, read FAQs, or email support within 24 hours.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function HelpPage() {
  return (
    <InfoPageShell
      kicker="Support"
      title="Help & Support Center"
      subtitle="Fast answers to the most common questions, a growing library of how-to guides, and direct email support when you need a human."
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Customer support',
        'Business listing help',
        'Directory account security',
        'Subscription billing support',
        'Review moderation help',
      ]}
      mentions={['Two-factor authentication', 'PayPal', 'Google OAuth', 'Refund window', 'Lead export']}
      schemaKeywords={['help center', 'customer support', 'listing help', 'billing help', 'refund window']}
      extraGraph={[topicsList, faqJsonLd]}
      cta={{
        label: 'Contact Support',
        href: '/contact',
        description: 'Most support requests are answered within 24 hours on business days.',
      }}
    >
      <IPSection id="topics" title="Browse by Topic">
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

      <IPSection title="Common Questions">
        {faqs.map(({ q, a }) => (
          <details key={q} className="ip-faq">
            <summary>{q}</summary>
            <div className="ip-faq-body">{a}</div>
          </details>
        ))}
      </IPSection>

      <IPSection title="Still Stuck?">
        <p>
          Most questions have an answer in our <a href="/faqs">FAQs</a>. If yours doesn&apos;t,
          email us via the <a href="/contact">contact page</a> — we read every message
          and reply within 24 hours on business days.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
