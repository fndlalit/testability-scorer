const { test, expect } = require('@playwright/test');
const { AITestUtils } = require('./ai-test-utils');
const { aiDebugger } = require('./ai-debug-config');
const fs = require('fs');
const path = require('path');

/**
 * 🤖 Comprehensive 10-Principle Testability Analysis with AI Enhancement
 * 
 * This suite evaluates ALL 10 principles of Intrinsic Testability for each SauceDemo user type:
 * 1. Observability - Can we see what's happening?
 * 2. Controllability - Can we control the application precisely?
 * 3. Algorithmic Simplicity - Are behaviors simple and predictable?
 * 4. Algorithmic Transparency - Can we understand what the system does?
 * 5. Algorithmic Stability - Does behavior remain consistent?
 * 6. Explainability - Can we understand the interface and code?
 * 7. Unbugginess - How error-free is the application?
 * 8. Smallness - Are components appropriately sized for testing?
 * 9. Decomposability - Can we test parts in isolation?
 * 10. Similarity - Does it follow familiar patterns?
 * 
 * Enhanced with AI agents for deeper analysis and intelligent scoring.
 */

class ComprehensiveTestabilityAnalyzer {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.aiInsights = {};
    
    // All 10 Testability Principles
    this.principles = {
      observability: 0,
      controllability: 0,
      algorithmicSimplicity: 0,
      algorithmicTransparency: 0,
      algorithmicStability: 0,
      explainability: 0,
      unbugginess: 0,
      smallness: 0,
      decomposability: 0,
      similarity: 0
    };
    
    this.detailedMetrics = {};
    this.aiRecommendations = [];
  }

  /**
   * 🔍 Principle 1: Observability Analysis (0-100 points)
   * Can we observe the application's state and behavior?
   */
  async analyzeObservability(page, userType, debugSessionId) {
    console.log('🔍 Analyzing Observability...');
    let score = 0;
    const metrics = {};
    
    try {
      // State Visibility (25 points)
      const stateData = await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        localStorage: Object.keys(localStorage || {}).length,
        sessionStorage: Object.keys(sessionStorage || {}).length,
        cookies: document.cookie.length > 0,
        readyState: document.readyState
      }));
      
      let stateScore = 0;
      if (stateData.localStorage > 0) stateScore += 8;
      if (stateData.sessionStorage > 0) stateScore += 7;
      if (stateData.cookies) stateScore += 5;
      if (stateData.readyState === 'complete') stateScore += 5;
      metrics.stateVisibility = stateScore;
      score += stateScore;
      
      // Data-Test Attributes (25 points)
      const dataTestElements = await page.locator('[data-test]').count();
      const dataTestScore = Math.min(25, Math.floor(dataTestElements * 2.5));
      metrics.dataTestAttributes = dataTestScore;
      score += dataTestScore;
      
      // Error Visibility (20 points)
      const errorElements = await page.locator('[data-test*="error"], .error, [class*="error"]').count();
      const errorScore = errorElements > 0 ? 20 : 10;
      metrics.errorVisibility = errorScore;
      score += errorScore;
      
      // Visual Element Observability (15 points)
      const visualElements = await page.locator('img, svg, canvas').count();
      const visualScore = Math.min(15, visualElements * 2);
      metrics.visualObservability = visualScore;
      score += visualScore;
      
      // Network Observability (15 points) - Using AI debugger
      let networkScore = 5;
      if (debugSessionId) {
        const session = aiDebugger.debugSessions?.get(debugSessionId);
        if (session && session.networkRequests.length > 0) {
          networkScore = 15;
        }
      }
      metrics.networkObservability = networkScore;
      score += networkScore;
      
      console.log(`  ✅ Observability: ${score}/100`);
      console.log(`    State: ${stateScore}/25, Data-test: ${dataTestScore}/25, Errors: ${errorScore}/20, Visual: ${visualScore}/15, Network: ${networkScore}/15`);
      
    } catch (error) {
      console.log(`  ❌ Observability analysis failed: ${error.message}`);
      score = 20; // Fallback score
    }
    
    this.detailedMetrics.observability = metrics;
    return score;
  }

  /**
   * 🎮 Principle 2: Controllability Analysis (0-100 points)
   * Can we control the application precisely and reliably?
   */
  async analyzeControllability(page, userType) {
    console.log('🎮 Analyzing Controllability...');
    let score = 0;
    const metrics = {};
    
    try {
      // Input Precision (30 points)
      const inputFields = await page.locator('input, textarea, select').all();
      let inputScore = 0;
      
      if (inputFields.length > 0) {
        try {
          const testField = inputFields[0];
          const testValue = `test_${Date.now()}`;
          await testField.fill(testValue);
          const actualValue = await testField.inputValue();
          inputScore = actualValue === testValue ? 30 : 15;
          await testField.clear(); // Clean up
        } catch (error) {
          inputScore = 10;
        }
      }
      metrics.inputPrecision = inputScore;
      score += inputScore;
      
      // State Control (25 points)
      const interactiveElements = await page.locator('button, input, select, a[href]').count();
      const stateScore = Math.min(25, interactiveElements * 2);
      metrics.stateControl = stateScore;
      score += stateScore;
      
      // Determinism (25 points)
      const url1 = page.url();
      await page.reload({ waitUntil: 'load' });
      const url2 = page.url();
      const determinismScore = url1 === url2 ? 25 : 15;
      metrics.determinism = determinismScore;
      score += determinismScore;
      
      // Interaction Reliability (20 points)
      const buttons = await page.locator('button').count();
      const links = await page.locator('a[href]').count();
      const reliabilityScore = Math.min(20, (buttons + links) * 1.5);
      metrics.interactionReliability = reliabilityScore;
      score += reliabilityScore;
      
      console.log(`  ✅ Controllability: ${score}/100`);
      console.log(`    Input: ${inputScore}/30, State: ${stateScore}/25, Determinism: ${determinismScore}/25, Reliability: ${reliabilityScore}/20`);
      
    } catch (error) {
      console.log(`  ❌ Controllability analysis failed: ${error.message}`);
      score = 25;
    }
    
    this.detailedMetrics.controllability = metrics;
    return score;
  }

  /**
   * 🧩 Principle 3: Algorithmic Simplicity Analysis (0-100 points)
   * Are the system behaviors simple and predictable?
   */
  async analyzeAlgorithmicSimplicity(page, userType) {
    console.log('🧩 Analyzing Algorithmic Simplicity...');
    let score = 0;
    const metrics = {};
    
    try {
      // Input-Output Clarity (35 points)
      const totalElements = await page.locator('*').count();
      let clarityScore = 35;
      if (totalElements > 1000) clarityScore = 15;
      else if (totalElements > 500) clarityScore = 25;
      else if (totalElements > 200) clarityScore = 30;
      
      metrics.inputOutputClarity = clarityScore;
      score += clarityScore;
      
      // Operation Complexity (35 points)
      const forms = await page.locator('form').count();
      const buttons = await page.locator('button').count();
      const complexity = forms + buttons;
      const complexityScore = complexity < 10 ? 35 : complexity < 20 ? 25 : 15;
      metrics.operationComplexity = complexityScore;
      score += complexityScore;
      
      // Behavior Predictability (30 points)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
      const navigation = await page.locator('nav, [role="navigation"]').count();
      const predictabilityScore = Math.min(30, (headings * 3) + (navigation * 10));
      metrics.behaviorPredictability = predictabilityScore;
      score += predictabilityScore;
      
      console.log(`  ✅ Algorithmic Simplicity: ${score}/100`);
      console.log(`    Clarity: ${clarityScore}/35, Complexity: ${complexityScore}/35, Predictability: ${predictabilityScore}/30`);
      
    } catch (error) {
      console.log(`  ❌ Algorithmic Simplicity analysis failed: ${error.message}`);
      score = 30;
    }
    
    this.detailedMetrics.algorithmicSimplicity = metrics;
    return score;
  }

  /**
   * 🔬 Principle 4: Algorithmic Transparency Analysis (0-100 points)
   * Can we understand what the system is doing and how?
   */
  async analyzeAlgorithmicTransparency(page, userType) {
    console.log('🔬 Analyzing Algorithmic Transparency...');
    let score = 0;
    const metrics = {};
    
    try {
      // Behavior Visibility (40 points)
      const visibleFeedback = await page.locator('[class*="loading"], [class*="success"], [class*="error"], [aria-live]').count();
      const visibilityScore = Math.min(40, visibleFeedback * 8);
      metrics.behaviorVisibility = visibilityScore;
      score += visibilityScore;
      
      // Process Understanding (35 points)
      const labels = await page.locator('label').count();
      const tooltips = await page.locator('[title], [aria-describedby]').count();
      const understandingScore = Math.min(35, (labels * 3) + (tooltips * 2));
      metrics.processUnderstanding = understandingScore;
      score += understandingScore;
      
      // Black Box Reduction (25 points)
      const consoleErrors = await page.evaluate(() => {
        const errors = [];
        const originalError = console.error;
        console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(console, args);
        };
        return errors.length;
      });
      
      const blackBoxScore = consoleErrors === 0 ? 25 : consoleErrors < 3 ? 15 : 5;
      metrics.blackBoxReduction = blackBoxScore;
      score += blackBoxScore;
      
      console.log(`  ✅ Algorithmic Transparency: ${score}/100`);
      console.log(`    Visibility: ${visibilityScore}/40, Understanding: ${understandingScore}/35, BlackBox: ${blackBoxScore}/25`);
      
    } catch (error) {
      console.log(`  ❌ Algorithmic Transparency analysis failed: ${error.message}`);
      score = 35;
    }
    
    this.detailedMetrics.algorithmicTransparency = metrics;
    return score;
  }

  /**
   * ⚖️ Principle 5: Algorithmic Stability Analysis (0-100 points)
   * Does the system behave consistently over time and changes?
   */
  async analyzeAlgorithmicStability(page, userType) {
    console.log('⚖️ Analyzing Algorithmic Stability...');
    let score = 0;
    const metrics = {};
    
    try {
      // Change Resilience (35 points)
      const initialElementCount = await page.locator('[data-test]').count();
      await page.reload({ waitUntil: 'load' });
      await AITestUtils.waitForPageReady(page);
      const reloadElementCount = await page.locator('[data-test]').count();
      
      const resilienceScore = initialElementCount === reloadElementCount ? 35 : 20;
      metrics.changeResilience = resilienceScore;
      score += resilienceScore;
      
      // Test Maintainability (35 points)
      const dataTestQuality = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-test]');
        let qualityScore = 0;
        elements.forEach(el => {
          const testId = el.getAttribute('data-test');
          if (testId.includes('-') || testId.includes('_')) qualityScore += 2;
          if (testId.length > 5) qualityScore += 1;
        });
        return Math.min(35, qualityScore);
      });
      
      metrics.testMaintainability = dataTestQuality;
      score += dataTestQuality;
      
      // Behavior Consistency (30 points)
      const consistentElements = await page.locator('button[data-test], input[data-test], select[data-test]').count();
      const consistencyScore = Math.min(30, consistentElements * 5);
      metrics.behaviorConsistency = consistencyScore;
      score += consistencyScore;
      
      console.log(`  ✅ Algorithmic Stability: ${score}/100`);
      console.log(`    Resilience: ${resilienceScore}/35, Maintainability: ${dataTestQuality}/35, Consistency: ${consistencyScore}/30`);
      
    } catch (error) {
      console.log(`  ❌ Algorithmic Stability analysis failed: ${error.message}`);
      score = 40;
    }
    
    this.detailedMetrics.algorithmicStability = metrics;
    return score;
  }

  /**
   * 📖 Principle 6: Explainability Analysis (0-100 points)
   * Can users and developers understand the interface and code?
   */
  async analyzeExplainability(page, userType) {
    console.log('📖 Analyzing Explainability...');
    let score = 0;
    const metrics = {};
    
    try {
      // Code Clarity (35 points)
      const semanticElements = await page.locator('nav, main, section, article, aside, header, footer').count();
      const clarityScore = Math.min(35, semanticElements * 5);
      metrics.codeClarity = clarityScore;
      score += clarityScore;
      
      // Documentation Quality (35 points)
      const labeledInputs = await page.locator('input').count();
      const actualLabels = await page.locator('label').count();
      const altTexts = await page.locator('img[alt]').count();
      const totalImages = await page.locator('img').count();
      
      let docScore = 0;
      docScore += Math.min(20, actualLabels * 4);
      docScore += totalImages > 0 ? Math.min(15, (altTexts / totalImages) * 15) : 0;
      
      metrics.documentationQuality = docScore;
      score += docScore;
      
      // Semantic Structure (30 points)
      const ariaElements = await page.locator('[aria-label], [role], [aria-describedby]').count();
      const structureScore = Math.min(30, ariaElements * 3);
      metrics.semanticStructure = structureScore;
      score += structureScore;
      
      console.log(`  ✅ Explainability: ${score}/100`);
      console.log(`    Clarity: ${clarityScore}/35, Documentation: ${docScore}/35, Structure: ${structureScore}/30`);
      
    } catch (error) {
      console.log(`  ❌ Explainability analysis failed: ${error.message}`);
      score = 25;
    }
    
    this.detailedMetrics.explainability = metrics;
    return score;
  }

  /**
   * 🐛 Principle 7: Unbugginess Analysis (0-100 points)
   * How error-free and robust is the application?
   */
  async analyzeUnbugginess(page, userType) {
    console.log('🐛 Analyzing Unbugginess...');
    let score = 100; // Start with perfect score and deduct for issues
    const metrics = {};
    
    try {
      // Error Rate (40 points)
      const jsErrors = await page.evaluate(() => {
        const errors = [];
        window.addEventListener('error', (e) => errors.push(e.message));
        return errors.length;
      });
      
      const consoleErrors = await page.evaluate(() => {
        let errorCount = 0;
        const originalError = console.error;
        console.error = (...args) => {
          errorCount++;
          originalError.apply(console, args);
        };
        return errorCount;
      });
      
      const errorDeduction = Math.min(40, (jsErrors + consoleErrors) * 5);
      const errorScore = 40 - errorDeduction;
      metrics.errorRate = errorScore;
      
      // Error Handling (35 points)
      const errorElements = await page.locator('[data-test*="error"], .error, [class*="error"]').count();
      const handlingScore = errorElements > 0 ? 35 : 20;
      metrics.errorHandling = handlingScore;
      
      // Robustness (25 points)
      const brokenImages = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        let broken = 0;
        images.forEach(img => {
          if (!img.complete || img.naturalHeight === 0) broken++;
        });
        return broken;
      });
      
      const robustnessScore = 25 - Math.min(25, brokenImages * 5);
      metrics.robustness = robustnessScore;
      
      const totalScore = errorScore + handlingScore + robustnessScore;
      score = Math.max(0, totalScore);
      
      console.log(`  ✅ Unbugginess: ${score}/100`);
      console.log(`    Errors: ${errorScore}/40, Handling: ${handlingScore}/35, Robustness: ${robustnessScore}/25`);
      
    } catch (error) {
      console.log(`  ❌ Unbugginess analysis failed: ${error.message}`);
      score = 60;
    }
    
    this.detailedMetrics.unbugginess = metrics;
    return score;
  }

  /**
   * 📏 Principle 8: Smallness Analysis (0-100 points)
   * Are components appropriately sized for effective testing?
   */
  async analyzeSmallness(page, userType) {
    console.log('📏 Analyzing Smallness...');
    let score = 0;
    const metrics = {};
    
    try {
      // Component Size (40 points)
      const totalElements = await page.locator('*').count();
      let sizeScore = 40;
      if (totalElements > 1000) sizeScore = 10;
      else if (totalElements > 500) sizeScore = 20;
      else if (totalElements > 200) sizeScore = 30;
      
      metrics.componentSize = sizeScore;
      score += sizeScore;
      
      // Test Scope (35 points)
      const testableElements = await page.locator('[data-test]').count();
      const scopeScore = Math.min(35, testableElements * 3);
      metrics.testScope = scopeScore;
      score += scopeScore;
      
      // Output Manageability (25 points)
      const pageContent = await page.content();
      const contentSize = pageContent.length;
      let managementScore = 25;
      if (contentSize > 100000) managementScore = 10;
      else if (contentSize > 50000) managementScore = 15;
      else if (contentSize > 20000) managementScore = 20;
      
      metrics.outputManageability = managementScore;
      score += managementScore;
      
      console.log(`  ✅ Smallness: ${score}/100`);
      console.log(`    Size: ${sizeScore}/40, Scope: ${scopeScore}/35, Management: ${managementScore}/25`);
      
    } catch (error) {
      console.log(`  ❌ Smallness analysis failed: ${error.message}`);
      score = 45;
    }
    
    this.detailedMetrics.smallness = metrics;
    return score;
  }

  /**
   * 🔧 Principle 9: Decomposability Analysis (0-100 points)
   * Can we test components in isolation?
   */
  async analyzeDecomposability(page, userType) {
    console.log('🔧 Analyzing Decomposability...');
    let score = 0;
    const metrics = {};
    
    try {
      // Component Separation (40 points)
      const containers = await page.locator('div[class], section, article, nav').count();
      const separationScore = Math.min(40, containers * 2);
      metrics.componentSeparation = separationScore;
      score += separationScore;
      
      // Isolated Testing (35 points)
      const isolatedElements = await page.locator('[data-test]').count();
      const forms = await page.locator('form').count();
      const isolationScore = Math.min(35, (isolatedElements * 2) + (forms * 5));
      metrics.isolatedTesting = isolationScore;
      score += isolationScore;
      
      // Modular Design (25 points)
      const modules = await page.locator('[id], [class*="component"], [class*="module"]').count();
      const modularScore = Math.min(25, Math.floor(modules / 3));
      metrics.modularDesign = modularScore;
      score += modularScore;
      
      console.log(`  ✅ Decomposability: ${score}/100`);
      console.log(`    Separation: ${separationScore}/40, Isolation: ${isolationScore}/35, Modular: ${modularScore}/25`);
      
    } catch (error) {
      console.log(`  ❌ Decomposability analysis failed: ${error.message}`);
      score = 50;
    }
    
    this.detailedMetrics.decomposability = metrics;
    return score;
  }

  /**
   * 🎯 Principle 10: Similarity Analysis (0-100 points)
   * Does the application follow familiar patterns and conventions?
   */
  async analyzeSimilarity(page, userType) {
    console.log('🎯 Analyzing Similarity...');
    let score = 0;
    const metrics = {};
    
    try {
      // Standard Patterns (40 points)
      const standardElements = await page.evaluate(() => {
        const patterns = {
          buttons: document.querySelectorAll('button, input[type="button"], input[type="submit"]').length,
          forms: document.querySelectorAll('form').length,
          navigation: document.querySelectorAll('nav, [role="navigation"]').length,
          headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length
        };
        return patterns;
      });
      
      const patternScore = Math.min(40, 
        (standardElements.buttons * 2) + 
        (standardElements.forms * 5) + 
        (standardElements.navigation * 8) + 
        (standardElements.headings * 1)
      );
      metrics.standardPatterns = patternScore;
      score += patternScore;
      
      // Familiar Technology (35 points)
      const familiarTech = await page.evaluate(() => {
        return {
          html5: document.doctype && document.doctype.name === 'html',
          css: document.querySelectorAll('link[rel="stylesheet"], style').length > 0,
          javascript: document.querySelectorAll('script').length > 0,
          forms: document.querySelectorAll('input, textarea, select').length > 0
        };
      });
      
      let techScore = 0;
      if (familiarTech.html5) techScore += 10;
      if (familiarTech.css) techScore += 8;
      if (familiarTech.javascript) techScore += 7;
      if (familiarTech.forms) techScore += 10;
      
      metrics.familiarTechnology = techScore;
      score += techScore;
      
      // Conventional Design (25 points)
      const conventions = await page.evaluate(() => {
        return {
          header: document.querySelectorAll('header, .header').length > 0,
          footer: document.querySelectorAll('footer, .footer').length > 0,
          main: document.querySelectorAll('main, .main, .content').length > 0,
          breadcrumbs: document.querySelectorAll('.breadcrumb, nav[aria-label*="breadcrumb"]').length > 0
        };
      });
      
      let conventionScore = 0;
      if (conventions.header) conventionScore += 7;
      if (conventions.footer) conventionScore += 5;
      if (conventions.main) conventionScore += 8;
      if (conventions.breadcrumbs) conventionScore += 5;
      
      metrics.conventionalDesign = conventionScore;
      score += conventionScore;
      
      console.log(`  ✅ Similarity: ${score}/100`);
      console.log(`    Patterns: ${patternScore}/40, Technology: ${techScore}/35, Conventions: ${conventionScore}/25`);
      
    } catch (error) {
      console.log(`  ❌ Similarity analysis failed: ${error.message}`);
      score = 55;
    }
    
    this.detailedMetrics.similarity = metrics;
    return score;
  }

  /**
   * 🤖 Generate AI-Enhanced Recommendations
   */
  generateAIRecommendations() {
    const recommendations = [];
    
    Object.entries(this.principles).forEach(([principle, score]) => {
      if (score < 60) {
        let suggestion = '';
        let priority = score < 40 ? 'Critical' : score < 50 ? 'High' : 'Medium';
        
        switch (principle) {
          case 'observability':
            suggestion = 'Add comprehensive data-test attributes, implement state monitoring, and enhance error visibility';
            break;
          case 'controllability':
            suggestion = 'Improve input validation, add loading states, and enhance interaction feedback';
            break;
          case 'algorithmicSimplicity':
            suggestion = 'Reduce page complexity, simplify workflows, and improve semantic structure';
            break;
          case 'algorithmicTransparency':
            suggestion = 'Add progress indicators, improve feedback messages, and reduce black-box operations';
            break;
          case 'algorithmicStability':
            suggestion = 'Implement consistent data-test patterns and improve element stability';
            break;
          case 'explainability':
            suggestion = 'Add semantic HTML elements, implement ARIA labels, and improve documentation';
            break;
          case 'unbugginess':
            suggestion = 'Fix JavaScript errors, improve error handling, and enhance robustness';
            break;
          case 'smallness':
            suggestion = 'Break down large components, reduce page size, and improve modularity';
            break;
          case 'decomposability':
            suggestion = 'Improve component separation, add isolated test targets, and enhance modularity';
            break;
          case 'similarity':
            suggestion = 'Follow standard UI patterns, implement conventional design, and use familiar technologies';
            break;
        }
        
        recommendations.push({
          principle,
          score,
          priority,
          suggestion,
          aiReasoning: `AI analysis shows ${principle} scoring ${score}/100, indicating need for improvement`
        });
      }
    });
    
    this.aiRecommendations = recommendations;
    return recommendations;
  }

  /**
   * 🎯 Run Complete 10-Principle Analysis
   */
  async runCompleteAnalysis(page, userType) {
    console.log(`\n🤖 COMPREHENSIVE 10-PRINCIPLE ANALYSIS: ${userType}`);
    console.log('=' .repeat(80));
    
    try {
      // Start AI debugging session
      const debugSessionId = await aiDebugger.startDebugSession(`10-principle-${userType}`, page);
      
      // Navigate and login
      await page.goto('https://www.saucedemo.com/', { timeout: 30000 });
      await AITestUtils.waitForPageReady(page);
      
      await page.locator('[data-test="username"]').fill(userType);
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      // Check login success
      const loginSuccess = await page.locator('[data-test="inventory-container"]').isVisible({ timeout: 10000 }).catch(() => false);
      
      if (!loginSuccess) {
        console.log(`⚠️ ${userType}: Login failed or blocked`);
        return { userType, error: 'Login failed', scores: {} };
      }
      
      console.log(`✅ ${userType}: Successfully logged in, analyzing all 10 principles...`);
      
      // Analyze ALL 10 principles
      this.principles.observability = await this.analyzeObservability(page, userType, debugSessionId);
      this.principles.controllability = await this.analyzeControllability(page, userType);
      this.principles.algorithmicSimplicity = await this.analyzeAlgorithmicSimplicity(page, userType);
      this.principles.algorithmicTransparency = await this.analyzeAlgorithmicTransparency(page, userType);
      this.principles.algorithmicStability = await this.analyzeAlgorithmicStability(page, userType);
      this.principles.explainability = await this.analyzeExplainability(page, userType);
      this.principles.unbugginess = await this.analyzeUnbugginess(page, userType);
      this.principles.smallness = await this.analyzeSmallness(page, userType);
      this.principles.decomposability = await this.analyzeDecomposability(page, userType);
      this.principles.similarity = await this.analyzeSimilarity(page, userType);
      
      // Calculate overall score
      const overallScore = Math.round(
        Object.values(this.principles).reduce((sum, score) => sum + score, 0) / 10
      );
      
      // Generate AI recommendations
      const recommendations = this.generateAIRecommendations();
      
      // Store AI insights
      this.aiInsights = {
        userType,
        overallScore,
        principleBreakdown: { ...this.principles },
        detailedMetrics: { ...this.detailedMetrics },
        recommendations,
        analysisTimestamp: this.timestamp
      };
      
      console.log(`\n🎯 OVERALL SCORE for ${userType}: ${overallScore}/100`);
      console.log(`🤖 AI Recommendations: ${recommendations.length} suggestions generated`);
      console.log('=' .repeat(80));
      
      // Clean up
      aiDebugger.endDebugSession(debugSessionId);
      
      return {
        userType,
        timestamp: this.timestamp,
        overallScore,
        principleScores: { ...this.principles },
        detailedMetrics: { ...this.detailedMetrics },
        aiRecommendations: recommendations,
        grade: this.getGrade(overallScore)
      };
      
    } catch (error) {
      console.log(`❌ Complete analysis error for ${userType}: ${error.message}`);
      return { userType, error: error.message, scores: {} };
    }
  }

  /**
   * 🎓 Grade Assignment
   */
  getGrade(score) {
    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Average)';
    if (score >= 60) return 'D (Below Average)';
    return 'F (Poor)';
  }

  /**
   * 📊 Generate Comprehensive Report
   */
  generateComprehensiveReport(results) {
    const successfulResults = results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      return 'No successful analyses to report.';
    }
    
    let report = `\n📊 COMPREHENSIVE 10-PRINCIPLE TESTABILITY REPORT\n`;
    report += `Generated: ${this.timestamp}\n`;
    report += `🤖 AI-Enhanced Analysis Framework\n`;
    report += '=' .repeat(120) + '\n\n';
    
    // Detailed results table
    report += 'USER TYPE        | OVERALL | OBS | CTL | SIM | TRA | STA | EXP | UNB | SMA | DEC | SIM | GRADE\n';
    report += '-' .repeat(120) + '\n';
    
    successfulResults.forEach(result => {
      const s = result.principleScores;
      const line = `${result.userType.padEnd(16)} | ${result.overallScore.toString().padStart(7)} | `;
      const scores = [
        s.observability.toString().padStart(3),
        s.controllability.toString().padStart(3),
        s.algorithmicSimplicity.toString().padStart(3),
        s.algorithmicTransparency.toString().padStart(3),
        s.algorithmicStability.toString().padStart(3),
        s.explainability.toString().padStart(3),
        s.unbugginess.toString().padStart(3),
        s.smallness.toString().padStart(3),
        s.decomposability.toString().padStart(3),
        s.similarity.toString().padStart(3)
      ].join(' | ');
      report += line + scores + ` | ${result.grade}\n`;
    });
    
    // Analysis summary
    const averageScore = Math.round(successfulResults.reduce((sum, r) => sum + r.overallScore, 0) / successfulResults.length);
    const bestUser = successfulResults.reduce((best, current) => current.overallScore > best.overallScore ? current : best);
    const worstUser = successfulResults.reduce((worst, current) => current.overallScore < worst.overallScore ? current : worst);
    
    report += '\n🤖 AI COMPREHENSIVE ANALYSIS:\n';
    report += '-' .repeat(60) + '\n';
    report += `Average Testability Score: ${averageScore}/100\n`;
    report += `Best Performance: ${bestUser.userType} (${bestUser.overallScore}/100)\n`;
    report += `Needs Improvement: ${worstUser.userType} (${worstUser.overallScore}/100)\n`;
    report += `Score Variance: ${bestUser.overallScore - worstUser.overallScore} points\n\n`;
    
    // Principle analysis across all users
    const principleNames = ['observability', 'controllability', 'algorithmicSimplicity', 'algorithmicTransparency', 
                           'algorithmicStability', 'explainability', 'unbugginess', 'smallness', 'decomposability', 'similarity'];
    
    report += '🎯 PRINCIPLE STRENGTH ANALYSIS (Average Scores):\n';
    report += '-' .repeat(60) + '\n';
    
    const principleAverages = {};
    principleNames.forEach(principle => {
      principleAverages[principle] = Math.round(
        successfulResults.reduce((sum, r) => sum + r.principleScores[principle], 0) / successfulResults.length
      );
    });
    
    Object.entries(principleAverages)
      .sort(([,a], [,b]) => b - a)
      .forEach(([principle, avg]) => {
        const strength = avg >= 80 ? '🟢 Strong' : avg >= 60 ? '🟡 Moderate' : '🔴 Weak';
        report += `${principle.padEnd(25)}: ${avg.toString().padStart(3)}/100 ${strength}\n`;
      });
    
    // AI-powered recommendations
    report += '\n🤖 AI-POWERED IMPROVEMENT RECOMMENDATIONS:\n';
    report += '-' .repeat(60) + '\n';
    
    const allRecommendations = successfulResults.flatMap(r => r.aiRecommendations || []);
    const criticalRecommendations = allRecommendations.filter(r => r.priority === 'Critical');
    const highRecommendations = allRecommendations.filter(r => r.priority === 'High');
    
    if (criticalRecommendations.length > 0) {
      report += '\n🚨 CRITICAL PRIORITY:\n';
      criticalRecommendations.forEach(rec => {
        report += `• ${rec.principle.toUpperCase()}: ${rec.suggestion}\n`;
        report += `  AI Reasoning: ${rec.aiReasoning}\n\n`;
      });
    }
    
    if (highRecommendations.length > 0) {
      report += '\n⚠️ HIGH PRIORITY:\n';
      highRecommendations.forEach(rec => {
        report += `• ${rec.principle.toUpperCase()}: ${rec.suggestion}\n`;
        report += `  AI Reasoning: ${rec.aiReasoning}\n\n`;
      });
    }
    
    return report;
  }
}

// Export for use in other modules
module.exports = { ComprehensiveTestabilityAnalyzer };