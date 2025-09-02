const TOKEN = "7269081246:AAFz1d16iIu8nkIB-hgVA49OPXoZA9R0N-0";
const API = `https://api.telegram.org/bot${TOKEN}`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = req.body;
    console.log("Update masuk:", JSON.stringify(body, null, 2));

    // Handle pesan biasa
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      if (text === "/start") {
        await fetch(`${API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Selamat datang! Pilih menu di bawah:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🌐 Website", url: "https://example.com" }],
                [{ text: "📞 Hubungi Admin", url: "https://t.me/username_admin" }],
                [{ text: "🔘 Callback", callback_data: "klik_callback" }]
              ]
            }
          })
        });
      }
    }

    // Handle tombol callback
    if (body.callback_query) {
      const callbackId = body.callback_query.id;
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      console.log("Callback data:", data);

      await fetch(`${API}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: "Kamu menekan tombol!"
        })
      });

      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Oke, tombol callback ditekan 🚀 (data: ${data})`
        })
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error di handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
