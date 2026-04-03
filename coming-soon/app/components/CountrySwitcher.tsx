'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { VALID_COUNTRIES, COUNTRY_LABELS, COUNTRY_FLAGS, COOKIE_NAME, COOKIE_MAX_AGE, ROOT_COUNTRY } from '../config/countries'
import type { CountryCode } from '../config/countries'
import { useCountry } from '../config/country-context'
import { HugeiconsIcon } from '@hugeicons/react'
import { Globe02Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'

export default function CountrySwitcher() {
  const country = useCountry()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchCountry = (newCountry: CountryCode) => {
    if (newCountry === country) { setOpen(false); return }
    document.cookie = `${COOKIE_NAME}=${newCountry};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
    // Strip current country prefix (if any) to get the bare path
    const pathWithoutCountry = country === ROOT_COUNTRY
      ? pathname
      : pathname.replace(new RegExp(`^/${country}(/|$)`), '/')
    // US (root country) → navigate to root path, others get prefix
    if (newCountry === ROOT_COUNTRY) {
      router.push(pathWithoutCountry || '/')
    } else {
      router.push(`/${newCountry}${pathWithoutCountry === '/' ? '' : pathWithoutCountry}`)
    }
    setOpen(false)
  }

  return (
    <div className="hd-country" ref={ref}>
      <button
        type="button"
        className="hd-country-btn"
        onClick={() => setOpen(!open)}
        aria-label="Select country"
      >
        <span className="hd-country-globe"><HugeiconsIcon icon={Globe02Icon} size={20} color="currentColor" strokeWidth={1.5} /></span>
        <span className="hd-country-code">{country.toUpperCase()}</span>
        <span className="hd-country-chev"><HugeiconsIcon icon={ArrowDown01Icon} size={16} color="currentColor" strokeWidth={2} /></span>
      </button>

      {open && (
        <div className="hd-country-dropdown">
          {VALID_COUNTRIES.map(c => (
            <button
              key={c}
              type="button"
              className={`hd-country-option${c === country ? ' hd-country-option--active' : ''}`}
              onClick={() => switchCountry(c)}
            >
              <span className="hd-country-flag">{COUNTRY_FLAGS[c]}</span>
              <span className="hd-country-label">{COUNTRY_LABELS[c]}</span>
              <span className="hd-country-slug">{c.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
