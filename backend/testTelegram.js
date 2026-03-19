import { sendTelegram } from "../app/services/notifications/telegram.js";

await sendTelegram("YOUR_CHAT_ID", "🚀 Telegram test successful!");

console.log("Telegram test done");