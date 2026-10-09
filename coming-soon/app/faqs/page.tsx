import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../components/InfoPageShell'
import { faqNode, BASE_URL } from '../components/seo-schema'
import { renderLinkedText } from '../components/linked-text'
import { FAQ_GROUPS, FAQ_INTRO } from './faqs-data'

const URL = `${BASE_URL}/faqs`

const TITLE = 'InfoWebWorld FAQs: Business Listing, Plans & Reviews Help'
const DESCRIPTION =
  'Answers on business listings, plans and pricing, verified reviews, dofollow backlinks, agency and affiliate programs and your account.'

/* One FAQPage for the whole page, built from the same copy the accordions
   render. The WebPage node stays a plain WebPage: typing it FAQPage too
   would add a second FAQPage with no mainEntity. */
const faqJsonLd = faqNode(FAQ_GROUPS.flatMap(g => g.items), `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'InfoWebWorld FAQs',
    'business directory FAQ',
    'how to list my business',
    'business listing approval time',
    'business listing cost',
    'free business listing',
    'verified reviews',
    'dofollow backlinks',
    'agency partner program',
    'affiliate program',
    'remove a bad review',
    'delete my account',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld FAQs' }],
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

export default function FAQsPage() {
  return (
    <InfoPageShell
      kicker="Support"
      title="InfoWebWorld FAQs"
      subtitle={FAQ_INTRO}
      updated="October 9, 2026"
      webPageType="WebPage"
      about={['Business listings', 'Plans and pricing', 'Verified reviews', 'SEO and backlinks', 'AI search visibility', 'Agency Partner Program', 'Affiliate program', 'Account and privacy']}
      mentions={['PayPal', 'Google sign-in', 'Dofollow backlink', 'Nofollow link', 'ChatGPT', 'Perplexity', 'Brain Stream Australia']}
      schemaKeywords={['FAQ', 'business listing', 'plans', 'pricing', 'reviews', 'backlinks', 'AI visibility', 'agency', 'affiliate', 'account']}
      extraGraph={[faqJsonLd]}
      cta={{
        label: 'Ask us a question',
        href: '/contact',
        description: "Can't find your answer?",
      }}
    >
      <nav className="ip-topics" aria-labelledby="faq-topics-label">
        <p className="ip-topics-label" id="faq-topics-label">Browse FAQs by Topic</p>
        <ul className="ip-topics-list">
          {FAQ_GROUPS.map(group => (
            <li key={group.id}><a href={`#${group.id}`}>{group.title}</a></li>
          ))}
        </ul>
      </nav>

      {FAQ_GROUPS.map(group => (
        <IPSection key={group.id} id={group.id} title={group.title}>
          {group.items.map(item => (
            <details key={item.q} className="ip-faq">
              <summary><h3 className="ip-faq-q">{item.q}</h3></summary>
              <div className="ip-faq-body">
                <p>{renderLinkedText(item.a, item.links)}</p>
              </div>
            </details>
          ))}
        </IPSection>
      ))}
    </InfoPageShell>
  )
}
