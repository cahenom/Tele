<?php
// Ganti dengan token bot kamu
$TOKEN = "7269081246:AAFz1d16iIu8nkIB-hgVA49OPXoZA9R0N-0";
$API = "https://api.telegram.org/bot$TOKEN/";

// Ambil update dari Telegram (POST JSON)
$update = json_decode(file_get_contents("php://input"), true);

// Cek apakah ada pesan masuk
if (isset($update["message"])) {
    $chatId = $update["message"]["chat"]["id"];
    $text   = $update["message"]["text"];

    // Kalau user kirim /start
    if (strpos($text, "/start") === 0) {
        $replyMarkup = [
            "inline_keyboard" => [
                [ ["text" => "Website", "url" => "https://example.com"] ],
                [ ["text" => "Hubungi Admin", "url" => "https://t.me/username_admin"] ],
                [ ["text" => "Callback", "callback_data" => "klik_callback"] ]
            ]
        ];

        file_get_contents($API . "sendMessage?" . http_build_query([
            "chat_id"      => $chatId,
            "text"         => "Selamat datang! Pilih menu di bawah:",
            "reply_markup" => json_encode($replyMarkup)
        ]));
    }
}

// Kalau ada tombol callback ditekan
if (isset($update["callback_query"])) {
    $callbackId = $update["callback_query"]["id"];
    $chatId     = $update["callback_query"]["message"]["chat"]["id"];

    // Jawab callback biar ga loading terus
    file_get_contents($API . "answerCallbackQuery?" . http_build_query([
        "callback_query_id" => $callbackId,
        "text" => "Kamu menekan tombol!"
    ]));

    // Kirim pesan tambahan
    file_get_contents($API . "sendMessage?" . http_build_query([
        "chat_id" => $chatId,
        "text"    => "Callback diterima ✅"
    ]));
}
