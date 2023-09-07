// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/1933705293/Engyn+Base+-+Test+Suites+-+invite+a+new+org+by+the+internal+users

import { test, expect, Page } from '@playwright/test';
import { LoginComponents } from '../../page/loginComponent';
import { EngynNavigation } from '../../page/EngynNavigation';
import { EmailComponents } from '../../page/emailComponent';

const title = 'Engyn Base Dev Local Invitation Email';

const MAX_RETRIES = 10;
let retryCount = 0;

async function navigateToUrl(page: Page, url: string): Promise<void> {
    try {
        await page.goto(url, { timeout: 20000 });
        return; // success
    } catch (error) {
        console.warn(`Failed to load ${url}: ${error.message}`);
        if (++retryCount > MAX_RETRIES) {
            throw new Error(`Failed to load ${url} after ${MAX_RETRIES} retries`);
        }
        console.log(`Retrying ${url} (${retryCount}/${MAX_RETRIES})...`);
        //await page.goto(url);
        await navigateToUrl(page, url)
    }
}
//BASE68
test('Check org invitation by internal users (existing account)', async ({ page, context }) => {

    const orgName = 'auto-org1' + Date.now() + '@mailinator.com';
    const domainName = 'https://auto1' + Date.now() + '.com';
    const emailComponent = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);
    const email = await loginComponents.RegisterPersonalAccount();

    //await page.goto('/');
    await navigateToUrl(page, "/")
    await loginComponents.LogOut('auto');
    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('The invitation has been sent.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();

    const pageMail = await context.newPage();
    const emailComponent2 = new EmailComponents(pageMail);
    await emailComponent2.selectEmail(title, email);

    await pageMail.waitForTimeout(3000);

    const element = pageMail.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' });
    const element2 = await element.elementHandle();

    const url = await element2!.getAttribute('href');
    //const page3 = await context.newPage();
    await pageMail.close();

    try {
        await page.goto(url!, { waitUntil: "networkidle", timeout: 30000 });
    } catch (error) {
        console.error(`Navigation to URL timed out: ${error}`);
        await page.goto(url!, { waitUntil: "networkidle", timeout: 60000 });
    }

    await pageMail.close();
    const page2 = await context.newPage();

    page2.on('pageerror', msg => {
        page2.reload();
    });

    await navigateToUrl(page2, url!);

    await page2.waitForSelector("#organisationFormalName");
    var ele = page2.locator('#organisationFormalName');
    var value = await ele.inputValue();
    while (value === "") {
        await page2.goto(url!);
        await page2.waitForTimeout(10000);
        await page2.waitForLoadState("load");
        ele = page2.locator('#organisationFormalName');
        value = await ele.inputValue();
    }

    await page2.waitForLoadState("load");
    await page2.waitForLoadState("domcontentloaded");
    await page2.getByRole('button', { name: 'Submit' }).click();
    await expect(page2.getByText('The invitation has been accepted.')).toBeVisible();
    await page2.getByRole('button', { name: 'OK' }).click();

    await page.goto('/');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(process.env.ORGADMINPASSWORD!);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await page.getByRole('menuitem', { name: 'Forms' }).locator('svg').click();
    await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click();
    await expect(page).toHaveURL(new RegExp('.*data-set.*'));
    await page.getByRole('menuitem', { name: 'auto' }).getByRole('img').click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page.locator('#root').getByText(orgName)).toBeVisible();
    await page.close();
});

//BASE69
test('Check org invitation by internal users (non-existing account)', async ({ page, browser, context }) => {
    page.on('pageerror', msg => {
        page.reload();
    });

    const orgName = 'auto-org2' + Date.now() + '@mailinator.com';
    const domainName = 'https://auto2' + Date.now() + '.com';
    const name = 'auto1' + Date.now() + '@mailinator.com';

    const emailComponent = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('The invitation has been sent.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();


    await emailComponent.selectEmail(title, name);

    const element = page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' });
    const element2 = await element.elementHandle();
    const url = await element2!.getAttribute('href');
    //const page3 = await context.newPage();

    // try {
    //     await page.goto(url, {waitUntil: "networkidle", timeout: 30000});
    // } catch (error) {
    //     console.error(`Navigation to URL timed out: ${error}`);
    //     await page.reload({ waitUntil: "networkidle", timeout: 60000 });
    // }
    await navigateToUrl(page, url!);

    await page.waitForSelector("#organisationFormalName");
    var ele = page.locator('#organisationFormalName');
    var value = await ele.inputValue();

    while (value === "") {
        //await page.goto(url);
        await navigateToUrl(page, url!);
        await page.waitForTimeout(2000);
        await page.waitForLoadState("load");
        ele = page.locator('#organisationFormalName');
        value = await ele.inputValue();
    }

    await page.getByPlaceholder('Password', { exact: true }).fill('12345678aA@');
    await page.getByPlaceholder('Password Confirm').fill('12345678aA@');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForURL("**/dashboard")
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'))

    await page.waitForTimeout(2000);

    //await page.goto('/');
    await navigateToUrl(page, "/");
    await page.waitForLoadState('load');
    await loginComponents.LogOut('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Password').fill(process.env.ORGADMINPASSWORD!);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await page.getByRole('menuitem', { name: 'Forms' }).locator('svg').click();
    await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click();
    await expect(page).toHaveURL(new RegExp('.*data-set.*'));
    await page.getByRole('menuitem', { name: 'auto' }).getByRole('img').click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page.locator('#root').getByText(orgName)).toBeVisible();
    await page.close();
});

//BASE70
test('Check the error of the org invitation by the internal user (Organisation page)', async ({ page }) => {
    test.setTimeout(300000);
    const loginComponents = new LoginComponents(page);
    const domainName = 'https://auto3' + Date.now() + '.com';
    const orgName = 'auto-org3' + Date.now() + '@mailinator.com';

    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('Title is required!')).toBeVisible();
    await expect(page.getByText('First Name is required!')).toBeVisible();
    await expect(page.getByText('Last Name is required!')).toBeVisible();
    await expect(page.getByText('Email is required!')).toBeVisible();
    await expect(page.getByText('Company Name is required!')).toBeVisible();
    await expect(page.getByText('Display Name is required!')).toBeVisible();
    await page.getByPlaceholder('Email').fill('test');
    await page.getByPlaceholder('https://example.com').click();
    await page.getByPlaceholder('https://example.com').fill('tedsfadfst');
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('Email is invalid format')).toBeVisible();
    await expect(page.getByText('URL must contain http or https')).toBeVisible();
    await page.close();
});

//BASE71
test('Check the error when using an existing Org name', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const domainName = 'https://auto4' + Date.now() + '.com';
    const orgName = 'auto-org4' + Date.now() + '@mailinator.com';
    const name = 'auto2' + Date.now() + '@mailinator.com';

    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.waitForTimeout(1000)
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Formal Name').fill("QA Org2");
    await page.getByPlaceholder('Display Name').fill("QA Org2");
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('Invalid Argument: The Organisation QA Org2 already exists')).toBeVisible();
    await page.close();
});

//BASE72
test('Check the error in the new org registration Form.(non-existing)', async ({ page }) => {
    test.setTimeout(300000);
    const domainName = 'https://auto5' + Date.now() + '.com';
    const orgName = 'auto-org5' + Date.now() + '@mailinator.com';
    const name = 'auto3' + Date.now() + '@mailinator.com';

    const emailComponent = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);

    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('The invitation has been sent.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();


    await emailComponent.selectEmail(title, name);
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' }).click();
    const page2 = await page1Promise;
    await page2.waitForLoadState("load");
    await page2.waitForLoadState("domcontentloaded");
    await page2.getByRole('button', { name: 'Submit' }).click();
    await expect(page2.getByText('Password is required')).toBeVisible();
    await expect(page2.getByText('Password confirm is required')).toBeVisible();
    await page2.getByPlaceholder('https://example.com').fill('https://auto1681286580368');
    await page2.getByRole('button', { name: 'Submit' }).click();
    await expect(page2.getByText('URL format is invalid')).toBeVisible();
    await page.close();
});

// BASE73
test('Check the re-registration error in the successful registered new org form', async ({ page, context }) => {
    test.setTimeout(300000);
    const domainName = 'https://auto6' + Date.now() + '.com';
    const orgName = 'auto-org6' + Date.now() + '@mailinator.com';
    const name = 'auto4' + Date.now() + '@mailinator.com';

    const emailComponent = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);

    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('The invitation has been sent.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();


    await emailComponent.selectEmail(title, name);
    const element = page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' });
    const element2 = await element.elementHandle();
    const url = await element2!.getAttribute('href');
    const page2 = await context.newPage();

    // try {
    //     await page2.goto(url, {waitUntil: "networkidle", timeout: 30000});
    // } catch (error) {
    //     console.error(`Navigation to URL timed out: ${error}`);
    //     await page2.reload({ waitUntil: "networkidle", timeout: 60000 });
    // }
    await navigateToUrl(page2, url!);

    await page2.waitForSelector("#organisationFormalName");
    var ele = page2.locator('#organisationFormalName');
    var value = await ele.inputValue();


    while (value === "") {
        //await page2.goto(url);
        await navigateToUrl(page2, url!);
        await page2.waitForTimeout(2000);
        await page2.waitForLoadState("load");
        ele = page2.locator('#organisationFormalName');
        value = await ele.inputValue();
    }

    await page2.getByPlaceholder('Password', { exact: true }).fill('12345678aA@');
    await page2.getByPlaceholder('Password Confirm').fill('12345678aA@');
    await page2.getByRole('button', { name: 'Submit' }).click();
    await page2.waitForLoadState("load");
    await page2.waitForLoadState('networkidle', { timeout: 20000 });

    await expect(page2).toHaveURL(new RegExp('.*dashboard.*'));
    await page2.goto(url!);
    await page2.waitForTimeout(2000);
    await page2.waitForLoadState("load");
    await page2.waitForLoadState('networkidle', { timeout: 5000 });
    await page2.waitForLoadState("domcontentloaded");
    await expect(page2.getByText('Denied: Invitation was completed.')).toBeVisible({ timeout: 10000 });
    await page.close();
});


// BASE79
    test('BASE79 Re-send the org invitation by the internal user', async ({ page , browser}) => {
    const orgName = 'auto-org8' + Date.now() + '@mailinator.com';
    const domainName = 'https://domain' + Date.now() + '.com';
    const emailComponent = new EmailComponents(page);
    const loginComponents = new LoginComponents(page);
    
    // 1.Login as an Internal User account 
    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    
    // 2.Click Organizations
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    
    // 3.Click the INVITE ORGANIZATION button
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();

    // 4.Fill out the information and click the INVITE button
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(orgName);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    //Have the pop-up “The invitation has been sent.”
    await expect(page.getByText('The invitation has been sent.')).toBeVisible(); 
    await page.getByRole('button', {name: 'OK'}).click();

    // 5.Check the invited individual mail
    await emailComponent.deleteEmail(title, orgName);

    // 6.Move to the  Organization Invites
    await page.goto('/organisations');
    await page.getByRole('tab', { name: 'Organization Invites' }).click();
    await expect(page.locator(`//td[text()='${orgName}']//following-sibling::td//button[not(contains(@class,'icon-danger'))]`)).toBeVisible();

    // 7.Click on the resend button
    await page.locator(`//td[text()='${orgName}']/following-sibling::td//button[not(contains(@class,'icon-danger'))]`).click();
    //Have this pop-up “Are you sure you want to resend the invitation?” after clicking on the resend button
    await expect(page.getByText('Are you sure you want to resend the invitation?')).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    //Have the confirmation pop-up “The invitation has been resent.” 
    await expect(page.getByText('The invitation has been resent.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    //After clicking OK and the invitation remains unchanged
    await expect(page.locator(`//td[text()='${orgName}']//following-sibling::td//button[not(contains(@class,'icon-danger'))]`)).toBeVisible();
    
    // 8.Check the invited individual mail
    //There is second mail invitation in the invited individual mail
    await emailComponent.selectEmail(title, orgName);
    
    // 9.Click on the REGISTER button
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' }).click();
    const page2 = await page1Promise;
    await page2.waitForLoadState("load");
    await page2.waitForSelector("#organisationFormalName");
    await page2.getByPlaceholder('Password', { exact: true }).fill('12345678aA@');
    await page2.getByPlaceholder('Password Confirm').fill('12345678aA@');
    await page2.getByRole('button', { name: 'Submit' }).click();
    await page2.waitForLoadState("domcontentloaded");
    await page2.waitForURL("**/dashboard")
    await expect(page2.getByText('The invitation has been accepted.')).toBeVisible();
    await page2.getByRole('button',{ name: 'OK'}).click();
    //After finishing the registration form users will be moved to the Home page
    await expect(page2).toHaveURL(new RegExp('.*dashboard.*'))
    
    // 10. Login to the newly created user and go through the pages for checking
    await navigateToUrl(page, "/");
    await page.waitForLoadState('load');
    await loginComponents.LogOut('auto');
    await page.getByPlaceholder('Email').fill(orgName);
    await page.getByPlaceholder('Password').fill(process.env.ORGADMINPASSWORD!);
    await page.getByRole('button', { name: 'Log in' }).click();
    //After login page users will be moved to the Home page
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await page.getByRole('menuitem', { name: 'Forms' }).locator('svg').click();
    await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click();
    //Core page will be opened
    await expect(page).toHaveURL(new RegExp('.*data-set.*'));
    await page.getByRole('menuitem', { name: 'auto' }).getByRole('img').click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    //Profile page will be opened
    await expect(page.locator('#root').getByText(orgName)).toBeVisible();
    await page.close();
    await page2.close();
});

// BASE76
test('Check the CANCEL function the invite org by the internal users', async ({ page }) => {

    const orgName = 'auto-org9' + Date.now() + '@mailinator.com';
    const domainName = 'https://auto7' + Date.now() + '.com';
    const loginComponents = new LoginComponents(page);
    const name = 'auto5' + Date.now() + '@mailinator.com';

    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(name);
    await page.getByPlaceholder('Formal Name').fill(name);
    await page.getByPlaceholder('Display Name').fill(name);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(new RegExp('.*organisations.*'));
    await page.close();
});

// BASE77
test('Check the breadcrumb in organization page', async ({ page }) => {
    const orgName = 'auto-org10' + Date.now() + '@mailinator.com';
    const loginComponents = new LoginComponents(page);
    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    await page.getByRole('link', { name: 'Organizations' }).click();
    await expect(page).toHaveURL(new RegExp('.*organisations.*'));
    await page.close();
    await page.close();
});

// BASE78
test('BASE78 Delete the org invitation by the internal user', async ({ page }) => {
    const orgName = 'auto-org7' + Date.now() + '@mailinator.com';
    const domainName = 'https://domain' + Date.now() + '.com';
    const loginComponents = new LoginComponents(page);
    const emailComponent = new EmailComponents(page);

    // 1.Login as an Internal User account 
    await loginComponents.LoginWithCustomParams(process.env.PLATFORMADMINUSERNAME, process.env.PLATFORMADMINPASSWORD);
        
    // 2.Click Organizations
    await page.getByRole('menuitem', { name: 'Organizations' }).click();
    
    // 3.Click the INVITE ORGANIZATION button
    await page.getByRole('button', { name: 'Invite Organization' }).click();
    
    // 4.Fill out the information and click the INVITE button
    await page.getByLabel('Title').click();
    await page.getByTitle('Mr', { exact: true }).getByText('Mr').click();
    await page.getByPlaceholder('First Name').fill('auto');
    await page.getByPlaceholder('Middle Name').fill('auto');
    await page.getByPlaceholder('Last Name').fill('auto');
    await page.getByPlaceholder('Email').fill(orgName);
    await page.getByPlaceholder('Formal Name').fill(orgName);
    await page.getByPlaceholder('Display Name').fill(orgName);
    await page.getByPlaceholder('https://example.com').fill(domainName);
    await page.getByRole('button', { name: 'Invite' }).click();
    //Have the pop-up “The invitation has been sent.”
    await expect(page.getByText('The invitation has been sent.')).toBeVisible(); 
    await page.getByRole('button', {name: 'OK'}).click();

    // 5.Move to the Organization Invites
    await page.getByRole('tab', { name: 'Organization Invites' }).click();
    //Can see the invitation in the Organizations Invites with the re-send and delete button
    await expect(page.locator(`//td[text()='${orgName}']//following-sibling::td//button[not(contains(@class,'icon-danger'))]`)).toBeVisible();
    await expect(page.locator(`//td[text()='${orgName}']//following-sibling::td//button[contains(@class,'icon-danger')]`)).toBeVisible();
    
    // 6.Click on the delete button
    await page.locator(`//td[text()='${orgName}']/following-sibling::td//button[contains(@class,'icon-danger')]`).click();
    await expect(page.getByText('Are you sure you want to cancel the invitation?')).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    //Have the delete confirmation pop-up “The invitation has been canceled.” 
    await expect(page.getByText('The invitation has been cancelled.')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    //After clicking OK and the invitation disappears
    await expect(page.locator(`//td[text()='${orgName}']//following-sibling::td//button[not(contains(@class,'icon-danger'))]`)).toBeHidden();
    // 7.Check the invited individual mail
    await emailComponent.selectEmail(title, orgName);
    const page1Promise = page.waitForEvent('popup');

    // 8.Click on the REGISTER button
    await page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'REGISTER' }).click();
    const page2 = await page1Promise;
    await page2.waitForLoadState("load");
    //The new tab will open and show the warning “Denied: Invitation has been archived.”
    await expect(page2.getByText('Denied: Invitation has been archived.')).toBeVisible();
    await page2.getByRole('button', { name: 'OK' }).click(); 
    await page.close();
    await page2.close();
});