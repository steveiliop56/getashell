import { test, expect } from "@playwright/test";
import { deleteShell, loginUser } from "./fixtures/fixtures";

test.beforeEach(async ({ page }) => {
  await loginUser(page);
});

test("user can create a shell without extra arguments", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/home");

  // Clean up
  await deleteShell(page);

  // Select distro
  await page.getByText("select").click();
  for (let i = 0; i <= 3; i++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // Name
  await page.getByPlaceholder("Enter a name...").fill("debian");

  // Submit
  await page.getByRole("button", { name: "Get me a shell" }).click();

  // The shell should be created
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});

// test("user can create a shell with extra arguments", async ({ page }) => {
//   await loginUser(page);
//   await page.goto("/home");

//   // Fill form
//   await page
//     .getByTestId("create-shell-form-distro-select")
//     .selectOption("Debian 12");
//   await page
//     .getByTestId("create-shell-form-distro-name")
//     .fill("debian-extra-args");
//   await page
//     .getByTestId("create-shell-form-distro-extra-args")
//     .fill("-e HELLO=world");

//   // Submit
//   await page.getByTestId("create-shell-form-submit").click();

//   // The shell should be created
//   await expect(page.getByTestId("rendered-shells")).toContainText(
//     "debian-extra-args",
//   );

//   // Open shell settings
//   await page.getByTestId("shell-settings-button").click();

//   // Check if the extra arguments exist
//   await expect(page.getByTestId("shell-settings-dialog")).toContainText(
//     "-e HELLO=world",
//   );
// });
