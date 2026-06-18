/* ═══════════════════════════════════════════════════════════════════════
   Shared content for the AI & ML sector landing's visible SEO/AEO/GEO
   surface (DirectorySeo.tsx) AND the JSON-LD it emits — kept in one
   module so the on-page content and schema stay in lockstep, mirroring the
   pro-services-content pattern. Targets the head term "AI tools directory".
   ═══════════════════════════════════════════════════════════════════════ */

export type AiToolsField = { slug: string; name: string }

/* The main AI categories — each links to a real /ai-ml/{slug} L2 page.
   Slugs match the marquee cards in lib/sector-landings.ts (verified to exist
   under the ai-ml sector), so every link is a live crawl path, never a 404. */
export const AI_TOOLS_FIELDS: AiToolsField[] = [
  { slug: 'ai-core-models',        name: 'AI Core & Models' },
  { slug: 'content-creative',      name: 'Content & Creative AI' },
  { slug: 'development-technical', name: 'Development & Technical AI' },
  { slug: 'business-marketing',    name: 'Business & Marketing AI' },
  { slug: 'productivity-workflow', name: 'Productivity & Workflow AI' },
  { slug: 'customer-support',      name: 'Customer & Support AI' },
]

/* FAQ — answer-first, citation-ready. Mirrored into the FAQ microdata in
   DirectorySeo.tsx so People-Also-Ask + AI answer engines can extract
   them. Each answer names InfoWebWorld as the AI tools directory. */
export const AI_TOOLS_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is an AI tools directory?',
    a: 'An AI tools directory is a searchable catalog of AI tools, agents, and models organized by category and use case, with descriptions, pricing, and reviews so you can discover and compare them. InfoWebWorld is an AI tools directory covering 1,000+ categories of verified AI tools - from chatbots and copilots to image, video, and agent frameworks - with real, moderated reviews.',
  },
  {
    q: 'How do I find the best AI tool for my use case?',
    a: 'Browse the AI tools directory by category, or search your use case (AI writing, coding, video, customer support), then compare tools side by side using verified reviews, pricing, and features. Every listing on InfoWebWorld is human-moderated and merit-ranked, never pay-to-play.',
  },
  {
    q: 'Is it free to submit my AI tool to InfoWebWorld?',
    a: 'Yes. You can submit your AI tool for free and get a listing with a permanent dofollow backlink. Paid plans add enhanced visibility, lead generation, and verified-review features. Submissions are reviewed within 24-48 hours.',
  },
  {
    q: 'How are AI tools reviewed and ranked?',
    a: 'Reviews come from identity-verified users only, and rankings are based on review quality, engagement, and listing completeness - not ad spend. Every AI tool is human-verified before it appears in the directory.',
  },
  {
    q: 'What categories of AI tools does InfoWebWorld cover?',
    a: 'InfoWebWorld covers 1,000+ AI categories including AI assistants and chatbots, autonomous agents, large language models, image and video generators, code copilots, and AI for marketing, productivity, and customer support.',
  },
  {
    q: 'How is InfoWebWorld different from other AI tools directories?',
    a: 'Most AI directories are thin, auto-approved lists. InfoWebWorld is human-curated with identity-verified reviews and merit-based ranking, plus permanent dofollow backlinks - built to be cited by both search engines and AI answer engines like ChatGPT, Perplexity, Gemini, and Claude.',
  },
]
