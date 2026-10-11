import { brandNode, organizationNode, websiteNode } from '@/app/components/seo-schema'
import { devBreadcrumbNode, serializeJsonLd, thing, webPageNode, type DevPageType } from '@/lib/developers/jsonld'
import type { DvCrumb } from './DvBreadcrumbs'

/* ═══════════════════════════════════════════════════════════════════════
   The page's one JSON-LD block (spec 3.0):

     @graph = Organization, Brand, WebSite (shared @ids from seo-schema.ts),
              BreadcrumbList (url#breadcrumb, from the same trail as the
              visible crumbs), the page node (url#webpage: CollectionPage,
              WebPage, AboutPage, SearchResultsPage), then page nodes.

   A thin renderer over lib/developers/jsonld.ts, so pages that build the
   graph in code (devPageGraph) and pages that use this component emit the
   same nodes. `name` is the H1 (long dashes cleaned). Node builders
   (listNode, faqGraphNode, datasetNode, softwareSourceCodeNode, webApiNode)
   go in `nodes`; falsy entries are skipped so pages can write
   `cond && node`. '<' is escaped so no data string can close the <script>.
   ═══════════════════════════════════════════════════════════════════════ */

type JsonNode = Record<string, unknown>

/** The @id values of a page (url, #webpage, #breadcrumb, #faq, #list, #org,
 *  #code, #api, #dataset, #howto), re-exported for page nodes. */
export { pageIds } from '@/lib/developers/jsonld'

export interface DvJsonLdProps {
  /** Canonical site-relative path of the page. */
  path: string
  /** The H1. */
  name: string
  description?: string | null
  crumbs: readonly DvCrumb[]
  /** Page node type (default 'CollectionPage'). */
  type?: DevPageType
  /** Snapshot or content date; written as YYYY-MM-DD. */
  dateModified?: string | null
  /** `about` entries: plain names become Thing nodes. */
  about?: ReadonlyArray<string | JsonNode>
  /** @id of the node the page is mainly about (#code, #api). */
  mainEntityId?: string | null
  /** Extra fields merged into the page node (significantLink, ...). */
  page?: JsonNode
  /** Further graph nodes; null/false entries are skipped. */
  nodes?: ReadonlyArray<JsonNode | null | undefined | false>
}

export default function DvJsonLd({
  path, name, description, crumbs, type = 'CollectionPage', dateModified, about, mainEntityId, page, nodes,
}: DvJsonLdProps) {
  const pageNode: JsonNode = {
    ...webPageNode({
      path,
      name,
      type,
      description,
      dateModified,
      about: about && about.length ? about.map(a => (typeof a === 'string' ? thing(a) : a)) : null,
      mainEntityId,
    }),
    ...(page ?? {}),
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      brandNode,
      websiteNode,
      devBreadcrumbNode(path, crumbs),
      pageNode,
      ...(nodes ?? []).filter((n): n is JsonNode => !!n),
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }} />
}
