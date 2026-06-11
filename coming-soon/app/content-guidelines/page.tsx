import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/content-guidelines`

const faqs = [
  {
    q: 'What kind of business listings does InfoWebWorld accept?',
    a: 'Real, operating businesses with a verifiable website or registration. Listings must include accurate company name, description, category, location, clear product or service descriptions, high-quality logos, and honest pricing information when included.',
  },
  {
    q: 'What kind of business listings does InfoWebWorld reject?',
    a: 'Fake or parked businesses, duplicate listings, misleading category placement, MLM schemes, adult services, gambling, counterfeit goods, anything illegal in AU or the listing country, keyword stuffing, hidden text, copied descriptions, and logos or media without rights.',
  },
  {
    q: 'What makes a review acceptable on InfoWebWorld?',
    a: 'Honest first-hand experiences from verified users, constructive critique (positive or negative) with specific detail, and supporting photos or screenshots are all accepted.',
  },
  {
    q: 'What kind of reviews does InfoWebWorld reject?',
    a: 'Paid or incentivized reviews without disclosure, reviews by the business owner or employees, reviews copied from other platforms, personal attacks, defamation, off-topic content, and promotional spam.',
  },
  {
    q: 'How does InfoWebWorld moderate content?',
    a: 'Every submission is reviewed before publication. Automated systems flag suspicious patterns (review spikes, duplicate text), then humans make the final call. Repeat or severe violations may result in account suspension.',
  },
  {
    q: 'Can I appeal a rejected listing or review?',
    a: 'Yes. Appeal via the contact form with the listing slug or review ID and the reason you believe it complies with the guidelines. A senior moderator reviews appeals within 72 business hours.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Content Guidelines — What InfoWebWorld Accepts, Rejects, and Enforces',
  description:
    'Plain-English content guidelines for InfoWebWorld business listings and user reviews — what we accept, what we reject, how moderation works, and how to appeal.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Trust',
  wordCount: 900,
  about: ['Content moderation', 'Review policy', 'Business listing rules', 'Spam prevention'],
  keywords: ['content guidelines', 'directory review policy', 'fake review prevention', 'listing acceptance criteria'],
})

const acceptedListings = itemListNode(
  [
    { name: 'Real, operating businesses with a verifiable website or registration' },
    { name: 'Accurate company name, description, category, and location' },
    { name: 'Clear product or service descriptions' },
    { name: 'High-quality logos and media (readable, appropriately sized, no watermarks)' },
    { name: 'Honest pricing information when included' },
    { name: 'Legitimate contact methods (email, phone, verified social)' },
  ],
  `${URL}#accepted-listings`,
  'Business listing acceptance criteria',
)

const rejectedListings = itemListNode(
  [
    { name: 'Fake, parked, or never-launched businesses' },
    { name: 'Duplicate listings for the same entity' },
    { name: 'Misleading category placement' },
    { name: 'MLM schemes, adult services, gambling, counterfeit goods, anything illegal' },
    { name: 'Keyword stuffing, hidden text, or SEO manipulation' },
    { name: 'Copied descriptions or stock template text' },
    { name: 'Logos or media without rights' },
  ],
  `${URL}#rejected-listings`,
  'Business listing rejection criteria',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Content Guidelines - What We Accept, Reject, Moderate | InfoWebWorld',
  description:
    'Plain-English content guidelines for InfoWebWorld business listings and verified user reviews. What is accepted, what is rejected, how moderation works, and how to appeal a decision.',
  keywords: [
    'directory content guidelines',
    'business listing rules',
    'review policy SaaS directory',
    'fake review prevention',
    'spam prevention business directory',
    'content moderation policy',
    'listing acceptance criteria',
    'how directories moderate reviews',
    'incentivized review disclosure',
    'duplicate listing detection',
    'misleading category placement',
    'keyword stuffing penalty',
    'listing appeal process',
    'review appeal directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Content Guidelines - InfoWebWorld',
    description: 'Clear rules for listings and reviews. What we accept, reject, moderate, and how to appeal.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Content Guidelines' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Guidelines - InfoWebWorld',
    description: 'What we accept, reject, moderate, and how to appeal.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function ContentGuidelinesPage() {
  return (
    <InfoPageShell
      kicker="Trust"
      title="Content Guidelines"
      subtitle="We believe in a high-signal directory. These guidelines describe what we accept, what we reject, and how we keep InfoWebWorld useful for real buyers."
      updated="April 21, 2026"
      variant="legal"
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Content moderation policy',
        'Business listing rules',
        'Review acceptance criteria',
        'Spam and fake review prevention',
        'Listing appeal process',
      ]}
      mentions={['MLM schemes', 'Incentivized reviews', 'Keyword stuffing', 'Trademark impersonation', 'DMCA']}
      schemaKeywords={['content guidelines', 'review policy', 'listing rules', 'spam prevention']}
      extraGraph={[articleJsonLd, acceptedListings, rejectedListings, faqJsonLd]}
    >
      <IPSection title="Our Principles">
        <ol>
          <li><strong>Accuracy first.</strong> Information must be truthful and verifiable.</li>
          <li><strong>Buyers over sellers.</strong> When in doubt, we side with the user reading the listing.</li>
          <li><strong>Quality over quantity.</strong> We reject spam, duplicates, and low-value listings.</li>
          <li><strong>Transparency.</strong> Paid placement is clearly labeled. Reviews are never paid.</li>
        </ol>
      </IPSection>

      <IPSection title="Business Listings — What We Accept">
        <ul>
          <li>Real, operating businesses with a verifiable website or registration.</li>
          <li>Accurate company name, description, category, and location.</li>
          <li>Clear product or service descriptions.</li>
          <li>High-quality logos and media (readable, appropriately sized, no watermarks).</li>
          <li>Honest pricing information when included.</li>
          <li>Legitimate contact methods (email, phone, or verified social).</li>
        </ul>
      </IPSection>

      <IPSection title="Business Listings — What We Reject">
        <ul>
          <li>Fake, parked, or never-launched businesses.</li>
          <li>Duplicate listings for the same entity.</li>
          <li>Misleading category placement (e.g., claiming to be AI when you&apos;re not).</li>
          <li>MLM schemes, adult services, gambling, counterfeit goods, or anything illegal in AU or the listing&apos;s declared country.</li>
          <li>Excessive keyword stuffing, hidden text, or SEO manipulation attempts.</li>
          <li>Copied descriptions from competitors or stock template text.</li>
          <li>Logos or media you don&apos;t have rights to use.</li>
        </ul>
      </IPSection>

      <IPSection title="Reviews — What We Accept">
        <ul>
          <li>Honest first-hand experiences from verified users.</li>
          <li>Constructive critique (positive or negative) with specific detail.</li>
          <li>Photos or screenshots supporting your experience.</li>
        </ul>
      </IPSection>

      <IPSection title="Reviews — What We Reject">
        <ul>
          <li>Paid or incentivized reviews that aren&apos;t clearly disclosed as sponsored.</li>
          <li>Reviews written by the business owner, their employees, or competitors.</li>
          <li>Reviews copied from other platforms.</li>
          <li>Personal attacks, harassment, threats, or defamation.</li>
          <li>Off-topic content unrelated to the business or product.</li>
          <li>Spam or promotional content disguised as reviews.</li>
        </ul>
      </IPSection>

      <IPSection title="Enforcement">
        <p>
          Our moderation team reviews every submission before it&apos;s published. We reserve
          the right to reject, edit, or remove content that violates these guidelines at
          any time, with or without notice. Repeat or severe violations may result in
          account suspension.
        </p>
        <p>
          We also use automated systems to flag suspicious patterns (sudden review spikes,
          duplicate text across profiles, etc.). Flagged items are reviewed manually —
          humans make the final call.
        </p>
      </IPSection>

      <IPSection title="Reporting & Appeals">
        <p>
          See something that breaks these rules? <a href="/contact">Report it to us</a>.
          We investigate every legitimate report and act within 72 business hours.
        </p>
        <p>
          If your listing or review was rejected and you believe it was in error, you can
          appeal via the contact form. Please include the listing slug or review ID and
          the reason you believe it complies with these guidelines.
        </p>
      </IPSection>

      <IPSection title="Content Guidelines FAQ">
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
