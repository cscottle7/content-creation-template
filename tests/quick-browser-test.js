/**
 * Quick Cross-Browser Compatibility Test
 * Focused testing for core functionality and critical pages
 */

const { chromium, firefox, webkit } = require('playwright');

const TEST_URL = 'http://localhost:3003';

// Core pages to test
const testPages = [
  '/',
  '/about',
  '/contact',
  '/solutions/for-smbs',
  '/solutions/for-agencies',
  '/pricing'
];

async function testBrowser(browserName, browser) {
  console.log(`\n🌐 Testing ${browserName}...`);
  
  const browserInstance = await browser.launch({ headless: true });
  const context = await browserInstance.newContext();
  const page = await context.newPage();
  
  const results = {
    browser: browserName,
    pages: [],
    errors: []
  };
  
  try {
    for (const pagePath of testPages) {
      console.log(`  Testing ${pagePath}...`);
      
      try {
        const startTime = Date.now();
        
        // Navigate to page
        const response = await page.goto(`${TEST_URL}${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        
        const loadTime = Date.now() - startTime;
        
        // Basic checks
        const checks = {
          status: response.status(),
          loadTime,
          hasHeader: await page.locator('header').count() > 0,
          hasNav: await page.locator('nav').count() > 0,
          hasMain: await page.locator('main, [role="main"]').count() > 0,
          hasFooter: await page.locator('footer').count() > 0,
          noJSErrors: true // We'll update this if we catch errors
        };
        
        // Check for forms if they exist
        const formCount = await page.locator('form').count();
        if (formCount > 0) {
          checks.hasWorkingForms = await page.locator('form input, form button').count() > 0;
        }
        
        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        // Wait a bit to catch any console errors
        await page.waitForTimeout(1000);
        checks.noJSErrors = consoleErrors.length === 0;
        
        if (consoleErrors.length > 0) {
          checks.consoleErrors = consoleErrors;
        }
        
        results.pages.push({
          path: pagePath,
          success: response.ok(),
          ...checks
        });
        
        console.log(`    ✅ ${pagePath} - ${checks.status} (${loadTime}ms)`);
        
      } catch (error) {
        console.log(`    ❌ ${pagePath} - ${error.message}`);
        results.errors.push({
          path: pagePath,
          error: error.message
        });
      }
    }
    
    // Test mobile responsiveness on homepage
    console.log(`  Testing mobile responsiveness...`);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${TEST_URL}/`, { waitUntil: 'domcontentloaded' });
    
    const mobileChecks = {
      noHorizontalScroll: await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth;
      }),
      mobileMenuExists: await page.locator('[aria-label*="menu"], button[class*="mobile"]').count() > 0
    };
    
    results.mobileTests = mobileChecks;
    
  } finally {
    await context.close();
    await browserInstance.close();
  }
  
  return results;
}

async function runQuickTests() {
  console.log('🚀 Running Quick Cross-Browser Compatibility Tests...\n');
  
  const browsers = [
    { name: 'Chromium (Chrome)', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit (Safari)', launcher: webkit }
  ];
  
  const allResults = [];
  
  for (const browser of browsers) {
    try {
      const result = await testBrowser(browser.name, browser.launcher);
      allResults.push(result);
    } catch (error) {
      console.error(`Failed to test ${browser.name}:`, error.message);
      allResults.push({
        browser: browser.name,
        error: error.message,
        pages: [],
        errors: []
      });
    }
  }
  
  // Generate summary
  console.log('\n📊 Test Summary');
  console.log('=' .repeat(50));
  
  allResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.browser}: Failed to test - ${result.error}`);
      return;
    }
    
    const successful = result.pages.filter(p => p.success).length;
    const total = result.pages.length;
    const avgLoadTime = result.pages.reduce((sum, p) => sum + (p.loadTime || 0), 0) / total;
    
    console.log(`\n${result.browser}:`);
    console.log(`  ✅ Successful pages: ${successful}/${total}`);
    console.log(`  ⚡ Average load time: ${Math.round(avgLoadTime)}ms`);
    
    if (result.mobileTests) {
      console.log(`  📱 Mobile: ${result.mobileTests.noHorizontalScroll ? '✅' : '❌'} No horizontal scroll`);
      console.log(`  📱 Mobile: ${result.mobileTests.mobileMenuExists ? '✅' : '❌'} Mobile menu exists`);
    }
    
    if (result.errors.length > 0) {
      console.log(`  ❌ Errors: ${result.errors.length}`);
      result.errors.forEach(error => {
        console.log(`    • ${error.path}: ${error.error}`);
      });
    }
    
    // Check for JS errors
    const pagesWithJSErrors = result.pages.filter(p => !p.noJSErrors);
    if (pagesWithJSErrors.length > 0) {
      console.log(`  ⚠️  JavaScript errors found on ${pagesWithJSErrors.length} pages`);
    }
  });
  
  // Overall status
  const totalSuccessful = allResults.reduce((sum, r) => sum + (r.pages ? r.pages.filter(p => p.success).length : 0), 0);
  const totalPages = allResults.reduce((sum, r) => sum + (r.pages ? r.pages.length : 0), 0);
  const overallSuccess = totalPages > 0 ? (totalSuccessful / totalPages) * 100 : 0;
  
  console.log(`\n🎯 Overall Success Rate: ${overallSuccess.toFixed(1)}%`);
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('quick-browser-test-results.json', JSON.stringify(allResults, null, 2));
  console.log('💾 Detailed results saved to: quick-browser-test-results.json');
  
  return allResults;
}

if (require.main === module) {
  runQuickTests().catch(console.error);
}

module.exports = { runQuickTests };