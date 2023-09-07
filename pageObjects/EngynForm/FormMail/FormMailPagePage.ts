import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class FormMailPage extends CommonComponents {
    // Locators
    public spnLoading: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.spnLoading = this.page.locator(".ant-spin-dot-spin")
    }
}