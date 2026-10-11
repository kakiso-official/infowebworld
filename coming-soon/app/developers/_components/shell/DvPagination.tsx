import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Pagination (spec 4.13): first, last, current +-1 and ellipses; 40px
   squares; the current page is filled with aria-current="page"; Prev and
   Next carry rel="prev"/"next" and render as inert spans at the ends.

   `hrefFor(1)` must return the clean URL (paths.ts builders already do:
   ossReposPath(1) === '/developers/open-source/repos').
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvPaginationProps {
  page: number
  last: number
  hrefFor: (page: number) => string
  /** Accessible name ('Repositories pages'). */
  label?: string
  className?: string
}

/* 1 ... 4 5 6 ... 17. A gap of exactly one page shows that page instead
   of an ellipsis (an ellipsis hiding one number helps nobody). */
function pageWindow(page: number, last: number): Array<number | 'gap'> {
  const want = new Set([1, last, page - 1, page, page + 1].filter(n => n >= 1 && n <= last))
  const sorted = [...want].sort((a, b) => a - b)
  const out: Array<number | 'gap'> = []
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1]
    if (prev !== undefined) {
      if (n - prev === 2) out.push(prev + 1)
      else if (n - prev > 2) out.push('gap')
    }
    out.push(n)
  })
  return out
}

export default function DvPagination({ page, last, hrefFor, label = 'Pages', className }: DvPaginationProps) {
  if (last <= 1) return null
  const current = Math.min(Math.max(1, page), last)
  const items = pageWindow(current, last)

  return (
    <nav className={`dv-pager${className ? ` ${className}` : ''}`} aria-label={label}>
      <ul className="dv-pager-list">
        <li>
          {current > 1 ? (
            <a className="dv-pager-item dv-pager-step" href={hrefFor(current - 1)} rel="prev">
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              <span className="dv-pager-step-text">Previous</span>
              <span className="sr-only"> page</span>
            </a>
          ) : (
            <span className="dv-pager-item dv-pager-step" aria-disabled="true">
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              <span className="dv-pager-step-text">Previous</span>
            </span>
          )}
        </li>
        {items.map((it, i) => (
          <li key={it === 'gap' ? `gap-${i}` : it}>
            {it === 'gap' ? (
              <span className="dv-pager-gap" aria-hidden="true">...</span>
            ) : it === current ? (
              <a className="dv-pager-item" href={hrefFor(it)} aria-current="page">
                <span className="sr-only">Page </span>{it}
              </a>
            ) : (
              <a className="dv-pager-item" href={hrefFor(it)}>
                <span className="sr-only">Page </span>{it}
              </a>
            )}
          </li>
        ))}
        <li>
          {current < last ? (
            <a className="dv-pager-item dv-pager-step" href={hrefFor(current + 1)} rel="next">
              <span className="dv-pager-step-text">Next</span>
              <span className="sr-only"> page</span>
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
            </a>
          ) : (
            <span className="dv-pager-item dv-pager-step" aria-disabled="true">
              <span className="dv-pager-step-text">Next</span>
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
      <p className="dv-pager-status">Page {current} of {last}</p>
    </nav>
  )
}
