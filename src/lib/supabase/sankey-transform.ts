// Transform Statement of Operations data to SankeyData format

import type { SankeyData, SankeyNode } from "@/components/Sankey/SankeyChartD3";
import type { StatementOfOperations, StatementLineItem } from "./types";

// Local type that matches the SankeyNode shape we create
interface LocalSankeyNode {
  id: string;
  displayName: string;
  name: string;
  amount: number;
}

/**
 * Get the most recent actual value from a line item
 * Looks for actual_YYYY keys (not budget) and returns the most recent one
 */
function getActualValue(item: StatementLineItem, year: number): number {
  // Handle null/undefined values object
  if (!item.values) {
    return 0;
  }

  // Try the specific year first
  const actualKey = `actual_${year}`;
  if (item.values[actualKey] !== null && item.values[actualKey] !== undefined) {
    return item.values[actualKey] as number;
  }

  // Fallback to any actual value
  for (const [key, value] of Object.entries(item.values)) {
    if (key.startsWith("actual_") && value !== null && value !== undefined) {
      return value as number;
    }
  }

  return 0;
}

/**
 * Convert Statement of Operations data to SankeyData format
 * compatible with the JurisdictionSankey component
 */
export function statementOfOperationsToSankey(
  data: StatementOfOperations,
): SankeyData {
  // Determine the fiscal year from the data
  const fiscalYear =
    data.fiscal_periods?.find((p) => !p.is_budget)?.year || 2024;

  // Helper to check if an item is a deferred revenue entry (accounting adjustment)
  const isDeferredRevenue = (item: StatementLineItem) =>
    item.name?.toLowerCase().includes("deferred revenue");

  // Filter line items by category
  const regularRevenueItems = data.line_items.filter(
    (item) =>
      item.major_category === "revenue" &&
      !item.is_total &&
      !item.is_subtotal &&
      !isDeferredRevenue(item),
  );

  // Calculate net deferred revenue (sum of all deferred revenue items)
  const deferredRevenueItems = data.line_items.filter(
    (item) =>
      item.major_category === "revenue" &&
      !item.is_total &&
      !item.is_subtotal &&
      isDeferredRevenue(item),
  );
  const netDeferredRevenue = deferredRevenueItems.reduce(
    (sum, item) => sum + getActualValue(item, fiscalYear),
    0,
  );

  const expenseItems = data.line_items.filter(
    (item) =>
      item.major_category === "expenditures" &&
      !item.is_total &&
      !item.is_subtotal,
  );

  // Get totals from the statement (these already account for all adjustments)
  const totalRevenueItem = data.line_items.find(
    (item) => item.major_category === "revenue" && item.is_total,
  );

  const totalExpenseItem = data.line_items.find(
    (item) => item.major_category === "expenditures" && item.is_total,
  );

  // Use stated totals from financial statements
  const totalRevenue = totalRevenueItem
    ? getActualValue(totalRevenueItem, fiscalYear)
    : regularRevenueItems.reduce(
        (sum, item) => sum + getActualValue(item, fiscalYear),
        0,
      ) + netDeferredRevenue;

  const totalExpenses = totalExpenseItem
    ? getActualValue(totalExpenseItem, fiscalYear)
    : expenseItems.reduce(
        (sum, item) => sum + getActualValue(item, fiscalYear),
        0,
      );

  // Build revenue tree - only positive revenue items (unscaled first)
  const rawRevenueChildren: LocalSankeyNode[] = regularRevenueItems
    .map((item, index): LocalSankeyNode | null => {
      const amount = getActualValue(item, fiscalYear);
      if (amount <= 0) return null;

      return {
        id: `revenue_${index}_${(item.name || "").replace(/\s+/g, "_").toLowerCase()}`,
        displayName: item.name || "",
        name: item.name || "",
        amount,
      };
    })
    .filter((node): node is LocalSankeyNode => node !== null);

  // Add net deferred revenue as a single item if positive (inflow)
  // If negative, it will be accounted for via scaling
  if (netDeferredRevenue > 0) {
    rawRevenueChildren.push({
      id: "revenue_deferred_net",
      displayName: "Deferred Revenue (Net)",
      name: "Deferred Revenue (Net)",
      amount: netDeferredRevenue,
    });
  }

  // Calculate raw sum and scale factor to match stated total
  // (SankeyChart uses hierarchy().sum() which sums children, so children must sum to stated total)
  const rawRevenueSum = rawRevenueChildren.reduce(
    (sum, child) => sum + child.amount,
    0,
  );
  const revenueScaleFactor =
    rawRevenueSum > 0 && totalRevenue > 0 ? totalRevenue / rawRevenueSum : 1;

  // Scale children so their sum matches the stated total
  const revenueChildren: SankeyNode[] = rawRevenueChildren.map((child) => ({
    ...child,
    amount: child.amount * revenueScaleFactor,
  }));

  const revenueData: SankeyNode = {
    id: "revenue_root",
    displayName: "Total Revenue",
    name: "Total Revenue",
    // Root amount must be 0 because d3 hierarchy().sum() adds node.amount to children's sum
    amount: 0,
    children: revenueChildren,
  };

  // Build spending/expense tree - only positive expense items (unscaled first)
  const rawSpendingChildren: LocalSankeyNode[] = expenseItems
    .map((item, index): LocalSankeyNode | null => {
      const amount = getActualValue(item, fiscalYear);
      if (amount <= 0) return null;

      return {
        id: `spending_${index}_${(item.name || "").replace(/\s+/g, "_").toLowerCase()}`,
        displayName: item.name || "",
        name: item.name || "",
        amount,
      };
    })
    .filter((node): node is LocalSankeyNode => node !== null);

  // Add net deferred revenue as an outflow if negative (deferring more than recognizing)
  if (netDeferredRevenue < 0) {
    rawSpendingChildren.push({
      id: "spending_deferred_revenue",
      displayName: "Deferred to Future Years",
      name: "Deferred to Future Years",
      amount: Math.abs(netDeferredRevenue),
    });
  }

  // Calculate raw sum and scale factor to match stated total
  const rawSpendingSum = rawSpendingChildren.reduce(
    (sum, child) => sum + child.amount,
    0,
  );
  const spendingScaleFactor =
    rawSpendingSum > 0 && totalExpenses > 0
      ? totalExpenses / rawSpendingSum
      : 1;

  // Scale children so their sum matches the stated total
  const spendingChildren: SankeyNode[] = rawSpendingChildren.map((child) => ({
    ...child,
    amount: child.amount * spendingScaleFactor,
  }));

  const spendingData: SankeyNode = {
    id: "spending_root",
    displayName: "Total Expenses",
    name: "Total Expenses",
    // Root amount must be 0 because d3 hierarchy().sum() adds node.amount to children's sum
    amount: 0,
    children: spendingChildren,
  };

  return {
    total: Math.max(totalRevenue, totalExpenses),
    spending: totalExpenses,
    revenue: totalRevenue,
    spending_data: spendingData,
    revenue_data: revenueData,
  };
}

/**
 * Extract summary values from statement of operations
 */
export function extractOperationsSummary(
  data: StatementOfOperations,
  year?: number,
): {
  totalRevenue: number;
  totalExpenses: number;
  surplusDeficit: number;
} {
  const fiscalYear =
    year || data.fiscal_periods?.find((p) => !p.is_budget)?.year || 2024;

  const totalRevenueItem = data.line_items.find(
    (item) => item.major_category === "revenue" && item.is_total,
  );

  const totalExpenseItem = data.line_items.find(
    (item) => item.major_category === "expenditures" && item.is_total,
  );

  const netRevenueItem = data.line_items.find(
    (item) =>
      item.major_category === "summary" &&
      item.name?.toLowerCase().includes("net revenue"),
  );

  const totalRevenue = totalRevenueItem
    ? getActualValue(totalRevenueItem, fiscalYear)
    : 0;

  const totalExpenses = totalExpenseItem
    ? getActualValue(totalExpenseItem, fiscalYear)
    : 0;

  const surplusDeficit = netRevenueItem
    ? getActualValue(netRevenueItem, fiscalYear)
    : totalRevenue - totalExpenses;

  return {
    totalRevenue,
    totalExpenses,
    surplusDeficit,
  };
}

/**
 * Create empty/placeholder SankeyData when no data is available
 */
export function createEmptySankeyData(): SankeyData {
  return {
    total: 0,
    spending: 0,
    revenue: 0,
    spending_data: {
      id: "spending_root",
      displayName: "No Data",
      name: "No Data",
      amount: 0,
    },
    revenue_data: {
      id: "revenue_root",
      displayName: "No Data",
      name: "No Data",
      amount: 0,
    },
  };
}
