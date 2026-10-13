'use client'
import type { CSSProperties, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowRotateRight, faChartLine, faDatabase, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import type { ReportState } from '../_lib/report'

/* ── Skeleton ───────────────────────────────────────────────────────────── */

export interface SkeletonProps {
  /** 'block' (default), 'chart', 'list' (bar-list rows), 'kpis' (KPI strip), 'table', 'text'. */
  variant?: 'block' | 'chart' | 'list' | 'kpis' | 'table' | 'text'
  /** Height for block/chart (px). */
  height?: number
  /** Rows for list/table, lines for text, tiles for kpis. */
  rows?: number
  className?: string
  style?: CSSProperties
}

/**
 * Loading placeholder shaped like what will appear, at the same height, so
 * nothing jumps when the data lands. Only for the first load - refreshes
 * keep the old render dimmed instead (see ReportView).
 */
export function Skeleton({ variant = 'block', height, rows, className, style }: SkeletonProps) {
  const cls = 'an-skel-wrap ' + (className ?? '')
  if (variant === 'kpis') {
    const n = rows ?? 4
    return (
      <div className={cls + ' an-kpis'} style={style} aria-busy="true" aria-label="Loading">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="an-kpi an-kpi--skel">
            <span className="an-skel" style={{ width: '55%', height: 12 }} />
            <span className="an-skel" style={{ width: '70%', height: 26, marginTop: 10 }} />
            <span className="an-skel" style={{ width: '40%', height: 12, marginTop: 10 }} />
          </div>
        ))}
      </div>
    )
  }
  if (variant === 'list' || variant === 'table') {
    const n = rows ?? 8
    return (
      <div className={cls} style={style} aria-busy="true" aria-label="Loading">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="an-skel-row">
            <span className="an-skel" style={{ width: `${86 - i * (60 / n)}%`, height: 14 }} />
            <span className="an-skel" style={{ width: 44, height: 14 }} />
          </div>
        ))}
      </div>
    )
  }
  if (variant === 'text') {
    const n = rows ?? 3
    return (
      <div className={cls} style={style} aria-busy="true" aria-label="Loading">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="an-skel" style={{ display: 'block', width: i === n - 1 ? '60%' : '100%', height: 12, marginTop: i ? 10 : 0 }} />
        ))}
      </div>
    )
  }
  return (
    <div className={cls} style={style} aria-busy="true" aria-label="Loading">
      <span className="an-skel" style={{ display: 'block', width: '100%', height: height ?? (variant === 'chart' ? 260 : 120) }} />
    </div>
  )
}

/* ── Empty / error / migration ──────────────────────────────────────────── */

/**
 * Nothing to show. Always say what WILL appear here and why it is empty now
 * ("No visits from AI assistants in this period. Links clicked in ChatGPT,
 * Perplexity... show up here.").
 */
export function EmptyState({ icon = faChartLine, title, text, action, compact }: {
  icon?: IconDefinition
  title: ReactNode
  text?: ReactNode
  action?: ReactNode
  /** Smaller variant for inside panels. */
  compact?: boolean
}) {
  return (
    <div className={'an-empty' + (compact ? ' an-empty--compact' : '')}>
      <span className="an-empty-icon" aria-hidden="true"><FontAwesomeIcon icon={icon} /></span>
      <div className="an-empty-title">{title}</div>
      {text && <div className="an-empty-text">{text}</div>}
      {action && <div className="an-empty-action">{action}</div>}
    </div>
  )
}

/** Inline error with a retry button. */
export function ErrorState({ message, onRetry, compact }: { message: ReactNode; onRetry?: () => void; compact?: boolean }) {
  return (
    <div className={'an-error' + (compact ? ' an-error--compact' : '')} role="alert">
      <span className="an-error-icon" aria-hidden="true"><FontAwesomeIcon icon={faTriangleExclamation} /></span>
      <div className="an-error-body">
        <div className="an-error-title">This report could not load</div>
        <div className="an-error-text">{message}</div>
      </div>
      {onRetry && (
        <button type="button" className="an-btn an-btn--sm" onClick={onRetry}>
          <FontAwesomeIcon icon={faArrowRotateRight} aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  )
}

/**
 * Shown when the API answers 503 { needsMigration } - the an_* tables don't
 * exist yet. Explains the one manual step in plain words.
 */
export function MigrationNotice({ missingTables, compact }: { missingTables?: string[]; compact?: boolean }) {
  return (
    <div className={'an-migrate' + (compact ? ' an-migrate--compact' : '')}>
      <span className="an-migrate-icon" aria-hidden="true"><FontAwesomeIcon icon={faDatabase} /></span>
      <div>
        <div className="an-migrate-title">Analytics is installed but its database tables are not created yet</div>
        {!compact && (
          <ol className="an-migrate-steps">
            <li>Open <b>phpMyAdmin</b> in cPanel and select the InfoWebWorld database.</li>
            <li>Go to the <b>SQL</b> tab, paste the contents of <code>database/migration-analytics-v1.sql</code> and press <b>Go</b>.</li>
            <li>Reload this page. Visits are recorded from that moment on (the script is safe to run twice).</li>
          </ol>
        )}
        {compact && <div className="an-migrate-text">Run <code>database/migration-analytics-v1.sql</code> in phpMyAdmin, then reload.</div>}
        {missingTables && missingTables.length > 0 && (
          <div className="an-migrate-missing">Missing: {missingTables.map(t => <code key={t}>{t}</code>)}</div>
        )}
      </div>
    </div>
  )
}

/* ── ReportView: the four states of every report in one place ────────────── */

export interface ReportViewProps<T> {
  /** The useReport() result. */
  state: ReportState<T>
  /** What to show on the very first load (default: a block skeleton). */
  skeleton?: ReactNode
  /** Render the data. Called with the latest (or, while refreshing, previous) answer. */
  children: (data: T) => ReactNode
  /** Smaller error / migration notices (inside panels). */
  compact?: boolean
}

/**
 * Handles loading, error, 503 needs-migration and refresh for one report:
 *
 *   <ReportView state={r} skeleton={<Skeleton variant="chart" />}>
 *     {data => <TimeSeriesChart ... />}
 *   </ReportView>
 *
 * While refreshing it keeps the previous render at reduced opacity
 * (aria-busy) instead of flashing a skeleton.
 */
export function ReportView<T>({ state, skeleton, children, compact }: ReportViewProps<T>) {
  if (state.needsMigration) return <MigrationNotice missingTables={state.missingTables} compact={compact} />
  if (state.data === undefined) {
    if (state.error) return <ErrorState message={state.error} onRetry={state.reload} compact={compact} />
    return <>{skeleton ?? <Skeleton />}</>
  }
  return (
    <div className={'an-rv' + (state.refreshing ? ' an-rv--refreshing' : '')} aria-busy={state.refreshing || undefined}>
      {children(state.data)}
    </div>
  )
}
