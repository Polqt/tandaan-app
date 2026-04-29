import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ServiceAccount } from "firebase-admin";
import {
  type App,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

function loadServiceKey(): ServiceAccount | null {
  // Priority 1: single JSON env var (recommended for production)
  const raw = process.env.FIREBASE_ADMIN_SERVICE_KEY;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccount;
    } catch {
      console.warn("FIREBASE_ADMIN_SERVICE_KEY is not valid JSON");
    }
  }

  // Priority 2: split env vars (useful when the platform doesn't support JSON values)
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  // Priority 3: local file (dev only — add service_key.json to .gitignore)
  const keyPath = join(process.cwd(), "service_key.json");
  if (existsSync(keyPath)) {
    try {
      return JSON.parse(readFileSync(keyPath, "utf-8")) as ServiceAccount;
    } catch {
      console.warn("Could not parse service_key.json");
    }
  }

  return null;
}

if (getApps().length === 0) {
  const serviceKey = loadServiceKey();

  if (serviceKey) {
    app = initializeApp({ credential: cert(serviceKey) });
  } else if (process.env.NODE_ENV === "production") {
    // Hard fail in production — missing credentials is a misconfiguration.
    throw new Error(
      "Firebase Admin credentials are not configured. " +
        "Set FIREBASE_ADMIN_SERVICE_KEY or the split " +
        "FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY env vars.",
    );
  } else {
    // Dev/CI: allow startup without credentials; Firestore calls will fail at runtime.
    console.warn(
      "Firebase Admin: no credentials found. Firestore API calls will fail at runtime.",
    );
    app = initializeApp();
  }
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
