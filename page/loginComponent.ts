import { Page, expect } from '@playwright/test'
import { EmailComponents } from './emailComponent'

export class LoginComponents {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	MAX_RETRIES = 10;
	retryCount = 0;

	async navigateToUrl(page: Page, url: string): Promise<void> {
		try {
			await page.goto(url, { timeout: 40000 });
			return; // success
		} catch (error) {
			console.warn(`Failed to load ${url}: ${error.message}`);
			if (++this.retryCount > this.MAX_RETRIES) {
				throw new Error(`Failed to load ${url} after ${this.MAX_RETRIES} retries`);
			}
			console.log(`Retrying ${url} (${this.retryCount}/${this.MAX_RETRIES})...`);
			//await page.goto(url);
			await this.navigateToUrl(page, url)
		}
	}

	async LoginAsAdmin() {
		//Function to login as Org Admin
		await this.page.goto('/login')
		await this.page.getByPlaceholder('Email').fill(process.env.ORGADMINUSERNAME!)
		await this.page.getByPlaceholder('Password').fill(process.env.ORGADMINPASSWORD!)
		await this.page.getByRole('button', { name: 'Log in' }).click()
		await expect(this.page).toHaveURL(new RegExp('.*dashboard.*'))
	}

	async LoginAsPlatformAdmin() {
		//Function to login as Platform Admin
		await this.page.goto('/login')
		await this.page.getByPlaceholder('Email').fill(process.env.PLATFORMADMINUSERNAME!)
		await this.page.getByPlaceholder('Password').fill(process.env.PLATFORMADMINPASSWORD!)
		await this.page.getByRole('button', { name: 'Log in' }).click()
		await this.page.waitForTimeout(2000)
	}

	async RegisterPersonalAccount(name?: string) {
		//Function to register Personal Account
		// let enableListener = true
		// const listenForError = (page, myFunc) => {
		// 	page.on('requestfailed', async (err) => {
		// 		if (enableListener) {
		// 			console.log('An error occurred:', err.message);
		// 			myFunc(page); // Call your dynamic function here, passing the `page` object as a parameter
		// 		}
		// 	});
		// };
		// let func = async (page) => {
		// 	// Your dynamic function here
		// 	await page.goto('/login');
		// };
		//listenForError(this.page, func);
		const emailComponents = new EmailComponents(this.page);
		const title = 'Engyn - Email Validation';
		const email = 'auto' + Date.now() + '@mailinator.com';
		//await this.page.goto('/login');
		await this.navigateToUrl(this.page, "/login");
		await expect(this.page.getByRole('button', { name: 'Create an account' })).toBeVisible();
		await this.page.getByRole('button', { name: 'Create an account' }).click();

		if (name) {
			await this.page.getByPlaceholder('Enter your full name').fill(name);
		} else {
			await this.page.getByPlaceholder('Enter your full name').fill(email);
		}

		await this.page.getByPlaceholder('Enter your email address').fill(email);
		await this.page.getByPlaceholder('Password').fill('12345678aA@');
		await this.page.getByRole('button', { name: 'Enter' }).click();
		await this.page.waitForTimeout(2000);
		await expect(this.page).toHaveURL(new RegExp('.*dashboard.*'));

		await emailComponents.selectEmail2(title, email);
		await this.page.waitForTimeout(2000);
		await this.page.waitForLoadState("load");
		await this.page.waitForLoadState("domcontentloaded");
		await this.page.getByRole('button', { name: 'Back to Home' }).click();

		return email
	}

	//Function to log in with a custom account
	async LoginWithCustomParams(email, password) {
		// let enableListener = false
		// const listenForError = (page, myFunc) => {
		// 	page.on('requestfailed', async (err) => {
		// 		if (enableListener) {
		// 			console.log('An error occurred:', err.message);
		// 			myFunc(page); // Call your dynamic function here, passing the `page` object as a parameter
		// 		}
		// 	});
		// };
		// let func = async (page) => {
		// 	// Your dynamic function here
		// 	await page.goto('/login');
		// };

		// listenForError(this.page, func);
		await expect(async () => {
			await this.navigateToUrl(this.page, '/login')
			await expect(this.page.getByPlaceholder('Email')).toBeVisible()
			await this.page.getByPlaceholder('Email').fill(email)
			await this.page.getByPlaceholder('Password').fill(password)
			await this.page.getByRole('button', { name: 'Log in' }).click()
			await this.page.waitForURL("**/dashboard")
			await expect(this.page).toHaveURL(new RegExp('.*dashboard.*'))
		}).toPass({ timeout: 300000, intervals: [20000, 40000, 50000] });
	}

	//Function to Log Out
	async LogOut(name) {
		await this.page.locator('.ant-layout-sider-trigger').click()
		await this.page.getByRole('menuitem', { name: name.toString() }).click()
		await this.page.getByRole('menuitem', { name: 'Logout' }).click()
	}

	//Function to reset password
	async ResetPassword(email, OldPassword, NewPassword) {
		await this.page.goto('/login')
		await this.page.getByPlaceholder('Email').fill(email)
		await this.page.getByPlaceholder('Password').fill(OldPassword)
		await this.page.getByRole('button', { name: 'Log in' }).click()
		await expect(this.page).toHaveURL(new RegExp('.*dashboard.*'))

		await this.page.getByRole('menuitem').getByRole('img').click();
		await this.page.getByText('Profile').click();

		await this.page.getByRole('button', { name: 'Change Password' }).click();
		await this.page.getByPlaceholder('Current Password').fill(OldPassword);
		await this.page.getByPlaceholder('New Password', { exact: true }).fill(NewPassword);
		await this.page.getByPlaceholder('Confirm New Password').fill(NewPassword);
		await this.page.getByRole('button', { name: 'Change', exact: true }).click();

		await this.page.getByRole('button', { name: 'OK' }).click();
	}
}