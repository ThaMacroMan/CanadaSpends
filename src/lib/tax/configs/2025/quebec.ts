import { ProvincialTaxConfig } from "../../types";

export const QUEBEC_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Quebec Income Tax",
    brackets: [
      { min: 0, max: 53255, rate: 0.14 },
      { min: 53255, max: 106495, rate: 0.19 },
      { min: 106495, max: 129590, rate: 0.24 },
      { min: 129590, max: null, rate: 0.2575 },
    ],
    basicPersonalAmount: 18571,
  },
  federalAbatement: {
    type: "federalAbatement",
    name: "Quebec Abatement",
    rate: 0.165, // 16.5% reduction in federal income tax
  },
};
