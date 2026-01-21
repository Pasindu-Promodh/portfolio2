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



import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import nodemailer from "nodemailer";
import cors from "cors";

/**
 * Secrets (set via Firebase CLI)
 * firebase functions:secrets:set GMAIL_EMAIL
 * firebase functions:secrets:set GMAIL_PASSWORD
 */
const GMAIL_EMAIL = defineSecret("GMAIL_EMAIL");
const GMAIL_PASSWORD = defineSecret("GMAIL_PASSWORD");

/**
 * HTTPS Function
 */
export const sendVisitorEmail = onRequest(
  {
    region: "asia-south1", // closer to Sri Lanka, lower latency
    secrets: [GMAIL_EMAIL, GMAIL_PASSWORD],
  },
  (req, res) => {
    const corsHandler = cors({ origin: true });

    corsHandler(req, res, async () => {
      // Method guard
      if (req.method !== "POST") {
        res.status(405).send("Only POST requests allowed");
        return;
      }

      // Read secrets at runtime
      const gmailEmail = GMAIL_EMAIL.value();
      const gmailPass = GMAIL_PASSWORD.value();

      if (!gmailEmail || !gmailPass) {
        res.status(500).send("Email secrets not configured");
        return;
      }

      // Create transporter INSIDE handler (safe for cold starts)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailEmail,
          pass: gmailPass,
        },
      });

      try {
        const body =
          typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        const { id } = body ?? {};

        if (!id || typeof id !== "string") {
          res.status(400).send("Missing or invalid 'id'");
          return;
        }

        await transporter.sendMail({
          from: gmailEmail,
          to: gmailEmail,
          subject: "📬 New Portfolio Visitor",
          text: `A new visitor landed on your portfolio.\n\nVisitor ID: ${id}\n\nDashboard:\nhttps://pasindu-promodh.github.io/portfolio-dashboard/`,
        });

        res.status(200).send("Email sent successfully");
      } catch (err) {
        console.error("Send mail error:", err);
        res.status(500).send("Failed to send email");
      }
    });
  }
);
