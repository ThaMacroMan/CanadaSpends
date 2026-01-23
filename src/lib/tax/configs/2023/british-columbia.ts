import { ProvincialTaxConfig } from "../../types";

export const BRITISH_COLUMBIA_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "British Columbia Income Tax",
    brackets: [
      { min: 0, max: 45654, rate: 0.0506 },
      { min: 45654, max: 91310, rate: 0.077 },
      { min: 91310, max: 104835, rate: 0.105 },
      { min: 104835, max: 127299, rate: 0.1229 },
      { min: 127299, max: 172602, rate: 0.147 },
      { min: 172602, max: 240716, rate: 0.168 },
      { min: 240716, max: null, rate: 0.205 },
    ],
    basicPersonalAmount: 11981,
  },
};
