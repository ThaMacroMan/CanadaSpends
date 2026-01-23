import { ProvincialTaxConfig } from "../../types";

export const NUNAVUT_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Nunavut Income Tax",
    brackets: [
      { min: 0, max: 55782, rate: 0.04 },
      { min: 55782, max: 111563, rate: 0.07 },
      { min: 111563, max: 181389, rate: 0.09 },
      { min: 181389, max: null, rate: 0.115 },
    ],
    basicPersonalAmount: 19659,
  },
};
