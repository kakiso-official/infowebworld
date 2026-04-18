import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

const CPANEL_UPLOAD_URL = 'https://infowebworld.com/infowebworld/api.php?action=file_upload'

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    const allowed = await checkRateLimit(ip, 'upload', 10, 600)
    if (!allowed) {
      return Response.json(
        { error: 'Too many uploads. Try again later.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, SVG, GIF.' }, { status: 400 })
    }

    // Forward file to cPanel PHP upload endpoint
    const cpanelForm = new FormData()
    cpanelForm.append('file', file)
    cpanelForm.append('type', type || 'logo')

    const res = await fetch(CPANEL_UPLOAD_URL, {
      method: 'POST',
      body: cpanelForm,
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('cPanel upload failed:', res.status, text)
      return Response.json({ error: 'Upload to server failed' }, { status: 502 })
    }

    const data = await res.json()

    if (data.error) {
      return Response.json({ error: data.error }, { status: 400 })
    }

    // data.url is like "/infowebworld/uploads/logos/abc123.jpg"
    // Return the full cPanel URL so images load directly from there
    const url = data.url?.startsWith('http')
      ? data.url
      : `https://infowebworld.com${data.url}`

    return Response.json({ ok: true, url })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
