import { ProvincialTaxConfig } from "../../types";

export const QUEBEC_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Quebec Income Tax",
    brackets: [
      { min: 0, max: 54345, rate: 0.14 },
      { min: 54345, max: 108680, rate: 0.19 },
      { min: 108680, max: 132245, rate: 0.24 },
      { min: 132245, max: null, rate: 0.2575 },
    ],
    basicPersonalAmount: 18952,
  },
};
