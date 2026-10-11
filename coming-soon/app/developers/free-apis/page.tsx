import type { Metadata } from 'next'
import { faPlug } from '@fortawesome/free-solid-svg-icons'
import '@/app/styles/developers/apis.css'
import { popularSdkApis, tryableNoKeyApis } from '@/lib/developers/apis'
import type { DevFaq } from '@/lib/developers/copy/faqs'
import { freeApisHubFaqs } from '@/lib/developers/copy/faqs'
import { countLabel, formatDate, formatNumber } from '@/lib/developers/format'
import { apisDatasetNode, devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { apiCategoryPath, apiCollectionPath, freeApisPath, methodologyPath, sdkPath } from '@/lib/developers/paths'
import { devPageMetadata, freeApisHubSeo } from '@/lib/developers/seo'
import { getApis } from '@/lib/developers/store'
import { API_TAB_BUCKETS } from '@/lib/developers/taxonomy'
import ApiCard from '../_components/apis/ApiCard'
import DvCategoryGrid from '../_components/apis/DvCategoryGrid'
import DvBand from '../_components/shell/DvBand'
import DvFaq from '../_components/shell/DvFaq'
import DvHero from '../_components/shell/DvHero'
import DvJsonLd from '../_components/shell/DvJsonLd'
import DvSourceNote from '../_components/shell/DvSourceNote'
import DvStatStrip from '../_components/shell/DvStatStrip'

/* ═══════════════════════════════════════════════════════════════════════
   Free APIs hub - /developers/free-apis (spec 3.13).
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400

const PATH = freeApisPath()

/* Pages the surrounding section has not built yet (collections, SDK
   index, methodology, search): any FAQ link pointing at one of them is
   dropped so this demo never ships a link to a 404. */
const UNBUILT_PREFIXES = [methodologyPath(), apiCollectionPath('no-auth'), apiCollectionPath('cors-enabled'), apiCollectionPath('ai-llm'), sdkPath()]
function keepBuiltLinks(faqs: readonly DevFaq[]): DevFaq[] {
  return faqs.map(f => ({ ...f, links: f.links?.filter(l => !UNBUILT_PREFIXES.some(p => l.href === p || l.href.startsWith(`${p}/`))) }))
}

export async function generateMetadata(): Promise<Metadata> {
  const store = await getApis()
  const seo = freeApisHubSeo({
    apis: store.totals.apis,
    categories: store.totals.categories,
    checkedAt: store.meta.linksCheckedAt,
    generatedAt: store.meta.generatedAt,
  })
  return devPageMetadata(PATH, seo, true)
}

export default async function FreeApisHubPage() {
  const store = await getApis()
  const t = store.totals
  const seo = freeApisHubSeo({ apis: t.apis, categories: t.categories, checkedAt: store.meta.linksCheckedAt, generatedAt: store.meta.generatedAt })
  const categories = store.categories.map(c => store.categoryStats.get(c.slug)!)
  const noKeyApis = tryableNoKeyApis(store, 6)
  const popular = popularSdkApis(store, API_TAB_BUCKETS[0], 6)
  const faqs = keepBuiltLinks(freeApisHubFaqs())

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={devCrumbs.freeApis()}
        dateModified={store.dataAt}
        nodes={[
          listNode(PATH, 'Free API categories', categories.map(c => ({ name: c.name, url: apiCategoryPath(c.slug) }))),
          apisDatasetNode(store.dataAt),
          faqGraphNode(PATH, faqs),
        ]}
      />

      <DvHero
        variant="hub"
        align="center"
        crumbs={devCrumbs.freeApis()}
        kicker="Free APIs & SDKs"
        kickerIcon={faPlug}
        title={seo.h1}
        lead={`Browse ${formatNumber(t.apis)} free and public APIs in ${countLabel(t.categories, 'category', 'categories')}. Each one shows its auth type, HTTPS and CORS support and when we last checked the link. ${countLabel(t.indexableEnriched, 'popular API', 'popular APIs')} also list their free-tier limits, a sample request and official SDKs, verified from the provider and the package registries.`}
      >
        <DvStatStrip
          items={[
            { label: 'APIs', value: t.apis },
            { label: 'Categories', value: t.categories },
            { label: 'Need no key', value: t.noAuth },
            { label: 'CORS enabled', value: t.cors },
            { label: 'Researched in depth', value: t.enriched },
            { label: 'Official SDKs', value: t.officialSdks },
          ]}
        />
      </DvHero>

      <DvBand
        tone="white"
        title="Browse free APIs by category"
        sub="Every category in the dataset, from animals to weather. Open one to filter by auth type, HTTPS and CORS."
      >
        <DvCategoryGrid items={categories} label="Free API categories" />
      </DvBand>

      <DvBand
        tone="wash"
        title="Free APIs you can call without a key"
        sub="No signup, no key, no OAuth. Open one of these and press Send in Try it to see a live response."
      >
        <div className="dv-grid dv-grid--3">
          {noKeyApis.map(api => <ApiCard key={api.id} api={api} />)}
        </div>
      </DvBand>

      <DvBand
        tone="navy"
        title="Popular free APIs with official SDKs"
        sub="Reviewed APIs with at least one SDK published by the provider itself, ranked by how many languages they cover."
      >
        <div className="dv-grid dv-grid--3">
          {popular.map(api => <ApiCard key={api.id} api={api} variant="onDark" />)}
        </div>
      </DvBand>

      <DvFaq heading="Free API FAQs" faqs={faqs} />

      <DvSourceNote mit>
        We link-check every API on this page and re-run the sample request of each reviewed API on a schedule, most
        recently on {formatDate(store.meta.linksCheckedAt)}. A reviewed API's free tier, limits and SDKs are
        verified against the provider's own docs and the package registries.
      </DvSourceNote>
    </>
  )
}
