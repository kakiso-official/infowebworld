import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { getUserFromRequest } from '@/lib/user-auth'
import { getUserHighestPaidPlan } from '@/lib/user-plan'
import { TIER_RANK, type PlanTier } from '@/lib/user-plan-types'

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT s.*, p.name as plan_name, p.slug as plan_slug,
             c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
             co.name as country_name
      FROM submissions s
      LEFT JOIN plans p ON p.id = s.plan_id
      LEFT JOIN categories c ON c.id = s.category_id
      LEFT JOIN countries co ON co.id = s.country_id
      ORDER BY s.created_at DESC LIMIT 200
    `)
    return Response.json(rows)
  } catch (err) {
    console.error('GET /api/submissions error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    const limited = await checkRateLimit(ip, 'submission', 3, 300)
    if (!limited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

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

    // Look up category_id
    let categoryId: number | null = null
    if (body.category || body.categorySlug) {
      const catKey = body.categorySlug || body.category
      const cat = await queryOne(
        'SELECT id FROM categories WHERE slug = ? OR name = ? OR id = ? LIMIT 1',
        [catKey, catKey, catKey]
      )
      categoryId = cat ? Number(cat.id) : null
    }

    // Look up listing_type_id
    let listingTypeId: number | null = null
    if (body.listingTypeId) {
      listingTypeId = Number(body.listingTypeId)
    }

    // Look up country_id
    let countryId: number | null = null
    if (body.country) {
      const co = await queryOne(
        'SELECT id FROM countries WHERE name = ? OR id = ? LIMIT 1',
        [body.country, body.country]
      )
      countryId = co ? Number(co.id) : null
    }

    // Look up plan_id
    let planId: number | null = null
    if (body.plan) {
      const plan = await queryOne(
        'SELECT id FROM plans WHERE slug = ? OR id = ? LIMIT 1',
        [body.plan, body.plan]
      )
      planId = plan ? Number(plan.id) : null
    }

    // Attach the authenticated business user (if any) so it shows on their dashboard
    const authedUser = await getUserFromRequest(request)
    const userId: number | null = authedUser ? authedUser.id : null

    /* Paid-plan gate: a paid plan slug requires a logged-in user with at
       least that tier already paid for. Free tier (or missing slug) is open. */
    const requested = (typeof body.plan === 'string' ? body.plan : 'free') as PlanTier
    if (requested && requested !== 'free') {
      if (!authedUser) {
        return Response.json({ error: 'Login required for paid plans' }, { status: 401 })
      }
      const paidTier = await getUserHighestPaidPlan(authedUser.id)
      if (TIER_RANK[paidTier] < (TIER_RANK[requested] ?? 0)) {
        return Response.json(
          { error: 'Payment required for this plan tier', requiresPayment: true, plan: requested },
          { status: 402 }
        )
      }
    }

    const uuid = crypto.randomUUID()
    const slug = slugify(body.companyName) + '-' + uuid.slice(0, 8)

    // Handle JSON fields
    const arrJson = (v: unknown) => Array.isArray(v) && v.length > 0 ? JSON.stringify(v) : null
    const features = body.features ? JSON.stringify(body.features) : null
    const integrations = body.integrations ? JSON.stringify(body.integrations) : null
    const pricingTiers = body.pricingTiers ? JSON.stringify(body.pricingTiers) : null
    const screenshots = body.screenshots ? JSON.stringify(body.screenshots) : null
    const faqs = body.faqs ? JSON.stringify(body.faqs) : null
    /* Listings V3 JSON fields */
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

    const isPaid = body.paypalOrderId ? true : false
    const paymentStatus = isPaid ? 'completed' : 'pending'
    const status = 'pending'

    await execute(
      `INSERT INTO submissions (
        uuid, slug, company_name, contact_name, email, phone_code, phone, website,
        category_id, listing_type_id, country_id, city, state, tagline, description,
        founded_year, team_size, plan_id, user_id,
        logo_url, screenshots, demo_video,
        features, integrations, pricing_model, pricing_tiers,
        funding, hq_location, linkedin, twitter, facebook, faqs,
        header_tags, pros, cons, industries_served, use_cases, target_company_sizes,
        key_features, starting_price, starting_price_period,
        has_free_trial, has_free_version,
        support_channels, training_options, languages,
        has_ios_app, has_android_app, compliance, awards,
        paypal_order_id, payment_status, status, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid, slug,
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
        planId,
        userId,
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
        body.paypalOrderId || null,
        paymentStatus,
        status,
        ip
      ]
    )

    // Insert submission tags if provided
    if (Array.isArray(body.tagIds) && body.tagIds.length > 0) {
      const subRow = await queryOne('SELECT id FROM submissions WHERE uuid = ? LIMIT 1', [uuid])
      if (subRow) {
        const subId = Number(subRow.id)
        for (const tagId of body.tagIds) {
          await execute('INSERT IGNORE INTO submission_tags (submission_id, tag_id) VALUES (?, ?)', [subId, Number(tagId)])
        }
      }
    }

    // If paid, increment listing_count on the category
    if (isPaid && categoryId) {
      await execute(
        'UPDATE categories SET listing_count = listing_count + 1 WHERE id = ?',
        [categoryId]
      )
    }

    return Response.json({ ok: true, uuid, slug, message: 'Submission received' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/submissions error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
