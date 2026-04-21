import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Write a Review — InfoWebWorld',
  description: "Share your honest experience with a business — help the next buyer decide faster. Reviews on InfoWebWorld are verified, moderated, and never paid.",
  alternates: { canonical: 'https://infowebworld.com/write-review' },
}

export default function WriteReviewPage() {
  return (
    <InfoPageShell
      kicker="Reviews"
      title="Write a Review"
      subtitle="Help the next buyer decide faster. Share your honest first-hand experience with a product, service, or agency. Verified, moderated, never paid."
      variant="coming-soon"
      cta={{
        label: 'Browse Categories',
        href: '/categories',
        description: 'Find the business you want to review and click the Write a Review button on its profile.',
      }}
    >
      <IPSection title="How Reviews Work">
        <IPCardGrid cols={3}>
          <IPCard icon="📝" title="Honest first-hand experience">
            Tell us what actually happened. Specific details help future buyers — vague
            praise or rage doesn't.
          </IPCard>
          <IPCard icon="⭐" title="Star ratings across dimensions">
            Rate what matters: value, support, product quality, ease of use. Weighted
            overall score appears on the listing.
          </IPCard>
          <IPCard icon="🛡️" title="Verified + moderated">
            We verify reviewer identity and moderate every submission. Fake or paid
            reviews are rejected. Honest critique stays.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Review Guidelines">
        <ul>
          <li><strong>Be specific.</strong> "Great product!" doesn't help anyone. What did you buy, when, what worked, what didn't?</li>
          <li><strong>Be honest.</strong> Negative reviews are welcome if they're fair. Personal attacks or defamation are not.</li>
          <li><strong>Be yourself.</strong> No reviews by the business owner, employees, competitors, or paid reviewers.</li>
          <li><strong>Disclose conflicts.</strong> If the company gave you free product or paid you, say so clearly.</li>
        </ul>
        <p>See the full <a href="/content-guidelines">Content Guidelines</a> for details.</p>
      </IPSection>

      <IPSection title="Find a Business to Review">
        <p>
          The dedicated review-writing flow is under construction. For now, find the
          business you want to review via <a href="/categories">category browse</a>
          or the search bar at the top of the site — once a listing's review feature
          goes live, you'll see a <em>Write a Review</em> button on its profile.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
