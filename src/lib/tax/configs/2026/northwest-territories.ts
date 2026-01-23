import { ProvincialTaxConfig } from "../../types";

export const NORTHWEST_TERRITORIES_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Northwest Territories Income Tax",
    brackets: [
      { min: 0, max: 52996, rate: 0.059 },
      { min: 52996, max: 105992, rate: 0.086 },
      { min: 105992, max: 172305, rate: 0.122 },
      { min: 172305, max: null, rate: 0.1405 },
    ],
    basicPersonalAmount: 18198,
  },
};
