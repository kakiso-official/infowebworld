import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/glossary`

type Term = { term: string; def: string }
type Group = { letter: string; terms: Term[] }

const glossary: Group[] = [
  {
    letter: 'A',
    terms: [
      { term: 'AEO (Answer Engine Optimization)', def: 'The practice of structuring content so it surfaces well in AI answer engines like Perplexity, ChatGPT Search, and Google AI Overviews. Sibling discipline to SEO, increasingly important.' },
      { term: 'API Access', def: 'A programmatic interface for managing your listing — available on the Lifetime plan. Lets you automate updates, reviews, and analytics from your own systems.' },
    ],
  },
  {
    letter: 'B',
    terms: [
      { term: 'Backlink', def: 'A link from another website to yours. Search engines treat high-quality backlinks as endorsement signals. InfoWebWorld paid listings include a permanent dofollow backlink.' },
      { term: 'Badge', def: 'A visual marker on a listing indicating status (Verified, Top Rated, Early Adopter, etc.). Badges increase click-through and trust.' },
    ],
  },
  {
    letter: 'C',
    terms: [
      { term: 'Category', def: 'A classification of businesses by industry. InfoWebWorld has three levels: sector (L1, e.g. AI & ML), category (L2, e.g. AI Chatbots), subcategory (L3, e.g. Customer Support Chatbots).' },
      { term: 'Claim Listing', def: 'Take ownership of an existing business listing. Typically requires verifying your affiliation via domain email or DNS record.' },
      { term: 'CTR (Click-Through Rate)', def: 'The percentage of people who see your listing in search results or category pages and click it. A key engagement metric.' },
    ],
  },
  {
    letter: 'D',
    terms: [
      { term: 'DA / DR (Domain Authority / Rating)', def: 'Third-party metrics (Moz, Ahrefs) estimating the SEO strength of a website. Higher is better for outbound backlinks.' },
      { term: 'Dofollow', def: 'A link attribute that signals to search engines to follow and count the link for ranking. Dofollow backlinks from trusted sites are SEO gold.' },
    ],
  },
  {
    letter: 'G',
    terms: [
      { term: 'GEO (Generative Engine Optimization)', def: 'Optimizing content and business profiles to surface in generative AI responses (citations, summaries). See AEO.' },
    ],
  },
  {
    letter: 'L',
    terms: [
      { term: 'Lead', def: 'A potential customer who has shown interest — by submitting a contact form, requesting a demo, calling, or otherwise engaging with your listing.' },
      { term: 'Listing', def: "A business's public profile on InfoWebWorld — name, logo, description, category, reviews, media, and more." },
    ],
  },
  {
    letter: 'N',
    terms: [
      { term: 'NAP (Name, Address, Phone)', def: 'Core business identity data. Consistent NAP across the web is critical for local SEO. InfoWebWorld keeps NAP standardized in listings.' },
      { term: 'Nofollow', def: 'A link attribute that tells search engines not to pass ranking signal. Free InfoWebWorld listings use nofollow; paid listings are dofollow.' },
    ],
  },
  {
    letter: 'R',
    terms: [
      { term: 'RFQ (Request for Quote)', def: 'A buyer-initiated request for pricing and proposals. Paid InfoWebWorld listings include an RFQ button on their profile.' },
    ],
  },
  {
    letter: 'S',
    terms: [
      { term: 'Schema Markup', def: 'Structured data (JSON-LD) that helps search engines understand your content. InfoWebWorld adds rich schema to every listing automatically.' },
      { term: 'SEO (Search Engine Optimization)', def: 'The discipline of earning organic search traffic. InfoWebWorld gives you a dofollow backlink, rich snippets, and high-authority exposure.' },
      { term: 'Sector', def: 'The top-level category on InfoWebWorld — AI & ML, Software & SaaS, IT Services & Agencies, Startups & Innovation, Local Businesses, Professional Services.' },
    ],
  },
  {
    letter: 'V',
    terms: [
      { term: 'Verified Review', def: "A review from a user whose identity we've validated. Verified reviews carry a badge and count more toward ranking." },
    ],
  },
]

const allTerms = glossary.flatMap(g => g.terms)

const glossaryJsonLd = {
  '@type': 'DefinedTermSet',
  '@id': `${URL}#glossary`,
  name: 'InfoWebWorld glossary',
  description: 'Directory, SEO, AEO, GEO, and business-discovery terms explained in plain English.',
  inLanguage: 'en-US',
  hasDefinedTerm: allTerms.map(t => ({
    '@type': 'DefinedTerm',
    '@id': `${URL}#${t.term.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    name: t.term,
    description: t.def,
    inDefinedTermSet: { '@id': `${URL}#glossary` },
  })),
}

export const metadata: Metadata = {
  title: 'Glossary - SEO · AEO · GEO · Directory Terms Explained | InfoWebWorld',
  description:
    'Plain-English glossary of directory, SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and business-discovery terminology — backlinks, dofollow vs nofollow, schema markup, NAP, CTR, RFQ, and more.',
  keywords: [
    'SEO glossary',
    'AEO glossary',
    'GEO glossary',
    'directory terms glossary',
    'business discovery terminology',
    'dofollow vs nofollow explained',
    'what is schema markup',
    'what is NAP name address phone',
    'what is domain authority',
    'what is click through rate',
    'what is generative engine optimization',
    'what is answer engine optimization',
    'B2B directory glossary 2026',
    'verified review meaning',
    'backlink meaning SEO',
    'badge meaning directory listing',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Glossary - InfoWebWorld',
    description: 'SEO, AEO, GEO, and directory terms in plain English.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Glossary' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glossary - InfoWebWorld',
    description: 'SEO, AEO, GEO, and directory terms in plain English.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function GlossaryPage() {
  return (
    <InfoPageShell
      kicker="Reference"
      title="Glossary"
      subtitle="Directory, SEO, and business-discovery terms explained in plain English. Bookmark for future reference."
      webPageType={['WebPage', 'CollectionPage']}
      about={['SEO terminology', 'AEO terminology', 'GEO terminology', 'Business directory concepts', 'Dofollow backlinks', 'Schema markup']}
      mentions={['Perplexity', 'ChatGPT Search', 'Google AI Overviews', 'Moz', 'Ahrefs', 'JSON-LD']}
      schemaKeywords={['glossary', 'SEO', 'AEO', 'GEO', 'directory', 'backlink', 'dofollow']}
      extraGraph={[glossaryJsonLd]}
      cta={{
        label: 'Ask for a Term',
        href: '/contact',
        description: "Missing a definition? Email us and we'll add it.",
      }}
    >
      {glossary.map(group => (
        <IPSection key={group.letter} title={group.letter}>
          <dl className="ip-dl">
            {group.terms.map(t => (
              <div key={t.term} itemScope itemType="https://schema.org/DefinedTerm">
                <dt itemProp="name">{t.term}</dt>
                <dd itemProp="description">{t.def}</dd>
                <meta itemProp="inDefinedTermSet" content={`${URL}#glossary`} />
              </div>
            ))}
          </dl>
        </IPSection>
      ))}
    </InfoPageShell>
  )
}
