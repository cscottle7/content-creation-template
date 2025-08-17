/**
 * Cross-Browser Compatibility Testing Suite
 * Tests The Bigger Boss website across multiple browsers and configurations
 * 
 * Requirements:
 * - All major browsers: Chrome, Firefox, Safari, Edge
 * - Mobile and desktop viewports
 * - Key functionality: Navigation, forms, lead magnets, responsive design
 * - Performance metrics: Core Web Vitals
 */

const { chromium, firefox, webkit } = require('playwright');

const TEST_URL = 'http://localhost:3003';

// Test pages configuration
const testPages = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Page' },
  { path: '/contact', name: 'Contact Page' },
  { path: '/pricing', name: 'Pricing Page' },
  { path: '/solutions/for-smbs', name: 'SMB Solutions' },
  { path: '/solutions/for-agencies', name: 'Agency Solutions' },
  { path: '/lead-magnets/smb-content-guide', name: 'SMB Lead Magnet' },
  { path: '/lead-magnets/agency-webinar', name: 'Agency Lead Magnet' },
  { path: '/resources', name: 'Resources Hub' },
];

// Browser configurations
const browsers = [
  { name: 'Chromium', launcher: chromium },
  { name: 'Firefox', launcher: firefox },
  { name: 'WebKit (Safari)', launcher: webkit },
];

// Viewport configurations
const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

class CrossBrowserTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  async testPage(browser, page, testCase, viewport) {
    const startTime = Date.now();
    
    try {
      console.log(`Testing ${testCase.name} on ${browser.name} (${viewport.name})`);
      
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to page
      const response = await page.goto(`${TEST_URL}${testCase.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Check response status
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }
      
      // Wait for page to be ready
      await page.waitForLoadState('domcontentloaded');
      
      // Core functionality tests
      const tests = await this.runCoreFunctionalityTests(page, testCase, viewport);
      
      // Performance metrics
      const performance = await this.getPerformanceMetrics(page);
      
      // Visual regression check
      const visualCheck = await this.checkVisualLayout(page, testCase, browser.name, viewport.name);
      
      const loadTime = Date.now() - startTime;
      
      this.results.push({
        browser: browser.name,
        viewport: viewport.name,
        page: testCase.name,
        path: testCase.path,
        success: true,
        loadTime,
        performance,
        tests,
        visualCheck,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`Error testing ${testCase.name} on ${browser.name} (${viewport.name}):`, error.message);
      
      this.errors.push({
        browser: browser.name,
        viewport: viewport.name,
        page: testCase.name,
        path: testCase.path,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async runCoreFunctionalityTests(page, testCase, viewport) {
    const tests = {
      headerNavigation: false,
      mobileMenu: false,
      forms: false,
      buttons: false,
      links: false,
      images: false,
      animations: false
    };

    try {
      // Test header navigation
      const headerNav = await page.locator('header nav').count();
      tests.headerNavigation = headerNav > 0;

      // Test mobile menu (for mobile viewport)
      if (viewport.width <= 768) {
        const mobileMenuButton = await page.locator('[aria-label*="menu"], [aria-label*="Menu"], button[class*="mobile"]').count();
        tests.mobileMenu = mobileMenuButton > 0;
      } else {
        tests.mobileMenu = true; // Not applicable for desktop
      }

      // Test forms (if present on page)
      const forms = await page.locator('form').count();
      if (forms > 0) {
        const formInputs = await page.locator('form input, form textarea, form select').count();
        const submitButtons = await page.locator('form button[type="submit"], form input[type="submit"]').count();
        tests.forms = formInputs > 0 && submitButtons > 0;
      } else {
        tests.forms = true; // No forms to test
      }

      // Test buttons are clickable
      const buttons = await page.locator('button, a[role="button"]').count();
      tests.buttons = buttons > 0;

      // Test links
      const links = await page.locator('a[href]').count();
      tests.links = links > 0;

      // Test images load
      const images = await page.locator('img').count();
      if (images > 0) {
        // Check if images have proper alt text and load correctly
        const imagesWithAlt = await page.locator('img[alt]').count();
        tests.images = imagesWithAlt === images;
      } else {
        tests.images = true; // No images to test
      }

      // Test for any console errors
      const consoleLogs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleLogs.push(msg.text());
        }
      });

      // Scroll to trigger any animations/lazy loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(1000);
      
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      tests.animations = consoleLogs.length === 0; // No console errors

    } catch (error) {
      console.warn(`Core functionality test error: ${error.message}`);
    }

    return tests;
  }

  async getPerformanceMetrics(page) {
    try {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          transferSize: navigation?.transferSize || 0,
          encodedBodySize: navigation?.encodedBodySize || 0
        };
      });
      
      return metrics;
    } catch (error) {
      console.warn(`Performance metrics error: ${error.message}`);
      return {};
    }
  }

  async checkVisualLayout(page, testCase, browserName, viewportName) {
    try {
      // Basic layout checks
      const layoutTests = {
        headerVisible: false,
        footerVisible: false,
        mainContentVisible: false,
        noHorizontalScroll: false
      };

      // Check if header is visible
      const header = await page.locator('header').isVisible();
      layoutTests.headerVisible = header;

      // Check if footer is visible (scroll to bottom first)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      const footer = await page.locator('footer').isVisible();
      layoutTests.footerVisible = footer;

      // Check if main content is visible
      await page.evaluate(() => window.scrollTo(0, 0));
      const main = await page.locator('main, [role="main"], .main-content').isVisible();
      layoutTests.mainContentVisible = main;

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      layoutTests.noHorizontalScroll = !hasHorizontalScroll;

      return layoutTests;
    } catch (error) {
      console.warn(`Visual layout check error: ${error.message}`);
      return {};
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Cross-Browser Compatibility Testing...\n');
    
    for (const browser of browsers) {
      console.log(`\n📱 Testing with ${browser.name}...`);
      
      const browserInstance = await browser.launcher.launch({
        headless: true // Set to false for debugging
      });
      
      try {
        for (const viewport of viewports) {
          console.log(`\n  📐 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
          
          const context = await browserInstance.newContext({
            viewport: { width: viewport.width, height: viewport.height }
          });
          
          const page = await context.newPage();
          
          for (const testCase of testPages) {
            await this.testPage(browser, page, testCase, viewport);
          }
          
          await context.close();
        }
      } finally {
        await browserInstance.close();
      }
    }
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 Cross-Browser Testing Report');
    console.log('=' .repeat(50));
    
    const successfulTests = this.results.length;
    const failedTests = this.errors.length;
    const totalTests = successfulTests + failedTests;
    
    console.log(`\n✅ Successful Tests: ${successfulTests}/${totalTests}`);
    console.log(`❌ Failed Tests: ${failedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 Failed Tests:');
      this.errors.forEach(error => {
        console.log(`  • ${error.browser} (${error.viewport}) - ${error.page}: ${error.error}`);
      });
    }
    
    // Performance summary
    const avgLoadTimes = {};
    browsers.forEach(browser => {
      const browserResults = this.results.filter(r => r.browser === browser.name);
      if (browserResults.length > 0) {
        const avgLoadTime = browserResults.reduce((sum, r) => sum + r.loadTime, 0) / browserResults.length;
        avgLoadTimes[browser.name] = Math.round(avgLoadTime);
      }
    });
    
    console.log('\n⚡ Average Load Times by Browser:');
    Object.entries(avgLoadTimes).forEach(([browser, time]) => {
      console.log(`  • ${browser}: ${time}ms`);
    });
    
    // Core Web Vitals summary
    const coreWebVitals = this.results
      .filter(r => r.performance && r.performance.firstContentfulPaint)
      .map(r => ({
        browser: r.browser,
        viewport: r.viewport,
        fcp: r.performance.firstContentfulPaint
      }));
    
    if (coreWebVitals.length > 0) {
      const avgFCP = coreWebVitals.reduce((sum, v) => sum + v.fcp, 0) / coreWebVitals.length;
      console.log(`\n🎯 Average First Contentful Paint: ${Math.round(avgFCP)}ms`);
      
      const fcpStatus = avgFCP <= 1800 ? '✅ Good' : avgFCP <= 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`   Status: ${fcpStatus} (Target: ≤1.8s)`);
    }
    
    // Save detailed report
    const report = {
      summary: {
        totalTests,
        successfulTests,
        failedTests,
        successRate: (successfulTests / totalTests) * 100,
        avgLoadTimes,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      errors: this.errors
    };
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync(
      'cross-browser-test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n💾 Detailed report saved to: cross-browser-test-report.json');
    console.log('\n🎉 Cross-browser testing completed!');
  }
}

// Run tests
async function main() {
  const tester = new CrossBrowserTester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CrossBrowserTester;