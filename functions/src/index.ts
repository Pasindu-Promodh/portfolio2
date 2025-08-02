import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import cors from "cors";

const corsHandler = cors({ origin: true });

const gmailEmail = process.env.VITE_GMAIL_EMAIL;
const gmailPass = process.env.VITE_GMAIL_PASSWORD;

if (!gmailEmail || !gmailPass) {
  throw new Error("VITE_GMAIL_EMAIL and VITE_GMAIL_PASSWORD must be set in the environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});

export const sendVisitorEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Only POST requests are allowed");
      return;
    }

    try {
      const { id } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      if (!id || typeof id !== "string") {
        res.status(400).send("Missing or invalid 'id' field");
        return;
      }

      const mailOptions = {
        from: gmailEmail,
        to: gmailEmail,
        subject: "📬 New Portfolio Visitor",
        text: `A new visitor with ID: ${id} just landed on your portfolio.`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent successfully");
    } catch (err) {
      console.error("Email send error:", err);
      res.status(500).send("Error sending email");
    }
  });
});
