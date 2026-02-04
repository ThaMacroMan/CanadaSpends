"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { Search } from "lucide-react";
import type { FirstNationInfo } from "@/lib/supabase/types";

const PROVINCE_NAMES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

interface FirstNationsSearchProps {
  firstNations: FirstNationInfo[];
  lang: string;
}

const DataIndicator = ({
  hasFS,
  hasR,
  href,
}: {
  hasFS: boolean;
  hasR: boolean;
  href: string;
}) => {
  const fsClasses = `inline-flex items-center justify-center w-6 h-6 text-xs font-medium select-none ${
    hasFS
      ? "bg-auburn-700 text-white hover:bg-auburn-800"
      : "bg-gray-200 text-gray-400"
  }`;
  const rClasses = `inline-flex items-center justify-center w-6 h-6 text-xs font-medium select-none ${
    hasR
      ? "bg-auburn-700 text-white hover:bg-auburn-800"
      : "bg-gray-200 text-gray-400"
  }`;

  return (
    <div className="flex gap-1 justify-center">
      {hasFS ? (
        <Link href={href} className={fsClasses} title="Financial Statements">
          FS
        </Link>
      ) : (
        <span className={fsClasses} title="Financial Statements">
          FS
        </span>
      )}
      {hasR ? (
        <Link
          href={`${href}#remuneration`}
          className={rClasses}
          title="Remuneration"
        >
          R
        </Link>
      ) : (
        <span className={rClasses} title="Remuneration">
          R
        </span>
      )}
    </div>
  );
};

type SortOption = "alphabetical" | "population";

export function FirstNationsSearch({
  firstNations,
  lang,
}: FirstNationsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");

  // Extract all unique years from all First Nations, sorted ascending (oldest first)
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    firstNations.forEach((firstNation) => {
      firstNation.availableYears.forEach((year) => yearsSet.add(year));
    });
    return Array.from(yearsSet).sort((a, b) => a.localeCompare(b));
  }, [firstNations]);

  // Extract all unique provinces from all First Nations, sorted alphabetically
  const availableProvinces = useMemo(() => {
    const provincesSet = new Set<string>();
    firstNations.forEach((firstNation) => {
      if (firstNation.province) {
        provincesSet.add(firstNation.province);
      }
    });
    return Array.from(provincesSet).sort((a, b) => a.localeCompare(b));
  }, [firstNations]);

  const filteredFirstNations = useMemo(() => {
    let result = firstNations;

    // Filter by year
    if (selectedYear) {
      result = result.filter((firstNation) =>
        firstNation.availableYears.includes(selectedYear),
      );
    }

    // Filter by province
    if (selectedProvince) {
      result = result.filter(
        (firstNation) => firstNation.province === selectedProvince,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((firstNation) =>
        firstNation.name.toLowerCase().includes(query),
      );
    }

    // Sort results
    if (sortBy === "alphabetical") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "population") {
      result = [...result].sort((a, b) => {
        const popA = a.populationOnReserve ?? 0;
        const popB = b.populationOnReserve ?? 0;
        return popB - popA; // Descending order (highest population first)
      });
    }

    return result;
  }, [firstNations, searchQuery, selectedYear, selectedProvince, sortBy]);

  // Years to display in columns (filtered if a year is selected)
  const displayYears = selectedYear ? [selectedYear] : availableYears;

  // Ref for scrolling table to the end
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the end on mount
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft =
        tableContainerRef.current.scrollWidth;
    }
  }, [filteredFirstNations, displayYears]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search First Nations..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-auburn-500 focus:border-auburn-500 text-base"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="block w-full py-3 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-auburn-500 focus:border-auburn-500 text-base bg-white"
          >
            <option value="">All provinces</option>
            {availableProvinces.map((province) => (
              <option key={province} value={province}>
                {PROVINCE_NAMES[province] || province}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block w-full py-3 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-auburn-500 focus:border-auburn-500 text-base bg-white"
          >
            <option value="">All years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {formatFiscalYear(year)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="block w-full py-3 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-auburn-500 focus:border-auburn-500 text-base bg-white"
          >
            <option value="alphabetical">Sort: A-Z</option>
            <option value="population">Sort: Population</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {searchQuery || selectedYear || selectedProvince ? (
          <Trans>
            Showing {filteredFirstNations.length} of {firstNations.length} First
            Nations
          </Trans>
        ) : (
          <Trans>{firstNations.length} First Nations with financial data</Trans>
        )}
      </div>

      {filteredFirstNations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            <Trans>No First Nations found matching your search.</Trans>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 text-xs text-gray-500 select-none flex gap-1">
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-auburn-700 text-white text-xs font-medium">
                FS
              </span>
              <span>Financial Statements</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-auburn-700 text-white text-xs font-medium">
                R
              </span>
              <span>Remuneration</span>
            </span>
          </div>
          <div
            ref={tableContainerRef}
            className="relative w-screen -ml-[50vw] left-1/2 right-1/2 overflow-auto border-y border-gray-200 flex justify-center"
          >
            <table className="divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[250px] max-w-[250px]"
                  >
                    <Trans>First Nation</Trans>
                  </th>
                  <th
                    scope="col"
                    className="sticky left-[250px] z-30 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[60px] shadow-[inset_1px_0_0_0_rgb(229,231,235),4px_0_0_0_rgb(249,250,251)]"
                  >
                    <Trans>Prov.</Trans>
                  </th>
                  {displayYears.map((year) => (
                    <th
                      key={year}
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]"
                    >
                      {formatFiscalYearShort(year)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFirstNations.map((firstNation) => (
                  <FirstNationRow
                    key={firstNation.bcid}
                    firstNation={firstNation}
                    lang={lang}
                    displayYears={displayYears}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function FirstNationRow({
  firstNation,
  lang,
  displayYears,
}: {
  firstNation: FirstNationInfo;
  lang: string;
  displayYears: string[];
}) {
  const populationText =
    firstNation.populationOnReserve !== undefined && firstNation.populationYear
      ? `${firstNation.populationYear} On-Reserve Population: ${firstNation.populationOnReserve.toLocaleString()}`
      : null;

  // Find the index of the last year with data
  const lastYearWithDataIndex = displayYears.reduce((lastIdx, year, idx) => {
    const hasData = firstNation.availableYears.includes(year);
    return hasData ? idx : lastIdx;
  }, -1);

  // Determine if we need a merged cell and how many columns it spans
  const needsMergedCell =
    (firstNation.isSubBand || firstNation.isSelfGoverned) &&
    lastYearWithDataIndex < displayYears.length - 1;
  const mergedColSpan = displayYears.length - lastYearWithDataIndex - 1;

  // Generate the message content for merged cell
  const renderMergedMessage = () => {
    if (firstNation.isSubBand) {
      if (firstNation.parentBandBcid && firstNation.parentBandName) {
        return (
          <>
            {firstNation.name} reports their financial statements under{" "}
            <Link
              href={`/${lang}/first-nations/${firstNation.parentBandBcid}`}
              className="text-auburn-700 hover:text-auburn-900 hover:underline not-italic"
            >
              {firstNation.parentBandName}
            </Link>
          </>
        );
      }
      return `${firstNation.name} reports their financial statements under a different band`;
    }
    return `${firstNation.name} is a self governing first nation under ${firstNation.membershipAuthority || "their membership authority"} and is exempt from the FNFTA`;
  };

  return (
    <tr className="hover:bg-gray-50 group">
      <td className="sticky left-0 z-20 bg-white px-4 py-3 group-hover:bg-gray-50 w-[250px] max-w-[250px]">
        <Link
          href={`/${lang}/first-nations/${firstNation.bcid}`}
          className="text-sm font-medium text-auburn-700 hover:text-auburn-900 hover:underline block truncate"
        >
          {firstNation.name}
        </Link>
        {populationText && (
          <span className="text-xs text-gray-500 block truncate">
            {populationText}
          </span>
        )}
      </td>
      <td className="sticky left-[250px] z-20 bg-white px-4 py-3 text-sm text-gray-600 border-r border-gray-200 w-[60px] group-hover:bg-gray-50 shadow-[inset_1px_0_0_0_rgb(229,231,235)]">
        {firstNation.province || "-"}
      </td>
      {/* Render year cells up to and including lastYearWithDataIndex */}
      {displayYears.slice(0, lastYearWithDataIndex + 1).map((year) => {
        const chunkTypes = firstNation.availableChunkTypes[year] || [];
        const hasFS =
          chunkTypes.includes("statement_of_operations") ||
          chunkTypes.includes("statement_of_financial_position");
        const hasR = chunkTypes.includes("remuneration");
        const href = `/${lang}/first-nations/${firstNation.bcid}/${year}`;

        return (
          <td key={year} className="px-3 py-3 text-center">
            <DataIndicator hasFS={hasFS} hasR={hasR} href={href} />
          </td>
        );
      })}
      {/* Render merged cell for remaining years if sub-band or self-governed */}
      {needsMergedCell && (
        <td
          colSpan={mergedColSpan}
          className="text-gray-500 italic text-sm px-3 py-3 text-left"
        >
          {renderMergedMessage()}
        </td>
      )}
      {/* If not sub-band/self-governed, render remaining year cells normally */}
      {!needsMergedCell &&
        displayYears.slice(lastYearWithDataIndex + 1).map((year) => {
          const chunkTypes = firstNation.availableChunkTypes[year] || [];
          const hasFS =
            chunkTypes.includes("statement_of_operations") ||
            chunkTypes.includes("statement_of_financial_position");
          const hasR = chunkTypes.includes("remuneration");
          const href = `/${lang}/first-nations/${firstNation.bcid}/${year}`;

          return (
            <td key={year} className="px-3 py-3 text-center">
              <DataIndicator hasFS={hasFS} hasR={hasR} href={href} />
            </td>
          );
        })}
    </tr>
  );
}

function formatFiscalYear(year: string | undefined): string {
  if (!year) return "N/A";
  if (year.includes("-")) {
    const date = new Date(year);
    const endYear = date.getFullYear();
    const month = date.getMonth();

    if (month <= 2) {
      const startYear = endYear - 1;
      return `FY ${startYear}-${String(endYear).slice(-2)}`;
    } else {
      const nextYear = endYear + 1;
      return `FY ${endYear}-${String(nextYear).slice(-2)}`;
    }
  }

  return `FY ${year}`;
}

function formatFiscalYearShort(year: string | undefined): string {
  if (!year) return "N/A";
  if (year.includes("-")) {
    const date = new Date(year);
    const endYear = date.getFullYear();
    const month = date.getMonth();

    if (month <= 2) {
      const startYear = endYear - 1;
      return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
    } else {
      const nextYear = endYear + 1;
      return `${String(endYear).slice(-2)}/${String(nextYear).slice(-2)}`;
    }
  }

  return year;
}
