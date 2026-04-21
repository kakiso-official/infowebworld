import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Team Alumni — InfoWebWorld',
  description: 'The people who helped shape InfoWebWorld in its early chapters — our alumni, their projects, and what they built before moving on.',
  alternates: { canonical: 'https://infowebworld.com/team/past' },
}

export default function PastTeamPage() {
  return (
    <InfoPageShell
      kicker="Alumni"
      title="Team Alumni"
      subtitle="Great products are shaped by the people who pass through them. We recognize the builders who helped InfoWebWorld become what it is today."
      cta={{
        label: 'Back to Current Team',
        href: '/team',
      }}
    >
      <IPSection title="A Thank You">
        <p>
          Every early contributor — whether they wrote code, shaped the brand, refined a
          category taxonomy, or closed our first listings — leaves a fingerprint on
          InfoWebWorld. As team members move on to their next chapters, we recognize
          their work here.
        </p>
      </IPSection>

      <IPSection title="Alumni Wall">
        <p>
          This page will grow over time as our team does. For now, we're a young product
          with most of the founding team still building. Watch this space.
        </p>
        <blockquote>
          "Once an iWW teammate, always an iWW teammate. We're a small club — proud to
          be in it."
        </blockquote>
      </IPSection>

      <IPSection title="Stay Connected">
        <p>
          If you're a former contributor and would like your profile listed here, please
          <a href="/contact"> send us a note </a> with your role dates and a short bio —
          we'd love to include you.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
