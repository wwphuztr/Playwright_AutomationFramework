// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/1933705276/Engyn+Base+-+Test+Suites+-+Log+in+Page

import { test, expect } from '@playwright/test';
import { LoginComponents } from '../../page/loginComponent';
import { EmailComponents } from '../../page/emailComponent';
import { EngynNavigation } from '../../page/EngynNavigation';

//BASE1
test('Login Successful', async ({ page }) => {
    //Navigate to Engyn dev 
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(process.env.ORGADMINUSERNAME!);
    await page.getByPlaceholder('Password').fill(process.env.ORGADMINPASSWORD!);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
  });

//BASE2 + BASE8
test('Blank Email and Password Error', async ({page})=>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Log in'})).toBeDisabled();
  })

//BASE3
test('Blank Email and Short Password Error', async ({page})=>{
    await page.goto('/login');
    await page.getByPlaceholder('Password').fill('1aA@');
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Log in'})).toBeDisabled();
})

//BASE4
test('Blank Email and Valid Password Error', async ({page})=>{
    await page.goto('/login');
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Log in'})).toBeDisabled();
})

//BASE5
test('Blank Password and Invalid Email Error', async ({page})=>{
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('Invalid');
    await expect(page.getByText('Email is invalid format')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Log in'})).toBeDisabled();
})

//BASE6
test('Blank Password and Valid Email Error', async({page})=>{
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('Valid@mailinator.com');
    await page.getByRole('button',{name: 'Log in'}).click();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Log in'})).toBeDisabled();
})

//BASE7
test('Wrong Email and Password Error', async({page})=>{
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('WrongEmail@mailinator.com');
    await page.getByPlaceholder('Password').fill('2139053843aA@');
    await page.getByRole('button',{name: 'Log in'}).click();
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
    await page.getByRole('button',{name: 'OK'}).click();
})

//BASE9
test('Reset Password Successful', async({page})=>{
    const emailComponents = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);
    const title = 'Reset Password';
    const password = 'aA@' + Math.floor(Math.random() * Date.now())
    await page.goto('/login');
    await page.getByRole('link', {name: 'password'}).click();
    await expect(page).toHaveURL(new RegExp('.*forgot-password.*'));
    await page.getByPlaceholder('Email').fill(process.env.PASSWORDRESETUSERNAME!);
    await page.getByRole('button', {name: 'SEND REQUEST'}).click();
    await expect(page.getByText('Check your email or text message')).toBeVisible();
    await emailComponents.selectEmail(title, process.env.PASSWORDRESETUSERNAME!);
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'Reset Password' }).click();
    const page1 = await page1Promise;
    await page1.getByPlaceholder('New Password', { exact: true }).fill(password);
    await page1.getByPlaceholder('New Confirm Password').fill(password);
    await page1.getByRole('button', { name: 'Reset Password' }).click();
    await page1.waitForLoadState("load");
    await expect(page1.getByText('Your password has been reset successfully')).toBeVisible();
    await page1.close();
    await loginComponents.ResetPassword(process.env.PASSWORDRESETUSERNAME!, password, "12345678aA@");
    await loginComponents.LogOut("flynkpr@mailinator.com");
    await loginComponents.LoginWithCustomParams(process.env.PASSWORDRESETUSERNAME!, "12345678aA@");
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await page.close();
})

//BASE10
test('Wrong email format when resetting password error', async({page})=>{
    await page.goto('/login');
    await page.getByRole('link', {name: 'password'}).click();
    await expect(page).toHaveURL(new RegExp('.*forgot-password.*'));
    await page.getByPlaceholder('Email').fill('Invalid');
    await page.getByRole('button', {name: 'SEND REQUEST'}).click();
    await expect(page.getByText('Email is Invalid')).toBeVisible();
})

//BASE11
test('Non-existent user when resetting password error', async({page})=>{
    await page.goto('/login');
    await page.getByRole('link', {name: 'password'}).click();
    await expect(page).toHaveURL(new RegExp('.*forgot-password.*'));
    await page.getByPlaceholder('Email').fill('non-existent@mailinator.com'); 
    await page.getByRole('button', {name: 'SEND REQUEST'}).click();
    await expect(page.getByText('Not Found: No existing user found with provided info')).toBeVisible();
})

//BASE12
test('Verify Login button in Forgot Password page', async({page})=>{
    await page.goto('/login');
    await page.getByRole('link', {name: 'password'}).click();
    await expect(page).toHaveURL(new RegExp('.*forgot-password.*'));
    await page.getByPlaceholder('Email').fill('flynkautomationadm@mailinator.com');
    await page.getByRole('button', {name: 'SEND REQUEST'}).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Check your email or text message')).toBeVisible();
    await page.getByRole('link', {name: 'Login'}).click();
    await expect(page).toHaveURL(new RegExp('.*login.*'));
})

//BASE13
test('Register Personal Account', async ({ page }) =>{
    const engynNavigation = new EngynNavigation(page);
    const title = 'Engyn - Email Validation';
    const title2 = 'Welcome to Engyn'
    const emailComponents= new EmailComponents(page);
    const email = 'auto' + Date.now() + '@mailinator.com';
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill(email);
    await page.getByPlaceholder('Enter your email address').fill(email);
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await emailComponents.selectEmails(title, email, title2);
    await page.waitForTimeout(2000);
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'CONFIRM' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('button', { name: 'Back to Home' }).click();
    await engynNavigation.NavigateToFormsPage(page1);
    await engynNavigation.NavigateToCorePage(page1);
});

//BASE14
test('Register Business Account', async ({ page }) =>{
    const engynNavigation = new EngynNavigation(page);
    const title = 'Engyn - Email Validation';
    const title2 = 'Welcome to Engyn'
    const emailComponents= new EmailComponents(page);
    const email = 'auto' + Date.now() + '@mailinator.com';
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill(email);
    await page.getByPlaceholder('Enter your email address').fill(email);
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await page.getByPlaceholder('Enter your business name (optional)').fill(email);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await emailComponents.selectEmails(title, email, title2);
    await page.waitForTimeout(2000);
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'CONFIRM' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('button', { name: 'Back to Home' }).click();
    await engynNavigation.NavigateToUserPage(page1);
    await engynNavigation.NavigateToFormsPage(page1);
    await engynNavigation.NavigateToCorePage(page1);
});

//BASE15
test('Verify error popup when user try to use link that has already been used to register(Personal)', async ({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const title = 'Engyn - Email Validation';
    const emailComponents= new EmailComponents(page);
    const email = 'auto' + Date.now() + '@mailinator.com';
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill(email);
    await page.getByPlaceholder('Enter your email address').fill(email);
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    const url = await emailComponents.selectEmail2(title, email);
    await page.waitForTimeout(2000);
    await page.goto(url);
    await page.getByRole('button', { name: 'Back to Home' }).click();
    await page.waitForTimeout(4000);
    await page.goto(url);
    await expect(page.getByText('Email is already validated')).toBeVisible();
    await expect(page.getByText('Please email us at support@flynk.com with any questions or suggestions')).toBeVisible();
});

//BASE16
test('Verify error popup when user try to use link that has already been used to register(Business)', async ({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const title = 'Engyn - Email Validation';
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
    const url = await emailComponents.selectEmail2(title, email);
    await page.waitForTimeout(2000);
    await page.goto(url);
    await page.getByRole('button', { name: 'Back to Home' }).click();
    await page.waitForTimeout(3000);
    await page.goto(url);
    await page.waitForLoadState()
    await expect(page.getByText('Email is already validated')).toBeVisible();
    await expect(page.getByText('Please email us at support@flynk.com with any questions or suggestions')).toBeVisible();
});

//BASE17
test('All spaces blank when registering account error', async ({page})=>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByRole('button', { name: 'Enter' }).click();
    await expect(page.locator('#fullName_help').getByText('This field is required')).toBeVisible();
    await expect(page.locator('#email_help').getByText('This field is required')).toBeVisible();
    await expect(page.locator('#password_help').getByText('This field is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();

  });

//BASE18
test('Invalid email format when registering account error', async ({page})=>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill('HN');
    await page.getByPlaceholder('Enter your email address').fill('Invalid');
    await page.getByPlaceholder('Password').fill('12345678aA@');
    await expect(page.getByText('Email is invalid')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
  });

  //BASE19
test('Invalid email format and invalid password when registering account error', async({page}) =>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill('HN');
    await page.getByPlaceholder('Enter your email address').fill('Invalid');
    await page.getByPlaceholder('Password').fill('123@');
    await expect(page.getByText('Password must be at least 8 character')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
  });

//BASE20
test('Invalid password when registering account error', async({page})=>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill('HN');
    await page.getByPlaceholder('Enter your email address').fill('valid@mail.com');
    await page.getByRole('button', {name: 'Enter'}).click();
    await expect(page.getByText('This field is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
    await page.getByPlaceholder('Password').fill('123@');
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
    await page.getByPlaceholder('Password').fill('12345678');
    await expect(page.getByText('Password must contain at least 1 lowercase alphabetical character')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
    await page.getByPlaceholder('Password').fill('12345678a');
    await expect(page.getByText('Password must contain at least 1 uppercase alphabetical character')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
    await page.getByPlaceholder('Password').fill('aa@@AAaa');
    await expect(page.getByText('Password must contain at least 1 numeric character')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
    await page.getByPlaceholder('Password').fill('12345678aA');
    await expect(page.getByText('Password must contain at least 1 special character')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Enter'})).toBeDisabled();
});

//BASE21
test('Verify CANCEL button when creating an account', async({page})=>{
    await page.goto('/login');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await page.getByPlaceholder('Enter your full name').fill('HN');
    await page.getByPlaceholder('Enter your email address').fill('valid@mail.com');
    await page.getByRole('button', {name: 'Cancel'}).click();
    await expect(page).toHaveURL(new RegExp('.*login.*'));
});