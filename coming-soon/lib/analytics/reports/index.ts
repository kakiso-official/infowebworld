import type { NextRequest } from 'next/server'
import type { AdminSession } from '@/lib/auth'
import type { ReportParams } from '../query'

import { overviewReport } from './overview'
import { realtimeReport } from './realtime'
import { acquisitionReport } from './acquisition'
import { pagesReport, pageDetailReport } from './pages'
import { audienceReport } from './audience'
import { performanceReport } from './performance'
import { errorsReport } from './errors'
import { eventsReport } from './events'
import { flowReport } from './flow'
import { funnelsReport } from './funnels'
import { sessionsReport, sessionReport, visitorReport } from './sessions'
import { signupsReport } from './signups'
import { retentionReport } from './retention'
import { healthReport, excludeAction } from './health'

/* Report registry for GET /api/admin/analytics/[report].
   Each report: (params) => JSON-serializable response typed in ../types.ts. */
export const REPORTS: Record<string, (p: ReportParams) => Promise<unknown>> = {
  overview: overviewReport,         // OverviewReport
  realtime: realtimeReport,         // RealtimeReport
  acquisition: acquisitionReport,   // AcquisitionReport
  pages: pagesReport,               // PagesReport      (?group=path|page_type|entry|exit)
  page: pageDetailReport,           // PageDetailReport (?path=)
  audience: audienceReport,         // AudienceReport
  performance: performanceReport,   // PerformanceReport
  errors: errorsReport,             // ErrorsReport
  events: eventsReport,             // EventsReport     (?name= for one event's detail)
  flow: flowReport,                 // FlowReport       (?mode=entries|from|to&anchor=&group=path|page_type&steps=)
  funnels: funnelsReport,           // FunnelReport     (?preset= or ?steps=<json FunnelStepDef[]>&scope=session|visitor)
  sessions: sessionsReport,         // SessionsReport
  session: sessionReport,           // SessionDetailReport (?id=)
  visitor: visitorReport,           // VisitorReport       (?id=)
  signups: signupsReport,           // SignupsReport
  retention: retentionReport,       // RetentionReport  (?weeks=)
  health: healthReport,             // HealthReport
}

/* POST /api/admin/analytics/[action] */
export const ACTIONS: Record<string, (req: NextRequest, admin: AdminSession) => Promise<Response>> = {
  exclude: excludeAction,           // body { exclude: boolean } -> sets/clears the AN_IGNORE_COOKIE on this browser
}

/* Reports that work without the date range / previous-period machinery
   still receive full ReportParams; they simply ignore what they don't need. */
