# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Desktop app for calculating 3D print production costs. Built with **Tauri 2 + React 19 + TypeScript + Vite**.

**All commands must be run from the `print-cost-calculator/` subdirectory.**

## Development Commands

```bash
cd print-cost-calculator

# Web dev server only (faster iteration)
npm run dev

# Full Tauri desktop app (dev)
npm run app:dev

# TypeScript check + Vite build (web)
npm run build

# Build desktop app
npm run app:build
```

There are no tests and no ESLint/Prettier config. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) is the only static analysis.

## Architecture

### Data Flow

`App.tsx` is the root. It composes two hooks and passes data/callbacks down via props:
- `useCalculator` — all input state + reactive `CostBreakdown` computation; auto-saves draft to LocalStorage every 500ms
- `useHistory` — CRUD for saved `CalculationResult` entries (max 100, stored in LocalStorage)

The app is frontend-only. The Tauri backend (`src-tauri/`) has no custom Rust commands — it only wraps the web app in a window and provides `plugin-opener` for opening URLs/files.

### Calculation Logic (`src/utils/calculator.ts`)

`calculateCosts(input)` computes:
- **Filament**: `usedWeight × (1 + wasteFactor%) × (spoolPrice / spoolWeight)`
- **Depreciation**: `(printerCost / lifespanHours) × printDuration`
- **Electricity**: `(powerConsumption / 1000) × rate × printDuration`
- **Post-processing**: removal + painting + assembly labor
- **Total unit cost**: sum + overhead percentage
- **Selling price**: total cost + profit margin percentage

### Storage (`src/utils/storage.ts`)

All persistence uses `localStorage` with structured keys:
- `print-calculator-history` — array of `CalculationResult`
- `print-calculator-draft` — current `CalculationInput` state
- `print-calculator-filament-profiles` / `print-calculator-printer-profiles` — user-created profiles
- `print-calculator-settings` — `AppSettings` (currency, language)

### i18n (`src/i18n/`)

Context-based i18n with `ru` (default) and `en` translations. Language and currency are stored in `AppSettings`. Russian defaults to RUB (₽), English to USD ($).

### G-code Parsing (`src/utils/gcode.ts`)

Regex-based extraction from slicer comments. Supports PrusaSlicer, Cura, OrcaSlicer, BambuStudio. Extracts filament weight (g) and print duration (h).

### Presets (`src/data/presets.ts`)

10 printer presets (Bambu Lab, Creality, Prusa, etc.) and 8 filament presets (PLA, PETG, ABS, ASA, TPU, Nylon, PC). These are read-only defaults; users create their own profiles saved to storage.

## Key Types (`src/types/calculation.ts`)

- `CalculationInput` — all user inputs (filament, printer, electricity, post-processing, pricing)
- `CostBreakdown` — computed costs per category and totals
- `CalculationResult` — saved entry: `{ input, breakdown, id, createdAt, name }`
- `FilamentProfile` / `PrinterProfile` — library profiles
- `AppSettings` — `{ currency, language }`

## Styling

Tailwind CSS with class-based dark mode. Custom color palette (`accent: #FF6B2B`), CSS variables in `src/index.css` for theming. Use `clsx` + `tailwind-merge` for conditional class composition.

## Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 3, Recharts, jsPDF, lucide-react
- **Desktop shell**: Tauri 2 (Rust), no custom Rust commands
- **Build**: Vite 7, fixed dev port 1420 (required by Tauri)
