import Link from 'next/link'
import FooterNewsletter from './FooterNewsletter'

import { BASE } from '../config/base-path'
const bp = BASE

/* ── Footer link config — one source of truth for every column ── */
type LinkRow = { label: string; href: string }
type Column = { title: string; links: LinkRow[] }

const COLUMNS: Column[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us',            href: '/about' },
      { label: 'Contact',             href: '/contact' },
      { label: 'Media',               href: '/media' },
      { label: 'Investor Relations',  href: '/investors' },
      { label: 'Past Team',           href: '/team/past' },
      { label: 'Current Team',        href: '/team' },
    ],
  },
  {
    title: 'iWW Business',
    links: [
      { label: 'Why Get Listed',  href: '/business' },
      { label: 'Plans & Pricing', href: '/business/plans' },
      { label: 'Business Login',  href: '/dashboard' },
      { label: 'For Agencies',    href: '/agencies' },
      { label: 'Affiliates',      href: '/affiliates' },
      { label: 'Get in Touch',    href: '/contact' },
      { label: 'Insights',        href: '/insights' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Content Guidelines', href: '/content-guidelines' },
      { label: 'Terms of Use',       href: '/terms' },
      { label: 'Privacy Policy',     href: '/privacy' },
      { label: 'Cookies Policy',     href: '/cookies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help & Support',  href: '/help' },
      { label: 'FAQs',            href: '/faqs' },
      { label: 'Blogs',           href: '/blog' },
      { label: 'Glossary',        href: '/glossary' },
      { label: 'Removals',        href: '/removals' },
      { label: 'Category Guides', href: '/category-guides' },
      { label: 'Do Not Sell or Share My Personal Information', href: '/do-not-sell' },
    ],
  },
]

const TOP_CATEGORIES: LinkRow[] = [
  { label: 'AI & ML',                  href: '/ai-ml' },
  { label: 'Software & SaaS',          href: '/software-saas' },
  { label: 'IT Services & Agencies',   href: '/it-services-agencies' },
  { label: 'Startups & Innovation',    href: '/startups-innovation' },
  { label: 'Local Businesses',         href: '/local-businesses' },
  { label: 'Professional Services',    href: '/professional-services' },
]

const DISCOVER_LINKS: LinkRow[] = [
  { label: 'Write a Review', href: '/write-review' },
  { label: 'Compare',        href: '/compare' },
  { label: 'News',           href: '/news' },
]

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        {/* ── Newsletter strip — premium CTA at the top of the footer ── */}
        <div className="ft-newsletter">
          <div className="ft-nl-copy">
            <span className="ft-nl-eyebrow">Stay in the loop</span>
            <h3 className="ft-nl-title">Get the InfoWebWorld brief</h3>
            <p className="ft-nl-sub">
              Weekly category reports, new features, and early access — straight to your inbox. No spam, ever.
            </p>
          </div>
          <div className="ft-nl-form-wrap">
            <FooterNewsletter />
            <span className="ft-nl-legal">
              By subscribing you agree to our <Link href="/privacy" className="ft-col-link ft-copy-link">Privacy Policy</Link>.
            </span>
          </div>
        </div>

        {/* ── Top: Brand + Nav columns ── */}
        <div className="ft-top">
          {/* Left — brand (unchanged) */}
          <div className="ft-brand">
            <img src={`${bp}/logo/infowebworld-logofordarkbackgrounds.png`} alt="InfoWebWorld" className="ft-logo" />
            <p className="ft-tagline">
              InfoWebWorld is the Global Growth Platform to explore / search best trusted businesses worldwide.
            </p>
            <div className="ft-social">
              <a href="https://x.com/infowebworld_x" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://www.instagram.com/infowebworld" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
            <a href="https://www.producthunt.com/products/infowebworld?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-infowebworld" target="_blank" rel="noopener noreferrer" className="ft-ph">
              <img alt="InfoWebWorld on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1109100&theme=light&t=1774614445568" className="ft-ph-img" />
            </a>
          </div>

          {/* Right — 5-column grid */}
          <div className="ft-columns">
            {COLUMNS.map(col => (
              <div key={col.title} className="ft-col">
                <h4 className="ft-col-title">{col.title}</h4>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} className="ft-col-link">{l.label}</Link>
                ))}
              </div>
            ))}

            {/* Top Categories — 6 sectors + Discover sub-group */}
            <div className="ft-col ft-col--cats">
              <h4 className="ft-col-title">Top Categories</h4>
              {TOP_CATEGORIES.map(l => (
                <Link key={l.label} href={l.href} className="ft-col-link">{l.label}</Link>
              ))}
              <div className="ft-col-divider" aria-hidden="true" />
              {DISCOVER_LINKS.map(l => (
                <Link key={l.label} href={l.href} className="ft-col-link">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <span className="ft-copy">© 2004 – 2026. Brain Stream Australia Pty Ltd — <Link href="/" className="ft-col-link ft-copy-link">InfoWebWorld.com</Link>. All rights reserved.</span>
          <div className="ft-bottom-right">
            <div className="ft-badges">
              <span className="ft-badge ft-badge--coral">Thousands of Categories</span>
              <span className="ft-badge ft-badge--azure">100+ Countries Visitors</span>
              <span className="ft-badge ft-badge--emerald">DA/DR 70*</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
