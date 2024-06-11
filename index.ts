import { promises as fs } from "fs";
import { chromium } from "playwright";

/* *** 
Please note that this is a script to save the top 10 articles from Hacker News to a CSV file.
I have also created some tests using the page object model located in tests and pages folders.
Please use npm i to install my updated package.json and my tests can be run using the command
`npx playwright test --ui or --debug` in the terminal 
*** */

async function saveHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
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

    let formatToCSV = topTenArray.map((item) => item.join(",")).join("\n");
    //save a new file each time

    const timestamp = function formatDateToDDMMYY() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year

      return `${day}${month}${year}`;
    };

    let topTenUnique = `topten_${timestamp()}`;

    try {
      await fs.writeFile(`./csv/${topTenUnique}.csv`, formatToCSV, "utf8");
      console.log(`CSV file created ${topTenUnique}.csv`);
    } catch (err) {
      console.error("Error creating CSV:", err);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

(async () => {
  await saveHackerNewsArticles();
})();
