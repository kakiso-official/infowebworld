import { notFound } from 'next/navigation'

/**
 * /company/<slug> is dead.
 *
 * Until May 2026 product listings rendered here. We moved them to
 * /listing/<slug> because the directory's listings are products (Claude,
 * ChatGPT, Midjourney…), not companies. The /company/ namespace was
 * misnamed and is now retired entirely — return 404 so it doesn't
 * confuse Search Console, crawlers, or internal links. None of these
 * pages were indexed, so nothing to consolidate.
 *
 * Companies-as-entities (Anthropic, OpenAI, Stability AI…) keep their
 * own URL space at /profile/<slug>, untouched.
 */
export default async function CompanySlugGone() {
  notFound()
}
