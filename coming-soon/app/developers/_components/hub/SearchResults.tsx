import type { CSSProperties } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeBranch, faCubes, faLayerGroup, faPlug, faTag } from '@fortawesome/free-solid-svg-icons'
import type { SearchHit, SearchKind, SearchResponse } from '@/lib/developers/types'
import { formatNumber } from '@/lib/developers/format'
import OrgAvatar from '../ui/OrgAvatar'
import { langStyle } from '../ui/LanguageDot'

/* ═══════════════════════════════════════════════════════════════════════
   Full search results (spec 3.3), grouped in the dropdown's order: Free
   APIs, Companies, Repositories, SDKs, then categories, languages and
   topics. Each group is a <section> with its count and is left out when
   empty. Rows link to our pages; an unreviewed API links out (new tab).
   ═══════════════════════════════════════════════════════════════════════ */

const GROUPS: ReadonlyArray<{ key: keyof SearchResponse['groups']; label: string }> = [
  { key: 'apis', label: 'Free APIs' },
  { key: 'companies', label: 'Companies' },
  { key: 'repos', label: 'Repositories' },
  { key: 'sdks', label: 'SDKs' },
  { key: 'other', label: 'Categories, languages and topics' },
]

const KIND_ICON: Record<SearchKind, IconDefinition> = {
  api: faPlug,
  company: faLayerGroup,
  repo: faCodeBranch,
  sdk: faCubes,
  category: faLayerGroup,
  language: faCodeBranch,
  topic: faTag,
}

const KIND_LABEL: Partial<Record<SearchKind, string>> = {
  category: 'API category',
  language: 'Language',
  topic: 'Topic',
}

function Media({ hit }: { hit: SearchHit }) {
  if (hit.avatar !== undefined && (hit.kind === 'company' || hit.kind === 'repo')) {
    return <OrgAvatar src={hit.avatar} name={hit.label} size={32} />
  }
  if (hit.kind === 'language') {
    return <span className="dv-result-media" aria-hidden="true"><span className="dv-lang-dot" style={langStyle(hit.color) as CSSProperties} /></span>
  }
  return <span className="dv-result-media" aria-hidden="true"><FontAwesomeIcon icon={KIND_ICON[hit.kind]} /></span>
}

export default function SearchResults({ results }: { results: SearchResponse }) {
  return (
    <div className="dv-results">
      {GROUPS.map(g => {
        const hits = results.groups[g.key]
        if (!hits.length) return null
        const headingId = `dv-results-${g.key}`
        return (
          <section key={g.key} className="dv-results-group" aria-labelledby={headingId}>
            <h2 id={headingId} className="dv-results-title">
              {g.label} <span className="dv-results-count">{formatNumber(hits.length)}</span>
            </h2>
            <ul className="dv-results-list">
              {hits.map(hit => (
                <li key={`${hit.kind}:${hit.href}`}>
                  <a
                    className="dv-result"
                    href={hit.href}
                    {...(hit.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Media hit={hit} />
                    <span className="dv-result-text">
                      <span className="dv-result-label">
                        {hit.mono ? <code>{hit.label}</code> : hit.label}
                        {hit.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </span>
                      <span className="dv-result-sub">
                        {KIND_LABEL[hit.kind] && <>{KIND_LABEL[hit.kind]}{hit.sub ? ' - ' : ''}</>}
                        {hit.sub}
                      </span>
                    </span>
                    {hit.meta && <span className="dv-result-meta">{hit.meta}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
