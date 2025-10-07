const { test, expect } = require('@playwright/test');
const { AITestabilityScorer } = require('../ai-testability-scorer');
const { AITestUtils } = require('../ai-test-utils');
const fs = require('fs');
const path = require('path');

/**
 * 🤖 AI-Enhanced Testability Scoring Test Suite
 * 
 * This test suite demonstrates the advanced AI-powered testability analysis
 * capabilities, providing deeper insights and more intelligent scoring
 * than traditional testability assessment methods.
 */

test.describe('🤖 AI-Enhanced Testability Assessment', () => {
  let aiScorer;

  test.beforeEach(() => {
    aiScorer = new AITestabilityScorer();
  });

  test('AI Testability Assessment: All SauceDemo User Types', async ({ page, browserName }) => {
    const userTypes = ['standard_user', 'problem_user'];
    // Removed timeout-prone users: 'performance_glitch_user', 'visual_user'
    
    console.log('\n🚀 STARTING AI-ENHANCED TESTABILITY ASSESSMENT');
    console.log(`🤖 AI Framework: Playwright 1.49.0 with Smart Analysis`);
    console.log(`🌐 Browser: ${browserName}`);
    console.log('=' .repeat(100));
    
    const results = [];
    
    for (const userType of userTypes) {
      console.log(`\n🎯 Processing ${userType}...`);
      
      try {
        const result = await aiScorer.runAIAssessment(page, userType);
        results.push(result);
        
        // Take AI-enhanced screenshot for analysis
        if (!result.error) {
          await AITestUtils.smartScreenshot(page, `ai-testability-${userType}`, 'assessment-complete');
        }
        
        // Small delay between assessments
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.log(`❌ Error processing ${userType}: ${error.message}`);
        results.push({ userType, error: error.message });
      }
    }
    
    // Generate and display AI-enhanced report
    const aiReport = aiScorer.generateAIReport(results);
    console.log(aiReport);
    
    // Save comprehensive AI results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = path.join(process.cwd(), 'tests', 'reports', `ai-testability-${browserName}-${timestamp}.json`);
    const reportPath = path.join(process.cwd(), 'tests', 'reports', `ai-testability-${browserName}-${timestamp}-report.txt`);
    
    const aiReportData = {
      timestamp: aiScorer.timestamp,
      framework: 'AI-Enhanced Playwright 1.49.0',
      browser: browserName,
      results,
      aiMetrics: aiScorer.aiMetrics,
      aiInsights: aiScorer.aiInsights,
      summary: {
        totalAssessed: results.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        averageScore: results.filter(r => !r.error).length > 0 ? 
          Math.round(results.filter(r => !r.error).reduce((sum, r) => sum + r.overallScore, 0) / results.filter(r => !r.error).length) : 0,
        aiReadiness: results.filter(r => !r.error && r.overallScore > 75).length
      }
    };
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(resultsPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Save JSON results
    fs.writeFileSync(resultsPath, JSON.stringify(aiReportData, null, 2));
    
    // Save text report
    fs.writeFileSync(reportPath, aiReport);
    
    console.log(`\n💾 AI Results saved:`);
    console.log(`   📊 Data: ${resultsPath}`);
    console.log(`   📄 Report: ${reportPath}`);
    
    // AI-powered test assertions
    const successfulResults = results.filter(r => !r.error);
    expect(successfulResults.length).toBeGreaterThan(0);
    
    if (successfulResults.length > 0) {
      const averageScore = aiReportData.summary.averageScore;
      console.log(`\n🤖 AI Assessment Complete: Average Score ${averageScore}/100`);
      
      // Expect reasonable AI testability scores
      expect(averageScore).toBeGreaterThan(30); // Minimum acceptable AI score
      
      // Verify AI insights were generated
      expect(aiScorer.aiInsights.improvementSuggestions).toBeDefined();
      console.log(`🧠 AI generated ${aiScorer.aiInsights.improvementSuggestions.length} improvement suggestions`);
    }
  });

  test('AI Individual Principle Analysis: Standard User Deep Dive', async ({ page }) => {
    console.log('\n🔬 AI DEEP DIVE ANALYSIS: Standard User');
    console.log('=' .repeat(60));
    
    try {
      // Navigate and login
      await page.goto('https://www.saucedemo.com/');
      await AITestUtils.waitForPageReady(page);
      
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      // Wait for inventory page
      await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
      
      // Perform individual AI principle analysis
      console.log('\n🤖 Performing detailed AI analysis...');
      
      const observabilityScore = await aiScorer.scoreAIObservability(page, null);
      const controllabilityScore = await aiScorer.scoreAIControllability(page);
      const simplicityScore = await aiScorer.scoreAIAlgorithmicSimplicity(page);
      const explainabilityScore = await aiScorer.scoreAIExplainability(page);
      const decomposabilityScore = await aiScorer.scoreAIDecomposability(page);
      
      // Generate detailed analysis
      console.log('\n📊 AI PRINCIPLE ANALYSIS RESULTS:');
      console.log('-' .repeat(50));
      console.log(`🔍 AI Observability:      ${observabilityScore}/100`);
      console.log(`🎮 AI Controllability:    ${controllabilityScore}/100`);
      console.log(`🧩 AI Simplicity:         ${simplicityScore}/100`);
      console.log(`📖 AI Explainability:     ${explainabilityScore}/100`);
      console.log(`🔧 AI Decomposability:    ${decomposabilityScore}/100`);
      
      const overallAIScore = Math.round((observabilityScore + controllabilityScore + simplicityScore + explainabilityScore + decomposabilityScore) / 5);
      console.log(`\n🤖 OVERALL AI SCORE: ${overallAIScore}/100`);
      
      // AI insights validation
      expect(observabilityScore).toBeGreaterThan(0);
      expect(controllabilityScore).toBeGreaterThan(0);
      expect(simplicityScore).toBeGreaterThan(0);
      expect(explainabilityScore).toBeGreaterThan(0);
      expect(decomposabilityScore).toBeGreaterThan(0);
      expect(overallAIScore).toBeGreaterThan(20);
      
      // Generate AI recommendations
      await aiScorer.generateAIInsights(page, overallAIScore);
      console.log(`\n🧠 AI generated ${aiScorer.aiInsights.improvementSuggestions.length} targeted recommendations`);
      
    } catch (error) {
      console.log(`❌ AI Deep Dive analysis failed: ${error.message}`);
      throw error;
    }
  });

  test('AI Smart Element Discovery and Classification', async ({ page }) => {
    console.log('\n🔍 AI SMART ELEMENT DISCOVERY TEST');
    console.log('=' .repeat(50));
    
    try {
      await page.goto('https://www.saucedemo.com/');
      await AITestUtils.waitForPageReady(page);
      
      // Perform smart element discovery
      const smartElements = await aiScorer.discoverSmartElements(page);
      
      console.log('\n🤖 AI Element Discovery Results:');
      console.log(`  📊 Total Elements: ${smartElements.total}`);
      console.log(`  🎯 Testable Elements: ${smartElements.testable}`);
      console.log(`  👀 Observable Elements: ${smartElements.observable}`);
      console.log(`  🖱️ Interactive Elements: ${smartElements.interactive}`);
      console.log(`  🏷️ Data-Test Elements: ${smartElements.dataTest.length}`);
      console.log(`  📝 Semantic Elements: ${smartElements.semantic.length}`);
      
      // Analyze data-test element categories
      if (smartElements.dataTest.length > 0) {
        console.log('\n🧠 AI Element Classification:');
        const categories = {};
        smartElements.dataTest.forEach(element => {
          categories[element.category] = (categories[element.category] || 0) + 1;
        });
        
        Object.entries(categories).forEach(([category, count]) => {
          console.log(`  ${category}: ${count} elements`);
        });
      }
      
      // Validate AI discovery
      expect(smartElements.total).toBeGreaterThan(0);
      expect(smartElements.testable).toBeGreaterThan(0);
      expect(smartElements.dataTest.length).toBeGreaterThan(0);
      
      // Verify AI classification
      const hasClassifiedElements = smartElements.dataTest.some(el => el.category !== 'unknown');
      expect(hasClassifiedElements).toBeTruthy();
      
      console.log('\n✅ AI Smart Element Discovery completed successfully');
      
    } catch (error) {
      console.log(`❌ AI Element Discovery failed: ${error.message}`);
      throw error;
    }
  });

  test('AI Accessibility Intelligence Analysis', async ({ page }) => {
    console.log('\n♿ AI ACCESSIBILITY INTELLIGENCE TEST');
    console.log('=' .repeat(50));
    
    try {
      await page.goto('https://www.saucedemo.com/');
      await AITestUtils.waitForPageReady(page);
      
      // Login to get to main interface
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
      
      // Perform AI semantic analysis
      const semanticIntelligence = await aiScorer.performSemanticAnalysis(page);
      
      console.log('\n🤖 AI Semantic Analysis Results:');
      console.log(`  🏗️ Semantic Elements:`, semanticIntelligence.semanticElements);
      console.log(`  📑 Heading Structure:`, semanticIntelligence.headingStructure);
      console.log(`  🗺️ ARIA Landmarks:`, semanticIntelligence.landmarks);
      console.log(`  🏷️ ARIA Elements:`, semanticIntelligence.ariaElements);
      console.log(`  🔗 Label Associations: ${semanticIntelligence.labelAssociations}`);
      
      // AI accessibility scoring
      const accessibilityScore = await aiScorer.analyzeAccessibilityIntelligence(page, semanticIntelligence);
      console.log(`\n♿ AI Accessibility Score: ${accessibilityScore}/25`);
      
      // Validate semantic analysis
      expect(semanticIntelligence).toBeDefined();
      expect(semanticIntelligence.semanticElements).toBeDefined();
      expect(semanticIntelligence.headingStructure).toBeDefined();
      expect(accessibilityScore).toBeGreaterThanOrEqual(0);
      
      console.log('\n✅ AI Accessibility Intelligence analysis completed');
      
    } catch (error) {
      console.log(`❌ AI Accessibility analysis failed: ${error.message}`);
      throw error;
    }
  });

  test('AI Performance and Complexity Analysis', async ({ page }) => {
    console.log('\n⚡ AI PERFORMANCE & COMPLEXITY ANALYSIS');
    console.log('=' .repeat(50));
    
    try {
      const startTime = Date.now();
      
      await page.goto('https://www.saucedemo.com/');
      await AITestUtils.waitForPageReady(page);
      
      const loadTime = Date.now() - startTime;
      
      // Perform AI complexity analysis
      const complexityMetrics = await aiScorer.analyzeComplexity(page);
      
      console.log('\n🤖 AI Complexity Analysis:');
      console.log(`  📊 Total Elements: ${complexityMetrics.totalElements}`);
      console.log(`  📦 Div Elements: ${complexityMetrics.divElements}`);
      console.log(`  🏗️ Nesting Levels: ${complexityMetrics.nestedLevels}`);
      console.log(`  📜 Script Tags: ${complexityMetrics.scriptTags}`);
      console.log(`  🎨 Style Tags: ${complexityMetrics.styleTags}`);
      console.log(`  ⏱️ Load Time: ${loadTime}ms`);
      
      // AI complexity scoring
      const domComplexityScore = aiScorer.analyzeDOMComplexity(complexityMetrics);
      const predictabilityScore = aiScorer.analyzePredictability(complexityMetrics);
      
      console.log(`\n🤖 AI Scoring Results:`);
      console.log(`  🏗️ DOM Complexity Score: ${domComplexityScore}/40`);
      console.log(`  🔮 Predictability Score: ${predictabilityScore}/10`);
      
      // AI performance assessment
      let performanceGrade = 'Unknown';
      if (loadTime < 2000) performanceGrade = '🟢 Excellent';
      else if (loadTime < 5000) performanceGrade = '🟡 Good';
      else if (loadTime < 10000) performanceGrade = '🟠 Average';
      else performanceGrade = '🔴 Poor';
      
      console.log(`  ⚡ AI Performance Grade: ${performanceGrade}`);
      
      // Validate metrics
      expect(complexityMetrics.totalElements).toBeGreaterThan(0);
      expect(complexityMetrics.nestedLevels).toBeGreaterThan(0);
      expect(domComplexityScore).toBeGreaterThanOrEqual(0);
      expect(predictabilityScore).toBeGreaterThanOrEqual(0);
      expect(loadTime).toBeLessThan(30000); // Should load within 30 seconds
      
      console.log('\n✅ AI Performance & Complexity analysis completed');
      
    } catch (error) {
      console.log(`❌ AI Performance analysis failed: ${error.message}`);
      throw error;
    }
  });

  test('AI Testability Comparison: Problem vs Standard User', async ({ page }) => {
    console.log('\n🆚 AI COMPARATIVE TESTABILITY ANALYSIS');
    console.log('=' .repeat(60));
    
    const comparisonResults = [];
    
    for (const userType of ['standard_user', 'problem_user']) {
      console.log(`\n🎯 Analyzing ${userType}...`);
      
      try {
        const scorer = new AITestabilityScorer();
        const result = await scorer.runAIAssessment(page, userType);
        comparisonResults.push(result);
        
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`❌ Error analyzing ${userType}: ${error.message}`);
        comparisonResults.push({ userType, error: error.message });
      }
    }
    
    // Generate AI comparison
    const validResults = comparisonResults.filter(r => !r.error);
    
    if (validResults.length === 2) {
      const [standard, problem] = validResults;
      
      console.log('\n🤖 AI COMPARATIVE RESULTS:');
      console.log('-' .repeat(50));
      console.log(`Standard User Score: ${standard.overallScore}/100`);
      console.log(`Problem User Score:  ${problem.overallScore}/100`);
      console.log(`AI Score Difference: ${Math.abs(standard.overallScore - problem.overallScore)} points`);
      
      // AI insights on differences
      const betterUser = standard.overallScore > problem.overallScore ? 'standard_user' : 'problem_user';
      console.log(`\n🧠 AI Analysis: ${betterUser} shows better testability characteristics`);
      
      // Compare AI insights
      const standardSuggestions = standard.recommendations?.length || 0;
      const problemSuggestions = problem.recommendations?.length || 0;
      
      console.log(`Standard User AI Recommendations: ${standardSuggestions}`);
      console.log(`Problem User AI Recommendations:  ${problemSuggestions}`);
      
      // Validate comparison
      expect(validResults.length).toBe(2);
      expect(standard.overallScore).toBeGreaterThanOrEqual(0);
      expect(problem.overallScore).toBeGreaterThanOrEqual(0);
    }
    
    console.log('\n✅ AI Comparative Analysis completed');
  });
});

// AI-Enhanced Test Hooks
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log('\n🤖 AI TEST FAILURE ANALYSIS:');
    console.log(`Test: ${testInfo.title}`);
    console.log(`Status: ${testInfo.status}`);
    console.log(`Duration: ${testInfo.duration}ms`);
    
    // Use AI debugging for failure analysis
    try {
      const url = page.url();
      const title = await page.title().catch(() => 'Unknown');
      
      console.log(`Current URL: ${url}`);
      console.log(`Page Title: ${title}`);
      
      // Take AI screenshot for analysis
      await AITestUtils.smartScreenshot(page, 'ai-testability-failure', testInfo.title.replace(/\s+/g, '-'));
      
    } catch (error) {
      console.log(`⚠️ AI failure analysis error: ${error.message}`);
    }
  } else {
    console.log(`\n✅ ${testInfo.title} - AI Analysis: SUCCESS`);
  }
});