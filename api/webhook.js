const TOKEN = process.env.TELEGRAM_TOKEN || "7269081246:AAFz1d16iIu8nkIB-hgVA49OPXoZA9R0N-0";
const API = `https://api.telegram.org/bot${TOKEN}`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;
    console.log("Update diterima:", JSON.stringify(body, null, 2));

    // Handle pesan masuk
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text || "";

      // Biar lebih fleksibel, cek prefix
      if (text.startsWith("/start")) {
        const response = await fetch(`${API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Selamat datang! Pilih menu di bawah:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🌐 Website", url: "https://example.com" }],
                [{ text: "📩 Hubungi Admin", url: "https://t.me/username_admin" }],
                [{ text: "🔘 Callback", callback_data: "klik_callback" }]
              ]
            }
          })
        });

        const data = await response.json();
        console.log("Respon Telegram:", data);
      }
    }

    // Handle tombol callback
    if (body.callback_query) {
      const callbackId = body.callback_query.id;
      const chatId = body.callback_query.message.chat.id;

      // Balas notifikasi kecil di Telegram
      await fetch(`${API}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: "Kamu menekan tombol!"
        })
      });

      // Kirim pesan tambahan
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Callback data: ${body.callback_query.data}`
        })
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
