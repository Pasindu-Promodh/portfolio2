// logger.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logAction(action: string) {
  const id = localStorage.getItem("visitor_id");

  // Skip logging if on localhost
  if (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "::1"
  ) {
    console.log("Skipping logAction in localhost:", action);
    return;
  }

  console.log(`Logging action for visitor ${id}: ${action}`);
  
  if (!id) return;

  await addDoc(collection(db, "visitors", id, "logs"), {
    action,
    timestamp: serverTimestamp(),
  });
}