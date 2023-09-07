import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class ProfilePage extends CommonComponents{
    //Locators
    public btnChangePassword: Locator
    public txtCurrentPassword: Locator
    public txtNewPassword: Locator
    public txtConfirmNewPassword: Locator
    public btnChange: Locator
    public txtFirstName: Locator
    public txtMiddleName: Locator
    public txtLastName: Locator
    public btnSaveChange: Locator

    constructor(public readonly page: Page) {
        super(page)
        
        this.btnChangePassword = this.page.getByRole('button', { name: 'Change Password' })
        this.txtCurrentPassword = this.page.getByPlaceholder('Current Password')
        this.txtNewPassword = this.page.getByPlaceholder('New Password', { exact: true })
        this.txtConfirmNewPassword = this.page.getByPlaceholder('Confirm New Password')
        this.btnChange = this.page.getByRole('button', { name: 'Change', exact: true })
        this.txtFirstName = this.page.getByLabel('First Name')
        this.txtMiddleName = this.page.getByLabel('Middle name')
        this.txtLastName = this.page.getByLabel('Last Name')
        this.btnSaveChange = this.page.getByRole('button', {name: 'Save Changes'})
    }
}