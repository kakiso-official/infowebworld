import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { REPORTS, ACTIONS } from '@/lib/analytics/reports'
import { parseReportParams } from '@/lib/analytics/query'
import { isMissingTable, missingAnalyticsTables } from '@/lib/analytics/db'

/**
 * GET  /api/admin/analytics/{report}?range=28d&tz=Asia/Kolkata&compare=previous&f.channel=...
 * POST /api/admin/analytics/{action}
 *
 * Admin-only (iww_adm_token). Every report is a module in lib/analytics/reports.
 * When the an_* tables don't exist yet, answers 503 { needsMigration, missingTables }
 * so the UI can show "run database/migration-analytics-v1.sql".
 */
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

async function migrationResponse(): Promise<Response> {
  let missingTables: string[] = []
  try { missingTables = await missingAnalyticsTables() } catch { /* ignore */ }
  return Response.json({ needsMigration: true, missingTables }, { status: 503, headers: NO_STORE })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ report: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const { report } = await params
  const run = REPORTS[report]
  if (!run) return Response.json({ error: 'Unknown report' }, { status: 404, headers: NO_STORE })

  try {
    const data = await run(parseReportParams(report, request.nextUrl.searchParams))
    return Response.json(data, { headers: NO_STORE })
  } catch (err) {
    if (isMissingTable(err)) return migrationResponse()
    /* session?id= / visitor?id= that doesn't exist (bad id, or removed by
       retention): a real 404 so the UI can say so instead of "failed". */
    if (err instanceof Error && err.name === 'ReportNotFoundError') {
      return Response.json({ error: err.message, notFound: true }, { status: 404, headers: NO_STORE })
    }
    console.error(`[analytics] report ${report} failed:`, err)
    return Response.json({ error: 'Report failed' }, { status: 500, headers: NO_STORE })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ report: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const { report } = await params
  const action = ACTIONS[report]
  if (!action) return Response.json({ error: 'Unknown action' }, { status: 404, headers: NO_STORE })

  try {
    return await action(request, guard)
  } catch (err) {
    if (isMissingTable(err)) return migrationResponse()
    console.error(`[analytics] action ${report} failed:`, err)
    return Response.json({ error: 'Action failed' }, { status: 500, headers: NO_STORE })
  }
}
