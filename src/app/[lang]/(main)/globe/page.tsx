"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLingui, Trans } from "@lingui/react/macro";
import dynamic from "next/dynamic";

import { H1, PageContent, Section } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import {
  calculateDetailedTax,
  getSupportedYears,
  SupportedYear,
} from "@/lib/tax";
import { PROVINCE_FLOWS, computePersonalFlows } from "@/lib/globeFlowData";
import type { GlobeFlowData } from "@/components/Globe/TaxFlowGlobe";
import { localizedPath } from "@/lib/utils";

// ─── Dynamic import: TaxFlowGlobe (no SSR — Three.js needs browser) ─────────

const TaxFlowGlobe = dynamic(
  () =>
    import("@/components/Globe/TaxFlowGlobe").then((mod) => mod.TaxFlowGlobe),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center w-full rounded-lg"
        style={{ height: "min(75vh, 700px)", background: "#0f0e0d" }}
      >
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-t-transparent border-[#d85b5b] rounded-full animate-spin mb-3" />
          <p className="text-sm" style={{ color: "#A8A19B" }}>
            Loading globe…
          </p>
        </div>
      </div>
    ),
  },
);

// ─── Province display names ──────────────────────────────────────────────────

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

// Province shortcodes (ISO 3166-2:CA)
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

// ─── Format helpers ──────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function GlobePage() {
  const { t, i18n } = useLingui();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL params
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

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("province", PROVINCE_TO_CODE[province] || "ON");
    params.set("income", income.toString());
    params.set("year", year);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [income, province, year, router]);

  // Tax calculation
  const detailedTax = useMemo(() => {
    if (income <= 0) return null;
    return calculateDetailedTax(income, province, year);
  }, [income, province, year]);

  // Globe flow data
  const globeData = useMemo((): GlobeFlowData | null => {
    if (!detailedTax) return null;

    const personalFlows = computePersonalFlows(detailedTax.federalTax);

    // Find user's province coordinates
    const userProv = PROVINCE_FLOWS.find((p) => p.slug === province);

    return {
      federalTax: detailedTax.federalTax,
      provincialFlows: personalFlows.provincialFlows,
      internationalFlows: personalFlows.internationalFlows,
      userProvince: province,
      userProvinceLat: userProv?.lat,
      userProvinceLon: userProv?.lon,
    };
  }, [detailedTax, province]);

  // Summary stats
  const stats = useMemo(() => {
    if (!detailedTax || !globeData) return null;

    const totalToProvinces = globeData.provincialFlows.reduce(
      (s, f) => s + f.amount,
      0,
    );
    const totalInternational = globeData.internationalFlows.reduce(
      (s, f) => s + f.amount,
      0,
    );

    return {
      totalTax: detailedTax.totalTax,
      federalTax: detailedTax.federalTax,
      provincialTax: detailedTax.provincialTax,
      totalToProvinces,
      totalInternational,
      effectiveRate: detailedTax.effectiveTaxRate,
    };
  }, [detailedTax, globeData]);

  const supportedYears = getSupportedYears();

  return (
    <div>
      <PageContent>
        <Section>
          <div className="text-center mb-6">
            <H1>{t`Where Your Tax Dollars Flow`}</H1>
            <p className="text-lg text-foreground/60 mt-3 max-w-3xl mx-auto">
              {t`Watch your tax dollars travel from your province to Ottawa, then get redistributed across Canada and sent around the world.`}
            </p>
          </div>

          {/* Controls */}
          <div className="bg-card p-4 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="globe-income"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  {t`Annual Income`}
                </label>
                <input
                  type="text"
                  id="globe-income"
                  value={income ? income.toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "");
                    const numericValue = Number(value);
                    if (!isNaN(numericValue) || value === "") {
                      setIncome(numericValue);
                    }
                  }}
                  placeholder="100,000"
                  className="w-full bg-input/50 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="globe-province"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  {t`Province / Territory`}
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
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
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
        </Section>
      </PageContent>

      {/* Globe — full-width dark section */}
      <div className="relative">
        {globeData ? (
          <TaxFlowGlobe data={globeData} />
        ) : (
          <div
            className="flex items-center justify-center w-full"
            style={{ height: "min(75vh, 700px)", background: "#0f0e0d" }}
          >
            <p style={{ color: "#A8A19B" }}>
              {t`Enter your income to see the money flow`}
            </p>
          </div>
        )}

        {/* Legend overlay */}
        <div
          className="absolute bottom-4 left-4 rounded-lg px-4 py-3 text-xs"
          style={{
            backgroundColor: "rgba(15, 14, 13, 0.85)",
            color: "#A8A19B",
            border: "1px solid rgba(74, 69, 64, 0.4)",
          }}
        >
          <div className="font-semibold mb-2" style={{ color: "#f6ebe3" }}>
            <Trans>Flow Legend</Trans>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-6 h-1 rounded"
              style={{ backgroundColor: "#e68383", height: "4px" }}
            />
            <span>
              <Trans>Your tax → Ottawa</Trans>
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-6 h-1 rounded"
              style={{ backgroundColor: "#d85b5b", height: "3px" }}
            />
            <span>
              <Trans>Ottawa → Provinces</Trans>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-1 rounded"
              style={{ backgroundColor: "#3daed3", height: "2px" }}
            />
            <span>
              <Trans>Ottawa → International</Trans>
            </span>
          </div>
          <div className="mt-2 text-[10px]" style={{ color: "#6b6560" }}>
            <Trans>Line thickness = dollar amount</Trans>
          </div>
        </div>
      </div>

      <PageContent>
        {/* Stats cards */}
        {stats && (
          <Section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title={t`Total Tax`}
                value={formatAmount(stats.totalTax)}
                subtitle={t`${stats.effectiveRate.toFixed(1)}% effective rate`}
              />
              <StatCard
                title={t`Federal Tax`}
                value={formatAmount(stats.federalTax)}
                subtitle={t`Flows into Ottawa`}
              />
              <StatCard
                title={t`Your Share to Provinces`}
                value={formatAmount(stats.totalToProvinces)}
                subtitle={t`Redistributed across Canada`}
              />
              <StatCard
                title={t`Your Share Abroad`}
                value={formatAmount(stats.totalInternational)}
                subtitle={t`Sent around the world`}
              />
            </div>
          </Section>
        )}

        {/* Explanation */}
        <Section>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="font-semibold text-lg mb-3">
              <Trans>How to Read This Globe</Trans>
            </h2>
            <div className="space-y-3 text-sm text-foreground/60">
              <p>
                <Trans>
                  The thick line flowing from your province to Ottawa represents
                  your federal tax contribution. From Ottawa, medium lines flow
                  out to every province and territory — these are the federal
                  transfers (health, social, and equalization payments) that
                  redistribute your tax dollars across Canada.
                </Trans>
              </p>
              <p>
                <Trans>
                  The thinner blue lines flowing from Ottawa around the world
                  represent Canada&apos;s international spending — development
                  aid, diplomacy, and multilateral contributions through Global
                  Affairs Canada. Line thickness is proportional to the dollar
                  amount, so you can viscerally see how much of your money goes
                  where.
                </Trans>
              </p>
              <p>
                <Trans>
                  Hover over any arc to see exact amounts. Drag to rotate the
                  globe and scroll to zoom.
                </Trans>
              </p>
              <p className="text-xs" style={{ color: "#6b6560" }}>
                <Trans>
                  Provincial transfer data from Public Accounts of Canada FY
                  2024. International flows based on Global Affairs Canada ODA
                  reports. Amounts shown are your personal share based on the
                  ratio of your federal tax to total federal spending.
                </Trans>
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <div className="text-center">
            <a
              href={localizedPath("/tax-visualizer", i18n.locale)}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Trans>← Back to detailed tax breakdown</Trans>
            </a>
          </div>
        </Section>
      </PageContent>
    </div>
  );
}
