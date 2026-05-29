import { NextRequest } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/worker/stop
 *
 * Writes a sentinel file at the project root that scripts/scrape-worker.mjs
 * polls between iterations. When the file exists, the worker stops claiming
 * new jobs, lets in-flight jobs finish, then exits.
 *
 * Detection in the UI: heartbeat file goes stale (no writes) within ~30s.
 *
 * No-op in production (Vercel) — the worker runs locally so this endpoint
 * is only meaningful when the dev server and worker share a filesystem.
 */

const STOP_FILE = path.resolve(process.cwd(), '.scrape-worker.stop')
const HEARTBEAT_FILE = path.resolve(process.cwd(), '.scrape-worker.heartbeat')

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    fs.writeFileSync(STOP_FILE, String(Date.now()))

    let workerAlive = false
    try {
      const stat = fs.statSync(HEARTBEAT_FILE)
      workerAlive = Date.now() - stat.mtimeMs < 30_000
    } catch {}

    return Response.json({
      ok: true,
      workerAlive,
      message: workerAlive
        ? 'Stop requested — worker will exit within ~10 seconds.'
        : 'Stop file written, but no heartbeat detected. Worker may already be offline.',
    })
  } catch (err) {
    console.error('POST /scrape/worker/stop:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to write stop file',
    }, { status: 500 })
  }
}
