import { device, expect, element, by, waitFor } from 'detox';

// E2E: Onboarding flow tests
// Tests the complete first-time user experience

describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true, // fresh install, no existing data
    });
  });

  it('should show onboarding screens on first launch', async () => {
    await waitFor(element(by.id('onboarding-slide-1')))
      .toBeVisible()
      .withTimeout(5000);

    await expect(element(by.text('Track Your Medications'))).toBeVisible();
  });

  it('should navigate through all onboarding slides', async () => {
    // Slide 1 -> 2
    await element(by.id('onboarding-next-btn')).tap();
    await waitFor(element(by.id('onboarding-slide-2'))).toBeVisible().withTimeout(2000);
    await expect(element(by.text('Never Miss a Dose'))).toBeVisible();

    // Slide 2 -> 3
    await element(by.id('onboarding-next-btn')).tap();
    await waitFor(element(by.id('onboarding-slide-3'))).toBeVisible().withTimeout(2000);
    await expect(element(by.text('Health Insights'))).toBeVisible();

    // Complete onboarding
    await element(by.id('onboarding-get-started-btn')).tap();
  });

  it('should land on empty medication list after onboarding', async () => {
    await waitFor(element(by.id('medication-list')))
      .toBeVisible()
      .withTimeout(3000);

    // Empty state shown for new user
    await expect(element(by.id('empty-state-text'))).toBeVisible();
    await expect(element(by.text('Add your first medication'))).toBeVisible();
  });

  it('should not show onboarding on second launch', async () => {
    await device.launchApp({ newInstance: true });

    await waitFor(element(by.id('medication-list')))
      .toBeVisible()
      .withTimeout(5000);

    // Onboarding should NOT appear
    await expect(element(by.id('onboarding-slide-1'))).not.toBeVisible();
  });
});
