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
      'PayPal-Request-Id': `iww-product-daily-${Date.now()}`,
    },
    body: JSON.stringify({
      name: 'InfoWebWorld Daily Subscription',
      type: 'SERVICE',
      description: 'Daily recurring subscription — $0.10/day',
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
      'PayPal-Request-Id': `iww-plan-daily-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'Daily Plan — $0.10/day',
      description: 'InfoWebWorld daily subscription at $0.10 per day',
      billing_cycles: [
        {
          frequency: { interval_unit: 'DAY', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: '0.10', currency_code: 'USD' },
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

    // Check cached plan ID in settings table
    const cached = await queryOne<{ value: string }>(
      "SELECT `value` FROM settings WHERE `key` = 'paypal_daily_plan_id'"
    )
    if (cached?.value) {
      return Response.json({ planId: cached.value })
    }

    // Create product + plan
    const token = await getAccessToken()
    const productId = await createProduct(token)
    const planId = await createPlan(token, productId)

    // Cache for future requests
    await execute(
      "INSERT INTO settings (`key`, `value`) VALUES ('paypal_daily_plan_id', ?) ON DUPLICATE KEY UPDATE `value` = ?",
      [planId, planId]
    )

    return Response.json({ planId })
  } catch (err) {
    console.error('PayPal subscription plan error:', err)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
