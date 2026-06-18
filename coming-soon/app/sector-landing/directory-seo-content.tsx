import type { ReactNode } from 'react'
import { AI_TOOLS_FIELDS, AI_TOOLS_FAQ } from './ai-tools-content'
import { SOFTWARE_FIELDS, SOFTWARE_FAQ } from './software-content'
import { IT_FIELDS, IT_FAQ } from './it-content'
import { STARTUP_FIELDS, STARTUP_FAQ } from './startups-content'
import { LOCAL_FIELDS, LOCAL_FAQ } from './local-content'
import { PRO_SERVICES_VERTICALS, PRO_SERVICES_FAQ } from './pro-services-content'

/* ═══════════════════════════════════════════════════════════════════════
   Per-sector content for the shared DirectorySeo.tsx component.

   Each entry carries only what differs between the six sector landings —
   aria-label, accent, DefinedTerm, the TL;DR paragraph, the category-grid
   headings + icon, the how-to steps, and the FAQ heading. The field + FAQ
   *data* is imported from the same *-content modules the JSON-LD graph
   (buildSectorJsonLd) reads, so on-page content and schema never drift.

   These were lifted verbatim from the former {Sector}DirectorySeo.tsx
   clones — same wording, same markup — so the rendered output is unchanged.
   ═══════════════════════════════════════════════════════════════════════ */
export type DirectorySeoContent = {
  /** <section> aria-label. */
  ariaLabel: string
  /** --sec accent on the .va-cards grid (per-sector brand color). */
  accent: string
  /** DefinedTerm JSON-LD (name + description); inDefinedTermSet is built from
   *  the sector slug. null = emit no DefinedTerm (professional-services, whose
   *  schema lives in the @graph instead). */
  definedTerm: { name: string; description: string } | null
  /** TL;DR body — depends on firmCount, so a render fn. */
  tldr: (firmCount: number) => ReactNode
  gridHeading: ReactNode
  gridDesc: ReactNode
  navLabel: string
  /** Single <svg> reused for every field card. */
  icon: ReactNode
  fields: { slug: string; name: string }[]
  howToHeading: string
  /** The four <li> steps. */
  steps: ReactNode
  faqHeading: ReactNode
  faqDesc: ReactNode
  faq: { q: string; a: string }[]
}

export const DIRECTORY_SEO: Record<string, DirectorySeoContent> = {
  'ai-ml': {
    ariaLabel: 'About the InfoWebWorld AI tools directory',
    accent: '#7C6FF0', // lavender (AI & ML palette)
    definedTerm: {
      name: 'AI tools directory',
      description:
        'An AI tools directory is a searchable catalog of AI tools, agents, and models organized by category and use case, with reviews so users can discover and compare them. InfoWebWorld is an AI tools directory covering 1,000+ categories of verified AI tools.',
    },
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is an AI tools directory</strong> - a free, curated place to find
        and compare {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified AI tools,
        agents, and models across 1,000+ categories, from chatbots and copilots to image, video,
        and autonomous agents. Every tool is human-verified, every review is identity-checked, and
        rankings are merit-based, never pay-to-play. Building an AI tool?{' '}
        <a href="/business">Submit it free</a> for a dofollow listing.
      </>
    ),
    gridHeading: <>What you&rsquo;ll find in the AI tools directory</>,
    gridDesc: (
      <>
        Every AI category on InfoWebWorld, each with verified tools, real user reviews,
        and side-by-side comparison.
      </>
    ),
    navLabel: 'AI tool categories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-3 3 3 3 0 0 1-6 0 3 3 0 0 1-3-3 3 3 0 0 1 0-6 3 3 0 0 1 3-3 3 3 0 0 1 3-3z" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    ),
    fields: AI_TOOLS_FIELDS,
    howToHeading: 'How to use the AI tools directory',
    steps: (
      <>
        <li>
          <strong>Pick a category.</strong> Choose one of the AI categories above, or use the
          search bar to jump straight to a use case (AI writing, coding, video, support).
        </li>
        <li>
          <strong>Compare verified tools.</strong> Browse AI tools in that category with real user
          reviews, pricing, and features side by side.
        </li>
        <li>
          <strong>Filter to your fit.</strong> Narrow by use case, pricing, and rating until you
          have a shortlist that matches your workflow and budget.
        </li>
        <li>
          <strong>Try it or list yours.</strong> Visit a tool directly - free, no middleman - or{' '}
          <a href="/business">submit your own AI tool</a> for a verified listing and dofollow backlink.
        </li>
      </>
    ),
    faqHeading: 'AI tools directory - FAQ',
    faqDesc: (
      <>
        Everything people ask about finding and listing AI tools on InfoWebWorld.
      </>
    ),
    faq: AI_TOOLS_FAQ,
  },

  'software-saas': {
    ariaLabel: 'About the InfoWebWorld SaaS and business software directory',
    accent: '#2E90E5', // sky blue (Software & SaaS "Sky Interface" palette)
    definedTerm: {
      name: 'SaaS directory',
      description:
        'A SaaS directory is an online catalog of software-as-a-service and business software products organized by category, with features, pricing, and reviews so buyers can discover and compare them. InfoWebWorld is a SaaS and business software directory covering 900+ categories.',
    },
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is a SaaS and business software directory</strong> - a free, curated
        place to find, compare and list {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
        software across 900+ categories, from CRM and marketing to analytics, cybersecurity, and
        project management. Every product is human-verified, every review is identity-checked, and
        rankings are merit-based, never pay-to-play. Building software?{' '}
        <a href="/business">List it free</a> for a dofollow listing.
      </>
    ),
    gridHeading: <>What you&rsquo;ll find in the software directory</>,
    gridDesc: (
      <>
        Every software &amp; SaaS category on InfoWebWorld, each with verified products, real buyer
        reviews, and side-by-side comparison.
      </>
    ),
    navLabel: 'Software categories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    fields: SOFTWARE_FIELDS,
    howToHeading: 'How to use the software directory',
    steps: (
      <>
        <li>
          <strong>Pick a category.</strong> Choose one of the software categories above, or use the
          search bar to jump to a use case (CRM, marketing, analytics, security).
        </li>
        <li>
          <strong>Compare verified software.</strong> Browse products in that category with real
          buyer reviews, pricing, and features side by side.
        </li>
        <li>
          <strong>Filter to your fit.</strong> Narrow by use case, pricing, and rating until you
          have a shortlist that matches your team and budget.
        </li>
        <li>
          <strong>Try it or list yours.</strong> Visit a product directly - free, no middleman - or{' '}
          <a href="/business">list your own software</a> for a verified listing and dofollow backlink.
        </li>
      </>
    ),
    faqHeading: <>SaaS &amp; software directory - FAQ</>,
    faqDesc: (
      <>
        Everything buyers and software makers ask about finding and listing software on InfoWebWorld.
      </>
    ),
    faq: SOFTWARE_FAQ,
  },

  'it-services-agencies': {
    ariaLabel: 'About the InfoWebWorld IT and digital agency directory',
    accent: '#16B8A6', // mint/teal (IT "Mint Circuit" palette)
    definedTerm: {
      name: 'Agency directory',
      description:
        'An agency directory is a curated listing of service agencies organized by service and location, with portfolios, reviews, and details so businesses can find and hire the right partner. InfoWebWorld is an agency directory for IT, web, software, design, and digital marketing agencies.',
    },
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is an IT &amp; digital agency directory</strong> - a free, curated
        place to find, compare and hire {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
        agencies by service and city, from web, mobile, and software development to design, UX, and
        digital marketing. Every agency is human-verified, every review is identity-checked, and
        rankings are merit-based, never pay-to-play. Run an agency?{' '}
        <a href="/business">List it free</a> for a dofollow listing.
      </>
    ),
    gridHeading: <>What you&rsquo;ll find in the agency directory</>,
    gridDesc: (
      <>
        Every IT &amp; digital service on InfoWebWorld, each with verified agencies, real client
        reviews, and side-by-side comparison by city.
      </>
    ),
    navLabel: 'Agency service categories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    fields: IT_FIELDS,
    howToHeading: 'How to use the agency directory',
    steps: (
      <>
        <li>
          <strong>Pick a service.</strong> Choose one of the service categories above, or search a
          service plus your city (for example, &ldquo;web development companies in London&rdquo;).
        </li>
        <li>
          <strong>Compare verified agencies.</strong> Browse agencies in that service with real
          client reviews, portfolios, and details side by side.
        </li>
        <li>
          <strong>Filter by city &amp; rating.</strong> Narrow by location and top ratings until you
          have a shortlist that matches your project and budget.
        </li>
        <li>
          <strong>Contact or list yours.</strong> Reach an agency directly - free, no referral fee -
          or <a href="/business">list your own agency</a> for a verified listing and dofollow backlink.
        </li>
      </>
    ),
    faqHeading: 'Agency directory - FAQ',
    faqDesc: (
      <>
        Everything buyers and agency owners ask about finding and listing agencies on InfoWebWorld.
      </>
    ),
    faq: IT_FAQ,
  },

  'startups-innovation': {
    ariaLabel: 'About the InfoWebWorld startup directory',
    accent: '#F2693C', // peach/coral (Startups "Peach Ignite" palette)
    definedTerm: {
      name: 'Startup directory',
      description:
        'A startup directory is a curated catalog of startups organized by sector and stage, with profiles and reviews so founders, investors, buyers, and partners can discover and vet them. InfoWebWorld is a startup directory covering FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and more.',
    },
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is a startup directory</strong> - a free, curated place to discover
        and submit {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified startups across
        FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and beyond. Every startup is
        human-verified, every review is identity-checked, and rankings are merit-based, never
        pay-to-play. Building a startup? <a href="/business">Submit it free</a> for a dofollow listing.
      </>
    ),
    gridHeading: <>What you&rsquo;ll find in the startup directory</>,
    gridDesc: (
      <>
        Every startup sector on InfoWebWorld, each with verified startups, real reviews,
        and side-by-side comparison.
      </>
    ),
    navLabel: 'Startup sectors',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    fields: STARTUP_FIELDS,
    howToHeading: 'How to use the startup directory',
    steps: (
      <>
        <li>
          <strong>Pick a sector.</strong> Choose one of the startup sectors above, or use the
          search bar to jump to a specific category or stage.
        </li>
        <li>
          <strong>Compare verified startups.</strong> Browse startups in that sector with real
          reviews, links, and transparent details side by side.
        </li>
        <li>
          <strong>Filter to your fit.</strong> Narrow by sector, stage, and rating until you have
          a shortlist worth a closer look.
        </li>
        <li>
          <strong>Discover or list yours.</strong> Explore a startup directly - free, no middleman -
          or <a href="/business">submit your own startup</a> for a verified listing and dofollow backlink.
        </li>
      </>
    ),
    faqHeading: 'Startup directory - FAQ',
    faqDesc: (
      <>
        Everything founders, investors, and buyers ask about discovering and listing startups on InfoWebWorld.
      </>
    ),
    faq: STARTUP_FAQ,
  },

  'local-businesses': {
    ariaLabel: 'About the InfoWebWorld local business directory',
    accent: '#5E9E7B', // sage green (Local "Sage Community" palette)
    definedTerm: {
      name: 'Local business directory',
      description:
        'A local business directory is an online listing of local businesses organized by category and location, with profiles, contact details, and reviews so people can find trusted businesses in their area. InfoWebWorld is a local business directory covering restaurants, home services, health, automotive, beauty, retail and more.',
    },
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is a local business directory</strong> - a free, curated place to
        find, compare and review {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
        local businesses by category and city, from restaurants and home services to health,
        automotive, beauty, and retail. Every business is human-verified, every review is
        identity-checked, and rankings are merit-based, never pay-to-play. Own a local business?{' '}
        <a href="/business">List it free</a> for a dofollow listing.
      </>
    ),
    gridHeading: <>What you&rsquo;ll find in the local business directory</>,
    gridDesc: (
      <>
        Every local category on InfoWebWorld, each with verified businesses, real customer
        reviews, and side-by-side comparison by city.
      </>
    ),
    navLabel: 'Local business categories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    fields: LOCAL_FIELDS,
    howToHeading: 'How to use the local business directory',
    steps: (
      <>
        <li>
          <strong>Pick a category.</strong> Choose one of the local categories above, or search a
          service plus your city (for example, &ldquo;best plumbers in Austin&rdquo;).
        </li>
        <li>
          <strong>Compare verified businesses.</strong> Browse businesses in that category with
          real customer reviews, hours, and contact details side by side.
        </li>
        <li>
          <strong>Filter by city &amp; rating.</strong> Narrow to your city and top ratings until
          you have a shortlist of the best in your area.
        </li>
        <li>
          <strong>Contact or list yours.</strong> Reach a business directly - free, no referral fee -
          or <a href="/business">list your own local business</a> for a verified listing and dofollow backlink.
        </li>
      </>
    ),
    faqHeading: 'Local business directory - FAQ',
    faqDesc: (
      <>
        Everything customers and local business owners ask about finding and listing businesses on InfoWebWorld.
      </>
    ),
    faq: LOCAL_FAQ,
  },

  'professional-services': {
    ariaLabel: 'About the InfoWebWorld professional services directory',
    accent: '#2FAE6A',
    definedTerm: null,
    tldr: (firmCount) => (
      <>
        <strong>InfoWebWorld is a professional services directory</strong> - a free, curated
        place to find and compare {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
        professional service firms across 19 fields and 2,400+ specialties, from accounting and
        legal to consulting, financial advisory, HR, and marketing. Every firm is human-verified,
        every review is identity-checked, and rankings are merit-based, never pay-to-play.
      </>
    ),
    gridHeading: <>What you’ll find in the professional services directory</>,
    gridDesc: (
      <>
        Every professional service field on InfoWebWorld, each with verified firms,
        real client reviews, and side-by-side comparison.
      </>
    ),
    navLabel: 'Professional service fields',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
    fields: PRO_SERVICES_VERTICALS,
    howToHeading: 'How to use the directory',
    steps: (
      <>
        <li>
          <strong>Pick a field.</strong> Choose one of the 19 professional service fields above,
          or use the search bar to jump straight to a specialty.
        </li>
        <li>
          <strong>Compare verified firms.</strong> Browse firms in that field with verified
          credentials, real client reviews, and transparent details side by side.
        </li>
        <li>
          <strong>Filter to your fit.</strong> Narrow by location, specialty, and rating until
          you have a shortlist that matches your needs and budget.
        </li>
        <li>
          <strong>Contact directly.</strong> Reach your chosen firm through InfoWebWorld - free,
          with no middleman and no referral fee.
        </li>
      </>
    ),
    faqHeading: 'Professional services directory - FAQ',
    faqDesc: (
      <>
        Everything buyers ask about finding a professional services firm on InfoWebWorld.
      </>
    ),
    faq: PRO_SERVICES_FAQ,
  },
}
