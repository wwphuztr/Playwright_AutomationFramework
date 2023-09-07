import { Locator, Page, expect } from '@playwright/test'
import { CommonComponents } from '../../common/CommonComponents'

export class FormsControl extends CommonComponents {
    // Data Type
    public itemLstText: Locator
    public itemLstYesNo: Locator
    public itemLstDateTime: Locator
    public itemLstNumber: Locator
    public itemLstObjectSelector: Locator

    // UI Control
    public controlSelect: Locator

    // Config Detail
    public headingSelect: Locator
    public txtName: Locator
    public txtLabel: Locator
    public txtDescription: Locator
    public checkBoxIsQueryable: Locator
    public checkBoxIsSortable: Locator
    public tabpanelSummary: Locator
    public tabpanelAuto: Locator
    public checkBoxIsEnable: Locator
    public checkBoxIsReadOnly: Locator
    public checkIsNullable: Locator
    public checkBoxIsMultipleChoice: Locator
    public txtNewOptionLabel: Locator
    public txtNewOptionValue: Locator
    public radioBtnEmpty: Locator
    public checkBoxIsUserEntryRequired: Locator
    public radioBtnDefaultValue: Locator
    public btnADD: Locator
    public btnCANCEL: Locator
    public txaINSTRUCTIONS: Locator

    constructor(public readonly page: Page) {
        super(page)
        // Data Type
        this.itemLstText = this.page.getByText('Text', { exact: true })
        this.itemLstYesNo = this.page.getByText('Yes/No')
        this.itemLstDateTime = this.page.getByText('Date/Time')
        this.itemLstNumber = this.page.getByText('Number', { exact: true })
        this.itemLstObjectSelector = this.page.getByText('Object Selector')

        // UI Control
        this.controlSelect = this.page.getByText('Select', { exact: true })

        // Config Detail
        this.headingSelect = this.page.getByRole('heading', { name: 'Select Detail' })
        this.txtName = this.page.getByLabel('Name')
        this.txtLabel = this.page.getByLabel('Label', { exact: true })
        this.txtDescription = this.page.getByLabel('Description')

        this.checkBoxIsQueryable = this.page.getByRole('checkbox', { name: 'Is Queryable' })
        this.checkBoxIsSortable = this.page.getByRole('checkbox', { name: 'Is Sortable' })
        this.tabpanelAuto = this.page.getByRole('tabpanel', { name: 'FORM' }).getByText('Auto')
        this.tabpanelSummary = this.page.getByRole('tabpanel', { name: 'FORM' }).getByText('Summary')

        this.checkBoxIsEnable = this.page.getByRole('checkbox', { name: 'Is Enabled' })
        this.checkBoxIsReadOnly = this.page.getByRole('checkbox', { name: 'Is Read Only' })
        this.checkIsNullable = this.page.getByRole('checkbox', { name: 'Is Nullable' })

        this.checkBoxIsMultipleChoice = this.page.getByRole('checkbox', { name: 'Is Multiple Choice' })

        this.txtNewOptionLabel = this.page.getByPlaceholder('New option label')
        this.txtNewOptionValue = this.page.getByPlaceholder('New option value')

        this.radioBtnEmpty = this.page.getByLabel('Empty', { exact: true })
        this.checkBoxIsUserEntryRequired = this.page.getByLabel('Is User Entry Required')
        this.radioBtnDefaultValue = this.page.getByLabel('Default Value - Fixed')

        this.btnADD = this.page.getByRole('button', { name: 'Add' })
        this.btnCANCEL = this.page.getByRole('button', { name: 'Cancel' })
        this.txaINSTRUCTIONS = this.page.getByRole('paragraph')
    }

    async ChooseIsQueryable(IsQueryable: boolean) {
        if (IsQueryable == true) {
            await this.checkBoxIsQueryable.check()
        }
        else {
            await this.checkBoxIsQueryable.uncheck()
        }
    }

    async ChooseIsSortable(IsSortable: boolean) {
        if (IsSortable == true) {
            await this.checkBoxIsSortable.check()
        }
        else {
            await this.checkBoxIsSortable.uncheck()
        }
    }

    async CheckShowInList(IsQueryable: boolean, IsSortable: boolean) {
        if (IsSortable == true || IsQueryable == true) {
            await expect(this.tabpanelSummary).toBeVisible()
        }
        else {
            await expect(this.tabpanelAuto).toBeVisible()
        }
    }

    async ChooseIsEnabled(IsEnabled: boolean) {
        if (IsEnabled == true) {
            await this.checkBoxIsEnable.check()
        }
        else {
            await this.checkBoxIsEnable.uncheck()
        }
    }

    async ChooseIsReadOnly(IsReadOnly: boolean) {
        if (IsReadOnly == true) {
            await this.checkBoxIsReadOnly.check()
        }
        else {
            await this.checkBoxIsReadOnly.uncheck()
        }
    }

    async ChooseIsMultipleChoice(IsMultipleChoice: boolean) {
        if (IsMultipleChoice == true) {
            await this.checkBoxIsMultipleChoice.check()
        }
        else {
            await this.checkBoxIsMultipleChoice.uncheck()
        }
    }

    async ChooseIsNullable(IsNullable: boolean) {
        if (IsNullable == true) {
            await this.checkIsNullable.check()
        }
        else {
            await this.checkIsNullable.uncheck()
        }
    }

    async CheckIsNullableNonSwitch(IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean) {
        if (IsNullable == false) {
            if (IsEmpty == true && IsUserEntryRequired == false) {
                IsUserEntryRequired = true
            }
        }
    }

    async CheckIsEmpty(IsEnabled: boolean, IsReadOnly: boolean) {
        if (IsEnabled == true && IsReadOnly == false) {
            await expect(this.page.getByLabel('Empty')).toBeVisible();
        }
        else {
            await expect(this.page.locator('label').filter({ hasText: 'Empty' }).locator('span').nth(1)).toBeVisible();
        }
    }

    async ChooseIsEmpty(IsEmpty: boolean) {
        if (IsEmpty == true) {
            await this.radioBtnEmpty.check()
        }
        else {
            await this.radioBtnEmpty.uncheck()
        }
    }

    async ChooseIsUserEntryRequired(IsUserEntryRequired: boolean) {
        if (IsUserEntryRequired == true) {
            await this.checkBoxIsUserEntryRequired.check()
        }
        else {
            await this.checkBoxIsUserEntryRequired.uncheck()
        }
    }

    async ChooseIsDefaultValue(IsDefaultValue: boolean) {
        if (IsDefaultValue == true) {
            await this.radioBtnDefaultValue.check()
        }
        else {
            await this.radioBtnDefaultValue.uncheck()
        }
    }

    async CheckIsMultipleChoice(IsMultipleChoice: boolean, IsDefaultValue: boolean, Option1) {
        if (IsMultipleChoice == true && IsDefaultValue == true) {
            await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
            await this.page.getByTitle(Option1).getByText(Option1).click();
            await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText(Option1).first()).toBeVisible();
        }
        else if (IsDefaultValue == true) {
            await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
            await this.page.getByTitle(Option1).getByText(Option1).click();
            await expect(this.page.locator("//span[@class='ant-select-selection-item']").getByText(Option1)).toBeVisible()
        }
    }

    async addNumberSelect(name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsMultipleChoice: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
        const Option1 = (Date.now()).toString();
        const Option2 = (Date.now() + 1).toString();

        // Select control
        await this.itemLstText.click()
        await this.controlSelect.click()
        await expect(this.headingSelect).toBeVisible()

        // Set the properties
        await this.txtName.clear()
        await this.txtName.fill(name)
        await this.txtLabel.click()
        await this.txtDescription.fill(name)

        await this.ChooseIsQueryable(IsQueryable)
        await this.ChooseIsSortable(IsSortable);
        await this.CheckShowInList(IsQueryable, IsSortable);
        await this.ChooseIsEnabled(IsEnabled);
        await this.ChooseIsReadOnly(IsReadOnly);
        await this.ChooseIsMultipleChoice(IsMultipleChoice);
        await this.ChooseIsNullable(IsNullable);
        await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);

        // Set the value
        await expect(async () => {
            await this.txtNewOptionLabel.clear()
            await this.txtNewOptionLabel.fill(Option1)
            await expect(this.txtNewOptionLabel).toHaveValue(Option1, {timeout: 300})
            await this.txtNewOptionValue.click()
            await expect(this.txtNewOptionValue).toHaveValue(Option1, {timeout: 300})
            await expect(this.txtNewOptionLabel).toBeVisible()
        }).toPass({});

        await this.CheckIsEmpty(IsEnabled, IsReadOnly);
        if (IsEnabled != true || IsReadOnly != false) {
            IsDefaultValue = true;
        }
        else {
            if (IsEmpty = true) {
                IsDefaultValue = false;
                await this.ChooseIsEmpty(IsEmpty);
                await this.ChooseIsUserEntryRequired(IsUserEntryRequired);
            }
            else {
                IsDefaultValue = true;
                await this.ChooseIsEmpty(IsEmpty);
            }
        }
        await this.ChooseIsDefaultValue(IsDefaultValue);
        await this.CheckIsMultipleChoice(IsMultipleChoice, IsDefaultValue, Option1);
        await this.txaINSTRUCTIONS.fill(name)
        await this.btnADD.click()
        await this.expectText('Save variant successfully')
        await this.btnX.click()
    }
}