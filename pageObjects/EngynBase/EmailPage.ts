import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class EmailPage extends CommonComponents {
    //Locators
    public txtInbox: Locator
    public btnGO: Locator
    public btnResetPassword: Locator

    constructor(public readonly page: Page) {
        super(page)

        this.txtInbox = this.page.getByRole('textbox', { name: 'inbox field' })
        this.btnGO = this.page.getByRole('button', { name: 'GO' })
        this.btnResetPassword = this.page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: 'Reset Password' })
    }
    // ------------------------------------------------ Elements ------------------------------------------------
    expectedEmail(title, order): Locator {
        return this.page.locator(`//tr[td[normalize-space()='${title}'] and td[normalize-space()='just now']][${order}]`)
    }

    // ------------------------------------------------ Actions ------------------------------------------------
    async selectEmail(title: string, email: string) {
        await this.page.goto(process.env.MAILFLATFORM!, { waitUntil: 'load' })
        await this.txtInbox.fill('')
        await this.txtInbox.fill(email)
        await this.btnGO.click()
        await this.expectedEmail(title, 1).waitFor({state: 'visible'})
        await this.expectedEmail(title, 1).click()
    }

    async getUrlEmail() {
        //extract the url from the mailinator
        const text = await this.page.frameLocator('iframe[name="html_msg_body"]').getByText('Alternatively you can go to this link').textContent()
        const regex = /https:\/\/[^\s]+/

        const match = text!.match(regex)
        let url = match![0]

        // If the link contains 'Validation' or 'You', we will remove it
        url = url!.replace(/Validation/g, '');
        url = url!.replace(/You/g, '');

        url = url.replace(/\.$/, '');
        return url;
    }

    async clickButton(btnName: string) {
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.frameLocator('iframe[name="html_msg_body"]').getByRole('link', { name: btnName }).click();
        const page = await page1Promise;
        return page
    }

    async selectEmailAndConfirm(title, email) {
        await this.selectEmail(title, email)
        const registerLink = await this.getUrlEmail()
        await this.page.goto(registerLink)
    }

    // Verify if there is sent email (used for resend function)
    async verifyTheResendEmail(title, email) {
        await this.page.goto(process.env.MAILFLATFORM!, { waitUntil: 'load' })
        await this.txtInbox.fill('')
        await this.txtInbox.fill(email)
        await this.btnGO.click()
        await this.expectedEmail(title, 2).waitFor({state: 'visible'})
    }
}