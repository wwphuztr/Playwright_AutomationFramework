import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class SharedCollectionPage extends CommonComponents {
    // Locators
    public btnOpen: Locator
    public btnEdit: Locator
    public lblVersion: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.btnOpen = this.page.getByRole('button', { name: 'OPEN' })
        this.btnEdit = this.page.getByRole('button').locator("//*[local-name()='svg' and @data-icon='pen-ruler']")
        this.lblVersion = this.page.locator(".variant-label-wrapper")
    }
}