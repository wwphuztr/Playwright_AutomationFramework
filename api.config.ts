import { PlaywrightTestConfig, chromium } from '@playwright/test'

const token = 'eyJraWQiOiI3VG1QY09UR2Q5c1ZLSFE4N2VMK3NkS2g1TThKUFVSZ285M1c3Nm9Tb2NVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyYWYzMWFkNC1iNTc1LTQ2NDAtOWRkMi0zYjc1Nzk3ZjFhOTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2h0OVFMTmJ2SiIsImNvZ25pdG86dXNlcm5hbWUiOiIyYWYzMWFkNC1iNTc1LTQ2NDAtOWRkMi0zYjc1Nzk3ZjFhOTIiLCJvcmlnaW5fanRpIjoiYTNjZjNmMmItZTMzNy00NmJlLTg2MmEtNmUyOGRhMDVkNGJiIiwiYXVkIjoiamxhajFoaWFlMHFjZzgyY284cHJqdWlmcCIsImV2ZW50X2lkIjoiMjQyZDQzNjAtOTAwMS00ZTM5LTlkOGEtY2JkMmY1YWI0YjkwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODY0OTMyNzUsImV4cCI6MTY4NjQ5Njg3NSwiaWF0IjoxNjg2NDkzMjc1LCJqdGkiOiI0MDczNDZmNy1iYTYwLTQ3MTktODYwYS1jMjJmODkwMTNiZjEiLCJlbWFpbCI6Ind0ZXN0MUBtYWlsaW5hdG9yLmNvbSJ9.hF7KesNd9hvuGfOEyFW2R1lkfKck1HOf89MccQg--hdx1IhbEGvfd2SsoXsFloGmSny2qu0811orzRAVze9EUgchpm9Q6c07btDmuKG_cIskuRPY9Qzl6ZZGJK1HkxQSRXt2hemgkraSaljNQZDnN5evNoDv2cR9zxUDjgZqSduk204Z_-73bZ62xUi_43YrORMaIf7zEArKoLZyYDLhFx1siuVWxK54AQ4RVpjnuIYZGcKzlG2YjIwXcMajXh2lqwyp0QQNr3pTdskulug54n87SgG6bE-7-axaXvTOIubMOcJjwlgJSIiyz0Be5N_VWvegC-36RqN8uGF8JBmppQ'
const config:PlaywrightTestConfig = {
    timeout: 60000,
    retries: 0,
    testDir: './tests',
    use: {
        headless: true,
        viewport: {width: 1280, height: 720},
        actionTimeout: 10000,
        ignoreHTTPSErrors: true,
        video: 'off',
        screenshot: 'off',
        extraHTTPHeaders: {
            'Authorization' : `Bearer ${token}`
        }
    },
    projects: [
        {
            name: 'Chromium',
            use: {browserName: 'chromium'},
        }
    ]
}
export default config