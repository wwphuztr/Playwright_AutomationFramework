import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../common/CommonComponents";
import { MyCollectionPage } from "../EngynForm/FormLibrary/MyCollectionPage";
import { DataSet_MyCollectionOrSharedPage } from "./DataSet_MyCollectionAndSharedPage";

export class DataSetPage extends CommonComponents {
    // Locators
    public spnLoading: Locator

    // Page
    public myCollectionOrSharedPage: DataSet_MyCollectionOrSharedPage

    constructor(public readonly page: Page) {
        // Locator
        super(page)
        this.spnLoading = this.page.locator(".ant-spin-dot-spin")

        // Page
        this.myCollectionOrSharedPage = new DataSet_MyCollectionOrSharedPage(this.page)
    }

    // ----------------------------------------------- Actions - Methods -----------------------------------------------
    async clickItem(location: 'My Collection' | 'Shared Data', name) {
        switch (location) {
            case 'My Collection':
                await this.page.locator(".private-collection-wrapper").filter({ hasText: 'My Collection' }).locator(".ant-row-space-between").getByText(name + ' DataSet', {exact: true}).click()
                await expect(this.spnLoading).toBeAttached()
                await expect(this.spnLoading).not.toBeAttached()
                break;

            case 'Shared Data':
                await this.page.locator(".shared-collection-wrapper").filter({ hasText: 'Shared Data' }).locator(".ant-row-space-between").getByText(name + ' DataSet', {exact: true}).click()
                await expect(this.spnLoading).toBeAttached()
                await expect(this.spnLoading).not.toBeAttached()
                break;
        }
    }

    async CheckDataInCore(location: 'My Collection' | 'Shared Data', formName_DataSet, data: string) {
        await this.page.goto('/core', {waitUntil: 'load'})
        await this.clickItem(location, formName_DataSet)

        let i = 0;
        //await this.page.locator("//div[@class='ant-spin-container']").waitFor({ state: 'visible' })
        await expect(this.myCollectionOrSharedPage.dataContainer).toBeAttached()
        const cellData = this.myCollectionOrSharedPage.getCellData(data)

        let visible = await cellData.isVisible()

        // We set i <= 10, because we just want this function to go 10 page only
        // !visible <=> visible == false
        while (!visible && i <= 10) {
            await expect(this.myCollectionOrSharedPage.dataContainer).toBeAttached()
            visible = await cellData.isVisible()
            if (!visible) { // --> for this condition, we will check if there are no data, we will click on the `arrow` icon to move to the next page
                try {
                    await expect(this.myCollectionOrSharedPage.arrowRight).toBeEnabled({timeout: 10000})
                    await this.myCollectionOrSharedPage.arrowRight.click()
                }
                catch (error) {
                    throw new Error("Not found the data in core")
                }
            }
            i++

            if (!visible && i == 10) {
                throw new Error("Not found the data in core")
            }
        }
    }
}