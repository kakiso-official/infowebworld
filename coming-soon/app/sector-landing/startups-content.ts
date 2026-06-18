/* ═══════════════════════════════════════════════════════════════════════
   Shared content for the Startups & Innovation sector landing's visible
   SEO/AEO/GEO surface (DirectorySeo.tsx) AND the JSON-LD it emits -
   one module so on-page content and schema stay in lockstep. Targets the
   head keyword "startup directory" (the most winnable sector head: the SERP
   is small tools + Indie Hackers, no DA-90 giants).
   ═══════════════════════════════════════════════════════════════════════ */

export type StartupField = { slug: string; name: string }

/* The startup sectors - each links to a real /startups-innovation/{slug} L2
   page. Slugs match the marquee cards in lib/sector-landings.ts (verified to
   exist under the sector), so every link is a live crawl path, never a 404. */
export const STARTUP_FIELDS: StartupField[] = [
  { slug: 'fintech-financial-services-startups',    name: 'FinTech Startups' },
  { slug: 'healthtech-medtech-startups',            name: 'HealthTech & MedTech' },
  { slug: 'edtech-learning-startups',               name: 'EdTech Startups' },
  { slug: 'climate-energy-sustainability-startups', name: 'ClimateTech & Energy' },
  { slug: 'ai-ml-generative-ai-startups',           name: 'AI & ML Startups' },
  { slug: 'web3-crypto-blockchain-startups',        name: 'Web3, Crypto & Blockchain' },
]

/* FAQ - answer-first, citation-ready. Mirrored into the FAQ microdata in
   DirectorySeo.tsx so People-Also-Ask + AI answer engines can extract
   them. Each answer names InfoWebWorld as the startup directory. */
export const STARTUP_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is a startup directory?',
    a: 'A startup directory is a curated catalog of startups organized by sector and stage, with company profiles, links, and reviews so founders, investors, buyers, and partners can discover and vet them. InfoWebWorld is a startup directory covering FinTech, HealthTech, EdTech, ClimateTech, AI, Web3 and more - human-verified, with real reviews and never pay-to-play.',
  },
  {
    q: 'How do I submit my startup to InfoWebWorld?',
    a: 'Use the free submission flow to add your startup: enter your company details, pick a sector, and submit. Listings are reviewed within 24-48 hours and go live with a verified badge and a permanent dofollow backlink to your site.',
  },
  {
    q: 'Is it free to list my startup?',
    a: 'Yes. A basic startup listing is free and includes a dofollow backlink. Paid plans add enhanced visibility, lead generation, and verified-review features - but ranking is never for sale.',
  },
  {
    q: 'How are startups verified and ranked?',
    a: 'Every startup is human-reviewed before publication, reviews come from identity-verified users only, and rankings are merit-based - never auto-approved thin listings and never pay-to-play.',
  },
  {
    q: 'What types of startups can list on InfoWebWorld?',
    a: 'Startups from pre-seed to growth stage across every emerging vertical - FinTech, HealthTech, EdTech, ClimateTech, AI & ML, Web3 & crypto, robotics, SaaS, and more.',
  },
  {
    q: 'How is InfoWebWorld different from other startup directories?',
    a: 'Most startup directories are thin, auto-approved lists. InfoWebWorld is human-curated with identity-verified reviews, merit-based ranking, and permanent dofollow backlinks - built to be cited by both search engines and AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.',
  },
]
