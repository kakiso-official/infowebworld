import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPTOC } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Terms of Use — InfoWebWorld',
  description: 'The terms that govern your use of InfoWebWorld — rights, responsibilities, and rules of the road for our global business discovery platform.',
  alternates: { canonical: 'https://infowebworld.com/terms' },
}

const toc = [
  { id: 'acceptance',      label: 'Acceptance of Terms' },
  { id: 'eligibility',     label: 'Eligibility' },
  { id: 'accounts',        label: 'Accounts & Security' },
  { id: 'listings',        label: 'Business Listings' },
  { id: 'content',         label: 'User Content' },
  { id: 'prohibited',      label: 'Prohibited Conduct' },
  { id: 'payments',        label: 'Payments & Refunds' },
  { id: 'ip',              label: 'Intellectual Property' },
  { id: 'termination',     label: 'Termination' },
  { id: 'disclaimers',     label: 'Disclaimers' },
  { id: 'liability',       label: 'Limitation of Liability' },
  { id: 'law',             label: 'Governing Law' },
  { id: 'changes',         label: 'Changes to Terms' },
  { id: 'contact',         label: 'Contact' },
]

export default function TermsPage() {
  return (
    <InfoPageShell
      kicker="Legal"
      title="Terms of Use"
      subtitle="These terms form a binding agreement between you and InfoWebWorld. Read them carefully — by using the site, you agree to every provision below."
      updated="April 21, 2026"
      variant="legal"
    >
      <IPTOC items={toc} />

      <IPSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          By accessing or using <strong>InfoWebWorld.com</strong> (the "Site"), any of
          its subdomains, or any services offered on or through the Site (collectively,
          the "Service"), you agree to be bound by these Terms of Use and our
          <a href="/privacy"> Privacy Policy</a>. If you do not agree, do not use the Service.
        </p>
      </IPSection>

      <IPSection id="eligibility" title="2. Eligibility">
        <p>
          You must be at least 18 years old and capable of forming a binding contract
          under the laws of your jurisdiction. If you use the Service on behalf of a
          business, you represent that you are authorized to bind that business.
        </p>
      </IPSection>

      <IPSection id="accounts" title="3. Accounts & Security">
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account. Notify us immediately of
          any unauthorized access. We reserve the right to suspend accounts for
          suspicious activity, terms violations, or non-payment.
        </p>
      </IPSection>

      <IPSection id="listings" title="4. Business Listings">
        <p>
          Businesses may submit listings for human review. We reserve the right to reject,
          edit, or remove any listing that is inaccurate, misleading, spam, duplicate,
          or in violation of our <a href="/content-guidelines">Content Guidelines</a>.
          Paid listings are subject to review before publication.
        </p>
      </IPSection>

      <IPSection id="content" title="5. User Content">
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
      </IPSection>

      <IPSection id="prohibited" title="6. Prohibited Conduct">
        <p>You agree not to:</p>
        <ul>
          <li>Submit false, misleading, or fraudulent information.</li>
          <li>Impersonate any person or entity.</li>
          <li>Post reviews you are paid to write (without clearly disclosing).</li>
          <li>Scrape, crawl, or copy the Site's content at scale without permission.</li>
          <li>Upload viruses, malware, or any code intended to harm the Service or users.</li>
          <li>Attempt to gain unauthorized access to accounts, systems, or data.</li>
          <li>Use the Service to send spam, phishing, or unsolicited commercial messages.</li>
          <li>Violate any applicable law or regulation.</li>
        </ul>
      </IPSection>

      <IPSection id="payments" title="7. Payments & Refunds">
        <p>
          Paid plans are processed via PayPal and other third-party processors. Prices
          and features are listed on the <a href="/business/plans">Plans page</a>.
          One-time plans (Starter, Lifetime) are non-refundable after 14 days. Yearly
          plans can be refunded within 14 days of initial purchase; renewals are
          non-refundable. Contact support within the window for refund requests.
        </p>
      </IPSection>

      <IPSection id="ip" title="8. Intellectual Property">
        <p>
          The Site, its branding, logos, design, and compiled database are owned by
          InfoWebWorld / Brain Stream Australia Pty Ltd and protected by applicable
          copyright, trademark, and database-rights laws. You may not copy, modify, or
          redistribute them without our written consent.
        </p>
      </IPSection>

      <IPSection id="termination" title="9. Termination">
        <p>
          We may suspend or terminate your access at any time, with or without notice,
          for any reason — including violation of these Terms. You may terminate your
          account at any time through your dashboard or by contacting us.
        </p>
      </IPSection>

      <IPSection id="disclaimers" title="10. Disclaimers">
        <p>
          The Service is provided <strong>"as is"</strong> without warranties of any
          kind, express or implied, including merchantability, fitness for a particular
          purpose, and non-infringement. We do not guarantee uninterrupted availability,
          accuracy of third-party listings, or specific search-ranking outcomes.
        </p>
      </IPSection>

      <IPSection id="liability" title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, InfoWebWorld shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages. Our
          total liability for any claim arising out of these Terms or your use of the
          Service shall not exceed the amount you paid us in the 12 months preceding
          the claim, or AUD $100 — whichever is greater.
        </p>
      </IPSection>

      <IPSection id="law" title="12. Governing Law">
        <p>
          These Terms are governed by the laws of <strong>New South Wales, Australia</strong>,
          without regard to conflict-of-laws principles. Any dispute shall be resolved
          in the competent courts of Sydney, NSW.
        </p>
      </IPSection>

      <IPSection id="changes" title="13. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Material changes will be
          announced on the Site or via email for registered users. Continued use after
          updates constitutes acceptance of the new Terms.
        </p>
      </IPSection>

      <IPSection id="contact" title="14. Contact">
        <p>
          Questions about these Terms? <a href="/contact">Contact us</a> or write to
          Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
