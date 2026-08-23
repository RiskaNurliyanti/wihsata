import type { SubscriptionTier } from '@/types/database.types';

/**
 * Admin selalu mendapat akses Pro gratis, terlepas dari tabel `subscriptions`.
 * Pakai helper ini di semua tempat yang mengecek tier, supaya konsisten.
 */
export function getEffectiveTier(
  isAdmin: boolean | null | undefined,
  subscriptionTier: SubscriptionTier | null | undefined
): SubscriptionTier {
  if (isAdmin) return 'pro';
  return subscriptionTier ?? 'demo';
}
