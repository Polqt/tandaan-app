import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (getApps().length === 0) {
  const serviceKey = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_KEY || "{}");
  
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
