# MedTrack Mobile

A React Native medication tracker built with Expo, TypeScript, and WatermelonDB. Helps patients maintain adherence to medication schedules with smart reminders, adherence analytics, and health platform integration.

---

## Features

### Core Tracking
- **Medication management** — add, edit, archive medications with dosage, frequency, schedule times, and color coding
- **Dose logging** — mark doses as taken or skipped with a single tap; timestamped records
- **Daily view** — date-navigation with summary bar showing taken/total and adherence percentage
- **Push notifications** — scheduled local reminders per medication time; custom repeat patterns (daily, twice-daily, weekly, as-needed)

### Analytics & Insights
- **Adherence statistics** — last 7 days, last 30 days, all-time rates per medication
- **Streak counter** — current and longest consecutive adherence streaks
- **Calendar heatmap** — color-coded grid (red → yellow → green) showing adherence history at a glance

### Persistence & Sync
- **Offline-first** — WatermelonDB with SQLite adapter; all data stored on-device, no account required
- **Hermes JS engine** — enabled on iOS and Android for 30% smaller bundle and faster startup

### Health Platform Integration
- **HealthKit (iOS)** — request permissions and log medication events; read step count
- **Google Fit (Android)** — read daily step count; log medication activity
- **Platform-agnostic API** — `healthData.ts` facade routes to the correct integration automatically

### Reports & Export
- **PDF report** — generates HTML report with KPI summary, medication list, and dose history; share via native share sheet (print-to-PDF from device)

### Accessibility
- Full `accessibilityLabel` and `accessibilityRole` coverage across all interactive elements
- `AccessibilityInfo.announceForAccessibility` on onboarding slide transitions
- Color contrast ratios meet WCAG AA

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.66 + Expo SDK 43 |
| Language | TypeScript 4.5 (strict mode) |
| Database | WatermelonDB 0.16 (SQLite adapter) |
| Notifications | expo-notifications (local scheduled) |
| Navigation | React Navigation 5 (stack + bottom tabs) |
| State | React hooks + Context |
| Health (iOS) | @kingstinct/react-native-healthkit |
| Health (Android) | react-native-fitness |
| PDF/Share | expo-print + expo-sharing |
| JS Engine | Hermes (iOS + Android) |
| Testing | Jest 27 + @testing-library/react-native |

---

## Getting Started

### Prerequisites

- Node.js 16+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 13 + CocoaPods
- Android: Android Studio + SDK 31

### Install

```bash
git clone https://github.com/yourusername/medtrack-mobile.git
cd medtrack-mobile
npm install
```

### Run

```bash
# Start Expo dev server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

### Build (EAS)

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

---

## Project Structure

```
medtrack-mobile/
├── src/
│   ├── components/
│   │   ├── CalendarHeatmap.tsx     # Color-coded adherence grid
│   │   └── StreakCounter.tsx       # Current + longest streak
│   ├── database/
│   │   ├── schema.ts               # WatermelonDB appSchema
│   │   ├── database.ts             # SQLiteAdapter setup
│   │   ├── medicationRepository.ts # CRUD operations
│   │   └── models/
│   │       ├── MedicationModel.ts
│   │       └── DoseLogModel.ts
│   ├── hooks/
│   │   └── useDoseLog.ts           # In-memory dose log state
│   ├── screens/
│   │   ├── MedicationListScreen.tsx
│   │   ├── AddMedicationScreen.tsx
│   │   ├── DoseLogScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── types/
│   │   └── medication.ts           # TypeScript interfaces
│   └── utils/
│       ├── notifications.ts        # Expo notifications scheduling
│       ├── scheduleBuilder.ts      # Daily dose generation + adherence calc
│       ├── pdfExport.ts            # HTML report generation
│       ├── healthKit.ts            # iOS HealthKit integration
│       ├── googleFit.ts            # Android Google Fit integration
│       ├── healthData.ts           # Platform-agnostic health facade
│       └── performance.ts          # Hermes optimizations, throttle, cache
├── app.json                        # Expo config (Hermes enabled)
└── package.json
```

---

## Key Architecture Decisions

### Offline-First with WatermelonDB
All data is stored locally in SQLite via WatermelonDB. There is no cloud sync in v1.0 — this was intentional to ship quickly and keep the app fully functional without an internet connection. WatermelonDB's lazy-loading model means large datasets (1000+ dose logs) don't block the UI thread.

### Hermes JS Engine
Enabled on both iOS and Android via `"jsEngine": "hermes"` in `app.json`. Combined with `InteractionManager.runAfterInteractions` for heavy computations and a Map-based date formatter cache, this reduces bundle size ~30% and improves startup time.

### Platform-Specific Health Integration
HealthKit and Google Fit are lazy-loaded via `dynamic import()` so neither SDK is bundled on the wrong platform. The `healthData.ts` facade provides a single async API that automatically routes to the correct integration based on `Platform.OS`.

### Immutable State
All state updates create new objects via spread operators. No direct mutation of arrays or objects anywhere in the codebase.

---

## Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:ci
```

Test coverage targets:
- `scheduleBuilder.ts` — 90%+ (core business logic)
- `performance.ts` — 85%+
- `useDoseLog.ts` — 95%+

---

## App Store Pitch

**MedTrack** is a privacy-first medication tracker designed for patients managing multiple prescriptions. Unlike cloud-dependent competitors, MedTrack stores all data locally — no account, no subscription, no data sharing.

**Target users:** Patients with chronic conditions (diabetes, hypertension, autoimmune) managing 2–10+ daily medications.

**Key differentiators:**
1. **Offline-first** — works in airplane mode, hospital dead zones, anywhere
2. **HealthKit / Google Fit integration** — one source of truth for your health data
3. **Doctor-ready PDF reports** — shareable adherence history for appointments
4. **Zero friction logging** — one tap to mark taken or skipped; smart reminders do the rest

---

## Roadmap (v1.1+)

- [ ] iCloud / Google Drive backup
- [ ] Pill photo recognition (camera)
- [ ] Caregiver mode (manage family member medications)
- [ ] Apple Watch complication
- [ ] Drug interaction warnings
- [ ] Pharmacy refill reminders

---

## License

MIT
