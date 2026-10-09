import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { BASE_URL } from '../components/seo-schema'
import { renderLinkedText } from '../components/linked-text'
import { GLOSSARY, GLOSSARY_INTRO, termSlug } from './glossary-data'

const URL = `${BASE_URL}/glossary`

const TITLE = 'Business Directory Glossary: SEO, AEO, B2B & Startup Terms'
const DESCRIPTION =
  'Plain-English glossary of business directory, B2B, local business, SEO, AEO, startup, SaaS and listing terms. Learn the key terms before you list or search.'

const allTerms = GLOSSARY.flatMap(g => g.terms)

const glossaryJsonLd = {
  '@type': 'DefinedTermSet',
  '@id': `${URL}#glossary`,
  name: 'InfoWebWorld Business Directory Glossary',
  description: 'Business directory, B2B, local business, SEO, AEO, GEO, startup, SaaS and listing terms explained in plain English.',
  url: URL,
  inLanguage: 'en-US',
  hasDefinedTerm: allTerms.map(t => ({
    '@type': 'DefinedTerm',
    '@id': `${URL}#${termSlug(t.term)}`,
    name: t.term,
    description: t.def,
    url: `${URL}#${termSlug(t.term)}`,
    inDefinedTermSet: { '@id': `${URL}#glossary` },
  })),
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'business directory glossary',
    'business directory terms',
    'B2B glossary',
    'SEO glossary',
    'AEO glossary',
    'startup glossary',
    'SaaS glossary',
    'local business terms',
    'business listing terms',
    'dofollow vs nofollow',
    'what is a business citation',
    'what is NAP consistency',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Business Directory Glossary' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
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
      title="Business Directory Glossary: Plain-English Definitions"
      titleNode={<>Business Directory Glossary: <span className="ip-nowrap">Plain-English</span> Definitions</>}
      subtitle={GLOSSARY_INTRO}
      subtitleNode={renderLinkedText(GLOSSARY_INTRO, [{ text: 'ask us to add a term', href: '/contact' }])}
      updated="October 9, 2026"
      webPageType={['WebPage', 'CollectionPage']}
      about={['Business directory terms', 'B2B terminology', 'Local business terms', 'SEO terminology', 'AEO and GEO', 'Startup terminology', 'SaaS terminology', 'Business listings']}
      mentions={['Perplexity', 'ChatGPT', 'Google AI Overviews', 'Moz', 'Ahrefs', 'JSON-LD']}
      schemaKeywords={['glossary', 'business directory', 'B2B', 'local business', 'SEO', 'AEO', 'GEO', 'startup', 'SaaS', 'business listing']}
      extraGraph={[glossaryJsonLd]}
      cta={{
        label: 'Ask for a Term',
        href: '/contact',
        description: "Missing a definition? Email us and we'll add it.",
      }}
    >
      <nav className="ip-az" aria-label="Glossary A to Z">
        {GLOSSARY.map(g => (
          <a key={g.letter} href={`#letter-${g.letter.toLowerCase()}`}>{g.letter}</a>
        ))}
      </nav>

      {GLOSSARY.map(group => (
        <IPSection key={group.letter} id={`letter-${group.letter.toLowerCase()}`} title={group.letter}>
          <div className="ip-terms">
            {group.terms.map(t => (
              <div key={t.term} className="ip-term" id={termSlug(t.term)}>
                <h3 className="ip-term-name">{t.term}</h3>
                <p className="ip-term-def">{renderLinkedText(t.def, t.links)}</p>
              </div>
            ))}
          </div>
        </IPSection>
      ))}
    </InfoPageShell>
  )
}
