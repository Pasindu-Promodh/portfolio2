import { useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "visitor_id";

export function useVisitor() {
  useEffect(() => {
    const id = localStorage.getItem(VISITOR_ID_KEY) || uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, id);

    const isLocalhost =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "::1";

    if (isLocalhost) {
      console.log(`Skipping visitor tracking in localhost for ID: ${id}`);
      return;
    }

    const docRef = doc(db, "visitors", id);

    getDoc(docRef).then((docSnap) => {
      if (!docSnap.exists()) {
        // Only set firstVisit if document is new
        setDoc(docRef, {
          id,
          firstVisit: serverTimestamp(),
        });
        console.log(`New visitor tracked: ${id}`);
      } else {
        console.log(`Returning visitor: ${id}`);
      }

      // Always send email
      fetch(`https://us-central1-portfolio-3431b.cloudfunctions.net/sendVisitorEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    });
  }, []);
}
