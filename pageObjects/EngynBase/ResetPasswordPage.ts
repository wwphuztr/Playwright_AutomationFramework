import { Page, Locator , expect} from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class ResetPasswordPage extends CommonComponents{
    //Locators
    public txtNewPassword: Locator
    public txtConfirmPassword: Locator
    public btnResetPassword: Locator

    constructor(public readonly page: Page) {
        super(page)
        
        this.txtNewPassword = this.page.getByPlaceholder('New Password', { exact: true })
        this.txtConfirmPassword = this.page.getByPlaceholder('New Confirm Password', {exact: true})
        this.btnResetPassword = this. page.getByRole('button', { name: 'Reset Password' })
    }
}