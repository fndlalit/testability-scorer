// ai-debug-config.js
/**
 * AI-Powered Debugging Configuration for Playwright
 * This module provides advanced debugging capabilities using AI insights
 */

class AIDebugger {
  constructor() {
    this.debugSessions = new Map();
    this.errorPatterns = new Map();
    this.performanceMetrics = new Map();
  }

  /**
   * Start an AI debugging session
   * @param {string} testName 
   * @param {import('@playwright/test').Page} page 
   */
  async startDebugSession(testName, page) {
    const sessionId = `${testName}-${Date.now()}`;
    
    const session = {
      id: sessionId,
      testName,
      startTime: Date.now(),
      page,
      events: [],
      screenshots: [],
      networkRequests: [],
      consoleMessages: []
    };

    // Listen to page events for AI analysis
    page.on('console', (msg) => {
      session.consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now()
      });
    });

    page.on('response', (response) => {
      session.networkRequests.push({
        url: response.url(),
        status: response.status(),
        timestamp: Date.now()
      });
    });

    page.on('pageerror', (error) => {
      session.events.push({
        type: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });

    this.debugSessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Analyze test failure with AI insights
   * @param {string} sessionId 
   * @param {Error} error 
   */
  async analyzeFailure(sessionId, error) {
    const session = this.debugSessions.get(sessionId);
    if (!session) return;

    const analysis = {
      errorType: this.classifyError(error),
      suggestions: this.generateSuggestions(error, session),
      patterns: this.detectPatterns(session),
      timeline: this.buildTimeline(session),
      networkIssues: this.analyzeNetworkRequests(session.networkRequests),
      consoleErrors: this.filterCriticalConsoleMessages(session.consoleMessages)
    };

    console.log('🤖 AI Failure Analysis Report:');
    console.log('================================');
    console.log(`Test: ${session.testName}`);
    console.log(`Error Type: ${analysis.errorType}`);
    console.log(`Duration: ${Date.now() - session.startTime}ms`);
    console.log('');
    
    console.log('🔍 AI Suggestions:');
    analysis.suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion}`);
    });
    
    if (analysis.networkIssues.length > 0) {
      console.log('');
      console.log('🌐 Network Issues Detected:');
      analysis.networkIssues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
    
    if (analysis.consoleErrors.length > 0) {
      console.log('');
      console.log('⚠️ Critical Console Messages:');
      analysis.consoleErrors.forEach(msg => {
        console.log(`  - ${msg.type}: ${msg.text}`);
      });
    }

    return analysis;
  }

  /**
   * Classify error types using AI patterns
   * @param {Error} error 
   */
  classifyError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    } else if (message.includes('not found') || message.includes('not visible')) {
      return 'ELEMENT_NOT_FOUND';
    } else if (message.includes('navigation') || message.includes('goto')) {
      return 'NAVIGATION_ERROR';
    } else if (message.includes('network') || message.includes('fetch')) {
      return 'NETWORK_ERROR';
    } else if (message.includes('assertion') || message.includes('expect')) {
      return 'ASSERTION_FAILURE';
    } else {
      return 'UNKNOWN_ERROR';
    }
  }

  /**
   * Generate AI-powered suggestions based on error analysis
   * @param {Error} error 
   * @param {Object} session 
   */
  generateSuggestions(error, session) {
    const errorType = this.classifyError(error);
    const suggestions = [];

    switch (errorType) {
      case 'TIMEOUT_ERROR':
        suggestions.push('Increase timeout values for slow-loading elements');
        suggestions.push('Add explicit waits for specific conditions');
        suggestions.push('Check for loading indicators that might need to disappear');
        suggestions.push('Verify network requests are completing successfully');
        break;

      case 'ELEMENT_NOT_FOUND':
        suggestions.push('Verify the element selector is correct and up-to-date');
        suggestions.push('Check if the element is inside an iframe');
        suggestions.push('Wait for the element to appear before interacting');
        suggestions.push('Use more robust locator strategies (data-testid, role-based)');
        break;

      case 'NAVIGATION_ERROR':
        suggestions.push('Verify the URL is correct and accessible');
        suggestions.push('Check for redirects or authentication requirements');
        suggestions.push('Ensure the server is running and responsive');
        break;

      case 'NETWORK_ERROR':
        suggestions.push('Check network connectivity and server status');
        suggestions.push('Verify API endpoints are responding correctly');
        suggestions.push('Add retry logic for flaky network requests');
        break;

      case 'ASSERTION_FAILURE':
        suggestions.push('Review the expected vs actual values');
        suggestions.push('Check if timing issues are affecting the assertion');
        suggestions.push('Add debugging output to understand the current state');
        break;

      default:
        suggestions.push('Enable debug mode for more detailed error information');
        suggestions.push('Check browser console for additional error details');
        suggestions.push('Add try-catch blocks to isolate the failing operation');
    }

    // Add context-specific suggestions
    if (session.page && session.page.url().includes('saucedemo')) {
      suggestions.push('For SauceDemo: Verify user credentials and account status');
      suggestions.push('Check if the specific user type has known limitations');
    }

    return suggestions;
  }

  /**
   * Detect patterns in test failures
   * @param {Object} session 
   */
  detectPatterns(session) {
    const patterns = [];
    
    // Check for repeated network failures
    const failedRequests = session.networkRequests.filter(req => req.status >= 400);
    if (failedRequests.length > 2) {
      patterns.push(`Multiple network failures detected (${failedRequests.length} requests)`);
    }

    // Check for console error patterns
    const errorMessages = session.consoleMessages.filter(msg => msg.type === 'error');
    if (errorMessages.length > 0) {
      patterns.push(`Browser console errors detected (${errorMessages.length} errors)`);
    }

    // Check timing patterns
    const duration = Date.now() - session.startTime;
    if (duration > 30000) {
      patterns.push('Test took unusually long to execute');
    }

    return patterns;
  }

  /**
   * Build a timeline of events for analysis
   * @param {Object} session 
   */
  buildTimeline(session) {
    const timeline = [];
    
    // Add all events with timestamps
    session.events.forEach(event => {
      timeline.push({
        time: event.timestamp - session.startTime,
        type: 'event',
        description: `${event.type}: ${event.message}`
      });
    });

    // Add network requests
    session.networkRequests.forEach(req => {
      timeline.push({
        time: req.timestamp - session.startTime,
        type: 'network',
        description: `${req.status} ${req.url}`
      });
    });

    // Sort by timestamp
    timeline.sort((a, b) => a.time - b.time);
    
    return timeline;
  }

  /**
   * Analyze network requests for issues
   * @param {Array} requests 
   */
  analyzeNetworkRequests(requests) {
    const issues = [];
    
    const failedRequests = requests.filter(req => req.status >= 400);
    if (failedRequests.length > 0) {
      issues.push(`${failedRequests.length} failed network requests`);
    }

    const slowRequests = requests.filter(req => {
      // This is a simplified check - in real implementation, you'd track request duration
      return req.url.includes('slow') || req.status === 504;
    });
    
    if (slowRequests.length > 0) {
      issues.push(`${slowRequests.length} potentially slow requests`);
    }

    return issues;
  }

  /**
   * Filter critical console messages
   * @param {Array} messages 
   */
  filterCriticalConsoleMessages(messages) {
    return messages.filter(msg => 
      msg.type === 'error' || 
      (msg.type === 'warning' && msg.text.includes('deprecated'))
    );
  }

  /**
   * Generate performance insights
   * @param {string} sessionId 
   */
  async generatePerformanceInsights(sessionId) {
    const session = this.debugSessions.get(sessionId);
    if (!session) return;

    const insights = {
      testDuration: Date.now() - session.startTime,
      networkRequestCount: session.networkRequests.length,
      errorCount: session.consoleMessages.filter(m => m.type === 'error').length,
      recommendations: []
    };

    if (insights.testDuration > 30000) {
      insights.recommendations.push('Consider optimizing test execution time');
    }

    if (insights.networkRequestCount > 20) {
      insights.recommendations.push('High number of network requests detected');
    }

    if (insights.errorCount > 0) {
      insights.recommendations.push('Browser console errors should be investigated');
    }

    return insights;
  }

  /**
   * Clean up debug session
   * @param {string} sessionId 
   */
  endDebugSession(sessionId) {
    this.debugSessions.delete(sessionId);
  }
}

// Export singleton instance
const aiDebugger = new AIDebugger();

module.exports = { aiDebugger, AIDebugger };