import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/hub.css'
import '@/app/styles/developers/oss.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding, faCircleCheck, faCodeBranch, faCubes, faLayerGroup, faLink, faPlay, faPlug, faSeedling, faServer,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { countLabel, formatNumber } from '@/lib/developers/format'
import { diverseRepos, companyAvatar, newestIssues } from '@/lib/developers/oss'
import {
  apiCategoryPath, apiCollectionPath, apiPath, devHubPath, freeApisPath, gfiPath, methodologyPath, ossFacetPath, ossHubPath,
  ossRepoPath, ossReposPath, sdkPath, type ApiCollectionSlug,
} from '@/lib/developers/paths'
import { isCollectionIndexable, COLLECTION_KEYS } from '@/lib/developers/indexing'
import { devCrumbs, faqGraphNode, listNode, thing } from '@/lib/developers/jsonld'
import { devPageMetadata, devUnavailableMetadata, hubSeo } from '@/lib/developers/seo'
import { tryGetApis, tryGetOss } from '@/lib/developers/store'
import { popularSdkApis, topCategories } from '@/lib/developers/apis'
import { API_TAB_BUCKETS } from '@/lib/developers/taxonomy'
import { hubFaqs } from '@/lib/developers/copy/faqs'
import DvHero from './_components/shell/DvHero'
import DvHeroBadges from './_components/shell/DvHeroBadges'
import DvStatStrip from './_components/shell/DvStatStrip'
import DvBand from './_components/shell/DvBand'
import DvFaq from './_components/shell/DvFaq'
import DvCtaBand from './_components/shell/DvCtaBand'
import DvSourceNote from './_components/shell/DvSourceNote'
import DvJsonLd from './_components/shell/DvJsonLd'
import DvSearchBox from './_components/search/DvSearchBox'
import RepoCard from './_components/oss/RepoCard'
import IssueCard, { issueCardData } from './_components/oss/IssueCard'
import PathCard from './_components/hub/PathCard'
import HeroTerminal from './_components/hub/HeroTerminal'
import ApiCard from './_components/apis/ApiCard'
import DvCategoryGrid, { type DvCategoryGridItem } from './_components/apis/DvCategoryGrid'

export const revalidate = 86400

const PATH = devHubPath()

const API_QUICK_LINKS: ReadonlyArray<{ slug: ApiCollectionSlug; label: string }> = [
  { slug: 'no-auth', label: 'No-key APIs' },
  { slug: 'ai-llm', label: 'AI and LLM APIs' },
  { slug: 'cors-enabled', label: 'CORS-enabled APIs' },
]

export async function generateMetadata(): Promise<Metadata> {
  const [oss, apis] = await Promise.all([tryGetOss(), tryGetApis()])
  const seo = hubSeo({
    repos: oss?.totals.repos ?? null,
    companies: oss?.totals.companies ?? null,
    checkedAt: apis?.meta.linksCheckedAt ?? null,
  })
  if (!oss && !apis) return devUnavailableMetadata(PATH, seo)
  return devPageMetadata(PATH, seo, true)
}

export default async function DevelopersHubPage() {
  const [oss, apis] = await Promise.all([tryGetOss(), tryGetApis()])
  const seo = hubSeo({
    repos: oss?.totals.repos ?? null,
    companies: oss?.totals.companies ?? null,
    checkedAt: apis?.meta.linksCheckedAt ?? null,
  })
  const crumbs = devCrumbs.hub()

  const topRepos = oss ? diverseRepos(oss.reposAll, 9, 2) : []
  const topCats: DvCategoryGridItem[] = apis
    ? topCategories(apis, 12).map(c => ({ slug: c.slug, name: c.name, apis: c.apis, withSdks: c.withSdks }))
    : []
  const popularApis = apis ? popularSdkApis(apis, API_TAB_BUCKETS[0], 6) : []
  const heroApi = apis?.heroApi ?? null
  const heroTopRepo = oss?.reposAll[0] ?? null
  const issues = oss
    ? newestIssues(oss, 6, 1).map(i => issueCardData(oss, i)).filter((c): c is NonNullable<typeof c> => c !== null)
    : []

  /* Path card quick links (3.1), each only when its page is indexed. */
  const apiLinks = apis
    ? [
        ...API_QUICK_LINKS
          .filter(l => isCollectionIndexable(l.slug, apis.collections[COLLECTION_KEYS[l.slug]]))
          .map(l => ({ href: apiCollectionPath(l.slug), label: l.label })),
        ...(apis.sdkLanguageStats.some(st => st.slug === 'python' && st.indexable) ? [{ href: sdkPath('python'), label: 'Python SDKs' }] : []),
      ]
    : []
  const ossLinks = oss
    ? oss.facets.language
        .filter(f => f.indexable)
        .slice(0, 3)
        .map(f => ({ href: ossFacetPath('language', f.slug), label: `${f.name} projects` }))
        .concat(oss.issues.length ? [{ href: gfiPath(), label: 'Good first issues' }] : [])
    : []

  const faqs = hubFaqs({ refreshLive: oss?.meta.refresh?.live ?? false })

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={oss?.dataAt ?? apis?.dataAt ?? null}
        about={[thing('Application programming interface'), thing('Open-source software')]}
        nodes={[
          listNode(PATH, 'Explore InfoWebWorld for Developers', [
            { name: 'Open source from real companies', url: ossHubPath() },
            { name: 'Free APIs and official SDKs', url: freeApisPath() },
            ...topCats.map(c => ({ name: c.name, url: apiCategoryPath(c.slug) })),
          ]),
          faqGraphNode(PATH, faqs),
        ]}
      />

      <DvHero
        variant="hub"
        crumbs={crumbs}
        kicker="InfoWebWorld for Developers"
        kickerIcon={faGithub}
        title={seo.h1}
        lead="Find a free API with a checked free tier and an official SDK, or learn from the public code of real companies on GitHub. Every number here comes from the source, with the date we checked it."
        aside={apis && oss ? (
          <HeroTerminal
            sampleUrl={heroApi?.details?.sample?.url ?? null}
            sampleDescription={heroApi?.details?.sample?.description ?? null}
            checkedAt={heroApi?.details?.check?.checkedAt ?? null}
            httpStatus={heroApi?.details?.check?.httpStatus ?? null}
            contentType={heroApi?.details?.check?.contentType ?? null}
            apiName={heroApi?.name ?? null}
            apiHref={heroApi ? apiPath(heroApi.category.slug, heroApi.slug) : null}
            topRepoNameWithOwner={heroTopRepo?.nameWithOwner ?? null}
            topRepoUrl={heroTopRepo?.url ?? null}
          />
        ) : undefined}
      >
        <DvSearchBox size="hero" />
        <DvHeroBadges
          items={[
            { icon: faPlug, value: apis?.totals.apis ?? 0, label: 'free APIs' },
            { icon: faCubes, value: apis?.totals.officialSdks ?? 0, label: 'official SDKs' },
            { icon: faGithub, value: oss?.totals.companies ?? 0, label: 'companies' },
            { icon: faSeedling, value: oss?.totals.goodFirstIssues ?? 0, label: 'good first issues' },
          ]}
        />
        <div className="dv-hero-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="dv-btn dv-btn--primary" href={freeApisPath()}>Browse free APIs</a>
          <a className="dv-btn dv-btn--secondary" href={ossHubPath()}>Explore open source</a>
        </div>
      </DvHero>

      {(oss || apis) && (
        <DvBand tone="white" id="dv-hub-stats" tight label="InfoWebWorld for Developers, by the numbers">
          <DvStatStrip
            items={[
              { label: 'Companies', value: oss?.totals.companies ?? 0, icon: faBuilding },
              { label: 'Repositories', value: oss?.totals.repos ?? 0, icon: faCodeBranch },
              { label: 'Free APIs', value: apis?.totals.apis ?? 0, icon: faPlug },
              { label: 'Categories', value: apis?.totals.categories ?? 0, icon: faLayerGroup },
              { label: 'With official SDKs', value: apis?.totals.apisWithOfficialSdks ?? 0, icon: faCubes },
              { label: 'Try in browser', value: apis?.totals.tryable ?? 0, icon: faPlay },
            ]}
          />
        </DvBand>
      )}

      {(oss || apis) && (
        <DvBand tone="white" id="dv-hub-paths" title="Two ways to start building" align="center">
          <div className="dv-pathgrid">
            {oss && (
              <PathCard
                icon={faGithub}
                title="Open source from real companies"
                text="Browse public, non-fork repositories that real companies publish on GitHub: stars, forks, licenses and good first issues, all pulled straight from the GitHub API."
                stats={[countLabel(oss.totals.companies, 'company', 'companies'), countLabel(oss.totals.repos, 'repository', 'repositories')]}
                links={ossLinks}
                action={{ href: ossHubPath(), label: 'Explore open source' }}
              />
            )}
            {apis && (
              <PathCard
                icon={faPlug}
                title="Free APIs and official SDKs"
                text="Filter free APIs by auth type, HTTPS and CORS, compare free-tier limits, and install the official SDK in your language."
                stats={[countLabel(apis.totals.apis, 'API'), countLabel(apis.totals.categories, 'category', 'categories'), countLabel(apis.totals.noAuth, 'needs no key', 'need no key')]}
                links={apiLinks}
                action={{ href: freeApisPath(), label: 'Browse free APIs' }}
              />
            )}
          </div>
        </DvBand>
      )}

      {topCats.length > 0 && (
        <DvBand
          tone="wash"
          id="dv-hub-categories"
          title="Free API categories developers use most"
          sub="The busiest categories in the dataset, from AI and machine learning to weather."
          action={<a className="dv-more" href={freeApisPath()}>All {formatNumber(apis!.totals.categories)} categories</a>}
        >
          <DvCategoryGrid items={topCats} label="Top free API categories" />
        </DvBand>
      )}

      {topRepos.length > 0 && (
        <DvBand
          tone="navy"
          id="dv-hub-repos"
          title="Most-starred open source from companies"
          sub="Real projects, real companies, real GitHub numbers."
          action={<a className="dv-more" href={ossReposPath()}>Top repositories</a>}
        >
          <div className="dv-grid dv-grid--3">
            {topRepos.map(r => {
              const company = oss!.companyBySlug.get(r.companySlug)!
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
                  dataAt={oss!.dataAt}
                  goodFirstIssues={r.goodFirstIssues}
                  topics={r.topics}
                  companyName={company.name}
                  companyAvatarUrl={companyAvatar(company) || null}
                  isArchived={r.isArchived}
                  variant="onDark"
                />
              )
            })}
          </div>
        </DvBand>
      )}

      {popularApis.length > 0 && (
        <DvBand
          tone="white"
          id="dv-hub-apis"
          title="Popular free APIs with official SDKs"
          sub="Reviewed APIs with at least one SDK published by the provider itself."
          action={<a className="dv-more" href={freeApisPath()}>All free APIs</a>}
        >
          <div className="dv-grid dv-grid--3">
            {popularApis.map(api => <ApiCard key={api.id} api={api} />)}
          </div>
        </DvBand>
      )}

      {issues.length > 0 && (
        <DvBand
          tone="wash"
          id="dv-hub-gfi"
          title="Good first issues from real companies"
          sub="Small, well-described tasks that maintainers marked as a safe place to start."
          action={<a className="dv-more" href={gfiPath()}>See all {formatNumber(oss!.totals.issues)} good first issues</a>}
        >
          <div className="dv-grid dv-grid--3">
            {issues.map(i => <IssueCard key={i.url} issue={i} dataAt={oss!.dataAt} />)}
          </div>
        </DvBand>
      )}

      <DvBand
        tone="white"
        id="dv-hub-trust"
        title="How we check this data"
        action={<a className="dv-more" href={methodologyPath()}>How we check</a>}
      >
        <div className="dv-grid dv-grid--3">
          <div className="dv-trustcard">
            <FontAwesomeIcon icon={faServer} className="dv-trustcard-icon" aria-hidden="true" />
            <h3 className="dv-h3">Straight from the source</h3>
            <p>GitHub numbers come from GitHub&apos;s own API. API facts come from the provider&apos;s docs and the package registries.</p>
          </div>
          <div className="dv-trustcard">
            <FontAwesomeIcon icon={faCircleCheck} className="dv-trustcard-icon" aria-hidden="true" />
            <h3 className="dv-h3">Checked, with dates</h3>
            <p>Every page shows when its data was checked. A fact we could not verify is left blank, never guessed.</p>
          </div>
          <div className="dv-trustcard">
            <FontAwesomeIcon icon={faLink} className="dv-trustcard-icon" aria-hidden="true" />
            <h3 className="dv-h3">Linked to the real company</h3>
            <p>Companies listed on InfoWebWorld link to their profile, so you can see who is behind the code.</p>
          </div>
        </div>
      </DvBand>

      <DvFaq heading="Developer FAQs" faqs={faqs} />

      <DvCtaBand
        title="Is your company on GitHub? Put its open source on InfoWebWorld."
        sub="List your company free, tell us your GitHub organization, and reach the developers who use your code."
        action={{ href: '/business', label: 'List your company' }}
        icon={faGithub}
        id="dv-hub-cta"
      />

      <DvSourceNote mit>
        GitHub numbers come from the GitHub GraphQL API, and free API facts come from each provider's own docs and the
        package registries. Every page shows the date we checked it.
      </DvSourceNote>
    </>
  )
}
