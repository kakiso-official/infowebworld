'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { VALID_COUNTRIES, COUNTRY_LABELS, COUNTRY_FLAGS, COOKIE_NAME, COOKIE_MAX_AGE, ROOT_COUNTRY } from '../config/countries'
import type { CountryCode } from '../config/countries'
import { useCountry } from '../config/country-context'

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
        <svg viewBox="0 0 24 24" className="hd-country-globe">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z" />
        </svg>
        <span className="hd-country-code">{country.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" className="hd-country-chev">
          <path d="M6 9l6 6 6-6" />
        </svg>
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
