// ClimateMindPage.ts
import { Locator, Page, expect } from "@playwright/test";
import { promises as fs } from "fs";

export class HomePage {
  readonly page: Page;
  readonly getPageElements: Locator;
  readonly getNavigationLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getPageElements = page.locator("tr.athing");
    this.getNavigationLinks = page.locator(".pageTop a");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitUntilPageLoaded(wait: number): Promise<void> {
    await this.page.waitForTimeout(wait);
  }

  async getTopTenArticles(): Promise<string[][]> {
    const pageElements = await this.getPageElements.all();
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
    let topTen = `topten`;
    try {
      await fs.writeFile(`./csv/${topTen}.csv`, formatToCSV, "utf8");
      console.log(`CSV file created ${topTen}.csv`);
    } catch (err) {
      console.error("Error creating CSV:", err);
    }
  }

  async getTopTenArticlesFromSavedCsv(): Promise<string[][]> {
    const savedCSVFile = await fs
      .readFile(`./csv/topten.csv`)
      .then((data) => data.toString()) // convert Buffer to string
      .then((content) => content.split("\n"));
    const result = savedCSVFile.map((item) => item.split(",")); // split string to lines
    return result;
  }

  async checkNavigationLinks(
    navLinks: Locator,
    linkCount: number,
    navlinkPaths: string[]
  ): Promise<void> {
    for (let i = 0; i < linkCount; i++) {
      // Get the link text for verification purposes
      // Click on the navigation link
      await navLinks.nth(i).click();
      await this.page.url().includes(navlinkPaths[i]);
      await this.page.waitForTimeout(1000);
      await this.page.goBack();
    }
  }
}
