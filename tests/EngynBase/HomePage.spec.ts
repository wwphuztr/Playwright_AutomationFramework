// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/edit-v2/3740598278

import { test, expect } from '@playwright/test';
import { LoginComponents } from '../../page/loginComponent';
import { EmailComponents } from '../../page/emailComponent';


//BASE22
test('Resend Validation Email', async ({page}) => {
    const title = 'Engyn - Email Validation';
    const title2 = 'Welcome to Engyn';
    const emailComponents= new EmailComponents(page);
    const email = 'auto' + Date.now() + '@mailinator.com';
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill(email);
    await page.getByPlaceholder('Enter your email address').fill(email);
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await page.getByPlaceholder('Enter your business name (optional)').fill(email);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await emailComponents.deleteEmail(title, email);
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Resend Validation Email' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await emailComponents.selectEmails(title,email,title2);
});
  
//BASE23 + 24
test('Logout Successful', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    loginComponents.LoginAsAdmin();
    await page.waitForTimeout(1000);
    await page.locator("//ul[contains(@class,'sidebar-profile__men')]//div").click();
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(new RegExp('.*login.*'));
  });