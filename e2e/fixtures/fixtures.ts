import { expect, Page } from "@playwright/test";

export const loginUser = async (page: Page) => {
  await page.goto("/login");

  // Enter credentials
  await page.getByPlaceholder("Enter your username...").fill("user");
  await page.getByPlaceholder("Enter your password...").fill("password");

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Expect for the create shell form to pop up
  await expect(page.getByTestId("logout-button")).toBeVisible();
};
