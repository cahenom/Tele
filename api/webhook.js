import fetch from "node-fetch";

const TOKEN = "7269081246:AAFz1d16iIu8nkIB-hgVA49OPXoZA9R0N-0"; // Ganti token bot kamu
const API = `https://api.telegram.org/bot${TOKEN}`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = req.body;

    if (!body || !body.message) return res.status(200).json({ ok: true });

    const chatId = body.message.chat.id;
    const text = body.message.text;

    // Cek command /start
    if (text === "/start") {
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Selamat datang! Pilih menu di bawah:",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Website", url: "https://example.com" }],
              [{ text: "Hubungi Admin", url: "https://t.me/username_admin" }],
              [{ text: "Callback", callback_data: "klik_callback" }]
            ]
          }
        })
      });
    }

    // Cek tombol callback
    if (body.callback_query) {
      const callbackId = body.callback_query.id;
      await fetch(`${API}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: "Kamu menekan tombol!"
        })
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
