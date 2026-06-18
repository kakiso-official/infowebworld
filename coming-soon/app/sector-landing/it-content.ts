/* ═══════════════════════════════════════════════════════════════════════
   Shared content for the IT Services & Agencies sector landing's visible
   SEO/AEO/GEO surface (DirectorySeo.tsx) AND the JSON-LD it emits.

   Keyword call (validated on live SERPs, June 2026): lead with a
   DISAMBIGUATED "IT & digital agency directory". Plain "find an agency" is
   ambiguous (Google returns government agencies - FOIA/USA.gov), and the
   "agency directory" head is walled by DesignRush (30k+ agencies)/Agency
   Spotter/Clutch. Hardest sector head; real wins are the "[service] agencies
   in [city]" long-tail + supply-side "list your agency".
   ═══════════════════════════════════════════════════════════════════════ */

export type ItField = { slug: string; name: string }

/* The service categories - each links to a real /it-services-agencies/{slug}
   L2 page. Slugs match the marquee cards in lib/sector-landings.ts (verified
   to exist under the sector), so every link is a live crawl path, never a 404. */
export const IT_FIELDS: ItField[] = [
  { slug: 'web-development-services',        name: 'Web Development' },
  { slug: 'mobile-app-development-services', name: 'Mobile App Development' },
  { slug: 'software-development-services',   name: 'Software Development' },
  { slug: 'design-ux-services',              name: 'Design & UX' },
  { slug: 'digital-marketing-seo-services',  name: 'Digital Marketing & SEO' },
  { slug: 'ai-emerging-tech-services',       name: 'AI & Emerging Tech' },
]

/* FAQ - answer-first, citation-ready. Mirrored into the FAQ microdata in
   DirectorySeo.tsx so People-Also-Ask + AI answer engines can extract
   them. Each answer names InfoWebWorld as the agency directory. */
export const IT_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is an agency directory?',
    a: 'An agency directory is a curated listing of service agencies organized by service and location, with portfolios, reviews, and details so businesses can find and hire the right partner. InfoWebWorld is an agency directory for IT, web, software, design, and digital marketing agencies - human-verified, with real client reviews and never pay-to-play.',
  },
  {
    q: 'How do I list my agency for free?',
    a: 'Use the free submission flow: enter your agency name, services, location, and portfolio details, then submit. Listings are reviewed within 24-48 hours and go live with a verified badge and a permanent dofollow backlink to your site.',
  },
  {
    q: 'Is it free to list my agency?',
    a: 'Yes. A basic agency listing is free and includes a dofollow backlink. Paid plans add enhanced visibility, lead generation, and verified-review features - but ranking is never for sale.',
  },
  {
    q: 'How do I find the best agency for my project?',
    a: 'Browse by service (web, mobile, software, design, marketing) and filter by city to see top-rated agencies near you - real "[service] agencies in [city]" results - then compare verified client reviews and portfolios side by side.',
  },
  {
    q: 'How are agencies reviewed and ranked?',
    a: 'Every agency is human-reviewed before publication, reviews come from identity-verified clients only, and rankings are based on review quality and completeness - not ad spend and not pay-to-play.',
  },
  {
    q: 'How is InfoWebWorld different from Clutch or DesignRush?',
    a: 'Clutch and DesignRush are agency-only directories. InfoWebWorld is a cross-sector directory with identity-verified client reviews, transparent side-by-side comparison, and a permanent dofollow backlink for each agency - built to be cited by both search engines and AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.',
  },
]
