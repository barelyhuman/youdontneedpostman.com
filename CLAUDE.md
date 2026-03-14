# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Type-check (tsc -b) then build for production
npm run preview    # Preview the production build locally
```

No test or lint scripts are configured yet.

## Architecture

**Stack:** Preact + Vite + TypeScript

The app renders from `index.html` → `src/main.tsx` → `src/app.tsx`. The root component (`app.tsx`) is the primary UI with all application state.

**TypeScript config** is split into two tsconfigs:
- `tsconfig.app.json` — app source (ES2023, strict, JSX via Preact)
- `tsconfig.node.json` — build tools (vite.config.ts)

**React compatibility aliases** are configured in `tsconfig.app.json` so `react` and `react-dom` resolve to `preact/compat`, allowing use of React ecosystem packages.

**CSS** uses custom properties for theming with automatic dark mode via `@media (prefers-color-scheme: dark)`. Global variables in `src/index.css`; component styles in `src/app.css`.
