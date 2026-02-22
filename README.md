# Burinious Weight Coach

Flexible-duration weight coaching app built with React + Vite + Zustand.

## What It Does

- Generates a workout plan for 30, 45, 60, 90, 120, or 180 days.
- Tracks daily calories, protein, water, steps, workout minutes, and body weight.
- Includes a Start Program flow and dashboard insights (streaks, adherence, trend signals).
- Persists all data locally in `localStorage`.
- Runs as a PWA and can be packaged as a native mobile app with Capacitor.

## Tech Stack

- React 18
- Vite
- Material UI
- Zustand + Immer + persisted store
- Recharts
- date-fns
- Zod
- Capacitor (mobile packaging)

## Local Development

1. Install dependencies:
```bash
npm install
```
2. Start dev server:
```bash
npm run dev
```
3. Build production bundle:
```bash
npm run build
```

Optional APK banner link override:
```bash
VITE_LATEST_APK_URL=https://your-host/path/latest.apk
```

Optional release API override for update detection:
```bash
VITE_RELEASES_API_URL=https://api.github.com/repos/your-org/your-repo/releases/latest
```

## App Architecture

- `src/store/useAppStore.js`: global persisted state for settings, logs, weights, and generated plan.
- `src/utils/plan.js`: deterministic day-by-day plan generator.
- `src/pages/Dashboard.jsx`: KPI view, daily progress, chart, and upcoming sessions.
- `src/pages/LogDay.jsx`: validated daily logging form.
- `src/pages/History.jsx`: mobile cards and desktop table for historical logs.
- `src/pages/Settings.jsx`: target configuration, plan regeneration, and full reset.
- `src/components/WeightChart.jsx`: weight trend chart with empty-state handling.

## Mobile App Setup (Capacitor)

After `npm install`, you can package the web app into native shells:

1. Build and sync web assets:
```bash
npm run mobile:sync
```
2. Add Android project (first time only):
```bash
npm run mobile:add:android
```
3. Open Android Studio:
```bash
npm run mobile:android
```
4. Add iOS project on macOS (first time only):
```bash
npm run mobile:add:ios
```
5. Sync iOS web assets on macOS:
```bash
npm run mobile:sync:ios
```
6. Open Xcode on macOS:
```bash
npm run mobile:ios
```

Capacitor config lives in `capacitor.config.json`.

iOS native dependency installation requires CocoaPods (`pod`) on macOS.
