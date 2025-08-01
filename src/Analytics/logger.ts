// logger.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logAction(action: string) {
  const id = localStorage.getItem("visitor_id");

  console.log(`Logging action for visitor ${id}: ${action}`);
  
  if (!id) return;

  

  await addDoc(collection(db, "visitors", id, "logs"), {
    action,
    timestamp: serverTimestamp(),
  });
}
