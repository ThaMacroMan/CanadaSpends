// Data fetching functions for First Nations bands

import { supabaseFetch } from "./index";
import type {
  AnnualReportExtraction,
  BandInfo,
  ExtractionAvailabilityResponse,
  Notes,
  PopulationSummaryByBand,
  Remuneration,
  StatementOfFinancialPosition,
  StatementOfOperations,
} from "./types";

/**
 * Convert API response to internal BandInfo format
 */
function toBandInfo(row: ExtractionAvailabilityResponse): BandInfo {
  return {
    bcid: row.bcid,
    name: row.name,
    province: row.province,
    // Convert fiscal_years numbers to strings, sorted descending
    availableYears: row.fiscal_years
      .map((y) => String(y))
      .sort((a, b) => Number(b) - Number(a)),
    availableChunkTypes: row.chunk_types_by_year,
  };
}

/**
 * Get population data for all bands
 */
export async function getPopulationData(): Promise<
  Map<string, PopulationSummaryByBand>
> {
  const data = await supabaseFetch<PopulationSummaryByBand[]>(
    "population_summary_by_band?select=bcid,latest_year,pop_on_reserve_total",
  );

  const populationMap = new Map<string, PopulationSummaryByBand>();
  for (const record of data) {
    populationMap.set(record.bcid, record);
  }
  return populationMap;
}

/**
 * Get all unique bands that have available data
 */
export async function getAllBands(): Promise<BandInfo[]> {
  const [bandsData, populationMap] = await Promise.all([
    supabaseFetch<ExtractionAvailabilityResponse[]>("extraction_availability"),
    getPopulationData(),
  ]);

  // Convert and add population data
  const bands = bandsData.map((row) => {
    const band = toBandInfo(row);
    const population = populationMap.get(row.bcid);
    if (population) {
      band.populationYear = population.latest_year;
      band.populationOnReserve = population.pop_on_reserve_total ?? undefined;
    }
    return band;
  });

  // Sort alphabetically by name
  return bands.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single band's info by bcid
 */
export async function getBandById(bcid: string): Promise<BandInfo | null> {
  const data = await supabaseFetch<ExtractionAvailabilityResponse[]>(
    `extraction_availability?bcid=eq.${encodeURIComponent(bcid)}`,
  );

  if (data.length === 0) {
    return null;
  }

  return toBandInfo(data[0]);
}

/**
 * Get a specific extraction for a band
 */
export async function getBandExtraction<T>(
  bcid: string,
  year: string,
  chunkType: string,
): Promise<T | null> {
  const data = await supabaseFetch<AnnualReportExtraction[]>(
    `annual_report_extractions?bcid=eq.${encodeURIComponent(bcid)}&fiscal_year_end=eq.${encodeURIComponent(year)}&chunk_type=eq.${encodeURIComponent(chunkType)}&is_active=eq.true&select=extracted_data`,
  );

  if (data.length === 0) {
    return null;
  }

  return data[0].extracted_data as T;
}

/**
 * Get all data for a band for a specific year
 */
export async function getBandYearData(
  bcid: string,
  year: string,
): Promise<{
  statementOfOperations: StatementOfOperations | null;
  statementOfFinancialPosition: StatementOfFinancialPosition | null;
  remuneration: Remuneration | null;
  notes: Notes | null;
}> {
  const [
    statementOfOperations,
    statementOfFinancialPosition,
    remuneration,
    notes,
  ] = await Promise.all([
    getBandExtraction<StatementOfOperations>(
      bcid,
      year,
      "statement_of_operations",
    ),
    getBandExtraction<StatementOfFinancialPosition>(
      bcid,
      year,
      "statement_of_financial_position",
    ),
    getBandExtraction<Remuneration>(bcid, year, "remuneration"),
    getBandExtraction<Notes>(bcid, year, "notes"),
  ]);

  return {
    statementOfOperations,
    statementOfFinancialPosition,
    remuneration,
    notes,
  };
}

/**
 * Search bands by name (client-side filtering, use for server-side if needed)
 */
export async function searchBands(query: string): Promise<BandInfo[]> {
  if (!query.trim()) {
    return getAllBands();
  }

  // Use ilike for case-insensitive search
  const data = await supabaseFetch<ExtractionAvailabilityResponse[]>(
    `extraction_availability?name=ilike.*${encodeURIComponent(query)}*`,
  );

  return data.map(toBandInfo).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get the latest year for a band
 */
export async function getBandLatestYear(bcid: string): Promise<string | null> {
  const band = await getBandById(bcid);
  if (!band || band.availableYears.length === 0) {
    return null;
  }
  return band.availableYears[0]; // Already sorted descending
}
