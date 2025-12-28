import TelegramBot from "node-telegram-bot-api";

// ضع التوكن في Railway Variables → BOT_TOKEN
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN not found");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// مثال أوامر تجريبية للبوت
bot.on("message", (msg) => {
  const text = msg.text || "";
  if (text === "/start") {
    bot.sendMessage(
      msg.chat.id,
      "🤖 أهلاً بك!\n\n✅ البوت يعمل بنجاح\n📊 لوحة التحكم قيد التجهيز\n⚡ Micro‑Exploits سيتم تفعيلها قريبًا"
    );
  } else if (text === "/help") {
    bot.sendMessage(
      msg.chat.id,
      "🆘 الأوامر المتاحة:\n/start - بدء البوت\n/help - المساعدة\n/status - حالة البوت"
    );
  } else if (text === "/status") {
    bot.sendMessage(
      msg.chat.id,
      "📡 الحالة:\n🟢 البوت يعمل\n⚙️ Railway متصل\n🔐 التوكن آمن"
    );
  } else {
    bot.sendMessage(msg.chat.id, "✅ البوت يعمل بنجاح!\nهذا رد تجريبي.");
  }
});

console.log("🤖 Bot started successfully");
