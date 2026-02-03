"use client";

import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import {
  H1,
  H2,
  Intro,
  P,
  Page,
  PageContent,
  Section,
} from "@/components/Layout";
import { JurisdictionSankey } from "@/components/Sankey/JurisdictionSankey";
import { Tooltip } from "@/components/Tooltip";
import { RemunerationTable } from "./RemunerationTable";
import { FinancialPositionStats } from "./FinancialPositionStats";
import { BandNotes } from "./BandNotes";
import { BandYearSelector } from "./BandYearSelector";
import { ClaimsTable } from "./ClaimsTable";
import {
  SourceDocumentIcon,
  SourceDocumentViewer,
  FullReportLink,
} from "./SourceDocumentViewer";
import {
  statementOfOperationsToSankey,
  extractOperationsSummary,
} from "@/lib/supabase/sankey-transform";
import type { SankeyData } from "@/components/Sankey/SankeyChartD3";
import type {
  BandInfo,
  StatementOfOperations,
  StatementOfFinancialPosition,
  Remuneration,
  Notes,
} from "@/lib/supabase/types";
import type { Claim } from "@/lib/supabase/claims";

interface BandPageContentProps {
  band: BandInfo;
  year: string;
  statementOfOperations: StatementOfOperations | null;
  statementOfFinancialPosition: StatementOfFinancialPosition | null;
  remuneration: Remuneration | null;
  notes: Notes | null;
  claims: Claim[];
  lang: string;
}

const HelpIcon = () => (
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
    className="ml-2 text-gray-500 cursor-pointer"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const ExternalLinkIcon = () => (
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
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function formatFiscalYear(year: string): string {
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return year;

  // Fiscal year ends in March, so FY 2024 = April 2023 - March 2024
  const startYear = yearNum - 1;
  return `${startYear}-${String(yearNum).slice(-2)}`;
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

function buildSourceDocumentUrl(
  bcid: string,
  year: string,
  documentType: string,
): string {
  return `https://cdn.canadaspends.com/financial_statements/${bcid}/${year}/source/${documentType}.pdf`;
}

const StatBox = ({
  title,
  value,
  description,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  description: React.ReactNode;
}) => (
  <div className="flex flex-col mr-8 mb-8">
    <div className="text-sm text-gray-600 mb-1">{title}</div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-600">{description}</div>
  </div>
);

export function BandPageContent({
  band,
  year,
  statementOfOperations,
  statementOfFinancialPosition,
  remuneration,
  notes,
  claims,
  lang,
}: BandPageContentProps) {
  const fiscalYear = formatFiscalYear(year);

  // State for PDF viewer toggles
  const [showOperationsPdf, setShowOperationsPdf] = useState(false);
  const [showPositionPdf, setShowPositionPdf] = useState(false);
  const [showRemunerationPdf, setShowRemunerationPdf] = useState(false);

  // Build source URLs
  const operationsSourceUrl = statementOfOperations?.extraction_metadata
    ?.source_file
    ? `https://cdn.canadaspends.com/${statementOfOperations.extraction_metadata.source_file}`
    : null;
  const positionSourceUrl = statementOfFinancialPosition?.extraction_metadata
    ?.source_file
    ? `https://cdn.canadaspends.com/${statementOfFinancialPosition.extraction_metadata.source_file}`
    : null;
  const remunerationSourceUrl = buildSourceDocumentUrl(
    band.bcid,
    year,
    "remuneration",
  );

  // Generate sankey data if we have statement of operations
  const sankeyData: SankeyData | null = statementOfOperations
    ? statementOfOperationsToSankey(statementOfOperations)
    : null;

  // Build financial summary stats from statement of operations
  const financialStats: {
    key: string;
    title: React.ReactNode;
    value: React.ReactNode;
    description: React.ReactNode;
  }[] = [];

  if (statementOfOperations) {
    const summary = extractOperationsSummary(
      statementOfOperations,
      parseInt(year, 10),
    );

    const surplusLabel =
      summary.surplusDeficit >= 0
        ? `${formatCurrency(summary.surplusDeficit)} surplus`
        : `${formatCurrency(Math.abs(summary.surplusDeficit))} deficit`;

    financialStats.push(
      {
        key: "surplus-deficit",
        title: (
          <div className="flex items-center">
            <Trans>Surplus/Deficit</Trans>
            <Tooltip
              text={
                <Trans>
                  The difference between total revenue and total expenses. A
                  surplus indicates revenue exceeded expenses.
                </Trans>
              }
            >
              <HelpIcon />
            </Tooltip>
          </div>
        ),
        value: surplusLabel,
        description: <Trans>Balance for FY {fiscalYear}</Trans>,
      },
      {
        key: "total-revenue",
        title: (
          <div className="flex items-center">
            <Trans>Total Revenue</Trans>
            <Tooltip
              text={
                <Trans>
                  All revenue collected during the fiscal year, including
                  transfers, own-source revenue, and other funding.
                </Trans>
              }
            >
              <HelpIcon />
            </Tooltip>
          </div>
        ),
        value: formatCurrency(summary.totalRevenue),
        description: <Trans>Total revenue in FY {fiscalYear}</Trans>,
      },
      {
        key: "total-expenses",
        title: (
          <div className="flex items-center">
            <Trans>Total Expenses</Trans>
            <Tooltip
              text={
                <Trans>
                  All expenses incurred during the fiscal year including program
                  delivery, administration, and capital costs.
                </Trans>
              }
            >
              <HelpIcon />
            </Tooltip>
          </div>
        ),
        value: formatCurrency(summary.totalExpenses),
        description: <Trans>Total expenses in FY {fiscalYear}</Trans>,
      },
    );
  }

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>{band.name}</H1>
          <Intro>
            <Trans>
              Financial data for {band.name} for fiscal year {fiscalYear}.
              Information is extracted from publicly available annual reports
              published under the First Nations Financial Transparency Act.
            </Trans>
          </Intro>
        </Section>

        {/* Statement of Operations - Sankey Chart */}
        {sankeyData && sankeyData.total > 0 && (
          <>
            <Section>
              <H2>
                <span className="inline-flex items-center">
                  <Trans>Revenue and Expenses FY {fiscalYear}</Trans>
                  <SourceDocumentIcon
                    sourceUrl={operationsSourceUrl}
                    documentType="Statement of Operations"
                    isOpen={showOperationsPdf}
                    onToggle={() => setShowOperationsPdf(!showOperationsPdf)}
                  />
                </span>
              </H2>
              <P>
                <Trans>
                  Visual breakdown of {band.name}&apos;s revenue sources and how
                  funds were spent during fiscal year {fiscalYear}.
                </Trans>
              </P>
              <SourceDocumentViewer
                sourceUrl={operationsSourceUrl}
                documentType="Statement of Operations"
                isOpen={showOperationsPdf}
              />
            </Section>
            <div className="sankey-chart-container relative overflow-hidden sm:(mr-0 ml-0) md:(min-h-[776px] min-w-[1280px] w-screen -ml-[50vw] -mr-[50vw] left-1/2 right-1/2)">
              <JurisdictionSankey data={sankeyData} amountScalingFactor={1} />
            </div>
          </>
        )}

        {/* Financial Summary Stats */}
        {financialStats.length > 0 && (
          <Section>
            <H2>
              <Trans>Financial Summary FY {fiscalYear}</Trans>
            </H2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financialStats.map((stat) => (
                <StatBox
                  key={stat.key}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Statement of Financial Position */}
        {statementOfFinancialPosition && (
          <Section>
            <H2>
              <span className="inline-flex items-center">
                <Trans>Statement of Financial Position</Trans>
                <SourceDocumentIcon
                  sourceUrl={positionSourceUrl}
                  documentType="Statement of Financial Position"
                  isOpen={showPositionPdf}
                  onToggle={() => setShowPositionPdf(!showPositionPdf)}
                />
              </span>
            </H2>
            <P>
              <Trans>
                Assets, liabilities, and net financial position as of the end of
                fiscal year {fiscalYear}.
              </Trans>
            </P>
            <SourceDocumentViewer
              sourceUrl={positionSourceUrl}
              documentType="Statement of Financial Position"
              isOpen={showPositionPdf}
            />
            <FinancialPositionStats
              data={statementOfFinancialPosition}
              fiscalYear={fiscalYear}
            />
          </Section>
        )}

        {/* Land Claims */}
        {claims && claims.length > 0 && (
          <Section>
            <H2>
              <span className="inline-flex items-center gap-2">
                <Trans>Land Claims</Trans>
                <a
                  href="https://services.aadnc-aandc.gc.ca/SCBRI_E/Main/ReportingCentre/External/externalreporting.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                  title="View data source"
                >
                  <ExternalLinkIcon />
                </a>
              </span>
            </H2>
            <P>
              <Trans>
                Historical and ongoing land claims involving {band.name}.
              </Trans>
            </P>
            <ClaimsTable claims={claims} />
          </Section>
        )}

        {/* Remuneration */}
        {remuneration &&
          remuneration.entries &&
          remuneration.entries.length > 0 && (
            <Section className="scroll-mt-4" id="remuneration">
              <H2>
                <span className="inline-flex items-center">
                  <Trans>Remuneration and Expenses</Trans>
                  <SourceDocumentIcon
                    sourceUrl={remunerationSourceUrl}
                    documentType="Remuneration Schedule"
                    isOpen={showRemunerationPdf}
                    onToggle={() =>
                      setShowRemunerationPdf(!showRemunerationPdf)
                    }
                  />
                </span>
              </H2>
              <P>
                <Trans>
                  Salaries, honoraria, travel, and other expenses paid to
                  elected officials and senior employees during fiscal year{" "}
                  {fiscalYear}.
                </Trans>
              </P>
              <SourceDocumentViewer
                sourceUrl={remunerationSourceUrl}
                documentType="Remuneration Schedule"
                isOpen={showRemunerationPdf}
              />
              <RemunerationTable data={remuneration} />
            </Section>
          )}

        {/* Notes */}
        {notes && notes.notes && notes.notes.length > 0 && (
          <Section>
            <H2>
              <Trans>Notes to Financial Statements</Trans>
            </H2>
            <BandNotes data={notes} />
          </Section>
        )}

        {/* Year Selector */}
        <Section>
          <BandYearSelector
            bcid={band.bcid}
            currentYear={year}
            availableYears={band.availableYears}
            lang={lang}
          />
        </Section>

        {/* Sources */}
        <Section>
          <H2>
            <Trans>Sources</Trans>
          </H2>
          <P>
            <Trans>
              Financial data is sourced from annual reports published under the
              First Nations Financial Transparency Act (FNFTA). Data is
              extracted using automated processes and may contain errors. If you
              notice any issues, please contact us.
            </Trans>
          </P>
          <div className="mt-4">
            <FullReportLink
              sourceUrl={buildSourceDocumentUrl(
                band.bcid,
                year,
                "financial_statement",
              )}
            />
          </div>
        </Section>
      </PageContent>
    </Page>
  );
}
