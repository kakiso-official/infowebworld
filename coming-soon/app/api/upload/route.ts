import { NextRequest } from 'next/server'

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

    // Placeholder: Vercel Blob storage integration needed
    // For now, return a placeholder response
    const placeholderUrl = `/uploads/${type || 'general'}/${Date.now()}-${file.name}`

    return Response.json({
      ok: true,
      url: placeholderUrl,
      message: 'Upload endpoint placeholder. Vercel Blob storage integration required.',
    })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
