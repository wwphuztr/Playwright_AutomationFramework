import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../common/CommonComponents";
import { FormsLibraryPage } from "./FormLibrary/FormsLibraryPage";
import { DesignerPage } from "./FormsDesigner/DesignerPage";
import { FormEntriesPage } from "./FormEntries/FormEntriesPage";
import { FormMailPage } from "./FormMail/FormMailPagePage";

export class FormsNavigationMenu extends CommonComponents {
    // Locators
    public lnkFormsLibrary: Locator
    public lnkFormsDesigner: Locator
    public lnkFormEntries: Locator
    public lnkFormMail: Locator

    // Pages
    public formLibraryPage: FormsLibraryPage
    public formsDesignerPage: DesignerPage
    public formEntriesPage: FormEntriesPage
    public formMailPage : FormMailPage

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.page = this.page
        this.lnkFormsLibrary = this.page.getByRole('link', { name: 'Forms Library' })
        this.lnkFormsDesigner = this.page.getByRole('link', { name: 'Forms Designer' })
        this.lnkFormEntries = this.page.getByRole('link', { name: 'Form Entries' })
        this.lnkFormMail = this.page.getByRole('link', { name: 'Form Mail' })

        this.formLibraryPage = new FormsLibraryPage(this.page)
        this.formsDesignerPage = new DesignerPage(this.page)
        this.formEntriesPage = new FormEntriesPage(this.page)
        this.formMailPage = new FormMailPage(this.page)
    }

    async navigateTo(forms: 'Forms Library' | 'Forms Designer' | 'Form Entries' | 'Form Mail') {
        switch (forms) {
            case 'Forms Library':
                await this.page.getByRole('menuitem', { name: forms }).click()
                await expect(this.formLibraryPage.spnMyCollection).not.toBeAttached()
                await expect(this.formLibraryPage.spnFormsLibrary).not.toBeAttached()
                await expect(this.formLibraryPage.spnRecentlyViewedForms).not.toBeAttached()
            break;

            case 'Forms Designer':
                await this.page.getByRole('menuitem', { name: forms }).click()
                await expect(this.formsDesignerPage.spnDraftForms).not.toBeAttached()
                await expect(this.formsDesignerPage.spnRecentlyEdited).not.toBeAttached()
            break;

            case 'Form Entries':
                await this.page.getByRole('menuitem', { name: forms }).click()
                await expect(this.formEntriesPage.spnEntryDrafts).not.toBeAttached()
                await expect(this.formEntriesPage.spnRecentlySubmmitted).not.toBeAttached()
            break;
            
            case 'Form Mail':
                await this.page.getByRole('menuitem', { name: forms }).click()
                await expect(this.formMailPage.spnLoading).not.toBeAttached()
            break;
        }
    }
}