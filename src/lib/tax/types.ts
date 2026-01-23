// Tax bracket configuration for progressive income tax
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

// Progressive bracket tax config (federal/provincial income tax)
export interface BracketTaxConfig {
  type: "bracket";
  name: string;
  brackets: TaxBracket[];
  basicPersonalAmount: number;
}

// Capped contribution config (EI, CPP)
export interface CappedContributionConfig {
  type: "capped";
  name: string;
  shortName: string;
  rate: number;
  exemption: number;
  maxEarnings: number;
  maxContribution: number;
}

// Surtax config (Ontario surtax - tiers applied to base tax)
export interface SurtaxTier {
  threshold: number;
  rate: number;
}

export interface SurtaxConfig {
  type: "surtax";
  name: string;
  tiers: SurtaxTier[];
}

// Health premium config (Ontario health premium - complex tiers)
export interface HealthPremiumTier {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  rate: number;
  maxAmount: number;
}

export interface HealthPremiumConfig {
  type: "healthPremium";
  name: string;
  tiers: HealthPremiumTier[];
}

// Spending category for budget breakdown
export interface SpendingCategoryConfig {
  name: string;
  percentage: number;
}

// CPP2 (second additional CPP) config - applies to earnings between YMPE and YAMPE
export interface Cpp2Config {
  type: "cpp2";
  name: string;
  shortName: string;
  rate: number;
  ympe: number; // Year's Maximum Pensionable Earnings (lower threshold)
  yampe: number; // Year's Additional Maximum Pensionable Earnings (upper threshold)
  maxContribution: number;
}

// Federal tax configuration
export interface FederalTaxConfig {
  incomeTax: BracketTaxConfig;
  ei: CappedContributionConfig;
  cpp: CappedContributionConfig;
  cpp2: Cpp2Config;
}

// Provincial tax configuration
export interface ProvincialTaxConfig {
  incomeTax: BracketTaxConfig;
  surtax?: SurtaxConfig;
  healthPremium?: HealthPremiumConfig;
}

// Spending data for a province
export interface SpendingConfig {
  federal: SpendingCategoryConfig[];
  provincial: SpendingCategoryConfig[];
  federalTransferName: string;
}

// Complete tax configuration for a year/province combination
export interface TaxYearProvinceConfig {
  year: string;
  province: string;
  federal: FederalTaxConfig;
  provincial: ProvincialTaxConfig;
  spending: SpendingConfig;
}

// Tax line item for detailed breakdown
export interface TaxLineItem {
  id: string;
  name: string;
  level: "federal" | "provincial";
  amount: number;
  effectiveRate: number;
  category:
    | "incomeTax"
    | "ei"
    | "cpp"
    | "cpp2"
    | "surtax"
    | "healthPremium"
    | "incomeTaxProvincial";
}

// Detailed calculation result
export interface DetailedTaxCalculation {
  // Summary (backwards compatible with TaxCalculation)
  grossIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;

  // Line items for accordion breakdown
  lineItems: TaxLineItem[];

  // Individual totals
  federalIncomeTax: number;
  provincialIncomeTax: number;
  eiContribution: number;
  cppContribution: number;
  cpp2Contribution: number;
  surtax: number;
  healthPremium: number;

  // Metadata
  year: string;
  province: string;
}

// Backwards compatible interface (matches old TaxCalculation)
export interface TaxCalculation {
  grossIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
}

// Supported provinces
export type SupportedProvince = "ontario" | "alberta";

// Supported years
export type SupportedYear = "2024" | "2025";
