import { queryOne, execute } from '@/lib/db'

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AcVEK9s17rxgOj1JTpZ0Cp94PIA_ghK8nGnPcWXdL7wpH-cfdw5-5jETY84-Tib3QKCZbzPU1xYLH7Fx'
const SECRET = process.env.PAYPAL_CLIENT_SECRET
const API = 'https://api-m.paypal.com'

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

async function createProduct(token: string): Promise<string> {
  const res = await fetch(`${API}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `iww-product-starter-${Date.now()}`,
    },
    body: JSON.stringify({
      name: 'InfoWebWorld Starter Subscription',
      type: 'SERVICE',
      description: 'Starter recurring subscription — $9/year (test)',
      category: 'SOFTWARE',
    }),
  })
  if (!res.ok) throw new Error(`Product creation failed: ${res.status}`)
  const data = await res.json()
  return data.id
}

async function createPlan(token: string, productId: string): Promise<string> {
  const res = await fetch(`${API}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `iww-plan-starter-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'Starter Plan — $9/year (test)',
      description: 'InfoWebWorld Starter — yearly recurring subscription (test price)',
      billing_cycles: [
        {
          frequency: { interval_unit: 'YEAR', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: '9.00', currency_code: 'USD' },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Plan creation failed: ${res.status} ${err}`)
  }
  const data = await res.json()
  return data.id
}

export async function GET() {
  try {
    if (!SECRET) {
      return Response.json({ error: 'PAYPAL_CLIENT_SECRET not configured' }, { status: 500 })
    }

    // Cached plan ID in settings table — v2 key so the old $49 plan (if any)
    // isn't reused after the price change.
    const cached = await queryOne<{ value: string }>(
      "SELECT `value` FROM settings WHERE `key_name` = 'paypal_starter_plan_id_v2'"
    )
    if (cached?.value) {
      return Response.json(
        { planId: cached.value },
        { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } }
      )
    }

    // Create product + plan at PayPal
    const token = await getAccessToken()
    const productId = await createProduct(token)
    const planId = await createPlan(token, productId)

    // Cache for future requests
    await execute(
      "INSERT INTO settings (`key_name`, `value`) VALUES ('paypal_starter_plan_id_v2', ?) ON DUPLICATE KEY UPDATE `value` = ?",
      [planId, planId]
    )

    return Response.json(
      { planId },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('PayPal Starter subscription plan error:', err)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
