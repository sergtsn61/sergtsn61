# Print Cost Calculator

Desktop app for calculating 3D print production costs. Built with **Tauri 2 + React 19 + TypeScript + Vite**.

## Project Structure

```
print-cost-calculator/
├── src/                    # React frontend
│   ├── App.tsx             # Root component, layout and tab routing
│   ├── components/
│   │   ├── Calculator/     # Input sections (filament, printer, electricity, etc.)
│   │   ├── History/        # Saved calculations panel
│   │   ├── Layout/         # Sidebar navigation
│   │   └── UI/             # Shared UI primitives
│   ├── hooks/
│   │   ├── useCalculator.ts  # Main calculation state
│   │   ├── useHistory.ts     # Saved history CRUD
│   │   └── useTheme.ts       # Dark/light theme
│   ├── utils/
│   │   ├── calculator.ts     # Cost breakdown logic
│   │   ├── gcode.ts          # G-code file parsing (weight, duration)
│   │   ├── export.ts         # PDF export via jsPDF
│   │   └── storage.ts        # LocalStorage persistence
│   ├── types/calculation.ts  # All shared TypeScript interfaces
│   └── i18n/               # Localisation (ru/en)
└── src-tauri/              # Rust/Tauri backend
```

## Key Domain Types (`src/types/calculation.ts`)

- `CalculationInput` — all user inputs (filament, printer, electricity, post-processing, pricing)
- `CostBreakdown` — computed costs per unit and totals
- `CalculationResult` — saved entry (input + breakdown + metadata)
- `FilamentProfile` / `PrinterProfile` — reusable library profiles

## Development Commands

```bash
# Web dev server only
npm run dev

# Full Tauri desktop app (dev)
npm run app:dev

# Build desktop app
npm run app:build

# TypeScript check + Vite build (web)
npm run build
```

## Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Recharts, jsPDF, lucide-react
- **Desktop shell**: Tauri 2, Rust
- **Build**: Vite 7

## Notes

- All monetary values default to RUB (₽); currency is configurable.
- G-code drag-and-drop auto-fills filament weight and print duration.
- History and profiles are persisted in browser LocalStorage (web) / Tauri storage (desktop).
