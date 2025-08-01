// useVisitor.ts
import { useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "visitor_id";

export function useVisitor() {
  useEffect(() => {
    const id = localStorage.getItem(VISITOR_ID_KEY) || uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, id);

    const docRef = doc(db, "visitors", id);
    setDoc(docRef, {
      id,
      firstVisit: serverTimestamp(),
    }, { merge: true });

    // You can trigger an email via a cloud function here
    fetch(`https://us-central1-portfolio-3431b.cloudfunctions.net/sendVisitorEmail`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    console.log(`Visitor initialized with ID: ${id}`);

  }, []);
}
