import { expect, Page } from "@playwright/test";

export const loginUser = async (page: Page) => {
  await page.goto("/login");

  // Enter credentials
  await page.getByPlaceholder("Enter your username...").fill("user");
  await page.getByPlaceholder("Enter your password...").fill("password");

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Expect for the create shell form to pop up
  await expect(page.getByText("Get me a shell")).toBeVisible();
};

export const deleteShell = async (page: Page) => {
  if (await page.getByRole("button", { name: "Settings" }).isVisible()) {
    // Open the settings dialog
    await page.getByRole("button", { name: "Settings" }).click();

    // Delete the shell
    await page.getByRole("button", { name: "Delete" }).click();

    // Expect for the dialog to close
    await expect(
      page.getByRole("dialog", { name: "Shell Settings" }),
    ).not.toBeVisible();

    // Expect for the shell to be removed
    await expect(
      page.getByRole("button", { name: "Settings" }),
    ).not.toBeVisible();
  }
};
