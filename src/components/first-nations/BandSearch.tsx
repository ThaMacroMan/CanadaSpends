"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { Search } from "lucide-react";
import type { BandInfo } from "@/lib/supabase/types";

interface BandSearchProps {
  bands: BandInfo[];
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
  const fsClasses = `inline-flex items-center justify-center w-6 h-6 text-xs font-medium ${
    hasFS
      ? "bg-auburn-700 text-white hover:bg-auburn-800"
      : "bg-gray-200 text-gray-400"
  }`;
  const rClasses = `inline-flex items-center justify-center w-6 h-6 text-xs font-medium ${
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
        <Link href={href} className={rClasses} title="Remuneration">
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

export function BandSearch({ bands, lang }: BandSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Extract all unique years from all bands, sorted ascending (oldest first)
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    bands.forEach((band) => {
      band.availableYears.forEach((year) => yearsSet.add(year));
    });
    return Array.from(yearsSet).sort((a, b) => a.localeCompare(b));
  }, [bands]);

  const filteredBands = useMemo(() => {
    let result = bands;

    // Filter by year
    if (selectedYear) {
      result = result.filter((band) =>
        band.availableYears.includes(selectedYear),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((band) => band.name.toLowerCase().includes(query));
    }

    return result;
  }, [bands, searchQuery, selectedYear]);

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
  }, [filteredBands, displayYears]);

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
            placeholder="Search First Nations bands..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-auburn-500 focus:border-auburn-500 text-base"
          />
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
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {searchQuery || selectedYear ? (
          <Trans>
            Showing {filteredBands.length} of {bands.length} bands
          </Trans>
        ) : (
          <Trans>{bands.length} First Nations bands with financial data</Trans>
        )}
      </div>

      {filteredBands.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            <Trans>No bands found matching your search.</Trans>
          </p>
        </div>
      ) : (
        <div
          ref={tableContainerRef}
          className="relative w-screen -ml-[50vw] left-1/2 right-1/2 overflow-auto max-h-[70vh] border-y border-gray-200"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] border-r border-gray-200"
                >
                  <Trans>First Nation</Trans>
                </th>
                <th
                  scope="col"
                  className="sticky left-[200px] z-30 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200"
                >
                  <Trans>Province</Trans>
                </th>
                {displayYears.map((year) => (
                  <th
                    key={year}
                    scope="col"
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]"
                  >
                    {formatFiscalYearShort(year)}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-l border-gray-200"
                >
                  <Trans>Revenue</Trans>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  <Trans>Expenses</Trans>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  <Trans>Accum. Surplus</Trans>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]"
                >
                  <Trans>Population</Trans>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBands.map((band) => (
                <BandRow
                  key={band.bcid}
                  band={band}
                  lang={lang}
                  displayYears={displayYears}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BandRow({
  band,
  lang,
  displayYears,
}: {
  band: BandInfo;
  lang: string;
  displayYears: string[];
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200 group-hover:bg-gray-50">
        <Link
          href={`/${lang}/first-nations/${band.bcid}`}
          className="text-sm font-medium text-auburn-700 hover:text-auburn-900 hover:underline"
        >
          {band.name}
        </Link>
      </td>
      <td className="sticky left-[200px] z-10 bg-white px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
        {band.province || "-"}
      </td>
      {displayYears.map((year) => {
        const chunkTypes = band.availableChunkTypes[year] || [];
        const hasFS =
          chunkTypes.includes("statement_of_operations") ||
          chunkTypes.includes("statement_of_financial_position");
        const hasR = chunkTypes.includes("remuneration");
        const href = `/${lang}/first-nations/${band.bcid}/${year}`;

        return (
          <td key={year} className="px-3 py-3 text-center">
            <DataIndicator hasFS={hasFS} hasR={hasR} href={href} />
          </td>
        );
      })}
      <td className="px-4 py-3 text-right text-sm text-gray-600 border-l border-gray-200">
        -
      </td>
      <td className="px-4 py-3 text-right text-sm text-gray-600">-</td>
      <td className="px-4 py-3 text-right text-sm text-gray-600">-</td>
      <td className="px-4 py-3 text-right text-sm text-gray-600">-</td>
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
