import { ProvincialTaxConfig } from "../../types";

export const SASKATCHEWAN_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Saskatchewan Income Tax",
    brackets: [
      { min: 0, max: 53463, rate: 0.105 },
      { min: 53463, max: 152750, rate: 0.125 },
      { min: 152750, max: null, rate: 0.145 },
    ],
    basicPersonalAmount: 20381,
  },
};
