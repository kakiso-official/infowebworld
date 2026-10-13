'use client'
import { Heatmap, fmtNumber } from '..'
import { plural } from './util'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const hh = (h: number) => String(h).padStart(2, '0')

/** The busiest day, hour and single slot, in words - the heatmap's headline. */
export function hourOfWeekSummary(matrix: number[][]): string | null {
  let total = 0
  let peak = { d: 0, h: 0, n: -1 }
  const byDay = DAYS.map(() => 0)
  const byHour = Array.from({ length: 24 }, () => 0)
  matrix.forEach((row, d) => row.forEach((n, h) => {
    total += n
    byDay[d] += n
    byHour[h] += n
    if (n > peak.n) peak = { d, h, n }
  }))
  if (total === 0) return null
  const day = byDay.indexOf(Math.max(...byDay))
  const hour = byHour.indexOf(Math.max(...byHour))
  return `Busiest day: ${DAYS[day]} (${Math.round((byDay[day] / total) * 100)}% of visits). `
    + `Busiest hour: ${hh(hour)}:00–${hh((hour + 1) % 24)}:00. `
    + `Peak slot: ${DAYS[peak.d]}s around ${hh(peak.h)}:00 (${fmtNumber(peak.n)} ${plural(peak.n, 'visit')}).`
}

/**
 * "When visitors come": visits by local weekday (rows) x hour (columns) in
 * the analytics timezone, on one blue ramp. Hour labels every 3 hours keep
 * the axis readable; every cell has its exact count on hover / arrow keys.
 */
export function HourOfWeekHeatmap({ matrix, tz }: { matrix: number[][]; tz: string }) {
  return (
    <Heatmap
      ariaLabel={`Visits by weekday and hour (${tz})`}
      rows={DAYS.map((d, i) => ({ key: String(i), label: d.slice(0, 3), text: d }))}
      cols={Array.from({ length: 24 }, (_, h) => ({ key: String(h), label: hh(h), title: `${hh(h)}:00–${hh((h + 1) % 24)}:00` }))}
      values={DAYS.map((_, d) => matrix[d] ?? Array.from({ length: 24 }, () => 0))}
      colLabelEvery={3}
      minCellWidth={20}
      cellHeight={24}
      legendLabels={['Fewer visits', 'More visits']}
      tooltip={(v, r, c) => (
        <>
          <div className="an-tt-head">{DAYS[r]} · {hh(c)}:00–{hh((c + 1) % 24)}:00</div>
          <div><b className="an-tt-val">{fmtNumber(v ?? 0)}</b> {plural(v ?? 0, 'visit')}</div>
        </>
      )}
    />
  )
}
