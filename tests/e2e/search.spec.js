import { expect, test } from '@playwright/test';

test.describe('Search Functionality E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load search data successfully', async ({ page }) => {
    // Check that search data is loaded
    const searchDataResponse = await page.goto('/search-data.json');
    expect(searchDataResponse?.status()).toBe(200);

    const searchData = await searchDataResponse?.json();
    expect(searchData).toBeDefined();
    expect(Array.isArray(searchData)).toBe(true);
    expect(searchData.length).toBeGreaterThan(0);
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);
    await expect(searchInput).toBeVisible();
  });

  test('should show results when searching for mix title', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Get the search input
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Click to focus
    await searchInput.click();

    // Type a search query - using a year that should exist in the mixes
    await searchInput.fill('2024');

    // Wait for results to appear
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });

    // Take screenshot as proof
    await page.screenshot({
      path: 'tests/e2e/screenshots/search-results-2024.png',
      fullPage: true,
    });

    // Verify results are visible
    const resultsBox = page.locator('[role="listbox"]');
    await expect(resultsBox).toBeVisible();

    // Verify at least one result exists
    const results = page.locator('[role="option"]');
    await expect(results.first()).toBeVisible();

    // Verify no console errors occurred
    expect(consoleErrors).toHaveLength(0);
  });

  test('should navigate to mix page when clicking result', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Search for a mix
    await searchInput.click();
    await searchInput.fill('2024');

    // Wait for results
    await page.waitForSelector('[role="listbox"]');

    // Click the first result
    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Take screenshot of mix page as proof
    await page.screenshot({
      path: 'tests/e2e/screenshots/mix-page-after-search.png',
      fullPage: true,
    });

    // Verify we navigated to a mix page
    await expect(page).toHaveURL(/\/mix\/.+/);
  });

  test('should search case-insensitively', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Search with uppercase
    await searchInput.click();
    await searchInput.fill('CHRISTMAS');

    // Wait for results
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });

    // Verify results appear
    const resultsBox = page.locator('[role="listbox"]');
    await expect(resultsBox).toBeVisible();
  });

  test('should show "no results" message for non-existent search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Search for something that doesn't exist
    await searchInput.click();
    await searchInput.fill('xyz123nonexistent');

    // Wait a moment for search to process
    await page.waitForTimeout(500);

    // Take screenshot showing no results
    await page.screenshot({
      path: 'tests/e2e/screenshots/no-results.png',
      fullPage: true,
    });

    // Verify no results message appears
    await expect(page.getByText(/no results found/i)).toBeVisible();
  });

  test('should hide results when clicking outside', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Show results
    await searchInput.click();
    await searchInput.fill('2024');
    await page.waitForSelector('[role="listbox"]');

    // Verify results are visible
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    // Click outside (on body)
    await page.locator('body').click({ position: { x: 10, y: 10 } });

    // Wait a moment for event to process
    await page.waitForTimeout(300);

    // Verify results are hidden
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test('should clear results when input is cleared', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Show results
    await searchInput.click();
    await searchInput.fill('2024');
    await page.waitForSelector('[role="listbox"]');

    // Clear input
    await searchInput.clear();

    // Wait a moment
    await page.waitForTimeout(300);

    // Verify results are hidden
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Block the search-data.json request to simulate error
    await context.route('**/search-data.json', (route) => {
      route.abort();
    });

    // Navigate to page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to search
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);
    await searchInput.click();

    // Wait a moment
    await page.waitForTimeout(500);

    // Take screenshot showing error state
    await page.screenshot({
      path: 'tests/e2e/screenshots/search-error-state.png',
      fullPage: true,
    });

    // Verify error message appears
    await expect(page.getByText(/search is currently unavailable/i)).toBeVisible();
  });

  test('should search in track names and artists', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Search for a common word that might be in track names
    await searchInput.click();
    await searchInput.fill('bell');

    // Wait for results
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });

    // Take screenshot showing track matches
    await page.screenshot({
      path: 'tests/e2e/screenshots/track-search-results.png',
      fullPage: true,
    });

    // Verify results contain track information
    const resultsBox = page.locator('[role="listbox"]');
    await expect(resultsBox).toBeVisible();
  });

  test('accessibility - search component has proper ARIA attributes', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search mixes and tracks/i);

    // Verify search input has proper attributes
    await expect(searchInput).toHaveAttribute('role', 'search');
    await expect(searchInput).toHaveAttribute('aria-label');

    // Show results
    await searchInput.click();
    await searchInput.fill('2024');
    await page.waitForSelector('[role="listbox"]');

    // Verify results have proper ARIA structure
    const resultsBox = page.locator('[role="listbox"]');
    await expect(resultsBox).toBeVisible();

    const options = page.locator('[role="option"]');
    await expect(options.first()).toBeVisible();

    // Take screenshot showing accessible search interface
    await page.screenshot({
      path: 'tests/e2e/screenshots/accessible-search.png',
      fullPage: true,
    });
  });
});
