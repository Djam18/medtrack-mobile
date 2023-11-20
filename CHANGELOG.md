# Changelog

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
