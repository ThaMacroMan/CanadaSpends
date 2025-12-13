# Edmonton Municipal Data — 2024 Consolidated Financial Statements

## Data Source

**Primary document:** [City of Edmonton 2024 Consolidated Financial Statements](https://www.edmonton.ca/sites/default/files/public-files/FinancialAnnualReportConsolidatedFinancialStatements2024.pdf?cb=1761586265) for the fiscal year ended December 31, 2024.

**Debt and employee data:** [City of Edmonton 2024 Financial Annual Report](https://www.edmonton.ca/sites/default/files/public-files/2024FinancialAnnualReport.pdf?cb=1746489478)

This repository contains cleaned tabular data and JSON files needed to drive the Edmonton spending/revenue visualizations for the 2024 fiscal year.

## Key Figures

Based on the 2024 Consolidated Financial Statements:

- **Total Revenue:** $4,801,922 thousand (~$4.80 billion)
- **Total Expenses:** $3,819,822 thousand (~$3.82 billion)
- **Annual Surplus:** ~$982 million
- **Net Debt:** $4,368,432 thousand (~$4.37 billion)
- **Total Debt:** $4,795,980 thousand (~$4.80 billion)
- **Debt Interest:** $162,024 thousand (~$162 million)
- **Employees:** 16,064

## What's Included

- `sankey.json` — Hierarchical spending and revenue data for Sankey visualizations (amounts in billions)
- `summary.json` — Municipal metadata including total spending, debt, and department-level summaries
- **Revenue CSVs** (amounts in thousands of dollars):
  - `revenues/revenues_2024.csv` — Operating revenues breakdown (taxes, user fees, EPCOR, franchise fees, etc.)
  - `revenues/net_taxes_breakdown_2024.csv` — Detailed breakdown of net municipal taxes including property taxes, CRL, education taxes, etc.
  - `revenues/Other.csv` — Capital revenues (government transfers, contributed assets, developer contributions)
- **Expense CSVs** (amounts in thousands of dollars):
  - `expenses/Transportation_Services.csv` — Transit and roadway expenses
  - `expenses/Protective_Services.csv` — Police, fire, and bylaw enforcement
  - `expenses/Community_Services.csv` — Parks, recreation, libraries, housing
  - `expenses/Utility_and_Enterprise_Services.csv` — Waste services, land enterprise, renewable energy
  - `expenses/General_Municipal.csv` — General municipal operations
  - `expenses/Corporate_Administration.csv` — Administrative overhead
  - `expenses/Fleet_Services.csv` — City fleet management
  - `expenses/Ed_Tel_Endowment_Fund.csv` — Ed Tel endowment operations

## Units and Conventions

- CSV files are in **thousands of dollars** (as reported in source documents)
- JSON amounts in `sankey.json` are in **billions of dollars**
- All monetary values have been normalized for consistency

## Methodology and Scope

- **Primary Data Sources:** Revenue and expense data is primarily sourced from **page 64** (consolidated statement of operations) and **page 99** (net municipal taxes breakdown) of the 2024 Consolidated Financial Statements
- **Revenue Structure:** Page 64 provides the high-level revenue categories used in the Sankey visualization; page 99 provides the detailed breakdown of "Net taxes available for municipal purposes" showing property taxes, CRL, education tax deductions, and other adjustments
- **Expense Structure:** Page 64 breaks down expenses by department/service area (Transportation, Protective Services, Community Services, etc.). Note that page 70 presents an alternative view showing expenses by nature (salaries, materials, contracted services, interest, grants, amortization, and loss/gain on asset disposal) rather than by department—this cross-tabulation shows how each revenue source funds different expense types, but we use the department-based view (page 64) for the Sankey to maintain clarity and program-level detail
- **Key Note:** EPCOR is reported as a subsidiary operation and represents utility services provided by the wholly-owned corporation

## File Structure

```
data/edmonton/
├── README.md
├── summary.json                              # Municipal metadata
├── sankey.json                               # Hierarchical spending/revenue data (billions)
├── revenues/
│   ├── revenues_2024.csv                     # Operating revenues breakdown
│   ├── net_taxes_breakdown_2024.csv          # Detailed tax breakdown
│   └── Other.csv                             # Capital revenues
├── expenses/
│   ├── Transportation_Services.csv
│   ├── Protective_Services.csv
│   ├── Community_Services.csv
│   ├── Utility_and_Enterprise_Services.csv
│   ├── General_Municipal.csv
│   ├── Corporate_Administration.csv
│   ├── Fleet_Services.csv
│   └── Ed_Tel_Endowment_Fund.csv
└── data/
    └── revenue and expense/                  # Source data files
```

## Notes

- Edmonton's fiscal year is the calendar year (January 1 - December 31, 2024)
- All figures are from audited consolidated financial statements
- Debt and employee data sourced from the [2024 Financial Annual Report](https://www.edmonton.ca/sites/default/files/public-files/2024FinancialAnnualReport.pdf?cb=1746489478)
- EPCOR Utilities Inc. is a wholly-owned subsidiary providing utility services
- Debt figures represent consolidated financial position including self-supporting debt

## Attribution

Data © City of Edmonton. Report any suspected transcription/normalization errors by opening an issue.
