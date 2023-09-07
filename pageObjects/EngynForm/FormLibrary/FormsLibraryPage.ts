import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";

export class FormsLibraryPage extends CommonComponents {
    // Locators
    tooltipEditFolder: Locator
    tooltipDeleteFolder: Locator
    tooltipAddFolder: Locator

    // My Collection
    spnMyCollection: Locator
    ellipsisMyCollection: Locator
    bntAddFolder: Locator

    // Forms Library
    spnFormsLibrary: Locator
    ellipsisFormsLibrary: Locator

    // Recently Viewed Forms
    spnRecentlyViewedForms: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.spnMyCollection = this.page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-spin-dot-spin")
        this.spnRecentlyViewedForms = this.page.locator(".recently-viewed-forms-wrapper").filter({ hasText: 'Recently Viewed Forms' }).locator(".ant-spin-dot-spin")
        this.spnFormsLibrary = this.page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator(".ant-spin-dot-spin")
        this.ellipsisMyCollection = this.page.locator(".ant-space-horizontal").filter({ hasText: 'My Collection' }).locator("//*[local-name()='svg']")
        this.ellipsisFormsLibrary = this.page.locator(".ant-typography").filter({ hasText: 'Forms Library' }).locator("//*[local-name()='svg']")
        this.tooltipAddFolder = this.page.getByRole('tooltip').getByText('Add Folder')
        this.tooltipEditFolder = this.page.getByRole('tooltip').getByText('Edit Folder')
        this.tooltipDeleteFolder = this.page.getByRole('tooltip').getByText('Delete Folder')

    }

    // ----------------------------------------------- Func --> return element -----------------------------------------------
    btnAddFolder(location: 'My Collection' | 'Forms Library'): Locator {
        switch (location) {
            case 'My Collection':
                this.bntAddFolder = this.page.locator(".private-collection").filter({hasText: 'My Collection'}).getByText('Add Folder')
                break;

            case 'Forms Library':
                this.bntAddFolder = this.page.locator(".public-collection").filter({hasText: 'Forms Library'}).getByText('Add Folder')
                break;
        }
        return this.bntAddFolder
    }

    // ----------------------------------------------- Actions - Methods -----------------------------------------------
    async clickItem(location: 'My Collection' | 'Forms Library', name) {
        switch (location) {
            case 'My Collection':
                await this.page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-row-space-between").getByText(name, {exact: true}).click()
            break;

            case 'Forms Library':
                await this.page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator(".ant-row-space-between").getByText(name, {exact: true}).click()
            break;
        }
    }
    
    async hoverItemListEllipsis(location: 'My Collection' | 'Forms Library', name) {
        switch (location) {
            case 'My Collection':
                await this.page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-row-space-between").filter({ hasText: name }).hover()
                await this.page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-row-space-between").filter({ hasText: name }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
            break;

            case 'Forms Library':
                await this.page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator(".ant-row-space-between").filter({ hasText: name }).hover()
                await this.page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator(".ant-row-space-between").filter({ hasText: name }).locator("//*[local-name()='svg' and @data-icon='ellipsis']").click()
            break;
        }
    }

    async verifyItemList(location: 'My Collection' | 'Forms Library', name) {
        switch (location) {
            case 'My Collection':
                await expect(this.page.locator(".forms-private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-row-space-between").filter({ hasText: name })).toBeVisible()
            break;

            case 'Forms Library':
                await expect(this.page.locator(".forms-library-tabs-wrapper").filter({ hasText: 'Forms Library' }).locator(".ant-row-space-between").filter({ hasText: name })).toBeVisible()
            break;
        }
    }

    //----------------------------------------------- AddFolder Dialog -----------------------------------------------------
    public AddFolderDialog = new class {
        public txtName: Locator
        public btnADD: Locator

        constructor(public superThis: FormsLibraryPage) {
            this.txtName = this.superThis.page.getByPlaceholder('Enter a name')
            this.btnADD = this.superThis.page.getByRole('button', { name: 'Add' })
        }
    }(this);

    //----------------------------------------------- UpdateFolder Dialog -----------------------------------------------------
    public UpdateFolderDialog = new class {
        public txtName: Locator
        public btnUpdate: Locator
        public btnCancel: Locator

        constructor(public superThis: FormsLibraryPage) {
            this.txtName = this.superThis.page.getByPlaceholder('Enter a name')
            this.btnUpdate = this.superThis.page.getByRole('button', { name: 'Update' })
            this.btnCancel = this.superThis.page.getByRole('button', { name: 'Cancel' })
        }
    }(this);
}