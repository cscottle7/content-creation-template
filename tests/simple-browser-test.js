const { test, expect } = require('@playwright/test');

// Define the base URL for the new port
const BASE_URL = 'http://localhost:3005';

// Key pages to test
const CRITICAL_PAGES = [
  { name: 'Homepage', url: '/', timeout: 10000 },
  { name: 'About', url: '/about', timeout: 10000 },
  { name: 'Contact', url: '/contact', timeout: 10000 },
  { name: 'SMB Solutions', url: '/solutions/for-smbs', timeout: 10000 },
  { name: 'Agency Solutions', url: '/solutions/for-agencies', timeout: 10000 }
];

test.describe('Critical Cross-Browser Compatibility', () => {
  // Increase timeout for all tests
  test.setTimeout(30000);

  CRITICAL_PAGES.forEach(pageInfo => {
    test(`${pageInfo.name} page loads and renders correctly`, async ({ page }) => {
      // Set a reasonable timeout
      page.setDefaultTimeout(pageInfo.timeout);
      
      try {
        // Navigate to the page
        console.log(`Testing ${pageInfo.name} at ${BASE_URL}${pageInfo.url}`);
        await page.goto(`${BASE_URL}${pageInfo.url}`, { 
          waitUntil: 'domcontentloaded',
          timeout: pageInfo.timeout 
        });

        // Wait for the page to be ready
        await page.waitForLoadState('domcontentloaded');

        // Check that the page has a title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
        console.log(`✓ ${pageInfo.name} title: ${title}`);

        // Check header is visible
        const header = page.locator('header');
        await expect(header).toBeVisible({ timeout: 5000 });
        console.log(`✓ ${pageInfo.name} header is visible`);

        // Check navigation is present
        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 5000 });
        console.log(`✓ ${pageInfo.name} navigation is visible`);

        // Take a screenshot for visual verification
        await page.screenshot({
          path: `tests/screenshots/${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}-basic.png`,
          fullPage: false // Only capture viewport to speed up
        });
        console.log(`✓ ${pageInfo.name} screenshot taken`);

        // Test specific page elements
        if (pageInfo.url === '/contact') {
          const form = page.locator('form');
          await expect(form).toBeVisible({ timeout: 5000 });
          console.log(`✓ Contact form is visible`);
        }

        if (pageInfo.url.includes('/solutions/')) {
          const ctaButton = page.locator('button, a').filter({ hasText: /start|trial|get started/i }).first();
          if (await ctaButton.count() > 0) {
            await expect(ctaButton).toBeVisible({ timeout: 5000 });
            console.log(`✓ CTA button found on ${pageInfo.name}`);
          }
        }

      } catch (error) {
        console.error(`✗ Error testing ${pageInfo.name}:`, error.message);
        
        // Take a screenshot of the error state
        try {
          await page.screenshot({
            path: `tests/screenshots/${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}-error.png`,
            fullPage: false
          });
        } catch (screenshotError) {
          console.error('Could not take error screenshot:', screenshotError.message);
        }
        
        throw error;
      }
    });
  });

  test('Basic navigation functionality', async ({ page }) => {
    page.setDefaultTimeout(10000);
    
    try {
      console.log('Testing basic navigation...');
      await page.goto(`${BASE_URL}/`, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });

      // Test clicking on About link
      const aboutLink = page.locator('a[href="/about"], a').filter({ hasText: 'About' }).first();
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForURL('**/about', { timeout: 5000 });
        console.log('✓ Navigation to About page works');
        
        // Verify we're on the about page
        const title = await page.title();
        expect(title.toLowerCase()).toContain('about');
      }

    } catch (error) {
      console.error('✗ Navigation test failed:', error.message);
      throw error;
    }
  });

  test('Performance baseline check', async ({ page }) => {
    page.setDefaultTimeout(15000);
    
    console.log('Testing homepage performance...');
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`Homepage load time: ${loadTime}ms`);
    
    // Homepage should load within 5 seconds for basic functionality
    expect(loadTime).toBeLessThan(5000);
  });

  test('Mobile responsiveness check', async ({ page }) => {
    page.setDefaultTimeout(10000);
    
    console.log('Testing mobile responsiveness...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    // Check that header is still visible on mobile
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 5000 });
    
    // Take mobile screenshot
    await page.screenshot({
      path: 'tests/screenshots/homepage-mobile-basic.png',
      fullPage: false
    });
    
    console.log('✓ Mobile layout verified');
  });
});