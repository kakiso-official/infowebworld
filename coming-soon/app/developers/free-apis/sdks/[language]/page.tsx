import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { faCode, faCodeBranch, faCubes, faPlug } from '@fortawesome/free-solid-svg-icons'
import type { ApisStore, SdkLanguageStat } from '@/lib/developers/apis'
import { countLabel, formatDate, formatNumber, joinList } from '@/lib/developers/format'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { ossFacetPath, sdkPath } from '@/lib/developers/paths'
import { REGISTRY_LABELS } from '@/lib/developers/snippets'
import { devNotFoundMetadata, devPageMetadata, devUnavailableMetadata, sdkLanguageSeo } from '@/lib/developers/seo'
import { getApis, tryGetOss } from '@/lib/developers/store'
import { languageIcon } from '@/lib/developers/taxonomy'
import { sdkLanguageFaqs } from '@/lib/developers/copy/faqs'
import { canonicalSlug, resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../../_components/shell/DvPageHeader'
import DvStatStrip from '../../../_components/shell/DvStatStrip'
import DvDataLine from '../../../_components/shell/DvDataLine'
import DvBand from '../../../_components/shell/DvBand'
import DvFaq from '../../../_components/shell/DvFaq'
import DvSourceNote from '../../../_components/shell/DvSourceNote'
import DvJsonLd from '../../../_components/shell/DvJsonLd'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import DvFacetChips from '../../../_components/ui/DvFacetChips'
import DvLinkRows from '../../../_components/ui/DvLinkRows'
import SdkRowsTable from '../../../_components/apis/SdkRowsTable'
import SdkFilterBar from '../../../_components/apis/SdkFilterBar'

/* ═══════════════════════════════════════════════════════════════════════
   SDKs in one language - /developers/free-apis/sdks/{language} (3.17).

   Every package in the language across the reviewed APIs: official ones
   first in meaning ("Official only" starts on), community libraries
   marked as such. A language page exists with one SDK and is indexed
   from 5 official SDKs. A non-canonical slug ('Python') 308s.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { language: string }

interface SdkLanguagePage {
  store: ApisStore
  stat: SdkLanguageStat
}

function resolveLanguage(raw: string): Promise<Resolved<SdkLanguagePage>> {
  return resolveSafely<SdkLanguagePage>(async () => {
    const store = await getApis()
    const slug = canonicalSlug(raw)
    const stat = store.sdkLanguageStats.find(s => s.slug === slug)
    if (!stat) return { kind: 'not-found' }
    if (slug !== raw) return { kind: 'redirect', path: sdkPath(slug) }
    return { kind: 'ok', value: { store, stat } }
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { language } = await params
  const res = await resolveLanguage(language)
  if (res.kind === 'unavailable') {
    return devUnavailableMetadata(sdkPath(canonicalSlug(language)), sdkLanguageSeo({ name: canonicalSlug(language), official: 0, apis: 0, registries: [] }))
  }
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { stat } = res.value
  return devPageMetadata(sdkPath(stat.slug), sdkLanguageSeo(stat), stat.indexable)
}

const BODY_ID = 'dv-sdk-rows'

export default async function SdkLanguagePage({ params }: { params: Promise<Params> }) {
  const { language } = await params
  const res = await resolveLanguage(language)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="free API" />
  const { store, stat } = res.value

  const path = sdkPath(stat.slug)
  const seo = sdkLanguageSeo(stat)
  const crumbs = devCrumbs.sdks({ slug: stat.slug, name: stat.name })
  const rows = store.sdksByLanguage.get(stat.slug) ?? []
  const official = rows.filter(r => r.sdk.official)
  const community = rows.length - official.length
  const faqs = sdkLanguageFaqs(stat, rows)
  const registries = joinList(stat.registries.map(r => REGISTRY_LABELS[r]).filter(r => r !== 'Other'))

  const categoryCounts = new Map<string, { label: string; count: number }>()
  for (const r of rows) {
    const cur = categoryCounts.get(r.categorySlug)
    if (cur) cur.count++
    else categoryCounts.set(r.categorySlug, { label: r.categoryName, count: 1 })
  }
  const categories = [...categoryCounts.entries()]
    .map(([value, v]) => ({ value, label: v.label, count: v.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'en'))

  /* The one cross-section bridge (3.17): this language's open source page. */
  const oss = await tryGetOss()
  const facet = oss?.facetBySlug.language.get(stat.slug)
  const otherLanguages = store.sdkLanguageStats.filter(s => s.slug !== stat.slug)

  const lead = (official.length > 0
    ? `${countLabel(official.length, `official ${stat.name} package`)} for ${countLabel(stat.apis, 'free API')}, with install commands, latest versions and publish dates${registries ? ` from ${registries}` : ''}.`
    : `${stat.name} packages for free APIs, with install commands, latest versions and publish dates${registries ? ` from ${registries}` : ''}.`) +
    (community > 0 ? ` ${countLabel(community, 'community library', 'community libraries')} ${community === 1 ? 'is' : 'are'} listed too, marked Community.` : '')

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[
          listNode(path, seo.h1, official.map(r => ({
            name: r.sdk.package,
            item: {
              '@type': 'SoftwareSourceCode',
              name: r.sdk.package,
              programmingLanguage: r.sdk.language,
              ...(r.sdk.repoUrl ? { codeRepository: r.sdk.repoUrl } : {}),
              ...(r.sdk.version ? { version: r.sdk.version } : {}),
            },
          }))),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={languageIcon(stat.slug)}
        title={seo.h1}
        width="wide"
        lead={lead}
        dataLine={<DvDataLine source="links" date={store.meta.linksCheckedAt} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'Official SDKs', value: official.length, icon: faCubes },
              { label: 'APIs', value: stat.apis, icon: faPlug },
              { label: 'Community libraries', value: community, icon: faCode },
            ]}
          />
        )}
      />

      <DvBand tone="white" width="wide" id="dv-sdk-list" label={`${stat.name} SDK packages`} tight>
        <SdkFilterBar target={BODY_ID} categories={categories} officialToggle={community > 0} label={`Filter ${stat.name} packages`} />
        <SdkRowsTable rows={rows} bodyId={BODY_ID} caption={`${countLabel(rows.length, `${stat.name} package`)} for free APIs, most recently published first`} />
      </DvBand>

      {(facet?.indexable || otherLanguages.length > 0) && (
        <DvBand tone="wash" id="dv-sdk-more" title="Keep exploring" tight>
          {facet?.indexable && (
            <DvLinkRows
              items={[{
                href: ossFacetPath('language', facet.slug),
                label: `Open source ${facet.name} projects from companies`,
                sub: `${formatNumber(facet.repos)} repositories from ${countLabel(facet.companies, 'company', 'companies')}`,
                icon: faCodeBranch,
              }]}
            />
          )}
          {otherLanguages.length > 0 && (
            <DvFacetChips
              className="dv-sdk-otherlangs"
              label="SDKs in other languages"
              items={otherLanguages.map(s => ({ label: s.name, href: sdkPath(s.slug), count: s.official || s.sdks, icon: languageIcon(s.slug) }))}
              more={{ label: 'All SDK languages', href: sdkPath() }}
              scroll={false}
            />
          )}
        </DvBand>
      )}

      <DvFaq heading={`${stat.name} SDK FAQs`} faqs={faqs} />

      <DvSourceNote mit>
        Packages, versions and publish dates come from {registries || 'the package registries'}, looked up when the data
        was built; links checked {formatDate(store.meta.linksCheckedAt)}. &quot;Official&quot; means the API provider
        publishes the package.
      </DvSourceNote>
    </>
  )
}
