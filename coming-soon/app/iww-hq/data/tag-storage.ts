/**
 * Tag storage — reads/writes from MySQL via api.php
 */

export type Tag = {
  id: string
  tagGroupId: string
  name: string
  slug: string
  sortOrder: number
  isActive: boolean
}

export type TagGroup = {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  sortOrder: number
  isActive: boolean
  tags: Tag[]
}

const API = '/api'

/** Map DB snake_case row to Tag */
function mapTagRow(r: Record<string, unknown>): Tag {
  return {
    id: String(r.id ?? ''),
    tagGroupId: String(r.tag_group_id ?? ''),
    name: String(r.name ?? ''),
    slug: String(r.slug ?? ''),
    sortOrder: Number(r.sort_order ?? 0),
    isActive: !!(r.is_active ?? true),
  }
}

/** Map DB snake_case row to TagGroup */
function mapRow(r: Record<string, unknown>): TagGroup {
  const rawTags = Array.isArray(r.tags) ? r.tags : []
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    slug: String(r.slug ?? ''),
    description: String(r.description ?? ''),
    icon: String(r.icon ?? 'tag'),
    color: String(r.color ?? '#E8553D'),
    sortOrder: Number(r.sort_order ?? 0),
    isActive: !!(r.is_active ?? true),
    tags: rawTags.map((t: Record<string, unknown>) => mapTagRow(t)),
  }
}

export async function fetchAllTagGroups(): Promise<TagGroup[]> {
  try {
    const res = await fetch(`${API}/tags`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.data ?? json.tag_groups ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchAdminTagGroups(): Promise<TagGroup[]> {
  try {
    const res = await fetch(`${API}/admin/tags`)
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    const rows: Record<string, unknown>[] = json.data ?? json.tag_groups ?? json
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function apiSaveTagGroup(group: Partial<TagGroup>): Promise<string> {
  const res = await fetch(`${API}/admin/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: group.id && !group.id.includes('-') ? Number(group.id) : undefined,
      name: group.name,
      slug: group.slug,
      description: group.description,
      icon: group.icon,
      color: group.color,
      sort_order: group.sortOrder,
      is_active: group.isActive ? 1 : 0,
    }),
  })
  const data = await res.json()
  return String(data.id ?? group.id)
}

export async function apiDeleteTagGroup(id: string): Promise<void> {
  await fetch(`${API}/admin/tags/${id}`, {
    method: 'DELETE',
  })
}

export async function apiAddTag(tagGroupId: string, name: string, slug: string): Promise<string> {
  const res = await fetch(`${API}/admin/tags/${tagGroupId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag_group_id: tagGroupId, name, slug }),
  })
  const data = await res.json()
  return String(data.id ?? '')
}
