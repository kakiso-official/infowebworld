import Link from '../../../components/CountryLink'
import type { Category } from '../../../iww-hq/data/category-storage'

export default function CategoryHero({ category: c }: { category: Category }) {
  return (
    <div className="cd-hero">
      {/* Breadcrumb */}
      <nav className="cd-breadcrumb">
        <Link href="/">Home</Link>
        <span className="cd-breadcrumb-sep">&gt;</span>
        <Link href="/categories">Categories</Link>
        {c.parentName && c.parentSlug && (
          <>
            <span className="cd-breadcrumb-sep">&gt;</span>
            <Link href={`/category/${c.parentSlug}`}>{c.parentName}</Link>
          </>
        )}
        <span className="cd-breadcrumb-sep">&gt;</span>
        <span className="cd-breadcrumb-current">{c.name}</span>
      </nav>

      {/* Title */}
      <h1 className="cd-hero-title">
        Best in {c.name}
      </h1>

      {/* Description */}
      <p className="cd-hero-desc">
        {c.description || `Discover and compare the best ${c.name} businesses and software. Read verified reviews, compare features, and find the right solution.`}
      </p>

      {/* Stat pills */}
      <div className="cd-hero-pills">
        <span className="cd-hero-pill">
          <strong style={{ color: 'var(--h-accent)' }}>{c.listingCount || 0}</strong> companies
        </span>
        {(c.subcategories?.length ?? 0) > 0 && (
          <span className="cd-hero-pill">
            <strong style={{ color: '#8B5CF6' }}>{c.subcategories!.length}</strong> subcategories
          </span>
        )}
      </div>
    </div>
  )
}
