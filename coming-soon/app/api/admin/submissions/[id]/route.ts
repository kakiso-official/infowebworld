import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * PUT /api/admin/submissions/[id] — admin-only full update of ANY listing.
 *
 * Mirrors the owner PUT (/api/submissions/[id]) field-for-field, but:
 *   - Authenticated as an admin (admin_sessions), not the listing owner, so the
 *     admin can edit any user's company or product listing from /iww-hq.
 *   - Status is PRESERVED. The admin is the moderator, so their edit must NOT
 *     bounce a live listing back to 'pending' the way an owner edit does.
 *   - When a LIVE listing's category changes, listing_count is moved from the
 *     old category to the new one so public counts stay accurate.
 *
 * `id` may be the numeric pk or the uuid.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id: pathId } = await params
    const isUuid = /^[0-9a-f]{8}-/i.test(pathId)
    const row = await queryOne<{ id: number; status: string; category_id: number | null }>(
      isUuid
        ? 'SELECT id, status, category_id FROM submissions WHERE uuid = ? LIMIT 1'
        : 'SELECT id, status, category_id FROM submissions WHERE id = ? LIMIT 1',
      [pathId]
    )
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 })
    const subId = row.id
    const isLive = row.status === 'active' || row.status === 'paid'

    const body = await request.json()

    const required = ['companyName', 'contactName', 'email', 'country', 'tagline']
    for (const field of required) {
      if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
        return Response.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    /* Resolve FK ids — same lookups as the owner PUT / POST. */
    let categoryId: number | null = null
    if (body.category || body.categorySlug) {
      const catKey = body.categorySlug || body.category
      const cat = await queryOne(
        'SELECT id FROM categories WHERE slug = ? OR name = ? OR id = ? LIMIT 1',
        [catKey, catKey, catKey]
      )
      categoryId = cat ? Number(cat.id) : null
    }
    const listingTypeId: number | null = body.listingTypeId ? Number(body.listingTypeId) : null
    let countryId: number | null = null
    if (body.country) {
      const co = await queryOne(
        'SELECT id FROM countries WHERE name = ? OR id = ? LIMIT 1',
        [body.country, body.country]
      )
      countryId = co ? Number(co.id) : null
    }

    const arrJson = (v: unknown) => Array.isArray(v) && v.length > 0 ? JSON.stringify(v) : null
    const features = body.features ? JSON.stringify(body.features) : null
    const integrations = body.integrations ? JSON.stringify(body.integrations) : null
    const pricingTiers = body.pricingTiers ? JSON.stringify(body.pricingTiers) : null
    const screenshots = body.screenshots ? JSON.stringify(body.screenshots) : null
    const faqs = body.faqs ? JSON.stringify(body.faqs) : null
    const headerTags = arrJson(body.headerTags)
    const pros = arrJson(body.pros)
    const cons = arrJson(body.cons)
    const industriesServed = arrJson(body.industriesServed)
    const useCases = arrJson(body.useCases)
    const targetCompanySizes = arrJson(body.targetCompanySizes)
    const keyFeatures = arrJson(body.keyFeatures)
    const supportChannels = arrJson(body.supportChannels)
    const trainingOptions = arrJson(body.trainingOptions)
    const languages = arrJson(body.languages)
    const compliance = arrJson(body.compliance)
    const awards = arrJson(body.awards)
    /* ── Company-mode Clutch-style JSON fields ── */
    const timezones = arrJson(body.timezones)
    const serviceLines = arrJson(body.serviceLines)
    const focusBreakdown = arrJson(body.focusBreakdown)
    const clientLogos = arrJson(body.clientLogos)
    const startingPrice = body.startingPrice != null && body.startingPrice !== ''
      ? Number(body.startingPrice) : null
    const hasFreeTrial = body.hasFreeTrial ? 1 : 0
    const hasFreeVersion = body.hasFreeVersion ? 1 : 0
    const hasIosApp = body.hasIosApp ? 1 : 0
    const hasAndroidApp = body.hasAndroidApp ? 1 : 0

    await execute(
      `UPDATE submissions SET
         company_name = ?, contact_name = ?, email = ?, phone_code = ?, phone = ?, website = ?,
         category_id = ?, listing_type_id = ?, country_id = ?, city = ?, state = ?,
         tagline = ?, description = ?, founded_year = ?, team_size = ?,
         logo_url = ?, screenshots = ?, demo_video = ?,
         features = ?, integrations = ?, pricing_model = ?, pricing_tiers = ?,
         funding = ?, hq_location = ?, linkedin = ?, twitter = ?, facebook = ?, faqs = ?,
         header_tags = ?, pros = ?, cons = ?, industries_served = ?, use_cases = ?, target_company_sizes = ?,
         key_features = ?, starting_price = ?, starting_price_period = ?,
         has_free_trial = ?, has_free_version = ?,
         support_channels = ?, training_options = ?, languages = ?,
         has_ios_app = ?, has_android_app = ?, compliance = ?, awards = ?,
         min_project_size = ?, hourly_rate = ?, common_project_size = ?, intro_video_url = ?,
         timezones = ?, service_lines = ?, focus_breakdown = ?, client_logos = ?, clients_summary = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        body.companyName.trim(),
        body.contactName.trim(),
        body.email.trim().toLowerCase(),
        body.phoneCode || '+1',
        body.phone || null,
        body.website || null,
        categoryId,
        listingTypeId,
        countryId,
        body.city || null,
        body.state || null,
        body.tagline.trim(),
        body.description || null,
        body.founded ? Number(body.founded) : null,
        body.employees || null,
        body.logoUrl || null,
        screenshots,
        body.demoVideo || null,
        features, integrations,
        body.pricingModel || null,
        pricingTiers,
        body.funding || null,
        body.hqLocation || null,
        body.linkedin || null,
        body.twitter || null,
        body.facebook || null,
        faqs,
        headerTags, pros, cons, industriesServed, useCases, targetCompanySizes,
        keyFeatures, startingPrice, body.startingPricePeriod || null,
        hasFreeTrial, hasFreeVersion,
        supportChannels, trainingOptions, languages,
        hasIosApp, hasAndroidApp, compliance, awards,
        body.minProjectSize || null,
        body.hourlyRate || null,
        body.commonProjectSize || null,
        body.introVideoUrl || null,
        timezones, serviceLines, focusBreakdown, clientLogos,
        body.clientsSummary || null,
        subId,
      ]
    )

    /* Replace submission_tags pivot — clean delete + re-insert. */
    if (Array.isArray(body.tagIds)) {
      await execute('DELETE FROM submission_tags WHERE submission_id = ?', [subId])
      for (const tagId of body.tagIds) {
        await execute(
          'INSERT IGNORE INTO submission_tags (submission_id, tag_id) VALUES (?, ?)',
          [subId, Number(tagId)]
        )
      }
    }

    /* Keep category listing_count accurate when a LIVE listing's category
       changes (status is preserved here, so the owner-flow pending dance
       doesn't run). Move the count from the old category to the new one. */
    if (isLive && categoryId !== row.category_id) {
      if (row.category_id) {
        await execute('UPDATE categories SET listing_count = GREATEST(listing_count - 1, 0) WHERE id = ?', [row.category_id])
      }
      if (categoryId) {
        await execute('UPDATE categories SET listing_count = listing_count + 1 WHERE id = ?', [categoryId])
      }
    }

    const updated = await queryOne<{ slug: string; listing_mode: string | null }>(
      "SELECT slug, COALESCE(listing_mode, 'product') AS listing_mode FROM submissions WHERE id = ? LIMIT 1",
      [subId]
    )
    return Response.json({
      ok: true,
      slug: updated?.slug || null,
      listingMode: updated?.listing_mode || 'product',
    })
  } catch (err) {
    console.error('PUT /api/admin/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
