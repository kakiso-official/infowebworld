import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBrain, faPalette, faCode, faBullhorn, faGears, faHeadset, faGraduationCap,
  faHeart, faUser, faBriefcase, faDice, faRobot, faFingerprint, faLanguage,
  faChartLine, faUniversalAccess, faCube, faMasksTheater, faDatabase,
  faDiagramProject, faSitemap, faDumbbell, faChalkboardUser, faLayerGroup,
} from '@fortawesome/free-solid-svg-icons'
import { CATEGORIES } from '../config/categories-data'
import type { CategoryCardItem } from '../test-landing-page/CategoriesSection'
import type { CuratedSubcategoryPick } from '../home-sections/popular-subcategories-data'
import { sectorCategoryPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   AI & ML taxonomy pieces for the AI tools directory, computed once from
   the static taxonomy (app/config/categories-data.ts) - no DB, and the
   counts stay real as the taxonomy export grows.
   ═══════════════════════════════════════════════════════════════════════ */

export const AI_SECTOR = 'ai-ml'
export const AI_ACCENT = '#7C6DD4' // --c4 of the Lavender Neural palette

/* "Browse the AI Tools Directory by Category": all L2 categories, in the
   SEO brief's order. Any L2 added later lands at the end in taxonomy
   order, with the generic layer icon. */
const L2_ORDER: { slug: string; icon: IconDefinition }[] = [
  { slug: 'ai-core-models',        icon: faBrain },
  { slug: 'content-creative',      icon: faPalette },
  { slug: 'development-technical', icon: faCode },
  { slug: 'business-marketing',    icon: faBullhorn },
  { slug: 'productivity-workflow', icon: faGears },
  { slug: 'customer-support',      icon: faHeadset },
  { slug: 'education-research',    icon: faGraduationCap },
  { slug: 'life-personal',         icon: faHeart },
  { slug: 'personal',              icon: faUser },
  { slug: 'work',                  icon: faBriefcase },
  { slug: 'random',                icon: faDice },
]

const aiRoot = CATEGORIES.find(c => c.level === 1 && c.slug === AI_SECTOR)

const aiL2 = CATEGORIES
  .filter(c => c.level === 2 && aiRoot && c.parent_id === aiRoot.id)
  .sort((a, b) => {
    const ia = L2_ORDER.findIndex(o => o.slug === a.slug)
    const ib = L2_ORDER.findIndex(o => o.slug === b.slug)
    return (ia === -1 ? L2_ORDER.length : ia) - (ib === -1 ? L2_ORDER.length : ib) || a.sort_order - b.sort_order
  })

/** One card per AI L2; `count` = its direct sub-categories (L3), the number
 *  the brief shows next to each name, e.g. "AI Core & Models (6)". */
export const AI_CATEGORY_ITEMS: CategoryCardItem[] = aiL2.map(l2 => ({
  key: l2.slug,
  href: sectorCategoryPath(AI_SECTOR, l2.slug),
  label: l2.name,
  icon: L2_ORDER.find(o => o.slug === l2.slug)?.icon ?? faLayerGroup,
  accent: AI_ACCENT,
  count: CATEGORIES.filter(c => c.parent_id === l2.id && c.level === 3).length,
}))

/** Every AI sub-category (L3-L5) - 1,381 in the May 2026 export. */
export const AI_SUBCATEGORY_TOTAL = CATEGORIES.filter(c => c.sector_slug === AI_SECTOR && c.level >= 3).length

/* "Popular SI & AI Tools Sub-Categories": the brief's 12 picks, in its
   order. Names follow the taxonomy except "Workout planning", which the
   brief title-cases like every other heading. */
export const AI_POPULAR_PICKS: CuratedSubcategoryPick[] = [
  { slug: 'ai-agents' },
  { slug: 'ai-detection-anti-detection' },
  { slug: 'language-learning' },
  { slug: 'analytics-bi' },
  { slug: 'accessibility-assistive-tech' },
  { slug: 'design-3d' },
  { slug: 'ai-avatars-characters' },
  { slug: 'data-ml' },
  { slug: 'automation-integration' },
  { slug: 'management' },
  { slug: 'workout-planning', name: 'Workout Planning' },
  { slug: 'course-creation' },
]

export const AI_POPULAR_ICONS: Record<string, IconDefinition> = {
  'ai-agents': faRobot,
  'ai-detection-anti-detection': faFingerprint,
  'language-learning': faLanguage,
  'analytics-bi': faChartLine,
  'accessibility-assistive-tech': faUniversalAccess,
  'design-3d': faCube,
  'ai-avatars-characters': faMasksTheater,
  'data-ml': faDatabase,
  'automation-integration': faDiagramProject,
  'management': faSitemap,
  'workout-planning': faDumbbell,
  'course-creation': faChalkboardUser,
}
