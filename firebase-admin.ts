import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

type ServiceKey = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function loadServiceKey(): ServiceKey | null {
  // Priority 1: single JSON env var (preferred for production)
  const raw = process.env.FIREBASE_ADMIN_SERVICE_KEY;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceKey;
    } catch {
      console.warn("FIREBASE_ADMIN_SERVICE_KEY is not valid JSON");
    }
  }

  // Priority 2: split env vars (useful for platforms that don't support JSON values)
  const project_id =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (project_id && client_email && private_key) {
    return { project_id, client_email, private_key };
  }

  // Priority 3: local file (development only — never commit this file)
  const keyPath = join(process.cwd(), "service_key.json");
  if (existsSync(keyPath)) {
    try {
      return JSON.parse(readFileSync(keyPath, "utf-8")) as ServiceKey;
    } catch {
      console.warn("Could not parse service_key.json");
    }
  }

  return null;
}

if (getApps().length === 0) {
  const serviceKey = loadServiceKey();

  if (serviceKey?.project_id) {
    app = initializeApp({ credential: cert(serviceKey) });
  } else if (process.env.NODE_ENV === "production") {
    // Hard fail in production — a missing service key is a misconfiguration,
    // not something we should silently swallow.
    throw new Error(
      "Firebase Admin credentials are not configured. " +
      "Set FIREBASE_ADMIN_SERVICE_KEY or the split FIREBASE_ADMIN_PROJECT_ID / " +
      "FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY env vars.",
    );
  } else {
    // Dev/test: allow startup without credentials so `next build` doesn't
    // fail when env vars aren't present locally.
    console.warn(
      "Firebase Admin: no credentials found. API calls requiring Firestore will fail at runtime.",
    );
    app = initializeApp();
  }
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
