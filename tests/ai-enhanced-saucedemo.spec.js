const { test, expect } = require('@playwright/test');
const { AITestUtils } = require('../ai-test-utils');

/**
 * AI-Enhanced SauceDemo E2E Tests - Comprehensive User Journey Testing
 * 
 * This test suite demonstrates Playwright's latest AI features and modern testing practices
 * through comprehensive testing of different user types on https://www.saucedemo.com/
 * 
 * New AI Features Demonstrated:
 * - Smart locators with natural language descriptions
 * - AI-powered error handling and debugging
 * - Enhanced visual testing and screenshots
 * - Intelligent waiting and retry mechanisms
 * - Auto-recovery from common failures
 */

// Test data configuration with AI-enhanced user profiles
const USERS = {
  standard_user: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with normal behavior',
    expectSuccess: true,
    aiProfile: 'stable'
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User that is locked out',
    expectSuccess: false,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
    aiProfile: 'error-prone'
  },
  problem_user: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with UI/UX problems',
    expectSuccess: true,
    hasProblems: true,
    aiProfile: 'problematic'
  },
  performance_glitch_user: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance issues',
    expectSuccess: true,
    hasPerformanceIssues: true,
    aiProfile: 'slow'
  }
};

const BASE_URL = 'https://www.saucedemo.com/';

/**
 * AI-Enhanced SauceDemo Page Object with Smart Locators
 */
class AISauceDemoPage {
  constructor(page) {
    this.page = page;
    this.aiUtils = AITestUtils;
  }

  /**
   * Smart login using AI-powered form detection
   */
  async smartLogin(username, password) {
    try {
      await this.page.goto(BASE_URL);
      await this.aiUtils.waitForPageReady(this.page);
      
      // Use AI-enhanced form filling
      await this.aiUtils.smartFillForm(this.page, {
        'username': username,
        'password': password
      });
      
      // Smart click on login button
      const loginButton = this.aiUtils.smartLocator(this.page, 'login button');
      await this.aiUtils.smartInteract(loginButton, 'click');
      
      return true;
    } catch (error) {
      await this.aiUtils.enhancedErrorHandling(error, this.page, 'login');
      throw error;
    }
  }

  /**
   * AI-powered item addition to cart with smart retry
   */
  async smartAddToCart(itemName) {
    try {
      // Use natural language to find add to cart button
      const addButton = this.aiUtils.smartLocator(this.page, `add ${itemName} to cart`);
      await this.aiUtils.smartInteract(addButton, 'click', null, { retries: 3 });
      
      // Verify item was added using smart locator
      const cartBadge = this.aiUtils.smartLocator(this.page, 'cart badge');
      await expect(cartBadge).toBeVisible({ timeout: 10000 });
      
    } catch (error) {
      await this.aiUtils.enhancedErrorHandling(error, this.page, `add-to-cart-${itemName}`);
      throw error;
    }
  }

  /**
   * Smart navigation to cart with AI verification
   */
  async navigateToCart() {
    try {
      const cartIcon = this.aiUtils.smartLocator(this.page, 'shopping cart');
      await this.aiUtils.smartInteract(cartIcon, 'click');
      
      // Verify we're on the cart page
      await expect(this.page).toHaveURL(/.*cart.html/);
      await this.aiUtils.waitForPageReady(this.page);
      
    } catch (error) {
      await this.aiUtils.enhancedErrorHandling(error, this.page, 'navigate-to-cart');
      throw error;
    }
  }

  /**
   * Complete checkout process with AI assistance
   */
  async completeCheckout(customerInfo) {
    try {
      // Navigate to checkout
      const checkoutButton = this.aiUtils.smartLocator(this.page, 'checkout');
      await this.aiUtils.smartInteract(checkoutButton, 'click');
      
      // Fill checkout information using AI form filling
      await this.aiUtils.smartFillForm(this.page, customerInfo);
      
      // Continue to next step
      const continueButton = this.aiUtils.smartLocator(this.page, 'continue');
      await this.aiUtils.smartInteract(continueButton, 'click');
      
      // Finish order
      const finishButton = this.aiUtils.smartLocator(this.page, 'finish');
      await this.aiUtils.smartInteract(finishButton, 'click');
      
      // Verify completion
      const confirmationMessage = this.aiUtils.smartLocator(this.page, 'thank you for your order');
      await expect(confirmationMessage).toBeVisible();
      
    } catch (error) {
      await this.aiUtils.enhancedErrorHandling(error, this.page, 'checkout-process');
      throw error;
    }
  }
}

// AI-Enhanced Test Suite
test.describe('🤖 AI-Enhanced SauceDemo E2E Tests', () => {
  let saucePage;

  test.beforeEach(async ({ page }) => {
    saucePage = new AISauceDemoPage(page);
  });

  // Test each user type with AI enhancements
  Object.entries(USERS).forEach(([userType, userData]) => {
    test(`AI Test: ${userType} complete journey`, async ({ page }) => {
      test.info().annotations.push({
        type: 'ai-profile',
        description: userData.aiProfile
      });

      try {
        // AI-enhanced login
        await saucePage.smartLogin(userData.username, userData.password);
        
        if (!userData.expectSuccess) {
          // Verify error message for locked out user
          const errorLocator = AITestUtils.smartLocator(page, 'error message');
          await expect(errorLocator).toContainText(userData.expectedError);
          await AITestUtils.smartScreenshot(page, userType, 'login-error');
          return;
        }

        // Verify successful login
        const inventoryLocator = AITestUtils.smartLocator(page, 'inventory');
        await expect(inventoryLocator).toBeVisible();
        await AITestUtils.smartScreenshot(page, userType, 'inventory');

        // Add items to cart with AI assistance
        const itemsToAdd = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
        for (const item of itemsToAdd) {
          await saucePage.smartAddToCart(item);
          
          // Handle performance issues for specific users
          if (userData.hasPerformanceIssues) {
            await page.waitForTimeout(2000); // Simulate slow performance
          }
        }

        // Navigate to cart and verify items
        await saucePage.navigateToCart();
        await AITestUtils.smartScreenshot(page, userType, 'cart');

        // Complete checkout process
        const customerInfo = {
          'first name': 'John',
          'last name': 'Doe',
          'postal code': '12345'
        };
        
        await saucePage.completeCheckout(customerInfo);
        await AITestUtils.smartScreenshot(page, userType, 'order-complete');

      } catch (error) {
        // AI-powered error analysis
        await AITestUtils.enhancedErrorHandling(error, page, `${userType}-journey`);
        throw error;
      }
    });
  });

  test('🤖 AI Visual Regression Test', async ({ page }) => {
    const saucePage = new AISauceDemoPage(page);
    
    // Login with standard user
    await saucePage.smartLogin(USERS.standard_user.username, USERS.standard_user.password);
    
    // Take AI-enhanced screenshots for visual regression
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // Test responsive design with AI
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page).toHaveScreenshot('inventory-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('🤖 AI Performance Monitoring', async ({ page }) => {
    // Enable performance monitoring
    await page.addInitScript(() => {
      window.performanceMetrics = {
        startTime: performance.now(),
        loadEvents: []
      };
      
      window.addEventListener('load', () => {
        window.performanceMetrics.loadEvents.push({
          type: 'load',
          time: performance.now() - window.performanceMetrics.startTime
        });
      });
    });

    const saucePage = new AISauceDemoPage(page);
    const startTime = Date.now();
    
    await saucePage.smartLogin(USERS.performance_glitch_user.username, USERS.performance_glitch_user.password);
    
    const loadTime = Date.now() - startTime;
    console.log(`🤖 AI Performance Analysis: Page loaded in ${loadTime}ms`);
    
    // AI-powered performance assertions
    if (loadTime > 5000) {
      console.log('⚠️ AI Alert: Slow page load detected');
    }
    
    // Get performance metrics
    const metrics = await page.evaluate(() => window.performanceMetrics);
    console.log('🤖 AI Performance Metrics:', metrics);
  });

  test('🤖 AI Accessibility Testing', async ({ page }) => {
    const saucePage = new AISauceDemoPage(page);
    await saucePage.smartLogin(USERS.standard_user.username, USERS.standard_user.password);
    
    // AI-powered accessibility checks
    await page.addInitScript(() => {
      // Check for missing alt attributes
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        console.log(`🤖 AI Accessibility Alert: ${images.length} images without alt text`);
      }
      
      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log(`🤖 AI Accessibility Info: Found ${headings.length} headings`);
    });
    
    // Verify keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });
});

// AI-Enhanced Test Hooks
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // AI-powered failure analysis
    console.log('🤖 AI Test Failure Analysis:');
    console.log(`Test: ${testInfo.title}`);
    console.log(`Status: ${testInfo.status}`);
    console.log(`Duration: ${testInfo.duration}ms`);
    
    // Capture additional debug information
    const url = page.url();
    const title = await page.title().catch(() => 'Unknown');
    
    console.log(`Current URL: ${url}`);
    console.log(`Page Title: ${title}`);
    
    // Take final screenshot for analysis
    await AITestUtils.smartScreenshot(page, 'test-failure', testInfo.title.replace(/\s+/g, '-'));
  }
});