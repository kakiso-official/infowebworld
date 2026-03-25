/**
 * Category storage — reads/writes from MySQL via api.php
 */

export type Category = {
  id: string
  parentId: string | null
  level: number
  name: string
  slug: string
  icon: string
  description: string
  coverImage: string
  color: string
  listingCount: number
  isLaunched: boolean
  isFeatured: boolean
  sortOrder: number
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  seoOgImage: string
  seoCanonical: string
  seoNoIndex: boolean
  parentName?: string
  parentSlug?: string
  subcategories?: Category[]
  createdAt: string
  updatedAt: string
}

const API = '/api'

/** Map DB snake_case row to Category */
function mapRow(r: Record<string, unknown>): Category {
  const seoKw = typeof r.seo_keywords === 'string' ? JSON.parse(r.seo_keywords || '[]') : (r.seo_keywords ?? [])

  return {
    id: String(r.id ?? ''),
    parentId: r.parent_id ? String(r.parent_id) : null,
    level: Number(r.level ?? 0),
    name: String(r.name ?? ''),
    slug: String(r.slug ?? ''),
    icon: String(r.icon ?? 'grid'),
    description: String(r.description ?? ''),
    coverImage: String(r.cover_image ?? ''),
    color: String(r.color ?? '#E8553D'),
    listingCount: Number(r.listing_count ?? 0),
    isLaunched: !!(r.is_launched ?? false),
    isFeatured: !!(r.is_featured ?? false),
    sortOrder: Number(r.sort_order ?? 0),
    seoTitle: String(r.seo_title ?? ''),
    seoDescription: String(r.seo_description ?? ''),
    seoKeywords: Array.isArray(seoKw) ? seoKw : [],
    seoOgImage: String(r.seo_og_image ?? ''),
    seoCanonical: String(r.seo_canonical ?? ''),
    seoNoIndex: !!(r.seo_no_index ?? false),
    parentName: r.parent_name ? String(r.parent_name) : undefined,
    parentSlug: r.parent_slug ? String(r.parent_slug) : undefined,
    subcategories: undefined,
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
  }
}

/** Map Category to API payload for saving (snake_case to match PHP) */
function toPayload(c: Category): Record<string, unknown> {
  return {
    id: c.id && !c.id.includes('-') ? Number(c.id) : undefined,
    parent_id: c.parentId ? Number(c.parentId) : null,
    level: c.level,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    cover_image: c.coverImage,
    color: c.color,
    listing_count: c.listingCount,
    is_active: 1,
    is_launched: c.isLaunched ? 1 : 0,
    is_featured: c.isFeatured ? 1 : 0,
    sort_order: c.sortOrder,
    seo_title: c.seoTitle,
    seo_description: c.seoDescription,
    seo_keywords: c.seoKeywords,
    seo_og_image: c.seoOgImage,
    seo_canonical: c.seoCanonical,
    seo_no_index: c.seoNoIndex ? 1 : 0,
  }
}

export async function fetchLaunchedCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.data ?? json.categories ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API}/categories/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    // API returns { category: {...}, subcategories: [...], parent: {...}, activeListings: n }
    const raw = data.category || data
    const cat = mapRow(raw)
    // Override listing count with real active count from API
    if (typeof data.activeListings === 'number') cat.listingCount = data.activeListings
    // Attach parent info
    if (data.parent) {
      cat.parentName = String(data.parent.name || '')
      cat.parentSlug = String(data.parent.slug || '')
    }
    // Map subcategories
    if (Array.isArray(data.subcategories)) {
      cat.subcategories = data.subcategories.map((s: Record<string, unknown>) => mapRow(s))
    }
    return cat
  } catch { return null }
}

export async function fetchAllCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/admin/categories`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.categories ?? json.data ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const all = await fetchAllCategories()
    return all.find(c => String(c.id) === String(id)) || null
  } catch {
    return null
  }
}

export async function apiSaveCategory(cat: Category): Promise<string> {
  const res = await fetch(`${API}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPayload(cat)),
  })
  const data = await res.json()
  return String(data.id ?? cat.id)
}

export async function apiDeleteCategory(id: string): Promise<void> {
  await fetch(`${API}/admin/categories/${id}`, {
    method: 'DELETE',
  })
}

export async function apiToggleLaunch(id: string, launched: boolean): Promise<void> {
  await fetch(`${API}/admin/categories/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ launched: launched ? 1 : 0 }),
  })
}

export async function apiBulkLaunch(launched: boolean, level?: number, parentId?: string): Promise<void> {
  const body: Record<string, unknown> = { launched: launched ? 1 : 0 }
  if (level !== undefined) body.level = level
  if (parentId !== undefined) body.parent_id = Number(parentId)
  await fetch(`${API}/admin/categories/bulk-launch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function generateCategorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}
