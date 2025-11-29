# Tandaan

A collaborative note-taking app built with Next.js, Clerk (auth), Liveblocks (real-time), and Firebase.

This repository contains the web application, server routes, and UI primitives used to create, share, and collaboratively edit documents in real time.

## Quick start

Requirements:
- Node.js 18+
- npm / pnpm / yarn

Install and run locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

See available scripts in `package.json`.

## Environment & secrets

- You can keep sensitive values private. Locally, put secrets in a file named `.env.local` (this file should be listed in `.gitignore`).
- If you prefer not to share actual secret values in the repo, add a `.env.local.example` containing only placeholder names (no real secrets) — this repository now includes that file.
- The Firebase admin service key is provided by `service_key.json`; treat it as a secret and do not commit it to public repositories.
- For deployments (Vercel, Netlify, etc.) set equivalent environment variables using the platform's secret UI instead of committing them.

If you'd like, I can add the project to `.gitignore` to ensure `service_key.json` and `.env.local` are excluded. I can also expand `.env.local.example` with additional variable names used in the codebase.

## Notable files

- `app/layout.tsx` — app shell and layout
- `app/api/*` — server routes (auth, rooms, users, documents)
- `components/sidebar.tsx` — left navigation UI
- `components/documents/*` — document UI, editor, version history
- `components/providers/*` — Liveblocks and other providers
- `services/*.ts` — server-side helpers and actions (create/delete/restore documents)
- `lib/liveblocks.ts` — Liveblocks server helpers
- `firebase.ts`, `firebase-admin.ts` — Firebase client and admin initialization
- `middleware.ts` — request middleware and auth checks

## Testing

Playwright is configured for E2E tests. Run tests with:

```bash
npx playwright test
```

E2E and test examples are in the `e2e/` and `tests/` directories.

## Observability

Sentry is included for client and server error reporting. See `sentry.server.config.ts`, `sentry.edge.config.ts`, and instrumentation files.

## Build & deploy

Build and start for production:

```bash
npm run build
npm run start
```

This project is ready to deploy on Vercel or similar platforms — ensure all environment variables (Clerk, Firebase, Liveblocks, Sentry) are configured in your deployment.

## Contributing

Open issues and pull requests. Keep secrets out of commits and follow the existing TypeScript + Tailwind conventions.

---

If you want, I can also add a `.env.local.example` showing the expected variable names or update `package.json` scripts. Want me to do that next?
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
