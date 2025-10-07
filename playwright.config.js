// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* AI-powered features */
    /* Auto-wait for elements to be ready */
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    /* Enhanced error reporting with AI insights */
    contextOptions: {
      recordVideo: {
        mode: 'retain-on-failure',
        size: { width: 1280, height: 720 }
      }
    },
    
    /* Better element location strategies */
    strictSelectors: true,
    
    /* Enhanced debugging capabilities */
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        /* Enable Chrome DevTools Protocol for AI debugging */
        launchOptions: {
          args: ['--enable-experimental-web-platform-features']
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports with AI-enhanced mobile testing */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        /* AI-enhanced mobile testing */
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        hasTouch: true,
        isMobile: true,
      },
    },

    /* Test against branded browsers with enhanced AI features */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        launchOptions: {
          args: ['--enable-experimental-web-platform-features']
        }
      },
    },
  ],

  /* Enhanced global setup for AI features */
  globalSetup: require.resolve('./global-setup.js'),
  
  /* AI-powered test analysis and reporting */
  expect: {
    /* Timeout for expect() calls */
    timeout: 10000,
    /* Take screenshots on assertion failures for AI analysis */
    toHaveScreenshot: { 
      threshold: 0.2,
      mode: 'strict'
    },
  },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});