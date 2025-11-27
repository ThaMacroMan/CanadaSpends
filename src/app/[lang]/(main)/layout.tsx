import { MainLayout } from "@/components/MainLayout";
import { initLingui, PageLangParam } from "@/initLingui";
import {
  getMunicipalitiesByProvince,
  getProvincialSlugs,
} from "@/lib/jurisdictions";
import { PropsWithChildren } from "react";

export default async function RootLayout(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);
  const provinces = getProvincialSlugs();
  const municipalitiesByProvince = getMunicipalitiesByProvince();
  return (
    <MainLayout
      provinces={provinces}
      municipalitiesByProvince={municipalitiesByProvince}
    >
      {props.children}
    </MainLayout>
  );
}
