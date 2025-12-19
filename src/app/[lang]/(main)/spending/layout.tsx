import { initLingui } from "@/initLingui";

import { PageLangParam } from "@/initLingui";
import { generateHreflangAlternates } from "@/lib/utils";
import { useLingui } from "@lingui/react/macro";
import { PropsWithChildren } from "react";

export async function generateMetadata(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  const { t } = useLingui();
  return {
    title: t`Government Workforce & Spending Data | See the Breakdown`,
    description: t`See how Canada's government spends tax dollars—track workforce data, spending trends, and federal debt with clear, non-partisan insights.`,
    alternates: generateHreflangAlternates(lang),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="min-h-full items-center flex-col justify-between overflow-clip bg-background text-foreground">
        <div className="w-full max-w-480 m-auto">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
