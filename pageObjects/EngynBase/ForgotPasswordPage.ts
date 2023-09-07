import { Page, Locator , expect} from '@playwright/test';
import { CommonPage } from '../../common/CommonPage';
import { CommonComponents } from '../../common/CommonComponents';

export class ForgotPasswordPage extends CommonComponents{
    //Locators
    public txtEmail: Locator
    public btnSendRequest :Locator

    constructor(public readonly page: Page) {
        super(page)
        this.txtEmail = this.page.getByPlaceholder('Email')
        this.btnSendRequest = this.page.getByRole('button', {name: 'SEND REQUEST'})
    }

}