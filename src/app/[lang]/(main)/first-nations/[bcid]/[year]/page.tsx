import { notFound } from "next/navigation";
import { initLingui } from "@/initLingui";
import { BandPageContent } from "@/components/first-nations";
import {
  getAllBands,
  getBandById,
  getBandYearData,
  getClaimsByBand,
} from "@/lib/supabase";
import { locales } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const bands = await getAllBands();

  // Pre-generate pages for all bands with all their available years
  return locales.flatMap((lang) =>
    bands.flatMap((band) =>
      band.availableYears.map((year) => ({
        lang,
        bcid: band.bcid,
        year,
      })),
    ),
  );
}

export default async function BandYearPage({
  params,
}: {
  params: Promise<{ lang: string; bcid: string; year: string }>;
}) {
  const { lang, bcid, year } = await params;
  initLingui(lang);

  const band = await getBandById(bcid);

  if (!band) {
    notFound();
  }

  // Check if the requested year is valid for this band
  if (!band.availableYears.includes(year)) {
    notFound();
  }

  const [bandYearData, claims] = await Promise.all([
    getBandYearData(bcid, year),
    getClaimsByBand(bcid),
  ]);

  const {
    statementOfOperations,
    statementOfFinancialPosition,
    remuneration,
    notes,
  } = bandYearData;

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
    <BandPageContent
      band={band}
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
