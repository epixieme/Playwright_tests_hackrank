// ClimateMindPage.ts
import { Locator, Page, expect } from "@playwright/test";
import { promises as fs } from "fs";

export class LoginPage {
  readonly page: Page;
  readonly getPageElements: Locator;
  readonly loginLink: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getPageElements = page.locator("tr.athing");
    this.loginLink = page.getByRole("link", { name: "login" });
    this.loginButton = page.locator('input[type="submit"]').nth(0);
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.loginLink.click();
  }

  async waitUntilPageLoaded(wait: number): Promise<void> {
    await this.page.waitForTimeout(wait);
  }

  async fillLoginUserName(userName: string): Promise<void> {
    const loginUserName = await this.page.locator('input[name="acct"]').nth(0);
    await loginUserName.fill(userName);
  }
  async fillLoginPassword(password: string): Promise<void> {
    const loginPassword = await this.page.locator('input[name="pw"]').nth(0);
    await loginPassword.fill(password);
  }

  async fillSignUpUserName(userName: string): Promise<void> {
    const signUpUserName = await this.page.locator('input[name="acct"]').nth(1);
    await signUpUserName.fill(userName);
  }

  async fillSignUpPassword(password: string): Promise<void> {
    const signUpPassword = await this.page.locator('input[name="pw"]').nth(1);
    await signUpPassword.fill(password);
  }
  async fillLoginCaptcha(): Promise<void> {
    const frame = this.page.frameLocator("iframe[title='reCAPTCHA']");
    const label = frame.locator("#recaptcha-anchor-label");
    await expect(label).toHaveText("I'm not a robot");
    const checkbox = await this.page
      .frameLocator('[title="reCAPTCHA"]')
      .getByRole("checkbox");
    await checkbox.click();
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
