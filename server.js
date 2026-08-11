const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "insta_auto_reply_123";

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const API_VERSION = process.env.API_VERSION || "v24.0";

// =========================
// HOME
// =========================
app.get("/", (req, res) => {
  res.send("Instagram Auto Reply API is running ✅");
});

// =========================
// PRIVACY POLICY
// =========================
app.get("/privacy-policy", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy - Auto Reply IG</title>
</head>
<body style="font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6">

<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> August 11, 2026</p>

<h2>1. Introduction</h2>
<p>
Auto Reply IG is an application that helps users manage and respond to
Instagram messages and interactions.
</p>

<h2>2. Information We Collect</h2>
<p>
We may process information required to provide the service, including
Instagram account information, messages, comments and related interaction data.
</p>

<h2>3. How We Use Information</h2>
<p>
Information is used to provide and operate the application's Instagram
messaging and auto-reply features.
</p>

<h2>4. Data Sharing</h2>
<p>
We do not sell personal information. Information is not shared with third
parties except where necessary to provide the service or comply with legal
requirements.
</p>

<h2>5. Data Security</h2>
<p>
We take reasonable measures to protect information handled by the application.
</p>

<h2>6. Data Deletion</h2>
<p>
Users can request deletion of their data by visiting our
<a href="/data-deletion">Data Deletion page</a>.
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

// =========================
// DATA DELETION
// =========================
app.get("/data-deletion", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Deletion - Auto Reply IG</title>
</head>
<body style="font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6">

<h1>Data Deletion</h1>

<p>If you want your data deleted, please contact:</p>

<p><strong>priyanshsaroha7@gmail.com</strong></p>

<p>
Please include your Instagram username so we can identify the relevant account.
</p>

</body>
</html>
  `);
});

// =========================
// WEBHOOK VERIFICATION
// =========================
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

// =========================
// SEND INSTAGRAM REPLY
// =========================
async function sendInstagramReply(igUserId, recipientId, text) {
  if (!IG_ACCESS_TOKEN) {
    console.error("❌ IG_ACCESS_TOKEN is missing");
    return;
  }

  const url =
    `https://graph.instagram.com/${API_VERSION}/${igUserId}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${IG_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipient: {
          id: recipientId
        },
        message: {
          text: text
        }
      })
    });

    const data = await response.json();

    console.log("Instagram reply API response:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Reply failed:", response.status);
    } else {
      console.log("✅ Auto reply sent");
    }

  } catch (error) {
    console.error("❌ Reply request error:", error);
  }
}

// =========================
// INSTAGRAM WEBHOOK
// =========================
app.post("/webhook", async (req, res) => {
  console.log("Instagram webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  // Respond to Meta immediately
  res.sendStatus(200);

  try {
    const entries = req.body.entry || [];

    for (const entry of entries) {
      const messagingEvents = entry.messaging || [];

      for (const event of messagingEvents) {

        // Ignore events without a message
        if (!event.message) continue;

        // Ignore echo/self messages
        if (event.message.is_echo === true) continue;

        const senderId = event.sender?.id;
        const igUserId = event.recipient?.id;
        const incomingText = event.message?.text || "";

        if (!senderId || !igUserId) {
          console.log("⚠️ Sender or Instagram user ID missing");
          continue;
        }

        console.log("👤 Sender:", senderId);
        console.log("💬 Message:", incomingText);

        // =========================
        // AUTO REPLY
        // =========================

        let replyText =
          "Hi 👋 Thanks for messaging 24o.in! How can I help you?";

        if (incomingText.toLowerCase().trim() === "hi" ||
            incomingText.toLowerCase().trim() === "hello" ||
            incomingText.toLowerCase().trim() === "hey") {

          replyText =
            "Hey 👋 Welcome to 24o.in! How can I help you?";
        }

        await sendInstagramReply(
          igUserId,
          senderId,
          replyText
        );
      }
    }

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
  }
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
