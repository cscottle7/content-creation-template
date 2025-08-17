/**
 * Post-Launch Validation and Monitoring Suite
 * Comprehensive validation for production systems after deployment
 */

const { chromium } = require('playwright');
const fs = require('fs');

class PostLaunchValidator {
  constructor(baseUrl = 'http://localhost:3003') {
    this.baseUrl = baseUrl;
    this.results = [];
    this.errors = [];
    this.metrics = {};
    this.startTime = Date.now();
    this.validationId = `validation_${Date.now()}`;
  }

  async runPostLaunchValidation() {
    console.log('🚀 Running Post-Launch Validation Suite...');
    console.log(`🌐 Target: ${this.baseUrl}`);
    console.log(`🆔 Validation ID: ${this.validationId}\n`);

    await this.validateSystemHealth();
    await this.validateCriticalUserJourneys();
    await this.validateAnalyticsTracking();
    await this.validateMonitoringAndAlerts();
    await this.validatePerformanceBaseline();
    await this.validateConversionFunnels();
    await this.validateSEOAndDiscoverability();
    await this.validateBusinessMetrics();

    this.generatePostLaunchReport();
  }

  async validateSystemHealth() {
    console.log('🏥 Validating System Health...');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${this.baseUrl}/api/monitoring/health`);
      const healthData = await healthResponse.json();

      this.results.push({
        category: 'System Health',
        test: 'Health Check Endpoint',
        status: healthResponse.ok && healthData.status === 'healthy' ? 'pass' : 'fail',
        details: `Status: ${healthData.status}, Response time: ${healthData.responseTime}`,
        timestamp: new Date().toISOString()
      });

      this.metrics.systemHealth = {
        status: healthData.status,
        responseTime: healthData.responseTime,
        uptime: healthData.uptime
      };

      // Test all critical API endpoints
      const apiEndpoints = [
        '/api/monitoring/health',
        '/api/monitoring/metrics'
      ];

      for (const endpoint of apiEndpoints) {
        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`);
          this.results.push({
            category: 'System Health',
            test: `API Endpoint: ${endpoint}`,
            status: response.ok ? 'pass' : 'fail',
            details: `Status: ${response.status}, Response time: ${response.headers.get('x-response-time') || 'N/A'}`,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          this.errors.push({
            category: 'System Health',
            error: `API endpoint ${endpoint} failed: ${error.message}`
          });
        }
      }

      // Test database connectivity (if applicable)
      if (healthData.checks && healthData.checks.database) {
        this.results.push({
          category: 'System Health',
          test: 'Database Connectivity',
          status: healthData.checks.database.status === 'up' ? 'pass' : 'fail',
          details: `DB Response: ${healthData.checks.database.responseTime}ms`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      this.errors.push({
        category: 'System Health',
        error: `Health validation failed: ${error.message}`
      });
    }
  }

  async validateCriticalUserJourneys() {
    console.log('🛣️ Validating Critical User Journeys...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      // Journey 1: SMB Owner Discovery Path
      await this.testSMBUserJourney(page);
      
      // Journey 2: Agency Manager Evaluation Path
      await this.testAgencyUserJourney(page);
      
      // Journey 3: Contact Form Submission
      await this.testContactFormJourney(page);

    } catch (error) {
      this.errors.push({
        category: 'User Journeys',
        error: `User journey testing failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async testSMBUserJourney(page) {
    console.log('  👤 Testing SMB Owner Journey...');
    
    try {
      // Start at homepage
      const response = await page.goto(`${this.baseUrl}/`);
      const loadTime = await page.evaluate(() => 
        performance.timing.loadEventEnd - performance.timing.navigationStart
      );

      this.results.push({
        category: 'User Journeys',
        test: 'SMB Journey - Homepage Load',
        status: response.ok() && loadTime < 3000 ? 'pass' : 'warning',
        details: `Load time: ${loadTime}ms, Status: ${response.status()}`,
        timestamp: new Date().toISOString()
      });

      // Navigate to SMB solutions page
      await page.click('a[href*="for-smbs"]');
      await page.waitForLoadState('networkidle');

      const smbPageLoaded = await page.locator('h1').textContent();
      const hasRelevantContent = smbPageLoaded && smbPageLoaded.toLowerCase().includes('small');

      this.results.push({
        category: 'User Journeys',
        test: 'SMB Journey - Solutions Page',
        status: hasRelevantContent ? 'pass' : 'fail',
        details: `Page title: ${smbPageLoaded || 'Not found'}`,
        timestamp: new Date().toISOString()
      });

      // Test CTA interactions
      const ctaButtons = await page.locator('button, a[href*="contact"]').count();
      
      this.results.push({
        category: 'User Journeys',
        test: 'SMB Journey - Call-to-Action',
        status: ctaButtons > 0 ? 'pass' : 'fail',
        details: `${ctaButtons} CTA elements found`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.errors.push({
        category: 'User Journeys',
        error: `SMB journey failed: ${error.message}`
      });
    }
  }

  async testAgencyUserJourney(page) {
    console.log('  🏢 Testing Agency Manager Journey...');
    
    try {
      // Navigate to agency solutions page
      await page.goto(`${this.baseUrl}/solutions/for-agencies`);
      
      const agencyPageTitle = await page.locator('h1').textContent();
      const hasAgencyContent = agencyPageTitle && agencyPageTitle.toLowerCase().includes('agenc');

      this.results.push({
        category: 'User Journeys',
        test: 'Agency Journey - Solutions Page',
        status: hasAgencyContent ? 'pass' : 'fail',
        details: `Page title: ${agencyPageTitle || 'Not found'}`,
        timestamp: new Date().toISOString()
      });

      // Navigate to pricing page
      await page.goto(`${this.baseUrl}/pricing`);
      
      const pricingContent = await page.locator('h1, h2').first().textContent();
      const hasPricingStructure = await page.locator('[class*="price"], [class*="tier"]').count() > 0;

      this.results.push({
        category: 'User Journeys',
        test: 'Agency Journey - Pricing Information',
        status: hasPricingStructure ? 'pass' : 'warning',
        details: `Pricing elements found: ${hasPricingStructure}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.errors.push({
        category: 'User Journeys',
        error: `Agency journey failed: ${error.message}`
      });
    }
  }

  async testContactFormJourney(page) {
    console.log('  📧 Testing Contact Form Journey...');
    
    try {
      await page.goto(`${this.baseUrl}/contact`);
      
      // Check form presence and structure
      const hasForm = await page.locator('form').count() > 0;
      const requiredFields = ['name', 'email', 'message'];
      let fieldsPresent = 0;

      for (const field of requiredFields) {
        const fieldExists = await page.locator(`input[name="${field}"], textarea[name="${field}"]`).count() > 0;
        if (fieldExists) fieldsPresent++;
      }

      this.results.push({
        category: 'User Journeys',
        test: 'Contact Form - Structure',
        status: hasForm && fieldsPresent === requiredFields.length ? 'pass' : 'fail',
        details: `Form: ${hasForm}, Fields: ${fieldsPresent}/${requiredFields.length}`,
        timestamp: new Date().toISOString()
      });

      if (hasForm) {
        // Test form validation
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Post-launch validation test message');
        
        const submitButton = await page.locator('button[type="submit"]');
        const isSubmittable = await submitButton.isEnabled();

        this.results.push({
          category: 'User Journeys',
          test: 'Contact Form - Validation',
          status: isSubmittable ? 'pass' : 'fail',
          details: `Form submittable: ${isSubmittable}`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      this.errors.push({
        category: 'User Journeys',
        error: `Contact form journey failed: ${error.message}`
      });
    }
  }

  async validateAnalyticsTracking() {
    console.log('📊 Validating Analytics Tracking...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      let analyticsEvents = [];
      
      // Monitor analytics requests
      page.on('request', request => {
        const url = request.url();
        if (url.includes('google-analytics.com') || 
            url.includes('googletagmanager.com') ||
            url.includes('/api/analytics/') ||
            url.includes('vercel.live')) {
          analyticsEvents.push({
            url: url,
            method: request.method(),
            timestamp: Date.now()
          });
        }
      });

      // Visit homepage and trigger analytics
      await page.goto(`${this.baseUrl}/`);
      await page.waitForTimeout(3000);

      // Check for analytics initialization
      const hasGA4 = await page.evaluate(() => {
        return typeof window.gtag === 'function' || typeof window.ga === 'function';
      });

      this.results.push({
        category: 'Analytics Tracking',
        test: 'Google Analytics Integration',
        status: hasGA4 ? 'pass' : 'warning',
        details: `GA4 initialized: ${hasGA4}, Events: ${analyticsEvents.length}`,
        timestamp: new Date().toISOString()
      });

      // Test page view tracking
      await page.goto(`${this.baseUrl}/about`);
      await page.waitForTimeout(2000);

      this.results.push({
        category: 'Analytics Tracking',
        test: 'Page View Tracking',
        status: analyticsEvents.length > 0 ? 'pass' : 'warning',
        details: `${analyticsEvents.length} analytics requests captured`,
        timestamp: new Date().toISOString()
      });

      // Test custom events (if implemented)
      try {
        const customEventResponse = await fetch(`${this.baseUrl}/api/analytics/track-event`, {
          method: 'OPTIONS'
        });
        
        this.results.push({
          category: 'Analytics Tracking',
          test: 'Custom Event Tracking',
          status: customEventResponse.ok ? 'pass' : 'warning',
          details: `Custom analytics API: ${customEventResponse.ok ? 'Available' : 'Not available'}`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.results.push({
          category: 'Analytics Tracking',
          test: 'Custom Event Tracking',
          status: 'warning',
          details: 'Custom analytics API not accessible',
          timestamp: new Date().toISOString()
        });
      }

      this.metrics.analytics = {
        ga4Initialized: hasGA4,
        eventCount: analyticsEvents.length,
        lastEventTime: analyticsEvents.length > 0 ? Math.max(...analyticsEvents.map(e => e.timestamp)) : null
      };

    } catch (error) {
      this.errors.push({
        category: 'Analytics Tracking',
        error: `Analytics validation failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async validateMonitoringAndAlerts() {
    console.log('🔔 Validating Monitoring and Alerts...');
    
    try {
      // Test metrics collection
      const metricsResponse = await fetch(`${this.baseUrl}/api/monitoring/metrics?period=1d&details=true`);
      const metricsData = await metricsResponse.json();

      this.results.push({
        category: 'Monitoring',
        test: 'Metrics Collection',
        status: metricsResponse.ok && metricsData.success ? 'pass' : 'fail',
        details: `Metrics API operational: ${metricsResponse.ok}`,
        timestamp: new Date().toISOString()
      });

      if (metricsData.success) {
        // Validate metrics structure
        const requiredMetrics = ['traffic', 'conversions', 'performance', 'business'];
        const presentMetrics = requiredMetrics.filter(metric => metricsData.data[metric]);
        
        this.results.push({
          category: 'Monitoring',
          test: 'Metrics Data Structure',
          status: presentMetrics.length >= 3 ? 'pass' : 'warning',
          details: `${presentMetrics.length}/${requiredMetrics.length} metric categories available`,
          timestamp: new Date().toISOString()
        });

        this.metrics.monitoring = {
          metricsAvailable: presentMetrics.length,
          lastUpdated: metricsData.data.lastUpdated,
          healthScore: metricsData.data.calculated?.healthScore
        };
      }

      // Test custom metrics recording
      const customMetric = {
        metric: 'post_launch_validation',
        value: 1,
        timestamp: new Date().toISOString()
      };

      const recordResponse = await fetch(`${this.baseUrl}/api/monitoring/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customMetric)
      });

      this.results.push({
        category: 'Monitoring',
        test: 'Custom Metrics Recording',
        status: recordResponse.ok ? 'pass' : 'warning',
        details: `Custom metrics recording: ${recordResponse.ok ? 'Working' : 'Failed'}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.errors.push({
        category: 'Monitoring',
        error: `Monitoring validation failed: ${error.message}`
      });
    }
  }

  async validatePerformanceBaseline() {
    console.log('⚡ Validating Performance Baseline...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Test key pages for performance
      const testPages = [
        { path: '/', name: 'Homepage' },
        { path: '/solutions/for-smbs', name: 'SMB Solutions' },
        { path: '/solutions/for-agencies', name: 'Agency Solutions' },
        { path: '/pricing', name: 'Pricing' }
      ];

      let totalLoadTime = 0;
      let pagesTestedCount = 0;

      for (const pageDef of testPages) {
        try {
          const startTime = Date.now();
          await page.goto(`${this.baseUrl}${pageDef.path}`, { waitUntil: 'networkidle' });
          const loadTime = Date.now() - startTime;
          
          totalLoadTime += loadTime;
          pagesTestedCount++;

          // Get performance metrics
          const performanceMetrics = await page.evaluate(() => {
            if (performance.timing) {
              return {
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
              };
            }
            return null;
          });

          this.results.push({
            category: 'Performance Baseline',
            test: `${pageDef.name} Load Performance`,
            status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
            details: `Load time: ${loadTime}ms, DOM ready: ${performanceMetrics?.domContentLoaded || 'N/A'}ms`,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          this.errors.push({
            category: 'Performance Baseline',
            error: `Performance test for ${pageDef.name} failed: ${error.message}`
          });
        }
      }

      const averageLoadTime = pagesTestedCount > 0 ? Math.round(totalLoadTime / pagesTestedCount) : 0;
      
      this.results.push({
        category: 'Performance Baseline',
        test: 'Overall Performance Score',
        status: averageLoadTime < 2500 ? 'pass' : averageLoadTime < 4000 ? 'warning' : 'fail',
        details: `Average load time: ${averageLoadTime}ms across ${pagesTestedCount} pages`,
        timestamp: new Date().toISOString()
      });

      this.metrics.performance = {
        averageLoadTime,
        pagesTestedCount,
        baselineEstablished: true
      };

    } catch (error) {
      this.errors.push({
        category: 'Performance Baseline',
        error: `Performance baseline failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async validateConversionFunnels() {
    console.log('🎯 Validating Conversion Funnels...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Test conversion elements presence
      const conversionTests = [
        { page: '/', elements: ['button', 'a[href*="contact"]'], name: 'Homepage CTAs' },
        { page: '/solutions/for-smbs', elements: ['button', 'a[href*="contact"]'], name: 'SMB Solution CTAs' },
        { page: '/contact', elements: ['form', 'input[type="submit"]'], name: 'Contact Form' }
      ];

      let totalConversionElements = 0;
      let functionalElements = 0;

      for (const test of conversionTests) {
        try {
          await page.goto(`${this.baseUrl}${test.page}`);
          
          let pageElements = 0;
          let workingElements = 0;

          for (const selector of test.elements) {
            const elements = await page.locator(selector).count();
            pageElements += elements;
            
            if (elements > 0) {
              // Check if elements are interactive
              const isInteractive = await page.locator(selector).first().isEnabled();
              if (isInteractive) workingElements += elements;
            }
          }

          totalConversionElements += pageElements;
          functionalElements += workingElements;

          this.results.push({
            category: 'Conversion Funnels',
            test: test.name,
            status: workingElements > 0 ? 'pass' : 'fail',
            details: `${workingElements}/${pageElements} functional conversion elements`,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          this.errors.push({
            category: 'Conversion Funnels',
            error: `Conversion test for ${test.name} failed: ${error.message}`
          });
        }
      }

      const conversionEfficiency = totalConversionElements > 0 ? 
        Math.round((functionalElements / totalConversionElements) * 100) : 0;

      this.results.push({
        category: 'Conversion Funnels',
        test: 'Overall Conversion Efficiency',
        status: conversionEfficiency >= 90 ? 'pass' : conversionEfficiency >= 70 ? 'warning' : 'fail',
        details: `${conversionEfficiency}% of conversion elements functional`,
        timestamp: new Date().toISOString()
      });

      this.metrics.conversions = {
        totalElements: totalConversionElements,
        functionalElements,
        efficiency: conversionEfficiency
      };

    } catch (error) {
      this.errors.push({
        category: 'Conversion Funnels',
        error: `Conversion validation failed: ${error.message}`
      });
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async validateSEOAndDiscoverability() {
    console.log('🔍 Validating SEO and Discoverability...');
    
    try {
      // Test robots.txt
      const robotsResponse = await fetch(`${this.baseUrl}/robots.txt`);
      this.results.push({
        category: 'SEO & Discoverability',
        test: 'Robots.txt',
        status: robotsResponse.ok ? 'pass' : 'warning',
        details: `Robots.txt ${robotsResponse.ok ? 'accessible' : 'not found'}`,
        timestamp: new Date().toISOString()
      });

      // Test sitemap.xml
      const sitemapResponse = await fetch(`${this.baseUrl}/sitemap.xml`);
      this.results.push({
        category: 'SEO & Discoverability',
        test: 'XML Sitemap',
        status: sitemapResponse.ok ? 'pass' : 'warning',
        details: `Sitemap ${sitemapResponse.ok ? 'accessible' : 'not found'}`,
        timestamp: new Date().toISOString()
      });

      // Test meta tags on key pages
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      const seoPages = ['/', '/solutions/for-smbs', '/solutions/for-agencies', '/pricing'];
      let pagesWithGoodSEO = 0;

      for (const pagePath of seoPages) {
        try {
          await page.goto(`${this.baseUrl}${pagePath}`);
          
          const title = await page.locator('title').textContent();
          const description = await page.locator('meta[name="description"]').getAttribute('content');
          const hasTitle = title && title.length > 10 && title.length < 60;
          const hasDescription = description && description.length > 50 && description.length < 160;

          if (hasTitle && hasDescription) pagesWithGoodSEO++;

          this.results.push({
            category: 'SEO & Discoverability',
            test: `SEO Meta Tags - ${pagePath}`,
            status: hasTitle && hasDescription ? 'pass' : 'warning',
            details: `Title: ${hasTitle ? 'Good' : 'Issues'}, Description: ${hasDescription ? 'Good' : 'Issues'}`,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          this.errors.push({
            category: 'SEO & Discoverability',
            error: `SEO test for ${pagePath} failed: ${error.message}`
          });
        }
      }

      await context.close();
      await browser.close();

      this.metrics.seo = {
        robotsAccessible: robotsResponse.ok,
        sitemapAccessible: sitemapResponse.ok,
        pagesWithGoodSEO,
        totalPagesTested: seoPages.length
      };

    } catch (error) {
      this.errors.push({
        category: 'SEO & Discoverability',
        error: `SEO validation failed: ${error.message}`
      });
    }
  }

  async validateBusinessMetrics() {
    console.log('📈 Validating Business Metrics...');
    
    try {
      // Test KPI tracking endpoints
      const kpiEndpoints = [
        '/api/monitoring/metrics?period=30d',
        '/api/monitoring/health'
      ];

      let functionalEndpoints = 0;

      for (const endpoint of kpiEndpoints) {
        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`);
          if (response.ok) functionalEndpoints++;

          this.results.push({
            category: 'Business Metrics',
            test: `KPI Endpoint - ${endpoint}`,
            status: response.ok ? 'pass' : 'fail',
            details: `Endpoint ${response.ok ? 'operational' : 'failed'} - Status: ${response.status}`,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          this.errors.push({
            category: 'Business Metrics',
            error: `KPI endpoint ${endpoint} failed: ${error.message}`
          });
        }
      }

      // Validate baseline metrics collection
      try {
        const metricsResponse = await fetch(`${this.baseUrl}/api/monitoring/metrics?period=1d&details=true`);
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          const hasTrafficData = metricsData.data.traffic && metricsData.data.traffic.visitors > 0;
          const hasPerformanceData = metricsData.data.performance && metricsData.data.performance.averageLoadTime;

          this.results.push({
            category: 'Business Metrics',
            test: 'Baseline Metrics Collection',
            status: hasTrafficData || hasPerformanceData ? 'pass' : 'warning',
            details: `Traffic data: ${hasTrafficData}, Performance data: ${hasPerformanceData}`,
            timestamp: new Date().toISOString()
          });

          this.metrics.business = {
            visitors: metricsData.data.traffic?.visitors || 0,
            conversions: metricsData.data.conversions?.total || 0,
            averageLoadTime: metricsData.data.performance?.averageLoadTime || 0
          };
        }

      } catch (error) {
        this.results.push({
          category: 'Business Metrics',
          test: 'Baseline Metrics Collection',
          status: 'warning',
          details: 'Could not retrieve baseline metrics',
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      this.errors.push({
        category: 'Business Metrics',
        error: `Business metrics validation failed: ${error.message}`
      });
    }
  }

  generatePostLaunchReport() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('\n🚀 Post-Launch Validation Report');
    console.log('=' .repeat(55));

    // Calculate overall validation results
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'pass').length;
    const warningTests = this.results.filter(r => r.status === 'warning').length;
    const failedTests = this.results.filter(r => r.status === 'fail').length;

    const validationScore = Math.round((passedTests / totalTests) * 100);

    console.log(`\n📊 Validation Summary:`);
    console.log(`  ✅ Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`  ⚠️  Warnings: ${warningTests}/${totalTests} (${Math.round(warningTests/totalTests*100)}%)`);
    console.log(`  ❌ Failed: ${failedTests}/${totalTests} (${Math.round(failedTests/totalTests*100)}%)`);
    console.log(`  ⏱️  Validation time: ${Math.round(totalTime/1000)}s`);

    // Group results by category
    const categories = {};
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });

    console.log(`\n📋 Validation Results by Category:`);
    Object.entries(categories).forEach(([category, results]) => {
      const categoryPassed = results.filter(r => r.status === 'pass').length;
      const categoryTotal = results.length;
      const categoryScore = Math.round((categoryPassed / categoryTotal) * 100);
      const status = categoryScore >= 90 ? '✅' : categoryScore >= 70 ? '⚠️' : '❌';
      
      console.log(`  ${status} ${category}: ${categoryPassed}/${categoryTotal} passed (${categoryScore}%)`);
    });

    // Detailed results
    console.log(`\n📝 Detailed Validation Results:`);
    Object.entries(categories).forEach(([category, results]) => {
      console.log(`\n  ${category}:`);
      results.forEach(result => {
        const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        console.log(`    ${icon} ${result.test}: ${result.details}`);
      });
    });

    // Critical errors
    if (this.errors.length > 0) {
      console.log('\n🚨 Critical Issues Found:');
      this.errors.forEach(error => {
        console.log(`  ❌ ${error.category}: ${error.error}`);
      });
    }

    // Key metrics summary
    console.log('\n📊 Key Metrics Collected:');
    if (this.metrics.systemHealth) {
      console.log(`  🏥 System Status: ${this.metrics.systemHealth.status}`);
      console.log(`  ⏱️  Response Time: ${this.metrics.systemHealth.responseTime}`);
    }
    if (this.metrics.performance) {
      console.log(`  ⚡ Average Load Time: ${this.metrics.performance.averageLoadTime}ms`);
    }
    if (this.metrics.conversions) {
      console.log(`  🎯 Conversion Efficiency: ${this.metrics.conversions.efficiency}%`);
    }
    if (this.metrics.analytics) {
      console.log(`  📊 Analytics Events: ${this.metrics.analytics.eventCount}`);
    }

    // Overall status assessment
    const isHealthy = failedTests === 0 && this.errors.length === 0;
    const hasMinorIssues = failedTests < 3 && this.errors.length === 0;
    
    console.log(`\n🏆 Post-Launch Status: ${
      isHealthy ? '✅ SYSTEMS OPERATIONAL' : 
      hasMinorIssues ? '⚠️ OPERATIONAL WITH WARNINGS' : 
      '❌ CRITICAL ISSUES DETECTED'
    }`);
    console.log(`📊 Overall Validation Score: ${validationScore}%`);

    // Recommendations
    console.log('\n📋 Recommended Actions:');
    if (isHealthy) {
      console.log('  ✅ All systems operational - begin normal monitoring');
      console.log('  📊 Set up automated KPI tracking');
      console.log('  🔔 Configure alerting thresholds');
      console.log('  📈 Begin performance baseline establishment');
    } else if (hasMinorIssues) {
      console.log('  ⚠️ Address warning items when possible');
      console.log('  🔍 Monitor system closely for 24-48 hours');
      console.log('  📊 Verify analytics data collection');
      console.log('  🔧 Schedule maintenance for non-critical issues');
    } else {
      console.log('  🚨 Address critical failures immediately');
      console.log('  🔄 Consider rollback if issues persist');
      console.log('  📞 Escalate to technical team');
      console.log('  🔍 Investigate root causes');
    }

    // Save comprehensive validation report
    const report = {
      validationId: this.validationId,
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      duration: totalTime,
      summary: {
        totalTests,
        passed: passedTests,
        warnings: warningTests,
        failed: failedTests,
        score: validationScore,
        isHealthy,
        hasMinorIssues
      },
      categories,
      results: this.results,
      errors: this.errors,
      metrics: this.metrics,
      recommendations: {
        immediate: isHealthy ? 'Begin normal operations' : hasMinorIssues ? 'Monitor closely' : 'Address critical issues',
        shortTerm: 'Establish performance baselines and monitoring',
        longTerm: 'Optimize based on user feedback and metrics'
      }
    };

    fs.writeFileSync('post-launch-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Comprehensive validation report saved to: post-launch-validation-report.json');

    return report;
  }
}

// Run post-launch validation
async function main() {
  const validator = new PostLaunchValidator();
  await validator.runPostLaunchValidation();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PostLaunchValidator;