import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { anQuery, anQueryOne, isMissingTable } from '@/lib/analytics/db'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    /* Traffic stats use the separate analytics pool, so start them now and
       let them run alongside the queries below (loadTraffic never rejects). */
    const trafficPromise = loadTraffic()

    // --- Submission counts ---
    const submissionCounts = await queryOne<{
      totalSubmissions: number
      paidMembers: number
      pendingSubmissions: number
      confirmedSubmissions: number
    }>(
      `SELECT
         COUNT(*) as totalSubmissions,
         SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paidMembers,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingSubmissions,
         SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmedSubmissions
       FROM submissions`
    )

    // --- Waitlist total ---
    const waitlistRow = await queryOne<{ waitlistTotal: number }>(
      'SELECT COUNT(*) as waitlistTotal FROM waitlist'
    )

    // --- Submissions by plan ---
    const byPlan = await query<{ plan: string; count: number }>(
      `SELECT p.slug as plan, COUNT(*) as count
       FROM submissions s
       JOIN plans p ON p.id = s.plan_id
       GROUP BY p.slug`
    )

    // --- Submissions by category (top 5) ---
    const byCat = await query<{ category: string; count: number }>(
      `SELECT c.name as category, COUNT(*) as count
       FROM submissions s
       JOIN categories c ON c.id = s.category_id
       GROUP BY c.name
       ORDER BY count DESC
       LIMIT 5`
    )

    // --- Recent submissions ---
    const recent = await query(
      `SELECT s.*, c.name as category_name, p.slug as plan_slug, p.name as plan_name
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
       LEFT JOIN plans p ON p.id = s.plan_id
       ORDER BY s.created_at DESC
       LIMIT 6`
    )

    // --- Waitlist by source ---
    const waitlistBySrc = await query<{ source: string; count: number }>(
      `SELECT COALESCE(source, 'direct') as source, COUNT(*) as count
       FROM waitlist
       GROUP BY source`
    )

    // --- Blog stats ---
    const blogOverview = await queryOne<{
      totalViews: number
      totalShares: number
      totalPosts: number
    }>(
      `SELECT
         COALESCE(SUM(ba.views), 0) as totalViews,
         COALESCE(SUM(ba.shares), 0) as totalShares,
         (SELECT COUNT(*) FROM blog_posts) as totalPosts
       FROM blog_analytics_daily ba`
    )

    const avgReadTimeRow = await queryOne<{ avgReadTime: number }>(
      `SELECT COALESCE(AVG(read_time), 0) as avgReadTime FROM blog_posts WHERE status = 'published'`
    )

    const topPosts = await query(
      `SELECT p.id, p.title, p.slug,
              COALESCE(SUM(ba.views), 0) as views,
              COALESCE(SUM(ba.shares), 0) as shares
       FROM blog_posts p
       LEFT JOIN blog_analytics_daily ba ON ba.post_id = p.id
       GROUP BY p.id
       ORDER BY views DESC
       LIMIT 5`
    )

    const blogStats = {
      totalViews: blogOverview?.totalViews ?? 0,
      totalShares: blogOverview?.totalShares ?? 0,
      avgReadTime: avgReadTimeRow?.avgReadTime ?? 0,
      totalPosts: blogOverview?.totalPosts ?? 0,
      topPosts,
    }

    const traffic = await trafficPromise

    const data = {
      ok: true,
      totalSubmissions: submissionCounts?.totalSubmissions ?? 0,
      paidMembers: submissionCounts?.paidMembers ?? 0,
      pendingSubmissions: submissionCounts?.pendingSubmissions ?? 0,
      confirmedSubmissions: submissionCounts?.confirmedSubmissions ?? 0,
      waitlistTotal: waitlistRow?.waitlistTotal ?? 0,
      totalPageViews: traffic.totalPageViews,
      todayViews: traffic.todayViews,
      todayUnique: traffic.todayUnique,
      totalUnique: traffic.totalUnique,
      dailyViews: traffic.dailyViews,
      topPages: traffic.topPages,
      topReferrers: traffic.topReferrers,
      byPlan,
      byCat,
      recent,
      waitlistBySrc,
      blogStats,
      devices: traffic.devices,
      countries: traffic.countries,
      utmSources: traffic.utmSources,
    }

    return Response.json(data, {
      /* Admin-only analytics — must NEVER land in a shared cache. The old
         public s-maxage=3600 header let anyone read the full analytics
         payload from the edge for an hour after an admin primed it. */
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (err) {
    console.error('Dashboard stats error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

/* ══════════════════════════════════════════════════════════════
   Traffic numbers for the admin home.

   Source: the first-party analytics tables (database/
   migration-analytics-v1.sql). The old page_views table stopped
   filling on 2026-04-18. All an_* times are UTC, so "today" and the
   7-day chart are UTC days.

   Response shape is unchanged so the admin home keeps rendering:
     dailyViews   [{ date: 'YYYY-MM-DD', views, unique_views }]
     topPages     [{ page, views }]          last 30 days
     topReferrers [{ referrer, count }]      visits, by referring site, last 30 days
     devices / countries / utmSources [{ device|country|source, count }]

   Each query fails soft: before the migration has run (tables missing)
   it quietly reads as zero, and any other error is logged and zeroed so
   traffic stats can never take the whole admin home down.
   ══════════════════════════════════════════════════════════════ */

const DAY_MS = 86_400_000
const CHART_DAYS = 7

async function soft<T>(label: string, fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (err) {
    if (!isMissingTable(err)) console.error(`Dashboard stats (${label}) error:`, err)
    return fallback
  }
}

async function loadTraffic() {
  const [lifetime, today, daily, topPages, topReferrers, devices, countries, utmSources] = await Promise.all([
    /* Lifetime totals come from an_visitors (kept forever, one row per
       browser with its running pageview count), so they don't shrink when
       raw pageviews age out after RAW_RETENTION_DAYS. */
    soft('totals', null, () => anQueryOne<{ totalPageViews: number; totalUnique: number }>(
      `SELECT COALESCE(SUM(pageviews), 0) AS totalPageViews, COUNT(*) AS totalUnique
         FROM an_visitors`
    )),
    soft('today', null, () => anQueryOne<{ todayViews: number; todayUnique: number }>(
      `SELECT COUNT(*) AS todayViews, COUNT(DISTINCT visitor_id) AS todayUnique
         FROM an_pageviews
        WHERE ts >= UTC_DATE()`
    )),
    soft('daily', [], () => anQuery<{ date: string; views: number; unique_views: number }>(
      `SELECT DATE(ts) AS date, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS unique_views
         FROM an_pageviews
        WHERE ts >= UTC_DATE() - INTERVAL ? DAY
        GROUP BY DATE(ts)`,
      [CHART_DAYS - 1]
    )),
    soft('top pages', [], () => anQuery<{ page: string; views: number }>(
      `SELECT path AS page, COUNT(*) AS views
         FROM an_pageviews
        WHERE ts >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
        GROUP BY path
        ORDER BY views DESC
        LIMIT 6`
    )),
    /* Visits by referring site. Visits referred by our own pages (source
       '(internal)', e.g. after an OAuth round-trip) are not referrals. */
    soft('top referrers', [], () => anQuery<{ referrer: string; count: number }>(
      `SELECT referrer_host AS referrer, COUNT(*) AS count
         FROM an_sessions
        WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
          AND referrer_host IS NOT NULL AND referrer_host <> ''
          AND source <> '(internal)'
        GROUP BY referrer_host
        ORDER BY count DESC
        LIMIT 6`
    )),
    /* Device / country / source live on the visit; SUM(pageviews) keeps
       these counting page views, like the old per-pageview numbers. */
    soft('devices', [], () => anQuery<{ device: string; count: number }>(
      `SELECT device_type AS device, SUM(pageviews) AS count
         FROM an_sessions
        WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
        GROUP BY device_type
        ORDER BY count DESC`
    )),
    soft('countries', [], () => anQuery<{ country: string; count: number }>(
      `SELECT COALESCE(country, 'Unknown') AS country, SUM(pageviews) AS count
         FROM an_sessions
        WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
        GROUP BY COALESCE(country, 'Unknown')
        ORDER BY count DESC
        LIMIT 10`
    )),
    /* Campaign-tagged traffic: visits that carried a utm_campaign or an ad
       click id. The visit's source is the utm_source when one was given. */
    soft('campaign sources', [], () => anQuery<{ source: string; count: number }>(
      `SELECT source, SUM(pageviews) AS count
         FROM an_sessions
        WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
          AND (campaign IS NOT NULL OR click_id IS NOT NULL)
        GROUP BY source
        ORDER BY count DESC
        LIMIT 10`
    )),
  ])

  /* Zero-fill the chart: exactly CHART_DAYS bars ending today (UTC), so a
     quiet day shows as 0 instead of silently shifting the bars. */
  const byDate = new Map(daily.map(r => [String(r.date).slice(0, 10), r]))
  const now = new Date()
  const todayUtcMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const dailyViews = Array.from({ length: CHART_DAYS }, (_, i) => {
    const date = new Date(todayUtcMs - (CHART_DAYS - 1 - i) * DAY_MS).toISOString().slice(0, 10)
    const r = byDate.get(date)
    return { date, views: Number(r?.views ?? 0), unique_views: Number(r?.unique_views ?? 0) }
  })

  return {
    totalPageViews: Number(lifetime?.totalPageViews ?? 0),
    totalUnique: Number(lifetime?.totalUnique ?? 0),
    todayViews: Number(today?.todayViews ?? 0),
    todayUnique: Number(today?.todayUnique ?? 0),
    dailyViews,
    topPages,
    topReferrers,
    devices,
    countries,
    utmSources,
  }
}
