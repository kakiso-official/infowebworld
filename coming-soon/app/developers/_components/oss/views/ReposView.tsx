import type { Metadata } from 'next'
import { faBuilding, faCodeBranch, faLanguage, faStar } from '@fortawesome/free-solid-svg-icons'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { pageSlice, type OssStore } from '@/lib/developers/oss'
import {
  PAGE_SIZE, lastPage, ossFacetIndexPath, ossFacetPath, ossReposPath, resolvePageParam,
} from '@/lib/developers/paths'
import { isReposPageIndexable } from '@/lib/developers/indexing'
import { devCrumbs, listNode } from '@/lib/developers/jsonld'
import { devPageMetadata, devUnavailableMetadata, devNotFoundMetadata, reposRankingSeo } from '@/lib/developers/seo'
import { getOss } from '@/lib/developers/store'
import { resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvStatStrip from '../../shell/DvStatStrip'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvPagination from '../../shell/DvPagination'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvFacetChips from '../../ui/DvFacetChips'
import RepoRankTable, { repoRankRow } from '../RepoRankTable'
import RepoFilterBar from '../RepoFilterBar'
import { languageOptions } from './options'

/* ═══════════════════════════════════════════════════════════════════════
   Most-starred repositories (spec 3.8):
     /developers/open-source/repos            page 1
     /developers/open-source/repos/page/{n}   48 per page; /page/1 308s to
                                              the clean URL, past the end 404s
   Pages 1-10 are indexed, deeper pages are noindex, follow.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ReposPage {
  store: OssStore
  page: number
  last: number
}

/** Resolve the ranking page for an optional /page/{n} param. */
export function resolveReposPage(rawPage?: string): Promise<Resolved<ReposPage>> {
  return resolveSafely<ReposPage>(async () => {
    const store = await getOss()
    const last = lastPage(store.reposAll.length, PAGE_SIZE.repos)
    if (rawPage === undefined) return { kind: 'ok', value: { store, page: 1, last } }
    const r = resolvePageParam(rawPage, last)
    if (r.kind === 'not-found') return { kind: 'not-found' }
    if (r.kind === 'redirect-first') return { kind: 'redirect', path: ossReposPath() }
    return { kind: 'ok', value: { store, page: r.page, last } }
  })
}

export function reposMetadata(res: Resolved<ReposPage>): Metadata {
  if (res.kind === 'unavailable') {
    return devUnavailableMetadata(ossReposPath(), reposRankingSeo({ repos: 0, companies: 0, dataAt: '' }))
  }
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { store, page } = res.value
  const seo = reposRankingSeo({ repos: store.totals.repos, companies: store.totals.companies, dataAt: store.dataAt, page })
  return devPageMetadata(ossReposPath(page), seo, isReposPageIndexable(page))
}

const BODY_ID = 'dv-repos-rows'

export default function ReposView({ store, page, last }: ReposPage) {
  const seo = reposRankingSeo({ repos: store.totals.repos, companies: store.totals.companies, dataAt: store.dataAt, page })
  const path = ossReposPath(page)
  const crumbs = devCrumbs.reposRanking()
  const repos = pageSlice(store.reposAll, page, PAGE_SIZE.repos)
  const rows = repos.map(r => repoRankRow(store, r))
  const start = (page - 1) * PAGE_SIZE.repos + 1
  const end = start + rows.length - 1
  const topLanguages = store.facets.language.filter(f => f.indexable).slice(0, 12)

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[
          listNode(path, `Most-starred open source projects from companies, ${formatNumber(start)} to ${formatNumber(end)}`,
            rows.map(r => ({ name: r.nameWithOwner, url: r.href }))),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={seo.h1}
        width="wide"
        lead={`Every public, non-fork repository we track from ${formatNumber(store.totals.companies)} companies, ranked by GitHub stars. Open one to see the company behind it, its license, languages and how to contribute.`}
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'Repositories', value: store.totals.repos, icon: faCodeBranch },
              { label: 'Companies', value: store.totals.companies, icon: faBuilding },
              { label: 'GitHub stars', value: store.totals.stars, icon: faStar, format: 'compact' },
              { label: 'Languages', value: store.totals.languages, icon: faLanguage },
            ]}
          />
        )}
      />

      <DvBand tone="white" width="wide" id="dv-repos-list" label="Repositories ranked by GitHub stars" tight>
        <p className="dv-small dv-muted dv-list-note">Ranked by GitHub stars, the only popularity number GitHub publishes.</p>
        <RepoFilterBar target={BODY_ID} languages={languageOptions(repos)} label="Filter the repositories on this page" />
        <RepoRankTable
          rows={rows}
          rankStart={start}
          dataAt={store.dataAt}
          bodyId={BODY_ID}
          caption={`Showing ${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(store.totals.repos)} repositories, ranked by GitHub stars`}
        />
        <DvPagination page={page} last={last} hrefFor={p => ossReposPath(p)} label="Repository ranking pages" />
      </DvBand>

      {topLanguages.length > 0 && (
        <DvBand tone="wash" id="dv-repos-languages" title="Most-starred projects by language">
          <DvFacetChips
            label="Languages"
            items={topLanguages.map(f => ({ label: f.name, href: ossFacetPath('language', f.slug), count: f.repos, dot: f.color ?? null }))}
            more={{ label: 'All languages', href: ossFacetIndexPath('language') }}
            scroll={false}
          />
        </DvBand>
      )}

      <DvSourceNote>
        GitHub data as of {formatDate(store.dataAt)}, from the GitHub GraphQL API. Forks are excluded, and we track up
        to {store.meta.reposPerOrgLimit} most-starred repositories per GitHub organization.
      </DvSourceNote>
    </>
  )
}
