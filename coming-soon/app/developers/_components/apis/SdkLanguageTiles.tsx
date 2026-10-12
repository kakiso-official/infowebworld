import type { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type { SdkLanguageStat } from '@/lib/developers/apis'
import { countLabel } from '@/lib/developers/format'
import { sdkPath } from '@/lib/developers/paths'
import { REGISTRY_LABELS } from '@/lib/developers/snippets'
import { languageIcon } from '@/lib/developers/taxonomy'

/* ═══════════════════════════════════════════════════════════════════════
   One tile per SDK language (spec 3.13 band 5, 3.17): the language's own
   Font Awesome mark where it has one (faCode otherwise), how many official
   SDKs and APIs, and the registries they come from. Each tile links to
   /developers/free-apis/sdks/{language}.
   ═══════════════════════════════════════════════════════════════════════ */

export interface SdkLanguageTilesProps {
  stats: readonly SdkLanguageStat[]
  label?: string
  className?: string
}

const TILE = { '--dv-tile': '48px' } as CSSProperties

export default function SdkLanguageTiles({ stats, label = 'SDKs by language', className }: SdkLanguageTilesProps) {
  if (!stats.length) return null
  return (
    <ul className={`dv-grid dv-grid--4 dv-sdktiles${className ? ` ${className}` : ''}`} aria-label={label}>
      {stats.map(s => {
        const registries = s.registries.map(r => REGISTRY_LABELS[r]).filter(r => r !== 'Other')
        return (
          <li key={s.slug}>
            <article className="dv-card dv-card--link dv-cat-tile">
              <span className="dv-icon-tile" style={TILE} aria-hidden="true">
                <FontAwesomeIcon icon={languageIcon(s.slug)} />
              </span>
              <div className="dv-cat-tile-body">
                <span className="dv-cat-tile-name">
                  <a className="dv-card-stretch" href={sdkPath(s.slug)}>{s.name}</a>
                </span>
                <span className="dv-cat-tile-meta">
                  <strong>{s.official > 0 ? countLabel(s.official, 'official SDK') : countLabel(s.sdks, 'community library', 'community libraries')}</strong>
                  {s.apis > 0 && <> &middot; {countLabel(s.apis, 'API')}</>}
                </span>
                {registries.length > 0 && <span className="dv-cat-tile-meta">{registries.join(', ')}</span>}
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="dv-cat-tile-arrow" aria-hidden="true" />
            </article>
          </li>
        )
      })}
    </ul>
  )
}
