import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, SVG, GIF.' }, { status: 400 })
    }

    // Upload to Vercel Blob storage
    const folder = type === 'logo' ? 'logos' : type === 'screenshot' ? 'screenshots' : 'uploads'
    const ext = file.name.split('.').pop() || 'jpg'
    const pathname = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return Response.json({ ok: true, url: blob.url })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    const message = err instanceof Error ? err.message : 'Server error'
    return Response.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
