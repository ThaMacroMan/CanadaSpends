import { generateHreflangAlternates } from "@/lib/utils";
import { initLingui, PageLangParam } from "@/initLingui";
import { useLingui } from "@lingui/react/macro";
import { PropsWithChildren } from "react";

export async function generateMetadata(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useLingui();

  return {
    title: t`Tax Money Flow Globe | Canada Spends`,
    description: t`Visualize how your Canadian tax dollars flow from Ottawa across provinces and around the world on an interactive 3D globe.`,
    alternates: generateHreflangAlternates(lang),
  };
}

export default function GlobeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
