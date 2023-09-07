import { test, expect } from '@playwright/test';
import { EngynNavigation } from '../../page/EngynNavigation';
import { FormControls } from '../../page/FormControl';
import { LoginComponents } from '../../page/loginComponent';
test.describe.parallel("API Testing", () => {
    const baseURL = 'https://reqres.in/api'
    test.only('Simple API Test', async ({ request }) => {
        const response = await request.get(`https://int-engyn-form.flynk.dev/1.0/Forms/Library/Menu/3b972e4a-d245-4de5-b234-648d714abfd3/Items?take=1000&parentId=&previousItemId=`,
            {
                headers: {
                    Roleid: 'cc13cf0e-ddd5-409b-a2f4-edb15e055334'
                }
            }
        )
        expect(response.status()).toBe(200)
        const responseBody = JSON.parse(await response.text())
        //console.log(responseBody);
        //Extract all the formsID and save it into an array or something
        const formsID = responseBody.payload.map(obj => obj.id)
        console.log(formsID);
        const length = formsID.length;
        console.log(length);
    })
    test('Get request', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/2`)
        const responseBody = JSON.parse(await response.text())
        console.log(responseBody);
        expect(response.status()).toBe(200)
        expect(responseBody.data.id).toBe(2)
    })
    test('Post request', async ({ request }) => {
        const response = await request.post(`${baseURL}/users`, {
            data: {
                id: 1000,
            }
        })
        const responseBody = JSON.parse(await response.text())
        console.log(responseBody);
    })
    test('Post requests - Login', async ({ request }) => {
        const response = await request.post(`${baseURL}/login`, {
            data: {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(200)
        console.log(responseBody.token);
        expect(responseBody.token).toBeTruthy();
    })
})