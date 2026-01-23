import { ProvincialTaxConfig } from "../../types";

export const NEWFOUNDLAND_AND_LABRADOR_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Newfoundland And Labrador Income Tax",
    brackets: [
      { min: 0, max: 44192, rate: 0.087 },
      { min: 44192, max: 88382, rate: 0.145 },
      { min: 88382, max: 157792, rate: 0.158 },
      { min: 157792, max: 220908, rate: 0.178 },
      { min: 220908, max: 282241, rate: 0.198 },
      { min: 282241, max: 564481, rate: 0.208 },
      { min: 564481, max: 1128963, rate: 0.213 },
      { min: 1128963, max: null, rate: 0.218 },
    ],
    basicPersonalAmount: 11188,
  },
};
