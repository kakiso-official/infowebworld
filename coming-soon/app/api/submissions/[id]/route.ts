import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { getUserFromRequest } from '@/lib/user-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build dynamic SET clause from allowed fields
    const allowed: Record<string, string> = {
      faqs: 'faqs', seoTitle: 'seo_title', seoDescription: 'seo_description',
      seoKeywords: 'seo_keywords', ogImage: 'og_image',
    }
    const sets: string[] = []
    const values: unknown[] = []

    for (const [key, col] of Object.entries(allowed)) {
      if (body[key] !== undefined) {
        sets.push(`${col} = ?`)
        values.push(typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key])
      }
    }

    if (sets.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    values.push(id)
    await execute(`UPDATE submissions SET ${sets.join(', ')} WHERE id = ?`, values)

    return Response.json({ ok: true })
  } catch (err) {
    console.error('PATCH /api/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * PUT /api/submissions/[id] — owner-only full update from /dashboard.
 *
 * `id` may be the uuid (preferred — what the dashboard always sends) or the
 * numeric pk. Auth: a logged-in business user whose id matches submissions.user_id.
 * Slug, status, plan, payment, ownership, and timestamps are intentionally
 * frozen — admin still owns those via the iww-hq tooling.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pathId } = await params
    const user = await getUserFromRequest(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUuid = /^[0-9a-f]{8}-/i.test(pathId)
    const row = await queryOne<{ id: number; user_id: number | null }>(
      isUuid
        ? 'SELECT id, user_id FROM submissions WHERE uuid = ? LIMIT 1'
        : 'SELECT id, user_id FROM submissions WHERE id = ? LIMIT 1',
      [pathId]
    )
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 })
    if (row.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    const subId = row.id

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

    /* Resolve FK ids — same lookups as POST. */
    let categoryId: number | null = null
    if (body.category || body.categorySlug) {
      const catKey = body.categorySlug || body.category
      const cat = await queryOne(
        'SELECT id FROM categories WHERE slug = ? OR name = ? OR id = ? LIMIT 1',
        [catKey, catKey, catKey]
      )
      categoryId = cat ? Number(cat.id) : null
    }
    const listingTypeId: number | null = body.listingTypeId
      ? Number(body.listingTypeId) : null
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

    const updated = await queryOne<{ slug: string }>(
      'SELECT slug FROM submissions WHERE id = ? LIMIT 1',
      [subId]
    )
    return Response.json({ ok: true, slug: updated?.slug || null })
  } catch (err) {
    console.error('PUT /api/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await execute('DELETE FROM submissions WHERE id = ?', [id])

    return Response.json({ ok: true, message: 'Submission deleted' })
  } catch (err) {
    console.error('DELETE /api/submissions/[id] error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
