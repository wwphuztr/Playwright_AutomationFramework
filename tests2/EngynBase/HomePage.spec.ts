import { test, expect } from "../../fixtures/baseTest"

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.LOGIN!)
})

test.afterEach(async ({ page }) => {
    await page.close()
})

test.only("BASE22 - Resend validation email to a person account ", async ({ loginPage, registerPage, dashBoardPage, emailPage, commonFunc }) => {
    const title = 'Engyn - Email Validation';
    const email = 'auto' + Date.now() + '@mailinator.com';

    // Precondition: Have an onboarding personal/business account
    await loginPage.btnCreateAnAccount.click()
    await registerPage.txtName.fill(email)
    await registerPage.txtEmail.fill(email)
    await registerPage.txtPassword.fill(process.env.PASSWORD!)
    await registerPage.txtBusinessName.fill(email)
    await registerPage.btnEnter.click()
    await registerPage.expectToHaveURL('dashboard')

    // 1.Login to the Onboarding account
    await registerPage.logOut()
    await loginPage.login(email, process.env.PASSWORD!)

    // 2.Press the ‘Resend validation email’
    await dashBoardPage.btnResendValidationEmail.click()

    // 3.Go to the individual mail
    await emailPage.verifyTheResendEmail(title, email)
})

test("BASE23/BASE24 - Log out the account", async ({ loginPage , commonFunc}) => { 
    // Login
    await loginPage.login(process.env.ORGADMINUSERNAME!, process.env.PASSWORD!)

    // Logout
    await loginPage.logOut()

    // Verify if we back to login or not
    await loginPage.expectToHaveURL('login')
})