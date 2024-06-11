import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import { chromium } from "playwright";

test("has title", async ({ page }) => {
  await page.goto("https://news.ycombinator.com");
  expect(await page.title()).toBe("Hacker News");
});

test("has top ten articles", async ({ page }) => {
  await page.goto("https://news.ycombinator.com");

  const pageElements = await page.locator("tr.athing").all();

  const topTen = pageElements.slice(0, 10);
  // 2d array of strings to store the data

  let topTenArray: string[][] = [];

  for (const element of topTen) {
    const textContent = (await element.innerText())
      .replace(/^\s+"/gm, "")
      .split(/(?<=^\d{1,2})\./m)
      .map((item) => item.trim());

    topTenArray.push(textContent);
  }

  console.log(topTenArray);
  // let formatToCSV = topTenArray.map((item) => item.join(",")).join("\n");
  expect(topTenArray[0][0]).toBe("1");
  expect(topTenArray[9][0]).toBe("10");
  expect(topTenArray.length).toBe(10);
});

test("csv contains top ten articles", async ({ page }) => {
  await fs
    .readFile("Path/to/csv")
    .then((data) => data.toString()) // convert Buffer to string
    .then((content) => content.split("\n")) // split string to lines
    .map((e) => e.trim()); // remove white spaces for each line
});
// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
