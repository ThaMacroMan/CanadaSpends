import { notFound } from "next/navigation";
import { initLingui } from "@/initLingui";
import { FirstNationsPageContent } from "@/components/first-nations";
import {
  getAllFirstNations,
  getClaimsByFirstNation,
  getFirstNationById,
  getFirstNationYearData,
} from "@/lib/supabase";
import { locales } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const firstNations = await getAllFirstNations();

  // Pre-generate pages for all First Nations with all their available years
  return locales.flatMap((lang) =>
    firstNations.flatMap((firstNation) =>
      firstNation.availableYears.map((year) => ({
        lang,
        bcid: firstNation.bcid,
        year,
      })),
    ),
  );
}

export default async function FirstNationYearPage({
  params,
}: {
  params: Promise<{ lang: string; bcid: string; year: string }>;
}) {
  const { lang, bcid, year } = await params;
  initLingui(lang);

  const firstNation = await getFirstNationById(bcid);

  if (!firstNation) {
    notFound();
  }

  // Check if the requested year is valid for this First Nation
  if (!firstNation.availableYears.includes(year)) {
    notFound();
  }

  const [firstNationYearData, claims] = await Promise.all([
    getFirstNationYearData(bcid, year),
    getClaimsByFirstNation(bcid),
  ]);

  const {
    statementOfOperations,
    statementOfFinancialPosition,
    remuneration,
    notes,
  } = firstNationYearData;

  // If no data at all, show not found
  if (
    !statementOfOperations &&
    !statementOfFinancialPosition &&
    !remuneration &&
    !notes
  ) {
    notFound();
  }

  return (
    <FirstNationsPageContent
      firstNation={firstNation}
      year={year}
      statementOfOperations={statementOfOperations}
      statementOfFinancialPosition={statementOfFinancialPosition}
      remuneration={remuneration}
      notes={notes}
      claims={claims}
      lang={lang}
    />
  );
}
