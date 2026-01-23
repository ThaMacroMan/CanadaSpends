import { ProvincialTaxConfig } from "../../types";

export const NEW_BRUNSWICK_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "New Brunswick Income Tax",
    brackets: [
      { min: 0, max: 51306, rate: 0.094 },
      { min: 51306, max: 102614, rate: 0.14 },
      { min: 102614, max: 190060, rate: 0.16 },
      { min: 190060, max: null, rate: 0.195 },
    ],
    basicPersonalAmount: 13664,
  },
};
