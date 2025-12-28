
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN not found");
    process.exit(1);
    }

    const bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, (msg) => {
      bot.sendMessage(
          msg.chat.id,
              `🤖 أهلاً بك!

              ✅ البوت يعمل بنجاح
              📊 لوحة التحكم قيد التجهيز
              ⚡ Micro‑Exploits سيتم تفعيلها قريبًا`
                );
                });

                bot.on("message", (msg) => {
                  if (msg.text !== "/start") {
                      bot.sendMessage(
                            msg.chat.id,
                                  "🟢 البوت متصل ويعمل بشكل طبيعي"
                                      );
                                        }
                                        });

                                        console.log("🤖 Bot started successfully");