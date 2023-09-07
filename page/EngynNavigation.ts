import { Page, expect } from '@playwright/test'

export class EngynNavigation {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	//Function to navigate to profile
	async NavigateToProfile(CustomPage, name) {
		await CustomPage.locator('.ant-layout-sider-trigger').click()
		await CustomPage.getByRole('menuitem', { name: name }).click()
		await CustomPage.getByRole('menuitem', { name: 'Profile' }).click()
	}

	//Function to invite user
	async InviteUser(role, email) {
		//Function to invite user
		let enableListener = false
		const listenForError = (page, myFunc) => {
			page.on('console', async (message) => {
				if (enableListener && message.type() === 'error') {
					console.log('An error occurred:', message.text());
					myFunc(page); // Call your dynamic function here, passing the `page` object as a parameter
				}
			});
		};

		let func = async (page) => {
			// Your dynamic function here
			await page.goto('/members');
		};


		listenForError(this.page, func);

		await this.page.waitForTimeout(3000)
		await this.page.waitForLoadState('domcontentloaded')
		await this.page.goto('/members')
		await this.page.waitForTimeout(4000)

		func = async (page) => {
			// Your dynamic function here
			await page.goto('/members');
			await page.getByRole('button', { name: 'Invite User' }).click()
		};

		await this.page.getByRole('button', { name: 'Invite User' }).click()

		await this.page.getByPlaceholder('Email').fill(email)
		await this.page.getByLabel('Role').click()
		await this.page.getByTitle(role).getByText(role).click()

		// func = async function myFunction(page) {
		// 	await page.goto('/members');
		// 	await page.getByRole('button', { name: 'Invite User' }).click()
		// 	await page.getByPlaceholder('Email').fill(email)
		// 	await page.getByLabel('Role').click()
		// 	await page.getByTitle(role).getByText(role).click()
		// }
		func = async (page) => {
			// Your dynamic function here
			await page.goto('/members');
			await page.getByRole('button', { name: 'Invite User' }).click()
			await page.getByPlaceholder('Email').fill(email)
			await page.getByLabel('Role').click()
			await page.getByTitle(role).getByText(role).click()
		};

		await this.page.getByRole('button', { name: 'Invite', exact: true }).click()
	}
	async NavigateToCorePage(CustomPage) {
		//await CustomPage.locator('.ant-layout-sider-trigger').click();
		//await this.page.locator('span').filter({ hasText: 'Check Box' }).click();
		await CustomPage.locator("//aside").filter({hasText: 'Settings'}).locator(".ant-layout-sider-trigger")
		await CustomPage.getByRole('menuitem', { name: 'Core' }).click();
	}
	async NavigateToFormsPage(CustomPage) {
		//await CustomPage.locator('.ant-layout-sider-trigger').click();
		await CustomPage.locator("//aside").filter({hasText: 'Settings'}).locator(".ant-layout-sider-trigger")
		await CustomPage.getByRole('menuitem', { name: 'Forms', exact: true }).click();
	}

	async NavigateToOrgPage(CustomPage) {
		await CustomPage.locator('.ant-layout-sider-trigger').click();
		await CustomPage.getByRole('menuitem', { name: 'Settings' }).click();
		await CustomPage.getByRole('menuitem', { name: 'Organization' }).click();
	}

	async NavigateToUserPage(CustomPage: Page) {
		await CustomPage.locator('.ant-layout-sider-trigger').click();
		await CustomPage.getByRole('menuitem', { name: 'Settings' }).click();
		await CustomPage.getByRole('menuitem', { name: 'Users' }).click();
		await CustomPage.waitForLoadState('load');
	}

	async ChangeOrg(CustomPage, username, CurrentOrgName, DestinationOrgName, Role) {
		await CustomPage.locator('.ant-layout-sider-trigger').click();
		await CustomPage.getByRole('menuitem', { name: username }).click();
		await CustomPage.getByRole('menuitem').filter({ hasText: 'Flynk' }).nth(1).hover();
		await CustomPage.getByRole('menuitem').filter({ hasText: 'Flynk' }).nth(1).hover();
		await CustomPage.getByRole('menuitem', { name: DestinationOrgName + " " + Role }).click();
		await expect(CustomPage).toHaveURL(new RegExp('.*dashboard.*'));
	}

	// async ChangeOrg(CustomPage, username, CurrentOrgName, DestinationOrgName, Role) {

	// 	await expect(async () => {
	// 		await CustomPage.locator('.ant-layout-sider-trigger').click();
	// 		await expect(CustomPage.getByRole('menuitem', { name: username })).toBeVisible();
	// 	}).toPass({ timeout: 5000, intervals: [1000, 2000, 3000] });

	// 	await expect(async () => {
	// 		await CustomPage.getByRole('menuitem', { name: username }).click();
	// 		await expect(CustomPage.getByRole('menuitem').filter({ hasText: 'Flynk' }).nth(1)).toBeVisible();
	// 	}).toPass({ timeout: 5000, intervals: [1000, 2000, 3000]});

	// 	await expect(async () => {
	// 		await CustomPage.getByRole('menuitem').filter({ hasText: 'Flynk' }).nth(1).hover();
	// 		await expect(CustomPage.getByRole('menuitem', { name: DestinationOrgName + " " + Role })).toBeVisible();
	// 	}).toPass({ timeout: 10000, intervals: [1000, 2000, 3000]});

	// 	await CustomPage.getByRole('menuitem').filter({ hasText: 'Flynk' }).nth(1).hover();
	// 	await CustomPage.getByRole('menuitem', { name: DestinationOrgName + " " + Role }).click();

	// 	await expect(CustomPage).toHaveURL(new RegExp('.*dashboard.*'));
	// }
}
