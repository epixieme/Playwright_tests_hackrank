import { Page } from "playwright";
import { test, expect } from "../../../base";

test.beforeEach(async ({ homePage }) => {
  await homePage.navigate();
});

test("test all links on the navigation", async ({ homePage, page }) => {
  const navlinkPaths = [
    "",
    "/news",
    "newest",
    "/front",
    "/newcomments",
    "/ask",
    "/show",
    "/jobs",
    "/submit",
  ];
  const navLinks = await page.locator(".pageTop a");
  // Get the count of navigation links
  const linkCount = await navLinks.count();
  await homePage.checkNavigationLinks(navLinks, linkCount, navlinkPaths);
  expect(linkCount).toBe(navlinkPaths.length);
});
