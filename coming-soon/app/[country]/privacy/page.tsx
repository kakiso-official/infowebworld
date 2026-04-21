import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPTOC } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — InfoWebWorld',
  description: 'How InfoWebWorld collects, uses, stores, and protects your personal data. Our commitment to privacy and your rights under GDPR, CCPA, and the Australian Privacy Act.',
  alternates: { canonical: 'https://infowebworld.com/privacy' },
}

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

export default function PrivacyPage() {
  return (
    <InfoPageShell
      kicker="Legal"
      title="Privacy Policy"
      subtitle="We respect your privacy. This policy describes what data we collect, how we use it, and the rights you have over it."
      updated="April 21, 2026"
      variant="legal"
    >
      <IPTOC items={toc} />

      <IPSection id="scope" title="1. Scope">
        <p>
          This Privacy Policy applies to <strong>InfoWebWorld.com</strong>, operated by
          Brain Stream Australia Pty Ltd ("we", "us", "our"). It covers personal data
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
            others you've authorized), payment processors (PayPal), and analytics
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
          <li>Send marketing emails — only if you've opted in; you can unsubscribe at any time.</li>
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
          enforce agreements. You may request deletion at any time (see "Your Rights"
          below) except where we're legally required to retain data.
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
    </InfoPageShell>
  )
}
