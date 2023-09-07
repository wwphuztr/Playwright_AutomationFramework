import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../../common/CommonComponents";
import { FormControls } from "../../../page/FormControl";
import { FormsControl } from "../FormsControl";
import { DataLocationType, FormLocationType } from "../../../Type/Types";

export class Designer_FormsDesignerPage extends CommonComponents {
    // Locators
    btnDelete: Locator
    btnDuplicate: Locator
    btnPublish: Locator
    btnCirclePlus: Locator

    // PROPERTIES
    spnLoading: Locator
    chkIsQueryable: Locator
    autoSave: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.btnDelete = this.page.getByRole('button', { name: 'Delete' })
        this.btnPublish = this.page.getByRole('button', { name: 'Publish' })
        this.btnDuplicate = this.page.getByRole('button', { name: 'Duplicate' })
        this.btnCirclePlus = this.page.locator('form').filter({ hasText: 'This form is empty!Click here to add the first control.' }).getByRole('button')

        // PROPERTIES
        this.chkIsQueryable = this.page.getByRole('checkbox', { name: 'Is Sortable' })
        this.spnLoading = this.page.locator(".ant-spin-dot")
        this.autoSave = this.page.locator("//span[normalize-space()='Saved']")
    }

    //----------------------------------------------- Actions - Methods -----------------------------------------------------
    async clickOnController(nameController) {
        await expect(this.page.locator(".sortable-form-row-wrapper").filter({ hasText: nameController })).toBeAttached()
        await expect(async () => {
            const box = await this.page.locator(".sortable-form-row-wrapper").filter({ hasText: nameController }).boundingBox()
            await this.page.mouse.click(box!.x + box!.width / 3, box!.y + box!.height / 3);
            await expect(this.page.getByRole('tabpanel', { name: 'PROPERTIES' }).getByText('Is Sortable')).toBeVisible({ timeout: 1000 })
        }).toPass();
    }

    //----------------------------------------------- PublishForm Dialog -----------------------------------------------------
    public PublishFormDialog = new class {
        public btnCANCEL: Locator
        public btnCONFIRM: Locator

        constructor(public superThis: Designer_FormsDesignerPage) {
            this.btnCANCEL = this.superThis.page.getByRole('button', { name: 'Cancel' })
            this.btnCONFIRM = this.superThis.page.getByRole('button', { name: 'Confirm' })
        }

        // This function will retrieve the expected version before confirming.
        async getExpectedVersion() {
            const majorNumber = await this.superThis.page.locator('#major').inputValue()
            const minorNumber = await this.superThis.page.locator('#minor').inputValue()
            const revisionNumber = await this.superThis.page.locator('#revision').inputValue()

            return 'v' + majorNumber + '.' + minorNumber + '.' + revisionNumber
        }
    }(this);

    //----------------------------------------------- Add Element Modal -----------------------------------------------------
    public AddElementModal = new class {
        public btnCANCEL: Locator

        constructor(public superThis: Designer_FormsDesignerPage) {
            this.btnCANCEL = this.superThis.page.getByRole('button', { name: 'Cancel' })
        }

        async addComponents(component: 'Select Number') {
            //const formsControl = new FormControls(this.superThis.page)
            const formsControl = new FormsControl(this.superThis.page)

            switch (component) {
                case 'Select Number':
                    //await formsControl.AddNumber_Select('Select Number', true, true, true, true, false, true, true, true, true);
                    await formsControl.addNumberSelect('Select Number', true, true, true, true, false, true, true, true, true)
                    break;
            }
        }

    }(this);

    //----------------------------------------------- Publish Form Modal -----------------------------------------------------
    public PublishFormModal = new class {
        public btnCANCEL: Locator
        public btnPUBLISH: Locator
        public formLocation_radioBtnMyCollection: Locator
        public dataLocation_radioBtnMyCollection: Locator
        public radioBtnFormsLibrary: Locator
        public radioBtnSharedData: Locator

        constructor(public superThis: Designer_FormsDesignerPage) {
            this.btnCANCEL = this.superThis.page.getByRole('button', { name: 'Cancel' })
            this.btnPUBLISH = this.superThis.page.getByRole('dialog', { name: 'logo-device-white Publish Form' }).getByRole('button', { name: 'Publish' })
            this.formLocation_radioBtnMyCollection = this.superThis.page.locator('div').filter({ hasText: /^My CollectionForms Library$/ }).getByLabel('My Collection')
            this.radioBtnFormsLibrary = this.superThis.page.getByLabel('Forms Library')
            this.dataLocation_radioBtnMyCollection = this.superThis.page.locator('div').filter({ hasText: /^My CollectionShared Data$/ }).getByLabel('My Collection')
            this.radioBtnSharedData = this.superThis.page.getByLabel('Shared Data')
        }

        async chooseFormLocation(location: FormLocationType) {
            switch (location) {
                case 'My Collection':
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    await this.formLocation_radioBtnMyCollection.click()
                    break;

                case 'Forms Library':
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'My Collection' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    await this.radioBtnFormsLibrary.click()
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'Forms Library' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    break;
            }
        }

        async chooseDataLocation(location: DataLocationType) {
            switch (location) {
                case 'My Collection':
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'Private & Linked DataSet' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    await this.dataLocation_radioBtnMyCollection.click()
                    break;

                case 'Shared Data':
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'Private & Linked DataSet' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    await this.radioBtnSharedData.click()
                    await this.superThis.page.locator("//div[@role='tabpanel']").filter({ hasText: 'Default' }).locator("//div[@class='ant-col engyn-tree-node-name']").first().waitFor({ state: 'attached' })
                    break;
            }
        }

    }(this);
}