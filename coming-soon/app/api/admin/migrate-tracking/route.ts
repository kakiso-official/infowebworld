import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/migrate-tracking
 * Ensures all tracking V2 columns exist on page_views.
 * Safe to run multiple times — skips columns that already exist.
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const results: string[] = []

  const columns = [
    { col: 'country', def: 'VARCHAR(2) DEFAULT NULL AFTER device_type' },
    { col: 'utm_source', def: 'VARCHAR(100) DEFAULT NULL AFTER referrer' },
    { col: 'utm_medium', def: 'VARCHAR(100) DEFAULT NULL AFTER utm_source' },
    { col: 'utm_campaign', def: 'VARCHAR(100) DEFAULT NULL AFTER utm_medium' },
    { col: 'utm_content', def: 'VARCHAR(200) DEFAULT NULL AFTER utm_campaign' },
    { col: 'visitor_hash', def: 'VARCHAR(64) DEFAULT NULL AFTER country' },
    { col: 'is_unique', def: 'TINYINT(1) NOT NULL DEFAULT 1 AFTER visitor_hash' },
  ]

  for (const { col, def } of columns) {
    try {
      await execute(`ALTER TABLE page_views ADD COLUMN \`${col}\` ${def}`)
      results.push(`+ Added page_views.${col}`)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'ER_DUP_FIELDNAME') {
        results.push(`✓ page_views.${col} already exists`)
      } else {
        results.push(`✗ page_views.${col}: ${(err as Error).message}`)
      }
    }
  }

  // Add indexes if missing
  const indexes = [
    { name: 'idx_pageviews_visitor', sql: 'ALTER TABLE page_views ADD KEY idx_pageviews_visitor (visitor_hash)' },
    { name: 'idx_pageviews_utm', sql: 'ALTER TABLE page_views ADD KEY idx_pageviews_utm (utm_source)' },
    { name: 'idx_pageviews_unique', sql: 'ALTER TABLE page_views ADD KEY idx_pageviews_unique (is_unique, created_at)' },
  ]

  for (const { name, sql } of indexes) {
    try {
      await execute(sql)
      results.push(`+ Added index ${name}`)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'ER_DUP_KEYNAME') {
        results.push(`✓ Index ${name} already exists`)
      } else {
        results.push(`✗ Index ${name}: ${(err as Error).message}`)
      }
    }
  }

  return Response.json({ ok: true, results })
}
