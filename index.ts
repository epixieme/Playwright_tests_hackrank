import { promises as fs } from "fs";
import { chromium } from "playwright";

/* *** 
Please note that this is a script to save the top 10 articles from Hacker News to a CSV file.
I have also created some tests using the page object model and fixtures located a base file, tests and pages folders.
Please use npm i to install my updated package.json and my tests can be run using the command
`npx playwright test --ui or --debug` in the terminal 
*** */

async function saveHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://news.ycombinator.com");

    //convert the page elements to an array of objects
    const pageElements = await page
      .locator(".titleline > a:first-child")
      .evaluateAll((anchorLinks) => {
        return anchorLinks.map((anchorLink) => ({
          title: anchorLink.textContent,
          url: (anchorLink as HTMLAnchorElement).href,
        }));
      });

    //get the top 10 articles
    const topTenArray = pageElements.slice(0, 10);

    let formatToCSV = topTenArray
      .map((item) => `${item.title}, ${item.url}`)
      .join("\n");

    //save a new file each time
    const timestamp = function formatDateToDDMMYY() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year

      return `${day}${month}${year}`;
    };

    let topTenUnique = `topten_${timestamp()}`;

    //save a new file each time
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
