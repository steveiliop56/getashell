import { test, expect } from "@playwright/test";
import { createShell, loginUser } from "./fixtures/fixtures";
import { clearDatabase } from "./helpers/db";
import { deleteContainer } from "./helpers/commands";

test.beforeEach(async ({ page }) => {
  await loginUser(page);
});

test("user can create a shell", async ({ page }) => {
  await page.goto("/home");

  // Select distro
  await page.getByText("Select").click();
  for (let i = 0; i <= 3; i++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // Name
  await page.getByPlaceholder("Enter a name...").fill("debian");

  // Submit
  await page.getByRole("button", { name: "Get me a shell" }).click();

  // The shell should be created
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible({
    timeout: 120000,
  });

  // Clean up
  await clearDatabase();
  await deleteContainer("debian-debian");
});

test("user can delete a shell", async ({ page }) => {
  await createShell(page);
  await page.goto("home");

  // Open settings menu
  await page.getByRole("button", { name: "Settings" }).click();

  // Click the delete button
  await page.getByRole("button", { name: "Delete" }).click();

  // The shell should be now gone
  await expect(page.getByText("ubuntu")).not.toBeVisible({ timeout: 120000 });
});
