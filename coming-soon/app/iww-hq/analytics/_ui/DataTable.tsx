'use client'
import { useMemo, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faDownload, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import type { MetricFormat } from '@/lib/analytics/types'
import { fmtMetric, fmtNumber } from '../_lib/format'
import { downloadCsv, type CsvCell } from '../_lib/csv'

export interface Column<T> {
  /** Unique id; also the sort key sent to the server in server mode. */
  key: string
  header: ReactNode
  /** CSV header text (default: header when it's a string, else key). */
  csvHeader?: string
  /** An <InfoTip /> rendered after the header. */
  tip?: ReactNode
  /** Default: 'right' for numeric columns (format or bar set), else 'left'. */
  align?: 'left' | 'right' | 'center'
  /** Raw value - used for sorting, the inline bar and CSV. */
  value?: (row: T) => number | string | null | undefined
  /** Cell content (default: value formatted with `format`). */
  render?: (row: T) => ReactNode
  /** Number format for the default render. */
  format?: MetricFormat
  /** CSV value (default: value(), else the rendered string when it is one). */
  csv?: (row: T) => CsvCell
  /** Default true when `value` is given. */
  sortable?: boolean
  /** First sort direction when the header is clicked. Default 'desc' for numbers, 'asc' for text. */
  firstDir?: 'asc' | 'desc'
  /** Draw a small bar behind the number, proportional to the column max (the table's primary metric). */
  bar?: boolean
  width?: number | string
  minWidth?: number | string
  /** Stick to the left edge while the table scrolls sideways (the label column). */
  sticky?: boolean
  /** Exclude from CSV. */
  noCsv?: boolean
}

export interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T, index: number) => string
  /** Whole-row click (also Enter on a focused row). */
  onRowClick?: (row: T) => void
  /** Controlled sort (server mode). Leave unset to sort on the client. */
  sort?: { key: string; dir: 'asc' | 'desc' }
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void
  /** Initial client-side sort. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' }
  /** Client paging size (0 = show everything). Default 25. Ignored in server mode. */
  pageSize?: number
  /** Server paging: total rows + current window + callback. */
  server?: { total: number; offset: number; limit: number; onPageChange: (offset: number) => void }
  /** File name for "Export CSV" (button hidden when unset). Exports the rows passed in. */
  csvName?: string
  /** Left side of the toolbar (a SearchInput, a Segmented...). */
  toolbar?: ReactNode
  /** Shown instead of the table when there are no rows. */
  empty?: ReactNode
  /** Dim the rows while new data loads. */
  loading?: boolean
  /** Scroll vertically inside the card past this height (header stays sticky). */
  maxHeight?: number
  /** Accessible table name. */
  caption: string
  /** Mark the row with this key as selected (master/detail views). */
  selectedKey?: string | null
}

const isNumericCol = <T,>(c: Column<T>) => c.format != null || c.bar === true

function cmp(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1      // empties last regardless of direction
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'en', { numeric: true, sensitivity: 'base' })
}

/**
 * The analytics table: column config, click-to-sort headers (client or
 * server), sticky header, right-aligned tabular numbers, an inline bar on
 * the primary metric, paging (client or server), row click, and CSV export
 * of the current rows. Scrolls sideways inside its card, never the page.
 */
export function DataTable<T>({
  rows, columns, rowKey, onRowClick, sort, onSortChange, defaultSort, pageSize = 25, server, csvName,
  toolbar, empty, loading, maxHeight, caption, selectedKey,
}: DataTableProps<T>) {
  const [localSort, setLocalSort] = useState(defaultSort ?? null)
  const [page, setPage] = useState(0)
  const controlled = !!onSortChange
  const activeSort = controlled ? sort ?? null : localSort

  const sorted = useMemo(() => {
    if (controlled || !activeSort) return rows
    const col = columns.find(c => c.key === activeSort.key)
    if (!col?.value) return rows
    const get = col.value
    const dir = activeSort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      if (va == null || vb == null) return cmp(va, vb)
      return cmp(va, vb) * dir
    })
  }, [rows, columns, activeSort, controlled])

  const maxes = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of columns) {
      if (!c.bar || !c.value) continue
      let mx = 0
      for (const r of rows) { const v = c.value(r); if (typeof v === 'number' && v > mx) mx = v }
      m[c.key] = mx
    }
    return m
  }, [rows, columns])

  const clientPaging = !server && pageSize > 0 && sorted.length > pageSize
  const pages = clientPaging ? Math.ceil(sorted.length / pageSize) : 1
  const curPage = Math.min(page, pages - 1)
  const visible = clientPaging ? sorted.slice(curPage * pageSize, curPage * pageSize + pageSize) : sorted

  const clickSort = (c: Column<T>) => {
    const sortable = c.sortable ?? !!c.value
    if (!sortable) return
    const first = c.firstDir ?? (isNumericCol(c) ? 'desc' : 'asc')
    const dir: 'asc' | 'desc' = activeSort?.key === c.key ? (activeSort.dir === 'desc' ? 'asc' : 'desc') : first
    if (controlled) onSortChange!(c.key, dir)
    else { setLocalSort({ key: c.key, dir }); setPage(0) }
  }

  const exportCsv = () => {
    const cols = columns.filter(c => !c.noCsv)
    const head = cols.map(c => c.csvHeader ?? (typeof c.header === 'string' ? c.header : c.key))
    const body = sorted.map(r => cols.map(c => {
      if (c.csv) return c.csv(r)
      const v = c.value?.(r)
      if (v != null) return v
      const rendered = c.render?.(r)
      return typeof rendered === 'string' || typeof rendered === 'number' ? rendered : ''
    }))
    downloadCsv(csvName ?? 'analytics', [head, ...body])
  }

  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, r: T) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault()
      onRowClick(r)
    }
  }

  const showToolbar = !!toolbar || !!csvName
  const total = server ? server.total : sorted.length
  const from = server ? server.offset : curPage * pageSize
  const shownTo = from + visible.length

  return (
    <div className={'an-table-wrap' + (loading ? ' an-table-wrap--loading' : '')}>
      {showToolbar && (
        <div className="an-table-toolbar">
          <div className="an-table-toolbar-left">{toolbar}</div>
          {csvName && (
            <button type="button" className="an-btn an-btn--sm an-btn--ghost" onClick={exportCsv} disabled={!rows.length} title="Download these rows as a CSV file">
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" /> CSV
            </button>
          )}
        </div>
      )}

      {!rows.length ? (
        <>{empty ?? <div className="an-bl-empty">No data for this period.</div>}</>
      ) : (
        <div className="an-table-scroll" style={maxHeight ? { maxHeight } : undefined} tabIndex={0} role="region" aria-label={caption}>
          <table className="an-table" aria-busy={loading || undefined}>
            <caption className="an-sr">{caption}</caption>
            <thead>
              <tr>
                {columns.map(c => {
                  const sortable = c.sortable ?? !!c.value
                  const on = activeSort?.key === c.key
                  const align = c.align ?? (isNumericCol(c) ? 'right' : 'left')
                  const style: CSSProperties = { width: c.width, minWidth: c.minWidth, textAlign: align }
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      style={style}
                      className={(c.sticky ? 'an-sticky-col ' : '') + (on ? 'an-th--on' : '')}
                      aria-sort={on ? (activeSort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    >
                      <span className={'an-th' + (align === 'right' ? ' an-th--right' : '')}>
                        {sortable ? (
                          <button type="button" className="an-th-btn" onClick={() => clickSort(c)}>
                            {c.header}
                            <FontAwesomeIcon icon={on ? (activeSort!.dir === 'asc' ? faSortUp : faSortDown) : faSort} className="an-th-sort" aria-hidden="true" />
                          </button>
                        ) : (
                          <span>{c.header}</span>
                        )}
                        {c.tip}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => {
                const key = rowKey(r, from + i)
                return (
                  <tr
                    key={key}
                    className={(onRowClick ? 'an-tr--click ' : '') + (selectedKey === key ? 'an-tr--sel' : '')}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    onKeyDown={onRowClick ? e => onRowKey(e, r) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-selected={selectedKey != null ? selectedKey === key : undefined}
                  >
                    {columns.map(c => {
                      const align = c.align ?? (isNumericCol(c) ? 'right' : 'left')
                      const raw = c.value?.(r)
                      const content = c.render ? c.render(r) : c.format && typeof raw === 'number' ? fmtMetric(raw, c.format) : raw ?? '–'
                      const mx = maxes[c.key]
                      const pct = c.bar && typeof raw === 'number' && mx > 0 ? (raw / mx) * 100 : null
                      return (
                        <td key={c.key} style={{ textAlign: align }} className={(c.sticky ? 'an-sticky-col ' : '') + (isNumericCol(c) ? 'an-num' : '')}>
                          {pct != null ? (
                            <span className="an-td-bar">
                              <span className="an-td-bar-track" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
                              <span>{content}</span>
                            </span>
                          ) : content}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {(clientPaging || (server && server.total > server.limit)) && rows.length > 0 && (
        <div className="an-pager">
          <span className="an-pager-info">{fmtNumber(from + 1)}–{fmtNumber(shownTo)} of {fmtNumber(total)}</span>
          <button
            type="button"
            className="an-btn an-btn--sm an-btn--icon"
            aria-label="Previous page"
            disabled={from <= 0}
            onClick={() => (server ? server.onPageChange(Math.max(0, server.offset - server.limit)) : setPage(p => Math.max(0, p - 1)))}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            type="button"
            className="an-btn an-btn--sm an-btn--icon"
            aria-label="Next page"
            disabled={shownTo >= total}
            onClick={() => (server ? server.onPageChange(server.offset + server.limit) : setPage(p => Math.min(pages - 1, p + 1)))}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  )
}
