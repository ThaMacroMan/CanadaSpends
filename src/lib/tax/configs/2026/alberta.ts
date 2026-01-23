import { ProvincialTaxConfig } from "../../types";

export const ALBERTA_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Alberta Income Tax",
    brackets: [
      { min: 0, max: 154215, rate: 0.1 },
      { min: 154215, max: 185078, rate: 0.12 },
      { min: 185078, max: 246772, rate: 0.13 },
      { min: 246772, max: 370159, rate: 0.14 },
      { min: 370159, max: 493545, rate: 0.15 },
      { min: 493545, max: null, rate: 0.15 },
    ],
    basicPersonalAmount: 22769,
  },
};
