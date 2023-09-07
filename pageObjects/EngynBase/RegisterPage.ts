import { Page, Locator, expect } from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class RegisterPage extends CommonComponents{
    //Locators
    public txtName: Locator
    public txtEmail: Locator
    public txtPassword: Locator
    public btnEnter: Locator
    public txtBusinessName: Locator
    public btnCancel: Locator

    constructor(public readonly page: Page) {
        super(page)
        
        this.txtName = this.page.getByPlaceholder('Enter your full name')
        this.txtEmail = this.page.getByPlaceholder('Enter your email address')
        this.txtPassword = this.page.getByPlaceholder('Password')
        this.btnEnter = this.page.getByRole('button', { name: 'Enter' })
        this.txtBusinessName = this.page.getByPlaceholder('Enter your business name (optional)')
        this.btnCancel = this.page.getByRole('button', {name: 'Cancel'})
    }
}