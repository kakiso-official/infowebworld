import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const groups = await query(
      `SELECT id, name, slug, description, icon, color
       FROM tag_groups
       WHERE is_active = 1
       ORDER BY sort_order`
    )

    const tags = await query(
      `SELECT t.id, t.tag_group_id, t.name, t.slug
       FROM tags t
       JOIN tag_groups tg ON tg.id = t.tag_group_id
       WHERE t.is_active = 1 AND tg.is_active = 1
       ORDER BY t.sort_order`
    )

    const tagsByGroup = new Map<number, { id: number; name: string; slug: string }[]>()
    for (const t of tags as any[]) {
      const list = tagsByGroup.get(t.tag_group_id) ?? []
      list.push({ id: t.id, name: t.name, slug: t.slug })
      tagsByGroup.set(t.tag_group_id, list)
    }

    const data = (groups as any[]).map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      icon: g.icon,
      color: g.color,
      tags: tagsByGroup.get(g.id) ?? [],
    }))

    return Response.json(
      { ok: true, data },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    )
  } catch (err) {
    console.error('GET /api/tags error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
