import { absoluteUrl, devHubPath } from '@/lib/developers/paths'
import type { DevCrumb } from '@/lib/developers/jsonld'

/* ═══════════════════════════════════════════════════════════════════════
   Breadcrumbs (spec 2.4, 4.13). One trail array per page (devCrumbs.* in
   lib/developers/jsonld.ts) feeds both this visible nav (with
   BreadcrumbList microdata) and the JSON-LD breadcrumb in DvJsonLd, so
   the two can never drift.

   Every crumb except the last links to a real page. On phones (<= 480)
   a long trail collapses to '... / {parent} / {current}', where '...'
   links to /developers; the microdata keeps the full trail.
   ═══════════════════════════════════════════════════════════════════════ */

/** { name, path } - the same shape as DevCrumb in lib/developers/jsonld.ts. */
export type DvCrumb = DevCrumb

/** Home / Developers / ...rest - the trail every developers page starts with. */
export function crumbTrail(...rest: DvCrumb[]): DvCrumb[] {
  return [{ name: 'Home', path: '/' }, { name: 'Developers', path: devHubPath() }, ...rest]
}

export interface DvBreadcrumbsProps {
  items: readonly DvCrumb[]
  className?: string
}

export default function DvBreadcrumbs({ items, className }: DvBreadcrumbsProps) {
  if (!items.length) return null
  const collapsible = items.length > 3
  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={`dv-crumbs${collapsible ? ' dv-crumbs--collapsible' : ''}${className ? ` ${className}` : ''}`}>
      <ol className="dv-crumbs-list" itemScope itemType="https://schema.org/BreadcrumbList">
        {collapsible && (
          <li className="dv-crumbs-item dv-crumbs-more">
            <a href={devHubPath()} aria-label="Developers">...</a>
          </li>
        )}
        {items.map((item, i) => {
          const isLast = i === lastIndex
          const hideSm = collapsible && i < lastIndex - 1
          return (
            <li
              key={`${item.path}-${i}`}
              className="dv-crumbs-item"
              data-hide-sm={hideSm ? '' : undefined}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <>
                  <span aria-current="page" itemProp="name">{item.name}</span>
                  <meta itemProp="item" content={absoluteUrl(item.path)} />
                </>
              ) : (
                <a href={item.path} itemProp="item">
                  <span itemProp="name">{item.name}</span>
                </a>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
