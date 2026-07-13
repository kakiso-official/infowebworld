import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
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

    // --- Page view stats (DISTINCT visitor_hash = true unique visitors) ---
    const viewStats = await queryOne<{
      totalPageViews: number
      totalUnique: number
    }>(
      `SELECT
         COUNT(*) as totalPageViews,
         COUNT(DISTINCT visitor_hash) as totalUnique
       FROM page_views`
    )

    const todayStats = await queryOne<{
      todayViews: number
      todayUnique: number
    }>(
      `SELECT
         COUNT(*) as todayViews,
         COUNT(DISTINCT visitor_hash) as todayUnique
       FROM page_views
       WHERE DATE(created_at) = CURDATE()`
    )

    // --- Daily views for last 7 days ---
    const dailyViews = await query<{ date: string; views: number; unique_views: number }>(
      `SELECT
         DATE(created_at) as date,
         COUNT(*) as views,
         COUNT(DISTINCT visitor_hash) as unique_views
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    )

    // --- Top pages ---
    const topPages = await query<{ page: string; views: number }>(
      `SELECT page, COUNT(*) as views
       FROM page_views
       GROUP BY page
       ORDER BY views DESC
       LIMIT 6`
    )

    // --- Top referrers ---
    const topReferrers = await query<{ referrer: string; count: number }>(
      `SELECT referrer, COUNT(*) as count
       FROM page_views
       WHERE referrer IS NOT NULL AND referrer != ''
       GROUP BY referrer
       ORDER BY count DESC
       LIMIT 6`
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

    // --- Devices breakdown (last 30 days) ---
    const devices = await query<{ device: string; count: number }>(
      `SELECT COALESCE(device_type, 'unknown') as device, COUNT(*) as count
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY device_type
       ORDER BY count DESC`
    )

    // --- Countries breakdown (last 30 days, top 10) ---
    const countries = await query<{ country: string; count: number }>(
      `SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as count
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY country
       ORDER BY count DESC
       LIMIT 10`
    )

    // --- UTM sources breakdown (last 30 days, top 10) ---
    const utmSources = await query<{ source: string; count: number }>(
      `SELECT COALESCE(utm_source, 'direct') as source, COUNT(*) as count
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         AND utm_source IS NOT NULL AND utm_source != ''
       GROUP BY utm_source
       ORDER BY count DESC
       LIMIT 10`
    )

    const data = {
      ok: true,
      totalSubmissions: submissionCounts?.totalSubmissions ?? 0,
      paidMembers: submissionCounts?.paidMembers ?? 0,
      pendingSubmissions: submissionCounts?.pendingSubmissions ?? 0,
      confirmedSubmissions: submissionCounts?.confirmedSubmissions ?? 0,
      waitlistTotal: waitlistRow?.waitlistTotal ?? 0,
      totalPageViews: viewStats?.totalPageViews ?? 0,
      todayViews: todayStats?.todayViews ?? 0,
      todayUnique: todayStats?.todayUnique ?? 0,
      totalUnique: viewStats?.totalUnique ?? 0,
      dailyViews,
      topPages,
      topReferrers,
      byPlan,
      byCat,
      recent,
      waitlistBySrc,
      blogStats,
      devices,
      countries,
      utmSources,
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
