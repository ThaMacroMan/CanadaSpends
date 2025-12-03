import { MetadataRoute } from "next";
import { BASE_URL, locales } from "@/lib/constants";
import path from "path";
import fs from "fs";

interface StaticData {
  fileStats: Record<string, string | null>;
  structure: {
    provincial: Record<string, { years: string[] }>;
    municipal: Record<string, Record<string, { years: string[] }>>;
    articles: Record<string, string[]>;
  };
}

// Load static data once at module level
const staticData = ((): StaticData | null => {
  const dataPath = path.join(process.cwd(), "data", "static-data.json");
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, "utf8")) as StaticData;
    }
  } catch (error) {
    console.warn("Failed to load static data:", error);
  }
  return null;
})();

const getFileLastModified = (filePath: string): Date | undefined => {
  // Convert absolute path to relative path for lookup
  const relativePath = path.relative(process.cwd(), filePath);
  const isoString = staticData?.fileStats[relativePath];
  return isoString ? new Date(isoString) : undefined;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  const addUrl = (
    url: string,
    changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] = "yearly",
    dataFilePath?: string,
  ) => {
    urls.push({
      url: `${BASE_URL}${url}`,
      lastModified: dataFilePath
        ? getFileLastModified(dataFilePath)
        : new Date(),
      changeFrequency: changeFreq,
    });
  };

  // Home and federal pages
  for (const lang of locales) {
    addUrl(`/${lang}`, "daily");
    addUrl(`/${lang}/federal/spending`);
    addUrl(`/${lang}/federal/budget`);
    addUrl(`/${lang}/tax-visualizer`);
    addUrl(`/${lang}/search`);
    addUrl(`/${lang}/about`);
    addUrl(`/${lang}/contact`);
    addUrl(`/${lang}/articles`);

    // Articles
    for (const slug of staticData?.structure.articles[lang] || []) {
      const articlePath = path.join(
        process.cwd(),
        "articles",
        lang,
        slug,
        "metadata.json",
      );
      addUrl(`/${lang}/articles/${slug}`, "yearly", articlePath);
    }
  }

  // Provincial and municipal pages (non-year only)
  if (staticData) {
    const dataDir = path.join(process.cwd(), "data");

    for (const lang of locales) {
      // Provincial
      for (const [province, { years }] of Object.entries(
        staticData.structure.provincial,
      )) {
        const latestYear = years[0];
        const filePath = latestYear
          ? path.join(
              dataDir,
              "provincial",
              province,
              latestYear,
              "summary.json",
            )
          : undefined;
        addUrl(`/${lang}/provincial/${province}`, "yearly", filePath);
      }

      // Municipal
      for (const [province, municipalities] of Object.entries(
        staticData.structure.municipal,
      )) {
        for (const [municipality, { years }] of Object.entries(
          municipalities,
        )) {
          const latestYear = years[0];
          const filePath = latestYear
            ? path.join(
                dataDir,
                "municipal",
                province,
                municipality,
                latestYear,
                "summary.json",
              )
            : undefined;
          addUrl(
            `/${lang}/municipal/${province}/${municipality}`,
            "yearly",
            filePath,
          );
        }
      }
    }
  }

  return urls;
}
