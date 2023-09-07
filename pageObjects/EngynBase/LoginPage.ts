import { Page, Locator , expect} from '@playwright/test';
import { CommonComponents } from '../../common/CommonComponents';

export class LoginPage extends CommonComponents{
    //Locators
    public txtEmail: Locator
    public txtPassWord: Locator
    public btnLogin: Locator
    public alertEmail: Locator
    public alert: Locator
    public lnkForgotPassword: Locator
    public btnCreateAnAccount: Locator

    constructor(public readonly page: Page) {
        super(page)
        this.txtEmail = this.page.getByPlaceholder('Email')
        this.txtPassWord = this.page.getByPlaceholder('Password')
        this.btnLogin = this.page.getByRole('button', { name: 'Log in' })
        this.lnkForgotPassword = this.page.getByRole('link', {name: 'password'})
        this.btnCreateAnAccount = this.page.getByRole('button', { name: 'Create an account' })
    }

    async login(username: string, password: string) {
        await this.page.goto(process.env.LOGIN!, {waitUntil: 'load'})
        await this.txtEmail.fill(username)
        await this.txtPassWord.fill(password)
        await this.btnLogin.click()
        await this.page.waitForLoadState('load')
        await this.verifyLoginSuccess()
    }

    async verifyLoginSuccess() {
        await expect(this.page).toHaveURL(new RegExp('.*dashboard.*'))
    }

    async verifyAlert(error_name: string) {
        this.alert = this.page.getByText(error_name)
        await expect(this.alert).toBeVisible()
    }
}