type Props = {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  color: string
}

export default function Pagination({ page, totalPages, onPageChange, color }: Props) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="cd-pagination">
      <button
        className="cd-pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {pages.map((p, i) => p === '...' ? (
        <span key={`e${i}`} className="cd-pagination-ellipsis">&hellip;</span>
      ) : (
        <button
          key={p}
          className={`cd-pagination-num${p === page ? ' cd-pagination-num--active' : ''}`}
          style={p === page ? { background: color, borderColor: 'transparent' } : undefined}
          onClick={() => onPageChange(p as number)}
        >
          {p}
        </button>
      ))}

      <button
        className="cd-pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next page
      </button>
    </nav>
  )
}
