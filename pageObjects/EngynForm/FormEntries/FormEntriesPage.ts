import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class FormEntriesPage extends CommonComponents {
    // Locators
    spnEntryDrafts: Locator
    spnRecentlySubmmitted: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.spnEntryDrafts = this.page.locator(".draft-forms-wrapper").filter({hasText: 'Entry Drafts'}).locator(".ant-spin-dot-spin")
        this.spnRecentlySubmmitted = this.page.locator(".recently-submitted-forms-wrapper").filter({hasText: 'Recently Submitted'}).locator(".ant-spin-dot-spin")
    }

    // ----------------------------------------------- Actions - Methods -----------------------------------------------
    async clickItem(location: 'Entry Drafts' | 'Recently Submitted', name) {
        switch (location) {
            case 'Entry Drafts':
                await this.page.locator(".draft-forms-wrapper").filter({ hasText: 'Entry Drafts' }).locator(".form-list-item-wrapper").filter({ hasText: name }).first().click()
                await expect(this.page.getByRole('heading', { name: name })).toBeVisible()
            break;

            case 'Recently Submitted':
                await this.page.locator(".recently-submitted-forms-wrapper").filter({ hasText: 'Recently Submitted' }).locator(".form-list-item-wrapper").filter({ hasText: name }).first().click()
                await expect(this.page.getByRole('heading', { name: name })).toBeVisible()
                break;
        }
    }
}