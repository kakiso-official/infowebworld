import type { Metadata } from 'next'
import { faBuilding, faCodeBranch, faLanguage, faSeedling } from '@fortawesome/free-solid-svg-icons'
import { countLabel, formatDate, formatNumber } from '@/lib/developers/format'
import {
  companiesByIssueCount, companyAvatar, issueStats, repoKey, type GfiLanguage, type OssStore,
} from '@/lib/developers/oss'
import { gfiPath, ossCompanyPath, ossFacetPath } from '@/lib/developers/paths'
import { isGfiIndexable } from '@/lib/developers/indexing'
import { devCrumbs, devHowToNode, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { devNotFoundMetadata, devPageMetadata, devUnavailableMetadata, gfiSeo, noDash } from '@/lib/developers/seo'
import { getOss } from '@/lib/developers/store'
import { gfiFaqs } from '@/lib/developers/copy/faqs'
import type { OssIssue } from '@/lib/developers/types'
import { canonicalSlug, resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvStatStrip from '../../shell/DvStatStrip'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvEmpty from '../../shell/DvEmpty'
import DvFaq from '../../shell/DvFaq'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvFacetChips from '../../ui/DvFacetChips'
import IssueCard, { issueCardData } from '../IssueCard'
import IssueFilterBar from '../IssueFilterBar'
import CompanyChips from '../CompanyChips'
import ContributeSteps, { contributeSteps } from '../ContributeSteps'

/* ═══════════════════════════════════════════════════════════════════════
   Good first issues (spec 3.12):
     /developers/open-source/good-first-issues              every language
     /developers/open-source/good-first-issues/{language}   one language

   Every open issue labelled "good first issue" in the tracked repositories,
   opened within 180 days of the snapshot, newest first, each linking to
   the real issue on GitHub. All cards are in the HTML; IssueFilterBar only
   hides and reorders them. A language page exists while the language has
   at least one issue and is indexed from 5 (the all-languages page from 20).
   ═══════════════════════════════════════════════════════════════════════ */

export interface IssuesPage {
  store: OssStore
  /** null = every language. */
  language: GfiLanguage | null
}

export function resolveIssuesPage(rawLanguage?: string): Promise<Resolved<IssuesPage>> {
  return resolveSafely<IssuesPage>(async () => {
    const store = await getOss()
    if (rawLanguage === undefined) return { kind: 'ok', value: { store, language: null } }
    const slug = canonicalSlug(rawLanguage)
    const language = store.gfiLanguages.find(l => l.slug === slug)
    if (!language) return { kind: 'not-found' }
    if (slug !== rawLanguage) return { kind: 'redirect', path: gfiPath(slug) }
    return { kind: 'ok', value: { store, language } }
  })
}

function issuesOf(store: OssStore, language: GfiLanguage | null): readonly OssIssue[] {
  return language ? store.issuesByLanguage.get(language.slug) ?? [] : store.issues
}

function seoFor(store: OssStore, language: GfiLanguage | null) {
  const stats = issueStats(issuesOf(store, language), store)
  return { stats, seo: gfiSeo({ ...stats, dataAt: store.dataAt, language }) }
}

export function issuesMetadata(res: Resolved<IssuesPage>, rawLanguage?: string): Metadata {
  if (res.kind === 'unavailable') {
    const lang = rawLanguage ? canonicalSlug(rawLanguage) : null
    return devUnavailableMetadata(gfiPath(lang), gfiSeo({ issues: 0, repos: 0, companies: 0, dataAt: '', language: lang ? { name: lang } : null }))
  }
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { store, language } = res.value
  const { stats, seo } = seoFor(store, language)
  return devPageMetadata(gfiPath(language?.slug), seo, isGfiIndexable(stats.issues, language !== null))
}

const BODY_ID = 'dv-gfi-rows'

export default function IssuesView({ store, language }: IssuesPage) {
  const issues = issuesOf(store, language)
  const { stats, seo } = seoFor(store, language)
  const path = gfiPath(language?.slug)
  const crumbs = devCrumbs.gfi(language)
  const cards = issues.map(i => issueCardData(store, i)).filter((c): c is NonNullable<typeof c> => c !== null)
  const langName = language ? noDash(language.name) : null

  /* The example `git clone` uses the repository of the newest issue. */
  const first = issues[0]
  const firstRepo = first ? store.repoByKey.get(repoKey(first.companySlug, first.repoSlug)) : undefined
  const steps = contributeSteps('issues', firstRepo ? { nameWithOwner: firstRepo.nameWithOwner, url: firstRepo.url } : null)
  const faqs = gfiFaqs({ dataAt: store.dataAt })

  const languageChips = store.gfiLanguages
    .filter(l => l.indexable)
    .map(l => ({ label: l.name, href: gfiPath(l.slug), count: l.issues, dot: l.color, current: l.slug === language?.slug }))
  const languageOptions = language
    ? undefined
    : store.gfiLanguages.map(l => ({ value: l.slug, label: l.name, count: l.issues }))
  const topCompanies = companiesByIssueCount(store, issues, 12).map(({ company, issues: n }) => ({
    name: company.name,
    href: ossCompanyPath(company.slug),
    avatarUrl: companyAvatar(company) || null,
    count: n,
    countLabel: countLabel(n, 'good first issue'),
  }))
  const languageFacet = language ? store.facetBySlug.language.get(language.slug) : undefined

  const lead = language
    ? `${countLabel(stats.issues, 'open good first issue')} in ${langName} from ${countLabel(stats.companies, 'company', 'companies')}' public repositories, as of ${formatDate(store.dataAt)}. Open one, read the thread, and comment before you start.`
    : `A good first issue is a small, well-described task that maintainers have marked as a safe place to start. These ${formatNumber(stats.issues)} issues come from ${countLabel(stats.companies, 'company', 'companies')}' public repositories, as of ${formatDate(store.dataAt)}. Open one, read the thread, and comment before you start.`

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[
          listNode(path, seo.h1, cards.slice(0, 50).map(c => ({ name: c.title, url: c.url }))),
          devHowToNode(path, {
            name: 'How to make your first open source contribution',
            description: 'Five steps from picking a good first issue to opening your first pull request.',
            steps: steps.map(s => ({ name: s.name, text: s.code ? `${s.text} ${s.code}` : s.text })),
          }),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={seo.h1}
        width="wide"
        lead={lead}
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
        below={(
          <>
            <DvStatStrip
              items={[
                { label: 'Open issues', value: stats.issues, icon: faSeedling },
                { label: 'Repositories', value: stats.repos, icon: faCodeBranch },
                { label: 'Companies', value: stats.companies, icon: faBuilding },
                ...(language ? [] : [{ label: 'Languages', value: stats.languages, icon: faLanguage }]),
              ]}
            />
            {languageChips.length > 0 && (
              <DvFacetChips
                label="Good first issues by language"
                items={languageChips}
                more={language ? { label: 'All languages', href: gfiPath() } : undefined}
              />
            )}
          </>
        )}
      />

      <DvBand tone="white" width="wide" id="dv-gfi-list" label={language ? `Good first ${langName} issues` : 'Good first issues'} tight>
        {cards.length > 0 ? (
          <>
            <IssueFilterBar target={BODY_ID} languages={languageOptions} />
            <div id={BODY_ID} className="dv-grid dv-grid--2 dv-issuegrid">
              {cards.map(c => <IssueCard key={c.url} issue={c} dataAt={store.dataAt} />)}
            </div>
          </>
        ) : (
          <DvEmpty
            icon={faSeedling}
            title={`No open good first issues in ${langName ?? 'these repositories'} right now.`}
            text="New ones are added as maintainers label them. Try another language."
            action={<a className="dv-btn dv-btn--secondary dv-btn--sm" href={gfiPath()}>All good first issues</a>}
          />
        )}
        {languageFacet && (
          <p className="dv-small dv-muted dv-list-note-end">
            Looking for more {langName} code? See all <a href={ossFacetPath('language', languageFacet.slug)}>{formatNumber(languageFacet.repos)} open source {langName} projects from companies</a>.
          </p>
        )}
      </DvBand>

      <DvBand tone="wash" id="dv-gfi-how" title="How to make your first contribution" sub="Five steps, from picking an issue to your first pull request.">
        <ContributeSteps steps={steps} />
      </DvBand>

      {topCompanies.length > 0 && (
        <DvBand tone="white" id="dv-gfi-companies" title="Companies with the most good first issues">
          <CompanyChips items={topCompanies} label="Companies with the most good first issues" />
        </DvBand>
      )}

      <DvFaq heading="Good first issue FAQs" faqs={faqs} tone="wash" />

      <DvSourceNote>
        Open issues labelled &quot;good first issue&quot; in the tracked repositories, up to 10 per GitHub organization,
        opened in the 180 days before {formatDate(store.snapshotAt)}. Collected from the GitHub API; each card links to
        the real issue.
      </DvSourceNote>
    </>
  )
}
