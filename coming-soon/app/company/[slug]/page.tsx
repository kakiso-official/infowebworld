import { permanentRedirect } from 'next/navigation'

/**
 * Legacy URL — every product listing now lives at /listing/<slug>.
 *
 * Background: until May 2026 product pages were canonically /company/<slug>
 * with /listing/<slug> as a soft redirect alias. The naming was confusing
 * because most "listings" on the directory are products (Claude, ChatGPT,
 * Midjourney…) made BY a company — they aren't companies themselves.
 *
 * We swapped:
 *   · /listing/<slug>  → renders the page (canonical)
 *   · /company/<slug>  → 301 to /listing/<slug>  (this file)
 *
 * Companies-as-entities (Anthropic, OpenAI, Stability AI…) keep their
 * own URL space at /profile/<slug>, untouched by this swap.
 *
 * `permanentRedirect` emits HTTP 308 so old backlinks consolidate cleanly
 * in Search Console / search engines.
 */
export default async function CompanySlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/listing/${slug}`)
}
