import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/cookies`

const faqs = [
  {
    q: 'What cookies does InfoWebWorld set?',
    a: 'Strictly-necessary cookies for authentication (iww_user_token) and country preference (iww-country) plus CSRF protection. Preference cookies for language, theme, and UI state. Analytics cookies via Google Analytics 4 with anonymized IPs. Third-party cookies set by Google during OAuth sign-in.',
  },
  {
    q: 'Does InfoWebWorld use ad-retargeting cookies?',
    a: 'No. InfoWebWorld does not set ad-retargeting cookies and does not track you across unrelated sites. We are a business directory, not an ad network.',
  },
  {
    q: 'Can I opt out of InfoWebWorld analytics cookies?',
    a: 'Yes. Use the Google Analytics Opt-Out Browser Add-on (tools.google.com/dlpage/gaoptout) or block cookies in your browser settings. Blocking strictly-necessary cookies will log you out and break authentication features.',
  },
  {
    q: 'How long do InfoWebWorld cookies last?',
    a: 'Authentication tokens last for the duration of your session. Preference cookies persist for 12 months. You can clear cookies at any time through your browser settings.',
  },
  {
    q: 'Does InfoWebWorld sell my cookie data?',
    a: 'No. We do not sell your data — see the Privacy Policy and Do Not Sell or Share My Personal Information page for full detail on data practices.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Cookies Policy — How InfoWebWorld Uses Cookies',
  description:
    'What cookies InfoWebWorld sets, why, who sets them, and how to manage or opt out. Includes browser-specific instructions for Chrome, Safari, Firefox, and Edge.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Legal',
  wordCount: 600,
  about: ['HTTP cookies', 'Tracking technologies', 'Browser storage', 'Cookie consent', 'Authentication cookies'],
  keywords: ['cookies policy', 'GDPR cookies', 'opt out analytics', 'browser cookie management'],
})

const cookieCategories = itemListNode(
  [
    { name: 'Strictly necessary cookies', description: 'Authentication token (iww_user_token), country preference (iww-country), CSRF protection. No opt-out available — the site cannot function without these.' },
    { name: 'Preference cookies', description: 'Language selection, theme, UI state. Persisted for 12 months. Can be cleared via browser settings.' },
    { name: 'Analytics cookies', description: 'Google Analytics 4 with anonymized IPs for understanding page usage, referrer sources, and engagement. Opt-out available.' },
    { name: 'Third-party sign-in cookies', description: 'Google OAuth sets cookies on its own domain during sign-in. Governed by Google Privacy Policy.' },
  ],
  `${URL}#cookie-categories`,
  'Categories of cookies set by InfoWebWorld',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Cookies Policy - Authentication, Preferences, Analytics | InfoWebWorld',
  description:
    'How and why InfoWebWorld uses cookies — strictly-necessary, preferences, and Google Analytics with anonymized IPs. No ad-retargeting, no cross-site tracking. Full opt-out instructions for Chrome, Safari, Firefox, and Edge.',
  keywords: [
    'cookies policy',
    'business directory cookies',
    'InfoWebWorld cookies',
    'GDPR cookie compliance',
    'authentication cookies',
    'Google Analytics opt out',
    'block analytics cookies browser',
    'manage cookies Chrome',
    'manage cookies Safari',
    'manage cookies Firefox',
    'cookie consent SaaS',
    'no ad retargeting directory',
    'no cross site tracking',
    'first party cookies directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cookies Policy - InfoWebWorld',
    description: 'Authentication, preferences, analytics. No ad retargeting. Full opt-out instructions.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Cookies Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookies Policy - InfoWebWorld',
    description: 'Authentication, preferences, analytics. No ad retargeting.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function CookiesPage() {
  return (
    <InfoPageShell
      kicker="Legal"
      title="Cookies Policy"
      subtitle="Cookies help us run InfoWebWorld smoothly — for authentication, preferences, and understanding how the site is used. Here's the full picture."
      updated="April 21, 2026"
      variant="legal"
      webPageType={['WebPage', 'FAQPage']}
      about={[
        'HTTP cookies',
        'Tracking technologies',
        'Authentication cookies',
        'Cookie consent',
        'Browser storage',
      ]}
      mentions={['Google Analytics 4', 'Google OAuth', 'GDPR', 'CCPA', 'CSRF protection']}
      schemaKeywords={['cookies policy', 'GDPR cookies', 'opt out', 'no ad retargeting']}
      extraGraph={[articleJsonLd, cookieCategories, faqJsonLd]}
    >
      <IPSection title="What Are Cookies?">
        <p>
          Cookies are small text files stored in your browser when you visit a website.
          They help sites remember who you are, what you prefer, and how you interact —
          so they can provide a better experience on return visits.
        </p>
      </IPSection>

      <IPSection title="Cookies We Use">
        <p>We set these categories of cookies:</p>
        <ul>
          <li>
            <strong>Strictly necessary</strong> — authentication token (<em>iww_user_token</em>),
            country preference (<em>iww-country</em>), CSRF protection. The site cannot function
            without these. No opt-out available.
          </li>
          <li>
            <strong>Preferences</strong> — language selection, theme (if applicable), UI state.
            Persisted for 12 months. Can be cleared via browser settings.
          </li>
          <li>
            <strong>Analytics</strong> — Google Analytics 4 (anonymized IPs), understanding page
            usage, referrer sources, and engagement. We do not use analytics cookies for
            ad retargeting. Opt out at any time.
          </li>
          <li>
            <strong>Third-party sign-in</strong> — Google OAuth sets cookies on its own domain
            during sign-in flows. Governed by <a href="https://policies.google.com/privacy">Google&apos;s
            Privacy Policy</a>.
          </li>
        </ul>
      </IPSection>

      <IPSection title="What We Don't Do">
        <ul>
          <li>We do not use cookies to track you across unrelated sites.</li>
          <li>We do not set ad-retargeting cookies.</li>
          <li>We do not sell your data (see our <a href="/privacy">Privacy Policy</a>).</li>
        </ul>
      </IPSection>

      <IPSection title="Managing Your Preferences">
        <p>
          Most browsers let you view, manage, and delete cookies through their settings:
        </p>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
          <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
        </ul>
        <p>
          You can also opt out of Google Analytics site-wide using the
          <a href="https://tools.google.com/dlpage/gaoptout"> Google Analytics Opt-Out Browser Add-on</a>.
        </p>
        <blockquote>
          Blocking strictly-necessary cookies will log you out and break authentication
          features like dashboards and reviews.
        </blockquote>
      </IPSection>

      <IPSection title="Updates">
        <p>
          We may update this policy as our cookie stack evolves. Material changes will be
          announced on the Site. Questions? <a href="/contact">Contact us</a>.
        </p>
      </IPSection>

      <IPSection title="Cookies FAQ">
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
