import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Media & Press — InfoWebWorld',
  description: 'Press kit, brand assets, and media inquiries for InfoWebWorld — the global business discovery platform.',
  alternates: { canonical: 'https://infowebworld.com/media' },
}

export default function MediaPage() {
  return (
    <InfoPageShell
      kicker="Press"
      title="Media & Press"
      subtitle="Everything journalists, bloggers, and analysts need to write about InfoWebWorld — company facts, brand assets, and direct contact for media requests."
      cta={{
        label: 'Contact Our Press Team',
        href: '/contact',
        description: 'For interviews, quotes, embargoed briefings, or expert commentary.',
      }}
    >
      <IPSection title="Company Fact Sheet">
        <IPCardGrid cols={2}>
          <IPCard title="Legal entity">
            Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia.
          </IPCard>
          <IPCard title="Founded">
            InfoWebWorld product launched 2026. Parent company operating since 2004.
          </IPCard>
          <IPCard title="Headquarters">
            Parramatta, Sydney — remote-first team across Australia, India, and the EU.
          </IPCard>
          <IPCard title="Product">
            Global directory + discovery platform across 80+ industries, 12+ countries.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Brand Assets">
        <p>
          Our logo, color palette, and usage guidelines are available on request.
          Please <a href="/contact">reach out</a> and we'll send the full press kit,
          including high-res logos (SVG, PNG), social banners, and approved headshots.
        </p>
        <blockquote>
          Use of the InfoWebWorld name and marks must follow our trademark guidelines.
          When referencing us, we prefer <strong>InfoWebWorld</strong> (single word, camel case)
          over "Info Web World" or "IWW" in first mention.
        </blockquote>
      </IPSection>

      <IPSection title="In the News">
        <p>
          Coverage, partnerships, and announcements will be listed here as they roll out.
          Want to feature InfoWebWorld in your publication, podcast, or newsletter?
          We're happy to provide data points, trends commentary on business discovery /
          SEO / AI search, and executive interviews.
        </p>
      </IPSection>

      <IPSection title="Media Contact">
        <p>
          For press inquiries, interview requests, or embargoed announcements, email us
          through the <a href="/contact">contact page</a> with <em>[PRESS]</em> in the
          subject line. We respond to journalists within 24 hours on business days.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
