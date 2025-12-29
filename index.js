import TelegramBot from "node-telegram-bot-api";

// تأكد أن BOT_TOKEN موجود في متغيرات البيئة في Railway
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN غير موجود في متغيرات البيئة!");
  process.exit(1);
}

// تفعيل البوت مع الاستطلاع
const bot = new TelegramBot(token, { polling: true });

// عند استقبال أي رسالة
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  // الأوامر
  if (text === "/start") {
    bot.sendMessage(
      chatId,
      `🤖 أهلاً بك!\n\n✅ البوت يعمل بنجاح\n📊 لوحة التحكم قيد التجهيز\n⚡ Micro‑Exploits سيتم تفعيلها قريبًا`
    );
  } else if (text === "/help") {
    bot.sendMessage(
      chatId,
      `🆘 الأوامر المتاحة:\n/start - بدء البوت\n/help - المساعدة\n/status - حالة البوت`
    );
  } else if (text === "/status") {
    bot.sendMessage(
      chatId,
      `📡 الحالة:\n🟢 البوت يعمل\n⚙️ Railway متصل\n🔐 التوكن آمن`
    );
  } else {
    // أي رسالة أخرى
    bot.sendMessage(chatId, "⚠️ لم يتم التعرف على هذا الأمر، استخدم /help لعرض الأوامر.");
  }
});

console.log("🤖 Bot started successfully");
