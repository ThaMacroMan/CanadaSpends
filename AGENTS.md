# Canada Spends - Agent Guide

This document provides essential information for AI agents working in the Canada Spends codebase. Canada Spends is a Next.js application that visualizes government spending data across federal, provincial, and municipal levels in Canada.

## Project Overview

Canada Spends aims to be the easiest way for Canadians to understand how their government spends their money. The project:

- Parses, aggregates, and visualizes audited financial statements
- Aggregates and normalizes government spending databases for search
- Supports English and French localization
- Uses data visualization (Sankey diagrams, charts) to present complex data

## Technology Stack

- **Framework**: Next.js 15.4.8 with App Router, Turbopack, and React 19
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with shadcn/ui component library
- **Internationalization**: Lingui (i18n) with English/French support
- **Charts**: D3.js for Sankey diagrams, Recharts for other visualizations
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, simple-git-hooks for pre-commit checks
- **Analytics**: PostHog, Vercel Analytics, Simple Analytics
- **UI Components**: Radix UI primitives with class-variance-authority for variants

## Development Environment

### Prerequisites

- Node.js 20+ (specified in flake.nix)
- pnpm 9.5.0+ (see `packageManager` in package.json)
- TypeScript 5.9.2

### Quick Start

```bash
pnpm install
pnpm dev          # Start development server with Turbopack
```

### Nix Shell (Optional)

A `flake.nix` is provided for Nix users:

```bash
nix develop       # Enter development shell with Node.js and TypeScript LSP
```

## Essential Commands

All commands are run from the project root using pnpm:

| Command                 | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`              | Start development server with Turbopack                                    |
| `pnpm build`            | Build for production (includes i18n extraction and static data generation) |
| `pnpm start`            | Start production server                                                    |
| `pnpm lint`             | Run ESLint checks (most issues are warnings)                               |
| `pnpm lint:fix`         | Auto-fix ESLint issues                                                     |
| `pnpm format`           | Format code with Prettier                                                  |
| `pnpm extract`          | Extract i18n messages with Lingui                                          |
| `pnpm generate-statics` | Generate static build-time data (sitemap stats, etc.)                      |
| `pnpm prepare`          | Set up git hooks (automatically runs on install)                           |

### Build Process

The build command (`pnpm build`) runs three steps sequentially:

1. `pnpm extract` - Extract i18n messages from source files
2. `pnpm generate-statics` - Generate static data files
3. `next build` - Build Next.js application

## Code Organization

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── [lang]/            # Localized routes (en/fr)
│   │   ├── (main)/        # Main route group
│   │   │   ├── spending/  # Government spending visualizations
│   │   │   ├── about/     # About pages
│   │   │   ├── articles/  # MDX article pages
│   │   │   └── ...
│   │   └── (mobile)/      # Mobile-specific layouts
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components (button, card, etc.)
│   ├── Sankey/           # Sankey diagram components
│   ├── Layout.tsx        # Layout components
│   └── ...
├── lib/                  # Utilities and shared logic
│   ├── utils.ts          # General utilities (cn, focusRing, etc.)
│   ├── constants.ts      # App constants
│   ├── jurisdictions.ts  # Jurisdiction data
│   ├── articles.ts       # Article utilities
│   └── ...
├── styles/               # Styling and Design Tokens
│   ├── colours/          # Color definitions (TS + CSS)
│   ├── charts/           # Chart-specific CSS (Sankey, etc.)
│   ├── themes/           # Theme definitions
│   └── ...
├── hooks/                # Custom React hooks
├── locales/              # i18n message catalogs (en.po, fr.po)
└── types/                # TypeScript type definitions

data/                     # Static data files
├── provincial/           # Provincial government data
├── municipal/           # Municipal government data
└── static-data.json     # Generated static metadata

articles/                 # MDX content articles
├── en/                  # English articles
└── fr/                  # French articles

scrapers/                # Data scraping scripts
├── public_accounts/     # Public accounts PDF scraping
├── nserc/              # NSERC grant scraping
└── ...

colours/                  # Documentation and previews for color palettes
```

## Styling & Theming

The project uses a hybrid styling approach:

1.  **Tailwind CSS 4**: The primary engine for utility classes and layout.
2.  **Design Tokens**: Colors are defined in `src/styles/colours/` and exported both as:
    - **TypeScript objects**: In `src/styles/colours/index.ts` (e.g., `colours.canada_red`) for use in D3/Recharts.
    - **CSS Variables**: In `src/styles/colours/*.css` for use in Tailwind and custom CSS.
3.  **Chart Styling**: Complex charts (like Sankey) use dedicated CSS files in `src/styles/charts/`.
    - **Sankey Charts**: Styled via `src/styles/charts/sankey.css`. Highlighting classes are grouped at the end of the file under a "Highlighting" comment section.
4.  **Reference**: The root `colours/` directory contains HTML previews and Markdown documentation for the design system.

**Best Practices**:

- **Colors**: Use `var(--color-name)` in CSS or import `colours` from `@/styles/colours` in TS.
- **Charts**: Keep chart-specific CSS in `src/styles/charts/` rather than `globals.css`.
- **Theme Updates**: When adding colors, update both the TS definition and the corresponding CSS file.

## Key Patterns

### Internationalization (i18n)

- Uses **Lingui** for translation management
- All user-facing text should be wrapped in `<Trans>` macro or `t` macro
- Message catalogs are in `src/locales/{locale}.po`
- Run `pnpm extract` to update translation files after adding/editing text
- Localized routing: `/[lang]/...` (e.g., `/en/spending`, `/fr/spending`)
- Use `localizedPath()` from `@/lib/utils` to generate localized links
- Use `generateHreflangAlternates()` for SEO metadata

### UI Components

- Uses **shadcn/ui** component library (see `components.json`)
- Component variants defined with `class-variance-authority`
- Utility function `cn()` from `@/lib/utils` for className merging
- Follow existing patterns in `src/components/ui/`
- Use Radix UI primitives for accessibility

### Data Visualization

- **Sankey diagrams**: Custom D3 implementation in `src/components/Sankey/`
- **Charts**: Recharts for bar/line charts, D3 for complex visualizations
- Data files are stored in `data/` directory as JSON
- Department mappings in `src/lib/sankeyDepartmentMappings.ts`

### Data Loading

- Static data is loaded at build time via `scripts/generate-statics.ts`
- Dynamic data can be loaded via API routes or client-side fetching
- Department pages use static generation with dynamic routes
- **Static Generation Pattern**: Pages use `generateStaticParams()` with `dynamicParams = false`
- **Data Utilities**: Use functions from `@/lib/jurisdictions` for jurisdiction/department data
- **File-based Data**: JSON data files in `data/` directory are referenced by slug
- **Type Safety**: Data loading functions return typed results based on file structure

### Routing

- App Router with route groups: `(main)` and `(mobile)`
- Dynamic segments: `[lang]`, `[jurisdiction]`, `[department]`, `[slug]`
- API routes in `src/app/api/`
- Redirects and rewrites configured in `next.config.ts`

## Gotchas and Non-Obvious Patterns

### TypeScript Build Errors

- `next.config.ts` sets `typescript.ignoreBuildErrors: true`
- Type errors won't block production builds but should still be fixed

### ESLint Configuration

- Most rules are set to "warn" instead of "error" (temporary)
- Specific files have rule overrides (e.g., `tailwind.config.ts`)
- The `src/app/(main)/spending/` directory is ignored by ESLint

### Internationalization

- The `useLingui` hook cannot be used in server components
- Use `initLingui()` for server components, `<Trans>` macro for client
- Message extraction must be run before building

### Sankey Diagram Performance

- Sankey components use dynamic imports (`next/dynamic`) to avoid SSR
- Large data sets may impact performance; consider virtualization

### Mobile Layouts

- Mobile-specific layouts are in `src/app/[lang]/(mobile)/`
- Use route groups to share components between mobile and desktop

### Git Hooks

- Pre-commit hooks automatically run `lint-staged`
- Linting failures will block commits
- Configured via `simple-git-hooks` in package.json

### Environment Variables

- No `.env` files observed; check for `.env.local` or similar
- Feature flags are managed in `src/lib/featureFlags.ts`

### Feature Flags

- Feature toggles are defined in `src/lib/featureFlags.ts` as boolean exports
- Used for gradual rollouts or seasonal features (e.g., `IS_BUDGET_2025_LIVE`)
- Check flags before implementing feature-specific logic

## Testing

**No test framework is currently configured.** No test files were found in the codebase.

## Data Structure

### Government Data

- Provincial data: `data/provincial/{province}/{year}/`
- Municipal data: `data/municipal/{province}/{city}/{year}/`
- Data includes `sankey.json` and `summary.json` files
- Department-specific JSON files for detailed views

### Articles

- MDX files in `articles/{lang}/{slug}/`
- Each article has `index.mdx` and `metadata.json`
- Images stored in `public/articles/{lang}/{slug}/images/`

### Static Data Generation

- `scripts/generate-statics.ts` runs during build
- Generates `data/static-data.json` with file metadata and structure
- Used for sitemap generation and build optimization

## Scrapers

Scrapers in `scrapers/` directory are used to collect government spending data:

- `public_accounts/` - PDF scraping for public accounts
- `nserc/`, `cihr/`, `sshrc_awards/` - Grant data scraping
- Each scraper has its own README and shell scripts

**PDF Storage**: Historical Public Accounts PDFs are stored in `PublicAccountsPDFs/` by year (1995-2024). These are source documents for data extraction.

## Deployment

- Likely deployed on Vercel (Next.js analytics configured)
- Build process includes i18n extraction and static data generation
- PostHog analytics configured for product analytics

## Development Tips

1. **Always run i18n extraction** after adding/editing translatable text
2. **Use the `cn()` utility** for conditional className merging
3. **Follow shadcn/ui patterns** for new components
4. **Check mobile layouts** when making UI changes
5. **Update scrapers carefully** - data quality is critical
6. **Respect pre-commit hooks** - they ensure code quality

## Useful References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lingui Documentation](https://lingui.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

_Last updated: December 12, 2025_
