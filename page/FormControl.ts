
import { Page, expect } from '@playwright/test'
import examples from "libphonenumber-js/mobile/examples"
import { CountryCode, getExampleNumber, isValidNumber } from 'libphonenumber-js'

export class FormControls {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	async RemoveDecimal(Number: number) {
		return ~~Number
	}

	async AddFormToTheRight() {
		await this.page.locator('button:nth-child(5)').click()
	}

	async AddFormToTheLeft() {
		await this.page.locator('button:nth-child(4)').click()
	}

	async AddFormToTheTop() {
		await this.page.locator('button:nth-child(6)').click()
	}

	async AddFormToTheBottom() {
		await this.page.locator('button:nth-child(3)').click()
	}

	async ChooseIsQueryable(IsQueryable: boolean) {
		if (IsQueryable == true) {
			await this.page.getByRole('checkbox', { name: 'Is Queryable' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Queryable' }).uncheck();
		}
	}

	async ChooseIsSortable(IsSortable: boolean) {
		if (IsSortable == true) {
			await this.page.getByRole('checkbox', { name: 'Is Sortable' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Sortable' }).uncheck();
		}
	}

	async ChooseIsEnabled(IsEnabled: boolean) {
		if (IsEnabled == true) {
			await this.page.getByRole('checkbox', { name: 'Is Enabled' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Enabled' }).uncheck();
		}
	}

	async ChooseIsReadOnly(IsReadOnly: boolean) {
		if (IsReadOnly == true) {
			await this.page.getByRole('checkbox', { name: 'Is Read Only' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Read Only' }).uncheck();
		}
	}

	async ChooseIsUserEntryRequired(IsUserEntryRequired: boolean) {
		if (IsUserEntryRequired == true) {
			await this.page.getByLabel('Is User Entry Required').check();
		}
		else {
			await this.page.getByLabel('Is User Entry Required').uncheck();
		}
	}

	async ChooseIsDefaultValue(IsDefaultValue: boolean) {
		if (IsDefaultValue == true) {
			await this.page.getByLabel('Default Value - Fixed').check();
		}
		else {
			await this.page.getByLabel('Default Value - Fixed').uncheck();
		}
	}

	async ChooseIsNullable(IsNullable: boolean) {
		if (IsNullable == true) {
			await this.page.getByRole('checkbox', { name: 'Is Nullable' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Nullable' }).uncheck();
		}
	}

	async ChooseIsEmpty(IsEmpty: boolean) {
		if (IsEmpty == true) {
			await this.page.getByLabel('Empty', { exact: true }).check();
		}
		else {
			await this.page.getByLabel('Empty', { exact: true }).uncheck();
		}
	}

	async ChooseIsMultipleChoice(IsMultipleChoice: boolean) {
		if (IsMultipleChoice == true) {
			await this.page.getByRole('checkbox', { name: 'Is Multiple Choice' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Multiple Choice' }).uncheck();
		}
	}


	async InputPhoneNumber(CountryCode: CountryCode) {
		const regionNames = new Intl.DisplayNames(
			['en'], { type: 'region' }
		);
		const placeholder = getExampleNumber(CountryCode, examples)?.formatNational().toString()!;
		const CountryName = regionNames.of(CountryCode)?.toString();
		await this.page.getByTitle('Australia: +61').nth(1).click();
		await this.page.getByText(CountryName!).nth(1).click();
		await this.page.keyboard.type(placeholder);
	}

	async CheckShowInList(IsQueryable: boolean, IsSortable: boolean) {
		if (IsSortable == true || IsQueryable == true) {
			await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText('Summary')).toBeVisible();
		}
		else {
			await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText('Auto')).toBeVisible();
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

	async CheckIsNullableNonSwitch(IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean) {
		if (IsNullable == false) {
			if (IsEmpty == true && IsUserEntryRequired == false) {
				IsUserEntryRequired = true
			}
		}
	}

	async CheckIsNullableSwitchCheckbox(IsNullable: boolean) {
		if (IsNullable == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByText('NA', { exact: true })).toBeVisible();
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
		}
		else {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByText('NA', { exact: true })).not.toBeVisible();
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
		}
	}

	async ChooseIsDecimal(IsDecimal: boolean) {
		if (IsDecimal == true) {
			await this.page.getByRole('checkbox', { name: 'Is Decimal' }).check();
		}
		else {
			await this.page.getByRole('checkbox', { name: 'Is Decimal' }).uncheck();
		}
	}

	async CheckIsDecimalSlider(IsDecimal: boolean, minNumber: number, maxNumber: number) {
		if (IsDecimal == true) {
			const Step = (maxNumber - minNumber) / 5;
			const NumCheck = minNumber + Step;
			await expect(this.page.getByText(NumCheck.toString())).toBeVisible();
		}
	}

	async CheckIsDecimalCheckbox(IsDecimal: boolean, CheckedValue: string, UncheckedValue: string) {
		if (IsDecimal == true) {
			if ((await this.page.getByLabel('Checked Value', { exact: true }).inputValue()).toString() == CheckedValue &&
				(await this.page.getByLabel('Unchecked Value').inputValue()).toString() == UncheckedValue) {
				return true
			}
		}
	}

	async CheckIsDecimalSwitch(IsDecimal: boolean, OnValue: string, OffValue: string) {
		if (IsDecimal == true) {
			if ((await this.page.getByLabel('On Value').inputValue()).toString() == OnValue &&
				(await this.page.getByLabel('Off Value').inputValue()).toString() == OffValue) {
				return true
			}
		}
	}

	async CheckIsMultipleChoice(IsMultipleChoice: boolean, IsDefaultValue: boolean, Option1, Option2, Option3) {
		if (IsMultipleChoice == true && IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await this.page.getByTitle(Option1).getByText(Option1).click();
			await this.page.getByTitle(Option2).getByText(Option2).click();
			await this.page.getByTitle(Option3).getByText(Option3).click();
			await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText(Option1).first()).toBeVisible();
			await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText(Option2).first()).toBeVisible();
			await expect(this.page.getByRole('tabpanel', { name: 'FORM' }).getByText(Option3).first()).toBeVisible();
		}
		else if (IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await this.page.getByTitle(Option1).getByText(Option1).click();
			await expect(this.page.locator("//span[@class='ant-select-selection-item']").getByText(Option1)).toBeVisible()
		}
	}





	async AddTextField_TextEntry(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const len = Name.length;
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Text Entry' }).click();
		await expect(this.page.getByRole('heading', { name: 'Text Entry Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		if (IsDefaultValue == true && IsNullable == false) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper > div > div').click();
			await this.page.keyboard.type(Name);
		}
		await this.page.getByLabel('Min Length').click();
		await this.page.getByLabel('Min Length').fill('1');
		await this.page.getByLabel('Max Length').click();
		await this.page.getByLabel('Max Length').fill('40');
		if (IsDefaultValue == true) {
			await expect(this.page.getByText(len + ' / 40')).toBeVisible();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_TextArea(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Text Area' }).click();
		await expect(this.page.getByRole('heading', { name: 'Text Area Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		if (IsEnabled == false) {
			IsNullable = true;
		}
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		if (IsDefaultValue == true && IsNullable == false) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper > div > div').click();
			await this.page.keyboard.type(Name);
		}
		await this.page.getByLabel('Min Length').click();
		await this.page.getByLabel('Min Length').fill('1');
		await this.page.getByLabel('Max Length').click();
		await this.page.getByLabel('Max Length').fill('40');
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_EmailEntry(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const email = Date.now() + '@mailinator.com';
		const len = email.length;
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Email Entry ' }).click();
		await expect(this.page.getByRole('heading', { name: 'Email Entry Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		if (IsDefaultValue == true && IsNullable == false) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper > div > div').click();
			await this.page.keyboard.type(email);
		}
		await this.page.getByLabel('Min Length').click();
		await this.page.getByLabel('Min Length').fill('1');
		await this.page.getByLabel('Max Length').click();
		await this.page.getByLabel('Max Length').fill('40');
		if (IsDefaultValue == true) {
			await expect(this.page.getByText(len + ' / 40')).toBeVisible();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_PhoneNumberEntry(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean, CountryCode: CountryCode) {
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Phone Number Entry ' }).click();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		if (IsDefaultValue == true && IsNullable == false) {
			await this.InputPhoneNumber(CountryCode);
		}
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_CheckBox(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Check = 'Check ' + Date.now();
		const Uncheck = 'Uncheck ' + Date.now();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Check Box' }).click();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('Checked', { exact: true }).click();
			}
		}
		await this.page.getByLabel('Checked Value', { exact: true }).click();
		await this.page.getByLabel('Checked Value', { exact: true }).fill(Check);
		await this.page.getByLabel('Unchecked Value').click();
		await this.page.getByLabel('Unchecked Value').fill(Uncheck);
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_Switch(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const On = 'On ' + Date.now();
		const Off = 'Off ' + Date.now();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Switch' }).click();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('On Value', { exact: true }).first().click();
			}
		}
		await this.page.getByLabel('On Value', { exact: true }).nth(1).click();
		await this.page.getByLabel('On Value', { exact: true }).nth(1).fill(On);
		await this.page.getByLabel('Off Value').nth(1).click();
		await this.page.getByLabel('Off Value').nth(1).fill(Off);
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_RadioButtonSet(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = 'Option1' + Date.now();
		const Option2 = 'Option2' + Date.now();
		const Option3 = 'Option3' + Date.now();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Radio Button Set' }).click();
		await expect(this.page.getByRole('heading', { name: 'Radio BUtton Set Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option1);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option2);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option3);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		if (IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByTitle(Option1).getByText(Option1)).toBeVisible();
			await expect(this.page.getByTitle(Option2).getByText(Option2)).toBeVisible();
			await expect(this.page.getByTitle(Option3).getByText(Option3)).toBeVisible();
			await this.page.getByTitle(Option2).getByText(Option2).click();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_CheckList(Name: string, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = 'Option1' + Date.now();
		const Option2 = 'Option2' + Date.now();
		const Option3 = 'Option3' + Date.now();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Check List' }).click();
		await expect(this.page.getByRole('heading', { name: 'Check List Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option1);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option2);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option3);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		if (IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByLabel(Option1, { exact: true })).toBeVisible();
			await expect(this.page.getByLabel(Option2, { exact: true })).toBeVisible();
			await expect(this.page.getByLabel(Option3, { exact: true })).toBeVisible();
			await this.page.getByLabel(Option1, { exact: true }).check();
			await this.page.getByLabel(Option2, { exact: true }).check();
			await this.page.getByLabel(Option3, { exact: true }).check();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddTextField_Select(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsMultipleChoice: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = 'Option1' + Date.now();
		const Option2 = 'Option2' + Date.now();
		const Option3 = 'Option3' + Date.now();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.getByText('Select', { exact: true }).click();
		await expect(this.page.getByRole('heading', { name: 'Select Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		if (IsEnabled == false) {
			IsNullable = true;
		}
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsMultipleChoice(IsMultipleChoice);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option1);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option2);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option3);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		await this.CheckIsMultipleChoice(IsMultipleChoice, IsDefaultValue, Option1, Option2, Option3);
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddYesNoField_CheckBox(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Yes/No', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Check Box' }).click();
		await expect(this.page.getByRole('heading', { name: 'Check Box Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('True', { exact: true }).first().click();
			}
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddYesNoField_Switch(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Yes/No', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Switch' }).click();
		await expect(this.page.getByRole('heading', { name: 'Switch Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('True', { exact: true }).first().click();
			}
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddYesNoField_RadioButtonSet(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = 'Option1' + Date.now();
		const Option2 = 'Option2' + Date.now();
		await this.page.getByText('Yes/No', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Radio Button Set' }).click();
		await expect(this.page.getByRole('heading', { name: 'Radio BUtton Set Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option label').press('Enter');
		await this.page.getByRole('cell', { name: 'New option value' }).getByLabel('', { exact: true }).click();
		await this.page.getByTitle('True', { exact: true }).click();
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option label').press('Enter');
		await this.page.getByRole('cell', { name: 'New option value' }).getByLabel('', { exact: true }).click();
		await this.page.getByText('False', { exact: true }).click();
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
		if (IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByText(Option1)).toBeVisible();
			await expect(this.page.getByText(Option2)).toBeVisible();
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await this.page.getByText(Option1).click();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddDateTime_DatePicker(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Date/Time', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Date Picker' }).click();
		await expect(this.page.getByRole('heading', { name: 'Date Picker Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.CheckIsRequired(IsEnabled, IsReadOnly);
		if (IsEnabled != true || IsReadOnly != false) {
			IsDefaultValue = true;
		}
		else {
			if (IsRequired = true) {
				IsDefaultValue = false;
				await this.ChooseIsRequired(IsRequired);
			}
			else {
				IsDefaultValue = true;
				await this.ChooseIsRequired(IsRequired);
			}
		}
		await this.ChooseIsDefaultValue(IsDefaultValue);
		if (IsDefaultValue == true) {
			await this.page.locator('#defaultValue').click();
			await this.page.getByText('18') .click();
		}
		await this.page.getByLabel('Placeholder').click();
		await this.page.getByLabel('Placeholder').fill('Date Time here');
		await this.page.getByLabel('Min').click();
		await this.page.getByRole('cell', { name: '18' }).getByText('18').click();
		await this.page.getByLabel('Max').click();
		await this.page.getByRole('cell', { name: '19' }).getByText('19').click();
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddDateTime_TimePicker(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Date/Time', { exact: true }).click();
		await this.page.getByText('Time Picker', { exact: true }).click();
		await expect(this.page.getByRole('heading', { name: 'Time Picker Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		if (IsEnabled == false) {
			IsNullable = true;
		}
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
		await this.CheckIsEmpty(IsEnabled, IsReadOnly);
		if (IsEnabled != true || IsReadOnly != false) {
			IsDefaultValue = true;
			IsEmpty = false;
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

		//await this.ChooseIsDefaultValue(IsDefaultValue);
		//checkIsDefaultValue
		if (IsDefaultValue == true) {
			await this.page.getByLabel('Default Value - Calculated').check();
		}
		else {
			await this.page.getByLabel('Default Value - Calculated').uncheck();
		}

		if (IsDefaultValue == true) {
			await this.page.locator('#properties-detail_defaultValueCalculated').click();
			await this.page.getByText('now', { exact: true }).click();
		}

		if (IsEmpty == true) {
			await this.page.getByLabel('Placeholder').click();
			await this.page.getByLabel('Placeholder').fill('Date Time here');
		}
		// await this.page.getByLabel('Min').click();
		// await this.page.locator('div:nth-child(3) > div > .ant-picker-dropdown > .ant-picker-panel-container > .ant-picker-panel > .ant-picker-time-panel > .ant-picker-content > ul > li:nth-child(15) > .ant-picker-time-panel-cell-inner').first().click();
		// await this.page.getByRole('button', { name: 'OK' }).click();
		// await this.page.getByLabel('Max').click();
		// await this.page.locator('div:nth-child(4) > div > .ant-picker-dropdown > .ant-picker-panel-container > .ant-picker-panel > .ant-picker-time-panel > .ant-picker-content > ul > li:nth-child(19) > .ant-picker-time-panel-cell-inner').first().click();
		// await this.page.getByRole('button', { name: 'OK' }).click();
		// await this.page.locator('#guideNotes div').nth(1).click();
		// await this.page.locator('#guideNotes div').nth(1).fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddDateTime_DateTimePicker(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsRequired: boolean, IsDefaultValue: boolean) {
		await this.page.getByText('Date/Time', { exact: true }).click();
		await this.page.getByText('Date Time Picker', { exact: true }).click();
		await expect(this.page.getByRole('heading', { name: 'Date Time Picker Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.CheckIsRequired(IsEnabled, IsReadOnly);
		if (IsEnabled != true || IsReadOnly != false) {
			IsDefaultValue = true;
		}
		else {
			if (IsRequired = true) {
				IsDefaultValue = false;
				await this.ChooseIsRequired(IsRequired);
			}
			else {
				IsDefaultValue = true;
				await this.ChooseIsRequired(IsRequired);
			}
		}
		await this.ChooseIsDefaultValue(IsDefaultValue);
		if (IsDefaultValue == true) {
			await this.page.locator('#defaultValue').click();
			await this.page.getByRole('cell', { name: '14' }).getByText('14').click();
			await this.page.getByRole('button', { name: 'OK' }).click();
		}
		await this.page.getByLabel('Placeholder').click();
		await this.page.getByLabel('Placeholder').fill('Date Time here');
		await this.page.getByLabel('Min').click();
		await this.page.getByRole('cell', { name: '11' }).getByText('11').click();
		await this.page.getByRole('button', { name: 'OK' }).click();
		await this.page.waitForTimeout(500);
		await this.page.getByLabel('Max').click();
		await this.page.getByRole('cell', { name: '15' }).getByText('15').click();
		await this.page.getByRole('button', { name: 'OK' }).click();
		await this.page.locator('#guideNotes div').nth(1).click();
		await this.page.locator('#guideNotes div').nth(1).fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddNumber_NumberEntry(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Number = Math.random();
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Number Entry' }).click();
		await expect(this.page.getByRole('heading', { name: 'Number Entry Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		if (IsDefaultValue == true && IsNullable == false) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper > div > div').click();
			await this.page.keyboard.type(Number.toString());
		}
		await this.page.getByLabel('Min').click();
		await this.page.getByLabel('Min').fill('0');
		await this.page.getByLabel('Max').click();
		await this.page.getByLabel('Max').fill('99999999999999999');
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddNumber_Slider(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsDecimal: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Min = 30;
		const Max = 31;
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Slider' }).click();
		await expect(this.page.getByRole('heading', { name: 'Slider Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsDecimal(IsDecimal);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired)
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
		await this.page.getByLabel('Min').click();
		await this.page.getByLabel('Min').fill(Min.toString());
		await this.page.getByLabel('Max').click();
		await this.page.getByLabel('Max').fill(Max.toString());
		await this.CheckIsDecimalSlider(IsDecimal, Min, Max);
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddNumber_CheckBox(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsDecimal: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsRequired: boolean, IsDefaultValue: boolean) {
		const CheckedValue = (Math.random() * 1000).toString();
		const UncheckedValue = (Math.random() * 1000).toString();
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Check Box' }).click();
		await expect(this.page.getByRole('heading', { name: 'Check Box Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.ChooseIsDecimal(IsDecimal);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('Checked', { exact: true }).click();
			}
		}
		await this.page.getByLabel('Checked Value', { exact: true }).click();
		await this.page.getByLabel('Checked Value', { exact: true }).fill(CheckedValue);
		await this.page.getByLabel('Unchecked Value').click();
		await this.page.getByLabel('Unchecked Value').fill(UncheckedValue);
		expect(this.CheckIsDecimalCheckbox(IsDecimal, CheckedValue, UncheckedValue)).toBeTruthy();
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
	}

	async AddNumber_Switch(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsNullable: boolean, IsDecimal: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const OnValue = (Math.random() * 1000).toString();
		const OffValue = (Math.random() * 1000).toString();
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Switch' }).click();
		await expect(this.page.getByRole('heading', { name: 'Switch Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsNullable(IsNullable);
		await this.ChooseIsDecimal(IsDecimal);
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
		if (IsDefaultValue == true) {
			await this.CheckIsNullableSwitchCheckbox(IsNullable);
			if (IsNullable == true) {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.waitForTimeout(500);
				await this.page.getByTitle('NA').click();
			}
			else {
				await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
				await this.page.getByText('On Value', { exact: true }).first().click();
			}
		}
		await this.page.getByLabel('On Value', { exact: true }).nth(1).click();
		await this.page.getByLabel('On Value', { exact: true }).nth(1).fill(OnValue);
		await this.page.getByLabel('Off Value').nth(1).click();
		await this.page.getByLabel('Off Value').nth(1).fill(OffValue);
		await expect(this.CheckIsDecimalSwitch(IsDecimal, OnValue, OffValue)).toBeTruthy();
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}

	async AddNumber_RadioButtonSet(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsDecimal: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = Math.random();
		const Option2 = Math.random() * 10;
		const Option3 = Math.random() * 100;
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Radio Button Set' }).click();
		await expect(this.page.getByRole('heading', { name: 'Radio Button Set Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsDecimal(IsDecimal);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1.toString());
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill((Option1 + 1).toString());
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2.toString());
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill((Option2 + 1).toString());
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3.toString());
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill((Option3 + 1).toString());
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		if (IsDefaultValue == true && IsDecimal == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await this.page.getByTitle(Option2.toString()).getByText(Option2.toString()).click();
		}
		else if (IsDefaultValue == true && IsDecimal == false) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await this.page.getByTitle(Option2.toString()).getByText(Option2.toString()).click();
		}

		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}
	async AddNumber_CheckList(Name: string, IsEnabled: boolean, IsReadOnly: boolean, IsDecimal: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = Math.random().toString();
		const Option2 = (Math.random() * 10).toString();
		const Option3 = (Math.random() * 100).toString();
		await this.page.getByText('Number', { exact: true }).click();
		await this.page.locator('span').filter({ hasText: 'Check List' }).click();
		await expect(this.page.getByRole('heading', { name: 'Check List Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsDecimal(IsDecimal);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option1);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option2);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option3);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		if (IsDefaultValue == true) {
			await this.page.locator('div:nth-child(2) > .nested-properties-wrapper').click();
			await expect(this.page.getByLabel(Option1, { exact: true })).toBeVisible();
			await expect(this.page.getByLabel(Option2, { exact: true })).toBeVisible();
			await expect(this.page.getByLabel(Option3, { exact: true })).toBeVisible();
			await this.page.getByLabel(Option1, { exact: true }).check();
			await this.page.getByLabel(Option2, { exact: true }).check();
			await this.page.getByLabel(Option3, { exact: true }).check();
		}
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}
	async AddNumber_Select(Name: string, IsQueryable: boolean, IsSortable: boolean, IsEnabled: boolean, IsReadOnly: boolean, IsMultipleChoice: boolean, IsNullable: boolean, IsEmpty: boolean, IsUserEntryRequired: boolean, IsDefaultValue: boolean) {
		const Option1 = (Date.now()).toString();
		const Option2 = (Date.now() + 1).toString();
		const Option3 = (Date.now() + 2).toString();
		await this.page.getByText('Text', { exact: true }).click();
		await this.page.getByText('Select', { exact: true }).click();
		await expect(this.page.getByRole('heading', { name: 'Select Detail' })).toBeVisible();
		await this.page.getByLabel('Name').click();
		await this.page.getByLabel('Name').fill(Name);
		await this.page.getByLabel('Label').click();
		await this.page.getByLabel('Description').click();
		await this.page.getByLabel('Description').fill(Name);
		await this.ChooseIsQueryable(IsQueryable);
		await this.ChooseIsSortable(IsSortable);
		await this.CheckShowInList(IsQueryable, IsSortable);
		await this.ChooseIsEnabled(IsEnabled);
		await this.ChooseIsReadOnly(IsReadOnly);
		await this.ChooseIsMultipleChoice(IsMultipleChoice);
		await this.ChooseIsNullable(IsNullable);
		await this.CheckIsNullableNonSwitch(IsNullable, IsEmpty, IsUserEntryRequired);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option1);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option1);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option2);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option2);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
		await this.page.getByPlaceholder('New option label').click();
		await this.page.getByPlaceholder('New option label').fill(Option3);
		await this.page.getByPlaceholder('New option value').click();
		await this.page.getByPlaceholder('New option value').fill(Option3);
		await this.page.getByPlaceholder('New option value').press('Enter');
		await this.page.waitForTimeout(1000);
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
		await this.CheckIsMultipleChoice(IsMultipleChoice, IsDefaultValue, Option1, Option2, Option3);
		await this.page.getByRole('paragraph').fill(Name);
		await this.page.getByRole('button', { name: 'Add' }).click();
		await expect(this.page.getByText('Save variant successfully')).toBeVisible();
		await this.page.locator('.ant-notification-notice-close').click();
	}
}
