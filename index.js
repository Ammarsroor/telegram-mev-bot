const TelegramBot = require("node-telegram-bot-api");

// استخدم متغير البيئة BOT_TOKEN
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN not found");
    process.exit(1);
    }

    // تفعيل البوت مع polling
    const bot = new TelegramBot(token, { polling: true });

    bot.on("message", (msg) => {
      bot.sendMessage(
          msg.chat.id,
              "🤖 أهلاً بك!\n\n✅ البوت يعمل بنجاح\n📊 لوحة التحكم قيد التجهيز\n⚡ Micro‑Exploits سيتم تفعيلها قريبًا"
                );
                });

                console.log("🤖 Bot started successfully");