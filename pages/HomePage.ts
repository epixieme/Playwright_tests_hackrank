// ClimateMindPage.ts
import { Locator, Page, expect } from "@playwright/test";
import exp from "constants";
import { promises as fs } from "fs";
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getTopTenArticles(): Promise<string[][]> {
    const pageElements = await this.page.locator("tr.athing").all();

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

    return topTenArray;
  }

  async saveTopTenArticlesToCSV(topTenArray: string[][]): Promise<void> {
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
  }
}
// let formatToCSV = topTenArray.map((item) => item.join(",")).join("\n");
// //save a new file each time
// const timestamp = function formatDateToDDMMYY() {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//   const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year

//   return `${day}${month}${year}`;
// };

// let topTenUnique = `topten_${timestamp()}`;

// try {
//   await fs.writeFile(`./csv/${topTenUnique}.csv`, formatToCSV, "utf8");
//   console.log(`CSV file created ${topTenUnique}.csv`);
// } catch (err) {
//   console.error("Error creating CSV:", err);
// }
// expect(topTenArray[0][1]).toBe(
//   "Ask HN: What's the best way to learn a new language?"
// );
// expect(topTenArray[0][0]).toBe("1");
// expect(topTenArray[9][0]).toBe("10");
// expect(topTenArray.length).toBe(10);
// }
