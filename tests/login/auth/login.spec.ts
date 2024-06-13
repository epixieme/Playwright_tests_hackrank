//note each test should be run in isolation otherwise it will fail because
//hackerrank has implemented a threshold

// if this had been a real world test I would set up an env variable for password and username
// and use the process.env to access them

import { expect } from "@playwright/test";
import { test } from "../../../base";

test.beforeEach(async ({ homePage, page }) => {
  await homePage.navigate();
  await page.getByRole("link", { name: "login" }).click();
  await page.waitForTimeout(2000);
});
//
test("verify that a user cannot login without a username or password", async ({
  homePage,
  page,
}) => {
  const loginButton = await page.locator('input[type="submit"]').nth(0);
  await loginButton.click();
  expect(await page.getByText("Bad login.")).toBeTruthy();
});

test("verify that a user cannot login with an invalid username and password", async ({
  homePage,
  page,
}) => {
  const loginUserName = await page.locator('input[name="acct"]').nth(0);
  await loginUserName.fill("bananasunday");
  const loginPassword = await page.locator('input[name="pw"]').nth(0);
  await loginPassword.fill("bananasplit");
  const loginButton = await page.locator('input[type="submit"]').nth(0);
  await loginButton.click();
  expect(await page.getByText("Bad login.")).toBeTruthy();
});

// note the recaptcha sometimes shows the challenge which sometimes fails the test. At other times it does not show the challenge.
test("verify that a user can login with a valid username and password", async ({
  homePage,
  page,
}) => {
  // wait for page to load completely otherwise an error will be displayed
  await page.waitForTimeout(2000);
  const loginUserName = await page.locator('input[name="acct"]').nth(0);
  await loginUserName.fill("kirstieTest");
  const loginPassword = await page.locator('input[name="pw"]').nth(0);
  await loginPassword.fill("password");
  const loginButton = await page.locator('input[type="submit"]').nth(0);
  await loginButton.click();
  await page.waitForTimeout(2000);
  await page.waitForURL("https://news.ycombinator.com/login");

  const frame = page.frameLocator("iframe[title='reCAPTCHA']");
  const label = frame.locator("#recaptcha-anchor-label");
  await expect(label).toHaveText("I'm not a robot");
  const checkbox = await page
    .frameLocator('[title="reCAPTCHA"]')
    .getByRole("checkbox");
  await checkbox.click();
  //wait for recaptcha to be verified
  await page.waitForTimeout(20000);
  await page.locator('input[type="submit"]').click();
  expect(await page.url()).toBe("https://news.ycombinator.com/news");
});
