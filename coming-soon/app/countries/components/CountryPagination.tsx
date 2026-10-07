import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

/* Numbered pagination as plain crawlable links (page 1 = the clean URL,
   never ?page=1). Window: first, last, current ±1, with ellipses. */
function pageItems(page: number, total: number): (number | 'gap')[] {
  const set = new Set<number>([1, total, page - 1, page, page + 1])
  if (page <= 3) { set.add(2); set.add(3); set.add(4) }
  if (page >= total - 2) { set.add(total - 1); set.add(total - 2); set.add(total - 3) }
  const nums = [...set].filter(n => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('gap')
    out.push(n)
  })
  return out
}

export default function CountryPagination({
  page, totalPages, hrefFor, label,
}: {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
  label: string
}) {
  if (totalPages <= 1) return null
  const items = pageItems(page, totalPages)
  return (
    <nav className="cdir-pager" aria-label={label}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="cdir-pager-step" rel="prev" aria-label="Previous page">
          <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="cdir-pager-step is-disabled" aria-hidden="true">
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Previous</span>
        </span>
      )}

      <ol className="cdir-pager-list">
        {items.map((it, i) =>
          it === 'gap' ? (
            <li key={`gap-${i}`} className="cdir-pager-gap" aria-hidden="true">…</li>
          ) : (
            <li key={it}>
              {it === page ? (
                <span className="cdir-pager-num is-current" aria-current="page">{it}</span>
              ) : (
                <Link href={hrefFor(it)} className="cdir-pager-num" aria-label={`Page ${it}`}>{it}</Link>
              )}
            </li>
          ),
        )}
      </ol>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="cdir-pager-step" rel="next" aria-label="Next page">
          <span>Next</span>
          <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
        </Link>
      ) : (
        <span className="cdir-pager-step is-disabled" aria-hidden="true">
          <span>Next</span>
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      )}
    </nav>
  )
}
