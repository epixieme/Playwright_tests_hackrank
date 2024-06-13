// import { test, expect } from "@playwright/test";
// test.beforeEach(async ({ homePage }) => {
// await homePage.navigate();
// });
// test("verify login page layout", async ({ homePage, page }) => {
// await page.getByRole("link", { name: "login" }).click();
// wait for page to load completely otherwise an error will be displayed on hackerrank login pa
// await page.waitForTimeout(2000);
//
// const loginUserName = await page.locator('input[name="acct"]').nth(0);
// await loginUserName.fill("testUser");
//
// const loginPassword = await page.locator('input[name="pw"]').nth(0);
// const createAccountUserName = await page.locator("input[name=acct]").nth(1);
// const createAccountUserPassword = await page.locator("input[name=pw]").nth(1);

//
// await loginPassword.fill("testPassword");

// const loginButton = await page.locator('input[type="submit"]').nth(0);
// await loginButton.click();
//
// expect(page.url()).toBe("https://news.ycombinator.com/login?goto=news");
// expect(await loginUserName).toBeTruthy();
// expect(await loginPassword).toBeTruthy();
// expect(await loginButton).toBeTruthy();
// expect(await createAccountUserName).toBeTruthy();
// expect(await createAccountUserPassword).toBeTruthy();
// expect(await page.getByText("Login")).toBeTruthy();
// expect(await page.getByText("Create Account")).toBeTruthy();
// });
//
// test("capture screenshot of page layout", async ({ page }) => {
// Navigate to the URL
// await page.goto("https://news.ycombinator.com/login?goto=news");
//
// Wait for the load event to ensure the page is fully loaded
// await page.waitForLoadState("domcontentloaded");
//
// Take a screenshot and save it to a specific path
// await page.screenshot({ path: "./screenshots/login.png", fullPage: true });
//
// Compare the screenshot with the stored snapshot
// expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
// "login.png"
// );
// });
//
