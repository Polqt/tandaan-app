import { expect, test } from "@playwright/test";

test("landing page renders primary navigation and CTA", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /tandaan/i })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /open workspace|get started/i }),
  ).toBeVisible();
});

test("pricing page renders plan comparison", async ({ page }) => {
  await page.goto("/pricing");

  await expect(
    page.getByRole("heading", { name: /pricing|plans/i }),
  ).toBeVisible();
  await expect(page.getByText(/pro/i).first()).toBeVisible();
});

test("docs index responds", async ({ page }) => {
  await page.goto("/docs");

  await expect(page).toHaveURL(/\/docs/);
  await expect(page.locator("body")).toContainText(
    /docs|overview|get started/i,
  );
});

test("health endpoint reports service status", async ({ request }) => {
  const response = await request.get("/api/health");
  const payload = (await response.json()) as { status?: string };

  expect(response.ok()).toBeTruthy();
  expect(payload.status).toBe("ok");
});
