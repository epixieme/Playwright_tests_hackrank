/// username and password already taken username thisisnotreal and password thisisnotreal
//sign up with a real username and password

import { ElementHandle, expect } from "@playwright/test";
import { test } from "../../../base";
import { get } from "http";

test.beforeEach(async ({ homePage, page }) => {
  await homePage.navigate();
  await page.getByRole("link", { name: "login" }).click();
  await page.waitForTimeout(2000);
});

// test("verify that a user cannot sign up without a username or password", async ({
//   homePage,
//   page,
// }) => {
//   const signUpButton = await page.locator('input[type="submit"]').nth(1);
//   await signUpButton.click();
//   const text = await page.locator("body").textContent();
//   expect(text).toContain(
// "Usernames can only contain letters, digits, dashes and underscores, and should be between 2 and 15 characters long. Please choose another."
//   );
// });
//
// test("verify that a user cannot sign up with an existing username and password", async ({
//   homePage,
//   page,
// }) => {
//   const signUpUserName = await page.locator('input[name="acct"]').nth(1);
//   await signUpUserName.fill("kirstieTest");
//   const signUpPassword = await page.locator('input[name="pw"]').nth(1);
//   await signUpPassword.fill("password");
//   const signUpButton = await page.locator('input[type="submit"]').nth(1);
//   await signUpButton.click();
//   const text = await page.locator("body").textContent();
//   expect(text).toContain("That username is taken. Please choose another.");
// });

// could use a uuid to generate a random username and password
// test("verify that a user can sign up with an new username and password", async ({
// homePage,
// page,
// }) => {
// const signUpUserName = await page.locator('input[name="acct"]').nth(1);
// await signUpUserName.fill("newUser35134534");
// const signUpPassword = await page.locator('input[name="pw"]').nth(1);
// await signUpPassword.fill("password");
// const signUpButton = await page.locator('input[type="submit"]').nth(1);
// await signUpButton.click();
// const text = await page.locator("body").textContent();
// expect(page.url()).toBe("https://news.ycombinator.com/login");
// expect(text).toContain("Validation required.");
// });

test("verify that a user can click on the recaptcha", async ({
  homePage,
  page,
}) => {
  const signUpUserName = await page.locator('input[name="acct"]').nth(1);
  await signUpUserName.fill("newUser35134534");
  const signUpPassword = await page.locator('input[name="pw"]').nth(1);
  await signUpPassword.fill("password");
  const signUpButton = await page.locator('input[type="submit"]').nth(1);
  await signUpButton.click();
  await page.waitForTimeout(2000);
  await page.waitForURL("https://news.ycombinator.com/login");
  const checkboxFrame: any = await page.frame({
    url: "https://www.google.com/recaptcha/api2/anchor",
  });
  if (checkboxFrame) {
    const checkbox = await checkboxFrame.$("#recaptcha-anchor");
    await checkbox.click();
    await page.locator('input[type="submit"]').click();
  }

  await expect(page.url()).toBe("https://news.ycombinator.com/login");
});
