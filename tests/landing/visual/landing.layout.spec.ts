import { expect } from "@playwright/test";
import { test } from "../../../base";

test.beforeEach(async ({ homePage }) => {
  await homePage.navigate();
});

test("capture screenshot of page layout", async ({ page }) => {
  // Wait for the load event to ensure the page is fully loaded
  await page.waitForLoadState("domcontentloaded");

  // Take a screenshot and save it to a specific path
  await page.screenshot({ path: "./screenshots/landing.png", fullPage: true });

  // Compare the screenshot with the stored snapshot
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
    "landing.png"
  );
});

test("has url", async ({ homePage, page }) => {
  await homePage.navigate();
  await expect(page.url()).toBe("https://news.ycombinator.com/");
});

test("has title", async ({ homePage }) => {
  const title = await homePage.getPageTitle();
  expect(title).toBe("Hacker News");
});

test("has top ten articles sorted in ascending order", async ({
  page,
  homePage,
}) => {
  const getTopTen = await homePage.getTopTenArticles();
  expect(getTopTen[0][0]).toBe("1");
  expect(getTopTen[9][0]).toBe("10");
  expect(getTopTen.length).toBe(10);
});

test("can save top ten articles to CSV and match them with the website", async ({
  homePage,
}) => {
  const getTopTen = await homePage.getTopTenArticles();
  await homePage.saveTopTenArticlesToCSV(getTopTen);
  const articleFromSavedCSVFile =
    await homePage.getTopTenArticlesFromSavedCsv();
  const csvMatchesWebsite = getTopTen.every((article, index) => {
    expect(article).toEqual(articleFromSavedCSVFile[index]);
  });
});
