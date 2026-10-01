'use client'

import { useState } from 'react'

/* ════════════════════════════════════════════════════════════════════════
   Blog cover image with a self-hiding fallback.

   Renders the real cover <img> on top of the always-present branded
   gradient placeholder (see LatestBlogSection.tsx / blog.css). While the
   image is loading, or if it ever fails to load, this component hides
   itself via onError so the placeholder underneath keeps showing instead
   of a flat tint or a broken-image icon. Client-only (needs state), but
   intentionally tiny and scoped to the blog section — no next/image, no
   next.config changes.
   ════════════════════════════════════════════════════════════════════════ */

export interface BlogCoverImageProps {
  src: string
  alt: string
}

export default function BlogCoverImage({ src, alt }: BlogCoverImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <img
      className="hm-blog-img"
      src={src}
      alt={alt}
      width={640}
      height={360}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
