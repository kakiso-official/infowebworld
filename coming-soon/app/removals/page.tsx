import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Request a Removal — InfoWebWorld',
  description: "How to request removal of a business listing, a review, or personal information from InfoWebWorld. We respond to legitimate requests within 72 business hours.",
  alternates: { canonical: 'https://infowebworld.com/removals' },
}

export default function RemovalsPage() {
  return (
    <InfoPageShell
      kicker="Trust"
      title="Request a Removal"
      subtitle="Whether you're a business owner, a reviewer, or a third party raising a legitimate concern — this page walks you through the right way to request content removal."
      cta={{
        label: 'Submit a Removal Request',
        href: '/contact',
        description: 'We respond to legitimate requests within 72 business hours.',
      }}
    >
      <IPSection title="What Can Be Removed">
        <ul>
          <li><strong>Your own business listing</strong> — full removal at the owner's request.</li>
          <li><strong>Reviews that violate our guidelines</strong> (fake, paid, off-topic, defamatory, impersonation). See <a href="/content-guidelines">Content Guidelines</a>.</li>
          <li><strong>Personal information</strong> wrongly included in a public listing (home address, personal phone, ID numbers).</li>
          <li><strong>Copyrighted content</strong> used without permission (logo, photos, descriptions copied from your site).</li>
          <li><strong>Trademark violations</strong> — impersonation of your brand or misleading use of your marks.</li>
          <li><strong>Content that breaks the law</strong> in AU or the listing's declared country.</li>
        </ul>
      </IPSection>

      <IPSection title="What We Don't Remove">
        <p>
          We do not remove content simply because it's negative or unflattering. Reviews
          that are honest first-hand criticism — even harsh — stay up. You can always
          respond publicly as the business owner; that's often more persuasive than a
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
    </InfoPageShell>
  )
}
