import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'

/**
 * Records a successful PayPal capture against the authed user's account.
 * Body: { plan: 'starter' | 'yearly' | 'lifetime', orderId: string, amount: number }
 *
 * Trust model: client-side capture (matches /api/slots/claim and the existing
 * PaymentModal flow). We DO NOT round-trip the order to PayPal's REST API for
 * verification here — a future hardening pass should add server-side verify
 * via the orders/{id} endpoint with PayPal credentials.
 *
 * Idempotent on (paypal_order_id) via the UNIQUE index — replays are no-ops.
 */
const VALID_PLANS = ['starter', 'yearly', 'lifetime'] as const
type ValidPlan = typeof VALID_PLANS[number]

const EXPECTED_AMOUNT: Record<ValidPlan, number> = {
  starter: 49,
  yearly: 99,
  lifetime: 239,
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth
  const user = auth

  let body: { plan?: string; orderId?: string; amount?: number }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const plan = body.plan as ValidPlan | undefined
  const orderId = (body.orderId || '').trim()
  const amount = Number(body.amount)

  if (!plan || !VALID_PLANS.includes(plan)) {
    return Response.json({ ok: false, error: 'Invalid plan' }, { status: 400 })
  }
  if (!orderId || orderId.length > 64) {
    return Response.json({ ok: false, error: 'Invalid orderId' }, { status: 400 })
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return Response.json({ ok: false, error: 'Invalid amount' }, { status: 400 })
  }
  /* Cheap server-side sanity check on the captured amount — paranoid guard
     against client tampering even though we trust the PayPal capture itself. */
  if (Math.abs(amount - EXPECTED_AMOUNT[plan]) > 0.01) {
    return Response.json({ ok: false, error: 'Amount mismatch for plan' }, { status: 400 })
  }

  try {
    await execute(
      `INSERT IGNORE INTO business_user_plan_purchases
         (user_id, plan_slug, amount, currency, paypal_order_id)
       VALUES (?, ?, ?, 'USD', ?)`,
      [user.id, plan, amount, orderId]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/paypal/capture error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
