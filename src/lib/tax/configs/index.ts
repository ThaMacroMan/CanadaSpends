import {
  SupportedProvince,
  SupportedYear,
  TaxYearProvinceConfig,
} from "../types";
import {
  ALBERTA_CONFIG as ALBERTA_2024_CONFIG,
  ONTARIO_CONFIG as ONTARIO_2024_CONFIG,
} from "./2024";
import {
  ALBERTA_CONFIG as ALBERTA_2025_CONFIG,
  ONTARIO_CONFIG as ONTARIO_2025_CONFIG,
} from "./2025";

// Tax configuration registry: year -> province -> config
const TAX_CONFIGS: Record<string, Record<string, TaxYearProvinceConfig>> = {
  "2024": {
    ontario: ONTARIO_2024_CONFIG,
    alberta: ALBERTA_2024_CONFIG,
  },
  "2025": {
    ontario: ONTARIO_2025_CONFIG,
    alberta: ALBERTA_2025_CONFIG,
  },
};

/**
 * Get tax configuration for a specific year and province
 */
export function getTaxConfig(
  year: string,
  province: string,
): TaxYearProvinceConfig | null {
  const yearConfigs = TAX_CONFIGS[year];
  if (!yearConfigs) {
    return null;
  }

  const provinceLower = province.toLowerCase();
  return yearConfigs[provinceLower] || null;
}

/**
 * Get all supported years
 */
export function getSupportedYears(): SupportedYear[] {
  return Object.keys(TAX_CONFIGS) as SupportedYear[];
}

/**
 * Get all supported provinces for a given year
 */
export function getSupportedProvinces(year: string): SupportedProvince[] {
  const yearConfigs = TAX_CONFIGS[year];
  if (!yearConfigs) {
    return [];
  }
  return Object.keys(yearConfigs) as SupportedProvince[];
}

/**
 * Get the default/latest year
 */
export function getDefaultYear(): SupportedYear {
  return "2024";
}

/**
 * Check if a year is supported
 */
export function isYearSupported(year: string): year is SupportedYear {
  return year in TAX_CONFIGS;
}

/**
 * Check if a province is supported for a given year
 */
export function isProvinceSupported(
  year: string,
  province: string,
): province is SupportedProvince {
  const yearConfigs = TAX_CONFIGS[year];
  if (!yearConfigs) {
    return false;
  }
  return province.toLowerCase() in yearConfigs;
}

/**
 * Get spending config for a specific year and province
 */
export function getSpendingConfig(year: string, province: string) {
  const config = getTaxConfig(year, province);
  return config?.spending || null;
}

// Re-export year-specific configs
export * as config2024 from "./2024";
export * as config2025 from "./2025";

// Re-export combined configs for backwards compatibility
export {
  ALBERTA_2024_CONFIG,
  ALBERTA_2025_CONFIG,
  ONTARIO_2024_CONFIG,
  ONTARIO_2025_CONFIG,
};
