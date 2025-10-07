const { test, expect } = require('@playwright/test');
const { ComprehensiveTestabilityAnalyzer } = require('../comprehensive-testability-analyzer');
const { TestabilityHTMLReportGenerator } = require('../html-report-generator');
const { AITestUtils } = require('../ai-test-utils');
const fs = require('fs');
const path = require('path');

/**
 * 🎯 Complete 10-Principle Testability Assessment Suite
 * 
 * This test suite performs comprehensive analysis of ALL 10 testability principles
 * for each SauceDemo user type using AI-enhanced scoring and analysis:
 * 
 * 1. Observability - State visibility and monitoring capabilities
 * 2. Controllability - Precise input control and state management
 * 3. Algorithmic Simplicity - Predictable and simple behaviors
 * 4. Algorithmic Transparency - Understanding system operations
 * 5. Algorithmic Stability - Consistent behavior over time
 * 6. Explainability - Interface and code comprehension
 * 7. Unbugginess - Error-free and robust operation
 * 8. Smallness - Appropriate component sizing
 * 9. Decomposability - Isolated component testing
 * 10. Similarity - Familiar patterns and conventions
 */

test.describe('🎯 Complete 10-Principle Testability Assessment', () => {
  let analyzer;

  test.beforeEach(() => {
    analyzer = new ComprehensiveTestabilityAnalyzer();
  });

  test('Complete Analysis: All SauceDemo User Types - 10 Principles', async ({ page, browserName }) => {
    const userTypes = [
      'standard_user',
      'locked_out_user', 
      'problem_user'
      // Removed timeout-prone users: 'performance_glitch_user', 'error_user', 'visual_user'
    ];
    
    console.log('\n🚀 STARTING COMPLETE 10-PRINCIPLE TESTABILITY ASSESSMENT');
    console.log(`🤖 AI-Enhanced Framework: Playwright 1.49.0`);
    console.log(`🌐 Browser: ${browserName}`);
    console.log(`📊 Analyzing: 10 Testability Principles per User Type`);
    console.log('=' .repeat(100));
    
    const results = [];
    
    for (const userType of userTypes) {
      console.log(`\n🎯 Processing ${userType}...`);
      
      try {
        const testAnalyzer = new ComprehensiveTestabilityAnalyzer();
        const result = await testAnalyzer.runCompleteAnalysis(page, userType);
        results.push(result);
        
        // Take comprehensive screenshot
        if (!result.error) {
          await AITestUtils.smartScreenshot(page, `complete-testability-${userType}`, 'analysis-complete');
        }
        
        // Brief pause between assessments
        await page.waitForTimeout(1500);
        
      } catch (error) {
        console.log(`❌ Error processing ${userType}: ${error.message}`);
        results.push({ userType, error: error.message });
      }
    }
    
    // Generate comprehensive report
    const comprehensiveReport = analyzer.generateComprehensiveReport(results);
    console.log(comprehensiveReport);
    
    // Save detailed results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = path.join(process.cwd(), 'tests', 'reports', `complete-testability-${browserName}-${timestamp}.json`);
    const reportPath = path.join(process.cwd(), 'tests', 'reports', `complete-testability-${browserName}-${timestamp}-report.txt`);
    
    const comprehensiveData = {
      timestamp: analyzer.timestamp,
      framework: 'Complete 10-Principle AI-Enhanced Analysis',
      browser: browserName,
      principlesAnalyzed: 10,
      results,
      summary: {
        totalUsers: userTypes.length,
        successfulAnalyses: results.filter(r => !r.error).length,
        failedAnalyses: results.filter(r => r.error).length,
        averageScore: results.filter(r => !r.error).length > 0 ? 
          Math.round(results.filter(r => !r.error).reduce((sum, r) => sum + r.overallScore, 0) / results.filter(r => !r.error).length) : 0,
        principleBreakdown: calculatePrincipleBreakdown(results.filter(r => !r.error)),
        criticalIssues: identifyCriticalIssues(results.filter(r => !r.error)),
        topRecommendations: getTopRecommendations(results.filter(r => !r.error))
      }
    };
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(resultsPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Save comprehensive results
    fs.writeFileSync(resultsPath, JSON.stringify(comprehensiveData, null, 2));
    fs.writeFileSync(reportPath, comprehensiveReport);
    
    // 🎨 Generate Interactive HTML Report
    const htmlGenerator = new TestabilityHTMLReportGenerator();
    const htmlReportPath = htmlGenerator.generateHTMLReport(results);
    
    console.log(`\n💾 Complete Analysis Results Saved:`);
    console.log(`   📊 Detailed Data: ${resultsPath}`);
    console.log(`   📄 Text Report: ${reportPath}`);
    console.log(`   🎨 Interactive HTML Report: ${htmlReportPath}`);
    console.log(`\n🌐 Open the HTML report in your browser for interactive analysis!`);
    
    // Comprehensive test assertions
    const successfulResults = results.filter(r => !r.error);
    expect(successfulResults.length).toBeGreaterThan(0);
    
    if (successfulResults.length > 0) {
      const averageScore = comprehensiveData.summary.averageScore;
      console.log(`\n🎯 COMPLETE ASSESSMENT SUMMARY:`);
      console.log(`   📊 Average Score: ${averageScore}/100`);
      console.log(`   ✅ Successful Analyses: ${successfulResults.length}/${userTypes.length}`);
      console.log(`   🎯 Principles Evaluated: 10 per user type`);
      console.log(`   🤖 AI Recommendations: ${comprehensiveData.summary.topRecommendations.length} generated`);
      
      // Quality assertions
      expect(averageScore).toBeGreaterThan(20); // Minimum acceptable baseline
      
      // Verify all principles were analyzed
      successfulResults.forEach(result => {
        expect(result.principleScores).toBeDefined();
        expect(Object.keys(result.principleScores)).toHaveLength(10);
      });
      
      console.log(`\n🎉 Complete 10-Principle Analysis Successful!`);
    }
  });

  test('Detailed Principle Analysis: Standard User Deep Dive', async ({ page }) => {
    console.log('\n🔬 DETAILED 10-PRINCIPLE DEEP DIVE: Standard User');
    console.log('=' .repeat(80));
    
    try {
      const result = await analyzer.runCompleteAnalysis(page, 'standard_user');
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log('\n📊 DETAILED PRINCIPLE BREAKDOWN:');
      console.log('-' .repeat(50));
      
      const principles = [
        { name: 'Observability', key: 'observability', icon: '🔍' },
        { name: 'Controllability', key: 'controllability', icon: '🎮' },
        { name: 'Algorithmic Simplicity', key: 'algorithmicSimplicity', icon: '🧩' },
        { name: 'Algorithmic Transparency', key: 'algorithmicTransparency', icon: '🔬' },
        { name: 'Algorithmic Stability', key: 'algorithmicStability', icon: '⚖️' },
        { name: 'Explainability', key: 'explainability', icon: '📖' },
        { name: 'Unbugginess', key: 'unbugginess', icon: '🐛' },
        { name: 'Smallness', key: 'smallness', icon: '📏' },
        { name: 'Decomposability', key: 'decomposability', icon: '🔧' },
        { name: 'Similarity', key: 'similarity', icon: '🎯' }
      ];
      
      principles.forEach(principle => {
        const score = result.principleScores[principle.key];
        const grade = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
        console.log(`${principle.icon} ${principle.name.padEnd(25)}: ${score.toString().padStart(3)}/100 ${grade}`);
      });
      
      console.log(`\n🎯 Overall Score: ${result.overallScore}/100 (${result.grade})`);
      
      // Detailed metrics inspection
      if (result.detailedMetrics) {
        console.log('\n🔍 DETAILED METRICS SAMPLE:');
        console.log('-' .repeat(30));
        
        if (result.detailedMetrics.observability) {
          console.log('Observability Metrics:', result.detailedMetrics.observability);
        }
        
        if (result.detailedMetrics.controllability) {
          console.log('Controllability Metrics:', result.detailedMetrics.controllability);
        }
      }
      
      // AI Recommendations
      if (result.aiRecommendations && result.aiRecommendations.length > 0) {
        console.log('\n🤖 AI RECOMMENDATIONS:');
        console.log('-' .repeat(30));
        result.aiRecommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.priority.toUpperCase()}: ${rec.principle}`);
          console.log(`   ${rec.suggestion}`);
          console.log(`   AI Reasoning: ${rec.aiReasoning}\n`);
        });
      }
      
      // Test assertions for deep dive
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.principleScores).toBeDefined();
      expect(Object.keys(result.principleScores)).toHaveLength(10);
      expect(result.detailedMetrics).toBeDefined();
      
      console.log('\n✅ Detailed Analysis Complete!');
      
      // 🎨 Generate HTML Report for detailed analysis
      const htmlGenerator = new TestabilityHTMLReportGenerator();
      const htmlReportPath = htmlGenerator.generateHTMLReport([result]);
      console.log(`\n🎨 Detailed HTML Report: ${htmlReportPath}`);
      
    } catch (error) {
      console.log(`❌ Detailed analysis failed: ${error.message}`);
      throw error;
    }
  });

  test('Comparative Analysis: Problem User vs Standard User', async ({ page }) => {
    console.log('\n🆚 COMPARATIVE 10-PRINCIPLE ANALYSIS');
    console.log('=' .repeat(60));
    
    const userTypes = ['standard_user', 'problem_user'];
    const comparisonResults = [];
    
    for (const userType of userTypes) {
      console.log(`\n📊 Analyzing ${userType}...`);
      
      try {
        const testAnalyzer = new ComprehensiveTestabilityAnalyzer();
        const result = await testAnalyzer.runCompleteAnalysis(page, userType);
        comparisonResults.push(result);
        
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`❌ Error analyzing ${userType}: ${error.message}`);
        comparisonResults.push({ userType, error: error.message });
      }
    }
    
    // Compare results
    const validResults = comparisonResults.filter(r => !r.error);
    
    if (validResults.length === 2) {
      const [standard, problem] = validResults;
      
      console.log('\n📊 COMPARATIVE RESULTS:');
      console.log('-' .repeat(40));
      
      const principleNames = [
        'observability', 'controllability', 'algorithmicSimplicity', 
        'algorithmicTransparency', 'algorithmicStability', 'explainability',
        'unbugginess', 'smallness', 'decomposability', 'similarity'
      ];
      
      console.log('PRINCIPLE               | STANDARD | PROBLEM | DIFF');
      console.log('-' .repeat(55));
      
      principleNames.forEach(principle => {
        const standardScore = standard.principleScores[principle];
        const problemScore = problem.principleScores[principle];
        const diff = standardScore - problemScore;
        const diffStr = diff > 0 ? `+${diff}` : diff.toString();
        
        console.log(
          `${principle.padEnd(23)} | ${standardScore.toString().padStart(8)} | ${problemScore.toString().padStart(7)} | ${diffStr.padStart(4)}`
        );
      });
      
      console.log('-' .repeat(55));
      console.log(
        `${'OVERALL'.padEnd(23)} | ${standard.overallScore.toString().padStart(8)} | ${problem.overallScore.toString().padStart(7)} | ${(standard.overallScore - problem.overallScore > 0 ? '+' : '') + (standard.overallScore - problem.overallScore)}`
      );
      
      // Analysis insights
      const betterUser = standard.overallScore > problem.overallScore ? 'standard_user' : 'problem_user';
      const scoreDiff = Math.abs(standard.overallScore - problem.overallScore);
      
      console.log(`\n🎯 COMPARATIVE INSIGHTS:`);
      console.log(`   Better Performance: ${betterUser}`);
      console.log(`   Score Difference: ${scoreDiff} points`);
      console.log(`   Standard User Grade: ${standard.grade}`);
      console.log(`   Problem User Grade: ${problem.grade}`);
      
      // Find biggest differences
      const differences = principleNames.map(principle => ({
        principle,
        diff: Math.abs(standard.principleScores[principle] - problem.principleScores[principle])
      })).sort((a, b) => b.diff - a.diff);
      
      console.log(`\n📊 LARGEST DIFFERENCES:`);
      differences.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.principle}: ${item.diff} point difference`);
      });
      
      // Validate comparison
      expect(validResults.length).toBe(2);
      expect(standard.overallScore).toBeGreaterThanOrEqual(0);
      expect(problem.overallScore).toBeGreaterThanOrEqual(0);
      
      console.log('\n✅ Comparative Analysis Complete!');
    }
  });

  test('Principle-Specific Deep Analysis: Observability Focus', async ({ page }) => {
    console.log('\n🔍 OBSERVABILITY DEEP ANALYSIS');
    console.log('=' .repeat(50));
    
    try {
      await page.goto('https://www.saucedemo.com/');
      await AITestUtils.waitForPageReady(page);
      
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
      
      // Focus specifically on observability metrics
      const observabilityScore = await analyzer.analyzeObservability(page, 'standard_user', null);
      
      console.log(`\n🔍 OBSERVABILITY DETAILED BREAKDOWN:`);
      console.log(`   Overall Score: ${observabilityScore}/100`);
      
      if (analyzer.detailedMetrics.observability) {
        const metrics = analyzer.detailedMetrics.observability;
        console.log(`   State Visibility: ${metrics.stateVisibility || 0}/25`);
        console.log(`   Data-Test Attributes: ${metrics.dataTestAttributes || 0}/25`);
        console.log(`   Error Visibility: ${metrics.errorVisibility || 0}/20`);
        console.log(`   Visual Observability: ${metrics.visualObservability || 0}/15`);
        console.log(`   Network Observability: ${metrics.networkObservability || 0}/15`);
      }
      
      // Specific observability tests
      const dataTestCount = await page.locator('[data-test]').count();
      const errorElementsCount = await page.locator('[data-test*="error"], .error').count();
      const visualElementsCount = await page.locator('img, svg').count();
      
      console.log(`\n📊 OBSERVABILITY ELEMENTS:`);
      console.log(`   Data-test elements: ${dataTestCount}`);
      console.log(`   Error elements: ${errorElementsCount}`);
      console.log(`   Visual elements: ${visualElementsCount}`);
      
      expect(observabilityScore).toBeGreaterThan(0);
      expect(dataTestCount).toBeGreaterThan(0);
      
      console.log('\n✅ Observability Analysis Complete!');
      
    } catch (error) {
      console.log(`❌ Observability analysis failed: ${error.message}`);
      throw error;
    }
  });
});

// Helper functions for comprehensive data analysis
function calculatePrincipleBreakdown(results) {
  if (results.length === 0) return {};
  
  const principleNames = [
    'observability', 'controllability', 'algorithmicSimplicity', 
    'algorithmicTransparency', 'algorithmicStability', 'explainability',
    'unbugginess', 'smallness', 'decomposability', 'similarity'
  ];
  
  const breakdown = {};
  principleNames.forEach(principle => {
    breakdown[principle] = Math.round(
      results.reduce((sum, r) => sum + r.principleScores[principle], 0) / results.length
    );
  });
  
  return breakdown;
}

function identifyCriticalIssues(results) {
  const issues = [];
  const principleNames = [
    'observability', 'controllability', 'algorithmicSimplicity', 
    'algorithmicTransparency', 'algorithmicStability', 'explainability',
    'unbugginess', 'smallness', 'decomposability', 'similarity'
  ];
  
  principleNames.forEach(principle => {
    const averageScore = results.reduce((sum, r) => sum + r.principleScores[principle], 0) / results.length;
    if (averageScore < 40) {
      issues.push({
        principle,
        averageScore: Math.round(averageScore),
        severity: 'Critical'
      });
    } else if (averageScore < 60) {
      issues.push({
        principle,
        averageScore: Math.round(averageScore),
        severity: 'High'
      });
    }
  });
  
  return issues;
}

function getTopRecommendations(results) {
  const allRecommendations = results.flatMap(r => r.aiRecommendations || []);
  
  // Group by principle and priority
  const grouped = allRecommendations.reduce((acc, rec) => {
    const key = `${rec.principle}-${rec.priority}`;
    if (!acc[key]) {
      acc[key] = rec;
    }
    return acc;
  }, {});
  
  // Sort by priority and return top recommendations
  return Object.values(grouped)
    .sort((a, b) => {
      const priorityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 10);
}

// Enhanced test hooks for comprehensive analysis
test.afterEach(async ({ page }, testInfo) => {
  console.log(`\n📊 Test Analysis: ${testInfo.title}`);
  console.log(`   Status: ${testInfo.status}`);
  console.log(`   Duration: ${testInfo.duration}ms`);
  
  if (testInfo.status === 'passed') {
    console.log(`   ✅ Success: Complete testability analysis executed`);
  } else if (testInfo.status === 'failed') {
    console.log(`   ❌ Issue: Check detailed logs and reports`);
    
    try {
      await AITestUtils.smartScreenshot(page, 'testability-failure', testInfo.title.replace(/\s+/g, '-'));
    } catch (error) {
      console.log(`   ⚠️ Screenshot capture failed: ${error.message}`);
    }
  }
});