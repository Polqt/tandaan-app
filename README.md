# Tandaan

Collaborative note-taking app built with Next.js App Router, Clerk auth, Liveblocks real-time collaboration, Firebase/Firestore, and Sentry.

## Stack

- Next.js 16
- React 19
- TypeScript
- Bun (package manager/runtime)
- Firebase + Firebase Admin
- Clerk
- Liveblocks
- Sentry

## Requirements

- Bun `1.3.6+`
- Node.js `20.9+`

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
bun run dev
bun run build
bun run start
bun run typecheck
bun run lint
bun run format
```

## Environment

Create `.env.local` from `.env.local.example` and provide values for:

- Clerk
- Firebase client SDK
- Firebase Admin service key JSON
- Liveblocks
- Sentry

Do not commit real secrets.

## Notable Paths

- `app/` App Router pages and API routes
- `proxy.ts` Clerk request proxy config
- `services/` server actions (documents, users, versions)
- `components/` UI and collaborative editor features
- `firebase.ts` and `firebase-admin.ts` Firebase initialization
- `instrumentation*.ts` and `sentry.*.config.ts` observability setup

## CI

Playwright workflow uses Bun in `.github/workflows/playwright.yml`.
