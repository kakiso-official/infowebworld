import { requireDashboardUser } from '@/lib/user-auth'
import { queryOne } from '@/lib/db'
import LocalBusinessForm, { type LBInitial } from './LocalBusinessForm'

export const dynamic = 'force-dynamic'

/**
 * Local-business create / edit form host. Auth-enforced via
 * requireDashboardUser (anonymous traffic can't reach it). `?edit=<uuid>`
 * pre-fills the owner's existing listing (used by the claim → edit flow).
 */
function parseJson(v: unknown): unknown {
  if (typeof v === 'string' && v) { try { return JSON.parse(v) } catch { return null } }
  return v ?? null
}
const str = (o: Record<string, unknown>, k: string) => String(o[k] ?? '')

export default async function LocalBusinessNewPage({
  searchParams,
}: { searchParams: Promise<{ edit?: string }> }) {
  const user = await requireDashboardUser()
  const sp = await searchParams
  let initial: LBInitial | undefined

  if (sp.edit) {
    const row = await queryOne<Record<string, unknown>>(
      `SELECT s.*, c.slug AS category_slug, co.name AS country_name
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
        WHERE s.uuid = ? AND s.user_id = ? LIMIT 1`,
      [sp.edit, user.id],
    ).catch(() => null)

    if (row) {
      const hoursRaw = parseJson(row.lb_hours)
      const hours = Array.isArray(hoursRaw)
        ? hoursRaw.map((h) => {
            const o = h as Record<string, unknown>
            const [open, close] = String(o.time ?? '').split(' - ')
            return { day: String(o.day ?? ''), open: open || '9:00 AM', close: close || '5:00 PM', closed: !!o.closed }
          })
        : undefined
      const menuRaw = parseJson(row.lb_menu)
      const menu = Array.isArray(menuRaw)
        ? menuRaw.map((m) => {
            const o = m as Record<string, unknown>
            return { name: String(o.name ?? ''), price: String(o.price ?? ''), description: String(o.description ?? ''), photo: String(o.photo ?? '') }
          })
        : []
      const videosRaw = parseJson(row.lb_videos)
      const videos = Array.isArray(videosRaw)
        ? videosRaw.map((v) => { const o = v as Record<string, unknown>; return { url: String(o.url ?? ''), title: String(o.title ?? '') } })
        : []
      const amenities = parseJson(row.lb_amenities)
      const photos = parseJson(row.lb_photos)

      initial = {
        uuid: str(row, 'uuid'),
        companyName: str(row, 'company_name'),
        contactName: str(row, 'contact_name'),
        email: str(row, 'email'),
        phone: str(row, 'phone'),
        website: str(row, 'website'),
        categorySlug: str(row, 'category_slug'),
        address: str(row, 'hq_location'),
        city: str(row, 'city'),
        state: str(row, 'state'),
        country: row.country_name ? String(row.country_name) : 'United States',
        tagline: str(row, 'tagline'),
        description: str(row, 'description'),
        logoUrl: str(row, 'logo_url'),
        priceRange: row.lb_price_range ? String(row.lb_price_range) : '$',
        hours,
        amenities: Array.isArray(amenities) ? amenities.filter((x): x is string => typeof x === 'string') : [],
        menu,
        photos: Array.isArray(photos) ? photos.filter((x): x is string => typeof x === 'string') : [],
        videos,
      }
    }
  }

  return <LocalBusinessForm initial={initial} />
}
