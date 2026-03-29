/**
 * Listing-type storage — reads/writes from MySQL via api.php
 */

export type ListingType = {
  id: string
  categoryId: string
  categoryName?: string
  name: string
  slug: string
  sortOrder: number
  isActive: boolean
}

const API = '/api'

/** Map DB snake_case row to ListingType */
function mapRow(r: Record<string, unknown>): ListingType {
  return {
    id: String(r.id ?? ''),
    categoryId: String(r.category_id ?? ''),
    categoryName: r.category_name ? String(r.category_name) : undefined,
    name: String(r.name ?? ''),
    slug: String(r.slug ?? ''),
    sortOrder: Number(r.sort_order ?? 0),
    isActive: !!(r.is_active ?? true),
  }
}

export async function fetchListingTypes(categoryId?: string): Promise<ListingType[]> {
  try {
    const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : ''
    const res = await fetch(`${API}/listing-types${qs}`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.data ?? json.listing_types ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchAdminListingTypes(categoryId?: string): Promise<ListingType[]> {
  try {
    const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : ''
    const res = await fetch(`${API}/admin/listing-types${qs}`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.data ?? json.listing_types ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function apiSaveListingType(lt: Partial<ListingType>): Promise<string> {
  const res = await fetch(`${API}/admin/listing-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: lt.id && !lt.id.includes('-') ? Number(lt.id) : undefined,
      category_id: lt.categoryId ? Number(lt.categoryId) : undefined,
      name: lt.name,
      slug: lt.slug,
      sort_order: lt.sortOrder,
      is_active: lt.isActive ? 1 : 0,
    }),
  })
  const data = await res.json()
  return String(data.id ?? lt.id)
}

export async function apiDeleteListingType(id: string): Promise<void> {
  await fetch(`${API}/admin/listing-types/${id}`, {
    method: 'DELETE',
  })
}
