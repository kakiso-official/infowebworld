import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { faqNode, serviceNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/removals`

const faqs = [
  {
    q: 'How do I remove my own business listing from InfoWebWorld?',
    a: 'Submit a request through the contact page with [REMOVE-LISTING] in the subject line. Include the exact URL of the listing and proof of ownership (a business email matching the listing domain, or registration documents). We respond within 72 business hours.',
  },
  {
    q: 'Can a negative review be removed from InfoWebWorld?',
    a: 'Only if the review violates our Content Guidelines — fake, paid, defamatory, off-topic, or impersonation. Honest first-hand criticism, even harsh, stays up. As the business owner you can always respond publicly, which is often more persuasive than a takedown.',
  },
  {
    q: 'How do I file a DMCA copyright takedown notice?',
    a: 'Send a DMCA notice via the contact form with [DMCA] in the subject line. Include the URLs of the infringing material, identification of the copyrighted work, your contact information, a good-faith statement, and a statement under penalty of perjury. We process valid DMCA notices within 72 business hours.',
  },
  {
    q: 'What if my personal information is wrongly published in a listing?',
    a: 'File a [REMOVE-PII] request via the contact form with the listing URL and the specific personal information (home address, personal phone, ID numbers) you want removed. PII removal requests are prioritized.',
  },
  {
    q: 'How long does InfoWebWorld take to respond to removal requests?',
    a: 'All legitimate removal requests receive a response within 72 business hours. PII and law-enforcement requests are prioritized and typically resolved same-day.',
  },
  {
    q: 'Can I appeal a rejected removal decision?',
    a: 'Yes. Reply to the original ticket with new evidence or context within 14 days, and a senior moderator will conduct a second review. We document every decision so context is preserved across reviews.',
  },
]

const serviceJsonLd = serviceNode({
  id: `${URL}#removal-service`,
  name: 'InfoWebWorld Content Removal & Takedown',
  description:
    'Submit a removal request for a business listing, a review, personal information, DMCA copyright, or trademark concern. Responses within 72 business hours.',
  serviceType: 'Content moderation and takedown',
  audience: ['Business owners', 'Reviewers', 'Copyright holders', 'Trademark holders', 'Law enforcement'],
})

const removalTypesList = itemListNode(
  [
    { name: 'Business listing removal', description: 'Full removal of your own business listing at the owner request.' },
    { name: 'Review removal (guideline violation)', description: 'Fake, paid, off-topic, defamatory, or impersonation reviews flagged for moderation.' },
    { name: 'Personal information (PII) removal', description: 'Home address, personal phone number, ID numbers, or other PII wrongly included in a public listing.' },
    { name: 'DMCA copyright takedown', description: 'Copyrighted content (logo, photos, descriptions copied from your site) used without permission.' },
    { name: 'Trademark concern', description: 'Brand impersonation or misleading use of registered marks.' },
    { name: 'Law-enforcement / court-ordered request', description: 'Legal removal requests from authorized parties.' },
  ],
  `${URL}#removal-types`,
  'Types of removal requests InfoWebWorld processes',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Request a Removal — DMCA, PII, Listings, Reviews | InfoWebWorld',
  description:
    'How to request removal of a business listing, a review, personal information, copyrighted content, or trademark violation on InfoWebWorld. Clear DMCA process. Response within 72 business hours.',
  keywords: [
    'remove business listing from directory',
    'DMCA takedown notice directory',
    'remove review from business directory',
    'PII removal request',
    'trademark violation directory',
    'remove personal information from business listing',
    'how to file DMCA copyright takedown',
    'business listing takedown request',
    'review removal policy directory',
    'GDPR right to erasure business directory',
    'right to be forgotten online listing',
    'CCPA delete request',
    'remove negative review online',
    'flag fake review directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Request a Removal — DMCA, PII, Listings, Reviews',
    description: 'Clear path to remove a listing, review, PII, copyright, or trademark from InfoWebWorld. 72-hour response.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Removal Requests' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Removal — InfoWebWorld',
    description: 'DMCA, PII, listing & review removals. 72-hour response.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function RemovalsPage() {
  return (
    <InfoPageShell
      kicker="Trust"
      title="Request a Removal"
      subtitle="Whether you're a business owner, a reviewer, or a third party raising a legitimate concern — this page walks you through the right way to request content removal."
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Content moderation',
        'DMCA takedown',
        'Trademark enforcement',
        'PII removal',
        'Business listing removal',
        'Review moderation',
      ]}
      mentions={['Digital Millennium Copyright Act', 'GDPR right to erasure', 'CCPA delete request', 'Defamation']}
      schemaKeywords={['DMCA takedown', 'PII removal', 'review removal', 'business listing removal']}
      extraGraph={[serviceJsonLd, removalTypesList, faqJsonLd]}
      cta={{
        label: 'Submit a Removal Request',
        href: '/contact',
        description: 'We respond to legitimate requests within 72 business hours.',
      }}
    >
      <IPSection title="What Can Be Removed">
        <ul>
          <li><strong>Your own business listing</strong> — full removal at the owner&apos;s request.</li>
          <li><strong>Reviews that violate our guidelines</strong> (fake, paid, off-topic, defamatory, impersonation). See <a href="/content-guidelines">Content Guidelines</a>.</li>
          <li><strong>Personal information</strong> wrongly included in a public listing (home address, personal phone, ID numbers).</li>
          <li><strong>Copyrighted content</strong> used without permission (logo, photos, descriptions copied from your site).</li>
          <li><strong>Trademark violations</strong> — impersonation of your brand or misleading use of your marks.</li>
          <li><strong>Content that breaks the law</strong> in AU or the listing&apos;s declared country.</li>
        </ul>
      </IPSection>

      <IPSection title="What We Don't Remove">
        <p>
          We do not remove content simply because it&apos;s negative or unflattering. Reviews
          that are honest first-hand criticism — even harsh — stay up. You can always
          respond publicly as the business owner; that&apos;s often more persuasive than a
          takedown request.
        </p>
      </IPSection>

      <IPSection title="How to File a Request">
        <p>Send a message through the <a href="/contact">contact page</a> with one of the following subject-line tags:</p>
        <ul>
          <li><em>[REMOVE-LISTING]</em> — for your own business listing</li>
          <li><em>[REMOVE-REVIEW]</em> — for a review that violates guidelines</li>
          <li><em>[REMOVE-PII]</em> — for personal information that should not be public</li>
          <li><em>[DMCA]</em> — for copyright claims</li>
          <li><em>[TRADEMARK]</em> — for trademark concerns</li>
          <li><em>[LEGAL]</em> — for law-enforcement or court-ordered requests</li>
        </ul>
      </IPSection>

      <IPSection title="What to Include">
        <ol>
          <li>The exact URL(s) of the listing or review in question.</li>
          <li>A clear description of the issue.</li>
          <li>Your relationship to the content (owner, reviewer, rights holder, subject).</li>
          <li>Evidence of ownership or claim (for DMCA / trademark requests, see below).</li>
          <li>Your contact email — we reply within 72 business hours.</li>
        </ol>
      </IPSection>

      <IPSection title="DMCA Notices">
        <p>Copyright claims must include:</p>
        <ol>
          <li>A physical or electronic signature of the copyright owner or authorized agent.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material claimed to be infringing, with URL(s).</li>
          <li>Contact information (address, phone, email).</li>
          <li>A statement that you have a good-faith belief the use is not authorized.</li>
          <li>A statement, under penalty of perjury, that the above information is accurate and that you are authorized to act.</li>
        </ol>
        <p>
          Counter-notices from users whose content is removed can be submitted via the
          same channel, following standard DMCA process.
        </p>
      </IPSection>

      <IPSection title="Removal Request FAQ">
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
