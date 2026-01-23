import { ProvincialTaxConfig } from "../../types";

export const PRINCE_EDWARD_ISLAND_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Prince Edward Island Income Tax",
    brackets: [
      { min: 0, max: 33328, rate: 0.095 },
      { min: 33328, max: 64656, rate: 0.1325 },
      { min: 64656, max: 105000, rate: 0.1637 },
      { min: 105000, max: 140000, rate: 0.1765 },
      { min: 140000, max: null, rate: 0.19 },
    ],
    basicPersonalAmount: 15000,
  },
  // Note: PEI surtax was eliminated in 2024 and replaced with 5-bracket system
};
