import { Page, Locator, expect } from '@playwright/test';
import { CommonComponents } from '../../common/CommonComponents';

export class CreatOrganiztionPage extends CommonComponents {
    //Locators
    public txtTitle: Locator
    public txtFirstName: Locator
    public txtMiddleName: Locator
    public txtLastName: Locator
    public txtEmail: Locator
    public txtCompanyName: Locator
    public txtDisplayName: Locator
    public txtDomainName: Locator
    public txaDescription: Locator
    public txtPassword: Locator
    public txtConfirm: Locator
    public btnSubmit: Locator

    constructor(public readonly page: Page) {
        super(page)

        this.txtTitle = this.page.locator("//span[contains(@class, 'ant-select-selection-item')]")
        this.txtFirstName = this.page.getByPlaceholder('First Name')
        this.txtMiddleName = this.page.getByPlaceholder('Middle Name')
        this.txtLastName = this.page.getByPlaceholder('Last Name')
        this.txtEmail = this.page.getByPlaceholder('Email')
        this.txtCompanyName = this.page.getByPlaceholder('Formal Name')
        this.txtDisplayName = this.page.getByPlaceholder('Display Name')
        this.txtDomainName = this.page.getByPlaceholder('https://example.com')
        this.txaDescription = this.page.getByPlaceholder('Description')
        this.txtPassword = this.page.getByPlaceholder('Password', { exact: true })
        this.txtConfirm = this.page.getByPlaceholder('Password Confirm')
        this.btnSubmit = this.page.getByRole('button', { name: 'Submit' })
    }

    async validateInformation(title, email, orgName, domainName, firstName, middleName, lastName) {
        await expect(this.txtEmail).toHaveValue(email)
        await expect(this.txtTitle).toHaveText(title)
        await expect(this.txtFirstName).toHaveValue(firstName)
        await expect(this.txtMiddleName).toHaveValue(middleName)
        await expect(this.txtLastName).toHaveValue(lastName)
        await expect(this.txtCompanyName).toHaveValue(orgName)
        await expect(this.txtDisplayName).toHaveValue(orgName)
        await expect(this.txtDomainName).toHaveValue(domainName)
    }
}