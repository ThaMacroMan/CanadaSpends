"use client";

import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import type { Claim } from "@/lib/supabase/claims";

interface ClaimsTableProps {
  claims: Claim[];
}

function formatCurrency(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (absolute >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "short" });
}

function getStatusBadgeClasses(processStage: string): string {
  const baseClasses =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  const stage = (processStage || "").toLowerCase();

  if (stage.includes("settled") || stage.includes("concluded")) {
    return `${baseClasses} bg-green-100 text-green-800`;
  }
  if (stage.includes("assessment")) {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  }
  if (stage.includes("negotiat")) {
    return `${baseClasses} bg-blue-100 text-blue-800`;
  }
  return `${baseClasses} bg-gray-100 text-gray-800`;
}

function getLastKeyDateDetail(claim: Claim): {
  label: string | null;
  date: string;
} {
  if (!claim.key_dates || !claim.last_key_date) {
    return { label: null, date: "-" };
  }

  // Normalize the last_key_date for comparison
  const lastKeyDateNormalized = new Date(claim.last_key_date).getTime();

  // Find the key that matches the last_key_date value
  for (const [label, date] of Object.entries(claim.key_dates)) {
    const dateNormalized = new Date(date).getTime();
    if (dateNormalized === lastKeyDateNormalized) {
      return { label, date: formatDate(date) };
    }
  }

  return { label: null, date: formatDate(claim.last_key_date) };
}

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function ClaimsTable({ claims }: ClaimsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Sort by first_key_date ascending (oldest first)
  const sortedClaims = [...claims].sort((a, b) => {
    const dateA = a.first_key_date ? new Date(a.first_key_date).getTime() : 0;
    const dateB = b.first_key_date ? new Date(b.first_key_date).getTime() : 0;
    return dateA - dateB;
  });

  const totalPayments = sortedClaims.reduce(
    (sum, claim) => sum + (claim.total_payments || 0),
    0,
  );

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (sortedClaims.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <Trans>Claim</Trans>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <Trans>Status</Trans>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <Trans>Last Update</Trans>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <Trans>Total Payments</Trans>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedClaims.map((claim) => {
            const isExpanded = expandedRows.has(claim.id);
            const lastDetail = getLastKeyDateDetail(claim);

            return (
              <>
                <tr
                  key={claim.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(claim.id)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start">
                      <span className="mr-2 mt-1 text-gray-400">
                        <ChevronIcon expanded={isExpanded} />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.claim_name}
                        </div>
                        {claim.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {claim.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap align-top">
                    <span
                      className={getStatusBadgeClasses(claim.process_stage)}
                    >
                      {claim.process_stage}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-xs text-gray-500">
                      {lastDetail.date}
                    </div>
                    {lastDetail.label && (
                      <div className="text-sm text-gray-900">
                        {lastDetail.label}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 align-top">
                    {claim.total_payments != null && claim.total_payments > 0
                      ? formatCurrency(claim.total_payments)
                      : "-"}
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${claim.id}-details`} className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-4">
                      <div className="ml-6 space-y-4">
                        {/* Key Dates */}
                        {claim.key_dates &&
                          Object.keys(claim.key_dates).length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                <Trans>Key Dates</Trans>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {Object.entries(claim.key_dates)
                                  .sort(
                                    ([, a], [, b]) =>
                                      new Date(a).getTime() -
                                      new Date(b).getTime(),
                                  )
                                  .map(([label, date]) => (
                                    <div
                                      key={label}
                                      className="text-sm bg-white p-2 rounded border"
                                    >
                                      <div className="text-gray-500">
                                        {formatDate(date)}
                                      </div>
                                      <div className="text-gray-900">
                                        {label}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {claim.settlement_amount != null &&
                            claim.settlement_amount > 0 && (
                              <div>
                                <div className="text-gray-500">
                                  <Trans>Settlement Amount</Trans>
                                </div>
                                <div className="text-gray-900 font-medium">
                                  {formatCurrency(claim.settlement_amount)}
                                </div>
                                {claim.settlement_date && (
                                  <div className="text-gray-500 text-xs">
                                    {formatDate(claim.settlement_date)}
                                  </div>
                                )}
                              </div>
                            )}
                          {claim.tribunal_award != null &&
                            claim.tribunal_award > 0 && (
                              <div>
                                <div className="text-gray-500">
                                  <Trans>Tribunal Award</Trans>
                                </div>
                                <div className="text-gray-900 font-medium">
                                  {formatCurrency(claim.tribunal_award)}
                                </div>
                                {claim.tribunal_award_implementation_date && (
                                  <div className="text-gray-500 text-xs">
                                    {formatDate(
                                      claim.tribunal_award_implementation_date,
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          {claim.involved_band_names &&
                            claim.involved_band_names.length > 1 && (
                              <div className="col-span-2">
                                <div className="text-gray-500">
                                  <Trans>Involved Bands</Trans>
                                </div>
                                <div className="text-gray-900">
                                  {claim.involved_band_names.join(", ")}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <td
              colSpan={3}
              className="px-4 py-3 text-sm font-medium text-gray-900"
            >
              <Trans>Total</Trans>
            </td>
            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
              {formatCurrency(totalPayments)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
