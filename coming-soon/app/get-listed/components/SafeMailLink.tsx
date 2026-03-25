'use client'
import { useState, useEffect } from 'react'

/**
 * Renders a mailto link that's invisible to Cloudflare email obfuscation.
 * The email is assembled client-side so it never appears in static HTML.
 */
export default function SafeMailLink({
  user,
  domain,
  children,
  className,
  style,
}: {
  user: string
  domain: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const [href, setHref] = useState('#contact')
  useEffect(() => { setHref('mailto:' + user + '@' + domain) }, [user, domain])
  return <a href={href} className={className} style={style}>{children}</a>
}
