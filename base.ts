// import and rename test to base
import { test as base } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

// typescript type definition for fixtures
type MyFixtures = {
  homePage: HomePage;
};
//export test and extend it with MyFixtures
export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
//export expect
export { expect } from "@playwright/test";
