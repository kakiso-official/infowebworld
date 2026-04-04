'use client'
import Link from 'next/link'
import { useCountry } from '../config/country-context'
import { ROOT_COUNTRY } from '../config/countries'
import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>

function shouldPrefix(href: string): boolean {
  if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return false
  if (href.startsWith('/iww-hq') || href.startsWith('/api')) return false
  return true
}

export default function CountryLink({ href, ...props }: LinkProps) {
  const country = useCountry()
  const hrefStr = typeof href === 'string' ? href : href.pathname || '/'
  // US (root country) gets no prefix — clean root URLs
  const prefixed = shouldPrefix(hrefStr)
    ? country === ROOT_COUNTRY ? hrefStr : `/${country}${hrefStr}`
    : hrefStr
  return <Link href={prefixed} {...props} />
}
