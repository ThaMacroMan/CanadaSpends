import {
  calculateBracketTax,
  calculateCappedContribution,
  calculateCpp2Contribution,
  calculateFederalAbatement,
  calculateHealthPremium,
  calculateSurtax,
} from "./calculators";
import { getTaxConfig } from "./configs";
import {
  DetailedTaxCalculation,
  TaxCalculation,
  TaxLineItem,
  TaxYearProvinceConfig,
} from "./types";

/**
 * Calculate detailed tax breakdown for a given income, province, and year
 */
export function calculateDetailedTax(
  income: number,
  province: string = "ontario",
  year: string = "2024",
): DetailedTaxCalculation {
  const config = getTaxConfig(year, province);

  if (!config) {
    throw new Error(
      `Tax configuration not found for year "${year}" and province "${province}"`,
    );
  }

  return calculateWithConfig(income, config);
}

/**
 * Calculate tax using a specific configuration
 */
function calculateWithConfig(
  income: number,
  config: TaxYearProvinceConfig,
): DetailedTaxCalculation {
  const lineItems: TaxLineItem[] = [];

  // Federal income tax
  const federalIncomeTax = calculateBracketTax(
    income,
    config.federal.incomeTax,
  );
  lineItems.push({
    id: "federal-income-tax",
    name: "Federal Income Tax",
    level: "federal",
    amount: federalIncomeTax,
    effectiveRate: income > 0 ? (federalIncomeTax / income) * 100 : 0,
    category: "incomeTax",
  });

  // EI contribution
  const eiContribution = calculateCappedContribution(income, config.federal.ei);
  lineItems.push({
    id: "ei-contribution",
    name: "Employment Insurance",
    level: "federal",
    amount: eiContribution,
    effectiveRate: income > 0 ? (eiContribution / income) * 100 : 0,
    category: "ei",
  });

  // CPP contribution
  const cppContribution = calculateCappedContribution(
    income,
    config.federal.cpp,
  );
  lineItems.push({
    id: "cpp-contribution",
    name: "Canada Pension Plan",
    level: "federal",
    amount: cppContribution,
    effectiveRate: income > 0 ? (cppContribution / income) * 100 : 0,
    category: "cpp",
  });

  // CPP2 contribution (second additional CPP)
  const cpp2Contribution = calculateCpp2Contribution(
    income,
    config.federal.cpp2,
  );
  if (cpp2Contribution > 0) {
    lineItems.push({
      id: "cpp2-contribution",
      name: "CPP Second Additional",
      level: "federal",
      amount: cpp2Contribution,
      effectiveRate: income > 0 ? (cpp2Contribution / income) * 100 : 0,
      category: "cpp2",
    });
  }

  // Provincial income tax
  const provincialIncomeTax = calculateBracketTax(
    income,
    config.provincial.incomeTax,
  );
  const provinceName =
    config.province.charAt(0).toUpperCase() + config.province.slice(1);
  lineItems.push({
    id: "provincial-income-tax",
    name: `${provinceName} Income Tax`,
    level: "provincial",
    amount: provincialIncomeTax,
    effectiveRate: income > 0 ? (provincialIncomeTax / income) * 100 : 0,
    category: "incomeTaxProvincial",
  });

  // Provincial surtax (if applicable)
  let surtax = 0;
  if (config.provincial.surtax) {
    surtax = calculateSurtax(provincialIncomeTax, config.provincial.surtax);
    if (surtax > 0) {
      lineItems.push({
        id: "provincial-surtax",
        name: `${provinceName} Surtax`,
        level: "provincial",
        amount: surtax,
        effectiveRate: income > 0 ? (surtax / income) * 100 : 0,
        category: "surtax",
      });
    }
  }

  // Health premium (if applicable)
  let healthPremium = 0;
  if (config.provincial.healthPremium) {
    healthPremium = calculateHealthPremium(
      income,
      config.provincial.healthPremium,
    );
    if (healthPremium > 0) {
      lineItems.push({
        id: "health-premium",
        name: `${provinceName} Health Premium`,
        level: "provincial",
        amount: healthPremium,
        effectiveRate: income > 0 ? (healthPremium / income) * 100 : 0,
        category: "healthPremium",
      });
    }
  }

  // Federal abatement (Quebec Abatement - reduces federal tax for Quebec residents)
  let federalAbatement = 0;
  if (config.provincial.federalAbatement) {
    federalAbatement = calculateFederalAbatement(
      federalIncomeTax,
      config.provincial.federalAbatement,
    );
    if (federalAbatement > 0) {
      lineItems.push({
        id: "federal-abatement",
        name: config.provincial.federalAbatement.name,
        level: "federal",
        amount: -federalAbatement, // Negative to show as a tax credit/reduction
        effectiveRate: income > 0 ? (-federalAbatement / income) * 100 : 0,
        category: "federalAbatement",
      });
    }
  }

  // Calculate totals
  const federalTax =
    federalIncomeTax +
    eiContribution +
    cppContribution +
    cpp2Contribution -
    federalAbatement;
  const provincialTax = provincialIncomeTax + surtax + healthPremium;
  const totalTax = federalTax + provincialTax;
  const netIncome = income - totalTax;
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    // Summary (backwards compatible)
    grossIncome: income,
    federalTax,
    provincialTax,
    totalTax,
    netIncome,
    effectiveTaxRate,

    // Line items
    lineItems,

    // Individual totals
    federalIncomeTax,
    provincialIncomeTax,
    eiContribution,
    cppContribution,
    cpp2Contribution,
    surtax,
    healthPremium,
    federalAbatement,

    // Metadata
    year: config.year,
    province: config.province,
  };
}

/**
 * Calculate total tax - backwards compatible with old API
 */
export function calculateTotalTax(
  income: number,
  province: string = "ontario",
  year: string = "2024",
): TaxCalculation {
  const detailed = calculateDetailedTax(income, province, year);

  return {
    grossIncome: detailed.grossIncome,
    federalTax: detailed.federalTax,
    provincialTax: detailed.provincialTax,
    totalTax: detailed.totalTax,
    netIncome: detailed.netIncome,
    effectiveTaxRate: detailed.effectiveTaxRate,
  };
}

/**
 * Format currency in CAD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
