import type { OssRepo } from '@/lib/developers/types'
import { formatNumber } from '@/lib/developers/format'
import { LicenseBadge } from '../ui/Badges'
import DvTime from '../ui/DvTime'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   "At a glance" for a repository page (spec 3.7, 4.5): a two-column <dl>
   of GitHub facts. Numbers print in full (this is the reference block);
   a fact GitHub does not have reads in muted text instead of being left
   out, so the card keeps its shape.
   ═══════════════════════════════════════════════════════════════════════ */

export interface RepoFactsCardProps {
  repo: Pick<OssRepo, 'stars' | 'forks' | 'openIssues' | 'goodFirstIssues' | 'license' | 'createdAt' | 'pushedAt' | 'latestRelease' | 'homepageUrl' | 'url'>
  className?: string
}

/** GitHub release page of a tag. Monorepo tags keep their '/' and '@'
 *  ('@scope/pkg@1.2.3'), which GitHub routes unescaped. */
export function releaseUrl(repoUrl: string, tag: string): string {
  return `${repoUrl}/releases/tag/${encodeURIComponent(tag).replace(/%2F/gi, '/').replace(/%40/g, '@')}`
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function RepoFactsCard({ repo, className }: RepoFactsCardProps) {
  const rel = repo.latestRelease
  return (
    <dl className={`dv-facts${className ? ` ${className}` : ''}`}>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Stars</dt>
        <dd className="dv-facts-value">{formatNumber(repo.stars)}</dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Forks</dt>
        <dd className="dv-facts-value">{formatNumber(repo.forks)}</dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Open issues</dt>
        <dd className="dv-facts-value">{formatNumber(repo.openIssues)}</dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Good first issues</dt>
        <dd className="dv-facts-value">{formatNumber(repo.goodFirstIssues)}</dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">License</dt>
        <dd className="dv-facts-value"><LicenseBadge spdx={repo.license} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Created</dt>
        <dd className="dv-facts-value"><DvTime iso={repo.createdAt} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Last push</dt>
        <dd className="dv-facts-value"><DvTime iso={repo.pushedAt} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Latest release</dt>
        <dd className="dv-facts-value">
          {rel ? (
            <>
              <DvExternalLink href={releaseUrl(repo.url, rel.tag)}><code>{rel.tag}</code></DvExternalLink>
              <span className="dv-facts-sub"><DvTime iso={rel.publishedAt} /></span>
            </>
          ) : (
            <span className="dv-facts-value--muted">No releases</span>
          )}
        </dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Homepage</dt>
        <dd className="dv-facts-value">
          {repo.homepageUrl
            ? <DvExternalLink href={repo.homepageUrl}>{hostOf(repo.homepageUrl)}</DvExternalLink>
            : <span className="dv-facts-value--muted">None listed</span>}
        </dd>
      </div>
    </dl>
  )
}
