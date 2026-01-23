import { HealthPremiumConfig } from "../types";

/**
 * Calculate Ontario Health Premium
 *
 * Ontario Health Premium tiers (2024):
 * - $0 - $20,000: $0
 * - $20,001 - $36,000: 6% of income over $20,000 (max $300)
 * - $36,001 - $48,000: $300 + 6% of income over $36,000 (max $450)
 * - $48,001 - $72,000: $450 + 25% of income over $48,000 (max $600)
 * - $72,001 - $200,000: $600 + 25% of income over $72,000 (max $750)
 * - $200,001+: $750 + 25% of income over $200,000 (max $900)
 */
export function calculateHealthPremium(
  income: number,
  config: HealthPremiumConfig,
): number {
  // Find applicable tier
  const tier = config.tiers.find((t) => {
    if (t.maxIncome === null) {
      return income > t.minIncome;
    }
    return income > t.minIncome && income <= t.maxIncome;
  });

  // Below minimum income threshold
  if (!tier) {
    // Check if below all tiers
    const lowestTier = config.tiers.reduce(
      (min, t) => (t.minIncome < min.minIncome ? t : min),
      config.tiers[0],
    );
    if (income <= lowestTier.minIncome) {
      return 0;
    }
    // Above all tiers - shouldn't happen with proper config
    return 0;
  }

  // Calculate premium for this tier
  const incomeOverThreshold = income - tier.minIncome;
  const calculatedPremium = tier.baseAmount + incomeOverThreshold * tier.rate;

  return Math.min(calculatedPremium, tier.maxAmount);
}
