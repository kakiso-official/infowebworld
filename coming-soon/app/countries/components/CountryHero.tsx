import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEarthAmericas, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { flagUrl } from '@/lib/country-paths'
import type { Crumb } from '../seo'

/* ═══════════════════════════════════════════════════════════════════════
   Country directory hero - the shared .tlp-hero shell (same glow + dot
   grid as the homepage and the sector directories) with a large flag,
   a small visible breadcrumb, the H1, stat badges and two CTAs. Server
   component; no search box (these pages are browse pages).
   ═══════════════════════════════════════════════════════════════════════ */

export type HeroStat = { icon: IconDefinition; text: string }
export type HeroCta = { label: string; href: string }

export default function CountryHero({
  flagCode, flagAlt, crumbs, title, sub, stats, primary, secondary,
}: {
  /** ISO2 code; omitted (or unusable) → a globe icon instead of a flag. */
  flagCode?: string
  flagAlt?: string
  crumbs: Crumb[]
  title: string
  sub: string
  stats: HeroStat[]
  primary?: HeroCta
  secondary?: HeroCta
}) {
  const code = (flagCode || '').trim()
  const hasFlag = /^[a-z]{2}$/i.test(code) && code.toUpperCase() !== 'XX'

  return (
    <section className="tlp-hero cdir-hero" aria-labelledby="cdir-hero-h">
      <div className="tlp-hero-bg" aria-hidden="true">
        <div className="tlp-hero-glow" />
        <div className="tlp-hero-grid" />
      </div>

      <div className="tlp-hero-inner cdir-hero-inner">
        <nav className="cdir-crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1
              return (
                <li key={c.path}>
                  {last
                    ? <span aria-current="page">{c.name}</span>
                    : <Link href={c.path}>{c.name}</Link>}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="cdir-hero-flag" aria-hidden={hasFlag ? undefined : 'true'}>
          {hasFlag ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flagUrl(code, 160)}
              srcSet={`${flagUrl(code, 160)} 1x, ${flagUrl(code, 320)} 2x`}
              width={96}
              height={72}
              alt={flagAlt || ''}
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <span className="cdir-hero-globe"><FontAwesomeIcon icon={faEarthAmericas} /></span>
          )}
        </div>

        <h1 id="cdir-hero-h" className="tlp-hero-title hm-hero-title cdir-hero-title">{title}</h1>
        <p className="tlp-hero-sub cdir-hero-sub">{sub}</p>

        {stats.length > 0 && (
          <ul className="hm-hero-badges cdir-hero-badges">
            {stats.map(s => (
              <li key={s.text} className="hm-hero-badge">
                <span className="hm-hero-badge-ico" aria-hidden="true">
                  <FontAwesomeIcon icon={s.icon} />
                </span>
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
        )}

        {(primary || secondary) && (
          <div className="hm-hero-cta-row">
            {primary && (
              <Link href={primary.href} className="hm-btn hm-btn-primary">
                <span>{primary.label}</span>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="hm-btn hm-btn-secondary">
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
