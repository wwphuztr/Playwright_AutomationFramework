// Test suite: https://flynkteam.atlassian.net/wiki/spaces/ENGYN/pages/3737518143/Engyn+Form+workflow+and+test+suite

import { test, expect, Page } from '@playwright/test';
import { EmailComponents } from '../../page/emailComponent';
import { EngynNavigation } from '../../page/EngynNavigation';
import { FormControls } from '../../page/FormControl';
import { LoginComponents } from '../../page/loginComponent';
import { title } from 'process';
import { log } from 'console';

const form1 = 'form1';
const form2 = 'form2';

async function CreateEmtpyForm(page: Page, formName){
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByText(' Empty Form').click();
    await page.getByRole('button', {name: 'Create', exact: true}).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', {name: 'OK'}).click();
};

async function AddFirstControl(page: Page){
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
};



//FORM1
test('Create a form and data set in private collection (AddNumber_Select)', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No1.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM1.1 
test('(AddDateTime_DatePicker)', async ({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No1.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddDateTime_TimePicker('Add TimePicker', true, true, true, true, true, true, true, false);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM2
test('Create a form and data set in public collection', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddTextField_TextArea('Text Area', false,true, false, false, false,true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByText('Shared Data' ).click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM3
test('Create a form in private collection and data set in public collection', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddTextField_Select('Phone Number Entry', false,true, false, false, false,true, false, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('Shared Data' ).click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByText(formName).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM4
test('Create a form in public collection and dataset in private collection', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddTextField_TextArea('Text Area', false,true, false, false, false, true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM6
test('Publish Draft forms', async({page}) => {
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page,formName);
    await AddFirstControl(page);
    await formControls.AddTextField_TextArea('Text Area', false,true, false, false, false,true, false, true);
    await page.getByRole('link', { name: 'Forms Designer', exact: true }).click();
    await page.getByRole('link', { name: formName }).first().click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.close();
})

//FORM8
test('Self Submit a record in Engyn Core', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const textEntry = 'text' + Date.now();
    const numberEntry =  Date.now() + 1;
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToCorePage(page);
    await page.getByRole('link', { name: form1 + ' DataSet', exact: true }).first().click();
    await page.getByRole('button', { name: 'Add Record' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).fill(textEntry);
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('cell', {name: textEntry})).not.toBeVisible();
    await expect(page.getByRole('cell', {name: numberEntry.toString()})).not.toBeVisible();
    await page.getByRole('button', { name: 'Add Record' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).fill(textEntry);
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('The record has been added successfully')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('cell', {name: textEntry})).toBeVisible();
    await expect(page.getByRole('cell', {name: numberEntry.toString()})).toBeVisible();
    await page.close();
})

//FORM12
test('Verify Show in list config when adding Form Control', async({page})=>{
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'text' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await page.getByText('Text', { exact: true }).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('auto-true');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('.sortable-form-row-wrapper > button:nth-child(3)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('auto-false');
    await page.getByLabel('Label').click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('.sortable-form-row-wrapper > button:nth-child(3)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('detailed');
    await page.getByText('Auto', { exact: true }).click();
    await page.getByText('Detailed').click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('button:nth-child(5)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('summary-searchable-sortable');
    await page.getByText('Auto', { exact: true }).click();
    await page.getByText('Summary').click();
    await page.getByRole('checkbox', { name: 'Is Queryable' }).check();
    await page.getByRole('checkbox', { name: 'Is Sortable' }).check();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('button:nth-child(5)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('summary-sortable');
    await page.getByText('Auto', { exact: true }).click();
    await page.getByText('Summary', { exact: true }).click();
    await page.getByRole('checkbox', { name: 'Is Sortable' }).check();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('.sortable-form-row-wrapper > button:nth-child(3)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('summary-searchable');
    await page.getByText('Auto', { exact: true }).click();
    await page.getByText('Summary', { exact: true }).click();
    await page.getByRole('checkbox', { name: 'Is Queryable' }).check();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.locator('button:nth-child(5)').click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('summary');
    await page.getByText('Auto', { exact: true }).click();
    await page.getByText('Summary', { exact: true }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Save variant successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByRole('checkbox', { name: 'auto-true' }).check();
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName +' DataSet' })).toBeVisible();
    await page.getByRole('link', { name: formName +' DataSet' }).click();
    await expect(page.getByRole('cell', { name: 'summary-sortable' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'summary-searchable', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'summary-searchable-sortable' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'auto-true' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'summary', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'auto-false', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'detailed', exact: true })).not.toBeVisible();
    await page.getByRole('button').nth(4).click();
    await page.getByRole('button', { name: 'Condition' }).click();
    const text = await page.locator('span').filter({ hasText: 'searchable' }).textContent();
    await page.locator('span').filter({ hasText: 'searchable' }).click();
    const text_searchable = await page.locator('span').filter({ hasText: 'searchable' }).textContent();
    let item_searchable = text_searchable;
    if(item_searchable == 'summary-searchable-sortable') {
        await expect(page.getByRole('tab', { name: 'summary-searchable-sortable summary-searchable-sortable summary-searchable Contains Remove' }).getByText('summary-searchable', { exact: true })).toBeVisible();
    }
    else {
        await expect(page.getByRole('tab', { name: 'summary-searchable summary-searchable summary-searchable-sortable Contains Remove' }).getByText('summary-searchable-sortable')).toBeVisible();
    }
    await page.reload();
    await page.waitForTimeout(2000);
    await page.getByRole('button').nth(4).click();
    await page.waitForTimeout(2000);
    await page.getByText('Sort rule').click();
    await page.waitForTimeout(2000);
    await page.locator('div').filter({ hasText: /sortable$/ }).first().click();
    await expect(page.getByText('summary-searchable-sortable').nth(2)).toBeVisible();
    await expect(page.getByText('summary-sortable').nth(1)).toBeVisible();
    await page.close();
})

//FORM14

//FORM17 --> FORM63 will cover FORM17

//FORM19
test('Send form request to non-existing user and register', async ({browser})=>{
    const adminContext = await browser.newContext();
	const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
	const userPage = await userContext.newPage();
    const adminLoginComponents = new LoginComponents(adminPage);
    const adminEngynNavigation = new EngynNavigation(adminPage);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now();
    const numberEntry =  Date.now() + 1;
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
    await expect(adminPage.getByText(email, {exact: true})).toBeVisible();
    await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click();
    await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click();
    await adminPage.waitForTimeout(1500);
    await adminPage.getByText(form1, { exact: true }).hover();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByText(form2, { exact: true }).hover();
    await adminPage.waitForTimeout(1000);
    await adminPage.getByRole('button', { name: 'Attach' }).click();
    await adminPage.waitForTimeout(1000);
    await adminPage.locator("//span[normalize-space()='Close']").click();
    await adminPage.getByPlaceholder('Subject').fill("");
    await adminPage.waitForTimeout(2000);
    await adminPage.getByPlaceholder('Subject').fill(emailSubject);
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('button', { name: 'Send', exact: true }).click();
    await adminPage.waitForTimeout(2000);
    await adminPage.getByRole('tab', { name: 'Sent' }).click();
    const userEmailComponents = new EmailComponents(userPage);
    await userEmailComponents.selectEmail(emailSubject, email);
    const userPage1Promise = userPage.waitForEvent('popup');
    await userPage.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'OPEN FORMS' }).click();
    const userPage1 = await userPage1Promise;
    await userPage1.getByRole('textbox', { name: 'Text Entry :' }).click();
    await userPage1.getByRole('textbox', { name: 'Text Entry :' }).fill(textEntry);
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByText(form2).click();
    await userPage1.getByRole('textbox', { name: 'Text Entry :' }).click();
    await userPage1.getByRole('textbox', { name: 'Text Entry :' }).fill(textEntry);
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByRole('button', { name: 'Create an account' }).click();
    await userPage1.getByPlaceholder('FullName').fill(email);
    await userPage1.getByPlaceholder('Password').fill("12345678aA@")
    await userPage1.getByRole('button', { name: 'Create an account' }).click();
    await expect(userPage1).toHaveURL(new RegExp('.*dashboard.*'))
    const userEmailComponents2 = new EmailComponents(userPage1);
    const emailSubject_validation = 'Engyn - Email Validation'
    await userEmailComponents2.selectEmail2(emailSubject_validation, email);
    await userPage1.getByRole('button', { name: 'Back to Home' }).click();
    // await userPage1.getByPlaceholder('Email').fill(email);
    // await userPage1.getByPlaceholder('Password').fill("12345678aA@");
    // await userPage1.getByRole('button', { name: 'Log in' }).click();
    await userPage1.getByRole('menuitem', { name: 'Forms' }).locator('svg').click();
    try {
        await userPage1.getByRole('heading', { name: emailSubject }).click();
    } catch (error) {
        console.log(error);
        console.log("It may be a data center issue")
    }
    await userPage1.getByText(form1).click();
    await userPage1.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await userPage1.getByText(form2).click();
    await userPage1.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await userPage1.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await userPage1.getByRole('button', { name: 'Save' }).click();
    await expect(userPage1.getByText('Success', { exact: true })).toBeVisible();
    await expect(userPage1.getByText('Save successfully')).toBeVisible();
    await userPage1.locator('.ant-notification-notice-close').click();
    await adminPage.close();
    await userPage.close();
    await userPage1.close();
})

//FORM20
