const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "insta_auto_reply_123";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Instagram webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});
// Privacy Policy
app.get("/privacy", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Privacy Policy - Auto Reply IG</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          line-height: 1.6;
          color: #222;
        }
        h1, h2 { color: #111; }
      </style>
    </head>
    <body>
      <h1>Privacy Policy</h1>
      <p>Last updated: August 11, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        Auto Reply IG is an Instagram messaging application that helps
        Instagram users manage and respond to messages.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        The application may process Instagram account information,
        messages and webhook events required to provide the messaging
        functionality.
      </p>

      <h2>3. How We Use Information</h2>
      <p>
        Information is used only to provide, maintain and improve the
        application's Instagram messaging and automated reply features.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell or rent personal information. Information is not
        shared with third parties except where necessary to provide the
        requested service or comply with applicable law.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We take reasonable measures to protect information processed by
        the application.
      </p>

      <h2>6. Data Deletion</h2>
      <p>
        Users can request deletion of their data by contacting the
        application owner.
      </p>

      <h2>7. Contact</h2>
      <p>
        For privacy or data deletion requests, contact:
        <strong>priyanshsaroha7@gmail.com</strong>
      </p>
    </body>
    </html>
  `);
});

// Data Deletion Information
app.get("/data-deletion", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Deletion - Auto Reply IG</title>
    </head>
    <body style="font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;">
      <h1>Data Deletion</h1>
      <p>
        If you want your data deleted, please contact:
      </p>
      <p>
        <strong>priyanshsaroha@gmail.com</strong>
      </p>
      <p>
        Please include your Instagram username in the request so that
        we can identify the relevant account.
      </p>
    </body>
    </html>
  `);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
