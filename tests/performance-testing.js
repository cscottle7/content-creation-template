/**
 * Performance Optimization and Testing Suite
 * Tests Core Web Vitals, loading performance, and optimization metrics
 * 
 * Core Web Vitals Targets:
 * - Largest Contentful Paint (LCP): < 2.5s (Good), < 4.0s (Needs Improvement)
 * - First Input Delay (FID): < 100ms (Good), < 300ms (Needs Improvement)
 * - Cumulative Layout Shift (CLS): < 0.1 (Good), < 0.25 (Needs Improvement)
 * - First Contentful Paint (FCP): < 1.8s (Good), < 3.0s (Needs Improvement)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TEST_URL = 'http://localhost:3003';

// Performance test pages
const performancePages = [
  { name: 'Homepage', path: '/', critical: true, weight: 0.3 },
  { name: 'SMB Solutions', path: '/solutions/for-smbs', critical: true, weight: 0.25 },
  { name: 'Agency Solutions', path: '/solutions/for-agencies', critical: true, weight: 0.25 },
  { name: 'SMB Lead Magnet', path: '/lead-magnets/smb-content-guide', critical: true, weight: 0.1 },
  { name: 'Agency Lead Magnet', path: '/lead-magnets/agency-webinar', critical: true, weight: 0.1 }
];

class PerformanceTester {
  constructor() {
    this.results = [];
    this.metrics = {};
  }

  async runPerformanceTests() {
    console.log('⚡ Starting Performance Optimization Testing...\n');
    
    const browser = await chromium.launch({ 
      headless: true,
      args: [
        '--enable-precise-memory-info',
        '--enable-performance-manager-debug-logging',
        '--no-sandbox'
      ]
    });
    
    try {
      // Test desktop performance
      await this.testPerformanceForDevice(browser, 'Desktop', { width: 1920, height: 1080 });
      
      // Test mobile performance
      await this.testPerformanceForDevice(browser, 'Mobile', { width: 375, height: 667 });
      
      // Run specific optimization tests
      await this.testResourceOptimization(browser);
      await this.testCacheEffectiveness(browser);
      await this.testImageOptimization(browser);
      
    } finally {
      await browser.close();
    }
    
    this.generatePerformanceReport();
  }

  async testPerformanceForDevice(browser, deviceType, viewport) {
    console.log(`📱 Testing ${deviceType} Performance (${viewport.width}x${viewport.height})`);
    
    const context = await browser.newContext({ 
      viewport,
      // Simulate network conditions for mobile
      ...(deviceType === 'Mobile' && {
        extraHTTPHeaders: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        }
      })
    });
    
    const page = await context.newPage();
    
    try {
      for (const testPage of performancePages) {
        console.log(`  🔍 Testing ${testPage.name}...`);
        
        const result = await this.measurePagePerformance(page, testPage, deviceType);
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

  async measurePagePerformance(page, testPage, deviceType) {
    const startTime = Date.now();
    
    try {
      // Clear cache and start fresh
      await page.goto('about:blank');
      
      // Navigate and measure
      const response = await page.goto(`${TEST_URL}${testPage.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      const navigationTime = Date.now() - startTime;
      
      // Get detailed performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource');
        
        // Calculate resource metrics
        const totalResourceSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const jsResources = resources.filter(r => r.name.includes('.js') || r.initiatorType === 'script');
        const cssResources = resources.filter(r => r.name.includes('.css') || r.initiatorType === 'link');
        const imageResources = resources.filter(r => 
          r.name.includes('.jpg') || r.name.includes('.png') || r.name.includes('.svg') || 
          r.name.includes('.webp') || r.initiatorType === 'img'
        );
        
        return {
          // Core Web Vitals
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0, // Will be measured separately
          
          // Navigation timing
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          domInteractive: navigation?.domInteractive - navigation?.domContentLoadedEventStart || 0,
          
          // Resource metrics
          totalResources: resources.length,
          totalResourceSize: Math.round(totalResourceSize / 1024), // KB
          jsResourceCount: jsResources.length,
          cssResourceCount: cssResources.length,
          imageResourceCount: imageResources.length,
          
          // Transfer sizes
          jsSize: Math.round(jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024),
          cssSize: Math.round(cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024),
          imageSize: Math.round(imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024),
          
          // Memory usage (if available)
          memoryUsage: performance.memory ? {
            usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
            totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
          } : null
        };
      });
      
      // Measure Largest Contentful Paint using observer
      const lcpValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          let lcp = 0;
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Resolve after a short wait
          setTimeout(() => {
            observer.disconnect();
            resolve(lcp);
          }, 2000);
        });
      });
      
      performanceMetrics.largestContentfulPaint = lcpValue;
      
      // Measure Cumulative Layout Shift
      const clsValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(cls);
          }, 2000);
        });
      });
      
      performanceMetrics.cumulativeLayoutShift = clsValue;
      
      // Calculate performance scores
      const coreWebVitalsScore = this.calculateCoreWebVitalsScore(performanceMetrics);
      const loadingScore = this.calculateLoadingScore(performanceMetrics, navigationTime);
      const resourceScore = this.calculateResourceScore(performanceMetrics);
      
      const overallScore = Math.round(
        (coreWebVitalsScore * 0.5) + 
        (loadingScore * 0.3) + 
        (resourceScore * 0.2)
      );
      
      // Generate optimization recommendations
      const recommendations = this.generateOptimizationRecommendations(performanceMetrics, deviceType);
      
      return {
        pageName: testPage.name,
        path: testPage.path,
        critical: testPage.critical,
        weight: testPage.weight,
        success: response.ok(),
        navigationTime,
        performanceMetrics,
        scores: {
          overall: overallScore,
          coreWebVitals: coreWebVitalsScore,
          loading: loadingScore,
          resource: resourceScore
        },
        recommendations,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`Error testing ${testPage.name}:`, error.message);
      return {
        pageName: testPage.name,
        path: testPage.path,
        critical: testPage.critical,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  calculateCoreWebVitalsScore(metrics) {
    let score = 0;
    
    // First Contentful Paint (25%)
    if (metrics.firstContentfulPaint < 1800) score += 25;
    else if (metrics.firstContentfulPaint < 3000) score += 15;
    else if (metrics.firstContentfulPaint < 4000) score += 5;
    
    // Largest Contentful Paint (35%)
    if (metrics.largestContentfulPaint < 2500) score += 35;
    else if (metrics.largestContentfulPaint < 4000) score += 20;
    else if (metrics.largestContentfulPaint < 6000) score += 10;
    
    // Cumulative Layout Shift (25%)
    if (metrics.cumulativeLayoutShift < 0.1) score += 25;
    else if (metrics.cumulativeLayoutShift < 0.25) score += 15;
    else if (metrics.cumulativeLayoutShift < 0.5) score += 5;
    
    // DOM Content Loaded (15%)
    if (metrics.domContentLoaded < 1500) score += 15;
    else if (metrics.domContentLoaded < 3000) score += 10;
    else if (metrics.domContentLoaded < 5000) score += 5;
    
    return score;
  }

  calculateLoadingScore(metrics, navigationTime) {
    let score = 0;
    
    // Total navigation time (40%)
    if (navigationTime < 2000) score += 40;
    else if (navigationTime < 3000) score += 25;
    else if (navigationTime < 5000) score += 15;
    
    // DOM Interactive (30%)
    if (metrics.domInteractive < 1500) score += 30;
    else if (metrics.domInteractive < 3000) score += 20;
    else if (metrics.domInteractive < 5000) score += 10;
    
    // Load Complete (30%)
    if (metrics.loadComplete < 3000) score += 30;
    else if (metrics.loadComplete < 5000) score += 20;
    else if (metrics.loadComplete < 8000) score += 10;
    
    return score;
  }

  calculateResourceScore(metrics) {
    let score = 0;
    
    // Total resource size (40%)
    if (metrics.totalResourceSize < 1000) score += 40; // < 1MB
    else if (metrics.totalResourceSize < 2000) score += 30; // < 2MB
    else if (metrics.totalResourceSize < 3000) score += 20; // < 3MB
    else if (metrics.totalResourceSize < 5000) score += 10; // < 5MB
    
    // Resource count (30%)
    if (metrics.totalResources < 50) score += 30;
    else if (metrics.totalResources < 100) score += 20;
    else if (metrics.totalResources < 150) score += 10;
    
    // JavaScript size (30%)
    if (metrics.jsSize < 500) score += 30; // < 500KB
    else if (metrics.jsSize < 1000) score += 20; // < 1MB
    else if (metrics.jsSize < 2000) score += 10; // < 2MB
    
    return score;
  }

  generateOptimizationRecommendations(metrics, deviceType) {
    const recommendations = [];
    
    // Core Web Vitals optimizations
    if (metrics.firstContentfulPaint > 1800) {
      recommendations.push('Optimize First Contentful Paint - consider reducing initial payload');
    }
    
    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize Largest Contentful Paint - optimize critical images and resources');
    }
    
    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift - specify image dimensions and avoid dynamic content insertion');
    }
    
    // Resource optimizations
    if (metrics.totalResourceSize > 2000) {
      recommendations.push('Reduce total resource size - compress images and minify assets');
    }
    
    if (metrics.jsSize > 1000) {
      recommendations.push('Optimize JavaScript bundle size - implement code splitting and tree shaking');
    }
    
    if (metrics.imageSize > 1000) {
      recommendations.push('Optimize images - use modern formats (WebP/AVIF) and implement lazy loading');
    }
    
    if (metrics.totalResources > 100) {
      recommendations.push('Reduce HTTP requests - bundle assets and use sprite sheets');
    }
    
    // Device-specific optimizations
    if (deviceType === 'Mobile') {
      if (metrics.firstContentfulPaint > 1200) {
        recommendations.push('Mobile-specific: Implement critical CSS inlining for faster mobile rendering');
      }
      
      if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > 10) {
        recommendations.push('Mobile-specific: Reduce JavaScript memory usage for better mobile performance');
      }
    }
    
    return recommendations;
  }

  async testResourceOptimization(browser) {
    console.log('📦 Testing Resource Optimization...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Test homepage as it's the most resource-heavy
      await page.goto(`${TEST_URL}/`, { waitUntil: 'networkidle' });
      
      const resourceOptimization = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        
        const analysis = {
          totalResources: resources.length,
          compressedResources: 0,
          cachedResources: 0,
          duplicateResources: 0,
          resourceTypes: {
            javascript: resources.filter(r => r.name.includes('.js')).length,
            css: resources.filter(r => r.name.includes('.css')).length,
            images: resources.filter(r => r.name.match(/\\.(jpg|png|svg|webp|gif)$/i)).length,
            fonts: resources.filter(r => r.name.match(/\\.(woff|woff2|ttf|otf)$/i)).length
          }
        };
        
        // Check for compression (gzip/brotli)
        resources.forEach(resource => {
          if (resource.transferSize < resource.decodedBodySize) {
            analysis.compressedResources++;
          }
        });
        
        // Check for duplicates (same name)
        const resourceNames = resources.map(r => r.name);
        const uniqueNames = new Set(resourceNames);
        analysis.duplicateResources = resourceNames.length - uniqueNames.size;
        
        return analysis;
      });
      
      this.metrics.resourceOptimization = resourceOptimization;
      
    } finally {
      await context.close();
    }
  }

  async testCacheEffectiveness(browser) {
    console.log('🗄️ Testing Cache Effectiveness...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // First visit
      const firstVisit = Date.now();
      await page.goto(`${TEST_URL}/`, { waitUntil: 'networkidle' });
      const firstLoadTime = Date.now() - firstVisit;
      
      // Second visit (should use cache)
      const secondVisit = Date.now();
      await page.reload({ waitUntil: 'networkidle' });
      const secondLoadTime = Date.now() - secondVisit;
      
      const cacheEffectiveness = {
        firstLoadTime,
        secondLoadTime,
        improvement: Math.round(((firstLoadTime - secondLoadTime) / firstLoadTime) * 100),
        score: secondLoadTime < firstLoadTime * 0.7 ? 100 : // 30%+ improvement
               secondLoadTime < firstLoadTime * 0.8 ? 75 :  // 20%+ improvement
               secondLoadTime < firstLoadTime * 0.9 ? 50 :  // 10%+ improvement
               25
      };
      
      this.metrics.cacheEffectiveness = cacheEffectiveness;
      
    } finally {
      await context.close();
    }
  }

  async testImageOptimization(browser) {
    console.log('🖼️ Testing Image Optimization...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto(`${TEST_URL}/`, { waitUntil: 'networkidle' });
      
      const imageOptimization = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const svgs = document.querySelectorAll('svg');
        
        let optimizedImages = 0;
        let totalImageSize = 0;
        let imagesWithDimensions = 0;
        let lazyLoadedImages = 0;
        
        images.forEach(img => {
          // Check for modern formats
          if (img.src.includes('.webp') || img.src.includes('.avif')) {
            optimizedImages++;
          }
          
          // Check for dimensions (prevents CLS)
          if (img.width && img.height) {
            imagesWithDimensions++;
          }
          
          // Check for lazy loading
          if (img.loading === 'lazy') {
            lazyLoadedImages++;
          }
        });
        
        return {
          totalImages: images.length,
          totalSvgs: svgs.length,
          optimizedImages,
          imagesWithDimensions,
          lazyLoadedImages,
          optimizationScore: images.length > 0 ? 
            Math.round(((optimizedImages + imagesWithDimensions + lazyLoadedImages) / (images.length * 3)) * 100) : 
            100
        };
      });
      
      this.metrics.imageOptimization = imageOptimization;
      
    } finally {
      await context.close();
    }
  }

  generatePerformanceReport() {
    console.log('\n⚡ Performance Optimization Report');
    console.log('=' .repeat(50));
    
    // Calculate weighted overall scores
    const deviceScores = { Desktop: [], Mobile: [] };
    
    this.results.forEach(result => {
      if (result.success && result.scores) {
        deviceScores[result.deviceType].push({
          score: result.scores.overall,
          weight: result.weight
        });
      }
    });
    
    const calculateWeightedAverage = (scores) => {
      const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
      const weightedSum = scores.reduce((sum, item) => sum + (item.score * item.weight), 0);
      return totalWeight > 0 ? weightedSum / totalWeight : 0;
    };
    
    const desktopScore = calculateWeightedAverage(deviceScores.Desktop);
    const mobileScore = calculateWeightedAverage(deviceScores.Mobile);
    const overallScore = (desktopScore + mobileScore) / 2;
    
    console.log(`\n📊 Overall Performance Score: ${overallScore.toFixed(1)}%`);
    console.log(`🖥️ Desktop Performance: ${desktopScore.toFixed(1)}%`);
    console.log(`📱 Mobile Performance: ${mobileScore.toFixed(1)}%`);
    
    // Core Web Vitals Summary
    console.log('\n🎯 Core Web Vitals Summary:');
    
    const coreWebVitals = this.results
      .filter(r => r.success && r.performanceMetrics)
      .map(r => ({
        device: r.deviceType,
        page: r.pageName,
        fcp: r.performanceMetrics.firstContentfulPaint,
        lcp: r.performanceMetrics.largestContentfulPaint,
        cls: r.performanceMetrics.cumulativeLayoutShift
      }));
    
    if (coreWebVitals.length > 0) {
      const avgFCP = coreWebVitals.reduce((sum, v) => sum + v.fcp, 0) / coreWebVitals.length;
      const avgLCP = coreWebVitals.reduce((sum, v) => sum + v.lcp, 0) / coreWebVitals.length;
      const avgCLS = coreWebVitals.reduce((sum, v) => sum + v.cls, 0) / coreWebVitals.length;
      
      console.log(`  First Contentful Paint: ${Math.round(avgFCP)}ms ${avgFCP <= 1800 ? '✅' : avgFCP <= 3000 ? '⚠️' : '❌'}`);
      console.log(`  Largest Contentful Paint: ${Math.round(avgLCP)}ms ${avgLCP <= 2500 ? '✅' : avgLCP <= 4000 ? '⚠️' : '❌'}`);
      console.log(`  Cumulative Layout Shift: ${avgCLS.toFixed(3)} ${avgCLS <= 0.1 ? '✅' : avgCLS <= 0.25 ? '⚠️' : '❌'}`);
    }
    
    // Resource optimization summary
    if (this.metrics.resourceOptimization) {
      const ro = this.metrics.resourceOptimization;
      console.log('\n📦 Resource Optimization:');
      console.log(`  Total Resources: ${ro.totalResources}`);
      console.log(`  Compressed: ${ro.compressedResources}/${ro.totalResources} (${Math.round((ro.compressedResources/ro.totalResources)*100)}%)`);
      console.log(`  JavaScript: ${ro.resourceTypes.javascript}, CSS: ${ro.resourceTypes.css}, Images: ${ro.resourceTypes.images}`);
    }
    
    // Cache effectiveness
    if (this.metrics.cacheEffectiveness) {
      const ce = this.metrics.cacheEffectiveness;
      console.log(`\n🗄️ Cache Effectiveness: ${ce.improvement}% improvement on repeat visits (Score: ${ce.score}%)`);
    }
    
    // Image optimization
    if (this.metrics.imageOptimization) {
      const io = this.metrics.imageOptimization;
      console.log(`\n🖼️ Image Optimization Score: ${io.optimizationScore}% (${io.optimizedImages}/${io.totalImages} optimized)`);
    }
    
    // Page-by-page breakdown
    console.log('\n📋 Page Performance Breakdown:');
    const pageGroups = {};
    this.results.forEach(result => {
      if (!pageGroups[result.pageName]) pageGroups[result.pageName] = {};
      pageGroups[result.pageName][result.deviceType] = result;
    });
    
    Object.entries(pageGroups).forEach(([pageName, devices]) => {
      console.log(`\n  ${pageName}:`);
      Object.entries(devices).forEach(([deviceType, result]) => {
        if (result.success) {
          const score = result.scores.overall;
          const icon = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌';
          console.log(`    ${icon} ${deviceType}: ${score}% (${result.navigationTime}ms load)`);
          
          if (result.recommendations.length > 0) {
            console.log(`      Recommendations: ${result.recommendations.slice(0, 2).join(', ')}`);
          }
        }
      });
    });
    
    // Overall recommendations
    const allRecommendations = this.results
      .filter(r => r.recommendations)
      .flatMap(r => r.recommendations);
    
    const commonRecommendations = [...new Set(allRecommendations)]
      .map(rec => ({ rec, count: allRecommendations.filter(r => r === rec).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    if (commonRecommendations.length > 0) {
      console.log('\n🔧 Top Performance Recommendations:');
      commonRecommendations.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.rec}`);
      });
    }
    
    // Performance readiness assessment
    const isPerformanceReady = overallScore >= 75 && desktopScore >= 80 && mobileScore >= 70;
    console.log(`\n🏆 Performance Readiness: ${isPerformanceReady ? '✅ READY' : '⚠️ NEEDS OPTIMIZATION'}`);
    
    // Save detailed report
    const report = {
      summary: {
        overallScore: parseFloat(overallScore.toFixed(1)),
        desktopScore: parseFloat(desktopScore.toFixed(1)),
        mobileScore: parseFloat(mobileScore.toFixed(1)),
        isPerformanceReady,
        timestamp: new Date().toISOString()
      },
      coreWebVitals,
      results: this.results,
      metrics: this.metrics,
      recommendations: commonRecommendations
    };
    
    fs.writeFileSync('performance-optimization-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed performance report saved to: performance-optimization-report.json');
    console.log('\n🎉 Performance testing completed!');
    
    return report;
  }
}

// Run performance tests
async function main() {
  const tester = new PerformanceTester();
  await tester.runPerformanceTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceTester;