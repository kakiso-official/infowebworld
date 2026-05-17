import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, howToNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/write-review`

const faqs = [
  {
    q: 'How do I write a review on InfoWebWorld?',
    a: 'Find the business you want to review via category browse or search, open its listing, and click the Write a Review button on its profile. Star ratings cover value, support, product quality, and ease of use, with an overall weighted score on the listing.',
  },
  {
    q: 'Are InfoWebWorld reviews verified?',
    a: 'Yes. Every review goes through identity verification — we verify the reviewer is a real person, not a bot or a sock puppet — plus content moderation to filter fake, paid, or off-topic submissions.',
  },
  {
    q: 'Can I be paid for writing a review on InfoWebWorld?',
    a: 'No. Paid or incentivized reviews are not allowed unless they are clearly disclosed as sponsored. We do not run a paid-review marketplace. Honest, unpaid reviews are the only kind we accept.',
  },
  {
    q: 'What makes a good business review?',
    a: 'Be specific — name what you bought, when, what worked, what did not. Be honest — negative reviews are welcome if fair. Be yourself — no reviews by the business owner, employees, competitors, or paid reviewers. Disclose any conflicts like free product or affiliate ties.',
  },
  {
    q: 'Can I edit or delete a review I wrote?',
    a: 'Yes. From your dashboard you can edit your review at any time — the original is replaced. Deleting a review is also permitted; the listing star average updates within minutes.',
  },
]

const howToWriteReview = howToNode({
  id: `${URL}#how-to-write`,
  name: 'How to write a verified business review on InfoWebWorld',
  description:
    'Five steps to writing a high-signal, verified review on InfoWebWorld — find the business, click Write a Review, rate the dimensions, share specific details, and submit for moderation.',
  totalTime: 'PT5M',
  steps: [
    { name: 'Find the business', text: 'Use category browse or the search bar at the top of the site to find the business you want to review.' },
    { name: 'Open its listing', text: 'Click into the listing profile. The Write a Review button is on the listing sticky header.' },
    { name: 'Rate the dimensions', text: 'Rate value, support, product quality, and ease of use individually. A weighted overall score appears on the listing.' },
    { name: 'Share specific details', text: 'What you bought, when, what worked, what did not. Specific detail helps future buyers; vague praise or rage does not.' },
    { name: 'Submit for moderation', text: 'Submit. Our moderation team verifies identity and reviews against the content guidelines. Approved reviews go live within 72 hours.' },
  ],
})

const reviewActionJsonLd = {
  '@type': 'ReviewAction',
  '@id': `${URL}#reviewaction`,
  name: 'Write a verified business review on InfoWebWorld',
  description: 'Submit an honest, verified, moderated review of any product, service, or agency on InfoWebWorld.',
  target: {
    '@type': 'EntryPoint',
    urlTemplate: `${BASE_URL}/all?q={search_term_string}`,
    actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
  },
  'query-input': 'required name=search_term_string',
}

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Write a Verified Review — Help Buyers Decide Faster | InfoWebWorld',
  description:
    'Share your honest first-hand experience with a product, service, or agency on InfoWebWorld. Identity-verified, moderated, never paid. Star ratings across value, support, product quality, and ease of use.',
  keywords: [
    'write a business review',
    'write a verified review',
    'how to write a good business review',
    'verified review platform',
    'honest business review',
    'rate a business directory',
    'product review platform',
    'SaaS review platform',
    'unbiased business reviews',
    'review a SaaS product',
    'review an IT agency',
    'review a local business',
    'star rating value support quality',
    'verified review InfoWebWorld',
    'no paid reviews directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Write a Verified Review — InfoWebWorld',
    description: 'Honest first-hand experience. Verified, moderated, never paid.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Write a Review on InfoWebWorld' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Write a Verified Review — InfoWebWorld',
    description: 'Honest, verified, moderated, never paid.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function WriteReviewPage() {
  return (
    <InfoPageShell
      kicker="Reviews"
      title="Write a Review"
      subtitle="Help the next buyer decide faster. Share your honest first-hand experience with a product, service, or agency. Verified, moderated, never paid."
      variant="coming-soon"
      webPageType={['WebPage', 'FAQPage']}
      about={['Verified reviews', 'Business review platform', 'Review writing guide', 'Honest customer feedback', 'Review moderation']}
      mentions={['Star rating', 'Identity verification', 'Conflict-of-interest disclosure', 'Content moderation']}
      schemaKeywords={['write a review', 'verified review', 'business review platform', 'no paid reviews']}
      extraGraph={[reviewActionJsonLd, howToWriteReview, faqJsonLd]}
      cta={{
        label: 'Browse Categories',
        href: '/categories',
        description: 'Find the business you want to review and click the Write a Review button on its profile.',
      }}
    >
      <IPSection title="How Reviews Work">
        <IPCardGrid cols={3}>
          <IPCard icon="📝" title="Honest first-hand experience">
            Tell us what actually happened. Specific details help future buyers — vague
            praise or rage doesn&apos;t.
          </IPCard>
          <IPCard icon="⭐" title="Star ratings across dimensions">
            Rate what matters: value, support, product quality, ease of use. Weighted
            overall score appears on the listing.
          </IPCard>
          <IPCard icon="🛡️" title="Verified + moderated">
            We verify reviewer identity and moderate every submission. Fake or paid
            reviews are rejected. Honest critique stays.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Review Guidelines">
        <ul>
          <li><strong>Be specific.</strong> &quot;Great product!&quot; doesn&apos;t help anyone. What did you buy, when, what worked, what didn&apos;t?</li>
          <li><strong>Be honest.</strong> Negative reviews are welcome if they&apos;re fair. Personal attacks or defamation are not.</li>
          <li><strong>Be yourself.</strong> No reviews by the business owner, employees, competitors, or paid reviewers.</li>
          <li><strong>Disclose conflicts.</strong> If the company gave you free product or paid you, say so clearly.</li>
        </ul>
        <p>See the full <a href="/content-guidelines">Content Guidelines</a> for details.</p>
      </IPSection>

      <IPSection title="Find a Business to Review">
        <p>
          The dedicated review-writing flow is under construction. For now, find the
          business you want to review via <a href="/categories">category browse</a>
          or the search bar at the top of the site — once a listing&apos;s review feature
          goes live, you&apos;ll see a <em>Write a Review</em> button on its profile.
        </p>
      </IPSection>

      <IPSection title="Reviewer FAQ">
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
