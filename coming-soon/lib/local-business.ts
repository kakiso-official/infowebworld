import { execute } from './db'

/**
 * Persist local-business profile fields (lb_*) as an ADDITIVE update, separate
 * from a caller's main INSERT/UPDATE — so the existing writes stay untouched
 * (no column/value desync risk) and a pre-migration DB (columns absent) never
 * fails the submission. Only keys present in `body` are written; everything
 * stays NULL for non-local-business listings, so other sectors are unaffected.
 *
 * `match` picks the WHERE column: 'uuid' (fresh POST) or 'id' (owner PUT).
 */
export async function saveLocalBusinessFields(
  ref: string | number,
  body: Record<string, unknown>,
  match: 'uuid' | 'id',
): Promise<void> {
  const sets: string[] = []
  const vals: unknown[] = []
  const jsonArr = (v: unknown) => (Array.isArray(v) && v.length > 0 ? JSON.stringify(v) : null)
  const num = (v: unknown) => (v != null && v !== '' ? Number(v) : null)

  if (body.lbPriceRange !== undefined) { sets.push('lb_price_range = ?'); vals.push(body.lbPriceRange || null) }
  if (body.lbHours !== undefined)      { sets.push('lb_hours = ?');       vals.push(jsonArr(body.lbHours)) }
  if (body.lbAmenities !== undefined)  { sets.push('lb_amenities = ?');   vals.push(jsonArr(body.lbAmenities)) }
  if (body.lbMenu !== undefined)       { sets.push('lb_menu = ?');        vals.push(jsonArr(body.lbMenu)) }
  if (body.lbPhotos !== undefined)     { sets.push('lb_photos = ?');      vals.push(jsonArr(body.lbPhotos)) }
  if (body.lbVideos !== undefined)     { sets.push('lb_videos = ?');      vals.push(jsonArr(body.lbVideos)) }
  if (body.lbLat !== undefined)        { sets.push('lb_lat = ?');         vals.push(num(body.lbLat)) }
  if (body.lbLng !== undefined)        { sets.push('lb_lng = ?');         vals.push(num(body.lbLng)) }

  if (!sets.length) return
  vals.push(ref)
  try {
    await execute(`UPDATE submissions SET ${sets.join(', ')} WHERE ${match} = ?`, vals)
  } catch (e) {
    console.warn('saveLocalBusinessFields skipped:', e instanceof Error ? e.message : e)
  }
}
