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

export const createShell = async (page: Page) => {
  await page.goto("/");

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
};
