import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Content Guidelines — InfoWebWorld',
  description: "What's allowed, what isn't, and what we expect from every business listing and user review on InfoWebWorld. Clear rules, applied consistently.",
  alternates: { canonical: 'https://infowebworld.com/content-guidelines' },
}

export default function ContentGuidelinesPage() {
  return (
    <InfoPageShell
      kicker="Trust"
      title="Content Guidelines"
      subtitle="We believe in a high-signal directory. These guidelines describe what we accept, what we reject, and how we keep InfoWebWorld useful for real buyers."
      updated="April 21, 2026"
      variant="legal"
    >
      <IPSection title="Our Principles">
        <ol>
          <li><strong>Accuracy first.</strong> Information must be truthful and verifiable.</li>
          <li><strong>Buyers over sellers.</strong> When in doubt, we side with the user reading the listing.</li>
          <li><strong>Quality over quantity.</strong> We reject spam, duplicates, and low-value listings.</li>
          <li><strong>Transparency.</strong> Paid placement is clearly labeled. Reviews are never paid.</li>
        </ol>
      </IPSection>

      <IPSection title="Business Listings — What We Accept">
        <ul>
          <li>Real, operating businesses with a verifiable website or registration.</li>
          <li>Accurate company name, description, category, and location.</li>
          <li>Clear product or service descriptions.</li>
          <li>High-quality logos and media (readable, appropriately sized, no watermarks).</li>
          <li>Honest pricing information when included.</li>
          <li>Legitimate contact methods (email, phone, or verified social).</li>
        </ul>
      </IPSection>

      <IPSection title="Business Listings — What We Reject">
        <ul>
          <li>Fake, parked, or never-launched businesses.</li>
          <li>Duplicate listings for the same entity.</li>
          <li>Misleading category placement (e.g., claiming to be AI when you're not).</li>
          <li>MLM schemes, adult services, gambling, counterfeit goods, or anything illegal in AU or the listing's declared country.</li>
          <li>Excessive keyword stuffing, hidden text, or SEO manipulation attempts.</li>
          <li>Copied descriptions from competitors or stock template text.</li>
          <li>Logos or media you don't have rights to use.</li>
        </ul>
      </IPSection>

      <IPSection title="Reviews — What We Accept">
        <ul>
          <li>Honest first-hand experiences from verified users.</li>
          <li>Constructive critique (positive or negative) with specific detail.</li>
          <li>Photos or screenshots supporting your experience.</li>
        </ul>
      </IPSection>

      <IPSection title="Reviews — What We Reject">
        <ul>
          <li>Paid or incentivized reviews that aren't clearly disclosed as sponsored.</li>
          <li>Reviews written by the business owner, their employees, or competitors.</li>
          <li>Reviews copied from other platforms.</li>
          <li>Personal attacks, harassment, threats, or defamation.</li>
          <li>Off-topic content unrelated to the business or product.</li>
          <li>Spam or promotional content disguised as reviews.</li>
        </ul>
      </IPSection>

      <IPSection title="Enforcement">
        <p>
          Our moderation team reviews every submission before it's published. We reserve
          the right to reject, edit, or remove content that violates these guidelines at
          any time, with or without notice. Repeat or severe violations may result in
          account suspension.
        </p>
        <p>
          We also use automated systems to flag suspicious patterns (sudden review spikes,
          duplicate text across profiles, etc.). Flagged items are reviewed manually —
          humans make the final call.
        </p>
      </IPSection>

      <IPSection title="Reporting & Appeals">
        <p>
          See something that breaks these rules? <a href="/contact">Report it to us</a>.
          We investigate every legitimate report and act within 72 business hours.
        </p>
        <p>
          If your listing or review was rejected and you believe it was in error, you can
          appeal via the contact form. Please include the listing slug or review ID and
          the reason you believe it complies with these guidelines.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
