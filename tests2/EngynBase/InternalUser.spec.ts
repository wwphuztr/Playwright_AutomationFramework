import { partialURL } from "../../Environments/configVariables";
import { CommonPage } from "../../common/CommonPage";
import { test as baseTest, expect } from "../../fixtures/baseTest"
import { LoginPage } from "../../pageObjects/EngynBase/LoginPage";

const title = 'Engyn Base Dev Local Invitation Email'

const test = baseTest.extend({
    Register: async ({ browser }, use) => {
        const newContext = await browser.newContext();
        const page2 = await newContext.newPage()
        await use(new CommonPage(page2));
        await page2.close()
    },
    Page2: async ({ browser }, use) => {
        const newContext = await browser.newContext();
        const page2 = await newContext.newPage()
        await use(page2);
        await page2.close()
    },
});

test("BASE72 - Check the successful org invitation by an internal user for existing account", async ({ Register, loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage }) => {
    // Precondition: existing account
    const email = await Register.registerPersonalAccount()
    const orgName = 'auto-org72' + Date.now() + process.env.MAIL
    const domainName = 'https://auto72' + Date.now() + '.com'

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out the information and click the INVITE button
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()

    // 5.Check the invited individual mail
    // 6.Click on CONFIRM button
    await emailPage.selectEmailAndConfirm(title, email)

    // 7.Check and edit the information in the registration form 
    await expect(creatOrganiztionPage.txtFirstName).toHaveValue(email)
    await expect(creatOrganiztionPage.txtCompanyName).toHaveValue(orgName)
    await expect(creatOrganiztionPage.txtDisplayName).toHaveValue(orgName)
    await expect(creatOrganiztionPage.txtDomainName).toHaveValue(domainName)

    // 8.Click SUBMIT button
    await creatOrganiztionPage.btnSubmit.click()
    await creatOrganiztionPage.expectText("The invitation has been accepted.")
    await creatOrganiztionPage.btnOK.click()
    // 
})

test.describe.serial('BASE73 BASE81', () => {
    const email = 'auto73' + Date.now() + process.env.MAIL
    const orgName = 'auto-org73' + Date.now() + process.env.MAIL
    const domainName = 'https://auto73' + Date.now() + '.com'

    test("BASE73 - Check the successful org invitation by an internal user for non-existing account", async ({ loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage }) => {
        // 1.Login as an Internal User account 
        await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

        // 2.Click Organizations
        await dashBoardPage.mnuItemOrg.click()

        // 3.Click the INVITE ORGANIZATION button
        await organizationPage.btnInviteOrganization.click()

        // 4.Fill out the information and click the INVITE button
        await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
        await organizationPage.btnInvite.click()

        //Have the pop-up “The invitation has been sent.” after clicking the INVITE button
        await organizationPage.expectText("The invitation has been sent.")

        // 5.Check the invited individual mail
        // 6.Click on CONFIRM button
        await emailPage.selectEmailAndConfirm(title, email)

        // 7.Check and edit the information in the registration form 
        await creatOrganiztionPage.validateInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')

        // Fill password and confirm password
        await creatOrganiztionPage.txtPassword.fill(process.env.PASSWORD!)
        await creatOrganiztionPage.txtConfirm.fill(process.env.PASSWORD!)

        // 8.Click SUBMIT button
        await creatOrganiztionPage.btnSubmit.click()
        await creatOrganiztionPage.expectText("The invitation has been accepted.")
        await creatOrganiztionPage.btnOK.click()

        // Users will be moved to the Home page.
        await creatOrganiztionPage.expectToHaveURL(partialURL.dashboard)
    })

    test("BASE81 - Check the search function in the Organizations", async ({ loginPage, dashBoardPage, organizationPage }) => {
        // 1.Login as an Internal User account 
        await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

        // 2.Click Organizations
        await dashBoardPage.mnuItemOrg.click()

        // 3.Fill the Name of the available org to the search bar
        await organizationPage.txtSearch.fill(orgName)
        // The org matches the Name with the search bar will appear in the list 
        // getByRole('cell', { name: 'DataFlynkOrg' })
        await organizationPage.expectOrgName(orgName)

        // 4.Click on the org
        await organizationPage.clickOrgName(orgName)
        // Users will move to the Org information page and only able to view the org information
        await organizationPage.expectText(domainName)
    })
});

test("BASE74 - Check the error of the org invitation by the internal user (Organisation page)", async ({ loginPage, dashBoardPage, organizationPage }) => {
    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Let the blank information and click INVITE
    await organizationPage.btnInvite.click()
    // Verify the warning
    await organizationPage.expectText("Title is required!")
    await organizationPage.expectText("First Name is required!")
    await organizationPage.expectText("Last Name is required!")
    await organizationPage.expectText("This field is required")
    await organizationPage.expectText("Company Name is required!")
    await organizationPage.expectText("Display Name is required!")

    // 5.Let the invalid information in the Email and Domain Name fields
    await organizationPage.txtEmail.fill('fwefwef')
    await organizationPage.txtDomainName.fill('https://dwqdwe')
    await organizationPage.btnInvite.click()
    // Verify warnings
    await organizationPage.expectText("URL format is invalid")
    await organizationPage.expectText("Email is invalid format")
})

test("BASE75 - Check the error using the Org name the same as the available one.(Organisation page)", async ({ loginPage, dashBoardPage, organizationPage }) => {
    const orgName = 'auto-org75' + Date.now() + process.env.MAIL
    const domainName = 'https://auto72' + Date.now() + '.com'
    const email = 'email75' + Date.now() + process.env.MAIL

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out the information in the User Info: 
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')
    await organizationPage.btnOK.click()

    // 5.Fill Company Name/ Display Name (optional) the same as the available one
    await organizationPage.btnInviteOrganization.click()
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    // Will have a pop-up: “Invalid Argument: Organisation with Formal Name (available name) already exists” after clicking the INVITE button
    await organizationPage.expectText('Invalid Request: Invitation with the Company Name')
})

test("BASE76.1 - Check the error in the new org registration Form. (non-existing)", async ({ loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage }) => {
    const orgName = 'auto-org761' + Date.now() + process.env.MAIL
    const domainName = 'https://auto761' + Date.now() + '.com'
    const email = 'email761' + Date.now() + process.env.MAIL

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()
    // Navigating email and click confirm 
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')
    await emailPage.selectEmailAndConfirm(title, email)

    // 4.Fill out the invalid data in Domain Name, Password, and Confirm Password
    await creatOrganiztionPage.txtDomainName.clear()
    await creatOrganiztionPage.txtDomainName.fill('https://jhjhjh')

    // 5.Click on Submit button
    await creatOrganiztionPage.btnSubmit.click()

    // The warning will display below the Domain Name, Password, and Confirm Password textboxes: 
    // * URL format is invalid
    await creatOrganiztionPage.expectText('URL format is invalid')
    // * Password is required
    await creatOrganiztionPage.expectText('Password is required')
    // * Password confirm is required
    await creatOrganiztionPage.expectText('Password confirm is required')
})

test("BASE76.2 - Check the error in the new org registration Form. (existing users)", async ({ loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage, Register }) => {
    const orgName = 'auto-org762' + Date.now() + process.env.MAIL
    const domainName = 'https://auto762' + Date.now() + '.com'
    const email = await Register.registerPersonalAccount()

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()
    // Navigating email and click confirm 
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')
    await emailPage.selectEmailAndConfirm(title, email)

    // 4.Fill out the invalid data in Domain Name, Password, and Confirm Password
    await creatOrganiztionPage.txtDomainName.clear()
    await creatOrganiztionPage.txtDomainName.fill('https://jhjhjh')

    // 5.Click on Submit button
    await creatOrganiztionPage.btnSubmit.click()

    // 	The exist users are not able to edit the password and Confirm Password
    await expect(creatOrganiztionPage.txtPassword).not.toBeVisible()
    await expect(creatOrganiztionPage.txtConfirm).not.toBeVisible()

    // The warning will display below the Domain Name, Password, and Confirm Password textboxes: 
    // * URL format is invalid
    await creatOrganiztionPage.expectText('URL format is invalid')
})

test("BASE77 - Check the re-registration error after successfully registering a new org ", async ({ loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage }) => {
    const orgName = 'auto-org77' + Date.now() + process.env.MAIL
    const domainName = 'https://auto77' + Date.now() + '.com'
    const email = 'email77' + Date.now() + process.env.MAIL
    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out the information and click the INVITE button
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')

    // 5.Check the invited individual mail
    // 6.Click on the REGISTER button
    await emailPage.selectEmail(title, email)
    const registerLnk = await emailPage.getUrlEmail()
    await emailPage.goto(registerLnk)

    // 7.Check and edit the information in the registration form 
    await creatOrganiztionPage.validateInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await creatOrganiztionPage.txtPassword.fill(process.env.PASSWORD!)
    await creatOrganiztionPage.txtConfirm.fill(process.env.PASSWORD!)


    // 8.Click SUBMIT button
    await creatOrganiztionPage.btnSubmit.click()
    await creatOrganiztionPage.expectText('The invitation has been accepted.')

    // 9.Go to the invited individual mail and open the Engyn registration mail
    await emailPage.goto(registerLnk)
    await emailPage.expectText('Denied: Invitation was completed.')
})

test("BASE78 - Delete the org invitation by the internal user", async ({ loginPage, dashBoardPage, organizationPage, emailPage }) => {
    const orgName = 'auto-org78' + Date.now() + process.env.MAIL
    const domainName = 'https://auto78' + Date.now() + '.com'
    const email = 'email78' + Date.now() + process.env.MAIL

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out the information and click the INVITE button
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')
    await organizationPage.btnOK.click()

    // 5.Move to the Organization Invites
    await organizationPage.tabOrganizationInvites.click()
    // Can see the invitation in the Organizations Invites with the re-send and delete button
    await organizationPage.validateOrgInvitation(email, 'attach')

    // 6.Click on the delete button
    await organizationPage.btnDelete(email).click()
    await organizationPage.btnYes.click()
    // Have the delete confirmation pop-up “The invitation has been canceled.” after clicking YES and the invitation disappears
    await organizationPage.expectText('The invitation has been cancelled.')
    await organizationPage.btnOK.click()
    await organizationPage.validateOrgInvitation(email, 'detach')

    // 7.Check the invited individual mail
    // 8.Click on the REGISTER button
    await emailPage.selectEmailAndConfirm(title, email)
    // The new tab will open and show the warning “Denied: Invitation has been archived.”
    await emailPage.expectText('Denied: Invitation has been archived.')
})

test("BASE79 - Re-send the org invitation by the internal user", async ({ loginPage, dashBoardPage, organizationPage, emailPage, creatOrganiztionPage, Page2 }) => {
    const orgName = 'auto-org79' + Date.now() + process.env.MAIL
    const domainName = 'https://auto79' + Date.now() + '.com'
    const email = 'email79' + Date.now() + process.env.MAIL

    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out the information and click the INVITE button
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')
    await organizationPage.btnInvite.click()
    await organizationPage.expectText('The invitation has been sent.')

    // 5.Check the invited individual mail
    await emailPage.selectEmail(title, email)

    // 6.login to the Internal User account again and move to the  Organization Invites
    await loginPage.goto('/login')
    await dashBoardPage.mnuItemOrg.click()
    await organizationPage.tabOrganizationInvites.click()

    // 7.Click on the resend button
    await organizationPage.btnResend(email).click()

    // 8.Check the invited individual mail
    await organizationPage.btnYes.click()
    // Have the confirmation pop-up “The invitation has been resent.” after clicking YES and the invitation remains unchanged
    await organizationPage.expectText('The invitation has been resent.')

    // There are 2 mails invitations in the invited individual mail
    await emailPage.verifyTheResendEmail(title, email)
    // 9.Open the invited mail and register the account
    await emailPage.selectEmailAndConfirm(title, email)

    await creatOrganiztionPage.txtPassword.fill(process.env.PASSWORD!)
    await creatOrganiztionPage.txtConfirm.fill(process.env.PASSWORD!)
    await creatOrganiztionPage.btnSubmit.click()
    await creatOrganiztionPage.expectText('The invitation has been accepted.')
    await creatOrganiztionPage.btnOK.click()

    // 10.Login Engyn by new registered account
    const loginPage2 = new LoginPage(Page2)
    await loginPage2.login(email, process.env.PASSWORD!)
})

test("BASE80 - Check the CANCEL function of the invite org by the internal users", async ({ loginPage, dashBoardPage, organizationPage }) => {
    const orgName = 'auto-org80' + Date.now() + process.env.MAIL
    const domainName = 'https://auto80' + Date.now() + '.com'
    const email = 'email80' + Date.now() + process.env.MAIL

    // 1.Login as an Internal User account
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Fill out some information 
    await organizationPage.fillInformation('Mr', email, orgName, domainName, 'auto', 'auto', 'auto')

    // 5.Click the CANCEL button
    await organizationPage.btnCancel.click()
    // The users will be navigated to the Organizations page.
    await organizationPage.expectToHaveURL(partialURL.organisations)
})

test("BASE82 - Check the breadcrumb on organization page", async ({ loginPage, dashBoardPage, organizationPage }) => {
    // 1.Login as an Internal User account 
    await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)

    // 2.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 3.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 4.Click the breadcrumb Home
    await organizationPage.lnkHome.click()
    // Users will be navigated to the Home Page
    await organizationPage.expectToHaveURL(partialURL.dashboard)

    // 5.Click Organizations
    await dashBoardPage.mnuItemOrg.click()

    // 6.Click the INVITE ORGANIZATION button
    await organizationPage.btnInviteOrganization.click()

    // 7.Click the breadcrumb Organization
    await organizationPage.lnkOrganizations.click()
    // Users will be navigated to the Organization Page
    await expect(organizationPage.btnInviteOrganization).toBeVisible()

    // 8.Click the breadcrumb Home
    await organizationPage.lnkHome.click()
    // The user will be navigated to the Home Page
    await organizationPage.expectToHaveURL(partialURL.dashboard)
})

const DataBASE83_85 = [{
    testName: "BASE83 - Verify the Dev Support invitation for the existing account from the internal account",
    title : 'Dev Support Role Invitation Email',
    role: "Dev Support",
},
{
    testName: "BASE85 - Verify the Tech Support invitation for an exsiting account from the internal account",
    title : 'Tech Support Role Invitation Email',
    role: "Tech Support",
},
]

DataBASE83_85.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, Register, usersPage, emailPage, commonFunc }) => {
        // Precondition: Have an available Engyn account 
        const email = await Register.registerPersonalAccount()
    
        // 1.Login as an Internal User account 
        await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)
    
        // 2.Click Setting → Users
        await dashBoardPage.navigateToUserPage()
    
        // 3.Click the INVITE USER button
        await usersPage.btnInviteUser.click()
    
        // 4.Fill the email of the mentioned account to the Email’s box
        await usersPage.txtEmail.fill(email)
    
        // 5.Choose the Role → Dev Support 
        await usersPage.cboRole.click()
        // There are 2 selections: Dev Support/Tech Support
        await usersPage.expectTitle('Dev Support')
        await usersPage.expectTitle('Tech Support')
    
        await usersPage.role(data.role).click()
    
        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText('The invitation has been sent.')
        await usersPage.btnOK.click()
    
        // 7.Navigate to Role Invites
        await usersPage.tabRoleInvites.click()
        // Can see the fullname and the email with a Dev support role
        await usersPage.verifyRoleInvites(data.role, email)
    
        // 8.Log in to the invited individual mail
        // 9.Open the Engyn invitation and click Confirm
        await emailPage.selectEmailAndConfirm(data.title, email)
        // display the successful invitation
        await emailPage.expectText('The role invitation has been accepted.')
        await emailPage.btnOK.click()
    
        // 10.Login to the invited account
        await commonFunc.logOut()
        await loginPage.login(email, process.env.PASSWORD!)
        await dashBoardPage.changeOrg(data.role)
    
        // Can see the org in the mini-view org in the left-sidebar and can see all users in this org
        await dashBoardPage.btnArrow.click()
        await dashBoardPage.mnuItemSetting.click()
        await dashBoardPage.mnuItemUsers.click()
    
        await usersPage.txtSearch.fill(process.env.PLATFORMADMINUSERNAME!)
        await expect(usersPage.btnDelete('System Admin', process.env.PLATFORMADMINUSERNAME!)).toBeVisible()
    })
})

const DataBASE84_86 = [{
    testName: "BASE84 - Verify the Dev Support invitation for the non-exsiting account from the internal account",
    email: 'Flynk84' + Date.now() + process.env.MAIL,
    role: "Dev Support",
},
{
    testName: "BASE86 - Verify the Tech Support invitation for the non-exsiting account from the internal account",
    email: 'Flynk86' + Date.now() + process.env.MAIL,
    role: "Tech Support",
},
]

DataBASE84_86.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, registerPage, usersPage, emailPage, commonFunc }) => {
        const title = 'Engyn Invitation'

        // 1.Login the account
        await loginPage.login(process.env.PLATFORMADMINUSERNAME!, process.env.PASSWORD!)
    
        // 2.Click Setting → Users
        await dashBoardPage.navigateToUserPage()
    
        // 3.Click the INVITE USER button
        await usersPage.btnInviteUser.click()
    
        // 4.Fill the email of the mentioned account to the Email’s box
        await usersPage.txtEmail.fill(data.email)
    
        // 5.Choose the Role → (Dev Support/Tech Support)
        await usersPage.cboRole.click()
        // There are 2 selections: Dev Support/Tech Support
        await usersPage.expectTitle('Dev Support')
        await usersPage.expectTitle('Tech Support')
    
        await usersPage.role(data.role).click()
    
        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText('The invitation has been sent.')
        await usersPage.btnOK.click()
    
        // 7.Navigate to Role Invites
        await usersPage.tabRoleInvites.click()
        // Can see the fullname and the email with a Dev support role
        await usersPage.verifyRoleInvites(data.role, data.email)
    
        // 8.Log in to the invited individual mail
        // 9.Open the Engyn invitation and click Confirm
        await emailPage.selectEmailAndConfirm(title, data.email)

        // 10.Complete the registration form.
        await registerPage.txtName.fill(data.email)
        await registerPage.txtPassword.fill(process.env.PASSWORD!)

        // 11.Complete the registration form.
        await registerPage.btnEnter.click()
        // Users will be navigated to the Home Page
        await registerPage.expectToHaveURL(partialURL.dashboard)

        // 12. Go to Setting → Click Users
        await dashBoardPage.btnArrow.click()
        await dashBoardPage.mnuItemSetting.click()
        await dashBoardPage.mnuItemUsers.click()
        
        // Can see the org in the mini-view org in the left-sidebar and can see all users in this org
        await usersPage.txtSearch.fill(process.env.PLATFORMADMINUSERNAME!)
        await expect(usersPage.btnDelete('System Admin', process.env.PLATFORMADMINUSERNAME!)).toBeVisible()
    })
})
