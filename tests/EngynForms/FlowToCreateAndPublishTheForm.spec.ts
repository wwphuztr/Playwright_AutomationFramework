import { test, expect, Page } from '@playwright/test';
import { EmailComponents } from '../../page/emailComponent';
import { EngynNavigation } from '../../page/EngynNavigation';
import { FormControls } from '../../page/FormControl';
import { LoginComponents } from '../../page/loginComponent';
import { GeneralComponent } from '../../page/generalComponent';

const form1 = 'form1'
const form2 = 'form2'
const form3 = 'form3'

async function CreateRecentlyEditedForm(browser, form) {
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const adminLoginComponents = new LoginComponents(adminPage)
    const adminEngynNavigation = new EngynNavigation(adminPage)

    // Login to the Engyn
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
    await adminEngynNavigation.NavigateToFormsPage(adminPage)

    // Click Forms 
    await adminPage.getByRole('link', { name: 'Forms Library' }).click()

    // Click on the form to edit
    await adminPage.getByRole('link', { name: form }).click()

    // Click on Pen_Ruler icon (Edit button)
    await adminPage.locator("//span[normalize-space()='OPEN']/../../..//*[local-name()='svg']").click()

    // When we edit the form, and then we pushlish --> the form will be shown --> Recently Edited in FORM DESIGNER
    // Click PUBLISH
    await adminPage.getByRole('button', { name: 'Publish' }).click()

    // Click CONFIRM
    await adminPage.getByRole('button', { name: 'Confirm' }).click()
    await expect(adminPage.getByRole('button', { name: 'OPEN' })).toBeVisible()

    await adminPage.close()
}

async function CreateEmtpyForm(page: Page, formName) {
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
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await expect(page.getByText('Form Created!')).toBeVisible()
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Duplicate' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled()
};

async function AddFirstControl(page: Page) {
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
};

//FORM30
test('Create a form and dataset in private collection by auto generate function', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();

    // Always click on the first property (Publish Form List View Columns?)
    await page.locator("//form[@class='ant-form ant-form-horizontal']//input").first().click()

    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await page.close();
})

//FORM47
test('Create a form and dataset in public collection by auto generate function', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);

    // Always click on the first property (Publish Form List View Columns?)
    await page.locator("//form[@class='ant-form ant-form-horizontal']//input").first().click()

    await page.getByText('My Collection').first().click();
    await page.getByText('Shared Data').click();
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.waitForTimeout(2000);
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await page.close();
})

//FORM48
test('Create a form in private collection and dataset in public collection by auto generate function', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);

    // Always click on the first property (Publish Form List View Columns?)
    await page.locator("//form[@class='ant-form ant-form-horizontal']//input").first().click()

    await page.getByText('My Collection').first().click();
    await page.getByText('Shared Data').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.waitForTimeout(2000);
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' }).first()).toBeVisible();
    await page.close();
})

//FORM49
test('Create a form in public collection and dataset in private collection by auto generate function', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    
    // Always click on the first property (Publish Form List View Columns?)
    await page.locator("//form[@class='ant-form ant-form-horizontal']//input").first().click()

    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' }).first()).toBeVisible();
    await page.close();
})

//FORM31
test('Create a form and dataset in private collection by starting an Empty form after auto-generating a form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH EMPTY FORM' }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await page.close();
})

//FORM50
test('Create a form and dataset in public collection by starting an Empty form after auto-generating a form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH EMPTY FORM' }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, true, false);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByText('Shared Data').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible();
    await page.close();
})

//FORM52
test('Create a form in private collection and dataset in public collection by starting an Empty form after auto-generating a form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH EMPTY FORM' }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, true, false);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(3000);
    await page.getByText('Shared Data').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByText(formName).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible();
    await page.close();
})

//FORM53
test('Create a form in public collection and dataset in private collection by starting an Empty form after auto-generating a form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').click();
    await page.getByPlaceholder('Enter any optional specific requirements you may have.\n E.g.\n“include a field for a mobile phone number”\n“Include an option for postal address”').fill('Contains a number field');
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH EMPTY FORM' }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible();
    await page.close();
})

//FORM32
test('Verify warning when creating a form without the form title', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('This field is required')).toBeVisible();
    await expect(page.getByText('Unable to generate a form using the information provided.Please add further details and try again.')).toBeVisible();
    await page.close();
})

//FORM33
test('Create a form and dataset in private collection using autogenerate with only the title', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH EMPTY FORM' }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await expect(page.getByText('Add Element')).toBeVisible();
    await formControls.AddNumber_Select('Select Num', true, true, true, true, true, true, true, false, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    // The My Collection dataSet is the default option, so we do not need to click on My Collection dataSet
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.getByRole('link', { name: formName })).toBeVisible();
    await page.close();
})

//FORM54
test('Create a form in private collection and dataset in public collection using auto generate with title only', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    //await page.getByPlaceholder('Enter Form Title').fill('Leave Request');
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByText('Shared Data').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).locator('label').filter({ hasText: 'Name' }).first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' }).first()).toBeVisible();
    await page.close();
})

//FORM55
test('Create a form in public collection and dataset in private collection using auto generate with title only', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Leave Request No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByRole('button', { name: 'NEXT' }).click();
    await expect(page.getByText('Please give us a momentto save you time')).toBeVisible();
    await expect(page.getByText('We are busy crafting a sample form to give you ahead start hopefully saving you time.')).toBeVisible();
    await page.getByRole('button', { name: 'START WITH THIS' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await page.getByLabel('Forms Library').click();
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).locator('label').filter({ hasText: 'Name' }).first().click();
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await expect(page.locator('span').filter({ hasText: formName }).first()).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' }).first()).toBeVisible();
    await page.close();
})

//FORM35
test('Create a blank form by copying existing form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Copy Form No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByRole('tab', { name: 'Copy Existing' }).click();
    await page.locator('span').filter({ hasText: 'Forms Library' }).nth(1).click();
    await page.getByText(form1, { exact: true }).click();
    await page.getByRole('button', { name: 'Start With Empty Form' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await page.close();
})

//FORM34
test('Create a form by copying an existing form in My Collection tab', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Copy Form No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByRole('tab', { name: 'Copy Existing' }).click();
    await page.locator('span').filter({ hasText: /^My Collection$/ }).first().click();
    await page.getByRole('tabpanel', { name: 'Copy Existing' }).getByText('form3').click();
    await page.getByRole('button', { name: 'Start with this' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByLabel('Forms Library').click();
    await page.close();
})

//FORM46
test('Create a form by copying an existing form in Forms Library tab', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formName = 'Copy Form No.' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByRole('tab', { name: 'Copy Existing' }).click();
    await page.locator('span').filter({ hasText: 'Forms Library' }).nth(1).click();
    await page.getByText(form1, { exact: true }).click();
    await page.getByRole('button', { name: 'Start with this' }).click();
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByLabel('Forms Library').click();
    await page.close();
})

//FORM60 
test("Edit form and update version in the Recenlt Edited tab ", async ({ browser }) => {
    //Precondition: Have completed edit or draft edit 1 & 2 times 
    await CreateRecentlyEditedForm(browser, "form1")

    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const adminLoginComponents = new LoginComponents(adminPage)
    const adminEngynNavigation = new EngynNavigation(adminPage)

    // 1.Navigate to Forms
    await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
    await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
    await adminEngynNavigation.NavigateToFormsPage(adminPage)

    // 2.Navigate to Forms Designer
    await adminPage.getByRole('link', { name: 'Forms Designer' }).click()

    // 3.Click on the mentioned form
    await adminPage.locator("//div[normalize-space()='These forms have recently been edited by you.']/../../..//h5[normalize-space()='form1']").click()

    // 4.Click Edit 
    await adminPage.locator('.ant-space-item > .ant-btn').click()

    // 5.Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)
    //Click on the TEXT ENTRY controller
    await adminPage.waitForTimeout(3000)
    //const element = await adminPage. getByText('TEXT ENTRYTEXT ENTRY').click({position:  {x: 300 , y:300}})
    //await element?.click({position:  {x: 100 , y:344}})
    //await adminPage.mouse.click(550,480) //--> OK
    await adminPage.mouse.click(550, 350)

    //await adminPage.locator('.ant-form-item-control-input').first().dblclick()
    // Modify --> we will modify the Is Sortable check box
    const isChecked = await adminPage.getByRole('checkbox', { name: 'Is Nullable' }).isChecked()
    if (isChecked) {
        await adminPage.getByRole('checkbox', { name: 'Is Sortable' }).click()
    }
    else {
        await adminPage.getByRole('checkbox', { name: 'Is Sortable' }).click()
    }

    // 6.Click Publish
    await adminPage.getByRole('button', { name: 'Publish' }).click()

    // 7.Click Confirm
    const newVersion = await adminPage.locator('#revision').inputValue()
    await adminPage.getByRole('button', { name: 'Confirm' }).click()

    // The user should be navigated to the preview mode of the form
    await expect(adminPage).toHaveURL(new RegExp('.*mode=preview.*'))

    // The version should be changed according to the confirmation modal
    const exptectedVersion = 'v1.0.' + newVersion
    await adminPage.getByText(exptectedVersion).click() // This line also check that the expectedVersion is correct

    // Users can see the form in the old version
    const OldVersion = Number(newVersion) - 1;
    let StringOldVersion_Expected = String(OldVersion)
    await adminPage.waitForTimeout(2000)
    const StringOldVersion_Actual = await adminPage.getByText(StringOldVersion_Expected).textContent()
    StringOldVersion_Expected = 'v1.0.' + StringOldVersion_Expected
    if (StringOldVersion_Actual != StringOldVersion_Expected) {
        throw new Error("The old version was wrong")
    }

    // The open/Edit button should be enabled
    await expect(adminPage.getByRole('button', { name: 'OPEN' })).toBeEnabled()
    await expect(adminPage.locator("//span[normalize-space()='OPEN']/../../..//*[local-name()='svg']")).toBeEnabled()

    // The data set of the form can be opened without any issue
    await adminPage.getByRole('menuitem', { name: 'Core' }).locator('svg').click()
    await adminPage.getByRole('link', { name: form1 + ' DataSet', exact: true }).click()
    await expect(adminPage.getByRole('cell', { name: 'TEXT ENTRY' })).toBeVisible()
})

//FORM61, FORM62
test("Create a draft Form", async ({ page }) => {
    // 1. Navigate to Forms
    // 2. avigate to Forms Designer
    // 3. Click CREATE FORM
    // 4. Fill in the title and the description (optional)
    // 5. Choose the Empty Form 
    // 6. Click Create
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);

    // 7. Create the control in the Text type 
    await formControls.AddTextField_TextArea('Text Area', false, true, true, false, true, true, false, true);

    // 8. Create the control in the Yes/no type 
    await page.locator('.sortable-form-row-wrapper > button:nth-child(4)').click()
    await formControls.AddYesNoField_CheckBox('Yes/No checkbox', false, true, true, false, true, true, false, true);

    // 9. Create the control in the Date type 
    await page.locator('.sortable-form-row-wrapper > button:nth-child(4)').click()
    await formControls.AddDateTime_TimePicker('Add TimePicker', true, true, true, true, true, true, true, false);

    // 10. Create the control in the Number type 
    await page.locator('.sortable-form-row-wrapper > button:nth-child(4)').click()
    await formControls.AddNumber_NumberEntry('Number Entry', true, true, true, true, true, true, true, false);

    // 11. Click on Form Designer
    await page.getByRole('link', { name: 'Forms Designer', exact: true }).click()
    // Check if the draft form will be shown in DRAFT FORMS
    await expect(page.getByRole('link', { name: formName })).toBeVisible()

    //FORM62 - Delete draftForm
    await page.getByRole('link', { name: formName }).hover()
    await page.getByRole('listitem').filter({ hasText: formName }).getByRole('button').click()
    await page.getByRole('button', { name: 'OK' }).click()

    // Chech if the form is deleted
    await expect(page.getByRole('link', { name: formName })).not.toBeVisible()
})

async function AddFormToBookmark(page) {
    const numberEntry = Date.now();
    const textEntry = 'text' + Date.now()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    //Hover to the form
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(form3, { exact: true }).hover()
    // Click on the ellipsis icon next to the form hovered
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(form3, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()

    await page.waitForTimeout(1000)
    // Add form to bookmark
    await page.getByText('Add Bookmark').click()
    await page.waitForTimeout(1000)
}

//FORM78
test("Verify that users can duplicate the form when editing form (use for form in the bookmark tab)", async ({ page }) => {
    // Precondition: Have at least a form in the bookmarked tab
    await AddFormToBookmark(page);

    // 1. Navigate to Form 
    const engynNavigation = new EngynNavigation(page);
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();
    await page.goto("/")
    await engynNavigation.NavigateToFormsPage(page);

    // 2. Go to Form Library 
    await page.getByRole('link', { name: 'Forms Library' }).click();
    // Check if there is any form3 exist or not
    // const count = await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText('Copy of ' + form3).count();
    await page.getByText('form3').first().waitFor({ state: 'attached' })
    const count = await page.getByText('form3').count()

    // 3. Click on the bookmark icon 
    await page.locator("//*[local-name()='svg' and @data-icon='folder-bookmark']").click()

    // 4. Click on the mentioned form 
    await page.locator("//div[@class='forms-library-tabs-wrapper']").filter({ hasText: 'Bookmarked Forms' }).getByText(form3).click()

    // 5. Click on the edit button 
    await page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']").click()

    // Users will be navigated to the designed form mode
    await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))
    // The tab changes from “Forms Library” to “Form Designer”
    let element = page.locator("//li[@class='ant-menu-item ant-menu-item-selected forms-designer']", { has: page.locator('text="Forms Designer"') })
    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('border-bottom-color');
    });
    console.log(color);
    if (color.includes("50, 197, 255")) {
        console.log("OK");
    }
    else {
        throw new Error("The color may be wrong")
    }
    // The form version color changed from “green” to “grey” and has the prefix “draft of” there.
    await expect(page.getByText('Draft from')).toBeVisible()
    element = page.getByText('Draft from')

    color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    console.log(color);
    if (color != 'rgba(0, 0, 0, 0.45)') {
        throw new Error("The color may be wrong")
    }

    // 6. Click Duplicate
    await page.getByRole('button', { name: 'Duplicate' }).click()
    await expect(page.getByText('Duplicate Form successfully')).toBeVisible()
    await page.locator('.ant-notification-notice-close').click();

    // 7. Return to Form Designer 
    await page.getByRole('link', { name: 'Forms Designer', exact: true }).click()

    // The duplicated form and the edited time stay at the top of the “Draft Form” list with the formula “Copy of” +  Name --> NOT AUTOMATED

    // 8. Click the first form in the Draft Forms
    await page.getByRole('link').filter({ hasText: 'Copy of form' }).first().click()

    // 9. Click Publish 
    await page.getByRole('button', { name: 'Publish' }).click()
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
    // If there is any Copy of form exist, we will replace it by clicking OK to confirm
    if (count > 0) {
        await page.getByRole('button', { name: 'OK' }).click()
    }
    else {
        throw new Error("Something wrong for checking if there is any existing form")
    }

    // The open/Edit button should be enabled
    await expect(page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']")).toBeEnabled()
    await expect(page.getByRole('button', { name: 'OPEN' })).toBeEnabled()
    // The duplicated form and the submitted time moved to the “Recently Edited” tab --> NOT AUTOMATED

    // The data set of the form can be opened without any issue
    await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click()
    await page.getByRole('link', { name: form3 + ' DataSet', exact: true }).click()
    await expect(page.getByRole('cell', { name: 'TEXT ENTRY' })).toBeVisible()

    // Remove bookmark
    await page.goto("/")
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(form3, { exact: true }).hover()
    await page.waitForTimeout(1000)
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(form3, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
    await page.waitForTimeout(1000)
    await page.getByText('Remove Bookmark').click()
})

//FORM80
test("Create the blank form and publish this in the Form Library and its dataset in the private dataset", async ({ browser }) => {
    // Step1 --> Step6
    const adminContext = await browser.newContext()
    const page = await adminContext.newPage()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);

    // 7.Create a control 
    // 8.Edit the Show in List field: Summary
    // The Publish button is enable 
    // The auto-save appears on the right corner --> NOT AUTOMATED
    await formControls.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);

    // 9.Click Publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // 10.Select Form Library as the Form Location
    await page.getByLabel('Forms Library').click()

    // 11.Select My Collection as the Data Location --> My Collection (Data Location) is set default

    // 12.Click Publish
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
    // After clicking publish, the user should navigate to the preview mode of the created form
    await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))
    // The form should present in Form Library in Form Library
    await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
    // Clicking on the form item in Form Library should open the form preview without being restricted
    await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')

    // The form data set should be present in My Collection in Core
    await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
    await page.close()
    // Clicking on the data set item in My Collection should open the data view screen of the data set without being restricted --> NOT AUTOMATED --> Because when a new form created, there are no data on in form, so we can not click on any data item
    // All the items in My Collection are only visible to the owner itself. The other user in the org should not be able to view these items --> NOT AUTOMATED
    // All the items in Form Library/Shared Data are visible to all members in that org 
    const userContext = await browser.newContext()
    const page2 = await userContext.newPage()
    const loginComponents2 = new LoginComponents(page2);
    const engynNavigation2 = new EngynNavigation(page2);
    await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation2.NavigateToFormsPage(page2);
    await page2.getByRole('link', { name: 'Forms Library' }).click()
    // Check if the member user can see the form located in Form Library or not
    await expect(page2.getByRole('link', { name: formName })).toBeVisible()

})

//FORM81 //FORM82 //FORM83
test("Create the form in public and data set by copying the existing form in the My Collection list", async ({ browser }) => {
    test.setTimeout(300000)
    for (let i = 81; i <= 83; i++) {
        // Precondition: Have at least a form in the My Collection tab in the Form Library --> FORM3
        const adminContext = await browser.newContext()
        const page = await adminContext.newPage()

        // 1.Login to Engyn and navigate to the form
        const loginComponents = new LoginComponents(page);
        const engynNavigation = new EngynNavigation(page);
        const formName = 'Copy Form No.' + Date.now();
        await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
        await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
        await engynNavigation.NavigateToFormsPage(page);

        // 2.Click on the Form Designer
        await page.getByRole('link', { name: 'Forms Designer' }).click();

        // 3.Click CREATE FORM
        await page.getByRole('button', { name: 'CREATE FORM' }).click();
        // The pop-up Form Create screen will appear
        await expect(page.getByText('Form Details')).toBeVisible()

        // 4.Choose the Copy Existing option
        await page.getByRole('tab', { name: 'Copy Existing' }).click()

        // 5.Choose the option “My Collection” --> It is the default option

        // 6.Choose a form in the suggested list
        await page.getByRole('tabpanel', { name: 'Copy Existing' }).getByText(form3, { exact: true }).click()
        await page.waitForTimeout(1000)
        // The chosen preview form will display on the right side
        await expect(page.getByText('Select an existing formto duplicate')).not.toBeVisible()
        // Have two options: Start with this and Start with the Empty Form below the Form 
        await expect(page.getByRole('button', { name: 'Start With Empty Form' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Start with this' })).toBeVisible()

        // 7.Fill in the title box and the form description (optional)
        await page.getByPlaceholder('Enter Form Title').fill(formName);
        await page.getByPlaceholder('Enter an optional description').fill(formName);

        // 8.Clicking on the Start with This button
        await page.getByRole('button', { name: 'Start with this' }).click()
        // Have the pop-up “Duplicate Form successfully” on the right corner
        await expect(page.getByText('Duplicate Form successfully')).toBeVisible()
        await page.locator('.ant-notification-notice-close').click();

        // Have the confirmation Pop-up “Form Created!” --> ?

        // Users will be navigated to the designed mode with the correct title and description (optional)
        await expect(page).toHaveURL(new RegExp('.*mode=design.*'))

        // The control quantity is the same as the preview mode one --> NOT AUTOMATED

        // Users can edit the details of all controls and re-arrange their positions --> NOT AUTOMATED

        // Three buttons: Duplicate, submit, and delete are enable
        await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
        await expect(page.getByRole('button', { name: 'Duplicate' })).toBeEnabled()
        await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()

        // 9.Re-arrange the form controls --> NOT AUTOMATED

        // 10.Click Publish
        await page.getByRole('button', { name: 'Publish' }).click()

        // 11.Select Form Library as the Form Location
        if (i == 81 || i == 83) { // Step for FORM81
            await page.getByLabel('Forms Library').click()
        }
        if (i == 82) { // Step for FORM82
            await page.locator('div').filter({ hasText: /^My CollectionForms Library$/ }).getByLabel('My Collection').click()
        }

        // 12.Select Shared Data as the Data Location 
        if (i == 83) {
            await page.locator('div').filter({ hasText: /^My CollectionShared Data$/ }).getByLabel('My Collection').click()
        }
        else {
            await page.waitForTimeout(1000)
            await page.getByLabel('Shared Data').click()
        }

        // 13.Click Publish
        await page.waitForTimeout(2000)
        await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
        //  The form should present in Form Library in Form Library
        await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
        // Clicking on the form item in Form Library should open the form preview without being restricted
        await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        // The form data set should be present in Shared Data in the Core
        await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
        await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
        await page.close()
        // Clicking on the data set item in Shared Data should open the data view screen of the data set without being restricted --> NOT AUTOMATED --> Because when a new form created, there are no data on in form, so we can not click on any data item

        // All the items in Form Library/Shared Data are visible to all members in that org 
        const userContext = await browser.newContext()
        const page2 = await userContext.newPage()
        const loginComponents2 = new LoginComponents(page2);
        const engynNavigation2 = new EngynNavigation(page2);
        await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
        await engynNavigation2.NavigateToFormsPage(page2);
        await page2.getByRole('link', { name: 'Forms Library' }).click()
        // Check if the member user can see the form located in Form Library or not
        if (i == 83 || i == 81) {
            await expect(page2.getByRole('link', { name: formName })).toBeVisible()
        }
        else {
            await expect(page2.getByRole('link', { name: formName })).not.toBeVisible()
        }
        // Check if the member user can see the form located in Form Library or not
        await page2.getByRole('menuitem', { name: 'Core' }).click()
        if (i == 83) {
            await expect(page2.getByRole('link', { name: formName + ' DataSet' })).not.toBeVisible()
        }
        else {
            await expect(page2.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
        }
        await page2.close()
    }
})

//FORM84 //FORM85 //FORM86
test(" Create the form and its data set by copying the existing form in the Form Library list", async ({ browser }) => {
    test.setTimeout(300000)
    for (let i = 84; i <= 86; i++) {
        // Precondition: Have at least a form in the My Collection tab in the Form Library --> FORM3
        const adminContext = await browser.newContext()
        const page = await adminContext.newPage()

        // 1.Login to Engyn and navigate to the form
        const loginComponents = new LoginComponents(page);
        const engynNavigation = new EngynNavigation(page);
        const formName = 'Copy Form No.' + Date.now();
        await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
        await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
        await engynNavigation.NavigateToFormsPage(page);

        // 2.Click on the Form Designer
        await page.getByRole('link', { name: 'Forms Designer' }).click();

        // 3.Click CREATE FORM
        await page.getByRole('button', { name: 'CREATE FORM' }).click();
        // The pop-up Form Create screen will appear
        await expect(page.getByText('Form Details')).toBeVisible()

        // 4.Choose the Copy Existing option
        await page.getByRole('tab', { name: 'Copy Existing' }).click()

        // 5.Choose the option “Forms Library” 
        await page.getByLabel('Forms Library').click()

        // 6.Choose a form in the suggested list
        await page.getByRole('tabpanel', { name: 'Copy Existing' }).getByText(form1, { exact: true }).click()
        await page.waitForTimeout(1000)
        // The chosen preview form will display on the right side
        await expect(page.getByText('Select an existing formto duplicate')).not.toBeVisible()
        // Have two options: Start with this and Start with the Empty Form below the Form 
        await expect(page.getByRole('button', { name: 'Start With Empty Form' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Start with this' })).toBeVisible()

        // 7.Fill in the title box and the form description (optional)
        await page.getByPlaceholder('Enter Form Title').fill(formName);
        await page.getByPlaceholder('Enter an optional description').fill(formName);

        // 8.Clicking on the Start with This button
        await page.getByRole('button', { name: 'Start with this' }).click()
        // Have the pop-up “Duplicate Form successfully” on the right corner
        await expect(page.getByText('Duplicate Form successfully')).toBeVisible()
        await page.locator('.ant-notification-notice-close').click();

        // Have the confirmation Pop-up “Form Created!” --> ?

        // Users will be navigated to the designed mode with the correct title and description (optional)
        await expect(page).toHaveURL(new RegExp('.*mode=design.*'))

        // The control quantity is the same as the preview mode one --> NOT AUTOMATED

        // Users can edit the details of all controls and re-arrange their positions --> NOT AUTOMATED

        // Three buttons: Duplicate, submit, and delete are enable
        await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
        await expect(page.getByRole('button', { name: 'Duplicate' })).toBeEnabled()
        await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()

        // 9.Re-arrange the form controls --> NOT AUTOMATED

        // 10.Click Publish
        await page.getByRole('button', { name: 'Publish' }).click()

        // 11.Select Form Library as the Form Location
        if (i == 84 || i == 86) { // Step for FORM81
            await page.getByLabel('Forms Library').click()
        }
        if (i == 85) { // Step for FORM82
            await page.locator('div').filter({ hasText: /^My CollectionForms Library$/ }).getByLabel('My Collection').click()
        }

        // 12.Select Shared Data as the Data Location 
        if (i == 86) {
            await page.locator('div').filter({ hasText: /^My CollectionShared Data$/ }).getByLabel('My Collection').click()
        }
        else {
            await page.waitForTimeout(1000)
            await page.getByLabel('Shared Data').click()
        }

        // 13.Click Publish
        await page.waitForTimeout(2000)
        await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
        //  The form should present in Form Library in Form Library
        await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
        // Clicking on the form item in Form Library should open the form preview without being restricted
        await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        // The form data set should be present in Shared Data in the Core
        await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
        await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
        await page.close()
        // Clicking on the data set item in Shared Data should open the data view screen of the data set without being restricted --> NOT AUTOMATED --> Because when a new form created, there are no data on in form, so we can not click on any data item

        // All the items in Form Library/Shared Data are visible to all members in that org 
        const userContext = await browser.newContext()
        const page2 = await userContext.newPage()
        const loginComponents2 = new LoginComponents(page2);
        const engynNavigation2 = new EngynNavigation(page2);
        await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
        await engynNavigation2.NavigateToFormsPage(page2);
        await page2.getByRole('link', { name: 'Forms Library' }).click()
        // Check if the member user can see the form located in Form Library or not
        if (i == 84 || i == 86) {
            await expect(page2.getByRole('link', { name: formName })).toBeVisible()
        }
        else {
            await expect(page2.getByRole('link', { name: formName })).not.toBeVisible()
        }

        // Check if the member user can see the form data located in Form Library or not
        await page2.getByRole('menuitem', { name: 'Core' }).click()
        if (i == 86) {
            await expect(page2.getByRole('link', { name: formName + ' DataSet' })).not.toBeVisible()
        }
        else {
            await expect(page2.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
        }
        await page2.close()
    }
})

//FORM92 //FORM93 //FORM94
test("Create the blank form and its dataset by copying the existing form", async ({ browser }) => {
    test.setTimeout(400000)
    for (let i = 92; i <= 94; i++) {
        const adminContext = await browser.newContext()
        const page = await adminContext.newPage()

        // 1.Login to Engyn and navigate to the form
        const loginComponents = new LoginComponents(page);
        const engynNavigation = new EngynNavigation(page);
        const formControls = new FormControls(page);

        const formName = 'Copy Form No.' + Date.now();
        await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
        await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
        await engynNavigation.NavigateToFormsPage(page);

        // 2.Click on the Form Designer
        await page.getByRole('link', { name: 'Forms Designer' }).click();

        // 3.Click CREATE FORM
        await page.getByRole('button', { name: 'CREATE FORM' }).click();

        // 4.Fill in the title box and the description (optional)
        await page.getByPlaceholder('Enter Form Title').fill(formName);
        await page.getByPlaceholder('Enter an optional description').fill(formName);

        // 5.Choose the Copy Existing option
        await page.getByRole('tab', { name: 'Copy Existing' }).click()

        // 6.Choose one option from two ones: “My Collection”/“Form Library”
        await page.getByLabel('Forms Library').click()

        // 7.Choose a form in the suggested list
        await page.getByRole('tabpanel', { name: 'Copy Existing' }).getByText(form1, { exact: true }).click()
        await page.waitForTimeout(1000)
        // The chosen preview form will display on the right side
        await page.getByText('Preview', { exact: true }).isVisible()
        // Have two options: Start with this and Start with the Empty Form below the Form
        await expect(page.getByRole('button', { name: 'Start With Empty Form' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Start with this' })).toBeVisible()

        // 8.Clicking on the Start with Empty Form button
        await page.getByRole('button', { name: 'Start With Empty Form' }).click()
        // Have the confirmation Pop-up “Form Created!”
        await expect(page.getByText('Form Created!')).toBeVisible()
        await page.getByRole('button', { name: 'OK' }).click()
        // The system displays the design page with no controls there
        await expect(page.getByText('This form is empty!')).toBeVisible()
        // The title and the description ( optional) are the same as the user’s typing before
        await expect(page.locator("//div[@class='ant-row form-title-wrapper']//h5")).toHaveText(formName);
        // The “Duplicate” and “Publish” are disabled, only the Delete is enabled
        await expect(page.getByRole('button', { name: 'DUPLICATE' })).toBeDisabled()
        await expect(page.getByRole('button', { name: 'PUBLISH' })).toBeDisabled()

        // 9.Create the first control
        // 10.Edit the Show in List field: Summary
        await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
        await expect(page.getByText('Add Element')).toBeVisible();
        await formControls.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);

        // 11.Click Publish
        await page.getByRole('button', { name: 'Publish' }).click()

        switch (i) {
            case 92:
                // 12.Select Form Library as the Form Location
                await page.getByLabel('Forms Library').click()

                // 13.Select Shared Data as the Data Location
                await page.getByLabel('Shared Data').click()

                // 14.Click Publish
                await page.waitForTimeout(2000)
                await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
                break;

            case 93:
                // 12.Select Form Library as the Form Location
                await page.getByLabel('Forms Library').click()

                // 13.Select My Collection as the Data Location
                await page.locator('div').filter({ hasText: /^My CollectionShared Data$/ }).getByLabel('My Collection').click()

                // 14.Click Publish
                await page.waitForTimeout(2000)
                await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
                break;

            case 94:
                // 12.Select My Collection as the Form Location
                await page.locator('div').filter({ hasText: /^My CollectionForms Library$/ }).getByLabel('My Collection').click()

                // 13.Select Share Data as the Data Location
                await page.getByLabel('Shared Data').click()

                // 14.Click Publish
                await page.waitForTimeout(2000)
                await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
                break;
        }

        // After clicking publish, the user should navigate to the preview mode of the created form
        await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))
        // The form should present in Form Library in Form Library
        await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
        // Clicking on the form item in Form Library should open the form preview without being restricted
        await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')
        await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
        await page.waitForTimeout(1000)
        await page.keyboard.press('Escape')

        // The form data set should be present in My Collection in Core
        await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
        await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
        // Clicking on the data set item in My Collection should open the data view screen of the data set without being restricted --> NOT AUTOMATED --> Because when a new form created, there are no data on in form, so we can not click on any data item
        // All the items in My Collection are only visible to the owner itself. The other user in the org should not be able to view these items --> NOT AUTOMATED
        await page.close()

        // All the items in Form Library/Shared Data are visible to all members in that org

        const userContext = await browser.newContext()
        const page2 = await userContext.newPage()
        const loginComponents2 = new LoginComponents(page2);
        const engynNavigation2 = new EngynNavigation(page2);
        await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
        await engynNavigation2.NavigateToFormsPage(page2);
        await page2.getByRole('link', { name: 'Forms Library' }).click()

        switch (i) {
            case 92:
                // Check if the member user can see the form located in Form Library or not
                await expect(page2.getByRole('link', { name: formName })).toBeVisible()
                // Check if the member user can see the form located in Form Library or not
                await page2.getByRole('menuitem', { name: 'Core' }).click()
                await expect(page2.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()

                break;

            case 93:
                // Check if the member user can see the form located in Form Library or not
                await expect(page2.getByRole('link', { name: formName })).toBeVisible()
                // Check if the member user can see the form located in Form Library or not
                await page2.getByRole('menuitem', { name: 'Core' }).click()
                await expect(page2.getByRole('link', { name: formName + ' DataSet' })).not.toBeVisible()

                break;

            case 94:
                // Check if the member user can see the form located in Form Library or not
                await expect(page2.getByRole('link', { name: formName })).not.toBeVisible()
                // Check if the member user can see the form located in Form Library or not
                await page2.getByRole('menuitem', { name: 'Core' }).click()
                await expect(page2.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()

                break;
        }

        await expect(page2).toHaveURL(new RegExp('.*data-set.*'))
        await page2.close()
    }
})

//FORM96
test("Verify that user can not publish form in the public collection by the member role", async ({ page }) => {
    const formName = 'Copy Form No.' + Date.now();
    const formControls = new FormControls(page);

    //Step1 --> Step6
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Designer' }).click();
    await page.getByRole('button', { name: 'CREATE FORM' }).click();
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);
    await page.getByText(' Empty Form').click();
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await expect(page.getByText('Form Created!')).toBeVisible()
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Duplicate' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled()

    // 7.Create the first control 
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);


    // 8.Click Publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // The Form Libary option is disable in “Form Location?” field
    // The Shared data option is disable in the “Data Location?” field
    await expect(page.getByLabel('Forms Library')).toBeDisabled()
    await expect(page.getByLabel('Shared Data')).toBeDisabled()
})

//FORM97 
test("Verify that user can not publish form in Form Library tab from the personal org", async ({ page }) => {
    const formName = 'Copy Form No.' + Date.now();
    const formControls = new FormControls(page);

    // 1.Login to Engyn 
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);

    // 2.Change the org to the Personal account
    await GeneralComponent.changePersonalOrg(page);

    // 3.Navigate to Form 
    await engynNavigation.NavigateToFormsPage(page);

    // 4.Navigate to Form Designer 
    await page.getByRole('link', { name: 'Forms Designer' }).click();

    // 5.Click Create Form 
    await page.getByRole('button', { name: 'CREATE FORM' }).click();

    // 6.Fill in the Name and Description (optional)
    await page.getByPlaceholder('Enter Form Title').fill(formName);
    await page.getByPlaceholder('Enter an optional description').fill(formName);

    // 7.Choose the option Empty
    await page.getByText(' Empty Form').click();

    // 8.Click Create 
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByText('The next step is to add some data entry controls to your form')).toBeVisible();
    await expect(page.getByText("When you're ready to use the form, publish it to make it available")).toBeVisible();
    await expect(page.getByText('Form Created!')).toBeVisible()
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Duplicate' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled()

    // 9.Create the first control
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);

    // 10.Click Publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // The Form Libary option is disable in “Form Location?” field
    // The Shared data option is disable in the “Data Location?” field
    await expect(page.getByLabel('Forms Library')).toBeDisabled()
    await expect(page.getByLabel('Shared Data')).toBeDisabled()

    // 11. Click Publish Form
    await page.waitForTimeout(2000)
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()

    // After clicking publish, the user should navigate to the preview mode of the created form
    await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))
    // The form should present in My Collection in the Form Library
    await expect(page).toHaveURL(new RegExp('.*/forms-library.*'))
    // Clicking on the form item in My Collection should open the form preview without being restricted
    await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')

    // The form data set should be present in My Collection in Core
    await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
    // Verify there is not data in Shared Data
    await expect(page.getByText('No data')).toBeVisible()
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
    // Clicking on the data set item in My Collection should open the data view screen of the data set without being restricted
    await page.getByRole('link', { name: formName + ' DataSet' }).click()
    await expect(page.getByText('All Items')).toBeVisible()
})

//FORM102
test("FORM102 - Create the blank form and publish this in the My Collection and its dataset in the public dataset", async ({ browser }) => {
    // Step1 --> Step6
    const pageContext = await browser.newContext()
    const page = await pageContext.newPage()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    // The Delete button in Enable, the Duplicate, and the Publish button are disabled
    await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Duplicate' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled()

    await AddFirstControl(page);
    
    // 7.Create a control 
    // 8.Edit the Show in List field: Summary
    await Promise.all([ // --> Add form and wait the auto save spinning appear
        expect(page.locator(".section-header-wrapper").filter({hasText: 'properties'}).locator(".ant-spin-spinning")).toBeAttached({timeout: 20000}),
        formControls.AddTextField_TextArea('Text Area', false, true, true, false, true, true, false, true)
    ])

    // Validate `Auto Save` spining disappear
    await expect(page.locator(".section-header-wrapper").filter({hasText: 'properties'}).locator(".ant-spin-spinning")).not.toBeAttached()

    // 9.Click Publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // 10.Select My Collection as the Form Location
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
    await page.locator('div').filter({ hasText: /^My CollectionForms Library$/ }).getByLabel('My Collection').click()

    // 11.Select Shared Data as the Data Location 
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'Private & Linked DataSet' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
    await page.getByLabel('Shared Data').click()
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'Default' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })

    // 12.Click Publish
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
    // The form should present in Form Library in Form Library
    await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
    // Clicking on the form item in Form Library should open the form preview without being restricted
    await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    // The form data set should be present in Shared Data in the Core
    await page.getByRole('menuitem', { name: 'Core' }).click()
    await expect(page.locator(".shared-collection-wrapper").filter({hasText: 'Shared Data'}).getByRole('link', { name: formName + ' DataSet' })).toBeVisible()

    // Clicking on the data set item in My Collection should open the data view screen of the data set without being restricted
    await page.getByRole('link', { name: formName + ' DataSet' }).click()
    await expect(page.getByRole('button', { name: 'Add Record' })).toBeVisible()

    // All the items in My Collection are only visible to the owner itself.
    await page.getByRole('menuitem', { name: 'Forms', exact: true }).click()
    await page.getByRole('link', { name: 'Forms Library' }).click()
    await expect(page.locator(".forms-private-collection-wrapper").filter({hasText: 'My Collection'}).getByText(formName)).toBeVisible()

    await page.close()

    // All the items in Form Library/Shared Data are visible or not My Collection is not visible to all members in that org
    const page2Context = await browser.newContext()
    const page2 = await page2Context.newPage()
    const loginComponents2 = new LoginComponents(page2);
    const engynNavigation2 = new EngynNavigation(page2);
    await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation2.NavigateToFormsPage(page2);
    await page2.getByRole('link', { name: 'Forms Library' }).click()
    await expect(page2.getByRole('link', { name: formName })).not.toBeVisible()

    await page2.getByRole('menuitem', { name: 'Core' }).click()
    await expect(page2.locator(".shared-collection-wrapper").filter({hasText: 'Shared Data'}).getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
})

//FORM101
test("FORM101 - Create the blank form and publish this in the form Library and its dataset in the public dataset", async ({ browser }) => {
    // Step1 --> Step6
    const pageContext = await browser.newContext()
    const page = await pageContext.newPage()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    // The Delete button in Enable, the Duplicate, and the Publish button are disabled
    await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Duplicate' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled()

    await AddFirstControl(page);

    // 7.Create a control 
    // 8.Edit the Show in List field: Summary
    await formControls.AddTextField_TextArea('Text Area', false, true, true, false, true, true, false, true);
    
    // Validate `Auto Save` spining disappear
    await expect(page.locator(".section-header-wrapper").filter({hasText: 'properties'}).locator(".ant-spin-spinning")).not.toBeAttached()

    // 9.Click Publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // 10.Select Form Library as the Form Location
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
    await page.getByLabel('Forms Library').click()
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'Forms Library' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })


    // 11.Select Shared Data as the Data Location 
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'Private & Linked DataSet' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
    await page.getByLabel('Shared Data').click()
    await page.locator("//div[@role='tabpanel']").filter({ hasText: 'Default' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })

    // 12.Click Publish
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
    // The form should present in Form Library in Form Library
    await expect(page).toHaveURL(new RegExp('.*forms-library.*'))
    // Clicking on the form item in Form Library should open the form preview without being restricted
    await page.locator("//*[local-name()='svg' and @data-icon='file-lines']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    await page.locator("//*[local-name()='svg' and @data-icon='tablet-button']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    await page.locator("//*[local-name()='svg' and @data-icon='mobile-notch']").click()
    // Validate the if the form preview is shown
    await expect(page.getByRole('dialog').getByRole('heading', { name: formName })).toBeVisible()
    await expect(async () => {
        await page.keyboard.press('Escape')
        await expect(page.locator("//div[@class='ant-modal-root']")).not.toBeAttached({ timeout: 100 })
    }).toPass();

    // The form data set should be present in Shared Data in the Core
    await page.getByRole('menuitem', { name: 'Core' }).click()
    await expect(page.locator(".shared-collection-wrapper").filter({hasText: 'Shared Data'}).getByRole('link', { name: formName + ' DataSet' })).toBeVisible()

    // Clicking on the data set item in My Collection should open the data view screen of the data set without being restricted --> NOT AUTOMATED --> Because when a new form created, there are no data on in form, so we can not click on any data item
    await page.getByRole('link', { name: formName + ' DataSet' }).click()
    await expect(page.getByRole('button', { name: 'Add Record' })).toBeVisible()
    await page.close()

    // All the items in Form Library/Shared Data are visible to all members in that org
    const page2Context = await browser.newContext()
    const page2 = await page2Context.newPage()
    const loginComponents2 = new LoginComponents(page2);
    const engynNavigation2 = new EngynNavigation(page2);
    await loginComponents2.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation2.NavigateToFormsPage(page2);
    await page2.getByRole('link', { name: 'Forms Library' }).click()
    await expect(page2.locator(".forms-library-tabs-wrapper").filter({hasText: 'Forms Library'}).getByRole('link', { name: formName })).toBeVisible()

    await page2.getByRole('menuitem', { name: 'Core' }).click()
    await expect(page2.locator(".shared-collection-wrapper").filter({hasText: 'Shared Data'}).getByRole('link', { name: formName + ' DataSet' })).toBeVisible()
})