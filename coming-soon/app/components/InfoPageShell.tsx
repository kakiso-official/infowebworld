import { headers } from 'next/headers'
import Navbar from './Navbar'
import Footer from './Footer'
import Link from 'next/link'

/**
 * Shared page shell for informational pages (About, Legal, Help, etc.).
 * Compact white/black Inter design matching /terms and /about.
 * Auto-injects BreadcrumbList + WebPage JSON-LD using the current pathname.
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
  children?: React.ReactNode
}

const BASE_URL = 'https://infowebworld.com'

export default async function InfoPageShell({
  kicker, title, subtitle, updated, cta, variant = 'default', about, children,
}: Props) {
  /* Derive the current path from request headers (set by Next.js / middleware).
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
  const ID_WEBSITE    = `${BASE_URL}/#website`
  const ID_ORG        = `${BASE_URL}/#organization`

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ...(kicker ? [{ '@type': 'ListItem', position: 2, name: kicker, item: pageUrl }] : []),
    { '@type': 'ListItem', position: kicker ? 3 : 2, name: title, item: pageUrl },
  ]

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': ID_BREADCRUMB,
        itemListElement: breadcrumbItems,
      },
      {
        '@type': 'WebPage',
        '@id': ID_WEBPAGE,
        url: pageUrl,
        name: `${title} — InfoWebWorld`,
        headline: title,
        description: subtitle,
        inLanguage: 'en-US',
        isPartOf: { '@id': ID_WEBSITE, '@type': 'WebSite', name: 'InfoWebWorld', url: BASE_URL },
        breadcrumb: { '@id': ID_BREADCRUMB },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/og-image.png`,
          width: 1200, height: 630,
        },
        publisher: {
          '@type': 'Organization',
          '@id': ID_ORG,
          name: 'InfoWebWorld',
          legalName: 'Brain Stream Australia Pty Ltd',
          url: BASE_URL,
          logo: `${BASE_URL}/logo/infowebworldlogo-logoforlightbackgrounds.png`,
        },
        about: (about ?? []).map(name => ({ '@type': 'Thing', name })),
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.ip-title', '.ip-sub', '.ip-h2'],
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className={`ip ip--${variant}`} id="top">
        <header className="ip-hero">
          <nav className="ip-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="ip-crumb-sep" aria-hidden="true">/</span>
            {kicker && (
              <>
                <span>{kicker}</span>
                <span className="ip-crumb-sep" aria-hidden="true">/</span>
              </>
            )}
            <span className="ip-crumb-current">{title}</span>
          </nav>
          {kicker && <span className="ip-kicker">{kicker}</span>}
          <h1 className="ip-title">{title}</h1>
          {subtitle && <p className="ip-sub">{subtitle}</p>}
          {updated && <span className="ip-updated">Last updated {updated}</span>}
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
