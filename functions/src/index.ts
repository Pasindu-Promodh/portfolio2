// import * as functions from "firebase-functions";
// import * as nodemailer from "nodemailer";
// import cors from "cors";

// const corsHandler = cors({ origin: true });

// const gmailEmail = process.env.VITE_GMAIL_EMAIL;
// const gmailPass = process.env.VITE_GMAIL_PASSWORD;

// if (!gmailEmail || !gmailPass) {
//   throw new Error("VITE_GMAIL_EMAIL and VITE_GMAIL_PASSWORD must be set in the environment variables.");
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: gmailEmail,
//     pass: gmailPass,
//   },
// });

// export const sendVisitorEmail = functions.https.onRequest((req, res) => {
//   corsHandler(req, res, async () => {
//     if (req.method !== "POST") {
//       res.status(405).send("Only POST requests are allowed");
//       return;
//     }

//     try {
//       const { id } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

//       if (!id || typeof id !== "string") {
//         res.status(400).send("Missing or invalid 'id' field");
//         return;
//       }

//       const mailOptions = {
//         from: gmailEmail,
//         to: gmailEmail,
//         subject: "📬 New Portfolio Visitor",
//         text: `A new visitor with ID: ${id} just landed on your portfolio.\n\nhttps://pasindu-promodh.github.io/portfolio-dashboard/`,
//       };

//       await transporter.sendMail(mailOptions);
//       res.status(200).send("Email sent successfully");
//     } catch (err) {
//       console.error("Email send error:", err);
//       res.status(500).send("Error sending email");
//     }
//   });
// });



import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import nodemailer from "nodemailer";

/**
 * Secrets (set via Firebase CLI)
 * firebase functions:secrets:set GMAIL_EMAIL
 * firebase functions:secrets:set GMAIL_PASSWORD
 */
const GMAIL_EMAIL = defineSecret("GMAIL_EMAIL");
const GMAIL_PASSWORD = defineSecret("GMAIL_PASSWORD");

/**
 * Firestore trigger: emails only when a new visitor doc is created.
 * Not publicly callable, so it can't be spammed like an HTTPS endpoint.
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
    const gmailEmail = GMAIL_EMAIL.value();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail,
        pass: GMAIL_PASSWORD.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: gmailEmail,
        to: gmailEmail,
        subject: "📬 New Portfolio Visitor",
        text: `A new visitor landed on your portfolio.

Visitor ID: ${id}

Dashboard:https://pasindu-promodh.github.io/portfolio-dashboard/`,
      });
    } catch (err) {
      console.error("Send mail error:", err);
    }
  }
);
