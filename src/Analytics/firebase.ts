import type { Firestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let dbPromise: Promise<Firestore> | undefined;

// Firebase is loaded on demand so it stays out of the initial bundle.
// Firestore Lite is enough here: the site only does one-off writes.
export function getDb(): Promise<Firestore> {
  dbPromise ??= (async () => {
    const [{ initializeApp }, { getFirestore }] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore/lite"),
    ]);
    const app = initializeApp(firebaseConfig);

    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaKey) {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import(
        "firebase/app-check"
      );
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey),
        isTokenAutoRefreshEnabled: true,
      });
    }

    return getFirestore(app);
  })();
  return dbPromise;
}
