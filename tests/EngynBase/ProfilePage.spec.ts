// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/3739320321/Engyn+Base+-+Test+Suites+-+Profile+Page

import { test, expect } from '@playwright/test';
import { LoginComponents } from '../../page/loginComponent';


//BASE33
test('Verify user can edit information in the Profile Page', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const fname = 'Fname:' + Date.now();
    const mname = 'Mname:' + Date.now();
    const lname = 'Lname:' + Date.now();
    await page.goto('/login');
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByLabel('First Name').fill(fname);
    await page.getByLabel('Middle name').fill(mname);
    await page.getByLabel('Last Name').fill(lname);
    await page.getByRole('button', {name: 'Save Changes'}).click();
    await expect(page.getByText('The profile has been updated successfully')).toBeVisible();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.reload();
    await expect(page.getByText(fname).first()).toBeVisible();
    await expect(page.getByText(mname).first()).toBeVisible();
    await expect(page.getByText(lname).first()).toBeVisible();

    //search the information changed in users tabs
    await page.getByRole('menuitem', { name: 'Settings' }).click()
    await page.getByText('Users').click()
    await page.getByPlaceholder('Search').fill(fname)
    await expect(page.getByRole('cell', { name: fname + ' ' + mname + ' ' + lname})).toBeVisible()
});

//BASE34
test('Verify errors when editting user information in Profile Page', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const fname ='Fname:' + Date.now();
    const lname ='Lname' + Date.now();
    await page.goto('/login');
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByLabel('First Name').fill('');
    await page.getByLabel('Last Name').fill('');
    await expect(page.getByText('This field is required').nth(0)).toBeVisible();
    await expect(page.getByText('This field is required').nth(1)).toBeVisible();
    await expect(page.getByRole('button', {name: 'SAVE CHANGES'})).toBeDisabled();
    await page.getByLabel('First Name').fill(fname);
    await expect(page.getByText('This field is required').first()).toBeVisible();
    await expect(page.getByRole('button', {name: 'SAVE CHANGES'})).toBeDisabled();
    await page.getByLabel('Last Name').fill(lname);
    await page.getByLabel('First Name').fill('');
    await page.waitForTimeout(300);
    await expect(page.getByText('This field is required')).toBeVisible();
    await expect(page.getByRole('button', {name: 'SAVE CHANGES'})).toBeDisabled();
});

//BASE35
test('Verify user can change password in Profile Page', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const newPassword = 'Aa@' + Date.now();
    const email = await loginComponents.RegisterPersonalAccount();
    await page.goto('/profile');
    const name = await page.getByPlaceholder('First Name').inputValue();
    await page.getByRole('button', {name: 'Change Password'}).click();
    await page.getByLabel('Current Password').fill(process.env.PROFILEPAGEEDITPASSWORD!);
    await page.getByLabel('New Password', {exact: true}).fill(newPassword);
    await page.getByLabel('Confirm New Password').fill(newPassword);
    await page.getByRole('button', {name: 'Change', exact: true }).click();
    await expect(page.getByText('The password has been changed successfully')).toBeVisible();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.goto('/');
    await loginComponents.LogOut(name);
    await loginComponents.LoginWithCustomParams(email, newPassword);
});

//BASE36
test('Verify error when leaving information in Change Password Popup blank', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByRole('button', {name: 'Change Password'}).click();
    await page.getByRole('button', {name: 'Change', exact: true }).click();
    await expect(page.getByText('Current Password is required')).toBeVisible();
    await expect(page.getByText('New Password is required')).toBeVisible();
    await expect(page.getByText('New Password Confirm is required')).toBeVisible();
});

//BASE37
test('Verify error when Current password field does not follow convention', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByRole('button', {name: 'Change Password'}).click();
    await page.getByText('Current Password').fill('12345');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    await page.getByText('Current Password').fill('12345678');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('Password must contain at least 1 lowercase alphabetical character')).toBeVisible();
    await page.getByText('Current Password').fill('12345678a');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('Password must contain at least 1 uppercase alphabetical character')).toBeVisible();
    await page.getByText('Current Password').fill('12345678aA');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('Password must contain at least 1 special character')).toBeVisible();
});

//BASE38
test('Verify New Password is the same as Current Password error', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByRole('button', {name: 'Change Password'}).click();
    await page.getByText('Current Password').fill('12345678aA@');
    await page.getByText('New Password', {exact: true}).fill('12345678aA@');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('New password must be different from old password')).toBeVisible();
});

//BASE39
test('New Password and Confirm New Password are different error', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByRole('button', {name: 'Change Password'}).click();
    await page.getByLabel('Current Password').fill('12345678aA@');
    await page.getByLabel('New Password', {exact: true}).fill('123456aA@');
    await page.getByLabel('Confirm New Password').fill('12345aA@');
    await page.getByRole('button', {name: 'Change', exact: true}).click();
    await expect(page.getByText('Two new passwords that you enter are inconsistent')).toBeVisible();
});

//BASE40
test('Verify user can use breadcrumbs to navigate back to homepage', async({page})=>{
    const loginComponents = new LoginComponents(page);
    await page.goto('/login');
    await loginComponents.LoginWithCustomParams(process.env.PROFILEPAGEEDITUSERNAME, process.env.PROFILEPAGEEDITPASSWORD);
    await page.goto('/profile');
    await page.getByRole('link', {name: 'Home'}).click();
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
});