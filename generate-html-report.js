#!/usr/bin/env node

/**
 * 🎨 Testability HTML Report Runner
 * 
 * Simple script to run testability analysis and generate beautiful HTML reports
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Open file in default browser (cross-platform)
 * @param {string} filePath - Path to HTML file
 */
function openInBrowser(filePath) {
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
  
  console.log(`🚀 Opening report in default browser...`);
  
  exec(`${start} "${filePath}"`, (error) => {
    if (error) {
      console.log(`⚠️  Could not automatically open browser: ${error.message}`);
      console.log(`📂 Please manually open: ${filePath}`);
    } else {
      console.log(`✅ Report opened successfully in your default browser!`);
    }
  });
}

/**
 * Check for and open the most recent HTML report
 */
function checkAndOpenReport() {
  const reportsDir = path.join(process.cwd(), 'tests', 'reports');
  if (fs.existsSync(reportsDir)) {
    const htmlFiles = fs.readdirSync(reportsDir)
      .filter(file => file.endsWith('.html') && file.includes('testability-report'))
      .map(file => ({
        name: file,
        path: path.join(reportsDir, file),
        stats: fs.statSync(path.join(reportsDir, file))
      }))
      .sort((a, b) => b.stats.mtime - a.stats.mtime);
    
    if (htmlFiles.length > 0) {
      const latestReport = htmlFiles[0];
      const reportAge = Date.now() - latestReport.stats.mtime;
      
      // Only open reports generated in the last 2 minutes (recent run)
      if (reportAge < 120000) {
        console.log(`\n🌐 Latest HTML Report: ${latestReport.path}`);
        console.log(`📂 Opening report in your default browser...`);
        
        // Open the report in default browser (cross-platform)
        openInBrowser(latestReport.path);
      } else {
        console.log(`\n🌐 HTML reports available in: ${reportsDir}`);
        console.log(`📂 Latest report: ${latestReport.name}`);
      }
    } else {
      console.log(`\n⚠️  No HTML reports found in: ${reportsDir}`);
    }
  }
}

const COMMANDS = {
  'complete': {
    description: '🎯 Complete 10-principle analysis for all user types with HTML report',
    command: 'npm test -- --project=chromium "tests/complete-10-principle-testability.spec.js" --grep "Complete Analysis"'
  },
  'detailed': {
    description: '🔬 Detailed analysis for standard user with HTML report',
    command: 'npm test -- --project=chromium "tests/complete-10-principle-testability.spec.js" --grep "Detailed Principle Analysis"'
  },
  'detailed-single': {
    description: '🎯 Single detailed principle analysis with instant HTML report',
    command: 'npm test -- tests/complete-10-principle-testability.spec.js --grep "Detailed Principle"'
  },
  'all-tests': {
    description: '🚀 Run ALL tests in complete-10-principle-testability.spec.js with HTML report',
    command: 'npm test -- --project=chromium tests/complete-10-principle-testability.spec.js'
  },
  'comparison': {
    description: '🆚 Comparative analysis with HTML report',
    command: 'npm test -- --project=chromium "tests/complete-10-principle-testability.spec.js" --grep "Comparative Analysis"'
  },
  'observability': {
    description: '🔍 Observability-focused analysis with HTML report',
    command: 'npm test -- --project=chromium "tests/complete-10-principle-testability.spec.js" --grep "Observability Focus"'
  },
  'ai': {
    description: '🤖 AI-enhanced testability scoring with HTML report',
    command: 'npm test -- --project=chromium "tests/ai-testability-scorer.spec.js"'
  },
  'failures': {
    description: '🚨 Testability failure examples with HTML report - perfect for conference demos',
    command: 'npm test -- --project=chromium "tests/testability-failure-examples.spec.js" --reporter=list'
  },
  'failures-demo': {
    description: '🎤 Testability failure examples with slow motion and HTML report - conference presentation mode',
    command: 'npm test -- --project=chromium "tests/testability-failure-examples.spec.js" --headed --slowMo=1000 --reporter=list'
  }
};

function showHelp() {
  console.log(`
🎨 Testability HTML Report Generator
=====================================

Usage: node generate-html-report.js [command]

Available commands:
`);
  
  Object.entries(COMMANDS).forEach(([cmd, info]) => {
    console.log(`  ${cmd.padEnd(12)} - ${info.description}`);
  });
  
  console.log(`
  help         - Show this help message

Examples:
  node generate-html-report.js complete        # Full analysis with HTML report
  node generate-html-report.js detailed        # Detailed analysis with HTML report
  node generate-html-report.js detailed-single # Single detailed analysis with HTML report
  node generate-html-report.js all-tests       # ALL tests in complete-10-principle with HTML report
  node generate-html-report.js comparison      # Comparative analysis with HTML report
  node generate-html-report.js failures        # 🚨 Failure examples with HTML report
  node generate-html-report.js failures-demo   # 🎤 Failure examples (slow motion) with HTML report

📊 Conference Demo Commands:
  failures      - Perfect for showing testability challenges with interactive reports
  failures-demo - Slow motion version ideal for live presentations

The HTML reports will be generated in: tests/reports/
Open the generated HTML file in your browser for interactive analysis.
`);
}

function runCommand(commandKey) {
  const command = COMMANDS[commandKey];
  if (!command) {
    console.log(`❌ Unknown command: ${commandKey}`);
    showHelp();
    process.exit(1);
  }
  
  console.log(`🚀 Running: ${command.description}`);
  console.log(`📊 Command: ${command.command}`);
  console.log('=' .repeat(80));
  
  const [cmd, ...args] = command.command.split(' ');
  const childProcess = spawn(cmd, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });
  
  // Handle interruption (Ctrl+C) and try to open browser before exiting
  process.on('SIGINT', () => {
    console.log('\n🛑 Process interrupted. Checking for HTML reports...');
    setTimeout(() => {
      checkAndOpenReport();
      process.exit(130);
    }, 1000);
  });
  
  childProcess.on('close', (code) => {
    console.log(`\n📊 Analysis process completed with exit code: ${code}`);
    
    // Check for and open the most recent HTML report
    checkAndOpenReport();
    
    if (code === 0) {
      console.log(`✅ Analysis completed successfully!`);
    } else {
      console.log(`⚠️  Analysis completed with issues (exit code: ${code})`);
      console.log(`📊 HTML report may still have been generated - check above.`);
    }
  });
  
  childProcess.on('error', (error) => {
    console.log(`❌ Error running command: ${error.message}`);
  });
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help') {
  showHelp();
} else {
  runCommand(command);
}