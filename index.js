const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

console.log(process.env.SERVER_URL);
console.log(process.env.TELEGRAM_BOT_TOKEN);
console.log(process.env.TELEGRAM_CHAT_ID);

// Your details
// const SERVER_URL = process.env.SERVER_URL; // ⬅️ change this
// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Send Telegram alert
async function notifyTelegram(message) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }
    );
    console.log("Telegram alert sent!");
  } catch (err) {
    console.error("Failed to send telegram alert:", err.message);
  }
}

// Check server health
async function checkServer() {
  console.log("Checking server...");

  try {
    const res = await axios.get(SERVER_URL, { timeout: 5000 }); // 5 sec timeout

    if (res.status === 200) {
      console.log("Server is UP ✔️");
    } else {
      await notifyTelegram(`⚠️ WARNING: Server returned status ${res.status}`);
    }
  } catch (err) {
    console.log("Server is DOWN ❌");
    await notifyTelegram(
      `🚨 ALERT: Your server is DOWN!\nURL: ${SERVER_URL}\nError: ${err.message}`
    );
  }
}

// Run every 10 seconds
cron.schedule("*/10 * * * * *", () => {
  checkServer();
});

// Run immediately when file starts
checkServer();
