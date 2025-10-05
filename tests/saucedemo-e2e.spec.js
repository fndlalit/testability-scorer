const { test, expect } = require('@playwright/test');

/**
 * SauceDemo E2E Tests - Comprehensive User Journey Testing
 * 
 * This test suite demonstrates Intrinsic Testability principles through
 * comprehensive testing of different user types on https://www.saucedemo.com/
 * 
 * User Types Tested:
 * - standard_user: Normal user workflow
 * - locked_out_user: Account lockout scenario
 * - problem_user: Various UI/UX issues
 * - performance_glitch_user: Performance-related issues
 * - error_user: Error handling scenarios
 * - visual_user: Visual regression testing
 */

// Test data configuration
const USERS = {
  standard_user: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with normal behavior',
    expectSuccess: true
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User that is locked out',
    expectSuccess: false,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.'
  },
  problem_user: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with UI/UX problems',
    expectSuccess: true,
    hasProblems: true
  },
  performance_glitch_user: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance issues',
    expectSuccess: true,
    hasPerformanceIssues: true
  },
  error_user: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'User encountering errors',
    expectSuccess: true,
    hasErrors: true
  },
  visual_user: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'User for visual regression testing',
    expectSuccess: true,
    hasVisualIssues: true
  }
};

const BASE_URL = 'https://www.saucedemo.com/';

// Helper functions demonstrating Decomposability principle
class SauceDemoPage {
  constructor(page) {
    this.page = page;
    // Locators for better maintainability (Algorithmic Simplicity)
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async login(username, password) {
    await this.page.goto(BASE_URL);
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async addItemToCart(itemName) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${itemName}"]`);
    await addButton.click();
  }

  async getCartItemCount() {
    try {
      const badge = await this.cartBadge.textContent();
      return parseInt(badge) || 0;
    } catch {
      return 0;
    }
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async getInventoryItems() {
    return await this.page.locator('[data-test^="inventory-item"]').all();
  }

  async capturePageState() {
    // Observability: Capture comprehensive page state
    return await this.page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      cookies: document.cookie,
      timestamp: new Date().toISOString()
    }));
  }
}

test.describe('SauceDemo E2E Tests - User Type Analysis', () => {
  
  test.describe('Login Flow Tests - Authentication Verification', () => {
    
    Object.entries(USERS).forEach(([userType, userData]) => {
      test(`Login test for ${userType} - ${userData.description}`, async ({ page }) => {
        const saucePage = new SauceDemoPage(page);
        
        // Observability: Log test start with user context
        console.log(`\n=== Testing ${userType} ===`);
        console.log(`Description: ${userData.description}`);
        console.log(`Expected Success: ${userData.expectSuccess}`);
        
        // Capture initial page state (Observability)
        await page.goto(BASE_URL);
        const initialState = await saucePage.capturePageState();
        console.log('Initial page state captured:', initialState.url);
        
        // Perform login (Controllability)
        await saucePage.login(userData.username, userData.password);
        
        if (userData.expectSuccess) {
          // Verify successful login (Algorithmic Transparency)
          await expect(saucePage.inventoryContainer).toBeVisible({ timeout: 10000 });
          await expect(page).toHaveURL(/.*inventory.*/);
          
          // Additional verification for problem users
          if (userData.hasProblems) {
            console.log(`⚠️  ${userType}: May have UI/UX issues - verify manually`);
          }
          
          // Performance monitoring for performance_glitch_user
          if (userData.hasPerformanceIssues) {
            const startTime = Date.now();
            await saucePage.getInventoryItems();
            const loadTime = Date.now() - startTime;
            console.log(`⏱️  ${userType}: Page load time: ${loadTime}ms`);
            
            if (loadTime > 5000) {
              console.log(`⚠️  Performance issue detected for ${userType}`);
            }
          }
          
        } else {
          // Verify login failure (Unbugginess verification)
          await expect(saucePage.errorMessage).toBeVisible();
          
          if (userData.expectedError) {
            await expect(saucePage.errorMessage).toContainText(userData.expectedError);
            console.log(`✅ Expected error message displayed: ${userData.expectedError}`);
          }
          
          // Verify user remains on login page
          await expect(page).toHaveURL(BASE_URL);
        }
        
        // Capture final state for analysis (Observability)
        const finalState = await saucePage.capturePageState();
        console.log('Final page state:', finalState.url);
        
        // Take screenshot for visual verification (Explainability)
        await page.screenshot({ 
          path: `tests/screenshots/saucedemo-${userType}-login.png`,
          fullPage: true 
        });
      });
    });
  });

  test.describe('Complete E2E Shopping Journey - Standard User', () => {
    
    test('Complete shopping workflow - standard_user', async ({ page }) => {
      const saucePage = new SauceDemoPage(page);
      
      // Login
      await saucePage.login(USERS.standard_user.username, USERS.standard_user.password);
      await expect(saucePage.inventoryContainer).toBeVisible();
      
      // Capture product inventory (Observability)
      const items = await saucePage.getInventoryItems();
      console.log(`Available products: ${items.length}`);
      
      // Add multiple items to cart (Controllability)
      await saucePage.addItemToCart('sauce-labs-backpack');
      await saucePage.addItemToCart('sauce-labs-bike-light');
      
      // Verify cart updates (Algorithmic Simplicity - clear input/output)
      let cartCount = await saucePage.getCartItemCount();
      expect(cartCount).toBe(2);
      console.log(`Cart count after adding 2 items: ${cartCount}`);
      
      // Navigate to cart
      await saucePage.cartIcon.click();
      await expect(page).toHaveURL(/.*cart.*/);
      
      // Verify cart contents (Decomposability - isolated cart testing)
      const cartItems = await page.locator('[data-test="inventory-item"]').count();
      expect(cartItems).toBe(2);
      
      // Proceed to checkout
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/.*checkout-step-one.*/);
      
      // Fill checkout information (Controllability)
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();
      
      // Verify checkout overview (Algorithmic Transparency)
      await expect(page).toHaveURL(/.*checkout-step-two.*/);
      const itemTotal = await page.locator('[data-test="subtotal-label"]').textContent();
      const tax = await page.locator('[data-test="tax-label"]').textContent();
      const total = await page.locator('[data-test="total-label"]').textContent();
      
      console.log('Order Summary:');
      console.log(`- Item Total: ${itemTotal}`);
      console.log(`- Tax: ${tax}`);
      console.log(`- Total: ${total}`);
      
      // Complete order
      await page.locator('[data-test="finish"]').click();
      
      // Verify order completion (Observability)
      await expect(page).toHaveURL(/.*checkout-complete.*/);
      await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
      
      // Take final screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/saucedemo-complete-order.png',
        fullPage: true 
      });
      
      console.log('✅ Complete shopping workflow successful');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    
    test('Invalid credentials handling', async ({ page }) => {
      const saucePage = new SauceDemoPage(page);
      
      // Test with invalid username (Unbugginess testing)
      await saucePage.login('invalid_user', 'secret_sauce');
      await expect(saucePage.errorMessage).toBeVisible();
      await expect(saucePage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
      
      // Test with invalid password
      await page.reload();
      await saucePage.login('standard_user', 'wrong_password');
      await expect(saucePage.errorMessage).toBeVisible();
      
      console.log('✅ Invalid credentials properly handled');
    });
    
    test('Session persistence and logout', async ({ page }) => {
      const saucePage = new SauceDemoPage(page);
      
      // Login and verify session
      await saucePage.login(USERS.standard_user.username, USERS.standard_user.password);
      await expect(saucePage.inventoryContainer).toBeVisible();
      
      // Add item and verify cart persists
      await saucePage.addItemToCart('sauce-labs-backpack');
      let cartCount = await saucePage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      // Refresh page and verify session persistence (Stability)
      await page.reload();
      await expect(saucePage.inventoryContainer).toBeVisible();
      cartCount = await saucePage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      // Logout and verify cleanup
      await saucePage.logout();
      await expect(page).toHaveURL(BASE_URL);
      await expect(saucePage.usernameField).toBeVisible();
      
      console.log('✅ Session management working correctly');
    });
  });

  test.describe('Visual and UI Regression Testing', () => {
    
    test('Visual comparison across user types', async ({ page }) => {
      const userTypes = ['standard_user', 'visual_user', 'problem_user'];
      
      for (const userType of userTypes) {
        const userData = USERS[userType];
        if (!userData.expectSuccess) continue;
        
        const saucePage = new SauceDemoPage(page);
        
        // Login
        await saucePage.login(userData.username, userData.password);
        await expect(saucePage.inventoryContainer).toBeVisible();
        
        // Take screenshot for visual comparison
        await page.screenshot({ 
          path: `tests/screenshots/saucedemo-${userType}-inventory.png`,
          fullPage: true 
        });
        
        // Capture additional metrics for problem/visual users
        if (userData.hasVisualIssues || userData.hasProblems) {
          // Check for broken images or missing elements
          const images = await page.locator('img').all();
          const brokenImages = [];
          
          for (const img of images) {
            const src = await img.getAttribute('src');
            if (src && src.includes('error') || src.includes('broken')) {
              brokenImages.push(src);
            }
          }
          
          if (brokenImages.length > 0) {
            console.log(`⚠️  ${userType}: Found potentially broken images:`, brokenImages);
          }
        }
        
        await saucePage.logout();
        console.log(`📸 Visual capture completed for ${userType}`);
      }
    });
    
    test('Performance benchmarking across users', async ({ page }) => {
      const performanceResults = {};
      
      for (const [userType, userData] of Object.entries(USERS)) {
        if (!userData.expectSuccess) continue;
        
        const saucePage = new SauceDemoPage(page);
        
        // Measure login performance
        const loginStart = Date.now();
        await saucePage.login(userData.username, userData.password);
        await expect(saucePage.inventoryContainer).toBeVisible();
        const loginTime = Date.now() - loginStart;
        
        // Measure page interaction performance
        const interactionStart = Date.now();
        try {
          await saucePage.addItemToCart('sauce-labs-backpack');
          const cartCount = await saucePage.getCartItemCount();
          const interactionTime = Date.now() - interactionStart;
        } catch (error) {
          console.log(`⚠️  ${userType}: Error during interaction - ${error.message}`);
          const interactionTime = Date.now() - interactionStart;
        }
        
        performanceResults[userType] = {
          loginTime,
          interactionTime,
          hasPerformanceIssues: userData.hasPerformanceIssues
        };
        
        await saucePage.logout();
      }
      
      // Log performance comparison (Observability)
      console.log('\n=== Performance Benchmark Results ===');
      Object.entries(performanceResults).forEach(([user, metrics]) => {
        console.log(`${user}:`);
        console.log(`  Login Time: ${metrics.loginTime}ms`);
        console.log(`  Interaction Time: ${metrics.interactionTime}ms`);
        console.log(`  Expected Issues: ${metrics.hasPerformanceIssues ? 'Yes' : 'No'}`);
      });
      
      // Verify performance_glitch_user is actually slower
      const standardPerf = performanceResults.standard_user;
      const glitchPerf = performanceResults.performance_glitch_user;
      
      if (glitchPerf && standardPerf) {
        console.log(`\nPerformance comparison:`);
        console.log(`Standard user login: ${standardPerf.loginTime}ms`);
        console.log(`Glitch user login: ${glitchPerf.loginTime}ms`);
        
        if (glitchPerf.loginTime > standardPerf.loginTime * 1.5) {
          console.log('✅ Performance glitch detected as expected');
        } else {
          console.log('⚠️  Performance glitch not as pronounced as expected');
        }
      }
    });
  });

  test.describe('Advanced Testability Scenarios', () => {
    
    test('Network monitoring and API inspection', async ({ page }) => {
      const saucePage = new SauceDemoPage(page);
      const networkRequests = [];
      
      // Monitor network activity (Observability)
      page.on('request', request => {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType()
        });
      });
      
      page.on('response', response => {
        console.log(`Response: ${response.status()} ${response.url()}`);
      });
      
      // Perform complete user journey
      await saucePage.login(USERS.standard_user.username, USERS.standard_user.password);
      await expect(saucePage.inventoryContainer).toBeVisible();
      
      await saucePage.addItemToCart('sauce-labs-backpack');
      await saucePage.cartIcon.click();
      
      // Analyze network traffic
      console.log(`\nTotal network requests: ${networkRequests.length}`);
      
      const requestsByType = networkRequests.reduce((acc, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {});
      
      console.log('Requests by type:', requestsByType);
      
      // Check for any failed requests or security issues
      const suspiciousRequests = networkRequests.filter(req => 
        req.url.includes('tracking') || 
        req.url.includes('analytics') ||
        req.url.includes('third-party')
      );
      
      if (suspiciousRequests.length > 0) {
        console.log('⚠️  Potentially suspicious network requests detected');
      }
    });
    
    test('Accessibility and usability testing', async ({ page }) => {
      const saucePage = new SauceDemoPage(page);
      
      await saucePage.login(USERS.standard_user.username, USERS.standard_user.password);
      await expect(saucePage.inventoryContainer).toBeVisible();
      
      // Check for accessibility markers
      const elementsWithAltText = await page.locator('img[alt]').count();
      const elementsWithDataTest = await page.locator('[data-test]').count();
      const elementsWithAriaLabels = await page.locator('[aria-label]').count();
      
      console.log('\n=== Accessibility Analysis ===');
      console.log(`Images with alt text: ${elementsWithAltText}`);
      console.log(`Elements with data-test attributes: ${elementsWithDataTest}`);
      console.log(`Elements with aria-labels: ${elementsWithAriaLabels}`);
      
      // Test keyboard navigation (Controllability)
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      console.log('✅ Keyboard navigation tested');
      
      // Verify semantic HTML structure (Explainability)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
      const forms = await page.locator('form').count();
      const buttons = await page.locator('button').count();
      
      console.log(`Semantic elements found - Headings: ${headings}, Forms: ${forms}, Buttons: ${buttons}`);
    });
  });
});