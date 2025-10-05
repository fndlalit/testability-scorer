const { test, expect } = require('@playwright/test');

/**
 * Basic Playwright Test Example
 * This test demonstrates fundamental Playwright capabilities
 * and incorporates principles of Intrinsic Testability
 */
test.describe('Basic Web Navigation Tests', () => {
  
  test('should navigate to a website and verify title', async ({ page }) => {
    // Navigate to a public demo site
    await page.goto('https://example.com');
    
    // Verify page title (Observability)
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Take a screenshot for visual verification (Observability)
    await page.screenshot({ path: 'tests/screenshots/example-homepage.png' });
  });

  test('should interact with page elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for page to load (Controllability)
    await page.waitForLoadState('networkidle');
    
    // Verify main heading is visible (Observability)
    const heading = page.getByRole('heading', { name: /Playwright/i });
    await expect(heading).toBeVisible();
    
    // Click on "Get started" link if it exists (Controllability)
    const getStartedLink = page.getByRole('link', { name: /get started/i }).first();
    if (await getStartedLink.isVisible()) {
      await getStartedLink.click();
      
      // Verify navigation occurred (Observability)
      await expect(page).toHaveURL(/.*docs.*/);
    }
  });

  test('should handle form interactions', async ({ page }) => {
    // Go to a form demo page
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Fill in form fields (Controllability)
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    
    // Submit form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Verify successful login (Observability)
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    
    // Verify URL change (Observability)
    await expect(page).toHaveURL(/.*secure.*/);
  });

  test('should capture network activity', async ({ page }) => {
    // Monitor network requests (Observability)
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    });
    
    await page.goto('https://jsonplaceholder.typicode.com/');
    
    // Wait for any AJAX requests to complete
    await page.waitForLoadState('networkidle');
    
    // Verify some responses were captured
    expect(responses.length).toBeGreaterThan(0);
    
    // Log responses for debugging (Observability)
    console.log('Captured responses:', responses.slice(0, 3));
  });
});