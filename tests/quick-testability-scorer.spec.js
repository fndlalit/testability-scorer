const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Simplified Intrinsic Testability Scoring Framework
 * 
 * Quick assessment version focused on core testability metrics
 */

class QuickTestabilityScorer {
  constructor() {
    this.scores = {};
    this.timestamp = new Date().toISOString();
  }

  async scoreObservability(page) {
    let score = 0;
    
    // Data-test attributes (40 points)
    const dataTestElements = await page.locator('[data-test]').count();
    const dataTestScore = Math.min(40, Math.floor(dataTestElements / 2));
    score += dataTestScore;
    
    // Error visibility (30 points)
    const errorElements = await page.locator('[data-test*="error"], .error').count();
    const errorScore = errorElements > 0 ? 30 : 15;
    score += errorScore;
    
    // Visual elements (30 points)
    const imageElements = await page.locator('img').count();
    const visualScore = Math.min(30, imageElements * 3);
    score += visualScore;
    
    console.log(`📊 Observability: ${score}/100 (data-test: ${dataTestElements}, errors: ${errorElements}, images: ${imageElements})`);
    return score;
  }

  async scoreControllability(page) {
    let score = 0;
    
    // Interactive elements (50 points)
    const buttons = await page.locator('button').count();
    const inputs = await page.locator('input').count();
    const interactiveScore = Math.min(50, (buttons + inputs) * 2);
    score += interactiveScore;
    
    // Form elements (30 points)
    const forms = await page.locator('form').count();
    const formScore = Math.min(30, forms * 15);
    score += formScore;
    
    // Navigation elements (20 points)
    const links = await page.locator('a').count();
    const navScore = Math.min(20, Math.floor(links / 2));
    score += navScore;
    
    console.log(`📊 Controllability: ${score}/100 (buttons: ${buttons}, inputs: ${inputs}, forms: ${forms}, links: ${links})`);
    return score;
  }

  async scoreAlgorithmicSimplicity(page) {
    let score = 0;
    
    // Page complexity (50 points)
    const totalElements = await page.locator('*').count();
    const complexityScore = totalElements < 200 ? 50 : totalElements < 500 ? 35 : totalElements < 1000 ? 20 : 10;
    score += complexityScore;
    
    // Clear structure (30 points)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    const structureScore = Math.min(30, headings * 5);
    score += structureScore;
    
    // Simple interactions (20 points)
    const simpleButtons = await page.locator('button[data-test]').count();
    const simplicityScore = Math.min(20, simpleButtons * 2);
    score += simplicityScore;
    
    console.log(`📊 Algorithmic Simplicity: ${score}/100 (elements: ${totalElements}, headings: ${headings}, simple buttons: ${simpleButtons})`);
    return score;
  }

  async scoreExplainability(page) {
    let score = 0;
    
    // Semantic elements (40 points)
    const semanticElements = await page.locator('nav, main, section, article, aside, header, footer').count();
    const semanticScore = Math.min(40, semanticElements * 5);
    score += semanticScore;
    
    // Labels and descriptions (35 points)
    const labels = await page.locator('label').count();
    const altTexts = await page.locator('img[alt]').count();
    const labelScore = Math.min(35, (labels * 5) + (altTexts * 3));
    score += labelScore;
    
    // Accessibility (25 points)
    const ariaElements = await page.locator('[aria-label], [role]').count();
    const accessibilityScore = Math.min(25, ariaElements * 3);
    score += accessibilityScore;
    
    console.log(`📊 Explainability: ${score}/100 (semantic: ${semanticElements}, labels: ${labels}, aria: ${ariaElements})`);
    return score;
  }

  async scoreDecomposability(page) {
    let score = 0;
    
    // Component markers (50 points)
    const componentElements = await page.locator('[data-test], [class], [id]').count();
    const componentScore = Math.min(50, Math.floor(componentElements / 5));
    score += componentScore;
    
    // Modular structure (30 points)
    const containers = await page.locator('div[class], section').count();
    const modularScore = Math.min(30, Math.floor(containers / 3));
    score += modularScore;
    
    // Isolated functionality (20 points)
    const isolatedElements = await page.locator('[data-test]').count();
    const isolationScore = Math.min(20, Math.floor(isolatedElements / 4));
    score += isolationScore;
    
    console.log(`📊 Decomposability: ${score}/100 (components: ${componentElements}, containers: ${containers})`);
    return score;
  }

  async runQuickAssessment(page, userType) {
    console.log(`\n🎯 Quick Testability Assessment for: ${userType}`);
    console.log('=' .repeat(60));
    
    try {
      // Navigate and login
      await page.goto('https://www.saucedemo.com/', { timeout: 30000 });
      await page.locator('[data-test="username"]').fill(userType);
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      // Check if login was successful
      const loginSuccess = await page.locator('[data-test="inventory-container"]').isVisible({ timeout: 10000 }).catch(() => false);
      
      if (!loginSuccess) {
        console.log(`⚠️  ${userType}: Login failed or blocked`);
        return { userType, error: 'Login failed', scores: {} };
      }
      
      console.log(`✅ ${userType}: Successfully logged in`);
      
      // Run scoring
      const scores = {
        observability: await this.scoreObservability(page),
        controllability: await this.scoreControllability(page),
        algorithmicSimplicity: await this.scoreAlgorithmicSimplicity(page),
        explainability: await this.scoreExplainability(page),
        decomposability: await this.scoreDecomposability(page)
      };
      
      const overallScore = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length);
      
      console.log(`\n🎯 OVERALL SCORE for ${userType}: ${overallScore}/100`);
      console.log('=' .repeat(60));
      
      return {
        userType,
        timestamp: this.timestamp,
        overallScore,
        scores,
        grade: this.getGrade(overallScore)
      };
      
    } catch (error) {
      console.log(`❌ Error assessing ${userType}: ${error.message}`);
      return { userType, error: error.message, scores: {} };
    }
  }

  getGrade(score) {
    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Average)';
    if (score >= 60) return 'D (Below Average)';
    return 'F (Poor)';
  }

  generateComparisonReport(results) {
    const successfulResults = results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      return 'No successful assessments to report.';
    }
    
    let report = `\n📊 INTRINSIC TESTABILITY COMPARISON REPORT\n`;
    report += `Generated: ${this.timestamp}\n`;
    report += '=' .repeat(80) + '\n\n';
    
    // Summary table
    report += 'USER TYPE           | OVERALL | OBSERV | CONTROL | SIMPLE | EXPLAIN | DECOMP | GRADE\n';
    report += '-' .repeat(80) + '\n';
    
    successfulResults.forEach(result => {
      const s = result.scores;
      report += `${result.userType.padEnd(19)} | ${result.overallScore.toString().padStart(7)} | ${s.observability.toString().padStart(6)} | ${s.controllability.toString().padStart(7)} | ${s.algorithmicSimplicity.toString().padStart(6)} | ${s.explainability.toString().padStart(7)} | ${s.decomposability.toString().padStart(6)} | ${result.grade}\n`;
    });
    
    // Analysis
    const averageScore = Math.round(successfulResults.reduce((sum, r) => sum + r.overallScore, 0) / successfulResults.length);
    const bestUser = successfulResults.reduce((best, current) => current.overallScore > best.overallScore ? current : best);
    const worstUser = successfulResults.reduce((worst, current) => current.overallScore < worst.overallScore ? current : worst);
    
    report += '\n📈 ANALYSIS:\n';
    report += '-' .repeat(40) + '\n';
    report += `Average Testability Score: ${averageScore}/100\n`;
    report += `Best Performing User: ${bestUser.userType} (${bestUser.overallScore}/100)\n`;
    report += `Worst Performing User: ${worstUser.userType} (${worstUser.overallScore}/100)\n`;
    report += `Score Range: ${worstUser.overallScore}-${bestUser.overallScore} (${bestUser.overallScore - worstUser.overallScore} point spread)\n\n`;
    
    // Principle analysis
    const principleAverages = {};
    ['observability', 'controllability', 'algorithmicSimplicity', 'explainability', 'decomposability'].forEach(principle => {
      principleAverages[principle] = Math.round(successfulResults.reduce((sum, r) => sum + r.scores[principle], 0) / successfulResults.length);
    });
    
    report += '🎯 PRINCIPLE STRENGTH ANALYSIS:\n';
    report += '-' .repeat(40) + '\n';
    Object.entries(principleAverages)
      .sort(([,a], [,b]) => b - a)
      .forEach(([principle, avg]) => {
        const strength = avg >= 80 ? '🟢 Strong' : avg >= 60 ? '🟡 Moderate' : '🔴 Weak';
        report += `${principle.padEnd(20)}: ${avg.toString().padStart(3)}/100 ${strength}\n`;
      });
    
    // Recommendations
    report += '\n💡 RECOMMENDATIONS:\n';
    report += '-' .repeat(40) + '\n';
    Object.entries(principleAverages).forEach(([principle, avg]) => {
      if (avg < 70) {
        const recommendations = {
          observability: 'Add more data-test attributes and error visibility',
          controllability: 'Improve interactive element accessibility and form design',
          algorithmicSimplicity: 'Reduce page complexity and improve semantic structure',
          explainability: 'Add semantic HTML elements and accessibility attributes',
          decomposability: 'Improve component separation and modular design'
        };
        report += `• ${principle}: ${recommendations[principle] || 'Review and improve'}\n`;
      }
    });
    
    return report;
  }
}

// Test suite
test.describe('Quick Intrinsic Testability Assessment', () => {
  
  test('Assess all SauceDemo user types', async ({ page, browserName }) => {
    const scorer = new QuickTestabilityScorer();
    const userTypes = ['standard_user', 'problem_user', 'performance_glitch_user', 'visual_user', 'error_user'];
    
    console.log('\n🚀 STARTING QUICK TESTABILITY ASSESSMENT');
    console.log(`Browser: ${browserName}`);
    console.log('=' .repeat(60));
    
    const results = [];
    
    for (const userType of userTypes) {
      const result = await scorer.runQuickAssessment(page, userType);
      results.push(result);
      
      // Small delay between assessments
      await page.waitForTimeout(1000);
    }
    
    // Generate and display report
    const report = scorer.generateComparisonReport(results);
    console.log(report);
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = path.join(process.cwd(), 'tests', 'reports', `quick-testability-${browserName}-${timestamp}.json`);
    
    const reportData = {
      timestamp: scorer.timestamp,
      browser: browserName,
      results,
      summary: {
        totalAssessed: results.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        averageScore: results.filter(r => !r.error).length > 0 ? 
          Math.round(results.filter(r => !r.error).reduce((sum, r) => sum + r.overallScore, 0) / results.filter(r => !r.error).length) : 0
      }
    };
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(resultsPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(resultsPath, JSON.stringify(reportData, null, 2));
    
    // Save text report
    const reportPath = resultsPath.replace('.json', '-report.txt');
    fs.writeFileSync(reportPath, report);
    
    console.log(`\n💾 Results saved to: ${resultsPath}`);
    console.log(`📄 Report saved to: ${reportPath}`);
    
    // Assertions
    const successfulResults = results.filter(r => !r.error);
    expect(successfulResults.length).toBeGreaterThan(0); // At least one successful assessment
    
    if (successfulResults.length > 0) {
      const averageScore = successfulResults.reduce((sum, r) => sum + r.overallScore, 0) / successfulResults.length;
      expect(averageScore).toBeGreaterThan(50); // Minimum acceptable testability
    }
  });
  
  test('Compare specific user types', async ({ page }) => {
    const scorer = new QuickTestabilityScorer();
    const targetUsers = ['standard_user', 'problem_user'];
    
    console.log('\n🔍 TARGETED USER COMPARISON');
    console.log('=' .repeat(60));
    
    const results = [];
    
    for (const userType of targetUsers) {
      const result = await scorer.runQuickAssessment(page, userType);
      results.push(result);
    }
    
    // Compare results
    const successfulResults = results.filter(r => !r.error);
    
    if (successfulResults.length >= 2) {
      const [user1, user2] = successfulResults;
      
      console.log(`\n📊 COMPARISON: ${user1.userType} vs ${user2.userType}`);
      console.log('=' .repeat(60));
      console.log(`Overall Score: ${user1.overallScore} vs ${user2.overallScore} (${user1.overallScore - user2.overallScore > 0 ? '+' : ''}${user1.overallScore - user2.overallScore})`);
      
      Object.keys(user1.scores).forEach(principle => {
        const diff = user1.scores[principle] - user2.scores[principle];
        console.log(`${principle.padEnd(20)}: ${user1.scores[principle].toString().padStart(3)} vs ${user2.scores[principle].toString().padStart(3)} (${diff > 0 ? '+' : ''}${diff})`);
      });
      
      // Determine which user has better testability
      const betterUser = user1.overallScore > user2.overallScore ? user1 : user2;
      console.log(`\n🏆 Better Testability: ${betterUser.userType} (${betterUser.overallScore}/100)`);
    }
    
    expect(successfulResults.length).toBeGreaterThan(0);
  });
});