import { Page } from "@playwright/test"
import { test, expect } from "../../fixtures/baseTest"
import { LoginPage } from "../../pageObjects/EngynBase/LoginPage"
import { ResetPasswordPage } from "../../pageObjects/EngynBase/ResetPasswordPage"
import { DashBoardPage } from "../../pageObjects/EngynBase/DashBoardPage"
import { ProfilePage } from "../../pageObjects/EngynBase/ProfilePage"
import { partialURL, url } from "../../Environments/configVariables"

test.beforeEach(async ({ page }) => {
    await page.goto("/login")
})

test.afterEach(async ({ page }) => {
    await page.close()
})

test("Delete Users", async ({ loginPage, dashBoardPage }) => {
    // 1.Enter the valid mail to the Email textbox.
    await loginPage.txtEmail.fill('flynkautomationadm@mailinator.com')

    // 2.Enter the valid mail to the password textbox
    await loginPage.txtPassWord.fill(process.env.ORGADMINPASSWORD!)

    // 3.Click on the Login button.
    await loginPage.btnLogin.click()

    // Navigate to the Engyn System.
    await loginPage.verifyLoginSuccess()

    await dashBoardPage.navigateToUserPage()
})

test("BASE1 - Login successfully with a valid user and password", async ({ loginPage }) => {
    // 1.Enter the valid mail to the Email textbox.
    await loginPage.txtEmail.fill(process.env.ORGADMINUSERNAME!)

    // 2.Enter the valid mail to the password textbox
    await loginPage.txtPassWord.fill(process.env.ORGADMINPASSWORD!)

    // 3.Click on the Login button.
    await loginPage.btnLogin.click()

    // Navigate to the Engyn System.
    await loginPage.verifyLoginSuccess()
})

test("BASE2 + BASE8 - Error Blank Email & Password on login page", async ({ loginPage }) => {
    // 1.Let the Email blank and Password blank

    // 2.Click on the Login button.
    await loginPage.btnLogin.click()

    // The text warning “This field is required” and “Password is required” will display
    await loginPage.verifyAlert("This field is required")
    await loginPage.verifyAlert("Password is required")

    // Login button will be disabled
    await expect(loginPage.btnLogin).toBeDisabled()
})

test("BASE3 - Blank Email and Short Password Error", async ({ loginPage }) => {
    // 1.Let the Email blank and Password less than 8 characters
    await loginPage.txtPassWord.fill('1aA@')

    // 2.Click on the Login button. --> Click button will be disable when we fill an unexpected password character

    // The warning “Password must be at least 8 characters" will appear under the password textbox.
    await loginPage.verifyAlert("Password must be at least 8 characters")
})

test("BASE4 - Blank Email and Valid Password Error", async ({ loginPage }) => {
    // 1.Let the blank Email and the valid password
    await loginPage.txtPassWord.fill(process.env.PASSWORD!)

    // 2.Click on the Login button
    await loginPage.btnLogin.click()

    // The text warning “Email is required” will display below the email textbox
    await loginPage.verifyAlert("This field is required")
})

test("BASE5 - Blank Password and InValid Email Error", async ({ loginPage }) => {
    // 1.Let the Password blank and invalid Email
    await loginPage.txtEmail.fill("Invalid")

    // 2.Click on the Login button. --> Click button will be disable when we fill an unexpected password character

    // The text warning “Email is the invalid format” will display
    await loginPage.verifyAlert("Email is invalid format")
})

test("BASE6 - Blank Password and Valid Email Error", async ({ loginPage }) => {
    // 1.Let the Password blank and valid Email
    await loginPage.txtEmail.fill(process.env.ORGADMINUSERNAME!)

    // 2.Click on the Login button.
    await loginPage.btnLogin.click()

    // The text warning “Password is required” will display below the password textbox
    await loginPage.verifyAlert("Password is required")
})

test("BASE7 - Wrong Email and Password Error", async ({ loginPage }) => {
    // 1.Let the Email or Password be wrong.
    await loginPage.txtEmail.fill("WrongEmail@mailinator.com")
    await loginPage.txtPassWord.fill("12345678aA@@")

    // 2.Click on the Login button.
    await loginPage.btnLogin.click()

    // The pop-up “Incorrect username or password” appears
    await loginPage.expectText('Incorrect username or password')
    await loginPage.btnOK.click()
})

test("BASE9 - Reset Password Successful", async ({ loginPage, dashBoardPage, forgotPasswordPage, profilePage, emailPage }) => {
    const title = 'Reset Password';
    const password = 'aA@' + Math.floor(Math.random() * Date.now())

    // 1.Stay on Login Page and click on the forgot password
    await loginPage.lnkForgotPassword.click()

    // 2.Fill the email follow the rule
    await forgotPasswordPage.txtEmail.fill(process.env.PASSWORDRESETUSERNAME!)

    // 3.Click on the Send request
    await forgotPasswordPage.btnSendRequest.click()
    await forgotPasswordPage.expectText('Check your email or text message')

    // 4.Log in your individual mail
    // 5.Open this mail and tap on reset password
    await emailPage.selectEmail(title, process.env.PASSWORDRESETUSERNAME!)
    const page1 = await emailPage.clickButton('Reset Password')

    const resetPasswordPage = new ResetPasswordPage(page1)

    // 6.Fill in the new password and confirm the new password following
    await resetPasswordPage.txtNewPassword.fill(password)
    await resetPasswordPage.txtConfirmPassword.fill(password)

    // 7.Click on Reset password
    await resetPasswordPage.btnResetPassword.click()
    await resetPasswordPage.expectText('Your password has been reset successfully')

    // 8.Login to Engyn with the new password
    await loginPage.login(process.env.PASSWORDRESETUSERNAME!, password)

    // Reset Password
    await dashBoardPage.mnuItemAvatar.hover()
    await dashBoardPage.mnuItemProfile.click()

    await profilePage.btnChangePassword.click()
    await profilePage.txtCurrentPassword.fill(password)
    await profilePage.txtNewPassword.fill(process.env.PASSWORD!)
    await profilePage.txtConfirmNewPassword.fill(process.env.PASSWORD!)
    await profilePage.btnChange.click()

    await profilePage.btnOK.click()
})

test("BASE10 - Wrong email format when resetting password error", async ({ loginPage, forgotPasswordPage }) => {
    // 1.Click on the forgot password
    await loginPage.lnkForgotPassword.click()
    // Users will be navigated to the forgot password page
    await loginPage.expectToHaveURL(partialURL.forgot_password)

    // 2.Fill the email un-follow the rule
    await forgotPasswordPage.txtEmail.fill('Invalid')

    // 3.Click on the send request
    await forgotPasswordPage.btnSendRequest.click()

    // The warning “email is invalid” appears
    await forgotPasswordPage.expectText('Email is Invalid')
})

test("BASE11 - Non-existent user when resetting password error", async ({ loginPage, forgotPasswordPage }) => {
    // 1.Click on the forgot password
    await loginPage.lnkForgotPassword.click()
    // Users will be navigated to the forgot password page
    await loginPage.expectToHaveURL(partialURL.forgot_password)

    // 2.Fill in the random emails which is not registered the Engyn account
    await forgotPasswordPage.txtEmail.fill('non-existent@mailinator.com')

    // 3.Click on the send request
    await forgotPasswordPage.btnSendRequest.click()

    // The warning “Not Found: No existing user found with provided info” appears
    await forgotPasswordPage.expectText('Not Found: No existing user found with provided info')
})

test("BASE12 - Verify Login button in Forgot Password page", async ({ loginPage, forgotPasswordPage }) => {
    // 1.Click on the forgot password
    await loginPage.lnkForgotPassword.click()
    // Users will be navigated to the forgot password page
    await loginPage.expectToHaveURL(partialURL.forgot_password)

    // 2.Fill the email
    await forgotPasswordPage.txtEmail.fill(process.env.ORGADMINUSERNAME!)

    // 3.Click on the Send request
    await forgotPasswordPage.btnSendRequest.click()

    await forgotPasswordPage.expectText('Check your email or text message')

    // 4.Click on log-in link
    await forgotPasswordPage.goto(url.login)

    // Users have been moved to the Log-in page
    await forgotPasswordPage.expectToHaveURL(partialURL.login)
})

test("BASE13 - Register Personal Account", async ({ loginPage, dashBoardPage, registerPage, emailPage}) => {
    const email = 'auto' + 13 + Date.now() + '@mailinator.com';
    const title = 'Engyn - Email Validation';

    // 1Click on the CREATE AN ACCOUNT
    await loginPage.btnCreateAnAccount.click()

    // 2 Fill in this information:
    // 2.1 Name
    await registerPage.txtName.fill(email)

    // 2.2 Email
    await registerPage.txtEmail.fill(email)

    // 2.3 Password
    await registerPage.txtPassword.fill(process.env.PASSWORD!)

    // 3.Click on the ENTER button
    await registerPage.btnEnter.click()
    await registerPage.expectToHaveURL(partialURL.dashboard)

    // 4.Check the individual email
    // 5.Open the validation mail and click confirm
    await emailPage.selectEmail(title, email)
    const page1 = await emailPage.clickButton('CONFIRM')

    await page1.getByRole('button', { name: 'Back to Home' }).click();

    // 6.Login with this account to Engyn
    await dashBoardPage.logOut()
    await loginPage.login(email, process.env.PASSWORD!)

    // Users will be navigated to the Home Page and can see the Form, Core page
    await expect(dashBoardPage.mnuItemForm).toBeVisible()
    await expect(dashBoardPage.mnuItemCore).toBeVisible()
})

test("BASE14 - Register Business Account", async ({ loginPage, dashBoardPage, registerPage, emailPage }) => {
    const email = 'auto' + 14 + Date.now() + '@mailinator.com';
    const title = 'Engyn - Email Validation';

    // 1.Click on the CREATE AN ACCOUNT
    await loginPage.btnCreateAnAccount.click()

    // 2 Fill in this information:

    // 2.1 Name:
    await registerPage.txtName.fill(email)

    // 2.2 Email
    await registerPage.txtEmail.fill(email)

    // 2.3 Password
    await registerPage.txtPassword.fill(process.env.PASSWORD!)

    // 2.4 Business's name:
    await registerPage.txtBusinessName.fill(email)

    // 3.Click on the ENTER button
    await registerPage.btnEnter.click()
    await registerPage.expectToHaveURL(partialURL.dashboard)

    // 4.Check the individual email
    await emailPage.selectEmail(title, email)
    // 5.Open the validation mail and click confirm
    const page1 = await emailPage.clickButton('CONFIRM')
    await page1.getByRole('button', { name: 'Back to Home' }).click();

    // 6.Login with this account to Engyn
    await dashBoardPage.logOut()
    await loginPage.login(email, process.env.PASSWORD!)

    // Users will be navigated to the Home Page and can have the access to the Form, Core, Org and user page (verify the setting icon)
    await dashBoardPage.mnuItemForm.click()
    await dashBoardPage.expectToHaveURL(partialURL.form)

    await dashBoardPage.mnuItemCore.click()
    await dashBoardPage.expectToHaveURL(partialURL.core)

    // Verify the Setting Icon
    await expect(dashBoardPage.mnuItemSetting).toBeVisible()

    // 7.Click on user’s icon → check the current org
    await dashBoardPage.mnuItemAvatar.hover()

    // The default org must be a business org
    await expect(dashBoardPage.mnuItemOrgRole).toHaveText(email)
})

test("BASE15 - Verify error popup when user try to use link that has already been used to register(Personal)", async ({ loginPage, dashBoardPage,  registerPage, emailPage }) => {
    const email = 'auto' + 15 + Date.now() + '@mailinator.com';
    const title = 'Engyn - Email Validation';

    // 1.Click on the CREATE AN ACCOUNT
    await loginPage.btnCreateAnAccount.click()

    // 2.Fill in this information:
    // 2.1 Name:
    await registerPage.txtName.fill(email)

    // 2.2 Email
    await registerPage.txtEmail.fill(email)

    // 2.3 Password 
    await registerPage.txtPassword.fill(process.env.PASSWORD!)

    // 3.Click on the ENTER button
    await registerPage.btnEnter.click()
    await registerPage.expectToHaveURL(partialURL.dashboard)

    // 4.Check the individual email
    // 5.Open the validation mail and click confirm
    await emailPage.selectEmail(title, email)
    const urlEmail = await emailPage.getUrlEmail()
    await emailPage.goto(urlEmail)
    await emailPage.btnBackToHome.click()

    // 6.Login with this account to Engyn
    await dashBoardPage.logOut()
    await loginPage.login(email, process.env.PASSWORD!)

    // 7.Check the individual mail and open the validation mail again
    // 8.Click confirm
    await dashBoardPage.goto(urlEmail)
    await dashBoardPage.expectText('Email is already validated')
    await dashBoardPage.expectText('Please email us at support@flynk.com with any questions or suggestions')
})

test("BASE16 - Verify error popup when user try to use link that has already been used to register(Business)", async ({ dashBoardPage, loginPage, registerPage, emailPage }) => {
    const email = 'auto' + 15 + Date.now() + '@mailinator.com';
    const title = 'Engyn - Email Validation';

    // 1.Click on the CREATE AN ACCOUNT
    await loginPage.btnCreateAnAccount.click()

    // 2.Fill in this information:
    // 2.1 Name:
    await registerPage.txtName.fill(email)

    // 2.2 Email
    await registerPage.txtEmail.fill(email)

    // 2.3 Password 
    await registerPage.txtPassword.fill(process.env.PASSWORD!)

    // 2.4 Business's name:
    await registerPage.txtBusinessName.fill(email)

    // 3.Click on the ENTER button
    await registerPage.btnEnter.click()
    await registerPage.expectToHaveURL(partialURL.dashboard)

    // 4.Check the individual email
    // 5.Open the validation mail and click confirm
    await emailPage.selectEmail(title, email)
    const urlEmail = await emailPage.getUrlEmail()
    await emailPage.goto(urlEmail)
    await emailPage.btnBackToHome.click()

    // 7.Check the individual mail and open the validation mail again
    // 8.Click confirm
    await dashBoardPage.goto(urlEmail)
    await dashBoardPage.expectText('Email is already validated')
    await dashBoardPage.expectText('Please email us at support@flynk.com with any questions or suggestions')
})

test("BASE17 - All spaces blank when registering account error", async ({ page, loginPage, registerPage }) => {
    // Click Enter with Name blank & Email blank & Password blank
    await loginPage.btnCreateAnAccount.click()
    await registerPage.btnEnter.click()

    // The warning text “Name is required”, “Email is required” and “Password is required“ will appear below 3 textboxes and ENTER button is grey and disable
    await expect(page.locator('#fullName_help').getByText('This field is required')).toBeVisible();
    await expect(page.locator('#email_help').getByText('This field is required')).toBeVisible();
    await expect(page.locator('#password_help').getByText('This field is required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter' })).toBeDisabled();

})

test("BASE18 - Invalid email format when registering account error", async ({ loginPage, registerPage }) => {
    // Click Enter the Name and valid Password and email in the wrong format
    await loginPage.btnCreateAnAccount.click()
    await registerPage.txtName.fill('HN')
    await registerPage.txtEmail.fill('Invalid')
    await registerPage.txtPassword.fill(process.env.PASSWORD!)

    // The warning text “Email is invalid format” will appear below Email textbox and ENTER button is grey and disable
    await expect(registerPage.btnEnter).toBeDisabled()
})

test("BASE19 - Invalid email format and invalid password when registering account error", async ({ loginPage, registerPage }) => {
    // Click Enter the valid Name and invalid Password and email in the wrong format
    await loginPage.btnCreateAnAccount.click()
    await registerPage.txtName.fill('HN')
    await registerPage.txtEmail.fill('Invalid')
    await registerPage.txtPassword.fill('123@')

    // The warning text “Email is invalid format” will appear below Email textbox and ENTER button is grey and disable
    await registerPage.expectText('Email is invalid format')
    await registerPage.expectText('Password must be at least 8 character')

    await expect(registerPage.btnEnter).toBeDisabled()
})

test("BASE20 - Invalid password when registering account error", async ({ loginPage, registerPage }) => {
    await loginPage.btnCreateAnAccount.click()
    await registerPage.txtName.fill('HN')
    await registerPage.txtEmail.fill('valid@mail.com')
    await registerPage.btnEnter.click()
    await registerPage.expectText('This field is required')
    await expect(registerPage.btnEnter).toBeDisabled()

    await registerPage.txtPassword.fill('123@')
    await registerPage.expectText('Password must be at least 8 characters')
    await expect(registerPage.btnEnter).toBeDisabled()

    await registerPage.txtPassword.fill('12345678')
    await registerPage.expectText('Password must contain at least 1 lowercase alphabetical character')
    await expect(registerPage.btnEnter).toBeDisabled()


    await registerPage.txtPassword.fill('12345678a')
    await registerPage.expectText('Password must contain at least 1 lowercase alphabetical character')
    await expect(registerPage.btnEnter).toBeDisabled()

    await registerPage.txtPassword.fill('aa@@AAaa')
    await registerPage.expectText('Password must contain at least 1 numeric character')
    await expect(registerPage.btnEnter).toBeDisabled()

    await registerPage.txtPassword.fill('12345678aA')
    await expect(registerPage.btnEnter).toBeDisabled()
})

test("BASE21 - Verify CANCEL button when creating an account", async ({ loginPage, registerPage }) => {
    // 1.Click on the CREATE AN ACCOUNT
    await loginPage.btnCreateAnAccount.click()

    // 2.Fill in some information.
    await registerPage.txtName.fill('HN')
    await registerPage.txtEmail.fill('valid@mail.com')

    // 3.Click on the CANCEL button
    await registerPage.btnCancel.click()

    // Users will be navigated to the login page
    await registerPage.expectToHaveURL(partialURL.login)
}) 