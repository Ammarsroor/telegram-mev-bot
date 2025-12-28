// استدعاء مكتبة Telegram Bot
const TelegramBot = require('node-telegram-bot-api');

// قراءة التوكن من المتغيرات البيئية
const token = process.env.BOT_TOKEN;

// التحقق من وجود التوكن
if (!token) {
  console.error("❌ BOT_TOKEN غير موجود. الرجاء التأكد من إعداد المتغيرات البيئية!");
        process.exit(1);
                  }

                                // إنشاء بوت مع وضع polling
                                                  const bot = new TelegramBot(token, { polling: true });

                                                                        // الرد على أي رسالة واردة
                                                                                                  bot.on("message", (msg) => {
                                                                                                                                  bot.sendMessage(
                                                                                                                                                                            msg.chat.id,
                                                                                                                                                                                                                                    "🤖 أهلاً بك!\n✅ البوت يعمل بنجاح!\n📊 هذا رد تجريبي للتحقق من عمل البوت."
                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            // رسالة على console عند تشغيل البوت بنجاح
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    console.log("🤖 Bot started successfully");