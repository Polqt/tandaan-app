import { expect, test } from "@playwright/test";

test.describe("editor smoke", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Tandaan/i);
  });

  test("loads documents page", async ({ page }) => {
    await page.goto("/documents");
    await expect(page).toHaveURL(/\/(documents|sign-in)/);
  });

  test("replay page responds", async ({ page }) => {
    await page.goto("/replay/non-existent-share-id");
    await expect(page.locator("body")).toBeVisible();
  });
});

const e2eEmail = process.env.E2E_CLERK_EMAIL;
const e2ePassword = process.env.E2E_CLERK_PASSWORD;
const hasAuthCreds = Boolean(e2eEmail && e2ePassword);

test.describe("editor authenticated smoke", () => {
  test.skip(
    !hasAuthCreds,
    "Set E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD to run authenticated smoke tests.",
  );

  test("load, save, reconnect", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email address").fill(e2eEmail ?? "");
    await page.getByLabel("Password").fill(e2ePassword ?? "");
    await page.getByRole("button", { name: /continue|sign in/i }).click();

    await page.goto("/documents");
    await expect(page).toHaveURL(/\/documents/);

    const firstDoc = page.locator('a[href^="/documents/"]').first();
    if ((await firstDoc.count()) > 0) {
      await firstDoc.click();
    } else {
      await page.getByRole("button", { name: /new document/i }).first().click();
    }

    await expect(page).toHaveURL(/\/documents\/[^/]+/);

    const editor = page
      .locator(".bn-editor [contenteditable='true']")
      .first()
      .or(page.locator(".bn-editor").first());
    await expect(editor).toBeVisible();
    await editor.click();

    const testText = `e2e-${Date.now()}`;
    await page.keyboard.type(testText);

    const patchSave = page.waitForResponse(
      (res) =>
        /\/api\/documents\/[^/]+$/.test(new URL(res.url()).pathname) &&
        res.request().method() === "PATCH",
      { timeout: 15000 },
    );

    const saveResponse = await patchSave;
    expect(saveResponse.ok()).toBeTruthy();

    await page.reload();
    await expect(page).toHaveURL(/\/documents\/[^/]+/);
    await expect(editor).toBeVisible();
  });
});
