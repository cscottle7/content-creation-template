const { test, expect, devices } = require('@playwright/test');

// Define the base URL
const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';

// Define key pages to test
const PAGES = [
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

// Browser configurations
const BROWSERS = [
  { name: 'Chromium', device: null },
  { name: 'Firefox', device: null },
  { name: 'WebKit', device: null },
  { name: 'Mobile Chrome', device: devices['Pixel 5'] },
  { name: 'Mobile Safari', device: devices['iPhone 12'] },
  { name: 'Tablet', device: devices['iPad Pro'] }
];

BROWSERS.forEach(browser => {
  test.describe(`Cross-browser compatibility - ${browser.name}`, () => {
    test.beforeEach(async ({ page, browserName }) => {
      // Skip non-matching browsers for device-specific tests
      if (browser.name === 'Mobile Chrome' && browserName !== 'chromium') {
        test.skip(true, `Skipping ${browser.name} test on ${browserName}`);
      }
      if (browser.name === 'Mobile Safari' && browserName !== 'webkit') {
        test.skip(true, `Skipping ${browser.name} test on ${browserName}`);
      }
      if (browser.name === 'Firefox' && browserName !== 'firefox') {
        test.skip(true, `Skipping Firefox test on ${browserName}`);
      }
      if (browser.name === 'WebKit' && browserName !== 'webkit') {
        test.skip(true, `Skipping WebKit test on ${browserName}`);
      }
      if (browser.name === 'Chromium' && browserName !== 'chromium') {
        test.skip(true, `Skipping Chromium test on ${browserName}`);
      }
    });

    PAGES.forEach(pageInfo => {
      test(`${pageInfo.name} page loads correctly`, async ({ page, browserName }) => {
        // Set viewport for device-specific tests
        if (browser.device) {
          await page.setViewportSize(browser.device.viewport);
        }

        // Navigate to the page
        await page.goto(`${BASE_URL}${pageInfo.url}`);

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that the page loaded successfully
        await expect(page).toHaveTitle(new RegExp('.+'));

        // Take a screenshot for visual comparison
        await page.screenshot({
          path: `tests/screenshots/${browser.name.replace(/\s+/g, '-').toLowerCase()}-${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}.png`,
          fullPage: true
        });

        // Check for console errors
        const logs = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            logs.push(msg.text());
          }
        });

        // Verify no critical console errors
        expect(logs.filter(log => 
          !log.includes('Failed to load resource') && 
          !log.includes('favicon.ico') &&
          !log.includes('metadataBase')
        )).toHaveLength(0);

        // Check header navigation is visible
        await expect(page.locator('header nav')).toBeVisible();

        // Check footer is visible
        await expect(page.locator('footer')).toBeVisible();

        // Test responsive design for mobile devices
        if (browser.device && browser.device.viewport.width < 768) {
          // Check mobile menu button is visible
          const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
          if (await mobileMenuButton.count() > 0) {
            await expect(mobileMenuButton).toBeVisible();
          }
        }

        // Test key interactive elements
        if (pageInfo.url === '/') {
          // Homepage specific tests
          await expect(page.locator('text=Start Free Trial, text=Get Started')).toBeVisible();
        } else if (pageInfo.url === '/contact') {
          // Contact page specific tests
          await expect(page.locator('form')).toBeVisible();
          await expect(page.locator('input[type="email"]')).toBeVisible();
        } else if (pageInfo.url.includes('/lead-magnets/')) {
          // Lead magnet page specific tests
          await expect(page.locator('form')).toBeVisible();
          await expect(page.locator('input[type="email"]')).toBeVisible();
        }
      });
    });

    // Test form functionality on different browsers
    test(`Contact form works correctly`, async ({ page }) => {
      if (browser.device) {
        await page.setViewportSize(browser.device.viewport);
      }

      await page.goto(`${BASE_URL}/contact`);
      await page.waitForLoadState('networkidle');

      // Fill out the contact form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="company"]', 'Test Company');
      await page.fill('textarea[name="message"]', 'This is a test message from cross-browser testing.');

      // Check that form validation works
      await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
      await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    });

    // Test lead magnet form functionality
    test(`Lead magnet form works correctly`, async ({ page }) => {
      if (browser.device) {
        await page.setViewportSize(browser.device.viewport);
      }

      await page.goto(`${BASE_URL}/lead-magnets/smb-content-guide`);
      await page.waitForLoadState('networkidle');

      // Fill out the lead magnet form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="company"]', 'Test Company');

      // Check that form validation works
      await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
      await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    });

    // Test navigation functionality
    test(`Navigation works correctly`, async ({ page }) => {
      if (browser.device) {
        await page.setViewportSize(browser.device.viewport);
      }

      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('networkidle');

      // Test desktop navigation
      if (!browser.device || browser.device.viewport.width >= 768) {
        // Click on About link
        await page.click('text=About');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp('/about'));

        // Go back to homepage
        await page.goto(`${BASE_URL}/`);
        await page.waitForLoadState('networkidle');

        // Click on Solutions link and test dropdown/navigation
        const solutionsLink = page.locator('text=Solutions');
        if (await solutionsLink.count() > 0) {
          await solutionsLink.click();
          await page.waitForTimeout(500); // Wait for dropdown animation
        }
      } else {
        // Test mobile navigation
        const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
        if (await mobileMenuButton.count() > 0) {
          await mobileMenuButton.click();
          await page.waitForTimeout(500); // Wait for menu animation
          
          // Check if mobile menu is now visible
          const mobileMenu = page.locator('nav .md\\:hidden, nav .lg\\:hidden, [role="dialog"]');
          if (await mobileMenu.count() > 0) {
            await expect(mobileMenu).toBeVisible();
          }
        }
      }
    });
  });
});

// Performance tests across browsers
test.describe('Performance across browsers', () => {
  test('Homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Homepage load time: ${loadTime}ms`);
  });

  test('Core Web Vitals are within acceptable ranges', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = (vitals.cls || 0) + entry.value;
            }
          });
          
          // Resolve after a short timeout to collect metrics
          setTimeout(() => resolve(vitals), 1000);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });

    console.log('Core Web Vitals:', vitals);

    // LCP should be under 2.5 seconds
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }

    // FID should be under 100ms
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(100);
    }

    // CLS should be under 0.1
    if (vitals.cls) {
      expect(vitals.cls).toBeLessThan(0.1);
    }
  });
});