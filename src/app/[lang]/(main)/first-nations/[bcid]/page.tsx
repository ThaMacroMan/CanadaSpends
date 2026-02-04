import { redirect, notFound } from "next/navigation";
import { Trans } from "@lingui/react/macro";
import { initLingui } from "@/initLingui";
import { getFirstNationById, getAllFirstNations } from "@/lib/supabase";
import { locales } from "@/lib/constants";
import {
  H1,
  Intro,
  Page,
  PageContent,
  Section,
  InternalLink,
} from "@/components/Layout";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const firstNations = await getAllFirstNations();

  return locales.flatMap((lang) =>
    firstNations.map((firstNation) => ({
      lang,
      bcid: firstNation.bcid,
    })),
  );
}

export default async function FirstNationOverviewPage({
  params,
}: {
  params: Promise<{ lang: string; bcid: string }>;
}) {
  const { lang, bcid } = await params;

  const firstNation = await getFirstNationById(bcid);

  if (!firstNation) {
    notFound();
  }

  const latestYear = firstNation.availableYears[0];

  // If First Nation has data, redirect to latest year
  if (latestYear) {
    redirect(`/${lang}/first-nations/${bcid}/${latestYear}`);
  }

  // Otherwise show a "no data" page
  initLingui(lang);

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>{firstNation.name}</H1>
          <Intro>
            <Trans>
              {firstNation.name} is a First Nation
              {firstNation.province ? ` in ${firstNation.province}` : ""}.
            </Trans>
          </Intro>
        </Section>
        <Section>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              <Trans>
                No financial data is currently available for {firstNation.name}.
              </Trans>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              <Trans>
                Financial data from annual reports published under the First
                Nations Financial Transparency Act will appear here once
                available.
              </Trans>
            </p>
            <InternalLink
              href="/first-nations"
              lang={lang}
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Trans>Browse all First Nations</Trans>
            </InternalLink>
          </div>
        </Section>
      </PageContent>
    </Page>
  );
}
