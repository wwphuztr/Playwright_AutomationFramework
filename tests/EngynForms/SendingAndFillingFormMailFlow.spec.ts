import { test, expect, Page, Browser } from '@playwright/test';
import { EmailComponents } from '../../page/emailComponent';
import { EngynNavigation } from '../../page/EngynNavigation';
import { FormControls } from '../../page/FormControl';
import { LoginComponents } from '../../page/loginComponent';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { GeneralComponent } from '../../page/generalComponent';

const form1 = 'form1';
const form2 = 'form2';

async function SentAnEmail(browser, email, quantityAttachedForm: number, watching?: string, emailTitle?: string) {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    let emailSubject
    if (typeof emailTitle !== 'undefined') {
        emailSubject = emailTitle
    }
    else {
        emailSubject = 'Email No67.' + Date.now();
    }
    const emailContent = 'Content67 ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 66;
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);

    // Login to Engyn with the first user and navigated to Forms
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();

    // Click on the Create Mail button 
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();

    // Click the added Form from Library
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    switch (quantityAttachedForm) {
        case 1:
            await adminPage.getByText(form1, { exact: true }).click();
            await adminPage.waitForTimeout(1000);
            // Click the Attach on the first mentioned form
            await adminPage.getByRole('button', { name: 'Attach' }).click();
            break;

        case 2:
            await adminPage.getByText(form1, { exact: true }).click();
            await adminPage.waitForTimeout(1000);
            // Click the Attach on the first mentioned form
            await adminPage.getByRole('button', { name: 'Attach' }).click();
            await adminPage.waitForTimeout(1000);
            await adminPage.getByText(form2, { exact: true }).click();
            await adminPage.waitForTimeout(1000);
            // Click the Attach on the first mentioned form
            await adminPage.getByRole('button', { name: 'Attach' }).click();
            break;
    }

    // Click Close
    await adminPage.locator("//span[normalize-space()='Close']").click();

    // Fill in the second mail user to the Recipient box 
    await expect(async () => {
        await adminPage.locator('#rc_select_0').clear()
        await adminPage.locator('#rc_select_0').fill(email);
        await adminPage.waitForTimeout(2000)
        if (email != 'flynkformsmember@mailinator.com') {
            await expect(adminPage.getByText(email)).toBeVisible()
        }
        else {
            await expect(adminPage.getByText('Forms Member')).toBeVisible()
        }
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });
    await adminPage.locator('#rc_select_0').press('Enter');
    //Fill email subject
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);

    // Add the watcher if watching argument is defind
    if (watching == 'watching') {
        await adminPage.locator('#rc_select_1').click()
        await adminPage.getByText('Forms Manager').click()
        await adminPage.waitForTimeout(2000)
    }

    // Click Sent 
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    // Verify if email sent
    await adminPage.getByRole('tab', { name: 'Sent' }).click();

    // Sender will be navigated to the inbox tab
    await expect(adminPage).toHaveURL(new RegExp('.*mail-box.*'))
    // The pop-up “Submit form request email has been sent” appears on the right corner
    await expect(adminPage.getByText('Submit form request email has been sent')).toBeVisible()
    // The completed sent mail will stay at the top of the Sent tab with the correct time --> NOT AUTOMATED

    await expect(async () => {
        await adminPage.reload()
        await expect(adminPage.getByRole('heading', { name: emailSubject, exact: true }).first()).toBeVisible();
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });
    await adminPage.close()

    return emailSubject;
}

//FORM15
test('Send mail to existing user recipients by entering exact email in search bar', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Form Mail' }).click();
    await page.getByRole('button', { name: 'Create Mail' }).click();
    await page.locator('#rc_select_0').click();
    await page.locator('#rc_select_0').fill('flynkformsmember@mailinator.com');
    await page.locator('#rc_select_0').press('Enter');
    await page.locator('#rc_select_0').click();
    await page.locator('#rc_select_0').fill('flynkformsmanager@mailinator.com');
    await page.locator('#rc_select_0').press('Enter');
    await page.getByRole('button', { name: '+ Add Form from Library' }).click();
    await page.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await page.waitForTimeout(1500);
    await page.getByText('form1', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Attach' }).click();
    await page.waitForTimeout(1000);
    await page.getByText(form2).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Attach' }).click();
    await page.waitForTimeout(1000);
    //await page.locator('div').filter({ hasText: /^Attached FormsSend Requests FormSecond Form Requests FormClose$/ }).getByRole('button', { name: 'Close' }).click();
    await page.locator("//span[normalize-space()='Close']").click();
    await page.getByPlaceholder('Subject').click();
    await page.getByPlaceholder('Subject').fill(emailSubject);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('tab', { name: 'Sent' }).click();
    await expect(page.getByRole('heading', { name: emailSubject })).toBeVisible();
    await page.close();
})

//FORM16
test('Fill form request as an existing user in Form Mail', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill('flynkformsmember@mailinator.com');
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByText(form2).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.locator("//span[normalize-space()='Close']").click();
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    const userLoginComponents = new LoginComponents(userPage);
    const userEngynNavigation = new EngynNavigation(userPage);
    await userLoginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await userEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Forms', 'Flynk Forms Org', ' Member');
    await userEngynNavigation.NavigateToFormsPage(userPage);
    await userPage.getByRole('heading', { name: emailSubject }).click();
    await expect(userPage.getByText(form1, { exact: true })).toBeVisible();
    await expect(userPage.getByText(form2)).toBeVisible();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByText(form2).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByRole('button', { name: 'EXIT' }).click();
    await userPage.getByRole('link', { name: 'My Forms' }).click();
    await userPage.getByRole('link').filter({ hasText: form2 }).first().click();
    await userPage.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await userPage.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: "Save" }).click();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage.getByText('Success', { exact: true }).click();
    await userPage.getByText('Submit successfully').click();
    await userEngynNavigation.NavigateToCorePage(userPage);
    await userPage.getByRole('link', { name: form1 + ' DataSet', exact: true }).click();
    await expect(userPage.getByRole('cell', { name: textEntry })).toBeVisible();
    await expect(userPage.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await userEngynNavigation.NavigateToCorePage(userPage);
    await userPage.getByRole('link', { name: form2 + ' DataSet' }).click();
    await expect(userPage.getByRole('cell', { name: textEntry })).toBeVisible();
    await expect(userPage.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await userPage.close();
    await adminPage.close();
})

//FORM27
test("Verify the form mail request link is disabled to edit", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    const email = 'flynk' + Date.now() + '@mailinator.com';
    let flag;
    adminPage.on('console', async (consoleMessage) => {
        if (consoleMessage.type() === 'error' && flag == true) {
            await adminPage.getByRole('button', { name: 'OK' }).click();
        }
    });
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    flag = true
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill(email);
    await adminPage.waitForTimeout(2000);
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    flag = false;
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.locator("//span[normalize-space()='Close']").click();
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);
    let userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByRole('button', { name: 'SUBMIT' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Submit successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await expect(userPage1.getByText('Successfully submitted')).toBeVisible();
    await expect(userPage1.getByText('Your form has been submitted successfully')).toBeVisible();
    await expect(userPage1.getByText('Sign up and create your forms with Engyn')).toBeVisible();
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    await expect(userPage1.getByText('DELETE')).toBeDisabled();
    await expect(userPage1.getByText('SAVE')).toBeDisabled();
    await expect(userPage1.getByRole('button', { name: 'Submit' })).toBeDisabled();
    await userPage.close();
    await userPage1.close();
    await adminPage.close();
})


//FORM18
test('Send form request to non-existing user', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    const email = 'flynk' + Date.now() + '@mailinator.com';
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill(email);
    await adminPage.waitForTimeout(2000);
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByText(form2).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.locator("//span[normalize-space()='Close']").click();
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByText(form2).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByRole('button', { name: 'SUBMIT' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Submit successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await expect(userPage1.getByText('Successfully submitted')).toBeVisible();
    await expect(userPage1.getByText('Your form has been submitted successfully')).toBeVisible();
    await expect(userPage1.getByText('Sign up and create your forms with Engyn')).toBeVisible();
    await userPage1.getByRole('button', { name: 'Sign Up' }).click();
    await userPage1.getByPlaceholder('Enter your full name').fill(email);
    await userPage1.getByPlaceholder('Password').fill('12345678aA@');
    await userPage1.getByRole('button', { name: 'Enter' }).click();
    await userPage.close();
    await userPage1.close();
    await adminPage.close();
})

//FORM25
test('Send mail to existing user not in the same org', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    //const email = process.env.MEMBERFORMSUSERNAME1
    const email = 'wtest1@mailinator.com'
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill(email);
    await adminPage.waitForTimeout(2000);
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await GeneralComponent.attachForms(adminPage, form1, form2);
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    const userLoginComponents = new LoginComponents(userPage);
    const userEngynNavigation = new EngynNavigation(userPage);
    await userLoginComponents.LoginWithCustomParams('wtest1@mailinator.com', '12345678aA@');
    //await userEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Forms', 'Flynk Forms Org 1', ' Member');
    await GeneralComponent.changePersonalOrg(userPage);
    await userEngynNavigation.NavigateToFormsPage(userPage);
    await userPage.getByRole('heading', { name: emailSubject }).click();
    await expect(userPage.getByText(form1, { exact: true })).toBeVisible();
    await expect(userPage.getByText(form2)).toBeVisible();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByText(form2).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByRole('button', { name: 'EXIT' }).click();
    await userPage.getByRole('link', { name: 'My Forms' }).click();
    await userPage.getByRole('link').filter({ hasText: form2 }).first().click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: "Save" }).click();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage.getByText('Success', { exact: true }).click();
    await userPage.getByText('Submit successfully').click();
    const adminNavigation = new EngynNavigation(adminPage);
    await adminNavigation.NavigateToCorePage(adminPage);
    await adminPage.getByRole('link', { name: form1 + ' DataSet', exact: true }).click();
    await expect(adminPage.getByRole('cell', { name: textEntry })).toBeVisible();
    await expect(adminPage.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await adminNavigation.NavigateToCorePage(adminPage);
    await adminPage.getByRole('link', { name: form2 + ' DataSet' }).click();
    await expect(adminPage.getByRole('cell', { name: textEntry })).toBeVisible();
    await expect(adminPage.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await adminPage.close();
    await userPage.close();
})

//FORM26
test('Fill form request in individual org', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    const email = process.env.INDIVIDUALFORMSUSERNAME;
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill(email!);
    await adminPage.waitForTimeout(2000);
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await GeneralComponent.attachForms(adminPage, form1, form2);
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    const userLoginComponents = new LoginComponents(userPage);
    const userEngynNavigation = new EngynNavigation(userPage);
    await userLoginComponents.LoginWithCustomParams(process.env.INDIVIDUALFORMSUSERNAME, process.env.INDIVIDUALFORMSPASSWORD);
    await userEngynNavigation.NavigateToFormsPage(userPage);
    await userPage.getByRole('heading', { name: emailSubject }).click();
    await expect(userPage.getByText(form1, { exact: true })).toBeVisible();
    await expect(userPage.getByText(form2)).toBeVisible();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByText(form2).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();
    await userPage.getByRole('button', { name: 'EXIT' }).click();
    await userPage.getByRole('link', { name: 'My Forms' }).click();
    await userPage.getByRole('link').filter({ hasText: form2 }).first().click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: "Save" }).click();
    await userPage.getByText(form1, { exact: true }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage.getByText('Success', { exact: true }).click();
    await userPage.getByText('Submit successfully').click();
    await adminPage.close();
    await userPage.close();
})

//FORM42
test('Fill form request to existing user through personal mailbox', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    const email = 'flynkformsmember@mailinator.com'
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill(email);
    await adminPage.waitForTimeout(2000);
    await adminPage.locator('#rc_select_0').press('Enter');
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByText(form2).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    //await adminPage.locator('div').filter({ hasText: /^Attached FormsSend Requests FormSecond Form Requests FormClose$/ }).getByRole('button', { name: 'Close' }).click();
    await adminPage.locator("//span[normalize-space()='Close']").click();
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;
    await userPage1.getByPlaceholder('Email').fill(process.env.MEMBERFORMSUSERNAME!);
    await userPage1.getByPlaceholder('Password').fill(process.env.MEMBERFORMSPASSWORD!);
    await userPage1.getByRole('button', { name: 'Log in' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByText(form2).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByRole('button', { name: 'DECLINE' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Decline successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.locator('#form-fill-status').getByText('form2').click();
    const text_value = await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).getAttribute('value');

    if (text_value == '') {
        await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
        await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
        await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
        await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
        await userPage1.getByRole('button', { name: 'Save' }).click();
        await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
        await expect(userPage1.getByText('Save successfully')).toBeVisible();
        await userPage1.locator('.ant-notification-notice-close').click();

        await userPage1.getByText(form1).click();
        await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
        await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
        await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
        await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
        await userPage1.getByRole('button', { name: 'Save' }).click();
        await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
        await expect(userPage1.getByText('Save successfully')).toBeVisible();
        await userPage1.locator('.ant-notification-notice-close').click();
    }
    else {
        throw new Error('It looks like the data still have not been deleted');
    }
    await userPage1.getByRole('button', { name: 'SUBMIT' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Submit successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.close();
    await adminPage.close();
    await userPage.close();
})

//FORM57
test('Verify the status-completed mail in the Sent tab', async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);

    // 1.Login to Engyn with the first user and navigated to Forms
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();

    // 2.Click on the Create Mail button 
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();

    // 3.Click the added Form from Library
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);

    // 4.Click the Attach on the first mentioned form
    await adminPage.getByRole('button', { name: 'Attach' }).click();

    // 5.Click Close
    await adminPage.locator("//span[normalize-space()='Close']").click();

    // 6.Fill in the second mail user to the Recipient box 
    await adminPage.locator('#rc_select_0').click();
    await adminPage.locator('#rc_select_0').fill('flynkformsmember@mailinator.com');
    await adminPage.locator('#rc_select_0').press('Enter');
    //Fill email subject
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);

    // 7.Click Sent 
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    // Verify if email sent
    await adminPage.getByRole('tab', { name: 'Sent' }).click();

    await expect(async () => {
        await adminPage.reload()
        await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });

    // 8.Login the Engyn with the second user by another browser
    const userLoginComponents = new LoginComponents(userPage);
    const userEngynNavigation = new EngynNavigation(userPage);
    await userLoginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await userEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Forms', 'Flynk Forms Org', ' Member');

    // 9.Navigate to Form 
    await userEngynNavigation.NavigateToFormsPage(userPage);

    // 10.Click the first mail
    await userPage.getByRole('heading', { name: emailSubject }).click();
    //Verify if the user receive mail
    await expect(userPage.getByText(form1, { exact: true })).toBeVisible();

    // 11.Open the Form on the Form request page
    await userPage.getByText(form1, { exact: true }).click();

    // 12.Fill in some fields in the form and click Save
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    //Click save button and verify the success popup message
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();

    // 13.Return to the first browser
    // 14.Click on the Sent tab and the first mail 
    await adminPage.getByRole('heading', { name: emailSubject }).click();

    // 15.Click on the recipient’s icon 
    await expect(adminPage.getByText('You have filled')).toBeVisible()
    await adminPage.getByText('Forms Member').click()
    //Check 'You have filled' --> 'Completed' when click on ecipient’s icon
    await expect(adminPage.getByText('You have filled')).not.toBeVisible()
    await expect(adminPage.getByText('Completed')).toBeVisible()
    //Check the draft icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")).toBeVisible()

    // 16.Return the second browser
    // 17.Fill in all fields and click Submit 
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage.getByText('Success', { exact: true }).click();
    await userPage.getByText('Submit successfully').click();

    // 18.Return to the first browser and reload the page
    await adminPage.reload()
    await adminPage.getByRole('heading', { name: emailSubject }).click();
    await adminPage.getByText('Forms Member').click()
    // Check the finished icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-check']")).toBeVisible()
})

//FORM66
test("Verify the status-completed mail in the Sent tab (for Engyn users but different org)", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const emailSubject = 'Email No66.' + Date.now();
    const emailContent = 'Content66 ' + Date.now();
    const textEntry = 'text' + Date.now();
    const email = 'wtest1@mailinator.com'
    const numberEntry = Date.now() + 66;
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);

    // 1.Login to Engyn with the first user and navigated to Forms
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();

    // 2.Click on the Create Mail button 
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();

    // 3.Click the added Form from Library
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);

    // 4.Click the Attach on the first mentioned form
    await adminPage.getByRole('button', { name: 'Attach' }).click();

    // 5.Click Close
    await adminPage.locator("//span[normalize-space()='Close']").click();

    // 6.Fill in the second mail user to the Recipient box 
    await expect(async () => {
        await adminPage.locator('#rc_select_0').clear()
        await adminPage.locator('#rc_select_0').fill(email);
        await expect(adminPage.getByText(email)).toBeVisible()
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });
    await adminPage.locator('#rc_select_0').press('Enter');
    //Fill email subject
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);

    // 7.Click Sent 
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    // Verify if email sent
    await adminPage.getByRole('tab', { name: 'Sent' }).click();

    await expect(async () => {
        await adminPage.reload()
        await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });

    // 8.Login the Engyn with the second user by another browser
    const userLoginComponents = new LoginComponents(userPage);
    const userEngynNavigation = new EngynNavigation(userPage);
    await userLoginComponents.LoginWithCustomParams(email, process.env.MEMBERFORMSPASSWORD);
    await GeneralComponent.changePersonalOrg(userPage)

    // 9.Navigate to Form 
    await userEngynNavigation.NavigateToFormsPage(userPage);

    // 10.Click the first mail
    await userPage.getByRole('heading', { name: emailSubject }).click();
    //Verify if the user receive mail
    await expect(userPage.getByText(form1, { exact: true })).toBeVisible();

    // 11.Open the Form on the Form request page
    await userPage.getByText(form1, { exact: true }).click();

    // 12.Fill in some fields in the form and click Save
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    //Click save button and verify the success popup message
    await userPage.getByRole('button', { name: 'Save' }).click();
    await expect(userPage.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage.getByText('Save successfully')).toBeVisible();
    await userPage.locator('.ant-notification-notice-close').click();

    // 13.Return to the first browser
    // 14.Click on the Sent tab and the first mail 
    await adminPage.getByRole('heading', { name: emailSubject }).click();

    // 15.Click on the recipient’s icon 
    await expect(adminPage.getByText('You have filled')).toBeVisible()
    await adminPage.getByText(email).click()
    //Check 'You have filled' --> 'Completed' when click on ecipient’s icon
    await expect(adminPage.getByText('You have filled')).not.toBeVisible()
    await expect(adminPage.getByText('Completed')).toBeVisible()
    //Check the draft icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")).toBeVisible()

    // 16.Return the second browser
    // 17.Fill in all fields and click Submit 
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage.getByText('Success', { exact: true }).click();
    await userPage.getByText('Submit successfully').click();

    // 18.Return to the first browser and reload the page
    await adminPage.reload()
    await adminPage.getByRole('heading', { name: emailSubject }).click();
    await adminPage.getByText(email).click()
    // Check the finished icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-check']")).toBeVisible()
})

//FORM67
test("Verify the status-completed mail in the Sent tab (for an Engyn user and non-Engyn user)", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    const emailSubject = 'Email No67.' + Date.now();
    const emailContent = 'Content67 ' + Date.now();
    const textEntry = 'text' + Date.now();
    const email = 'flynk' + Date.now() + '@mailinator.com';
    const numberEntry = Date.now() + 66;
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);

    // 1.Login to Engyn with the first user and navigated to Forms
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await adminEngynNavigation.NavigateToFormsPage(adminPage);
    await adminPage.getByRole('link', { name: 'Form Mail' }).click();

    // 2.Click on the Create Mail button 
    await adminPage.getByRole('button', { name: 'Create Mail' }).click();

    // 3.Click the added Form from Library
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText('form1', { exact: true }).click();
    await adminPage.waitForTimeout(1000);

    // 4.Click the Attach on the first mentioned form
    await adminPage.getByRole('button', { name: 'Attach' }).click();

    // 5.Click Close
    await adminPage.locator("//span[normalize-space()='Close']").click();

    // 6.Fill in the second mail user to the Recipient box 
    await expect(async () => {
        await adminPage.locator('#rc_select_0').clear()
        await adminPage.locator('#rc_select_0').fill(email);
        await expect(adminPage.getByText(email)).toBeVisible()
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });
    await adminPage.locator('#rc_select_0').press('Enter');
    //Fill email subject
    await adminPage.getByPlaceholder('Subject').click();
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);

    // 7.Click Sent 
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    // Verify if email sent
    await adminPage.getByRole('tab', { name: 'Sent' }).click();

    await expect(async () => {
        await adminPage.reload()
        await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible();
    }).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] });

    // 8.Login to the personal email by the second browser
    // 9.Open the Engyn mail
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);
    const userPage1Promise = userPage.waitForEvent('popup');

    // 10.Click Open Form
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;

    // 11.Fill in some fields in the form and click Save
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    //Click save button and verify the success popup message
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();

    // 13.Return to the first browser
    // 14.Click on the Sent tab and the first mail 
    await adminPage.getByRole('heading', { name: emailSubject }).click();

    // 15.Click on the recipient’s icon 
    await expect(adminPage.getByText('You have filled')).toBeVisible()
    await adminPage.getByText(email).click()
    //Check 'You have filled' --> 'Completed' when click on ecipient’s icon
    await expect(adminPage.getByText('You have filled')).not.toBeVisible()
    await expect(adminPage.getByText('Completed')).toBeVisible()
    //Check the draft icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")).toBeVisible()

    // 16.Return the second browser
    // 17.Fill in all fields and click Submit 
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'SUBMIT' }).click();
    await userPage1.getByText('Success', { exact: true }).click();
    await userPage1.getByText('Submit successfully').click();

    // 18.Return to the first browser and reload the page
    await adminPage.reload()
    await adminPage.getByRole('heading', { name: emailSubject }).click();
    await adminPage.getByText(email).click()
    // Check the finished icon
    await expect(adminPage.locator("//*[local-name()='svg' and @data-icon='circle-check']")).toBeVisible()
})

//FORM58
test("Fill the Form through the Sent tab", async ({ browser }) => {
    //Precondition: there should be an email in Sent Tab
    const email = 'flynk' + Date.now() + '@mailinator.com';
    const emailSubject = await SentAnEmail(browser, email, 1)

    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const adminLoginComponents = new LoginComponents(adminPage)
    const adminEngynNavigation = new EngynNavigation(adminPage)
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();

    // 1.Login to the Engyn
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
    await adminEngynNavigation.NavigateToFormsPage(adminPage)

    // 2.Click Forms 
    await adminPage.getByRole('link', { name: 'Form Mail' }).click()

    // 3.Click on the Sent tab
    await adminPage.getByRole('tab', { name: 'Sent' }).click()

    // 4.Click on the mentioned mail 
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
    await adminPage.getByRole('heading', { name: emailSubject }).click()

    // 5.Click on the form 
    await adminPage.getByText(form1).click()

    // 6.Click Open 
    await adminPage.getByRole('button', { name: 'OPEN' }).click()

    // 7.Fill in some fields in the form
    await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 8.Click Save
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('Success', { exact: true })).toBeVisible()
    await expect(adminPage.getByText('Save successfully')).toBeVisible()
    await adminPage.locator('.ant-notification-notice-close').click()
    // Check if delete button is enable
    await expect(adminPage.getByRole('button', { name: 'Delete' })).toBeEnabled()
    // Check data that the user input does not blink --> NOT AUTOMATED

    // 9.Click Delete
    await adminPage.getByRole('button', { name: 'Delete' }).click()
    await expect(adminPage.getByText('Success', { exact: true })).toBeVisible()
    await expect(adminPage.getByText('Delete successfully')).toBeVisible()
    await adminPage.locator('.ant-notification-notice-close').first().click()
    //Verify the data is deleted or not
    const textEntry_expected = await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).textContent()
    if (textEntry_expected != "") {
        throw new Error('The expected text is not correct');
    }

    // 10.Fill all required fields in the form 
    await adminPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await adminPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    // 11.Click Submit
    await adminPage.getByRole('button', { name: 'SUBMIT' }).click();
    await adminPage.getByText('Success', { exact: true }).click();
    await adminPage.getByText('Submit successfully').click();
})

//FORM59
test("Fill the Form through the Watching tab", async ({ browser }) => {
    //Precondition: there should be an email in Sent Tab
    const email = 'flynk' + Date.now() + '@mailinator.com';
    const emailSubject = await SentAnEmail(browser, email, 1, "watching")

    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const adminLoginComponents = new LoginComponents(adminPage)
    const adminEngynNavigation = new EngynNavigation(adminPage)
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();

    // 1.Login to the Engyn
    await adminLoginComponents.LoginWithCustomParams(process.env.MANAGERFORMSUSERNAME, process.env.MANAGERFORMSPASSWORD)
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Manager')
    await adminEngynNavigation.NavigateToFormsPage(adminPage)

    // 2.Click Forms 
    await adminPage.getByRole('link', { name: 'Form Mail' }).click()

    // 3. Click on the Watching Tab
    await adminPage.getByRole('tab', { name: 'Watching' }).click()

    // 4.Click on the mentioned mail 
    await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
    await adminPage.getByRole('heading', { name: emailSubject }).click()

    // 5.Click on the form 
    await adminPage.getByText(form1).click()

    // 6.Click Open 
    await adminPage.getByRole('button', { name: 'OPEN' }).click()

    // 7.Fill in some fields in the form
    await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 8.Click Save
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('Success', { exact: true })).toBeVisible()
    await expect(adminPage.getByText('Save successfully')).toBeVisible()
    await adminPage.locator('.ant-notification-notice-close').click()
    // Check if delete button is enable
    await expect(adminPage.getByRole('button', { name: 'Delete' })).toBeEnabled()
    // Check data that the user input does not blink --> NOT AUTOMATED

    // 9.Click Delete
    await adminPage.getByRole('button', { name: 'Delete' }).click()
    await expect(adminPage.getByText('Success', { exact: true })).toBeVisible()
    await expect(adminPage.getByText('Delete successfully')).toBeVisible()
    await adminPage.locator('.ant-notification-notice-close').first().click()
    //Verify the data is deleted or not
    const textEntry_expected = await adminPage.getByRole('textbox', { name: 'TEXT ENTRY :' }).textContent()
    if (textEntry_expected != "") {
        throw new Error('The expected text is not correct');
    }

    // 10.Fill all required fields in the form 
    await adminPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await adminPage.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    // 11.Click Submit
    await adminPage.getByRole('button', { name: 'SUBMIT' }).click();
    await adminPage.getByText('Success', { exact: true }).click();
    await adminPage.getByText('Submit successfully').click();
})

//FORM63
test("Fill in the mail through the personal account and log in to Engyn to complete the form (same org)", async ({ browser }) => {
    // Pre-condition: Have the validation mail from the Engyn sender, The sender and the recipient are the same org
    const email = 'flynkformsmember@mailinator.com'
    const emailSubject = await SentAnEmail(browser, email, 1)

    // 1. Navigate to the personal mail of the recipient
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    // 2. Open the mail of the mentioned sender
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);

    // 3. Click Open Form
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;

    // 4. log in by the recipient account
    await userPage1.getByPlaceholder('Email').fill(process.env.MEMBERFORMSUSERNAME!);
    await userPage1.getByPlaceholder('Password').fill(process.env.MEMBERFORMSPASSWORD!);
    await userPage1.getByRole('button', { name: 'Log in' }).click();
    // The Delete and Submit buttons are disabled
    //await expect(userPage1.getByRole('button', { name: 'Submit' })).toBeDisabled()
    await expect(userPage1.getByRole('button', { name: 'Delete' })).toBeDisabled()

    // 5. Fill in some fields on the form 
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;

    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();

    // 6. Click Save 
    // The pop-up: “Save successfully” appears in the right corner
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    // The Delete button is enable 
    await expect(userPage1.getByRole('button', { name: 'Delete' })).toBeEnabled()
    // The form completion instructions indicate the field that has the data --> NOT AUTOMATED
    // The system display following the user’s typing --> NOT AUTOMATED

    // 7. Log in to Engyn with the recipient account by another browser
    const userContext2 = await browser.newContext();
    const userPage2 = await userContext2.newPage();
    const userPage2LoginComponent = new LoginComponents(userPage2);
    const userPage2EngynNavigation = new EngynNavigation(userPage2);

    // 8. Go to the mentioned org 
    await userPage2LoginComponent.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await userPage2EngynNavigation.ChangeOrg(userPage2, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Member');

    // 9. Go to Form
    await userPage2EngynNavigation.NavigateToFormsPage(userPage2);
    // The Form indicator color is orange
    const element = userPage2.locator(`//h5[normalize-space()='${emailSubject}']/../..//div[contains(@class,'in-progress')]`)
    const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    if (color != 'rgb(247, 181, 0)') {
        throw new Error("The color may be wrong")
    }

    // 10. Click the mail 
    await userPage2.getByRole('heading', { name: emailSubject }).click()

    // 11. Click the form in Forms Request 
    await userPage2.getByText(form1).click()

    // 12. Click Delete
    await userPage2.getByRole('button', { name: 'Delete' }).click()
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Delete successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();
    //All data are disappear
    await expect(userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' })).toContainText('')
    await expect(userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toContainText('')
    // All completion instructions indicators change color to grey --> NOT AUTOMATED

    // 13. Fill all the required fields in the form
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    await userPage2.getByRole('button', { name: 'Save' }).click();
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Save successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();

    // 14. Click Submit
    await userPage2.getByRole('button', { name: 'Submit' }).click()
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Submit successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();
    // Users will be navigated to the Form Entries tab 
    // and see the form stays at the top of the Recently Submitted tab --> NOT AUTOMATED
    await expect(userPage2).toHaveURL(new RegExp('.*form-entries.*'))
})

//FORM87
test("Fill in the mail through the personal account and log in to Engyn to complete the form (different org)", async ({ browser }) => {
    //Precondition: Have the validation mail from the Engyn sender / The sender and the recipient are different org
    const email = 'flynkformsindividual@mailinator.com';
    const emailSubject = await SentAnEmail(browser, email, 1)

    // 1.Navigate to the personal mail of the recipient
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    // 2.Open the mail of the mentioned sender
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);

    // 3.Click Open Form
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;

    // 4.log in by the recipient account
    await userPage1.getByPlaceholder('Email').fill("flynkformsindividual@mailinator.com");
    await userPage1.getByPlaceholder('Password').fill("12345678aA@");
    await userPage1.getByRole('button', { name: 'Log in' }).click();
    await expect(userPage1.getByRole('button', { name: 'Delete' })).toBeDisabled()

    // 5.Fill in some fields on the form
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;

    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage1.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    // 6.Click Save 
    // The pop-up: “Save successfully” appears in the right corner
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    // The Delete button is enable 
    await expect(userPage1.getByRole('button', { name: 'Delete' })).toBeEnabled()
    // The form completion instructions indicate the field that has the data --> NOT AUTOMATED
    // The system display following the user’s typing --> NOT AUTOMATED

    // 7.log in to Engyn with the recipient account by another browser
    const userContext2 = await browser.newContext();
    const userPage2 = await userContext2.newPage();
    const userPage2LoginComponent = new LoginComponents(userPage2);
    const userPage2EngynNavigation = new EngynNavigation(userPage2);

    // 8.Go to the personal account (personal org)
    await userPage2LoginComponent.LoginWithCustomParams("flynkformsindividual@mailinator.com", "12345678aA@");
    //await userPage2EngynNavigation.ChangeOrg(userPage2, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Member');

    // 9.Go to Form
    await userPage2EngynNavigation.NavigateToFormsPage(userPage2);
    // The Form indicator color is orange
    const element = userPage2.locator(`//h5[normalize-space()='${emailSubject}']/../..//div[contains(@class,'in-progress')]`)
    const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    if (color != 'rgb(247, 181, 0)') {
        throw new Error("The color may be wrong")
    }

    // 10.Click the mail 
    await userPage2.getByRole('heading', { name: emailSubject }).click()

    // 11.lick the form in Forms Request 
    await userPage2.getByText(form1).click()

    // 12.Click Delete
    await userPage2.getByRole('button', { name: 'Delete' }).click()
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Delete successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();
    //All data are disappear
    await expect(userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' })).toContainText('')
    await expect(userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toContainText('')
    // All completion instructions indicators change color to grey --> NOT AUTOMATED

    // 13.Fill all the required fields in the form
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    await userPage2.getByRole('button', { name: 'Save' }).click();
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Save successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();

    // 14.Click Submit
    await userPage2.getByRole('button', { name: 'Submit' }).click()
    await expect(userPage2.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage2.getByText('Submit successfully')).toBeVisible();
    await userPage2.locator('.ant-notification-notice-close').click();
    // Users will be navigated to the Form Entries tab 
    // and see the form stays at the top of the Recently Submitted tab --> NOT AUTOMATED
    await expect(userPage2).toHaveURL(new RegExp('.*form-entries.*'))
})

//FORM95
test("Verify the mail status in the Inbox tab", async ({ browser }) => {
    test.setTimeout(400000)
    // Step1 --> Step9
    const email = 'flynkformsmember@mailinator.com';
    const emailSubject_UnreadMail = await SentAnEmail(browser, email, 1, 'NoWatching', 'Unread Mail')

    // 10.Repeat steps 3 → 9 with the Form Subject: “Completed Mail”
    // Sender will be navigated to the inbox tab --> is included in SentAnEmail function
    // The pop-up “Submit form request email has been sent” appears on the right corner --> is included in SentAnEmail function
    // The completed sent mail will stay at the top of the Sent tab with the correct time --> is included in SentAnEmail function
    const emailSubject_CompletedMail = await SentAnEmail(browser, email, 1, 'NoWatching', 'Completed Mail')

    // 11.Repeat steps 3 → 9 with the Form Subject: “Draft Mail”
    const emailSubject_DarftMail = await SentAnEmail(browser, email, 1, 'NoWatching', 'Draft Mail')

    // 12.Repeat steps 2 → 9 with the Form Subject: “Read Mail”
    const emailSubject_ReadMail = await SentAnEmail(browser, email, 1, 'NoWatching', 'Read Mail')

    const context = await browser.newContext()
    const page = await context.newPage()
    const memberLoginComponents = new LoginComponents(page)
    const memberEngynNavigation = new EngynNavigation(page)

    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;

    // 13.Login to Engyn with the second mail in another browser and move to the mentioned org
    await memberLoginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD)
    await memberEngynNavigation.NavigateToFormsPage(page)

    // 4sent mails have been unread status (blue color)
    // Read Mail
    let statusReadEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Read Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    let color = await statusReadEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(50, 197, 255)")

    // Draft Mail
    let statusDraftEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Draft Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusDraftEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(50, 197, 255)")

    // Completed Mail
    let statusCompletedEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Completed Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusCompletedEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(50, 197, 255)")

    // Unread Mail
    let statusUnreadEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Unread Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusUnreadEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(50, 197, 255)")

    // 14.Click on the “Read Mail”
    await page.getByRole('heading', { name: 'Read Mail' }).first().click()
    await page.waitForTimeout(1000)
    // The Form request will appear in the right side after clicking the “Read Mail”
    await expect(page.getByText('FORM REQUEST')).toBeVisible()
    await page.reload()
    // Read mail has been changed to the Read status ( grey color)
    const statusReadEmail2 = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Read Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusReadEmail2.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(201, 218, 228)")

    // 15.Click on the “Draft mail”
    await page.getByRole('heading', { name: 'Draft Mail' }).first().click()
    await page.waitForTimeout(1000)
    await page.waitForLoadState('load')
    await page.reload()
    // a. Draft mail has been changed to the Read status ( grey color) 
    let statusDraftEmail2 = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Draft Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusDraftEmail2.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(201, 218, 228)")
    await page.getByRole('heading', { name: 'Draft Mail' }).first().click()

    // 16.Open the Form in the Form Request
    await page.getByText('form1', { exact: true }).click()

    // 17.Fill in some fields → Click Save
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await page.getByRole('button', { name: 'Save' }).click()

    // 18.Click Forms Mail 
    await page.getByText('Forms', { exact: true }).click()
    await page.waitForTimeout(1000)
    await page.waitForLoadState('load')
    await page.reload()
    // → b. after filling the form in the draft mail and clicking save 
    // → c. Draft mail and its form have changed  to the draft status ( orange color) 
    let statusDraftEmail3 = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Draft Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusDraftEmail3.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(247, 181, 0)")

    // 19.Click on the “Completed mail” and Open the Form in the Form Request
    await page.getByRole('heading', { name: 'Completed Mail' }).first().click()
    await page.waitForTimeout(1000)
    await page.waitForLoadState('load')
    await page.reload()
    // a. Draft mail has been changed to the Read status ( grey color) 
    let statusCompletedEmail2 = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Completed Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusCompletedEmail2.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(201, 218, 228)")
    await page.getByRole('heading', { name: 'Completed Mail' }).first().click()
    await page.getByText('form1', { exact: true }).click()

    // 20.Fill in valid data in required fields → Click Submit
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click();
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry);
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page.getByText('Submit successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.getByText('Forms', { exact: true }).click()
    await page.waitForLoadState('load')
    await page.reload()
    // → b. after filling the form in the draft mail and clicking submit 
    // → c.Completed mail and its form change to the Completed status ( green color)
    let statusCompletedEmail3 = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: 'Completed Mail' }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusCompletedEmail3.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(44, 253, 0)")

    // 21.Click Form Mail
    await page.getByRole('menuitem', { name: 'Forms', exact: true }).locator('path').click()
    await page.reload()
})

//FORM98
test("Verify the filling many forms request as an existing user in Form mail", async ({ browser }) => {
    // There is at least one mail containing 2 form sent to the current user
    const email = process.env.MEMBERFORMSUSERNAME;
    const emailSubject = await SentAnEmail(browser, email, 2)

    const meberContext = await browser.newContext()
    const page = await meberContext.newPage()
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();

    // 1.Login to Engyn and navigate to Form
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(page)

    // 2.Click Form Mail to open the inbox 
    await page.getByRole('link', { name: 'Form Mail' }).click()

    // 3.Click on the mail in the inbox tab (sent in precondition)
    await page.getByRole('heading', { name: emailSubject }).click()

    // 4.Click on the first form in the Form Request screen
    await page.getByText(form1).click()
    // Users will be navigated to the Form Request page
    await expect(page.getByText('Form Request')).toBeVisible()
    // Decline & Submit & Delete buttons are disable
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()

    // 5.Fill some fields of the first form 
    // The guide indicator reflect the status of the control as well as the control’s validation --> NOT AUTOMATED
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 6.Click Save
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    await page.waitForLoadState('networkidle')
    // a. Decline & Delete button are enable, 
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'DELETE' })).toBeEnabled()
    // b. the form have change to draft form ( orange color)
    let element = page.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")
    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(color).toBe("rgb(247, 181, 0)")
    // Submit button is disable
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()

    // 7.Repeate step 4 with the second form
    await page.getByText(form2).click()

    // 8.Fill some fields of the second form
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 9.Click Decline
    await page.getByRole('button', { name: 'DECLINE' }).click()
    await page.locator('.ant-notification-notice-close').click();
    // All data in 2 forms have been erased, all forms return to read status ( grey color) --> NOT AUTOMATEd
    // Decline & Submit & Delete buttons are disable
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'DELETE' })).toBeDisabled()

    // 10.Fill all required fields all the first & second forms
    await page.getByText(form1).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();


    await page.getByText(form2).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();

    // 11.Click Submit
    await page.getByRole('button', { name: 'SUBMIT' }).click()
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    // Users have been navigated to Form Entries page 
    await expect(page).toHaveURL(new RegExp('.*form-entries.*'))
    // 2 forms have stayed in the top of Recently Submiited tab --> NOT AUTOMATED
    // The mail is change color from blue → green 
    await page.getByRole('link', { name: 'Form Mail' }).click()
    await page.reload()
    let statusEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: emailSubject }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(44, 253, 0)")

    // 12.Navigate to the corresponding Dataset to observe the submitted data --> Temporarily NOT AUTOMATED 
    await GeneralComponent.CheckDataInCore(page, form1, textEntry)
})

//FORM99
test("Verify the filling in many form requests through personal mailbox and complete the filling by logging Engyn", async ({ browser }) => {
    // Precondition: Have the validation mail that contains more than 2 forms from the Engyn sender / The sender and the recipient are the same org
    const email = process.env.MEMBERFORMSUSERNAME!;
    const emailSubject = await SentAnEmail(browser, email, 2)
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();

    // 1.Navigate to the personal mail of the recipient
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    // 2.Open the mail of the mentioned sender
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);

    // 3.Click Open Form
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const page = await userPage1Promise;
    // Users will be navigated to the login page
    await expect(page).toHaveURL(new RegExp('.*login.*'))

    // 4.Log in by the recipient account
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill("12345678aA@");
    await page.getByRole('button', { name: 'Log in' }).click();
    // Users will be moved to the Form Request page
    await expect(page.getByText('Form Request')).toBeVisible()
    // Decline & Submit & Delete buttons are disable
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()

    // 5.Fill in some fields on the first form 
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 6.Click Save 
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    // a. Decline & Delete button are enable, 
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'DELETE' })).toBeEnabled()
    // The form completion instructions indicate the field that has the data --> NOT AUTOMATED
    // b. the form have change to draft form ( orange color)
    let element = page.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")
    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(color).toBe("rgb(247, 181, 0)")
    // The system display following the user’s typing --> NOT AUTOMATED

    await userPage.close()
    await page.close()

    // 7.Log in to Engyn with the recipient account by another browser
    const userContext2 = await browser.newContext();
    const userPage2 = await userContext2.newPage();
    const userPage2LoginComponent = new LoginComponents(userPage2);
    const userPage2EngynNavigation = new EngynNavigation(userPage2);

    // 8.Go to the mentioned org 
    await userPage2LoginComponent.LoginWithCustomParams(email, "12345678aA@");

    // 9.Go to Form
    await userPage2EngynNavigation.NavigateToFormsPage(userPage2);
    // The draft mail stays at the top of the inbox tab ( color orange)
    // The Form indicator color is orange
    let statusDraftEmail3 = userPage2.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: emailSubject }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusDraftEmail3.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(247, 181, 0)")

    // 10.Click the mail 
    await userPage2.getByRole('heading', { name: emailSubject }).click()

    // 11.Click the form in Forms Request 
    await userPage2.getByText(form1).click()
    // Users will see the saved data when opening the draft form 
    await expect(userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveValue(textEntry)

    // 12.Click Decline
    await userPage2.getByRole('button', { name: 'DECLINE' }).click()
    await userPage2.locator('.ant-notification-notice-close').click();
    // All data in 2 forms have been erased
    await expect(userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveValue("")
    await expect(userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toHaveValue("")
    // Decline & Submit & Delete buttons are disable
    await expect(userPage2.getByRole('button', { name: 'DECLINE' })).toBeDisabled()
    await expect(userPage2.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()
    await expect(userPage2.getByRole('button', { name: 'DELETE' })).toBeDisabled()

    // 13.Fill all the required fields in all forms
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage2.getByRole('button', { name: 'SAVE' }).click();
    await userPage2.getByText('Success', { exact: true }).click();
    await userPage2.getByText('Save successfully').click();
    await userPage2.locator('.ant-notification-notice-close').click();

    await userPage2.getByText(form2).click()
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await userPage2.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await userPage2.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await userPage2.getByRole('button', { name: 'SAVE' }).click();
    await userPage2.getByText('Save successfully').click();
    await userPage2.locator('.ant-notification-notice-close').click();

    // 14.Click Submit
    await userPage2.getByRole('button', { name: 'SUBMIT' }).click()
    await userPage2.getByText('Success', { exact: true }).click();
    await userPage2.getByText('Submit successfully').click();
    await userPage2.locator('.ant-notification-notice-close').click();
    // Users have been navigated to Form Entries page 
    await expect(userPage2).toHaveURL(new RegExp('.*form-entries.*'))
    // 2 forms have stayed in the top of the Recently Submiited tab with the completed time --> NOT AUTOMATED

    // Users can see the data in the sender’s dataset
    await GeneralComponent.CheckDataInCore(userPage2, form1, textEntry)
})

//FORM100
test("Verify the filling many Form requests in the personal account org", async ({ browser }) => {
    // There is at least one mail (that contains 2 form) sent to the individual org of the recipients
    const email = process.env.MANAGERFORMSUSERNAME1!;
    const emailSubject = await SentAnEmail(browser, email, 2)

    const meberContext = await browser.newContext()
    const page = await meberContext.newPage()
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();

    // 1.Login to Engyn and navigate to Form
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.MANAGERFORMSUSERNAME1, process.env.PASSWORD);

    // 2.Change the org to the individual org
    await GeneralComponent.changePersonalOrg(page)

    // 3.Click Form Mail and open mentiomed the mail 
    await engynNavigation.NavigateToFormsPage(page)
    await page.getByRole('link', { name: 'Form Mail' }).click()

    // 4.Click on the form request in the inbox tab (sent in precondition)
    await page.getByRole('heading', { name: emailSubject }).click()

    // 5.Click on the first form 
    await page.getByText(form1).click()

    // 6.Fill some fields of the form 
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 7.Click Save
    await page.getByRole('button', { name: 'SAVE' }).click();
    // The pop-up: “Save successfully” appears in the right corner
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    // The form completion instructions indicate the field that has the data  --> NOT AUTOMATED

    // a. Decline & Delete button are enable, 
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'DELETE' })).toBeEnabled()
    // b. the form have change to draft form ( orange color) 
    let element = page.locator("//*[local-name()='svg' and @data-icon='circle-ellipsis-vertical']")
    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(color).toBe("rgb(247, 181, 0)")
    // The system display following the user’s typing --> NOT AUTOMATED

    // 8.Click the second form
    await page.getByText(form2).click()

    // 9.Fill some fields of the form
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

    // 10.Click Decline
    await page.getByRole('button', { name: 'DECLINE' }).click()
    await page.locator('.ant-notification-notice-close').click();
    // a. All data in 2 forms have been erased, 
    await expect(page.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveValue("")
    await expect(page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toHaveValue("")
    // b. all forms return to read status ( grey color) --> NOT AUTOMATED
    // Decline & Submit & Delete buttons are disable
    await expect(page.getByRole('button', { name: 'DECLINE' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'DELETE' })).toBeDisabled()

    // 11.Fill all required fields in two forms 
    await page.getByText(form1).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();


    await page.getByText(form2).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Save successfully').click();
    await page.locator('.ant-notification-notice-close').click();

    // 11.Click Submit
    await page.getByRole('button', { name: 'SUBMIT' }).click()
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    // 2 forms have stayed in the top of the Recently Submiited tab --> NOT AUTOMATED

    // Users have been navigated to Form Entries page 
    await expect(page).toHaveURL(new RegExp('.*form-entries.*'))

    // The mail is changed color from blue → green 
    await page.getByRole('link', { name: 'Form Mail' }).click()
    await page.reload()
    let statusEmail = page.locator("//div[contains(@class,'mail-list-item-wrapper')]").filter({ hasText: emailSubject }).locator("//div[contains(@class, 'forms-fill-status-indicator-wrapper')]").first()
    color = await statusEmail.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color).toBe("rgb(44, 253, 0)")
    await page.close()

    // Users (admin) can see the data in sender’s dataset
    const adminContext = await browser.newContext()
    const adminpage = await adminContext.newPage()

    const loginComponents2 = new LoginComponents(adminpage);
    await loginComponents2.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME!, process.env.PASSWORD!);

    await GeneralComponent.CheckDataInCore(adminpage, form1, textEntry)
})