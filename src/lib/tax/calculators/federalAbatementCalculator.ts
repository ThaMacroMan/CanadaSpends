import { FederalAbatementConfig } from "../types";

/**
 * Calculate the federal abatement (e.g., Quebec Abatement)
 *
 * The federal abatement is a reduction in federal income tax for residents
 * of certain provinces. Quebec residents receive a 16.5% reduction in their
 * federal income tax because Quebec has opted out of certain federal programs.
 *
 * @param federalIncomeTax - The calculated federal income tax before abatement
 * @param config - The federal abatement configuration
 * @returns The abatement amount (positive number representing tax reduction)
 */
export function calculateFederalAbatement(
  federalIncomeTax: number,
  config: FederalAbatementConfig,
): number {
  if (federalIncomeTax <= 0) {
    return 0;
  }

  return federalIncomeTax * config.rate;
}
