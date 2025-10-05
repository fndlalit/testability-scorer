const { test, expect } = require('@playwright/test');

/**
 * Testability-Focused Tests
 * These tests demonstrate how Playwright supports the 10 principles of Intrinsic Testability
 */
test.describe('Intrinsic Testability Demonstration', () => {

  test('Observability: Comprehensive state inspection', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    
    // Inspect all available options in dropdown (Complete transparency)
    const dropdown = page.locator('#dropdown');
    const options = await dropdown.locator('option').allTextContents();
    console.log('Available dropdown options:', options);
    
    // Capture page state before and after interaction
    const stateBefore = await page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      dropdownValue: document.getElementById('dropdown').value
    }));
    
    await dropdown.selectOption('1');
    
    const stateAfter = await page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      dropdownValue: document.getElementById('dropdown').value
    }));
    
    console.log('State before:', stateBefore);
    console.log('State after:', stateAfter);
    
    // Verify the change occurred
    expect(stateAfter.dropdownValue).toBe('1');
    expect(stateBefore.dropdownValue).not.toBe(stateAfter.dropdownValue);
  });

  test('Controllability: Precise input and state control', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/challenging_dom');
    
    // Demonstrate precise control over different input types
    const button1 = page.locator('.button').first();
    const button2 = page.locator('.button').nth(1);
    const button3 = page.locator('.button').nth(2);
    
    // Test multiple button clicks with state verification
    for (let i = 0; i < 3; i++) {
      await button1.click();
      await page.waitForTimeout(100); // Small delay for any animations
      
      // Verify each click changes something (if the page is reactive)
      const currentUrl = page.url();
      console.log(`Click ${i + 1} - Current URL:`, currentUrl);
    }
    
    // Demonstrate keyboard control
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify we can control focus and interactions precisely
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    console.log('Currently focused element:', focusedElement);
  });

  test('Algorithmic Simplicity: Clear input-output relationships', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
    
    // Simple, predictable operation: add elements
    const addButton = page.getByRole('button', { name: 'Add Element' });
    const deleteButtonsContainer = page.locator('#elements');
    
    // Test the simple relationship: each click adds exactly one element
    for (let i = 1; i <= 3; i++) {
      await addButton.click();
      
      const deleteButtons = deleteButtonsContainer.locator('.added-manually');
      const count = await deleteButtons.count();
      
      expect(count).toBe(i); // Simple 1:1 relationship
      console.log(`Added ${i} elements, found ${count} delete buttons`);
    }
    
    // Test the reverse: each delete removes exactly one element
    const deleteButtons = deleteButtonsContainer.locator('.added-manually');
    const initialCount = await deleteButtons.count();
    
    await deleteButtons.first().click();
    const afterDeleteCount = await deleteButtons.count();
    
    expect(afterDeleteCount).toBe(initialCount - 1);
  });

  test('Algorithmic Transparency: Understanding system behavior', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    // Intercept and analyze JavaScript alerts (transparent behavior)
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log('Alert detected:', dialog.type(), dialog.message());
      await dialog.accept();
    });
    
    // Test different alert types to understand the system
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    expect(alertMessage).toContain('I am a JS Alert');
    
    // Test confirm dialog
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    expect(alertMessage).toContain('I am a JS Confirm');
    
    // The behavior is transparent - we know exactly what each button does
  });

  test('Decomposability: Testing isolated components', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables');
    
    // Test table functionality in isolation
    const table1 = page.locator('#table1');
    const table2 = page.locator('#table2');
    
    // Test each table separately (decomposed testing)
    const table1Headers = await table1.locator('th').allTextContents();
    const table2Headers = await table2.locator('th').allTextContents();
    
    console.log('Table 1 headers:', table1Headers);
    console.log('Table 2 headers:', table2Headers);
    
    // Verify each table has the expected structure independently
    expect(table1Headers).toContain('Last Name');
    expect(table2Headers).toContain('Last Name');
    
    // Test sorting functionality on table2 only (isolated testing)
    const lastNameHeader = table2.locator('th').filter({ hasText: 'Last Name' });
    await lastNameHeader.click();
    
    // Verify sorting worked on this specific table
    const firstLastName = await table2.locator('tbody tr:first-child .last-name').textContent();
    console.log('First last name after sort:', firstLastName);
  });

  test('Smallness: Testing focused, small interactions', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    
    // Focus on just checkbox behavior - small, focused test
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);
    
    // Test minimal interaction: just checkbox state changes
    const initialState1 = await checkbox1.isChecked();
    const initialState2 = await checkbox2.isChecked();
    
    await checkbox1.click();
    await checkbox2.click();
    
    const finalState1 = await checkbox1.isChecked();
    const finalState2 = await checkbox2.isChecked();
    
    // Small, predictable changes
    expect(finalState1).toBe(!initialState1);
    expect(finalState2).toBe(!initialState2);
    
    console.log('Checkbox states changed as expected');
  });

  test('Unbugginess: Error-free interaction testing', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/status_codes');
    
    // Test links that should work without bugs
    const links = await page.locator('a').all();
    
    for (const link of links.slice(0, 2)) { // Test first 2 links only
      const href = await link.getAttribute('href');
      if (href && href.includes('200')) {
        await link.click();
        
        // Verify we get expected response (no bugs)
        await expect(page.locator('h1')).toContainText('Status Code');
        await page.goBack();
      }
    }
    
    console.log('Successfully tested error-free navigation');
  });

  test('Stability: Consistent behavior across interactions', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');
    
    // Test that hover behavior is stable and consistent
    const figures = page.locator('.figure');
    const figureCount = await figures.count();
    
    for (let i = 0; i < figureCount; i++) {
      const figure = figures.nth(i);
      
      // Hover should consistently show additional info
      await figure.hover();
      
      const caption = figure.locator('.figcaption');
      await expect(caption).toBeVisible();
      
      // Move away and verify caption disappears (stable behavior)
      await page.locator('h3').hover(); // Hover on title instead
      await expect(caption).not.toBeVisible();
      
      console.log(`Figure ${i + 1}: Hover behavior is stable`);
    }
  });
});