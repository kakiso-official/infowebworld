import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import '@/app/styles/developers/apis.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { apiAlternatives, apiAuthType, apiOssCompanySlug, communitySdks, isApiPageIndexable, officialSdks, type ApisStore } from '@/lib/developers/apis'
import { apiFaqs } from '@/lib/developers/copy/faqs'
import { countLabel, formatDate } from '@/lib/developers/format'
import { apiDetailExists } from '@/lib/developers/indexing'
import { devCrumbs, faqGraphNode, pageIds, webApiNode } from '@/lib/developers/jsonld'
import { apiCategoryPath, apiPath, ossCompanyPath, ossRepoPath, sdkPath } from '@/lib/developers/paths'
import { companyAvatar } from '@/lib/developers/oss'
import { apiBaseName, apiDetailSeo, devPageMetadata } from '@/lib/developers/seo'
import { buildSnippets, isTryable } from '@/lib/developers/snippets'
import { getApis, tryGetOss } from '@/lib/developers/store'
import { apiCategoryIcon, apiCategoryPhrase, languageIcon } from '@/lib/developers/taxonomy'
import type { FreeApi } from '@/lib/developers/types'
import ApiCard from '../../../_components/apis/ApiCard'
import ApiFactsCard from '../../../_components/apis/ApiFactsCard'
import FreeTierPanel from '../../../_components/apis/FreeTierPanel'
import ProviderCard from '../../../_components/apis/ProviderCard'
import SdkTable from '../../../_components/apis/SdkTable'
import SdkTabs from '../../../_components/apis/SdkTabs'
import TryItPanel from '../../../_components/apis/TryItPanel'
import DvBand from '../../../_components/shell/DvBand'
import DvFaq from '../../../_components/shell/DvFaq'
import DvJsonLd from '../../../_components/shell/DvJsonLd'
import DvNotice from '../../../_components/shell/DvNotice'
import DvPageHeader from '../../../_components/shell/DvPageHeader'
import DvSourceNote from '../../../_components/shell/DvSourceNote'
import { AuthBadge, CardBadge, CorsBadge, DvBadge, HttpsBadge, VerifiedBadge } from '../../../_components/ui/Badges'
import { SnippetTabs } from '../../../_components/ui/CodeBlock'
import DvTime from '../../../_components/ui/DvTime'
import DvFacetChips from '../../../_components/ui/DvFacetChips'
import ApiPromo, { type ApiPromoProps } from '../../../_components/ui/ApiPromo'

/* ═══════════════════════════════════════════════════════════════════════
   API detail - /developers/free-apis/{category}/{api} (spec 3.15).
   Only reviewed (enriched) APIs get a page here; an API that exists under
   a different category permanently redirects to its real path.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

interface Params { category: string; api: string }

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

type LoadResult =
  | { kind: 'ok'; store: ApisStore; api: FreeApi }
  | { kind: 'redirect'; to: string }
  | { kind: 'notfound' }

async function loadApi(categorySlug: string, apiSlug: string): Promise<LoadResult> {
  const store = await getApis()
  const api = store.apiBySlug.get(apiSlug)
  if (!api) return { kind: 'notfound' }
  if (api.category.slug !== categorySlug) return { kind: 'redirect', to: apiPath(api.category.slug, api.slug) }
  if (!apiDetailExists(api)) return { kind: 'notfound' }
  return { kind: 'ok', store, api }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, api: apiSlug } = await params
  const loaded = await loadApi(category, apiSlug)
  if (loaded.kind === 'redirect') permanentRedirect(loaded.to)
  if (loaded.kind === 'notfound') notFound()
  const { store, api } = loaded
  const seo = apiDetailSeo(api)
  return devPageMetadata(apiPath(category, api.slug), seo, isApiPageIndexable(store, api))
}

export default async function ApiDetailPage({ params }: { params: Promise<Params> }) {
  const { category, api: apiSlug } = await params
  const loaded = await loadApi(category, apiSlug)
  if (loaded.kind === 'redirect') permanentRedirect(loaded.to)
  if (loaded.kind === 'notfound') notFound()
  const { store, api } = loaded

  const d = api.details!
  const path = apiPath(category, api.slug)
  const seo = apiDetailSeo(api)
  const crumbs = devCrumbs.api(api)
  const name = apiBaseName(api.name)
  const auth = apiAuthType(api)
  const official = officialSdks(api)
  const community = communitySdks(api)
  const alternatives = apiAlternatives(store, api, 6)
  const tryable = isTryable(d.sample, d.check)
  const snippets = buildSnippets(d.sample, d.check)
  const faqs = apiFaqs(api)
  const categoryPhrase = apiCategoryPhrase(api.category.slug, api.category.name)

  /* SDK language pages for this API's official SDKs (every SDK language
     with at least one package has a page). */
  const sdkLanguages = [...new Map(official.map(sdk => [sdk.languageSlug, sdk.language])).entries()]
    .filter(([slug]) => store.sdkLanguageStats.some(st => st.slug === slug))

  /* The provider's open source (2.6 bridge), when its GitHub org is a
     company in the open-source set. */
  let ossPromo: Extract<ApiPromoProps, { variant: 'oss' }> | null = null
  const ossSlug = apiOssCompanySlug(store, api)
  if (ossSlug) {
    const oss = await tryGetOss()
    const company = oss?.companyBySlug.get(ossSlug)
    const stats = company ? oss!.statsBySlug.get(company.slug) : undefined
    if (oss && company) {
      ossPromo = {
        variant: 'oss',
        company: {
          name: company.name,
          href: ossCompanyPath(company.slug),
          avatarUrl: companyAvatar(company) || null,
          trackedRepos: stats?.trackedRepos,
          stars: stats?.stars,
        },
        repos: (oss.reposByCompany.get(company.slug) ?? []).filter(r => !r.isArchived).slice(0, 3).map(r => ({
          nameWithOwner: r.nameWithOwner,
          href: ossRepoPath(r.companySlug, r.slug),
          stars: r.stars,
          language: r.primaryLanguage,
        })),
      }
    }
  }

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={d.lastVerified}
        mainEntityId={pageIds(path).api}
        nodes={[webApiNode(api), faqGraphNode(path, faqs)]}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={apiCategoryIcon(category)}
        title={`${name} API`}
        width="wide"
        sub={(
          <span className="dv-small dv-muted">
            by {d.provider.name}{d.provider.website && <> &middot; {hostOf(d.provider.website)}</>}
          </span>
        )}
        actions={(
          <div className="dv-btn-row">
            {d.docsUrl && (
              <a className="dv-btn dv-btn--secondary dv-btn--sm" href={d.docsUrl} target="_blank" rel="noopener noreferrer">Docs</a>
            )}
            {d.pricingUrl && (
              <a className="dv-btn dv-btn--secondary dv-btn--sm" href={d.pricingUrl} target="_blank" rel="nofollow noopener noreferrer">Pricing</a>
            )}
            {auth !== 'none' && d.docsUrl && (
              <a className="dv-btn dv-btn--primary dv-btn--sm" href={d.docsUrl} target="_blank" rel="noopener noreferrer">Get a key</a>
            )}
          </div>
        )}
        meta={(
          <div className="dv-badge-row">
            <AuthBadge auth={auth} raw={api.authRaw} />
            <HttpsBadge https={api.https} />
            <CorsBadge cors={api.cors} />
            {d.check?.ok && d.lastVerified && <VerifiedBadge date={d.lastVerified} />}
            <CardBadge requiresCard={d.freeTier.requiresCard} />
            {official.length > 0 && <DvBadge tone="neutral">{countLabel(official.length, 'official SDK')}</DvBadge>}
          </div>
        )}
        lead={(
          <>
            <p>{d.summary}</p>
            <h2 className="dv-h2" style={{ marginTop: 28 }}>Free tier</h2>
            <FreeTierPanel freeTier={d.freeTier} rateLimits={d.rateLimits} lastVerified={d.lastVerified} />
            {snippets.length > 0 && (
              <>
                <h2 className="dv-h2" style={{ marginTop: 28 }}>Quick start</h2>
                <SnippetTabs snippets={snippets} label="Quick start request" note={d.sample?.description} />
              </>
            )}
          </>
        )}
        aside={(
          <>
            <div className="dv-card">
              <p className="dv-label" style={{ marginBottom: 14 }}>At a glance</p>
              <ApiFactsCard
                auth={auth}
                authRaw={api.authRaw}
                https={api.https}
                cors={api.cors}
                baseUrl={d.baseUrl}
                docsUrl={d.docsUrl}
                openapiUrl={d.openapiUrl}
                statusUrl={d.statusUrl}
                category={api.category}
              />
            </div>
            <div className="dv-card" style={{ marginTop: 16 }}>
              <ProviderCard provider={d.provider} pricingUrl={d.pricingUrl} />
            </div>
          </>
        )}
        asideLabel="At a glance and provider"
      />

      {d.sample && (
        <DvBand tone="wash" id="try-it" title="Try it" sub={tryable ? 'This runs for real, in your browser, right now.' : undefined}>
          {tryable ? (
            <TryItPanel url={d.sample.url} checkedAt={d.check?.checkedAt} />
          ) : d.sample.needsKey ? (
            <DvNotice tone="info">
              This API needs a key, so there is no live demo here. Use the Quick start request above with your own key.
            </DvNotice>
          ) : d.check ? (
            <DvNotice tone={d.check.ok ? 'info' : 'warn'}>
              Last check: {d.check.ok ? `${d.check.httpStatus ?? 200} OK` : `HTTP ${d.check.httpStatus ?? 'error'}`}
              {d.check.contentType ? `, ${d.check.contentType.split(';')[0]}` : ''}, <DvTime iso={d.check.checkedAt} />.
            </DvNotice>
          ) : null}
        </DvBand>
      )}

      <DvBand tone="white" title="Official SDKs">
        {d.sdks.length === 0 ? (
          <p className="dv-lead">No official SDK was found. Call the REST API directly with the Quick start request above.</p>
        ) : (
          <>
            {official.length > 0 && (
              <>
                <SdkTabs sdks={official} label={`Official SDKs for the ${name} API`} />
                <h3 className="dv-h3" style={{ marginTop: 32, marginBottom: 12 }}>All official SDKs</h3>
                <SdkTable sdks={official} caption={`Every official SDK for the ${name} API`} />
                {sdkLanguages.length > 0 && (
                  <DvFacetChips
                    className="dv-sdk-langlinks"
                    label="Official SDKs for other free APIs"
                    scroll={false}
                    items={sdkLanguages.map(([slug, language]) => ({ label: `More ${language} SDKs`, href: sdkPath(slug), icon: languageIcon(slug) }))}
                  />
                )}
              </>
            )}
            {community.length > 0 && (
              <>
                <h3 className="dv-h3" style={{ marginTop: 32, marginBottom: 4 }}>
                  Community libraries <DvBadge tone="neutral">Not official</DvBadge>
                </h3>
                <p className="dv-small dv-muted" style={{ marginBottom: 12 }}>Published by the community, not the API provider.</p>
                <SdkTable sdks={community} caption={`Community libraries for the ${name} API`} />
              </>
            )}
          </>
        )}
      </DvBand>

      {(d.useCases.length > 0 || d.tags.length > 0) && (
        <DvBand tone="wash" title="Use cases">
          {d.useCases.length > 0 && (
            <ul className="dv-usecases">
              {d.useCases.map(u => (
                <li key={u}><FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />{u}</li>
              ))}
            </ul>
          )}
          {d.tags.length > 0 && (
            <div className="dv-chips-list" style={{ marginTop: d.useCases.length > 0 ? 20 : 0 }}>
              {d.tags.map(t => <span key={t} className="dv-chip dv-chip--static">{t}</span>)}
            </div>
          )}
        </DvBand>
      )}

      {ossPromo && (
        <DvBand tone="wash" title={`Open source by ${d.provider.name}`}>
          <ApiPromo {...ossPromo} />
        </DvBand>
      )}

      {alternatives.length > 0 && (
        <DvBand tone="white" title={`Alternatives in ${categoryPhrase}`}>
          <div className="dv-grid dv-grid--3">
            {alternatives.map(a => <ApiCard key={a.id} api={a} />)}
          </div>
        </DvBand>
      )}

      <DvFaq heading={`${name} API FAQs`} faqs={faqs} tone="wash" />

      {d.sources.length > 0 && (
        <DvBand tone="white" title="Sources">
          <ol className="dv-sources-list">
            {d.sources.map(s => (
              <li key={s}><a href={s} target="_blank" rel="noopener noreferrer">{s}</a></li>
            ))}
          </ol>
        </DvBand>
      )}

      <DvSourceNote mit>
        Facts verified {formatDate(d.lastVerified)} against the provider&apos;s own docs{d.sources.length ? ' and the sources listed above' : ''}.
        Category: <a href={apiCategoryPath(category)}>{api.category.name}</a>.
      </DvSourceNote>
    </>
  )
}
