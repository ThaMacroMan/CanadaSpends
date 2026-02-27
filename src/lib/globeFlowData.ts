/**
 * Globe Flow Data
 *
 * Static data for the Tax Money Flow Globe visualization.
 * Coordinates and spending amounts for provincial transfers and international flows.
 *
 * Data sources:
 * - Provincial transfers: Public Accounts of Canada FY 2024
 * - International flows: Global Affairs Canada project browser, ODA reports
 * - Coordinates: Capital cities (provinces) and capital/major cities (international)
 */

// ─── Ottawa (centre of all flows) ────────────────────────────────────────────

export const OTTAWA = { lat: 45.4215, lon: -75.6972 };

// ─── Province / Territory flows ──────────────────────────────────────────────

export interface ProvinceFlow {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  /** Canada Health Transfer (CHT) — in $B */
  healthTransfer: number;
  /** Canada Social Transfer (CST) — in $B */
  socialTransfer: number;
  /** Equalization payment — in $B */
  equalization: number;
  /** Sum of the three major transfers — in $B */
  total: number;
}

/**
 * Per-province/territory federal transfer data.
 * Amounts from the Sankey FY 2024 data already in the codebase.
 * lat/lon point to provincial/territorial capitals.
 */
export const PROVINCE_FLOWS: ProvinceFlow[] = [
  {
    name: "Newfoundland & Labrador",
    slug: "newfoundland-and-labrador",
    lat: 47.5615,
    lon: -52.7126,
    healthTransfer: 0.666,
    socialTransfer: 0.221,
    equalization: 0,
    total: 0.887,
  },
  {
    name: "Prince Edward Island",
    slug: "prince-edward-island",
    lat: 46.2382,
    lon: -63.1311,
    healthTransfer: 0.214,
    socialTransfer: 0.071,
    equalization: 0.561,
    total: 0.846,
  },
  {
    name: "Nova Scotia",
    slug: "nova-scotia",
    lat: 44.6488,
    lon: -63.5752,
    healthTransfer: 1.303,
    socialTransfer: 0.433,
    equalization: 2.803,
    total: 4.539,
  },
  {
    name: "New Brunswick",
    slug: "new-brunswick",
    lat: 45.9636,
    lon: -66.6431,
    healthTransfer: 1.027,
    socialTransfer: 0.341,
    equalization: 2.631,
    total: 3.999,
  },
  {
    name: "Quebec",
    slug: "quebec",
    lat: 46.8139,
    lon: -71.2082,
    healthTransfer: 10.911,
    socialTransfer: 3.624,
    equalization: 14.037,
    total: 28.572,
  },
  {
    name: "Ontario",
    slug: "ontario",
    lat: 43.6532,
    lon: -79.3832,
    healthTransfer: 19.266,
    socialTransfer: 6.4,
    equalization: 0.421,
    total: 26.087,
  },
  {
    name: "Manitoba",
    slug: "manitoba",
    lat: 49.8951,
    lon: -97.1384,
    healthTransfer: 1.794,
    socialTransfer: 0.596,
    equalization: 3.51,
    total: 5.9,
  },
  {
    name: "Saskatchewan",
    slug: "saskatchewan",
    lat: 50.4452,
    lon: -104.6189,
    healthTransfer: 1.491,
    socialTransfer: 0.495,
    equalization: 0,
    total: 1.986,
  },
  {
    name: "Alberta",
    slug: "alberta",
    lat: 53.5461,
    lon: -113.4938,
    healthTransfer: 5.771,
    socialTransfer: 1.917,
    equalization: 0,
    total: 7.688,
  },
  {
    name: "British Columbia",
    slug: "british-columbia",
    lat: 48.4284,
    lon: -123.3656,
    healthTransfer: 6.817,
    socialTransfer: 2.264,
    equalization: 0,
    total: 9.081,
  },
  {
    name: "Yukon",
    slug: "yukon",
    lat: 60.7212,
    lon: -135.0568,
    healthTransfer: 0.056,
    socialTransfer: 0.019,
    equalization: 0,
    total: 0.075,
  },
  {
    name: "Northwest Territories",
    slug: "northwest-territories",
    lat: 62.454,
    lon: -114.3718,
    healthTransfer: 0.055,
    socialTransfer: 0.018,
    equalization: 0,
    total: 0.073,
  },
  {
    name: "Nunavut",
    slug: "nunavut",
    lat: 63.7467,
    lon: -68.517,
    healthTransfer: 0.05,
    socialTransfer: 0.017,
    equalization: 0,
    total: 0.067,
  },
];

// ─── International flows ─────────────────────────────────────────────────────

export interface InternationalFlow {
  country: string;
  lat: number;
  lon: number;
  /** Approximate Canadian ODA / international spending — in $B */
  amount: number;
  category: string;
}

/**
 * Top recipients of Canadian international development assistance and
 * other Global Affairs Canada expenditures.
 *
 * The federal "International Affairs" spending category is ~3.7% of the
 * federal budget ($19.2B in FY 2024). This breaks down as:
 *   - Development, Peace & Security Programming: $5.37B
 *   - Support for Embassies & Canada's Presence Abroad: $1.23B
 *   - International Diplomacy: $1.0B
 *   - International Development Research Centre: $0.16B
 *   - Trade and Investment: $0.41B
 *   - Other International Affairs Activities: $11.03B
 *     (includes Export Development Canada — Canada Account: $10.52B)
 *
 * The flows below represent the development/aid portion ($5.37B) plus
 * embassy/diplomatic spending allocated by major recipient region.
 * Amounts are approximate, based on GAC's Statistical Report on
 * International Assistance and publicly available project data.
 */
export const INTERNATIONAL_FLOWS: InternationalFlow[] = [
  // Africa
  {
    country: "Ethiopia",
    lat: 9.145,
    lon: 40.4897,
    amount: 0.35,
    category: "Development Aid",
  },
  {
    country: "Tanzania",
    lat: -6.369,
    lon: 34.8888,
    amount: 0.22,
    category: "Development Aid",
  },
  {
    country: "Mali",
    lat: 17.5707,
    lon: -3.9962,
    amount: 0.18,
    category: "Development Aid",
  },
  {
    country: "Mozambique",
    lat: -18.6657,
    lon: 35.5296,
    amount: 0.17,
    category: "Development Aid",
  },
  {
    country: "Ghana",
    lat: 7.9465,
    lon: -1.0232,
    amount: 0.14,
    category: "Development Aid",
  },
  {
    country: "Senegal",
    lat: 14.4974,
    lon: -14.4524,
    amount: 0.13,
    category: "Development Aid",
  },
  {
    country: "Nigeria",
    lat: 9.082,
    lon: 8.6753,
    amount: 0.16,
    category: "Development Aid",
  },
  {
    country: "Kenya",
    lat: -0.0236,
    lon: 37.9062,
    amount: 0.12,
    category: "Development Aid",
  },
  {
    country: "South Sudan",
    lat: 6.877,
    lon: 31.307,
    amount: 0.11,
    category: "Development Aid",
  },
  {
    country: "Democratic Republic of the Congo",
    lat: -4.0383,
    lon: 21.7587,
    amount: 0.1,
    category: "Development Aid",
  },
  // Middle East / Europe
  {
    country: "Ukraine",
    lat: 48.3794,
    lon: 31.1656,
    amount: 0.95,
    category: "Development Aid",
  },
  {
    country: "Jordan",
    lat: 30.5852,
    lon: 36.2384,
    amount: 0.18,
    category: "Development Aid",
  },
  {
    country: "Lebanon",
    lat: 33.8547,
    lon: 35.8623,
    amount: 0.1,
    category: "Development Aid",
  },
  {
    country: "Syria",
    lat: 34.8021,
    lon: 38.9968,
    amount: 0.09,
    category: "Humanitarian",
  },
  {
    country: "Iraq",
    lat: 33.2232,
    lon: 43.6793,
    amount: 0.08,
    category: "Development Aid",
  },
  // Asia
  {
    country: "Bangladesh",
    lat: 23.685,
    lon: 90.3563,
    amount: 0.28,
    category: "Development Aid",
  },
  {
    country: "Afghanistan",
    lat: 33.9391,
    lon: 67.71,
    amount: 0.25,
    category: "Development Aid",
  },
  // Americas
  {
    country: "Haiti",
    lat: 18.9712,
    lon: -72.2852,
    amount: 0.15,
    category: "Development Aid",
  },
  {
    country: "Colombia",
    lat: 4.5709,
    lon: -74.2973,
    amount: 0.08,
    category: "Development Aid",
  },
  // Multilateral / organizations (represented at headquarters)
  {
    country: "United Nations (New York)",
    lat: 40.7489,
    lon: -73.968,
    amount: 0.62,
    category: "Multilateral",
  },
  {
    country: "World Bank (Washington)",
    lat: 38.8991,
    lon: -77.0422,
    amount: 0.45,
    category: "Multilateral",
  },
  {
    country: "NATO (Brussels)",
    lat: 50.8476,
    lon: 4.3572,
    amount: 0.12,
    category: "Diplomacy",
  },
];

// ─── Budget totals ───────────────────────────────────────────────────────────

/** Total federal spending FY 2024 in $B */
export const TOTAL_FEDERAL_SPENDING = 513.94;

/** International Affairs category as percentage of federal spending */
export const INTERNATIONAL_AFFAIRS_PCT = 3.7;

/** Total provincial transfers (Health + Social + Equalization + Other) in $B */
export const TOTAL_PROVINCIAL_TRANSFERS = PROVINCE_FLOWS.reduce(
  (sum, p) => sum + p.total,
  0,
);

// ─── Helper: compute personal flow amounts ───────────────────────────────────

export interface PersonalFlows {
  /** User's total federal tax in $ */
  federalTax: number;
  /** User's share going to provincial transfers, per province */
  provincialFlows: Array<{ province: ProvinceFlow; amount: number }>;
  /** User's share going to international recipients */
  internationalFlows: Array<{
    recipient: InternationalFlow;
    amount: number;
  }>;
  /** Total amount sent to provinces (from user's tax) */
  totalToProvinces: number;
  /** Total amount sent internationally (from user's tax) */
  totalInternational: number;
}

/**
 * Given a user's federal tax, compute their personal share of each flow.
 * The ratio is: (user's federal tax) / (total federal spending) × (destination amount in $B) × 1e9
 * This converts the $B government amounts into the user's personal dollar amounts.
 */
export function computePersonalFlows(federalTax: number): PersonalFlows {
  // User's fraction of total federal spending
  const userFraction = federalTax / (TOTAL_FEDERAL_SPENDING * 1e9);

  const provincialFlows = PROVINCE_FLOWS.map((province) => ({
    province,
    amount: province.total * 1e9 * userFraction,
  }));

  const internationalFlows = INTERNATIONAL_FLOWS.map((recipient) => ({
    recipient,
    amount: recipient.amount * 1e9 * userFraction,
  }));

  return {
    federalTax,
    provincialFlows,
    internationalFlows,
    totalToProvinces: provincialFlows.reduce((s, f) => s + f.amount, 0),
    totalInternational: internationalFlows.reduce((s, f) => s + f.amount, 0),
  };
}
