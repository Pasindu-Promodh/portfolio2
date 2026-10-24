import { v4 as uuidv4 } from "uuid";
import { getDb } from "./firebase";
import { GA_MEASUREMENT_ID, isTrackingEnabled } from "./consent";
import { readStorage, writeStorage } from "./storage";

const VISITOR_ID_KEY = "visitor_id";
const REGISTERED_KEY = "visitor_registered";

// Resolved at module load (before any component effect runs) so the very
// first page view of a new visitor already has an ID to log against.
const visitorId = readStorage(VISITOR_ID_KEY) ?? uuidv4();
writeStorage(VISITOR_ID_KEY, visitorId);

let registration: Promise<void> | undefined;

// Creates visitors/{id} once. Creating it triggers the onNewVisitor email.
function ensureVisitor(): Promise<void> {
  registration ??= (async () => {
    if (readStorage(REGISTERED_KEY)) return;

    const db = await getDb();
    const { doc, setDoc, serverTimestamp } = await import(
      "firebase/firestore/lite"
    );
    try {
      await setDoc(doc(db, "visitors", visitorId), {
        id: visitorId,
        firstVisit: serverTimestamp(),
      });
    } catch (err) {
      // Rules only allow creating the doc, so an existing visitor
      // (from before this flag existed) is rejected with permission-denied.
      if ((err as { code?: string }).code !== "permission-denied") throw err;
    }
    writeStorage(REGISTERED_KEY, "1");
  })().catch((err) => {
    registration = undefined; // retry on the next action
    throw err;
  });
  return registration;
}

export function logAction(
  action: string,
  metadata?: { projectId?: number; projectName?: string }
) {
  if (!isTrackingEnabled()) return;

  (async () => {
    await ensureVisitor();
    const db = await getDb();
    const { collection, addDoc, serverTimestamp } = await import(
      "firebase/firestore/lite"
    );
    await addDoc(collection(db, "visitors", visitorId, "logs"), {
      action,
      timestamp: serverTimestamp(),
      ...metadata,
    });
  })().catch((err) => console.warn("Analytics error:", err));
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGoogleAnalytics() {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the Arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

export function initAnalytics() {
  if (!isTrackingEnabled()) return;

  const start = () => {
    loadGoogleAnalytics();
    ensureVisitor().catch((err) => console.warn("Analytics error:", err));
  };
  if ("requestIdleCallback" in window) requestIdleCallback(start);
  else setTimeout(start, 1);
}
