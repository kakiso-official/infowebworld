import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/media`

const faqs = [
  {
    q: 'How do I contact the InfoWebWorld press team?',
    a: 'Email through the contact page with [PRESS] in the subject line. The press team responds to journalists within 24 hours on business days.',
  },
  {
    q: 'Is the InfoWebWorld press kit available to download?',
    a: 'Yes — high-res logos (SVG, PNG), social banners, approved headshots, and brand usage guidelines are available on request via the contact page.',
  },
  {
    q: 'How should InfoWebWorld be referenced in press coverage?',
    a: 'InfoWebWorld (single word, camel case) on first mention. Avoid "Info Web World" or "IWW" in first mention. The legal entity is Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia.',
  },
  {
    q: 'Can InfoWebWorld provide an executive interview or expert quote?',
    a: 'Yes. We provide data points, trends commentary on business discovery, SEO, and AI search, and executive interviews. Mention your publication, beat, and deadline in the press inquiry.',
  },
  {
    q: 'What topics can InfoWebWorld speak on as an expert source?',
    a: 'Business discovery, AI search and AEO, SEO and backlinks, verified reviews, directory economics, Australian SaaS, and the buyer-seller relationship across 80+ industries.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Media & Press — InfoWebWorld Press Kit, Brand Assets, Contact',
  description:
    'Press kit, brand assets, company fact sheet, and direct press contact for journalists, bloggers, and analysts writing about InfoWebWorld.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Press',
  wordCount: 500,
  about: ['Press kit', 'Brand assets', 'Media contact', 'Company fact sheet'],
  keywords: ['InfoWebWorld press kit', 'media contact', 'brand assets directory'],
})

const factSheet = itemListNode(
  [
    { name: 'Legal entity', description: 'Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia.' },
    { name: 'Founded', description: 'InfoWebWorld product launched 2026. Parent company operating since 2004.' },
    { name: 'Headquarters', description: 'Parramatta, Sydney — remote-first team across Australia, India, and the EU.' },
    { name: 'Product', description: 'Global business directory across 80+ industries, 12+ countries.' },
  ],
  `${URL}#factsheet`,
  'InfoWebWorld company fact sheet for media',
)

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Media & Press Kit - InfoWebWorld',
  description:
    'Press kit, brand assets, fact sheet, and direct press contact for InfoWebWorld - the global business directory from Brain Stream Australia. Logos, headshots, executive interviews, expert commentary on AI search and directory economics.',
  keywords: [
    'InfoWebWorld press kit',
    'business directory press contact',
    'media inquiries directory',
    'Australian SaaS press kit',
    'AI search expert source',
    'directory economics commentary',
    'business discovery expert quote',
    'SEO trends commentary',
    'AEO expert source',
    'startup press kit download',
    'brand assets download directory',
    'press inquiry response time',
    'Brain Stream Australia press',
    'Parramatta tech startup press',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Media & Press - InfoWebWorld',
    description: 'Press kit, brand assets, fact sheet, and direct press contact.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Press & Media' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Media & Press - InfoWebWorld',
    description: 'Press kit, brand assets, fact sheet, direct contact.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function MediaPage() {
  return (
    <InfoPageShell
      kicker="Press"
      title="Media & Press"
      subtitle="Everything journalists, bloggers, and analysts need to write about InfoWebWorld — company facts, brand assets, and direct contact for media requests."
      webPageType={['WebPage', 'AboutPage', 'FAQPage']}
      about={['Press kit', 'Brand assets', 'Media contact', 'Company fact sheet', 'Press inquiries']}
      mentions={['Brain Stream Australia Pty Ltd', 'Parramatta NSW', 'Trademark guidelines', 'Expert source']}
      schemaKeywords={['press kit', 'media contact', 'brand assets', 'fact sheet']}
      extraGraph={[articleJsonLd, factSheet, faqJsonLd]}
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
            Global business directory across 80+ industries, 12+ countries.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Brand Assets">
        <p>
          Our logo, color palette, and usage guidelines are available on request.
          Please <a href="/contact">reach out</a> and we&apos;ll send the full press kit,
          including high-res logos (SVG, PNG), social banners, and approved headshots.
        </p>
        <blockquote>
          Use of the InfoWebWorld name and marks must follow our trademark guidelines.
          When referencing us, we prefer <strong>InfoWebWorld</strong> (single word, camel case)
          over &quot;Info Web World&quot; or &quot;IWW&quot; in first mention.
        </blockquote>
      </IPSection>

      <IPSection title="In the News">
        <p>
          Coverage, partnerships, and announcements will be listed here as they roll out.
          Want to feature InfoWebWorld in your publication, podcast, or newsletter?
          We&apos;re happy to provide data points, trends commentary on business discovery /
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

      <IPSection title="Press FAQ">
        {faqs.map(({ q, a }) => (
          <details key={q} className="ip-faq">
            <summary>{q}</summary>
            <div className="ip-faq-body">{a}</div>
          </details>
        ))}
      </IPSection>
    </InfoPageShell>
  )
}
