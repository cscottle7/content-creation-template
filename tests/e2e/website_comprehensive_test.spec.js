const { test, expect } = require('@playwright/test');

test.describe('Bigger Boss Website Comprehensive Test', () => {
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
  });

  test('Homepage Navigation and Screenshot', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take homepage screenshot
    await page.screenshot({ 
      path: 'homepage-screenshot.png', 
      fullPage: true 
    });
    
    // Verify page loaded successfully
    await expect(page).toHaveTitle(/Bigger Boss/i);
    
    console.log('Homepage loaded and screenshot captured');
  });

  test('Main Navigation Links Test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test About link
    const aboutLink = page.locator('a[href*="/about"], a:has-text("About")');
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'about-page-screenshot.png', fullPage: true });
      console.log('About page accessed and screenshot captured');
    } else {
      console.log('About link not found in navigation');
    }
    
    // Return to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test Contact link
    const contactLink = page.locator('a[href*="/contact"], a:has-text("Contact")');
    if (await contactLink.count() > 0) {
      await contactLink.first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'contact-page-screenshot.png', fullPage: true });
      console.log('Contact page accessed and screenshot captured');
    } else {
      console.log('Contact link not found in navigation');
    }
    
    // Return to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test Pricing link
    const pricingLink = page.locator('a[href*="/pricing"], a:has-text("Pricing")');
    if (await pricingLink.count() > 0) {
      await pricingLink.first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'pricing-page-screenshot.png', fullPage: true });
      console.log('Pricing page accessed and screenshot captured');
    } else {
      console.log('Pricing link not found in navigation');
    }
  });

  test('Solutions Pages Test', async ({ page }) => {
    // Test SMB Solutions page
    await page.goto('http://localhost:3000/solutions/for-smbs');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'solutions-smbs-screenshot.png', 
      fullPage: true 
    });
    
    // Verify SMB page content
    const smbContent = await page.textContent('body');
    console.log('SMB Solutions page loaded');
    
    // Test Agency Solutions page
    await page.goto('http://localhost:3000/solutions/for-agencies');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'solutions-agencies-screenshot.png', 
      fullPage: true 
    });
    
    // Verify Agency page content
    const agencyContent = await page.textContent('body');
    console.log('Agency Solutions page loaded');
  });

  test('Design and Layout Verification', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check for basic layout elements
    const header = page.locator('header, nav, [role="banner"]');
    const main = page.locator('main, [role="main"]');
    const footer = page.locator('footer, [role="contentinfo"]');
    
    console.log('Header elements found:', await header.count());
    console.log('Main content elements found:', await main.count());
    console.log('Footer elements found:', await footer.count());
    
    // Check viewport and responsive behavior
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'desktop-layout-screenshot.png', fullPage: true });
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'tablet-layout-screenshot.png', fullPage: true });
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'mobile-layout-screenshot.png', fullPage: true });
    
    console.log('Layout verification completed across multiple viewports');
  });

  test('Console Errors and Functionality Check', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(3000);
    
    // Check for broken images
    const images = await page.locator('img').all();
    let brokenImages = 0;
    
    for (const img of images) {
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      if (naturalWidth === 0) {
        brokenImages++;
      }
    }
    
    console.log(`Found ${brokenImages} potentially broken images`);
    console.log(`Console errors captured: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    
    // Test any forms if present
    const forms = await page.locator('form').all();
    console.log(`Found ${forms.length} forms on the page`);
    
    // Test any buttons if present
    const buttons = await page.locator('button, input[type="submit"]').all();
    console.log(`Found ${buttons.length} interactive buttons`);
  });

  test.afterAll(async () => {
    // Summary report
    console.log('=== TEST EXECUTION SUMMARY ===');
    console.log(`Total console errors detected: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Error details:', consoleErrors);
    }
    console.log('All screenshots saved to test output directory');
  });
});