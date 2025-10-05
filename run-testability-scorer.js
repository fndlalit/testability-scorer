#!/usr/bin/env node

/**
 * Testability Scorer Runner
 * 
 * This script provides easy commands to run testability scoring
 * and compare results over time.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPTS = {
  score: 'npx playwright test testability-scorer.spec.js --workers=1',
  compare: 'npx playwright test testability-scorer.spec.js --grep="Comparison" --workers=1',
  full: 'npx playwright test testability-scorer.spec.js --workers=1',
  report: 'generateReport'
};

function runCommand(command) {
  console.log(`🚀 Running: ${command}`);
  
  const [cmd, ...args] = command.split(' ');
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Command completed successfully');
      if (command.includes('testability-scorer')) {
        showLatestReport();
      }
    } else {
      console.log(`❌ Command failed with exit code ${code}`);
    }
  });
}

function showLatestReport() {
  const reportsDir = path.join(process.cwd(), 'tests', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    console.log('📁 No reports directory found');
    return;
  }
  
  const files = fs.readdirSync(reportsDir)
    .filter(file => file.endsWith('-report.txt'))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(reportsDir, file)).mtime
    }))
    .sort((a, b) => b.time - a.time);
  
  if (files.length > 0) {
    const latestReport = path.join(reportsDir, files[0].name);
    console.log('\n📊 LATEST TESTABILITY REPORT:');
    console.log('=' .repeat(60));
    console.log(fs.readFileSync(latestReport, 'utf8'));
  }
}

function generateReport() {
  const reportsDir = path.join(process.cwd(), 'tests', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    console.log('📁 No reports directory found. Run scoring first.');
    return;
  }
  
  const jsonFiles = fs.readdirSync(reportsDir)
    .filter(file => (file.startsWith('testability-scores-') || file.startsWith('quick-testability-')) && file.endsWith('.json'))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(reportsDir, file)).mtime,
      data: JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'))
    }))
    .sort((a, b) => b.time - a.time);
  
  if (jsonFiles.length === 0) {
    console.log('📊 No testability score files found. Run scoring first.');
    return;
  }
  
  console.log('\n📈 TESTABILITY SCORE HISTORY');
  console.log('=' .repeat(80));
  console.log('Timestamp                | Overall | Type     | Browser  | Grade');
  console.log('-' .repeat(80));
  
  jsonFiles.slice(0, 10).forEach(file => {
    const data = file.data;
    const timestamp = new Date(data.timestamp).toLocaleString();
    const overall = data.summary ? data.summary.averageScore : (data.overallScore || 'N/A');
    const type = file.name.includes('quick') ? 'Quick' : 'Full';
    const browser = data.browser || 'Unknown';
    const grade = overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F';
    
    console.log(`${timestamp.padEnd(24)} | ${overall.toString().padStart(7)} | ${type.padEnd(8)} | ${browser.padEnd(8)} | ${grade}`);
  });
  
  if (jsonFiles.length >= 2) {
    const latest = jsonFiles[0].data;
    const previous = jsonFiles[1].data;
    
    console.log('\n📊 SCORE CHANGES (Latest vs Previous):');
    console.log('-' .repeat(50));
    
    const latestScore = latest.summary ? latest.summary.averageScore : latest.overallScore;
    const previousScore = previous.summary ? previous.summary.averageScore : previous.overallScore;
    
    if (latestScore && previousScore) {
      const change = latestScore - previousScore;
      const arrow = change > 0 ? '↗️' : change < 0 ? '↘️' : '➡️';
      console.log(`Overall Score: ${latestScore} ${arrow} ${change >= 0 ? '+' : ''}${change} (from ${previousScore})`);
    }
    
    // Show principle changes if available
    if (latest.results && latest.results[0] && latest.results[0].scores) {
      console.log('\nPrinciple Changes:');
      const latestScores = latest.results[0].scores;
      const previousScores = previous.results && previous.results[0] ? previous.results[0].scores : {};
      
      Object.entries(latestScores).forEach(([principle, score]) => {
        const previousScore = previousScores[principle] || 0;
        const change = score - previousScore;
        const arrow = change > 0 ? '↗️' : change < 0 ? '↘️' : '➡️';
        console.log(`${principle.padEnd(25)}: ${score.toString().padStart(3)} ${arrow} ${change >= 0 ? '+' : ''}${change}`);
      });
    }
  }
}

function showHelp() {
  console.log(`
🎯 TESTABILITY SCORER - HELP

Usage: node run-testability-scorer.js [command]

Commands:
  score     - Run complete testability assessment
  compare   - Run user type comparison only  
  full      - Run all testability tests
  report    - Show score history and trends
  help      - Show this help message

Examples:
  node run-testability-scorer.js score
  node run-testability-scorer.js compare
  node run-testability-scorer.js report

The scorer evaluates your application against all 10 Intrinsic Testability principles:
1. Observability       6. Explainability
2. Controllability     7. Unbugginess  
3. Algorithmic Simplicity  8. Smallness
4. Algorithmic Transparency  9. Decomposability
5. Algorithmic Stability    10. Similarity

Scores: 90-100 (A), 80-89 (B), 70-79 (C), 60-69 (D), <60 (F)
`);
}

// Main execution
const command = process.argv[2];

if (!command || command === 'help') {
  showHelp();
} else if (command === 'report') {
  generateReport();
} else if (SCRIPTS[command]) {
  if (command === 'report') {
    generateReport();
  } else {
    runCommand(SCRIPTS[command]);
  }
} else {
  console.log(`❌ Unknown command: ${command}`);
  console.log('Run "node run-testability-scorer.js help" for available commands');
}