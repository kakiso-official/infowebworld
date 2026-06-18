import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type CardDef = { slug: string; label: string; icon: IconDefinition }

/** Per-sector copy for every shared landing section. Headings, sub-copy,
 *  empty states, and "Browse all" CTA labels. Sector-specific so the AI/ML
 *  defaults baked into the test pages don't bleed onto Software, IT, etc. */
export type SectorSectionsCopy = {
  /** "Most Popular AI Categories" left-rail title (line break allowed). */
  popularCatsTitle: string
  /** TopFirms section sub-paragraph. */
  topFirmsSub: string
  /** TopFirms aria-label for the tablist (screen reader). */
  topFirmsTabsLabel: string
  /** "More top-rated {emptyNoun} are coming soon in <Cat>" empty-state noun. */
  topFirmsEmptyNoun: string
  /** "Just launched on InfoWebWorld" sub-paragraph. */
  newLaunchesSub: string
  /** "Browse all {noun}" CTA on NewLaunches. */
  newLaunchesCta: string
  /** "Most popular AI tools" PopularTools section title. */
  popularToolsTitle: string
  /** PopularTools section sub (when there are firms). */
  popularToolsSub: string
  /** PopularTools section sub (empty state). */
  popularToolsEmptySub: string
  /** "No AI tools to feature yet — check back soon." empty-state line. */
  popularToolsEmptyLine: string
  /** "Browse all AI tools" CTA on PopularTools. */
  popularToolsCta: string
}

export type SectorLandingConfig = {
  /** L1 slug — also the route segment (e.g. "ai-ml"). */
  slug: string
  /** Display name for crumbs / meta. */
  name: string
  /** Palette label (from the brand sheet). */
  paletteName: string
  /** Per-sector scope class on the <main>. Combined with `tcat1` base. */
  scopeClass: string
  /** Page <title>. */
  metaTitle: string
  /** Meta description (also reused in JSON-LD / sub copy where short). */
  metaDescription: string
  /** Hero H1. */
  heroTitle: string
  /** Hero supporting paragraph (under H1). */
  heroSub: string
  /** Search input placeholder. */
  heroPlaceholder: string
  /** CategoriesSection grid heading. */
  catsHeading: string
  /** CategoriesSection grid sub-heading. */
  catsSub: string
  /** "Explore all categories" CTA button label (sector-specific). */
  catsCtaLabel: string
  /** 6 hand-picked L2 cards (slug must exist under this sector). */
  cards: CardDef[]
  /** Per-section copy for the shared landing sections (Popular, TopFirms,
   *  NewLaunches, PopularTools). Keeps AI/ML copy from bleeding into other
   *  sector landings. */
  sections: SectorSectionsCopy
}
