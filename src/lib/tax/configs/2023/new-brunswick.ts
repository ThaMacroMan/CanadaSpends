import { ProvincialTaxConfig } from "../../types";

export const NEW_BRUNSWICK_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "New Brunswick Income Tax",
    brackets: [
      { min: 0, max: 47715, rate: 0.094 },
      { min: 47715, max: 95431, rate: 0.14 },
      { min: 95431, max: 176756, rate: 0.16 },
      { min: 176756, max: null, rate: 0.195 },
    ],
    basicPersonalAmount: 12458,
  },
};
