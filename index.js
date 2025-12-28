import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const RAILWAY_URL = process.env.RAILWAY_URL;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !RAILWAY_URL) {
  console.error("❌ BOT_TOKEN أو RAILWAY_URL غير موجود");
    process.exit(1);
    }

    const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
    const WEBHOOK_URL = `${RAILWAY_URL}/webhook`;

    app.post("/webhook", async (req, res) => {
      const update = req.body;

        if (update.message) {
            const chatId = update.message.chat.id;
                const text = update.message.text || "";

                    await fetch(`${TELEGRAM_API}/sendMessage`, {
                          method: "POST",
                                headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                              chat_id: chatId,
                                                      text: `🤖 البوت يعمل\n📩 رسالتك: ${text}`,
                                                            }),
                                                                });
                                                                  }

                                                                    res.sendStatus(200);
                                                                    });

                                                                    app.get("/", (req, res) => {
                                                                      res.send("🤖 Telegram MEV Bot is running");
                                                                      });

                                                                      app.listen(PORT, async () => {
                                                                        console.log(`🚀 Server running on port ${PORT}`);

                                                                          await fetch(`${TELEGRAM_API}/setWebhook`, {
                                                                              method: "POST",
                                                                                  headers: { "Content-Type": "application/json" },
                                                                                      body: JSON.stringify({ url: WEBHOOK_URL }),
                                                                                        });

                                                                                          console.log("✅ Webhook set:", WEBHOOK_URL);
                                                                                          });