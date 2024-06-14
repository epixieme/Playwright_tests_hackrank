import { expect } from "@playwright/test";
import { test } from "../../../base";

test.beforeEach(async ({ homePage, loginPage }) => {
  await homePage.navigate();
  await loginPage.navigateToLoginPage();
  await loginPage.waitUntilPageLoaded(2000);
});
test("verify login page layout", async ({ homePage, page }) => {
  const loginUserName = await page.locator('input[name="acct"]').nth(0);
  const loginPassword = await page.locator('input[name="pw"]').nth(0);
  const loginButton = await page.locator('input[type="submit"]').nth(0);
  const createAccountUserName = await page.locator("input[name=acct]").nth(1);
  const createAccountUserPassword = await page.locator("input[name=pw]").nth(1);
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  const text = await page.locator("body").textContent();

  expect(page.url()).toBe("https://news.ycombinator.com/login?goto=news");
  expect(await loginUserName).toBeVisible();
  expect(await loginPassword).toBeVisible();
  expect(await loginButton).toBeVisible();
  expect(await createAccountUserName).toBeVisible();
  expect(await createAccountUserPassword).toBeVisible();
  expect(await signUpButton).toBeVisible();
  expect(text).toContain("Login");
  expect(text).toContain("Create Account");
});

test("capture screenshot of page layout", async ({ page }) => {
  // Navigate to the URL
  await page.goto("https://news.ycombinator.com/login?goto=news");

  // Wait for the load event to ensure the page is fully loaded
  await page.waitForLoadState("domcontentloaded");

  // Take a screenshot and save it to a specific path
  await page.screenshot({ path: "./screenshots/login.png", fullPage: true });

  // Compare the screenshot with the stored snapshot
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
    "login.png"
  );
});
