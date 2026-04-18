import { NextRequest } from 'next/server'
import http from 'node:http'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/* Hit cPanel directly via IP + Host header so requests don't bounce
   through Vercel (which now owns infowebworld.com). Uses Node's http
   module because node:fetch silently strips the Host header. */
const CPANEL_IP = '104.152.168.46'
const CPANEL_HOST = 'infowebworld.com'
const CPANEL_UPLOAD_PATH = '/infowebworld/api.php?action=file_upload'

/** Build a multipart/form-data body with a single file field + a type field. */
function buildMultipart(file: { name: string; type: string; bytes: Buffer }, type: string): { body: Buffer; boundary: string } {
  const boundary = '----IWWUpload' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  const CRLF = '\r\n'
  const chunks: Buffer[] = []

  chunks.push(Buffer.from(
    `--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="file"; filename="${file.name.replace(/"/g, '')}"${CRLF}` +
    `Content-Type: ${file.type}${CRLF}${CRLF}`
  ))
  chunks.push(file.bytes)
  chunks.push(Buffer.from(CRLF))

  chunks.push(Buffer.from(
    `--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="type"${CRLF}${CRLF}` +
    `${type}${CRLF}`
  ))
  chunks.push(Buffer.from(`--${boundary}--${CRLF}`))

  return { body: Buffer.concat(chunks), boundary }
}

function postToCpanel(body: Buffer, boundary: string): Promise<{ status: number; text: string }> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: CPANEL_IP,
        port: 80,
        method: 'POST',
        path: CPANEL_UPLOAD_PATH,
        headers: {
          Host: CPANEL_HOST,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        const parts: Buffer[] = []
        res.on('data', (c: Buffer) => parts.push(c))
        res.on('end', () =>
          resolve({ status: res.statusCode || 500, text: Buffer.concat(parts).toString('utf8') })
        )
      }
    )
    req.on('error', (e) => resolve({ status: 502, text: String(e) }))
    req.setTimeout(30000, () => { req.destroy(); resolve({ status: 504, text: 'timeout' }) })
    req.write(body)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    const allowed = await checkRateLimit(ip, 'upload', 10, 600)
    if (!allowed) {
      return Response.json({ error: 'Too many uploads. Try again later.' }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string | null) || 'logo'

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, SVG, GIF.' }, { status: 400 })
    }

    /* Read file into memory and build multipart body (manually — node:fetch strips Host). */
    const bytes = Buffer.from(await file.arrayBuffer())
    const { body, boundary } = buildMultipart(
      { name: file.name || 'upload', type: file.type, bytes },
      type
    )

    const cp = await postToCpanel(body, boundary)

    if (cp.status >= 400) {
      console.error('cPanel upload failed:', cp.status, cp.text.slice(0, 300))
      return Response.json({ error: 'Upload to server failed' }, { status: 502 })
    }

    let data: { ok?: boolean; url?: string; error?: string }
    try { data = JSON.parse(cp.text) }
    catch { return Response.json({ error: 'Bad response from upload server' }, { status: 502 }) }

    if (data.error) return Response.json({ error: data.error }, { status: 400 })

    /* Rewrite the cPanel-returned path to go through our /api/file/ proxy.
       cPanel returns "/infowebworld/uploads/logos/abc.jpg".
       /api/file/ fetches from cPanel by IP and caches at the edge. */
    const raw = String(data.url || '')
    const m = raw.match(/\/infowebworld\/uploads\/(.+)$/)
    const url = m
      ? `/api/file/${m[1]}`
      : (raw.startsWith('http') ? raw : `https://infowebworld.com${raw}`)

    return Response.json({ ok: true, url })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
