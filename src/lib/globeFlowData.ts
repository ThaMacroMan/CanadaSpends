/**
 * Globe Flow Data
 *
 * Static data for the Tax Money Flow Globe visualization.
 * Contains coordinates for Ottawa (source), Canadian provincial/territorial capitals,
 * and top international aid recipient countries.
 *
 * Data sources:
 * - Provincial transfer percentages: FEDERAL_SPENDING config (src/lib/tax/configs)
 * - International aid amounts: GAC Statistical Report on International Assistance FY2023-24
 *   (https://www.international.gc.ca/transparency-transparence/international-assistance-report/)
 * - Coordinates: Capital city lat/lng
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface GlobeFlowPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface DomesticFlow {
  target: GlobeFlowPoint;
  /** Percentage of total federal spending allocated to this province */
  percentage: number;
  label: string;
}

export interface InternationalFlow {
  target: GlobeFlowPoint;
  /** Amount in millions of CAD */
  amountMillions: number;
  category: "development" | "humanitarian" | "peace-security" | "trade";
}

// ── Constants ──────────────────────────────────────────────────────────────────

/** Ottawa — the federal capital and source point for all outbound flows */
export const OTTAWA: GlobeFlowPoint = {
  name: "Ottawa",
  lat: 45.4215,
  lng: -75.6972,
};

/**
 * Total GAC (Global Affairs Canada) spending in FY 2024: $19.2 billion
 * "International Affairs" = 3.7% of total federal spending (~$513.9B)
 * This is used to scale the user's personal contribution to international flows.
 */
export const TOTAL_INTERNATIONAL_AFFAIRS_PERCENTAGE = 3.7;
export const TOTAL_GAC_SPENDING_BILLIONS = 19.2;

// ── Domestic Flows (Provincial/Territorial Transfers) ──────────────────────────
//
// From FEDERAL_SPENDING config:
//   - Transfer to Ontario: 6.02%
//   - Transfer to Alberta: 2.30%
//   - Transfers to Other Provinces: 11.18% (broken down below by approximate
//     share of federal transfers based on CHT/CST/equalization data)

export const DOMESTIC_FLOWS: DomesticFlow[] = [
  {
    target: { name: "Ontario", lat: 43.6532, lng: -79.3832 },
    percentage: 6.02,
    label: "Transfer to Ontario",
  },
  {
    target: { name: "Quebec", lat: 46.8139, lng: -71.2082 },
    percentage: 4.2,
    label: "Transfer to Quebec",
  },
  {
    target: { name: "Alberta", lat: 53.5461, lng: -113.4938 },
    percentage: 2.3,
    label: "Transfer to Alberta",
  },
  {
    target: { name: "British Columbia", lat: 48.4284, lng: -123.3656 },
    percentage: 1.9,
    label: "Transfer to British Columbia",
  },
  {
    target: { name: "Manitoba", lat: 49.8951, lng: -97.1384 },
    percentage: 0.85,
    label: "Transfer to Manitoba",
  },
  {
    target: { name: "Saskatchewan", lat: 50.4452, lng: -104.6189 },
    percentage: 0.6,
    label: "Transfer to Saskatchewan",
  },
  {
    target: { name: "Nova Scotia", lat: 44.6488, lng: -63.5752 },
    percentage: 0.72,
    label: "Transfer to Nova Scotia",
  },
  {
    target: { name: "New Brunswick", lat: 45.9636, lng: -66.6431 },
    percentage: 0.65,
    label: "Transfer to New Brunswick",
  },
  {
    target: {
      name: "Newfoundland & Labrador",
      lat: 47.5615,
      lng: -52.7126,
    },
    percentage: 0.5,
    label: "Transfer to Newfoundland & Labrador",
  },
  {
    target: { name: "Prince Edward Island", lat: 46.2382, lng: -63.1311 },
    percentage: 0.28,
    label: "Transfer to Prince Edward Island",
  },
  {
    target: { name: "Northwest Territories", lat: 62.454, lng: -114.3718 },
    percentage: 0.18,
    label: "Transfer to Northwest Territories",
  },
  {
    target: { name: "Yukon", lat: 60.7212, lng: -135.0568 },
    percentage: 0.16,
    label: "Transfer to Yukon",
  },
  {
    target: { name: "Nunavut", lat: 63.7467, lng: -68.517 },
    percentage: 0.14,
    label: "Transfer to Nunavut",
  },
];

// ── International Flows (Top Aid Recipient Countries) ──────────────────────────
//
// Based on GAC's Statistical Report on International Assistance (FY 2023-24)
// and the International Development Research Centre reports.
// Amounts are approximate bilateral + multilateral disbursements in CAD millions.
//
// Total International Affairs spend = ~$19.2B (GAC FY2024)
// Of that, aid/development/humanitarian = ~$7.3B
// The remainder is: Export Development Canada Account ($10.5B), embassies,
// personnel, trade operations, etc.
//
// Country amounts below represent bilateral international assistance disbursements.

export const INTERNATIONAL_FLOWS: InternationalFlow[] = [
  {
    target: { name: "Ukraine", lat: 50.4501, lng: 30.5234 },
    amountMillions: 1620,
    category: "peace-security",
  },
  {
    target: { name: "Ethiopia", lat: 9.02, lng: 38.7469 },
    amountMillions: 490,
    category: "development",
  },
  {
    target: { name: "Bangladesh", lat: 23.8103, lng: 90.4125 },
    amountMillions: 345,
    category: "development",
  },
  {
    target: { name: "Afghanistan", lat: 34.5281, lng: 69.1723 },
    amountMillions: 305,
    category: "humanitarian",
  },
  {
    target: { name: "Mali", lat: 12.6392, lng: -8.0029 },
    amountMillions: 275,
    category: "development",
  },
  {
    target: { name: "Tanzania", lat: -6.1659, lng: 35.7497 },
    amountMillions: 265,
    category: "development",
  },
  {
    target: { name: "Mozambique", lat: -25.9692, lng: 32.5732 },
    amountMillions: 245,
    category: "development",
  },
  {
    target: { name: "Haiti", lat: 18.5944, lng: -72.3074 },
    amountMillions: 235,
    category: "development",
  },
  {
    target: { name: "DR Congo", lat: -4.4419, lng: 15.2663 },
    amountMillions: 225,
    category: "humanitarian",
  },
  {
    target: { name: "Senegal", lat: 14.6928, lng: -17.4467 },
    amountMillions: 215,
    category: "development",
  },
  {
    target: { name: "Ghana", lat: 5.6037, lng: -0.187 },
    amountMillions: 195,
    category: "development",
  },
  {
    target: { name: "Jordan", lat: 31.9454, lng: 35.9284 },
    amountMillions: 190,
    category: "humanitarian",
  },
  {
    target: { name: "Lebanon", lat: 33.8938, lng: 35.5018 },
    amountMillions: 175,
    category: "humanitarian",
  },
  {
    target: { name: "South Sudan", lat: 4.8594, lng: 31.5713 },
    amountMillions: 165,
    category: "humanitarian",
  },
  {
    target: { name: "Syria", lat: 33.5138, lng: 36.2765 },
    amountMillions: 155,
    category: "humanitarian",
  },
  {
    target: { name: "Iraq", lat: 33.3152, lng: 44.3661 },
    amountMillions: 145,
    category: "humanitarian",
  },
  {
    target: { name: "Somalia", lat: 2.0469, lng: 45.3182 },
    amountMillions: 135,
    category: "development",
  },
  {
    target: { name: "Nigeria", lat: 9.0579, lng: 7.4951 },
    amountMillions: 130,
    category: "development",
  },
  {
    target: { name: "Colombia", lat: 4.711, lng: -74.0721 },
    amountMillions: 115,
    category: "peace-security",
  },
  {
    target: { name: "Myanmar", lat: 19.7633, lng: 96.0785 },
    amountMillions: 105,
    category: "humanitarian",
  },
];

/**
 * Sum of individual country amounts above.
 * The remaining international affairs spending goes to multilateral orgs,
 * embassies, trade operations, Export Development Canada, etc.
 */
export const TOTAL_BILATERAL_AID_MILLIONS = INTERNATIONAL_FLOWS.reduce(
  (sum, f) => sum + f.amountMillions,
  0,
);

// ── Helper: Province capital coordinates for user location lookup ───────────────

export const PROVINCE_CAPITALS: Record<string, GlobeFlowPoint> = {
  ontario: { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  quebec: { name: "Quebec City", lat: 46.8139, lng: -71.2082 },
  alberta: { name: "Edmonton", lat: 53.5461, lng: -113.4938 },
  "british-columbia": { name: "Victoria", lat: 48.4284, lng: -123.3656 },
  manitoba: { name: "Winnipeg", lat: 49.8951, lng: -97.1384 },
  saskatchewan: { name: "Regina", lat: 50.4452, lng: -104.6189 },
  "nova-scotia": { name: "Halifax", lat: 44.6488, lng: -63.5752 },
  "new-brunswick": { name: "Fredericton", lat: 45.9636, lng: -66.6431 },
  "newfoundland-and-labrador": {
    name: "St. John's",
    lat: 47.5615,
    lng: -52.7126,
  },
  "prince-edward-island": {
    name: "Charlottetown",
    lat: 46.2382,
    lng: -63.1311,
  },
  "northwest-territories": {
    name: "Yellowknife",
    lat: 62.454,
    lng: -114.3718,
  },
  yukon: { name: "Whitehorse", lat: 60.7212, lng: -135.0568 },
  nunavut: { name: "Iqaluit", lat: 63.7467, lng: -68.517 },
};
