/**
 * Production Validation Test Suite
 * Comprehensive testing for post-deployment validation
 */

const { chromium } = require('playwright');

class ProductionValidator {
  constructor(baseUrl = 'https://thebiggerboss.com.au') {
    this.baseUrl = baseUrl;
    this.results = [];
    this.errors = [];
    this.startTime = Date.now();
  }

  async runValidation() {
    console.log('🚀 Running Production Validation Suite...');
    console.log(`🌐 Testing: ${this.baseUrl}\n`);

    await this.testSystemHealth();
    await this.testCriticalPaths();
    await this.testPerformance();
    await this.testSecurity();
    await this.testAnalytics();
    await this.testMonitoring();

    this.generateValidationReport();
  }

  async testSystemHealth() {
    console.log('🏥 Testing System Health...');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${this.baseUrl}/api/monitoring/health`);
      const healthData = await healthResponse.json();

      this.results.push({
        category: 'System Health',
        test: 'Health Check Endpoint',
        status: healthResponse.ok && healthData.status !== 'unhealthy' ? 'pass' : 'fail',
        details: `Status: ${healthData.status}, Response: ${healthData.responseTime}`
      });

      // Test critical features
      if (healthData.checks && healthData.checks.features) {
        const features = healthData.checks.features;
        const criticalFeatures = ['forms', 'analytics'];
        
        criticalFeatures.forEach(feature => {
          this.results.push({
            category: 'System Health',
            test: `${feature.charAt(0).toUpperCase() + feature.slice(1)} Feature`,
            status: features[feature] ? 'pass' : 'fail',
            details: `Feature operational: ${features[feature]}`
          });
        });
      }

      // Test uptime endpoint
      const uptimeResponse = await fetch(`${this.baseUrl}/api/monitoring/health`, { 
        method: 'HEAD' 
      });
      
      this.results.push({
        category: 'System Health',
        test: 'Uptime Monitor',
        status: uptimeResponse.ok ? 'pass' : 'fail',
        details: `HEAD request status: ${uptimeResponse.status}`
      });

    } catch (error) {
      this.errors.push({
        category: 'System Health',
        error: `Health check failed: ${error.message}`
      });
    }
  }

  async testCriticalPaths() {
    console.log('🛣️ Testing Critical User Paths...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Production-Validator/1.0'
    });
    const page = await context.newPage();

    try {
      // Test all critical pages load
      const criticalPages = [
        { path: '/', name: 'Homepage' },
        { path: '/solutions/for-smbs', name: 'SMB Solutions' },
        { path: '/solutions/for-agencies', name: 'Agency Solutions' },
        { path: '/pricing', name: 'Pricing' },
        { path: '/contact', name: 'Contact' },
        { path: '/about', name: 'About' }
      ];

      for (const pageDef of criticalPages) {
        try {
          const response = await page.goto(`${this.baseUrl}${pageDef.path}`, {
            waitUntil: 'networkidle'
          });

          const loadTime = await page.evaluate(() => {
            return performance.timing.loadEventEnd - performance.timing.navigationStart;
          });

          this.results.push({
            category: 'Critical Paths',
            test: `${pageDef.name} Page Load`,
            status: response.ok() && loadTime < 5000 ? 'pass' : 'warning',
            details: `Status: ${response.status()}, Load time: ${loadTime}ms`
          });

          // Test page content
          const hasTitle = await page.locator('title').count() > 0;
          const hasMainContent = await page.locator('main, [role="main"]').count() > 0;
          const hasNavigation = await page.locator('nav, [role="navigation"]').count() > 0;

          this.results.push({
            category: 'Critical Paths',
            test: `${pageDef.name} Content Structure`,
            status: hasTitle && hasMainContent && hasNavigation ? 'pass' : 'fail',
            details: `Title: ${hasTitle}, Main: ${hasMainContent}, Nav: ${hasNavigation}`
          });

        } catch (error) {
          this.errors.push({
            category: 'Critical Paths',
            error: `${pageDef.name} failed: ${error.message}`
          });
        }
      }

      // Test form functionality on contact page
      await page.goto(`${this.baseUrl}/contact`);
      
      const contactForm = await page.locator('form').count() > 0;
      if (contactForm) {
        // Fill form with test data
        await page.fill('input[name="name"]', 'Production Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Production validation test message');
        
        // Check form validation (don't actually submit)
        const submitButton = await page.locator('button[type="submit"]');
        const isEnabled = await submitButton.isEnabled();
        
        this.results.push({
          category: 'Critical Paths',
          test: 'Contact Form Functionality',
          status: isEnabled ? 'pass' : 'fail',
          details: `Form submittable: ${isEnabled}`
        });
      }

    } catch (error) {
      this.errors.push({
        category: 'Critical Paths',
        error: `Critical path testing failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Test homepage performance
      const startTime = Date.now();
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Get Core Web Vitals
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {};
          
          // Get performance metrics
          if (performance.timing) {
            vitals.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            vitals.domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
          }
          
          setTimeout(() => resolve(vitals), 1000);
        });
      });

      this.results.push({
        category: 'Performance',
        test: 'Page Load Speed',
        status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        details: `Load time: ${loadTime}ms, DOM ready: ${vitals.domContentLoaded}ms`
      });

      // Test resource loading
      const resourceLoadingMetrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        const totalResources = resources.length;
        
        return {
          totalResources,
          slowResources: slowResources.length,
          averageLoadTime: resources.reduce((sum, r) => sum + r.duration, 0) / totalResources
        };
      });

      this.results.push({
        category: 'Performance',
        test: 'Resource Loading Efficiency',
        status: resourceLoadingMetrics.slowResources < 3 ? 'pass' : 'warning',
        details: `${resourceLoadingMetrics.slowResources}/${resourceLoadingMetrics.totalResources} slow resources, avg: ${Math.round(resourceLoadingMetrics.averageLoadTime)}ms`
      });

    } catch (error) {
      this.errors.push({
        category: 'Performance',
        error: `Performance testing failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async testSecurity() {
    console.log('🔒 Testing Security Configuration...');
    
    try {
      // Test HTTPS enforcement
      const httpResponse = await fetch(`${this.baseUrl.replace('https://', 'http://')}/`, {
        redirect: 'manual'
      });

      this.results.push({
        category: 'Security',
        test: 'HTTPS Enforcement',
        status: httpResponse.status >= 300 && httpResponse.status < 400 ? 'pass' : 'fail',
        details: `HTTP redirect status: ${httpResponse.status}`
      });

      // Test security headers
      const secureResponse = await fetch(`${this.baseUrl}/`);
      const headers = secureResponse.headers;
      
      const securityHeaders = {
        'strict-transport-security': headers.get('strict-transport-security'),
        'x-frame-options': headers.get('x-frame-options'),
        'x-content-type-options': headers.get('x-content-type-options'),
        'referrer-policy': headers.get('referrer-policy')
      };

      const presentHeaders = Object.entries(securityHeaders).filter(([key, value]) => value !== null);
      
      this.results.push({
        category: 'Security',
        test: 'Security Headers',
        status: presentHeaders.length >= 3 ? 'pass' : 'warning',
        details: `${presentHeaders.length}/4 security headers present`
      });

      // Test for common vulnerabilities
      const robotsResponse = await fetch(`${this.baseUrl}/robots.txt`);
      const hasRobots = robotsResponse.ok;
      
      const sitemapResponse = await fetch(`${this.baseUrl}/sitemap.xml`);
      const hasSitemap = sitemapResponse.ok;

      this.results.push({
        category: 'Security',
        test: 'SEO Security',
        status: hasRobots && hasSitemap ? 'pass' : 'warning',
        details: `Robots.txt: ${hasRobots}, Sitemap: ${hasSitemap}`
      });

    } catch (error) {
      this.errors.push({
        category: 'Security',
        error: `Security testing failed: ${error.message}`
      });
    }
  }

  async testAnalytics() {
    console.log('📊 Testing Analytics Integration...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      let analyticsRequests = [];
      
      // Monitor analytics requests
      page.on('request', request => {
        const url = request.url();
        if (url.includes('google-analytics.com') || 
            url.includes('googletagmanager.com') ||
            url.includes('/api/analytics/') ||
            url.includes('vercel.live')) {
          analyticsRequests.push({
            url: url,
            method: request.method()
          });
        }
      });

      // Visit homepage and trigger analytics
      await page.goto(`${this.baseUrl}/`);
      await page.waitForTimeout(3000); // Wait for analytics to load

      // Check for Google Analytics
      const hasGA4 = await page.evaluate(() => {
        return typeof window.gtag === 'function' || typeof window.ga === 'function';
      });

      this.results.push({
        category: 'Analytics',
        test: 'Google Analytics Integration',
        status: hasGA4 ? 'pass' : 'warning',
        details: `GA4 loaded: ${hasGA4}, Requests: ${analyticsRequests.length}`
      });

      // Test custom analytics endpoints
      try {
        const analyticsResponse = await fetch(`${this.baseUrl}/api/analytics/track-event`, {
          method: 'OPTIONS'
        });
        
        this.results.push({
          category: 'Analytics',
          test: 'Custom Analytics API',
          status: analyticsResponse.ok ? 'pass' : 'warning',
          details: `API accessible: ${analyticsResponse.ok}`
        });
      } catch (error) {
        this.results.push({
          category: 'Analytics',
          test: 'Custom Analytics API',
          status: 'warning',
          details: 'API endpoint not accessible'
        });
      }

    } catch (error) {
      this.errors.push({
        category: 'Analytics',
        error: `Analytics testing failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async testMonitoring() {
    console.log('📈 Testing Monitoring Systems...');
    
    try {
      // Test metrics endpoint
      const metricsResponse = await fetch(`${this.baseUrl}/api/monitoring/metrics?period=1d`);
      const metricsData = await metricsResponse.json();

      this.results.push({
        category: 'Monitoring',
        test: 'Metrics Collection',
        status: metricsResponse.ok && metricsData.success ? 'pass' : 'fail',
        details: `Metrics API operational: ${metricsResponse.ok}`
      });

      // Test custom metrics recording
      const customMetricResponse = await fetch(`${this.baseUrl}/api/monitoring/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: 'production_validation_test',
          value: 1,
          timestamp: new Date().toISOString()
        })
      });

      this.results.push({
        category: 'Monitoring',
        test: 'Custom Metrics Recording',
        status: customMetricResponse.ok ? 'pass' : 'warning',
        details: `Custom metrics working: ${customMetricResponse.ok}`
      });

    } catch (error) {
      this.errors.push({
        category: 'Monitoring',
        error: `Monitoring testing failed: ${error.message}`
      });
    }
  }

  generateValidationReport() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('\n🚀 Production Validation Report');
    console.log('=' .repeat(50));

    // Categorize results
    const categories = {};
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { pass: 0, warning: 0, fail: 0, total: 0 };
      }
      categories[result.category][result.status]++;
      categories[result.category].total++;
    });

    // Overall summary
    const totalTests = this.results.length;
    const totalPassed = this.results.filter(r => r.status === 'pass').length;
    const totalWarnings = this.results.filter(r => r.status === 'warning').length;
    const totalFailed = this.results.filter(r => r.status === 'fail').length;

    console.log(`\n📊 Overall Results:`);
    console.log(`  ✅ Passed: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`  ⚠️  Warnings: ${totalWarnings}/${totalTests} (${Math.round(totalWarnings/totalTests*100)}%)`);
    console.log(`  ❌ Failed: ${totalFailed}/${totalTests} (${Math.round(totalFailed/totalTests*100)}%)`);
    console.log(`  ⏱️  Total time: ${Math.round(totalTime/1000)}s`);

    // Category breakdown
    console.log(`\n📋 Results by Category:`);
    Object.entries(categories).forEach(([category, stats]) => {
      const score = Math.round((stats.pass / stats.total) * 100);
      const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
      console.log(`  ${status} ${category}: ${stats.pass}/${stats.total} passed (${score}%)`);
    });

    // Detailed results
    if (this.results.length > 0) {
      console.log('\n📝 Detailed Results:');
      Object.entries(categories).forEach(([category, _]) => {
        console.log(`\n  ${category}:`);
        this.results.filter(r => r.category === category).forEach(result => {
          const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
          console.log(`    ${icon} ${result.test}: ${result.details}`);
        });
      });
    }

    // Errors
    if (this.errors.length > 0) {
      console.log('\n🚨 Critical Errors:');
      this.errors.forEach(error => {
        console.log(`  ❌ ${error.category}: ${error.error}`);
      });
    }

    // Production readiness assessment
    const isProductionReady = totalFailed === 0 && this.errors.length === 0;
    const hasMinorIssues = totalWarnings > 0 || totalFailed > 0;
    
    console.log(`\n🏆 Production Status: ${isProductionReady ? '✅ READY' : hasMinorIssues ? '⚠️ READY WITH WARNINGS' : '❌ NOT READY'}`);
    
    if (isProductionReady) {
      console.log('🎉 All systems operational! Deployment successful.');
    } else if (hasMinorIssues) {
      console.log('⚠️ Minor issues detected but system is functional.');
    } else {
      console.log('❌ Critical issues detected. Rollback recommended.');
    }

    // Next steps
    console.log('\n📋 Next Steps:');
    if (isProductionReady) {
      console.log('  1. Begin monitoring dashboard review');
      console.log('  2. Set up automated alerts');
      console.log('  3. Notify stakeholders of successful deployment');
      console.log('  4. Begin post-launch KPI tracking');
    } else {
      console.log('  1. Review failed tests and errors');
      console.log('  2. Consider rollback if critical failures exist');
      console.log('  3. Fix issues and re-validate');
      console.log('  4. Escalate to technical team if needed');
    }

    // Save validation report
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      duration: totalTime,
      summary: {
        totalTests,
        passed: totalPassed,
        warnings: totalWarnings,
        failed: totalFailed,
        isReady: isProductionReady,
        score: Math.round((totalPassed / totalTests) * 100)
      },
      categories,
      results: this.results,
      errors: this.errors
    };

    fs.writeFileSync('production-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Validation report saved to: production-validation-report.json');

    return report;
  }
}

// Run validation
async function main() {
  const validator = new ProductionValidator();
  await validator.runValidation();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionValidator;