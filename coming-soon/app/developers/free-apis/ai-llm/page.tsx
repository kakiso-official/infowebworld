import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { faBuilding, faCreditCard, faCubes, faPlug, faRobot } from '@fortawesome/free-solid-svg-icons'
import { collectionApis, officialSdks, type ApisStore } from '@/lib/developers/apis'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { isCollectionIndexable } from '@/lib/developers/indexing'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { apiCategoryPath, apiCollectionPath, apiPath } from '@/lib/developers/paths'
import { apiBaseName, apiCollectionSeo, devNotFoundMetadata, devPageMetadata, devUnavailableMetadata } from '@/lib/developers/seo'
import { AI_LLM_CATEGORY } from '@/lib/developers/taxonomy'
import { aiLlmFaqs } from '@/lib/developers/copy/faqs'
import { sectorLandingPath } from '@/lib/sector-paths'
import DvPageHeader from '../../_components/shell/DvPageHeader'
import DvStatStrip from '../../_components/shell/DvStatStrip'
import DvDataLine from '../../_components/shell/DvDataLine'
import DvBand from '../../_components/shell/DvBand'
import DvFaq from '../../_components/shell/DvFaq'
import DvSourceNote from '../../_components/shell/DvSourceNote'
import DvJsonLd from '../../_components/shell/DvJsonLd'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import DvLinkRows from '../../_components/ui/DvLinkRows'
import DvCompareTable from '../../_components/apis/DvCompareTable'
import { resolveApisStore } from '../../_components/apis/views/ApiCollectionView'

/* ═══════════════════════════════════════════════════════════════════════
   Free AI and LLM APIs, compared - /developers/free-apis/ai-llm (3.16).

   Reviewed APIs only (lib/developers/collections.ts isAiLlmApi): the
   machine-learning category or an AI model tag, and never an API whose
   provider documents no free tier. One comparison table of verified
   facts, each free tier linked to its source; no card needed first, then
   by name.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400

const PATH = apiCollectionPath('ai-llm')

function seoOf(store: ApisStore | null) {
  return apiCollectionSeo('ai-llm', {
    count: store ? collectionApis(store, 'ai-llm').length : 0,
    generatedAt: store?.meta.generatedAt ?? '',
    checkedAt: store?.meta.linksCheckedAt ?? '',
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await resolveApisStore()
  if (res.kind === 'unavailable') return devUnavailableMetadata(PATH, seoOf(null))
  if (res.kind !== 'ok') return devNotFoundMetadata()
  return devPageMetadata(PATH, seoOf(res.value), isCollectionIndexable('ai-llm', collectionApis(res.value, 'ai-llm')))
}

export default async function AiLlmApisPage() {
  const res = await resolveApisStore()
  if (res.kind === 'unavailable') return <DvUnavailable data="free API" />
  if (res.kind !== 'ok') notFound()
  const store = res.value

  const apis = collectionApis(store, 'ai-llm')
  const seo = seoOf(store)
  const crumbs = devCrumbs.collection('ai-llm')
  const faqs = aiLlmFaqs()
  const noCard = apis.filter(a => a.details?.freeTier.requiresCard === false).length
  const withSdks = apis.filter(a => officialSdks(a).length > 0).length

  const links = [
    { href: sectorLandingPath('ai-ml'), label: 'Compare AI companies on InfoWebWorld', icon: faBuilding },
    { href: apiCategoryPath(AI_LLM_CATEGORY), label: 'Every free machine learning API', icon: faRobot },
    { href: apiCollectionPath('no-auth'), label: 'Free APIs with no API key', icon: faPlug },
  ]

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.meta.linksCheckedAt}
        nodes={[
          listNode(PATH, seo.h1, apis.map(a => ({ name: apiBaseName(a.name), url: apiPath(a.category.slug, a.slug) }))),
          faqGraphNode(PATH, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={faRobot}
        title={seo.h1}
        width="wide"
        lead={`${formatNumber(apis.length)} reviewed AI and LLM APIs with a free tier or free access, side by side: what the free tier includes, whether a card is needed, the rate limits and the official SDKs. Each free tier links to the provider page it came from. APIs that need no card come first, then the rest by name; we do not rank by opinion.`}
        dataLine={<DvDataLine source="links" date={store.meta.linksCheckedAt} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'AI and LLM APIs', value: apis.length, icon: faRobot },
              { label: 'No card needed', value: noCard, icon: faCreditCard },
              { label: 'With official SDKs', value: withSdks, icon: faCubes },
            ]}
          />
        )}
      />

      <DvBand tone="white" width="wide" id="dv-ai-compare" label="Free AI and LLM APIs compared" tight>
        <DvCompareTable apis={apis} caption={`${formatNumber(apis.length)} free AI and LLM APIs, no card needed first`} />
      </DvBand>

      <DvBand tone="wash" id="dv-ai-more" title="Keep exploring" tight>
        <DvLinkRows items={links} />
      </DvBand>

      <DvFaq heading="Free AI and LLM API FAQs" faqs={faqs} />

      <DvSourceNote mit>
        Free tiers, card rules, rate limits and SDKs were checked against each provider&apos;s own pages and the package
        registries; links last checked {formatDate(store.meta.linksCheckedAt)}. Free tiers change often, so open the
        source before you build on one.
      </DvSourceNote>
    </>
  )
}
