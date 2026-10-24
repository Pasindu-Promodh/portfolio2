import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {defineSecret} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import nodemailer from "nodemailer";

initializeApp();

/**
 * Secrets (set via Firebase CLI)
 * firebase functions:secrets:set GMAIL_EMAIL
 * firebase functions:secrets:set GMAIL_PASSWORD
 */
const GMAIL_EMAIL = defineSecret("GMAIL_EMAIL");
const GMAIL_PASSWORD = defineSecret("GMAIL_PASSWORD");

/** Hard cap so a flood of fake visitor docs can't exhaust the Gmail quota. */
const MAX_EMAILS_PER_DAY = 50;

/**
 * Atomically reserves one email slot for today (UTC).
 * @return {Promise<number>} the slot number, or 0 when today's cap is reached.
 */
async function reserveEmailSlot(): Promise<number> {
  const db = getFirestore();
  const day = new Date().toISOString().slice(0, 10);
  const ref = db.doc(`meta/emailQuota_${day}`);

  return db.runTransaction(async (tx) => {
    const sent = ((await tx.get(ref)).get("sent") as number | undefined) ?? 0;
    if (sent >= MAX_EMAILS_PER_DAY) return 0;
    tx.set(ref, {sent: sent + 1}, {merge: true});
    return sent + 1;
  });
}

/**
 * Firestore trigger: emails when a new visitor doc is created.
 * Visitor creation is public, so abuse is limited by Firestore rules,
 * App Check, and the daily cap above.
 */
export const onNewVisitor = onDocumentCreated(
  {
    document: "visitors/{id}",
    region: "us-central1", // must match Firestore location (nam5)
    secrets: [GMAIL_EMAIL, GMAIL_PASSWORD],
    maxInstances: 1,
  },
  async (event) => {
    const id = event.params.id;

    const slot = await reserveEmailSlot();
    if (!slot) {
      console.warn(`Daily email cap reached, skipping visitor ${id}`);
      return;
    }

    const gmailEmail = GMAIL_EMAIL.value();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail,
        pass: GMAIL_PASSWORD.value(),
      },
    });

    const capNote = slot === MAX_EMAILS_PER_DAY ?
      `\n\nDaily limit of ${MAX_EMAILS_PER_DAY} emails reached; ` +
        "further visitors today are only shown in the dashboard." :
      "";

    try {
      await transporter.sendMail({
        from: gmailEmail,
        to: gmailEmail,
        subject: "📬 New Portfolio Visitor",
        text: `A new visitor landed on your portfolio.

Visitor ID: ${id}

Dashboard: https://pasindu-promodh.github.io/portfolio-dashboard/${capNote}`,
      });
    } catch (err) {
      console.error("Send mail error:", err);
    }
  }
);
