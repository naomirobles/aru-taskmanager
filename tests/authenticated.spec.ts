import { test } from "@playwright/test";

test.describe("authenticated tests", () => {
  test("already signed in", async ({ page }) => {
    await page.goto("/calendar");
  });
});
