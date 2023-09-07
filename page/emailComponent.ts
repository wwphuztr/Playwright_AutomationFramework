import { Page, expect } from '@playwright/test'

export class EmailComponents {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	//Function to select email with appropriate title 
	async selectEmail(title, email) {
		await this.page.goto('https://www.mailinator.com/v4/public/inboxes.jsp')
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill('')
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill(email)
		await this.page.getByRole('button', { name: 'GO' }).click()
		await this.page.waitForSelector(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']]`);
		await this.page.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`).click();
	}
	
	//Function to select emails with appropriate title 
	async selectEmails(title, email, title2) {
		await this.page.goto('https://www.mailinator.com/v4/public/inboxes.jsp');
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill('')
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill(email)
		await this.page.getByRole('button', { name: 'GO' }).click()
	  
		// Wait for the first selector
		await this.page.waitForSelector(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']]`);
		
		// Wait for the additional selector
		await this.page.waitForSelector(`//tr[td[normalize-space()='${title2}'] and td[normalize-space()='just now']]`);
		
		// Validate the Welcome Email
		await expect(this.page.locator(`//tr[td[normalize-space()='${title2}'] and td[normalize-space()='just now']]`)).toBeVisible();
		await this.page.locator(`//tr[td[normalize-space()='${title2}'] and td[normalize-space()='just now']][1]`).click();
		await expect(this.page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'GET STARTED' })).toBeVisible();
		
		// Go Back to Inbox
		await this.page.getByRole('link', { name: 'Back to Inbox' }).click();
		await this.page.getByRole('button', { name: 'GO' }).click();

		
		// Confirm email address
		await this.page.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`).click();
	}

	async selectEmail2(title, email) {
		await this.page.goto('https://www.mailinator.com/v4/public/inboxes.jsp')
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill('')
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill(email)
		await this.page.getByRole('button', { name: 'GO' }).click()
		await this.page.waitForSelector(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`);
		await this.page.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][1]`).click();

		//extract the url from the mailinator
		const text = await this.page.frameLocator('iframe[name="html_msg_body"]').getByText('Alternatively you can go to this link').textContent()
		const regex = /https:\/\/[^\s]+/

		const match = text!.match(regex)
		let url = match![0]
		url = url!.replace(/Validation/g, '');
		url = url.replace(/\.$/, '');

		await this.page.goto(url);

		return url;
	}

	//Function to delete email with appropriate title
	async deleteEmail(title, email) {
		await this.page.goto('https://www.mailinator.com/v4/public/inboxes.jsp');
		await this.page.getByRole('textbox', { name: 'inbox field' }).fill(email);
		await this.page.getByRole('button', { name: 'GO' }).click();
		await this.page.waitForSelector(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']]`);
		await this.page.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']]`).click();
		await this.page.getByText('Delete').click();
	}
}
// testing git 2
