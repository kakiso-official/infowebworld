import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faTag } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { formatDate } from '@/lib/developers/format'
import {
  companyAvatar, companyIwwLink, isRepoPageIndexable, moreFromCompany, repoKey, similarRepos, topicHasPage,
  type OssStore,
} from '@/lib/developers/oss'
import { ossCompanyPath, ossFacetPath, ossRepoPath, languageSlug, topicSlug } from '@/lib/developers/paths'
import { devCrumbs, faqGraphNode, pageIds, softwareSourceCodeNode } from '@/lib/developers/jsonld'
import { devMetadata, devNotFoundMetadata, devUnavailableMetadata, noDash, repoSeo } from '@/lib/developers/seo'
import { getOss } from '@/lib/developers/store'
import { repoFaqs } from '@/lib/developers/copy/faqs'
import { humanizeTopic } from '@/lib/developers/taxonomy'
import type { OssCompany, OssRepo } from '@/lib/developers/types'
import { canonicalSlug, resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../../_components/shell/DvPageHeader'
import DvDataLine from '../../../_components/shell/DvDataLine'
import DvBand from '../../../_components/shell/DvBand'
import DvFaq from '../../../_components/shell/DvFaq'
import DvNotice, { archivedIcon } from '../../../_components/shell/DvNotice'
import DvSourceNote from '../../../_components/shell/DvSourceNote'
import DvJsonLd from '../../../_components/shell/DvJsonLd'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import { ArchivedBadge, DvBadge, GfiBadge, LicenseBadge } from '../../../_components/ui/Badges'
import CodeBlock from '../../../_components/ui/CodeBlock'
import CopyButton from '../../../_components/ui/CopyButton'
import DvExternalLink from '../../../_components/ui/DvExternalLink'
import DvLangBar from '../../../_components/ui/DvLangBar'
import DvTime from '../../../_components/ui/DvTime'
import LanguageDot from '../../../_components/ui/LanguageDot'
import OrgAvatar from '../../../_components/ui/OrgAvatar'
import RepoCard from '../../../_components/oss/RepoCard'
import RepoFactsCard, { releaseUrl } from '../../../_components/oss/RepoFactsCard'
import CompanyMiniCard from '../../../_components/oss/CompanyMiniCard'
import IssueCard, { issueCardData } from '../../../_components/oss/IssueCard'
import ContributeSteps, { contributeSteps } from '../../../_components/oss/ContributeSteps'

/* ═══════════════════════════════════════════════════════════════════════
   Repository - /developers/open-source/{company}/{repo} (spec 3.7).

   What the project is, who maintains it, whether it is alive, how to get
   the code and contribute, and what is similar. Every repo in the
   snapshot has a page (ISR, rendered on first request, cached 24h); the
   repo gate decides index vs noindex, follow. An unknown company or repo
   is a real 404; a non-canonical slug ('Vercel/next.js') 308s to the
   canonical one ('vercel/next-js') when that exists.

   cacheComponents is off (next.config.ts). If it is ever enabled, these
   route segment exports become build errors: migrate to 'use cache'.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { company: string; repo: string }

interface RepoPage {
  store: OssStore
  company: OssCompany
  repo: OssRepo
}

function resolveRepo(rawCompany: string, rawRepo: string): Promise<Resolved<RepoPage>> {
  return resolveSafely<RepoPage>(async () => {
    const store = await getOss()
    const companySlug = canonicalSlug(rawCompany)
    const repoSlugValue = canonicalSlug(rawRepo)
    const company = store.companyBySlug.get(companySlug)
    const repo = company ? store.repoByKey.get(repoKey(companySlug, repoSlugValue)) : undefined
    if (!company || !repo) return { kind: 'not-found' }
    if (companySlug !== rawCompany || repoSlugValue !== rawRepo) {
      return { kind: 'redirect', path: ossRepoPath(companySlug, repoSlugValue) }
    }
    return { kind: 'ok', value: { store, company, repo } }
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { company, repo } = await params
  const res = await resolveRepo(company, repo)
  if (res.kind === 'unavailable') {
    return devUnavailableMetadata(ossRepoPath(canonicalSlug(company), canonicalSlug(repo)), { title: 'Open Source Project', description: 'Open source project details.' })
  }
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { store, company: c, repo: r } = res.value
  const seo = repoSeo(r, c)
  return devMetadata({
    path: ossRepoPath(c.slug, r.slug),
    title: seo.title,
    description: seo.description,
    indexable: isRepoPageIndexable(store, r),
    keywords: r.topics.length ? r.topics.slice(0, 10) : undefined,
  })
}

export default async function RepoPage({ params }: { params: Promise<Params> }) {
  const { company: rawCompany, repo: rawRepo } = await params
  const res = await resolveRepo(rawCompany, rawRepo)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  const { store, company, repo } = res.value

  const path = ossRepoPath(company.slug, repo.slug)
  const seo = repoSeo(repo, company)
  const crumbs = devCrumbs.repo(company, repo)
  const companyName = noDash(company.name)
  const companyHref = ossCompanyPath(company.slug)
  const owner = company.orgs.find(o => o.login.toLowerCase() === repo.owner.toLowerCase())
  const avatar = owner?.avatarUrl ?? (companyAvatar(company) || null)
  const clone = `git clone https://github.com/${repo.nameWithOwner}.git`

  const issues = (store.issuesByRepo.get(repoKey(company.slug, repo.slug)) ?? [])
    .map(i => issueCardData(store, i))
    .filter((c): c is NonNullable<typeof c> => c !== null)
  const more = moreFromCompany(store, repo, 6)
  const similar = similarRepos(store, repo, 6)
  const faqs = repoFaqs(store, repo)
  const steps = contributeSteps('repo', { nameWithOwner: repo.nameWithOwner, url: repo.url })
  const companyRepos = store.reposByCompany.get(company.slug)?.length ?? 1

  const languageItems = repo.languages.map(l => {
    const slug = languageSlug(l.name)
    return { name: l.name, color: l.color, size: l.size, href: store.facetBySlug.language.has(slug) ? ossFacetPath('language', slug) : undefined }
  })
  const primarySlug = repo.primaryLanguage ? languageSlug(repo.primaryLanguage.name) : null
  const primaryHasPage = primarySlug !== null && store.facetBySlug.language.has(primarySlug)

  const repoCard = (r: OssRepo) => {
    const c = store.companyBySlug.get(r.companySlug)!
    return (
      <RepoCard
        key={r.id}
        nameWithOwner={r.nameWithOwner}
        href={ossRepoPath(r.companySlug, r.slug)}
        description={r.description}
        stars={r.stars}
        forks={r.forks}
        primaryLanguage={r.primaryLanguage}
        license={r.license}
        pushedAt={r.pushedAt}
        dataAt={store.dataAt}
        goodFirstIssues={r.goodFirstIssues}
        topics={r.topics}
        companyName={c.name}
        companyAvatarUrl={companyAvatar(c) || null}
        isArchived={r.isArchived}
      />
    )
  }

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        type="WebPage"
        dateModified={repo.pushedAt}
        mainEntityId={pageIds(path).code}
        nodes={[softwareSourceCodeNode(repo, company, { variant: 'page' }), faqGraphNode(path, faqs)]}
      />

      <DvPageHeader
        crumbs={crumbs}
        width="wide"
        notice={repo.isArchived && (
          <DvNotice tone="warn" icon={archivedIcon}>
            This repository is archived on GitHub. It is read-only and no longer accepts contributions.
          </DvNotice>
        )}
        media={<OrgAvatar src={avatar} name={company.name} size={56} />}
        title={noDash(repo.name)}
        titleMuted={` by ${companyName}`}
        sub={(
          <span className="dv-copyline">
            <code>{repo.nameWithOwner}</code>
            <CopyButton text={repo.nameWithOwner} iconOnly tone="light" srLabel={`Copy ${repo.nameWithOwner}`} />
          </span>
        )}
        actions={(
          <>
            <DvExternalLink href={repo.url} className="dv-btn dv-btn--secondary dv-btn--sm">
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" /> View on GitHub
            </DvExternalLink>
            {repo.homepageUrl && (
              <DvExternalLink href={repo.homepageUrl} className="dv-btn dv-btn--secondary dv-btn--sm">
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true" /> Homepage
              </DvExternalLink>
            )}
          </>
        )}
        meta={(
          <div className="dv-badge-row">
            {repo.primaryLanguage && (primaryHasPage
              ? <a className="dv-badge dv-badge--neutral dv-badge--link" href={ossFacetPath('language', primarySlug!)}><LanguageDot name={repo.primaryLanguage.name} color={repo.primaryLanguage.color} /></a>
              : <span className="dv-badge dv-badge--neutral"><LanguageDot name={repo.primaryLanguage.name} color={repo.primaryLanguage.color} /></span>)}
            <LicenseBadge spdx={repo.license} />
            {repo.latestRelease && (
              <DvBadge tone="neutral" icon={faTag} title={`Latest release ${repo.latestRelease.tag}`}>
                <code>{repo.latestRelease.tag}</code> <DvTime iso={repo.latestRelease.publishedAt} />
              </DvBadge>
            )}
            <GfiBadge count={repo.goodFirstIssues} />
            {repo.isArchived && <ArchivedBadge />}
          </div>
        )}
        lead={(
          <>
            <p>{repo.description ? noDash(repo.description) : `${noDash(repo.name)} is a public repository by ${companyName} on GitHub. It has no description there yet.`}</p>
            {repo.topics.length > 0 && (
              <ul className="dv-topic-list" aria-label="GitHub topics">
                {repo.topics.map(t => (
                  <li key={t}>
                    {topicHasPage(store, t)
                      ? <a className="dv-chip dv-chip--sm" href={ossFacetPath('topic', topicSlug(t))}>{humanizeTopic(topicSlug(t))}</a>
                      : <span className="dv-chip dv-chip--sm dv-chip--static">{humanizeTopic(topicSlug(t))}</span>}
                  </li>
                ))}
              </ul>
            )}
            <h2 className="dv-h2 dv-h2--col dv-repo-section">Get the code</h2>
            <CodeBlock code={clone} lang="shell" label="bash" />
            {repo.latestRelease && (
              <p className="dv-small dv-muted dv-repo-release">
                Latest release:{' '}
                <DvExternalLink href={releaseUrl(repo.url, repo.latestRelease.tag)}><code>{repo.latestRelease.tag}</code></DvExternalLink>
                {' '}from <DvTime iso={repo.latestRelease.publishedAt} />.
              </p>
            )}
            {languageItems.length > 0 && (
              <>
                <h2 className="dv-h2 dv-h2--col dv-repo-section">Languages</h2>
                <DvLangBar languages={languageItems} minPct={1} label={`Languages in ${noDash(repo.name)} by code size`} />
              </>
            )}
          </>
        )}
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
        aside={(
          <>
            <div className="dv-card">
              <p className="dv-label dv-repo-aside-label">At a glance</p>
              <RepoFactsCard repo={repo} />
            </div>
            <CompanyMiniCard
              className="dv-repo-aside-company"
              company={company}
              href={companyHref}
              avatarUrl={companyAvatar(company) || null}
              industryHref={store.facetBySlug.industry.has(company.industrySlug) ? ossFacetPath('industry', company.industrySlug) : null}
              countryHref={company.countrySlug && store.facetBySlug.country.has(company.countrySlug) ? ossFacetPath('country', company.countrySlug) : null}
              moreRepos={companyRepos - 1}
              iwwLink={companyIwwLink(company)}
            />
          </>
        )}
        asideLabel="Repository facts and maintainer"
      />

      <DvBand tone="wash" id="dv-repo-issues" title="Good first issues">
        {issues.length > 0 ? (
          <div className="dv-grid dv-grid--2 dv-issuegrid">
            {issues.map(i => <IssueCard key={i.url} issue={i} dataAt={store.dataAt} compact />)}
          </div>
        ) : (
          <p className="dv-lead">
            No open good first issues in this repository right now.{' '}
            <DvExternalLink href={`${repo.url}/issues`}>See all of its open issues on GitHub</DvExternalLink>.
          </p>
        )}
      </DvBand>

      {!repo.isArchived && (
        <DvBand tone="white" id="dv-repo-contribute" title={`How to contribute to ${noDash(repo.name)}`}>
          <ContributeSteps steps={steps} />
        </DvBand>
      )}

      {more.length > 0 && (
        <DvBand
          tone="wash"
          id="dv-repo-more"
          title={`More open source from ${companyName}`}
          action={<a className="dv-more" href={companyHref}>All {companyName} projects</a>}
        >
          <div className="dv-grid dv-grid--3">{more.map(repoCard)}</div>
        </DvBand>
      )}

      {similar.length >= 3 && (
        <DvBand tone="white" id="dv-repo-similar" title="Similar projects from other companies" sub="Matched by shared GitHub topics, then by language.">
          <div className="dv-grid dv-grid--3">{similar.map(repoCard)}</div>
        </DvBand>
      )}

      <DvFaq heading={`${noDash(repo.name)} FAQs`} faqs={faqs} tone="wash" />

      <DvSourceNote>
        Repository data from the GitHub GraphQL API as of {formatDate(store.dataAt)}. Stars, forks and issues change
        every day; <DvExternalLink href={repo.url} icon={false}>{repo.nameWithOwner} on GitHub</DvExternalLink> always has the live numbers.
      </DvSourceNote>
    </>
  )
}
