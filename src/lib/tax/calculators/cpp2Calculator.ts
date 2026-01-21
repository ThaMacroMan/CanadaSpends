import { Cpp2Config } from "../types";

/**
 * Calculate CPP2 (second additional CPP contribution)
 * Applies to earnings between YMPE and YAMPE
 */
export function calculateCpp2Contribution(
  income: number,
  config: Cpp2Config,
): number {
  // Income below YMPE = no CPP2 contribution
  if (income <= config.ympe) {
    return 0;
  }

  // Calculate earnings subject to CPP2 (between YMPE and YAMPE)
  const earningsSubjectToCpp2 = Math.min(income, config.yampe) - config.ympe;

  // Calculate contribution (capped at max)
  const contribution = earningsSubjectToCpp2 * config.rate;

  return Math.min(contribution, config.maxContribution);
}
