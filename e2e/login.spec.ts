import { test, expect } from "@playwright/test";
import { loginUser } from "./fixtures/fixtures";
import { addUser, clearDatabase } from "./helpers/db";

test("user can sign up and be redirected to the app", async ({ page }) => {
  await clearDatabase();
  await page.goto("/signup");

  // Enter credentials
  await page.getByPlaceholder("Enter your username...").fill("user");
  await page.getByPlaceholder("Enter your password...").fill("password");
  await page.getByPlaceholder("Enter your password again...").fill("password");

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Expect for the create shell form to pop up
  await expect(page.getByTestId("logout-button")).toBeVisible();
});

test("user can log in and be reditected to the app", async ({ page }) => {
  await clearDatabase();
  await addUser();
  await page.goto("/login");

  // Enter credentials
  await page.getByPlaceholder("Enter your username...").fill("user");
  await page.getByPlaceholder("Enter your password...").fill("password");

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Expect for the create shell form to pop up
  await expect(page.getByTestId("logout-button")).toBeVisible();
});

test("user can log out", async ({ page }) => {
  await loginUser(page);
  await page.goto("/");

  // Click logout button
  await page.getByTestId("logout-button").click();

  // Expect for the login form to pop up
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
