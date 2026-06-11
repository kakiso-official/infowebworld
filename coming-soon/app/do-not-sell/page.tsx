import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/do-not-sell`

const faqs = [
  {
    q: 'Does InfoWebWorld sell my personal information under CCPA?',
    a: 'No. InfoWebWorld does not sell your personal information for money. We also do not currently share personal information for cross-context behavioral advertising. We operate a directory and discovery platform, not an ad network.',
  },
  {
    q: 'What rights do California residents have over their data on InfoWebWorld?',
    a: 'California residents have the right to know, delete, correct, opt out of sale or sharing, limit use of sensitive personal information, and non-discrimination — meaning we will not deny service, change pricing, or reduce service quality for exercising rights.',
  },
  {
    q: 'How do I exercise my CCPA opt-out or deletion rights?',
    a: 'Submit a request through the contact page with [CCPA-OPT-OUT] in the subject line. Include your full name, the email on your InfoWebWorld account, a statement that you are a California resident, and the specific right you are exercising. We verify identity and respond within 45 days.',
  },
  {
    q: 'Can an authorized agent submit a CCPA request on my behalf?',
    a: 'Yes. You can designate an authorized agent. We require written authorization signed by you plus proof of the agent identity before processing any request.',
  },
  {
    q: 'How long does InfoWebWorld take to respond to a CCPA request?',
    a: 'We respond to all valid CCPA and CPRA requests within 45 days, as required by California law. Identity verification typically takes 2 business days.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Do Not Sell or Share My Personal Information — California Privacy Rights',
  description:
    'California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) rights for InfoWebWorld users. Right to know, delete, correct, opt out of sale or sharing, limit use of sensitive personal information, and non-discrimination.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Legal · California Privacy',
  wordCount: 700,
  about: ['CCPA', 'CPRA', 'California Consumer Privacy Act', 'Privacy rights', 'Data subject rights'],
  keywords: ['CCPA opt out', 'CPRA rights', 'California privacy rights', 'do not sell my personal information'],
})

const rightsList = itemListNode(
  [
    { name: 'Right to know what personal information we have about you' },
    { name: 'Right to delete that personal information' },
    { name: 'Right to correct inaccurate personal information' },
    { name: 'Right to opt out of any sale or sharing of personal information' },
    { name: 'Right to limit use of sensitive personal information to necessary purposes only' },
    { name: 'Right to non-discrimination — service and pricing unaffected by exercising rights' },
  ],
  `${URL}#california-rights`,
  'California consumer rights under CCPA and CPRA',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Do Not Sell or Share My Personal Information - CCPA & CPRA | InfoWebWorld',
  description:
    'California residents: your CCPA and CPRA rights on InfoWebWorld — right to know, delete, correct, opt out of sale or sharing, limit use of sensitive personal information, and non-discrimination. 45-day response window.',
  keywords: [
    'CCPA opt out',
    'CPRA rights',
    'do not sell my personal information',
    'do not share my personal information',
    'California privacy rights',
    'California Consumer Privacy Act business directory',
    'California Privacy Rights Act',
    'right to know personal data',
    'right to delete personal data',
    'right to correct personal data',
    'limit use sensitive personal information',
    'authorized agent CCPA request',
    'cross-context behavioral advertising opt out',
    'no data sale directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Do Not Sell or Share My Personal Information - InfoWebWorld',
    description: 'California CCPA + CPRA rights. We do not sell or share personal information. Full opt-out path.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld CCPA / CPRA Rights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do Not Sell or Share - InfoWebWorld',
    description: 'California CCPA + CPRA rights and opt-out path.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function DoNotSellPage() {
  return (
    <InfoPageShell
      kicker="California Privacy"
      title="Do Not Sell or Share My Personal Information"
      subtitle="Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights over how businesses handle their personal information."
      updated="April 21, 2026"
      variant="legal"
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'California Consumer Privacy Act',
        'California Privacy Rights Act',
        'Data subject rights',
        'Cross-context behavioral advertising',
        'Sensitive personal information',
      ]}
      mentions={['CCPA', 'CPRA', 'California Attorney General', 'Authorized agent', 'Right to be forgotten']}
      schemaKeywords={['CCPA opt out', 'CPRA', 'California privacy rights', 'do not sell my data']}
      extraGraph={[articleJsonLd, rightsList, faqJsonLd]}
    >
      <IPSection title="Our Position">
        <p>
          <strong>InfoWebWorld does not sell your personal information for money.</strong>
        </p>
        <p>
          We also do not currently <em>share</em> your personal information for
          cross-context behavioral advertising. We operate a directory and discovery
          platform — not an ad network.
        </p>
        <p>
          That said, California law defines &quot;sell&quot; and &quot;share&quot; broadly. This page
          documents our practices and gives you a clear, no-friction way to opt out of
          any data transfers that might meet those definitions.
        </p>
      </IPSection>

      <IPSection title="What This Means For You">
        <p>If you are a California resident, you have the right to:</p>
        <ul>
          <li><strong>Know</strong> what personal information we have about you.</li>
          <li><strong>Delete</strong> that personal information.</li>
          <li><strong>Correct</strong> inaccurate personal information.</li>
          <li><strong>Opt out</strong> of any sale or sharing of your personal information.</li>
          <li><strong>Limit use</strong> of sensitive personal information to necessary purposes only.</li>
          <li><strong>Non-discrimination</strong> — we will not deny service, change pricing, or reduce service quality because you exercised your rights.</li>
        </ul>
      </IPSection>

      <IPSection title="Opt Out">
        <p>
          To opt out of any potential &quot;sale&quot; or &quot;sharing&quot; of your personal information,
          or to exercise any other CCPA / CPRA right, please <a href="/contact">submit a
          request through our contact page</a> with <em>[CCPA-OPT-OUT]</em> in the
          subject line.
        </p>
        <p>Include in your request:</p>
        <ol>
          <li>Your full name and email address associated with your InfoWebWorld account (if any).</li>
          <li>A statement that you are a California resident.</li>
          <li>The specific right you&apos;re exercising (opt-out, delete, know, correct, limit use).</li>
        </ol>
        <p>
          We verify the identity of requesters to prevent fraud. We respond to all valid
          requests within <strong>45 days</strong>, as required by law.
        </p>
      </IPSection>

      <IPSection title="Authorized Agents">
        <p>
          You can designate an authorized agent to submit requests on your behalf. We
          will require written authorization (signed by you) and proof of the agent&apos;s
          identity before processing.
        </p>
      </IPSection>

      <IPSection title="Questions">
        <p>
          For questions about your California privacy rights, see our full
          <a href="/privacy"> Privacy Policy </a>
          or <a href="/contact">contact us</a>.
        </p>
      </IPSection>

      <IPSection title="California Privacy FAQ">
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
