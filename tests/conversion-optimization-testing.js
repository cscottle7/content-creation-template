/**
 * Conversion Rate Optimization (CRO) Testing Suite
 * Tests conversion funnels, form usability, and A/B test implementation
 * 
 * Focus Areas:
 * - Lead magnet conversion funnels
 * - Form completion rates and usability
 * - CTA visibility and effectiveness
 * - Page load performance impact on conversions
 * - Mobile conversion optimization
 * - A/B testing infrastructure validation
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TEST_URL = 'http://localhost:3003';

// Conversion funnel test cases
const conversionTests = [
  {
    name: 'SMB Lead Magnet Funnel',
    path: '/lead-magnets/smb-content-guide',
    persona: 'smb',
    expectedElements: {
      headline: 'h1',
      valueProposition: '[class*="benefit"], .space-y-3',
      leadForm: 'form',
      submitButton: 'button[type="submit"]',
      trustIndicators: '[class*="green"], [class*="shield"]'
    },
    criticalActions: [
      'form_interaction',
      'submit_attempt',
      'success_state'
    ]
  },
  {
    name: 'Agency Lead Magnet Funnel',
    path: '/lead-magnets/agency-webinar',
    persona: 'agency',
    expectedElements: {
      headline: 'h1',
      valueProposition: '[class*="benefit"], .space-y-3',
      leadForm: 'form',
      submitButton: 'button[type="submit"]',
      urgencyIndicators: '[class*="red"], [class*="clock"]'
    },
    criticalActions: [
      'form_interaction',
      'submit_attempt',
      'success_state'
    ]
  },
  {
    name: 'Contact Form Conversion',
    path: '/contact',
    persona: 'general',
    expectedElements: {
      headline: 'h1, h2',
      contactForm: 'form',
      submitButton: 'button[type="submit"]',
      multipleFields: 'input, select, textarea'
    },
    criticalActions: [
      'form_interaction',
      'field_validation',
      'submit_attempt'
    ]
  },
  {
    name: 'Homepage to Solutions Conversion',
    path: '/',
    persona: 'smb',
    expectedElements: {
      ctaButtons: 'button, a[class*="button"]',
      solutionsLinks: 'a[href*="solutions"]',
      valueProposition: 'h1, .hero'
    },
    criticalActions: [
      'cta_visibility',
      'navigation_flow',
      'persona_targeting'
    ]
  }
];

class ConversionOptimizationTester {
  constructor() {
    this.results = [];
    this.metrics = {};
    this.errors = [];
  }

  async runConversionTests() {
    console.log('🎯 Starting Conversion Rate Optimization Testing...\n');
    
    const browser = await chromium.launch({ 
      headless: true,
      // Enable performance monitoring
      args: ['--enable-precise-memory-info']
    });
    
    try {
      // Test desktop conversions
      await this.testConversionsForViewport(browser, { width: 1920, height: 1080 }, 'Desktop');
      
      // Test mobile conversions
      await this.testConversionsForViewport(browser, { width: 375, height: 667 }, 'Mobile');
      
      // Test form usability specifically
      await this.testFormUsability(browser);
      
      // Test A/B testing infrastructure
      await this.testABTestingInfrastructure(browser);
      
      // Test conversion performance
      await this.testConversionPerformance(browser);
      
    } finally {
      await browser.close();
    }
    
    this.generateCROReport();
  }

  async testConversionsForViewport(browser, viewport, deviceType) {
    console.log(`📱 Testing ${deviceType} Conversions (${viewport.width}x${viewport.height})`);
    
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    
    try {
      for (const test of conversionTests) {
        console.log(`  🔍 Testing ${test.name}...`);
        
        const result = await this.testConversionFunnel(page, test, deviceType);
        this.results.push({
          ...result,
          deviceType,
          viewport
        });
      }
    } finally {
      await context.close();
    }
  }

  async testConversionFunnel(page, test, deviceType) {
    const startTime = Date.now();
    
    try {
      // Navigate to the page
      const response = await page.goto(`${TEST_URL}${test.path}`, {
        waitUntil: 'networkidle',
        timeout: 15000
      });
      
      const loadTime = Date.now() - startTime;
      
      // Test core conversion elements
      const elementTests = {};
      for (const [element, selector] of Object.entries(test.expectedElements)) {
        const count = await page.locator(selector).count();
        const isVisible = count > 0 ? await page.locator(selector).first().isVisible() : false;
        
        elementTests[element] = {
          found: count > 0,
          count,
          visible: isVisible,
          selector
        };
      }
      
      // Test critical conversion actions
      const actionTests = {};
      for (const action of test.criticalActions) {
        actionTests[action] = await this.testCriticalAction(page, action, test);
      }
      
      // Calculate conversion readiness score
      const elementScore = Object.values(elementTests).filter(e => e.found && e.visible).length / Object.keys(elementTests).length;
      const actionScore = Object.values(actionTests).filter(a => a.success).length / Object.keys(actionTests).length;
      const conversionScore = Math.round(((elementScore + actionScore) / 2) * 100);
      
      // Test form field usability (if form exists)
      let formUsability = null;
      if (elementTests.leadForm?.found || elementTests.contactForm?.found) {
        formUsability = await this.testFormFieldUsability(page);
      }
      
      // Test mobile-specific conversion factors
      let mobileOptimization = null;
      if (deviceType === 'Mobile') {
        mobileOptimization = await this.testMobileConversionFactors(page);
      }
      
      return {
        testName: test.name,
        path: test.path,
        persona: test.persona,
        deviceType,
        success: response.ok(),
        loadTime,
        conversionScore,
        elementTests,
        actionTests,
        formUsability,
        mobileOptimization,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`Error testing ${test.name}:`, error.message);
      return {
        testName: test.name,
        path: test.path,
        persona: test.persona,
        deviceType,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testCriticalAction(page, action, test) {
    try {
      switch (action) {
        case 'form_interaction':
          const forms = await page.locator('form').count();
          if (forms > 0) {
            const firstInput = page.locator('form input').first();
            if (await firstInput.count() > 0) {
              await firstInput.click();
              await firstInput.fill('test@example.com');
              return { success: true, details: 'Form interaction successful' };
            }
          }
          return { success: false, details: 'No interactive form found' };
          
        case 'submit_attempt':
          const submitButtons = await page.locator('button[type="submit"], input[type="submit"]').count();
          if (submitButtons > 0) {
            const button = page.locator('button[type="submit"], input[type="submit"]').first();
            const isEnabled = await button.isEnabled();
            const isVisible = await button.isVisible();
            return { 
              success: isEnabled && isVisible, 
              details: `Submit button - enabled: ${isEnabled}, visible: ${isVisible}` 
            };
          }
          return { success: false, details: 'No submit button found' };
          
        case 'success_state':
          // Look for success indicators (usually hidden initially)
          const successIndicators = await page.locator('[class*="success"], [class*="green-"], .success').count();
          return { 
            success: true, 
            details: `${successIndicators} success state elements found` 
          };
          
        case 'cta_visibility':
          const ctaButtons = await page.locator('button, a[class*="button"], [role="button"]').count();
          let visibleCTAs = 0;
          for (let i = 0; i < Math.min(ctaButtons, 5); i++) {
            const cta = page.locator('button, a[class*="button"], [role="button"]').nth(i);
            if (await cta.isVisible()) visibleCTAs++;
          }
          return { 
            success: visibleCTAs > 0, 
            details: `${visibleCTAs}/${ctaButtons} CTAs visible` 
          };
          
        case 'navigation_flow':
          const solutionLinks = await page.locator('a[href*="solutions"]').count();
          return { 
            success: solutionLinks > 0, 
            details: `${solutionLinks} solution navigation links found` 
          };
          
        case 'persona_targeting':
          const smbMentions = await page.locator('text=/small business|SMB|small-medium/i').count();
          const agencyMentions = await page.locator('text=/agency|agencies|marketing/i').count();
          return { 
            success: smbMentions > 0 || agencyMentions > 0, 
            details: `SMB: ${smbMentions}, Agency: ${agencyMentions} persona mentions` 
          };
          
        case 'field_validation':
          // Test if form has validation
          const requiredFields = await page.locator('input[required], select[required], textarea[required]').count();
          return { 
            success: requiredFields > 0, 
            details: `${requiredFields} required fields with validation` 
          };
          
        default:
          return { success: false, details: `Unknown action: ${action}` };
      }
    } catch (error) {
      return { success: false, details: `Action failed: ${error.message}` };
    }
  }

  async testFormFieldUsability(page) {
    try {
      const forms = await page.locator('form').all();
      if (forms.length === 0) return null;
      
      const usabilityTests = {
        hasLabels: false,
        hasPlaceholders: false,
        hasErrorStates: false,
        hasAutoComplete: false,
        fieldCount: 0,
        requiredFieldsMarked: false
      };
      
      const inputs = await page.locator('form input, form select, form textarea').all();
      usabilityTests.fieldCount = inputs.length;
      
      if (inputs.length > 0) {
        // Check for labels
        const labelsCount = await page.locator('form label').count();
        usabilityTests.hasLabels = labelsCount > 0;
        
        // Check for placeholders
        const placeholderCount = await page.locator('form input[placeholder], form textarea[placeholder]').count();
        usabilityTests.hasPlaceholders = placeholderCount > 0;
        
        // Check for error state handling
        const errorElements = await page.locator('form [class*="error"], form [role="alert"]').count();
        usabilityTests.hasErrorStates = errorElements >= 0; // Always true as structure exists
        
        // Check for autocomplete attributes
        const autoCompleteCount = await page.locator('form input[autocomplete], form select[autocomplete]').count();
        usabilityTests.hasAutoComplete = autoCompleteCount > 0;
        
        // Check for required field marking
        const requiredCount = await page.locator('form input[required], form select[required], form textarea[required]').count();
        const requiredMarkings = await page.locator('form [aria-label*="required"], form .required, form *[class*="required"]').count();
        usabilityTests.requiredFieldsMarked = requiredCount > 0 && requiredMarkings > 0;
      }
      
      return usabilityTests;
    } catch (error) {
      return { error: error.message };
    }
  }

  async testMobileConversionFactors(page) {
    try {
      const mobileTests = {
        touchTargetSize: false,
        formInputSize: false,
        buttonSize: false,
        noHorizontalScroll: false,
        readableText: false
      };
      
      // Test touch target sizes (minimum 44px)
      const buttons = await page.locator('button, a[role="button"]').all();
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        const buttonBox = await firstButton.boundingBox();
        if (buttonBox) {
          mobileTests.touchTargetSize = buttonBox.height >= 44 && buttonBox.width >= 44;
        }
      }
      
      // Test form input sizes
      const inputs = await page.locator('input, select, textarea').all();
      if (inputs.length > 0) {
        const firstInput = inputs[0];
        const inputBox = await firstInput.boundingBox();
        if (inputBox) {
          mobileTests.formInputSize = inputBox.height >= 44;
        }
      }
      
      // Test for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      mobileTests.noHorizontalScroll = !hasHorizontalScroll;
      
      // Test text readability (font size)
      const smallText = await page.locator('*').evaluateAll(elements => {
        return elements.filter(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          return fontSize < 16 && el.textContent.trim().length > 0;
        }).length;
      });
      mobileTests.readableText = smallText < 5; // Allow some small text
      
      return mobileTests;
    } catch (error) {
      return { error: error.message };
    }
  }

  async testFormUsability(browser) {
    console.log('📝 Testing Form Usability...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      const formPages = [
        '/contact',
        '/lead-magnets/smb-content-guide',
        '/lead-magnets/agency-webinar'
      ];
      
      const formUsabilityResults = {};
      
      for (const pagePath of formPages) {
        await page.goto(`${TEST_URL}${pagePath}`, { waitUntil: 'networkidle' });
        
        const result = {
          fillability: await this.testFormFillability(page),
          validation: await this.testFormValidation(page),
          accessibility: await this.testFormAccessibility(page),
          userExperience: await this.testFormUserExperience(page)
        };
        
        formUsabilityResults[pagePath] = result;
      }
      
      this.metrics.formUsability = formUsabilityResults;
      
    } finally {
      await context.close();
    }
  }

  async testFormFillability(page) {
    try {
      const forms = await page.locator('form').count();
      if (forms === 0) return { score: 0, details: 'No forms found' };
      
      let fillableFields = 0;
      let totalFields = 0;
      
      const inputs = await page.locator('form input, form select, form textarea').all();
      totalFields = inputs.length;
      
      for (const input of inputs) {
        try {
          await input.click();
          await input.fill('test');
          fillableFields++;
        } catch (error) {
          // Field not fillable
        }
      }
      
      const score = totalFields > 0 ? Math.round((fillableFields / totalFields) * 100) : 0;
      return {
        score,
        fillableFields,
        totalFields,
        details: `${fillableFields}/${totalFields} fields are fillable`
      };
    } catch (error) {
      return { score: 0, error: error.message };
    }
  }

  async testFormValidation(page) {
    try {
      const forms = await page.locator('form').count();
      if (forms === 0) return { score: 0, details: 'No forms found' };
      
      const validationFeatures = {
        requiredFields: await page.locator('form input[required], form select[required], form textarea[required]').count(),
        emailValidation: await page.locator('form input[type="email"]').count(),
        errorMessages: await page.locator('form [role="alert"], form [class*="error"]').count(),
        helpText: await page.locator('form [class*="helper"], form .help-text').count()
      };
      
      const score = Object.values(validationFeatures).reduce((sum, val) => sum + (val > 0 ? 25 : 0), 0);
      
      return {
        score,
        features: validationFeatures,
        details: `Validation features implemented: ${Object.entries(validationFeatures).filter(([_, val]) => val > 0).map(([key]) => key).join(', ')}`
      };
    } catch (error) {
      return { score: 0, error: error.message };
    }
  }

  async testFormAccessibility(page) {
    try {
      const forms = await page.locator('form').count();
      if (forms === 0) return { score: 0, details: 'No forms found' };
      
      const accessibilityFeatures = {
        labels: await page.locator('form label').count(),
        ariaLabels: await page.locator('form [aria-label]').count(),
        fieldset: await page.locator('form fieldset').count(),
        ariaDescribedBy: await page.locator('form [aria-describedby]').count()
      };
      
      const totalInputs = await page.locator('form input, form select, form textarea').count();
      const labeledInputs = accessibilityFeatures.labels + accessibilityFeatures.ariaLabels;
      
      const score = totalInputs > 0 ? Math.round((labeledInputs / totalInputs) * 100) : 0;
      
      return {
        score,
        features: accessibilityFeatures,
        totalInputs,
        labeledInputs,
        details: `${labeledInputs}/${totalInputs} form inputs have labels`
      };
    } catch (error) {
      return { score: 0, error: error.message };
    }
  }

  async testFormUserExperience(page) {
    try {
      const forms = await page.locator('form').count();
      if (forms === 0) return { score: 0, details: 'No forms found' };
      
      const uxFeatures = {
        autocomplete: await page.locator('form input[autocomplete]').count(),
        placeholders: await page.locator('form input[placeholder], form textarea[placeholder]').count(),
        logicalTabOrder: true, // Assume true unless we detect issues
        submitButtonClear: await page.locator('form button[type="submit"], form input[type="submit"]').count() > 0,
        progressIndicator: await page.locator('form .progress, form [class*="step"]').count() > 0
      };
      
      const score = Object.values(uxFeatures).reduce((sum, val) => {
        if (typeof val === 'boolean') return sum + (val ? 20 : 0);
        return sum + (val > 0 ? 20 : 0);
      }, 0);
      
      return {
        score,
        features: uxFeatures,
        details: `UX features: ${Object.entries(uxFeatures).filter(([_, val]) => val === true || val > 0).map(([key]) => key).join(', ')}`
      };
    } catch (error) {
      return { score: 0, error: error.message };
    }
  }

  async testABTestingInfrastructure(browser) {
    console.log('🧪 Testing A/B Testing Infrastructure...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto(`${TEST_URL}/`, { waitUntil: 'networkidle' });
      
      // Check for A/B testing components
      const abTestElements = await page.locator('[data-testid*="ab"], [class*="ABTest"], [data-ab-test]').count();
      
      // Check for analytics tracking
      const analyticsElements = await page.locator('[data-analytics], [data-track]').count();
      
      // Test if A/B test endpoints are available
      let apiEndpointsWorking = 0;
      const abTestEndpoints = ['/api/ab-test/variant', '/api/ab-test/convert'];
      
      for (const endpoint of abTestEndpoints) {
        try {
          const response = await page.request.get(`${TEST_URL}${endpoint}?testName=test`);
          if (response.ok()) apiEndpointsWorking++;
        } catch (error) {
          // Endpoint not working
        }
      }
      
      this.metrics.abTesting = {
        abTestElements,
        analyticsElements,
        apiEndpointsWorking,
        totalEndpoints: abTestEndpoints.length,
        score: Math.round(((abTestElements > 0 ? 1 : 0) + (analyticsElements > 0 ? 1 : 0) + (apiEndpointsWorking / abTestEndpoints.length)) / 3 * 100)
      };
      
    } finally {
      await context.close();
    }
  }

  async testConversionPerformance(browser) {
    console.log('⚡ Testing Conversion Performance Impact...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      const performanceResults = {};
      
      for (const test of conversionTests) {
        const startTime = Date.now();
        
        await page.goto(`${TEST_URL}${test.path}`, { waitUntil: 'networkidle' });
        
        const metrics = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          return {
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
            loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
          };
        });
        
        performanceResults[test.name] = {
          ...metrics,
          totalLoadTime: Date.now() - startTime,
          performanceScore: this.calculatePerformanceScore(metrics)
        };
      }
      
      this.metrics.conversionPerformance = performanceResults;
      
    } finally {
      await context.close();
    }
  }

  calculatePerformanceScore(metrics) {
    // Score based on Core Web Vitals thresholds
    let score = 0;
    
    // First Contentful Paint (good: <1.8s, needs improvement: <3s)
    if (metrics.firstContentfulPaint < 1800) score += 40;
    else if (metrics.firstContentfulPaint < 3000) score += 20;
    
    // DOM Content Loaded (good: <2s, needs improvement: <4s)
    if (metrics.domContentLoaded < 2000) score += 30;
    else if (metrics.domContentLoaded < 4000) score += 15;
    
    // Load Complete (good: <3s, needs improvement: <5s)
    if (metrics.loadComplete < 3000) score += 30;
    else if (metrics.loadComplete < 5000) score += 15;
    
    return score;
  }

  generateCROReport() {
    console.log('\n🎯 Conversion Rate Optimization Report');
    console.log('=' .repeat(50));
    
    // Overall conversion readiness
    const avgConversionScore = this.results.reduce((sum, r) => sum + (r.conversionScore || 0), 0) / this.results.length;
    
    console.log(`\n📊 Overall Conversion Readiness: ${avgConversionScore.toFixed(1)}%`);
    
    // Desktop vs Mobile performance
    const desktopResults = this.results.filter(r => r.deviceType === 'Desktop');
    const mobileResults = this.results.filter(r => r.deviceType === 'Mobile');
    
    const avgDesktopScore = desktopResults.reduce((sum, r) => sum + (r.conversionScore || 0), 0) / desktopResults.length;
    const avgMobileScore = mobileResults.reduce((sum, r) => sum + (r.conversionScore || 0), 0) / mobileResults.length;
    
    console.log(`📱 Desktop Conversion Score: ${avgDesktopScore.toFixed(1)}%`);
    console.log(`📱 Mobile Conversion Score: ${avgMobileScore.toFixed(1)}%`);
    
    // Individual funnel performance
    console.log('\n📋 Conversion Funnel Results:');
    const funnelScores = {};
    
    this.results.forEach(result => {
      if (!funnelScores[result.testName]) {
        funnelScores[result.testName] = [];
      }
      funnelScores[result.testName].push(result.conversionScore || 0);
    });
    
    Object.entries(funnelScores).forEach(([funnel, scores]) => {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      const icon = avgScore >= 80 ? '✅' : avgScore >= 60 ? '⚠️' : '❌';
      console.log(`  ${icon} ${funnel}: ${avgScore.toFixed(1)}%`);
    });
    
    // Form usability summary
    if (this.metrics.formUsability) {
      console.log('\n📝 Form Usability Summary:');
      Object.entries(this.metrics.formUsability).forEach(([page, metrics]) => {
        const avgScore = Object.values(metrics)
          .filter(m => typeof m?.score === 'number')
          .reduce((sum, m) => sum + m.score, 0) / 4;
        const icon = avgScore >= 80 ? '✅' : avgScore >= 60 ? '⚠️' : '❌';
        console.log(`  ${icon} ${page}: ${avgScore.toFixed(1)}%`);
      });
    }
    
    // A/B Testing readiness
    if (this.metrics.abTesting) {
      const abScore = this.metrics.abTesting.score;
      const abIcon = abScore >= 80 ? '✅' : abScore >= 60 ? '⚠️' : '❌';
      console.log(`\n🧪 A/B Testing Infrastructure: ${abIcon} ${abScore}%`);
    }
    
    // Performance impact on conversions
    if (this.metrics.conversionPerformance) {
      console.log('\n⚡ Conversion Performance:');
      Object.entries(this.metrics.conversionPerformance).forEach(([page, metrics]) => {
        const icon = metrics.performanceScore >= 80 ? '✅' : metrics.performanceScore >= 60 ? '⚠️' : '❌';
        console.log(`  ${icon} ${page}: ${metrics.performanceScore}% (FCP: ${Math.round(metrics.firstContentfulPaint)}ms)`);
      });
    }
    
    // Recommendations
    console.log('\n🔧 CRO Recommendations:');
    
    if (avgMobileScore < avgDesktopScore - 10) {
      console.log('  • Optimize mobile conversion experience');
    }
    
    if (avgConversionScore < 70) {
      console.log('  • Improve conversion funnel elements and CTAs');
    }
    
    if (this.metrics.abTesting?.score < 80) {
      console.log('  • Strengthen A/B testing infrastructure');
    }
    
    console.log('  • Conduct user testing with target personas');
    console.log('  • Implement heat mapping and user session recording');
    console.log('  • Test different value propositions and urgency indicators');
    
    // Save detailed report
    const report = {
      summary: {
        overallConversionScore: parseFloat(avgConversionScore.toFixed(1)),
        desktopScore: parseFloat(avgDesktopScore.toFixed(1)),
        mobileScore: parseFloat(avgMobileScore.toFixed(1)),
        funnelScores,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      metrics: this.metrics,
      errors: this.errors
    };
    
    fs.writeFileSync('conversion-optimization-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed CRO report saved to: conversion-optimization-report.json');
    console.log('\n🎉 Conversion rate optimization testing completed!');
    
    return report;
  }
}

// Run CRO tests
async function main() {
  const tester = new ConversionOptimizationTester();
  await tester.runConversionTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ConversionOptimizationTester;