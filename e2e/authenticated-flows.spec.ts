import { expect, type Page, test } from "@playwright/test";

const email = process.env.E2E_CLERK_EMAIL;
const password = process.env.E2E_CLERK_PASSWORD;

async function signIn(page: Page) {
  const userEmail = email ?? "";
  const userPassword = password ?? "";

  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(userEmail);
  await page.getByLabel(/password/i).fill(userPassword);
  await page.getByRole("button", { name: /continue|sign in/i }).click();
  await page.waitForURL(/\/documents/);
}

async function createDocument(page: Page) {
  await page.goto("/documents");
  await page
    .getByRole("button", { name: /new document/i })
    .first()
    .click();
  await page.getByRole("button", { name: /blank page/i }).click();
  await page.waitForURL(/\/documents\/[^/]+$/);
  return page.url();
}

test.describe("authenticated flows", () => {
  test.skip(
    !email || !password,
    "Set E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD to run auth flows.",
  );

  test.beforeEach(async ({ page }) => {
    if (!email || !password) {
      test.skip();
    }

    await signIn(page);
  });

  test("sign in and open documents workspace", async ({ page }) => {
    await expect(
      page.getByText(/all documents|my notes|your sketchbook/i).first(),
    ).toBeVisible();
  });

  test("create a document from the template picker", async ({ page }) => {
    await createDocument(page);

    await expect(page.getByPlaceholder(/untitled/i)).toBeVisible();
    await expect(
      page.getByText(/press '\/' for commands|start with a thought/i).first(),
    ).toBeVisible();
  });

  test("open invite dialog from the editor", async ({ page }) => {
    await createDocument(page);

    await page.getByRole("button", { name: /invite user/i }).click();
    await expect(
      page.getByRole("heading", { name: /invite a user to collaborate/i }),
    ).toBeVisible();
  });

  test("open billing page and show upgrade controls", async ({ page }) => {
    await page.goto("/billing");
    await expect(page.getByRole("heading", { name: /billing/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /upgrade to pro|cancel subscription/i }),
    ).toBeVisible();
  });

  test("open the replay drawer from a document", async ({ page }) => {
    await createDocument(page);

    await page.getByRole("button", { name: /replay/i }).click();
    await expect(
      page.getByRole("heading", { name: /collaboration replay/i }),
    ).toBeVisible();
  });

  test("open the delete dialog from a document", async ({ page }) => {
    await createDocument(page);

    await page.getByRole("button", { name: /delete document/i }).click();
    await expect(
      page.getByRole("heading", { name: /are you sure you want to delete/i }),
    ).toBeVisible();
  });

  test("move a document to trash and restore it", async ({ page }) => {
    const documentUrl = await createDocument(page);
    const roomId = documentUrl.split("/").pop();

    await page.getByRole("button", { name: /delete document/i }).click();
    await page.getByRole("button", { name: /^delete$/i }).click();

    await page.waitForURL(/\/documents\/trash$/);
    await expect(page.getByRole("heading", { name: /trash/i })).toBeVisible();
    await expect(page.getByText(/untitled/i).first()).toBeVisible();

    await page.getByRole("button", { name: /restore document/i }).click();
    await page
      .getByRole("button", { name: /restore document/i })
      .last()
      .click();

    await page.waitForURL(new RegExp(`/documents/${roomId}$`));
    await expect(page.getByLabel(/document title/i)).toBeVisible();
  });
});
