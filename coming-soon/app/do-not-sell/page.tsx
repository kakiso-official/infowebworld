import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Do Not Sell or Share My Personal Information — InfoWebWorld',
  description: "California residents: your CCPA and CPRA rights over your personal information on InfoWebWorld, including the right to opt out of sale or sharing.",
  alternates: { canonical: 'https://infowebworld.com/do-not-sell' },
}

export default function DoNotSellPage() {
  return (
    <InfoPageShell
      kicker="California Privacy"
      title="Do Not Sell or Share My Personal Information"
      subtitle="Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights over how businesses handle their personal information."
      updated="April 21, 2026"
      variant="legal"
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
          That said, California law defines "sell" and "share" broadly. This page
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
          To opt out of any potential "sale" or "sharing" of your personal information,
          or to exercise any other CCPA / CPRA right, please <a href="/contact">submit a
          request through our contact page</a> with <em>[CCPA-OPT-OUT]</em> in the
          subject line.
        </p>
        <p>Include in your request:</p>
        <ol>
          <li>Your full name and email address associated with your InfoWebWorld account (if any).</li>
          <li>A statement that you are a California resident.</li>
          <li>The specific right you're exercising (opt-out, delete, know, correct, limit use).</li>
        </ol>
        <p>
          We verify the identity of requesters to prevent fraud. We respond to all valid
          requests within <strong>45 days</strong>, as required by law.
        </p>
      </IPSection>

      <IPSection title="Authorized Agents">
        <p>
          You can designate an authorized agent to submit requests on your behalf. We
          will require written authorization (signed by you) and proof of the agent's
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
    </InfoPageShell>
  )
}
