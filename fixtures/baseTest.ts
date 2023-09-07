import { Page, test as baseTest } from "@playwright/test";
import { LoginPage } from "../pageObjects/EngynBase/LoginPage";
import { CommonPage } from "../common/CommonPage";
import { ForgotPasswordPage } from "../pageObjects/EngynBase/ForgotPasswordPage";
import { EmailPage } from "../pageObjects/EngynBase/EmailPage";
import { ResetPasswordPage } from "../pageObjects/EngynBase/ResetPasswordPage";
import { DashBoardPage } from "../pageObjects/EngynBase/DashBoardPage";
import { ProfilePage } from "../pageObjects/EngynBase/ProfilePage";
import { RegisterPage } from "../pageObjects/EngynBase/RegisterPage";
import { OrganizationPage } from "../pageObjects/EngynBase/OrganizationPage";
import { UsersPage } from "../pageObjects/EngynBase/UsersPage";
import { CreatOrganiztionPage } from "../pageObjects/EngynBase/CreatOrganiztionPage";
import { FormsNavigationMenu } from "../pageObjects/EngynForm/FormsNavigationMenu";
import { FormsLibraryPage } from "../pageObjects/EngynForm/FormLibrary/FormsLibraryPage";
import { MyCollectionPage } from "../pageObjects/EngynForm/FormLibrary/MyCollectionPage";
import { SharedCollectionPage } from "../pageObjects/EngynForm/FormLibrary/SharedCollectionPage";
import { Designer_FormsDesignerPage } from "../pageObjects/EngynForm/FormsDesigner/Designer_FormsDesignerPage";
import { DataSetPage } from "../pageObjects/EngynCore/DataSetPage";
import { EntryDraftsPage } from "../pageObjects/EngynForm/FormEntries/EntryDraftsPage";
import { FormEntriesPage } from "../pageObjects/EngynForm/FormEntries/FormEntriesPage";

// Declare the types of your fixtures.
type PageObjects = {
    // Engyn Base
    loginPage: LoginPage,
    forgotPasswordPage: ForgotPasswordPage,
    emailPage: EmailPage,
    resetPasswordPage: ResetPasswordPage,
    dashBoardPage: DashBoardPage,
    profilePage: ProfilePage,
    registerPage: RegisterPage,
    organizationPage: OrganizationPage,
    usersPage: UsersPage,
    commonFunc : CommonPage
    creatOrganiztionPage: CreatOrganiztionPage

    // Engyn Forms
    formsNavigationMenu: FormsNavigationMenu
    formsLibraryPage: FormsLibraryPage
    formEntriesPage: FormEntriesPage
    myCollectionPage: MyCollectionPage
    sharedCollectionPage: SharedCollectionPage
    formDesigner: Designer_FormsDesignerPage
    entryDraftsPage: EntryDraftsPage
    dataSetPage: DataSetPage
}

// intializing all the page objects you have in your app
// and import them as fixture in spec file
export const test = baseTest.extend<PageObjects>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    forgotPasswordPage: async ({ page }, use) => {
        await use(new ForgotPasswordPage(page));
    },
    emailPage: async ({ page }, use) => {
        await use(new EmailPage(page));
    },
    resetPasswordPage: async ({ page }, use) => {
        await use(new ResetPasswordPage(page));
    },
    dashBoardPage: async ({ page }, use) => {
        await use(new DashBoardPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    organizationPage: async ({ page }, use) => {
        await use(new OrganizationPage(page));
    },
    usersPage: async ({ page }, use) => {
        await use(new UsersPage(page));
    },
    creatOrganiztionPage: async ({ page }, use) => {
        await use(new CreatOrganiztionPage(page));
    },
    commonFunc: async ({ page }, use) => {
        await use(new CommonPage(page));
    },
});

export const formTest = baseTest.extend<PageObjects>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    formsNavigationMenu: async ({ page }, use) => {
        await use(new FormsNavigationMenu(page));
    },
    formsLibraryPage: async ({ page }, use) => {
        await use(new FormsLibraryPage(page));
    },
    myCollectionPage: async ({ page }, use) => {
        await use(new MyCollectionPage(page));
    },
    sharedCollectionPage: async ({ page }, use) => {
        await use(new SharedCollectionPage(page));
    },
    formDesigner: async ({ page }, use) => {
        await use(new Designer_FormsDesignerPage(page));
    },
    dataSetPage: async ({ page }, use) => {
        await use(new DataSetPage(page));
    },
    formEntriesPage: async ({ page }, use) => {
        await use(new FormEntriesPage(page));
    },
    entryDraftsPage: async ({ page }, use) => {
        await use(new EntryDraftsPage(page));
    },
});

export { expect } from '@playwright/test';

