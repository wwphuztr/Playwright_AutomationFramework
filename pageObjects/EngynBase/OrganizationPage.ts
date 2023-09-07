import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class OrganizationPage extends CommonComponents {
    //Locators
    public btnEdit: Locator
    public txtDescription: Locator
    public txtHeadOfficeAddress: Locator
    public txtPostalAddress: Locator
    public txtWebsite: Locator
    public txtABN: Locator
    public txtOfficePhone: Locator
    public btnUpdate: Locator
    public btnCancel: Locator
    public btnInviteOrganization: Locator
    public btnInvite: Locator
    public tabOrganizationInvites: Locator
    public txtSearch: Locator
    public lnkHome: Locator
    public lnkOrganizations: Locator

    // Locator (User Infor)
    public txtTitle: Locator
    public txtFirstName: Locator
    public txtMiddleName: Locator
    public txtLastName: Locator
    public txtEmail: Locator

    // Locator (Organization Info)
    public txtCompanyName: Locator
    public txtDisplayName: Locator
    public txtDomainName: Locator
    public txaDescription: Locator

    // Locator (Organization Details)
    public headingOrg: Locator

    constructor(public readonly page: Page) {
        super(page)

        this.btnEdit = this.page.getByRole('button', { name: 'Edit' })
        this.txtDescription = this.page.getByLabel('Description')
        this.txtHeadOfficeAddress = this.page.getByLabel('Head Office Address')
        this.txtPostalAddress = this.page.getByLabel('Postal Address', { exact: true })
        this.txtEmail = this.page.getByLabel('Email')
        this.txtWebsite = this.page.getByLabel('Website')
        this.txtABN = this.page.locator("#registrationId")
        this.txtOfficePhone = this.page.locator('input[type="tel"]')
        this.btnUpdate = this.page.getByRole('button', { name: 'UPDATE' })
        this.btnCancel = this.page.getByRole('button', { name: 'CANCEL' })
        this.btnInviteOrganization = this.page.getByRole('button', { name: 'Invite Organization' })
        this.btnInvite = this.page.getByRole('button', { name: 'Invite' })
        this.tabOrganizationInvites = this.page.getByRole('tab', { name: 'Organization Invites' })
        this.txtSearch = this.page.getByPlaceholder('Search')
        this.lnkHome = this.page.getByRole('link', { name: 'Home' })
        this.lnkOrganizations = this.page.getByRole('link', { name: 'Organizations' })

        // Locator (User Infor)
        this.txtTitle = this.page.getByLabel('Title')
        this.txtFirstName = this.page.getByPlaceholder('First Name')
        this.txtMiddleName = this.page.getByPlaceholder('Middle Name')
        this.txtLastName = this.page.getByPlaceholder('Last Name')
        this.txtEmail = this.page.getByPlaceholder('Email')

        // Locator (Organization Info)
        this.txtCompanyName = this.page.getByPlaceholder('Formal Name')
        this.txtDisplayName = this.page.getByPlaceholder('Display Name')
        this.txtDomainName = this.page.getByPlaceholder('https://example.com')
        this.txaDescription = this.page.getByPlaceholder('Description')

        // Locator (Organization Details)
        this.headingOrg = this.page.getByRole('heading', { name: 'Organization Details' })
    }
    // --------------------------------------------------- Elements ---------------------------------------------------
    btnResend(email): Locator {
        return this.page.locator(".ant-table-row").filter({ hasText: email }).locator("//button").filter({ has: this.page.locator(".fa-paper-plane") })
    }

    btnDelete(email): Locator {
        return this.page.locator(".ant-table-row").filter({ hasText: email }).locator("//button[contains(@class, 'ant-btn-danger')]")
    }

    rowData(email): Locator {
        return this.page.locator(".ant-table-row").filter({ hasText: email })
    }

    nameOrg(orgName): Locator {
        return this.page.getByRole('cell', { name: orgName })
    }
    // --------------------------------------------------- Actions ---------------------------------------------------
    // WE have 4 roles: Mr, Miss, Mrs, Ms
    async chooseTitle(title: 'Mr' | 'Miss' | 'Mrs' | 'Ms') {
        await this.txtTitle.click()
        await this.page.getByTitle(title, { exact: true }).click()
    }

    async fillInformation(title: 'Mr' | 'Miss' | 'Mrs' | 'Ms', email, orgName, domainName, firstName, middleName, lastName) {
        await this.chooseTitle(title)
        await this.txtFirstName.fill(firstName)
        await this.txtMiddleName.fill(middleName)
        await this.txtLastName.fill(lastName)
        await this.txtEmail.fill(email)
        await this.txtCompanyName.fill(orgName)
        await this.txtDisplayName.fill(orgName)
        await this.txtDomainName.fill(domainName)
    }

    async validateOrgInvitation(email, option: 'attach' | 'detach') {
        switch (option) {
            case 'attach':
                await expect(this.rowData(email)).toBeAttached()
                break;

            case 'detach':
                await expect(this.rowData(email)).not.toBeAttached()
                break;
        }
    }

    async expectOrgName(orgName) {
        await expect(this.nameOrg(orgName)).toBeVisible()
    }

    async clickOrgName(orgName) {
        await this.nameOrg(orgName).click()
        await expect(this.headingOrg).toBeVisible()
    }
}