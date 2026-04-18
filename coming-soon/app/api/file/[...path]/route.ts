import { NextRequest } from 'next/server'
import http from 'node:http'

/**
 * Serve files from cPanel through a Vercel proxy.
 *
 * Problem: /infowebworld/uploads/... URLs go to Vercel (since
 * infowebworld.com points to Vercel), which then rewrites them to
 * public/uploads/ — a folder that only contains files pre-downloaded
 * during the Session 8 migration. New uploads live on cPanel and
 * can't be served that way.
 *
 * Solution: GET /api/file/<path> proxies directly to cPanel's IP with
 * the correct virtual-host header, streams the response back, and
 * caches aggressively on Vercel's edge so only the first request
 * per unique URL ever invokes a function.
 */

const CPANEL_IP = '104.152.168.46'
const CPANEL_HOST = 'infowebworld.com'

function fetchFromCpanel(path: string): Promise<{ ok: boolean; status: number; buf: Buffer; type: string }> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: CPANEL_IP,
        port: 80,
        method: 'GET',
        path,
        headers: { Host: CPANEL_HOST },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => resolve({
          ok: (res.statusCode || 500) < 400,
          status: res.statusCode || 500,
          buf: Buffer.concat(chunks),
          type: (res.headers['content-type'] as string) || 'application/octet-stream',
        }))
      }
    )
    req.on('error', () => resolve({ ok: false, status: 502, buf: Buffer.alloc(0), type: '' }))
    req.setTimeout(15000, () => { req.destroy(); resolve({ ok: false, status: 504, buf: Buffer.alloc(0), type: '' }) })
    req.end()
  })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  if (!Array.isArray(path) || path.length === 0) {
    return new Response('Invalid path', { status: 400 })
  }

  /* Guard: only allow letters, digits, dots, dashes, underscores in each segment */
  const safe = path.every((seg) => /^[\w.-]+$/.test(seg))
  if (!safe) return new Response('Forbidden', { status: 403 })

  const cpanelPath = `/infowebworld/uploads/${path.join('/')}`
  const r = await fetchFromCpanel(cpanelPath)

  if (!r.ok) {
    return new Response('Not found', { status: r.status || 404 })
  }

  return new Response(new Uint8Array(r.buf), {
    status: 200,
    headers: {
      'Content-Type': r.type,
      /* File paths contain a UUID, so the file at a URL never changes.
         Cache forever in both browser and Vercel edge — near-zero function
         invocations after the first view of each image. */
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  })
}
