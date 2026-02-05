import { Trans, useLingui } from "@lingui/react/macro";
import { initLingui } from "@/initLingui";
import { H1, Intro, Page, PageContent, Section } from "@/components/Layout";
import { RemunerationOverview } from "@/components/first-nations";
import { getBandRemunerationSummary } from "@/lib/supabase";
import { locales } from "@/lib/constants";
import { generateHreflangAlternates } from "@/lib/utils";
import { Metadata } from "next";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  initLingui(lang);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useLingui();

  return {
    title: t`Band Remuneration Overview | Canada Spends`,
    description: t`Compare remuneration data across First Nations bands. View total compensation, per-capita spending, and individual official entries from annual reports.`,
    alternates: generateHreflangAlternates(lang, "/first-nations/remuneration"),
    openGraph: {
      title: t`Band Remuneration Overview | Canada Spends`,
      description: t`Compare remuneration data across First Nations bands from annual reports published under the FNFTA.`,
      type: "website",
    },
  };
}

export default async function RemunerationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  initLingui(lang);

  const summaries = await getBandRemunerationSummary();

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Band Remuneration Overview</Trans>
          </H1>
          <Intro>
            <Trans>
              Compare remuneration data across First Nations bands. Data is
              extracted from remuneration schedules published under the First
              Nations Financial Transparency Act (FNFTA). Click any row to see
              individual official entries.
            </Trans>
          </Intro>
        </Section>
        <Section>
          <RemunerationOverview summaries={summaries} lang={lang} />
        </Section>
      </PageContent>
    </Page>
  );
}
