/**
 * Quick Conversion Rate Optimization Test
 * Focused on essential conversion metrics and baseline measurements
 */

const { chromium } = require('playwright');

const TEST_URL = 'http://localhost:3003';

// Key conversion pages
const conversionPages = [
  { name: 'SMB Lead Magnet', path: '/lead-magnets/smb-content-guide', critical: true },
  { name: 'Agency Lead Magnet', path: '/lead-magnets/agency-webinar', critical: true },
  { name: 'Contact Page', path: '/contact', critical: true },
  { name: 'Homepage', path: '/', critical: true }
];

async function testConversionPage(page, testPage) {
  console.log(`  Testing ${testPage.name}...`);
  
  try {
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto(`${TEST_URL}${testPage.path}`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Core conversion elements check
    const elements = {
      headline: await page.locator('h1').count() > 0,
      forms: await page.locator('form').count(),
      ctaButtons: await page.locator('button, a[class*="button"]').count(),
      submitButtons: await page.locator('button[type="submit"]').count(),
      requiredFields: await page.locator('input[required], select[required], textarea[required]').count(),
      labels: await page.locator('label').count()
    };
    
    // Form usability test
    let formUsability = null;
    if (elements.forms > 0) {
      const inputs = await page.locator('form input').all();
      let fillableInputs = 0;
      
      for (let i = 0; i < Math.min(inputs.length, 3); i++) {
        try {
          await inputs[i].click();
          await inputs[i].fill('test');
          fillableInputs++;
        } catch (error) {
          // Input not fillable
        }
      }
      
      formUsability = {
        totalInputs: inputs.length,
        fillableInputs,
        usabilityScore: inputs.length > 0 ? Math.round((fillableInputs / inputs.length) * 100) : 0
      };
    }
    
    // Mobile responsiveness check
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileChecks = {
      noHorizontalScroll: await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth;
      }),
      buttonsVisible: await page.locator('button').first().isVisible().catch(() => false),
      formsVisible: elements.forms > 0 ? await page.locator('form').first().isVisible().catch(() => false) : true
    };
    
    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Calculate conversion score
    const baseScore = Object.values(elements).filter(val => 
      typeof val === 'boolean' ? val : val > 0
    ).length;
    
    const mobileScore = Object.values(mobileChecks).filter(val => val).length;
    const conversionScore = Math.round(((baseScore / 6) * 0.7 + (mobileScore / 3) * 0.3) * 100);
    
    return {
      name: testPage.name,
      path: testPage.path,
      critical: testPage.critical,
      success: true,
      loadTime,
      conversionScore,
      elements,
      formUsability,
      mobileChecks,
      recommendations: generateRecommendations(elements, formUsability, mobileChecks)
    };
    
  } catch (error) {
    return {
      name: testPage.name,
      path: testPage.path,
      critical: testPage.critical,
      success: false,
      error: error.message
    };
  }
}

function generateRecommendations(elements, formUsability, mobileChecks) {
  const recommendations = [];
  
  if (!elements.headline) {
    recommendations.push('Add clear H1 headline');
  }
  
  if (elements.forms > 0 && elements.submitButtons === 0) {
    recommendations.push('Add submit button to forms');
  }
  
  if (elements.forms > 0 && elements.labels === 0) {
    recommendations.push('Add labels to form inputs');
  }
  
  if (formUsability && formUsability.usabilityScore < 80) {
    recommendations.push('Improve form field usability');
  }
  
  if (!mobileChecks.noHorizontalScroll) {
    recommendations.push('Fix mobile horizontal scroll');
  }
  
  if (!mobileChecks.buttonsVisible || !mobileChecks.formsVisible) {
    recommendations.push('Improve mobile element visibility');
  }
  
  return recommendations;
}

async function runQuickConversionTest() {
  console.log('🎯 Running Quick Conversion Rate Optimization Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  try {
    for (const testPage of conversionPages) {
      const result = await testConversionPage(page, testPage);
      results.push(result);
      
      const icon = result.success ? 
        (result.conversionScore >= 80 ? '✅' : result.conversionScore >= 60 ? '⚠️' : '❌') : 
        '❌';
      
      console.log(`    ${icon} ${result.name}: ${result.success ? result.conversionScore + '%' : 'Failed'} ${result.loadTime ? '(' + result.loadTime + 'ms)' : ''}`);
    }
    
  } finally {
    await context.close();
    await browser.close();
  }
  
  // Generate summary
  console.log('\n📊 Conversion Optimization Summary');
  console.log('=' .repeat(40));
  
  const successfulTests = results.filter(r => r.success);
  const avgScore = successfulTests.reduce((sum, r) => sum + r.conversionScore, 0) / successfulTests.length;
  const criticalPages = results.filter(r => r.critical && r.success);
  const avgCriticalScore = criticalPages.reduce((sum, r) => sum + r.conversionScore, 0) / criticalPages.length;
  
  console.log(`\n✅ Overall Conversion Score: ${avgScore.toFixed(1)}%`);
  console.log(`🎯 Critical Pages Score: ${avgCriticalScore.toFixed(1)}%`);
  
  // Individual page analysis
  console.log('\n📋 Page Analysis:');
  results.forEach(result => {
    if (result.success) {
      console.log(`\n${result.name} (${result.conversionScore}%):`);
      console.log(`  Load Time: ${result.loadTime}ms`);
      console.log(`  Forms: ${result.elements.forms}, CTAs: ${result.elements.ctaButtons}`);
      
      if (result.formUsability) {
        console.log(`  Form Usability: ${result.formUsability.usabilityScore}%`);
      }
      
      if (result.recommendations.length > 0) {
        console.log(`  Recommendations: ${result.recommendations.join(', ')}`);
      }
    }
  });
  
  // Key metrics for business
  console.log('\n📈 Key Conversion Metrics:');
  
  const leadMagnetPages = results.filter(r => r.path.includes('lead-magnets') && r.success);
  const avgLeadMagnetScore = leadMagnetPages.reduce((sum, r) => sum + r.conversionScore, 0) / leadMagnetPages.length;
  console.log(`  Lead Magnet Conversion Readiness: ${avgLeadMagnetScore.toFixed(1)}%`);
  
  const formsCount = results.reduce((sum, r) => sum + (r.elements?.forms || 0), 0);
  const avgLoadTime = successfulTests.reduce((sum, r) => sum + r.loadTime, 0) / successfulTests.length;
  console.log(`  Total Conversion Forms: ${formsCount}`);
  console.log(`  Average Page Load Time: ${avgLoadTime.toFixed(0)}ms`);
  
  // Mobile optimization
  const mobileOptimized = results.filter(r => 
    r.success && 
    r.mobileChecks?.noHorizontalScroll && 
    r.mobileChecks?.buttonsVisible && 
    r.mobileChecks?.formsVisible
  ).length;
  
  console.log(`  Mobile Optimized Pages: ${mobileOptimized}/${results.length}`);
  
  // Overall assessment
  const isReady = avgScore >= 75 && avgCriticalScore >= 80;
  console.log(`\n🏆 Conversion Readiness: ${isReady ? '✅ READY' : '⚠️ NEEDS IMPROVEMENT'}`);
  
  if (!isReady) {
    console.log('\n🔧 Priority Actions:');
    console.log('  1. Optimize critical page conversion elements');
    console.log('  2. Improve form usability and mobile experience');
    console.log('  3. Reduce page load times below 2 seconds');
    console.log('  4. Test conversion funnels with real users');
  }
  
  // Save results
  const fs = require('fs');
  const report = {
    summary: {
      overallScore: parseFloat(avgScore.toFixed(1)),
      criticalPagesScore: parseFloat(avgCriticalScore.toFixed(1)),
      avgLoadTime: parseFloat(avgLoadTime.toFixed(0)),
      mobileOptimized,
      totalPages: results.length,
      isConversionReady: isReady,
      timestamp: new Date().toISOString()
    },
    results
  };
  
  fs.writeFileSync('quick-conversion-test-results.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Results saved to: quick-conversion-test-results.json');
  
  return report;
}

if (require.main === module) {
  runQuickConversionTest().catch(console.error);
}

module.exports = { runQuickConversionTest };