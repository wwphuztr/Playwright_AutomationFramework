import { Page, Locator, expect } from '@playwright/test';
import { DashBoardPage } from './DashBoardPage';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class UsersPage extends CommonComponents{
    //Locators
    public txtSearch: Locator
    public btnInviteUser: Locator
    public txtEmail: Locator
    public cboRole: Locator
    public btnInvite: Locator
    public btnYes: Locator
    public btnNo: Locator
    public tabRoleInvites: Locator
    public lnkHome: Locator

    //Page
    dashboardPage: DashBoardPage
    
    constructor(public readonly page: Page) {
        super(page);
        
        // Elements
        this.txtSearch = this.page.getByPlaceholder('Search')
        this.btnInviteUser = this.page.getByRole('button', { name: 'Invite User' })
        this.txtEmail = this.page.getByPlaceholder('Email')
        this.cboRole = this.page.getByLabel('Role')
        this.btnInvite = this.page.getByRole('button', { name: 'Invite', exact: true })
        this.btnYes = this.page.getByRole('button', { name: 'Yes' })
        this.btnNo = this.page.getByRole('button', { name: 'No' })
        this.tabRoleInvites = this.page.getByRole('tab', { name: 'Role Invites' })
        this.lnkHome = this.page.getByRole('link', { name: 'Home' })

        // Pages
        this.dashboardPage = new DashBoardPage(this.page)

    }

    // ---------------------------------------------------- Elements ----------------------------------------------------
    btnDelete(role , email): Locator {
        return this.page.locator(".ant-table-row").filter({hasText:role}).filter({hasText: email}).locator("//button[contains(@class, 'ant-btn-danger')]")
    }

    dataRow(role, email): Locator {
        return this.page.locator(".ant-table-row").filter({hasText:role}).filter({hasText: email})
    }

    role(role): Locator {
        return this.page.getByTitle(role)
    }

    // ---------------------------------------------------- Actions ----------------------------------------------------
    async inviteUser(role, email) {
        await this.btnInviteUser.click()
        await this.txtEmail.fill(email)
        await this.cboRole.click()
        await this.role(role).click()
        await this.btnInvite.click()
    }

    async hoverbtnDelete(role , email) {
        await this.dataRow(role, email).filter({hasText: 'Enabled'}).locator('.btn-remove').hover()
    }

    // Choose role for normal account, it is not be applied for flatform account
    async chooseRole(inviterRole: 'Admin' | 'Manager', receiverRole: 'Admin' | 'Manager' | 'Member') {

        if(inviterRole == 'Admin') {
            await this.cboRole.click()
            await expect(this.role('Admin')).toBeVisible()
            await expect(this.role('Manager')).toBeVisible()
            await expect(this.role('Member')).toBeVisible()
        }
        else if(inviterRole == 'Manager') {
            await this.cboRole.click()
            await expect(this.role('Admin')).not.toBeVisible()
            await expect(this.role('Manager')).not.toBeVisible()
            await expect(this.role('Member')).toBeVisible()
        }
        
        await this.page.getByTitle(receiverRole).click()
    }

    // Check if the role invite is appear or not
    async verifyRoleInvites(role, email) {
        await expect(this.dataRow(role, email)).toBeVisible()
    }

    async verifyUserNotExist(email) {
        await this.goto(process.env.MEMBERS)
        await this.txtSearch.clear()
        await this.txtSearch.fill(email)
        await this.expectText('No data')
    }
}