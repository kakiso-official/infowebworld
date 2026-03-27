import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const secret = process.env.CRON_SECRET || 'iww_cron_2026'

    if (key !== secret) {
      return Response.json(
        { ok: false, error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const results: string[] = []

    // 1. Aggregate page_views -> page_analytics_daily for yesterday
    await execute(
      `INSERT INTO page_analytics_daily (page, date, views, unique_views)
       SELECT page, DATE(created_at), COUNT(*), COUNT(DISTINCT visitor_hash)
       FROM page_views
       WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
       GROUP BY page, DATE(created_at)
       ON DUPLICATE KEY UPDATE
         views = VALUES(views),
         unique_views = VALUES(unique_views)`
    )
    results.push('page_views aggregated')

    // 2. Aggregate blog_views -> blog_analytics_daily for yesterday
    await execute(
      `INSERT INTO blog_analytics_daily (post_id, date, views, unique_views, shares)
       SELECT post_id, DATE(created_at), COUNT(*), COUNT(DISTINCT visitor_hash), 0
       FROM blog_views
       WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
       GROUP BY post_id, DATE(created_at)
       ON DUPLICATE KEY UPDATE
         views = VALUES(views),
         unique_views = VALUES(unique_views)`
    )
    results.push('blog_views aggregated')

    // 3. Purge raw views older than 30 days
    await execute(
      'DELETE FROM page_views WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
    )
    results.push('old page_views purged')

    await execute(
      'DELETE FROM blog_views WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
    )
    results.push('old blog_views purged')

    // 4. Clean old rate_limits
    await execute(
      'DELETE FROM rate_limits WHERE window_start < DATE_SUB(NOW(), INTERVAL 1 HOUR)'
    )
    results.push('old rate_limits cleaned')

    // 5. Clean expired admin_sessions
    await execute(
      'DELETE FROM admin_sessions WHERE expires_at < NOW()'
    )
    results.push('expired admin_sessions cleaned')

    return Response.json({
      ok: true,
      tasks: results,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Cron rollup error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
