import Image from 'next/image'
import { flagUrl } from '@/lib/country-paths'

/* ═══════════════════════════════════════════════════════════════════════
   Country flag (spec 4.13): next/image from flagcdn.com (an allowed
   remote host), 20x15, alt="" because the full country name is always
   printed next to it. `DvCountry` is the flag + name pair.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvFlagProps {
  /** ISO 3166-1 alpha-2 code, e.g. 'US'. */
  code: string
  className?: string
}

export default function DvFlag({ code, className }: DvFlagProps) {
  if (!/^[A-Za-z]{2}$/.test(code)) return null
  return (
    <Image
      className={className ? `dv-flag ${className}` : 'dv-flag'}
      src={flagUrl(code, 40)}
      alt=""
      width={20}
      height={15}
      loading="lazy"
    />
  )
}

export interface DvCountryProps {
  code: string | null | undefined
  /** Full country name (never an abbreviation as anchor text). */
  name: string
  href?: string
  className?: string
}

/** Flag + full country name, optionally linked (a country page). */
export function DvCountry({ code, name, href, className }: DvCountryProps) {
  const body = (
    <>
      {code && <DvFlag code={code} />}
      <span>{name}</span>
    </>
  )
  const cls = className ? `dv-country ${className}` : 'dv-country'
  return href ? <a className={cls} href={href}>{body}</a> : <span className={cls}>{body}</span>
}
