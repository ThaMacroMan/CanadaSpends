import { SankeyData } from "@/components/Sankey/SankeyChartD3";
import fs from "fs";
import path from "path";
import { provinceNames } from "./provinceNames";

const dataDir = path.join(process.cwd(), "data");

export type Jurisdiction = {
  slug: string;
  name: string;
  financialYear: string;
  totalEmployees: number;
  totalProvincialSpendingFormatted: string;
  totalProvincialSpending: number;
  total: number;
  source: string;
  ministries?: unknown[];
  debtInterest: number;
  netDebt: number;
  totalDebt: number;
  methodology?: string;
  credits?: string;
};

type Category = {
  name: string;
  amount: number;
};

export type Department = {
  slug: string;
  name: string;
  totalSpending: number;
  totalSpendingFormatted: string;
  percentage: number;
  percentageFormatted: string;
  categories: Category[];
  spending_data: {
    name: string;
    children: Category[];
  };
  generatedAt: string;
  // Editable content fields
  introText: string;
  descriptionText: string;
  roleText: string;
  programsHeading: string;
  programsDescription: string;
  leadershipHeading?: string;
  leadershipDescription?: string;
  prioritiesHeading?: string;
  prioritiesDescription?: string;
  agenciesHeading?: string;
  agenciesDescription?: string;
  budgetHeading?: string;
  budgetDescription?: string;
  budgetProjectionsText?: string;
};

type Data = {
  jurisdiction: Jurisdiction;
  sankey: SankeyData;
};

/**
 * Get provincial jurisdiction slugs (provinces with provincial-level data).
 */
export function getProvincialSlugs(): string[] {
  const provincialDir = path.join(dataDir, "provincial");
  if (!fs.existsSync(provincialDir)) {
    return [];
  }
  return fs.readdirSync(provincialDir).filter((f) => {
    const fullPath = path.join(provincialDir, f);
    return (
      fs.statSync(fullPath).isDirectory() &&
      fs.existsSync(path.join(fullPath, "summary.json"))
    );
  });
}

/**
 * Get municipalities grouped by province.
 * Returns array of { province: string, municipalities: Array<{ slug: string, name: string }> }
 */
export function getMunicipalitiesByProvince(): Array<{
  province: string;
  municipalities: Array<{ slug: string; name: string }>;
}> {
  const municipalDir = path.join(dataDir, "municipal");
  if (!fs.existsSync(municipalDir)) {
    return [];
  }

  const provinces = fs.readdirSync(municipalDir).filter((f) => {
    const provincePath = path.join(municipalDir, f);
    return fs.statSync(provincePath).isDirectory();
  });

  const result: Array<{
    province: string;
    municipalities: Array<{ slug: string; name: string }>;
  }> = [];

  for (const province of provinces) {
    const provincePath = path.join(municipalDir, province);
    const municipalities = fs
      .readdirSync(provincePath)
      .filter((f) => {
        const municipalityPath = path.join(provincePath, f);
        return (
          fs.statSync(municipalityPath).isDirectory() &&
          fs.existsSync(path.join(municipalityPath, "summary.json"))
        );
      })
      .map((slug) => {
        // Try to get the name from summary.json, fallback to slug
        const summaryPath = path.join(provincePath, slug, "summary.json");
        let name = slug;
        try {
          const summaryData = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
          name = summaryData.name || slug;
        } catch {
          // Fallback to slug if we can't read the file
        }
        return { slug, name };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort municipalities alphabetically

    if (municipalities.length > 0) {
      result.push({ province, municipalities });
    }
  }

  // Sort provinces alphabetically by name
  return result.sort((a, b) => {
    const nameA = provinceNames[a.province] || a.province;
    const nameB = provinceNames[b.province] || b.province;
    return nameA.localeCompare(nameB);
  });
}

/**
 * Get all jurisdiction slugs, including both provincial and municipal jurisdictions.
 * Returns slugs in format "province" for provincial or just "municipality" for municipal
 * (municipalities use simple slugs, not nested paths, to match URL structure)
 */
export function getJurisdictionSlugs(): string[] {
  const slugs: string[] = [];

  // Get provincial jurisdictions
  slugs.push(...getProvincialSlugs());

  // Get municipal jurisdictions (return just municipality name, not nested path)
  const municipalDir = path.join(dataDir, "municipal");
  if (fs.existsSync(municipalDir)) {
    const provinces = fs.readdirSync(municipalDir).filter((f) => {
      const provincePath = path.join(municipalDir, f);
      return fs.statSync(provincePath).isDirectory();
    });

    for (const province of provinces) {
      const provincePath = path.join(municipalDir, province);
      const municipalities = fs.readdirSync(provincePath).filter((f) => {
        const municipalityPath = path.join(provincePath, f);
        return (
          fs.statSync(municipalityPath).isDirectory() &&
          fs.existsSync(path.join(municipalityPath, "summary.json"))
        );
      });

      // Return just the municipality slug, not the nested path
      for (const municipality of municipalities) {
        slugs.push(municipality);
      }
    }
  }

  return slugs;
}

/**
 * Get jurisdiction data, supporting both provincial and municipal paths.
 * @param jurisdiction - Slug in format "province" (provincial), "province/municipality" (municipal), or just "municipality" (will search)
 */
export function getJurisdictionData(jurisdiction: string): Data {
  const parts = jurisdiction.split("/");
  let jurisdictionPath: string | undefined;

  if (parts.length === 1) {
    // Could be a province or a municipality - check both
    const provincialPath = path.join(dataDir, "provincial", jurisdiction);
    const provincialSummaryPath = path.join(provincialPath, "summary.json");

    if (fs.existsSync(provincialSummaryPath)) {
      // It's a provincial jurisdiction
      jurisdictionPath = provincialPath;
    } else {
      // It's likely a municipality - search for it
      const municipalDir = path.join(dataDir, "municipal");
      if (!fs.existsSync(municipalDir)) {
        throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
      }

      const provinces = fs.readdirSync(municipalDir).filter((f) => {
        const provincePath = path.join(municipalDir, f);
        return fs.statSync(provincePath).isDirectory();
      });

      for (const province of provinces) {
        const municipalityPath = path.join(
          municipalDir,
          province,
          jurisdiction,
        );
        const summaryPath = path.join(municipalityPath, "summary.json");
        if (fs.existsSync(summaryPath)) {
          jurisdictionPath = municipalityPath;
          break;
        }
      }

      if (!jurisdictionPath) {
        throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
      }
    }
  } else if (parts.length === 2) {
    // Municipal jurisdiction with explicit province
    const [province, municipality] = parts;
    jurisdictionPath = path.join(dataDir, "municipal", province, municipality);
  } else {
    throw new Error(`Invalid jurisdiction format: ${jurisdiction}`);
  }

  if (!jurisdictionPath) {
    throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
  }

  const summaryPath = path.join(jurisdictionPath, "summary.json");
  const sankeyPath = path.join(jurisdictionPath, "sankey.json");

  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
  }

  const jurisdictionData = JSON.parse(fs.readFileSync(summaryPath, "utf8"));

  return {
    jurisdiction: { slug: parts[parts.length - 1], ...jurisdictionData },
    sankey: JSON.parse(fs.readFileSync(sankeyPath, "utf8")),
  };
}

export function getDepartmentData(
  jurisdiction: string,
  department: string,
): Department {
  const parts = jurisdiction.split("/");
  let jurisdictionPath: string | undefined;

  if (parts.length === 1) {
    // Check if it's provincial first
    const provincialPath = path.join(dataDir, "provincial", jurisdiction);
    if (fs.existsSync(path.join(provincialPath, "summary.json"))) {
      jurisdictionPath = provincialPath;
    } else {
      // Find municipality
      const municipalDir = path.join(dataDir, "municipal");
      if (!fs.existsSync(municipalDir)) {
        throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
      }
      const provinces = fs.readdirSync(municipalDir).filter((f) => {
        return fs.statSync(path.join(municipalDir, f)).isDirectory();
      });

      for (const province of provinces) {
        const municipalityPath = path.join(
          municipalDir,
          province,
          jurisdiction,
        );
        if (fs.existsSync(path.join(municipalityPath, "summary.json"))) {
          jurisdictionPath = municipalityPath;
          break;
        }
      }
      if (!jurisdictionPath) {
        throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
      }
    }
  } else if (parts.length === 2) {
    const [province, municipality] = parts;
    jurisdictionPath = path.join(dataDir, "municipal", province, municipality);
  } else {
    throw new Error(`Invalid jurisdiction format: ${jurisdiction}`);
  }

  if (!jurisdictionPath) {
    throw new Error(`Jurisdiction data not found: ${jurisdiction}`);
  }

  const departmentData: Omit<Department, "slug"> = JSON.parse(
    fs.readFileSync(
      path.join(jurisdictionPath, "departments", `${department}.json`),
      "utf8",
    ),
  );

  return {
    slug: department,
    ...departmentData,
  };
}

export function getDepartmentsForJurisdiction(jurisdiction: string): string[] {
  const parts = jurisdiction.split("/");
  let jurisdictionPath: string | undefined;

  if (parts.length === 1) {
    // Check if it's provincial first
    const provincialPath = path.join(dataDir, "provincial", jurisdiction);
    if (fs.existsSync(path.join(provincialPath, "summary.json"))) {
      jurisdictionPath = provincialPath;
    } else {
      // Find municipality
      const municipalDir = path.join(dataDir, "municipal");
      if (!fs.existsSync(municipalDir)) {
        return [];
      }
      const provinces = fs.readdirSync(municipalDir).filter((f) => {
        return fs.statSync(path.join(municipalDir, f)).isDirectory();
      });

      for (const province of provinces) {
        const municipalityPath = path.join(
          municipalDir,
          province,
          jurisdiction,
        );
        if (fs.existsSync(path.join(municipalityPath, "summary.json"))) {
          jurisdictionPath = municipalityPath;
          break;
        }
      }
      if (!jurisdictionPath) {
        return [];
      }
    }
  } else if (parts.length === 2) {
    const [province, municipality] = parts;
    jurisdictionPath = path.join(dataDir, "municipal", province, municipality);
  } else {
    throw new Error(`Invalid jurisdiction format: ${jurisdiction}`);
  }

  if (!jurisdictionPath) {
    return [];
  }

  const departmentsDir = path.join(jurisdictionPath, "departments");
  if (!fs.existsSync(departmentsDir)) {
    return [];
  }
  return fs
    .readdirSync(departmentsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getExpandedDepartments(jurisdiction: string): Department[] {
  const slugs = getDepartmentsForJurisdiction(jurisdiction);
  return slugs.map((slug) => getDepartmentData(jurisdiction, slug));
}

export function departmentHref(
  jurisdiction: string,
  department: string,
): string {
  return `/${jurisdiction}/departments/${department}`;
}
