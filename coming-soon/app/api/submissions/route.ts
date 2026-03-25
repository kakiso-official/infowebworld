import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

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

    const required = ['companyName', 'contactName', 'email', 'category', 'country', 'tagline']
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
    if (body.category) {
      const cat = await queryOne(
        'SELECT id FROM categories WHERE slug = ? OR id = ? LIMIT 1',
        [body.category, body.category]
      )
      categoryId = cat ? Number(cat.id) : null
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

    const uuid = crypto.randomUUID()
    const slug = slugify(body.companyName) + '-' + uuid.slice(0, 8)

    // Handle JSON fields
    const features = body.features ? JSON.stringify(body.features) : null
    const integrations = body.integrations ? JSON.stringify(body.integrations) : null
    const pricingTiers = body.pricingTiers ? JSON.stringify(body.pricingTiers) : null
    const screenshots = body.screenshots ? JSON.stringify(body.screenshots) : null
    const faqs = body.faqs ? JSON.stringify(body.faqs) : null

    const isPaid = body.paypalOrderId ? true : false
    const paymentStatus = isPaid ? 'completed' : 'pending'
    const status = 'pending'

    await execute(
      `INSERT INTO submissions (
        uuid, slug, company_name, contact_name, email, phone, website,
        tagline, description, logo_url, category_id, country_id, plan_id,
        features, integrations, pricing_tiers, screenshots, faqs,
        paypal_order_id, payment_status, status, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid, slug,
        body.companyName.trim(),
        body.contactName.trim(),
        body.email.trim().toLowerCase(),
        body.phone || null,
        body.website || null,
        body.tagline.trim(),
        body.description || null,
        body.logoUrl || null,
        categoryId,
        countryId,
        planId,
        features, integrations, pricingTiers, screenshots, faqs,
        body.paypalOrderId || null,
        paymentStatus,
        status,
        ip
      ]
    )

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
