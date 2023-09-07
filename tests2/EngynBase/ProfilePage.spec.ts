import { test, expect } from "../../fixtures/baseTest"

test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.waitForLoadState('load')
})

test.afterEach(async ({ page }) => {
    await page.close()
})

test("BASE33 - Check the edit function user information in profile page", async ({ page, loginPage, dashBoardPage, profilePage, usersPage }) => {
    const fname = 'Fname:' + Date.now();
    const mname = 'Mname:' + Date.now();
    const lname = 'Lname:' + Date.now();
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PROFILEPAGEEDITPASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.mnuItemAvatar.hover()
    await dashBoardPage.mnuItemProfile.click()

    // 2.Fill your information to the User info tab includes: 
    // 2.1Required fields: First Name & Last Name
    await profilePage.txtFirstName.fill(fname)
    await profilePage.txtLastName.fill(lname)

    // 2.2Selectlist field: Title & Gender

    // 2.3Input field: Middle Name
    await profilePage.txtMiddleName.fill(mname)

    // 3.Click on Save Changes button
    await profilePage.btnSaveChange.click()
    await expect(page.getByText('The profile has been updated successfully')).toBeVisible();
    await profilePage.btnOK.click()

    // 4.Navigate to the Users page
    await page.goto('/profile')
    await page.waitForLoadState('load')

    // 5.Search your mail and check the change information after updating
    // The system will show your latest information after searching
    await expect(page.getByText(fname).first()).toBeVisible();
    await expect(page.getByText(mname).first()).toBeVisible();
    await expect(page.getByText(lname).first()).toBeVisible();

    //check if the name in the left side bar has been changed or not --> NOT APPLICABLE

    //search the information changed in users tabs
    await dashBoardPage.btnArrow.click()
    await dashBoardPage.mnuItemSetting.click()
    await dashBoardPage.mnuItemUsers.click()
    await usersPage.txtSearch.fill(fname)
    await expect(page.getByRole('cell', { name: fname + ' ' + mname + ' ' + lname })).toBeVisible()
})

test("BASE34 - Check the error in editing user information on the profile page", async ({ page, loginPage, dashBoardPage, profilePage }) => {
    const fname = 'Fname:' + Date.now();
    const lname = 'Lname' + Date.now();
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Let the First Name and Last Name fields blank and click on the Save Changes button
    await profilePage.txtFirstName.fill('')
    await profilePage.txtLastName.fill('')
    await expect(page.getByText('This field is required').nth(0)).toBeVisible();
    await expect(page.getByText('This field is required').nth(1)).toBeVisible();
    await expect(profilePage.btnSaveChange).toBeDisabled()

    // 3.Let the First Name field blank and click on the Save Changes button
    await profilePage.txtFirstName.fill('')
    await profilePage.txtLastName.fill(lname)
    await expect(page.getByText('This field is required').first()).toBeVisible();
    await expect(profilePage.btnSaveChange).toBeDisabled()

    // 4.Let the Last Name field blank and click on the Save Changes button
    await profilePage.txtFirstName.fill(fname)
    await profilePage.txtLastName.fill('')
    await expect(page.getByText('This field is required').first()).toBeVisible();
    await expect(profilePage.btnSaveChange).toBeDisabled()
})

test("BASE35 - Check the change password function profile page", async ({ page, loginPage, dashBoardPage, profilePage, commonFunc }) => {
    const newPassword = '87654321aA@'
    await loginPage.login(process.env.INDIVIDUALFORMSUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Click on the Change Password button
    await profilePage.btnChangePassword.click()

    // 3.Fill 3 password textboxes following the password rule: Convention 
    await profilePage.txtCurrentPassword.fill(process.env.PASSWORD!)
    await profilePage.txtNewPassword.fill(newPassword)
    await profilePage.txtConfirmNewPassword.fill(newPassword)

    // 4.Click on the Change button
    await profilePage.btnChange.click()
    await expect(page.getByText('The password has been changed successfully')).toBeVisible();

    // 5.Log out and log in by the new password
    await commonFunc.logOut()
    await loginPage.login(process.env.INDIVIDUALFORMSUSERNAME!, newPassword)

    // Change the old password to serve the login cases with the default password
    await dashBoardPage.gotoProfile()
    await profilePage.btnChangePassword.click()
    await profilePage.txtCurrentPassword.fill(newPassword)
    await profilePage.txtNewPassword.fill('12345678aA@')
    await profilePage.txtConfirmNewPassword.fill('12345678aA@')
    await profilePage.btnChange.click()
    await expect(page.getByText('The password has been changed successfully')).toBeVisible();
})

test("BASE36 - Verify error when leaving information in Change Password Popup blank", async ({ page, loginPage, dashBoardPage, profilePage }) => {
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Click on the Change Password button
    await profilePage.btnChangePassword.click()

    // 3.Let the information blank and click on the CHANGE button
    await profilePage.btnChange.click()

    // The warning text ”Current Password is required”, “New Password is required”  and “New Password Confirm is required” will appear below 3 textboxes
    await expect(page.getByText('Current Password is required')).toBeVisible();
    await expect(page.getByText('New Password is required')).toBeVisible();
    await expect(page.getByText('New Password Confirm is required')).toBeVisible();
})

test("BASE37 - Verify error when Current password field does not follow convention", async ({ page, loginPage, dashBoardPage, profilePage }) => {
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Click on the Change Password button
    await profilePage.btnChangePassword.click()

    // 3.Fill in the Current password fields un-follow the password
    await profilePage.txtCurrentPassword.fill('12345')
    await profilePage.btnChange.click()
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();

    await profilePage.txtCurrentPassword.fill('12345678')
    await profilePage.btnChange.click()
    await expect(page.getByText('Password must contain at least 1 lowercase alphabetical character')).toBeVisible();

    await profilePage.txtCurrentPassword.fill('12345678a')
    await profilePage.btnChange.click()
    await expect(page.getByText('Password must contain at least 1 uppercase alphabetical character')).toBeVisible();

    await profilePage.txtCurrentPassword.fill('12345678aA')
    await profilePage.btnChange.click()
    await expect(page.getByText('Password must contain at least 1 special character')).toBeVisible();
})

test("BASE38 - Verify New Password is the same as Current Password error", async ({ page, loginPage, dashBoardPage, profilePage }) => {
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Click on the Change Password button
    await profilePage.btnChangePassword.click()

    // 3.Fill the Current Password field the same as the New password field
    await profilePage.txtCurrentPassword.fill('12345678aA@')
    await profilePage.txtNewPassword.fill('12345678aA@')
    await profilePage.btnChange.click()

    await expect(page.getByText('New password must be different from old password')).toBeVisible();
})

test("BASE39 - New Password and Confirm New Password are different error", async ({ page, loginPage, dashBoardPage, profilePage }) => {
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 1.Go to the Setting → choose the profile tab
    await dashBoardPage.gotoProfile()

    // 2.Click on the Change Password button
    await profilePage.btnChangePassword.click()

    // 3.Fill the Current Password following the Convention
    await profilePage.txtCurrentPassword.fill('12345678aA@')

    // 4.Fill the new password field differently with the confirm new password field
    await profilePage.txtNewPassword.fill('123456aA@')
    await profilePage.txtConfirmNewPassword.fill('12345aA@')
    await profilePage.btnChange.click()

    await expect(page.getByText('Two new passwords that you enter are inconsistent')).toBeVisible();
})

test("BASE40 - Verify user can use breadcrumbs to navigate back to homepage", async ({ page, loginPage, dashBoardPage }) => {
    // 1.Login the account
    await loginPage.login(process.env.PROFILEPAGEEDITUSERNAME!, process.env.PASSWORD!)

    // 2.Click on the Setting → Profile tab
    await dashBoardPage.gotoProfile()

    // 3.Click on the breadcrumb ‘Home’
    await page.getByRole('link', {name: 'Home'}).click();

    // 4.Observe the page
    await expect(page).toHaveURL(new RegExp('.*dashboard.*'));
})