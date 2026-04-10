# Tandaan

A realtime collaborative document editor where teams capture not just *what* they wrote — but *how* and *why* it evolved.

Built with **Next.js 16**, **BlockNote**, **Liveblocks (Yjs)**, **Firebase/Firestore**, and **Clerk**.

---

## Core Pillars

| Pillar | Description |
|---|---|
| **Live Collaborative Editor** | Multiple users edit simultaneously with live cursors, presence indicators, and conflict-free Yjs CRDT merging |
| **Automatic Replay Timeline** | Every 30 seconds of editing snapshots the document state, computes a structural diff, and stores it as a versioned checkpoint — automatically |
| **Public Replay Sharing** | Any owner can generate a `/replay/[shareId]` link — a read-only, unauthenticated viewer showing the full editing story chapter by chapter |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Editor | BlockNote + `@liveblocks/react-blocknote` |
| Realtime | Liveblocks (Yjs CRDT, presence, threads) |
| Database | Firebase Firestore (Admin SDK server-side only) |
| Auth | Clerk |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Validation | Zod |
| Error monitoring | Sentry |
| Package manager | Bun |

---

## Project Structure

```
tandaan-app/
├── app/
│   ├── api/
│   │   ├── auth-endpoint/      # Liveblocks room auth (POST)
│   │   ├── clerk-webhook/      # Clerk user.created webhook (POST)
│   │   ├── documents/          # Document CRUD, versions, replay-share
│   │   ├── rooms/              # Room list + collaborators
│   │   └── users/              # Clerk user resolution by ID or email
│   ├── (auth)/                 # Sign-in / sign-up pages
│   ├── documents/[id]/         # Live editor page
│   └── replay/[shareId]/       # Public replay viewer (no auth required)
├── components/
│   ├── documents/              # Editor, version timeline, toolbar
│   └── user/                   # InviteUser, ManageUsers dialogs
├── hooks/
│   ├── useDocument.ts          # Fetch + optimistic-update a document
│   ├── useRooms.ts             # Fetch the current user's room list
│   └── useRoomUsers.ts         # Fetch collaborators in a room
├── lib/
│   ├── api-utils.ts            # requireAuth, apiErrorResponse, apiSuccessResponse
│   ├── liveblocks.ts           # Liveblocks server client + resolveUsers
│   ├── schemas.ts              # Zod schemas + parseBody helper
│   ├── stringToColor.ts        # Deterministic color from string
│   ├── timestamp-utils.ts      # Firestore Timestamp → ISO string
│   └── version-utils.ts        # Block diff, preview text, replay index
├── services/
│   ├── actions.ts              # createNewDocument, deleteDocument, restoreDocument
│   ├── replay.ts               # Timeline fetch, share token generation
│   └── users.ts                # searchUsers, inviteUser, removeUser, getRoomUsers
├── types/                      # Shared TypeScript interfaces
├── firestore.rules             # Firestore security rules (deploy with Firebase CLI)
├── firestore.indexes.json      # Composite index definitions
├── firebase.ts                 # Client SDK (read-only)
├── firebase-admin.ts           # Admin SDK (all server writes)
├── liveblocks.config.ts        # Liveblocks global type declarations
└── middleware.ts               # Clerk route protection
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) `>= 1.3.6`
- Node.js `>= 20.9`
- A [Firebase](https://console.firebase.google.com) project with Firestore enabled
- A [Clerk](https://clerk.com) application
- A [Liveblocks](https://liveblocks.io) account

### 1. Clone and install

```bash
git clone https://github.com/your-username/tandaan-app.git
cd tandaan-app
bun install
```

### 2. Environment variables

Create `.env.local` at the project root:

```env
# ── Clerk ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...      # Clerk dashboard → Webhooks → signing secret

# ── Firebase client SDK (safe to expose publicly) ────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# ── Firebase Admin (server-side only — never expose) ─────────────────────────
# Recommended: single JSON blob
FIREBASE_ADMIN_SERVICE_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n..."}

# Alternative: split vars (useful when the platform doesn't support multi-line JSON)
# FIREBASE_ADMIN_PROJECT_ID=
# FIREBASE_ADMIN_CLIENT_EMAIL=
# FIREBASE_ADMIN_PRIVATE_KEY=       # paste the key with literal \n for newlines

# ── Liveblocks ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
LIVEBLOCKS_PRIVATE_KEY=sk_...

# ── Sentry (optional but recommended) ───────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

> **Never commit `.env.local` or `service_key.json`.**
> Both are already in `.gitignore`.

### 3. Deploy Firestore rules and indexes

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore
```

### 4. Set up the Clerk webhook

In the Clerk dashboard → **Webhooks**, create an endpoint:

```
https://your-domain.com/api/clerk-webhook
```

Subscribe to the `user.created` event and paste the **signing secret** into `CLERK_WEBHOOK_SECRET`.

### 5. Run locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Firestore Data Model

```
documents/{roomId}
  title: string
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
  replayShareId?: string       # set when owner generates a public share
  replaySharedAt?: Timestamp
  replaySharedBy?: string

  versions/{versionId}         # auto-created every 30s of editing
    content: string
    timeStamp: Timestamp
    userId: string
    summary: {
      addedBlocks: number
      updatedBlocks: number
      removedBlocks: number
    }

users/{userId}
  email: string
  firstName: string
  lastName: string
  createdAt: Timestamp

  rooms/{roomId}               # one entry per document the user can access
    userId: string
    role: "owner" | "editor"
    roomId: string
    createdAt: Timestamp

trash/{roomId}                 # soft-delete; expires after 30 days
  ...document fields
  deleteAt: Timestamp
  expiresAt: Timestamp
  userId: string
  roomId: string
```

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth-endpoint` | Required | Liveblocks room authentication |
| `POST` | `/api/clerk-webhook` | Svix signature | Sync new Clerk user to Firestore |
| `GET` | `/api/documents` | Required | List current user's documents |
| `GET` | `/api/documents/[id]` | Required | Fetch document with role |
| `PATCH` | `/api/documents/[id]` | Required | Update title |
| `GET` | `/api/documents/[id]/versions` | Required | Fetch full replay timeline |
| `POST` | `/api/documents/[id]/versions` | Required | Create a version snapshot |
| `POST` | `/api/documents/[id]/replay-share` | Required | Generate public share token |
| `GET` | `/api/rooms` | Required | List rooms with document metadata |
| `GET` | `/api/rooms/[roomId]/users` | Required | List collaborators |
| `GET` | `/api/users?userIds=...` | None | Resolve Clerk IDs/emails to profiles |

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables under **Vercel → Project → Settings → Environment Variables**.

**Tip for `FIREBASE_ADMIN_SERVICE_KEY` on Vercel:** paste the entire JSON as a single line. Vercel stores it verbatim — the app will parse it with `JSON.parse`.

### Post-deploy checklist

- [ ] `firebase deploy --only firestore` (rules + indexes)
- [ ] Clerk webhook URL updated to production domain
- [ ] All env vars set in production environment
- [ ] Sentry DSN configured
- [ ] Create a test document end-to-end, verify replay share works

---

## Scripts

```bash
bun dev          # Start dev server (http://localhost:3000)
bun build        # Production build
bun start        # Start production server
bun typecheck    # TypeScript check with no emit
bun lint         # Biome lint
bun format       # Biome format (writes files)
```

---

## Security Notes

- **All Firestore writes go through the Admin SDK** — the client SDK is initialized read-only and Firestore rules block all direct client writes.
- **Webhook verification** — the Clerk webhook at `/api/clerk-webhook` verifies the `svix-signature` header before touching Firestore.
- **Input validation** — every API route that accepts a body uses Zod schemas (`lib/schemas.ts`).
- **Ownership checks** — delete, restore, and invite operations verify the requester's role in Firestore before executing.

---

## Contributing

1. Fork and branch off `main`
2. Run `bun typecheck && bun lint` before opening a PR
3. One feature or fix per PR — keep diffs reviewable
