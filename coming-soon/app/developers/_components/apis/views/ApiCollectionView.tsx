import type { Metadata } from 'next'
import { faCubes, faGlobe, faLayerGroup, faLockOpen, faPlay, faPlug, faRobot } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  collectionApis, collectionGroups, isApiTryable, officialSdks, type ApisStore,
} from '@/lib/developers/apis'
import { isCorsEnabledApi, isNoAuthApi } from '@/lib/developers/collections'
import { countLabel, formatDate, formatNumber } from '@/lib/developers/format'
import { apiDetailExists, isCollectionIndexable } from '@/lib/developers/indexing'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { apiCollectionPath, apiPath, sdkPath, type ApiCollectionSlug } from '@/lib/developers/paths'
import { apiCollectionSeo, devNotFoundMetadata, devPageMetadata, devUnavailableMetadata } from '@/lib/developers/seo'
import { getApis } from '@/lib/developers/store'
import { corsFaqs, noAuthFaqs } from '@/lib/developers/copy/faqs'
import type { FreeApi } from '@/lib/developers/types'
import { resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvStatStrip from '../../shell/DvStatStrip'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvFaq from '../../shell/DvFaq'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvFacetChips from '../../ui/DvFacetChips'
import DvLinkRows from '../../ui/DvLinkRows'
import ApiFilterBar from '../ApiFilterBar'
import ApiCompactList from '../ApiCompactList'

/* ═══════════════════════════════════════════════════════════════════════
   The big API collections (spec 3.16), grouped by category:
     /developers/free-apis/no-auth        no API key, OAuth or account
     /developers/free-apis/cors-enabled   callable from browser JavaScript

   A pill bar of category anchors on top (/no-auth#weather), the
   filterable compact list, links to the sibling collections, FAQ. The AI
   and LLM collection is a comparison table instead (ai-llm/page.tsx).
   ═══════════════════════════════════════════════════════════════════════ */

export type ListCollection = Exclude<ApiCollectionSlug, 'ai-llm'>

export function resolveApisStore(): Promise<Resolved<ApisStore>> {
  return resolveSafely<ApisStore>(async () => ({ kind: 'ok', value: await getApis() }))
}

function seoOf(slug: ApiCollectionSlug, store: ApisStore | null) {
  return apiCollectionSeo(slug, {
    count: store ? collectionApis(store, slug).length : 0,
    generatedAt: store?.meta.generatedAt ?? '',
    checkedAt: store?.meta.linksCheckedAt ?? '',
  })
}

export function collectionMetadata(slug: ApiCollectionSlug, res: Resolved<ApisStore>): Metadata {
  const path = apiCollectionPath(slug)
  if (res.kind === 'unavailable') return devUnavailableMetadata(path, seoOf(slug, null))
  if (res.kind !== 'ok') return devNotFoundMetadata()
  return devPageMetadata(path, seoOf(slug, res.value), isCollectionIndexable(slug, collectionApis(res.value, slug)))
}

interface CollectionCopy {
  icon: IconDefinition
  lead: (apis: readonly FreeApi[]) => string
  hide: { auth?: boolean; https?: boolean; cors?: boolean }
  omit: readonly ('nokey' | 'https' | 'cors' | 'sdk')[]
  scope: string
}

const COPY: Readonly<Record<ListCollection, CollectionCopy>> = {
  'no-auth': {
    icon: faLockOpen,
    lead: apis => {
      const cors = apis.filter(isCorsEnabledApi).length
      const live = apis.filter(a => apiDetailExists(a) && isApiTryable(a)).length
      return `These ${formatNumber(apis.length)} APIs answer requests without an API key, OAuth or an account, so you can test an idea in minutes.` +
        (cors > 0 ? ` ${formatNumber(cors)} of them also allow browser requests (CORS).` : '') +
        (live > 0 ? ` ${countLabel(live, 'reviewed API has', 'reviewed APIs have')} a live Try it on ${live === 1 ? 'its page' : 'their pages'}.` : '')
    },
    hide: { auth: true },
    omit: ['nokey'],
    scope: 'no-key APIs',
  },
  'cors-enabled': {
    icon: faGlobe,
    lead: apis => {
      const noKey = apis.filter(isNoAuthApi).length
      return `These ${formatNumber(apis.length)} APIs allow cross-origin requests over HTTPS, so JavaScript in a web page can call them directly, with no server in between.` +
        (noKey > 0 ? ` ${formatNumber(noKey)} of them also need no API key.` : '')
    },
    hide: { https: true, cors: true },
    omit: ['https', 'cors'],
    scope: 'CORS-enabled APIs',
  },
}

const SIBLINGS: ReadonlyArray<{ slug: ApiCollectionSlug | 'sdks'; label: string; icon: IconDefinition }> = [
  { slug: 'no-auth', label: 'Free APIs with no API key', icon: faLockOpen },
  { slug: 'cors-enabled', label: 'Free APIs you can call from the browser', icon: faGlobe },
  { slug: 'ai-llm', label: 'Free AI and LLM APIs, compared', icon: faRobot },
  { slug: 'sdks', label: 'Official SDKs by programming language', icon: faCubes },
]

const BODY_ID = 'dv-collection-rows'

export default function ApiCollectionView({ slug, store }: { slug: ListCollection; store: ApisStore }) {
  const apis = collectionApis(store, slug)
  const groups = collectionGroups(store, apis)
  const seo = seoOf(slug, store)
  const path = apiCollectionPath(slug)
  const crumbs = devCrumbs.collection(slug)
  const copy = COPY[slug]
  const faqs = slug === 'no-auth' ? noAuthFaqs() : corsFaqs()
  const reviewed = apis.filter(a => apiDetailExists(a))

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.meta.linksCheckedAt}
        nodes={[
          /* Reviewed APIs (our own pages) first, capped: an 800-entry ItemList
             adds weight, not meaning. */
          listNode(path, seo.h1, [...reviewed, ...apis.filter(a => !apiDetailExists(a))].slice(0, 100)
            .map(a => ({ name: a.name, url: apiDetailExists(a) ? apiPath(a.category.slug, a.slug) : a.link }))),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={copy.icon}
        title={seo.h1}
        width="wide"
        lead={copy.lead(apis)}
        dataLine={<DvDataLine source="links" date={store.meta.linksCheckedAt} />}
        below={(
          <>
            <DvStatStrip
              items={[
                { label: 'APIs', value: apis.length, icon: faPlug },
                { label: 'Categories', value: groups.length, icon: faLayerGroup },
                { label: 'Reviewed', value: reviewed.length },
                { label: 'With official SDKs', value: reviewed.filter(a => officialSdks(a).length > 0).length, icon: faCubes },
                { label: 'Try in browser', value: reviewed.filter(isApiTryable).length, icon: faPlay },
              ]}
            />
            <div>
              <p className="dv-label dv-chiprow-label">Jump to a category</p>
              <DvFacetChips
                label="Jump to a category"
                size="sm"
                items={groups.map(g => ({ label: g.category.name, href: `#${g.category.slug}`, count: g.apis.length }))}
              />
            </div>
          </>
        )}
      />

      <DvBand tone="white" width="wide" id="dv-collection-list" label={seo.h1} tight>
        <ApiFilterBar target={BODY_ID} scopeLabel={copy.scope} omit={copy.omit} />
        <ApiCompactList groups={groups} targetId={BODY_ID} hide={copy.hide} />
      </DvBand>

      <DvBand tone="wash" id="dv-collection-more" title="More ways to find a free API" tight>
        <DvLinkRows
          items={SIBLINGS.filter(s => s.slug !== slug).map(s => ({
            href: s.slug === 'sdks' ? sdkPath() : apiCollectionPath(s.slug),
            label: s.label,
            icon: s.icon,
          }))}
        />
      </DvBand>

      <DvFaq heading={slug === 'no-auth' ? 'No-key API FAQs' : 'CORS API FAQs'} faqs={faqs} />

      <DvSourceNote mit>
        Auth, HTTPS and CORS come from each API&apos;s listing. We link-check every API, most recently on{' '}
        {formatDate(store.meta.linksCheckedAt)}; reviewed APIs were also checked against the provider&apos;s own docs.
      </DvSourceNote>
    </>
  )
}
