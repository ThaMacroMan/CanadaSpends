import { ProvincialTaxConfig } from "../../types";

export const ONTARIO_TAX_CONFIG: ProvincialTaxConfig = {
  incomeTax: {
    type: "bracket",
    name: "Ontario Income Tax",
    brackets: [
      { min: 0, max: 52886, rate: 0.0505 },
      { min: 52886, max: 105775, rate: 0.0915 },
      { min: 105775, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: null, rate: 0.1316 },
    ],
    basicPersonalAmount: 12989,
  },
  surtax: {
    type: "surtax",
    name: "Ontario Surtax",
    tiers: [
      { threshold: 5554, rate: 0.2 },
      { threshold: 7108, rate: 0.36 },
    ],
  },
  healthPremium: {
    type: "healthPremium",
    name: "Ontario Health Premium",
    tiers: [
      { minIncome: 0, maxIncome: 20000, baseAmount: 0, rate: 0, maxAmount: 0 },
      {
        minIncome: 20000,
        maxIncome: 25000,
        baseAmount: 0,
        rate: 0.06,
        maxAmount: 300,
      },
      {
        minIncome: 25000,
        maxIncome: 36000,
        baseAmount: 300,
        rate: 0,
        maxAmount: 300,
      },
      {
        minIncome: 36000,
        maxIncome: 38500,
        baseAmount: 300,
        rate: 0.06,
        maxAmount: 450,
      },
      {
        minIncome: 38500,
        maxIncome: 48000,
        baseAmount: 450,
        rate: 0,
        maxAmount: 450,
      },
      {
        minIncome: 48000,
        maxIncome: 72000,
        baseAmount: 450,
        rate: 0.025,
        maxAmount: 600,
      },
      {
        minIncome: 72000,
        maxIncome: 200000,
        baseAmount: 600,
        rate: 0,
        maxAmount: 600,
      },
      {
        minIncome: 200000,
        maxIncome: 200600,
        baseAmount: 600,
        rate: 0.25,
        maxAmount: 750,
      },
      {
        minIncome: 200600,
        maxIncome: null,
        baseAmount: 750,
        rate: 0,
        maxAmount: 900,
      },
    ],
  },
};
