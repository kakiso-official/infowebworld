import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TermsTOC from './TermsTOC'

const PUBLISHED_ISO   = '2026-04-21T00:00:00+10:00'
const MODIFIED_ISO    = '2026-04-21T00:00:00+10:00'
const UPDATED_DISPLAY = 'April 21, 2026'

const URL_PAGE         = 'https://infowebworld.com/terms'
const ID_BREADCRUMB    = `${URL_PAGE}#breadcrumb`
const ID_WEBPAGE       = `${URL_PAGE}#webpage`
const ID_TERMS_DOC     = `${URL_PAGE}#document`
const ID_FAQ           = `${URL_PAGE}#faq`
const ID_WEBSITE       = 'https://infowebworld.com/#website'
const ID_ORGANIZATION  = 'https://infowebworld.com/#organization'

export const metadata: Metadata = {
  title: 'Terms of Use — InfoWebWorld',
  description:
    'InfoWebWorld Terms of Use: account rules, 14-day refund policy, intellectual property, prohibited conduct, and Australian (NSW) governing law for our global business discovery platform.',
  alternates: { canonical: URL_PAGE },
  openGraph: {
    type: 'article',
    url: URL_PAGE,
    siteName: 'InfoWebWorld',
    title: 'Terms of Use — InfoWebWorld',
    description:
      'The legal agreement governing your use of InfoWebWorld — refunds, IP, accounts, conduct, and governing law.',
    locale: 'en_US',
    publishedTime: PUBLISHED_ISO,
    modifiedTime: MODIFIED_ISO,
    section: 'Legal',
    authors: ['https://infowebworld.com'],
    tags: [
      'terms of use',
      'terms of service',
      'refund policy',
      'intellectual property',
      'user content licensing',
      'account termination',
      'limitation of liability',
      'governing law',
      'New South Wales Australia',
      'InfoWebWorld',
    ],
    images: [
      {
        url: 'https://infowebworld.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InfoWebWorld — Terms of Use',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use — InfoWebWorld',
    description: 'The legal agreement governing your use of InfoWebWorld.',
    images: ['https://infowebworld.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  authors: [{ name: 'InfoWebWorld', url: 'https://infowebworld.com' }],
  creator: 'InfoWebWorld',
  publisher: 'Brain Stream Australia Pty Ltd',
  category: 'legal',
}

const SECTIONS: { id: string; num: number; label: string }[] = [
  { id: 'acceptance',  num: 1,  label: 'Acceptance of Terms' },
  { id: 'eligibility', num: 2,  label: 'Eligibility' },
  { id: 'accounts',    num: 3,  label: 'Accounts & Security' },
  { id: 'listings',    num: 4,  label: 'Business Listings' },
  { id: 'content',     num: 5,  label: 'User Content' },
  { id: 'prohibited',  num: 6,  label: 'Prohibited Conduct' },
  { id: 'payments',    num: 7,  label: 'Payments & Refunds' },
  { id: 'ip',          num: 8,  label: 'Intellectual Property' },
  { id: 'termination', num: 9,  label: 'Termination' },
  { id: 'disclaimers', num: 10, label: 'Disclaimers' },
  { id: 'liability',   num: 11, label: 'Limitation of Liability' },
  { id: 'law',         num: 12, label: 'Governing Law' },
  { id: 'changes',     num: 13, label: 'Changes to Terms' },
  { id: 'contact',     num: 14, label: 'Contact' },
]

const pad = (n: number) => String(n).padStart(2, '0')

const FAQ_QA: { q: string; a: string }[] = [
  {
    q: 'Can I get a refund from InfoWebWorld?',
    a: 'Yes. One-time plans (Starter and Lifetime) and yearly plans are refundable within 14 days of initial purchase. Yearly renewals are non-refundable. Contact support within the 14-day window to request a refund.',
  },
  {
    q: 'Who owns the content I post on InfoWebWorld?',
    a: 'You retain full ownership of any content you submit, including reviews, business profiles, photos, and text. By submitting, you grant InfoWebWorld a worldwide, non-exclusive, royalty-free, sublicensable license to use, display, distribute, and adapt your content for operating and promoting the Service.',
  },
  {
    q: 'Which laws govern InfoWebWorld\u2019s Terms of Use?',
    a: 'The laws of New South Wales, Australia govern these Terms of Use, without regard to conflict-of-laws principles. Any dispute is resolved in the competent courts of Sydney, NSW.',
  },
  {
    q: 'Who is eligible to use InfoWebWorld?',
    a: 'You must be at least 18 years old and capable of forming a binding contract under your jurisdiction\u2019s laws. If using on behalf of a business, you must be authorized to bind that business.',
  },
  {
    q: 'How do I close or terminate my InfoWebWorld account?',
    a: 'You may terminate your account at any time through your dashboard or by contacting InfoWebWorld support directly. InfoWebWorld may also suspend or terminate access at any time for violations of these Terms.',
  },
  {
    q: 'What is InfoWebWorld\u2019s limit of liability?',
    a: 'To the maximum extent permitted by law, InfoWebWorld is not liable for indirect, incidental, special, consequential, or punitive damages. Total liability for any claim is capped at the amount you paid in the 12 months preceding the claim, or AUD $100 — whichever is greater.',
  },
]

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': ID_BREADCRUMB,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://infowebworld.com' },
        { '@type': 'ListItem', position: 2, name: 'Terms of Use', item: URL_PAGE },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': ID_WEBPAGE,
      url: URL_PAGE,
      name: 'Terms of Use — InfoWebWorld',
      description: 'The legal agreement governing your use of InfoWebWorld — refunds, IP, accounts, conduct, and governing law.',
      inLanguage: 'en-US',
      datePublished: PUBLISHED_ISO,
      dateModified: MODIFIED_ISO,
      isPartOf: { '@id': ID_WEBSITE, '@type': 'WebSite', name: 'InfoWebWorld', url: 'https://infowebworld.com' },
      breadcrumb: { '@id': ID_BREADCRUMB },
      primaryImageOfPage: { '@type': 'ImageObject', url: 'https://infowebworld.com/og-image.png', width: 1200, height: 630 },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.tm-title', '.tm-sub', '.tm-glance'],
      },
      about: [
        { '@type': 'Thing', name: 'Refund policy' },
        { '@type': 'Thing', name: 'Intellectual property rights' },
        { '@type': 'Thing', name: 'User-generated content licensing' },
        { '@type': 'Thing', name: 'Account termination' },
        { '@type': 'Thing', name: 'Australian governing law' },
        { '@type': 'Thing', name: 'Limitation of liability' },
      ],
    },
    {
      '@type': 'TermsOfService',
      '@id': ID_TERMS_DOC,
      name: 'Terms of Use',
      headline: 'Terms of Use — InfoWebWorld',
      description: 'The legal agreement between users and InfoWebWorld governing platform use — including a 14-day refund window, intellectual property rights, prohibited conduct, and Australian (New South Wales) governing law.',
      url: URL_PAGE,
      datePublished: PUBLISHED_ISO,
      dateModified: MODIFIED_ISO,
      inLanguage: 'en-US',
      mainEntityOfPage: { '@id': ID_WEBPAGE },
      isPartOf: { '@id': ID_WEBSITE },
      publisher: {
        '@type': 'Organization',
        '@id': ID_ORGANIZATION,
        name: 'InfoWebWorld',
        legalName: 'Brain Stream Australia Pty Ltd',
        url: 'https://infowebworld.com',
        logo: 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Parramatta',
          addressRegion: 'NSW',
          postalCode: '2150',
          addressCountry: 'AU',
        },
      },
      hasPart: SECTIONS.map(s => ({
        '@type': 'WebPageElement',
        name: s.label,
        url: `${URL_PAGE}#${s.id}`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': ID_FAQ,
      isPartOf: { '@id': ID_WEBPAGE },
      mainEntity: FAQ_QA.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />
      <main className="tm" id="top">
        <header className="tm-header">
          <nav className="tm-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="tm-crumb-sep" aria-hidden="true">/</span>
            <span className="tm-crumb-current">Terms of Use</span>
          </nav>
          <h1 className="tm-title">Terms of Use</h1>
          <p className="tm-sub">
            These terms form a binding agreement between you and InfoWebWorld. Read them carefully — by using the site, you agree to every provision below.
          </p>
          <span className="tm-meta">
            <span className="tm-meta-dot" aria-hidden="true" />
            Last updated <time dateTime={MODIFIED_ISO}>{UPDATED_DISPLAY}</time>
          </span>
        </header>

        <div className="tm-layout">
          <TermsTOC items={SECTIONS} />

          <article className="tm-content" itemScope itemType="https://schema.org/TermsOfService">
            <meta itemProp="datePublished" content={PUBLISHED_ISO} />
            <meta itemProp="dateModified" content={MODIFIED_ISO} />
            <meta itemProp="inLanguage" content="en-US" />

            <aside className="tm-glance" aria-label="Key facts at a glance">
              <h2 className="tm-glance-title">At a glance</h2>
              <dl className="tm-glance-list">
                <div className="tm-glance-row">
                  <dt>Refund window</dt>
                  <dd>14 days from purchase</dd>
                </div>
                <div className="tm-glance-row">
                  <dt>Minimum age</dt>
                  <dd>18 years</dd>
                </div>
                <div className="tm-glance-row">
                  <dt>Governing law</dt>
                  <dd>New South Wales, Australia</dd>
                </div>
                <div className="tm-glance-row">
                  <dt>Content ownership</dt>
                  <dd>You retain it</dd>
                </div>
                <div className="tm-glance-row">
                  <dt>Payment processor</dt>
                  <dd>PayPal &amp; approved third parties</dd>
                </div>
                <div className="tm-glance-row">
                  <dt>Last reviewed</dt>
                  <dd><time dateTime={MODIFIED_ISO}>{UPDATED_DISPLAY}</time></dd>
                </div>
              </dl>
              <p className="tm-glance-note">
                Summary only. The binding agreement is the full text below.
              </p>
            </aside>

            <section id="acceptance" className="tm-section">
              <h2 className="tm-h2" data-num={pad(1)}>Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>InfoWebWorld.com</strong> (the &ldquo;Site&rdquo;), any of
                its subdomains, or any services offered on or through the Site (collectively,
                the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Use and our{' '}
                <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the Service.
              </p>
            </section>

            <section id="eligibility" className="tm-section">
              <h2 className="tm-h2" data-num={pad(2)}>Eligibility</h2>
              <p>
                You must be at least 18 years old and capable of forming a binding contract
                under the laws of your jurisdiction. If you use the Service on behalf of a
                business, you represent that you are authorized to bind that business.
              </p>
            </section>

            <section id="accounts" className="tm-section">
              <h2 className="tm-h2" data-num={pad(3)}>Accounts &amp; Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activity under your account. Notify us immediately of
                any unauthorized access. We reserve the right to suspend accounts for
                suspicious activity, terms violations, or non-payment.
              </p>
            </section>

            <section id="listings" className="tm-section">
              <h2 className="tm-h2" data-num={pad(4)}>Business Listings</h2>
              <p>
                Businesses may submit listings for human review. We reserve the right to reject,
                edit, or remove any listing that is inaccurate, misleading, spam, duplicate,
                or in violation of our <a href="/content-guidelines">Content Guidelines</a>.
                Paid listings are subject to review before publication.
              </p>
            </section>

            <section id="content" className="tm-section">
              <h2 className="tm-h2" data-num={pad(5)}>User Content</h2>
              <p>
                You retain ownership of content you submit (reviews, business profiles, photos,
                text). By submitting content, you grant InfoWebWorld a worldwide, non-exclusive,
                royalty-free, sublicensable license to use, display, distribute, and adapt it
                for operating and promoting the Service.
              </p>
              <p>
                You represent that you have the right to grant this license and that your
                content does not infringe any third-party rights.
              </p>
            </section>

            <section id="prohibited" className="tm-section">
              <h2 className="tm-h2" data-num={pad(6)}>Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Impersonate any person or entity.</li>
                <li>Post reviews you are paid to write (without clearly disclosing).</li>
                <li>Scrape, crawl, or copy the Site&rsquo;s content at scale without permission.</li>
                <li>Upload viruses, malware, or any code intended to harm the Service or users.</li>
                <li>Attempt to gain unauthorized access to accounts, systems, or data.</li>
                <li>Use the Service to send spam, phishing, or unsolicited commercial messages.</li>
                <li>Violate any applicable law or regulation.</li>
              </ul>
            </section>

            <section id="payments" className="tm-section">
              <h2 className="tm-h2" data-num={pad(7)}>Payments &amp; Refunds</h2>
              <p>
                Paid plans are processed via PayPal and other third-party processors. Prices
                and features are listed on the <a href="/business/plans">Plans page</a>.
                One-time plans (Starter, Lifetime) are non-refundable after 14 days. Yearly
                plans can be refunded within 14 days of initial purchase; renewals are
                non-refundable. Contact support within the window for refund requests.
              </p>
            </section>

            <section id="ip" className="tm-section">
              <h2 className="tm-h2" data-num={pad(8)}>Intellectual Property</h2>
              <p>
                The Site, its branding, logos, design, and compiled database are owned by
                InfoWebWorld / Brain Stream Australia Pty Ltd and protected by applicable
                copyright, trademark, and database-rights laws. You may not copy, modify, or
                redistribute them without our written consent.
              </p>
            </section>

            <section id="termination" className="tm-section">
              <h2 className="tm-h2" data-num={pad(9)}>Termination</h2>
              <p>
                We may suspend or terminate your access at any time, with or without notice,
                for any reason — including violation of these Terms. You may terminate your
                account at any time through your dashboard or by contacting us.
              </p>
            </section>

            <section id="disclaimers" className="tm-section">
              <h2 className="tm-h2" data-num={pad(10)}>Disclaimers</h2>
              <p>
                The Service is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any
                kind, express or implied, including merchantability, fitness for a particular
                purpose, and non-infringement. We do not guarantee uninterrupted availability,
                accuracy of third-party listings, or specific search-ranking outcomes.
              </p>
            </section>

            <section id="liability" className="tm-section">
              <h2 className="tm-h2" data-num={pad(11)}>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, InfoWebWorld shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages. Our
                total liability for any claim arising out of these Terms or your use of the
                Service shall not exceed the amount you paid us in the 12 months preceding
                the claim, or AUD $100 — whichever is greater.
              </p>
            </section>

            <section id="law" className="tm-section">
              <h2 className="tm-h2" data-num={pad(12)}>Governing Law</h2>
              <p>
                These Terms are governed by the laws of <strong>New South Wales, Australia</strong>,
                without regard to conflict-of-laws principles. Any dispute shall be resolved
                in the competent courts of Sydney, NSW.
              </p>
            </section>

            <section id="changes" className="tm-section">
              <h2 className="tm-h2" data-num={pad(13)}>Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. Material changes will be
                announced on the Site or via email for registered users. Continued use after
                updates constitutes acceptance of the new Terms.
              </p>
            </section>

            <section id="contact" className="tm-section">
              <h2 className="tm-h2" data-num={pad(14)}>Contact</h2>
              <p>
                Questions about these Terms? <a href="/contact">Contact us</a> or write to
                Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia.
              </p>
            </section>
          </article>
        </div>

        <footer className="tm-footer">
          <address className="tm-address">
            Brain Stream Australia Pty Ltd &middot; Parramatta, NSW 2150, Australia
          </address>
          <a href="#top" className="tm-back-top">Back to top &uarr;</a>
        </footer>
      </main>
      <Footer />
    </>
  )
}
