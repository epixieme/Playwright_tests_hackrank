//note each test should be run in isolation otherwise it will fail because
//hackerrank has implemented a threshold

// if this had been a real world test I would set up an env variable for password and username
// and use the process.env to access them

import { expect } from "@playwright/test";
import { test } from "../../../base";

test.beforeEach(async ({ homePage, loginPage, page }) => {
  await homePage.navigate();
  await loginPage.navigateToLoginPage();
  await loginPage.waitUntilPageLoaded(2000);
});
//
test("verify that a user cannot login without a username or password", async ({
  loginPage,
  page,
}) => {
  await loginPage.submitLogin();
  await loginPage.waitUntilPageLoaded(1000);
  const text = await page.locator("body").textContent();
  const isRecaptchaPresent =
    (await page.locator('iframe[title="reCAPTCHA"]').count()) > 0;

  if (isRecaptchaPresent) {
    expect(text).toContain("Validation");
  } else {
    expect(text).toContain("Bad login");
  }
});

test("verify that a user cannot login with an invalid username and password", async ({
  loginPage,
  page,
}) => {
  await loginPage.fillLoginUserName("bananasunday");

  await loginPage.fillLoginPassword("bananasplit");
  await loginPage.submitLogin();
  await loginPage.waitUntilPageLoaded(1000);

  const isRecaptchaPresent =
    (await page.locator('iframe[title="reCAPTCHA"]').count()) > 0;
  const text = await page.locator("body").textContent();
  if (isRecaptchaPresent) {
    expect(text).toContain("Validation");
  } else {
    expect(text).toContain("Bad login");
  }
});

// note the recaptcha sometimes shows the challenge which sometimes fails the test. At other times it does not show the challenge.
test("verify that a user can login with a valid username and password", async ({
  loginPage,
  page,
}) => {
  // wait for page to load completely otherwise an error will be displayed
  await loginPage.fillLoginUserName("kirstieTest");

  await loginPage.fillLoginPassword("password");
  await loginPage.submitLogin();
  await loginPage.waitUntilPageLoaded(1000);
  const isRecaptchaPresent =
    (await page.locator('iframe[title="reCAPTCHA"]').count()) > 0;
  if (isRecaptchaPresent) {
    await loginPage.fillLoginCaptcha();
    await loginPage.waitUntilPageLoaded(20000);
    await loginPage.submitLogin();
  }

  expect(await page.url()).toBe("https://news.ycombinator.com/news");
});
