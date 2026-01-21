import { describe, expect, it } from "vitest";

import { config2024, config2025 } from "./index";

// Expected federal spending categories (from original implementation)
const EXPECTED_FEDERAL_CATEGORIES = [
  "Retirement Benefits",
  "Children, Community and Social Services",
  "Employment Insurance",
  "Transfer to Ontario",
  "Transfer to Alberta",
  "Transfers to Other Provinces",
  "Interest on Debt",
  "Indigenous Priorities",
  "Defence",
  "Public Safety",
  "International Affairs",
  "Standard of Living, including training, carbon tax rebate, and other supports",
  "Health",
  "Innovation and Research",
  "Infrastructure",
  "Transportation",
  "Natural Resources",
  "Fisheries and Agriculture",
  "Environment",
  "Other",
];

// Expected Ontario spending categories (from original implementation)
const EXPECTED_ONTARIO_CATEGORIES = [
  "Health",
  "K-12 Education",
  "Children, Community and Social Services",
  "Interest on Debt",
  "Colleges and Universities",
  "Transportation",
  "Energy",
  "Attorney and Solicitor General",
  "Infrastructure",
  "Long-Term Care",
  "Finance",
  "Tourism, Culture, and Sport",
  "Municipal Affairs and Housing",
  "Labour and Skills Development",
  "Treasury Board Secretariat",
  "Economic Development and Trade",
  "Natural Resources",
  "Fisheries and Agriculture",
  "Other",
];

// Expected Alberta spending categories (from original implementation)
const EXPECTED_ALBERTA_CATEGORIES = [
  "Health",
  "K-12 Education",
  "Colleges and Universities",
  "Children, Community and Social Services",
  "Interest on Debt",
  "Fisheries and Agriculture",
  "Transportation",
  "Public Safety",
  "Economic Development and Trade",
  "Energy",
  "Municipal Affairs and Housing",
  "Innovation and Research",
  "Attorney and Solicitor General",
  "Infrastructure",
  "Forestry and Parks",
  "Environment",
  "Indigenous Priorities",
  "Tourism, Culture, and Sport",
  "Other",
];

describe("2024 Spending Categories", () => {
  describe("Federal", () => {
    it("should have all expected federal spending categories", () => {
      const categoryNames = config2024.FEDERAL_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_FEDERAL_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should not have unexpected federal spending categories", () => {
      const categoryNames = config2024.FEDERAL_SPENDING.map((c) => c.name);
      for (const name of categoryNames) {
        expect(EXPECTED_FEDERAL_CATEGORIES).toContain(name);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2024.FEDERAL_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });

    it("should have all positive percentages", () => {
      for (const category of config2024.FEDERAL_SPENDING) {
        expect(category.percentage).toBeGreaterThan(0);
      }
    });
  });

  describe("Ontario", () => {
    it("should have all expected Ontario spending categories", () => {
      const categoryNames = config2024.ONTARIO_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_ONTARIO_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should not have unexpected Ontario spending categories", () => {
      const categoryNames = config2024.ONTARIO_SPENDING.map((c) => c.name);
      for (const name of categoryNames) {
        expect(EXPECTED_ONTARIO_CATEGORIES).toContain(name);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2024.ONTARIO_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });

    it("should have all positive percentages", () => {
      for (const category of config2024.ONTARIO_SPENDING) {
        expect(category.percentage).toBeGreaterThan(0);
      }
    });

    it("should have correct federal transfer name", () => {
      expect(config2024.ONTARIO_FEDERAL_TRANSFER_NAME).toBe(
        "Transfer to Ontario",
      );
    });
  });

  describe("Alberta", () => {
    it("should have all expected Alberta spending categories", () => {
      const categoryNames = config2024.ALBERTA_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_ALBERTA_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should not have unexpected Alberta spending categories", () => {
      const categoryNames = config2024.ALBERTA_SPENDING.map((c) => c.name);
      for (const name of categoryNames) {
        expect(EXPECTED_ALBERTA_CATEGORIES).toContain(name);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2024.ALBERTA_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });

    it("should have all positive percentages", () => {
      for (const category of config2024.ALBERTA_SPENDING) {
        expect(category.percentage).toBeGreaterThan(0);
      }
    });

    it("should have correct federal transfer name", () => {
      expect(config2024.ALBERTA_FEDERAL_TRANSFER_NAME).toBe(
        "Transfer to Alberta",
      );
    });
  });
});

describe("2025 Spending Categories", () => {
  describe("Federal", () => {
    it("should have all expected federal spending categories", () => {
      const categoryNames = config2025.FEDERAL_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_FEDERAL_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should not have unexpected federal spending categories", () => {
      const categoryNames = config2025.FEDERAL_SPENDING.map((c) => c.name);
      for (const name of categoryNames) {
        expect(EXPECTED_FEDERAL_CATEGORIES).toContain(name);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2025.FEDERAL_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });
  });

  describe("Ontario", () => {
    it("should have all expected Ontario spending categories", () => {
      const categoryNames = config2025.ONTARIO_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_ONTARIO_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2025.ONTARIO_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });
  });

  describe("Alberta", () => {
    it("should have all expected Alberta spending categories", () => {
      const categoryNames = config2025.ALBERTA_SPENDING.map((c) => c.name);
      for (const expected of EXPECTED_ALBERTA_CATEGORIES) {
        expect(categoryNames).toContain(expected);
      }
    });

    it("should have percentages that sum to approximately 100%", () => {
      const total = config2025.ALBERTA_SPENDING.reduce(
        (sum, c) => sum + c.percentage,
        0,
      );
      expect(total).toBeCloseTo(100, 0);
    });
  });
});

describe("Config Consistency", () => {
  it("2024 and 2025 federal configs should have same category names", () => {
    const names2024 = config2024.FEDERAL_SPENDING.map((c) => c.name).sort();
    const names2025 = config2025.FEDERAL_SPENDING.map((c) => c.name).sort();
    expect(names2024).toEqual(names2025);
  });

  it("2024 and 2025 Ontario configs should have same category names", () => {
    const names2024 = config2024.ONTARIO_SPENDING.map((c) => c.name).sort();
    const names2025 = config2025.ONTARIO_SPENDING.map((c) => c.name).sort();
    expect(names2024).toEqual(names2025);
  });

  it("2024 and 2025 Alberta configs should have same category names", () => {
    const names2024 = config2024.ALBERTA_SPENDING.map((c) => c.name).sort();
    const names2025 = config2025.ALBERTA_SPENDING.map((c) => c.name).sort();
    expect(names2024).toEqual(names2025);
  });
});
