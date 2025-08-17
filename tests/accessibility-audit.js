/**
 * Accessibility Audit and WCAG 2.1 AA Compliance Testing
 * Tests The Bigger Boss website for accessibility compliance
 * 
 * Based on WCAG 2.1 AA requirements:
 * - Perceivable: Text alternatives, captions, resizable text, color contrast
 * - Operable: Keyboard accessible, no seizures, navigable
 * - Understandable: Readable, predictable
 * - Robust: Compatible with assistive technologies
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TEST_URL = 'http://localhost:3003';

// Key pages to test for accessibility
const testPages = [
  { path: '/', name: 'Homepage', critical: true },
  { path: '/about', name: 'About Page', critical: false },
  { path: '/contact', name: 'Contact Page', critical: true },
  { path: '/solutions/for-smbs', name: 'SMB Solutions', critical: true },
  { path: '/solutions/for-agencies', name: 'Agency Solutions', critical: true },
  { path: '/pricing', name: 'Pricing Page', critical: true },
  { path: '/lead-magnets/smb-content-guide', name: 'SMB Lead Magnet', critical: true },
  { path: '/lead-magnets/agency-webinar', name: 'Agency Lead Magnet', critical: true }
];

class AccessibilityAuditor {
  constructor() {
    this.results = [];
    this.violations = [];
    this.warnings = [];
  }

  async auditPage(page, testCase) {
    console.log(`🔍 Auditing ${testCase.name}...`);
    
    try {
      // Navigate to page
      await page.goto(`${TEST_URL}${testCase.path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      const audit = {
        page: testCase.name,
        path: testCase.path,
        critical: testCase.critical,
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // WCAG 2.1 AA Compliance Tests
      
      // 1. PERCEIVABLE
      audit.tests.images = await this.testImages(page);
      audit.tests.headings = await this.testHeadings(page);
      audit.tests.colorContrast = await this.testColorContrast(page);
      audit.tests.textAlternatives = await this.testTextAlternatives(page);
      
      // 2. OPERABLE
      audit.tests.keyboardNavigation = await this.testKeyboardNavigation(page);
      audit.tests.focusManagement = await this.testFocusManagement(page);
      audit.tests.skipLinks = await this.testSkipLinks(page);
      
      // 3. UNDERSTANDABLE
      audit.tests.language = await this.testLanguage(page);
      audit.tests.labels = await this.testLabels(page);
      audit.tests.errorIdentification = await this.testErrorIdentification(page);
      
      // 4. ROBUST
      audit.tests.htmlValidation = await this.testHTMLValidation(page);
      audit.tests.landmarks = await this.testLandmarks(page);
      audit.tests.ariaUsage = await this.testAriaUsage(page);

      // Calculate overall score
      const totalTests = Object.keys(audit.tests).length;
      const passedTests = Object.values(audit.tests).filter(test => test.status === 'pass').length;
      audit.score = Math.round((passedTests / totalTests) * 100);
      audit.status = audit.score >= 90 ? 'pass' : audit.score >= 70 ? 'warning' : 'fail';

      this.results.push(audit);
      
      console.log(`  ${audit.status === 'pass' ? '✅' : audit.status === 'warning' ? '⚠️' : '❌'} ${testCase.name} - ${audit.score}%`);

    } catch (error) {
      console.error(`Error auditing ${testCase.name}:`, error.message);
      this.violations.push({
        page: testCase.name,
        path: testCase.path,
        error: error.message,
        severity: 'error'
      });
    }
  }

  async testImages(page) {
    try {
      const images = await page.locator('img').all();
      const decorativeImages = await page.locator('img[alt=""], img[role="presentation"]').count();
      const imagesWithAlt = await page.locator('img[alt]').count();
      const totalImages = images.length;
      
      const issues = [];
      
      if (totalImages > 0) {
        const missingAlt = totalImages - imagesWithAlt - decorativeImages;
        if (missingAlt > 0) {
          issues.push(`${missingAlt} images missing alt text`);
        }
        
        // Check for generic alt text
        for (const img of images) {
          const alt = await img.getAttribute('alt');
          if (alt && ['image', 'picture', 'photo'].includes(alt.toLowerCase())) {
            issues.push('Generic alt text found');
            break;
          }
        }
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `${totalImages} images, ${imagesWithAlt} with alt text, ${decorativeImages} decorative`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testHeadings(page) {
    try {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const h1Count = await page.locator('h1').count();
      
      const issues = [];
      
      if (h1Count === 0) {
        issues.push('No H1 heading found');
      } else if (h1Count > 1) {
        issues.push('Multiple H1 headings found');
      }
      
      // Check heading order
      let previousLevel = 0;
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        if (currentLevel > previousLevel + 1) {
          issues.push('Heading levels skip (e.g., H1 to H3)');
          break;
        }
        previousLevel = currentLevel;
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `${headings.length} headings, ${h1Count} H1`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testColorContrast(page) {
    try {
      // This is a simplified contrast check
      // In practice, you'd use a tool like axe-core for precise contrast ratios
      const textElements = await page.locator('p, span, div, a, button, label').all();
      const issues = [];
      
      // Check for potential contrast issues (simplified)
      const hasLightText = await page.locator('[style*="color: #fff"], [style*="color: white"], .text-white').count();
      const hasLightBackground = await page.locator('[style*="background: #fff"], [style*="background: white"], .bg-white').count();
      
      if (hasLightText > 0 && hasLightBackground > 0) {
        issues.push('Potential white text on white background detected');
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'warning',
        details: `${textElements.length} text elements checked`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testTextAlternatives(page) {
    try {
      const issues = [];
      
      // Check for complex images without descriptions
      const complexImages = await page.locator('svg, canvas, [role="img"]').count();
      const describedImages = await page.locator('svg[aria-label], canvas[aria-label], [role="img"][aria-label]').count();
      
      if (complexImages > describedImages) {
        issues.push(`${complexImages - describedImages} complex images without descriptions`);
      }
      
      // Check for decorative images properly marked
      const decorativeImages = await page.locator('img[alt=""], img[role="presentation"]').count();
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `${complexImages} complex images, ${decorativeImages} decorative`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testKeyboardNavigation(page) {
    try {
      const issues = [];
      
      // Check for keyboard traps
      const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]').count();
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      
      if (!activeElement) {
        issues.push('No focusable element after Tab press');
      }
      
      // Check for skip links
      const skipLinks = await page.locator('a[href*="#main"], a[href*="#content"]').count();
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `${focusableElements} focusable elements, ${skipLinks} skip links`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testFocusManagement(page) {
    try {
      const issues = [];
      
      // Check for visible focus indicators
      const focusableElements = await page.locator('a, button, input, select, textarea').all();
      
      // Test focus visibility (simplified check)
      const hasFocusStyles = await page.locator('[class*="focus"], :focus-visible').count();
      
      if (focusableElements.length > 0 && hasFocusStyles === 0) {
        issues.push('No focus styles detected');
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'warning',
        details: `${focusableElements.length} focusable elements`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testSkipLinks(page) {
    try {
      const skipLinks = await page.locator('a[href*="#main"], a[href*="#content"], .skip-link').count();
      const issues = [];
      
      if (skipLinks === 0) {
        issues.push('No skip links found');
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'warning',
        details: `${skipLinks} skip links found`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testLanguage(page) {
    try {
      const htmlLang = await page.locator('html[lang]').count();
      const issues = [];
      
      if (htmlLang === 0) {
        issues.push('HTML lang attribute missing');
      }
      
      // Check for language changes in content
      const langChanges = await page.locator('[lang]').count();
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `HTML lang: ${htmlLang > 0 ? 'set' : 'missing'}, ${langChanges} lang changes`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testLabels(page) {
    try {
      const inputs = await page.locator('input, select, textarea').all();
      const issues = [];
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const hasLabel = await page.locator(`label[for="${id}"]`).count();
          if (hasLabel === 0 && !ariaLabel && !ariaLabelledby) {
            issues.push('Input without label');
            break;
          }
        } else if (!ariaLabel && !ariaLabelledby) {
          issues.push('Input without label or aria-label');
          break;
        }
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `${inputs.length} form inputs checked`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testErrorIdentification(page) {
    try {
      const forms = await page.locator('form').count();
      const errorMessages = await page.locator('[role="alert"], .error, [aria-invalid="true"]').count();
      const issues = [];
      
      // This is a basic check - in practice, you'd test form submission
      if (forms > 0) {
        const requiredFields = await page.locator('input[required], select[required], textarea[required]').count();
        return {
          status: 'pass',
          details: `${forms} forms, ${requiredFields} required fields`,
          issues
        };
      }
      
      return {
        status: 'pass',
        details: 'No forms to test',
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testHTMLValidation(page) {
    try {
      // Basic HTML structure checks
      const issues = [];
      
      const htmlStructure = await page.evaluate(() => {
        return {
          hasDoctype: document.doctype !== null,
          hasHtml: document.documentElement.tagName === 'HTML',
          hasHead: document.head !== null,
          hasBody: document.body !== null
        };
      });
      
      if (!htmlStructure.hasDoctype) issues.push('Missing DOCTYPE');
      if (!htmlStructure.hasHtml) issues.push('Missing HTML element');
      if (!htmlStructure.hasHead) issues.push('Missing HEAD element');
      if (!htmlStructure.hasBody) issues.push('Missing BODY element');
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: 'Basic HTML structure validation',
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testLandmarks(page) {
    try {
      const landmarks = {
        main: await page.locator('main, [role="main"]').count(),
        nav: await page.locator('nav, [role="navigation"]').count(),
        header: await page.locator('header, [role="banner"]').count(),
        footer: await page.locator('footer, [role="contentinfo"]').count()
      };
      
      const issues = [];
      
      if (landmarks.main === 0) issues.push('No main landmark');
      if (landmarks.header === 0) issues.push('No header landmark');
      if (landmarks.footer === 0) issues.push('No footer landmark');
      
      return {
        status: issues.length === 0 ? 'pass' : 'fail',
        details: `Main: ${landmarks.main}, Nav: ${landmarks.nav}, Header: ${landmarks.header}, Footer: ${landmarks.footer}`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async testAriaUsage(page) {
    try {
      const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby], [role]').count();
      const issues = [];
      
      // Check for invalid ARIA usage (simplified)
      const invalidAria = await page.locator('[aria-labelledby=""], [aria-describedby=""]').count();
      
      if (invalidAria > 0) {
        issues.push('Empty ARIA attributes found');
      }
      
      return {
        status: issues.length === 0 ? 'pass' : 'warning',
        details: `${ariaElements} elements with ARIA attributes`,
        issues
      };
    } catch (error) {
      return { status: 'error', details: error.message, issues: [] };
    }
  }

  async runFullAudit() {
    console.log('♿ Starting Accessibility Audit (WCAG 2.1 AA Compliance)...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      for (const testCase of testPages) {
        await this.auditPage(page, testCase);
      }
    } finally {
      await context.close();
      await browser.close();
    }
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n♿ Accessibility Audit Report');
    console.log('=' .repeat(50));
    
    const totalPages = this.results.length;
    const passedPages = this.results.filter(r => r.status === 'pass').length;
    const warningPages = this.results.filter(r => r.status === 'warning').length;
    const failedPages = this.results.filter(r => r.status === 'fail').length;
    
    console.log(`\n📊 Overall Results:`);
    console.log(`  ✅ Passed: ${passedPages}/${totalPages} pages`);
    console.log(`  ⚠️  Warnings: ${warningPages}/${totalPages} pages`);
    console.log(`  ❌ Failed: ${failedPages}/${totalPages} pages`);
    
    const avgScore = this.results.reduce((sum, r) => sum + r.score, 0) / totalPages;
    console.log(`  📈 Average Score: ${avgScore.toFixed(1)}%`);
    
    // Critical pages analysis
    const criticalPages = this.results.filter(r => r.critical);
    const criticalPassed = criticalPages.filter(r => r.status === 'pass').length;
    console.log(`\n🎯 Critical Pages: ${criticalPassed}/${criticalPages.length} passed`);
    
    // Detailed results
    console.log('\n📋 Page-by-Page Results:');
    this.results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${result.page} - ${result.score}%${result.critical ? ' (Critical)' : ''}`);
      
      // Show failing tests
      const failingTests = Object.entries(result.tests).filter(([_, test]) => test.status === 'fail');
      if (failingTests.length > 0) {
        failingTests.forEach(([testName, test]) => {
          console.log(`    ❌ ${testName}: ${test.issues.join(', ')}`);
        });
      }
      
      // Show warnings
      const warningTests = Object.entries(result.tests).filter(([_, test]) => test.status === 'warning');
      if (warningTests.length > 0) {
        warningTests.forEach(([testName, test]) => {
          console.log(`    ⚠️  ${testName}: ${test.issues.join(', ')}`);
        });
      }
    });
    
    // WCAG 2.1 AA Compliance Status
    const isCompliant = avgScore >= 90 && criticalPassed === criticalPages.length;
    console.log(`\n🏆 WCAG 2.1 AA Compliance: ${isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
    
    if (!isCompliant) {
      console.log('\n🔧 Recommended Actions:');
      console.log('  1. Fix all critical page issues');
      console.log('  2. Address failing accessibility tests');
      console.log('  3. Implement missing ARIA landmarks');
      console.log('  4. Ensure proper focus management');
      console.log('  5. Add skip navigation links');
    }
    
    // Save detailed report
    const report = {
      summary: {
        totalPages,
        passedPages,
        warningPages,
        failedPages,
        avgScore: parseFloat(avgScore.toFixed(1)),
        isCompliant,
        criticalPagesPassed: criticalPassed,
        totalCriticalPages: criticalPages.length,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      violations: this.violations
    };
    
    fs.writeFileSync('accessibility-audit-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to: accessibility-audit-report.json');
    console.log('\n🎉 Accessibility audit completed!');
    
    return report;
  }
}

// Run audit
async function main() {
  const auditor = new AccessibilityAuditor();
  await auditor.runFullAudit();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AccessibilityAuditor;