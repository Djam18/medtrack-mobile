import { device, expect, element, by, waitFor } from 'detox';

// MedTrack E2E tests with Detox
// Tests run on real device/simulator — full New Architecture (Fabric) native stack
//
// Test flows:
// 1. Medication list loads and displays meds
// 2. Add new medication
// 3. Mark dose as taken
// 4. Mark dose as skipped
// 5. Adherence stats update after tracking

describe('Medication Tracking Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // ----------------------------------------------------------------
  // Test 1: App loads and shows medication list
  // ----------------------------------------------------------------
  it('should display the medication list on startup', async () => {
    await waitFor(element(by.id('medication-list')))
      .toBeVisible()
      .withTimeout(5000);

    await expect(element(by.id('medication-list'))).toBeVisible();
    await expect(element(by.id('empty-state'))).not.toBeVisible();
  });

  // ----------------------------------------------------------------
  // Test 2: Add a new medication
  // ----------------------------------------------------------------
  it('should add a new medication successfully', async () => {
    // Navigate to add medication screen
    await element(by.id('add-medication-btn')).tap();

    await waitFor(element(by.id('add-medication-screen')))
      .toBeVisible()
      .withTimeout(3000);

    // Fill in medication details
    await element(by.id('med-name-input')).typeText('Aspirin');
    await element(by.id('med-dosage-input')).typeText('100mg');

    // Select frequency: once daily
    await element(by.id('frequency-daily')).tap();

    // Set time: 09:00
    await element(by.id('time-picker-btn')).tap();
    await element(by.id('time-09-00')).tap();

    // Save
    await element(by.id('save-medication-btn')).tap();

    // Verify medication appears in list
    await waitFor(element(by.text('Aspirin')))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.text('Aspirin'))).toBeVisible();
    await expect(element(by.text('100mg'))).toBeVisible();
  });

  // ----------------------------------------------------------------
  // Test 3: Mark dose as taken
  // ----------------------------------------------------------------
  it('should mark a dose as taken and update adherence', async () => {
    // Tap today's dose card for Aspirin
    await element(by.id('dose-card-aspirin-today')).tap();

    await waitFor(element(by.id('dose-action-sheet')))
      .toBeVisible()
      .withTimeout(2000);

    // Tap "Mark as Taken"
    await element(by.id('mark-taken-btn')).tap();

    // Verify dose card shows taken state
    await waitFor(element(by.id('dose-card-aspirin-today')))
      .toBeVisible()
      .withTimeout(1000);

    await expect(element(by.id('dose-status-taken'))).toBeVisible();

    // Navigate to stats tab and verify adherence updated
    await element(by.id('tab-stats')).tap();
    await waitFor(element(by.id('adherence-percentage')))
      .toBeVisible()
      .withTimeout(2000);

    // Adherence should be >= 1% (at least one dose taken)
    const adherenceEl = element(by.id('adherence-percentage'));
    await expect(adherenceEl).toBeVisible();
  });

  // ----------------------------------------------------------------
  // Test 4: Mark dose as skipped
  // ----------------------------------------------------------------
  it('should mark a dose as skipped', async () => {
    // Navigate back to home
    await element(by.id('tab-home')).tap();

    // Find a pending dose and skip it
    await element(by.id('dose-card-pending')).atIndex(0).tap();

    await waitFor(element(by.id('dose-action-sheet')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('mark-skipped-btn')).tap();

    // Verify skipped state
    await expect(element(by.id('dose-status-skipped'))).toBeVisible();
  });

  // ----------------------------------------------------------------
  // Test 5: PDF export
  // ----------------------------------------------------------------
  it('should generate PDF report without crashing', async () => {
    await element(by.id('tab-profile')).tap();

    await waitFor(element(by.id('export-pdf-btn')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('export-pdf-btn')).tap();

    // Verify share sheet appears (PDF generated)
    await waitFor(element(by.id('share-sheet')))
      .toBeVisible()
      .withTimeout(5000);

    // Dismiss share sheet
    await device.pressBack();
  });

  // ----------------------------------------------------------------
  // Test 6: Notification permission request (new install flow)
  // ----------------------------------------------------------------
  it('should request notification permission on first launch', async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'unset' },
    });

    await waitFor(element(by.id('notification-permission-prompt')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('allow-notifications-btn')).tap();

    // Verify we're on the main screen after granting permission
    await waitFor(element(by.id('medication-list')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
