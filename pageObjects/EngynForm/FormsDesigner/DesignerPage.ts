import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class DesignerPage extends CommonComponents {
    // Locators
    public spnDraftForms: Locator
    public spnRecentlyEdited: Locator
    public btnCreateForm: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.spnDraftForms = this.page.locator(".design-draft-forms-wrapper").filter({hasText: 'Draft Forms'}).locator(".ant-spin-dot-spin")
        this.spnRecentlyEdited = this.page.locator(".recently-edited-forms-wrapper").filter({hasText: 'Recently Edited'}).locator(".ant-spin-dot-spin")
        this.btnCreateForm = this.page.getByRole('button', { name: 'CREATE FORM' })
    }

    //----------------------------------------------- CreateForm Modal -----------------------------------------------------
    public CreateForm = new class {
        public txtTitle: Locator
        public txtDescription: Locator
        public tabEmptyForm: Locator
        public btnCreate: Locator

        constructor(public superThis: DesignerPage) {
            this.txtTitle = this.superThis.page.getByPlaceholder('Enter Form Title')
            this.txtDescription = this.superThis.page.getByPlaceholder('Enter an optional description')
            this.tabEmptyForm = this.superThis.page.getByRole('tab', { name: 'Empty Form' })
            this.btnCreate = this.superThis.page.getByRole('button', { name: 'Create', exact: true })
        }
    }(this);
}