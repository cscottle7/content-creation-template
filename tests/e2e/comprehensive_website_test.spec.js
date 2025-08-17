const { test, expect } = require('@playwright/test');

test.describe('Bigger Boss Website Comprehensive Testing', () => {
  const baseURL = 'http://localhost:3002';
  
  test.beforeEach(async ({ page }) => {
    // Set up error listener
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
  });

  test('Homepage - Structure and Content Validation', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'tests/screenshots/homepage-desktop.png', fullPage: true });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/Bigger Boss/);
    
    // Check for conversion-focused homepage elements as per brief
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify header navigation exists
    const header = page.locator('header, nav');
    await expect(header).toBeVisible();
    
    // Check for main content sections
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Verify footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    console.log('✓ Homepage structure validated');
  });

  test('Navigation Links - Header Menu Testing', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Test navigation to Solutions for Agencies
    const agenciesLink = page.locator('a[href*="/solutions/for-agencies"], a:has-text("Agencies")').first();
    if (await agenciesLink.isVisible()) {
      await agenciesLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*\/solutions\/for-agencies.*/);
      console.log('✓ Navigation to Agencies solution page works');
    }
    
    // Go back to homepage
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Test navigation to Solutions for SMBs
    const smbsLink = page.locator('a[href*="/solutions/for-smbs"], a:has-text("SMBs")').first();
    if (await smbsLink.isVisible()) {
      await smbsLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*\/solutions\/for-smbs.*/);
      console.log('✓ Navigation to SMBs solution page works');
    }
    
    // Test other navigation links
    const navigationTests = [
      { path: '/about', text: 'About' },
      { path: '/contact', text: 'Contact' },
      { path: '/pricing', text: 'Pricing' }
    ];
    
    for (const nav of navigationTests) {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      
      const navLink = page.locator(`a[href*="${nav.path}"], a:has-text("${nav.text}")`).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(`.*${nav.path}.*`));
        console.log(`✓ Navigation to ${nav.text} page works`);
      }
    }
  });

  test('Solutions for Agencies Page - Content Validation', async ({ page }) => {
    await page.goto(`${baseURL}/solutions/for-agencies`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/agencies-solution-desktop.png', fullPage: true });
    
    // Verify page loads and has relevant content
    await expect(page).toHaveTitle(/.*Agencies.*|.*Agency.*/i);
    
    // Check for agency-specific messaging as per brief
    const pageContent = await page.textContent('body');
    const hasAgencyContent = /agency|agencies|client|team/i.test(pageContent);
    expect(hasAgencyContent).toBeTruthy();
    
    // Verify main heading exists
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✓ Agencies solution page validated');
  });

  test('Solutions for SMBs Page - Content Validation', async ({ page }) => {
    await page.goto(`${baseURL}/solutions/for-smbs`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/smbs-solution-desktop.png', fullPage: true });
    
    // Verify page loads and has relevant content
    await expect(page).toHaveTitle(/.*SMB.*|.*Business.*|.*Small.*/i);
    
    // Check for SMB-specific messaging
    const pageContent = await page.textContent('body');
    const hasSMBContent = /small.*business|smb|owner|entrepreneur/i.test(pageContent);
    expect(hasSMBContent).toBeTruthy();
    
    // Verify main heading exists
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✓ SMBs solution page validated');
  });

  test('About Page - Content and Structure', async ({ page }) => {
    await page.goto(`${baseURL}/about`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/about-page-desktop.png', fullPage: true });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/.*About.*/i);
    
    // Check for brand story content as mentioned in brief
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify there's meaningful content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    console.log('✓ About page validated');
  });

  test('Contact Page - Content and Forms', async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/contact-page-desktop.png', fullPage: true });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/.*Contact.*/i);
    
    // Check for contact form or contact information
    const hasForm = await page.locator('form').count() > 0;
    const hasContactInfo = await page.locator('text=/email|phone|address/i').count() > 0;
    
    expect(hasForm || hasContactInfo).toBeTruthy();
    
    console.log('✓ Contact page validated');
  });

  test('Pricing Page - Value-Based Pricing Structure', async ({ page }) => {
    await page.goto(`${baseURL}/pricing`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/pricing-page-desktop.png', fullPage: true });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/.*Pricing.*/i);
    
    // Check for pricing tiers as mentioned in brief
    const pageContent = await page.textContent('body');
    const hasPricingContent = /price|plan|tier|\$|cost|pricing/i.test(pageContent);
    expect(hasPricingContent).toBeTruthy();
    
    console.log('✓ Pricing page validated');
  });

  test('Mobile Responsive Design Testing', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const pagesToTest = ['/', '/solutions/for-agencies', '/solutions/for-smbs', '/about', '/contact', '/pricing'];
    
    for (const pagePath of pagesToTest) {
      await page.goto(`${baseURL}${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Take mobile screenshot
      const screenshotName = pagePath === '/' ? 'homepage' : pagePath.replace(/\//g, '-').substring(1);
      await page.screenshot({ path: `tests/screenshots/${screenshotName}-mobile.png`, fullPage: true });
      
      // Verify page is responsive
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check for mobile navigation (hamburger menu or mobile-optimized nav)
      const nav = page.locator('nav, header');
      await expect(nav).toBeVisible();
      
      console.log(`✓ Mobile responsive design validated for ${pagePath}`);
    }
  });

  test('Interactive Elements and Forms Testing', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Test all buttons on the page
    const buttons = page.locator('button, input[type="submit"], a[role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      console.log(`Found ${buttonCount} interactive buttons/links`);
      
      // Test first few buttons to ensure they're clickable
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          await expect(button).toBeEnabled();
          console.log(`✓ Button ${i + 1} is interactive`);
        }
      }
    }
    
    // Test forms if they exist
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`Found ${formCount} forms on the page`);
      
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        if (await form.isVisible()) {
          // Check for form inputs
          const inputs = form.locator('input, textarea, select');
          const inputCount = await inputs.count();
          console.log(`✓ Form ${i + 1} has ${inputCount} input fields`);
        }
      }
    }
    
    console.log('✓ Interactive elements testing completed');
  });

  test('Performance and Load Testing', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Verify page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for any JavaScript errors
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.waitForTimeout(2000); // Wait to catch any async errors
    
    if (errors.length > 0) {
      console.log('JavaScript errors found:', errors);
    } else {
      console.log('✓ No JavaScript errors detected');
    }
    
    console.log('✓ Performance testing completed');
  });
});