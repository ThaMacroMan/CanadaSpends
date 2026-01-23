import { ProvincialTaxConfig } from "../../types";

export const YUKON_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Yukon Income Tax",
    brackets: [
      { min: 0, max: 58523, rate: 0.064 },
      { min: 58523, max: 117045, rate: 0.09 },
      { min: 117045, max: 181440, rate: 0.109 },
      { min: 181440, max: 500000, rate: 0.128 },
      { min: 500000, max: null, rate: 0.15 },
    ],
    basicPersonalAmount: 16452,
  },
};
