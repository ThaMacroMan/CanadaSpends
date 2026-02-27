"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLingui, Trans } from "@lingui/react/macro";

import { PageContent, Section } from "@/components/Layout";
import {
  calculateDetailedTax,
  formatCurrency,
  getSupportedYears,
  SupportedYear,
} from "@/lib/tax";
import { localizedPath } from "@/lib/utils";
import {
  TOTAL_INTERNATIONAL_AFFAIRS_PERCENTAGE,
  DOMESTIC_FLOWS,
} from "@/lib/globeFlowData";

// ── Dynamic import for TaxGlobe (no SSR — Three.js is client-only) ────────────

const TaxGlobe = dynamic(
  () =>
    import("@/components/TaxGlobe/TaxGlobe").then((mod) => ({
      default: mod.TaxGlobe,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-muted-foreground text-sm">
            <Trans>Loading globe…</Trans>
          </p>
        </div>
      </div>
    ),
  },
);

// ── Province config ────────────────────────────────────────────────────────────

const PROVINCE_NAMES: Record<string, string> = {
  alberta: "Alberta",
  "british-columbia": "British Columbia",
  manitoba: "Manitoba",
  "new-brunswick": "New Brunswick",
  "newfoundland-and-labrador": "Newfoundland and Labrador",
  "northwest-territories": "Northwest Territories",
  "nova-scotia": "Nova Scotia",
  nunavut: "Nunavut",
  ontario: "Ontario",
  "prince-edward-island": "Prince Edward Island",
  quebec: "Quebec",
  saskatchewan: "Saskatchewan",
  yukon: "Yukon",
};

const PROVINCES_SORTED = Object.entries(PROVINCE_NAMES).sort((a, b) =>
  a[1].localeCompare(b[1]),
);

const PROVINCE_CODES: Record<string, string> = {
  AB: "alberta",
  BC: "british-columbia",
  MB: "manitoba",
  NB: "new-brunswick",
  NL: "newfoundland-and-labrador",
  NS: "nova-scotia",
  NT: "northwest-territories",
  NU: "nunavut",
  ON: "ontario",
  PE: "prince-edward-island",
  QC: "quebec",
  SK: "saskatchewan",
  YT: "yukon",
};

const PROVINCE_TO_CODE: Record<string, string> = {
  alberta: "AB",
  "british-columbia": "BC",
  manitoba: "MB",
  "new-brunswick": "NB",
  "newfoundland-and-labrador": "NL",
  "nova-scotia": "NS",
  "northwest-territories": "NT",
  nunavut: "NU",
  ontario: "ON",
  "prince-edward-island": "PE",
  quebec: "QC",
  saskatchewan: "SK",
  yukon: "YT",
};

const DEFAULT_INCOME = 100000;
const DEFAULT_PROVINCE = "ontario";
const DEFAULT_YEAR: SupportedYear = "2025";

// ── Page ───────────────────────────────────────────────────────────────────────

export default function GlobePage() {
  const { t, i18n } = useLingui();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial state from URL
  const initialIncome = (() => {
    const p = searchParams.get("income");
    if (p) {
      const n = Number(p);
      if (!isNaN(n) && n > 0) return n;
    }
    return DEFAULT_INCOME;
  })();

  const initialProvince = (() => {
    const p = searchParams.get("province")?.toUpperCase();
    if (p && PROVINCE_CODES[p]) return PROVINCE_CODES[p];
    return DEFAULT_PROVINCE;
  })();

  const initialYear = (() => {
    const p = searchParams.get("year");
    const supported = getSupportedYears();
    if (p && supported.includes(p as SupportedYear)) return p as SupportedYear;
    return DEFAULT_YEAR;
  })();

  const [income, setIncome] = useState(initialIncome);
  const [province, setProvince] = useState(initialProvince);
  const [year, setYear] = useState<SupportedYear>(initialYear);
  const supportedYears = getSupportedYears();

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("province", PROVINCE_TO_CODE[province] || "ON");
    params.set("income", income.toString());
    params.set("year", year);
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [income, province, year, router]);

  // Tax calculation
  const taxCalc = useMemo(() => {
    if (income <= 0) return null;
    return calculateDetailedTax(income, province, year);
  }, [income, province, year]);

  const federalTax = taxCalc?.federalTax ?? 0;

  // Derived amounts for the stat bar
  const totalDomesticTransferPct = useMemo(
    () => DOMESTIC_FLOWS.reduce((sum, f) => sum + f.percentage, 0),
    [],
  );
  const domesticTransferAmount = (federalTax * totalDomesticTransferPct) / 100;
  const internationalAmount =
    (federalTax * TOTAL_INTERNATIONAL_AFFAIRS_PERCENTAGE) / 100;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Globe ─────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-gray-950" style={{ height: "65vh" }}>
        <TaxGlobe federalTax={federalTax} province={province} />

        {/* Back link overlaid in top-left */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href={localizedPath(
              `/tax-visualizer?income=${income}&province=${PROVINCE_TO_CODE[province] || "ON"}&year=${year}`,
              i18n.locale,
            )}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900/80 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm hover:text-white hover:bg-gray-900/95 transition-colors border border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <Trans>Tax Visualizer</Trans>
          </Link>
        </div>

        {/* Title overlaid in top-center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <h1 className="text-lg md:text-xl font-display font-bold text-white/90 drop-shadow-lg">
            <Trans>Where Your Tax Dollars Flow</Trans>
          </h1>
        </div>

        {/* Legend overlaid in bottom-left */}
        <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-gray-900/80 px-3 py-2 text-xs text-white/70 backdrop-blur-sm border border-white/10 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1 w-5 rounded-full bg-[#c0392b]"
              style={{ height: "4px" }}
            />
            <span>
              <Trans>Your tax → Ottawa</Trans>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1 w-5 rounded-full bg-[#e07040]"
              style={{ height: "3px" }}
            />
            <span>
              <Trans>Provincial transfers</Trans>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1 w-5 rounded-full bg-[#f0a030]"
              style={{ height: "2px" }}
            />
            <span>
              <Trans>International aid</Trans>
            </span>
          </div>
          <div className="mt-1 text-white/40 text-[10px]">
            <Trans>Line thickness = dollar amount</Trans>
          </div>
        </div>
      </div>

      {/* ── Control panel + stats ────────────────────────────────────── */}
      <PageContent>
        <Section>
          {/* Stat summary bar */}
          {taxCalc && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  <Trans>Federal Tax</Trans>
                </div>
                <div className="text-2xl font-bold text-[#c0392b] font-mono">
                  {formatCurrency(federalTax)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Trans>Sent to Ottawa</Trans>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  <Trans>Provincial Transfers</Trans>
                </div>
                <div className="text-2xl font-bold text-[#e07040] font-mono">
                  {formatCurrency(domesticTransferAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Trans>Redistributed across Canada</Trans>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  <Trans>International Affairs</Trans>
                </div>
                <div className="text-2xl font-bold text-[#f0a030] font-mono">
                  {formatCurrency(internationalAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Trans>Sent around the world</Trans>
                </div>
              </div>
            </div>
          )}

          {/* Form controls */}
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-display font-bold mb-4">
              <Trans>Customize</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="globe-income"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  {t`Annual Income (CAD)`}
                </label>
                <input
                  type="text"
                  id="globe-income"
                  value={income ? income.toLocaleString() : ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/,/g, "");
                    const n = Number(v);
                    if (!isNaN(n) || v === "") setIncome(n);
                  }}
                  placeholder={t`100,000`}
                  className="w-full bg-input/50 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="globe-province"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  {t`Province/Territory`}
                </label>
                <select
                  id="globe-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input/50 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {PROVINCES_SORTED.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="globe-year"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  {t`Tax Year`}
                </label>
                <select
                  id="globe-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value as SupportedYear)}
                  className="w-full px-3 py-2 border border-border bg-input/50 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {supportedYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-card p-6 rounded-lg border">
            <h2 className="text-lg font-display font-bold mb-3">
              <Trans>How to Read This Globe</Trans>
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <Trans>
                  This globe visualizes the flow of your federal tax dollars.
                  The <strong className="text-[#c0392b]">thick red arc</strong>{" "}
                  shows your total federal tax flowing from your province to
                  Ottawa.
                </Trans>
              </p>
              <p>
                <Trans>
                  From Ottawa,{" "}
                  <strong className="text-[#e07040]">orange arcs</strong>{" "}
                  represent money redistributed to provinces and territories
                  through health transfers, social transfers, and equalization
                  payments. Thicker lines mean more money.
                </Trans>
              </p>
              <p>
                <Trans>
                  The{" "}
                  <strong className="text-[#f0a030]">amber/gold arcs</strong>{" "}
                  show your share of Canada&apos;s international affairs
                  spending (3.7% of the federal budget) flowing to countries
                  receiving Canadian development assistance, humanitarian aid,
                  and peace/security support.
                </Trans>
              </p>
              <p>
                <Trans>
                  Hover over any arc to see the destination and dollar amount.
                  Drag to rotate the globe.
                </Trans>
              </p>
            </div>
          </div>

          {/* Data source */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Trans>
              Data: Federal spending from Public Accounts of Canada FY 2024.
              International aid based on GAC Statistical Report on International
              Assistance.
            </Trans>
          </p>
        </Section>
      </PageContent>
    </div>
  );
}
