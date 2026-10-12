import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { faCode, faCubes, faLanguage, faPlug } from '@fortawesome/free-solid-svg-icons'
import type { ApisStore } from '@/lib/developers/apis'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { sdkPath } from '@/lib/developers/paths'
import { devNotFoundMetadata, devPageMetadata, devUnavailableMetadata, sdkIndexSeo } from '@/lib/developers/seo'
import { sdkIndexFaqs } from '@/lib/developers/copy/faqs'
import DvPageHeader from '../../_components/shell/DvPageHeader'
import DvStatStrip from '../../_components/shell/DvStatStrip'
import DvDataLine from '../../_components/shell/DvDataLine'
import DvBand from '../../_components/shell/DvBand'
import DvFaq from '../../_components/shell/DvFaq'
import DvSourceNote from '../../_components/shell/DvSourceNote'
import DvJsonLd from '../../_components/shell/DvJsonLd'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import SdkLanguageTiles from '../../_components/apis/SdkLanguageTiles'
import SdkRowsTable from '../../_components/apis/SdkRowsTable'
import { resolveApisStore } from '../../_components/apis/views/ApiCollectionView'

/* ═══════════════════════════════════════════════════════════════════════
   Official SDKs for free APIs - /developers/free-apis/sdks (spec 3.17).

   One tile per SDK language (each opens /sdks/{language}) and the 20 most
   recently published official SDK versions. Every package was looked up
   on its registry when the snapshot was built; versions and dates come
   from there.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400

const PATH = sdkPath()

function seoOf(store: ApisStore | null) {
  return sdkIndexSeo({ sdks: store?.totals.officialSdks ?? 0, apis: store?.totals.apisWithOfficialSdks ?? 0 })
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await resolveApisStore()
  if (res.kind === 'unavailable') return devUnavailableMetadata(PATH, seoOf(null))
  if (res.kind !== 'ok') return devNotFoundMetadata()
  return devPageMetadata(PATH, seoOf(res.value), true)
}

export default async function SdkIndexPage() {
  const res = await resolveApisStore()
  if (res.kind === 'unavailable') return <DvUnavailable data="free API" />
  if (res.kind !== 'ok') notFound()
  const store = res.value

  const seo = seoOf(store)
  const crumbs = devCrumbs.sdks()
  const faqs = sdkIndexFaqs()
  const t = store.totals
  const recent = store.sdkRows.filter(r => r.sdk.official && r.sdk.lastPublished).slice(0, 20)
  const community = t.sdks - t.officialSdks

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[
          listNode(PATH, 'Recently published official SDK versions', recent.map(r => ({
            name: r.sdk.package,
            item: {
              '@type': 'SoftwareSourceCode',
              name: r.sdk.package,
              programmingLanguage: r.sdk.language,
              ...(r.sdk.repoUrl ? { codeRepository: r.sdk.repoUrl } : {}),
              ...(r.sdk.version ? { version: r.sdk.version } : {}),
            },
          }))),
          faqGraphNode(PATH, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={faCubes}
        title={seo.h1}
        width="wide"
        lead={`An SDK wraps an API in your language, with auth and requests handled for you. Here are ${formatNumber(t.officialSdks)} official SDKs for ${formatNumber(t.apisWithOfficialSdks)} free APIs, checked against npm, PyPI and the other package registries.`}
        dataLine={<DvDataLine source="links" date={store.meta.linksCheckedAt} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'Official SDKs', value: t.officialSdks, icon: faCubes },
              { label: 'APIs with SDKs', value: t.apisWithOfficialSdks, icon: faPlug },
              { label: 'Languages', value: store.sdkLanguageStats.length, icon: faLanguage },
              { label: 'Community libraries', value: community, icon: faCode },
            ]}
          />
        )}
      />

      <DvBand tone="white" id="dv-sdk-languages" title="Official SDKs by language" sub="Open a language to see every package with its install command, latest version and publish date.">
        <SdkLanguageTiles stats={store.sdkLanguageStats} />
      </DvBand>

      {recent.length > 0 && (
        <DvBand tone="wash" width="wide" id="dv-sdk-recent" title="Recently published SDK versions" sub="The newest official releases, with the date the registry shows.">
          <SdkRowsTable rows={recent} showLanguage caption={`The ${formatNumber(recent.length)} most recently published official SDKs`} />
        </DvBand>
      )}

      <DvFaq heading="SDK FAQs" faqs={faqs} />

      <DvSourceNote mit>
        Packages, versions and publish dates come from the package registries themselves (npm, PyPI, Go, crates.io,
        RubyGems, Packagist, NuGet and pub.dev), looked up when the data was built; links checked {formatDate(store.meta.linksCheckedAt)}.
      </DvSourceNote>
    </>
  )
}
