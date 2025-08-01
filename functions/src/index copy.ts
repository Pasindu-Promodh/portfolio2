import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Load from environment
// const gmailEmail = process.env.GMAIL_EMAIL;
// const gmailPass = process.env.GMAIL_PASSWORD;

const gmailEmail = "pasindugunathilaka96@gmail.com";
const gmailPass = "jnng hamz joom friy";

if (!gmailEmail || !gmailPass) {
  throw new Error("GMAIL_EMAIL and GMAIL_PASSWORD must be set in the environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});

export const sendVisitorEmail = functions.https.onRequest(async (req, res) => {
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
