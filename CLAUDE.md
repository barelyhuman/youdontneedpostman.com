# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Type-check (tsc -b) then build for production
pnpm preview    # Preview the production build locally
```

No test or lint scripts are configured yet. Package manager is **pnpm**.

## Architecture

**Stack:** Preact + Vite + TypeScript + Wouter (routing)

**Routing:** `app.tsx` uses wouter with `useHashLocation` for hash-based SPA routing (`#/` and `#/migrate`). Two pages:
- `AlternativesPage` (`/`) — landing page promoting Bruno/Yaak as Postman alternatives
- `MigratePage` (`/migrate`) — multi-step wizard for converting API collections to Bruno format

**Conversion pipeline** (all client-side, no server):
1. `FileUpload` component — user selects format + collection file (+ optional env file)
2. `utils/converter.ts` — reads files, parses JSON/YAML, delegates to `@usebruno/converters` (`postmanToBruno`, `insomniaToBruno`, `openApiToBruno`)
3. `utils/analyzer.ts` — walks the raw input to produce a `MigrationReport` (counts requests, detects scripts, auth types, runtime vars, warnings)
4. `MigrationReportView` — displays the report and download buttons

Supported formats: `postman` | `insomnia` | `openapi`

**TypeScript config** is split into two tsconfigs:
- `tsconfig.app.json` — app source (ES2023, strict, JSX via Preact); aliases `react`/`react-dom` → `preact/compat`
- `tsconfig.node.json` — build tools (vite.config.ts)

**Node polyfills:** `vite-plugin-node-polyfills` is required because `@usebruno/converters` has Node.js dependencies (`path`, `fs`, etc.) that need browser shims. Postman conversion explicitly passes `{ useWorkers: false }` to avoid Web Worker issues in the browser.

**CSS** uses custom properties for theming with automatic dark mode via `@media (prefers-color-scheme: dark)`. Global variables in `src/index.css`; component styles in `src/app.css`.
