import { ProvincialTaxConfig } from "../../types";

export const QUEBEC_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Quebec Income Tax",
    brackets: [
      { min: 0, max: 49275, rate: 0.14 },
      { min: 49275, max: 98540, rate: 0.19 },
      { min: 98540, max: 119910, rate: 0.24 },
      { min: 119910, max: null, rate: 0.2575 },
    ],
    basicPersonalAmount: 17183,
  },
};
