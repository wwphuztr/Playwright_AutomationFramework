import { test, expect, Page, Browser } from '@playwright/test';
import { EngynNavigation } from '../../page/EngynNavigation';
import { FormControls } from '../../page/FormControl';
import { LoginComponents } from '../../page/loginComponent';
import { strict as assert } from 'assert';

// form1 and form2 are the forms that is located in FORM LIBRARY
const form1 = 'form1';
const form2 = 'form2';

// form3 and form4 is the form located in MY COLLECTION
const form3 = 'form3'
const form4 = 'form4'

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

async function CreateFormInFormsMyCollection(browser: Browser, options?: string) {
    const adminContext = await browser.newContext()
    const page = await adminContext.newPage()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);
    await page.getByRole('button', { name: 'Publish' }).click()
    await page.waitForTimeout(3000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click()
    if (options == 'bookmark') {
        await page.reload()
        await engynNavigation.NavigateToFormsPage(page);
        await page.getByRole('link', { name: 'Forms Library' }).click()
        await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(formName, { exact: true }).hover()
        await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[contains(@class, 'ant-tree-treenode')]", { has: page.getByText(formName, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
        await page.waitForTimeout(1000)
        await page.getByText('Add Bookmark').click()
        await page.waitForTimeout(1000)
    }
    await page.close()
    return formName;
}

//FORM7 + FORM39
test('Save form draft and self submit a form ', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const textEntry = 'text' + Date.now();
    const numberEntry = Date.now() + 1;
    //const form1 = 'Form No.1683801120951';
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    await page.getByRole('link').filter({ hasText: form1 }).nth(0).click();
    await page.getByRole('button', { name: 'OPEN' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).click();
    await page.getByRole('textbox', { name: 'Text Entry :' }).fill(textEntry);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page.getByText('Save successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.getByRole('menuitem', { name: 'My Forms' }).getByRole('link', { name: 'My Forms' }).click();
    await page.getByText(form1).first().click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    await engynNavigation.NavigateToCorePage(page);
    await page.getByRole('link', { name: form1 }).click();
    await expect(page.getByRole('cell', { name: textEntry })).toBeVisible();
    await expect(page.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await page.close();
})

//FORM5
test('Create a duplicate form', async ({ page }) => {
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select Number', true, true, true, true, true, true, true, true, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await page.getByRole('link', { name: formName }).click();
    await page.locator('.ant-space > div:nth-child(2) > .ant-btn').click();
    await page.getByRole('button', { name: 'Duplicate' }).click();
    await expect(page.getByText('Duplicate Form successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.goto('/forms/forms-designer');
    await expect(page.getByText('Copy of ' + formName).first()).toBeVisible();
    await page.close();
})

// FORM9 + FORM10 + FORM11 + FORM13
test('Republish an edited form then submit draft then self submit a record', async ({ page }) => {
    const engynNavigation = new EngynNavigation(page);
    const formControls = new FormControls(page);
    const formName = 'Form No.' + Date.now();
    const numberEntry = Date.now() + 1;
    await CreateEmtpyForm(page, formName);
    await AddFirstControl(page);
    await formControls.AddNumber_Select('Select', true, true, true, true, true, true, true, true, true);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByText('My Collection').first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^Preview$/ }).first()).toBeVisible();
    await page.goto('/forms/forms-library');
    await page.getByRole('link', { name: formName }).click();
    await page.locator('.ant-space > div:nth-child(2) > .ant-btn').click();
    await page.locator('form').filter({ hasText: 'To pick up a draggable item, press the space bar. While dragging, use the' }).click();
    await page.locator('.form-control-item-mask-wrapper > .ant-space > div:nth-child(3) > .ant-btn').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button').click();
    await formControls.AddNumber_NumberEntry('Number Entry', true, false, true, false, true, false, true, false);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(5000);
    await engynNavigation.NavigateToCorePage(page);
    await expect(page.getByRole('link', { name: formName + ' DataSet' })).toBeVisible();
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    await page.getByRole('link').filter({ hasText: formName }).nth(0).click();
    await page.getByRole('button', { name: 'OPEN' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry.toString());
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page.getByText('Save successfully')).toBeVisible();
    await page.locator('.ant-notification-notice-close').click();
    await page.getByRole('menuitem', { name: 'Form Entries' }).getByRole('link', { name: 'Form Entries' }).click()
    await page.getByRole('link').filter({ hasText: formName }).first().click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    await page.locator('.ant-notification-notice-close').click();
    await engynNavigation.NavigateToCorePage(page);
    await page.getByRole('link', { name: formName + ' DataSet' }).click();
    await expect(page.getByRole('cell', { name: numberEntry.toString() })).toBeVisible();
    await engynNavigation.NavigateToCorePage(page);
    await page.getByRole('link', { name: formName + ' DataSet', exact: true }).first().click();
    await page.getByRole('button', { name: 'Add Record' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    const numberEntry2 = Date.now() + 2;
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry2.toString());
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('cell', { name: numberEntry2.toString() })).not.toBeVisible();
    await page.getByRole('button', { name: 'Add Record' }).click();
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).click();
    const numberEntry3 = Date.now() + 3;
    await page.getByRole('spinbutton', { name: 'Number Entry :' }).fill(numberEntry3.toString());
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('The record has been added successfully')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('cell', { name: numberEntry3.toString() })).toBeVisible();
    await page.close();
})

//FORM23 - FORM56
test('Verify the Add Folder function in the My Collection/ Forms Library tab', async ({ page }) => {
    // 1.Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');
    
    // 2.Navigate to Form Library 
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    
    // There is a My Collection tab
    await expect(page.getByText('My Collection')).toBeVisible()
    await expect(page.locator(".forms-private-collection-wrapper").filter({hasText: 'My Collection'}).locator(".ant-spin-dot-spin")).not.toBeAttached()

    // 3.Click on the more options icon on the right side of the My Collection tab
    await page.locator('//h5[contains(text(), "My Collection")]/../following-sibling::div').click();

    // 4.Click Add Folder
    await page.getByText('Add Folder').click();

    // 5.Fill the name in a Name field
    const formNameFolder = 'NameFolder No.' + Date.now();
    await page.getByPlaceholder('Enter a name').fill(formNameFolder)
    // await page.waitForTimeout(000)

    // 6.Click ADD
    await page.locator("//span[normalize-space()='Add']").click()

    await expect(page.getByText(formNameFolder)).toBeVisible()

    // 7.Repeat Steps 1 → 6 in the Forms Library tab
    await page.locator('//h5[contains(text(), "Forms Library")]/../following-sibling::div').first().click();
    await page.getByText('Add Folder').nth(1).click();
    const formNameFolder2 = 'NameFolder No1.' + Date.now();
    await page.getByPlaceholder('Enter a name').fill(formNameFolder2)
    await page.locator("//span[normalize-space()='Add']").click()
    await expect(page.getByText(formNameFolder2)).toBeVisible()

    //FORM56
    //Delete forlder in My Collection
    await page.getByText(formNameFolder).hover()
    await page.locator(`//div[normalize-space()='${formNameFolder}']/following-sibling::div[2]`).first().click()
    await page.getByRole('tooltip').getByText('Delete Folder').click()
    await page.getByRole('button', { name: 'OK' }).click()
    // Verify the folder was deleted
    await expect(page.getByText(formNameFolder, {exact: true})).not.toBeAttached()

    //Delete folder in Form Library
    await page.getByText(formNameFolder2).hover()
    await page.locator(`//div[normalize-space()='${formNameFolder2}']/following-sibling::div[2]`).first().click()
    await page.getByRole('tooltip').getByText('Delete Folder').click()
    await page.getByRole('button', { name: 'OK' }).click()
    // Verify the folder was deleted
    await expect(page.getByText(formNameFolder2, {exact: true})).not.toBeAttached()
})

//FORM68
test("Users can not edit the form in the Library tab with the member role", async ({ page }) => {

    // Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Member');

    // Navigate to Forms Library
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // Click on the Form
    await page.locator(`//div[normalize-space()='All the forms that you can see and are published by members of your organization can be found below']/../../..//a[normalize-space()='${form1}']`).click()

    // Users can not see the edit function there.
    await expect(page.locator("//span[normalize-space()='OPEN']/../../..//*[local-name()='svg']")).not.toBeVisible()
})

async function publishForm(page: Page) {
        // 2. Navigate to Forms Library
        //await page.locator('.ant-layout-sider-trigger').click()
        await page.getByRole('link', { name: 'Forms Library', exact: true }).click();

        // 3. Click on the mentioned form
        await page.locator("//div[@class='forms-library-tabs-wrapper']").filter({ hasText: 'Forms Library' }).getByRole('link', { name: form1 }).click()

        // 4. Click Edit 
        await page.locator(".form-preview-action-buttons-wrapper").filter({ hasText: 'Open' }).locator("//button[contains(@class, 'edit-button')]").click()

        // 5. Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)
        // Click on the controller
        await expect(page.getByText('TEXT ENTRYTEXT ENTRY')).toBeAttached()
        await expect(async () => {
            const box = await page.getByText('TEXT ENTRYTEXT ENTRY').boundingBox()
            await page.mouse.click(box!.x + box!.width / 3, box!.y + box!.height / 3);
            await expect(page.getByRole('tabpanel', { name: 'PROPERTIES' }).getByText('Is Sortable')).toBeVisible({ timeout: 1000 })
        }).toPass();

        // Modify `Is Sortable`
        page.getByRole('checkbox', { name: 'Is Sortable' }).click();
        // Check Auto-Saved
        await expect(page.locator("//span[normalize-space()='Saved']")).toBeAttached()
        await expect(page.locator("//span[normalize-space()='Saved']")).not.toBeAttached()

        // 6. Click Publish
        await page.getByRole('button', { name: 'Publish' }).click()

        // 7. Click Confirm
        await page.getByRole('button', { name: 'Confirm' }).click()
        const newVersion = await page.locator('#revision').inputValue()

        // The user should be navigated to the preview mode of the form
        await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))

        // The version should be changed according to the confirmation modal
        const exptectedVersion = 'v1.0.' + newVersion
        await page.getByText(exptectedVersion).click() // This line also check that the expectedVersion is correct

        // The open/Edit button should be enabled
        await expect(page.getByRole('button', { name: 'OPEN' })).toBeEnabled()
        await expect(page.locator(".form-preview-action-buttons-wrapper").filter({ hasText: 'Open' }).locator("//button[contains(@class, 'edit-button')]")).toBeEnabled()
};

//FORM69
test("Edit and republish a form in the Form Library tab", async ({ page }) => {
    // 1. Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(page);

    // Step2 --> Step7
    await publishForm(page)
    
    // 8. Repeat Step 2 → 7 for 2 more times
    await publishForm(page)

    // The data set of the form can be opened without any issue
    await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click()
    await page.getByRole('link', { name: form1 + ' DataSet', exact: true }).click()
    await expect(page.getByRole('cell', { name: 'TEXT ENTRY' })).toBeVisible()
})

//FORM70
test("Edit and delete the draft form (Form in My Collection)", async ({ page }) => {
    // 1. Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');

    // 2. Navigate to Forms Library
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // 3. Click on the mentioned form
    await page.locator("//h5[normalize-space()='My Collection']/../../../../..//div[normalize-space(text())='form3']").click()

    // 4. Click Edit 
    await page.locator("//span[normalize-space()='OPEN']/../../..//*[local-name()='svg']").click()
    // Users will be navigated to the Designed mode.
    await expect(page).toHaveURL(new RegExp('.*mode=design.*'))
    // The form version has been added the text “Draft form” on the left and its color changed to grey
    await expect(page.getByText('Draft from')).toBeVisible()
    // Verify the color changed to grey
    let element = page.getByText('Draft from')

    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    console.log(color);
    if (color != 'rgba(0, 0, 0, 0.45)') {
        throw new Error("The color may be wrong")
    }
    //The tab Form Library changed to Form Designer --> NOT AUTOMATED

    // Click on form control
    await expect(page.getByText('TEXT ENTRYTEXT ENTRY')).toBeAttached()
        await expect(async () => {
            const box = await page.getByText('TEXT ENTRYTEXT ENTRY').boundingBox()
            await page.mouse.click(box!.x + box!.width / 3, box!.y + box!.height / 3);
            await expect(page.getByRole('tabpanel', { name: 'PROPERTIES' }).getByText('Is Sortable')).toBeVisible({ timeout: 1000 })
        }).toPass();

    // 5. Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)
    // Modify the Is Sortable Properties
    await page.getByRole('checkbox', { name: 'Is Sortable' }).click()

    // 6. Click Form Designer
    await page.getByRole('link', { name: 'Forms Designer', exact: true }).click()
    // The draft form stays on the top of the “Draft Forms” and the “Recently Edited” tabs
    await expect(page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText('form3', { exact: true })).toBeVisible()

    // 7. Click the first form
    //await page.locator("//h5[normalize-space(text())='Draft Forms']/../../..//h5[normalize-space(text())='form3']").click()
    await page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText('form3', { exact: true }).click()

    // 8. Click Delete 
    await page.getByRole('button', { name: 'Delete' }).click()

    // 9. Click Confirm
    await page.getByRole('button', { name: 'OK' }).click()
    // The user has been navigated to the Forms Designer pageh
    await expect(page).toHaveURL(new RegExp('.*forms-designer.*'))
    // The draft form disappears from the draft form list
    await expect(page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText('form3', { exact: true })).not.toBeVisible()
})

//FORM71 
test("Edit and delete the draft form (Form in Forms Library)", async ({ page }) => {
    // 1. Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');

    // 2. Navigate to Forms Library
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // 3. Click on the mentioned form
    await page.locator("//div[@class='forms-library-grid-column']").filter({ hasText: 'Forms Library' }).getByText(form1, { exact: true }).click()

    // 4. Click Edit 
    await page.locator("//span[normalize-space()='OPEN']/../../..//*[local-name()='svg']").click()
    // Users will be navigated to the Designed mode.
    await expect(page).toHaveURL(new RegExp('.*mode=design.*'))
    // The form version has been added the text “Draft form” on the left and its color changed to grey
    await expect(page.getByText('Draft from')).toBeVisible()
    // Verify the color changed to grey
    let element = page.getByText('Draft from')

    let color = await element.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('color');
    });
    console.log(color);
    if (color != 'rgba(0, 0, 0, 0.45)') {
        throw new Error("The color may be wrong")
    }
    //The tab Form Library changed to Form Designer --> NOT AUTOMATED

    // Click on form control
    await expect(page.getByText('TEXT ENTRYTEXT ENTRY')).toBeAttached()
    await expect(async () => {
        const box = await page.getByText('TEXT ENTRYTEXT ENTRY').boundingBox()
        await page.mouse.click(box!.x + box!.width / 3, box!.y + box!.height / 3);
        await expect(page.getByRole('tabpanel', { name: 'PROPERTIES' }).getByText('Is Sortable')).toBeVisible({ timeout: 1000 })
    }).toPass();

    // 5. Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)
    // Modify the Is Sortable Properties
    await page.getByRole('checkbox', { name: 'Is Sortable' }).click()

    // 6. Click Form Designer
    await page.getByRole('link', { name: 'Forms Designer', exact: true }).click()
    // The draft form stays on the top of the “Draft Forms” and the “Recently Edited” tabs
    await expect(page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText(form1, { exact: true })).toBeVisible()

    // 7. Click the first form
    await page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText(form1, { exact: true }).click()

    // 8. Click Delete 
    await page.getByRole('button', { name: 'Delete' }).click()

    // 9. Click Confirm
    await page.getByRole('button', { name: 'OK' }).click()
    // The user has been navigated to the Forms Designer pageh
    await expect(page).toHaveURL(new RegExp('.*forms-designer.*'))
    // The draft form disappears from the draft form list
    await expect(page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText(form1, { exact: true })).not.toBeVisible()
})

//FORM72
test("Users self-submit the forms without saving them (For the form in the My Collection tab)", async ({ page }) => {
    // 1.Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');

    // 2.Click Form Library
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // 3.pen the mentioned form
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(form3, { exact: true }).click()

    // 4.Click Open
    await page.getByRole('button', { name: 'OPEN' }).click()

    // 5.Fill some fields in the form request
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    // 6.Click Delete --> Checking

    // 7.Fill in all required fields of the form

    // 8.Click Submit
    // Have the pop-up: ”Submit successfully” in the right corner
    await page.getByRole('button', { name: 'SUBMIT' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    // The form appears in the “Recently Submitted” list with correct time --> NOT AUTOMATED
    // The form appear in the “Recently View” list with the correct time --> NOT AUTOMATED    
})

//FORM73
test("Users self-submit the forms without saving them (For the form in the Form Library tab)", async ({ page }) => {
    // 1.Navigate to Forms
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin');

    // 2.Click Form Library
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // 3.pen the mentioned form
    await page.locator("//div[@class='forms-library-grid-column']").filter({ hasText: 'Forms Library' }).getByText(form1, { exact: true }).click()

    // 4.Click Open
    await page.getByRole('button', { name: 'OPEN' }).click()

    // 5.Fill some fields in the form request
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
    await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

    // 6.Click Delete --> Checking

    // 7.Fill in all required fields of the form

    // 8.Click Submit
    // Have the pop-up: ”Submit successfully” in the right corner
    await page.getByRole('button', { name: 'SUBMIT' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Submit successfully').click();
    // The form appears in the “Recently Submitted” list with correct time --> NOT AUTOMATED
    // The form appear in the “Recently View” list with the correct time --> NOT AUTOMATED
})

async function AddFormToBookmark(page, formName, formLocation) {
    const numberEntry = Date.now();
    const textEntry = 'text' + Date.now()
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);

    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    if (formLocation == 'My Collection') {
        //Hover to the form
        await page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).getByText(formName, { exact: true }).hover()
        // Click on the ellipsis icon next to the form hovered
        await page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(formName, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
    }
    else {
        //Hover to the form
        await page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).getByText(formName, { exact: true }).hover()
        // Click on the ellipsis icon next to the form hovered
        await page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(formName, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
    }

    await page.waitForTimeout(1000)
    // Add form to bookmark
    await page.getByText('Add Bookmark').click()
    await page.waitForTimeout(1000)
}

async function RemoveBookmarkForm(page, formName, formLocation) {
    await page.goto("/")
    const engynNavigation = new EngynNavigation(page);
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();

    if (formLocation == 'My Collection') {
        await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(formName).hover()
        await page.waitForTimeout(1000)
        await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(formName, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
        await page.waitForTimeout(1000)

    }
    else {
        await page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).getByText(formName).hover()
        await page.waitForTimeout(1000)
        await page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(formName, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
        await page.waitForTimeout(1000)
    }

    await page.getByText('Remove Bookmark').click()
    await page.waitForTimeout(1000)
}

test.describe.serial('//FORM76 //FORM77 //FORM79', () => {
    //FORM76
    test("Verify users can Open the form in the Bookmarked tab", async ({ page }) => {
        // Precondition: Have at least a form in the bookmarked tab
        await AddFormToBookmark(page, form3, 'My Collection');

        // 1. Navigate to Form
        const engynNavigation = new EngynNavigation(page);
        const textEntry = 'text' + Date.now()
        const numberEntry = Date.now();
        await page.goto("/")
        await engynNavigation.NavigateToFormsPage(page);

        // 2. Go to Form Library 
        await page.getByRole('link', { name: 'Forms Library' }).click();

        // 3. Click on the bookmark icon 
        await page.locator("//*[local-name()='svg' and @data-icon='folder-bookmark']").click()

        // 4. Click on the mentioned form 
        await page.locator("//div[@class='forms-library-tabs-wrapper']").filter({ hasText: 'Bookmarked Forms' }).getByText(form3).click()

        // 5. Click on Open button 
        await page.getByRole('button', { name: 'OPEN' }).click()
        // Users have been navigated to the Form request page --> NOT AUTOMATED
        // The tab changes from the “Form Library” to the “Form Entries” 
        let element = page.locator("//li[@class='ant-menu-item ant-menu-item-selected']", { has: page.locator('text="Form Entries"') })
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

        // 6. Fill in some fields in the form 
        await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
        await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)

        // 7. Click save
        await page.getByRole('button', { name: 'SAVE' }).click();
        await page.getByText('Success', { exact: true }).click();
        await page.getByText('Save successfully').click();
        await page.locator('.ant-notification-notice-close').click();

        // 8. Click delete 
        await page.getByRole('button', { name: 'DELETE' }).click();
        // All data that have been filled in disappear
        await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).textContent()
        await expect(page.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveText("")
        // The pop-up: “ Delete successfully” appears in the right corner
        await page.getByText('Success', { exact: true }).click();
        await page.getByText('Delete successfully').click();
        await page.locator('.ant-notification-notice-close').click();


        // 9. Fill all required fields in the form with the correct format 
        await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
        await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
        await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click();
        await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString());

        // 10. Click Submit
        await page.getByRole('button', { name: 'SUBMIT' }).click();
        // The pop-up:” Submit successfully” appears in the right corner
        await page.getByText('Success', { exact: true }).click();
        await page.getByText('Submit successfully').click();
        await page.locator('.ant-notification-notice-close').click();

        // Users will be navigated to the Form Entries page and see the form with the submitted time stay at the top of the “Recently Submitted” list
        // Users can view the form with their data in the “Recently Submitted” tab  
        await page.locator("//div[@class='form-list-wrapper recently-submitted-forms-wrapper']").filter({ hasText: 'Recently Submitted' }).getByText(form3).first().click()
        await expect(page.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveValue(textEntry)
        const numberEntryString = numberEntry.toString();
        await expect(page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toHaveValue(numberEntryString)

        // Teardown for this test, because we want to unmark this form
        await RemoveBookmarkForm(page, form3, 'My Collection')
    })

    //FORM77
    test("Verify that users can edit and republish versions of the form in the bookmark tab", async ({ page }) => {
        // Precondition: Have at least a form in the bookmarked tab
        await AddFormToBookmark(page, form4, 'My Collection');

        // 1. Navigate to Form 
        const engynNavigation = new EngynNavigation(page);
        await page.goto("/")
        await engynNavigation.NavigateToFormsPage(page);
        await page.locator('.ant-layout-sider-trigger').first().click()

        // 2. Go to Form Library 
        await page.getByRole('link', { name: 'Forms Library' }).click();

        // 3. Click on the bookmark icon 
        await page.locator("//*[local-name()='svg' and @data-icon='folder-bookmark']").click()

        // 4. Click on the mentioned form 
        await page.locator("//div[@class='forms-library-tabs-wrapper']").filter({ hasText: 'Bookmarked Forms' }).getByText(form4, { exact: true }).click()
        await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))

        // 5. Click on the edit button 
        await page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']").click()

        // Users will be navigated to the designed form mode
        // The tab changes from “Forms Library” to “Form Designer
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
        await page.waitForTimeout(3000)
        color = await element.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('color');
        });
        console.log(color);
        if (color != 'rgba(0, 0, 0, 0.45)') {
            throw new Error("The color may be wrong")
        }
        // Click on the form controller (TEXT ENTRY controller)
        await expect(page.getByText('TEXT ENTRYTEXT ENTRY')).toBeAttached()
        await expect(async () => {
            const box = await page.getByText('TEXT ENTRYTEXT ENTRY').boundingBox()
            await page.mouse.click(box!.x + box!.width / 3, box!.y + box!.height / 3);
            await expect(page.getByRole('tabpanel', { name: 'PROPERTIES' }).getByText('Is Sortable')).toBeVisible({ timeout: 1000 })
        }).toPass();

        // Users can edit all the controls in the form --> NOT AUTOMATED

        // 6. Edit the control in the form(add a new control, change the control positions, delete a control, change the control type…)
        await page.getByRole('checkbox', { name: 'Is Sortable' }).click()
        
        // Wait AutoSave
        await expect(page.locator(".section-header-wrapper").filter({hasText: 'properties'}).locator(".ant-spin-spinning")).not.toBeAttached()

        // 7. Click Publish
        await page.getByRole('button', { name: 'Publish' }).click()

        // 8. Click Confirm
        const newVersion = await page.locator('#revision').inputValue()

        await page.getByRole('button', { name: 'Confirm' }).click()

        // The version should be changed according to the confirmation modal
        const exptectedVersion = 'v1.0.' + newVersion
        await page.getByText(exptectedVersion).click()
        // The Open/Edit button should be enabled
        await expect(page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']")).toBeEnabled()
        await expect(page.getByRole('button', { name: 'OPEN' })).toBeEnabled()

        // The data set of the form can be opened without any issue
        await page.getByRole('menuitem', { name: 'Core' }).locator('svg').click()
        await page.getByRole('link', { name: form4 + ' DataSet', exact: true }).click()
        await expect(page.getByRole('cell', { name: 'TEXT ENTRY' })).toBeVisible()

        // Remove bookmark
        await RemoveBookmarkForm(page, form4, 'My Collection')
    })

    //FORM79
    test("Verify that users can delete the form when editing the form (use for form in the bookmark tab)", async ({ page }) => {
        // Precondition: Have at least a form in the bookmark tab
        await AddFormToBookmark(page, form3, 'My Collection');

        // 1.Navigate to Form 
        const engynNavigation = new EngynNavigation(page);
        const textEntry = 'text' + Date.now()
        const numberEntry = Date.now();
        await page.goto("/")
        await engynNavigation.NavigateToFormsPage(page);
        await page.locator(".ant-layout-sider").filter({hasText : 'Settings'}).getByRole('button').click()

        // 2.Go to Form Library 
        await page.getByRole('link', { name: 'Forms Library' }).click();

        // 3.Click on the bookmark icon 
        await page.locator("//*[local-name()='svg' and @data-icon='folder-bookmark']").click()

        // 4.Click on the mentioned form 
        await page.locator("//div[@class='forms-library-tabs-wrapper']").filter({ hasText: 'Bookmarked Forms' }).getByText(form3).click()

        // 5.Click on the edit button 
        await page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']").click()
        // Users will be navigated to the designed form mode
        await expect(page).toHaveURL(new RegExp('.*mode=preview.*'))
        // The tab changes from “Forms Library” to “Form Designer
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

        // 6.Return to Form Designer 
        await page.getByRole('link', { name: 'Forms Designer', exact: true }).click()

        // 7.Click the first form in the Draft Form list
        await page.getByText('form3', { exact: true }).first().click()

        // 8.Click Delete
        await page.getByRole('button', { name: 'Delete' }).click()

        // 9.Click OK
        await page.getByRole('button', { name: 'OK' }).click()
        // Users will be navigated back to the Form Designer tab again 
        element = page.locator("//li[@class='ant-menu-item ant-menu-item-selected forms-designer']", { has: page.locator('text="Forms Designer"') })
        color = await element.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('border-bottom-color');
        });
        console.log(color);
        if (color.includes("50, 197, 255")) {
            console.log("OK");
        }
        else {
            throw new Error("The color may be wrong")
        }
        // The mentioned form in Step 7 disappear from the “Draft Form” list
        await expect(page.locator("//div[@class='forms-designer-grid-column']").filter({ hasText: 'Draft Forms' }).getByText(form3, { exact: true }).first()).not.toBeVisible()

        // Remove bookmark
        await RemoveBookmarkForm(page, form3, 'My Collection')
    })
});

//FORM89
test("Verify form deletion in My Collection and Forms Library", async ({ browser, page }) => {
    // Precondition: Have at least 2 forms (1 bookmarked form and 1 normal form) in the My Collection tab and Forms Library tab
    test.setTimeout(300000)
    let normalForm = await CreateFormInFormsMyCollection(browser)
    let bookmarkForm = await CreateFormInFormsMyCollection(browser, 'bookmark')

    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);

    // 1.Login to Engyn and navigate to Form
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(page);

    // 2.Click on the Form Library
    await page.getByRole('link', { name: 'Forms Library' }).click();

    // 3.Click on the more options icon which is located at the end of the mentioned folder
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(normalForm, { exact: true }).hover()
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-tree-treenode ant-tree-treenode-draggable']", { has: page.getByText(normalForm, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()

    // 4.Click Delete
    await page.getByRole('tooltip').getByText('Delete Form').click()

    // 5.Confirm deletion
    await page.getByRole('button', { name: 'OK' }).click()
    // 6.Repeat step 3 → 5 for the bookmarked form --> Step 6 included 2, 3, 4, 5 steps

    // 7.Repeat steps 1 → 6 for the form in the Forms Library tab
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).getByText(bookmarkForm, { exact: true }).hover()
    await page.locator("//div[@class='forms-private-collection-wrapper showHeader']").filter({ hasText: 'My Collection' }).locator("//div[contains(@class, 'ant-tree-treenode')]", { has: page.getByText(bookmarkForm, { exact: true }) }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
    await page.getByRole('tooltip').getByText('Delete Form').click()
    await page.getByRole('button', { name: 'OK' }).click()

    await page.close()
})



