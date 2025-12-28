import TelegramBot from "node-telegram-bot-api";

// قراءة التوكن من متغيرات Railway
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN غير موجود");
    process.exit(1);
    }

    // تشغيل البوت
    const bot = new TelegramBot(token, { polling: true });

    // رسالة /start
    bot.onText(/\/start/, (msg) => {
      bot.sendMessage(
          msg.chat.id,
              `🤖 أهلاً بك!

              ✅ البوت يعمل بنجاح
              📊 لوحة التحكم قيد التجهيز
              ⚡ Micro‑Exploits سيتم تفعيلها قريبًا`
                );
                });

                // رسالة /help
                bot.onText(/\/help/, (msg) => {
                  bot.sendMessage(
                      msg.chat.id,
                          `🆘 الأوامر المتاحة:
                          /start - بدء البوت
                          /help - المساعدة
                          /status - حالة البوت`
                            );
                            });

                            // رسالة /status
                            bot.onText(/\/status/, (msg) => {
                              bot.sendMessage(
                                  msg.chat.id,
                                      `📡 الحالة:
                                      🟢 البوت يعمل
                                      ⚙️ Railway متصل
                                      🔐 التوكن آمن`
                                        );
                                        });

                                        // أي رسالة أخرى
                                        bot.on("message", (msg) => {
                                          if (!msg.text.startsWith("/")) {
                                              bot.sendMessage(
                                                    msg.chat.id,
                                                          "ℹ️ استخدم /help لعرض الأوامر"
                                                              );
                                                                }
                                                                });

                                                                console.log("🤖 Bot started successfully");