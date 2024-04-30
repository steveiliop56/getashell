import { test, expect } from "@playwright/test";
import { loginUser } from "./fixtures/fixtures";

test("user can log in and be reditected to the app", async ({ page }) => {
  await page.goto("/login");

  // Enter credentials
  await page.getByPlaceholder("Enter your username...").fill("user");
  await page.getByPlaceholder("Enter your password...").fill("password");

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Expect for the create shell form to pop up
  await expect(
    page.getByRole("button", { name: "Get me a shell" }),
  ).toBeVisible();
});

test("user can log out", async ({ page }) => {
  await loginUser(page);
  await page.goto("/home");

  // Click logout button
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  // Expect for the login form to pop up
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
