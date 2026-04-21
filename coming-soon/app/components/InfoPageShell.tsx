import Navbar from './Navbar'
import Footer from './Footer'
import Link from './CountryLink'

/**
 * Shared page shell for informational pages (About, Legal, Help, etc.).
 * Navbar + hero + content + optional CTA + Footer, consistent dark-on-cream
 * visual language matching the rest of the site.
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
  children?: React.ReactNode
}

export default function InfoPageShell({
  kicker, title, subtitle, updated, cta, variant = 'default', children,
}: Props) {
  return (
    <>
      <Navbar />
      <main className={`ip ip--${variant}`}>
        <section className="ip-hero">
          <div className="ip-hero-inner">
            {kicker && <span className="ip-kicker">{kicker}</span>}
            <h1 className="ip-title">{title}</h1>
            {subtitle && <p className="ip-sub">{subtitle}</p>}
            {updated && <span className="ip-updated">Last updated: {updated}</span>}
            {variant === 'coming-soon' && (
              <span className="ip-soon-badge">
                <span className="ip-soon-dot" aria-hidden="true" />
                Coming Soon
              </span>
            )}
          </div>
        </section>

        {children && <section className="ip-body"><div className="ip-body-inner">{children}</div></section>}

        {cta && (
          <section className="ip-cta">
            <div className="ip-cta-card">
              {cta.description && <p className="ip-cta-desc">{cta.description}</p>}
              <Link href={cta.href} className="ip-cta-btn">
                {cta.label}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
