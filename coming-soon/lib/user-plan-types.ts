/**
 * Pure, client-safe plan types and helpers. Kept separate from lib/user-plan.ts
 * so that client components can import PlanTier / canAccess / TIER_LABEL
 * without dragging mysql2 into the browser bundle.
 */

export type PlanTier = 'lifetime' | 'yearly' | 'starter' | 'free'

export const TIER_RANK: Record<PlanTier, number> = {
  lifetime: 4,
  yearly: 3,
  starter: 2,
  free: 1,
}

/** Covers both current slugs and legacy seed slugs. */
export const SLUG_TO_TIER: Record<string, PlanTier> = {
  lifetime: 'lifetime',
  founding: 'lifetime',
  yearly: 'yearly',
  'early-adopter': 'yearly',
  starter: 'starter',
  free: 'free',
}

export const TIER_LABEL: Record<PlanTier, string> = {
  lifetime: 'Lifetime Founding',
  yearly: 'Early Adopter',
  starter: 'Starter',
  free: 'Free',
}

export const TIER_PRICE: Record<PlanTier, string> = {
  lifetime: '$239 one-time',
  yearly: '$99 / year',
  starter: '$49 one-time',
  free: 'Free',
}

export interface UserPlan {
  tier: PlanTier
  label: string
  price: string
  planName: string
  unlockedCount?: number
  totalCount?: number
}

export function canAccess(userTier: PlanTier, requiredTier: PlanTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier]
}

export function nextUnlockingTier(required: PlanTier): PlanTier {
  return required
}
