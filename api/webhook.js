import fetch from "node-fetch";

const TOKEN = "7269081246:AAEdbP66OLb34-5NaTaXstHz897Bovhj-V8";
const API = `https://api.telegram.org/bot${TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const message = req.body.message;
  if (!message) return res.status(200).end();

  const chatId = message.chat.id;
  const text = message.text;

  if (text === "/start") {
    await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Selamat datang! Pilih menu di bawah ini:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Website", url: "https://example.com" }],
            [{ text: "Hubungi Admin", url: "https://t.me/username_admin" }],
            [{ text: "Callback", callback_data: "klik_callback" }]
          ]
        }
      }),
    });
  }

  res.status(200).end();
}
