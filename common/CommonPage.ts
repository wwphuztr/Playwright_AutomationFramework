import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from '../pageObjects/EngynBase/LoginPage';
import { DashBoardPage } from '../pageObjects/EngynBase/DashBoardPage';
import { ProfilePage } from '../pageObjects/EngynBase/ProfilePage';
import { UsersPage } from '../pageObjects/EngynBase/UsersPage';
import { EmailPage } from '../pageObjects/EngynBase/EmailPage';
import { RegisterPage } from '../pageObjects/EngynBase/RegisterPage';
import { CommonComponents } from './CommonComponents';
import { FormsNavigationMenu } from '../pageObjects/EngynForm/FormsNavigationMenu';
import { DesignerPage } from '../pageObjects/EngynForm/FormsDesigner/DesignerPage';
import { Designer_FormsDesignerPage } from '../pageObjects/EngynForm/FormsDesigner/Designer_FormsDesignerPage';
import { DataLocationType, FormLocationType } from '../Type/Types';

export class CommonPage extends CommonComponents {
    // Locators
    public lnkFormsLibrary: Locator

    // Pages
    public dashboardPage: DashBoardPage
    public profilePage: ProfilePage
    public userPage: UsersPage
    public emailPage: EmailPage
    public registerPage: RegisterPage
    public loginPage: LoginPage

    public formNavigationMenu: FormsNavigationMenu
    public designerPage: DesignerPage
    public designer_FormsDesginerPage: Designer_FormsDesignerPage

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.loginPage = new LoginPage(this.page)
        this.dashboardPage = new DashBoardPage(this.page)
        this.profilePage = new ProfilePage(this.page)
        this.userPage = new UsersPage(this.page)
        this.emailPage = new EmailPage(this.page)
        this.registerPage = new RegisterPage(this.page)
        this.lnkFormsLibrary = this.page.getByRole('link', { name: 'Forms Library' })
    
        this.formNavigationMenu = new FormsNavigationMenu(this.page)
        this.designerPage = new DesignerPage(this.page)
        this.designer_FormsDesginerPage = new Designer_FormsDesignerPage(this.page)
    }

    async logOut() {
        await expect(async () => {
            await this.page.goto("/")
            await this.dashboardPage.mnuItemAvatar.hover()
            await this.dashboardPage.mnuItemLogout.click()
            await this.expectToHaveURL('login')
        }).toPass();
    }

    async inviteUserEndtoEnd(senderAccount, role, title, email) {
        await this.loginPage.login(senderAccount, process.env.PASSWORD!)
        await this.dashboardPage.navigateToUserPage()
        await this.userPage.inviteUser(role, email)
        await this.userPage.expectText('The invitation has been sent')
        await this.userPage.btnOK.click()
        await this.emailPage.selectEmail(title, email)
        const url = await this.emailPage.getUrlEmail()
        await this.emailPage.goto(url)
        await this.registerPage.txtName.fill(email)
        await this.registerPage.txtPassword.fill('12345678aA@')
        await this.registerPage.btnEnter.click()
        await this.registerPage.expectToHaveURL('login')
    }

    async registerPersonalAccount() {
        const title = 'Engyn - Email Validation'
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const email = 'auto' + randomInt(1, 90) + Date.now() + '@mailinator.com'

        await this.loginPage.goto('/login')
        await this.loginPage.btnCreateAnAccount.click()
        await this.registerPage.txtName.fill(email)
        await this.registerPage.txtEmail.fill(email)
        await this.registerPage.txtPassword.fill(process.env.PASSWORD!)
        await this.registerPage.btnEnter.click()
        await this.registerPage.expectToHaveURL('dashboard')

        await this.emailPage.selectEmail(title, email)
        const url = await this.emailPage.getUrlEmail()
        await this.emailPage.goto(url)
        await this.btnBackToHome.click()

        return email
    }

    async navigateToFormPage(email, password) {
        await this.loginPage.login(email, password)
        await this.dashboardPage.mnuItemForm.click()
        await this.expectToHaveURL('mail-box#Inbox')
    }

    async createAForm(creatorEmail, formLocation: FormLocationType, dataLocation: DataLocationType, formName, options?: string) {
        await this.navigateToFormPage(creatorEmail, process.env.PASSWORD!)
        await this.formNavigationMenu.navigateTo('Forms Designer')
        await this.designerPage.btnCreateForm.click()

        // Create Empty Form
        await this.designerPage.CreateForm.txtTitle.fill(formName)
        await this.designerPage.CreateForm.txtDescription.fill(formName)
        await this.designerPage.CreateForm.tabEmptyForm.click()
        await this.designerPage.CreateForm.btnCreate.click()

        await this.expectText('The next step is to add some data entry controls to your form')
        await this.expectText("When you're ready to use the form, publish it to make it available")
        await this.expectText('Form Created!')
        await this.btnOK.click()
        await this.expectText('This form is empty')

        await expect(this.designer_FormsDesginerPage.btnDelete).toBeEnabled()
        await expect(this.designer_FormsDesginerPage.btnDuplicate).toBeDisabled()
        await expect(this.designer_FormsDesginerPage.btnPublish).toBeDisabled()

        // Add First Control
        await this.designer_FormsDesginerPage.btnCirclePlus.click()
        await this.expectText('Add Element')

        // Add Component
        await this.designer_FormsDesginerPage.AddElementModal.addComponents('Select Number')

        // Click Publish
        await this.designer_FormsDesginerPage.btnPublish.click()

        // Choose Form Location and Data Location
        await this.designer_FormsDesginerPage.PublishFormModal.chooseFormLocation(formLocation)
        await this.designer_FormsDesginerPage.PublishFormModal.chooseDataLocation(dataLocation)

        await this.designer_FormsDesginerPage.PublishFormModal.btnPUBLISH.click()

    }
}