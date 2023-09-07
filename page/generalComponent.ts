import { Page, expect } from '@playwright/test'

export class GeneralComponent {

    //Function to attach forms
    static async attachForms(page: Page, form1, form2) {
        await page.waitForTimeout(2000);
        await page.getByText(form1, { exact: true }).click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Attach' }).click();
        await page.waitForTimeout(1000);
        await page.getByText(form2).click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Attach' }).click();
        await page.waitForTimeout(1000);
        await page.locator("//span[normalize-space()='Close']").click();
    }

    //Function to attach forms
    static async changePersonalOrg(page: Page) {
        await page.reload();
        await page.waitForTimeout(2000);
        await page.locator('.ant-layout-sider-trigger').click();
        let menuItems = await page.$$('*[role="menuitem"]');
        const fifthMenuItem = menuItems[4];
        await fifthMenuItem.click();

        menuItems = await page.$$('*[role="menuitem"]');
        const sixthMenuItem = menuItems[6];
        await sixthMenuItem.hover();
        await expect(page.getByText('Personal Account')).toBeVisible();
        await page.getByText('Personal Account').click();
    }

    // Check If the data is presented in EngynCore
        // Scenario: After submitting the form, we need to validate whether the data has been saved in the Core system or not. 
        // The challenge is that we will be submitting multiple forms, resulting in the data being recorded multiple times in the dataset. 
        // This causes the data we are checking to be shifted to the next page. Therefore, the purpose of this function is to examine each page and verify the presence of the expected data
    static async CheckDataInCore(page: Page, formName_DataSet, data: string) {
        await page.reload()
        await page.getByRole('menuitem', { name: 'Core' }).getByText('Core').click()
        await page.getByRole('link', { name: formName_DataSet + ' DataSet' }).click()
        await page.waitForLoadState('networkidle')
        await page.waitForLoadState('domcontentloaded')

        let i = 0;
        await page.locator("//div[@class='ant-spin-container']").waitFor({ state: 'visible' })
        let visible = await page.getByRole('cell', { name: data }).isVisible()

        // We set i <= 10, because we just want this function to go 10 page only
        // !visible <=> visible == false
        while (!visible && i <= 10) {
            await page.waitForSelector("//div[@class='ant-spin-container']")
            await page.locator("//div[@class='ant-spin-container']").waitFor({ state: 'visible' }) // --> wait the data is loaded
            visible = await page.getByRole('cell', { name: data }).isVisible(); // --> Check the visible of expected data
            if (!visible) { // --> for this condition, we will check if there are no data, we will click on the `arrow` icon to move to the next page
                try {
                    await expect(page.getByRole('button', { name: 'right' })).toBeEnabled({ timeout: 10000 })
                    await page.getByRole('button', { name: 'right' }).click()
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