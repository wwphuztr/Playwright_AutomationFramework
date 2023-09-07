import { test, expect, Page } from '@playwright/test'
import { EmailComponents } from '../../page/emailComponent'
import { EngynNavigation } from '../../page/EngynNavigation'
import { FormControls } from '../../page/FormControl'
import { LoginComponents } from '../../page/loginComponent'
import { GeneralComponent } from '../../page/generalComponent'

const form1 = 'form1'
const form2 = 'form2'
const form3 = 'form3'

async function SentAnEmail(browser, email, watching?: string) {
	const adminContext = await browser.newContext()
	const adminPage = await adminContext.newPage()
	const emailSubject = 'Email No67.' + Date.now()
	const emailContent = 'Content67 ' + Date.now()
	const textEntry = 'text' + Date.now()
	const numberEntry = Date.now() + 66
	const adminLoginComponents = new LoginComponents(adminPage)
	const adminEngynNavigation = new EngynNavigation(adminPage)

	// Login to Engyn with the first user and navigated to Forms
	await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await adminEngynNavigation.NavigateToFormsPage(adminPage)
	await adminPage.getByRole('link', { name: 'Form Mail' }).click()

	// Click on the Create Mail button
	await adminPage.getByRole('button', { name: 'Create Mail' }).click()

	// Click the added Form from Library
	await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click()
	await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await adminPage.waitForTimeout(1500)
	await adminPage.getByText(form1, { exact: true }).click()
	await adminPage.waitForTimeout(1000)

	// Click the Attach on the first mentioned form
	await adminPage.getByRole('button', { name: 'Attach' }).click()

	// Click Close
	await adminPage.locator("//span[normalize-space()='Close']").click()

	// Fill in the second mail user to the Recipient box
	await expect(async () => {
		await adminPage.locator('#rc_select_0').clear()
		await adminPage.locator('#rc_select_0').fill(email)
		await adminPage.waitForTimeout(2000)
		if (email != process.env.MEMBERFORMSUSERNAME) {
			await expect(adminPage.getByText(email)).toBeVisible()
		} else {
			await expect(adminPage.getByText('Forms Member')).toBeVisible()
		}
	}).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] })
	await adminPage.locator('#rc_select_0').press('Enter')
	//Fill email subject
	await adminPage.getByPlaceholder('Subject').click()
	await adminPage.getByPlaceholder('Subject').fill(emailSubject)
	await adminPage.waitForTimeout(2000)

	// Add the watcher if watching argument is defind
	if (typeof watching !== 'undefined') {
		await adminPage.locator('#rc_select_1').click()
		await adminPage.getByText('Forms Manager').click()
		await adminPage.waitForTimeout(2000)
	}

	// Click Sent
	await adminPage.getByRole('button', { name: 'Send', exact: true }).click()
	// Verify if email sent
	await adminPage.getByRole('tab', { name: 'Sent' }).click()

	await expect(async () => {
		await adminPage.reload()
		await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
	}).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] })
	await adminPage.close()

	return emailSubject
}

//FORM20
test('Verify draft mail in mail box', async ({ page }) => {
	const loginComponents = new LoginComponents(page)
	const engynNavigation = new EngynNavigation(page)
	const emailSubject = 'Email No.' + Date.now()
	const emailContent = 'Content ' + Date.now()
	await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await engynNavigation.NavigateToFormsPage(page)
	await page.getByRole('link', { name: 'Form Mail' }).click()
	await page.getByRole('button', { name: 'Create Mail' }).click()
	await page.locator('#rc_select_0').click()
	await page.locator('#rc_select_0').fill('flynkformsmember@mailinator.com')
	await page.locator('#rc_select_0').press('Enter')
	await page.locator('#rc_select_0').click()
	await page.locator('#rc_select_0').fill('flynkformsmanager@mailinator.com')
	await page.locator('#rc_select_0').press('Enter')
	await page.getByRole('button', { name: '+ Add Form from Library' }).click()
	await page.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await page.waitForTimeout(1500)
	//await page.getByText('Send Requests Form').click();
	await page.getByText('form1', { exact: true }).click()
	await page.waitForTimeout(1000)
	await page.getByRole('button', { name: 'Attach' }).click()
	await page.waitForTimeout(1000)
	//await page.getByText('Second Form Requests Form').click();
	await page.getByText(form2).click()
	await page.waitForTimeout(1000)
	await page.getByRole('button', { name: 'Attach' }).click()
	await page.waitForTimeout(1000)
	//await page.locator('div').filter({ hasText: /^Attached FormsSend Requests FormSecond Form Requests FormClose$/ }).getByRole('button', { name: 'Close' }).click();
	await page.locator("//span[normalize-space()='Close']").click()
	await page.getByPlaceholder('Subject').click()
	await page.getByPlaceholder('Subject').fill(emailSubject)
	await page.waitForTimeout(2000)
	await page.goto('https://int-engyn.flynk.dev/forms/mail-box#Draft')
	await expect(page.getByRole('heading', { name: emailSubject })).toBeVisible()
	await page.close()
})

//FORM28
test('Verify the mail in Watching tab', async ({ browser }) => {
	const adminContext = await browser.newContext()
	const userContext = await browser.newContext()
	const adminPage = await adminContext.newPage()
	const userPage = await userContext.newPage()
	const adminLoginComponents = new LoginComponents(adminPage)
	const adminEngynNavigation = new EngynNavigation(adminPage)
	const emailSubject = 'Email No.' + Date.now()
	await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await adminEngynNavigation.NavigateToFormsPage(adminPage)
	await adminPage.getByRole('link', { name: 'Form Mail' }).click()
	await adminPage.getByRole('button', { name: 'Create Mail' }).click()
	await adminPage.locator('#rc_select_0').click()
	await adminPage.locator('#rc_select_0').fill('flynkformsmember@mailinator.com')
	await adminPage.locator('#rc_select_0').press('Enter')
	await adminPage.locator('#rc_select_1').click()
	await adminPage.getByText('Flynk Forms Manager').nth(1).click()
	await expect(adminPage.getByRole('listitem').filter({ hasText: 'Flynk Forms Manager' })).toBeVisible()
	await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click()
	await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await adminPage.waitForTimeout(1500)
	await adminPage.getByText('form1', { exact: true }).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByRole('button', { name: 'Attach' }).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByText(form2).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByRole('button', { name: 'Attach' }).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.locator("//span[normalize-space()='Close']").click()
	await adminPage.getByPlaceholder('Subject').click()
	await adminPage.getByPlaceholder('Subject').fill(emailSubject)
	await adminPage.waitForTimeout(2000)
	await adminPage.getByRole('button', { name: 'Send', exact: true }).click()
	await adminPage.getByRole('tab', { name: 'Sent' }).click()
	await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
	const userLoginComponents = new LoginComponents(userPage)
	const userEngynNavigation = new EngynNavigation(userPage)
	await userLoginComponents.LoginWithCustomParams(process.env.MANAGERFORMSUSERNAME, process.env.MANAGERFORMSPASSWORD)
	await userEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Forms', 'Flynk Forms Org', ' Manager')
	await userEngynNavigation.NavigateToFormsPage(userPage)
	await userPage.waitForTimeout(2000)
	await userPage.goto('https://int-engyn.flynk.dev/forms/mail-box#Watching')
	await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
	await adminPage.close()
	await userPage.close()
})

//FORM29
test('FORM 29 - Verify Watchers only shows users in org', async ({ page }) => {
	const loginComponents = new LoginComponents(page)
	const engynNavigation = new EngynNavigation(page)
	await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await engynNavigation.NavigateToFormsPage(page)
	await page.getByRole('link', { name: 'Form Mail' }).click()
	await page.getByRole('button', { name: 'Create Mail' }).click()
	await page.locator('#rc_select_0').click()
	await page.locator('#rc_select_0').fill('flynkformsmember@mailinator.com')
	await page.locator('#rc_select_0').press('Enter')
	await page.locator('#rc_select_1').click()
	await page.locator('#rc_select_1').fill('flynk@mailinator.com')
	await page.waitForTimeout(2000)
	await page.locator('#rc_select_1').press('Enter')
	await expect(page.getByRole('listitem').filter({ hasText: 'flynk@mailinator.com' })).not.toBeVisible()
    await expect(page.locator("//div[contains(@class, 'ant-select-item-empty')]").getByText('No data')).toBeVisible()
	await page.close()
})

//FORM44
test('Verify deleting draft form in Draft tab', async ({ page }) => {
	const loginComponents = new LoginComponents(page)
	const engynNavigation = new EngynNavigation(page)
	const emailSubject = 'Email No.' + Date.now()
	const emailContent = 'Content ' + Date.now()
	await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await engynNavigation.NavigateToFormsPage(page)
	await page.getByRole('link', { name: 'Form Mail' }).click()
	await page.getByRole('button', { name: 'Create Mail' }).click()
	await page.locator('#rc_select_0').click()
	await page.locator('#rc_select_0').fill('flynkformsmember@mailinator.com')
	await page.locator('#rc_select_0').press('Enter')
	await page.locator('#rc_select_0').click()
	await page.locator('#rc_select_0').fill('flynkformsmanager@mailinator.com')
	await page.locator('#rc_select_0').press('Enter')
	await page.getByRole('button', { name: '+ Add Form from Library' }).click()
	await page.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await page.waitForTimeout(1500)
	await page.getByText('form1', { exact: true }).click()
	await page.waitForTimeout(1000)
	await page.getByRole('button', { name: 'Attach' }).click()
	await page.waitForTimeout(1000)
	await page.getByText(form2).click()
	await page.waitForTimeout(1000)
	await page.getByRole('button', { name: 'Attach' }).click()
	await page.waitForTimeout(1000)
	//await page.locator('div').filter({ hasText: /^Attached FormsSend Requests FormSecond Form Requests FormClose$/ }).getByRole('button', { name: 'Close' }).click();
	await page.locator("//span[normalize-space()='Close']").click()
	await page.getByPlaceholder('Subject').click()
	await page.getByPlaceholder('Subject').fill(emailSubject)
	await page.waitForTimeout(2000)
	await page.goto('https://int-engyn.flynk.dev/forms/mail-box#Draft')
	await expect(page.getByRole('heading', { name: emailSubject })).toBeVisible()
	await page.getByRole('heading', { name: emailSubject }).click()
	await page.getByRole('button', { name: 'Delete' }).click()
	await expect(page.getByText('Form request deleted forever')).toBeVisible()
	await page.locator('.ant-notification-notice-close').click()
	await expect(page.getByRole('heading', { name: emailSubject })).not.toBeVisible()
	await page.close()
})

//FORM45
test('Check the Delete mail function', async ({ browser }) => {
	const adminContext = await browser.newContext()
	const userContext = await browser.newContext()
	const adminPage = await adminContext.newPage()
	const userPage = await userContext.newPage()
	const adminLoginComponents = new LoginComponents(adminPage)
	const adminEngynNavigation = new EngynNavigation(adminPage)
	const emailSubject = 'Email No.' + Date.now()
	await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await adminEngynNavigation.ChangeOrg(adminPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await adminEngynNavigation.NavigateToFormsPage(adminPage)
	await adminPage.getByRole('link', { name: 'Form Mail' }).click()
	await adminPage.getByRole('button', { name: 'Create Mail' }).click()
	await adminPage.locator('#rc_select_0').click()
	await adminPage.locator('#rc_select_0').fill('flynkformsmanager@mailinator.com')
	await adminPage.waitForTimeout(2000)
	await adminPage.locator('#rc_select_0').press('Enter')
	//await expect(adminPage.getByText('flynkformsmanager@mailinator.com', {exact: true})).toBeVisible();
	await expect(adminPage.getByRole('listitem').filter({ hasText: 'Flynk Forms Manager' })).toBeVisible()
	await adminPage.getByRole('button', { name: '+ Add Form from Library' }).click()
	await adminPage.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await adminPage.waitForTimeout(1500)
	await adminPage.getByText('form1', { exact: true }).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByRole('button', { name: 'Attach' }).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByText(form2).click()
	await adminPage.waitForTimeout(1000)
	await adminPage.getByRole('button', { name: 'Attach' }).click()
	await adminPage.waitForTimeout(1000)
	//await adminPage.locator('div').filter({ hasText: /^Attached FormsSend Requests FormSecond Form Requests FormClose$/ }).getByRole('button', { name: 'Close' }).click();
	await adminPage.locator("//span[normalize-space()='Close']").click()
	await adminPage.getByPlaceholder('Subject').click()
	await adminPage.getByPlaceholder('Subject').fill(emailSubject)
	await adminPage.waitForTimeout(2000)
	await adminPage.getByRole('button', { name: 'Send', exact: true }).click()
	await adminPage.getByRole('tab', { name: 'Sent' }).click()
	await expect(adminPage.getByRole('heading', { name: emailSubject })).toBeVisible()
	const userLoginComponents = new LoginComponents(userPage)
	const userEngynNavigation = new EngynNavigation(userPage)
	await userLoginComponents.LoginWithCustomParams(process.env.MANAGERFORMSUSERNAME, process.env.MANAGERFORMSPASSWORD)
	await userEngynNavigation.ChangeOrg(userPage, 'Flynk', 'Flynk Forms', 'Flynk Forms Org', ' Manager')
	await userEngynNavigation.NavigateToFormsPage(userPage)
	await userPage.getByRole('tabpanel', { name: 'Inbox' }).getByRole('heading', { name: emailSubject }).click()
	await userPage.getByRole('button', { name: 'Delete' }).click()
	await expect(userPage.getByText('Form request moved to Deleted')).toBeVisible()
	await userPage.locator('.ant-notification-notice-close').click()
	await userPage.getByRole('tab', { name: 'Deleted' }).click()
	await expect(userPage.getByRole('heading', { name: emailSubject })).toBeVisible()
	await userPage.getByRole('heading', { name: emailSubject }).click()
	await userPage.getByRole('button', { name: 'Restore' }).click()
	await expect(userPage.getByText('Form request moved to Inbox')).toBeVisible()
	await userPage.locator('.ant-notification-notice-close').click()
	await userPage.getByRole('tab', { name: 'Inbox' }).click()
	//await userPage.getByRole('heading', { name: emailSubject }).click();
	await userPage.getByRole('button', { name: 'Delete' }).click()
	await userPage.getByText('Form request moved to Deleted').click()
	await userPage.locator('.ant-notification-notice-close').click()
	await userPage.getByRole('tab', { name: 'Deleted' }).click()
	//await userPage.getByRole('heading', { name: emailSubject }).click();
	await userPage.getByRole('button', { name: 'Delete' }).click()
	await userPage.getByText('Form request deleted forever').click()
	await userPage.locator('.ant-notification-notice-close').click()
	await userPage.close()
	await adminPage.close()
})

//FORM64
test('Delete the draft mail', async ({ page }) => {
	// 1. Login to Engyn and navigate to Forms
	const loginComponents = new LoginComponents(page)
	const engynNavigation = new EngynNavigation(page)
	const emailSubject = 'Email No.' + Date.now()
	const emailContent = 'Content ' + Date.now()
	await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await engynNavigation.ChangeOrg(page, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Admin')
	await engynNavigation.NavigateToFormsPage(page)

	// 2. Click on the Create Mail button
	await page.getByRole('button', { name: 'Create Mail' }).click()

	// 3. Click the Add Form from Library
	await page.getByRole('button', { name: '+ Add Form from Library' }).click()
	await page.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await page.waitForTimeout(1500)

	// 4. Click the Attach on the first mentioned form
	await page.getByText('form1', { exact: true }).click()
	await page.waitForTimeout(1000)
	await page.getByRole('button', { name: 'Attach' }).click()
	await page.waitForTimeout(1000)
	await page.locator("//span[normalize-space()='Close']").click()
	// Fill email Subject
	await page.getByPlaceholder('Subject').click()
	await page.getByPlaceholder('Subject').clear()
	await page.getByPlaceholder('Subject').fill(emailSubject)
	await page.waitForTimeout(2000)

	await expect(async () => {
		// 5. Click Form Mail
		await page.reload()
		await page.getByRole('link', { name: 'Form Mail' }).click()

		// 6. Click on the Draft tab
		await page.getByRole('tab', { name: 'Draft' }).click()
		await expect(page.getByRole('heading', { name: emailSubject })).toBeVisible()
	}).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] })

	// 7. Click the first mail
	await page.getByRole('heading', { name: emailSubject }).click()

	// 8. Click Delete
	await page.getByRole('button', { name: 'Delete' }).click()
	// The pop-up: ”Form request deleted forever” appears
	await expect(page.getByText('Form request deleted forever')).toBeVisible()

	// The draft mail is disappearing from the list
	await expect(page.getByRole('heading', { name: emailSubject })).not.toBeVisible()
})

//FORM74
test("FORM74 - Verify the delete the draft form by filling the form (Self-submit)", async ({ page }) => {
    // Precondition: Have at least a draft form in the Entry draft (from your Library or Collection)
    const loginComponents = new LoginComponents(page);
    const engynNavigation = new EngynNavigation(page);
    const emailSubject = 'Email No.' + Date.now();
    const emailContent = 'Content ' + Date.now();
    const textEntry = 'text' + Date.now()
    const numberEntry = Date.now();
    await loginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(page);
    await page.getByRole('link', { name: 'Forms Library' }).click();
    await page.locator("//div[@class='forms-library-grid-column']").filter({ hasText: 'Forms Library' }).getByText(form1, { exact: true }).click()
    await page.getByRole('button', { name: 'OPEN' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).click()
    await page.getByRole('textbox', { name: 'TEXT ENTRY :' }).fill(textEntry)
    await page.getByRole('button', { name: 'SAVE' }).click();
    await page.getByText('Success', { exact: true }).click();
    await page.getByText('Save successfully').click();

	// 1. Login to Engyn
	await page.goto('/')

	// 2. Navigate to Forms
	await engynNavigation.NavigateToFormsPage(page)

	// 3. Navigate to Form Entries
	await page.getByRole('link', { name: 'Form Entries' }).click()

    // 4. Click the mentioned form
    await page.locator("//div[@class='form-list-wrapper draft-forms-wrapper']").filter({ hasText: 'Entry Drafts' }).getByText(form1).first().click()

	// 5. Fill in some data fields
	await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).click()
	await page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' }).fill(numberEntry.toString())

    // The “Delete” button changes to “Revert” button
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Revert' })).toBeVisible()

    // 6. Click Revert
    await page.getByRole('button', { name: 'Revert' }).click()

    // The form guide and its data have returned to the lastest changes
    await expect(page.getByRole('textbox', { name: 'TEXT ENTRY :' })).toHaveValue(textEntry)
    // Verify the text box named Number Entry does not show any data
    await expect(page.getByRole('spinbutton', { name: 'NUMBER ENTRY :' })).toHaveValue('')

    // The Revert button return to Delete button
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Revert' })).not.toBeVisible()
})

//FORM75
test("FORM75 - Verify the delete the draft form by filling the form", async ({ browser }) => {
    // Precondition: Have at least a draft form in the Entry draft (from the mailbox)
    const emailSubject = await SentAnEmail(browser, process.env.MEMBERFORMSUSERNAME)
    const memberContext = await browser.newContext();
    const memberPage = await memberContext.newPage();
    const loginComponents = new LoginComponents(memberPage);
    const engynNavigation = new EngynNavigation(memberPage);
    const numberEntry = Date.now();
    const textEntry = 'text' + Date.now()
    await loginComponents.LoginWithCustomParams(process.env.MEMBERFORMSUSERNAME, process.env.MEMBERFORMSPASSWORD);
    await engynNavigation.NavigateToFormsPage(memberPage);
    await memberPage.getByRole('link', { name: 'Form Mail' }).click();
    await memberPage.getByRole('heading', { name: emailSubject }).click()
    await memberPage.locator('#form-fill-status div').getByText(form1, { exact: true }).click();
    await memberPage.getByPlaceholder('TEXT ENTRY').first().click()
    await memberPage.getByPlaceholder('TEXT ENTRY').first().fill(textEntry)
    await memberPage.getByRole('button', { name: 'Save' }).click()
    await memberPage.getByText('Success', { exact: true }).click();
    await memberPage.getByText('Save successfully').click();
    await memberPage.locator('.ant-notification-notice-close').click();

	// 1. Login to Engyn --> DONE in above
	await memberPage.goto('/')

    // 2. Navigate to Form
    await engynNavigation.NavigateToFormsPage(memberPage);
    // The mentioned mail has the draft status (in orange color)
    let mailStatus = memberPage.locator(".mail-list-item-wrapper").filter({hasText: emailSubject}).locator(".forms-fill-status-indicator-wrapper")
    let color = await mailStatus.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color, 'The color may be wrong').toBe("rgb(247, 181, 0)")

	// 3. Navigate to Form Entries
	// The mentioned form displays the form name with the form description (optional) and the newest edited time --> NOT AUTOMATED
	await memberPage.getByRole('link', { name: 'Form Entries' }).click()
	//Take the date time of form
	const datetimeForm = await memberPage
		.locator("//div[@class='form-list-wrapper draft-forms-wrapper']")
		.filter({ hasText: 'Entry Drafts' })
		.getByText(form1)
		.first()
		.locator('//following-sibling::span')
		.textContent()
	// Has the envelop icon beside the form name
	await expect(
		memberPage
			.getByRole('listitem')
			.filter({ hasText: form1 + datetimeForm })
			.locator('svg')
			.first()
	).toBeVisible()

	// 4. Click the mentioned form
	await memberPage
		.locator("//div[@class='form-list-wrapper draft-forms-wrapper']")
		.filter({ hasText: 'Entry Drafts' })
		.getByText(form1)
		.first()
		.click()

	// 5. Fill in some data fields
	await memberPage.locator("//div[contains(text(),'NUMBER ENTRY')]//ancestor::div[contains(@class,'ant-form-item align-left')]//span[@aria-label='Increase Value']").click();
	await expect(memberPage.getByPlaceholder('NUMBER ENTRY').first()).toHaveValue('1')
	await memberPage.getByPlaceholder('NUMBER ENTRY').first().fill(numberEntry.toString())
    
    // 6. Click Revert
    await memberPage.getByRole('button', { name: 'Revert' }).click()

    // The Form guide and its data return to the lastest changes
	await expect(memberPage.getByPlaceholder('TEXT ENTRY').first()).toHaveValue(textEntry)
    // Verify the number entry was blank
	await expect(memberPage.getByPlaceholder('NUMBER ENTRY').first()).toHaveValue('')
    
    // 7.Click Delete
    await memberPage.getByRole('button', { name: 'Delete' }).click()
    // Have the pop-up: “ Delete successfully” in the right corner
    await memberPage.getByText('Success', { exact: true }).click();
    await memberPage.getByText('Delete successfully').click();
    await memberPage.locator('.ant-notification-notice-close').click();

    // 8. Click Form mail 
    // The mentioned mail has the read status ( in grey color)
    await memberPage.goto('/')
    await engynNavigation.NavigateToFormsPage(memberPage);
    await memberPage.getByRole('link', { name: 'Form Mail' }).click()

    mailStatus = memberPage.locator(".mail-list-item-wrapper").filter({hasText: emailSubject}).locator(".forms-fill-status-indicator-wrapper")
    color = await mailStatus.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    expect(color, 'The color may be wrong').toBe("rgb(201, 218, 228)")

    // 9. Return Form Entries
    await memberPage.getByRole('link', { name: 'Form Entries' }).click()
    // The Form and its data have disappeared
    await expect(memberPage.getByRole('link').filter({ hasText: form1 + datetimeForm })).not.toBeVisible();
})

//FORM88
test('Verify the Discard mail function', async ({ page }) => {
	// 1.Login to Engun and navigate to form
	const email = 'flynkformsmember@mailinator.com'
	const adminLoginComponents = new LoginComponents(page)
	const adminEngynNavigation = new EngynNavigation(page)
	await adminLoginComponents.LoginWithCustomParams(process.env.ADMINFORMSUSERNAME, process.env.ADMINFORMSPASSWORD)
	await adminEngynNavigation.NavigateToFormsPage(page)
	await page.getByRole('link', { name: 'Form Mail' }).click()

	// Users will be navigated to the Forms page with the Ibox tab
	await expect(page).toHaveURL(new RegExp('.*mail-box#Inbox.*'))

	// 2.Click on Create Mail button
	await page.getByRole('button', { name: 'Create Mail' }).click()

	// 3.Choose the first option in the Add recipient box
	await expect(async () => {
		await page.locator('#rc_select_0').clear()
		await page.locator('#rc_select_0').fill(email)
		await page.waitForTimeout(2000)
		await expect(page.getByText('Forms Member')).toBeVisible()
	}).toPass({ timeout: 20000, intervals: [1000, 1500, 2000] })
	await page.locator('#rc_select_0').press('Enter')

	// 4.Choose the first option the the Watcher box
	await page.locator('#rc_select_1').click()
	await page.getByText('Forms Manager').click()
	await page.waitForTimeout(2000)

	// 5.Click Attach form form Library
	await page.getByRole('button', { name: '+ Add Form from Library' }).click()
	await page.getByRole('dialog', { name: 'logo-device-white Manage Attached Forms' }).getByText('Forms Library').click()
	await page.waitForTimeout(1500)
	await page.getByText(form1, { exact: true }).click()
	await page.waitForTimeout(1000)

	// 6.Attach a form
	await page.getByRole('button', { name: 'Attach' }).click()

	// 7.Click Close
	await page.locator("//span[normalize-space()='Close']").click()

	// 8.Click Discard
	await page.getByRole('button', { name: 'Discard' }).click()
	// Have the pop-up: “Form request deleted forever” appears in the right corner
	await expect(page.getByText('Form request deleted forever')).toBeVisible()
})

//FORM90 //FORM91
test('Verify the mail in the Watching tab (different org)', async ({ browser }) => {
	test.setTimeout(3 * 60000)
	for (let i = 90; i <= 91; i++) {
		let emailSubject
		// Step 1 to Step 11
		if (i == 90) {
			emailSubject = await SentAnEmail(browser, process.env.MEMBERFORMSUSERNAME1, 'watching')
		} else {
			emailSubject = await SentAnEmail(browser, 'flynktester@mailinator.com', 'watching')
		}

		const managerContext = await browser.newContext()
		const managerPage = await managerContext.newPage()
		const loginComponents = new LoginComponents(managerPage)
		const engynNavigation = new EngynNavigation(managerPage)
		const numberEntry = Date.now()

		// 12.Login to Engyn by the mail of the second user
		await loginComponents.LoginWithCustomParams(process.env.MANAGERFORMSUSERNAME, process.env.MANAGERFORMSPASSWORD)

		// 13.Navigate to the mentioned org
		await engynNavigation.ChangeOrg(managerPage, 'Flynk', 'FlynkForms', 'Flynk Forms Org', ' Manager')

		// 14. Click Forms
		await engynNavigation.NavigateToFormsPage(managerPage)

		// 15.Click on the Watching tabs
		await managerPage.getByRole('tab', { name: 'Watching' }).click()
		// Subject and Message previews should be displayed in the inbox list with the correct time --> NOT AUTOMATED
		// Check the Email Subject is correct or not
		await expect(managerPage.getByRole('heading', { name: emailSubject })).toBeVisible()
		// The total form indicator should reflect the number of forms of Form Request --> ?
		// The count of filled forms should reflect the number of filled forms of Form Request --> NOT AUTOMATED

		// Clicking on the form request should open the preview on the right side
		await managerPage.getByRole('heading', { name: emailSubject }).click()
		await expect(managerPage.getByText('FORM REQUEST', { exact: true })).toBeVisible()
		await expect(managerPage.getByText('You have filled')).toBeVisible()

		if (i == 90) {
			await expect(managerPage.getByText(process.env.MEMBERFORMSUSERNAME1!)).toBeVisible()
		} else {
			await expect(managerPage.getByText('flynktester@mailinator.com')).toBeVisible()
		}

		// Clicking on a form in the preview window should navigate to the open mode of the form request
		await managerPage.getByText('form1').click()
		await expect(managerPage).toHaveURL(new RegExp('.*mode=preview.*'))
		await managerPage.close()
	}
})
