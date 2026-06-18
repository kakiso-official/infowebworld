/* ═══════════════════════════════════════════════════════════════════════
   Shared content for the Software & SaaS sector landing's visible SEO/AEO/GEO
   surface (DirectorySeo.tsx) AND the JSON-LD it emits - one module so
   on-page content and schema stay in lockstep.

   Keyword call (validated on live SERPs, June 2026): lead with "SaaS
   directory" - "business software directory" is ambiguous (Google reads it as
   "directory-building software": eDirectory/Brilliant Directories), whereas
   "SaaS directory" has clean intent + winnable competition. "business software
   directory" kept as a secondary phrase only.
   ═══════════════════════════════════════════════════════════════════════ */

export type SoftwareField = { slug: string; name: string }

/* The software categories - each links to a real /software-saas/{slug} L2
   page. Slugs match the marquee cards in lib/sector-landings.ts (verified to
   exist under the sector), so every link is a live crawl path, never a 404. */
export const SOFTWARE_FIELDS: SoftwareField[] = [
  { slug: 'crm-sales-software',                name: 'CRM & Sales Software' },
  { slug: 'marketing-software',                name: 'Marketing Software' },
  { slug: 'customer-service-support-software', name: 'Customer Support Software' },
  { slug: 'data-analytics-software',           name: 'Data & Analytics Software' },
  { slug: 'cybersecurity-software',            name: 'Cybersecurity Software' },
  { slug: 'project-management-software',       name: 'Project Management Software' },
]

/* FAQ - answer-first, citation-ready. Mirrored into the FAQ microdata in
   DirectorySeo.tsx so People-Also-Ask + AI answer engines can extract
   them. Each answer names InfoWebWorld as the SaaS directory. */
export const SOFTWARE_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is a SaaS directory?',
    a: 'A SaaS directory is an online catalog of software-as-a-service and business software products organized by category, with features, pricing, and reviews so buyers can discover and compare them. InfoWebWorld is a SaaS and business software directory covering CRM, marketing, analytics, security, project management and 900+ categories - human-verified, with real reviews and never pay-to-play.',
  },
  {
    q: 'How do I list or submit my software to InfoWebWorld?',
    a: 'Use the free submission flow to add your software or SaaS: enter your product details, pick a category, and submit. Listings are reviewed within 24-48 hours and go live with a verified badge and a permanent dofollow backlink to your site.',
  },
  {
    q: 'Is it free to list my software?',
    a: 'Yes. A basic software listing is free and includes a dofollow backlink. Paid plans add enhanced visibility, lead generation, and verified-review features - but ranking is never for sale.',
  },
  {
    q: 'How are software products reviewed and ranked?',
    a: 'Every product is human-reviewed before publication, reviews come from identity-verified users only, and rankings are based on review quality and completeness - not ad spend and not pay-to-play.',
  },
  {
    q: 'What software categories does InfoWebWorld cover?',
    a: 'InfoWebWorld covers 900+ software & SaaS categories including CRM and sales, marketing, customer support, data and analytics, cybersecurity, project management, HR, finance, and developer tools.',
  },
  {
    q: 'How is InfoWebWorld different from other software directories?',
    a: 'Most directories are thin or pay-to-play. InfoWebWorld is human-curated with identity-verified reviews, merit-based ranking, and permanent dofollow backlinks - built to be cited by both search engines and AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.',
  },
]
