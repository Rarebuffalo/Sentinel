import { sendAlert } from "../app/services/notifications/index.js";


const fakeUser = {
  email: "YOUR_EMAIL@gmail.com",
  emailEnabled: true,
  telegramEnabled: true,
  telegramChatId: "YOUR_CHAT_ID",
};

const fakeAlert = {
  endpoint: "https://api.test.com",
  status: "DOWN",
};

await sendAlert(fakeUser, fakeAlert);

console.log("Full alert test done - check your email and Telegram!");