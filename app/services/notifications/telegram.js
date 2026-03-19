const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const sendTelegram = async (chatId, message) => {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  } catch (err) {
    console.error("Telegram error:", err);
  }
};