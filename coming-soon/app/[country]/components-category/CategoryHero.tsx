'use client'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from '../../components/CountryLink'
import { useCountry } from '../../config/country-context'
import { COUNTRY_LABELS, ROUTE_TO_GEO_SLUG, ROUTE_TO_ISO } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import type { Category } from '../../iww-hq/data/category-storage'
import { I, ic } from '../../components/icons'
import { lookupLocationCountry, type GeoCountry, type GeoState, type GeoCity } from '../../lib/geo-slugs'

const LocationSearch = dynamic(() => import('./LocationSearch'), { ssr: false })

type Props = {
  category: Category
  sectorSlug?: string
  locationCountry: GeoCountry | null
  locationState: GeoState | null
  locationCity: GeoCity | null
  onLocationCountryChange: (val: GeoCountry | null) => void
  onStateChange: (val: GeoState | null) => void
  onCityChange: (val: GeoCity | null) => void
  onLocationChange?: (country: GeoCountry | null, state: GeoState | null, city: GeoCity | null) => void
}

/* ── Dynamic SEO description generator ── */
function generateCategoryDesc(
  name: string,
  level: number,
  parentName: string | undefined,
  listingCount: number,
  subCount: number,
  locationCountryName: string,
  stateName: string,
  cityName: string,
): string {
  const year = new Date().getFullYear()
  const month = ['January','February','March','April','May','June','July','August','September','October','November','December'][new Date().getMonth()]

  const fullLoc = cityName && stateName
    ? `${cityName}, ${stateName}, ${locationCountryName}`
    : cityName && locationCountryName
    ? `${cityName}, ${locationCountryName}`
    : stateName && locationCountryName
    ? `${stateName}, ${locationCountryName}`
    : locationCountryName || ''
  const shortLoc = cityName || stateName || locationCountryName || ''

  const inFull = fullLoc ? ` in ${fullLoc}` : ''
  const inShort = shortLoc ? ` in ${shortLoc}` : ''
  const forLoc = shortLoc ? ` for businesses in ${shortLoc}` : ''

  const count = listingCount > 0 ? listingCount : null
  const countBadge = count ? `${count}+` : ''
  const countVerified = count ? `${count}+ verified` : 'verified'
  const browseCount = count ? `Browse ${count}+ listings` : 'Browse listings'

  const sector = parentName || ''
  const inSector = sector ? ` in the ${sector} industry` : ''
  const sectorTag = sector ? ` — a key segment of ${sector}` : ''

  const subText = subCount > 0 ? `, spanning ${subCount} specialized subcategories` : ''
  const subSentence = subCount > 0 ? ` Explore ${subCount} subcategories to narrow down exactly what you need.` : ''

  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  const pick = Math.abs(hash)

  if (level >= 3) {
    const templates = [
      `Looking for the best ${name} companies${inFull}? InfoWebWorld lists ${countVerified} ${name} providers${inSector} — each with detailed profiles, genuine user reviews, pricing transparency, and direct contact options. Compare solutions side by side and connect with the right partner. Last updated ${month} ${year}.`,
      `${name}${sectorTag}. ${browseCount}${inShort} with real customer reviews, feature breakdowns, and satisfaction scores. Every listing on InfoWebWorld is manually verified so you can shortlist, compare, and reach out to ${name} providers${forLoc} with confidence. Free to use, no sign-up required.`,
      `Find ${countVerified} ${name} solutions${inFull}. InfoWebWorld makes it easy to compare ${name} companies${inSector} by features, pricing, reviews, and ratings — all on one page. Read what real users say, check verified credentials, and request quotes directly. Updated ${month} ${year}.`,
      `The most comprehensive directory of ${name} providers${inFull}. ${countBadge ? `With ${countBadge} verified listings` : 'With verified listings'}${inSector}, InfoWebWorld helps you evaluate every option — from feature sets and integrations to pricing models and customer support.`,
      `Why waste hours researching ${name} companies? InfoWebWorld curates ${countVerified} providers${inShort}${inSector}, complete with user reviews, feature comparisons, and trust scores. Filter by location, budget, or specialization — then connect directly. Updated for ${month} ${year}.`,
      `${name}${inFull} — your definitive comparison guide. We've gathered ${countVerified} providers${inSector} with honest reviews from real customers, transparent pricing, and detailed capability breakdowns. Find and compare the best ${name} options in minutes.`,
    ]
    return templates[pick % templates.length]
  }

  const templates = [
    `Explore the top ${name} companies${inFull}${subText}. InfoWebWorld brings you ${countVerified} listings with in-depth profiles, authentic user reviews, feature comparisons, and pricing details.${subSentence} Updated ${month} ${year}.`,
    `${name}${inFull} — discover ${countVerified} businesses${subText}. From emerging startups to established leaders${inSector}, every listing on InfoWebWorld is vetted for quality.${subSentence} Last updated ${month} ${year}.`,
    `Your complete guide to ${name}${inShort}. ${browseCount}${subText}${inSector}, each with verified reviews, transparent pricing, and detailed feature breakdowns.${subSentence}`,
    `Find and compare the best ${name} providers${inFull}. ${countBadge ? `${countBadge} verified companies` : 'Verified companies'}${subText} — all reviewed by real users.${subSentence} Updated for ${year}.`,
    `Need ${name} services${forLoc}? InfoWebWorld is the largest curated directory of ${name} providers${inSector}${subText}. Every listing includes verified reviews, feature matrices, and direct contact.${subSentence} Updated ${month} ${year}.`,
    `The definitive ${name} directory${inFull}. ${browseCount}${subText}${inSector} with side-by-side comparisons and genuine user feedback. Free, transparent, and always up to date.${subSentence}`,
  ]
  return templates[pick % templates.length]
}

export default function CategoryHero({ category: c, sectorSlug, locationCountry, locationState, locationCity, onLocationCountryChange, onStateChange, onCityChange, onLocationChange }: Props) {
  const siteCountry = useCountry()
  const color = c.color || 'var(--h-accent)'

  const routeGeoCountry = useMemo(() => {
    const geoSlug = ROUTE_TO_GEO_SLUG[siteCountry as CountryCode]
    if (!geoSlug) return null
    return lookupLocationCountry(geoSlug)
  }, [siteCountry])

  const effectiveCountry = useMemo(() => locationCountry || routeGeoCountry, [locationCountry, routeGeoCountry])
  const effectiveIso = effectiveCountry?.isoCode || ROUTE_TO_ISO[siteCountry as CountryCode] || ''

  const countryDisplayName = effectiveCountry?.name || COUNTRY_LABELS[siteCountry as CountryCode] || ''
  const locationText = [locationCity?.name, locationState?.name, countryDisplayName].filter(Boolean).join(', ')

  const subCount = c.subcategories?.length ?? 0
  const hasListings = c.listingCount > 0

  return (
    <div className="cd-hero">
      {/* ── Breadcrumb ── */}
      <nav className="cd-breadcrumb" aria-label="Breadcrumb">
        <Link href="/categories">Categories</Link>
        <span className="cd-breadcrumb-sep">/</span>
        {c.parentName && c.parentSlug && (
          <>
            <Link href={sectorSlug ? `/${sectorSlug}` : `/${c.parentSlug}`}>{c.parentName}</Link>
            <span className="cd-breadcrumb-sep">/</span>
          </>
        )}
        <span className="cd-breadcrumb-current">{c.name}</span>
      </nav>

      {/* ── Title with accent ── */}
      <h2 className="cd-hero-title">
        Best <em style={{ color }}>{c.name}</em> in {locationText}
      </h2>

      {/* ── Location search ── */}
      {onLocationChange && (
        <LocationSearch
          effectiveIso={effectiveIso}
          effectiveCountryName={countryDisplayName}
          locationCountry={locationCountry}
          locationState={locationState}
          locationCity={locationCity}
          onLocationChange={onLocationChange}
        />
      )}

      {/* ── Description ── */}
      <p className="cd-hero-desc">
        {c.description || generateCategoryDesc(
          c.name, c.level, c.parentName, c.listingCount,
          subCount, countryDisplayName,
          locationState?.name || '', locationCity?.name || '',
        )}
      </p>

      {/* ── Stat pills (colored, matching /categories style) ── */}
      <div className="cd-hero-pills">
        <span className="cd-hero-pill" style={{ '--pc': color } as React.CSSProperties}>
          <I d={ic.building} size={13} color={color} sw={2} />
          <strong>{c.listingCount || 0}</strong> {hasListings ? 'verified companies' : 'companies'}
        </span>
        {subCount > 0 && (
          <span className="cd-hero-pill" style={{ '--pc': '#8B5CF6' } as React.CSSProperties}>
            <I d={ic.layers} size={13} color="#8B5CF6" sw={2} />
            <strong>{subCount}</strong> subcategories
          </span>
        )}
        {c.parentName && (
          <span className="cd-hero-pill" style={{ '--pc': '#14B8A6' } as React.CSSProperties}>
            <I d={ic.grid} size={13} color="#14B8A6" sw={2} />
            {c.parentName}
          </span>
        )}
      </div>
    </div>
  )
}
