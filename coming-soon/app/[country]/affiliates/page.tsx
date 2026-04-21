import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Affiliate Program — Earn with InfoWebWorld',
  description: 'Earn recurring commissions by referring businesses to InfoWebWorld. Transparent rates, monthly payouts, and lifetime revenue share on our Lifetime plan.',
  alternates: { canonical: 'https://infowebworld.com/affiliates' },
}

export default function AffiliatesPage() {
  return (
    <InfoPageShell
      kicker="Affiliates"
      title="Earn With InfoWebWorld"
      subtitle="Refer businesses to InfoWebWorld and earn recurring commissions. Transparent rates, monthly payouts, and real support — whether you run a newsletter, YouTube channel, or audience of entrepreneurs."
      cta={{
        label: 'Apply to the Affiliate Program',
        href: '/contact',
        description: 'Share your audience + channels. We review applications within 48 hours.',
      }}
    >
      <IPSection title="Commission Structure">
        <IPCardGrid cols={3}>
          <IPCard icon="💰" title="30% of first payment">
            Earn 30% commission on the first year of any Yearly plan, or on the full
            one-time Starter / Lifetime payment.
          </IPCard>
          <IPCard icon="🔁" title="15% recurring">
            Earn 15% recurring on every Yearly plan renewal — for as long as the
            customer stays subscribed.
          </IPCard>
          <IPCard icon="⏱️" title="90-day cookie">
            Your referrals count for 90 days after their first click. Longer than most
            programs in this space.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Who This Is For">
        <p>
          <strong>Newsletter writers, YouTubers, founders with audiences, SEO bloggers,
          small-business consultants, LinkedIn creators</strong> — anyone with an audience
          of business owners, marketers, or founders.
        </p>
        <p>
          We care about <em>quality, not just traffic</em>. Our best affiliates explain
          what InfoWebWorld actually does, who it's for, and who it isn't for. Honest
          reviews convert — and retain — far better than salesy content.
        </p>
      </IPSection>

      <IPSection title="What You Get">
        <ul>
          <li><strong>Personal dashboard</strong> with click, conversion, and payout data.</li>
          <li><strong>Creative assets</strong> — banners, email templates, demo videos.</li>
          <li><strong>Monthly payouts</strong> via PayPal, Wise, or bank transfer ($50 minimum).</li>
          <li><strong>Transparent ledger</strong> — every referral, every conversion, every commission visible.</li>
          <li><strong>Affiliate-only updates</strong> — new features, promo windows, and content briefs shared early.</li>
        </ul>
      </IPSection>

      <IPSection title="How to Apply">
        <p>
          Send us a quick note via the <a href="/contact">contact page</a> with
          <em>[AFFILIATE]</em> in the subject line. Include:
        </p>
        <ol>
          <li>The audience you'd promote to (newsletter subscribers, YouTube subs, etc.)</li>
          <li>Your typical content format (reviews, comparisons, tutorials, list articles)</li>
          <li>1–2 example pieces we can read to get a feel for your voice</li>
        </ol>
        <p>
          We approve most applicants within 48 hours. Serious partners get fast-tracked.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
