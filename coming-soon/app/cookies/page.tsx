import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Cookies Policy — InfoWebWorld',
  description: 'How and why InfoWebWorld uses cookies — what they do, who sets them, and how to opt out or manage your preferences.',
  alternates: { canonical: 'https://infowebworld.com/cookies' },
}

export default function CookiesPage() {
  return (
    <InfoPageShell
      kicker="Legal"
      title="Cookies Policy"
      subtitle="Cookies help us run InfoWebWorld smoothly — for authentication, preferences, and understanding how the site is used. Here's the full picture."
      updated="April 21, 2026"
      variant="legal"
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
            during sign-in flows. Governed by <a href="https://policies.google.com/privacy">Google's
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
    </InfoPageShell>
  )
}
