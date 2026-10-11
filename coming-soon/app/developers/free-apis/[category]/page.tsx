import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '@/app/styles/developers/apis.css'
import { apiCategoryIntro } from '@/lib/developers/copy/api-categories'
import type { DevFaq } from '@/lib/developers/copy/faqs'
import { apiCategoryFaqs } from '@/lib/developers/copy/faqs'
import { countLabel, formatNumber, joinList } from '@/lib/developers/format'
import { apiDetailExists } from '@/lib/developers/indexing'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { apiCategoryPath, apiCollectionPath, apiPath, methodologyPath, sdkPath } from '@/lib/developers/paths'
import { apiCategorySeo, devPageMetadata } from '@/lib/developers/seo'
import { getApis } from '@/lib/developers/store'
import { apiCategoryIcon } from '@/lib/developers/taxonomy'
import ApiCard from '../../_components/apis/ApiCard'
import ApiFilterBar from '../../_components/apis/ApiFilterBar'
import ApiTable from '../../_components/apis/ApiTable'
import DvBand from '../../_components/shell/DvBand'
import DvDataLine from '../../_components/shell/DvDataLine'
import DvFaq from '../../_components/shell/DvFaq'
import DvJsonLd from '../../_components/shell/DvJsonLd'
import DvPageHeader from '../../_components/shell/DvPageHeader'
import DvSourceNote from '../../_components/shell/DvSourceNote'
import DvStatStrip from '../../_components/shell/DvStatStrip'

/* ═══════════════════════════════════════════════════════════════════════
   API category - /developers/free-apis/{category} (spec 3.14): every
   published API of one category, filterable, with up to six reviewed
   top picks above the table.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

interface Params { category: string }

/* Pages the surrounding section has not built yet; see the hub page for
   why this strips them out of any generated FAQ link. */
const UNBUILT_PREFIXES = [methodologyPath(), apiCollectionPath('no-auth'), apiCollectionPath('cors-enabled'), apiCollectionPath('ai-llm'), sdkPath()]
function keepBuiltLinks(faqs: readonly DevFaq[]): DevFaq[] {
  return faqs.map(f => ({ ...f, links: f.links?.filter(l => !UNBUILT_PREFIXES.some(p => l.href === p || l.href.startsWith(`${p}/`))) }))
}

async function loadCategory(slug: string) {
  const store = await getApis()
  const stats = store.categoryStats.get(slug)
  if (!stats) return null
  const apis = store.apisByCategory.get(slug) ?? []
  return { store, stats, apis }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params
  const data = await loadCategory(category)
  if (!data) notFound()
  const seo = apiCategorySeo(data.stats, { checkedAt: data.store.meta.linksCheckedAt, generatedAt: data.store.meta.generatedAt })
  return devPageMetadata(apiCategoryPath(category), seo, data.stats.indexable)
}

export default async function ApiCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params
  const data = await loadCategory(category)
  if (!data) notFound()
  const { store, stats, apis } = data
  const path = apiCategoryPath(category)
  const seo = apiCategorySeo(stats, { checkedAt: store.meta.linksCheckedAt, generatedAt: store.meta.generatedAt })
  const crumbs = devCrumbs.category({ slug: category, name: stats.name })

  const topPicks = apis.filter(a => apiDetailExists(a)).slice(0, 6)
  const faqs = keepBuiltLinks(apiCategoryFaqs({ slug: category, name: stats.name }, apis))

  const countParts = [
    stats.noAuth > 0 && `${formatNumber(stats.noAuth)} need no key`,
    stats.cors > 0 && `${formatNumber(stats.cors)} support CORS for browser apps`,
    stats.withSdks > 0 && `${formatNumber(stats.withSdks)} have official SDKs`,
  ].filter((p): p is string => !!p)
  const countsSentence = `${countLabel(stats.apis, 'API')} ${stats.apis === 1 ? 'is' : 'are'} listed below`
    + (countParts.length ? `; ${joinList(countParts)}.` : '.')

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.meta.linksCheckedAt}
        nodes={[
          listNode(path, seo.h1, apis.map(a => ({
            name: a.name,
            url: apiDetailExists(a) ? apiPath(category, a.slug) : a.link,
          }))),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={apiCategoryIcon(category)}
        title={seo.h1}
        lead={(
          <>
            <p>{apiCategoryIntro(category)}</p>
            <p className="dv-counts-sentence">{countsSentence}</p>
          </>
        )}
        dataLine={<DvDataLine source="links" date={store.meta.linksCheckedAt} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'APIs', value: stats.apis },
              { label: 'No key', value: stats.noAuth },
              { label: 'CORS', value: stats.cors },
              { label: 'Reviewed', value: stats.enriched },
              { label: 'With SDKs', value: stats.withSdks },
            ]}
          />
        )}
      />

      <DvBand tone="white">
        <ApiFilterBar target="cat-api-rows" scopeLabel={`${stats.phrase.toLowerCase()} APIs`} />

        {topPicks.length > 0 && (
          <>
            <h2 className="dv-h2" style={{ marginTop: 32 }}>Top picks</h2>
            <div className="dv-grid dv-grid--3" style={{ marginTop: 16, marginBottom: 32 }}>
              {topPicks.map(api => <ApiCard key={api.id} api={api} />)}
            </div>
          </>
        )}

        <h2 className="dv-h2" style={{ marginTop: 32, marginBottom: 16 }}>All free {stats.phrase} APIs</h2>
        <ApiTable apis={apis} bodyId="cat-api-rows" caption={`All ${stats.name} APIs, reviewed APIs first`} />
      </DvBand>

      <DvFaq heading={`Free ${stats.phrase} API FAQs`} faqs={faqs} tone="wash" />

      <DvSourceNote mit>
        We link-check every API in this category and re-run the sample request of each reviewed one on a schedule.
        Reviewed APIs show the date their facts were last verified against the provider&apos;s own docs.
      </DvSourceNote>
    </>
  )
}
