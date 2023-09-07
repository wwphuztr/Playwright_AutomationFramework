import { Page, Locator, expect } from '@playwright/test';
import { DashBoardPage } from '../pageObjects/EngynBase/DashBoardPage';
import { CommonPage } from './CommonPage';

export class CommonComponents {
    // Locators
    public btnOK: Locator
    public btnBackToHome: Locator
    public btnYes: Locator
    public btnNo: Locator
    public btnX: Locator

    constructor(public readonly page: Page) {
        // Comment element
        this.page = this.page
        this.btnOK = this.page.getByRole('button', { name: 'OK' })
        this.btnBackToHome = this.page.getByRole('button', { name: 'Back to Home' })
        this.btnYes = this.page.getByRole('button', { name: 'Yes' })
        this.btnNo = this.page.getByRole('button', { name: 'No' })
        this.btnX = this.page.locator('.ant-notification-notice-close')
    }

    async expectTitle(title) {
        await expect(this.page.getByTitle(title)).toBeVisible()
    }

    async expectText(text, options?: {exact?: boolean;}) {
        await expect(this.page.getByText(text, options)).toBeVisible()
    }

    async expectToHaveURL(partURL) {
        await expect(this.page).toHaveURL(new RegExp(`.*${partURL}.*`))
    }

    async goto(url) {
        await this.page.goto(url, {waitUntil: 'load'})
    }

    async reloadPage() {
        await this.page.reload()
    }

    async verifyPopupSuccessfully(action: 'Save' | 'Delete' | 'Submit') {
        await expect(this.page.getByText('Success', { exact: true })).toBeVisible()
        await expect(this.page.getByText(action + ' successfully')).toBeVisible()
        await this.page.locator('.ant-notification-notice-close').click()

    }
    
    async logOut() {
        await expect(async () => {
            await this.page.goto("/")
            await this.page.locator("//span[contains(@class, 'ant-avatar')]").hover()
            await this.page.getByRole('menuitem', {name: 'Logout'}).click()
            await this.expectToHaveURL('login')
        }).toPass();
    }
}