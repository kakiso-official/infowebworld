'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCountry } from '../config/country-context'
import { isValidCountry } from '../config/countries'
import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>

function shouldPrefix(href: string): boolean {
  if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return false
  if (href.startsWith('/iww-hq') || href.startsWith('/api')) return false
  return true
}

export default function CountryLink({ href, ...props }: LinkProps) {
  const country = useCountry()
  const pathname = usePathname()
  const hrefStr = typeof href === 'string' ? href : href.pathname || '/'

  // Detect if we're on a country-prefixed page or root/global
  const firstSeg = pathname.split('/')[1]
  const isGlobal = !isValidCountry(firstSeg)

  // Global pages → no prefix (stay at root). Country pages → /{country}/ prefix
  const prefixed = shouldPrefix(hrefStr)
    ? isGlobal ? hrefStr : `/${country}${hrefStr}`
    : hrefStr

  return <Link href={prefixed} prefetch={false} {...props} />
}
