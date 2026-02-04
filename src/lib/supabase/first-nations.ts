// Data fetching functions for First Nations

import { supabaseFetch } from "./index";
import type {
  AnnualReportExtraction,
  ExtractionAvailabilityResponse,
  FirstNationInfo,
  FirstNationsPopulation,
  Notes,
  PopulationSummary,
  Remuneration,
  StatementOfFinancialPosition,
  StatementOfOperations,
} from "./types";

/**
 * Convert API response to internal FirstNationInfo format
 */
function toFirstNationInfo(
  row: ExtractionAvailabilityResponse,
): FirstNationInfo {
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
 * Get population data for all First Nations
 */
export async function getPopulationData(): Promise<
  Map<string, PopulationSummary>
> {
  const data = await supabaseFetch<PopulationSummary[]>(
    "population_summary_by_band?select=bcid,latest_year,pop_on_reserve_total",
  );

  const populationMap = new Map<string, PopulationSummary>();
  for (const record of data) {
    populationMap.set(record.bcid, record);
  }
  return populationMap;
}

/**
 * Get all unique First Nations that have available data
 */
export async function getAllFirstNations(): Promise<FirstNationInfo[]> {
  const [firstNationsData, populationMap] = await Promise.all([
    supabaseFetch<ExtractionAvailabilityResponse[]>("extraction_availability"),
    getPopulationData(),
  ]);

  // Convert and add population data
  const firstNations = firstNationsData.map((row) => {
    const firstNation = toFirstNationInfo(row);
    const population = populationMap.get(row.bcid);
    if (population) {
      firstNation.populationYear = population.latest_year;
      firstNation.populationOnReserve =
        population.pop_on_reserve_total ?? undefined;
    }
    return firstNation;
  });

  // Sort alphabetically by name
  return firstNations.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single First Nation's info by bcid
 */
export async function getFirstNationById(
  bcid: string,
): Promise<FirstNationInfo | null> {
  const data = await supabaseFetch<ExtractionAvailabilityResponse[]>(
    `extraction_availability?bcid=eq.${encodeURIComponent(bcid)}`,
  );

  if (data.length === 0) {
    return null;
  }

  return toFirstNationInfo(data[0]);
}

/**
 * Get a specific extraction for a First Nation
 */
export async function getFirstNationExtraction<T>(
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
 * Get all data for a First Nation for a specific year
 */
export async function getFirstNationYearData(
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
    getFirstNationExtraction<StatementOfOperations>(
      bcid,
      year,
      "statement_of_operations",
    ),
    getFirstNationExtraction<StatementOfFinancialPosition>(
      bcid,
      year,
      "statement_of_financial_position",
    ),
    getFirstNationExtraction<Remuneration>(bcid, year, "remuneration"),
    getFirstNationExtraction<Notes>(bcid, year, "notes"),
  ]);

  return {
    statementOfOperations,
    statementOfFinancialPosition,
    remuneration,
    notes,
  };
}

/**
 * Search First Nations by name (client-side filtering, use for server-side if needed)
 */
export async function searchFirstNations(
  query: string,
): Promise<FirstNationInfo[]> {
  if (!query.trim()) {
    return getAllFirstNations();
  }

  // Use ilike for case-insensitive search
  const data = await supabaseFetch<ExtractionAvailabilityResponse[]>(
    `extraction_availability?name=ilike.*${encodeURIComponent(query)}*`,
  );

  return data
    .map(toFirstNationInfo)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get the latest year for a First Nation
 */
export async function getFirstNationLatestYear(
  bcid: string,
): Promise<string | null> {
  const firstNation = await getFirstNationById(bcid);
  if (!firstNation || firstNation.availableYears.length === 0) {
    return null;
  }
  return firstNation.availableYears[0]; // Already sorted descending
}

/**
 * Get population history for a First Nation
 */
export async function getFirstNationPopulationHistory(
  bcid: string,
): Promise<FirstNationsPopulation[]> {
  return supabaseFetch<FirstNationsPopulation[]>(
    `first_nations_population?bcid=eq.${encodeURIComponent(bcid)}&order=year.asc`,
  );
}
