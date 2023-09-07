import { CommonPage } from "../../common/CommonPage"
import { test as baseTest, expect } from "../../fixtures/baseTest"
import { DashBoardPage } from "../../pageObjects/EngynBase/DashBoardPage"
import { LoginPage } from "../../pageObjects/EngynBase/LoginPage"
import { UsersPage } from "../../pageObjects/EngynBase/UsersPage"
import { Browser } from "@playwright/test"

const test = baseTest.extend({
    inviteUser: async ({ browser }, use) => {
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
    Register: async ({ browser }, use) => {
        const newContext = await browser.newContext();
        const page2 = await newContext.newPage()
        await use(new CommonPage(page2));
        await page2.close()
    }
});

const DataBASE42 = [{
    testName: "BASE42 - Verify admin is able to delete manager in org",
    email: 'Flynk42' + Date.now() + '@mailinator.com',
    role: "Manager",
    title: "Engyn Invitation"
},
{
    testName: "BASE42.1 - Verify admin is able to delete admin in org",
    email: 'Flynk421' + Date.now() + '@mailinator.com',
    role: "Admin",
    title: "Engyn Invitation"
},
{
    testName: "BASE42.2 - Verify admin is able to delete member in org",
    email: 'Flynk421' + Date.now() + '@mailinator.com',
    role: "Member",
    title: "Engyn Invitation"
}]

DataBASE42.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, commonFunc, inviteUser }) => {
        // Precondition: prepare account

        // Invite Manager role
        await inviteUser.inviteUserEndtoEnd(process.env.ADMINDELETEUSERNAMEV1!, data.role, data.title, data.email)

        // 1.Log in to account X → choose X org
        await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

        // 2.Click on the Setting → Users tab
        await dashBoardPage.navigateToUserPage()
        // Search Z account
        await usersPage.txtSearch.fill(data.email)

        // 3.Hover and click on the delete button in the Z row
        await usersPage.btnDelete(data.role, data.email).click()

        // 4.Confirm the deletion
        await usersPage.btnYes.click()
        await usersPage.expectText('The user has been deleted successfully!')
        await usersPage.btnOK.click()
        // Account Y has been deleted from the org.
        await usersPage.verifyUserNotExist(data.email)

        await usersPage.logOut()

        // 5.login the account Z
        await loginPage.login(data.email, process.env.PASSWORD!)

        // 6.Click on the Setting → Users tab
        // Users can not see the org Z
        await expect(dashBoardPage.mnuItemSetting).not.toBeVisible()
        await dashBoardPage.logOut()
    })
})

test("BASE43 - Verify a manager is able to delete a member role", async ({ loginPage, dashBoardPage, usersPage, commonFunc, inviteUser }) => {
    // Precondition: Prepare a member account
    const email = 'Flynk43' + Date.now() + '@mailinator.com';
    const title = 'Engyn Invitation'

    // Invite member account with member role
    await inviteUser.inviteUserEndtoEnd(process.env.ADMINDELETEUSERNAMEV1!, 'Member', title, email)

    // 1.Log in to account X → choose X org
    await loginPage.login(process.env.MANAGERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()
    // Search Y account
    await usersPage.txtSearch.fill(email)

    // 3.Hover and click on the delete button in the Y row
    await usersPage.btnDelete('Member', email).click()

    // 4.Confirm the deletion
    await usersPage.btnYes.click()
    await usersPage.expectText('The user has been deleted successfully!')
    await usersPage.btnOK.click()

    // Account Y has been deleted from the org.
    await usersPage.verifyUserNotExist(email)

    await usersPage.logOut()

    // 5.login the account Y
    await loginPage.login(email, process.env.PASSWORD!)

    // 6.Click on the Setting → Users tab
    // Users can not see the org X
    await expect(dashBoardPage.mnuItemSetting).not.toBeVisible()
    await dashBoardPage.logOut()
})

test("BASE44 - Verify a manager is not able to delete an admin in the org", async ({ loginPage, dashBoardPage, usersPage }) => {
    const email = process.env.ADMINDELETEUSERNAMEV1!

    // 1.Log in to account  X
    await loginPage.login(process.env.MANAGERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()
    // Search Y account
    await usersPage.txtSearch.fill(email)

    // 3.Hover on the delete button in the Y row
    await usersPage.hoverbtnDelete('Admin', email)
    // There is the tooltip: “You don’t have permission to remove this user”
    await usersPage.expectText("You don't have permission to remove this user")
})

test("BASE45 - Verify the manger can not delete another manger in org ", async ({ loginPage, dashBoardPage, usersPage, inviteUser }) => {
    // Precondition: Prepare another manager account
    const email = 'Flynk45' + Date.now() + '@mailinator.com';
    const title = 'Engyn Invitation'
    await inviteUser.inviteUserEndtoEnd(process.env.ADMINDELETEUSERNAMEV1!, 'Manager', title, email)

    // 1.Log in to account  X
    await loginPage.login(process.env.MANAGERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()
    // Search Y account
    await usersPage.txtSearch.fill(email)

    // 3.Hover on the delete button in Y row
    await usersPage.hoverbtnDelete('Manager', email)
    // There is the tooltip: “You don’t have permission to remove this user”
    await usersPage.expectText("You don't have permission to remove this user")
})

test("BASE46 - Verify a member can not delete  any users in org", async ({ loginPage, dashBoardPage, usersPage }) => {
    // 1.Log in to account  X
    await loginPage.login(process.env.MEMBERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()
    // Search Y account
    await usersPage.txtSearch.fill(process.env.MANAGERDELETEUSERNAMEV1!)

    // 3.Hover on the delete button in Y row
    await usersPage.hoverbtnDelete('Manager', process.env.MANAGERDELETEUSERNAMEV1!)

    // There is the tooltip: “You don’t have permission to remove this user”
    await usersPage.expectText("You don't have permission to remove this user")
})

const DataBASE47_49_50 = [{
    testName: "BASE47 - Verify the self-delete function by admin role",
    role: "Admin",
    email: 'Flynk47' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
},
{
    testName: "BASE49 - Verify the self-delete function by manager role",
    role: "Manager",
    email: 'Flynk49' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
},
{
    testName: "BASE50 - Verify the self-delete function by a member role",
    role: "Member",
    email: 'Flynk50' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
}]

DataBASE47_49_50.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, commonFunc, inviteUser }) => {
        // Precondition: Prepare another manager account

        await inviteUser.inviteUserEndtoEnd(process.env.ADMINDELETEUSERNAMEV1!, data.role, data.title, data.email)

        // 1.Log in to the account X
        await loginPage.login(data.email, process.env.PASSWORD!)

        // 2.Click on the Setting → Users tab
        await dashBoardPage.navigateToUserPage()
        // Search X account
        await usersPage.txtSearch.fill(data.email)

        // 3.Hover and click on the delete button in X row
        await usersPage.btnDelete(data.role, data.email).click()

        // 4.Confirm the deletion
        await usersPage.btnYes.click()
        await usersPage.expectText('The user has been deleted successfully!')
        await usersPage.btnOK.click()
        // Account Y has been deleted from the org.
        await expect(dashBoardPage.mnuItemSetting).not.toBeVisible()

        await dashBoardPage.logOut()

        // 5.login the account Y
        await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

        // 6.Click on the Setting → Users tab
        await dashBoardPage.navigateToUserPage()
        // Search X account
        await usersPage.txtSearch.fill(data.email)

        // Users Y can not see the X information
        await usersPage.expectText('No data')
    })
})

test("BASE51 - Verify that a member role can not send the invitation in the Users tab", async ({ loginPage, dashBoardPage, usersPage }) => {
    // 1.login to the account
    await loginPage.login(process.env.MEMBERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting →  Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Validate the INVITE USER button and the Role Invites tab
    await expect(usersPage.btnInviteUser).not.toBeVisible()
})

const DataBase52_55_57 = [{
    testName: "BASE52 - Check the admin’s invitation for the non-existing account",
    role: "Admin",
    email: 'Flynk52' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
},
{
    testName: "BASE55 - Check the manager’s invitation for the non-existing account",
    role: "Manager",
    email: 'Flynk55' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
},
{
    testName: "BASE57 - Check the member’s invitation for the non-existing account by admin",
    role: "Member",
    email: 'Flynk57' + Date.now() + '@mailinator.com',
    title: "Engyn Invitation"
}]

DataBase52_55_57.forEach(data => {
    test(`${data.testName}`, async ({ registerPage, loginPage, dashBoardPage, usersPage, emailPage, Page2 }) => {
        // 1.login the account
        await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

        // 2.Click on the Setting → Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER button
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(data.email)

        // 5.Choose Y role
        await usersPage.chooseRole('Admin', data.role)

        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText("The invitation has been sent.")

        await usersPage.btnOK.click()

        // 7.Navigate to Role Invites
        await usersPage.tabRoleInvites.click()
        // Users can see the email information with an admin role
        await usersPage.verifyRoleInvites(data.role, data.email)

        // 8.Log in to the individual Y mail
        // 9.Open the invitation mail and click the REGISTER
        await emailPage.selectEmail(data.title, data.email)
        const url = await emailPage.getUrlEmail()
        await emailPage.goto(url)

        // 10.Complete the registration form.
        await registerPage.txtName.fill(data.email)
        await registerPage.txtPassword.fill('12345678aA@')
        // 11.Click ENTER
        await registerPage.btnEnter.click()
        // Sometimes, the page will not navigate to HomePage for some reason, so we will check it point is (login)
        await registerPage.expectToHaveURL('login')

        // 12.Go to Setting → Click Users --> Reason we do not continue (Register --> login --> Dashboar --> OK), but sometimes (Register --> login --> X --> FAIL to navigate to Dashboard Page)
        const loginPage2 = new LoginPage(Page2)
        const dashboardPage2 = new DashBoardPage(Page2)
        const userPage2 = new UsersPage(Page2)

        // login to new account
        await loginPage2.login(data.email, process.env.PASSWORD!)
        await dashboardPage2.btnArrow.click()
        await dashboardPage2.mnuItemSetting.click()

        // Verify organization
        await expect(dashboardPage2.mnuItemOrg).toBeVisible()

        // Verify userPage
        await dashboardPage2.mnuItemUsers.click()
        // Search X account
        await userPage2.txtSearch.fill(process.env.ADMINDELETEUSERNAMEV1!)
        await userPage2.expectText(process.env.ADMINDELETEUSERNAMEV1!)
    })
})


const DataBase53_56 = [{
    testName: "BASE53 - Check the admin’s invitation for the existing account",
    role: "Admin",
    email: 'Flynk53' + Date.now() + '@mailinator.com',
    title: "Admin Role Invitation Email"
},
{
    testName: "BASE56 - Check the manager’s invitation for the existing account",
    role: "Manager",
    email: 'Flynk56' + Date.now() + '@mailinator.com',
    title: "Manager Role Invitation Email"
}]

DataBase53_56.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, emailPage, commonFunc, Register }) => {
        // Precondition: Y: an email registered for Engyn account
        const email = await Register.registerPersonalAccount()

        // 1.login to the account
        await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

        // 2.Click on the Setting →  Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(email)

        // 5.Choose the role
        await usersPage.chooseRole('Admin', data.role)

        // 6.Click INVITE 
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText("The invitation has been sent.")
        await usersPage.btnOK.click()

        // 7.Navigate to Role Invites
        await usersPage.tabRoleInvites.click()
        // Users can see the email information with an admin role
        await usersPage.verifyRoleInvites(data.role, email)

        // 8.Log in to the individual Y mail
        // 9.Open the Engyn invitation and click Confirm
        await emailPage.selectEmail(data.title, email)
        const url = await emailPage.getUrlEmail()
        await emailPage.goto(url)
        // New tab will open and display the successful invitation
        await emailPage.expectText("The role invitation has been accepted.")
        await emailPage.btnOK.click()
        await emailPage.btnBackToHome.click()
        await usersPage.logOut()

        // 10.login to the Y account
        await loginPage.login(email, process.env.PASSWORD!)

        // Can see the org in the mini-view org in the left-sidebar 
        await dashBoardPage.changeOrg(data.role)
        await dashBoardPage.btnArrow.click()
        await dashBoardPage.mnuItemSetting.click()
        await expect(dashBoardPage.mnuItemOrg).toBeVisible()

        // and can see all users in this org --> find an account
        await dashBoardPage.mnuItemUsers.click()
        await usersPage.txtSearch.fill(process.env.ADMINDELETEUSERNAMEV1!)
        await usersPage.expectText(process.env.ADMINDELETEUSERNAMEV1!)
    })
})

test("BASE58 - Check the member’s invitation for the non-existing account by manager", async ({ registerPage, loginPage, dashBoardPage, usersPage, emailPage, Page2 }) => {
    const email = 'Flynk58' + Date.now() + '@mailinator.com';
    const role = 'Member'
    const title = 'Engyn Invitation'

    // 1.login the account
    await loginPage.login(process.env.MANAGERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Click on the INVITE USER button
    await usersPage.btnInviteUser.click()

    // 4.Fill Y Mail to the Email box
    await usersPage.txtEmail.fill(email)

    // 5.Choose Y role (manager role)
    await usersPage.chooseRole('Manager', role)

    // 6.Click INVITE
    await usersPage.btnInvite.click()
    // The pop-up confirmation successfully appears
    await usersPage.expectText("The invitation has been sent.")
    await usersPage.btnOK.click()

    // 7.Navigate to Role Invites
    await usersPage.tabRoleInvites.click()
    // Users can see the email information with an admin role
    await usersPage.verifyRoleInvites(role, email)

    // 8.Log in to the individual Y mail
    // 9.Open the invitation mail and click the REGISTER
    await emailPage.selectEmail(title, email)
    const url = await emailPage.getUrlEmail()
    await emailPage.goto(url)

    // 10.Complete the registration form.
    await registerPage.txtName.fill(email)
    await registerPage.txtPassword.fill('12345678aA@')
    // 11.Click ENTER
    await registerPage.btnEnter.click()
    // Sometimes, the page will not navigate to HomePage for some reason, so we will check it point is (login)
    await registerPage.expectToHaveURL('login')

    // 12.Go to Setting → Click Users
    const loginPage2 = new LoginPage(Page2)
    const dashboardPage2 = new DashBoardPage(Page2)
    const userPage2 = new UsersPage(Page2)

    // login to new account
    await loginPage2.login(email, process.env.PASSWORD!)
    await dashboardPage2.btnArrow.click()
    await dashboardPage2.mnuItemSetting.click()

    // Verify organization
    await expect(dashboardPage2.mnuItemOrg).toBeVisible()

    // Verify userPage
    await dashboardPage2.mnuItemUsers.click()
    // Search X account
    await userPage2.txtSearch.fill(process.env.MANAGERDELETEUSERNAMEV1!)
    await userPage2.expectText(process.env.MANAGERDELETEUSERNAMEV1!)
})

const dataBase59_60 = [{
    testName: "BASE59 - Check the member’s invitation for the existing account by admin",
    X: "Admin",
    role: "Member",
    account: process.env.ADMINDELETEUSERNAMEV1!,
    title: "Member Role Invitation Email"
},
{
    testName: "BASE60 - Check the member’s invitation for the existing account by manager",
    X: "Manager",
    role: "Member",
    account: process.env.MANAGERDELETEUSERNAMEV1!,
    title: "Member Role Invitation Email"
}]

dataBase59_60.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, emailPage, commonFunc, Register }) => {
        // Precondition: Y: an email registered for Engyn account
        const email = await Register.registerPersonalAccount()

        // 1.login to the account
        await loginPage.login(data.account, process.env.PASSWORD!)

        // 2.Click on the Setting →  Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(email)

        // 5.Choose the role
        await usersPage.chooseRole(data.X, data.role)

        // 6.Click INVITE 
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText("The invitation has been sent.")
        await usersPage.btnOK.click()

        // 7.Navigate to Role Invites
        await usersPage.tabRoleInvites.click()
        // Users can see the email information with an admin role
        await usersPage.verifyRoleInvites(data.role, email)

        // 8.Log in to the individual Y mail
        // 9.Open the Engyn invitation and click Confirm
        await emailPage.selectEmail(data.title, email)
        const url = await emailPage.getUrlEmail()
        await emailPage.goto(url)
        // New tab will open and display the successful invitation
        await emailPage.expectText("The role invitation has been accepted.")
        await emailPage.btnOK.click()
        await emailPage.btnBackToHome.click()
        await usersPage.logOut()

        // 10.login to the Y account
        await loginPage.login(email, process.env.PASSWORD!)

        // Can see the org in the mini-view org in the left-sidebar 
        await dashBoardPage.changeOrg(data.role)
        await dashBoardPage.btnArrow.click()
        await dashBoardPage.mnuItemSetting.click()
        await expect(dashBoardPage.mnuItemOrg).toBeVisible()

        // and can see all users in this org --> find an account
        await dashBoardPage.mnuItemUsers.click()
        await usersPage.txtSearch.fill(data.account)
        await usersPage.expectText(data.account)
    })
})

test("BASE61 - Check the error when re-accepting the successful role invitation from the admin with the existing users", async ({ loginPage, dashBoardPage, usersPage, emailPage, commonFunc, Register }) => {
    const role = 'Member'
    const title = 'Member Role Invitation Email'

    // Precondition: Y is an email registered for the Engyn account
    const email = await Register.registerPersonalAccount()

    // 1.login to the account
    await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting →  Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Click on the INVITE USER
    await usersPage.btnInviteUser.click()

    // 4.Fill Y Mail to the Email box
    await usersPage.txtEmail.fill(email)

    // 5.Choose Y role
    await usersPage.chooseRole('Admin', role)

    // 6.Click INVITE
    await usersPage.btnInvite.click()
    // The pop-up confirmation successfully appears
    await usersPage.expectText("The invitation has been sent.")
    await usersPage.btnOK.click()

    // 7.Navigate to Role Invites
    await usersPage.tabRoleInvites.click()
    // Users can see the email information with an admin role
    await usersPage.verifyRoleInvites(role, email)

    // 8.Log in to the individual Y mail
    // 9.Open the invitation mail and click CONFIRM
    await emailPage.selectEmail(title, email)
    const url = await emailPage.getUrlEmail()
    await emailPage.goto(url)
    // New tab will open and display the successful invitation
    await emailPage.expectText("The role invitation has been accepted.")
    await emailPage.btnOK.click()
    await emailPage.btnBackToHome.click()
    await usersPage.logOut()

    // 10.Repeat step 8
    // 11.Open the invitation mail and click CONFIRM again
    await loginPage.goto(url)
    // The new tab will appear and have a warning pop-up: “Invitation not found.”
    await loginPage.expectText("Invitation not found.")
    await loginPage.btnOK.click()
})

test("BASE62 - Check the error when re-accepting the successful role invitation from the manger and the existing users(existing users)", async ({ page, loginPage, dashBoardPage, usersPage, emailPage, commonFunc, Register }) => {
    const role = 'Member'
    const title = 'Member Role Invitation Email'

    // Precondition: Y is an email registered for the Engyn account
    const email = await Register.registerPersonalAccount()

    // 1.login to the account
    await loginPage.login(process.env.MANAGERDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting →  Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Click on the INVITE USER
    await usersPage.btnInviteUser.click()

    // 4.Fill Y Mail to the Email box
    await usersPage.txtEmail.fill(email)

    // 5.Choose Y role
    await usersPage.chooseRole('Manager', role)

    // 6.Click INVITE
    await usersPage.btnInvite.click()
    // The pop-up confirmation successfully appears
    await usersPage.expectText("The invitation has been sent.")
    await usersPage.btnOK.click()

    // 7.Navigate to Role Invites
    await usersPage.tabRoleInvites.click()
    // Users can see the email information with an admin role
    await usersPage.verifyRoleInvites(role, email)

    // 8.Log in to the individual Y mail
    // 9.Open the invitation mail and click CONFIRM
    await emailPage.selectEmail(title, email)
    const url = await emailPage.getUrlEmail()
    await emailPage.goto(url)
    // New tab will open and display the successful invitation
    await emailPage.expectText("The role invitation has been accepted.")
    await emailPage.btnOK.click()
    await emailPage.btnBackToHome.click()
    await usersPage.logOut()

    // 10.Repeat step 8
    // 11.Open the invitation mail and click CONFIRM again
    await emailPage.goto(url)
    // The new tab will appear and have a warning pop-up: “Invitation not found.”
    await expect(page.getByText('Invitation not found.')).toBeVisible()
    await loginPage.btnOK.click()
})

test("BASE63 - Check the role invitation for a user with 2 different roles", async ({ page, loginPage, dashBoardPage, usersPage, Register }) => {
    // Precondition: Y: an email registered for Engyn account
    const email = await Register.registerPersonalAccount()

    // 1.login to the account X
    await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.lick on the Setting →  Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Click on the INVITE USER
    await usersPage.btnInviteUser.click()

    // 4.Fill Y Mail to the Email box
    await usersPage.txtEmail.fill(email)

    // 5.Choose Y role 
    await usersPage.chooseRole('Admin', 'Manager')

    // 6.Click INVITE
    await usersPage.btnInvite.click()
    // The pop-up confirmation successfully appears
    await usersPage.expectText("The invitation has been sent.")
    await usersPage.btnOK.click()

    // 7.Navigate to Role Invites
    await usersPage.tabRoleInvites.click()
    // Users can see the email information with an admin role
    await usersPage.verifyRoleInvites('Manager', email)

    // 8.Repeat step 4 to 7 for another role
    await page.goto('/dashboard', { waitUntil: 'load' })
    await dashBoardPage.navigateToUserPage()
    await usersPage.btnInviteUser.click()
    await usersPage.txtEmail.fill(email)
    await usersPage.chooseRole('Admin', 'Member')
    await usersPage.btnInvite.click()
    await usersPage.expectText("The invitation has been sent.")
    await usersPage.btnOK.click()
    await usersPage.tabRoleInvites.click()
    await usersPage.verifyRoleInvites('Manager', email)
})

const DataBase64_66 = [{
    testName: "BASE64 - Verify warning when inviting a user with the same role from admin account(existing users)",
    AccountX: process.env.ADMINDELETEUSERNAMEV1!,
    roleAccountX: 'Admin'
},
{
    testName: "BASE66 - Verify warning when inviting a user with the same role from the manager account (existing users)",
    AccountX: process.env.MANAGERDELETEUSERNAMEV1!,
    roleAccountX: 'Manager'
}]

DataBase64_66.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, emailPage, commonFunc, Register }) => {
        const title = 'Member Role Invitation Email'
        const email = await Register.registerPersonalAccount()

        // 1.login to the account X
        await loginPage.login(data.AccountX, process.env.PASSWORD!)

        // 2.Click on the Setting →  Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(email)

        // 5.Choose Y role 
        await usersPage.chooseRole(data.roleAccountX, 'Member')

        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText('The invitation has been sent.')
        await usersPage.btnOK.click()

        // 7.login the Y individual mail 
        // 8.Click on the CONFIRM button
        await emailPage.selectEmail(title, email)
        const url = await emailPage.getUrlEmail()
        await emailPage.goto(url)
        await emailPage.expectText("The role invitation has been accepted.")
        await usersPage.logOut()

        // 9.login to the X account and go to the User tab
        await loginPage.login(data.AccountX, process.env.PASSWORD!)
        await dashBoardPage.navigateToUserPage()

        // 10.Repeat step 3 → step 6 (keep the same role)
        await usersPage.btnInviteUser.click()
        await usersPage.txtEmail.fill(email)
        await usersPage.chooseRole(data.roleAccountX, 'Member')
        await usersPage.btnInvite.click()
        // The pop-up “Invalid Operation: Receiver already has Role Organisation Admin in organization with Id.” appears
        await usersPage.expectText("Invalid Operation: Receiver already has Role Organisation")
    })
})

const DataBase65_67 = [{
    testName: "BASE65 - Verify warning when inviting a user with the same role from admin account(non-existing users)",
    AccountX: process.env.ADMINDELETEUSERNAMEV1!,
    email: 'Flynk65' + Date.now() + '@mailinator.com',
    roleAccountX: 'Admin'
},
{
    testName: "BASE67 - Verify warning when inviting a user with the same role from the manager account(non-existing users)",
    AccountX: process.env.MANAGERDELETEUSERNAMEV1!,
    email: 'Flynk67' + Date.now() + '@mailinator.com',
    roleAccountX: 'Manager'
}]

DataBase65_67.forEach(data => {
    test(`${data.testName}`, async ({ registerPage, loginPage, dashBoardPage, usersPage, emailPage, commonFunc }) => {
        const title = 'Engyn Invitation'

        // 1.login to the account
        await loginPage.login(data.AccountX, process.env.PASSWORD!)

        // 2.Click on the Setting →  Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(data.email)

        // 5.Choose Y role 
        await usersPage.chooseRole(data.roleAccountX, 'Member')

        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText('The invitation has been sent.')
        await usersPage.btnOK.click()

        // 7.login to the Y individual mail
        // 8.Click on the REGISTER button
        await emailPage.selectEmail(title, data.email)
        const url = await emailPage.getUrlEmail()
        await emailPage.goto(url)

        // 9.Fill the registered form following Convention 
        await registerPage.txtName.fill(data.email)
        await registerPage.txtPassword.fill(process.env.PASSWORD!)
        await registerPage.btnEnter.click()
        await registerPage.logOut()

        // 10.login to the X account and go to the User tab
        await loginPage.login(data.AccountX, process.env.PASSWORD!)
        await dashBoardPage.navigateToUserPage()

        // 11.Repeat step 3 → step 6 (keep the same role)
        await usersPage.btnInviteUser.click()
        await usersPage.txtEmail.fill(data.email)
        await usersPage.chooseRole(data.roleAccountX, 'Member')
        await usersPage.btnInvite.click()
        // The pop-up “Invalid Operation: Receiver already has Role Organisation Admin in organization with Id.” appears
        await usersPage.expectText("Invalid Operation: Receiver already has Role Organisation")
    })
})

const DataBase68_69 = [{
    testName: "BASE68 - Check the delete role invitation function from admin account",
    AccountX: process.env.ADMINDELETEUSERNAMEV1!,
    email: 'Flynk68' + Date.now() + '@mailinator.com',
    roleAccountX: 'Admin'
},
{
    testName: "BASE69 - Check the delete role invitation  from manager account",
    AccountX: process.env.MANAGERDELETEUSERNAMEV1!,
    email: 'Flynk69' + Date.now() + '@mailinator.com',
    roleAccountX: 'Manager'
}]

DataBase68_69.forEach(data => {
    test(`${data.testName}`, async ({ loginPage, dashBoardPage, usersPage, emailPage }) => {
        // 1.login the account
        await loginPage.login(data.AccountX, process.env.PASSWORD!)

        // 2.Click on the Setting →  Users tab
        await dashBoardPage.navigateToUserPage()

        // 3.Click on the INVITE USER
        await usersPage.btnInviteUser.click()

        // 4.Fill Y Mail to the Email box
        await usersPage.txtEmail.fill(data.email)

        // 5.Choose Y role 
        await usersPage.chooseRole(data.roleAccountX, 'Member')

        // 6.Click INVITE
        await usersPage.btnInvite.click()
        // The pop-up confirmation successfully appears
        await usersPage.expectText('The invitation has been sent.')
        await usersPage.btnOK.click()

        // 7.Move to the ROLE INVITE tab and click DELETE
        await usersPage.tabRoleInvites.click()
        await usersPage.btnDelete('Member', data.email).click()
        // The pop-up “Are you sure you want to cancel the invitation?” appears
        await usersPage.expectText("Are you sure you want to cancel the invitation?")

        // 8.Click on YES button
        await usersPage.btnYes.click()
        // The pop-up “The invitation has been canceled” appears
        await usersPage.expectText("The invitation has been canceled")

        // 9.Log in on the invited mail
        // 10.Open the mail and click CONFIRM
        await emailPage.selectEmailAndConfirm('Engyn Invitation', data.email)

        // A new tab will open and show the pop-up “Invitation not found.
        await emailPage.expectText("Denied: Invitation was cancelled.")
    })
})

test("BASE70 - Check the breadcrumb in the users tab", async ({ loginPage, dashBoardPage, usersPage }) => {
    // 1.login the account
    await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()
    // Users will navigate to the User page
    await dashBoardPage.expectToHaveURL('members')

    // 3.Click on the breadcrumb Home
    await usersPage.lnkHome.click()

    // 4.Observe the page
    await usersPage.expectToHaveURL('dashboard')
})

test("BASE71 - Check the search function in the user tab", async ({ page, loginPage, dashBoardPage, usersPage }) => {
    // Precondition: Y the random email that is not in the org
    const email = 'Flynk71' + Date.now() + '@mailinator.com'

    // 1.login to the account 
    await loginPage.login(process.env.ADMINDELETEUSERNAMEV1!, process.env.PASSWORD!)

    // 2.Click on the Setting → Users tab
    await dashBoardPage.navigateToUserPage()

    // 3.Click on the Search bar
    await usersPage.txtSearch.click()

    // 4.Fill in the name of X
    await usersPage.txtSearch.fill("Manager")
    // The system will show the X information which includes: Name, Emails, Role, Status, and Action columns --> Verify there is a delete button of this account
    await expect(usersPage.btnDelete('Manager', process.env.MANAGERDELETEUSERNAMEV1!)).toBeVisible()

    // 5.Delete X the Search bar
    await usersPage.txtSearch.clear()

    // 6.Fill the email of X
    await usersPage.txtSearch.fill(process.env.MANAGERDELETEUSERNAMEV1!)
    // The system will show the X information which includes: Name, Emails, Role, Status, and Action columns --> Verify there is a delete button of this account
    await expect(usersPage.btnDelete('Manager', process.env.MANAGERDELETEUSERNAMEV1!)).toBeVisible()

    // 7.Delete X from the Search bar
    await usersPage.txtSearch.clear()

    // 8.Fill the Y to the Search bar
    await usersPage.txtSearch.fill(email)
    // The system show the blank list with the announcement “No data”
    await usersPage.expectText("No data")
})


