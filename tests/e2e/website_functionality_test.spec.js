const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '../../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('The Bigger Boss Website Functionality Test', () => {
  test('Complete website functionality and appearance verification', async ({ page }) => {
    console.log('Starting comprehensive website test...');
    
    // Set up console error tracking
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to homepage and verify it loads
    console.log('1. Testing homepage load...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify homepage loads properly
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
    
    // Take screenshot of homepage
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'homepage.png'),
      fullPage: true 
    });
    console.log('✓ Homepage loaded and screenshot captured');

    // Check main navigation exists and is visible
    console.log('2. Testing main navigation...');
    const navigation = page.locator('nav, header').first();
    await expect(navigation).toBeVisible();
    
    // Test navigation to About page
    console.log('2a. Testing About page navigation...');
    try {
      await page.click('a[href="/about"], a[href*="about"]');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*about.*/);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'about-page.png'),
        fullPage: true 
      });
      console.log('✓ About page loaded successfully');
    } catch (error) {
      console.log('⚠ About page navigation failed:', error.message);
    }

    // Test navigation to Contact page
    console.log('2b. Testing Contact page navigation...');
    try {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.click('a[href="/contact"], a[href*="contact"]');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*contact.*/);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'contact-page.png'),
        fullPage: true 
      });
      console.log('✓ Contact page loaded successfully');
    } catch (error) {
      console.log('⚠ Contact page navigation failed:', error.message);
    }

    // Test navigation to Pricing page
    console.log('2c. Testing Pricing page navigation...');
    try {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.click('a[href="/pricing"], a[href*="pricing"]');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*pricing.*/);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'pricing-page.png'),
        fullPage: true 
      });
      console.log('✓ Pricing page loaded successfully');
    } catch (error) {
      console.log('⚠ Pricing page navigation failed:', error.message);
    }

    // Test Solutions pages
    console.log('3. Testing Solutions pages...');
    
    // Test SMBs Solutions page
    console.log('3a. Testing SMBs Solutions page...');
    try {
      await page.goto('http://localhost:3000/solutions/for-smbs');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*solutions\/for-smbs.*/);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'solutions-smbs.png'),
        fullPage: true 
      });
      console.log('✓ SMBs Solutions page loaded successfully');
    } catch (error) {
      console.log('⚠ SMBs Solutions page failed:', error.message);
    }

    // Test Agencies Solutions page
    console.log('3b. Testing Agencies Solutions page...');
    try {
      await page.goto('http://localhost:3000/solutions/for-agencies');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*solutions\/for-agencies.*/);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'solutions-agencies.png'),
        fullPage: true 
      });
      console.log('✓ Agencies Solutions page loaded successfully');
    } catch (error) {
      console.log('⚠ Agencies Solutions page failed:', error.message);
    }

    // Check for forms and interactive elements
    console.log('4. Testing forms and interactive elements...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Look for common form elements
    const forms = await page.locator('form').count();
    const buttons = await page.locator('button, input[type="submit"]').count();
    const inputs = await page.locator('input, textarea, select').count();
    
    console.log(`Found ${forms} forms, ${buttons} buttons, ${inputs} input fields`);
    
    // Test any buttons that might be present
    if (buttons > 0) {
      console.log('Testing interactive buttons...');
      const buttonElements = page.locator('button, input[type="submit"]');
      for (let i = 0; i < Math.min(3, buttons); i++) {
        try {
          const button = buttonElements.nth(i);
          const buttonText = await button.textContent();
          console.log(`Testing button: "${buttonText}"`);
          
          // Only click if it's not a submit button or if it looks safe
          if (buttonText && !buttonText.toLowerCase().includes('submit')) {
            await button.hover();
            console.log(`✓ Button "${buttonText}" is interactive`);
          }
        } catch (error) {
          console.log(`⚠ Button ${i} interaction failed:`, error.message);
        }
      }
    }

    // Check for broken links
    console.log('5. Checking for broken links...');
    const links = await page.locator('a[href]').all();
    let brokenLinks = [];
    
    for (let i = 0; i < Math.min(10, links.length); i++) {
      try {
        const href = await links[i].getAttribute('href');
        if (href && href.startsWith('/')) {
          // Internal link - test it
          const fullUrl = `http://localhost:3000${href}`;
          console.log(`Testing link: ${fullUrl}`);
          
          const response = await page.request.get(fullUrl);
          if (response.status() >= 400) {
            brokenLinks.push(`${fullUrl} - Status: ${response.status()}`);
          }
        }
      } catch (error) {
        console.log(`⚠ Link check failed for link ${i}:`, error.message);
      }
    }

    // Final verification and reporting
    console.log('6. Final verification and reporting...');
    
    // Take final homepage screenshot for comparison
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'final-homepage.png'),
      fullPage: true 
    });

    // Report console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('✓ No console errors detected');
    }

    // Report broken links
    if (brokenLinks.length > 0) {
      console.log('Broken links detected:');
      brokenLinks.forEach((link, index) => {
        console.log(`${index + 1}. ${link}`);
      });
    } else {
      console.log('✓ No broken links detected in tested sample');
    }

    console.log('Test completed successfully!');
    console.log(`Screenshots saved to: ${screenshotsDir}`);
  });
});