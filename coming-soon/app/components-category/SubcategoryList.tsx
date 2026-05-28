'use client'
import Link from 'next/link'

type Sub = { id: string; slug: string; name: string; listingCount: number }

/* Same folder glyph used on the /listing page's Related Categories block.
   currentColor + sector palette inheritance via the parent .tcat-<slug>. */
function FolderIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M6 14h12l3 4h21v22H6z" />
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" opacity=".55"
        d="M6 14l3 4h12l3 4h18" />
    </svg>
  )
}

/**
 * Flat inline subcategory list — folder icon + name, no boxes, no
 * transforms, no animations. Hover state is a single underline.
 * Sector color comes from the .tcat-<slug> scope via --c4.
 */
export default function SubcategoryList({
  subcategories,
  sectorSlug,
}: {
  subcategories: Sub[]
  sectorSlug?: string
}) {
  if (!subcategories.length) return null
  const sp = sectorSlug ? `/${sectorSlug}` : ''
  return (
    <ul className="cd-sublist" aria-label="Subcategories">
      {subcategories.map(sc => (
        <li key={sc.id} className="cd-sublist-item">
          <Link href={`${sp}/${sc.slug}`} className="cd-sublist-link">
            <span className="cd-sublist-ico" aria-hidden="true"><FolderIcon size={20} /></span>
            <span className="cd-sublist-name">{sc.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
