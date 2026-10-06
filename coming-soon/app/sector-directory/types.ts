import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { CuratedSubcategoryPick } from '../home-sections/popular-subcategories-data'
import type { BlogTopic } from '../home-sections/latest-blog-data'
import type { HomeFaq } from '../home-sections/home-faq-data'

/* ═══════════════════════════════════════════════════════════════════════
   One sector directory page (the "[sector] directory" landings built to the
   Oct 2026 SEO specs) = one SectorDirectorySpec rendered by
   SectorDirectoryPage. A spec is the page's copy, in the spec's section
   order, plus the taxonomy picks; every number on the page is computed
   from live data or the static taxonomy, never written into a spec.
   ═══════════════════════════════════════════════════════════════════════ */

/** A hero stat badge. Numbers are filled in at render time:
 *   listings      - live listings in the sector ("1,725+ Verified Companies")
 *   countries     - countries those listings come from ("13+ Countries Served")
 *   subcategories - L3-L5 categories in the static taxonomy; `roundTo`
 *                   floors it the way the spec writes it (100 -> "800+",
 *                   1000 -> "1,000+"), otherwise the exact count ("2,455")
 *   static        - fixed text ("100% Manually Verified")
 *  A live badge is left out when its number is unknown (DB failure). */
export type HeroStat =
  | { kind: 'listings' | 'countries'; label: string; icon: IconDefinition }
  | { kind: 'subcategories'; label: string; icon: IconDefinition; roundTo?: 100 | 1000 }
  | { kind: 'static'; text: string; icon: IconDefinition }

export type Cta = { label: string; href: string }

export type SectorDirectorySpec = {
  /** L1 sector slug. The landing URL is sectorLandingPath(sector) and the
   *  category pages live under it (lib/sector-paths.ts). */
  sector: string
  /** Icon colour for the category and sub-category cards: the palette's
   *  --c4 (app/styles/test-category-1-page/palettes.css). */
  accent: string
  /** BreadcrumbList name for the landing, e.g. "SaaS Directory". */
  breadcrumbName: string

  meta: {
    title: string
    description: string
    keywords: string[]
    /** Alt text of the Open Graph image. */
    ogImageAlt: string
    /** CollectionPage `about` (e.g. "Local businesses"). */
    about: string
  }

  hero: {
    title: string
    sub: string
    searchPlaceholder: string
    stats: HeroStat[]
    primaryCta: Cta
    secondaryCta: Cta
  }

  /** "Browse ... by Category": these L2 categories, in this order. Names and
   *  sub-category counts come from the taxonomy. */
  categories: {
    heading: string
    sub: string
    /** JSON-LD ItemList name. */
    listName: string
    l2: { slug: string; icon: IconDefinition }[]
  }

  /** Curated sub-categories ("Most Searched ..."). */
  popular: {
    /** "{n}" becomes the sub-category total floored to 100 ("800+"). */
    heading: string
    sub: string
    cta: Cta
    picks: CuratedSubcategoryPick[]
    icons: Record<string, IconDefinition>
  }

  featured: {
    heading: string
    sub: string
    tabsLabel: string
    emptyNoun: string
    /** Render listing names as <h3> (the startup spec asks for it). */
    namesAsHeadings?: boolean
  }

  recent: { heading: string; sub: string; ctaLabel: string }

  countries: {
    heading: string
    sub: string
    /** "{n}" becomes the number of countries. */
    pillTemplate: string
  }

  comparison: {
    heading: string
    sub: string
    /** Visually hidden table caption. */
    caption: string
    audiences: { heading: string; text: string; icon: IconDefinition }[]
  }

  reviews: { heading: string; sub: string; ctaLabel: string }

  blog: { heading: string; sub: string; ctaLabel: string; topic: BlogTopic }

  /** Single source for the visible FAQ and the FAQPage node. */
  faqs: HomeFaq[]

  finalCta: { title: string; subtitle: string; cta: Cta }
}
