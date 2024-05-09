import { test, expect } from "@playwright/test";
import { loginUser } from "./fixtures/fixtures";
import { clearDatabase } from "./helpers/db";
import { deleteContainer } from "./helpers/commands";

test.beforeEach(async ({ page }) => {
  await loginUser(page);
});

test.afterEach(async () => {
  await clearDatabase();
  await deleteContainer("debian-debian");
});

test("user can create a shell without extra arguments", async ({ page }) => {
  await page.goto("/home");

  // Set timeout
  test.setTimeout(120000);

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
});

test("user can create a shell with extra arguments", async ({ page }) => {
  await page.goto("/home");

  // Set timeout
  test.setTimeout(120000);

  // Select distro
  await page.getByText("Select").click();
  for (let i = 0; i <= 3; i++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // Name
  await page.getByPlaceholder("Enter a name...").fill("debian");

  // Extra Arguments
  await page
    .getByPlaceholder("Enter extra arguments...")
    .fill("-e HELLO=world");

  // Submit
  await page.getByRole("button", { name: "Get me a shell" }).click();

  // The shell should be created
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible({
    timeout: 120000,
  });

  // Open settings
  await page.getByRole("button", { name: "Settings" }).click();

  // Try to find the extra arguments
  await expect(page.getByText("-e HELLO=world")).toBeVisible();
});
