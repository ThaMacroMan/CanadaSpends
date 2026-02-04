// Transform Statement of Operations data to SankeyData format

import type { SankeyData, SankeyNode } from "@/components/Sankey/SankeyChartD3";
import type { StatementOfOperations, StatementLineItem } from "./types";

// Local type that matches the SankeyNode shape we create
interface LocalSankeyNode {
  id: string;
  displayName: string;
  name: string;
  amount: number;
  children?: LocalSankeyNode[];
}

/**
 * Build a hierarchical tree from flat items with parent_category relationships
 * Items with the same parent_category are grouped under a parent node
 * Results are sorted by total amount (largest first)
 */
function buildHierarchicalTree(
  items: Array<{ item: StatementLineItem; amount: number }>,
  prefix: string,
): LocalSankeyNode[] {
  // Group items by parent_category
  const parentGroups = new Map<string | null, typeof items>();

  for (const { item, amount } of items) {
    const parentCat = item.parent_category || null;
    if (!parentGroups.has(parentCat)) {
      parentGroups.set(parentCat, []);
    }
    parentGroups.get(parentCat)!.push({ item, amount });
  }

  // Items without parent_category go directly at the top level
  const topLevelItems = parentGroups.get(null) || [];
  parentGroups.delete(null);

  const result: LocalSankeyNode[] = [];

  // Add items without parent_category as flat nodes
  for (const { item, amount } of topLevelItems) {
    result.push({
      id: `${prefix}_${(item.name || "").replace(/\s+/g, "_").toLowerCase()}`,
      displayName: item.name || "",
      name: item.name || "",
      amount,
    });
  }

  // Add parent categories with their children
  for (const [parentCat, children] of parentGroups) {
    if (!parentCat) continue;

    const childNodes: LocalSankeyNode[] = children
      .map(({ item, amount }) => ({
        id: `${prefix}_${parentCat.replace(/\s+/g, "_").toLowerCase()}_${(item.name || "").replace(/\s+/g, "_").toLowerCase()}`,
        displayName: item.name || "",
        name: item.name || "",
        amount,
      }))
      // Sort children by amount (largest first)
      .sort((a, b) => b.amount - a.amount);

    // Create parent node with amount 0 (sum comes from children)
    result.push({
      id: `${prefix}_parent_${parentCat.replace(/\s+/g, "_").toLowerCase()}`,
      displayName: parentCat,
      name: parentCat,
      amount: 0,
      children: childNodes,
    });
  }

  // Sort result by total amount (for parent nodes, sum children; for leaf nodes, use amount)
  const getNodeTotal = (node: LocalSankeyNode): number => {
    if (node.children && node.children.length > 0) {
      return node.children.reduce((sum, child) => sum + child.amount, 0);
    }
    return node.amount;
  };

  return result.sort((a, b) => getNodeTotal(b) - getNodeTotal(a));
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

  // Build revenue tree with hierarchical grouping by parent_category
  // Only include positive revenue items
  const positiveRevenueItems = regularRevenueItems
    .map((item) => ({
      item,
      amount: getActualValue(item, fiscalYear),
    }))
    .filter(({ amount }) => amount > 0);

  // Build hierarchical tree from items with parent_category relationships
  const rawRevenueChildren = buildHierarchicalTree(
    positiveRevenueItems,
    "revenue",
  );

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

  // Helper to get total amount for a node (sum children for parent nodes)
  const getNodeTotal = (node: LocalSankeyNode): number => {
    if (node.children && node.children.length > 0) {
      return node.children.reduce((sum, child) => sum + child.amount, 0);
    }
    return node.amount;
  };

  // Re-sort after adding deferred revenue (largest first)
  rawRevenueChildren.sort((a, b) => getNodeTotal(b) - getNodeTotal(a));

  // Calculate raw sum and scale factor to match stated total
  // For hierarchical nodes, we need to sum leaf amounts only
  const sumLeafAmounts = (nodes: LocalSankeyNode[]): number =>
    nodes.reduce((sum, node) => {
      if (node.children && node.children.length > 0) {
        return sum + sumLeafAmounts(node.children);
      }
      return sum + node.amount;
    }, 0);

  const rawRevenueSum = sumLeafAmounts(rawRevenueChildren);
  const revenueScaleFactor =
    rawRevenueSum > 0 && totalRevenue > 0 ? totalRevenue / rawRevenueSum : 1;

  // Scale leaf children so their sum matches the stated total
  const scaleNodes = (
    nodes: LocalSankeyNode[],
    factor: number,
  ): SankeyNode[] => {
    return nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: scaleNodes(node.children, factor),
        } as SankeyNode;
      }
      return {
        ...node,
        amount: node.amount * factor,
      } as SankeyNode;
    });
  };

  const revenueChildren: SankeyNode[] = scaleNodes(
    rawRevenueChildren,
    revenueScaleFactor,
  );

  const revenueData: SankeyNode = {
    id: "revenue_root",
    displayName: "Total Revenue",
    name: "Total Revenue",
    // Root amount must be 0 because d3 hierarchy().sum() adds node.amount to children's sum
    amount: 0,
    children: revenueChildren,
  };

  // Build spending/expense tree with hierarchical grouping by parent_category
  // Only include positive expense items
  const positiveExpenseItems = expenseItems
    .map((item) => ({
      item,
      amount: getActualValue(item, fiscalYear),
    }))
    .filter(({ amount }) => amount > 0);

  // Build hierarchical tree from items with parent_category relationships
  const rawSpendingChildren = buildHierarchicalTree(
    positiveExpenseItems,
    "spending",
  );

  // Add net deferred revenue as an outflow if negative (deferring more than recognizing)
  if (netDeferredRevenue < 0) {
    rawSpendingChildren.push({
      id: "spending_deferred_revenue",
      displayName: "Deferred to Future Years",
      name: "Deferred to Future Years",
      amount: Math.abs(netDeferredRevenue),
    });
  }

  // Re-sort after adding deferred revenue (largest first)
  rawSpendingChildren.sort((a, b) => getNodeTotal(b) - getNodeTotal(a));

  // Calculate raw sum and scale factor to match stated total
  const rawSpendingSum = sumLeafAmounts(rawSpendingChildren);
  const spendingScaleFactor =
    rawSpendingSum > 0 && totalExpenses > 0
      ? totalExpenses / rawSpendingSum
      : 1;

  // Scale children so their sum matches the stated total
  const spendingChildren: SankeyNode[] = scaleNodes(
    rawSpendingChildren,
    spendingScaleFactor,
  );

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
