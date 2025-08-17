const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Define the base URL
const BASE_URL = 'http://localhost:3005';

// Key pages to test for accessibility
const PAGES_TO_TEST = [
  { name: 'Homepage', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
  { name: 'Pricing', url: '/pricing' },
  { name: 'SMB Solutions', url: '/solutions/for-smbs' },
  { name: 'Agency Solutions', url: '/solutions/for-agencies' },
  { name: 'SMB Lead Magnet', url: '/lead-magnets/smb-content-guide' },
  { name: 'Agency Lead Magnet', url: '/lead-magnets/agency-webinar' },
  { name: 'Resources', url: '/resources' }
];

test.describe('Accessibility Audit', () => {
  // Set timeout for accessibility tests
  test.setTimeout(45000);

  PAGES_TO_TEST.forEach(pageInfo => {
    test(`${pageInfo.name} page meets WCAG 2.1 AA standards`, async ({ page }) => {
      try {
        console.log(`\\nTesting accessibility for: ${pageInfo.name}`);
        
        // Navigate to the page
        await page.goto(`${BASE_URL}${pageInfo.url}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });

        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Run accessibility audit
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        // Log results
        console.log(`✓ Accessibility scan completed for ${pageInfo.name}`);
        console.log(`  - ${accessibilityScanResults.passes.length} accessibility checks passed`);
        
        if (accessibilityScanResults.violations.length > 0) {
          console.log(`  - ${accessibilityScanResults.violations.length} accessibility violations found:`);
          
          accessibilityScanResults.violations.forEach((violation, index) => {
            console.log(`    ${index + 1}. ${violation.id}: ${violation.description}`);
            console.log(`       Impact: ${violation.impact}`);
            console.log(`       Help: ${violation.helpUrl}`);
            console.log(`       Elements affected: ${violation.nodes.length}`);
          });
        }

        // Assert no violations for WCAG 2.1 AA compliance
        expect(accessibilityScanResults.violations).toEqual([]);

      } catch (error) {
        console.error(`\\n✗ Accessibility test failed for ${pageInfo.name}:`, error.message);
        throw error;
      }
    });
  });

  test('Keyboard navigation functionality', async ({ page }) => {
    console.log('\\nTesting keyboard navigation...');
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Test Tab navigation through interactive elements
    const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    
    console.log(`Found ${focusableElements.length} focusable elements`);

    // Test that we can tab through at least some elements
    if (focusableElements.length > 0) {
      // Focus on the first element
      await page.keyboard.press('Tab');
      
      // Check that focus is visible (this is a basic test)
      const focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();
      
      console.log('✓ Keyboard navigation is working');
    }
  });

  test('Screen reader compatibility - ARIA labels and landmarks', async ({ page }) => {
    console.log('\\nTesting screen reader compatibility...');
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check for proper ARIA landmarks
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    console.log('✓ Main landmark found');

    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
    console.log('✓ Navigation landmark found');

    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    console.log('✓ H1 heading found');

    // Check that images have alt text
    const images = await page.locator('img').all();
    let imagesWithoutAlt = 0;
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt === null || alt === '') {
        imagesWithoutAlt++;
      }
    }
    
    console.log(`Images checked: ${images.length}, without alt text: ${imagesWithoutAlt}`);
    
    // Allow some decorative images to not have alt text, but most should
    if (images.length > 0) {
      expect(imagesWithoutAlt / images.length).toBeLessThan(0.3); // Less than 30% without alt
    }
  });

  test('Color contrast and visual accessibility', async ({ page }) => {
    console.log('\\nTesting color contrast...');
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Run axe specifically for color contrast
    const colorContrastResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    console.log(`Color contrast checks: ${colorContrastResults.passes.length} passed`);
    
    if (colorContrastResults.violations.length > 0) {
      console.log(`Color contrast violations: ${colorContrastResults.violations.length}`);
      colorContrastResults.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. ${violation.id}: ${violation.description}`);
      });
    }

    // Assert no color contrast violations
    expect(colorContrastResults.violations).toEqual([]);
  });

  test('Form accessibility', async ({ page }) => {
    console.log('\\nTesting form accessibility...');
    
    await page.goto(`${BASE_URL}/contact`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check that form inputs have proper labels
    const inputs = await page.locator('input, textarea, select').all();
    let inputsWithoutLabels = 0;
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Check if there's a label element for this input
      let hasLabel = false;
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }
      
      // Input should have either a label, aria-label, or aria-labelledby
      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        inputsWithoutLabels++;
      }
    }
    
    console.log(`Form inputs checked: ${inputs.length}, without proper labels: ${inputsWithoutLabels}`);
    
    // All form inputs should have proper labels
    expect(inputsWithoutLabels).toBe(0);
    
    // Run axe specifically for forms
    const formResults = await new AxeBuilder({ page })
      .withTags(['cat.forms'])
      .analyze();

    console.log(`Form accessibility checks: ${formResults.passes.length} passed`);
    
    if (formResults.violations.length > 0) {
      console.log(`Form accessibility violations: ${formResults.violations.length}`);
      formResults.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. ${violation.id}: ${violation.description}`);
      });
    }

    expect(formResults.violations).toEqual([]);
  });

  test('Mobile accessibility', async ({ page }) => {
    console.log('\\nTesting mobile accessibility...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Run accessibility audit on mobile
    const mobileResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    console.log(`Mobile accessibility checks: ${mobileResults.passes.length} passed`);
    
    if (mobileResults.violations.length > 0) {
      console.log(`Mobile accessibility violations: ${mobileResults.violations.length}`);
      mobileResults.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. ${violation.id}: ${violation.description}`);
      });
    }

    // Check touch target sizes (minimum 44x44 pixels recommended)
    const buttons = await page.locator('button, a').all();
    let smallTouchTargets = 0;
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        smallTouchTargets++;
      }
    }
    
    console.log(`Touch targets checked: ${buttons.length}, below 44px: ${smallTouchTargets}`);
    
    // Allow some small touch targets but most should meet the guideline
    if (buttons.length > 0) {
      expect(smallTouchTargets / buttons.length).toBeLessThan(0.2); // Less than 20% small
    }

    expect(mobileResults.violations).toEqual([]);
  });
});