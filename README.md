# Automated Scorer for Intrinsic Testability 

# Disclaimer:

This is work-in-progress project by  [Lalitkumar Bhamare](https://www.linkedin.com/in/lalitkumarbhamare/) and [Samer Naqvie](https://www.linkedin.com/in/samer-naqvi/),  primarily created for their interactive workshop on Software Testability. Key purpose of this project is to introduce the participants to the idea behind Intrinsic Testability as explained by [James Bach](https://www.linkedin.com/in/james-bach-6188a811/) and [Michael Bolton](https://www.linkedin.com/in/michael-bolton-08847/)in [Heuristics for Software Testability](https://www.satisfice.com/download/heuristics-of-software-testability) And then to extend that understanding for writing automated checks for high level testability assessment of the SUT (System Under Test).

Readers are strongly encouraged to develop deeper understanding of Software Testability before utilizing this project for any further use. Scripts used and scoring mechanism defined in the project files are for demonstration purpose only. Watch out for some AI slop. A careful review, context-appropriate adaption and further development of the scripts/set-up is strongly recommended.

This is a Playwright testing setup that demonstrates the **10 Principles of Intrinsic Testability** through automated checking examples.

## What is Intrinsic Testability?

Intrinsic Testability refers to how easy it is to test software based on its nature itself, its inherent design/behaviour characteristics. As defined originally in "Heuristics of Software Testability" by Bach/Bolton, Intrinsic Testability can be explained further through - 

- Observability. We must see the product. Ideally, we want a completely transparent product, where every fact about its states and behavior, including the history of those facts is readily available to us. 

- Controllability. We must be able to visit the behavior of the product. Ideally, we can provide any possible input and invoke any possible state, combination of states, or sequence of states on demand, easily and immediately. Any non-deterministic behavior of the product detracts from testability. 

- Algorithmic Simplicity. We must be able to visit and assess the relationships between inputs and outputs. The more complex and sensitive the behavior of the product, the more we will need to look at. 

- Algorithmic Transparency. If no one knows how the product produces its output (as is typical with machine learning systems), we will need to sample much more of the input and output space to test it well. 

- Algorithmic Stability. If changes to the product can be made without radically disturbing its logic, then past test results will not have to be thrown out with every tiny modification. Although any system might suffer with instability, it is especially a problem in machine learning. 

- Explainability. We must understand the design of the product as much as we can. A product that behaves in a manner that is explainable to outsiders is going to be easier to test. “Explainability” is also a hot topic in AI. 

- Unbugginess. Bugs slow down testing because we must stop and report them, or work around them, or in the case of blocking bugs, wait until they get fixed. It’s easiest to test when there are no bugs. 

- Smallness. The less there is of a product, the less we have to look at and the less chance of bugs due to interactions among product components. This also applies to the amount of output we must review. 

- Decomposability. When different parts of a product can be separated from each other, we have an easier time focusing our testing, investigating bugs, and retesting after changes.

- Similarity (to known and trusted technology). The more a product is like other products we already know the easier it is to test it. If the product shares substantial code with a trusted product, or is based on a trusted framework, that’s especially good.


In context of the demo application used during the tutorial, this project defines all 10 principles as:

1. **Observability** - Complete transparency of product states and behavior
2. **Controllability** - Ability to provide any input and invoke any state on demand  
3. **Algorithmic Simplicity** - Clear, assessable relationships between inputs and outputs
4. **Algorithmic Transparency** - Understanding how the product produces its output
5. **Algorithmic Stability** - Changes don't radically disturb the logic
6. **Explainability** - Design is understandable to outsiders
7. **Unbugginess** - Minimal bugs that would slow down testing
8. **Smallness** - Less product means less to examine and fewer interaction bugs
9. **Decomposability** - Parts can be separated for focused testing
10. **Similarity** - Resemblance to known and trusted technology

## Project Structure

```
├── tests/
│   ├── basic-web-tests.spec.js    # Basic Playwright examples
│   ├── testability-principles.spec.js  # Intrinsic testability demonstrations
│   ├── saucedemo-e2e.spec.js      # SauceDemo comprehensive E2E tests
│   ├── testability-scorer.spec.js # Full testability scoring framework
│   ├── quick-testability-scorer.spec.js # Quick testability assessment
│   ├── reports/                   # Generated scoring reports
│   └── screenshots/               # Test screenshot outputs
├── package.json                   # Project dependencies
├── playwright.config.js           # Playwright configuration
├── run-testability-scorer.js      # Testability scoring runner script
├── SAUCEDEMO_TESTS.md             # Detailed SauceDemo test documentation
├── TESTABILITY_SCORING_GUIDE.md   # Comprehensive scoring framework guide
└── README.md                      # This file
```

## Prerequisites

- Node.js 18+ installed
- npm package manager

## Setup Instructions

1. **Clone/Navigate to Project Directory**
   ```bash
   cd "Demo Swag Labs"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

4. **Install System Dependencies (if needed)**
   ```bash
   npx playwright install-deps
   ```

## Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests with browser visible (headed mode)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Testability Scoring
```bash
# Quick testability assessment (recommended)
npx playwright test quick-testability-scorer.spec.js --project=chromium

# Comprehensive testability scoring
npx playwright test testability-scorer.spec.js --workers=1

# Easy runner commands
node run-testability-scorer.js score     # Quick assessment
node run-testability-scorer.js report    # View score history
node run-testability-scorer.js help      # Show all options
```

### Specific Test Files
```bash
# Run basic web tests only
npx playwright test basic-web-tests.spec.js

# Run testability principle demonstrations
npx playwright test testability-principles.spec.js

# Run SauceDemo E2E tests
npx playwright test saucedemo-e2e.spec.js

# Run specific SauceDemo test categories
npx playwright test saucedemo-e2e.spec.js --grep="Login Flow Tests"
npx playwright test saucedemo-e2e.spec.js --grep="Visual and UI Regression"
```

### Test Reports
```bash
# Show test report
npm run test:report
```

## 📊 Interactive HTML Reports

This project generates **comprehensive interactive HTML reports** with visual charts, detailed breakdowns, and AI-powered recommendations for testability assessment. These reports provide an intuitive way to understand your application's testability across all 10 principles.

### 🎯 HTML Report Features
- **Interactive Charts**: Visual representation of testability scores using Chart.js
- **10-Principle Analysis**: Detailed breakdown of each testability principle
- **AI Recommendations**: Smart suggestions for improvement powered by Playwright 1.49.0
- **User Comparisons**: Side-by-side analysis of different user types
- **Detailed Metrics**: 35+ sub-measurements per analysis
- **Professional Layout**: Conference and presentation-ready output
- **Auto-Browser Opening**: Reports automatically open in your default browser

### 🚀 HTML Report Commands

#### Complete Analysis
```bash
# Complete analysis with HTML reports
npm run testability:complete
```
Runs comprehensive 10-principle analysis for all SauceDemo user types and generates interactive HTML report.

#### Detailed Analysis
```bash
# Detailed individual principle analysis
npm run testability:detailed
```
Performs deep-dive analysis for standard user with detailed metrics and generates HTML report.

#### Comparative Analysis
```bash
# Compare all user types
npm run testability:comparison
```
Side-by-side comparison of different user types with HTML visualization.

#### Focused Analysis
```bash
# Focus on observability testing
npm run testability:observability
```
Specialized analysis focusing on observability principle with detailed HTML breakdown.

#### AI-Enhanced Analysis
```bash
# AI-enhanced analysis
npm run testability:ai
```
Advanced analysis using Playwright's AI capabilities with smart recommendations.

#### Quick Report Generation
```bash
# Quick HTML report generation
npm run report:html
```
Fast HTML report generation with automatic browser opening.

#### All Tests with Reports
```bash
# Run ALL tests in complete-10-principle-testability.spec.js with HTML report
npm run testability:all-tests
```
Executes all testability tests and generates comprehensive HTML report with full analysis.

#### 🚨 Testability Failure Examples (Conference Demonstrations)
```bash
# Run problematic user tests for learning opportunities
npm run testability:failures

# Demo version with slow motion for presentations
npm run testability:failures-demo
```
**Perfect for conference presentations!** These tests demonstrate real testability challenges with:
- **performance_glitch_user**: Performance and timing issues
- **error_user**: Error handling challenges  
- **visual_user**: Visual consistency problems

Shows how different failure types map to specific testability principles.

### 📂 Report Storage
HTML reports are automatically saved to:
```
tests/reports/testability-report-YYYY-MM-DDTHH-MM-SS-sssZ.html
```

### 🌐 Online Report Viewing
Access interactive reports online via GitHub Pages:
```
https://fndlalit.github.io/testability-scorer/
```

### 💡 Using HTML Reports
1. **Run any testability command** - Reports generate automatically
2. **Browser opens automatically** - No manual file opening needed  
3. **Analyze results** - Interactive charts show scores and trends
4. **Review AI recommendations** - Get smart suggestions for improvements
5. **Share with team** - Professional reports ready for presentations

### 📈 Report Content Overview
Each HTML report includes:
- **Overall Testability Score** (0-100 scale)
- **Individual Principle Scores** with color-coded indicators
- **Detailed Sub-Metrics** for each principle
- **AI-Generated Recommendations** with reasoning
- **Visual Charts** showing score distributions
- **User Type Comparisons** (when applicable)
- **Historical Context** and improvement suggestions

## Test Files Description

### `basic-web-tests.spec.js`
Demonstrates fundamental Playwright capabilities:
- Basic navigation and title verification
- Page element interactions
- Form handling
- Network monitoring

### `quick-testability-scorer.spec.js`
Rapid assessment framework that scores applications against core testability principles:
- **5 Core Principles**: Observability, Controllability, Algorithmic Simplicity, Explainability, Decomposability
- **Quantitative Scoring**: 0-100 scale with letter grades (A-F)
- **User Comparison**: Side-by-side testability analysis across user types
- **Progress Tracking**: Historical scoring for improvement measurement
- **Actionable Recommendations**: Specific guidance for testability improvements

### `testability-scorer.spec.js`
Comprehensive assessment framework covering all 10 Intrinsic Testability principles:
- **Complete Coverage**: All 10 principles with detailed sub-metrics
- **Deep Analysis**: Network monitoring, performance measurement, accessibility testing
- **Benchmarking**: Cross-browser and cross-user type comparison
- **Report Generation**: JSON and text reports for historical tracking

### `saucedemo-e2e.spec.js`
Comprehensive E2E tests for https://www.saucedemo.com/ demonstrating all Intrinsic Testability principles:
- **6 User Types**: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user
- **Complete Workflows**: Login → Shopping → Checkout → Order completion
- **Error Handling**: Invalid credentials, account lockouts, application errors
- **Performance Analysis**: Timing measurements across user types
- **Visual Regression**: Cross-user UI comparison and broken element detection
- **Network Monitoring**: API call tracking and security analysis
- **Accessibility Testing**: Data attributes, keyboard navigation, semantic HTML

### `testability-principles.spec.js`
Shows how Playwright supports each of the 10 Intrinsic Testability principles:
- **Observability**: State inspection and logging
- **Controllability**: Precise input control
- **Algorithmic Simplicity**: Clear input-output testing
- **Algorithmic Transparency**: Understanding system behavior
- **Decomposability**: Isolated component testing
- **Smallness**: Focused, minimal interactions
- **Unbugginess**: Error-free interaction patterns
- **Stability**: Consistent behavior verification

## Configuration

The `playwright.config.js` file includes:
- Multi-browser testing (Chromium, Firefox, WebKit)
- Screenshot and video capture on failures
- Trace collection for debugging
- HTML reporting
- Parallel test execution

## Key Features

- **Cross-browser Testing**: Tests run on Chromium, Firefox, and WebKit
- **Visual Testing**: Automatic screenshots on failures
- **Network Monitoring**: Capture and analyze network requests
- **Debugging Support**: Built-in debugging and trace viewer
- **CI/CD Ready**: Configured for continuous integration environments

## Learning Objectives

By exploring this project, you'll understand:
1. How to write effective Playwright tests
2. The relationship between test automation and software testability
3. Practical applications of Intrinsic Testability principles
4. Best practices for observable and controllable test automation

## Demo Sites Used

This project uses publicly available demo sites:
- **[SauceDemo](https://www.saucedemo.com/)** - Primary E2E testing application with multiple user types
- [The Internet](https://the-internet.herokuapp.com/) - Herokuapp testing playground
- [Example.com](https://example.com) - Simple demonstration site
- [Playwright.dev](https://playwright.dev) - Official Playwright documentation
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - REST API testing

## SauceDemo Test Coverage

The comprehensive SauceDemo test suite includes:

### User Types Tested
- **standard_user**: Normal functionality baseline
- **locked_out_user**: Account lockout scenarios
- **problem_user**: UI/UX issue detection
- **performance_glitch_user**: Performance monitoring
- **error_user**: Error handling validation
- **visual_user**: Visual regression testing

### Test Categories
1. **Login Flow Tests** - Authentication verification
2. **Complete E2E Shopping Journey** - Full workflow testing
3. **Error Handling and Edge Cases** - Robustness testing
4. **Visual and UI Regression Testing** - UI consistency
5. **Performance Benchmarking** - Timing analysis
6. **Advanced Testability Scenarios** - Network, accessibility, security

For detailed information, see [SAUCEDEMO_TESTS.md](./SAUCEDEMO_TESTS.md).

## Intrinsic Testability Scoring

This project includes a **quantitative scoring framework** that measures applications against all 10 Intrinsic Testability principles:

### Current SauceDemo Scores:
- **Overall**: 52/100 (F - Poor)  
- **Observability**: 76/100 (C - Moderate) ⭐ Strength
- **Controllability**: 26/100 (F - Weak) ⚠️ Needs improvement
- **Algorithmic Simplicity**: 62/100 (D - Below average)
- **Explainability**: 34/100 (F - Weak) ⚠️ Needs improvement  
- **Decomposability**: 61/100 (D - Below average)

### Using the Scoring Framework:

1. **Baseline Assessment**: Run initial scoring to establish current state
2. **Identify Weaknesses**: Focus on principles with lowest scores
3. **Make Improvements**: Implement recommended changes
4. **Re-assess**: Measure improvement with follow-up scoring
5. **Track Progress**: Use historical reports to validate improvements

### Quick Start:
```bash
# 🎯 RECOMMENDED: Complete testability analysis with interactive HTML report
npm run testability:all-tests

# Get current testability score
node run-testability-scorer.js score

# Generate quick HTML report  
npm run report:html

# View improvement history  
node run-testability-scorer.js report

# See quick recommendations (to be reviewed)
npx playwright test quick-testability-scorer.spec.js --project=chromium

# Show user comparison (to be reviewed)
npx playwright test quick-testability-scorer.spec.js --grep="Compare" --headed
```

**💡 Pro Tip**: Use `npm run testability:all-tests` for the most comprehensive analysis with beautiful HTML reports that automatically open in your browser!

For complete scoring guide, see [TESTABILITY_SCORING_GUIDE.md](./TESTABILITY_SCORING_GUIDE.md).

## Contributing

When adding new tests, ensure they demonstrate one or more of the Intrinsic Testability principles and include clear comments explaining the testability concepts being illustrated.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Heuristics for Software Testability ](https://www.satisfice.com/download/heuristics-of-software-testability)
- [Test Automation Best Practices](https://playwright.dev/docs/best-practices)
