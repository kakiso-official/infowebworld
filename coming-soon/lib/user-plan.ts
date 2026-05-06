import { queryOne } from './db'
import {
  SLUG_TO_TIER, TIER_LABEL, TIER_PRICE,
  type PlanTier, type UserPlan,
} from './user-plan-types'

// Re-export the pure helpers so existing server-side call sites can keep
// importing everything from '@/lib/user-plan'.
export {
  TIER_RANK, TIER_LABEL, TIER_PRICE, SLUG_TO_TIER,
  canAccess, nextUnlockingTier,
  type PlanTier, type UserPlan,
} from './user-plan-types'

/**
 * Highest-tier plan across a user's submissions. Fresh signups with no
 * listings collapse to Free. Rejected submissions are ignored. Feature
 * access is identical for Yearly and Lifetime — the distinction only
 * matters for CTAs ("Get Lifetime" vs "Renewing Yearly").
 */
export async function getUserPlan(userId: number): Promise<UserPlan> {
  const row = await queryOne<{ plan_slug: string | null; plan_name: string | null }>(
    `SELECT p.slug AS plan_slug, p.name AS plan_name
     FROM submissions s
     LEFT JOIN plans p ON p.id = s.plan_id
     WHERE s.user_id = ? AND s.status IN ('active','paid','pending')
     ORDER BY (
       CASE p.slug
         WHEN 'lifetime'      THEN 4
         WHEN 'founding'      THEN 4
         WHEN 'yearly'        THEN 3
         WHEN 'early-adopter' THEN 3
         WHEN 'starter'       THEN 2
         WHEN 'free'          THEN 1
         ELSE 0
       END
     ) DESC
     LIMIT 1`,
    [userId]
  )

  const slug = row?.plan_slug || null
  const tier: PlanTier = (slug && SLUG_TO_TIER[slug]) || 'free'
  return {
    tier,
    label: TIER_LABEL[tier],
    price: TIER_PRICE[tier],
    planName: row?.plan_name || 'Free',
  }
}

/**
 * Highest plan tier the user has actually paid for via PayPal — read from
 * business_user_plan_purchases. The submission gate uses this (not
 * getUserPlan, which derives tier from submissions and would let an
 * unpaid submission self-grant a tier).
 *
 * Returns 'free' for users with no purchases.
 */
export async function getUserHighestPaidPlan(userId: number): Promise<PlanTier> {
  const row = await queryOne<{ plan_slug: string | null }>(
    `SELECT plan_slug FROM business_user_plan_purchases
     WHERE user_id = ?
     ORDER BY (
       CASE plan_slug
         WHEN 'lifetime' THEN 4
         WHEN 'yearly'   THEN 3
         WHEN 'starter'  THEN 2
         ELSE 0
       END
     ) DESC
     LIMIT 1`,
    [userId]
  )
  const slug = row?.plan_slug || null
  return (slug && SLUG_TO_TIER[slug]) || 'free'
}
