/* ═══════════════════════════════════════════════════════════════════════════
   CSV export (RFC 4180) for tables. Built in the browser from the rows on
   screen - no extra API. Text cells that start with = + - @ get a leading
   apostrophe so a spreadsheet never runs a visitor-supplied value (a page
   title, a search term) as a formula.
   ═══════════════════════════════════════════════════════════════════════════ */

export type CsvCell = string | number | boolean | null | undefined

function cell(v: CsvCell): string {
  if (v == null) return ''
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : ''
  let s = String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Rows (first row = header) -> CSV text. */
export function toCsv(rows: CsvCell[][]): string {
  return rows.map(r => r.map(cell).join(',')).join('\r\n')
}

/** Download rows as `<name>-YYYY-MM-DD.csv` (UTF-8 BOM so Excel reads accents). */
export function downloadCsv(name: string, rows: CsvCell[][]): void {
  const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safe = name.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'analytics'
  a.href = url
  a.download = `${safe}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
