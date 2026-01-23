import { ProvincialTaxConfig } from "../../types";

export const BRITISH_COLUMBIA_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "British Columbia Income Tax",
    brackets: [
      { min: 0, max: 49279, rate: 0.0506 },
      { min: 49279, max: 98560, rate: 0.077 },
      { min: 98560, max: 113158, rate: 0.105 },
      { min: 113158, max: 137407, rate: 0.1229 },
      { min: 137407, max: 186306, rate: 0.147 },
      { min: 186306, max: 259829, rate: 0.168 },
      { min: 259829, max: null, rate: 0.205 },
    ],
    basicPersonalAmount: 13216,
  },
};
