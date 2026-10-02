/* ═══════════════════════════════════════════════════════════════════════
   Homepage FAQ — single source of truth for both the visible <HomeFaqSection>
   UI and the FAQPage JSON-LD embedded in the homepage's @graph. Keeping both
   derived from this one array means the on-page text and the structured
   data can never drift apart.

   Pure data module (no React, no 'use client') so it is safe to import from
   both the server component and from app/page.tsx when building the @graph.

   Copy is verbatim from the SEO specialist's brief - do not reword. The only
   deviation from the source document is the brand casing "InfoWebWorld" in
   question 5 (the source wrote "Infowebworld").
   ═══════════════════════════════════════════════════════════════════════ */

export type HomeFaq = {
  q: string
  a: string
  links?: { text: string; href: string }[]
}

export const HOME_FAQS: HomeFaq[] = [
  {
    q: 'What is InfoWebWorld?',
    a: 'InfoWebWorld is an online database of verified business listings, services, products, and real reviews from worldwide, organized by category and location.',
  },
  {
    q: 'Is InfoWebWorld a Free Business Directory?',
    a: 'Yes, InfoWebWorld offers a free listing. Featured listings and extra benefits are available on paid plans from $49 to $239. See the listing plans for details.',
    links: [{ text: 'listing plans', href: '/business/plans' }],
  },
  {
    q: 'How Do I Get a Global Business Listing on InfoWebWorld?',
    a: 'Open the Get Listed page, choose a plan, and fill in the listing form. Add your business details to complete your profile. Our team reviews every submission and emails you the result, approved or rejected.',
    links: [{ text: 'Get Listed', href: '/business' }],
  },
  {
    q: 'What Is the Difference Between the Free and Paid Plans?',
    a: 'The Free plan gives you a basic listing. Paid plans add a fuller profile with better visibility, verified reviews, and lead tools with analytics.',
  },
  {
    q: 'Do InfoWebWorld Listings Include Dofollow Backlinks?',
    a: 'Every paid listing includes a permanent dofollow backlink to your website. The Free plan includes a website link.',
  },
  {
    q: 'Can I List More Than One Business?',
    a: 'Yes. You can submit as many listings as you want from a single account, and you can edit any listing from your dashboard at any time.',
  },
  {
    q: 'Can I pay for a better ranking?',
    a: 'Not by the click or by the day. Yearly and Lifetime plans include premium placement as part of their features, but listings still rank on merit and reviews.',
  },
]

/* Builds a FAQPage node for a page's JSON-LD @graph from the same array
   the page renders. No @context (the caller embeds this inside an existing
   @graph array) and plain-text answers only (no HTML), matching how search
   engines expect FAQPage acceptedAnswer.text to read. */
export function buildFaqPageJsonLd(faqs: HomeFaq[], pageUrl: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/* The homepage's FAQPage node. */
export function buildHomeFaqJsonLd(siteUrl: string) {
  return buildFaqPageJsonLd(HOME_FAQS, siteUrl)
}
