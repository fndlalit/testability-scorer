// ai-test-utils.js
/**
 * AI-Enhanced Testing Utilities for Playwright
 * These utilities leverage Playwright's latest AI features for smarter testing
 */

class AITestUtils {
  /**
   * Smart locator that uses AI-powered element detection
   * @param {import('@playwright/test').Page} page 
   * @param {string} description - Natural language description of the element
   * @returns {import('@playwright/test').Locator}
   */
  static smartLocator(page, description) {
    const desc = description.toLowerCase();
    
    // Enhanced strategies for form fields
    if (desc.includes('username') || desc.includes('user name')) {
      return page.locator('[data-test="username"], input[name="username"], input[name="user-name"], input[placeholder*="username" i], input[id*="username" i]').first();
    }
    
    if (desc.includes('password')) {
      return page.locator('[data-test="password"], input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    }
    
    if (desc.includes('login') && desc.includes('button')) {
      return page.locator('[data-test="login-button"], button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first();
    }
    
    // Use getByRole with AI-enhanced fallbacks
    const strategies = [
      () => page.getByRole('button', { name: new RegExp(description, 'i') }),
      () => page.getByRole('link', { name: new RegExp(description, 'i') }),
      () => page.getByRole('textbox', { name: new RegExp(description, 'i') }),
      () => page.getByLabel(new RegExp(description, 'i')),
      () => page.getByPlaceholder(new RegExp(description, 'i')),
      () => page.getByText(new RegExp(description, 'i')),
      () => page.getByTestId(description.toLowerCase().replace(/\s+/g, '-')),
      () => page.locator(`[aria-label*="${description}" i]`),
      () => page.locator(`[title*="${description}" i]`),
      () => page.locator(`[alt*="${description}" i]`)
    ];

    for (const strategy of strategies) {
      try {
        const locator = strategy();
        if (locator) return locator;
      } catch (error) {
        // Continue to next strategy
      }
    }
    
    // Fallback to text-based search
    return page.locator(`text=${description}`).first();
  }

  /**
   * AI-powered form filling with smart field detection
   * @param {import('@playwright/test').Page} page 
   * @param {Object} formData - Key-value pairs for form fields
   */
  static async smartFillForm(page, formData) {
    for (const [fieldName, value] of Object.entries(formData)) {
      const field = this.smartLocator(page, fieldName);
      await field.waitFor({ state: 'visible' });
      await field.fill(value);
    }
  }

  /**
   * Enhanced wait for page readiness with AI insights
   * @param {import('@playwright/test').Page} page 
   * @param {Object} options - Wait options
   */
  static async waitForPageReady(page, options = {}) {
    const { timeout = 30000, checkInterval = 100 } = options;
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
    
    // Wait for no ongoing animations
    await page.waitForFunction(() => {
      const animations = document.getAnimations();
      return animations.length === 0 || animations.every(anim => anim.playState === 'finished');
    }, { timeout });
    
    // Check for loading indicators
    await page.waitForFunction(() => {
      const loadingElements = document.querySelectorAll(
        '[class*="loading"], [class*="spinner"], [aria-label*="loading" i]'
      );
      return Array.from(loadingElements).every(el => 
        getComputedStyle(el).display === 'none' || 
        getComputedStyle(el).visibility === 'hidden'
      );
    }, { timeout });
  }

  /**
   * AI-enhanced screenshot with automatic naming and metadata
   * @param {import('@playwright/test').Page} page 
   * @param {string} testName 
   * @param {string} step 
   */
  static async smartScreenshot(page, testName, step) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${step}-${timestamp}.png`;
    
    await page.screenshot({
      path: `tests/screenshots/${filename}`,
      fullPage: true,
      animations: 'disabled'
    });
    
    return filename;
  }

  /**
   * Enhanced error handling with AI-powered debugging hints
   * @param {Error} error 
   * @param {import('@playwright/test').Page} page 
   * @param {string} context 
   */
  static async enhancedErrorHandling(error, page, context) {
    console.log(`🤖 AI Debug Assistant for: ${context}`);
    console.log(`Error: ${error.message}`);
    
    // Capture debug information
    const url = page.url();
    const title = await page.title().catch(() => 'Unknown');
    
    // Suggest debugging strategies based on error type
    const suggestions = this.getDebugSuggestions(error, url);
    
    console.log(`Current URL: ${url}`);
    console.log(`Page Title: ${title}`);
    console.log(`🔍 Debugging Suggestions:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion}`);
    });
    
    // Take screenshot for analysis
    await this.smartScreenshot(page, 'error', context);
    
    throw error;
  }

  /**
   * Generate AI-powered debugging suggestions
   * @param {Error} error 
   * @param {string} url 
   * @returns {string[]}
   */
  static getDebugSuggestions(error, url) {
    const suggestions = [];
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('timeout')) {
      suggestions.push('Element may be loading slowly - try increasing timeout or wait for specific conditions');
      suggestions.push('Check if there are any network requests still pending');
      suggestions.push('Verify the element selector is correct and specific enough');
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('not visible')) {
      suggestions.push('Element selector might be incorrect - try using data-testid or more specific locators');
      suggestions.push('Element might be hidden behind another element or in a different iframe');
      suggestions.push('Wait for the element to appear before interacting with it');
    }
    
    if (errorMessage.includes('navigation')) {
      suggestions.push('Check if the URL is correct and accessible');
      suggestions.push('Verify network connectivity and server availability');
      suggestions.push('Look for redirects or authentication requirements');
    }
    
    if (url.includes('saucedemo')) {
      suggestions.push('For SauceDemo: Ensure user credentials are correct for the test user type');
      suggestions.push('Check if the user account is locked or has specific limitations');
    }
    
    return suggestions;
  }

  /**
   * Smart element interaction with retry logic
   * @param {import('@playwright/test').Locator} locator 
   * @param {string} action 
   * @param {any} value 
   * @param {Object} options 
   */
  static async smartInteract(locator, action, value = null, options = {}) {
    const maxRetries = options.retries || 3;
    const retryDelay = options.delay || 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        
        switch (action) {
          case 'click':
            await locator.click(options);
            break;
          case 'fill':
            await locator.fill(value, options);
            break;
          case 'select':
            await locator.selectOption(value, options);
            break;
          case 'check':
            await locator.check(options);
            break;
          case 'uncheck':
            await locator.uncheck(options);
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        
        return; // Success
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to ${action} after ${maxRetries} attempts: ${error.message}`);
        }
        
        console.log(`Attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
}

module.exports = { AITestUtils };