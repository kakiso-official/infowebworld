import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faCodeFork, faGlobe, faSeedling, faStar } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { formatNumber, joinList } from '@/lib/developers/format'
import {
  companyAvatar, companyIwwLink, isCompanyPageIndexable, repoKey, similarCompanies, type OssStore,
} from '@/lib/developers/oss'
import type { OssCompany } from '@/lib/developers/types'
import { apiPath, normalizeSlugParam, ossCompanyPath } from '@/lib/developers/paths'
import { devCrumbs, faqGraphNode, listNode, orgNode, softwareSourceCodeNode } from '@/lib/developers/jsonld'
import { companySeo, devMetadata, devNotFoundMetadata, noDash } from '@/lib/developers/seo'
import { apisForCompany, officialSdks } from '@/lib/developers/apis'
import { isDevDataError, getApis, getOss } from '@/lib/developers/store'
import { companyFaqs } from '@/lib/developers/copy/faqs'
import { industryIcon } from '@/lib/developers/taxonomy'
import DvPageHeader from '../../_components/shell/DvPageHeader'
import DvStatStrip from '../../_components/shell/DvStatStrip'
import DvDataLine from '../../_components/shell/DvDataLine'
import DvBand from '../../_components/shell/DvBand'
import DvFaq from '../../_components/shell/DvFaq'
import DvSourceNote from '../../_components/shell/DvSourceNote'
import DvNotice from '../../_components/shell/DvNotice'
import DvJsonLd from '../../_components/shell/DvJsonLd'
import DvFlag from '../../_components/ui/DvFlag'
import DvLangBar from '../../_components/ui/DvLangBar'
import OrgAvatar from '../../_components/ui/OrgAvatar'
import DvExternalLink from '../../_components/ui/DvExternalLink'
import { VerifiedOrgBadge } from '../../_components/ui/Badges'
import ApiPromo, { type ApiPromoApi } from '../../_components/ui/ApiPromo'
import IwwBadgeCard from '../../_components/oss/IwwBadgeCard'
import CompanyCard from '../../_components/oss/CompanyCard'
import RepoTable, { type RepoTableRow } from '../../_components/oss/RepoTable'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { company: string }

type LoadResult =
  | { kind: 'redirect'; path: string }
  | { kind: 'not-found' }
  | { kind: 'ok'; store: OssStore; company: OssCompany }

async function loadCompany(raw: string): Promise<LoadResult> {
  const canonical = normalizeSlugParam(raw)
  if (canonical !== raw) return { kind: 'redirect', path: ossCompanyPath(canonical) }
  const store = await getOss()
  const company = store.companyBySlug.get(canonical)
  if (!company) return { kind: 'not-found' }
  return { kind: 'ok', store, company }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { company: raw } = await params
  try {
    const result = await loadCompany(raw)
    if (result.kind !== 'ok') return devNotFoundMetadata()
    const { store, company } = result
    const stats = store.statsBySlug.get(company.slug)!
    const seo = companySeo(company, stats)
    const indexable = isCompanyPageIndexable(store, company.slug)
    return devMetadata({ path: ossCompanyPath(company.slug), title: seo.title, description: seo.description, indexable })
  } catch (err) {
    if (!isDevDataError(err)) throw err
    return devNotFoundMetadata()
  }
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const { company: raw } = await params

  let result: LoadResult
  try {
    result = await loadCompany(raw)
  } catch (err) {
    if (!isDevDataError(err)) throw err
    return (
      <DvBand tone="white" title="This data is refreshing">
        <DvNotice tone="info">Our open source data is refreshing. Please try again in a few minutes.</DvNotice>
      </DvBand>
    )
  }
  if (result.kind === 'redirect') permanentRedirect(result.path)
  if (result.kind === 'not-found') notFound()
  const { store, company } = result

  const repos = store.reposByCompany.get(company.slug) ?? []
  const stats = store.statsBySlug.get(company.slug)!
  const seo = companySeo(company, stats)
  const crumbs = devCrumbs.company(company)
  const path = ossCompanyPath(company.slug)
  const allArchived = repos.length > 0 && repos.every(r => r.isArchived)

  const topRepoFull = stats.topRepo ? store.repoByKey.get(repoKey(company.slug, stats.topRepo.slug)) : null
  const iwwLink = companyIwwLink(company)
  const similar = similarCompanies(store, company, 6)

  let apiPromo: ApiPromoApi | null = null
  try {
    const apisStore = await getApis()
    const promos = apisForCompany(apisStore, company.slug)
    if (promos.length > 0) {
      const a = promos[0]
      apiPromo = {
        name: a.name,
        href: apiPath(a.category.slug, a.slug),
        summary: a.details?.summary ?? null,
        auth: a.auth,
        authRaw: a.authRaw,
        https: a.https,
        cors: a.cors,
        officialSdks: officialSdks(a).length,
      }
    }
  } catch (err) {
    if (!isDevDataError(err)) throw err
  }

  const faqs = companyFaqs(store, company)

  const repoRows: RepoTableRow[] = repos.map(r => ({
    slug: r.slug,
    href: r.url,
    name: r.name,
    description: r.description,
    stars: r.stars,
    primaryLanguage: r.primaryLanguage,
    license: r.license,
    pushedAt: r.pushedAt,
    goodFirstIssues: r.goodFirstIssues,
    isArchived: r.isArchived,
  }))

  const orgsText = joinList(company.orgs.map(o => o.login))

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={stats.lastPushedAt}
        about={[orgNode(company)]}
        nodes={[
          listNode(
            path,
            `${noDash(company.name)} open source projects`,
            repos.slice(0, 30).map(r => ({ name: r.name, item: softwareSourceCodeNode(r, company, { variant: 'item' }) })),
          ),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={`${noDash(company.name)} Open Source Projects`}
        media={<OrgAvatar src={companyAvatar(company) || null} name={company.name} size={64} labelled />}
        meta={(
          <>
            <span className="dv-chip dv-chip--static">
              <FontAwesomeIcon icon={industryIcon(company.industrySlug)} aria-hidden="true" /> {company.industry}
            </span>
            {company.countryName && (
              <span className="dv-chip dv-chip--static">
                {company.hqCountry && <DvFlag code={company.hqCountry} />} {company.countryName}
              </span>
            )}
            {company.orgs.some(o => o.isVerified) && <VerifiedOrgBadge />}
          </>
        )}
        sub={(
          <p className="dv-small dv-muted">
            {company.orgs.map((o, i) => (
              <span key={o.login}>
                {i > 0 && ', '}
                <code><DvExternalLink href={o.url}>{o.login}</DvExternalLink></code>
              </span>
            ))}
          </p>
        )}
        actions={(
          <>
            {company.orgs[0] && (
              <DvExternalLink href={company.orgs[0].url} className="dv-btn dv-btn--secondary dv-btn--sm">
                <FontAwesomeIcon icon={faGithub} aria-hidden="true" /> View on GitHub
              </DvExternalLink>
            )}
            {company.website && (
              <DvExternalLink href={company.website} className="dv-btn dv-btn--secondary dv-btn--sm">
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true" /> Website
              </DvExternalLink>
            )}
          </>
        )}
        lead={(
          <p>
            {company.oneLiner && `${noDash(company.oneLiner)} `}
            {noDash(company.name)} publishes {formatNumber(Math.max(stats.publicRepos, stats.trackedRepos))} public
            repositories on GitHub{company.orgs.length > 1 ? ` under the ${orgsText} organizations` : ''}.
            {' '}We track the {formatNumber(stats.trackedRepos)} most-starred non-fork projects
            {topRepoFull ? <>; the most-starred is <DvExternalLink href={topRepoFull.url} icon={false}><code>{stats.topRepo!.name}</code></DvExternalLink></> : ''}
            {topRepoFull?.primaryLanguage ? `, written mainly in ${topRepoFull.primaryLanguage.name}` : ''}.
          </p>
        )}
        dataLine={<DvDataLine source="github" date={stats.lastPushedAt ?? store.snapshotAt} refresh={store.meta.refresh} />}
        notice={allArchived && (
          <DvNotice tone="warn">All of {noDash(company.name)}&apos;s tracked repositories are archived on GitHub.</DvNotice>
        )}
        aside={<IwwBadgeCard link={iwwLink} />}
        asideLabel="InfoWebWorld listing"
        below={(
          <>
            <DvStatStrip
              items={[
                { label: 'Public repos', value: stats.publicRepos, icon: faBuilding },
                { label: 'Tracked repos', value: stats.trackedRepos, icon: faGithub },
                { label: 'GitHub stars', value: stats.stars, icon: faStar, format: 'compact' },
                { label: 'Forks', value: stats.forks, icon: faCodeFork, format: 'compact' },
                { label: 'Good first issues', value: stats.goodFirstIssues, icon: faSeedling },
              ]}
            />
            {stats.topLanguages.length > 0 && (
              <DvLangBar languages={stats.topLanguages} label={`Languages used by ${noDash(company.name)}`} />
            )}
          </>
        )}
      />

      <DvBand tone="white" id="dv-company-projects" title="Projects" sub={`Public, non-fork repositories tracked from ${noDash(company.name)}'s GitHub organizations, ranked by stars.`}>
        <RepoTable rows={repoRows} dataAt={store.dataAt} caption={`${formatNumber(repoRows.length)} tracked repositories, sorted by GitHub stars`} />
      </DvBand>

      {apiPromo && (
        <DvBand tone="wash" id="dv-company-api" title={`${noDash(company.name)}'s free API`}>
          <ApiPromo variant="api" companyName={noDash(company.name)} api={apiPromo} />
        </DvBand>
      )}

      {similar.length > 0 && (
        <DvBand tone={apiPromo ? 'white' : 'wash'} id="dv-company-similar" title="Similar companies">
          <div className="dv-grid dv-grid--3">
            {similar.map(c => {
              const cStats = store.statsBySlug.get(c.slug)!
              return (
                <CompanyCard
                  key={c.slug}
                  name={c.name}
                  href={ossCompanyPath(c.slug)}
                  industry={c.industry}
                  industrySlug={c.industrySlug}
                  countryName={c.countryName}
                  hqCountry={c.hqCountry}
                  avatarUrl={companyAvatar(c) || null}
                  trackedRepos={cStats.trackedRepos}
                  stars={cStats.stars}
                  topLanguages={cStats.topLanguages}
                  listed={companyIwwLink(c) !== null}
                />
              )
            })}
          </div>
        </DvBand>
      )}

      <DvFaq heading={`${noDash(company.name)} open source FAQs`} faqs={faqs} tone="white" />

      <DvSourceNote>
        GitHub data for {noDash(company.name)} comes from the GitHub GraphQL API. We track up to {store.meta.reposPerOrgLimit}{' '}
        most-starred, non-fork public repositories per organization.
      </DvSourceNote>
    </>
  )
}
