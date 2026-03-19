import { sendEmail } from "./email.js";
import { sendTelegram } from "./telegram.js";

export const sendAlert = async (user, alert) => {
  const message = `
ALERT: ${alert.endpoint}
Status: ${alert.status}
Time: ${new Date().toISOString()}
`;

  if (user.emailEnabled) {
    await sendEmail({
      to: user.email,
      subject: "Sentinel Alert ",
      message,
    });
  }

  if (user.telegramEnabled && user.telegramChatId) {
    await sendTelegram(user.telegramChatId, message);
  }
};