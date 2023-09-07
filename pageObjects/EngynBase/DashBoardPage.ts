import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class DashBoardPage extends CommonComponents{
    //Locators
    public mnuItemAvatar: Locator
    public mnuItemProfile: Locator
    public mnuItemLogout: Locator

    public mnuItemForm: Locator
    public mnuItemCore: Locator

    public mnuItemOrgRole: Locator
    public mnuItemSetting: Locator
    
    public mnuItemUsers: Locator
    public btnResendValidationEmail: Locator
    public btnReCheck: Locator
    public mnuItemOrg: Locator
    public btnArrow: Locator
    public spnIcon: Locator

    constructor(public readonly page: Page) {
        super(page)
        
        // Locators
        this.mnuItemAvatar = this.page.locator("//span[contains(@class, 'ant-avatar')]")
        this.mnuItemProfile = this.page.getByRole('menuitem', {name: 'Profile'})
        this.mnuItemLogout = this.page.getByRole('menuitem', {name: 'Logout'})
        this.mnuItemForm = this.page.getByRole('menuitem', { name: 'Forms', exact: true })
        this.mnuItemCore = this.page.getByRole('menuitem', { name: 'Core' , exact: true})
        this.mnuItemOrgRole = this.page.locator(".ant-menu-submenu-popup").filter({hasText : 'Profile'}).locator(".menu-role")
        this.mnuItemSetting = this.page.getByRole('menuitem', { name: 'Settings' })
        this.btnResendValidationEmail = this.page.getByRole('button', { name: 'Resend Validation Email' })
        this.btnReCheck = this.page.getByRole('button', { name: 'Recheck' })
        this.mnuItemOrg = this.page.getByRole('menuitem', { name: 'Organization' })
        this.btnArrow = this.page.locator(".ant-layout-sider").filter({hasText: 'Settings'}).getByRole('button')
        this.mnuItemUsers = this.page.locator(".ant-menu-submenu-open").getByText('Users', {exact: true})
        this.spnIcon = this.page.locator(".page-table").filter({hasText: 'Users'}).locator(".ant-spin-nested-loading")
    }

    // -------------------------------------------- Elements ----------------------------------------------------
    mnuItemRole(orgName): Locator {
        return this.page.getByRole('menuitem', { name: orgName })
    }

    // -------------------------------------------- Actions ----------------------------------------------------
    async changeOrg(orgName) {
        await this.mnuItemAvatar.hover()
        await this.mnuItemOrgRole.hover()
        await this.mnuItemRole(orgName).click()
    }

    async gotoProfile() {
        await this.mnuItemAvatar.hover()
        await this.mnuItemProfile.click()
    }

    async navigateToUserPage() {
        await this.btnArrow.click()
        await this.mnuItemSetting.click() 
        // After clicking users page, we will wait until the spinning icon disappear
        await Promise.all([
            this.mnuItemUsers.click(),
            expect(this.spnIcon).not.toBeAttached()
        ])
    }
}