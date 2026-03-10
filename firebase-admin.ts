import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

function loadServiceKeyFromEnv() {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_KEY;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    console.warn("Invalid FIREBASE_ADMIN_SERVICE_KEY JSON. Falling back to default admin credentials.");
    return null;
  }
}

function loadServiceKeyFromSplitEnv() {
  const project_id =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!project_id || !client_email || !private_key) {
    return null;
  }

  return {
    project_id,
    client_email,
    private_key,
  };
}

function loadServiceKeyFromFile() {
  const keyPath = join(process.cwd(), "service_key.json");
  if (!existsSync(keyPath)) {
    return null;
  }

  try {
    const fileContents = readFileSync(keyPath, "utf-8");
    return JSON.parse(fileContents);
  } catch {
    console.warn("Unable to parse service_key.json. Falling back to default admin credentials.");
    return null;
  }
}

if (getApps().length === 0) {
  const serviceKey =
    loadServiceKeyFromEnv() ??
    loadServiceKeyFromSplitEnv() ??
    loadServiceKeyFromFile();

  if (serviceKey?.project_id) {
    app = initializeApp({
      credential: cert(serviceKey),
    });
  } else {
    // Keep initialization non-fatal at build time. Runtime auth still requires valid credentials.
    app = initializeApp();
  }
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
