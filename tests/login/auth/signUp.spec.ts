//note each test should be run in isolation otherwise it will fail because
//hackerrank has implemented a threshold

// if this had been a real world test I would set up env secrets for password and username
// and use the process.env to access them

import { expect } from "@playwright/test";
import { test } from "../../../base";
import randomUserName from "../../../utils/randomUserName";
import { log } from "console";

test.beforeEach(async ({ homePage, page }) => {
  await homePage.navigate();
  await page.getByRole("link", { name: "login" }).click();
  await page.waitForTimeout(2000);
});

test("verify that a user cannot sign up without a username or password", async ({
  loginPage,
  page,
}) => {
  await loginPage.submitsSignUp();

  const text = await page.locator("body").textContent();
  expect(text).toContain(
    "Usernames can only contain letters, digits, dashes and underscores, and should be between 2 and 15 characters long. Please choose another."
  );
});

test("verify that a user cannot sign up with an existing username and password", async ({
  loginPage,
  page,
}) => {
  await loginPage.fillSignUpUserName("kirstieTest");
  await loginPage.fillSignUpPassword("password");
  await loginPage.submitsSignUp();
  const text = await page.locator("body").textContent();
  expect(text).toContain("That username is taken. Please choose another.");
});
//
// Could use a uuid to generate a random username and password.
// Could also use a faker library to generate a random username and password

// note the recaptcha sometimes shows the challenge which sometimes fails the test.
//At other times it does not show the challenge.
test("verify that a user can sign up with an new username and password", async ({
  loginPage,
  page,
}) => {
  const randomUser = randomUserName();
  await loginPage.fillSignUpUserName(randomUser);
  await loginPage.fillSignUpPassword("password");
  await loginPage.submitsSignUp();
  await loginPage.waitUntilPageLoaded(1000);
  const isRecaptchaPresent =
    (await page.locator('iframe[title="reCAPTCHA"]').count()) > 0;
  if (isRecaptchaPresent) {
    await loginPage.fillLoginCaptcha();
    await loginPage.waitUntilPageLoaded(20000);
    const text = await page.locator("body").textContent();
    expect(text).toContain("Validation required.");
  } else {
    expect(page.url()).toBe("https://news.ycombinator.com/");
  }
});
