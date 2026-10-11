import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/hub.css'
import '@/app/styles/developers/oss.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { faBuilding, faCodeBranch, faCubes, faLayerGroup, faPlay, faPlug, faSeedling } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { countLabel, formatNumber } from '@/lib/developers/format'
import { diverseRepos, companyAvatar } from '@/lib/developers/oss'
import { apiCategoryPath, apiPath, devHubPath, freeApisPath, ossHubPath } from '@/lib/developers/paths'
import { devCrumbs, faqGraphNode, listNode, thing } from '@/lib/developers/jsonld'
import { devPageMetadata, devUnavailableMetadata, hubSeo } from '@/lib/developers/seo'
import { tryGetApis, tryGetOss } from '@/lib/developers/store'
import { popularSdkApis, topCategories } from '@/lib/developers/apis'
import { API_TAB_BUCKETS } from '@/lib/developers/taxonomy'
import { hubFaqs, type DevFaq } from '@/lib/developers/copy/faqs'
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
import PathCard from './_components/hub/PathCard'
import HeroTerminal from './_components/hub/HeroTerminal'
import ApiCard from './_components/apis/ApiCard'
import DvCategoryGrid, { type DvCategoryGridItem } from './_components/apis/DvCategoryGrid'

export const revalidate = 86400

const PATH = devHubPath()

/* Only /business and /contact (outside this section) are safe hub FAQ
   link targets in this build - no methodology, search or collection pages. */
function keepBuiltLinks(faqs: readonly DevFaq[]): DevFaq[] {
  return faqs.map(f => ({ ...f, links: f.links?.filter(l => l.href === '/business' || l.href === '/contact') }))
}

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

  const faqs = keepBuiltLinks(hubFaqs({ refreshLive: oss?.meta.refresh?.live ?? false }))

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
                action={{ href: ossHubPath(), label: 'Explore open source' }}
              />
            )}
            {apis && (
              <PathCard
                icon={faPlug}
                title="Free APIs and official SDKs"
                text="Filter free APIs by auth type, HTTPS and CORS, compare free-tier limits, and install the official SDK in your language."
                stats={[countLabel(apis.totals.apis, 'API'), countLabel(apis.totals.categories, 'category', 'categories'), countLabel(apis.totals.noAuth, 'needs no key', 'need no key')]}
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
          action={<a className="dv-more" href={ossHubPath()}>Explore open source</a>}
        >
          <div className="dv-grid dv-grid--3">
            {topRepos.map(r => {
              const company = oss!.companyBySlug.get(r.companySlug)!
              return (
                <RepoCard
                  key={r.id}
                  nameWithOwner={r.nameWithOwner}
                  href={r.url}
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
