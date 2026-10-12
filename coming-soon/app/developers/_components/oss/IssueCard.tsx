import type { GhLanguage, OssIssue } from '@/lib/developers/types'
import { formatNumber, parseIsoDate } from '@/lib/developers/format'
import { companyAvatar, repoKey, repoLanguageSlug, type OssStore } from '@/lib/developers/oss'
import { ossCompanyPath, ossRepoPath } from '@/lib/developers/paths'
import LanguageDot from '../ui/LanguageDot'
import OrgAvatar from '../ui/OrgAvatar'
import DvTime from '../ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   Good first issue card (spec 4.5): "{Company} / repo", the issue title
   (2 lines, links to the real issue on GitHub, new tab), its other labels
   as plain text chips (GitHub label colours fail contrast, so they are
   not reused) and "Opened 3 days ago - 2 comments - Go".

   The company and repository names link to our pages (raised above the
   stretched title link). `compact` drops the avatar (repo pages list
   their own issues). No inline SVG per card (the all-languages page lists
   ~300): the new-tab mark is the shared CSS .dv-ext-mark. Cards carry
   data-* values for IssueFilterBar: data-lang, data-nocomments,
   data-comments, data-created, data-stars.
   ═══════════════════════════════════════════════════════════════════════ */

export interface IssueCardData {
  title: string
  url: string
  labels: readonly string[]
  createdAt: string
  comments: number
  companyName: string
  companyHref: string
  companyAvatarUrl: string | null
  repoName: string
  repoHref: string
  repoStars: number
  language: GhLanguage | null
  langSlug: string | null
}

/* Every listed issue carries a good-first-issue label; repeating it on
   each card says nothing. */
const GFI_LABEL_RE = /^good[\s-]+first[\s-]+issues?$/i

/** Card data for one issue of the open-source store (null when its repo
 *  or company is not in the snapshot). */
export function issueCardData(store: OssStore, issue: OssIssue): IssueCardData | null {
  const repo = store.repoByKey.get(repoKey(issue.companySlug, issue.repoSlug))
  const company = store.companyBySlug.get(issue.companySlug)
  if (!repo || !company) return null
  return {
    title: issue.title,
    url: issue.url,
    labels: issue.labels.filter(l => !GFI_LABEL_RE.test(l.trim())).slice(0, 3),
    createdAt: issue.createdAt,
    comments: issue.comments,
    companyName: company.name,
    companyHref: ossCompanyPath(company.slug),
    companyAvatarUrl: companyAvatar(company) || null,
    repoName: repo.name,
    repoHref: ossRepoPath(repo.companySlug, repo.slug),
    repoStars: repo.stars,
    language: repo.primaryLanguage,
    langSlug: repoLanguageSlug(repo),
  }
}

export interface IssueCardProps {
  issue: IssueCardData
  dataAt: string
  compact?: boolean
  /** Heading level of the title (default 3). */
  headingLevel?: 3 | 4
  className?: string
}

export default function IssueCard({ issue, dataAt, compact = false, headingLevel = 3, className }: IssueCardProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const created = parseIsoDate(issue.createdAt)?.getTime() ?? 0
  return (
    <article
      className={`dv-card dv-card--link dv-issuecard${compact ? ' dv-issuecard--compact' : ''}${className ? ` ${className}` : ''}`}
      data-row=""
      data-lang={issue.langSlug ?? ''}
      data-nocomments={issue.comments === 0 ? '1' : '0'}
      data-comments={issue.comments}
      data-created={created}
      data-stars={issue.repoStars}
    >
      <p className="dv-issuecard-repo">
        {!compact && <OrgAvatar src={issue.companyAvatarUrl} name={issue.companyName} size={20} />}
        {!compact && (
          <>
            <a className="dv-card-raise" href={issue.companyHref}>{issue.companyName}</a>
            <span className="dv-issuecard-sep" aria-hidden="true">/</span>
          </>
        )}
        <a className="dv-card-raise" href={issue.repoHref}><code>{issue.repoName}</code></a>
      </p>
      <Heading className="dv-issuecard-title">
        <a href={issue.url} className="dv-card-stretch" target="_blank" rel="noopener noreferrer">
          {issue.title}
          <span className="dv-ext-mark" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Heading>
      {issue.labels.length > 0 && (
        <ul className="dv-issuecard-labels" aria-label="Labels">
          {issue.labels.map(l => <li key={l} className="dv-chip dv-chip--static dv-chip--sm">{l}</li>)}
        </ul>
      )}
      <p className="dv-issuecard-meta">
        <span>Opened <DvTime iso={issue.createdAt} format="age" snapshot={dataAt} /></span>
        <span>{formatNumber(issue.comments)} {issue.comments === 1 ? 'comment' : 'comments'}</span>
        {issue.language && <LanguageDot name={issue.language.name} color={issue.language.color} />}
      </p>
    </article>
  )
}
