import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import { chromium } from "playwright";
import { HomePage } from "../pages/HomePage";

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
});
test("has url", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await expect(page.url()).toBe("https://news.ycombinator.com/");
});

test("has title", async ({ page }) => {
  const homePage = new HomePage(page);
  const title = await homePage.getPageTitle();
  expect(title).toBe("Hacker News");
});

test("has top ten articles sorted in ascending order", async ({ page }) => {
  const homePage = new HomePage(page);
  const getTopTen = await homePage.getTopTenArticles();
  expect(getTopTen[0][0]).toBe("1");
  expect(getTopTen[9][0]).toBe("10");
  expect(getTopTen.length).toBe(10);
});

test("can save top ten articles to CSV and match them with the website", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const getTopTen = await homePage.getTopTenArticles();
  await homePage.saveTopTenArticlesToCSV(getTopTen);
  const savedCSVFile = await homePage.getTopTenArticlesFromSavedCsv();
  const csvMatchesWebsite = getTopTen.every((item, index) => {
    expect(item).toEqual(savedCSVFile[index]);
  });
});
