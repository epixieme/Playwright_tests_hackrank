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

test("has top ten articles sorted in ascending order", async ({ homePage }) => {
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

test("test all links on the page", async ({ homePage }) => {

  //login etc
  const getTopTen = await homePage.getTopTenArticles();
  const topTenLinks = getTopTen.map((article) => article[3]);
  const links = topTenLinks.map((link) => {
    return link.match(/(?<=\().+?(?=\))/g).toString();
  });
  const allLinks = links.map((link) => {
    return link.replace(/['"]+/g, "");
  });
  for (const link of allLinks) {
    await homePage.page.goto(link);
    await homePage.page.waitForLoadState("domcontentloaded");
    expect(await homePage.page.url()).toBe(link);
  }
}
