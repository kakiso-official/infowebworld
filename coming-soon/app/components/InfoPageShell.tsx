import { headers } from 'next/headers'
import Navbar from './Navbar'
import Footer from './Footer'
import Link from 'next/link'
import {
  BASE_URL, ID_ORG, ID_WEBSITE, ID_LOGO,
  organizationNode, brandNode, websiteNode,
  breadcrumbNode, toISO,
} from './seo-schema'

/**
 * Shared page shell for informational pages (About, Legal, Help, etc.).
 * Compact white/black Inter design matching /terms and /about.
 * Emits a single JSON-LD @graph with Organization + WebSite + WebPage
 * + BreadcrumbList. Page-specific entities (FAQPage, Service, Article,
 * ItemList, HowTo, Person[]) merge in via the `extraGraph` prop.
 */

interface CTAProps {
  label: string
  href: string
  description?: string
}

interface Props {
  kicker?: string
  title: string
  subtitle?: string
  updated?: string
  cta?: CTAProps
  variant?: 'default' | 'legal' | 'coming-soon'
  /** Extra <Thing> entities for the WebPage's about[] field — boosts AEO entity binding */
  about?: string[]
  /** Additional entities the page mentions (sparser semantic signal vs about[]) */
  mentions?: string[]
  /** Multi-type WebPage — e.g. ['WebPage','FAQPage'] or ['WebPage','AboutPage']. */
  webPageType?: string | string[]
  /** Extra graph nodes (Service, Article, FAQPage, ItemList, etc.) merged into the same @graph. */
  extraGraph?: Array<Record<string, unknown>>
  /** Long-tail + short-tail keywords attached to WebPage.keywords. */
  schemaKeywords?: string[]
  /** Override the page's primary image (defaults to og-image.png). */
  primaryImage?: { url: string; width?: number; height?: number; caption?: string }
  children?: React.ReactNode
}

export default async function InfoPageShell({
  kicker, title, subtitle, updated, cta, variant = 'default',
  about, mentions, webPageType = 'WebPage', extraGraph,
  schemaKeywords, primaryImage, children,
}: Props) {
  /* Derive the current path from request headers (set by middleware).
     Falls back to '/' if unavailable so JSON-LD still renders. */
  const h = await headers()
  const pathname =
    h.get('x-invoke-path') ??
    h.get('x-pathname') ??
    h.get('next-url') ??
    '/'
  const pageUrl = `${BASE_URL}${pathname}`

  const ID_BREADCRUMB = `${pageUrl}#breadcrumb`
  const ID_WEBPAGE    = `${pageUrl}#webpage`
  const ID_PRIMARY    = `${pageUrl}#primaryimage`

  const dateModified = toISO(updated)

  const breadcrumbItems = [
    { name: 'Home', url: BASE_URL },
    ...(kicker ? [{ name: kicker, url: pageUrl }] : []),
    { name: title, url: pageUrl },
  ]

  const img = primaryImage ?? {
    url: `${BASE_URL}/og-image.png`,
    width: 1200,
    height: 630,
    caption: `${title} — InfoWebWorld`,
  }

  const webPageNode: Record<string, unknown> = {
    '@type': webPageType,
    '@id': ID_WEBPAGE,
    url: pageUrl,
    name: `${title} — InfoWebWorld`,
    headline: title,
    description: subtitle,
    inLanguage: 'en-US',
    isPartOf: { '@id': ID_WEBSITE },
    breadcrumb: { '@id': ID_BREADCRUMB },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': ID_PRIMARY,
      url: img.url,
      ...(img.width ? { width: img.width } : {}),
      ...(img.height ? { height: img.height } : {}),
      ...(img.caption ? { caption: img.caption } : {}),
    },
    publisher: { '@id': ID_ORG },
    about: (about ?? []).map(name => ({ '@type': 'Thing', name })),
    ...(mentions && mentions.length
      ? { mentions: mentions.map(name => ({ '@type': 'Thing', name })) }
      : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.ip-title', '.ip-sub', '.ip-h2'],
    },
    ...(dateModified ? { dateModified, datePublished: dateModified } : {}),
    ...(schemaKeywords && schemaKeywords.length
      ? { keywords: schemaKeywords.join(', ') }
      : {}),
    ...(cta
      ? {
          significantLink: cta.href.startsWith('http') ? cta.href : `${BASE_URL}${cta.href}`,
          potentialAction: {
            '@type': cta.href === '/contact' ? 'ContactAction' : 'ConsumeAction',
            name: cta.label,
            target: cta.href.startsWith('http') ? cta.href : `${BASE_URL}${cta.href}`,
          },
        }
      : {}),
  }

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      brandNode,
      websiteNode,
      breadcrumbNode(breadcrumbItems, ID_BREADCRUMB),
      webPageNode,
      ...(extraGraph ?? []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className={`ip ip--${variant}`} id="top" itemScope itemType="https://schema.org/WebPage">
        <meta itemProp="inLanguage" content="en-US" />
        <link itemProp="primaryImageOfPage" href={img.url} />
        <header className="ip-hero">
          <nav className="ip-crumb" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            <a href="/" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">Home</span>
              <meta itemProp="position" content="1" />
              <meta itemProp="item" content={BASE_URL} />
            </a>
            <span className="ip-crumb-sep" aria-hidden="true">/</span>
            {kicker && (
              <>
                <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span itemProp="name">{kicker}</span>
                  <meta itemProp="position" content="2" />
                  <meta itemProp="item" content={pageUrl} />
                </span>
                <span className="ip-crumb-sep" aria-hidden="true">/</span>
              </>
            )}
            <span className="ip-crumb-current" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">{title}</span>
              <meta itemProp="position" content={String(kicker ? 3 : 2)} />
              <meta itemProp="item" content={pageUrl} />
            </span>
          </nav>
          {kicker && <span className="ip-kicker">{kicker}</span>}
          <h1 className="ip-title" itemProp="headline">{title}</h1>
          {subtitle && <p className="ip-sub" itemProp="description">{subtitle}</p>}
          {updated && (
            <span className="ip-updated">
              Last updated <time dateTime={dateModified} itemProp="dateModified">{updated}</time>
            </span>
          )}
          {variant === 'coming-soon' && (
            <span className="ip-soon-badge">
              <span className="ip-soon-dot" aria-hidden="true" />
              Coming Soon
            </span>
          )}
        </header>

        {children && <div className="ip-body">{children}</div>}

        {cta && (
          <section className="ip-cta">
            <div className="ip-cta-card">
              {cta.description && <p className="ip-cta-desc">{cta.description}</p>}
              <Link href={cta.href} className="ip-cta-btn">
                {cta.label}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}

/* ── Reusable content building blocks for page bodies ── */

export function IPSection({ id, title, children }: { id?: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="ip-section" id={id}>
      {title && <h2 className="ip-h2">{title}</h2>}
      {children}
    </section>
  )
}

export function IPSub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ip-sub-section">
      <h3 className="ip-h3">{title}</h3>
      {children}
    </div>
  )
}

export function IPCardGrid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: React.ReactNode }) {
  return <div className={`ip-cards ip-cards--${cols}`}>{children}</div>
}

export function IPCard({ icon, title, children }: { icon?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="ip-card">
      {icon && <span className="ip-card-icon" aria-hidden="true">{icon}</span>}
      <h3 className="ip-card-title">{title}</h3>
      <div className="ip-card-body">{children}</div>
    </div>
  )
}

export function IPTOC({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <nav className="ip-toc" aria-label="Contents">
      <span className="ip-toc-label">On this page</span>
      <ol className="ip-toc-list">
        {items.map(item => (
          <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>
        ))}
      </ol>
    </nav>
  )
}
