// import and rename test to base
import { test as base } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

// typescript type definition for fixtures
type MyFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
};
//export test and extend it with MyFixtures
export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
//export expect
export { expect } from "@playwright/test";
