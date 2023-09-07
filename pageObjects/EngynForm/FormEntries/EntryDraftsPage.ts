import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class EntryDraftsPage extends CommonComponents {
    // Locators
    txtTextEntry: Locator
    txtNumberEntry: Locator
    btnREVERT: Locator
    btnSAVE: Locator
    btnSUBMIT: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.btnREVERT = this.page.getByRole('button', { name: 'Revert' })
        this.btnSUBMIT = this.page.getByRole('button', { name: 'Submit' })
        this.btnSAVE = this.page.getByRole('button', { name: 'Save' })
    }

    // ----------------------------------------------- Actions - Methods -----------------------------------------------
    async fillInput(controlName, value) {
        await this.page.locator("//div[not(contains(@class, 'ant-form-item-hidden')) and contains(@class, 'ant-form-item')]").locator(".ant-form-item-row").filter({hasText: controlName}).locator("//input").fill(value)
    }

    async getTheValueInput(controlName) {
        return await this.page.locator("//div[not(contains(@class, 'ant-form-item-hidden')) and contains(@class, 'ant-form-item')]").locator(".ant-form-item-row").filter({hasText: controlName}).locator("//input").inputValue()
    }
}