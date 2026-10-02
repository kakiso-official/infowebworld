import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleMinus } from '@fortawesome/free-solid-svg-icons'

/* Styles: app/styles/home/comparison.css — imported by the homepage CSS
   barrel (app/styles/home.css) as part of the integration step, not here. */

/* ═══════════════════════════════════════════════════════════════════════
   "Smarter Way to Find and List Businesses" comparison table section
   — replaces the old "Why trust InfoWebWorld" banner on the homepage and
   on the AI tools directory (which passes its own heading/sub/caption).

   A real semantic <table> (not divs) so crawlers and AI answer engines
   can read the InfoWebWorld-vs-typical-directory comparison directly.
   ═══════════════════════════════════════════════════════════════════════ */

type Row = {
  feature: string
  iww: string
  typical: string
  /** Whether the "typical directory" cell reads as a positive ("Yes") or a
   *  caveat/negative ("Often...", "Rare") — drives which icon/tone it gets. */
  typicalPositive: boolean
}

const ROWS: Row[] = [
  {
    feature: 'Free listing',
    iww: 'Yes, no credit card',
    typical: 'Yes',
    typicalPositive: true,
  },
  {
    feature: 'Human-verified listings',
    iww: 'Yes',
    typical: 'Often automated',
    typicalPositive: false,
  },
  {
    feature: 'Verified reviews',
    iww: 'Yes',
    typical: 'Often none',
    typicalPositive: false,
  },
  {
    feature: 'Permanent dofollow backlink',
    iww: 'Yes, on paid plans',
    typical: 'Often nofollow or time-limited',
    typicalPositive: false,
  },
  {
    feature: 'Lead management and RFQ tools',
    iww: 'Yes, on paid plans',
    typical: 'Rare',
    typicalPositive: false,
  },
  {
    feature: 'Product and company comparison',
    iww: 'Yes',
    typical: 'Rare',
    typicalPositive: false,
  },
  {
    feature: 'AI-search-ready schema profiles',
    iww: 'Yes',
    typical: 'Rare',
    typicalPositive: false,
  },
]

export interface ComparisonTableSectionProps {
  heading?: string
  /** Optional line under the heading (the homepage has none). */
  sub?: string
  /** Visually hidden <caption> naming what the table compares. */
  caption?: string
}

export default function ComparisonTableSection({
  heading = 'Smarter Way to Find and List Businesses',
  sub,
  caption = 'InfoWebWorld compared with a typical free business directory',
}: ComparisonTableSectionProps = {}) {
  return (
    <section className="hm-vs" aria-labelledby="hm-vs-h">
      <div className="hm-vs-inner">
        <div className="hm-vs-head">
          <h2 id="hm-vs-h" className="hm-vs-title">{heading}</h2>
          {sub ? <p className="hm-vs-sub">{sub}</p> : null}
        </div>

        <div className="hm-vs-card">
          <div className="hm-vs-scroll">
            <table className="hm-vs-table">
              <caption className="hm-vs-caption">
                {caption}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col" className="hm-vs-th-iww">InfoWebWorld</th>
                  <th scope="col">Typical free directory</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(row => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {/* Cells stay display:table-cell; the icon + text row is
                        laid out by an inner .hm-vs-cell flex wrapper (a flex
                        <td> would drop out of the table's column layout). */}
                    <td className="hm-vs-td-iww">
                      <span className="hm-vs-cell">
                        <FontAwesomeIcon icon={faCircleCheck} className="hm-vs-ico hm-vs-ico-yes" aria-hidden="true" />
                        <span>{row.iww}</span>
                      </span>
                    </td>
                    <td className="hm-vs-td-typical">
                      <span className="hm-vs-cell">
                        {row.typicalPositive ? (
                          <FontAwesomeIcon icon={faCircleCheck} className="hm-vs-ico hm-vs-ico-muted" aria-hidden="true" />
                        ) : (
                          <FontAwesomeIcon icon={faCircleMinus} className="hm-vs-ico hm-vs-ico-soft" aria-hidden="true" />
                        )}
                        <span>{row.typical}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
