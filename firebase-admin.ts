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
  const raw = process.env.FIREBASE_ADMIN_SERVICE_KEY;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccount;
    } catch {
      console.warn("FIREBASE_ADMIN_SERVICE_KEY is not valid JSON");
    }
  }

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
  } else {
    // Firebase Functions provides application default credentials at runtime.
    // Local development can also use ADC via `gcloud auth application-default login`.
    app = initializeApp();
  }
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
