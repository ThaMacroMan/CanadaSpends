import { describe, it, expect } from "vitest";
import {
  statementOfOperationsToSankey,
  extractOperationsSummary,
} from "./sankey-transform";
import type { StatementOfOperations } from "./types";

// Sample data based on ISC_265/2025
const sampleStatementOfOperations: StatementOfOperations = {
  entity: "Buffalo Point First Nation",
  currency: "CAD",
  period_ending: "2025-03-31",
  statement_type: "statement_of_operations",
  fiscal_periods: [
    { year: 2025, is_budget: true, column_header: "2025 Budget" },
    { year: 2025, is_budget: false, column_header: "2025" },
    { year: 2024, is_budget: false, column_header: "2024" },
  ],
  line_items: [
    // Revenue items
    {
      name: "Indigenous Services Canada (ISC)",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 3623011, actual_2024: 3347601 },
    },
    {
      name: "Marina revenue",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 1370347, actual_2024: 1277683 },
    },
    {
      name: "Other revenue",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 668885, actual_2024: 506818 },
    },
    // Negative revenue item (should reduce total)
    {
      name: "Prior year revenue recovered by funding agencies",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: -68095, actual_2024: -68095 },
    },
    // Deferred revenue items (accounting adjustments - should be excluded)
    {
      name: "Deferred revenue - prior year",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 12548175, actual_2024: 13524979 },
    },
    {
      name: "Deferred revenue - current year",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: -13232911, actual_2024: -12548175 },
    },
    // Total Revenue
    {
      name: "Total Revenue",
      major_category: "revenue",
      is_total: true,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 4909412, actual_2024: 5063407 },
    },
    // Expense items
    {
      name: "Administration",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 1288442, actual_2024: 1156454 },
    },
    {
      name: "Wellness",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 1873747, actual_2024: 1766763 },
    },
    {
      name: "Development Corporation",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 3721224, actual_2024: 3778799 },
    },
    // Negative expense item
    {
      name: "Write down of tangible capital assets",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: null, actual_2024: -77228 },
    },
    // Total Expenses
    {
      name: "Total Segment expenses",
      major_category: "expenditures",
      is_total: true,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 6883413, actual_2024: 6624788 },
    },
    // Summary items (should not appear in sankey)
    {
      name: "Operating surplus",
      major_category: "summary",
      is_total: true,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 2493668, actual_2024: 3256100 },
    },
  ],
};

describe("statementOfOperationsToSankey", () => {
  it("should use stated totals from financial statements", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    // Totals should match the is_total line items
    expect(result.revenue).toBe(4909412);
    expect(result.spending).toBe(6883413);
  });

  it("should exclude deferred revenue items from children", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    const revenueChildNames =
      result.revenue_data.children?.map((c) => c.name) || [];

    expect(revenueChildNames).not.toContain("Deferred revenue - prior year");
    expect(revenueChildNames).not.toContain("Deferred revenue - current year");
  });

  it("should only show positive revenue items in revenue children", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    const revenueChildren = result.revenue_data.children || [];

    // All amounts should be positive
    for (const child of revenueChildren) {
      expect(child.amount).toBeGreaterThan(0);
    }

    // Should not include negative revenue items
    const childNames = revenueChildren.map((c) => c.name);
    expect(childNames).not.toContain(
      "Prior year revenue recovered by funding agencies",
    );
  });

  it("should only show positive expense items in spending children", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    const spendingChildren = result.spending_data.children || [];

    // All amounts should be positive
    for (const child of spendingChildren) {
      expect(child.amount).toBeGreaterThan(0);
    }

    // Should not include negative expense items
    const childNames = spendingChildren.map((c) => c.name);
    expect(childNames).not.toContain("Write down of tangible capital assets");
  });

  it("should include expected revenue items", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    const revenueChildNames =
      result.revenue_data.children?.map((c) => c.name) || [];

    expect(revenueChildNames).toContain("Indigenous Services Canada (ISC)");
    expect(revenueChildNames).toContain("Marina revenue");
    expect(revenueChildNames).toContain("Other revenue");
  });

  it("should include expected expense items", () => {
    const result = statementOfOperationsToSankey(sampleStatementOfOperations);

    const spendingChildNames =
      result.spending_data.children?.map((c) => c.name) || [];

    expect(spendingChildNames).toContain("Administration");
    expect(spendingChildNames).toContain("Wellness");
    expect(spendingChildNames).toContain("Development Corporation");
  });
});

// Sample data with parent_category hierarchy
const sampleWithHierarchy: StatementOfOperations = {
  entity: "Test First Nation",
  currency: "CAD",
  period_ending: "2025-03-31",
  statement_type: "statement_of_operations",
  fiscal_periods: [{ year: 2025, is_budget: false, column_header: "2025" }],
  line_items: [
    // Revenue items with parent_category
    {
      name: "ISC Core Funding",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: "Government Transfers",
      values: { actual_2025: 1000000 },
    },
    {
      name: "Health Canada",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: "Government Transfers",
      values: { actual_2025: 500000 },
    },
    {
      name: "Casino Revenue",
      major_category: "revenue",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: null,
      values: { actual_2025: 200000 },
    },
    // Total Revenue
    {
      name: "Total Revenue",
      major_category: "revenue",
      is_total: true,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 1700000 },
    },
    // Expense items with parent_category
    {
      name: "Teacher Salaries",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: "Education",
      values: { actual_2025: 400000 },
    },
    {
      name: "School Supplies",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: "Education",
      values: { actual_2025: 50000 },
    },
    {
      name: "Nursing Services",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: "Health Services",
      values: { actual_2025: 300000 },
    },
    {
      name: "Administration",
      major_category: "expenditures",
      is_total: false,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      parent_category: null,
      values: { actual_2025: 250000 },
    },
    // Total Expenses
    {
      name: "Total Expenses",
      major_category: "expenditures",
      is_total: true,
      is_subtotal: false,
      is_calculated: false,
      section: null,
      values: { actual_2025: 1000000 },
    },
  ],
};

describe("statementOfOperationsToSankey with hierarchical data", () => {
  it("should group items by parent_category", () => {
    const result = statementOfOperationsToSankey(sampleWithHierarchy);

    // Check revenue hierarchy
    const revenueChildren = result.revenue_data.children || [];
    const govTransfersNode = revenueChildren.find(
      (c) => c.displayName === "Government Transfers",
    );
    const casinoNode = revenueChildren.find(
      (c) => c.displayName === "Casino Revenue",
    );

    // Should have a "Government Transfers" parent node with children
    expect(govTransfersNode).toBeDefined();
    expect(govTransfersNode?.children).toBeDefined();
    expect(govTransfersNode?.children?.length).toBe(2);

    // Casino Revenue should be at top level (no parent_category)
    expect(casinoNode).toBeDefined();
    expect(casinoNode?.children).toBeUndefined();
  });

  it("should group expense items by parent_category", () => {
    const result = statementOfOperationsToSankey(sampleWithHierarchy);

    // Check spending hierarchy
    const spendingChildren = result.spending_data.children || [];
    const educationNode = spendingChildren.find(
      (c) => c.displayName === "Education",
    );
    const healthNode = spendingChildren.find(
      (c) => c.displayName === "Health Services",
    );
    const adminNode = spendingChildren.find(
      (c) => c.displayName === "Administration",
    );

    // Should have "Education" parent node with children
    expect(educationNode).toBeDefined();
    expect(educationNode?.children?.length).toBe(2);
    expect(educationNode?.children?.map((c) => c.name)).toContain(
      "Teacher Salaries",
    );
    expect(educationNode?.children?.map((c) => c.name)).toContain(
      "School Supplies",
    );

    // Should have "Health Services" parent node with one child
    expect(healthNode).toBeDefined();
    expect(healthNode?.children?.length).toBe(1);

    // Administration should be at top level (no parent_category)
    expect(adminNode).toBeDefined();
    expect(adminNode?.children).toBeUndefined();
  });

  it("should correctly sum hierarchy for totals", () => {
    const result = statementOfOperationsToSankey(sampleWithHierarchy);

    // Total should still match stated totals
    expect(result.revenue).toBe(1700000);
    expect(result.spending).toBe(1000000);
  });
});

describe("extractOperationsSummary", () => {
  it("should extract correct totals", () => {
    const summary = extractOperationsSummary(sampleStatementOfOperations, 2025);

    expect(summary.totalRevenue).toBe(4909412);
    expect(summary.totalExpenses).toBe(6883413);
  });

  it("should calculate surplus/deficit correctly", () => {
    const summary = extractOperationsSummary(sampleStatementOfOperations, 2025);

    // Revenue - Expenses = 4909412 - 6883413 = -1974001
    expect(summary.surplusDeficit).toBe(4909412 - 6883413);
  });
});
