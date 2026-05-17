import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPTOC } from '../components/InfoPageShell'
import { faqNode, articleNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/privacy`

const toc = [
  { id: 'scope',        label: 'Scope' },
  { id: 'collect',      label: 'Data We Collect' },
  { id: 'use',          label: 'How We Use It' },
  { id: 'sharing',      label: 'Sharing & Disclosure' },
  { id: 'cookies',      label: 'Cookies & Tracking' },
  { id: 'security',     label: 'Data Security' },
  { id: 'retention',    label: 'Retention' },
  { id: 'rights',       label: 'Your Rights' },
  { id: 'international',label: 'International Transfers' },
  { id: 'children',     label: 'Children' },
  { id: 'changes',      label: 'Changes' },
  { id: 'contact',      label: 'Contact' },
]

const faqs = [
  {
    q: 'Does InfoWebWorld sell my personal data?',
    a: 'No. InfoWebWorld does not sell personal data. We share it only with service providers (hosting, email delivery, payments, analytics) under strict data-processing agreements, when required by law, or during a corporate transaction with continuity of privacy commitments.',
  },
  {
    q: 'What rights do I have under GDPR over my InfoWebWorld data?',
    a: 'Depending on your jurisdiction, you may have the right to access, correct, delete, restrict or object to processing, port your data, withdraw consent for marketing, and lodge a complaint with your local data protection authority.',
  },
  {
    q: 'How long does InfoWebWorld retain my personal data?',
    a: 'We retain personal data for as long as your account is active, or as needed to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion at any time except where we are legally required to retain data.',
  },
  {
    q: 'Where does InfoWebWorld store my data?',
    a: 'InfoWebWorld is operated from Australia, with infrastructure in the US, EU, and Asia-Pacific. We apply standard contractual clauses and equivalent safeguards for cross-border transfers of EU and UK personal data.',
  },
  {
    q: 'How do I delete my InfoWebWorld account and all data?',
    a: 'Contact support via the contact page with [DELETE] in the subject line. We confirm identity, delete personal data within 30 days, and retain only what is legally required.',
  },
  {
    q: 'Does InfoWebWorld collect data from children under 18?',
    a: 'No. InfoWebWorld is not intended for users under 18 and we do not knowingly collect data from children. If you believe we have, contact support and we will delete it promptly.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Privacy Policy — How InfoWebWorld Collects, Uses, and Protects Your Data',
  description:
    'InfoWebWorld Privacy Policy covering data collection, use, sharing, cookies, security, retention, GDPR/CCPA/Australian Privacy Act rights, international transfers, and children.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Legal',
  wordCount: 1100,
  about: ['Privacy policy', 'Data protection', 'GDPR', 'CCPA', 'Australian Privacy Act', 'Personal data'],
  keywords: ['privacy policy', 'GDPR rights', 'data deletion', 'data security', 'international transfer'],
})

const privacyPolicyJsonLd = {
  '@type': ['WebPage', 'PrivacyPolicy'],
  '@id': `${URL}#policy`,
  name: 'InfoWebWorld Privacy Policy',
  description:
    'Full privacy policy covering data collection, use, sharing, cookies, security, retention, rights, international transfers, children, and contact information.',
  inLanguage: 'en-US',
  url: URL,
  dateModified: '2026-05-17',
  hasPart: toc.map(t => ({
    '@type': 'WebPageElement',
    name: t.label,
    url: `${URL}#${t.id}`,
    cssSelector: `#${t.id}`,
  })),
}

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Privacy Policy — GDPR · CCPA · Australian Privacy Act | InfoWebWorld',
  description:
    'How InfoWebWorld collects, uses, stores, and protects your personal data. Compliant with GDPR, CCPA / CPRA, and the Australian Privacy Act. We do not sell your data.',
  keywords: [
    'privacy policy',
    'business directory privacy policy',
    'GDPR compliant privacy policy',
    'CCPA privacy policy',
    'CPRA privacy policy',
    'Australian Privacy Act compliance',
    'data subject rights',
    'data deletion request',
    'right to be forgotten',
    'cross-border data transfer',
    'data retention policy',
    'do not sell personal data',
    'cookies and tracking privacy',
    'OAuth privacy policy',
    'PayPal data sharing privacy',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Privacy Policy — InfoWebWorld',
    description: 'GDPR · CCPA · Australian Privacy Act compliant. We do not sell your data.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — InfoWebWorld',
    description: 'GDPR · CCPA · Australian Privacy Act compliant.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function PrivacyPage() {
  return (
    <InfoPageShell
      kicker="Legal"
      title="Privacy Policy"
      subtitle="We respect your privacy. This policy describes what data we collect, how we use it, and the rights you have over it."
      updated="April 21, 2026"
      variant="legal"
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'Privacy policy',
        'GDPR compliance',
        'CCPA compliance',
        'Australian Privacy Act',
        'Data subject rights',
        'Data security',
      ]}
      mentions={['GDPR', 'CCPA', 'CPRA', 'Australian Privacy Act', 'Standard contractual clauses', 'Google Analytics', 'PayPal']}
      schemaKeywords={['privacy policy', 'GDPR', 'CCPA', 'data deletion', 'data security']}
      extraGraph={[articleJsonLd, privacyPolicyJsonLd, faqJsonLd]}
    >
      <IPTOC items={toc} />

      <IPSection id="scope" title="1. Scope">
        <p>
          This Privacy Policy applies to <strong>InfoWebWorld.com</strong>, operated by
          Brain Stream Australia Pty Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). It covers personal data
          we process in connection with the Site and Services.
        </p>
      </IPSection>

      <IPSection id="collect" title="2. Data We Collect">
        <p>We collect personal data in three ways:</p>
        <ul>
          <li>
            <strong>Information you give us:</strong> name, email, password (hashed),
            business details, payment information, uploaded media, reviews, and support
            messages.
          </li>
          <li>
            <strong>Information collected automatically:</strong> IP address, user-agent,
            device type, browser, referring URL, pages viewed, clicks, session duration,
            and approximate geolocation (country / region, via IP).
          </li>
          <li>
            <strong>Information from third parties:</strong> OAuth profiles (Google and
            others you&apos;ve authorized), payment processors (PayPal), and analytics
            providers (Google Analytics).
          </li>
        </ul>
      </IPSection>

      <IPSection id="use" title="3. How We Use It">
        <p>We use your personal data to:</p>
        <ul>
          <li>Operate the Service (listings, dashboards, payments, support).</li>
          <li>Authenticate you and keep your account secure.</li>
          <li>Improve search, discovery, and recommendations.</li>
          <li>Detect fraud, spam, and abuse.</li>
          <li>Send service emails (verification codes, receipts, notifications).</li>
          <li>Send marketing emails — only if you&apos;ve opted in; you can unsubscribe at any time.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </IPSection>

      <IPSection id="sharing" title="4. Sharing & Disclosure">
        <p>We <strong>do not sell your personal data</strong>. We share it only:</p>
        <ul>
          <li>With service providers (hosting, email delivery, payments, analytics) under strict data-processing agreements.</li>
          <li>When required by law, court order, or to protect rights and safety.</li>
          <li>In the event of a corporate transaction (merger, acquisition) — with continuity of privacy commitments.</li>
        </ul>
      </IPSection>

      <IPSection id="cookies" title="5. Cookies & Tracking">
        <p>
          We use first-party cookies for authentication and preferences, and third-party
          analytics cookies for usage insights. See our <a href="/cookies">Cookies Policy</a>
          for full detail and opt-out instructions.
        </p>
      </IPSection>

      <IPSection id="security" title="6. Data Security">
        <p>
          We use industry-standard controls: HTTPS everywhere, bcrypt-hashed passwords,
          encrypted backups, least-privilege access, and regular security audits. No
          system is 100% secure — but we treat your data with the seriousness it deserves.
        </p>
      </IPSection>

      <IPSection id="retention" title="7. Retention">
        <p>
          We retain personal data for as long as your account is active, or as needed to
          provide the Service, comply with legal obligations, resolve disputes, and
          enforce agreements. You may request deletion at any time (see &quot;Your Rights&quot;
          below) except where we&apos;re legally required to retain data.
        </p>
      </IPSection>

      <IPSection id="rights" title="8. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal data we hold about you.</li>
          <li><strong>Correct</strong> inaccurate data.</li>
          <li><strong>Delete</strong> your data (with legal exceptions).</li>
          <li><strong>Restrict</strong> or object to processing.</li>
          <li><strong>Port</strong> your data to another service.</li>
          <li><strong>Withdraw consent</strong> for marketing communications at any time.</li>
          <li><strong>Lodge a complaint</strong> with your local data protection authority.</li>
        </ul>
        <p>
          California residents: see our <a href="/do-not-sell">Do Not Sell or Share My
          Personal Information</a> page for CCPA / CPRA-specific rights.
        </p>
        <p>To exercise any of these, <a href="/contact">contact us</a>.</p>
      </IPSection>

      <IPSection id="international" title="9. International Transfers">
        <p>
          InfoWebWorld is operated from Australia, with infrastructure in the US, EU,
          and Asia-Pacific. By using the Service, you acknowledge that your data may be
          transferred internationally. We apply standard contractual clauses and
          equivalent safeguards for cross-border transfers of EU / UK personal data.
        </p>
      </IPSection>

      <IPSection id="children" title="10. Children">
        <p>
          InfoWebWorld is not intended for users under 18. We do not knowingly collect
          data from children. If you believe we have, please <a href="/contact">contact us</a>
          and we will delete it promptly.
        </p>
      </IPSection>

      <IPSection id="changes" title="11. Changes to This Policy">
        <p>
          We may update this policy from time to time. Material changes will be
          communicated via email or through a prominent notice on the Site.
        </p>
      </IPSection>

      <IPSection id="contact" title="12. Contact">
        <p>
          Data questions, access requests, or privacy concerns: <a href="/contact">contact us</a> or
          write to the Privacy Officer, Brain Stream Australia Pty Ltd, Parramatta,
          NSW 2150, Australia.
        </p>
      </IPSection>

      <IPSection title="Privacy FAQ">
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
