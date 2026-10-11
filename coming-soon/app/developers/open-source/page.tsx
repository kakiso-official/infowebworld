import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { faBuilding, faCodeBranch, faSeedling, faEarthAmericas, faLanguage, faStar } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { diverseRepos, companyIwwLink, companyAvatar } from '@/lib/developers/oss'
import { ossCompanyPath, ossHubPath, PAGE_SIZE } from '@/lib/developers/paths'
import { devCrumbs, faqGraphNode, listNode, ossDatasetNode } from '@/lib/developers/jsonld'
import { devPageMetadata, devUnavailableMetadata, ossHubSeo } from '@/lib/developers/seo'
import { isDevDataError, getOss } from '@/lib/developers/store'
import { ossHubFaqs } from '@/lib/developers/copy/faqs'
import DvHero from '../_components/shell/DvHero'
import DvStatStrip from '../_components/shell/DvStatStrip'
import DvDataLine from '../_components/shell/DvDataLine'
import DvBand from '../_components/shell/DvBand'
import DvFaq from '../_components/shell/DvFaq'
import DvCtaBand from '../_components/shell/DvCtaBand'
import DvSourceNote from '../_components/shell/DvSourceNote'
import DvNotice from '../_components/shell/DvNotice'
import DvJsonLd from '../_components/shell/DvJsonLd'
import RowFilter from '../_components/ui/RowFilter'
import CompanyCard from '../_components/oss/CompanyCard'
import RepoCard from '../_components/oss/RepoCard'

export const revalidate = 86400

const PATH = ossHubPath()

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getOss()
    const seo = ossHubSeo({ companies: store.totals.companies, repos: store.totals.repos })
    return devPageMetadata(PATH, seo, true)
  } catch (err) {
    if (!isDevDataError(err)) throw err
    return devUnavailableMetadata(PATH, ossHubSeo({ companies: 0, repos: 0 }))
  }
}

export default async function OpenSourceHubPage() {
  let store
  try {
    store = await getOss()
  } catch (err) {
    if (!isDevDataError(err)) throw err
    return (
      <DvBand tone="white" title="This data is refreshing">
        <DvNotice tone="info">Our open source data is refreshing. Please try again in a few minutes.</DvNotice>
      </DvBand>
    )
  }

  const seo = ossHubSeo({ companies: store.totals.companies, repos: store.totals.repos })
  const crumbs = devCrumbs.ossHub()

  const companies = store.companies.slice(0, PAGE_SIZE.companies)
  const industryCounts = [...store.companiesByIndustry.entries()]
    .map(([slug, list]) => ({ slug, name: list[0].industry, count: list.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const topRepos = diverseRepos(store.reposAll, 9, 2)

  const faqs = ossHubFaqs({ reposPerOrg: store.meta.reposPerOrgLimit })
    .map(f => ({ ...f, links: f.links?.filter(l => l.href === '/business' || l.href === '/contact') }))

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[
          listNode(PATH, 'Companies with open source on GitHub', companies.slice(0, 30).map(c => ({ name: c.name, url: ossCompanyPath(c.slug) }))),
          ossDatasetNode(store.dataAt),
          faqGraphNode(PATH, faqs),
        ]}
      />

      <DvHero
        variant="page"
        compact
        crumbs={crumbs}
        kicker="InfoWebWorld for Developers"
        kickerIcon={faGithub}
        title={seo.h1}
        lead={`See what ${formatNumber(store.totals.companies)} companies publish on GitHub, from SDKs and frameworks to the tools they run in production. Learn from real company code and see who is behind it.`}
      >
        <DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />
        <DvStatStrip
          items={[
            { label: 'Companies', value: store.totals.companies, icon: faBuilding },
            { label: 'Repositories', value: store.totals.repos, icon: faCodeBranch },
            { label: 'GitHub stars', value: store.totals.stars, icon: faStar, format: 'compact' },
            { label: 'Languages', value: store.totals.languages, icon: faLanguage },
            { label: 'Countries', value: store.totals.countries, icon: faEarthAmericas },
            { label: 'Good first issues', value: store.totals.goodFirstIssues, icon: faSeedling },
          ]}
        />
      </DvHero>

      <DvBand
        tone="white"
        id="dv-oss-companies"
        title="Companies with open source"
        sub="Every company here has at least one public, non-fork repository on GitHub. Filter by industry or browse them all."
      >
        {industryCounts.length > 1 && (
          <RowFilter
            target="dv-oss-company-rows"
            label="Filter companies by industry"
            noun={{ one: 'company', many: 'companies' }}
            controls={[{
              kind: 'segment',
              key: 'industry',
              label: 'Industry',
              attr: 'industry',
              allLabel: 'All industries',
              options: industryCounts.map(i => ({ value: i.slug, label: i.name, count: i.count })),
            }]}
            emptyTitle="No companies match this filter."
          />
        )}
        <div id="dv-oss-company-rows" className="dv-grid dv-grid--3">
          {companies.map(c => {
            const stats = store.statsBySlug.get(c.slug)!
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
                trackedRepos={stats.trackedRepos}
                stars={stats.stars}
                topLanguages={stats.topLanguages}
                listed={companyIwwLink(c) !== null}
                rowAttrs={{ 'data-row': '', 'data-industry': c.industrySlug }}
              />
            )
          })}
        </div>
        {store.totals.companies > companies.length && (
          <p className="dv-small dv-muted" style={{ marginTop: 16 }}>
            Showing the top {formatNumber(companies.length)} of {formatNumber(store.totals.companies)} companies by GitHub stars.
          </p>
        )}
      </DvBand>

      {topRepos.length > 0 && (
        <DvBand
          tone="wash"
          id="dv-oss-repos"
          title="Most-starred open source from companies"
          sub="Real projects, real companies, real GitHub numbers."
        >
          <div className="dv-grid dv-grid--3">
            {topRepos.map(r => {
              const company = store.companyBySlug.get(r.companySlug)!
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
                  dataAt={store.dataAt}
                  goodFirstIssues={r.goodFirstIssues}
                  topics={r.topics}
                  companyName={company.name}
                  companyAvatarUrl={companyAvatar(company) || null}
                  isArchived={r.isArchived}
                />
              )
            })}
          </div>
        </DvBand>
      )}

      <DvFaq heading="Open source FAQs" faqs={faqs} tone="white" />

      <DvCtaBand
        title="Is your company on GitHub? Put its open source on InfoWebWorld."
        sub="List your company free, tell us your GitHub organization, and reach the developers who use your code."
        action={{ href: '/business', label: 'List your company' }}
        icon={faGithub}
        id="dv-oss-cta"
      />

      <DvSourceNote>
        GitHub data as of {formatDate(store.dataAt)}, collected from the GitHub GraphQL API. Forks are excluded, and we
        track up to {store.meta.reposPerOrgLimit} most-starred repositories per GitHub organization.
      </DvSourceNote>
    </>
  )
}
