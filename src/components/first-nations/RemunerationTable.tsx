"use client";

import { Trans } from "@lingui/react/macro";
import type { Remuneration, RemunerationEntry } from "@/lib/supabase/types";

interface RemunerationTableProps {
  data: Remuneration;
}

function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return "-";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateRowTotal(entry: RemunerationEntry): number {
  // Use row_total if available
  if (entry.row_total !== null && entry.row_total !== undefined) {
    return entry.row_total;
  }
  // Use values.total if available
  if (entry.values.total !== undefined) {
    return entry.values.total;
  }
  // Calculate from values if neither is available (exclude 'total' key)
  return Object.entries(entry.values).reduce<number>(
    (sum, [key, val]) => (key === "total" ? sum : sum + (val || 0)),
    0,
  );
}

function calculateSubtotal(entries: RemunerationEntry[]): number {
  return entries.reduce((sum, entry) => sum + calculateRowTotal(entry), 0);
}

function calculateColumnTotals(
  entries: RemunerationEntry[],
  columnKeys: string[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const key of columnKeys) {
    totals[key] = entries.reduce(
      (sum, entry) => sum + (entry.values[key] || 0),
      0,
    );
  }
  return totals;
}

export function RemunerationTable({ data }: RemunerationTableProps) {
  if (!data.entries || data.entries.length === 0) {
    return (
      <p className="text-gray-500 italic">
        <Trans>No remuneration data available.</Trans>
      </p>
    );
  }

  // Split entries into remuneration (individual) and expenses (collective)
  const remunerationEntries = data.entries.filter(
    (e) => !e.is_collective_expense,
  );
  const expenseEntries = data.entries.filter((e) => e.is_collective_expense);

  // Calculate subtotals
  const remunerationSubtotal = calculateSubtotal(remunerationEntries);
  const expensesSubtotal = calculateSubtotal(expenseEntries);
  const grandTotal = remunerationSubtotal + expensesSubtotal;

  // Check if we have both sections
  const hasBothSections =
    remunerationEntries.length > 0 && expenseEntries.length > 0;

  // Check if any entries have months
  const hasMonths = data.entries.some((e) => e.months !== undefined);

  // Get column keys from the data.columns array
  const columnKeys = data.columns.map((col) => col.normalized_key);

  // Check if data has a total column
  const hasTotalColumn = columnKeys.includes("total");

  // Helper to get column header
  const getColumnHeader = (key: string): string => {
    const col = data.columns.find((c) => c.normalized_key === key);
    if (col) {
      // Remove footnote references like (2), (3) from headers
      return col.header.replace(/\s*\(\d+\)\s*$/, "");
    }
    // Fallback: capitalize first letter
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const renderTableHeader = (showName: boolean) => (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <Trans>Position</Trans>
        </th>
        {showName && (
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <Trans>Name</Trans>
          </th>
        )}
        {hasMonths && (
          <th
            scope="col"
            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <Trans>Months</Trans>
          </th>
        )}
        {columnKeys.map((key) => (
          <th
            key={key}
            scope="col"
            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {getColumnHeader(key)}
          </th>
        ))}
        {!hasTotalColumn && (
          <th
            scope="col"
            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <Trans>Total</Trans>
          </th>
        )}
      </tr>
    </thead>
  );

  const renderTableRow = (
    entry: RemunerationEntry,
    index: number,
    showName: boolean,
  ) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">
        {entry.position || "-"}
      </td>
      {showName && (
        <td className="px-4 py-3 text-sm text-gray-900">{entry.name || "-"}</td>
      )}
      {hasMonths && (
        <td className="px-4 py-3 text-sm text-gray-900 text-right">
          {entry.months !== undefined ? entry.months : "-"}
        </td>
      )}
      {columnKeys.map((key) => (
        <td key={key} className="px-4 py-3 text-sm text-gray-900 text-right">
          {formatCurrency(entry.values[key])}
        </td>
      ))}
      {!hasTotalColumn && (
        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
          {formatCurrency(calculateRowTotal(entry))}
        </td>
      )}
    </tr>
  );

  const renderSubtotalRow = (
    label: React.ReactNode,
    subtotal: number,
    showName: boolean,
  ) => {
    // Count columns before the total column
    let colSpan = 1; // Position
    if (showName) colSpan++;
    if (hasMonths) colSpan++;
    // If data has total column, span all but the last data column
    // If no total column, span all data columns (calculated total is separate)
    colSpan += hasTotalColumn ? columnKeys.length - 1 : columnKeys.length;

    return (
      <tr className="bg-gray-100 font-semibold">
        <td colSpan={colSpan} className="px-4 py-3 text-sm text-gray-900">
          {label}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-right">
          {formatCurrency(subtotal)}
        </td>
      </tr>
    );
  };

  const renderTotalRow = (entries: RemunerationEntry[], showName: boolean) => {
    const columnTotals = calculateColumnTotals(entries, columnKeys);
    const grandTotal = calculateSubtotal(entries);

    return (
      <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
        <td className="px-4 py-3 text-sm text-gray-900">
          <Trans>Total</Trans>
        </td>
        {showName && <td className="px-4 py-3 text-sm text-gray-900"></td>}
        {hasMonths && <td className="px-4 py-3 text-sm text-gray-900"></td>}
        {columnKeys.map((key) => (
          <td key={key} className="px-4 py-3 text-sm text-gray-900 text-right">
            {formatCurrency(columnTotals[key])}
          </td>
        ))}
        {!hasTotalColumn && (
          <td className="px-4 py-3 text-sm text-gray-900 text-right">
            {formatCurrency(grandTotal)}
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Remuneration Section */}
      {remunerationEntries.length > 0 && (
        <div className="overflow-x-auto">
          {hasBothSections && (
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              <Trans>Remuneration</Trans>
            </h4>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            {renderTableHeader(true)}
            <tbody className="bg-white divide-y divide-gray-200">
              {remunerationEntries.map((entry, index) =>
                renderTableRow(entry, index, true),
              )}
              {hasBothSections &&
                renderSubtotalRow(
                  <Trans>Subtotal - Remuneration</Trans>,
                  remunerationSubtotal,
                  true,
                )}
              {!hasBothSections && renderTotalRow(remunerationEntries, true)}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Section */}
      {expenseEntries.length > 0 && (
        <div className="overflow-x-auto">
          {hasBothSections && (
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              <Trans>Expenses</Trans>
            </h4>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            {renderTableHeader(false)}
            <tbody className="bg-white divide-y divide-gray-200">
              {expenseEntries.map((entry, index) =>
                renderTableRow(entry, index, false),
              )}
              {hasBothSections &&
                renderSubtotalRow(
                  <Trans>Subtotal - Expenses</Trans>,
                  expensesSubtotal,
                  false,
                )}
              {!hasBothSections && renderTotalRow(expenseEntries, false)}
            </tbody>
          </table>
        </div>
      )}

      {/* Grand Total */}
      {hasBothSections && (
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-lg font-bold text-gray-900">
              <Trans>Grand Total</Trans>
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Audit Information */}
      {data.is_audited !== undefined && (
        <p className="mt-4 text-sm text-gray-500">
          {data.is_audited ? (
            <Trans>This schedule has been audited.</Trans>
          ) : (
            <Trans>This schedule is unaudited.</Trans>
          )}
          {data.auditor_name && (
            <span>
              {" "}
              <Trans>Prepared by: {data.auditor_name}</Trans>
            </span>
          )}
        </p>
      )}
    </div>
  );
}
