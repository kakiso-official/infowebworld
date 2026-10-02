import type { HomeFaq } from '../home-sections/home-faq-data'

/* ═══════════════════════════════════════════════════════════════════════
   AI tools directory FAQ — single source of truth for both the visible
   <HomeFaqSection faqs={AI_FAQS} /> accordion and the FAQPage node in the
   page's JSON-LD @graph (buildFaqPageJsonLd), so the two never drift.

   Copy is verbatim from the SEO specialist's brief (Oct 2026) - do not
   reword. The only deviation is the brand casing "InfoWebWorld" in
   questions 1 and 2 (the brief wrote "Infowebworld").
   ═══════════════════════════════════════════════════════════════════════ */

export const AI_FAQS: HomeFaq[] = [
  {
    q: 'What Is the InfoWebWorld AI Tools Directory?',
    a: 'InfoWebWorld is an SI & AI tool directory with a worldwide database of AI tools for specific categories, and each tool comes with its company profile, reviews, and country details.',
  },
  {
    q: 'What Types of AI and SI Tools Can I Find on InfoWebWorld?',
    a: 'Chatbots, AI agents, writing, image and video, coding, analytics, and SI platforms. Each listing shows pricing and location.',
  },
  {
    q: 'How Do I Choose the Best AI Tool on InfoWebWorld?',
    a: 'Pick a category, shortlist 2-3 tools, then compare features, pricing, and buyer reviews on InfoWebWorld.',
  },
  {
    q: 'How is InfoWebWorld Different from Other Online AI Directories?',
    a: 'InfoWebWorld lets you browse by country and see the company behind each tool. It also offers free listing and real buyer reviews.',
  },
  {
    q: 'Can I List My AI Tool on InfoWebWorld for Free?',
    a: 'Yes. You can list your AI tool on InfoWebWorld for free. Upgrade anytime ($49-$239) for featured placement and a verified badge. Compare features and start listing.',
    links: [{ text: 'start listing', href: '/business' }],
  },
  {
    q: 'Are InfoWebWorld Listings and Reviews Reliable?',
    a: "Yes. InfoWebWorld's team verifies every submission, and reviews come from real buyers. Explore the list of AI tools and share your own feedback if you have used any of them.",
    links: [{ text: 'share your own feedback', href: '/write-review' }],
  },
]
