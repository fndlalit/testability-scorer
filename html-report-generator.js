const fs = require('fs');
const path = require('path');

/**
 * 🎨 HTML Report Generator for 10-Principle Testability Analysis
 * 
 * Creates beautiful, interactive HTML reports with:
 * - Visual scoring charts and graphs
 * - Detailed principle breakdowns
 * - AI recommendations with priority indicators
 * - Comparative analysis tables
 * - Interactive drill-down capabilities
 */

class TestabilityHTMLReportGenerator {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.reportData = null;
  }

  /**
   * 🎨 Generate Complete HTML Report
   */
  generateHTMLReport(testResults, outputPath = null) {
    this.reportData = this.processResults(testResults);
    
    const htmlContent = this.buildHTMLContent();
    
    const reportPath = outputPath || path.join(
      process.cwd(), 
      'tests', 
      'reports', 
      `testability-report-${new Date().toISOString().replace(/[:.]/g, '-')}.html`
    );
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, htmlContent);
    
    console.log(`\n🎨 HTML Report Generated: ${reportPath}`);
    console.log(`📊 Open in browser to view interactive testability analysis`);
    
    return reportPath;
  }

  /**
   * 📊 Process Test Results for Reporting
   */
  processResults(results) {
    const successfulResults = results.filter(r => !r.error);
    const failedResults = results.filter(r => r.error);
    
    const principleNames = [
      'observability', 'controllability', 'algorithmicSimplicity', 
      'algorithmicTransparency', 'algorithmicStability', 'explainability',
      'unbugginess', 'smallness', 'decomposability', 'similarity'
    ];
    
    // Calculate averages and statistics
    const principleAverages = {};
    principleNames.forEach(principle => {
      if (successfulResults.length > 0) {
        principleAverages[principle] = Math.round(
          successfulResults.reduce((sum, r) => sum + (r.principleScores?.[principle] || 0), 0) / successfulResults.length
        );
      } else {
        principleAverages[principle] = 0;
      }
    });

    const overallAverage = successfulResults.length > 0 ? 
      Math.round(successfulResults.reduce((sum, r) => sum + r.overallScore, 0) / successfulResults.length) : 0;

    // Get all recommendations
    const allRecommendations = successfulResults.flatMap(r => r.aiRecommendations || []);
    const criticalRecommendations = allRecommendations.filter(r => r.priority === 'Critical');
    const highRecommendations = allRecommendations.filter(r => r.priority === 'High');

    return {
      timestamp: this.timestamp,
      summary: {
        totalUsers: results.length,
        successfulAnalyses: successfulResults.length,
        failedAnalyses: failedResults.length,
        overallAverage,
        bestUser: successfulResults.reduce((best, current) => 
          (current.overallScore > (best?.overallScore || 0)) ? current : best, null),
        worstUser: successfulResults.reduce((worst, current) => 
          (current.overallScore < (worst?.overallScore || 100)) ? current : worst, null)
      },
      results: successfulResults,
      failedResults,
      principleAverages,
      recommendations: {
        all: allRecommendations,
        critical: criticalRecommendations,
        high: highRecommendations
      }
    };
  }

  /**
   * 🎨 Build Complete HTML Content
   */
  buildHTMLContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 10-Principle Testability Analysis Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        ${this.getCSS()}
    </style>
</head>
<body>
    <div class="container">
        ${this.buildHeader()}
        ${this.buildSummarySection()}
        ${this.buildPrincipleAnalysisSection()}
        ${this.buildDetailedResultsSection()}
        ${this.buildRecommendationsSection()}
        ${this.buildChartsSection()}
        ${this.buildFooter()}
    </div>
    
    <script>
        ${this.getJavaScript()}
    </script>
</body>
</html>`;
  }

  /**
   * 🎨 CSS Styles
   */
  getCSS() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .header h1 {
            color: #2d3748;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            color: #718096;
            font-size: 1.2rem;
        }
        
        .section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .section h2 {
            color: #2d3748;
            font-size: 1.8rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .summary-card h3 {
            font-size: 2rem;
            margin-bottom: 5px;
        }
        
        .summary-card p {
            opacity: 0.9;
        }
        
        .principle-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .principle-card {
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .principle-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .principle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .principle-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2d3748;
        }
        
        .principle-score {
            font-size: 1.5rem;
            font-weight: bold;
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
        }
        
        .score-excellent { background: #48bb78; }
        .score-good { background: #38b2ac; }
        .score-average { background: #ed8936; }
        .score-poor { background: #e53e3e; }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .results-table th,
        .results-table td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .results-table th {
            background: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        
        .results-table tr:hover {
            background: #f7fafc;
        }
        
        .recommendation-card {
            border-left: 4px solid #667eea;
            background: #f7fafc;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        
        .recommendation-critical {
            border-left-color: #e53e3e;
            background: #fed7d7;
        }
        
        .recommendation-high {
            border-left-color: #ed8936;
            background: #feebc8;
        }
        
        .recommendation-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .priority-badge {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
        }
        
        .priority-critical { background: #e53e3e; }
        .priority-high { background: #ed8936; }
        .priority-medium { background: #38b2ac; }
        
        .chart-container {
            position: relative;
            height: 400px;
            margin: 20px 0;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            padding: 20px;
        }
        
        .toggle-section {
            margin-top: 15px;
        }
        
        .toggle-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .toggle-btn:hover {
            background: #5a67d8;
        }
        
        .details {
            display: none;
            margin-top: 15px;
            padding: 15px;
            background: #f7fafc;
            border-radius: 5px;
        }
        
        .emoji {
            font-size: 1.2em;
            margin-right: 8px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .principle-grid {
                grid-template-columns: 1fr;
            }
            
            .summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
  }

  /**
   * 📋 Build Header Section
   */
  buildHeader() {
    return `
        <div class="header">
            <h1><span class="emoji">🎯</span>10-Principle Testability Analysis Report</h1>
            <p class="subtitle">🤖 AI-Enhanced Comprehensive Assessment</p>
            <p class="subtitle">Generated: ${new Date(this.timestamp).toLocaleString()}</p>
        </div>
    `;
  }

  /**
   * 📊 Build Summary Section
   */
  buildSummarySection() {
    const { summary } = this.reportData;
    
    return `
        <div class="section">
            <h2><span class="emoji">📊</span>Executive Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>${summary.overallAverage}</h3>
                    <p>Average Score</p>
                </div>
                <div class="summary-card">
                    <h3>${summary.successfulAnalyses}</h3>
                    <p>Users Analyzed</p>
                </div>
                <div class="summary-card">
                    <h3>${summary.bestUser?.userType || 'N/A'}</h3>
                    <p>Best Performer</p>
                </div>
                <div class="summary-card">
                    <h3>${this.reportData.recommendations.critical.length}</h3>
                    <p>Critical Issues</p>
                </div>
            </div>
            
            ${summary.bestUser ? `
                <div style="margin-top: 20px;">
                    <p><strong>🏆 Best Performance:</strong> ${summary.bestUser.userType} (${summary.bestUser.overallScore}/100)</p>
                    ${summary.worstUser ? `<p><strong>⚠️ Needs Attention:</strong> ${summary.worstUser.userType} (${summary.worstUser.overallScore}/100)</p>` : ''}
                </div>
            ` : ''}
        </div>
    `;
  }

  /**
   * 🎯 Build Principle Analysis Section
   */
  buildPrincipleAnalysisSection() {
    const { principleAverages } = this.reportData;
    
    const principleInfo = {
      observability: { emoji: '🔍', name: 'Observability', description: 'Can we see what\'s happening?' },
      controllability: { emoji: '🎮', name: 'Controllability', description: 'Can we control the application?' },
      algorithmicSimplicity: { emoji: '🧩', name: 'Algorithmic Simplicity', description: 'Are behaviors simple and predictable?' },
      algorithmicTransparency: { emoji: '🔬', name: 'Algorithmic Transparency', description: 'Can we understand what the system does?' },
      algorithmicStability: { emoji: '⚖️', name: 'Algorithmic Stability', description: 'Does behavior remain consistent?' },
      explainability: { emoji: '📖', name: 'Explainability', description: 'Can we understand the interface?' },
      unbugginess: { emoji: '🐛', name: 'Unbugginess', description: 'How error-free is the application?' },
      smallness: { emoji: '📏', name: 'Smallness', description: 'Are components appropriately sized?' },
      decomposability: { emoji: '🔧', name: 'Decomposability', description: 'Can we test parts in isolation?' },
      similarity: { emoji: '🎯', name: 'Similarity', description: 'Does it follow familiar patterns?' }
    };
    
    const principleCards = Object.entries(principleAverages).map(([principle, score]) => {
      const info = principleInfo[principle];
      const scoreClass = score >= 80 ? 'score-excellent' : score >= 60 ? 'score-good' : score >= 40 ? 'score-average' : 'score-poor';
      const progressClass = score >= 80 ? 'score-excellent' : score >= 60 ? 'score-good' : score >= 40 ? 'score-average' : 'score-poor';
      
      return `
        <div class="principle-card">
            <div class="principle-header">
                <div class="principle-title">
                    <span class="emoji">${info.emoji}</span>${info.name}
                </div>
                <div class="principle-score ${scoreClass}">${score}/100</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${progressClass}" style="width: ${score}%"></div>
            </div>
            <p style="color: #718096; font-size: 0.9rem;">${info.description}</p>
            
            <div class="toggle-section">
                <button class="toggle-btn" onclick="toggleDetails('${principle}')">
                    Show Details
                </button>
                <div id="${principle}-details" class="details">
                    ${this.buildPrincipleDetails(principle)}
                </div>
            </div>
        </div>
      `;
    }).join('');
    
    return `
        <div class="section">
            <h2><span class="emoji">🎯</span>Principle Analysis</h2>
            <div class="principle-grid">
                ${principleCards}
            </div>
        </div>
    `;
  }

  /**
   * 📝 Build Principle Details
   */
  buildPrincipleDetails(principle) {
    const userScores = this.reportData.results.map(result => ({
      user: result.userType,
      score: result.principleScores?.[principle] || 0,
      metrics: result.detailedMetrics?.[principle] || {}
    }));
    
    const scoresHtml = userScores.map(({ user, score }) => 
      `<div style="display: flex; justify-content: space-between; margin: 5px 0;">
        <span>${user}:</span> <strong>${score}/100</strong>
      </div>`
    ).join('');
    
    return `
        <div>
            <h4>User Scores:</h4>
            ${scoresHtml}
        </div>
    `;
  }

  /**
   * 📋 Build Detailed Results Section
   */
  buildDetailedResultsSection() {
    const { results } = this.reportData;
    
    const tableRows = results.map(result => {
      const scores = result.principleScores || {};
      return `
        <tr>
            <td><strong>${result.userType}</strong></td>
            <td><strong>${result.overallScore}/100</strong></td>
            <td>${scores.observability || 0}</td>
            <td>${scores.controllability || 0}</td>
            <td>${scores.algorithmicSimplicity || 0}</td>
            <td>${scores.algorithmicTransparency || 0}</td>
            <td>${scores.algorithmicStability || 0}</td>
            <td>${scores.explainability || 0}</td>
            <td>${scores.unbugginess || 0}</td>
            <td>${scores.smallness || 0}</td>
            <td>${scores.decomposability || 0}</td>
            <td>${scores.similarity || 0}</td>
            <td>${result.grade || 'N/A'}</td>
        </tr>
      `;
    }).join('');
    
    return `
        <div class="section">
            <h2><span class="emoji">📋</span>Detailed Results</h2>
            <div style="overflow-x: auto;">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>User Type</th>
                            <th>Overall</th>
                            <th>🔍 OBS</th>
                            <th>🎮 CTL</th>
                            <th>🧩 SIM</th>
                            <th>🔬 TRA</th>
                            <th>⚖️ STA</th>
                            <th>📖 EXP</th>
                            <th>🐛 UNB</th>
                            <th>📏 SMA</th>
                            <th>🔧 DEC</th>
                            <th>🎯 SIM</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
  }

  /**
   * 💡 Build Recommendations Section
   */
  buildRecommendationsSection() {
    const { recommendations } = this.reportData;
    
    const buildRecommendationCard = (rec) => {
      const priorityClass = `recommendation-${rec.priority.toLowerCase()}`;
      const badgeClass = `priority-${rec.priority.toLowerCase()}`;
      
      return `
        <div class="recommendation-card ${priorityClass}">
            <div class="recommendation-header">
                <h4><span class="emoji">${rec.priority === 'Critical' ? '🚨' : '⚠️'}</span>${rec.principle.toUpperCase()}</h4>
                <span class="priority-badge ${badgeClass}">${rec.priority}</span>
            </div>
            <p><strong>Suggestion:</strong> ${rec.suggestion}</p>
            <p style="margin-top: 10px; font-style: italic; color: #718096;">
                <strong>AI Reasoning:</strong> ${rec.aiReasoning}
            </p>
        </div>
      `;
    };
    
    const criticalHtml = recommendations.critical.map(buildRecommendationCard).join('');
    const highHtml = recommendations.high.map(buildRecommendationCard).join('');
    
    return `
        <div class="section">
            <h2><span class="emoji">💡</span>AI-Powered Recommendations</h2>
            
            ${recommendations.critical.length > 0 ? `
                <h3 style="color: #e53e3e; margin-bottom: 15px;">🚨 Critical Priority</h3>
                ${criticalHtml}
            ` : ''}
            
            ${recommendations.high.length > 0 ? `
                <h3 style="color: #ed8936; margin-bottom: 15px; margin-top: 25px;">⚠️ High Priority</h3>
                ${highHtml}
            ` : ''}
            
            ${recommendations.critical.length === 0 && recommendations.high.length === 0 ? `
                <div style="text-align: center; color: #48bb78; padding: 40px;">
                    <span class="emoji">✅</span>
                    <h3>No Critical Issues Found!</h3>
                    <p>All testability principles are performing well.</p>
                </div>
            ` : ''}
        </div>
    `;
  }

  /**
   * 📊 Build Charts Section
   */
  buildChartsSection() {
    return `
        <div class="section">
            <h2><span class="emoji">📊</span>Visual Analysis</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;">
                <div>
                    <h3>Principle Scores Overview</h3>
                    <div class="chart-container">
                        <canvas id="principleChart"></canvas>
                    </div>
                </div>
                
                <div>
                    <h3>User Performance Comparison</h3>
                    <div class="chart-container">
                        <canvas id="userChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  /**
   * 🔧 Build Footer
   */
  buildFooter() {
    return `
        <div class="footer">
            <p><span class="emoji">🤖</span>Generated by AI-Enhanced Playwright Testability Framework</p>
            <p>Powered by 10-Principle Intrinsic Testability Analysis</p>
            <p style="margin-top: 10px; opacity: 0.8;">
                Framework Version: 1.0.0 | Playwright: 1.49.0 | Generated: ${new Date().toLocaleString()}
            </p>
        </div>
    `;
  }

  /**
   * 🔧 JavaScript for Interactivity
   */
  getJavaScript() {
    const { principleAverages, results } = this.reportData;
    
    return `
        // Toggle details visibility
        function toggleDetails(principleId) {
            const details = document.getElementById(principleId + '-details');
            const btn = details.previousElementSibling;
            
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                btn.textContent = 'Hide Details';
            } else {
                details.style.display = 'none';
                btn.textContent = 'Show Details';
            }
        }
        
        // Initialize charts when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Principle Scores Chart
            const principleCtx = document.getElementById('principleChart');
            if (principleCtx) {
                new Chart(principleCtx, {
                    type: 'radar',
                    data: {
                        labels: ${JSON.stringify(Object.keys(principleAverages).map(p => p.charAt(0).toUpperCase() + p.slice(1)))},
                        datasets: [{
                            label: 'Average Scores',
                            data: ${JSON.stringify(Object.values(principleAverages))},
                            borderColor: 'rgb(102, 126, 234)',
                            backgroundColor: 'rgba(102, 126, 234, 0.2)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgb(102, 126, 234)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(102, 126, 234)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    display: true
                                },
                                suggestedMin: 0,
                                suggestedMax: 100,
                                grid: {
                                    circular: true
                                },
                                pointLabels: {
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            // User Performance Chart
            const userCtx = document.getElementById('userChart');
            if (userCtx) {
                new Chart(userCtx, {
                    type: 'bar',
                    data: {
                        labels: ${JSON.stringify(results.map(r => r.userType))},
                        datasets: [{
                            label: 'Overall Score',
                            data: ${JSON.stringify(results.map(r => r.overallScore))},
                            backgroundColor: function(context) {
                                const value = context.parsed.y;
                                if (value >= 80) return 'rgba(72, 187, 120, 0.8)';
                                if (value >= 60) return 'rgba(56, 178, 172, 0.8)';
                                if (value >= 40) return 'rgba(237, 137, 54, 0.8)';
                                return 'rgba(229, 62, 62, 0.8)';
                            },
                            borderColor: function(context) {
                                const value = context.parsed.y;
                                if (value >= 80) return 'rgb(72, 187, 120)';
                                if (value >= 60) return 'rgb(56, 178, 172)';
                                if (value >= 40) return 'rgb(237, 137, 54)';
                                return 'rgb(229, 62, 62)';
                            },
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                    display: true,
                                    text: 'Score (0-100)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'User Types'
                                }
                            }
                        }
                    }
                });
            }
        });
    `;
  }
}

module.exports = { TestabilityHTMLReportGenerator };