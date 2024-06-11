import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import { chromium } from "playwright";
import { HomePage } from "../pages/HomePage";

test("has url", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await expect(page.url()).toBe("https://news.ycombinator.com/");
});
test("has title", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  const title = await homePage.getPageTitle();
  expect(title).toBe("Hacker News");
});

test("has top ten articles", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  const getTopTen = await homePage.getTopTenArticles();
  expect(getTopTen[0][0]).toBe("1");
  expect(getTopTen[9][0]).toBe("10");
  expect(getTopTen.length).toBe(10);
});

test("can save top ten articles to CSV", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  const getTopTen = await homePage.getTopTenArticles();
  await homePage.saveTopTenArticlesToCSV(getTopTen);
  const savedCSVFile = await fs
    .readFile(`./csv/topten_${new Date().toLocaleDateString()}.csv`)
    .then((data) => data.toString()) // convert Buffer to string
    .then((content) => content.split("\n"));

  const result = savedCSVFile.map((item) => item.split(",")); // split string to lines

  expect(getTopTen).toEqual(result);
});
// test("has top ten articles", async ({ page }) => {

//   let formatToCSV = topTenArray.map((item) => item.join(",")).join("\n");
//   //save a new file each time
//   const timestamp = function formatDateToDDMMYY() {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//     const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year

//     return `${day}${month}${year}`;
//   };

//   let topTenUnique = `topten_${timestamp()}`;

//   try {
//     await fs.writeFile(`./csv/${topTenUnique}.csv`, formatToCSV, "utf8");
//     console.log(`CSV file created ${topTenUnique}.csv`);
//   } catch (err) {
//     console.error("Error creating CSV:", err);
//   }
//   expect(topTenArray[0][1]).toBe(
//     "Ask HN: What's the best way to learn a new language?"
//   );
//   expect(topTenArray[0][0]).toBe("1");
//   expect(topTenArray[9][0]).toBe("10");
//   expect(topTenArray.length).toBe(10);
// });

// test("csv contains top ten articles", async ({ page }) => {
//   await page.goto("https://news.ycombinator.com");
//   const pageElements = await page.locator("tr.athing").all();
//   const topTenFromPage = pageElements.slice(0, 10);
//   // 2d array of strings to store the data

//   let topTenArray: string[][] = [];

//   try {
//     const savedCSVFile = await fs
//       .readFile("./csv/topten_110624.csv")
//       .then((data) => data.toString()) // convert Buffer to string
//       .then((content) => content.split("\n"));

//     const result = savedCSVFile.map((item) => item.split(",")); // split string to lines
//     console.log(result, "savedFile");

//     for (const element of topTenFromPage) {
//       const formatTextContent = (await element.innerText())
//         .replace(/^\s+"/gm, "")
//         .split(/(?<=^\d{1,2})\./m)
//         .map((item) => item.trim());

//       topTenArray.push(formatTextContent);
//     }

//     const csvMatchesWebsite = topTenArray.every((item, index) => {
//       expect(item).toEqual(result[index]);
//     });

//     // expect(topTenArray).toEqual(result);

//     // let formatToCSV = topTenArray.map((item) => item.join(",")).join("\n");
//     // .map((e) => e.trim()); // remove white spaces for each line
//   } catch (err) {
//     console.log(err);
//   }
// });
