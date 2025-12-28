import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN not found");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "✅ البوت يعمل بنجاح!\nهذا رد تجريبي."
  );
});

console.log("🤖 Bot started successfully");
