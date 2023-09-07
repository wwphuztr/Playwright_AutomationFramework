import { CommonPage } from "../../common/CommonPage";
import { formTest as formTestFixture, expect } from "../../fixtures/baseTest"

const formName = {
    form1: 'form1',
    form2: 'form2',
    form3: 'form3',
    form4: 'form4'
}

type CustomPage = {
    // Engyn Base
    navigate: CommonPage
}
const textEntry = 'text' + Date.now();
const numberEntry = Date.now() + 1 + '1';

const formTest = formTestFixture.extend<CustomPage>({
    navigate: async ({ page }, use) => {
        await use(new CommonPage(page));
    },
});

formTest("FORM7 - Verify the save entry draft and self-submit a form in the My Collection tab", async ({ navigate, formsNavigationMenu, formsLibraryPage, sharedCollectionPage, entryDraftsPage, formEntriesPage, dataSetPage }) => {
    // 1.Navigate to Forms
    await navigate.navigateToFormPage(process.env.ADMINFORMSUSERNAME, process.env.PASSWORD!)

    // 2.Click Forms Library
    await formsNavigationMenu.navigateTo('Forms Library')

    // 3.Open the mentioned form
    await formsLibraryPage.clickItem('My Collection', formName.form3)

    // 4.Click Open
    await sharedCollectionPage.btnOpen.click()

    // 5.Fill some fields of the form
    await entryDraftsPage.fillInput('TEXT ENTRY', textEntry)

    // 6.Click Save
    await entryDraftsPage.btnSAVE.click()
    // A notification pop-up ”Save successfully” on the bottom right 
    await entryDraftsPage.verifyPopupSuccessfully("Save")
    // The form is moved to the top of the Recently Viewed Forms tab with the correct time - NOT AUTOMATED
    // A draft of the filling form is presented in Form Entries - NOT AUTOMATED
    // There is no envelop icon on the left side of the draft in the Entry Draft entity - NOT HANDLE

    // 7.Click Form Entries
    await formsNavigationMenu.navigateTo('Form Entries')

    // 8.Click on the draft of the recent form 
    await formEntriesPage.clickItem('Entry Drafts', formName.form3)

    // 9.Fill in the remaining required fields of the form
    await entryDraftsPage.fillInput('NUMBER ENTRY', numberEntry)

    // 10.Click the Revert button
    await entryDraftsPage.btnREVERT.click()
    // The new input data will be clean, and the data on the form will be the same as it was in Step 8.
    expect(await entryDraftsPage.getTheValueInput('TEXT ENTRY')).toEqual(textEntry)
    expect(await entryDraftsPage.getTheValueInput('NUMBER ENTRY')).toEqual('')

    // 11.Repeat step 9
    await entryDraftsPage.fillInput('NUMBER ENTRY', numberEntry.toString())

    // 12.Click Submit
    await entryDraftsPage.btnSUBMIT.click()
    // The pop-up “Submit successfully” appears on the bottom right
    await entryDraftsPage.verifyPopupSuccessfully('Submit')
    // There is no draft of the submitted form present in Form Entries - NOT HANDLE
    // The submitted record should be present in Dataset in the Core
    await dataSetPage.CheckDataInCore('My Collection', formName.form3, textEntry)
    // The formwill move to the top of the Recently Submitted tab with correct time - NOT AUTOMATED
})

formTest.describe.serial('FORM23/FORM56', () => {
    const formNameFolder1 = 'NameFolder No1.' + Date.now()
    const formNameFolder2 = 'NameFolder No2.' + Date.now()

    formTest("FORM23 - Verify the Add Folder function in the My Collection/ Forms Library tab", async ({ navigate, formsNavigationMenu, formsLibraryPage }) => {
        // 1.Navigate to Forms
        await navigate.navigateToFormPage(process.env.ADMINFORMSUSERNAME, process.env.PASSWORD!)

        // 2.Navigate to Forms Library 
        await formsNavigationMenu.navigateTo('Forms Library')

        // 3.Click on the more options icon on the right side of the My Collection tab
        await formsLibraryPage.ellipsisMyCollection.hover()

        // 4.Click Add Folder
        await formsLibraryPage.btnAddFolder('My Collection').click()

        // 5.Fill the name in a Name field
        await formsLibraryPage.AddFolderDialog.txtName.fill(formNameFolder1)

        // 6.Click ADD
        await formsLibraryPage.AddFolderDialog.btnADD.click()
        await formsLibraryPage.expectText(formNameFolder1)

        // 7.Repeat Steps 1 → 6 in the Forms Library tab
        await formsLibraryPage.ellipsisFormsLibrary.hover()
        //await formsLibraryPage.bntAddFolder.click()
        await formsLibraryPage.btnAddFolder('Forms Library').click()
        await formsLibraryPage.AddFolderDialog.txtName.fill(formNameFolder2)
        await formsLibraryPage.AddFolderDialog.btnADD.click()
        await formsLibraryPage.expectText(formNameFolder2)
    })

    formTest("FORM56 - Verify the edit folder name function", async ({ page, navigate, formsNavigationMenu, formsLibraryPage }) => {
        const newformNameFolder = 'NameFolder No3.' + Date.now()

        // 1.Navigate to Forms Library
        await navigate.navigateToFormPage(process.env.ADMINFORMSUSERNAME, process.env.PASSWORD!)
        await formsNavigationMenu.navigateTo('Forms Library')

        // 2.Click the More Options icon in the mentioned folder in the My Collection tab
        await formsLibraryPage.hoverItemListEllipsis('My Collection', formNameFolder1)

        // 3.Click Edit Folder
        await formsLibraryPage.tooltipEditFolder.click()

        // 4.Remove the old name 
        await formsLibraryPage.UpdateFolderDialog.txtName.clear()

        // 5.Enter the new name
        await formsLibraryPage.UpdateFolderDialog.txtName.fill(newformNameFolder)

        // 6.Click Update
        await formsLibraryPage.UpdateFolderDialog.btnUpdate.click()
        // The user will be moved back to the Forms Library page and the folder has updated the new name.
        await formsLibraryPage.verifyItemList('My Collection', newformNameFolder)

        // 7.Repeat steps 2 → 6 to the mentioned folder in the Forms Library tab
        await formsLibraryPage.hoverItemListEllipsis('Forms Library', formNameFolder2)
        await formsLibraryPage.tooltipEditFolder.click()
        await formsLibraryPage.UpdateFolderDialog.txtName.clear()
        await formsLibraryPage.UpdateFolderDialog.txtName.fill(newformNameFolder)
        await formsLibraryPage.UpdateFolderDialog.btnUpdate.click()
        // The user will be moved back to the Forms Library page and the folder has updated the new name.
        await formsLibraryPage.verifyItemList('Forms Library', newformNameFolder)
    })
})

formTest("FORM68 - Verify user can not edit the form in the Library tab with the member role", async ({ navigate, formsNavigationMenu, formsLibraryPage, myCollectionPage }) => {
    // 1.Navigate to Forms
    await navigate.navigateToFormPage(process.env.MEMBERFORMSUSERNAME, process.env.PASSWORD!)

    // 2.Navigate to Forms Library
    await formsNavigationMenu.navigateTo('Forms Library')

    // 3.Click on the Form
    await formsLibraryPage.clickItem('Forms Library', formName.form1)

    // Users can not see the edit function there.
    await expect(myCollectionPage.btnOpen).toBeVisible()
    await expect(myCollectionPage.btnEdit).not.toBeVisible()
})

formTest("FORM69 - Verify user can edit and republish a form in the Forms Library tab", async ({ navigate, formsNavigationMenu, formsLibraryPage, sharedCollectionPage, formDesigner, dataSetPage }) => {
    // 1.Navigate to Forms
    await navigate.navigateToFormPage(process.env.ADMINFORMSUSERNAME, process.env.PASSWORD!)

    async function step2Tostep7() {
        // 2.Navigate to Forms Library
        await formsNavigationMenu.navigateTo('Forms Library')

        // 3.Click on the mentioned form
        await formsLibraryPage.clickItem('Forms Library', formName.form1)

        // 4.Click Edit 
        await sharedCollectionPage.btnEdit.click()

        // 5.Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)
        // Click on controller
        await formDesigner.clickOnController('TEXT ENTRY')
        // Modify IsQueryable checkbox
        await formDesigner.chkIsQueryable.click()
        // Verify auto-save disappear
        await expect(formDesigner.autoSave).toBeAttached()
        await expect(formDesigner.autoSave).not.toBeAttached()

        // 6.Click Publish
        await formDesigner.btnPublish.click()
        // Get the expected version number
        const expectedNumberVersion = await formDesigner.PublishFormDialog.getExpectedVersion()

        // 7.Click Confirm
        await formDesigner.PublishFormDialog.btnCONFIRM.click()
        // The user should be navigated to the preview mode of the form
        await formDesigner.expectToHaveURL('mode=preview')
        // The version should be changed according to the confirmation modal
        await expect(sharedCollectionPage.lblVersion).toHaveText(expectedNumberVersion)
        // The open/Edit button should be enabled
        await expect(sharedCollectionPage.btnEdit).toBeEnabled()
        await expect(sharedCollectionPage.btnOpen).toBeEnabled()
        // The data set of the form can be opened without any issue
        await sharedCollectionPage.goto('/core')
        await dataSetPage.clickItem('Shared Data', formName.form1)
    }
    // Step2 --> Step7
    await step2Tostep7()
    
    // Navigate to Forms
    await formDesigner.goto('/forms')

    // 8.Repeat Step 2 → 7 for 2 more times
    await step2Tostep7()
})

formTest("FORM89 - Verify form deletion in My Collection and Forms Library", async ({ navigate, formsNavigationMenu, formsLibraryPage, sharedCollectionPage, formDesigner, dataSetPage }) => {
    const formName = 'Form No.' + Date.now()
    // Precondition: Have at least 2 forms (1 bookmarked form and 1 normal form) in the My Collection tab and Forms Library tab
    await navigate.createAForm(process.env.ADMINFORMSUSERNAME, 'My Collection', 'My Collection', formName)

    // 1.Login to Engyn and navigate to Form

    // 2.Click on the Forms Library

    // 3.Click on the more options icon which is located at the end of the mentioned form

    // 4.Click Delete

    // 5.Confirm deletion

    // 6.Repeat step 3 → 5 for the bookmarked form

    // 7.Repeat steps 1 → 6 for the form in the Forms Library tab
})

formTest("FORM70 - Verify user can edit and delete a draft form which is in Forms Library tab", async ({ navigate, formsNavigationMenu, formsLibraryPage, sharedCollectionPage, formDesigner, dataSetPage }) => {
    // 1.Navigate to Forms

    // 2.Navigate to Forms Library

    // 3.Click on the mentioned form

    // 4.Click Edit

    // 5.Modify any details of the form (adding form controls, removing form controls, updating form name, updating form description, etc)

    // 6.Click Form Designer

    // 7.Click the first form

    // 8.Click Delete 

    // 9.Click Confirm
})