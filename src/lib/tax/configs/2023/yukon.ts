import { ProvincialTaxConfig } from "../../types";

export const YUKON_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Yukon Income Tax",
    brackets: [
      { min: 0, max: 53359, rate: 0.064 },
      { min: 53359, max: 106717, rate: 0.09 },
      { min: 106717, max: 165430, rate: 0.109 },
      { min: 165430, max: 500000, rate: 0.128 },
      { min: 500000, max: null, rate: 0.15 },
    ],
    basicPersonalAmount: 15000,
  },
};
