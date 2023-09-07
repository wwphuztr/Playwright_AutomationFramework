import { partialURL, url } from "../../Environments/configVariables"
import { test, expect } from "../../fixtures/baseTest"

test.beforeEach(async ({ page }) => {
    await page.goto(url.login!, {waitUntil: 'load'})
})

test.afterEach(async ({ page }) => {
    await page.close()
})

test("BASE26 - Check the edit function on organization details page", async ({ loginPage, dashBoardPage, organizationPage }) => {
    const descInput = 'Describe' + Date.now();
    const HOInput = 'HO Address' + Date.now();
    const POInput = 'PO Adress' + Date.now();
    const OfficePhoneInput = 'Office Phone' + Date.now();
    const EmailInput = Date.now() + '@mailinator.com';
    const WebsiteInput = 'https://' + Date.now() + '.com';
    await loginPage.login(process.env.ORGADMINUSERNAME!, process.env.PASSWORD!)
    // 1.Go to the Setting → choose the org that you are admin
    await dashBoardPage.mnuItemSetting.hover()
    await dashBoardPage.mnuItemOrg.click()

    // 2.Click on the edit button
    await organizationPage.btnEdit.click()

    // 3 Fill in the information on the form following these points:
    // 3.a required fields:  “Name” & “Display Name”

    // 3.b Need to input number that has the length is 11 number: “ABN” field
    await organizationPage.txtABN.fill('12-345-678-901')

    // 3.c Need to input the valid phone number: “Office phone” field
    await organizationPage.txtOfficePhone.clear()
    await organizationPage.txtOfficePhone.fill('123456789')
    await organizationPage.txtEmail.click()
    // Verify that inputing invalid phone
    await organizationPage.expectText('Incorrect phone number')

    await organizationPage.txtOfficePhone.clear()
    await organizationPage.txtOfficePhone.fill('444444444')

    // 3.d Need to input the valid email: “Email” field
    await organizationPage.txtEmail.fill(EmailInput)

    // 3.e Need to begin with https:// “Website” field
    await organizationPage.txtWebsite.fill(WebsiteInput)

    // 3.f Can accept any value: “Description”, “Head Office Address” and “Postal Address” fields
    await organizationPage.txtDescription.fill(descInput)
    await organizationPage.txtABN.fill('12-345-678-901')
    await organizationPage.txtPostalAddress.fill(POInput)
    await organizationPage.txtHeadOfficeAddress.fill(HOInput)

    // 4.Click on the Update button
    await organizationPage.btnUpdate.click()

    // User will be navigated to Organization Details with the updated information
    await organizationPage.expectToHaveURL(partialURL.organisations)
    await organizationPage.btnOK.click()
    await organizationPage.expectText(descInput)
    await organizationPage.expectText(HOInput)
    await organizationPage.expectText(POInput)
    await organizationPage.expectText(EmailInput)
    await organizationPage.expectText(WebsiteInput)
})

test("BASE27 - Verify edited information is not saved when canceling while editing", async ({ loginPage, dashBoardPage, organizationPage }) => {
    const descInput = 'Describe' + Date.now()
    const HOInput = 'HO Address' + Date.now()
    const POInput = 'PO Adress' + Date.now()
    const EmailInput = Date.now() + '@mailinator.com'
    const WebsiteInput = 'https://' + Date.now() + '.com'
    await loginPage.login(process.env.ORGADMINUSERNAME!, process.env.PASSWORD!)

    await dashBoardPage.mnuItemSetting.hover()
    await dashBoardPage.mnuItemOrg.click()
    await organizationPage.btnEdit.click()

    await expect(organizationPage.txtHeadOfficeAddress).toBeAttached()
    const oldHOAddress = await organizationPage.txtHeadOfficeAddress.inputValue()
    const oldPOAddress = await organizationPage.txtPostalAddress.inputValue()
    const oldEmail = await organizationPage.txtEmail.inputValue()
    const oldWebsite = await organizationPage.txtWebsite.inputValue()
    
    await organizationPage.txtHeadOfficeAddress.fill(HOInput)
    await organizationPage.txtPostalAddress.fill(POInput)
    await organizationPage.txtEmail.fill(EmailInput)
    await organizationPage.txtWebsite.fill(WebsiteInput)

    await organizationPage.btnCancel.click()
    await expect(organizationPage.headingOrg).toBeVisible()
    
    await organizationPage.expectText(oldHOAddress)
    await organizationPage.expectText(oldPOAddress)
    await organizationPage.expectText(oldEmail)
    await organizationPage.expectText(oldWebsite)
})

test("BASE28 - Verify manager cannot edit Org Details page", async ({ loginPage, dashBoardPage, organizationPage }) => {

    await loginPage.login(process.env.ORGMEMBERUSERNAME!, process.env.PASSWORD!)
    // 1.Go to the Username icon → choose the mentioned org
    await dashBoardPage.changeOrg('Flynk Automation Org Member')

    // 2.Hover the Setting icon 
    await dashBoardPage.mnuItemSetting.hover()

    // 3.Click Organization
    await dashBoardPage.mnuItemOrg.click()

    // 4.Observe the page
    await expect(organizationPage.btnEdit).not.toBeVisible()
})

test("BASE29 - Verify member cannot edit Org Details page", async ({ loginPage, dashBoardPage, organizationPage }) => {

    await loginPage.login(process.env.ORGMEMBERUSERNAME!, process.env.PASSWORD!)
    // 1.Click the expand icon
    // 2.Click on the Username icon → change the org to the mentioned org
    await dashBoardPage.changeOrg('Flynk Automation Org Member')

    // 3.Click on the Setting
    await dashBoardPage.mnuItemSetting.hover()

    // 4.Click Organization
    await dashBoardPage.mnuItemOrg.click()

    // 5.Observe the page
    await expect(organizationPage.btnEdit).not.toBeVisible()
})

test("BASE30 - Verify user can use breadcrumbs to navigate back to homepage", async ({ loginPage, dashBoardPage, organizationPage }) => {
    // 1.Login the account
    await loginPage.login(process.env.ORGADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click on the Setting → Organization tab
    await dashBoardPage.mnuItemSetting.hover()
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click on the breadcrumb ‘Home’
    await organizationPage.lnkHome.click()

    // 4.Observe the page
    await organizationPage.expectToHaveURL(partialURL.dashboard)
})