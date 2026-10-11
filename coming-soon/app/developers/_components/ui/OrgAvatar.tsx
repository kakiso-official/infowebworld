import type { CSSProperties } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   GitHub organization avatar (spec 4.13).

   A plain <img> (GitHub avatars are not in next.config images.remotePatterns),
   sized with width/height, lazy, at 2x resolution via GitHub's ?s= param.

   Fallback without client JS: an initials tile sits underneath the image.
   The <img> always has alt="" (the accessible name lives on the wrapper),
   and a broken image with an empty alt paints nothing, so a missing or
   failed avatar shows the initials instead of a broken-image icon. With
   no `src` at all, the initials tile is the avatar.
   ═══════════════════════════════════════════════════════════════════════ */

export type OrgAvatarSize = 20 | 24 | 28 | 32 | 40 | 48 | 56 | 64

export interface OrgAvatarProps {
  src: string | null | undefined
  /** Company or org name: initials + accessible name. */
  name: string
  size?: OrgAvatarSize
  /** True when the name is NOT printed next to the avatar, so the avatar
   *  itself must be announced. Default false (decorative). */
  labelled?: boolean
  className?: string
}

/** GitHub avatar URL at a given pixel size (adds or replaces ?s=). */
export function githubAvatarUrl(src: string, px: number): string {
  try {
    const url = new URL(src)
    if (/(^|\.)githubusercontent\.com$/i.test(url.hostname) || /(^|\.)github\.com$/i.test(url.hostname)) {
      url.searchParams.set('s', String(px))
    }
    return url.toString()
  } catch {
    return src
  }
}

/** One or two letters for the fallback tile: 'Grafana Labs' -> 'GL'. */
export function initialsOf(name: string): string {
  /* Letters (incl. accented Latin) and digits only, so '.NET' or 'x.ai' still give letters. */
  const words = name.replace(/[^A-Za-z0-9À-ɏ\s]/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function OrgAvatar({ src, name, size = 24, labelled = false, className }: OrgAvatarProps) {
  const radius = size >= 56 ? 12 : size >= 40 ? 10 : size <= 20 ? 6 : 8
  const style = { '--dv-av': `${size}px`, '--dv-av-r': `${radius}px` } as CSSProperties
  const a11y = labelled ? { role: 'img', 'aria-label': name } : { 'aria-hidden': true as const }

  return (
    <span className={`dv-avatar${className ? ` ${className}` : ''}`} style={style} {...a11y}>
      <span className="dv-avatar-initials">{initialsOf(name)}</span>
      {src && (
        /* GitHub avatars are not an allowed next/image host and are already
           sized by ?s=, so a plain lazy <img> is the right tool here. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="dv-avatar-img"
          src={githubAvatarUrl(src, size * 2)}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}
    </span>
  )
}
