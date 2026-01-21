// logger.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logAction(
  action: string,
  metadata?: Record<string, any>
) {
  const id = localStorage.getItem("visitor_id");

  if (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "::1"
  ) {
    console.log("Skipping logAction in localhost:", action);
    return;
  }

  if (!id) return;

  const logEntry = {
    action,
    timestamp: serverTimestamp(),
    ...(metadata || {}),
  };

  // console.log(`Logging action for visitor ${id}:`, logEntry);

  await addDoc(collection(db, "visitors", id, "logs"), logEntry);
}
