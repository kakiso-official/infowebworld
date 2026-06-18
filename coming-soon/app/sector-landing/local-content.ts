/* ═══════════════════════════════════════════════════════════════════════
   Shared content for the Local Businesses sector landing's visible SEO/AEO/GEO
   surface (DirectorySeo.tsx) AND the JSON-LD it emits - one module so
   on-page content and schema stay in lockstep.

   Keyword call (validated on live SERPs, June 2026): "local business
   directory" - clean intent, smaller directories rank (CityLocal Pro, SBDPro,
   ShowMeLocal), winnable on the long-tail. Deliberately steer AWAY from
   "[x] near me" (that's the Google Maps pack, unwinnable for an org site) and
   TOWARD "best [niche] in [city]" listicle intent.
   ═══════════════════════════════════════════════════════════════════════ */

export type LocalField = { slug: string; name: string }

/* The local categories - each links to a real /local-businesses/{slug} L2
   page. Slugs match the marquee cards in lib/sector-landings.ts (verified to
   exist under the sector), so every link is a live crawl path, never a 404. */
export const LOCAL_FIELDS: LocalField[] = [
  { slug: 'restaurants-food-drink',    name: 'Restaurants & Food' },
  { slug: 'home-services-contractors', name: 'Home Services & Contractors' },
  { slug: 'health-medical',            name: 'Health & Medical' },
  { slug: 'automotive',                name: 'Automotive' },
  { slug: 'beauty-personal-care',      name: 'Beauty & Personal Care' },
  { slug: 'shopping-retail',           name: 'Shopping & Retail' },
]

/* FAQ - answer-first, citation-ready. Mirrored into the FAQ microdata in
   DirectorySeo.tsx so People-Also-Ask + AI answer engines can extract
   them. Each answer names InfoWebWorld as the local business directory. */
export const LOCAL_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is a local business directory?',
    a: 'A local business directory is an online listing of local businesses organized by category and location, with profiles, contact details, and reviews so people can find and choose trusted businesses in their area. InfoWebWorld is a local business directory covering restaurants, home services, health, automotive, beauty, retail and more - human-verified, with real reviews and never pay-to-play.',
  },
  {
    q: 'How do I add or list my local business for free?',
    a: 'Use the free submission flow: enter your business name, category, location, and contact details, then submit. Listings are reviewed within 24-48 hours and go live with a verified badge and a permanent dofollow backlink to your website.',
  },
  {
    q: 'Is it free to list my local business?',
    a: 'Yes. A basic local business listing is free and includes a dofollow backlink. Paid plans add enhanced visibility, lead generation, and verified-review features - but ranking is never for sale.',
  },
  {
    q: 'How do I find the best businesses in my city?',
    a: 'Browse the directory by category and filter by location to see the best-rated businesses in your city, then compare them on verified reviews and details side by side - real listicle-style "best [category] in [city]" results, not just a map pin.',
  },
  {
    q: 'How are local businesses reviewed and ranked?',
    a: 'Every business is human-reviewed before publication, reviews come from identity-verified customers only, and rankings are based on review quality and completeness - not ad spend and not pay-to-play.',
  },
  {
    q: 'How is InfoWebWorld different from Yelp or Google Business Profile?',
    a: 'Yelp and Google Business Profile focus on the map pack and proximity. InfoWebWorld is a cross-category local business directory with identity-verified reviews, transparent side-by-side comparison, and a permanent dofollow backlink for each business - built to be found on both search engines and AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.',
  },
]
