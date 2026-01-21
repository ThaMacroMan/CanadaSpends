import { CappedContributionConfig } from "../types";

/**
 * Calculate capped contributions (EI, CPP)
 */
export function calculateCappedContribution(
  income: number,
  config: CappedContributionConfig,
): number {
  // Income below exemption = no contribution
  if (income <= config.exemption) {
    return 0;
  }

  // Calculate earnings subject to contribution
  const earningsSubjectToContribution = Math.min(
    income - config.exemption,
    config.maxEarnings - config.exemption,
  );

  // Calculate contribution (capped at max)
  const contribution = earningsSubjectToContribution * config.rate;

  return Math.min(contribution, config.maxContribution);
}
