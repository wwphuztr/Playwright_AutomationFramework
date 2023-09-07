import { Locator, Page, expect } from "@playwright/test";
import { CommonComponents } from "../../common/CommonComponents";

export class DataSet_MyCollectionOrSharedPage extends CommonComponents {
    // Locators
    public cellData: Locator
    public dataContainer: Locator
    public arrowRight: Locator

    constructor(public readonly page: Page) {
        // Page
        super(page)
        this.dataContainer = this.page.locator("//div[@class='ant-spin-container']")
        this.arrowRight = this.page.getByRole('button', { name: 'right' })
    }

    // ----------------------------------------------- Actions - Methods -----------------------------------------------
    getCellData(data): Locator {
        this.cellData = this.page.getByRole('cell', { name: data })
        return this.cellData
    }
}