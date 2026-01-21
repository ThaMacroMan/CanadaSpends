// Re-export from new tax module for backwards compatibility
export { calculateTotalTax, formatCurrency, formatPercentage } from "./tax";

export type { TaxBracket, TaxCalculation } from "./tax";

// Legacy exports for backwards compatibility
// These constants are kept for any code that might reference them directly,
// but new code should use the tax config system instead
import { getTaxConfig } from "./tax";

// Get 2024 Ontario config for legacy constants
const config2024Ontario = getTaxConfig("2024", "ontario");
const config2024Alberta = getTaxConfig("2024", "alberta");

export const FEDERAL_BASIC_PERSONAL_AMOUNT =
  config2024Ontario?.federal.incomeTax.basicPersonalAmount ?? 15705;

export const ONTARIO_BASIC_PERSONAL_AMOUNT =
  config2024Ontario?.provincial.incomeTax.basicPersonalAmount ?? 12399;

export const ALBERTA_BASIC_PERSONAL_AMOUNT =
  config2024Alberta?.provincial.incomeTax.basicPersonalAmount ?? 21885;

export const FEDERAL_TAX_BRACKETS =
  config2024Ontario?.federal.incomeTax.brackets ?? [];

export const ONTARIO_TAX_BRACKETS =
  config2024Ontario?.provincial.incomeTax.brackets ?? [];

export const ALBERTA_TAX_BRACKETS =
  config2024Alberta?.provincial.incomeTax.brackets ?? [];

// Legacy function exports
export { calculateTaxFromBrackets } from "./tax/calculators/bracketCalculator";

// Legacy province-specific tax calculation functions
import { calculateBracketTax } from "./tax/calculators/bracketCalculator";

export function calculateFederalTax(income: number): number {
  const config = getTaxConfig("2024", "ontario");
  if (!config) return 0;
  return calculateBracketTax(income, config.federal.incomeTax);
}

export function calculateOntarioTax(income: number): number {
  const config = getTaxConfig("2024", "ontario");
  if (!config) return 0;
  return calculateBracketTax(income, config.provincial.incomeTax);
}

export function calculateAlbertaTax(income: number): number {
  const config = getTaxConfig("2024", "alberta");
  if (!config) return 0;
  return calculateBracketTax(income, config.provincial.incomeTax);
}
