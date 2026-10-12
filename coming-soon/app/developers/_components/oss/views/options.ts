import type { OssCompany, OssRepo } from '@/lib/developers/types'
import { repoLanguageSlug } from '@/lib/developers/oss'
import type { RowFilterOption } from '../../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   Select options for the client filter bars, built on the server from the
   rows actually on the page (so every option matches at least one row),
   most common first.
   ═══════════════════════════════════════════════════════════════════════ */

function ranked(counts: Map<string, { label: string; count: number }>): RowFilterOption[] {
  return [...counts.entries()]
    .map(([value, v]) => ({ value, label: v.label, count: v.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'en'))
}

function bump(counts: Map<string, { label: string; count: number }>, value: string, label: string): void {
  const cur = counts.get(value)
  if (cur) cur.count++
  else counts.set(value, { label, count: 1 })
}

/** Primary languages of these repos. */
export function languageOptions(repos: readonly Pick<OssRepo, 'primaryLanguage'>[]): RowFilterOption[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const r of repos) {
    const slug = repoLanguageSlug(r)
    if (slug && r.primaryLanguage) bump(counts, slug, r.primaryLanguage.name)
  }
  return ranked(counts)
}

/** Industries of these companies. */
export function industryOptions(companies: readonly Pick<OssCompany, 'industry' | 'industrySlug'>[]): RowFilterOption[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const c of companies) bump(counts, c.industrySlug, c.industry)
  return ranked(counts)
}

/** HQ countries of these companies (full names, never codes). */
export function countryOptions(companies: readonly Pick<OssCompany, 'countrySlug' | 'countryName'>[]): RowFilterOption[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const c of companies) if (c.countrySlug && c.countryName) bump(counts, c.countrySlug, c.countryName)
  return ranked(counts)
}
