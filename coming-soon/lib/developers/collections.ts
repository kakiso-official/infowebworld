/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - the three free-API collections (3.16).

     /developers/free-apis/no-auth        auth === 'none'
     /developers/free-apis/cors-enabled   cors === 'yes' && https
     /developers/free-apis/ai-llm         enriched AND (category
                                          machine-learning OR an AI tag)

   One predicate per collection, shared by the collection pages, the hub
   quick-filter counts, the sitemap and search, so a count shown in a chip
   is always the number of rows on the page it links to.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import { AI_LLM_CATEGORY, AI_LLM_TAGS } from './taxonomy'
import { API_COLLECTIONS, type ApiCollectionSlug } from './paths'
import type { FreeApi } from './types'

/** No API key, OAuth or account needed. */
export function isNoAuthApi(api: Pick<FreeApi, 'auth'>): boolean {
  return api.auth === 'none'
}

/** Callable from browser JavaScript: the listing says CORS is allowed and
 *  the API is served over HTTPS (a page on https cannot call http). */
export function isCorsEnabledApi(api: Pick<FreeApi, 'cors' | 'https'>): boolean {
  return api.cors === 'yes' && api.https
}

/** Reviewed AI and LLM APIs: the machine-learning category, or any API
 *  whose verified tags include an AI tag. Only enriched APIs qualify, so
 *  every row in the comparison has its free tier and limits checked. */
export function isAiLlmApi(api: Pick<FreeApi, 'enriched' | 'details' | 'category'>): boolean {
  if (!api.enriched || !api.details) return false
  if (api.category.slug === AI_LLM_CATEGORY) return true
  return api.details.tags.some(tag => AI_LLM_TAGS.includes(tag.toLowerCase()))
}

export const COLLECTION_PREDICATES: Readonly<Record<ApiCollectionSlug, (api: FreeApi) => boolean>> = {
  'no-auth': isNoAuthApi,
  'cors-enabled': isCorsEnabledApi,
  'ai-llm': isAiLlmApi,
}

/** True when the API belongs in the collection. */
export function inCollection(slug: ApiCollectionSlug, api: FreeApi): boolean {
  return COLLECTION_PREDICATES[slug](api)
}

/** Narrow a URL segment to a collection slug. */
export function isApiCollectionSlug(value: string): value is ApiCollectionSlug {
  return (API_COLLECTIONS as readonly string[]).includes(value)
}
