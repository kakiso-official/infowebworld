'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { REAL_COUNTRIES, COUNTRY_LABELS, COUNTRY_FLAG_ISO, COOKIE_NAME, COOKIE_MAX_AGE, GLOBAL_COOKIE, isValidCountry } from '../config/countries'
import type { CountryCode } from '../config/countries'
import { useCountry } from '../config/country-context'
import { I, ic } from './icons'

export default function CountrySwitcher() {
  const country = useCountry()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Detect if current page is global (root, no prefix)
  const firstSeg = pathname.split('/')[1]
  const isGlobal = !isValidCountry(firstSeg)

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /** Get the bare path without any country prefix */
  const getBarePath = (): string => {
    if (isGlobal) return pathname
    const withoutPrefix = pathname.replace(new RegExp(`^/${firstSeg}(/|$)`), '/')
    return withoutPrefix || '/'
  }

  const switchToGlobal = () => {
    document.cookie = `${COOKIE_NAME}=${GLOBAL_COOKIE};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
    router.push(getBarePath())
    setOpen(false)
  }

  const switchCountry = (newCountry: CountryCode) => {
    if (!isGlobal && newCountry === (firstSeg as CountryCode)) { setOpen(false); return }
    document.cookie = `${COOKIE_NAME}=${newCountry};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
    const bare = getBarePath()
    router.push(`/${newCountry}${bare === '/' ? '' : bare}`)
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
        <span className="hd-country-globe"><I d={ic.globe} size={20} color="currentColor" sw={1.5} /></span>
        <span className="hd-country-code">{isGlobal ? 'GLOBAL' : firstSeg === 'uk' ? 'UK' : (firstSeg as string).toUpperCase()}</span>
        <span className="hd-country-chev"><I d={ic.chevronDown} size={16} color="currentColor" sw={2} /></span>
      </button>

      {open && (
        <div className="hd-country-dropdown">
          {/* Global option */}
          <button
            type="button"
            className={`hd-country-option hd-country-option--global${isGlobal ? ' hd-country-option--active' : ''}`}
            onClick={switchToGlobal}
          >
            <span className="hd-country-flag"><I d={ic.globe} size={20} color="currentColor" sw={1.5} /></span>
            <span className="hd-country-label">Global</span>
          </button>
          <div className="hd-country-divider" />
          {/* Countries — alphabetically sorted */}
          {[...REAL_COUNTRIES]
            .sort((a, b) => COUNTRY_LABELS[a].localeCompare(COUNTRY_LABELS[b]))
            .map(c => (
            <button
              key={c}
              type="button"
              className={`hd-country-option${!isGlobal && c === firstSeg ? ' hd-country-option--active' : ''}`}
              onClick={() => switchCountry(c)}
            >
              <img className="hd-country-flag-img" src={`https://flagcdn.com/${COUNTRY_FLAG_ISO[c]}.svg`} alt={COUNTRY_LABELS[c]} width={20} height={15} />
              <span className="hd-country-label">{COUNTRY_LABELS[c]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
