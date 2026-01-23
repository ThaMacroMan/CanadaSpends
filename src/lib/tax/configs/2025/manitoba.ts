/**
 * Manitoba 2025 Tax Configuration
 *
 * Sources:
 * - Tax rates: https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html
 * - Provincial info: https://www.gov.mb.ca/finance/taxation/pubs/perstax.html
 */
import { ProvincialTaxConfig } from "../../types";

export const MANITOBA_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Manitoba Income Tax",
    brackets: [
      { min: 0, max: 47564, rate: 0.108 },
      { min: 47564, max: 101200, rate: 0.1275 },
      { min: 101200, max: null, rate: 0.174 },
    ],
    basicPersonalAmount: 15780,
  },
};
