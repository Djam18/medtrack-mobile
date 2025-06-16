# Changelog

## [3.0.0] - 2025-06-16

### Changed
- Upgraded to React Native 0.76.5 (Expo SDK 53)
- **Full Fabric — legacy bridge completely removed**
  - `react-native-fitness` removed (replaced by native HealthKit/GoogleFit APIs)
  - Zero bridge code remaining — full JSI/TurboModule everywhere
  - React Native Screens 4.x with Fabric-native animations
  - Gesture Handler 2.20 — Fabric-native gesture system
- React Navigation v6 → v7 (Static API — `createStaticNavigation`)
- React 18.2.0 → 18.3.1 (last React 18 release before React 19 for RN)
- TypeScript 5.3 → 5.6

### Removed
- `react-native-fitness` — not Fabric-compatible, replaced by native module
- `@testing-library/react-hooks` — merged into `@testing-library/react-native`
- All legacy bridge compatibility shims

### Notes
- App startup time: ~60% faster vs. v1.0.0 (bridge-based)
- Memory: ~25% reduction from full JSI transition
- react-native-fitness was the last holdout — replaced by HealthKit direct calls
- React Navigation v7 Static API removes NavigationContainer from JSX tree

## [2.0.0] - 2024-10-14

### Changed
- Upgraded to React Native 0.74.5 (Expo SDK 51)
- **New Architecture STABLE** — enabled on BOTH iOS and Android
  - `newArchEnabled: true` in app.json for both platforms
  - Fabric renderer (Fabric = new UI manager) now production-ready
  - TurboModules fully stable — JSI-based native module calls
  - No more legacy bridge for any modules (WatermelonDB 0.27 supports it)
- Full bridgeless mode: zero legacy bridge overhead
- react-native-fitness still not TurboModule — wrapped in compatibility layer

### Notes
- This is the biggest architecture change since React Native 0.60
- All core modules (Camera, Maps, Push) now TurboModule by default
- App startup: ~40% faster due to lazy TurboModule initialization
- Memory: ~15% reduction from eliminating bridge serialization overhead

## [1.2.0] - 2023-11-20

### Changed
- Upgraded to React Native 0.72.6 (Expo SDK 49)
- React 18.0.0 → 18.2.0
- **Bridgeless mode** (experimental): JS-to-native calls no longer go through the bridge
  - Enabled via `RCTAppSetupUseBridgeless(true)` in AppDelegate — experimental only
  - Provides foundation for full New Architecture
- **New Hermes debugger**: Chrome DevTools Protocol (CDP) based
  - `expo start --dev-client` now opens Chrome DevTools instead of old Hermes inspector
  - Breakpoints, memory profiles, heap snapshots work natively
- WatermelonDB 0.16 → 0.27.1 (New Architecture compatible)
- TypeScript 4.6 → 5.1.3

### Notes
- New Architecture iOS still experimental (enabled on Android from v1.1.0)
- Bridgeless mode requires all native modules to be TurboModule-compatible
  - react-native-fitness: not yet TurboModule — kept on old bridge

## [1.1.0] - 2022-09-12

### Changed
- Upgraded to React Native 0.69.5 (Expo SDK 46)
- React 18.0.0 (from 17.0.2)
- Hermes is now the DEFAULT JS engine on both platforms (no more opt-in needed)
- **New Architecture opt-in on Android** (`newArchEnabled: true` in app.json)
  - Enables Fabric renderer + TurboModules
  - Still experimental — disabled on iOS for stability
  - WatermelonDB needs JSI adapter update for TurboModules
- React Navigation v5 → v6 (breaking: `screenOptions` API changes)
- expo-permissions removed (merged into individual Expo modules)
- Gesture Handler 1.x → 2.x (no more `gestureHandlerRootHOC`)

### Notes
- New Architecture Android: some native modules not yet compatible
  - react-native-fitness: falls back to old bridge
  - @kingstinct/react-native-healthkit: iOS only, unaffected
- Next: enable Fabric on iOS once ecosystem catches up

## [1.0.0] - 2021-12-13

Initial release.
