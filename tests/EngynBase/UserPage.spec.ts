// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/1933705299/Engyn+Base+-+Test+Suites+-+User+tab

import { test, expect, Page } from '@playwright/test';
import { EmailComponents } from '../../page/emailComponent';
import { EngynNavigation } from '../../page/EngynNavigation';
import { LoginComponents } from '../../page/loginComponent';

// async function navigateToUrl(page: Page, url: string): Promise<void> {
//     async function gotoURL(msg) {
//         if (msg.type() === 'error') {
//             await page.waitForLoadState('load');
//             console.error(`Error logged: ${msg.text()}`);
//             console.log('Reloading page...');
//             await page.goto(url);
//             console.log('Finish loading page...');
//         }
//     }
//     page.on('console', gotoURL);

//     console.log('Starting the page...');
//     await page.goto(url);
//     await page.waitForLoadState('load');

//     page.removeListener('console', gotoURL);
// }

const MAX_RETRIES = 10;
let retryCount = 0;

async function navigateToUrl(page: Page, url: string): Promise<void> {
    try {
        await page.goto(url, { timeout: 40000 });
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

//BASE42
test('Verify admin is able to delete manager in org', async ({ browser }) => {
    const email = 'Flynk42' + Date.now() + '@mailinator.com';
    const role = 'Manager';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.NavigateToUserPage(adminPage);
    await engynNavigation.InviteUser('Manager', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);
    await userPage.getByPlaceholder('Enter your full name').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await adminPage.reload();
    await adminPage.getByPlaceholder('Search').fill(email);
    await adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button').click();
    await adminPage.getByRole('button', { name: 'Yes' }).click();
    await expect(adminPage.getByText('The user has been deleted successfully!')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.reload();
    await expect(adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button')).not.toBeVisible();

    await adminPage.close();
    await userPage.close();
});

//BASE42.1
test('Verify admin is able to delete admin in org', async ({ browser }) => {
    const email = 'Flynk421' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.NavigateToUserPage(adminPage);
    await engynNavigation.InviteUser(role, email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByPlaceholder('Enter your full name').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await adminPage.reload();
    await adminPage.getByPlaceholder('Search').fill(email);
    await adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button').click();
    await adminPage.getByRole('button', { name: 'Yes' }).click();
    await expect(adminPage.getByText('The user has been deleted successfully!')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.reload();
    await expect(adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button')).not.toBeVisible();

    await adminPage.close();
    await userPage.close();
    await expect(async () => {
    }).toPass({ timeout: 300000, intervals: [1000, 2000, 3000] });
});

//BASE42.2
test('Verify admin is able to delete Member in org', async ({ browser }) => {
    const email = 'Flynk422' + Date.now() + '@mailinator.com';
    const role = 'Member';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.NavigateToUserPage(adminPage);
    await engynNavigation.InviteUser(role, email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);
    //
    //
    //
    await userPage.getByPlaceholder('Enter your full name').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await adminPage.reload();
    await adminPage.getByPlaceholder('Search').fill(email);
    await adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button').click();
    await adminPage.getByRole('button', { name: 'Yes' }).click();
    await expect(adminPage.getByText('The user has been deleted successfully!')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.reload();
    await expect(adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button')).not.toBeVisible();
    await adminPage.close();
    await userPage.close();
});

//BASE43
test('Verify Manager is able to delete Member in org', async ({ browser }) => {
    const email = 'Flynk43' + Date.now() + '@mailinator.com';
    const role = 'Member';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const managerContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const managerPage = await managerContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(managerPage);
    const engynNavigation = new EngynNavigation(managerPage);
    const emailComponents = new EmailComponents(userPage);
    await loginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(managerPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', "Manager");
    await engynNavigation.NavigateToUserPage(managerPage);
    await engynNavigation.InviteUser(role, email);
    await expect(managerPage.getByText('The invitation has been sent')).toBeVisible();
    await managerPage.getByRole('button', { name: 'OK' }).click();
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);
    //
    //
    //
    await userPage.getByPlaceholder('Enter your full name').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await managerPage.reload();
    await managerPage.getByPlaceholder('Search').fill(email);
    await managerPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button').click();
    await managerPage.getByRole('button', { name: 'Yes' }).click();
    await expect(managerPage.getByText('The user has been deleted successfully!')).toBeVisible();
    await managerPage.getByRole('button', { name: 'OK' }).click();
    await managerPage.reload();
    await expect(managerPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button')).not.toBeVisible();
    await managerPage.close();
    await userPage.close();
});

//BASE44
test('Verify Manager is unable to delete Admin in org', async ({ browser }) => {
    // Create two isolated browser contexts
    const managerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const managerPage = await managerContext.newPage();
    const loginComponents = new LoginComponents(managerPage);
    const engynNavigation = new EngynNavigation(managerPage);
    await loginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(managerPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Manager');
    await engynNavigation.NavigateToUserPage(managerPage);
    await managerPage.getByPlaceholder('Search').fill("Flynk Delete Adm");
    const email = 'flynkdeleteadmi@mailinator.com';
    await managerPage.locator(`//td[text()='${email}']//following-sibling::td[contains(@class,'button-action')]`).hover();
    await expect(managerPage.getByText("You don't have permission to remove this user")).toBeVisible();
    await managerPage.close();
});
      
//BASE45
test('Verify Member is unable to delete any other users in org', async ({ page, browserName }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    let enableListener = true;
    page.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            page.reload();
        }
    });
    enableListener = false
    await loginComponents.LoginWithCustomParams(process.env.MEMBERDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    enableListener = true
    await engynNavigation.ChangeOrg(page, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Member');
    await engynNavigation.NavigateToUserPage(page);
    await page.getByPlaceholder('Search').fill("Flynk Delete Adm");
    const email1 = 'flynkdeleteadmi@mailinator.com';
    await page.locator(`//td[text()='${email1}']//following-sibling::td[contains(@class,'button-action')]`).hover();
    await expect(page.getByText("You don't have permission to remove this user")).toBeVisible();
    await page.reload();
    enableListener = false;
    await page.getByPlaceholder('Search').fill("Flynk Delete Manager");
    const email2 = 'flynkdeletemngr@mailinator.com';
    await page.locator(`//td[text()='${email2}']//following-sibling::td[contains(@class,'button-action')]`).hover();
    await expect(page.getByText("You don't have permission to remove this user")).toBeVisible();
    await page.reload();

    await page.getByPlaceholder('Search').fill("Flynk Delete Member 2");
    const email3 = 'flynkdeletemmbr2@mailinator.com';
    await page.locator(`//td[text()='${email3}']//following-sibling::td[contains(@class,'button-action')]`).hover();
    await expect(page.getByText("You don't have permission to remove this user")).toBeVisible();

    await page.close();
});

//BASE46
test('Verify Manager is unable to delete Manager in org', async ({ browser, browserName }) => {
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();
    let enableListener = true
    const listenForError = (page, myFunc) => {
        page.on('requestfailed', async (err) => {
            if (enableListener && browserName == 'webkit') {
                console.log('An error occurred:', err.message);
                myFunc(); // Call your dynamic function here, passing the `page` object as a parameter
            }
        });
    };

    let myFunction = () => {
        managerPage.reload();
    }

    listenForError(managerPage, myFunction);

    const loginComponents = new LoginComponents(managerPage);
    const engynNavigation = new EngynNavigation(managerPage);
    await loginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(managerPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Manager');
    await managerPage.goto('/members');
    await managerPage.getByPlaceholder('Search').fill("Flynk Delete Manager 2");
    const email = 'flynkdeletemngr2@mailinator.com';
    await managerPage.locator(`//td[text()='${email}']//following-sibling::td[contains(@class,'button-action')]`).hover();
    await expect(managerPage.getByText("You don't have permission to remove this user")).toBeVisible();
    
    await managerPage.close();
});

//BASE47 
test('Verify self-removal in user tab', async ({ browser, browserName }) => {
    const email = 'Flynk47' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.NavigateToUserPage(adminPage);
    await adminPage.waitForTimeout(3000);
    await engynNavigation.InviteUser(role, email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    const emailComponents = new EmailComponents(userPage);
    const userPageEngynNavigation = new EngynNavigation(userPage);
    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);
    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/');
    await userPageEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    enableListener = true;
    await userPage.goto('/members');
    enableListener = false;
    await userPage.getByPlaceholder('Search').fill(email);
    await userPage.getByRole('row', { name: 'Flynk ' + email + ' ' + role + ' Enabled' }).getByRole('button').click();
    await expect(userPage.getByText('Do you want to remove this user?')).toBeVisible();
    await userPage.getByRole('button', { name: 'Yes' }).click();
    await expect(userPage.getByText('The user has been deleted successfully!')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.reload();
    await expect(adminPage.getByRole('row', { name: email + ' ' + role + ' Enabled' }).getByRole('button')).not.toBeVisible();
    await adminPage.close();
    await userPage.close();
})

//BASE49 - Waiting for search function in user page
test('Check send invite the non-existed account by admin account (admin role)', async ({ browser, browserName }) => {
    const email = 'Flynk49' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    //enableListener = true;
    await userPage.waitForTimeout(2000);
    //
    //
    //
    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
});

//BASE 50- Waiting for search function in user page
test('Check send invite (Manager) + resend the non-existed account', async ({ browser, browserName }) => {
    const email = 'Flynk50' + Date.now() + '@mailinator.com';
    const role = 'Member';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    await loginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Manager');
    await adminPage.waitForTimeout(2000);
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.waitForLoadState('networkidle');
    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    //enableListener = true;
    await userPage.waitForTimeout(2000);

    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
});

//BASE51
test(' Verify that member cannot see the Registration Invite tab, Role Invite tab, and INVITE USER button', async ({ page, browserName }) => {
    const engynNavigation = new EngynNavigation(page);
    const loginComponents = new LoginComponents(page);
    let enableListener = true;
    page.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            page.reload();
        }
    });
    await loginComponents.LoginWithCustomParams(process.env.MEMBERDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Member');
    await page.goto('/members');
    enableListener = false;
    await expect(page.getByText('Registration Invites')).not.toBeVisible();
    await expect(page.getByText('INVITE USER')).not.toBeVisible();
    await expect(page.getByText('Role Invites')).not.toBeVisible();
    await page.close();
});

//BASE52
test('Check send invite with role (Admin) + the existing account', async ({ browser, browserName }) => {
    const role = 'Admin';
    const title = 'Admin Role Invitation Email';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const registerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const registerPage = await registerContext.newPage();
    const loginComponents2 = new LoginComponents(registerPage);
    const email = await loginComponents2.RegisterPersonalAccount();
    await registerPage.close();

    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await expect(userPage.getByText('The role invitation has been accepted.')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.getByRole('button', { name: 'Back to Home' }).click();

    await userPage.getByPlaceholder('Email').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Log in' }).click();

    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
});

//BASE53- Waiting for search funtion in user page
test('Check send invite (Manager)+ the existing account', async ({ browser, browserName }) => {
    //const email = 'Flynk49' + Date.now() + '@mailinator.com';
    const role = 'Member';
    const title = 'Member Role Invitation Email';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const registerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const registerPage = await registerContext.newPage();
    const loginComponents2 = new LoginComponents(registerPage);
    const email = await loginComponents2.RegisterPersonalAccount();
    await registerPage.close();

    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });

    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);

    await loginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Manager');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()


    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await expect(userPage.getByText('The role invitation has been accepted.')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.getByRole('button', { name: 'Back to Home' }).click();

    await userPage.getByPlaceholder('Email').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Log in' }).click();

    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
});

//BASE54
test(' Verify error when re-accepting a successful role invitation from Admin with existing user', async ({ browser }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const role = 'Admin';
    const title = 'Admin Role Invitation Email';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    const email = await userLoginComponents.RegisterPersonalAccount();
    await adminLoginComponents.LoginAsAdmin();
    await engynNavigation.InviteUser(role, email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.bringToFront();
    await userPage.goto('/');
    await expect(userPage).toHaveTitle(/Dashboard/);
    const url = await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(1000);
    await userPage.goto(url);

    await expect(userPage.getByText('Invitation not found')).toBeVisible();
    await adminPage.close();
    await userPage.close();
});

//BASE55
test('Verify error when re-accepting a successful role invitation from Manager with existing user', async ({ browser }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const role = 'Member';
    const title = 'Member Role Invitation Email';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    const email = await userLoginComponents.RegisterPersonalAccount();
    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await engynNavigation.InviteUser(role, email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.bringToFront();
    await userPage.goto('/');
    await expect(userPage).toHaveTitle(/Dashboard/);
    const url = await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(1000);

    await userPage.goto(url);
    await expect(userPage.getByText('Invitation not found')).toBeVisible();
    await adminPage.close();
    await userPage.close();
});

//BASE56 - No longer applicable
// test('Verify error when re-accepting a successful role invitation from (Admin) with non-existing user', async ({ browser , browserName}) => {
//     // Create two isolated browser contexts
//     const adminContext = await browser.newContext();
//     //const userContext = await browser.newContext();
//     // Create pages and interact with contexts independently
//     const adminPage = await adminContext.newPage();
//     //const userPage = await userContext.newPage();
//     const userPage = await adminContext.newPage();
//     const role = 'Member';
//     const email = 'Flynk56' + Date.now() + '@mailinator.com';
//     const title = 'Engyn Invitation';
//     const engynNavigation = new EngynNavigation(adminPage);
//     const userEmailComponents = new EmailComponents(userPage);
//     const adminLoginComponents = new LoginComponents(adminPage);
//     const userLoginComponents = new LoginComponents(userPage);
//     let enableListener = true;
//     adminPage.on('requestfailed', () => {
//         if (enableListener && browserName == 'webkit') {
//             adminPage.reload();
//         }
//     });

//     userPage.on('requestfailed', () => {
//         if (enableListener && browserName == 'webkit') {
//             userPage.reload();
//         }
//     });
//     await adminLoginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
//     await adminPage.waitForLoadState('load');
//     await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Admin Manager');
//     await adminPage.getByText('Settings').click();
//     await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
//     await adminPage.getByRole('button', { name: 'Invite User' }).click()
//     await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
//     await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
//     await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
//     await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
//     await adminPage.reload();

//     await engynNavigation.InviteUser(role, email);
//     enableListener = false;
//     const url = await userEmailComponents.selectEmail2(title, email);
//     enableListener = true;
//     await userPage.waitForTimeout(2000);

//     await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
//     await userPage.getByPlaceholder('Password').fill('12345678aA@');
//     await userPage.getByRole('button', { name: 'Enter' }).click();
//     await expect(userPage).toHaveTitle(/Dashboard/);

//     await expect(async () => {
//         //await userPage.goto(url);
//         await navigateToUrl(userPage, url);
//         await expect(userPage.getByText('Denied: Invitation was completed.')).toBeVisible();
//     }).toPass({ timeout: 120000, intervals: [1000, 2000, 3000] });
//     await adminPage.close();
//     await userPage.close();
// })

//BASE57 - No longer applicable
// test('Verify error when re-accepting a successful role invitation from (Manager) with non-existing user', async ({ browser, browserName }) => {
//     // Create two isolated browser contexts
//     const adminContext = await browser.newContext();
//     //const userContext = await browser.newContext();
//     // Create pages and interact with contexts independently
//     const adminPage = await adminContext.newPage();
//     //const userPage = await userContext.newPage();
//     const userPage = await adminContext.newPage();
//     const role = 'Member';
//     const email = 'Flynk57' + Date.now() + '@mailinator.com';
//     const title = 'Engyn Invitation';
//     const engynNavigation = new EngynNavigation(adminPage);
//     const userEmailComponents = new EmailComponents(userPage);
//     const adminLoginComponents = new LoginComponents(adminPage);
//     const userLoginComponents = new LoginComponents(userPage);
//     let enableListener = true;

//     adminPage.on('requestfailed', () => {
//         if (enableListener && browserName == 'webkit') {
//             adminPage.reload();
//         }
//     });

//     userPage.on('requestfailed', () => {
//         if (enableListener && browserName == 'webkit') {
//             userPage.reload();
//         }
//     });
//     enableListener = false;
//     await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
//     enableListener = true;

//     await adminPage.waitForLoadState('load');
//     await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
//     await adminPage.getByText('Settings').click();
//     await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
//     await adminPage.getByRole('button', { name: 'Invite User' }).click()
//     await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
//     await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
//     await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
//     await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
//     await adminPage.reload();

//     await engynNavigation.InviteUser(role, email);
//     enableListener = false;
//     const url = await userEmailComponents.selectEmail2(title, email);
//     enableListener = true;
//     await userPage.waitForTimeout(2000);
//     await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
//     await userPage.getByPlaceholder('Password').fill('12345678aA@');
//     await userPage.getByRole('button', { name: 'Enter' }).click();
//     await expect(userPage).toHaveTitle(/Dashboard/);

//     await userPage.goto(url);
//     await expect(userPage.getByText('Denied: Invitation was completed.')).toBeVisible();
//     await adminPage.close();
//     await userPage.close();
// })

//BASE58
test('Verify one user can be invited to multiple roles within one org', async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const role = 'Member';
    const title = 'Engyn Invitation';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    enableListener = false;
    const email = await userLoginComponents.RegisterPersonalAccount();
    enableListener = true;
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Admin Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    await engynNavigation.InviteUser('Manager', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();

    await expect(adminPage.getByRole('cell', { name: email }).nth(3)).toBeVisible();
    await expect(adminPage.getByRole('cell', { name: email }).nth(1)).toBeVisible();

    //await expect(adminPage.getByRole('row', { name: email + ' Member RESEND' }).getByRole('cell', { name: email })).toBeVisible();

    await adminPage.close();
    await userPage.close();
})

//BASE59
test('Verify the warning when sending role invitation to user who already has the role (Admin)', async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const role = 'Member';
    const title = 'Member Role Invitation Email';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    enableListener = false;
    const email = await userLoginComponents.RegisterPersonalAccount();
    enableListener = true;
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Admin Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email }).nth(1)).toBeVisible();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.getByRole('button', { name: 'OK' }).click();

    enableListener = true
    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('Invalid Operation: Receiver already has Role Organisation Member in organisation')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    await userPage.close();
    await adminPage.close();
})

//BASE60
test('Verify the warning when sending role invitation to user who already has the role (Manager)', async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const role = 'Member';
    const title = 'Member Role Invitation Email';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    enableListener = false;
    const email = await userLoginComponents.RegisterPersonalAccount();
    enableListener = true;
    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email }).nth(1)).toBeVisible();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.getByRole('button', { name: 'OK' }).click();

    enableListener = true
    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('Invalid Operation: Receiver already has Role Organisation Member in organisation')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();


    await userPage.close();
    await adminPage.close();
})

//BASE61
test('Verify the warning when sending role invitation to user who already have the role (non-existing user) (Admin)', async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const email = 'Flynk61' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Admin Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);



    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    enableListener = true

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('Invalid Operation: Receiver already has Role Organisation Member in organisation')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    await userPage.close();
    await adminPage.close();
})

//BASE62
test('Verify the warning when sending role invitation to user who already has the role (non-existing user) (Manager)', async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const email = 'Flynk62' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);



    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    enableListener = true

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('Invalid Operation: Receiver already has Role Organisation Member in organisation')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    await userPage.close();
    await adminPage.close();
})

//BASE65
test("Verify delete in registration invites with admin account", async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const email = 'Flynk65' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Admin Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();
    await adminPage.getByRole('row', { name: email + ' Member RESEND' }).getByRole('button').nth(1).click();
    await adminPage.getByRole('button', { name: 'Yes' }).click();
    await expect(adminPage.getByText('The invitation has been canceled.')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);



    await expect(userPage.getByText('Denied: Invitation was cancelled.')).toBeVisible();

    await userPage.close();
    await adminPage.close();
})

//BASE66
test("Verify delete in registration invites with manager account", async ({ browser, browserName }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;

    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.reload();
        }
    });
    const email = 'Flynk66' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);
    const adminLoginComponents = new LoginComponents(adminPage);
    const userLoginComponents = new LoginComponents(userPage);
    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await adminPage.waitForTimeout(2000);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).not.toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).not.toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();

    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();
    await adminPage.getByRole('row', { name: email + ' Member RESEND' }).getByRole('button').nth(1).click();
    await adminPage.getByRole('button', { name: 'Yes' }).click();
    await expect(adminPage.getByText('The invitation has been canceled.')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);



    await expect(userPage.getByText('Denied: Invitation was cancelled.')).toBeVisible();

    await userPage.close();
    await adminPage.close();
})

//BASE67
test("Check the breadcrumb in the users tab", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);

    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await adminPage.getByText('Settings').click();
    await adminPage.getByRole('menuitem', { name: 'Users' }).getByText('Users').click();
    await adminPage.getByRole('link', { name: 'Home' }).click();
    await expect(adminPage).toHaveURL(new RegExp('.*dashboard.*'));
    await adminPage.close();
})

//BASE78
test("Check the search function in the user tab", async ({ browser, browserName }) => {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    const registerContext = await browser.newContext();
    const registerPage = await registerContext.newPage();

    const loginComponents2 = new LoginComponents(registerPage);

    const title = 'Member Role Invitation Email';
    const name = 'FlynkTest' + Date.now();
    const email = await loginComponents2.RegisterPersonalAccount(name);
    await registerPage.close();

    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.reload();
        }
    });
    const adminLoginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const userEmailComponents = new EmailComponents(userPage);

    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERDELETEUSERNAME, process.env.MANAGERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Automation', 'Flynk Delete Organization', 'Manager');
    await engynNavigation.InviteUser('Member', email);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    const url = await userEmailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.goto(url);
    await userPage.getByRole('button', { name: 'OK' }).click();

    await adminPage.goto('/members');
    await adminPage.getByPlaceholder('Search').click();
    // check if the blinking cursor is appearing in a search bar 
    await adminPage.getByPlaceholder('Search').focus();
    await expect(adminPage.getByPlaceholder('Search')).toBeVisible();
    await adminPage.getByPlaceholder('Search').fill(name);
    await expect(adminPage.getByRole('cell', { name: name })).toBeVisible();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();
    await expect(adminPage.getByText('Member')).toBeVisible();
    await expect(adminPage.getByText('Enabled')).toBeVisible();
    await expect(adminPage.getByRole('row', { name: name + ' ' + email + ' Member Enabled' }).getByRole('button')).toBeVisible();

    await adminPage.getByPlaceholder('Search').fill('');
    await adminPage.keyboard.press('Tab');
    //This function will wait until the sencond email is sent
    await adminPage.waitForFunction(
        () => {
            const elements = document.querySelectorAll("td:nth-child(4) > div > div:nth-child(2)");
            return elements.length >= 10;
        },
        { timeout: 5000, polling: 1000 }
    ).catch(() => {
        throw new Error("Failed to find at least 17 matching elements.");
    });

    await adminPage.getByPlaceholder('Search').fill(email);
    await expect(adminPage.getByRole('cell', { name: name })).toBeVisible();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();
    await expect(adminPage.getByText('Member')).toBeVisible();
    await expect(adminPage.getByText('Enabled')).toBeVisible();
    await expect(adminPage.getByRole('row', { name: name + ' ' + email + ' Member Enabled' }).getByRole('button')).toBeVisible();

    await adminPage.getByPlaceholder('Search').fill('');
    await adminPage.getByPlaceholder('Search').fill('fnkwjenfwef');
    await expect(adminPage.getByText('No data')).toBeVisible();

    await userPage.close();
    await adminPage.close();
})

//BASE79
test("Check send invite for the Manager role + the existing account", async ({ browser, browserName }) => {
    const role = 'Manager';
    const title = 'Manager Role Invitation Email';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const registerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const registerPage = await registerContext.newPage();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    //Create an email
    const loginComponents2 = new LoginComponents(registerPage);
    const email = await loginComponents2.RegisterPersonalAccount();
    await registerPage.close();

    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.waitForLoadState('networkidle');
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.waitForLoadState('networkidle');
            userPage.reload();
        }
    });
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await expect(userPage.getByText('The role invitation has been accepted.')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.getByRole('button', { name: 'Back to Home' }).click();
    await userPage.getByPlaceholder('Email').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Log in' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members');

    await userPage.close();
    await adminPage.close();
})

//BASE80
test("Check send invite for the Member role by the admin account + existing account", async ({ browser, browserName }) => {
    const role = 'Member';
    const title = 'Member Role Invitation Email';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const registerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const registerPage = await registerContext.newPage();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    //Create an email
    const loginComponents2 = new LoginComponents(registerPage);
    const email = await loginComponents2.RegisterPersonalAccount();
    await registerPage.close();

    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.waitForLoadState('networkidle');
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.waitForLoadState('networkidle');
            userPage.reload();
        }
    });
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.ADMINDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await expect(userPage.getByText('The role invitation has been accepted.')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.getByRole('button', { name: 'Back to Home' }).click();
    await userPage.getByPlaceholder('Email').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Log in' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members');

    await userPage.close();
    await adminPage.close();
})

//BASE81
test("Check send invite the non-existed account by admin account(manager role) + non-existing account", async ({ browser, browserName }) => {
    const email = 'Flynk81' + Date.now() + '@mailinator.com';
    const role = 'Manager';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    let enableListener = true;
    adminPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.waitForLoadState('networkidle');
            adminPage.reload();
        }
    });

    userPage.on('requestfailed', () => {
        if (enableListener && browserName == 'webkit') {
            userPage.waitForLoadState('networkidle');
            userPage.reload();
        }
    });

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await navigateToUrl(adminPage, "/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
})

//BASE82
test("Check send invite the non-existed account by admin account(member role) + non-existing account", async ({ browser, browserName }) => {
    const email = 'Flynk82' + Date.now() + '@mailinator.com';
    const role = 'Member';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    let enableListener = true;
    adminPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.waitForLoadState('networkidle');
            const url = adminPage.url();
            console.log(url);
            await adminPage.reload();
        }
    });

    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            await userPage.waitForLoadState('networkidle');
            const url = userPage.url();
            console.log(url);

            await userPage.reload();
            userPage.setDefaultNavigationTimeout
            userPage.setDefaultTimeout
        }
    });

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    //await navigateToUrl(adminPage, "/members");
    await adminPage.goto("/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);




    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            await userPage.waitForLoadState('networkidle');
            const url = userPage.url();
            console.log(url);

            await userPage.reload();
        }
        const isVisible = await userPage.isVisible("//h3[normalize-space()='Register']");

        if (isVisible) {
            // Element is visible, perform your action here
            console.log('Register heading title is visible!');
            // Do something
            await userPage.reload();
            await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
            await userPage.getByPlaceholder('Password').fill('12345678aA@');
            if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
                await userPage.getByPlaceholder('Enter your email address').fill(email);
            }
            await userPage.getByRole('button', { name: 'Enter' }).click();
        }
    });

    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    await userPage.goto('/members')
    await userPage.close();
    await adminPage.close();
})

//BASE83
test("Check the re-send invitation function for an existing user", async ({ browser, browserName }) => {
    const role = 'Admin';
    const title = 'Admin Role Invitation Email';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const registerContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const registerPage = await registerContext.newPage();
    const loginComponents2 = new LoginComponents(registerPage);
    const email = await loginComponents2.RegisterPersonalAccount();
    await registerPage.close();

    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    let enableListener = true;
    adminPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            adminPage.waitForLoadState('networkidle');
            const url = adminPage.url();
            console.log(url);
            await adminPage.reload();
        }
    });

    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            userPage.waitForLoadState('networkidle');
            const url = userPage.url();
            console.log(url);
            await userPage.reload();
        }
    });
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);

    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    //await navigateToUrl(adminPage, "/members");
    await adminPage.goto("/members");
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    enableListener = false;
    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    //Handle for step 8,Step: Log in to the individual Y mail --> Expected Result: Can see the registered mail there
    await userPage.goto('https://www.mailinator.com/v4/public/inboxes.jsp')
    await userPage.getByRole('textbox', { name: 'inbox field' }).fill(email)
    await userPage.getByRole('button', { name: 'GO' }).click()
    await expect(userPage.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`)).toBeVisible();

    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email }).nth(1)).toBeVisible();
    await adminPage.getByRole('row', { name: email + ' ' + role + ' RESEND' }).getByRole('button', { name: 'RESEND' }).click();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    //This function will wait until the sencond email is sent
    await userPage.waitForFunction(
        () => {
            const elements = document.querySelectorAll("td:nth-child(4)");
            return elements.length >= 4;
        },
        { timeout: 5000, polling: 1000 }
    ).catch(() => {
        throw new Error("Failed to find at least two matching elements.");
    });
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);

    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            await userPage.waitForLoadState('networkidle');
            const url = userPage.url();
            console.log(url);

            await userPage.reload();
        }
    });
    await expect(userPage.getByText('The role invitation has been accepted.')).toBeVisible();
    await userPage.getByRole('button', { name: 'OK' }).click();
    await userPage.getByRole('button', { name: 'Back to Home' }).click();

    await userPage.getByPlaceholder('Email').fill(email);
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    await userPage.getByRole('button', { name: 'Log in' }).click();

    await expect(userPage).toHaveTitle(/Dashboard/);
    //await userPage.goto('/members')
    await navigateToUrl(userPage, "/members")
    await adminPage.close();
    await userPage.close();
})

//BASE84
test("Check the re-send invitation function for a non-existing user", async ({ browser, browserName }) => {
    const email = 'Flynk84' + Date.now() + '@mailinator.com';
    const role = 'Admin';
    const title = 'Engyn Invitation';
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const loginComponents = new LoginComponents(adminPage);
    const engynNavigation = new EngynNavigation(adminPage);
    const emailComponents = new EmailComponents(userPage);
    let enableListener = true;
    adminPage.on('requestfailed', async (request) => {
        if (enableListener && browserName == 'webkit') {
            const url = adminPage.url();
            console.log(url);
            await adminPage.reload();
        }
    });

    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            const url = userPage.url();
            console.log(url);
            await userPage.reload();
        }
    });
    await loginComponents.LoginWithCustomParams(process.env.ADMINDELETEUSERNAME, process.env.MEMBERDELETEPASSWORD);
    await engynNavigation.ChangeOrg(adminPage, 'Flynk', 'Flynk Delete', 'Flynk Delete Organization', 'Admin');
    await adminPage.goto('/members');
    await adminPage.getByRole('button', { name: 'Invite User' }).click()
    await adminPage.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await expect(adminPage.getByTitle('Admin').getByText('Admin')).toBeVisible();
    await expect(adminPage.getByTitle('Manager').getByText('Manager')).toBeVisible();
    await expect(adminPage.getByTitle('Member').getByText('Member')).toBeVisible();
    await adminPage.getByLabel('Role').click()

    await engynNavigation.InviteUser(role, email);
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByText('The invitation has been sent')).toBeVisible();
    await adminPage.getByRole('button', { name: 'OK' }).click();

    enableListener = false;
    //Handle for step 8,Step: Log in to the individual Y mail --> Expected Result: Can see the registered mail there
    await userPage.goto('https://www.mailinator.com/v4/public/inboxes.jsp')
    await userPage.getByRole('textbox', { name: 'inbox field' }).fill(email)
    await userPage.getByRole('button', { name: 'GO' }).click()
    await expect(userPage.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`)).toBeVisible();

    await adminPage.getByRole('tab', { name: 'Role Invites' }).click();
    await expect(adminPage.getByRole('cell', { name: email })).toBeVisible();
    await adminPage.getByRole('row', { name: email + ' ' + role + ' RESEND' }).getByRole('button', { name: 'RESEND' }).click();
    await adminPage.getByRole('button', { name: 'OK' }).click();
    //This function will wait until the sencond email is sent
    await userPage.waitForFunction(
        () => {
            const elements = document.querySelectorAll("td:nth-child(4)");
            return elements.length === 2;
        },
        { timeout: 5000, polling: 1000 }
    ).catch(() => {
        throw new Error("Failed to find at least two matching elements.");
    });
    enableListener = false;
    await emailComponents.selectEmail2(title, email);
    await userPage.waitForTimeout(2000);



    userPage.on('requestfailed', async () => {
        if (enableListener && browserName == 'webkit') {
            await userPage.waitForLoadState('networkidle');
            const url = userPage.url();
            console.log(url);

            await userPage.reload();
        }
    });

    enableListener = true;
    await userPage.getByPlaceholder('Enter your full name').fill('Flynk');
    await userPage.getByPlaceholder('Password').fill('12345678aA@');
    if (await userPage.getByPlaceholder('Enter your email address').isVisible()) {
        await userPage.getByPlaceholder('Enter your email address').fill(email);
    }
    await userPage.getByRole('button', { name: 'Enter' }).click();
    await expect(userPage).toHaveTitle(/Dashboard/);
    enableListener = false;
    //await userPage.goto('/members')
    await navigateToUrl(userPage, "/members")
    await userPage.close();
    await adminPage.close();
})



