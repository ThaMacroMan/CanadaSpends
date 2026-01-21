import { SurtaxConfig } from "../types";

/**
 * Calculate Ontario-style surtax (applied to base provincial tax)
 *
 * Ontario surtax works as follows:
 * - 20% on provincial tax over $5,710
 * - Additional 16% (total 36%) on provincial tax over $7,307
 */
export function calculateSurtax(baseTax: number, config: SurtaxConfig): number {
  if (config.tiers.length === 0) {
    return 0;
  }

  let surtax = 0;

  // Sort tiers by threshold ascending
  const sortedTiers = [...config.tiers].sort(
    (a, b) => a.threshold - b.threshold,
  );

  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];
    const nextTier = sortedTiers[i + 1];

    if (baseTax <= tier.threshold) {
      break;
    }

    const upperLimit = nextTier?.threshold ?? baseTax;
    const taxableInTier = Math.min(baseTax, upperLimit) - tier.threshold;

    surtax += taxableInTier * tier.rate;
  }

  return surtax;
}
