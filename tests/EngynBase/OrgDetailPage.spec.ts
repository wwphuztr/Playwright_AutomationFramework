// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/3738861569/Engyn+Base+-+Test+Suites+-+Organization+detail

import { test, expect } from '@playwright/test';
import { LoginComponents } from '../../page/loginComponent';
import { EngynNavigation } from '../../page/EngynNavigation';


//BASE26
test('Verify user can edit successfully in Org Details Page', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const descInput = 'Describe' + Date.now();
    const HOInput = 'HO Address' + Date.now();
    const POInput = 'PO Adress' + Date.now();
    const OfficePhoneInput = 'Office Phone' + Date.now();
    const EmailInput = Date.now() + '@mailinator.com';
    const WebsiteInput = 'https://' + Date.now()+'.com';
    await page.goto('/login');
    await loginComponents.LoginAsAdmin();
    await engynNavigation.NavigateToOrgPage(page);
    await page.getByRole('button', {name: 'Edit'}).click();
    await page.getByLabel('Description').fill(descInput);
    await page.getByLabel('Head Office Address').fill(HOInput);
    await page.getByLabel('Postal Address', {exact: true}).fill(POInput);
    await page.getByLabel('Email').fill(EmailInput);
    await page.getByLabel('Website').fill(WebsiteInput);
    await page.getByPlaceholder('12-345-678-901 or 12 345 678 901').fill('12-345-678-901')

    await page.locator('input[type="tel"]').clear();
    await page.locator('input[type="tel"]').fill('123456789')
    await page.getByLabel('Email').click()
    await expect(page.getByText('Incorrect phone number')).toBeVisible()
    await page.locator('input[type="tel"]').clear();
    await page.locator('input[type="tel"]').fill('444444444')
    await page.getByLabel('Email').click()
    await page.getByRole('button', {name: 'UPDATE'}).click();
    await expect(page.getByText('The organization has been updated successfully')).toBeVisible();
    await page.getByRole('button', {name: 'OK'}).click();
    await expect(page.getByText(descInput)).toBeVisible();
    await expect(page.getByText(HOInput)).toBeVisible();
    await expect(page.getByText(POInput)).toBeVisible();
    await expect(page.getByText(EmailInput)).toBeVisible();
    await expect(page.getByText(WebsiteInput)).toBeVisible();
});

//BASE27
test('Verify edited information is not saved when canceling while editing', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const descInput = 'Describe' + Date.now();
    const HOInput = 'HO Address' + Date.now();
    const POInput = 'PO Adress' + Date.now();
    const EmailInput = Date.now() + '@mailinator.com';
    const WebsiteInput = 'https://' + Date.now()+'.com';
    await page.goto('/login');
    await loginComponents.LoginAsAdmin();
    await engynNavigation.NavigateToOrgPage(page);
    await page.getByRole('button', {name: 'Edit'}).click();
    const oldDesc = await page.getByPlaceholder('Description').inputValue();
    const oldHOAddress = await page.getByPlaceholder('Address', {exact: true}).nth(0).inputValue();
    const oldPOAddress = await page.getByPlaceholder('Address', {exact: true}).nth(1).inputValue();
    const oldEmail = await page.getByPlaceholder('Email').inputValue();
    const oldWebsite = await page.getByPlaceholder('Website').inputValue();
    await page.getByLabel('Description').fill(descInput);
    await page.getByLabel('Head Office Address').fill(HOInput);
    await page.getByLabel('Postal Address', {exact: true}).fill(POInput);
    await page.getByLabel('Email').fill(EmailInput);
    await page.getByLabel('Website').fill(WebsiteInput);
    await page.getByRole('button', {name: 'CANCEL'}).click();
    // await expect(page.getByText(oldDesc)).toBeVisible();
    await expect(page.getByText(oldHOAddress)).toBeVisible();
    await expect(page.getByText(oldPOAddress)).toBeVisible();
    await expect(page.getByText(oldEmail)).toBeVisible();
    await expect(page.getByText(oldWebsite)).toBeVisible();
    await page.close();
});

//BASE28
test('Verify manager cannot edit Org Details page', async({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const loginComponents = new LoginComponents(page);
    await page.goto('/login');
    await loginComponents.LoginWithCustomParams(process.env.ORGMANAGERUSERNAME, process.env.ORGMANAGERPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'Flynk Automation Manger', 'Flynk Automation Org', 'Manager');
    // await page.locator('.ant-layout-sider-trigger').click();
    // await page.getByRole('menuitem', { name: 'Flynk' }).click();
    // await page.getByRole('menuitem').filter({ hasText: 'Flynk Automation Manager' }).first().click();
    // await page.getByText('Flynk Automation Org').click();
    await engynNavigation.NavigateToOrgPage(page);
    await expect(page.getByRole('button', {name: 'Edit'})).not.toBeVisible();
});

//BASE29?
test('Verify member cannot edit Org Details page', async({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const loginComponents = new LoginComponents(page);
    await page.goto('/login');
    await loginComponents.LoginWithCustomParams(process.env.ORGMEMBERUSERNAME, process.env.ORGMEMBERPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'Flynk Automation', 'Flynk Automation Org', ' Member');
    await engynNavigation.NavigateToOrgPage(page);
    await expect(page.getByRole('button', {name: 'Edit'})).not.toBeVisible();
});

//BASE29
test('Check the error of the edit of the Organization details page', async({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const loginComponents = new LoginComponents(page);
    await page.goto('/login');
    await loginComponents.LoginAsAdmin();
    await engynNavigation.NavigateToOrgPage(page);
    await page.getByRole('button', {name: 'Edit'}).click();

    // check when blank Name and Display Name -->  check Warning Text
    await page.getByLabel('Name', { exact: true }).clear()
    await page.getByLabel('Display Name').clear()
    const elements = await page.$$('text=This field is required')
    if (elements.length !== 2) {
        throw new Error(`Expected 2 elements with the text "This field is required", but not found enough elements`);
      }
      
      console.log('There are exactly two elements with the text "This field is required"');
    await expect(page.getByRole('button', {name: 'UPDATE'})).toBeDisabled()
    
    //Check warning when fill invalid phone number
    await page.locator('input[type="tel"]').clear();
    await page.locator('input[type="tel"]').fill('abc')
    await page.getByLabel('Email').click()
    await expect(page.getByText('Incorrect phone number')).toBeVisible()

    //ABN
    await page.getByPlaceholder('12-345-678-901 or 12 345 678 901').fill('wfeef')
    await expect(page.getByText('Incorrect format')).toBeVisible()

    //Email
    await page.getByLabel('Email').fill('email')
    await expect(page.getByText('Email is invalid')).toBeVisible()

    //Website
    await page.getByLabel('Website').fill('Website');
    await expect(page.getByText('URL must contain http or https')).toBeVisible()
});

//BASE30
test('Verify user can use breadcrumbs to navigate back to homepage', async({page})=>{
    const engynNavigation = new EngynNavigation(page);
    const loginComponents = new LoginComponents(page);
    await page.goto('/login');
    await loginComponents.LoginAsAdmin();
    await engynNavigation.NavigateToOrgPage(page);
    await page.getByRole('link', {name: 'Home'}).click();
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
});