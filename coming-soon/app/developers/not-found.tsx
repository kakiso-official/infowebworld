import '@fortawesome/fontawesome-svg-core/styles.css'
import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPlug, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { BASE_URL } from '@/app/components/seo-schema'
import { countLabel } from '@/lib/developers/format'
import { freeApisPath, ossCompanyPath, ossHubPath } from '@/lib/developers/paths'
import { devNotFoundMetadata } from '@/lib/developers/seo'
import { tryGetOss } from '@/lib/developers/store'
import DvBand from './_components/shell/DvBand'
import DvHero from './_components/shell/DvHero'
import NotFoundPath from './_components/shell/NotFoundPath'
import DvSearchBox from './_components/search/DvSearchBox'
import OrgAvatar from './_components/ui/OrgAvatar'

/* ═══════════════════════════════════════════════════════════════════════
   Section 404 (spec 3.4), shown inside the developers layout (header,
   sub-nav and footer come from there) for every notFound() under
   /developers, including unknown deep paths ([...rest]).

   A terminal card shows the real answer for the address ("HTTP/2 404"),
   then the search box, both section hubs and the most-starred companies.
   The requested path is read in a tiny client island (NotFoundPath), so
   this file stays static; the company list comes from the local snapshot
   (no database) and is simply left out when it cannot be loaded.
   ═══════════════════════════════════════════════════════════════════════ */

/* Next applies a not-found file's own metadata on every notFound() render
   below this folder (after the layouts), so each 404 gets this title and
   'noindex, follow' whatever page threw it. */
export const metadata: Metadata = devNotFoundMetadata()

const SECTIONS = [
  {
    href: freeApisPath(),
    icon: faPlug,
    title: 'Free APIs and SDKs',
    text: 'Free APIs by category, each link checked, with free tiers and official SDKs.',
  },
  {
    href: ossHubPath(),
    icon: faGithub,
    title: 'Open source from companies',
    text: 'Public GitHub projects from real companies, by language, topic and country.',
  },
]

export default async function DevelopersNotFound() {
  const oss = await tryGetOss()
  const companies = oss ? oss.companies.slice(0, 6) : []

  const terminal = (
    <figure className="dv-terminal dv-nf-terminal">
      <div className="dv-terminal-bar" aria-hidden="true">
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-title">terminal</span>
      </div>
      <pre className="dv-terminal-body"><code>
        <span className="dv-prompt" aria-hidden="true">$</span>
        <span className="tk-cmd">curl</span> <span className="tk-flag">-I</span> <NotFoundPath origin={BASE_URL} />{'\n'}
        <span className="dv-terminal-muted">HTTP/2</span> <span className="dv-terminal-bad">404</span>{'\n'}
        <span className="dv-terminal-muted">content-type: text/html; charset=utf-8</span>{'\n'}
        {'\n'}
        <span className="tk-com"># There is no page at this address.</span>
      </code></pre>
      <figcaption className="sr-only">The server answer for this address: HTTP 404, page not found.</figcaption>
    </figure>
  )

  return (
    <>
      {/* The analytics tracker reports this view as a 404. */}
      <span data-iww-status="404" hidden />
      <DvHero
        variant="page"
        deco
        kicker="Error 404"
        kickerIcon={faTriangleExclamation}
        title="We could not find that page"
        lead="The link may be out of date, or the address may have a typo. Search free APIs, SDKs, companies and repositories, or start from a section below."
        aside={terminal}
        className="dv-nf-hero"
      >
        <DvSearchBox size="hero" />
      </DvHero>

      <DvBand tone="white" id="dv-nf-sections" title="Start from a section" tight>
        <ul className="dv-nf-links dv-nf-links--sections">
          {SECTIONS.map(s => (
            <li key={s.href}>
              <a className="dv-nf-link" href={s.href}>
                <span className="dv-nf-link-icon" aria-hidden="true"><FontAwesomeIcon icon={s.icon} /></span>
                <span className="dv-nf-link-text">
                  {s.title}
                  <span className="dv-nf-link-sub">{s.text}</span>
                </span>
                <FontAwesomeIcon icon={faArrowRight} className="dv-nf-link-arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </DvBand>

      {oss && companies.length > 0 && (
        <DvBand tone="wash" id="dv-nf-companies" title="Most-starred companies on GitHub" tight>
          <ul className="dv-nf-links">
            {companies.map(c => {
              const stats = oss.statsBySlug.get(c.slug)
              return (
                <li key={c.slug}>
                  <a className="dv-nf-link" href={ossCompanyPath(c.slug)}>
                    <OrgAvatar src={c.orgs[0]?.avatarUrl} name={c.name} size={40} />
                    <span className="dv-nf-link-text">
                      {c.name} open source
                      {stats && <span className="dv-nf-link-sub">{countLabel(stats.trackedRepos, 'repository', 'repositories')}</span>}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="dv-nf-link-arrow" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </DvBand>
      )}
    </>
  )
}
