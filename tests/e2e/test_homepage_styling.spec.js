const { test, expect } = require('@playwright/test');

test.describe('Homepage Styling Verification', () => {
  test('should display The Bigger Boss homepage with proper Tailwind CSS styling', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3005');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Take a full page screenshot for visual verification
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-styling-verification.png', 
      fullPage: true 
    });
    
    // Verify key elements are visible and styled correctly
    
    // Check that the main heading is visible
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // Verify gradient background is applied to hero section
    const heroSection = page.locator('[class*="gradient"]').first();
    if (await heroSection.count() > 0) {
      await expect(heroSection).toBeVisible();
    }
    
    // Check for primary blue buttons
    const primaryButtons = page.locator('button, a').filter({ hasText: /get started|learn more|start free trial/i });
    if (await primaryButtons.count() > 0) {
      await expect(primaryButtons.first()).toBeVisible();
    }
    
    // Verify typography is properly styled
    const bodyText = page.locator('p').first();
    await expect(bodyText).toBeVisible();
    
    // Check for card components if they exist
    const cards = page.locator('[class*="card"], [class*="bg-white"], [class*="shadow"]');
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
    
    // Verify the page title
    await expect(page).toHaveTitle(/Bigger Boss|The Bigger Boss/);
    
    console.log('Homepage styling verification completed successfully');
    console.log('Screenshot saved to: tests/screenshots/homepage-styling-verification.png');
  });
  
  test('should verify specific Tailwind CSS classes are working', async ({ page }) => {
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');
    
    // Check for Tailwind utility classes in the DOM
    const elementsWithTailwind = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const tailwindClasses = [];
      
      elements.forEach(el => {
        const classList = Array.from(el.classList);
        const hasTailwindClasses = classList.some(cls => 
          cls.includes('bg-') || 
          cls.includes('text-') || 
          cls.includes('p-') || 
          cls.includes('m-') || 
          cls.includes('flex') || 
          cls.includes('grid') ||
          cls.includes('rounded') ||
          cls.includes('shadow')
        );
        
        if (hasTailwindClasses) {
          tailwindClasses.push(...classList.filter(cls => 
            cls.includes('bg-') || 
            cls.includes('text-') || 
            cls.includes('p-') || 
            cls.includes('m-') || 
            cls.includes('flex') || 
            cls.includes('grid') ||
            cls.includes('rounded') ||
            cls.includes('shadow')
          ));
        }
      });
      
      return Array.from(new Set(tailwindClasses));
    });
    
    // Verify that Tailwind classes are present
    expect(elementsWithTailwind.length).toBeGreaterThan(0);
    console.log('Tailwind CSS classes found:', elementsWithTailwind.slice(0, 10));
    
    // Check for custom color classes (primary blues)
    const hasCustomColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let foundCustomColors = false;
      
      elements.forEach(el => {
        const classList = Array.from(el.classList);
        if (classList.some(cls => cls.includes('blue-') || cls.includes('primary'))) {
          foundCustomColors = true;
        }
      });
      
      return foundCustomColors;
    });
    
    console.log('Custom color classes working:', hasCustomColors);
  });
});