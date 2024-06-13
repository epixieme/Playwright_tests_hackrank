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

test("verify that a user cannot sign up without a username or password", async ({
  homePage,
  page,
}) => {
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  await signUpButton.click();
  const text = await page.locator("body").textContent();
  expect(text).toContain(
    "Usernames can only contain letters, digits, dashes and underscores, and should be between 2 and 15 characters long. Please choose another."
  );
});

test("verify that a user cannot sign up with an existing username and password", async ({
  homePage,
  page,
}) => {
  const signUpUserName = await page.locator('input[name="acct"]').nth(1);
  await signUpUserName.fill("kirstieTest");
  const signUpPassword = await page.locator('input[name="pw"]').nth(1);
  await signUpPassword.fill("password");
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  await signUpButton.click();
  const text = await page.locator("body").textContent();
  expect(text).toContain("That username is taken. Please choose another.");
});
//
// Could use a uuid to generate a random username and password so no need to manually change it
// Could also use a faker library to generate a random username and password
test("verify that a user can sign up with an new username and password", async ({
  homePage,
  page,
}) => {
  const signUpUserName = await page.locator('input[name="acct"]').nth(1);
  await signUpUserName.fill("newUser35134534");
  const signUpPassword = await page.locator('input[name="pw"]').nth(1);
  await signUpPassword.fill("password");
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  await signUpButton.click();
  const text = await page.locator("body").textContent();
  expect(page.url()).toBe("https://news.ycombinator.com/login");
  expect(text).toContain("Validation required.");
});

test("verify that a user can click on the recaptcha", async ({
  homePage,
  page,
}) => {
  const signUpUserName = await page.locator('input[name="acct"]').nth(1);
  //modify the username to be unique
  await signUpUserName.fill("newUser35134");
  const signUpPassword = await page.locator('input[name="pw"]').nth(1);
  //modify the password to be unique
  await signUpPassword.fill("password");
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  await signUpButton.click();
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
